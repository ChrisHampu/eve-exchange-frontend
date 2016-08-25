/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './ProfileSettings.scss';
import cx from 'classnames';

import { updateChartSetting } from '../../actions/settingsActions';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'; 
import Checkbox from 'material-ui/Checkbox';

/*
        <RadioButtonGroup name="mainChart" defaultSelected="minutes" className={s.radios}> 
          <RadioButton 
            value="minutes" 
            label="5 Minutes" 
          /> 
          <RadioButton 
            value="hours" 
            label="1 Hour" 
          /> 
          <RadioButton 
            value="days" 
            label="1 Day" 
          /> 
          <RadioButton 
            value="months" 
            label="1 Month" 
          /> 
        </RadioButtonGroup> 
        */

class Settings extends React.Component {

  updateSetting = (setting, newVal) => store.dispatch(updateChartSetting(setting, newVal));

  render() {

    return (
      <div className={s.root}>
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
              onCheck={(ev, val) => this.updateSetting('price', val) }
            />
            <Checkbox
              className={s.checkbox}
              label="Spread"
              checked={this.props.settings.chart_visuals.spread}
              onCheck={(ev, val) => this.updateSetting('spread', val) }
            />
            <Checkbox
              className={s.checkbox}
              label="Spread SMA"
              checked={this.props.settings.chart_visuals.spread_sma}
              onCheck={(ev, val) => this.updateSetting('spread_sma', val) }
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
              onCheck={(ev, val) => this.updateSetting('volume', val) }
            />
            <Checkbox
              className={s.checkbox}
              label="Volume SMA"
              checked={this.props.settings.chart_visuals.volume_sma}
              onCheck={(ev, val) => this.updateSetting('volume_sma', val) }
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