/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import cx from 'classnames';
import { formatNumberUnit } from '../../utilities';

import CircularProgress from 'material-ui/CircularProgress';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class ProfitTopItems extends React.Component {

  render() {

    return (
      <div style={{marginBottom: "2rem"}}>
      {
        !this.props.toplist.items ?
          <div style={{display: "flex", alignItems: "center", width: "100%", height: "100%"}}>
            <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
          </div>
          :
          <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn style={{textAlign: "center"}}>Name</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Total Profit</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Avg/item</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Volume Sold</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
            {
              this.props.toplist.items.length === 0 ?
                <TableRow selectable={false}>
                  <TableRowColumn>No records available</TableRowColumn>
                </TableRow>
                :
                this.props.toplist.items.sort((el1, el2) => el2.totalProfit-el1.totalProfit).map((el, i) => {
                  return (
                    <TableRow key={i} selectable={false}>
                      <TableRowColumn>{el.name}</TableRowColumn>
                      <TableRowColumn style={el.totalProfit > 0 ? {color: "#4CAF50", textAlign: "center"} : {color: "#F44336", textAlign: "center"}}>{formatNumberUnit(el.totalProfit)}</TableRowColumn>
                      <TableRowColumn style={el.avgPerUnit > 0 ? {color: "#4CAF50", textAlign: "center"} : {color: "#F44336", textAlign: "center"}}>{formatNumberUnit(el.avgPerUnit)}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{el.quantity}</TableRowColumn>
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
  return { toplist: store.profit.toplist };
}

export default connect(mapStateToProps)(ProfitTopItems);