import store from './store';
import { setAggregateData } from './actions/marketActions';
import horizon from './horizon';

const subscriptions = [];

function watchPredicate(data) {

	console.log(data);
}

export function subscribeItem(id, region) {

	const idx = subscriptions.findIndex((el) => {

		return el.id === id && el.region === region;
	});

	if (idx === -1) {

		console.log("Subscribing to " + id);

		const query = {
			type: parseInt(id)
		};

		subscriptions.push({
			id: id,
			region: region,
			subscriber: horizon('aggregates').order("time", 'descending').findAll(query).limit(20).watch().subscribe(data => {

				// Generate the 'open' data
				// Also
				// Data is ordered specifically to retrieve the newest records from the database
				// But must be reversed into old -> new ordering for displaying on charts

				const sorted = data.sort((a, b) => a.time - b.time).map((el, i, arr) => {
					return { ...el, open: i > 0 ? arr[i-1].close : el.close, spread: Math.max(0, el.spread) }
				});
				
				store.dispatch(setAggregateData(id, sorted));
			})
		});
	};
}

export function unsubscribeItem(id, region) {
 
	const idx = subscriptions.findIndex((el) => {

		return el.id === id && el.region === region;
	});

	if (idx !== -1) {

		subscriptions[idx].subscriber.unsubscribe();
		subscriptions.splice(idx, 1);
	}
}