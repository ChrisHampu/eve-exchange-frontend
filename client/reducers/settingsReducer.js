import 'whatwg-fetch';
import { APIEndpointURL } from '../globals';
import { getAuthToken } from '../deepstream';
import store from '../store';
import { sendAppNotification } from '../actions/appActions';

const initialState = {
  premium: false,
  pinned_charts: [],
  market: {
    region: 10000002,
    default_tab: 0,
    default_timespan: 0,
    simulation_broker_fee: 0,
    simulation_sales_tax: 0,
    simulation_margin: 0,
    simulation_strategy: 0,
    simulation_margin_type: 0,
    simulation_overhead: 0,
    simulation_wanted_profit: 0
  },
  general: {
    auto_renew: true
  },
  chart_visuals: {
    price: true,
    spread: true,
    spread_sma: true,
    volume: true,
    volume_sma: true
  },
  profiles: [],
  guidebook: { // 'guidebook page key': boolean - whether to show (true) or not (false, dismissed)
    disable: false, // disable all guidebook pages globally
    profiles: true,
    market_browser: true,
    forecast: true,
    portfolios: true,
    subscription: true
  },
  forecast: {
    min_buy: 5000000,
    max_buy: 75000000,
    min_spread: 10,
    max_spread: 20,
    min_volume: 50,
    max_volume: 200
  },
  forecast_regional: {
    max_volume: 100000,
    max_price: 1000000000,
    start_region: 10000043,
    end_region: 10000002
  }
};

async function saveSettings(settings) {

  if (!settings) {
    return;
  }

  const settings_saved = await fetch(`${APIEndpointURL}/settings/save`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Token ${getAuthToken()}`
    },
    body: JSON.stringify({ ...settings, profiles: null })
  });

  const settings_resp = await settings_saved.json();

  store.dispatch(sendAppNotification(settings_resp.error || settings_resp.message || "New settings have been applied", 1000));
}

export default function settings(state = initialState, action) {

  let newSettings = null;

  switch(action.type) {

    case "UPDATE_USER_SETTINGS":
      if (!action.settings) {
        return { ...state, userID: action.id };
      }

      return { ...state, ...action.settings, userID: action.id };

    case "PIN_CHART":

      if (!action.item || typeof state.pinned_charts[action.item.id] !== 'undefined') {
        return state;
      }

      newSettings = { ...state, pinned_charts: { ...state.pinned_charts, [action.item.id]: action.item.name } }

      saveSettings(newSettings);

      return newSettings;

    case "UNPIN_CHART":

      if (!action.id || typeof state.pinned_charts[action.id] === 'undefined') {
        return state;
      }

      let charts = Object.assign({}, state.pinned_charts);
      delete charts[action.id];

      newSettings = { ...state, pinned_charts: charts }

      saveSettings(newSettings);

      return newSettings;

    case "UPDATE_CHART_SETTING":

      if (!action.setting) {
        return state;
      }

      if (action.value === 'undefined' || action.value === null) {
        return state;
      }

      newSettings = { ...state, chart_visuals: { ...state.chart_visuals, [action.setting]: action.value } }

      saveSettings(newSettings);

      return newSettings;

    case "UPDATE_GENERAL_SETTING":

      if (!action.setting) {
        return state;
      }

      if (action.value === 'undefined' || action.value === null) {
        return state;
      }

      newSettings = { ...state, general: { ...state.general, [action.setting]: action.value } }

      saveSettings(newSettings);

      return newSettings;

    case "UPDATE_MARKET_SETTING":

      if (!action.setting) {
        return state;
      }

      if (action.value === 'undefined' || action.value === null) {
        return state;
      }

      newSettings = { ...state, market: { ...state.market, [action.setting]: action.value } }

      saveSettings(newSettings);

      return newSettings;

    case "UPDATE_GUIDEBOOK_SETTING":

      if (!action.setting) {
        return state;
      }

      if (action.value === 'undefined' || action.value === null) {
        return state;
      }

      newSettings = { ...state, guidebook: { ...state.guidebook, [action.setting]: action.value } }

      saveSettings(newSettings);

      return newSettings;

    case "UPDATE_FORECAST_SETTING":

      if (!action.setting) {
        return state;
      }

      if (action.value === 'undefined' || action.value === null) {
        return state;
      }

      newSettings = { ...state, forecast: { ...state.forecast, [action.setting]: action.value } }

      saveSettings(newSettings);

      return newSettings;

    case "UPDATE_FORECAST_REGIONAL_SETTING":

      if (!action.setting) {
        return state;
      }

      if (action.value === 'undefined' || action.value === null) {
        return state;
      }

      newSettings = { ...state, forecast_regional: { ...state.forecast_regional, [action.setting]: action.value } }

      saveSettings(newSettings);

      return newSettings;

    default:
      return state;
  }  
}