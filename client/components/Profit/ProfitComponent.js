/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import ProfitChart from './ProfitChart';
import cx from 'classnames';

class ProfitComponent extends React.Component {

  render() {

    return (
      <DashboardPage title="Profit Report" fullWidth={true}>
        <DashboardPageMenu menu={{
          'Chart': "/dashboard/profit",
          'Transactions': "/dashboard/profit/transactions",
          'Top Items': "/dashboard/profit/topitems",
          'Top Profiles': "/dashboard/profit/profiles",
          'All Time': "/dashboard/profit/alltime"}}
          location={this.props.location}
        />
        <DashboardPageBody children={this.props.children} defaultComponent={<ProfitChart style={{flex: 1, width: "100%"}}/>} />
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { profit: store.profit };
}

export default connect(mapStateToProps)(ProfitComponent);