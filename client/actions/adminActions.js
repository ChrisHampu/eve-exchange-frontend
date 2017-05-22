export function updateAllSubscriptions(subs) {
  return { type: "UPDATE_ALL_SUBSCRIPTIONS", subs };
}

export function updateLoginLog(log) {
  return { type: "UPDATE_LOGIN_LOG", log };
}

export function updateAuditLog(log) {
  return { type: "UPDATE_AUDIT_LOG", log };
}

export function updateAlertsLog(log) {
  return { type: "UPDATE_ALERTS_LOG", log };
}
