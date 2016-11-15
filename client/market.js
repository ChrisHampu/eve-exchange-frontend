import store from './store';
import { setAggregateMinuteData, setAggregateHourlyData, setAggregateDailyData, setOrderData } from './actions/marketActions';
import deepstream from './deepstream';
import fuzzy from 'fuzzy';
import { fetchGroups } from './sde';

const subscriptions = {};

fetchGroups();

export function subscribeItem(id) {

  if (subscriptions.hasOwnProperty(id)) {
    return;
  }

  let minuteSubscription = null;
  let hourSubscription = null;
  let orderSubscription = null;
  let dailySubscription = null;

  minuteSubscription = deepstream.record.getRecord(`market_minutes/${id}`);

  minuteSubscription.subscribe(data => {

    // Generate the 'open' data
    // Also
    // Data is ordered specifically to retrieve the newest records from the database
    // But must be reversed into old -> new ordering for displaying on charts

    if (!data) {
      console.log("Error subscribing to aggregates for " + id);
      store.dispatch(setAggregateMinuteData(id, []));
      return;
    }

    store.dispatch(setAggregateMinuteData(id, data));
  });

  hourSubscription = deepstream.record.getRecord(`market_hourly/${id}`);

  hourSubscription.subscribe(data => {

    if (!data) {
      console.log("Error subscribing to aggregates for " + id);
      store.dispatch(setAggregateHourlyData(id, []));
      return;
    }

    store.dispatch(setAggregateHourlyData(id, data));
  });

  dailySubscription = deepstream.record.getRecord(`market_daily/${id}`);

  dailySubscription.subscribe(data => {

    if (!data) {
      console.log("Error subscribing to aggregates for " + id);
      store.dispatch(setAggregateDailyData(id, []));
      return;
    }

    store.dispatch(setAggregateDailyData(id, data));
  });

  orderSubscription = deepstream.record.getRecord(`market_orders/${id}`);

  orderSubscription.subscribe(data => {

    if (!data) {
      console.log("Error subscribing to order data for " + id);
      return;
    }

    store.dispatch(setOrderData(id, data));
  });

  subscriptions[id] = {
    minuteSubscription,
    hourSubscription,
    dailySubscription,
    orderSubscription
  };
}

export function unsubscribeItem(id) {
 
  if (!subscriptions.hasOwnProperty(id)) {
    console.log(`Market subscription for ${id} is already discarded`);
    return;
  }
  subscriptions[id].minuteSubscription.unsubscribe();
  subscriptions[id].hourSubscription.unsubscribe();
  subscriptions[id].dailySubscription.unsubscribe();
  subscriptions[id].orderSubscription.unsubscribe();

  subscriptions[id].minuteSubscription.discard();
  subscriptions[id].hourSubscription.discard();
  subscriptions[id].dailySubscription.discard();
  subscriptions[id].orderSubscription.discard();

  delete subscriptions[id];
}

export function getMarketGroupTree(market_groups, searchText) {

  if (!market_groups) {
    return [];
  }

  if (!searchText || searchText.length === 0) {
    return market_groups;
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

  for (const group of market_groups) {

    const add = [];

    _getGroups(group, searchText, add, _getGroups);

    if (add.length) {
      groups.push(...add);
    }
  }
  
  return groups;
}

export function itemIDToName(market_items, id) {

  if (!market_items) {
    return "Loading";
  }

  let searchID = typeof id === "string" ? parseInt(id) : id;
  let name = "Unknown";

  if (searchID in market_items) {
    return market_items[searchID];
  }

  return name;
}

export function itemNameToID(market_items, name) {

  if (!market_items) {
    return 0;
  }

  const _res = market_items.findIndex(el => el === name);

  if (!_res || _res === -1) {
    return 0;
  }

  return _res;
}

export function getMarketItemNames(market_items) {

  if (!market_items) {
    return [];
  }

  return [...market_items.map(el=>el)];
}