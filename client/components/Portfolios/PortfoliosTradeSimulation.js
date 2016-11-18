/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import cx from 'classnames';
import s from './PortfoliosTradeSimulation.scss';
import { formatNumber, formatNumberUnit } from '../../utilities';
import { itemIDToName } from '../../market';

// Material UI
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class PortfoliosTradeSimulation extends React.Component {

  static propTypes = {

    portfolio: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  copyToClipboard(value) {

    this.refs.clipboard.value = value;
    this.refs.clipboard.select();

    document.execCommand('copy');
  }
 
  render() {

    let total_buy = 0, total_sell = 0, total_fees = 0, estimated_profit = 0;

    for (const component of this.props.portfolio.components) {

      if (!component.simulation) {
        continue;
      }

      total_buy += component.simulation.buy;
      total_sell += component.simulation.sell;
      total_fees += component.simulation.broker + component.simulation.tax;
      estimated_profit += component.simulation.profit;
    }

    total_fees += this.props.settings.market.simulation_overhead || 0;

    return (
      <div className={s.root}>
        <div className={s.settings}>
          <div className={s.preface}>
          Simulation settings -
          </div>
          <div className={s.key}>
          Margin:
          </div>
          <div className={s.value}>
          {this.props.settings.market.simulation_margin||0}{(this.props.settings.market.simulation_margin_type||0)===0?' ISK':'%'}
          </div>
          <div className={s.key}>
          Broker's Fee:
          </div>
          <div className={s.value}>
          {this.props.settings.market.simulation_broker_fee||0}%
          </div>
          <div className={s.key}>
          Sales Tax:
          </div>
          <div className={s.value}>
          {this.props.settings.market.simulation_sales_tax||0}%
          </div>
          <div className={s.key}>
          Overhead:
          </div>
          <div className={s.value}>
          {this.props.settings.market.simulation_overhead||0} ISK
          </div>
          <div className={s.key}>
          Wanted Profit:
          </div>
          <div className={s.value}>
          {
            !this.props.settings.market.simulation_wanted_profit || this.props.settings.market.simulation_wanted_profit === 0 ?
            "Disabled" : `${this.props.settings.market.simulation_wanted_profit}%`
          }
          </div>
          <div className={s.edit}>
            <RaisedButton
              backgroundColor="rgb(30, 35, 39)"
              labelColor="rgb(235, 169, 27)"
              label="Change"
              primary={true}
              onTouchTap={()=>browserHistory.push("/dashboard/profile/settings")}
            />
          </div>
        </div>
        <div className={s.table}>
          <Table selectable={false}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn>Component</TableHeaderColumn>
                <TableHeaderColumn>Buy Price</TableHeaderColumn>
                <TableHeaderColumn>Sell Price</TableHeaderColumn>
                <TableHeaderColumn>Fees</TableHeaderColumn>
                <TableHeaderColumn>Profit</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
            {
              this.props.portfolio.components.map((el, i) => {

                if (!el.simulation) {
                  return (
                    <TableRow key={i} selectable={false}>
                      <TableRowColumn>{el.quantity}x {itemIDToName(el.typeID)}</TableRowColumn>
                      <TableRowColumn>No simulation data available</TableRowColumn>
                    </TableRow>
                  )
                }

                return (
                  <TableRow key={i} selectable={false}>
                    <TableRowColumn>{el.quantity}x {itemIDToName(el.typeID)}</TableRowColumn>
                    <TableRowColumn>
                      <TextField
                        type="number"
                        floatingLabelText={`${formatNumberUnit(el.simulation.buy)} ISK`}
                        floatingLabelStyle={{color: "#BDBDBD"}}
                        underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
                        underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
                        inputStyle={{color: "#FFF"}}
                        style={{marginRight: "1rem"}}
                        value={el.simulation.buy}
                      />

                    </TableRowColumn>
                    <TableRowColumn>
                      <TextField
                        type="number"
                        floatingLabelText={`${formatNumberUnit(el.simulation.sell)} ISK`}
                        floatingLabelStyle={{color: "#BDBDBD"}}
                        underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
                        underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
                        inputStyle={{color: "#FFF"}}
                        style={{marginRight: "1rem"}}
                        value={el.simulation.sell}
                      />

                    </TableRowColumn>
                    <TableRowColumn>
                      <div style={{marginBottom: "0.5rem"}}>Tax: {formatNumber(el.simulation.tax)}</div>
                      <div>Broker: {formatNumber(el.simulation.broker)}</div>
                    </TableRowColumn>
                    <TableRowColumn>{formatNumber(el.simulation.profit)}</TableRowColumn>
                    <TableRowColumn>
                      <RaisedButton
                        backgroundColor="#1d2125"
                        labelColor="rgb(235, 169, 27)"
                        label="Copy Buy"
                        onTouchTap={()=>this.copyToClipboard(el.simulation.buy)}
                        style={{display: "block", margin: "8px"}}
                      />
                      <RaisedButton
                        backgroundColor="#1d2125"
                        labelColor="rgb(235, 169, 27)"
                        label="Copy Sell"
                        onTouchTap={()=>this.copyToClipboard(el.simulation.sell)}
                        style={{display: "block", margin: "8px"}}
                      />
                    </TableRowColumn>
                  </TableRow>
                )
              })
            }
            </TableBody>
          </Table>
        </div>
        <div className={s.results}>
          <div className={s.result_group}>
            <div className={s.result_key}>
            Total buy:
            </div>
            <div className={s.result_value}>
            {formatNumber(total_buy)}
            </div>
          </div>
          <div className={s.result_group}>
            <div className={s.result_key}>
            Total sell:
            </div>
            <div className={s.result_value}>
            {formatNumber(total_sell)}
            </div>
          </div>
          <div className={s.result_group}>
            <div className={s.result_key}>
            Fees & Overhead:
            </div>
            <div className={s.result_value}>
            {formatNumber(total_fees)}
            </div>
          </div>
          <div className={s.result_group}>
            <div className={cx(s.result_key, s.result_profit_key)}>
            Estimated profit:
            </div>
            <div className={cx(s.result_value, s.result_profit_value)}>
            {formatNumber(estimated_profit)}
            </div>
          </div>
        </div>
        <textarea ref="clipboard" className={s.clipboard} />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(PortfoliosTradeSimulation);