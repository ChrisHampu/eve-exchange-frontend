const initialState = {
  balance: null
};

export default function subscription(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_EVEAPI":
      if (!action.eveapi) {
        return state;
      }

      return { ...state, ...action.eveapi };

    default:
      return state;
  }  
}