export function sendAppNotification(notification, duration = 3000) {
  return { type: "APP_SET_NOTIFICATION", notification, duration };
}

export function appEnterFullscreen(visual_type, props = {}) {
  return { type: "APP_ENTER_FULLSCREEN", visual_type, props };
}

export function appExitFullscreen() {
  return { type: "APP_EXIT_FULLSCREEN" };
}