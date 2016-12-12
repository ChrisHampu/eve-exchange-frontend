/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import cx from 'classnames';
import s from './ProfitTransactions.scss'
import { formatNumberUnit, prettyDate } from '../../utilities';
import PaginatedTable from '../UI/PaginatedTable';

import CircularProgress from 'material-ui/CircularProgress';
import { TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

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
      <div style={{height: "100%", overflow: "hidden", display: "flex"}}>
        <PaginatedTable
          headers={[
            <TableHeaderColumn style={{textAlign: "center"}}>When</TableHeaderColumn>,
            <TableHeaderColumn style={{textAlign: "center"}}>Item Name</TableHeaderColumn>,
            <TableHeaderColumn style={{textAlign: "center"}}>Profit</TableHeaderColumn>,
            <TableHeaderColumn style={{textAlign: "center"}}>Volume Sold</TableHeaderColumn>,
            <TableHeaderColumn style={{textAlign: "center"}}>Who</TableHeaderColumn>
          ]}
          items={this.props.transactions.sort((el1, el2) => new Date(el2.time) - new Date(el1.time)).map((el, i) => {
            return (
             <TableRow key={i} selectable={false}>
                <TableRowColumn style={{textAlign: "center"}}>{prettyDate(el.time)}</TableRowColumn>
                <TableRowColumn style={{textAlign: "center"}}><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.type}`)}}>{el.name}</span></TableRowColumn>
                <TableRowColumn style={this.formatColoured(el.totalProfit)}>{formatNumberUnit(el.totalProfit)}</TableRowColumn>
                <TableRowColumn style={{textAlign: "center"}}>{el.quantity}</TableRowColumn>
                <TableRowColumn style={{textAlign: "center"}}>{el.who}</TableRowColumn>
              </TableRow>
            )
          })}
        />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { transactions: store.profit.transactions };
}

export default connect(mapStateToProps)(ProfitTransactions);