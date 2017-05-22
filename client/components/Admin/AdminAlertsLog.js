/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { prettyDate } from '../../utilities';

class AdminAlertsLog extends React.Component {

  render() {

    const id2name = {};

    return (
      <DashboardPage title="Showing last 100 alerts" fullWidth={true}>
        <div style={{padding: "1rem 1.5rem"}}>
          <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn style={{textAlign: "left"}}>Who</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "left"}}>Message</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>When</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
            {
              !this.props.log || !Array.isArray(this.props.log) || this.props.log.length === 0 ?
                <TableRow selectable={false}>
                  <TableRowColumn>No alerts have been triggered yet.</TableRowColumn>
                </TableRow>
                :
                this.props.log.map((el) => {

                  let name = "";

                  if (el.user_id && el.user_id > 0 && !id2name.hasOwnProperty(el.user_id)) {
                    id2name[el.user_id] = this.props.subs[this.props.subs.findIndex(sub => sub.user_id === el.user_id)].user_name;
                  }

                  if ((el.action === 1 || el.action === 0 ) && !id2name.hasOwnProperty(el.target)) {

                    const _find = this.props.subs.findIndex(sub => sub.user_id === el.target);

                    if (!this.props.subs.hasOwnProperty(_find)) {
                      id2name[el.target] = "Unknown";
                    } else {
                      id2name[el.target] = this.props.subs[_find].user_name;
                    }
                  }

                  name = el.user_id ? id2name[el.user_id] : "System";

                  return (
                    <TableRow key={el._id} selectable={false}>
                      <TableRowColumn style={{textAlign: "left"}}>{name}</TableRowColumn>
                      <td colSpan='3' style={{paddingLeft: '24px', paddingRight: '24px', height: '48px', textAlign: 'left', fontSize: '13px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', backgroundColor: 'inherit'}}>
                      {el.message}
                      </td>
                      <TableRowColumn style={{textAlign: "center"}}>{prettyDate(el.time)}</TableRowColumn>
                    </TableRow>
                  );
                })
            }
            </TableBody>
          </Table>
        </div>
      </DashboardPage>
    );
  }
}

const mapStateToProps = function (store) { return { log: store.admin.alerts_log, subs: store.admin.subscriptions }; };

export default connect(mapStateToProps)(AdminAlertsLog);
