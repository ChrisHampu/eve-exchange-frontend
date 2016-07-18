import Horizon from '@horizon/client';
import store from './store';
import { updateUser } from './actions/authActions';
import { updateUserSettings } from './actions/settingsActions';
import { updateNotifications } from './actions/notificationsActions';
import { updateSubscription } from './actions/SubscriptionActions';
import 'whatwg-fetch';
import Promise from 'bluebird';
import { parseString } from 'xml2js';

const parseXml = Promise.promisify(parseString);

const horizon = Horizon({ authType: { type: 'token', storeLocally: true }});
let userData = null;
let currentSettings = null;

if (hasAuthToken()) {
  horizon("users").fetch().subscribe(()=>{}, ()=>{}, ()=>{});
}

store.subscribe(() => {

  if (store.getState().settings !== currentSettings && store.getState().settings.userID) {

    currentSettings = store.getState().settings;
    console.log("saving settings");
    console.log(currentSettings);

    horizon('user_settings').replace(currentSettings);
  }
});

export function clearAuthToken() {

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

      doHorizonSubscriptions();

      resolve(user);
    }, 
    err => { console.log(err); reject(err) },
    () => {}
    );

    return;
	});
}

function doHorizonSubscriptions() {

  horizon('user_settings').find({userID: userData.id}).fetch().defaultIfEmpty().subscribe( settings => {

    if (settings === null) {

      // Create empty settings if the user has no settings already
      horizon('user_settings').store({userID: userData.id});
    } else {

      console.log(settings);

      store.dispatch(updateUserSettings(userData.id, settings));
    }
  });

  horizon('notifications').findAll({userID: userData.id}).watch().defaultIfEmpty().subscribe( notifications => {

    if (!notifications) {
      return;
    }

    console.log(notifications);

    store.dispatch(updateNotifications(notifications.sort((el1, el2) => el2.time - el1.time)));
  });

  horizon('subscription').find({userID: userData.id}).watch().defaultIfEmpty().subscribe( subscription => {

    if (!subscription) {
      horizon('subscription').store({userID: userData.id, balance: 0, deposit_history: [], withdrawal_history: [], level: 0});
      return;
    }

    console.log(subscription);

    store.dispatch(updateSubscription(userData.id, subscription));
  });
}

export default horizon;