import React from 'react';
import { Provider } from 'react-redux';
import Route from '../../routes/Route';
//import DevTools from './DevTools'
import { Router } from 'react-router';

export default class Root extends React.Component {

  static propTypes = {
    store: React.PropTypes.object.isRequired,
    history: React.PropTypes.object.isRequired
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

