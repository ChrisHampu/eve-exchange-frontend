import { createStore, combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import authReducer from './reducers/authReducer';

const store = createStore(combineReducers({
  auth: authReducer,
  routing
}), {});

export default store;