/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import PortfoliosViewAll from './PortfoliosViewAll';
import cx from 'classnames';

export default class Portfolios extends React.Component {

  render() {

    return (
      <DashboardPage title="Portfolios" fullWidth={true}>
        <DashboardPageMenu menu={{
          'View All': "/dashboard/portfolios",
          'Create New': "/dashboard/portfolios/create",}}
          location={this.props.location}
        />
        <DashboardPageBody children={this.props.children} defaultComponent={<PortfoliosViewAll />} />
      </DashboardPage>
    );
  }
}