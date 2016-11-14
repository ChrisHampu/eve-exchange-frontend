const initialState = {
  userID: null,
  pinned_charts: [],
  eveApiKey: {
    keyID: "",
    vCode: "",
    characterID: "",
    characterName: "",
    expires: null
  },
  market: {
    region: 10000002,
    simulation_broker_fee: 0,
    simulation_sales_tax: 0.75,
    simulation_margin: 0
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
  profiles: []
};

export default function settings(state = initialState, action) {

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

      return { ...state, pinned_charts: { ...state.pinned_charts, [action.item.id]: action.item.name } };

    case "UNPIN_CHART":

      if (!action.id || typeof state.pinned_charts[action.id] === 'undefined') {
        return state;
      }

      let charts = Object.assign({}, state.pinned_charts);
      delete charts[action.id];

      return { ...state, pinned_charts: charts };

    case "UPDATE_API_KEY":

      if (!action.keyInfo) {
        return state;
      }

      let info = action.keyInfo;

      if (!info.keyID || !info.vCode || !info.characterID || !info.characterName) {
        return state;
      }

      return { ...state, eveApiKey: { ...state.eveApiKey, ...info } };

    case "REMOVE_API_KEY":

      return { ...state, eveApiKey: { keyID: "", vCode: "", characterID: "", characterName: "", expires: null } };

    case "UPDATE_CHART_SETTING":

      if (!action.setting) {
        return state;
      }

      if (action.value === 'undefined' || action.value === null) {
        return state;
      }

      return { ...state, chart_visuals: { ...state.chart_visuals, [action.setting]: action.value } };

    case "UPDATE_GENERAL_SETTING":

      if (!action.setting) {
        return state;
      }

      if (action.value === 'undefined' || action.value === null) {
        return state;
      }

      return { ...state, general: { ...state.general, [action.setting]: action.value } };

    case "UPDATE_MARKET_SETTING":

      if (!action.setting) {
        return state;
      }

      if (action.value === 'undefined' || action.value === null) {
        return state;
      }

      return { ...state, market: { ...state.market, [action.setting]: action.value } };

    default:
      return state;
  }  
}