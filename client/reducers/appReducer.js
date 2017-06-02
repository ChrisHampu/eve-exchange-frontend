const initialState = {

  notification: {
    message: null,
    duration: 3000
  },
  fullscreen: {
    visual_type: 0,
    props: {
      item: {
        id: 29668,
        name: "Plex"
      }
    }
  },
  charts: {
    focusIndex: null
  }
};

export default function auth(state = initialState, action) {

  switch (action.type) {

    case "APP_SET_NOTIFICATION":
      if (!action.notification) {
        return state;
      }

      return { ...state, notification: { message: action.notification, duration: action.duration || 3000 } };

    case "APP_ENTER_FULLSCREEN":
      if (!action.visual_type) {
        return state;
      }

      return { ...state, fullscreen: { visual_type: action.visual_type, props: action.props || {} } };

    case "APP_EXIT_FULLSCREEN":

      return { ...state, fullscreen: { visual_type: 0, props: {} } };

    case "RESET_CHART_STATE":

      return { ...state, charts: { ...state.charts, focusedIndex: null } };

    case "SET_CHART_FOCUS":

      return { ...state, charts: { ...state.charts, focusIndex: action.index } };

    default:
      return state;
  }
}
