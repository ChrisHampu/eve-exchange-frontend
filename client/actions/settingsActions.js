export function updateUserSettings(id, settings) {
  return { type: "UPDATE_USER_SETTINGS", id, settings };
}

export function pinChartToDashboard(item) {
  return { type: "PIN_CHART", item };
}

export function unPinChartFromDashboard(itemID) {
  return { type: "UNPIN_CHART", id: itemID };
}

export function updateApiKey(keyInfo) {
  return { type: "UPDATE_API_KEY", keyInfo };
}

export function removeApiKey() {
  return { type: "REMOVE_API_KEY" };
}

export function updateChartSetting(setting, value) {
  return { type: "UPDATE_CHART_SETTING", setting, value };
}

export function updateGeneralSetting(setting, value) {
  return { type: "UPDATE_GENERAL_SETTING", setting, value };
}