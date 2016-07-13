const initialState = {
  userID: null,
  pinned_charts: []
};

export default function settings(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_USER_SETTINGS":
      if (!action.settings) {
        return state;
      }

      return { ...state, ...action.settings, userID: action.id };

    case "PIN_CHART":

    console.log(action);

      if (!action.id || state.pinned_charts.indexOf(action.id) !== -1) {
        return state;
      }

      return { ...state, pinned_charts: [...state.pinned_charts, action.id ] };

    case "UNPIN_CHART":

    console.log(action);

      if (!action.id || state.pinned_charts.indexOf(action.id) === -1) {
        return state;
      }

      return { ...state, pinned_charts: [...state.pinned_charts.filter(el => el !== action.id)] };

    default:
      return state;
  }  
}