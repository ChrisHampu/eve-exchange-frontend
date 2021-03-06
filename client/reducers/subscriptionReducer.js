const initialState = {
  user_id: null,
  balance: 0,
  history: [],
  premium: false,
  subscription_date: null
};

/* history structure
{
  time: Date,
  type: 0: Deposit 1: Withdrawal,
  amount: number,
  description: string,
  processed: boolean
}
*/

export default function subscription(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_SUBSCRIPTION":
      if (!action.subscription) {
        return state;
      }

      return { ...state, ...action.subscription, userID: action.id };

    default:
      return state;
  }  
}