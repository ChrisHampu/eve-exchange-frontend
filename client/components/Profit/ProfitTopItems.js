/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';

import cx from 'classnames';

class ProfitComponent extends React.Component {

  render() {
    return (
      <DashboardPage title="Profit Report">

      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { profit: store.profit };
}

export default connect(mapStateToProps)(ProfitComponent);