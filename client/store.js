import { createStore, combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import auth from './reducers/authReducer';
import market from './reducers/marketReducer';
import settings from './reducers/settingsReducer';

const store = createStore(combineReducers({
  auth,
  market,
  settings,
  routing
}), {}, window.devToolsExtension && window.devToolsExtension());

export default store;