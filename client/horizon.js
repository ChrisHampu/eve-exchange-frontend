import Horizon from '@horizon/client';
import store from './store';
import { updateUser } from './actions/authActions';

const horizon = Horizon({ authType: { type: 'token', storeLocally: true }});
let userData = null;

if (hasAuthToken()) {
  horizon("users").fetch().subscribe(()=>{}, ()=>{}, ()=>{});
}

export function clearAuthToken() {

  console.log("clearing");
  if (window && window.localStorage !== undefined) {
    window.localStorage.removeItem('horizon-jwt');
  }

  Horizon.clearAuthTokens();
}

export function hasAuthToken() {

	return horizon.hasAuthToken();
}

export function getAuthEndpoint() {
	return new Promise((resolve, reject) => {
		horizon.authEndpoint('eve_sso').subscribe((endpoint) => {
      	resolve(endpoint);
    	});
	});
}

export function getCurrentUser() {
	return new Promise((resolve, reject) => {

		if (!hasAuthToken()) {
			resolve({});
			return;
		}

    if (userData) {
      resolve(userData);
      return;
    }

    horizon.currentUser().fetch().subscribe( user => {
      userData = user;
      store.dispatch(updateUser(userData));
      resolve(user);
    }, 
    err => { console.log(err); reject(err) },
    () => {}
    );

    return;
	});
}

export default horizon;