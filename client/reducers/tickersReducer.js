const initialState = {
  list: [],
  categories: {
    0: 'ships',
    1: 'modules',
    2: 'industry'
  }
};

export default function tickers(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_TICKERS":
      if (!action.tickers) {
        return state;
      }

      return { ...state, list: action.tickers };

    default:
      return state;
  }  
}