export function sendAppNotification(notification, duration = 3000) {
  return { type: "APP_SET_NOTIFICATION", notification, duration };
}