export function updateUserSettings(id, settings) {
  return { type: "UPDATE_USER_SETTINGS", id, settings };
}

export function pinChartToDashboard(itemID) {
  return { type: "PIN_CHART", id: itemID };
}

export function unPinChartFromDashboard(itemID) {
  return { type: "UNPIN_CHART", id: itemID };
}