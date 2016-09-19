export function updateUser(user) {
  return { type: "UPDATE_USER", user };
}

export function addPremium() {
  return { type: "ADD_PREMIUM" };
}

export function removePremium() {
  return { type: "REMOVE_PREMIUM" };
}