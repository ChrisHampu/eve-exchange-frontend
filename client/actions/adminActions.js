export function updateAllSubscriptions(subs) {
  return { type: "UPDATE_ALL_SUBSCRIPTIONS", subs };
}

export function updateLoginLog(log) {
  return { type: "UPDATE_LOGIN_LOG", log };
}