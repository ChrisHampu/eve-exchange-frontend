/* eslint-disable global-require */
import React from 'react';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import NotificationsComponent from '../Notifications/NotificationsComponent';
import cx from 'classnames';

import OverlayStack from '../OverlayStack/OverlayStack';

export default class Feeds extends React.Component {

  render() {

    return (
      <DashboardPage title="Feeds" fullWidth={true}>
        <DashboardPageMenu menu={{
            'Notifications': "/dashboard/feeds/notifications"
          }}
          location={this.props.location}
        />
          <DashboardPageBody children={this.props.children} defaultComponent={<NotificationsComponent />} />
      </DashboardPage>
    );
  }
}