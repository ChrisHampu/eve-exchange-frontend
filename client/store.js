import { createStore, combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import auth from './reducers/authReducer';
import market from './reducers/marketReducer';
import settings from './reducers/settingsReducer';
import subscription from './reducers/subscriptionReducer';
import eveapi from './reducers/eveapiReducer';
import profit from './reducers/profitReducer';
import admin from './reducers/adminReducer';
import portfolios from './reducers/portfoliosReducer';
import sde from './reducers/sdeReducer';
import app from './reducers/appReducer';
import feeds from './reducers/feedsReducer';
import tickers from './reducers/tickersReducer';
import alerts from './reducers/alertsReducer';

const store = createStore(combineReducers({
  auth,
  market,
  settings,
  subscription,
  eveapi,
  profit,
  admin,
  portfolios,
  sde,
  app,
  feeds,
  tickers,
  alerts,
  routing
}), {}, window.devToolsExtension && window.devToolsExtension());

export default store;
