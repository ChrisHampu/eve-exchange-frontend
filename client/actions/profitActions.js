export function updateToplist(toplist) {
  return { type: "UPDATE_TOPLIST", toplist };
}

export function updateHourlyChart(chart) {
  return { type: "UPDATE_HOURLY_CHART", chart };
}

export function updateDailyChart(chart) {
  return { type: "UPDATE_DAILY_CHART", chart };
}

export function updateAlltimeStats(stats) {
  return { type: "UPDATE_ALLTIME_STATS", stats };
}

export function updateTransactions(transactions) {
  return { type: "UPDATE_TRANSACTIONS", transactions };
}

export function updateAssets(assets) {
  return { type: "UPDATE_ASSETS", assets };
}