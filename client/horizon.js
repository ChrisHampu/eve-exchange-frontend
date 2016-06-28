import Horizon from '@horizon/client';
import store from './store';
import { updateUser } from './actions/authActions';
import 'whatwg-fetch';
import Promise from 'bluebird';
import { parseString } from 'xml2js';

const parseXml = Promise.promisify(parseString);

const horizon = Horizon({ authType: { type: 'token', storeLocally: true }});
let userData = null;

if (hasAuthToken()) {
  horizon("users").fetch().subscribe(()=>{}, ()=>{}, ()=>{});
  horizon("users_auth").fetch().subscribe(()=>{}, ()=>{}, ()=>{});
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

    horizon.currentUser().fetch().subscribe( async (user) => {

      user.id = user.info;

      const res = await self.fetch(`https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=${user.id}`);
      const body = await res.text();
      const xml = await parseXml(body);

      const info = xml.eveapi.result[0];

      user.corporation = info.corporation[0];
      user.name = info.characterName[0];

      userData = user;
      store.dispatch(updateUser(user));

      resolve(user);
    }, 
    err => { console.log(err); reject(err) },
    () => {}
    );

    return;
	});
}

export default horizon;