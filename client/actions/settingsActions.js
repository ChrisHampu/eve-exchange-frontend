export function updateUserSettings(id, settings) {
  return { type: "UPDATE_USER_SETTINGS", id, settings };
}

export function pinChartToDashboard(item) {
  return { type: "PIN_CHART", item };
}

export function unPinChartFromDashboard(itemID) {
  return { type: "UNPIN_CHART", id: itemID };
}