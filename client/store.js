import { createStore, combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import auth from './reducers/authReducer';
import market from './reducers/marketReducer';
import settings from './reducers/settingsReducer';
import notifications from './reducers/notificationsReducer';
import subscription from './reducers/subscriptionReducer';

const store = createStore(combineReducers({
  auth,
  market,
  settings,
  notifications,
  subscription,
  routing
}), {}, window.devToolsExtension && window.devToolsExtension());

export default store;