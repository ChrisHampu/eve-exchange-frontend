
import React from 'react';
import s from './MarketBrowserOrderTable.scss';
import { connect } from 'react-redux';
import store from '../../store';
import { formatNumber } from '../../utilities';

// station data
import { stationIDToName } from '../../sde/stationIDToName';

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

    if (typeof this.props.market.region[0] !== 'undefined'
      && typeof this.props.market.region[0].item[this.props.item.id] !== 'undefined'
      && typeof this.props.market.region[0].item[this.props.item.id].orders !== 'undefined') {
      return this.props.market.region[0].item[this.props.item.id].orders;
    }

    return [];
  }

  getMarketAggregates() {

    if (typeof this.props.market.region[0] !== 'undefined'
      && typeof this.props.market.region[0].item[this.props.item.id] !== 'undefined'
      && typeof this.props.market.region[0].item[this.props.item.id].aggregates !== 'undefined') {
      return this.props.market.region[0].item[this.props.item.id].aggregates;
    }

    return [];
  }

  render() {

    let sellOrders = this.getMarketOrders().filter(el => el.buy === false).sort((el1, el2) => el1.price - el2.price);
    let buyOrders = this.getMarketOrders().filter(el => el.buy === true).sort((el1, el2) => el2.price - el1.price);

    const aggregate = this.getMarketAggregates()[this.getMarketAggregates().length-1] || { sellFifthPercentile: 0, buyFifthPercentile: 0 };

    const topSell = sellOrders.splice(0, Math.min(10, sellOrders.filter(el => el.price > aggregate.sellFifthPercentile).length));
    const topBuy = buyOrders.splice(0, Math.min(10, buyOrders.filter(el => el.price > aggregate.buyFifthPercentile).length));

    return (
      <div className={s.market_item_order_container}>
        <div>
          <table>
            <thead>
              <tr>
                <th>
                  Location
                </th>
                <th>
                  Volume
                </th>
                <th>
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
                topSell ? topSell.map((el, i) => {
                  return (
                    <tr key={i}>
                      <td>{stationIDToName[el.stationID] || "Citadel"}</td>
                      <td>{el.volume}</td>
                      <td>{formatNumber(el.price)}</td>
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
                    <tr key={i}>
                      <td>{stationIDToName[el.stationID] || "Citadel"}</td>
                      <td>{el.volume}</td>
                      <td>{formatNumber(el.price)}</td>
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
                    <tr key={i}>
                      <td>{formatNumber(el.price)}</td>
                      <td>{el.volume}</td>
                      <td>{stationIDToName[el.stationID] || "Citadel"}</td>
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
                    <tr key={i}>
                      <td>{formatNumber(el.price)}</td>
                      <td>{el.volume}</td>
                      <td>{stationIDToName[el.stationID] || "Citadel"}</td>
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

/*
            this.getMarketOrders().filter(el => el.buy === true).sort((el1, el2) => el2.price - el1.price).slice(0, 20).map((el, i) => {
              return (
                <TableRow key={i} selectable={false} style={{height: "30px"}}>
                  <TableRowColumn style={{height: "30px"}}>{stationIDToName[el.stationID] || "Citadel"}</TableRowColumn>
                  <TableRowColumn style={{height: "30px"}}>{formatNumber(el.price)} ISK</TableRowColumn>
                  <TableRowColumn style={{height: "30px"}}>{el.volume}</TableRowColumn>
                </TableRow>
              )
            })
            */

const mapStateToProps = function(store) {
  return { market: store.market };
}

export default connect(mapStateToProps)(MarketBrowserOrderTable);