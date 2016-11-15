/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import s from './MarketBrowserSimulate.scss';
import cx from 'classnames';
import { browserHistory } from 'react-router';
import { formatNumber } from '../../utilities';
import { simulateTrade } from '../../market';

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

    let result = null;

    try {
      const simulation = simulateTrade(this.props.item.id, 1, this.props.market.item, this.props.settings, this.props.region);

      result = simulation[this.props.region];
    } catch(err) {

    }

    if (!this.props.data || !result) {
      return (
        <div>Loading...</div>
      )
    }

    return (
      <div className={s.container}>
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
            value={result.buy}
          />
          <RaisedButton
            backgroundColor="#1d2125"
            labelColor="rgb(235, 169, 27)"
            label="Copy"
            onTouchTap={()=>this.copyToClipboard(result.buy)}
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
            value={result.sell}
          />
          <RaisedButton
            backgroundColor="#1d2125"
            labelColor="rgb(235, 169, 27)"
            label="Copy"
            onTouchTap={()=>this.copyToClipboard(result.sell)}
          />
        </div>
        <div className={s.group}>
          <div className={s.item}>
          Broker's Fee: <span>{formatNumber(result.broker)}</span> ISK
          </div>
          <div className={s.item}>
          Sales Tax: <span>{formatNumber(result.tax)}</span> ISK
          </div>
        </div>
        <div className={s.profit}>Estimated Profit: <span>{formatNumber(result.profit)} ISK</span></div>
        {
          result.profit <= 0 || result.sell <= 0 || result.buy <= 0 ? <div style={{marginTop: "1.5rem"}}>There's no ideal trade for this item</div> : null
        }
        <textarea ref="clipboard" className={s.clipboard} />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings, market: store.market };
}

export default connect(mapStateToProps)(MarketBrowserSimulate);