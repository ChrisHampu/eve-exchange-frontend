const initialState = {
  changelog: [],
  notifications: []
};

/*

changelog:
{
  message: string,
  time: date,
  id: bson id,
  poster: string (char name)
}

notifications:
{
  _id: <guid>,
  time: <timestring>,
  message: <string>,
  user_id: <id>,
  read: <boolean>
}

*/

export default function feeds(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_ALL_FEEDS":
      if (!action.feeds) {
        return state;
      };

      return { ...state, ...action.feeds };

    default:
      return state;
  }  
}