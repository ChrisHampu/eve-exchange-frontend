/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { sendAppNotification } from '../../actions/appActions';
import { getAuthToken } from '../../deepstream';
import s from './NotificationsComponent.scss';
import cx from 'classnames';
import { prettyDate } from '../../utilities';
import { APIEndpointURL } from '../../globals';
import PaginatedTable from '../UI/PaginatedTable';

import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import {TableHeaderColumn} from 'material-ui/Table';

// Icons
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import XIcon from 'material-ui/svg-icons/navigation/close';

class Notifications extends React.Component {

  async markAllRead() {

    const res = await fetch(`${APIEndpointURL}/notification/all/read`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${getAuthToken()}`
      }
    });

    const result = await res.json();

    if (result.error) {

      store.dispatch(sendAppNotification(result.error));

      throw (result.error);
    } else {

      store.dispatch(sendAppNotification("Notifications have been marked as read"));
    }
  }

  async toggleRead(notification) {

    const status = notification.read ? "unread" : "read";

    const res = await fetch(`${APIEndpointURL}/notification/${notification._id}/${status}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${getAuthToken()}`
      }
    });

    const result = await res.json();

    if (result.error) {

      store.dispatch(sendAppNotification(result.error));

      throw (result.error);
    } else {

      store.dispatch(sendAppNotification("Notification status updated"));
    }
  }

  render() {
    return (
      <div className={s.root}>
        <RaisedButton className={s.read_button_all} fullWidth={false} label="MARK ALL AS READ" backgroundColor="#262b2f" labelColor="rgb(217, 217, 217)" onMouseDown={()=>{this.markAllRead()}} />
        <PaginatedTable
          headers={[
            <TableHeaderColumn key={0} style={{textAlign: "left"}}>Message</TableHeaderColumn>,
            <TableHeaderColumn key={1} style={{textAlign: "left", "width": "200px"}}>When</TableHeaderColumn>,
            <TableHeaderColumn key={2} style={{textAlign: "left", "width": "50px"}}>Read</TableHeaderColumn>
          ]}
          items={this.props.notifications.map((el, i) => {
            return (
              <tr key={i} className={s.row}>
                <td className={s.column}>{el.message}</td>
                <td width="200px" className={s.column}>{prettyDate(el.time)}</td>
                <td className={s.column} width="50px">
                  <IconButton tooltip={el.read===false?"Mark Read":"Mark Unread"} className={cx(s.read_button, {[s.is_read]: el.read})} onClick={()=>{this.toggleRead(el)}}>
                    { el.read === false ? <XIcon /> : <CheckIcon /> }
                  </IconButton>
                </td>
              </tr>
            )
          })}
        />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { notifications: store.feeds.notifications };
}

export default connect(mapStateToProps)(Notifications);