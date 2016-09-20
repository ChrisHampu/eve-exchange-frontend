/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import s from './NotificationsComponent.scss';
import cx from 'classnames';
import horizon from '../../horizon';
import { prettyDate } from '../../utilities';

import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

// Icons
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import XIcon from 'material-ui/svg-icons/navigation/close';

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
        <RaisedButton className={s.read_button_all} fullWidth={false} label="MARK ALL AS READ" backgroundColor="#262b2f" labelColor="rgb(217, 217, 217)" onMouseDown={()=>{this.markAllRead()}} />
        <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow selectable={false}>
              <TableHeaderColumn style={{textAlign: "left"}}>Message</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "left", "width": "200px"}}>Date</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "left", "width": "50px"}}>Read</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              this.props.notifications.length === 0 ?
                <TableRow selectable={false}>
                  <TableRowColumn>No new notifications</TableRowColumn>
                </TableRow>
                :
                this.props.notifications.map((el, i) => {
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
                })
            }
          </TableBody>
        </Table>
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { notifications: store.notifications };
}

export default connect(mapStateToProps)(Notifications);