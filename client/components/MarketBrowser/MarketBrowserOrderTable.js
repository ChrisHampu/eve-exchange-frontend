
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


  render() {
    return (
      <div className={s.market_item_order_container}>
        <Table selectable={false} wrapperStyle={{paddingBottom: "0px", marginBottom: "20px"}} style={{backgroundColor: "rgb(38, 43, 47)"}} height="calc(100% - 70px)">
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow style={{height: "30px"}}>
              <TableHeaderColumn colSpan="3" style={{height: "30px", textAlign: 'center'}}>
                Top 20 Sell Orders
              </TableHeaderColumn>
            </TableRow>
            <TableRow selectable={false} style={{height: "30px"}}>
              <TableHeaderColumn style={{height: "30px"}}>Location</TableHeaderColumn>
              <TableHeaderColumn style={{height: "30px"}}>Price</TableHeaderColumn>
              <TableHeaderColumn style={{height: "30px"}}>Volume Remaining</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody stripedRows={true} displayRowCheckbox={false}>
          {
            this.getMarketOrders().filter(el => el.buy === false).sort((el1, el2) => el1.price - el2.price).slice(0, 20).map((el, i) => {
              return (
                <TableRow key={i} selectable={false} style={{height: "30px"}}>
                  <TableRowColumn style={{height: "30px"}}>{stationIDToName[el.stationID] || "Citadel"}</TableRowColumn>
                  <TableRowColumn style={{height: "30px"}}>{formatNumber(el.price)} ISK</TableRowColumn>
                  <TableRowColumn style={{height: "30px"}}>{el.volume}</TableRowColumn>
                </TableRow>
              )
            })
          }
          </TableBody>
        </Table>
        <Table selectable={false} wrapperStyle={{paddingBottom: "0px"}} style={{backgroundColor: "rgb(38, 43, 47)"}} height="calc(100% - 70px)">
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow style={{height: "30px"}}>
              <TableHeaderColumn colSpan="3" style={{height: "30px", textAlign: 'center'}}>
                Top 20 Buy Orders
              </TableHeaderColumn>
            </TableRow>
            <TableRow selectable={false} style={{height: "30px"}}>
              <TableHeaderColumn style={{height: "30px"}}>Location</TableHeaderColumn>
              <TableHeaderColumn style={{height: "30px"}}>Price</TableHeaderColumn>
              <TableHeaderColumn style={{height: "30px"}}>Volume Remaining</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody stripedRows={true} displayRowCheckbox={false}>
          {
            this.getMarketOrders().filter(el => el.buy === true).sort((el1, el2) => el2.price - el1.price).slice(0, 20).map((el, i) => {
              return (
                <TableRow key={i} selectable={false} style={{height: "30px"}}>
                  <TableRowColumn style={{height: "30px"}}>{stationIDToName[el.stationID] || "Citadel"}</TableRowColumn>
                  <TableRowColumn style={{height: "30px"}}>{formatNumber(el.price)} ISK</TableRowColumn>
                  <TableRowColumn style={{height: "30px"}}>{el.volume}</TableRowColumn>
                </TableRow>
              )
            })
          }
          </TableBody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { market: store.market };
}

export default connect(mapStateToProps)(MarketBrowserOrderTable);