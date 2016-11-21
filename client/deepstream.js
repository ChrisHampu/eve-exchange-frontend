import Deepstream from 'deepstream.io-client-js';
import store from './store';
import { updateUser } from './actions/authActions';
import { updateUserSettings } from './actions/settingsActions';
import { updateNotifications } from './actions/notificationsActions';
import { updateSubscription } from './actions/subscriptionActions';
import { setUserOrders } from './actions/marketActions';
import { updateAllSubscriptions, updateLoginLog, updateAuditLog } from './actions/adminActions';
import { updatePortfolios } from './actions/portfoliosActions';
import { sendAppNotification } from './actions/./appActions';
import { updateToplist, updateHourlyChart, updateDailyChart, updateAlltimeStats, updateTransactions } from './actions/profitActions';
import 'whatwg-fetch';
import xml2js from 'xml-json-parser';
import { pullApiData } from './eveapi';

const deepstream = Deepstream();
const token_name = 'token';
let subscribed = false;
let subscriptions = [];
let user_data = null;
let connected = false;

function parseQuery(str) {
  if (typeof str !== 'string') {
    return {}
  }

  const str2 = str.trim().replace(/^(\?|#|&)/, '')

  if (!str2) {
    return {}
  }

  return str2.split('&').reduce((ret, param) => {
    const parts = param.replace(/\+/g, ' ').split('=')
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    const key = parts.shift()
    const val = parts.length > 0 ? parts.join('=') : undefined

    const key2 = decodeURIComponent(key)

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    const val2 = val === undefined ? null : decodeURIComponent(val)

    if (!ret.hasOwnProperty(key2)) {
      ret[key2] = val2
    } else if (Array.isArray(ret[key2])) {
      ret[key2].push(val2)
    } else {
      ret[key2] = [ ret[key2], val2 ]
    }

    return ret
  }, {})
}

export function setAuthToken(token) {
  window.localStorage.setItem(token_name, token);
}

export function getAuthToken() {

  const token = window.localStorage.getItem(token_name);

  if (token && isAuthExpired(token)) {
    removeAuthToken();
    return null;
  }

  return token;
}

export function removeAuthToken() {

  window.localStorage.removeItem(token_name);
}

function isAuthExpired(token) {

  if (!token) {
    return true;
  }

  const meta = JSON.parse(atob(token.split('.')[1]))
  const exp = meta.exp
  const now = new Date().getTime() / 1000

  if (now > exp) {
    return true;
  }

  return false;
}

export function hasAuthToken() {
  const token = getAuthToken();
  if (!token) {
    return false
  }
  return true;
}

function setAuthTokenFromQuery() {
  const data = parseQuery(window.location.search);

  if (data.token) {
    setAuthToken(data.token);
  }
}

function setDeepstreamSubscriptions(user_info) {

  if (subscribed) {
    return;
  }

  let currentSettings = null;

  try {
    deepstream.record.getRecord(`settings/${user_info.user_id}`).subscribe(data => {

      currentSettings = data;
      store.dispatch(updateUserSettings(user_info.user_id, data));
    });

    store.subscribe(() => {
   
      if (store.getState().settings !== currentSettings && store.getState().settings && store.getState().settings.userID) { 

        // Publish new settings to deepstream
        deepstream.event.emit(`settings/${user_info.user_id}`, store.getState().settings);
        currentSettings = store.getState().settings;
      }
    });

    deepstream.record.getRecord(`profit_transactions/${user_info.user_id}`).subscribe(transactions => {

      if (!transactions) {
        return;
      }

      store.dispatch(updateTransactions(transactions));
    });

    deepstream.record.getRecord(`profit_alltime/${user_info.user_id}`).subscribe(stats => {

      if (!stats) {
        return;
      }

      store.dispatch(updateAlltimeStats(stats));
    });

    deepstream.record.getRecord(`profit_top_items/${user_info.user_id}`).subscribe(profit => {

      if (!profit) {
        store.dispatch(updateToplist({items: []}));
        return;
      }

      store.dispatch(updateToplist(profit));
    });

    deepstream.record.getRecord(`profit_chart/${user_info.user_id}`).subscribe(profit => {

      if (!profit || !profit.length) {

        store.dispatch(updateHourlyChart([]));
        store.dispatch(updateDailyChart([]));
        return;
      }

      const hourly = profit.filter(doc => doc.frequency === "hourly");
      const daily = profit.filter(doc => doc.frequency === "daily");

      store.dispatch(updateHourlyChart(hourly));
      store.dispatch(updateDailyChart(daily));
    });

    deepstream.record.getRecord(`notifications/${user_info.user_id}`).subscribe(data => {

      if (!data || data.length === 0 || !Array.isArray(data)) {
        store.dispatch(updateNotifications([]));
        return;
      }

      store.dispatch(updateNotifications(data.sort((el1, el2) => new Date(el2.time) - new Date(el1.time))));
    });

    deepstream.record.getRecord(`subscription/${user_info.user_id}`).subscribe(data => {

      store.dispatch(updateSubscription(user_info.user_id, data));
    });

    deepstream.record.getRecord(`user_orders/${user_info.user_id}`).subscribe(orders => {

      if (!orders) {
        return;
      }

      store.dispatch(setUserOrders(orders));
    });

    deepstream.record.getRecord(`portfolios/${user_info.user_id}`).subscribe(portfolios => {

      if (!portfolios) {
        store.dispatch(updatePortfolios([]));
        return;
      }

      store.dispatch(updatePortfolios(portfolios));
    });
  } catch(err) {
    console.log("There was an error while subscribing to user data", err);
  }

  subscribed = true;
}

function setDeepstreamAdminSubscriptions() { 
 
  deepstream.record.getRecord('admin_subscriptions').subscribe(subs => {

    if (!subs) {
      return;
    }

    store.dispatch(updateAllSubscriptions(subs)); 
  });

  deepstream.record.getRecord('admin/login_log').subscribe(log => {

    if (!log) {
      return;
    }

    store.dispatch(updateLoginLog(log)); 
  });

  deepstream.record.getRecord('admin/audit_log').subscribe(log => {

    if (!log) {
      return;
    }

    store.dispatch(updateAuditLog(log)); 
  });
}

async function fetchAPIData(user_id) {

  let data = {
    corporation: ""
  };

  const res = await self.fetch(`https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=${user_id}`);
  const body = await res.text();
  const xml = new xml2js().xml_str2json(body);

  if (xml.eveapi.error) {

    return;
  }

  const info = xml.eveapi.result;

  data.corporation = info.corporation;

  store.dispatch(updateUser(data));
}

export async function deepstreamLogin() {

  return new Promise((resolve, reject) => {
    if (connected) {
      resolve();
      return;
    }

    const token = getAuthToken();

    if (!token) {

      // TODO: What do if no token?
      reject("No auth token");
      return;
    }

    deepstream.login({token}, function(success, user_data) {
      
      if (!success) {

        // TODO: What do if error?
        reject("Failed to login to deepstream");
        return;
      }

      connected = true;

      store.dispatch(updateUser(user_data));

      // Load extra data from EVE API
      fetchAPIData(user_data.user_id);

      // Set subscriptions upon first connection
      setDeepstreamSubscriptions(user_data);

      // Set admin level subscriptions
      if (user_data.admin === true) {
        setDeepstreamAdminSubscriptions();
      }

      resolve();
    });
  })
}

export function deepstreamLogout() {

  removeAuthToken();

  if (connected) {
    deepstream.close();
    connected = false;
  }
}

setAuthTokenFromQuery();

deepstream.on('connectionStateChanged', (state) => {

  if (state === 'OPEN' && user_data) {

    // TODO: Re-connection success notification
  }
});

deepstream.on('error', (err, event, topic) => {

  // TODO: Send client notification

  console.log(err, event, topic);
});

export default deepstream;

export function isConnected() {

  return connected;
}