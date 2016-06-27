import 'babel-polyfill';
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

  return async (nextState, transition) => {

    //redirectToLogin(transition);

    if (!hasAuthToken()) {
      console.log("no token");
      redirectToLogin(transition);
      return;
    }

    await getCurrentUser().then(() => {

      console.log(store.getState());
      console.log(requiredAccessLevel);
      console.log(store.getState().auth.groups.indexOf(requiredAccessLevel) );

      if (!userHasGroup(requiredAccessLeve1)) {

        console.log("No required access level");
        redirectToLogin(transition);
        return;
      }
    });
  }
}
