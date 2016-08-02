/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import ProfileView from './ProfileView';
import cx from 'classnames';

class Profile extends React.Component {

  render() {

    return (
      <DashboardPage title={this.props.auth.name} fullWidth={true}>
        <DashboardPageMenu menu={{
          'Profile': "/dashboard/profile",
          'Subscription': "/dashboard/profile/subscription",
          'API Key': "/dashboard/profile/apikey",
          'Settings': "/dashboard/profile/settings" }}
          location={this.props.location}
        />
        <DashboardPageBody children={this.props.children} defaultComponent={<ProfileView />} />
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { auth: store.auth };
}

export default connect(mapStateToProps)(Profile);