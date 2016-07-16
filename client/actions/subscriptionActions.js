export function updateSubscription(id, subscription) {
  return { type: "UPDATE_SUBSCRIPTION", id, subscription };
}

export function performPremiumUpgrade() {
  return { type: "UPGRADE_PREMIUM" };
}

export function performPremiumDowngrade() {
  return { type: "DOWNGRADE_PREMIUM" };
}

export function performWithdrawal(amount) {
  return { type: "PERFORM_WITHDRAWAL", amount };
}