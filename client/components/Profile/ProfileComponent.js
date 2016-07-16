/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import ProfileView from './ProfileView';
import s from './ProfileComponent.scss';
import cx from 'classnames';

class Profile extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  setRoute(path) {

    this.context.router.push(path);
  }

  render() {

    return (
      <DashboardPage title={this.props.auth.name} className={s.root}>
        <div className={s.menu_container}>
          <div className={s.menu}>
            <div
              className={cx(s.menu_item, { [s.active]: this.props.location.pathname === "/dashboard/profile" })} 
              onClick={()=>{this.setRoute("/dashboard/profile")}}
            >
              Profile
            </div>
            <div
              className={cx(s.menu_item, { [s.active]: this.props.location.pathname === "/dashboard/profile/subscription" })} 
              onClick={()=>{this.setRoute("/dashboard/profile/subscription")}}
            >
              Subscription
            </div>
            <div
              className={cx(s.menu_item, { [s.active]: this.props.location.pathname === "/dashboard/profile/settings" })} 
              onClick={()=>{this.setRoute("/dashboard/profile/settings")}}
            >
              Settings
            </div>
          </div>
        </div>
        <div className={s.body_container}>
          <div className={s.body}>
            {this.props.children ? this.props.children : <ProfileView />}
          </div>
        </div>
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { auth: store.auth };
}

export default connect(mapStateToProps)(Profile);