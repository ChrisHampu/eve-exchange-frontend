/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import s from './AlertsView.scss';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { prettyDate } from '../../utilities';

class AlertsLog extends React.Component {

  render() {

    return (
      <div className={s.root}>
        <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow selectable={false}>
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
              this.props.log.map(el =>
                <TableRow key={el._id} selectable={false}>
                  <TableRowColumn style={{textAlign: "left"}}>{el.message}</TableRowColumn>
                  <TableRowColumn style={{textAlign: "center"}}>{prettyDate(el.time)}</TableRowColumn>
                </TableRow>
              )
          }
          </TableBody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = function (store) { return { log: store.alerts.log }; };

export default connect(mapStateToProps)(AlertsLog);
