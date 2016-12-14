/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s1 from './ProfileAPIAccess.scss';
import s2 from './ProfileSubscription.scss';
import cx from 'classnames';
import { getAuthToken } from '../../deepstream';
import { APIEndpointURL } from '../../globals';
import { sendAppNotification } from '../../actions/appActions';
import { formatNumber } from '../../utilities';
import GuidebookLink from '../Guidebook/GuidebookLink';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton'

class APIAccess extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      subUpgradeDialogOpen: false,
      subDowngradeDialogOpen: false
    };
  }

  getAccessCost() {
    return 150000000;
  }

  openSubUpgrade = () => this.setState({subUpgradeDialogOpen: true});
  closeSubUpgrade = () => this.setState({subUpgradeDialogOpen: false});

  openSubDowngrade = () => this.setState({subDowngradeDialogOpen: true});
  closeSubDowngrade = () => this.setState({subDowngradeDialogOpen: false});

  doEnableAPI() {

    fetch(`${APIEndpointURL}/subscription/api/enable`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${getAuthToken()}`
      }
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (res.error) {
        // Something went wrong
        store.dispatch(sendAppNotification("There was a problem processing your request: " + res.error, 5000));
      } else {
        store.dispatch(sendAppNotification(res.message));
      }
    });

    this.closeSubUpgrade();
  };

  doDisableAPI() {
    
    fetch(`${APIEndpointURL}/subscription/api/disable`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${getAuthToken()}`
      }
    })
    .then(res => {
      return res.json();
    })
    .then(res => {
      if (res.error) {
        // Something went wrong
        store.dispatch(sendAppNotification("There was a problem processing your request: " + res.error, 5000));
      } else {
        store.dispatch(sendAppNotification(res.message));
      }
    });

    this.closeSubDowngrade();
  }

  renderActivation() {

    if (this.props.settings.premium === false) {
      return <div>You need an active premium subscription in order to enable API access.</div>;
    }

    if (this.props.subscription.api_access === true) {
      return (
        <RaisedButton 
          backgroundColor="rgb(30, 35, 39)"
          labelColor="rgb(235, 169, 27)"
          label="Disable API Access"
          disabledBackgroundColor="rgb(30, 35, 39)"
          onTouchTap={this.openSubDowngrade} 
        />
      );
    }

    const cost = this.getAccessCost();

    return (
      <RaisedButton 
        backgroundColor="rgb(30, 35, 39)"
        labelColor="rgb(235, 169, 27)"
        label="Enable API Access"
        disabledBackgroundColor="rgb(30, 35, 39)"
        disabled={this.props.subscription.balance < cost}
        onTouchTap={this.openSubUpgrade} 
      />
    );
  }

  render() {

    const subUpgradeActions = [
      <FlatButton
        label="Cancel"
        labelStyle={{color: "rgb(235, 169, 27)"}}
        primary={true}
        onTouchTap={this.closeSubUpgrade}
      />,
      <FlatButton
        label="Confirm"
        labelStyle={{color: "rgb(235, 169, 27)"}}
        primary={true}
        keyboardFocused={true}
        onTouchTap={()=>{this.doEnableAPI()}}
      />,
    ];

    const subDowngradeActions = [
      <FlatButton
        label="Cancel"
        labelStyle={{color: "rgb(235, 169, 27)"}}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.closeSubDowngrade}
      />,
      <FlatButton
        label="Confirm"
        labelStyle={{color: "rgb(235, 169, 27)"}}
        primary={true}
        onTouchTap={()=>{this.doDisableAPI()}}
      />,
    ];

    return (
      <div className={s1.root}>
        <Dialog
          actions={subUpgradeActions}
          modal={false}
          open={this.state.subUpgradeDialogOpen}
          onRequestClose={this.closeSubUpgrade}
        >
          Please confirm your request to enable API access.
        </Dialog>
        <Dialog
          actions={subDowngradeActions}
          modal={false}
          open={this.state.subDowngradeDialogOpen}
          onRequestClose={this.closeSubDowngrade}
        >
          Please confirm your request to disable API access.<br />
        </Dialog>
        <GuidebookLink settingsKey="api_access" page="api" />
        <div className={s2.subscription_info} style={{marginTop: "1.5rem"}}>
          <div className={s2.info_row}>
            <div className={s2.info_key}>Your API key</div>
            <div className={s2.info_value}>{this.props.settings.api_key}</div>
          </div>
          <div className={s2.info_row}>
            <div className={s2.info_key}>Access Status</div>
            <div className={s2.info_value}>{this.props.subscription.api_access===true?<div style={{color: "#4CAF50"}}>Enabled</div>:<div style={{color: "#F44336"}}>Disabled</div>}</div>
          </div>
          <div className={s2.info_row}>
            <div className={s2.info_key}>Access Cost (Monthly)</div>
            <div className={s2.info_value}>
            {formatNumber(this.getAccessCost())} ISK
            </div>
          </div>
        </div>
        {
          this.renderActivation()
        }
        <div></div>
        <div>
          <p>The API access cost is prorated from the current day to the day your premium subscription renews, and will then cost the full amount to renew alongside your premium subscription.</p>
          <p>Benefits of subscribing to API access includes access to all 23+ endpoints fully documented at <a target="_blank" href="https://api.eve.exchange">our API page</a>.</p>
          <p>Including the following useful endpoints:</p>
          <ul>
            <li>Current market prices (5 minute cache time)</li>
            <li>Market history (5 minutes, hourly, daily)</li>
            <li>Retrieving portfolios</li>
            <li>Retrieving market orders for all profiles</li>
            <li>Retrieving account notifications</li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings, subscription: store.subscription };
}

export default connect(mapStateToProps)(APIAccess);