const initialState = {

  notification: null
};

export default function auth(state = initialState, action) {

  switch(action.type) {

    case "APP_SET_NOTIFICATION":
      if (!action.notification) {
        return state;
      }

      return { ...state, notification: action.notification };

    default:
      return state;
  }  
}