/* eslint-disable global-require */
import React from 'react';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import UsersView from './UsersView';

export default class UsersComponent extends React.Component {

  render() {

    return (
      <DashboardPage title="Users" fullWidth={true}>
        <DashboardPageMenu menu={{
          'View All': "/dashboard/users"}}
          location={this.props.location}
        />
        <DashboardPageBody children={this.props.children} defaultComponent={<UsersView style={{flex: 1, width: "100%"}}/>} />
      </DashboardPage>
    );
  }
}