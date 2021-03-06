import Deepstream from 'deepstream.io-client-js';
import store from './store';
import { updateAlertSettings, showBrowserAlert } from './alerts';
import { updateUser } from './actions/authActions';
import { updateUserSettings } from './actions/settingsActions';
import { updateSubscription } from './actions/subscriptionActions';
import { setUserOrders } from './actions/marketActions';
import { updateAllSubscriptions, updateLoginLog, updateAuditLog, updateAlertsLog } from './actions/adminActions';
import { updatePortfolios } from './actions/portfoliosActions';
import { updateAllFeeds } from './actions/feedsActions';
import { sendAppNotification } from './actions/./appActions';
import { updateTickers } from './actions/tickersActions';
import { updateAlerts } from './actions/alertActions';
import { updateToplist, updateHourlyChart, updateDailyChart, updateAlltimeStats, updateTransactions, updateAssets } from './actions/profitActions';
import 'whatwg-fetch';
import xml2js from 'xml-json-parser';

const deepstream = Deepstream('wss://eve.exchange');
const token_name = 'token';
let subscribed = false;
let subscriptions = [];
let connected = false;

function parseQuery(str) {
  if (typeof str !== 'string') {
    return {};
  }

  const str2 = str.trim().replace(/^(\?|#|&)/, '');

  if (!str2) {
    return {};
  }

  return str2.split('&').reduce((ret, param) => {
    const parts = param.replace(/\+/g, ' ').split('=');
    // Firefox (pre 40) decodes `%3D` to `=`
    // https://github.com/sindresorhus/query-string/pull/37
    const key = parts.shift();
    const val = parts.length > 0 ? parts.join('=') : undefined;

    const key2 = decodeURIComponent(key);

    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    const val2 = val === undefined ? null : decodeURIComponent(val);

    if (!ret.hasOwnProperty(key2)) {
      ret[key2] = val2;
    } else if (Array.isArray(ret[key2])) {
      ret[key2].push(val2);
    } else {
      ret[key2] = [ ret[key2], val2 ];
    }

    return ret;
  }, {});
}

export function setAuthToken(token) {
  window.localStorage.setItem(token_name, token);
}

export function removeAuthToken() {

  window.localStorage.removeItem(token_name);
}

function isAuthExpired(token) {

  if (!token) {
    return true;
  }

  const meta = JSON.parse(atob(token.split('.')[1]));
  const exp = meta.exp;
  const now = new Date().getTime() / 1000;

  if (now > exp) {
    return true;
  }

  return false;
}

export function getAuthToken() {

  const token = window.localStorage.getItem(token_name);

  if (token && isAuthExpired(token)) {
    removeAuthToken();
    return null;
  }

  return token;
}

export function hasAuthToken() {
  const token = getAuthToken();
  if (!token) {
    return false;
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

  try {
    deepstream.record.getRecord(`settings/${user_info.user_id}`).subscribe(data => {

      const isLoaded = store.getState().settings.initialLoad;

      store.dispatch(updateUserSettings(user_info.user_id, data));

      if (!isLoaded && store.getState().settings.initialLoad) {
        updateAlertSettings();
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

    deepstream.record.getRecord(`subscription/${user_info.user_id}`).subscribe(data => {

      store.dispatch(updateSubscription(user_info.user_id, data));
    });

    deepstream.record.getRecord(`user_orders/${user_info.user_id}`).subscribe(orders => {

      if (!orders) {
        return;
      }

      store.dispatch(setUserOrders(orders));
    });

    deepstream.record.getRecord(`user_assets/${user_info.user_id}`).subscribe(assets => {

      if (!assets) {
        return;
      }

      store.dispatch(updateAssets(assets));
    });

    deepstream.record.getRecord(`portfolios/${user_info.user_id}`).subscribe(portfolios => {

      if (!portfolios) {
        store.dispatch(updatePortfolios([]));
        return;
      }

      store.dispatch(updatePortfolios(portfolios));
    });

    deepstream.record.getRecord(`feeds/${user_info.user_id}`).subscribe(feeds => {

      store.dispatch(updateAllFeeds(feeds));
    });

    deepstream.record.getRecord('tickers').subscribe(tickers => {

      store.dispatch(updateTickers(tickers));
    });

    deepstream.record.getRecord(`alerts/${user_info.user_id}`).subscribe(alerts => {

      store.dispatch(updateAlerts(alerts));
    });

    deepstream.event.subscribe(`show_alert/${user_info.user_id}`, showBrowserAlert);

  } catch (err) {
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

  deepstream.record.getRecord('admin/alerts_log').subscribe(log => {

    if (!log) {
      return;
    }

    store.dispatch(updateAlertsLog(log));
  });
}

async function fetchAPIData(user_id) {

  const data = {
    corporation: ''
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

      store.dispatch(sendAppNotification("Authorization token has expired. Please refresh and sign in with SSO again", 5000000000));

      reject('No auth token');
      return;
    }

    deepstream.login({ token }, (success, user_data) => {
      
      if (!success) {

        store.dispatch(sendAppNotification("There's a problem authorizing with the server. Try refreshing in a few moments", 5000));

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
  });
}

export function deepstreamLogout() {

  removeAuthToken();

  if (connected) {
    deepstream.close();
    connected = false;
  }
}

setAuthTokenFromQuery();

let notifyError = false;

deepstream.on('connectionStateChanged', (state) => {

  if (state === 'OPEN') {

    if (notifyError === true) {

      store.dispatch(sendAppNotification("Connection to server restored, but application has likely updated and requires refreshing", 5000));
      notifyError = false;
    }
  } else if (state === 'ERROR') {

    if (notifyError === false) {
      store.dispatch(sendAppNotification("Connection to server lost or application has updated. Please refresh the page in a few moments", 5000));
      notifyError = true;
    }
  }
});

let errorNotified = false;

deepstream.on('error', (err, event) => {

  if (!errorNotified && event === 'connectionError') {
    store.dispatch(sendAppNotification("There's a problem connecting to the server. Please refresh the page in a few moments", 5000));
    errorNotified = true;
  }
});

export default deepstream;

export function isConnected() {

  return connected;
}
