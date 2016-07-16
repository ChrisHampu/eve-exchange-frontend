/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import s from './NotificationsComponent.scss';
import cx from 'classnames';
import horizon from '../../horizon';

import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';

// Icons
import CheckIcon from 'material-ui/svg-icons/navigation/check';

class Notifications extends React.Component {

  markAllRead() {

    horizon('notifications').replace(this.props.notifications.filter(el => el.read === false).map(el => { return { ...el, read: true } }));
  }

  toggleRead(notification) {

    horizon('notifications').replace({...notification, read: !notification.read});
  }

  render() {
    return (
      <DashboardPage title="Notifications" className={s.root}>
        <RaisedButton label="MARK ALL AS READ" backgroundColor="#262b2f" labelColor="rgb(217, 217, 217)" onMouseDown={()=>{this.markAllRead()}} />
      {
        this.props.notifications.length === 0 ?
          <div className={s.page_body}>
          No new notifications
          </div>
          :
        this.props.notifications.map((el, i) => {
          return (
            <div key={i} className={cx(s.notification, { [s.unread]: !el.read })}>
              <div className={s.message}>
                {el.message}
              </div>
              <div className={s.notification_footer}>
                <div className={s.time}>
                  {el.time.toLocaleString()}
                </div>
                <IconButton tooltip={el.read===false?"Mark Read":"Mark Unread"} className={s.read_button} onClick={()=>{this.toggleRead(el)}}>
                  <CheckIcon />
                </IconButton>
              </div>
            </div>
          )
        })
      }
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { notifications: store.notifications };
}

export default connect(mapStateToProps)(Notifications);