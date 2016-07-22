
const initialState = {
  toplist: [],
  chart: {
    hourly: []
  }
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

      return { ...state, chart: { hourly: action.chart } };      

    default:
      return state;
  }  
}