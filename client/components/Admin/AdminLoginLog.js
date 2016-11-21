/* eslint-disable global-require */
import React from 'react';;
import { connect } from 'react-redux';
import store from '../../store';
import cx from 'classnames';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import { prettyDate } from '../../utilities';

class AdminLoginLog extends React.Component {

  render() {

    const id2name = {};

    return (
      <DashboardPage title="Showing last 100 logins" fullWidth={true}>
        <div style={{padding: "1rem 1.5rem"}}>
          <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn style={{textAlign: "left"}}>Who</TableHeaderColumn>
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

                    name = id2name[el.user_id];

                    return (
                     <TableRow key={i} selectable={false}>
                        <TableRowColumn style={{textAlign: "left"}}>{name}</TableRowColumn>
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
  return { log: store.admin.login_log, subs: store.admin.subscriptions };
}

export default connect(mapStateToProps)(AdminLoginLog);