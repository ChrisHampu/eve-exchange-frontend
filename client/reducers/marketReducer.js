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

    case "SET_AGGREGATE_DATA":
      if (!action.data || !action.id) {
        return state;
      }

      if ( typeof state.region[0] === 'undefined' || state.region[0].item.length === 0) {

        return { ...state, region: { ...state.region, 0: { item: { [action.id]: { aggregates: action.data } } } } };
      }

      if ( typeof state.region[0].item[action.id] === 'undefined') {

        return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { orders: [], aggregates: action.data } }}  } };
      }

      /*
        Deprecated since the open value is no longer needed until OHLC is re-implemented
        const sorted = data.sort((a, b) => a.time - b.time).map((el, i, arr) => {
          return { ...el, open: i > 0 ? arr[i-1].close : el.close, spread: Math.max(0, el.spread) }
        });
        */

      return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { ...state.region[0].item[action.id], aggregates: action.data } }}  } };

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