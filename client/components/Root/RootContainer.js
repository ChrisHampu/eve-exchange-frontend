import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import Route from '../../routes/Route';
//import DevTools from './DevTools'
import { Router } from 'react-router'

export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const { store, history } = this.props
    return (
      <Provider store={store}>
        <Router history={history} routes={Route} />
      </Provider>
    )
  }
};

