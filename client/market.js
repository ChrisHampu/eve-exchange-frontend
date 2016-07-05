import store from './store';
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

		subscriptions.push({
			id: id,
			region: region,
			subscriber: horizon('market').findAll({item: id/*, region: region*/}).watch().subscribe(watchPredicate)
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