
const initialState = {
  groups: ["standard"],
  id: null,
  name: "",
  corporation: ""
};

export default function auth(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_USER":
      if (!action.user) {
        return state;
      }

      let id = action.user.user_id || state.id;
      let groups = state.groups;
      let name = action.user.user_name || state.name;
      let corporation = action.user.corporation || state.corporation;

      if (action.user.premium !== undefined || action.user.admin !== undefined) {
        groups = ["standard"];

        if (action.user.premium === true) {
          groups.push("premium");
        }

        if (action.user.admin === true) {
          groups.push("admin");
        }
      }

      return { ...state, groups: groups, id: id, name: name, corporation: corporation };

    case "ADD_PREMIUM":

      if (state.groups.indexOf("premium") !== -1) {
        return state;
      }

      return { ...state, groups: [ ...state.groups, "premium" ] };

    case "REMOVE_PREMIUM":

      if (state.groups.indexOf("premium") === -1) {
        return state;
      }

      return { ...state, groups: state.groups.map(el => el === "premium" ? null : el) };

    default:
      return state;
  }  
}