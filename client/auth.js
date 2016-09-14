import store from './store';
import { hasAuthToken, getCurrentUser, clearAuthToken } from './horizon';

export const userLevels = {
  "guest": 0,
  "standard": 1,
  "premium": 2,
  "admin": 3
};

export function logout(redirect) {

  if (redirect) {

    return (nextState, transition) => {

      clearAuthToken();

      redirectToRoot(transition);
      return;
    }
  }
}

export function isLoggedIn() {

  return hasAuthToken();
}

// Return true if current user has the specified access group
export function userHasGroup(group) {

  return store.getState().auth.groups.indexOf(group) !== -1;
}

export function userHasPremium() {

  return store.getState().subscription.premium === true;
}

// Routing functions
function redirectToLogin(transition) {
  transition({
    pathname: '/login'
  });
}

function redirectToRoot(transition) {
  transition({
    pathname: '/'
  });
}

export function redirectIfAuthed() {

  return (nextState, transition) => {

    if (hasAuthToken()) {

      redirectToRoot(transition);
      return;
    }
  }
}

export function requireAccess(requiredAccessLevel) {

  const _requiredAccessLevel = requiredAccessLevel;

  return (nextState, transition, callback) => {

    if (!hasAuthToken()) {
      console.log("Auth token missing");
      redirectToLogin(transition);
      
      callback();
    }

    getCurrentUser().then(() => {

      if (!userHasGroup(_requiredAccessLevel)) {

        console.log("Permission denied");
        redirectToLogin(transition);
      }

      callback();
    });
  }
}
