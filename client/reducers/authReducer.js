
export default function auth(state = { groups: ["guest"] }, action) {

  switch(action.type) {
    case "UPDATE_USER":
      groups = ["guest"];
      if (action.user.groups.indexOf("authenticated") !== -1) {
        groups.push("user");
      }
      if (action.user.groups.indexOf("admin") !== -1) {
        groups.push("admin");
      }
      return { ...state, groups: groups, id: action.user.id };
    default:
      return state;
  }  
}