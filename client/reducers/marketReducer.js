/*
{
  market: {
    user_orders: [],
    region: {
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

{
  item: { -> type id
    minutes: { -> region
      [data]
    }
  }
}

{
  item:
}

item[29668].region[10000002].minutes

*/

function extractAggregateRegions(data) {

  const regions = {};

  for (let i = 0; i < data.length; i++) {

    const record = data[i];

    const time = new Date(record.time);

    for (let j = 0; j < record.regions.length; j++) {

      const region = record.regions[j];

      if (!regions.hasOwnProperty(region.region)) {
        regions[region.region] = [];
      }

      region.time = time;

      regions[region.region].push(region);
    }
  }

  Object.keys(regions).forEach(region => {

    regions[region] = regions[region].sort((el1, el2) => el2.time - el1.time);
  });

  return regions;
}

function extractOrderRegions(data) {

  const regions = {};

  for (let i = 0; i < data.length; i++) {

    const order = data[i];

    if (!regions.hasOwnProperty(order.region)) {
      regions[order.region] = [];
    }

    order.time = new Date(order.time)

    regions[order.region].push(order);
  }

  return regions;
}

export default function market(state = { user_orders: [], item: {} }, action) {

  let payload = {};

  switch(action.type) {

    case "SET_AGGREGATE_MINUTE_DATA":
      if (!action.data || !action.id) {
        return state;
      }

      payload = extractAggregateRegions(action.data);

      if (!state.item.hasOwnProperty(action.id)) {
        return { ...state, item: { [action.id]: { minutes: payload } } };
      }

      return { ...state, item: { ...state.item, [action.id]: { ...state.item[action.id], minutes: payload } } };

    case "SET_AGGREGATE_HOURLY_DATA":
      if (!action.data || !action.id) {
        return state;
      }

      payload = extractAggregateRegions(action.data);

      if (!state.item.hasOwnProperty(action.id)) {
        return { ...state, item: { [action.id]: { hours: payload } } };
      }

      return { ...state, item: { ...state.item, [action.id]: { ...state.item[action.id], hours: payload } } };

    case "SET_AGGREGATE_DAILY_DATA":
      if (!action.data || !action.id) {
        return state;
      }

      payload = extractAggregateRegions(action.data);

      if (!state.item.hasOwnProperty(action.id)) {
        return { ...state, item: { [action.id]: { daily: payload } } };
      }

      return { ...state, item: { ...state.item, [action.id]: { ...state.item[action.id], daily: payload } } };

    case "SET_ORDER_DATA":
      if (!action.data || !action.id) {
        return state;
      }

      let payload = extractOrderRegions(action.data);

      if (!state.item.hasOwnProperty(action.id)) {
        return { ...state, item: { [action.id]: { orders: payload } } };
      }

      return { ...state, item: { ...state.item, [action.id]: { ...state.item[action.id], orders: payload } } };

    case "SET_USER_ORDERS":
      if (!action.orders || !Array.isArray(action.orders)) {
        return state;
      }

      return { ...state, user_orders: action.orders };

    default:
      return state;
  }  
}