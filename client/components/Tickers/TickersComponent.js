/* eslint-disable global-require */
import React from 'react';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import TickerList from './TickerList';
import cx from 'classnames';

export default class TickersComponent extends React.Component {

  render() {

    return (
      <DashboardPage title="Tickers" fullWidth={true}>
        <DashboardPageMenu menu={{
            'All': "/dashboard/tickers/all",
            'Watch List': "/dashboard/tickers/watchlist",
            'Analysis': "/dashboard/tickers/analysis"
          }}
          location={this.props.location}
        />
          <DashboardPageBody children={this.props.children} defaultComponent={<TickerList />} />
      </DashboardPage>
    );
  }
}