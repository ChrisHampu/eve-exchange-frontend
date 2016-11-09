/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import cx from 'classnames';
import { formatNumberUnit } from '../../utilities';

import CircularProgress from 'material-ui/CircularProgress';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class ProfitTopProfiles extends React.Component {

  formatColoured(number) {
    return number > 0 ? {color: "#4CAF50", textAlign: "center"} : {color: "#F44336", textAlign: "center"};
  }

  render() {

    if (!this.props.profiles) {
      return (
        <div style={{display: "flex", alignItems: "center", width: "100%", height: "100%"}}>
          <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
        </div>
      )
    }

    const profiles = this.props.profiles.sort((el1, el2) => el2.totalProfit - el1.totalProfit);

    return (
      <div style={{marginBottom: "2rem"}}>
        <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow selectable={false}>
              <TableHeaderColumn style={{textAlign: "center"}}>Profile</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>Total Profit</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>Avg Profit/Transaction</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>Total Transactions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              profiles.length === 0 ? 
                <TableRow selectable={false}>
                  <TableRowColumn>No records available</TableRowColumn>
                </TableRow>
                :
                profiles.map((el, i) =>
                  <TableRow selectable={false} key={i}>
                    <TableRowColumn>{el.who}</TableRowColumn>
                    <TableRowColumn style={this.formatColoured(el.totalProfit)}>{formatNumberUnit(el.totalProfit)}</TableRowColumn>
                    <TableRowColumn style={this.formatColoured(el.avgProfit)}>{formatNumberUnit(el.avgProfit)}</TableRowColumn>
                    <TableRowColumn style={{textAlign: "center"}}>{el.salesCount}</TableRowColumn>
                  </TableRow>
                )
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { profiles: store.profit.toplist.profiles };
}

export default connect(mapStateToProps)(ProfitTopProfiles);