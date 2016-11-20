
const initialState = {

  subscriptions: [],
  login_log: []
};

export default function auth(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_ALL_SUBSCRIPTIONS":
      if (!action.subs) {
        return state;
      }

      return { ...state, subscriptions: action.subs };

    case "UPDATE_LOGIN_LOG":
      if (!action.log) {
        return state;
      }

      return { ...state, login_log: action.log };

    default:
      return state;
  }  
}