/* eslint-disable global-require */
import React from 'react';;
import { connect } from 'react-redux';
import store from '../../store';
import cx from 'classnames';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { prettyDate } from '../../utilities';

class AdminAuditLog extends React.Component {

  actionIDToName(action) {
    switch(action) {
      case 0: return `Deposit`;
      case 1: return `Withdrawal`;
      case 2: return "Subscription";
      case 3: return "Unsubscribed";
      case 4: return "Renewal";
      case 5: return `New Portfolio`;
      case 6: return `Deleted Portfolio`;
      case 7: return "New Profile";
      case 8: return "Deleted Profile";
      case 9: return "Expired";
      case 10: return "Withdrawal Request";
      case 11: return "New Account";
    }

    return "Unknown";
  }

  actionToMessage(user_id, action, target, balance) {

    switch(action) {
      case 0: return `Deposited ${balance} into ${target}'s account`;
      case 1: return `Withdrew ${balance} from ${target}'s account`;
      case 2: return "Initiated a new premium subscription";
      case 3: return "Has manually ended their premium subscription";
      case 4: return "Has automatically renewed their premium subscription";
      case 5: return `Has created a new portfolio with the id ${target}`;
      case 6: return `Has deleted their portfolio ${target}`;
      case 7: return "Added a new API key to their account";
      case 8: return "Deleted an API key from their account";
      case 9: return "Subscription has automatically expired and not renewed";
      case 10: return `Initiated a new withdrawal request of ${balance}`;
      case 11: return "Has created a new account";
    }

    return "Unknown action";
  }

  render() {

    const id2name = {};

    return (
      <DashboardPage title="Showing last 100 entries" fullWidth={true}>
        <div style={{padding: "1rem 1.5rem"}}>
          <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn style={{textAlign: "left"}}>Who</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "left"}}>Action</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "left"}}>Action Message</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>When</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {
                !this.props.log || !Array.isArray(this.props.log) || this.props.log.length === 0 ?
                  <TableRow selectable={false}>
                    <TableRowColumn>No records available</TableRowColumn>
                  </TableRow>
                  :
                  this.props.log.map((el, i) => {

                    let name = "";

                    if (!id2name.hasOwnProperty(el.user_id)) {
                      id2name[el.user_id] = this.props.subs[this.props.subs.findIndex(sub => sub.user_id === el.user_id)].user_name;
                    }

                    if ((el.action === 1 || el.action === 0 ) && !id2name.hasOwnProperty(el.target)) {
                      id2name[el.target] = this.props.subs[this.props.subs.findIndex(sub => sub.user_id === el.target)].user_name;
                    }

                    name = id2name[el.user_id];

                    return (
                     <TableRow key={i} selectable={false}>
                        <TableRowColumn style={{textAlign: "left"}}>{name}</TableRowColumn>
                        <TableRowColumn style={{textAlign: "left"}}>{this.actionIDToName(el.action)}</TableRowColumn>
                        <TableRowColumn style={{textAlign: "left"}}>{this.actionToMessage(el.user_id, el.action, el.action===0||el.action===1?id2name[el.target]:el.target, el.balance)}</TableRowColumn>
                        <TableRowColumn style={{textAlign: "center"}}>{prettyDate(el.time)}</TableRowColumn>
                      </TableRow>
                    )
                  })
              }
            </TableBody>
          </Table>
        </div>
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { log: store.admin.audit_log, subs: store.admin.subscriptions };
}

export default connect(mapStateToProps)(AdminAuditLog);