/*
  Structure
  {
    _id: <guid>,
    time: <timestring>,
    message: <string>,
    user_id: <id>,
    read: <boolean>
  }
*/

export default function notifications(state = [], action) {

  switch(action.type) {

    case "UPDATE_NOTIFICATIONS":
      if (!action.notifications) {
        return state;
      };

      return [ ...action.notifications ];

    default:
      return state;
  }  
}