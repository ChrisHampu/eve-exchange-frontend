export function updateToplist(toplist) {
  return { type: "UPDATE_TOPLIST", toplist };
}

export function updateHourlyChart(chart) {
  return { type: "UPDATE_HOURLY_CHART", chart };
}