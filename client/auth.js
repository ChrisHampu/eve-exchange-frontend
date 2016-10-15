import store from './store';
import { hasAuthToken, deepstreamLogout, deepstreamLogin } from './deepstream';

export const userLevels = {
  "guest": 0,
  "standard": 1,
  "premium": 2,
  "admin": 3
};

export function logout(redirect) {

  if (redirect) {

    return (nextState, transition) => {

      deepstreamLogout();

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
      redirectToLogin(transition);
      
      callback();
      return;
    }

    try {
      deepstreamLogin().then(() => {

        if (!userHasGroup(_requiredAccessLevel)) {

          redirectToLogin(transition);
        }

        callback();
      }).catch((err) => {

        redirectToLogin(transition);
        callback();
      });
    } catch (err) {
      redirectToLogin(transition);
      callback();
    }
  }
}
