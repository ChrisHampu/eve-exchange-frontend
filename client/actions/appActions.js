export function sendAppNotification(notification) {
  return { type: "APP_SET_NOTIFICATION", notification };
}