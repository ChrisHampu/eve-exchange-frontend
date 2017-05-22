/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import AlertsView from './AlertsView';

class AlertsComponent extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {

    return (
      <DashboardPage title='Alerts' fullWidth>
        <DashboardPageMenu
          menu={{
            View: '/dashboard/alerts',
            Create: '/dashboard/alerts/create',
            History: '/dashboard/alerts/history'
          }}
          location={this.props.location}
        />
        <DashboardPageBody children={this.props.children} defaultComponent={<AlertsView />} />
      </DashboardPage>
    );
  }
}

const mapStateToProps = function (store) { return { alerts: store.alerts, settings: store.settings }};

export default connect(mapStateToProps)(AlertsComponent);
