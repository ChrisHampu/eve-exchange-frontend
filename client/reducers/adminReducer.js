
const initialState = {

  subscriptions: [],
  login_log: [],
  audit_log: []
};

/*
  audit_log: [{
    user_id: number,
    target: number or user_id,
    action: enum,
    balance: number
    time: date
  }]

  action: {
    0: deposit by admin,
    1: withdrawal by admin,
    2: subscribed,
    3: unsubscribed,
    4: renewed,
    5: created portfolio <target id>,
    6: deleted portfolio <target id>,
    7: added api key <target>,
    8: deleted api key <target>,
    9: subscription expired,
    10: withdrawal request,
    11: new account,
    12: enable api,
    13: disable api,
    14: api expired,
    15: api renewed
  }
*/

export default function auth(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_ALL_SUBSCRIPTIONS":
      if (!action.subs) {
        return state;
      }

      return { ...state, subscriptions: action.subs };

    case "UPDATE_LOGIN_LOG":
      if (!action.log) {
        return state;
      }

      return { ...state, login_log: action.log };

    case "UPDATE_AUDIT_LOG":
      if (!action.log) {
        return state;
      }

      return { ...state, audit_log: action.log };

    default:
      return state;
  }  
}