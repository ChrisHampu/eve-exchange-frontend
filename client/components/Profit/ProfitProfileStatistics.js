/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import cx from 'classnames';
import s from './ProfitProfileStatistics.scss';
import { itemIDToName } from '../../market';
import { formatNumberUnit, prettyDate } from '../../utilities';

import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';

class ProfitProfileStatistics extends React.Component {

  formatColoured(number) {
    return number > 0 ? {color: "#4CAF50", textAlign: "center"} : {color: "#F44336", textAlign: "center"};
  }

  render() {

    let profile = null;
    let activeOrders = 0;

    for (var i = 0; i < this.props.settings.profiles.length; i++) {
      if (this.props.settings.profiles[i].id === this.props.params.id)
        profile = this.props.settings.profiles[i];
    }

    if (!profile) {
      return (
        <div className={s.root}>
          <div className={s.not_found}>
            Unable to find a profile with the given ID.
          </div>
        </div>
      )
    }

    const comparator = profile.type === 0 ? profile.character_name : profile.corporation_name;
    const comparator_id = profile.type === 0 ? profile.character_id : profile.corporation_id;
    const date_24hrs = 86400000; // Number of milliseconds in a day
    const date_now = (new Date()).getTime();

    const user_orders = this.props.user_orders.filter(el=>el.who===comparator);

    activeOrders = user_orders.length;

    const transactions = this.props.profit.transactions.filter(el=>el.who===comparator&&date_now-(new Date(el.time)).getTime()<date_24hrs).sort((el1, el2) => new Date(el2.time) - new Date(el1.time));

    let totalProfit = 0;
    let avgProfit = 0;
    let totalTransactions = 0;

    const top_index = this.props.profit.toplist.profiles.findIndex(el => el.whoID === comparator_id);

    if (top_index !== -1) {
      totalProfit = this.props.profit.toplist.profiles[top_index].totalProfit;
      avgProfit = this.props.profit.toplist.profiles[top_index].avgProfit;
      totalTransactions = this.props.profit.toplist.profiles[top_index].salesCount;
    }

    return (
      <div className={s.root}>
        <Paper zDepth={2}>
          <div className={s.metadata}>
            <div className={s.values}>
              <div className={s.avatar}>
                <img size="40" src={`https://image.eveonline.com/${profile.type===0?"Character":"Corporation"}/${profile.type===0?profile.character_id:profile.corporation_id}_64.${profile.type===0?"jpg":"png"}`} />
              </div>
              {profile.type===0?profile.character_name:profile.corporation_name} - Total Profit: <span className={s.value}>{formatNumberUnit(totalProfit)}</span>Avg/Transaction: <span className={s.value}>{formatNumberUnit(avgProfit)}</span>Total Transactions: <span className={s.value}>{totalTransactions}</span>Active Orders: <span className={s.value}>{activeOrders}</span>
            </div>
          </div>
        </Paper>
        <div className={s.table_header}>
          <div className={s.table_title}>
          Recent Transactions
          </div>
        </div>
        <div className={s.table}>
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn style={{textAlign: "center"}}>When</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Item Name</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Profit</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Volume Sold</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
            {
              transactions.length === 0 ? 
                <TableRow selectable={false}>
                  <TableRowColumn>No records available</TableRowColumn>
                </TableRow>
                :
                transactions.map((el, i) => {
                  return (
                    <TableRow key={i} selectable={false}>
                        <TableRowColumn style={{textAlign: "center"}}>{prettyDate(el.time)}</TableRowColumn>
                        <TableRowColumn style={{textAlign: "center"}}><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.type}`)}}>{el.name}</span></TableRowColumn>
                        <TableRowColumn style={this.formatColoured(el.totalProfit)}>{formatNumberUnit(el.totalProfit)}</TableRowColumn>
                        <TableRowColumn style={{textAlign: "center"}}>{el.quantity}</TableRowColumn>
                    </TableRow>
                  )
                })
            }
            </TableBody>
          </Table>
        </div>
        <div className={s.table_header}>
          <div className={s.table_title}>
          Active Orders
          </div>
        </div>
        <div className={s.table}>
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn style={{textAlign: "center"}}>Item Name</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Price</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Volume Remaining</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Type</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Location</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
            {
              user_orders.length === 0 ? 
                <TableRow selectable={false}>
                  <TableRowColumn>No records available</TableRowColumn>
                </TableRow>
                :
                user_orders.map((el, i) => {
                  return (
                    <TableRow key={i} selectable={false}>
                      <TableRowColumn style={{textAlign: "center"}}><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.typeID}`)}}>{itemIDToName(el.typeID)}</span></TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{formatNumberUnit(parseInt(el.price))}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{el.volRemaining}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{el.bid === "0" ? "Sell" : "Buy"}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{parseInt(el.stationID) > 1000000000000 ? "Citadel" : (this.props.sde.stationid2name[parseInt(el.stationID)] || "Station")}</TableRowColumn>
                    </TableRow>
                  )
                })
            }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { profit: store.profit, settings: store.settings, user_orders: store.market.user_orders, sde: store.sde };
}

export default connect(mapStateToProps)(ProfitProfileStatistics);