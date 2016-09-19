import { createStore, combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import auth from './reducers/authReducer';
import market from './reducers/marketReducer';
import settings from './reducers/settingsReducer';
import notifications from './reducers/notificationsReducer';
import subscription from './reducers/subscriptionReducer';
import eveapi from './reducers/eveapiReducer';
import profit from './reducers/profitReducer';
import admin from './reducers/adminReducer';
import portfolios from './reducers/portfoliosReducer';
import sde from './reducers/sdeReducer';
import app from './reducers/appReducer';

const store = createStore(combineReducers({
  auth,
  market,
  settings,
  notifications,
  subscription,
  eveapi,
  profit,
  admin,
  portfolios,
  sde,
  app,
  routing
}), {}, window.devToolsExtension && window.devToolsExtension());

export default store;