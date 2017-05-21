
export default function alerts(state = [], action) {

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
