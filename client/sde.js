import 'whatwg-fetch';
import store from './store';
import { updateMarketGroups, updateBlueprints } from './actions/sdeActions';

let market_groups = null;
let blueprints = null;

export async function fetchGroups() {

  if (market_groups) {
    return;
  }

  const res = await fetch(`http://api.evetradeforecaster.com/sde/marketgroups`, {method: 'get'});
  const body = await res.json();

  market_groups = body;

  store.dispatch(updateMarketGroups(market_groups));

  return market_groups;
}

export async function fetchBlueprints() {

  if (blueprints) {
    return;
  }

  const res = await fetch(`http://api.evetradeforecaster.com/sde/blueprints`, {method: 'get'});
  const body = await res.json();

  blueprints = body;

  store.dispatch(updateBlueprints(blueprints));

  return blueprints;
}