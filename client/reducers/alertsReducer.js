
const initialState = {
  list: [],
  log: []
};

export default function alerts(state = initialState, action) {

  switch (action.type) {

    case 'UPDATE_ALERTS':
      if (!action.alerts) {
        return state;
      }

      return action.alerts;

    default:
      return state;
  }
}
