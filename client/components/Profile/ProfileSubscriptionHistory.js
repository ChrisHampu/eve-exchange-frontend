/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './ProfileSubscriptionHistory.scss';
import { formatNumber } from '../../utilities';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';

class SubscriptionHistory extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      subFilter: 0
    };
  }

  setSubFilter = (event, index, value) => this.setState({subFilter: value});
 
  render() {

    let history = null;

    if (this.props.subscription.deposit_history && this.props.subscription.withdrawal_history) {

      history = this.props.subscription.deposit_history
      .concat(this.props.subscription.withdrawal_history)
      .sort((el1, el2) => el2.time - el1.time);

      switch(this.state.subFilter) {
        case 0:
          break;
        case 1:
          history = history.filter(el => el.type === 0);
          break;
        case 2:
          history = history.filter(el => el.type === 1);
          break;
      }
    }

    return (
      <div className={s.root}>
        <div className={s.subscription_history}>
          <div className={s.subscription_history_header}>
            <div className={s.subscription_history_title}>
            Transactions
            </div>
            <div className={s.subscription_history_selector}>
              <SelectField value={this.state.subFilter} onChange={this.setSubFilter}>
                <MenuItem type="text" value={0} primaryText="Show All" style={{cursor: "pointer"}}/>
                <MenuItem type="text" value={1} primaryText="Show Deposits" style={{cursor: "pointer"}} />
                <MenuItem type="text" value={2} primaryText="Show Withdrawals" style={{cursor: "pointer"}} />
              </SelectField>
            </div>
          </div>
          <div className={s.subscription_history_table}>
          {
            !history ? 
              <div style={{display: "flex", alignItems: "center", width: "100%", height: "100px"}}>
                <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
              </div>
              :
              <Table selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow selectable={false}>
                    <TableHeaderColumn>Date</TableHeaderColumn>
                    <TableHeaderColumn>Type</TableHeaderColumn>
                    <TableHeaderColumn>Amount</TableHeaderColumn>
                    <TableHeaderColumn>Description</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                {
                  history.length === 0 ? 
                    <TableRow selectable={false}>
                      <TableRowColumn>No records available</TableRowColumn>
                    </TableRow>
                    :
                    history.map((el, i) => {
                      return (
                        <TableRow key={i} selectable={false}>
                          <TableRowColumn>{el.time.toString()}</TableRowColumn>
                          <TableRowColumn>{el.type===0?"Deposit":"Withdrawal"}</TableRowColumn>
                          <TableRowColumn style={el.type===0?{color: "#4CAF50"}:{color: "#F44336"}}>{formatNumber(el.amount)} ISK</TableRowColumn>
                          <TableRowColumn>{el.description}</TableRowColumn>
                          <TableRowColumn>{el.process ? "Complete" : "In Progress"}</TableRowColumn>
                        </TableRow>
                      )
                    })
                }
                </TableBody>
              </Table>
          }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { subscription: store.subscription };
}

export default connect(mapStateToProps)(SubscriptionHistory);