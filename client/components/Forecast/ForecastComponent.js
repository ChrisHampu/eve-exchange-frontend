/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import ForecastItems from './ForecastItems';
import cx from 'classnames';

import OverlayStack from '../OverlayStack/OverlayStack';

export default class ForecastComponent extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render() {

    return (
      <DashboardPage title="Forecast" fullWidth={true}>
        <DashboardPageMenu menu={{
            'Find Items': "/dashboard/forecast",
            'Region Trading': "/dashboard/forecast/regional"
          }}
          location={this.props.location}
        />
          <DashboardPageBody children={this.props.children} defaultComponent={<ForecastItems />} />
      </DashboardPage>
    );
  }
}