/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import s from './ProfileComponent.scss';
import cx from 'classnames';

class Profile extends React.Component {

  render() {
    return (
      <DashboardPage title={this.props.auth.name} className={s.root}>

      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { auth: store.auth };
}

export default connect(mapStateToProps)(Profile);