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
  }
};

export default function auth(state = initialState, action) {

  switch(action.type) {

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

    default:
      return state;
  }  
}