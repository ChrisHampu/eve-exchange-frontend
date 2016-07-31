import Horizon from '../horizon/client/dist/horizon';
import store from './store';
import { updateUser } from './actions/authActions';
import { updateUserSettings } from './actions/settingsActions';
import { updateNotifications } from './actions/notificationsActions';
import { updateSubscription } from './actions/subscriptionActions';
import { updateToplist, updateHourlyChart } from './actions/profitActions';
import 'whatwg-fetch';
import Promise from 'bluebird';
import { parseString } from 'xml2js';
import { pullApiData } from './eveapi';

const parseXml = Promise.promisify(parseString);

let horizon = null;

try {
  horizon = Horizon({ authType: 'token' });
} catch (err) {
  horizon = Horizon({ authType: { type: 'token', storeLocally: true, token: '' }});
}

let userData = null;
let currentSettings = null;
let eveApiPulled = false;

if (hasAuthToken()) {
  horizon("users").fetch().subscribe(()=>{}, ()=>{}, ()=>{});
}

store.subscribe(() => {

  if (store.getState().settings !== currentSettings && store.getState().settings && store.getState().settings.userID) {

    currentSettings = store.getState().settings;

    horizon('user_settings').update(currentSettings);

    if (!eveApiPulled && currentSettings.eveApiKey.keyID.length && currentSettings.eveApiKey.vCode.length) {
      pullApiData(currentSettings.eveApiKey);

      eveApiPulled = true;
    }
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

      user.id = user.user_id || user.info;

      const res = await self.fetch(`https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=${user.id}`);
      const body = await res.text();
      const xml = await parseXml(body);

      if (xml.eveapi.error) {

        resolve(user);
        return;
      }

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

      horizon('user_settings').store({userID: userData.id})

      setTimeout(() => {
      
        horizon('user_settings').find({userID: userData.id}).fetch().defaultIfEmpty().subscribe( _settings => {

          if (_settings !== null) {

            store.dispatch(updateUserSettings(userData.id, _settings));
          }
        });

      }, 1000);
      
    } else {

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
      horizon('subscription').store({userID: userData.id, balance: 0, deposit_history: [], withdrawal_history: [], premium: false});
      return;
    }

    console.log(subscription);

    store.dispatch(updateSubscription(userData.id, subscription));
  });

  // 24 hour profit chart
  horizon('profit_chart').order('time', 'descending').findAll({userID: userData.id, frequency: 'hourly'}).limit(24).watch().defaultIfEmpty().subscribe( profit => {

    if (!profit) {
      return;
    }

    updateHourlyChart(profit);

    console.log(profit);
  });

  horizon('profit_top_items').find({userID: userData.id}).watch().defaultIfEmpty().subscribe( profit => {

    if (!profit) {
      return;
    }

    updateToplist(profit);

    console.log(profit);
  });
}

export default horizon;