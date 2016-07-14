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

      if (!action.item || typeof state.pinned_charts[action.item.id] !== 'undefined') {
        return state;
      }

      return { ...state, pinned_charts: { ...state.pinned_charts, [action.item.id]: action.item.name } };

    case "UNPIN_CHART":

      if (!action.id || typeof state.pinned_charts[action.item.id] === 'undefined') {
        return state;
      }

      return { ...state, pinned_charts: { ...state.pinned_charts, [action.item.id]: undefined } };

    default:
      return state;
  }  
}