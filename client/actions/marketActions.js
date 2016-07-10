export function setAggregateData(item, data) {

  return {type: "SET_AGGREGATE_DATA", id: item, data };
}

export function setOrderData(item, data) {

  return { type: "SET_ORDER_DATA", id: item, data };
}