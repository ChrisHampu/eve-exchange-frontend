import store from './store';
import { setAggregateMinuteData, setAggregateHourlyData, setAggregateDailyData, setOrderData } from './actions/marketActions';
import deepstream from './deepstream';
//import fuzzy from 'fuzzy';

const sde = store.getState().sde;

const subscriptions = {};

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

export function marketItemFilter(searchText, key) {
  return key.toLowerCase().match(searchText);
}

export function getMarketGroupTree(searchText) {

  if (!searchText || searchText.length === 0) {
    return sde.market_groups;
  }

  const _searchText = new RegExp(searchText.toLowerCase());

  const _getGroups = (group, searchText, accumulator, functor) => {

    if (group.items && group.items.length) {

      const items = group.items.filter(el => marketItemFilter(_searchText, el.name));

      if (items.length) {

        accumulator.push({...group, items: items});
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

  for (const group of sde.market_groups) {

    const add = [];

    _getGroups(group, searchText, add, _getGroups);

    if (add.length) {
      groups.push(...add);
    }
  }
  
  return groups;
}

export function itemIDToName(id) {

  let searchID = typeof id === "string" ? parseInt(id) : id;

  if (sde.market_items[searchID] !== 'undefined') {
    return sde.market_items[searchID];
  }

  return "Unknown";
}

export function itemNameToID(name) {

  const _res = Object.keys(sde.market_items).find(key => sde.market_items[key] === name);

  if (!_res || _res === -1) {
    return 0;
  }

  return _res;
}

export function getMarketItemNames() {

  return Object.values(sde.market_items);
}

export function getMarketItemNamesSorted() {
  return Object.values(sde.market_items).sort((el1, el2) => el1.length - el2.length);
}

export function _doSimulateTrade(type, quantity, data, settings, region, interval, strategy, margin_type, sales_tax, broker_fee, margin, wanted_margin, overhead) {

  if (Object.keys(data[type][interval]).indexOf(region) === -1) {
    return {
      buy: 0,
      sell: 0,
      tax: 0,
      broker: 0,
      overhead: 0,
      profit: 0
    };
  }

  const accessor = data[type][interval][region][ data[type][interval][region].length - 1 ];
  const orders = data[type].orders[region];

  let buy_price = 0;
  let sell_price = 0;

  if (strategy === 0) { // undercut/overcut orders

    buy_price = Math.max(...orders.filter(el=>el.buy === true).map(el=>el.price));
    sell_price = Math.min(...orders.filter(el=>el.buy === false).map(el=>el.price));

  } else { // use percentiles

    buy_price = accessor.buyPercentile;
    sell_price = accessor.sellPercentile;
  }

  buy_price = buy_price * quantity;
  sell_price = sell_price * quantity;

  if (margin > 0) {

    if (margin_type === 0) { // Exact value

      buy_price = buy_price + margin;
      sell_price = sell_price - margin;

    } else { // Percentage

      buy_price = buy_price + buy_price * margin / 100;
      sell_price = sell_price - sell_price * margin / 100;
    }
  }

  const broker = broker_fee > 0 ? buy_price * broker_fee / 100 : 0;
  const tax = sales_tax > 0 ? sell_price * sales_tax / 100 : 0;

  let profit = sell_price - buy_price - tax - broker;

  if (overhead && overhead > 0) {
    profit -= overhead;
  }

  if (wanted_margin && wanted_margin > 0) {

    const multiplier = wanted_margin / 100; // Get profit %

    const wanted_profit = (buy_price + tax + broker + overhead) * multiplier;

    profit = wanted_profit;
    sell_price = buy_price + wanted_profit;
  }

  return {
    buy: buy_price,
    sell: sell_price,
    tax,
    broker,
    overhead: overhead || 0,
    profit: profit
  };
}

export function simulateTrade(type, quantity, data, settings, region) {

  let result = {};

  if (!data[type] || data[type] === 'undefined') {
    return null;
  }

  let interval = 'hours';

  if (settings.premium) {
    interval = 'minutes';
  }

  if (!data[type][interval] || data[type][interval] === 'undefined') {
    return null;
  }

  if (!data[type].orders || data[type].orders === 'undefined') {
    return null;
  }

  // All simulation user settings
  const strategy = settings.market.simulation_strategy || 0;
  const margin_type = settings.market.simulation_margin_type || 0;
  const sales_tax = settings.market.simulation_sales_tax || 0;
  const broker_fee = settings.market.simulation_broker_fee || 0;
  const margin = settings.market.simulation_margin || 0;
  const wanted_margin = settings.market.simulation_wanted_profit || 0;
  const overhead = settings.market.simulation_overhead || 0;

  // If region is given, perform a single trade for that region. Otherwise simulate every region
  let regions = region ? {[region]:0} : data[type][interval];

  Object.keys(regions).forEach(region => {

    try {
      result[region] = _doSimulateTrade(type, quantity, data, settings, region, interval, strategy, margin_type, sales_tax, broker_fee, margin, wanted_margin, overhead);
    } catch(err) {
      console.log(err);
    }
  });

  return result;
}

export function getPaginatedData(data, pageSize, scrollPercent) {

  if (!data) {
    return [];
  }

  if (data.length === 0) {
    return data;
  }

  const sorted = data.sort((el1, el2) => el2.time - el1.time);

  if (sorted.length > 0 && sorted.length < pageSize) {
    return sorted;
  }

  if (!scrollPercent) {
    const d = sorted.slice(Math.max(0, sorted.length - pageSize), sorted.length);

    return d;
  }

  const slice = Math.floor(sorted.length * scrollPercent);

  return sorted.slice(sorted.length - slice, Math.min(Math.max(sorted.length - slice + pageSize, 0), sorted.length));
}
