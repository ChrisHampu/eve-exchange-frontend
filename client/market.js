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
			subscriber: horizon('aggregates').order("time").findAll(query).watch().subscribe(data => {

				store.dispatch(setAggregateData(id, data));
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