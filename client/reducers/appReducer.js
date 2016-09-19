const initialState = {

  notification: {
    message: null,
    duration: 3000
  }
};

export default function auth(state = initialState, action) {

  switch(action.type) {

    case "APP_SET_NOTIFICATION":
      if (!action.notification) {
        return state;
      }

      return { ...state, notification: { message: action.notification, duration: action.duration || 3000 } };

    default:
      return state;
  }  
}