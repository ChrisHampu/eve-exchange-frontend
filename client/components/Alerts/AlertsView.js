/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import cx from 'classnames';
import s from './AlertsView.scss';

import AlertsViewSingle from './AlertsViewSingle';

class AlertsView extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  setRoute(route) {

    browserHistory.push(route);
  }

  render() {

    return (
      <div className={s.root}>
        {
            !this.props.alerts.length ? <div>No alerts have been configured yet. <span className={s.link} onClick={() => this.setRoute('/dashboard/alerts/create')}>Click here</span> to create one.</div>
            : <div className={s.container}>
              <div className={s.settings}>
                EVE-Mail is
                {
                  this.props.settings.alerts.canSendMailNotification === true ? <span className={s.settings_enabled}> enabled</span> : <span className={s.settings_disabled}> disabled</span>
                } - Browser notifications are
                {
                  this.props.settings.alerts.canShowBrowserNotification === true ? <span className={s.settings_enabled}> enabled</span> : <span className={s.settings_disabled}> disabled</span>
                } - <span className={s.link} onClick={() => this.setRoute('/dashboard/profile/settings')}>Change Settings</span>
              </div>
              {
                this.props.alerts.map(el => <AlertsViewSingle key={el._id} {...el} />)
              }
            </div>
        }
      </div>
    );
  }
}

const mapStateToProps = function (store) { return { alerts: store.alerts.list, settings: store.settings }; };

export default connect(mapStateToProps)(AlertsView);
