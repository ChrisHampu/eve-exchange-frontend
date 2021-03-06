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

export function updateMarketSetting(setting, value) {
  return { type: "UPDATE_MARKET_SETTING", setting, value };
}

export function updateGuidebookSetting(setting, value) {
  return { type: "UPDATE_GUIDEBOOK_SETTING", setting, value };
}

export function updateForecastSetting(setting, value) {
  return { type: "UPDATE_FORECAST_SETTING", setting, value };
}

export function updateForecastRegionalSetting(setting, value) {
  return { type: "UPDATE_FORECAST_REGIONAL_SETTING", setting, value };
}

export function addTickerWatchlist(ticker) {
  return { type: "ADD_TICKER_WATCHLIST", ticker };
}

export function removeTickerWatchlist(ticker) {
  return { type: "REMOVE_TICKER_WATCHLIST", ticker };
}