/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import cx from 'classnames';
import { stationIDToName } from '../../sde/stationIDToName';
import { itemIDToName } from '../../market';
import { formatNumberUnit } from '../../utilities';
import s from './OrdersComponent.scss';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class OrdersComponent extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  setRoute(path) {

    this.context.router.push(path);
  }

  render() {

    return (
      <DashboardPage title="Active Orders">
        <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
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
              this.props.orders.length === 0 ?
                <TableRow selectable={false}>
                  <TableRowColumn>No records available</TableRowColumn>
                </TableRow>
                :
                this.props.orders.map((el, i) => {
                  return (
                   <TableRow key={i} selectable={false}>
                      <TableRowColumn style={{textAlign: "center"}}><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.typeID}`)}}>{itemIDToName(parseInt(el.typeID))}</span></TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{formatNumberUnit(el.price)}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{el.volRemaining}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{el.bid === "0" ? "Sell" : "Buy"}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{parseInt(el.stationID) > 1000000000000 ? "Citadel" : stationIDToName[parseInt(el.stationID)]}</TableRowColumn>
                    </TableRow>
                  )
                })
            }
          </TableBody>
        </Table>
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { orders: store.market.user_orders };
}

export default connect(mapStateToProps)(OrdersComponent);