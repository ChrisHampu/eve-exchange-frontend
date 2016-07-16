/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './ProfileSubscription.scss';
import cx from 'classnames';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const PremiumPrice = 125000000;

class Subscription extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      subFilter: 0,
      withdrawal: null
    };
  }

  subscriptionLevelToName() {
    switch (this.props.subscription.premium) {
      case false:
        return "Free";
      case true:
        return "Premium";
    }
  }

  renderSubscriptionButtons() {

    let button = null;

    if (this.props.subscription.premium === false) {
      button = <RaisedButton backgroundColor="rgb(30, 35, 39)"
                            labelColor="rgb(235, 169, 27)"
                            label="Upgrade to Premium"
                            disabledBackgroundColor="rgb(30, 35, 39)"
                            disabled={this.props.subscription.balance < PremiumPrice}/>;
    } else {
      button = <RaisedButton backgroundColor="rgb(30, 35, 39)"
                            labelColor="rgb(235, 169, 27)"
                            label="Downgrade to Free"/>;
    }

    return (
      <div className={s.info_row}>
        {button}
      </div>
    );
  }

  renderSubscriptionInfo() {

    let info = null;

    if (this.props.subscription.premium === false) {
      if (this.props.subscription.balance < PremiumPrice) {
        info = <span>You must have a minimum balance of {PremiumPrice} ISK to upgrade to premium.<br />
                Deposits can be made by following the instructions.</span>;
      } else {
        info = <span>By upgrading to premium you will gain access to all premium features for 30 days with an automatic renewal.<br />
                The upgrade process will be instant upon clicking the above button and confirming your subscription.</span>;
      }
    } else {
      info = <span>If you downgrade your account, you will lose access to all premium features and forfeit the remaining time for your active subscription.</span>;
    }

    return (
      <div className={s.info_row}>
        {info}
      </div>
    );
  }

  checkWithdrawalValid() {

    if (!this.state.withdrawal) {
      return null;
    }

    if (Number.isNaN(this.state.withdrawal) || parseInt(this.state.withdrawal) < 1) {
      return "Must be a valid number";
    }

    if (parseInt(this.state.withdrawal) > this.props.subscription.balance) {
      return "Must be less than balance";
    }

    return null;
  }

  renderWithdrawal() {

    if (this.props.subscription.balance === 0) {
      //return null;
    }

    return (
      <div className={cx(s.info_row, s.withdrawal_box)}>
        <TextField
          type="number"
          hintText="Must be less than balance"
          floatingLabelText="Widthrawal Amount"
          errorText={this.checkWithdrawalValid()}
          floatingLabelStyle={{color: "#BDBDBD"}}
          underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
          underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
          inputStyle={{color: "#FFF"}}
          style={{display: "block", marginBottom: ".8rem"}}
          onChange={this.setWithdrawal}
        />
        <RaisedButton backgroundColor="rgb(30, 35, 39)"
                      labelColor="rgb(235, 169, 27)"
                      label="Request Withdrawal"
                      disabledBackgroundColor="rgb(30, 35, 39)"
                      disabled={this.state.withdrawal === 0 || this.state.withdrawal > this.props.subscription.balance}
                      style={{marginBottom: ".8rem"}} />
        <div>
        You may request a withdrawal at any time. Please allow up to 24 hours for processing.
        </div>
      </div>
    )
  }

  setSubFilter = (event, index, value) => this.setState({subFilter: value});
  setWithdrawal = (event) => this.setState({withdrawal: event.target.value});

  render() {

    return (
      <div className={s.root}>
        <div className={s.subscription_info}>
          <div className={s.info_row}>
            <div className={s.info_key}>
              Subscription Level:
            </div>
            <div className={s.info_value}>
              {this.subscriptionLevelToName()}
            </div>
          </div>
          <div className={s.info_row}>
            <div className={s.info_key}>
              Subscription Expires:
            </div>
            <div className={s.info_value}>
              {this.props.subscription.expires ? "Soon" : "Never"}
            </div>
          </div>
          <div className={s.info_row}>
            <div className={s.info_key}>
              Current Balance:
            </div>
            <div className={s.info_value}>
              {this.props.subscription.balance} ISK
            </div>
          </div>
          {this.renderSubscriptionButtons()}
          {this.renderSubscriptionInfo()}
          {this.renderWithdrawal()}
        </div>
        <Divider />
        <div className={s.subscription_history}>
          <div className={s.subscription_history_header}>
            <div className={s.subscription_history_title}>
            Transaction History
            </div>
            <div className={s.subscription_history_selector}>
              <SelectField value={this.state.subFilter} onChange={this.setSubFilter}>
                <MenuItem type="text" value={0} primaryText="Show All" />
                <MenuItem type="text" value={1} primaryText="Show Deposits" />
                <MenuItem type="text" value={2} primaryText="Show Withdrawals" />
              </SelectField>
            </div>
          </div>
          <div className={s.subscription_history_table}>
            <Table selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn>Date</TableHeaderColumn>
                  <TableHeaderColumn>Type</TableHeaderColumn>
                  <TableHeaderColumn>Amount</TableHeaderColumn>
                  <TableHeaderColumn>Description</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                <TableRow selectable={false}>
                  <TableRowColumn>{(new Date()).toString()}</TableRowColumn>
                  <TableRowColumn>Widthrawal</TableRowColumn>
                  <TableRowColumn style={{color: "red"}}>-125,000,000 ISK</TableRowColumn>
                  <TableRowColumn>Subscription Fee</TableRowColumn>
                </TableRow>
                <TableRow selectable={false}>
                  <TableRowColumn>{(new Date()).toString()}</TableRowColumn>
                  <TableRowColumn>Deposit</TableRowColumn>
                  <TableRowColumn style={{color: "green"}}>+125,000,000 ISK</TableRowColumn>
                  <TableRowColumn>Player Deposit</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { subscription: store.subscription };
}

export default connect(mapStateToProps)(Subscription);