/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import cx from 'classnames';
import { itemIDToName } from '../../market';
import { formatNumberUnit } from '../../utilities';
import s from './OrdersComponent.scss';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

class OrdersComponent extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {

      orderBy: 0,
      direction: 1 // 0 - ascending, 1 - descending
    };
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  setSort(newSort) {

    this.setState({
      orderBy: newSort,
      direction: newSort === this.state.orderBy ? this.state.direction === 1 ? 0 : 1 : this.state.direction
    });
  }

  render() {

    let orders = [];

    if (this.props.orders.length) {

      let sorter = (el1, el2) => parseInt(el1.price) - parseInt(el2.price);

      if (this.state.direction === 0) {
        switch(this.state.orderBy) {
          case 0: // price
            break;
          case 1: // name
            sorter = (el1, el2) => +(itemIDToName(el1.typeID) > itemIDToName(el2.typeID)) || +(itemIDToName(el1.typeID) === itemIDToName(el2.typeID)) - 1;
            break;
          case 2: // volume
            sorter = (el1, el2) => el1.volRemaining - el2.volRemaining;
            break;
          case 3: // buy or sell
            sorter = (el1, el2) => el1.bid - el2.bid;
            break;
          case 4: // location
            sorter = (el1, el2) => parseInt(el1.stationID) - parseInt(el2.stationID);
            break;
          case 5: // who
            sorter = (el1, el2) => el1.who - el2.who;
            break;
        }
      } else {
        switch(this.state.orderBy) {
          case 0: // price
            sorter = (el1, el2) => parseInt(el2.price) - parseInt(el1.price);
            break;
          case 1: // name
            sorter = (el1, el2) => +(itemIDToName(el2.typeID) > itemIDToName(el1.typeID)) || +(itemIDToName(el2.typeID) === itemIDToName(el1.typeID)) - 1;
            break;
          case 2: // volume
            sorter = (el1, el2) => el2.volRemaining - el1.volRemaining;
            break;
          case 3: // buy or sell
            sorter = (el1, el2) => el2.bid - el1.bid;
            break;
          case 4: // location
            sorter = (el1, el2) => parseInt(el2.stationID) - parseInt(el1.stationID);
            break;
          case 5: // who
            sorter = (el1, el2) => el2.who - el1.who;
            break;
        }
      }

      orders = this.props.orders.sort(sorter);
    }

    return (
      <DashboardPage title="Active Orders">
        <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow selectable={false}>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.header} onClick={()=>this.setSort(1)}>
                Item Name
                {
                  this.state.orderBy == 1 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.header} onClick={()=>this.setSort(0)}>
                Price
                {
                  this.state.orderBy == 0 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.header} onClick={()=>this.setSort(2)}>
                Volume Remaining
                {
                  this.state.orderBy == 2 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.header} onClick={()=>this.setSort(3)}>
                Type
                {
                  this.state.orderBy == 3 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.header} onClick={()=>this.setSort(4)}>
                Location
                {
                  this.state.orderBy == 4 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.header} onClick={()=>this.setSort(5)}>
                Who
                {
                  this.state.orderBy == 5 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              orders.length === 0 ?
                <TableRow selectable={false}>
                  {
                    this.props.settings.profiles.length === 0 ? 
                    <TableRowColumn>Orders will be begin to show within an hour of an API key being added, and on and hourly schedule afterwards</TableRowColumn> 
                    : <TableRowColumn>You do not have any active orders currently. Orders are updated on an hourly schedule and will show within an hour of being created</TableRowColumn>
                  }
                </TableRow>
                :
                orders.map((el, i) => {
                  return (
                   <TableRow key={i} selectable={false}>
                      <TableRowColumn style={{textAlign: "center"}}><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.typeID}`)}}>{itemIDToName(el.typeID)}</span></TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{formatNumberUnit(parseInt(el.price))}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{el.volRemaining}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{el.bid === "0" ? "Sell" : "Buy"}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{parseInt(el.stationID) > 1000000000000 ? "Citadel" : (this.props.sde.stationid2name[parseInt(el.stationID)] || "Station")}</TableRowColumn>
                      <TableRowColumn style={{textAlign: "center"}}>{el.who}</TableRowColumn>
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
  return { orders: store.market.user_orders, sde:store.sde, settings: store.settings };
}

export default connect(mapStateToProps)(OrdersComponent);