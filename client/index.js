import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import '../node_modules/react-mdl/extra/material.js';
import Root from './components/Root/RootContainer';
import store from './store';

const rootNode = document.createElement('div');
rootNode.style.cssText = "height: 100%; min-height: 100%";
document.body.appendChild(rootNode);

ReactDOM.render(
  <Root store={store} history={syncHistoryWithStore(browserHistory, store)} />,
  rootNode
);