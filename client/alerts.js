import store from './store';
import { setBrowserNotificationPermission } from './actions/alertActions';

export function updateAlertSettings(forceAsk) {

  const state = store.getState();

  if ('Notification' in window) {

    if (forceAsk || Notification.permission !== 'granted' && state.settings.alerts.canShowBrowserNotification) {

      Notification.requestPermission(permission => {

        store.dispatch(setBrowserNotificationPermission(permission === 'granted'));
      });
    }
  }
}

export function showBrowserAlert(message) {

  const state = store.getState();

  if (!state.settings.alerts.canShowBrowserNotification) {
    return;
  }

  new Notification('EVE Exchange', {
    body: message,
    //icon: 'https://eve.exchange/assets/img/eve-x-logo.png'
  });
}
