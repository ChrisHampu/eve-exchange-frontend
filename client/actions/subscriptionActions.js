export function updateSubscription(id, subscription) {
  return { type: "UPDATE_SUBSCRIPTION", id, subscription };
}