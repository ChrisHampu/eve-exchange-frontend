const initialState = {
  market_groups: null,
  market_items: null,
  blueprints: null,
  stationid2name: {
    60003760: 'Jita IV - Moon 4 - Caldari Navy Assembly Plant',
    60008494: "Amarr VIII (Oris) - Emperor Family Academy",
    60004588: "Rens VI - Moon 8 - Brutor Tribe Treasury",
    60011866: "Dodixie IX - Moon 20 - Federation Navy Assembly Plant",
    60005686: "Hek VIII - Moon 12 - Boundless Creation Factory"
  }
};

export default function settings(state = initialState, action) {

  switch(action.type) {

    case "UPDATE_MARKET_GROUPS":
      if (!action.market_groups) {
        return { ...state };
      }

      const market_items = [];

      const _getGroups = (group, _market_items) => {

        if (group.items) {
          for (var i = 0; i < group.items.length; i++) {

            _market_items[group.items[i].id] = group.items[i].name;
          }
        }

        for (const _group of group.childGroups) {

          _getGroups(_group, _market_items);
        }
      };

      for (const group in action.market_groups) {

        _getGroups(action.market_groups[group], market_items);
      }

      return { ...state, market_groups: action.market_groups, market_items };

    case "UPDATE_BLUEPRINTS":
      if (!action.blueprints) {
        return { ...state };
      }

      return { ...state, blueprints: action.blueprints };

    default:
      return state;
  }  
}