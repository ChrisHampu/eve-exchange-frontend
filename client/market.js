import store from './store';
import { setAggregateMinuteData, setAggregateHourlyData, setAggregateDailyData, setOrderData } from './actions/marketActions';
import horizon from './horizon';
import fuzzy from 'fuzzy';
import marketGroups from './sde/market_groups'

const subscriptions = [];

export function subscribeItem(id, region) {

  const idx = subscriptions.findIndex((el) => {

    return el.id === id && el.region === region;
  });

  if (idx === -1) {

    console.log("Subscribing to " + id);

    let minuteSubscription = null;
    let hourSubscription = null;
    let orderSubscription = null;
    let dailySubscription = null;

    try {
      minuteSubscription = horizon('aggregates').order('time', 'descending').findAll({type: parseInt(id)}).limit(2016).watch().defaultIfEmpty().subscribe(data => {

        // Generate the 'open' data
        // Also
        // Data is ordered specifically to retrieve the newest records from the database
        // But must be reversed into old -> new ordering for displaying on charts

        if (!data) {
          console.log("Error subscribing to aggregates for " + id);
          return;
        }

        store.dispatch(setAggregateMinuteData(id, data));
      });

        hourSubscription = horizon('aggregates_hourly').order('time', 'descending').findAll({type: parseInt(id)}).limit(168).watch().defaultIfEmpty().subscribe(data => {

        if (!data) {
          console.log("Error subscribing to aggregates for " + id);
          return;
        }

        store.dispatch(setAggregateHourlyData(id, data));
      });

        dailySubscription = horizon('aggregates_daily').order('time', 'descending').findAll({type: parseInt(id)}).watch().defaultIfEmpty().subscribe(data => {

        if (!data) {
          console.log("Error subscribing to aggregates for " + id);
          return;
        }

        store.dispatch(setAggregateDailyData(id, data));
        });
    } catch(e) {
      console.log(e);
    }

    try {
      orderSubscription = horizon('orders').order('price', 'descending').findAll({type: parseInt(id)}).watch().defaultIfEmpty().subscribe(data => {

        if (!data) {
          console.log("Error subscribing to order data for " + id);
          return;
        }

        store.dispatch(setOrderData(id, data));
      })
    } catch(e) {
      
      console.log(e)
    }

    subscriptions.push({
      id,
      region,
      minuteSubscription,
      hourSubscription,
      dailySubscription,
      orderSubscription
    });
  };
}

export function unsubscribeItem(id, region) {
 
  const idx = subscriptions.findIndex((el) => {

    return el.id === id && el.region === region;
  });

  if (idx !== -1) {

    subscriptions[idx].minuteSubscription.unsubscribe();
    subscriptions[idx].hourSubscription.unsubscribe();
    subscriptions[idx].dailySubscription.unsubscribe();
    subscriptions[idx].orderSubscription.unsubscribe();
    subscriptions.splice(idx, 1);
  }
}

export function getMarketGroupTree(searchText) {

  if (!searchText || searchText.length === 0) {
    return marketGroups;
  }

  const _getGroups = (group, searchText, accumulator, functor) => {

    if (group.items && group.items.length) {

      const items = fuzzy.filter(searchText, group.items, { extract: item => item.name });

      if (items.length) {

        const _items = items.map((el) => {
          return group.items[el.index]
        });

        accumulator.push({...group, items: _items});
      }

      return;
    }

    const children = [];

    for (const child of group.childGroups) {

      functor(child, searchText, children, functor);
    }

    if (children.length) {
      accumulator.push({...group, childGroups: children});
    }
  }

  const groups = [];

  for (const group of marketGroups) {

    const add = [];

    _getGroups(group, searchText, add, _getGroups);

    if (add.length) {
      groups.push(...add);
    }
  }
  
  return groups;
}

export function itemIDToName(id) {

  let searchID = typeof id === "string" ? id : id.toString();
  let name = "";

  const _itemIDToName = (group, id, functor) => {

    if (group.items && group.items.length) {

      for (const item of group.items) {

        if (item.id === id) {
          name = item.name;
          return;
        }
      }
    }

    for (const child of group.childGroups) {

      functor(child, id, functor);
    }
  }

  for (const group of marketGroups) {

    _itemIDToName(group, searchID, _itemIDToName);
  }

  return name;
}

export function itemNameToID(name) {

  let searchName = name;
  let foundID = 0;

  const _itemNameToID = (group, name, functor) => {

    if (group.items && group.items.length) {

      for (const item of group.items) {

        if (item.name === name) {
          foundID = item.id;
          return;
        }
      }
    }

    for (const child of group.childGroups) {

      functor(child, name, functor);
    }
  }

  for (const group of marketGroups) {

    _itemNameToID(group, searchName, _itemNameToID);
  }

  return foundID;
}

export function getMarketItemNames() {

  const names = [];

  const _getItemName = (group, names, functor) => {

    if (group.items && group.items.length) {

      for (var i in group.items) {

        names.push(group.items[i].name);
      }
    }

    for (const child of group.childGroups) {

      functor(child, names, functor);
    }
  }

  for (const group of marketGroups) {

    _getItemName(group, names, _getItemName);
  }

  return names;
}