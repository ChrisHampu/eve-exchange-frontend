/* eslint-disable global-require */
import React from 'react';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import UsersView from './UsersView';

export default class UsersComponent extends React.Component {

  render() {

    let defaultPath = "/dashboard/users";

    if (this.props.location.pathname.indexOf("/dashboard/users/view") !== -1) {
      defaultPath = this.props.location.pathname;
    }

    return (
      <DashboardPage title="Users" fullWidth={true}>
        <DashboardPageMenu menu={{
          'View All': defaultPath}}
          location={this.props.location}
        />
        <DashboardPageBody children={this.props.children} defaultComponent={<UsersView style={{flex: 1, width: "100%"}}/>} />
      </DashboardPage>
    );
  }
}