/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import ProfileView from './ProfileView';
import cx from 'classnames';

import OverlayStack from '../OverlayStack/OverlayStack';

class Profile extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render() {

    const locations = [
      "/dashboard/profile",
      "/dashboard/profile/subscription",
      "/dashboard/profile/history",
      "/dashboard/profile/settings",
      "/dashboard/profile/apikey",
      "/dashboard/profile/addapi"
    ];

    let useStack = false;

    if (locations.indexOf(this.props.location.pathname) === -1) {

      useStack = true;
    }

    return (
      <DashboardPage title={this.props.auth.name} fullWidth={true}>
        <DashboardPageMenu menu={{
            'Profiles': "/dashboard/profile",
            'Subscription': "/dashboard/profile/subscription",
            'Account History': "/dashboard/profile/history",
            'Settings': "/dashboard/profile/settings",
            'API Access': "/dashboard/profile/apikey"
          }}
          location={!useStack?this.props.location:{pathname:"/dashboard/profile"}}
        />
        {
          !useStack ? <DashboardPageBody children={this.props.children} defaultComponent={<ProfileView />} />
          :
          <OverlayStack popStack={()=>this.context.router.push('/dashboard/profile')}>
            {<div style={{padding:"2rem"}}><ProfileView /></div>}
            {this.props.children}
          </OverlayStack>
        }
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { auth: store.auth };
}

export default connect(mapStateToProps)(Profile);