export function setBrowserNotificationPermission(permission) {
  return { type: 'SET_SHOW_BROWSER_PERMISSION', permission };
}

export function setMailNotificationPermission(permission) {
  return { type: 'SET_SEND_EVEMAIL_PERMISSION', permission };
}

export function updateAlerts(alerts) {
  return { type: 'UPDATE_ALERTS', alerts };
}
