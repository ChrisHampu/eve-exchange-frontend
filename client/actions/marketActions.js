export function setAggregateData(item, data) {

  return {type: "SET_AGGREGATE_DATA", id: item, data };
}

export function deleteAggregateData(item) {

  return { type: "DELETE_AGGREGATE_DATA", id: item };
}