export function setAggregateMinuteData(item, data) {

  return {type: "SET_AGGREGATE_MINUTE_DATA", id: item, data };
}

export function setAggregateHourlyData(item, data) {

  return {type: "SET_AGGREGATE_HOURLY_DATA", id: item, data };
}

export function setAggregateDailyData(item, data) {

  return {type: "SET_AGGREGATE_DAILY_DATA", id: item, data };
}

export function setOrderData(item, data) {

  return { type: "SET_ORDER_DATA", id: item, data };
}

export function setUserOrders(orders) {

  return { type: "SET_USER_ORDERS", orders };
}