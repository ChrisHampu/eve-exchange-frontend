/*
{
  market: {
    region: [
      {
        id: 0,
        item: [
          {
            id: 0,
            aggregates: [data]
            orders: [data]
          }
        ]
      }
    ]
  }
}
*/

export default function market(state = { region: {} }, action) {

  switch(action.type) {

    case "SET_AGGREGATE_MINUTE_DATA":
      if (!action.data || !action.id) {
        return state;
      }

      if ( typeof state.region[0] === 'undefined' || state.region[0].item.length === 0) {

        return { ...state, region: { ...state.region, 0: { item: { [action.id]: { minutes: action.data } } } } };
      }

      if ( typeof state.region[0].item[action.id] === 'undefined') {

        return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { orders: [], minutes: action.data } }}  } };
      }

      return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { ...state.region[0].item[action.id], minutes: action.data } }}  } };

    case "SET_AGGREGATE_HOURLY_DATA":
      if (!action.data || !action.id) {
        return state;
      }

      if ( typeof state.region[0] === 'undefined' || state.region[0].item.length === 0) {

        return { ...state, region: { ...state.region, 0: { item: { [action.id]: { hours: action.data } } } } };
      }

      if ( typeof state.region[0].item[action.id] === 'undefined') {

        return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { orders: [], hours: action.data } }}  } };
      }

      return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { ...state.region[0].item[action.id], hours: action.data } }}  } };

    case "SET_AGGREGATE_DAILY_DATA":
      if (!action.data || !action.id) {
        return state;
      }

      if ( typeof state.region[0] === 'undefined' || state.region[0].item.length === 0) {

        return { ...state, region: { ...state.region, 0: { item: { [action.id]: { daily: action.data } } } } };
      }

      if ( typeof state.region[0].item[action.id] === 'undefined') {

        return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { orders: [], daily: action.data } }}  } };
      }

      return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { ...state.region[0].item[action.id], daily: action.data } }}  } };

    case "SET_ORDER_DATA":
      if (!action.data || !action.id) {
        return state;
      }

      if ( typeof state.region[0] === 'undefined' || state.region[0].item.length === 0) {

        return { ...state, region: { ...state.region, 0: { item: { [action.id]: { orders: action.data } } } } };
      }

      if ( typeof state.region[0].item[action.id] === 'undefined') {

        return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { aggregates: [], orders: action.data } }}  } };
      }

      return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { ...state.region[0].item[action.id], orders: action.data } }}  } };

    default:
      return state;
  }  
}