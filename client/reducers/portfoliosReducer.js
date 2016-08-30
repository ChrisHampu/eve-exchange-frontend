

/* portfolios structure
[
  {
    time: Date, // Date created
    portfolioID: number, // unique portfolio ID
    name: string, // Portfolio name
    type: number, // 0: trading, 1: industry
    description: string,
    components: [
      {
        typeID: number,
        quantity: number
      }
    ]
    hourlyChart: [], // Same as market data
    dailyChart: [] // Same as market data,
    efficiency: number // Material efficiency %,
    currentValue: number,
    averageSpread: number,
    industryQuantity: number // Number of item manufactured by component materials for use in industry
  }
]
*/

export default function subscription(state = [], action) {

  switch(action.type) {

    case "UPDATE_PORTFOLIOS":
      if (!action.portfolios) {
        return state;
      }

      return action.portfolios;

    default:
      return state;
  }  
}