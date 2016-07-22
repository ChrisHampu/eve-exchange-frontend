/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import s from './ProfitComponent.scss';
import cx from 'classnames';

class ProfitComponent extends React.Component {

  render() {
    return (
      <DashboardPage title="Profit Report" className={s.root}>

      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { profit: store.profit };
}

export default connect(mapStateToProps)(ProfitComponent);