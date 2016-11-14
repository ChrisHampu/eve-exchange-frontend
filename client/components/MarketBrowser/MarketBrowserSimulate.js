/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import s from './MarketBrowserSimulate.scss';
import cx from 'classnames';
import { browserHistory } from 'react-router';
import { formatNumber } from '../../utilities';

// Material UI
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class MarketBrowserSimulate extends React.Component {

  static propTypes = {

    item: React.PropTypes.object,
    data: React.PropTypes.object,
    region: React.PropTypes.number
  };


  constructor(props) {
    super(props);
  }

  copyToClipboard(value) {

    this.refs.clipboard.value = value;
    this.refs.clipboard.select();

    document.execCommand('copy');
  }

  render() {

    if (!this.props.data) {
      return (
        <div>Loading...</div>
      )
    }

    const simulated_buy = this.props.data.buyPercentile + (this.props.settings.market.simulation_margin ? this.props.settings.market.simulation_margin : 0);
    const simulated_sell = this.props.data.sellPercentile - (this.props.settings.market.simulation_margin ? this.props.settings.market.simulation_margin : 0);
    const estimated_broker = simulated_buy * (this.props.settings.market.simulation_broker_fee ? this.props.settings.market.simulation_broker_fee : 0) / 100;
    const estimated_tax = simulated_sell * (this.props.settings.market.simulation_sales_tax ? this.props.settings.market.simulation_sales_tax : 0) / 100;
    const estimated_profit = simulated_sell - simulated_buy - estimated_broker - estimated_tax;

    return (
      <div className={s.container}>
        <div className={s.settings}>
          <div className={s.preface}>
          Configured settings -
          </div>
          <div className={s.key}>
          Margin:
          </div>
          <div className={s.value}>
          {this.props.settings.market.simulation_margin||0} ISK
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
        <div>
          <TextField
            type="number"
            floatingLabelText={`Buy Price: ${formatNumber(this.props.data.buyPercentile)} ISK`}
            floatingLabelStyle={{color: "#BDBDBD"}}
            underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
            underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
            inputStyle={{color: "#FFF"}}
            style={{marginRight: "1rem"}}
            value={simulated_buy}
          />
          <RaisedButton
            backgroundColor="#1d2125"
            labelColor="rgb(235, 169, 27)"
            label="Copy"
            onTouchTap={()=>this.copyToClipboard(simulated_buy)}
          />
        </div>
        <div>
          <TextField
            type="number"
            floatingLabelText={`Sell Price: ${formatNumber(this.props.data.sellPercentile)} ISK`}
            floatingLabelStyle={{color: "#BDBDBD"}}
            underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
            underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
            inputStyle={{color: "#FFF"}}
            style={{marginRight: "1rem"}}
            value={simulated_sell}
          />
          <RaisedButton
            backgroundColor="#1d2125"
            labelColor="rgb(235, 169, 27)"
            label="Copy"
            onTouchTap={()=>this.copyToClipboard(simulated_sell)}
          />
        </div>
        <div className={s.group}>
          <div className={s.item}>
          Broker's Fee: <span>{formatNumber(estimated_broker)}</span> ISK
          </div>
          <div className={s.item}>
          Sales Tax: <span>{formatNumber(estimated_tax)}</span> ISK
          </div>
        </div>
        <div className={s.profit}>Estimated Profit: <span>{formatNumber(estimated_profit)} ISK</span></div>
        <textarea ref="clipboard" className={s.clipboard} />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(MarketBrowserSimulate);