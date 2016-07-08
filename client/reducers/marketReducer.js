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

      //state.region[0].item[action.id].aggregates = action.data;

      // why
      //return { ...state, region: [ ...state.region, [0]: { item: [ ...state.region[0].item, [action.id]: { ...state.region[0].item[action.id], aggregates: data } ] } ] };

      if ( typeof state.region[0] === 'undefined' || state.region[0].item.length === 0) {

        return { ...state, region: { ...state.region, 0: { item: { [action.id]: { aggregates: action.data } } } } };
      }

      if ( typeof state.region[0].item[action.id] === 'undefined') {

        return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { aggregates: action.data } }}  } };
      }

      return { ...state, region: { ...state.region, 0: { item: { ...state.region[0].item, [action.id]: { ...state.region[0].item[action.id], aggregates: action.data } }}  } };

    case "DELETE_AGGREGATE_DATA":
      if (!action.id) {
        return state;
      }

      state.region[0].item[action.id].aggregates = [];

      return state;
    default:
      return state;
  }  
}