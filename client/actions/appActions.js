export function sendAppNotification(notification, duration = 3000) {
  return { type: "APP_SET_NOTIFICATION", notification, duration };
}

export function appEnterFullscreen(visual_type, props = {}) {
  return { type: "APP_ENTER_FULLSCREEN", visual_type, props };
}

export function appExitFullscreen() {
  return { type: "APP_EXIT_FULLSCREEN" };
}

export function resetChartState() {
  return { type: "RESET_CHART_STATE" };
}

export function setChartFocus(index) {
  return { type: "SET_CHART_FOCUS", index };
}
