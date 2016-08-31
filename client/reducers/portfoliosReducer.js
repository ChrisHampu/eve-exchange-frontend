
const initialState = {

  all: [],
  componentData: {}
}

/* portfolio structure
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
*/

export default function subscription(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_PORTFOLIOS":
      if (!action.portfolios) {
        return state;
      }

      return { ...state, all: action.portfolios };

    case "UPDATE_COMPONENT_DATA_SINGLE":
      if (!action.typeID || !action.data) {
        return state;
      }

      return { ...state, componentData: { ...state.componentData, [action.typeID]: action.data } };

    default:
      return state;
  }  
}