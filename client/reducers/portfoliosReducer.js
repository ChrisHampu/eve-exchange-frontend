
const initialState = {

  all: null,
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
      if (!action.portfolios || !Array.isArray(action.portfolios)) {
        return state;
      }

      // Fix all of the timestamps in each portfolio
      return {
        ...state,
        all: action.portfolios.map(el => {

          let hourly = el.hourlyChart;

          for (var i = 0; i < el.hourlyChart.length; i++) {
            if (!el.hourlyChart[i]) {
              continue;
            }
            hourly[i].time = new Date(el.hourlyChart[i].time);
          }

          let daily = el.dailyChart;

          for (var i = 0; i < el.dailyChart.length; i++) {
            if (!el.dailyChart[i]) {
              continue;
            }
            daily[i].time = new Date(el.dailyChart[i].time);
          }

          return  { 
            ...el, 
            hourlyChart: hourly,
            dailyChart: daily
          }
        })
      };

    case "UPDATE_COMPONENT_DATA_SINGLE":
      if (!action.typeID || !action.data) {
        return state;
      }

      return { ...state, componentData: { ...state.componentData, [action.typeID]: action.data } };

    default:
      return state;
  }  
}