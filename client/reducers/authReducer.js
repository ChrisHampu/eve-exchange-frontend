
export default function auth(state = { groups: ["guest"], id: null, name: "", corporation: "" }, action) {

  switch(action.type) {

    case "UPDATE_USER":
      if (!action.user) {
        return state;
      }

      let id = action.user.id || state.id;
      let groups = state.groups;
      let name = action.user.name || state.name;
      let corporation = action.user.corporation || state.corporation;

      if (action.user.groups) {

        groups = ["guest"];
        if (action.user.groups.indexOf("authenticated") !== -1) {
          groups.push("standard");
        }
        if (action.user.groups.indexOf("admin") !== -1) {
          groups.push("admin");
        }
      }

      return { ...state, groups: groups, id: id, name: name, corporation: corporation };
    default:
      return state;
  }  
}