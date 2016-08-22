/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import cx from 'classnames';
import { formatNumberUnit } from '../../utilities';

import CircularProgress from 'material-ui/CircularProgress';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class ProfitAlltime extends React.Component {

  formatColoured(number) {
    return number > 0 ? {color: "#4CAF50", textAlign: "center"} : {color: "#F44336", textAlign: "center"};
  }

  render() {

    return (
      <div style={{marginBottom: "2rem"}}>
      {
        !this.props.stats ?
          <div style={{display: "flex", alignItems: "center", width: "100%", height: "100%"}}>
            <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
          </div>
          :
          <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn style={{textAlign: "center"}}>Timespan</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Total Profit</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Taxes Paid</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Broker Fees</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              <TableRow selectable={false}>
                <TableRowColumn>All Time</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.alltime.profit)}>{formatNumberUnit(this.props.stats.alltime.profit)}</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.alltime.taxes)}>{formatNumberUnit(this.props.stats.alltime.taxes)}</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.alltime.broker)}>{formatNumberUnit(this.props.stats.alltime.broker)}</TableRowColumn>
              </TableRow>
              <TableRow selectable={false}>
                <TableRowColumn>Past 24 Hours</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.day.profit)}>{formatNumberUnit(this.props.stats.day.profit)}</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.day.taxes)}>{formatNumberUnit(this.props.stats.day.taxes)}</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.day.broker)}>{formatNumberUnit(this.props.stats.day.broker)}</TableRowColumn>
              </TableRow>
              <TableRow selectable={false}>
                <TableRowColumn>Past Week</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.week.profit)}>{formatNumberUnit(this.props.stats.week.profit)}</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.week.taxes)}>{formatNumberUnit(this.props.stats.week.taxes)}</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.week.broker)}>{formatNumberUnit(this.props.stats.week.broker)}</TableRowColumn>
              </TableRow>
              <TableRow selectable={false}>
                <TableRowColumn>Past Month</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.month.profit)}>{formatNumberUnit(this.props.stats.month.profit)}</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.month.taxes)}>{formatNumberUnit(this.props.stats.month.taxes)}</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.month.broker)}>{formatNumberUnit(this.props.stats.month.broker)}</TableRowColumn>
              </TableRow>
              <TableRow selectable={false}>
                <TableRowColumn>Past 3 Months</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.biannual.profit)}>{formatNumberUnit(this.props.stats.biannual.profit)}</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.biannual.taxes)}>{formatNumberUnit(this.props.stats.biannual.taxes)}</TableRowColumn>
                <TableRowColumn style={this.formatColoured(this.props.stats.biannual.broker)}>{formatNumberUnit(this.props.stats.biannual.broker)}</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
      }
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { stats: store.profit.stats };
}

export default connect(mapStateToProps)(ProfitAlltime);