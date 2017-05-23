/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import cx from 'classnames';
import s from './AlertsCreate.scss';
import { getMarketItemNames, marketItemFilter, itemNameToID, subscribeItem, unsubscribeItem } from '../../market';
import { roundNumber } from '../../utilities';
import store from '../../store';
import { } from '../../actions/alertActions';
import { sendAppNotification } from '../../actions/appActions';
import { APIEndpointURL } from '../../globals';
import { getAuthToken } from '../../deepstream';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

class AlertsCreate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      alertType: 0,
      frequency: 24,
      priceAlertPriceType: 0,
      priceAlertComparator: 0,
      priceAlertAmount: 0,
      priceAlertItemID: 0,
      processing: false,
      salesAlertType: 0,
      salesAlertProfile: 0,
      priceAlertItemSearch: 0
    };
  }

  componentWillReceiveProps() {

    if (this.state.alertType === 0 && !this.state.priceAlertAmount) {

      this.updatePriceValue();
    }
  }

  onChangeAlertType = (event, index, value) => this.setState({ alertType: value });
  onChangePriceItem = (chosen) => {

    const id = itemNameToID(chosen);

    if (this.state.priceAlertItemID) {
      unsubscribeItem(this.state.priceAlertItemID);
    }

    this.setState({ priceAlertItemID: parseInt(id, 10), priceAlertAmount: 0 }, () => setTimeout(() => subscribeItem(id), 250));
  };

  onUpdatePriceItemSearch = (text) => { 

    this.setState({
      priceAlertItemSearch: text
    }, () => {

      if (!this.state.priceAlertItemSearch) {
        this.setError('Enter search text to find an item for the alert');
        return;
      }

      const searchText = this.state.priceAlertItemSearch.toLowerCase();

      const searchRes = Object.values(store.getState().sde.market_items).map(el => {
        return { upper: el, lower: el.toLowerCase() };
      }).find(el => el.lower === searchText);

      if (!searchRes) {
        this.setError('Can\'t find an item with the given name. Use the autocomplete to select your item');
        return;
      } else {
        this.setState({
          error: null
        }, () => this.onChangePriceItem(searchRes.upper));
      }
    });
  };

  setRoute(route) {

    browserHistory.push(route);
  }

  getPriceAlertItemValue() {

    const region = this.props.settings.market.region || 10000002;
    let key = 'buyPercentile';
    const id = parseInt(this.state.priceAlertItemID, 10);

    if (!id) {
      return 0;
    }

    if (this.state.priceAlertPriceType === 1) {
      key = 'sellPercentile';
    } else if (this.state.priceAlertPriceType === 2) {
      key = 'spread';
    } else if (this.state.priceAlertPriceType === 3) {
      key = 'tradeVolume';
    }

    if (this.props.market.item.hasOwnProperty(id)) {
      if (this.props.market.item[id].daily) {
        if (this.props.market.item[id].daily.hasOwnProperty(region)) {

          const docs = this.props.market.item[id].daily[region];

          if (!docs.length) {
            return 0;
          }

          return roundNumber(docs[0][key]);
        }
      }
    }

    return 0;
  }

  updatePriceValue() {
    const value = this.getPriceAlertItemValue();

    if (value) {
      this.setState({
        priceAlertAmount: parseFloat(value, 10)
      });
    }
  }

  setError(error) {
    this.setState({ error });
  }

  createAlert() {

    // Validate
    if (this.state.alertType === 0) {
      if (!this.state.priceAlertItemID) {
        this.setError('Select an item to create the alert for');
        return;
      }

      if (!this.state.priceAlertAmount || isNaN(parseFloat(this.state.priceAlertAmount, 10))) {
        this.setError('Select a proper indicator value to use in the alert');
        return;
      }
    }

    // Use state, but add/remove wanted or unwanted keys
    const alert = Object.assign({}, this.state, {
      error: undefined,
      processing: undefined,
      priceAlertItemSearch: undefined
    });

    this.setState({
      error: null,
      processing: true
    }, () => {

      fetch(`${APIEndpointURL}/alerts/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Token ${getAuthToken()}`
        },
        body: JSON.stringify(alert)
      })
      .then(res => res.json())
      .then(result => {

        if (result.error) {

          this.setState({
            error: result.error,
            processing: false
          });

        } else {

          this.setState({
            error: null,
            processing: false
          });

          store.dispatch(sendAppNotification('New alert has been created'));

          setTimeout(() => this.setRoute('/dashboard/alerts/'), 1000);
        }
      });
    });
  }

  renderAlertType() {

    // <MenuItem value={3} primaryText='Trade Volume' />

    if (this.state.alertType === 0) {
      return (
        <div className={s.row}>
          <div className={s.row}>
            <div className={s.text}>For</div>
            <AutoComplete
              floatingLabelText='Item name'
              dataSource={getMarketItemNames().sort((el1, el2) => el1.length - el2.length)}
              filter={marketItemFilter}
              maxSearchResults={10}
              menuStyle={{ cursor: 'pointer' }}
              onNewRequest={this.onChangePriceItem}
              onUpdateInput={this.onUpdatePriceItemSearch}
              floatingLabelStyle={{ color: '#BDBDBD' }}
              underlineStyle={{ borderColor: 'rgba(255, 255, 255, 0.298039)' }}
              underlineFocusStyle={{ borderColor: 'rgb(235, 169, 27)' }}
              style={{ verticalAlign: 'text-bottom' }}
            />
          </div>
          <div className={s.text}>When</div>
          <SelectField
            floatingLabelText='Indicator'
            value={this.state.priceAlertPriceType}
            onChange={(event, index, value) => this.setState({ priceAlertPriceType: value }, () => this.updatePriceValue())}
            className={s.select}
          >
            <MenuItem value={0} primaryText='Buy Price' />
            <MenuItem value={1} primaryText='Sell Price' />
            <MenuItem value={2} primaryText='Spread' />
          </SelectField>
          <SelectField
            floatingLabelText='Comparator'
            value={this.state.priceAlertComparator}
            onChange={(event, index, value) => this.setState({ priceAlertComparator: value })}
            className={s.select}
          >
            <MenuItem value={0} primaryText='Greater than' />
            <MenuItem value={1} primaryText='Less than' />
            <MenuItem value={2} primaryText='Equals' />
          </SelectField>
          <TextField
            floatingLabelText='Value (number)'
            type='number'
            value={this.state.priceAlertAmount}
            className={s.numberField}
            onChange={(ev, value) => this.setState({ priceAlertAmount: parseFloat(value) })}
            min='1'
          />
        </div>
      );
    } else if (this.state.alertType === 1) {
      return (
        <div className={s.row}>
          <div className={s.row}>
            <div className={s.text}>For</div>
            <SelectField
              floatingLabelText='Profile'
              value={this.state.salesAlertProfile}
              onChange={(event, index, value) => this.setState({ salesAlertProfile: value })}
              className={s.select}
            >
              <MenuItem value={0} primaryText='Any Profile' />
              {
                this.props.settings.profiles.map(el => {
                  return el.type === 0 ? <MenuItem key={el.character_id} value={el.character_id} primaryText={el.character_name} />
                  : <MenuItem key={el.corporation_id} value={el.corporation_id} primaryText={el.corporation_name} />;
                })
              }
            </SelectField>
          </div>
          <div className={s.row}>
            <div className={s.text}>When</div>
            <SelectField
              floatingLabelText='Order change'
              value={this.state.salesAlertType}
              onChange={(event, index, value) => this.setState({ salesAlertType: value })}
              className={s.select}
            >
              <MenuItem value={0} primaryText='Items Bought' />
              <MenuItem value={1} primaryText='Items Sold' />
              <MenuItem value={2} primaryText='Order Fulfilled' />
            </SelectField>
          </div>
        </div>
      );
    }

    return null;
  }

  renderDisclaimer() {
    return (
      <div className={cx(s.row, s.disclaimer)}>
          {
            this.state.alertType === 0 && <span>You will receive an alert by eve-mail and/or browser notification when the indicator you select meets the market condition you configure. You can adjust your <span className={s.link} onClick={() => this.setRoute('/dashboard/profile/settings')}>notification settings</span> as well as limit how often (in hours) an alert can be triggered.</span>
          }
          {
            this.state.alertType === 1 && <span>You will receive an alert by eve-mail and/or browser notification when an order change meets the conditions you set. You can adjust your <span className={s.link} onClick={() => this.setRoute('/dashboard/profile/settings')}>notification settings</span> as well as limit how often (in hours) an alert can be triggered.<div>Sales alerts are most effective for long term orders due to limitations with the EVE API & caching.</div></span>
          }
      </div>
    );
  }

  render() {

    return (
      <div className={s.root}>
        <div className={s.row}>
          <div className={s.text}>Trigger</div>
          <SelectField
            floatingLabelText='Alert Type'
            value={this.state.alertType}
            onChange={this.onChangeAlertType}
          >
            <MenuItem value={0} primaryText='Price Alert' />
            <MenuItem value={1} primaryText='Sales Alert' />
          </SelectField>
        </div>
        {this.renderAlertType()}
        <div className={s.row}>
          <div className={s.text}>At most every</div>
          <TextField
            floatingLabelText='Limit (number)'
            type='number'
            value={this.state.frequency}
            className={s.numberField}
            onChange={(ev, value) => this.setState({ frequency: parseInt(value, 10) })}
          />
          <div className={s.text}>hours</div>
        </div>
        {this.renderDisclaimer()}
        <div className={s.row}>
          <RaisedButton
            backgroundColor='rgb(30, 35, 39)'
            labelColor='rgb(235, 169, 27)'
            label='Create Alert'
            primary
            onTouchTap={() => this.createAlert()}
            disabled={this.state.processing}
          />
          <div className={s.error}>
          {this.state.error}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function (store) { return { alerts: store.alerts, settings: store.settings, market: store.market }; };

export default connect(mapStateToProps)(AlertsCreate);
