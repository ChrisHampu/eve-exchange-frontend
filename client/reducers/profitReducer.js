
const initialState = {
  toplist: [],
  chart: {
    hourly: null,
    daily: null
  },
  stats: {
    alltime: {
      broker: 0,
      taxes: 0,
      profit: 0
    },
    day: {
      broker: 0,
      taxes: 0,
      profit: 0
    },
    week: {
      broker: 0,
      taxes: 0,
      profit: 0
    },
    month: {
      broker: 0,
      taxes: 0,
      profit: 0
    },
    biannual: {
      broker: 0,
      taxes: 0,
      profit: 0
    }
  },
  transactions: []
};

export default function profit(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_TOPLIST":
      if (!action.toplist) {
        return state;
      }

      return { ...state, toplist: action.toplist };

    case "UPDATE_HOURLY_CHART":
      if (!action.chart) {
        return state;
      }

      return { ...state, chart: { ...state.chart, hourly: action.chart } };

    case "UPDATE_DAILY_CHART":
      if (!action.chart) {
        return state;
      }

      return { ...state, chart: { ...state.chart, daily: action.chart } };

    case "UPDATE_ALLTIME_STATS":
      if (!action.stats) {
        return state;
      }

      return { ...state, stats: action.stats };

    case "UPDATE_TRANSACTIONS":
      if (!action.transactions) {
        return state;
      }

      return { ...state, transactions: action.transactions };

    default:
      return state;
  }  
}