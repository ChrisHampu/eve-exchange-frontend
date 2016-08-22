/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import cx from 'classnames';
import s from './ProfitTransactions.scss'
import { formatNumberUnit, formatDate } from '../../utilities';

import CircularProgress from 'material-ui/CircularProgress';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class ProfitTransactions extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  setRoute(path) {

    this.context.router.push(path);
  }

  formatColoured(number) {
    return number > 0 ? {color: "#4CAF50", textAlign: "center"} : {color: "#F44336", textAlign: "center"};
  }

  render() {

    return (
      <div style={{marginBottom: "2rem"}}>
      {
        !this.props.transactions ?
          <div style={{display: "flex", alignItems: "center", width: "100%", height: "100%"}}>
            <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
          </div>
          :
          <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn style={{textAlign: "center"}}>When</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Item Name</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Number Sold</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Profit</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {
                this.props.transactions.length === 0 ?
                  <TableRow selectable={false}>
                    <TableRowColumn>No records available</TableRowColumn>
                  </TableRow>
                  :
                  this.props.transactions.map((el, i) => {
                    return (
                     <TableRow key={i} selectable={false}>
                        <TableRowColumn style={{textAlign: "center"}}>{formatDate(el.time)}</TableRowColumn>
                        <TableRowColumn style={{textAlign: "center"}}><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.type}`)}}>{el.name}</span></TableRowColumn>
                        <TableRowColumn style={{textAlign: "center"}}>{el.quantity}</TableRowColumn>
                        <TableRowColumn style={this.formatColoured(el.totalProfit)}>{formatNumberUnit(el.totalProfit)}</TableRowColumn>
                      </TableRow>
                    )
                  })
              }
            </TableBody>
          </Table>
      }
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { transactions: store.profit.transactions };
}

export default connect(mapStateToProps)(ProfitTransactions);