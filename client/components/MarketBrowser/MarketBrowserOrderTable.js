import React from 'react';
import s from './MarketBrowserOrderTable.scss';
import { connect } from 'react-redux';
import store from '../../store';
import { formatNumber } from '../../utilities';
import cx from 'classnames';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

class MarketBrowserOrderTable extends React.Component {

  static propTypes = {

    item: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  getMarketOrders() {

    const region = store.getState().settings.market.region;

    if (typeof this.props.market.item[this.props.item.id] !== 'undefined'
      && typeof this.props.market.item[this.props.item.id].orders !== 'undefined'
      && typeof this.props.market.item[this.props.item.id].orders[region] !== 'undefined') {
      return this.props.market.item[this.props.item.id].orders[region];
    }

    return [];
  }

  getMarketAggregates() {

    const region = store.getState().settings.market.region;

    if (typeof this.props.market.item[this.props.item.id] !== 'undefined'
      && typeof this.props.market.item[this.props.item.id].minutes !== 'undefined'
      && typeof this.props.market.item[this.props.item.id].minutes[region] !== 'undefined') {
      return this.props.market.item[this.props.item.id].minutes[region];
    }

    return [];
  }

  isUserOrder(orderID) {

    const _id = orderID.toString();

    if (this.props.market.user_orders.find(el => el.orderID === _id)) {
      return true;
    }

    return false;
  }

  render() {

    let sellOrders = this.getMarketOrders().filter(el => el.buy === false).sort((el1, el2) => el1.price - el2.price);
    let buyOrders = this.getMarketOrders().filter(el => el.buy === true).sort((el1, el2) => el2.price - el1.price);

    const current = this.getMarketAggregates().sort((el1, el2) => el1.time - el2.time)[0] || { sellPercentile: 0, buyPercentile: 0 };

    const topSell = sellOrders.splice(0, Math.min(10, sellOrders.filter(el => el.price > current.sellPercentile).length));
    const topBuy = buyOrders.splice(0, Math.min(10, buyOrders.filter(el => el.price > current.buyPercentile).length));

    return (
      <div className={s.market_item_order_container}>
        <div>
          <table>
            <thead>
              <tr>
                <th>
                  Location
                </th>
                <th style={{textAlign: "right"}}>
                  Volume
                </th>
                <th style={{textAlign: "right"}}>
                  Price
                </th>
              </tr>
              <tr>
                <th colSpan="3" style={{textAlign: "center"}}>
                  Sell: Top 5%
                </th>
              </tr>
            </thead>
            <tbody>
              {
                topSell.length ? topSell.map((el, i) => {
                  return (
                    <tr key={i} className={cx({[s.user_order]: this.isUserOrder(el.id)})}>
                      <td>{parseInt(el.stationID) > 1000000000000 ? "Citadel" : (this.props.sde.stationid2name[parseInt(el.stationID)] || "Station")}</td>
                      <td style={{textAlign: "right"}}>{el.volume}</td>
                      <td style={{textAlign: "right"}}>{formatNumber(el.price)}</td>
                    </tr>
                  )
                })
                : <tr><td colSpan="3" style={{textAlign: "center", backgroundColor: "rgba(153, 156, 160, 0.4)"}}>None</td></tr>
              }
            </tbody>
            <thead>
              <tr>
                <th colSpan="3" style={{textAlign: "center"}}>
                  Sell Orders
                </th>
              </tr>
            </thead>
            <tbody>
              {
                sellOrders.slice(0, 15).map((el, i) => {
                  return (
                    <tr key={i} className={cx({[s.user_order]: this.isUserOrder(el.id)})}>
                      <td>{parseInt(el.stationID) > 1000000000000 ? "Citadel" : (this.props.sde.stationid2name[parseInt(el.stationID)] || "Station")}</td>
                      <td style={{textAlign: "right"}}>{el.volume}</td>
                      <td style={{textAlign: "right"}}>{formatNumber(el.price)}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>
                  Price
                </th>
                <th>
                  Volume
                </th>
                <th>
                  Location
                </th>
              </tr>
              <tr>
                <th colSpan="3" style={{textAlign: "center"}}>
                  Buy: Top 5%
                </th>
              </tr>
            </thead>
            <tbody>
              {
                topBuy.length ? topBuy.map((el, i) => {
                  return (
                    <tr key={i} className={cx({[s.user_order]: this.isUserOrder(el.id)})}>
                      <td>{formatNumber(el.price)}</td>
                      <td>{el.volume}</td>
                      <td>{parseInt(el.stationID) > 1000000000000 ? "Citadel" : (this.props.sde.stationid2name[parseInt(el.stationID)] || "Station")}</td>
                    </tr>
                  )
                })
                : <tr><td colSpan="3" style={{textAlign: "center", backgroundColor: "rgba(153, 156, 160, 0.4)"}}>None</td></tr>
              }
            </tbody>
            <thead>
              <tr>
                <th colSpan="3" style={{textAlign: "center"}}>
                  Buy Orders
                </th>
              </tr>
            </thead>
            <tbody>
              {
                buyOrders.slice(0, 15).map((el, i) => {
                  return (
                    <tr key={i} className={cx({[s.user_order]: this.isUserOrder(el.id)})}>
                      <td>{formatNumber(el.price)}</td>
                      <td>{el.volume}</td>
                      <td>{parseInt(el.stationID) > 1000000000000 ? "Citadel" : (this.props.sde.stationid2name[parseInt(el.stationID)] || "Station")}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { market: store.market, sde: store.sde };
}

export default connect(mapStateToProps)(MarketBrowserOrderTable);