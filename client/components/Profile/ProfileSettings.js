/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './ProfileSettings.scss';
import cx from 'classnames';

import { updateChartSetting, updateGeneralSetting, updateMarketSetting } from '../../actions/settingsActions';

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'; 
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

class Settings extends React.Component {

  _updateGeneralSetting = (setting, newVal) => store.dispatch(updateGeneralSetting(setting, newVal));
  _updateMarketSetting = (setting, newVal) => store.dispatch(updateMarketSetting(setting, newVal));
  _updateChartSetting = (setting, newVal) => store.dispatch(updateChartSetting(setting, newVal));

  render() {

    return (
      <div className={s.root}>
        <div className={s.settings_area}>
          <div className={s.settings_area_header}>
          General
          </div>
          <div className={s.settings_body}>
            <div className={s.settings_header}>
            Subscription
            </div>
            <Checkbox
              className={s.checkbox}
              label="Auto Renew"
              checked={this.props.settings.general.auto_renew}
              onCheck={(ev, val) => this._updateGeneralSetting('auto_renew', val) }
            />
          </div>
        </div>
        <div className={s.settings_area}>
          <div className={s.settings_area_header}>
          Market
          </div>
          <div className={s.settings_body}>
            <div className={s.settings_header}>
            Default Hub
            </div>
            <SelectField value={this.props.settings.market.region} onChange={(event, index, value) => this._updateMarketSetting('region', value)}>
              <MenuItem value={10000002} primaryText="Jita" />
              <MenuItem value={10000043} primaryText="Amarr" />
              <MenuItem value={10000032} primaryText="Dodixie" />
              <MenuItem value={10000042} primaryText="Hek" />
              <MenuItem value={10000030} primaryText="Rens" />
            </SelectField>
          </div>
          <div className={s.settings_body}>
            <div className={s.settings_header}>
            Default Tab
            </div>
            <SelectField value={this.props.settings.market.default_tab||0} onChange={(event, index, value) => this._updateMarketSetting('default_tab', value)}>
              <MenuItem value={0} primaryText="Chart" />
              <MenuItem value={1} primaryText="Price Ladder" />
              <MenuItem value={2} primaryText="Simulate" />
            </SelectField>
          </div>
          <div className={s.settings_body}>
            <div className={s.settings_header}>
            Simulation Strategy
            </div>
            <SelectField value={this.props.settings.market.simulation_strategy||0} onChange={(event, index, value) => this._updateMarketSetting('simulation_strategy', value)}>
              <MenuItem value={0} primaryText="Undercut/Overcut Top Orders" />
              <MenuItem value={1} primaryText="Use Percentile Prices" />
            </SelectField>
          </div>
          <div className={s.settings_body}>
            <div className={s.settings_header}>
            Simulation Broker Fee
            </div>
            <TextField
              type="number"
              errorText={(this.props.settings.market.simulation_broker_fee >= 0 && this.props.settings.market.simulation_broker_fee <= 100) || !this.props.settings.market.simulation_broker_fee ? null : "Enter a percentage between 0 and 100"}
              floatingLabelText={`Current: ${this.props.settings.market.simulation_broker_fee||0}%`}
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={(event) => {

                const value = parseFloat(event.target.value);
                if (value >= 0 && value <= 100) {
                  this._updateMarketSetting('simulation_broker_fee', parseFloat(value));
                }
              }}
            />
          </div>
          <div className={s.settings_body}>
            <div className={s.settings_header}>
            Simulation Sales Tax
            </div>
            <TextField
              type="number"
              errorText={(this.props.settings.market.simulation_sales_tax >= 0 && this.props.settings.market.simulation_sales_tax <= 100) || !this.props.settings.market.simulation_sales_tax ? null : "Enter a percentage between 0 and 100"}
              floatingLabelText={`Current: ${this.props.settings.market.simulation_sales_tax||0}%`}
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block"}}
              onChange={(event) => {

                const value = parseFloat(event.target.value);
                if (value >= 0 && value <= 100) {
                  this._updateMarketSetting('simulation_sales_tax', parseFloat(value));
                }
              }}
            />
          </div>
          <div className={s.settings_body}>
            <div className={s.settings_header}>
            Simulation Margin Type
            </div>
            <SelectField value={this.props.settings.market.simulation_margin_type||0} onChange={(event, index, value) => this._updateMarketSetting('simulation_margin_type', value)}>
              <MenuItem value={0} primaryText="Exact Value" />
              <MenuItem value={1} primaryText="Percentage" />
            </SelectField>
          </div>
          <div className={s.settings_body}>
            <div className={s.settings_header}>
            Simulation Margin
            </div>
            <TextField
              type="number"
              errorText={(this.props.settings.market.simulation_margin >= 0 && this.props.settings.market.simulation_margin <= 100000000) || !this.props.settings.market.simulation_margin ? null : "Enter a value between 0 and 100M"}
              floatingLabelText={`Current: ${this.props.settings.market.simulation_margin||0} ${(this.props.settings.market.simulation_margin_type||0)===0?'ISK':'%'}`}
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block"}}
              onChange={(event) => {

                const value = parseFloat(event.target.value);
                if (value >= 0 && value <= 100000000) {
                  this._updateMarketSetting('simulation_margin', parseFloat(value));
                }
              }}
            />
          </div>
        </div>
        <div className={s.settings_area}>
          <div className={s.settings_area_header}>
          Market Chart Visualizations
          </div>
          <div className={s.settings_body}>
            <div className={s.settings_header}>
            Main Chart
            </div>
            <Checkbox
              className={s.checkbox}
              label="Price"
              checked={this.props.settings.chart_visuals.price}
              onCheck={(ev, val) => this._updateChartSetting('price', val) }
            />
            <Checkbox
              className={s.checkbox}
              label="Spread"
              checked={this.props.settings.chart_visuals.spread}
              onCheck={(ev, val) => this._updateChartSetting('spread', val) }
            />
            <Checkbox
              className={s.checkbox}
              label="Spread SMA"
              checked={this.props.settings.chart_visuals.spread_sma}
              onCheck={(ev, val) => this._updateChartSetting('spread_sma', val) }
            />
          </div>
         <div className={s.settings_body}>
            <div className={s.settings_header}>
            Sub Chart
            </div>
            <Checkbox
              className={s.checkbox}
              label="Volume"
              checked={this.props.settings.chart_visuals.volume}
              onCheck={(ev, val) => this._updateChartSetting('volume', val) }
            />
            <Checkbox
              className={s.checkbox}
              label="Volume SMA"
              checked={this.props.settings.chart_visuals.volume_sma}
              onCheck={(ev, val) => this._updateChartSetting('volume_sma', val) }
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(Settings);