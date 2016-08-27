
const initialState = {

  subscriptions: []
};

export default function auth(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_ALL_SUBSCRIPTIONS":
      if (!action.subs) {
        return state;
      }

      return { ...state, subscriptions: action.subs };

    default:
      return state;
  }  
}