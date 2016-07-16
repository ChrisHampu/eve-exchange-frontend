/*
  Structure
  {
    id: <guid>,
    time: <timestring>,
    message: <string>,
    userID: <id>,
    read: <boolean>
  }
*/

export default function notifications(state = [], action) {

  switch(action.type) {

    case "UPDATE_NOTIFICATIONS":
      if (!action.notifications) {
        return state;
      }

      if (action.notifications.length) {
        return [ ...action.notifications ];
      } else {
        return [ action.notifications ];
      }

    default:
      return state;
  }  
}