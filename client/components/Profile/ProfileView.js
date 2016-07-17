/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './ProfileView.scss';
import cx from 'classnames';

import Avatar from 'material-ui/Avatar';

class ProfileView extends React.Component {

  subscriptionLevelToName() {
    switch (this.props.subscription.premium) {
      case false:
        return "Free";
      case true:
        return <span style={{color: "rgb(235, 169, 27)"}}>Premium</span>;
    }
  }

  render() {
    return (
      <div>
        <div className={s.profile_info}>
          <Avatar className={s.avatar} src={`https://image.eveonline.com/Character/${this.props.auth.id}_256.jpg`} size={192} />
          <div className={s.basic_info}>
            <div className={s.info_field}>
              <div className={s.info_key}>
              Name:
              </div>
              <div className={s.info_value}>
              {this.props.auth.name}
              </div>
            </div>
            <div className={s.info_field}>
              <div className={s.info_key}>
              Corporation:
              </div>
              <div className={s.info_value}>
              {this.props.auth.corporation}
              </div>
            </div>
            <div className={s.info_field}>
              <div className={s.info_key}>
              Subscription:
              </div>
              <div className={s.info_value}>
              {this.subscriptionLevelToName()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { auth: store.auth, subscription: store.subscription };
}

export default connect(mapStateToProps)(ProfileView);