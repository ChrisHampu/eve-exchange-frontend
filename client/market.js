import store from './store';
import { setAggregateData, setOrderData } from './actions/marketActions';
import horizon from './horizon';
import marketGroups from './sde/market_groups'

const subscriptions = [];

export function subscribeItem(id, region) {

	const idx = subscriptions.findIndex((el) => {

		return el.id === id && el.region === region;
	});

	if (idx === -1) {

		console.log("Subscribing to " + id);

		subscriptions.push({
			id: id,
			region: region,
			aggregateSubscription: horizon('aggregates').order('time', 'descending').findAll({type: parseInt(id)}).limit(20).watch().subscribe(data => {

				// Generate the 'open' data
				// Also
				// Data is ordered specifically to retrieve the newest records from the database
				// But must be reversed into old -> new ordering for displaying on charts

				const sorted = data.sort((a, b) => a.time - b.time).map((el, i, arr) => {
					return { ...el, open: i > 0 ? arr[i-1].close : el.close, spread: Math.max(0, el.spread) }
				});
				
				store.dispatch(setAggregateData(id, sorted));
			}),
			orderSubscription: horizon('orders').order('price', 'descending').findAll({type: parseInt(id)}).watch().subscribe(data => {

				store.dispatch(setOrderData(id, data));
			})
		});
	};
}

export function unsubscribeItem(id, region) {
 
	const idx = subscriptions.findIndex((el) => {

		return el.id === id && el.region === region;
	});

	if (idx !== -1) {

		subscriptions[idx].aggregateSubscription.unsubscribe();
		subscriptions[idx].orderSubscription.unsubscribe();
		subscriptions.splice(idx, 1);
	}
}

function _getGroups(group, searchText, accumulator) {

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

    _getGroups(child, children);
  }

  if (children.length) {
    accumulator.push({...group, childGroups: children});
  }
}

export function getMarketGroupTree(searchText) {

  if (!searchText || searchText.length === 0) {
    return marketGroups;
  }

  const groups = [];

  for (const group of marketGroups) {

    const add = [];

    _getGroups(group, searchText, add);

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