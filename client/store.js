import { createStore, combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import auth from './reducers/authReducer';
import market from './reducers/marketReducer';

const store = createStore(combineReducers({
  auth,
  market,
  routing
}), {}, window.devToolsExtension && window.devToolsExtension());

export default store;