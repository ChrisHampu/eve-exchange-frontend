export function updatePortfolios(portfolios) {
  return { type: "UPDATE_PORTFOLIOS", portfolios };
}

export function updateComponentDataSingle(typeID, data) {
  return { type: "UPDATE_COMPONENT_DATA_SINGLE", typeID, data };
}