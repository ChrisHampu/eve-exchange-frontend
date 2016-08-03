const initialState = {
  userID: null,
  balance: 0,
  history: [],
  premium: false,
  expires: null
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

const PremiumPrice = 125000000;

export default function subscription(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_SUBSCRIPTION":
      if (!action.subscription) {
        return state;
      }

      return { ...state, ...action.subscription, userID: action.id };

    case "UPGRADE_PREMIUM":

      return { ...state, premium: true, balance: state.balance - PremiumPrice };

    case "DOWNGRADE_PREMIUM":

      return { ...state, premium: false };

    case "PERFORM_WITHDRAWAL":
      if (!action.amount || action.amount < 1 || action.amount > state.balance) {
        return state;
      }

      return { ...state, balance: state.balance - action.amount };

    default:
      return state;
  }  
}