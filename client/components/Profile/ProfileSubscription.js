/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './ProfileSubscription.scss';
import cx from 'classnames';
import { performPremiumUpgrade, performPremiumDowngrade, performWithdrawal } from '../../actions/subscriptionActions';
import { formatNumber } from '../../utilities';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const PremiumPrice = 125000000;

class Subscription extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      subFilter: 0,
      withdrawal: null,
      subUpgradeDialogOpen: false,
      subDowngradeDialogOpen: false,
      withdrawalDialogOpen: false
    };
  }

  subscriptionLevelToName() {
    switch (this.props.subscription.premium) {
      case false:
        return "Free";
      case true:
        return <span style={{color: "rgb(235, 169, 27)"}}>Premium</span>;
    }
  }

  renderSubscriptionButtons() {

    let button = null;

    if (this.props.subscription.premium === false) {
      button = <RaisedButton backgroundColor="rgb(30, 35, 39)"
                            labelColor="rgb(235, 169, 27)"
                            label="Upgrade to Premium"
                            disabledBackgroundColor="rgb(30, 35, 39)"
                            disabled={this.props.subscription.balance < PremiumPrice}
                            onTouchTap={this.openSubUpgrade} />;
    } else {
      button = <RaisedButton backgroundColor="rgb(30, 35, 39)"
                            labelColor="rgb(235, 169, 27)"
                            label="Downgrade to Free"
                            onTouchTap={this.openSubDowngrade} />;
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
      info = <span>If you downgrade your account, you will lose access to all premium features and forfeit the remaining time for your active subscription.<br />
                Your balance will remain the same and can be used to upgrade again.</span>;
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
      return null;
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
                      disabled={!this.state.withdrawal || Number.isNaN(this.state.withdrawal) || parseInt(this.state.withdrawal) > this.props.subscription.balance || parseInt(this.state.withdrawal) < 0}
                      style={{marginBottom: ".8rem"}}
                      onTouchTap={this.openWithdrawalDialog} />
        <div>
        You may request a withdrawal at any time. Please allow up to 24 hours for processing.
        </div>
      </div>
    )
  }

  setSubFilter = (event, index, value) => this.setState({subFilter: value});
  setWithdrawal = (event) => this.setState({withdrawal: event.target.value});

  openSubUpgrade = () => this.setState({subUpgradeDialogOpen: true});
  closeSubUpgrade = () => this.setState({subUpgradeDialogOpen: false});

  openSubDowngrade = () => this.setState({subDowngradeDialogOpen: true});
  closeSubDowngrade = () => this.setState({subDowngradeDialogOpen: false});

  openWithdrawalDialog = () => this.setState({withdrawalDialogOpen: true});
  closeWithdrawalDialog = () => this.setState({withdrawalDialogOpen: false});

  doPremiumUpgrade() {

    store.dispatch(performPremiumUpgrade());

    this.closeSubUpgrade();
  };

  doPremiumDowngrade() {
    store.dispatch(performPremiumDowngrade());

    this.closeSubDowngrade();
  }

  doWithdrawal() {
    store.dispatch(performWithdrawal(this.state.withdrawal));

    this.closeWithdrawalDialog();
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
        onTouchTap={()=>{this.doPremiumUpgrade()}}
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
        onTouchTap={()=>{this.doPremiumDowngrade()}}
      />,
    ];

    const withdrawalDialogActions = [
      <FlatButton
        label="Cancel"
        labelStyle={{color: "rgb(235, 169, 27)"}}
        primary={true}
        onTouchTap={this.closeWithdrawalDialog}
      />,
      <FlatButton
        label="Confirm"
        labelStyle={{color: "rgb(235, 169, 27)"}}
        primary={true}
        keyboardFocused={true}
        onTouchTap={()=>{this.doWithdrawal()}}
      />,
    ];

    let history = [];

    if (this.props.subscription.deposit_history && this.props.subscription.withdrawal_history) {

      history = this.props.subscription.deposit_history
      .concat(this.props.subscription.withdrawal_history)
      .sort((el1, el2) => el1.time - el2.time);
    }

    return (
      <div className={s.root}>
        <Dialog
          actions={subUpgradeActions}
          modal={false}
          open={this.state.subUpgradeDialogOpen}
          onRequestClose={this.closeSubUpgrade}
        >
          Please confirm your upgrade to premium account services.
        </Dialog>
        <Dialog
          actions={subDowngradeActions}
          modal={false}
          open={this.state.subDowngradeDialogOpen}
          onRequestClose={this.closeSubDowngrade}
        >
          Please confirm your downgrade to free account services.<br />
          Any remaining time on your active subscription will be lost.
        </Dialog>
        <Dialog
          actions={withdrawalDialogActions}
          modal={false}
          open={this.state.withdrawalDialogOpen}
          onRequestClose={this.closeWithdrawalDialog}
        >
          Please confirm your withdrawal request.<br />
          Allow up to 24 hours for your request to be processed.
        </Dialog>
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
              Subscription Balance:
            </div>
            <div className={s.info_value}>
              {formatNumber(this.props.subscription.balance)} ISK
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
                <MenuItem type="text" value={0} primaryText="Show All" style={{cursor: "pointer"}}/>
                <MenuItem type="text" value={1} primaryText="Show Deposits" style={{cursor: "pointer"}} />
                <MenuItem type="text" value={2} primaryText="Show Withdrawals" style={{cursor: "pointer"}} />
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
                  <TableHeaderColumn>Status</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
              {
                history.map(el => {
                  return (
                    <TableRow selectable={false}>
                      <TableRowColumn>{el.time.toString()}</TableRowColumn>
                      <TableRowColumn>{el.type===0?"Deposit":"Withdrawal"}</TableRowColumn>
                      <TableRowColumn style={el.type===0?{color: "#4CAF50"}:{color: "#F44336"}}>{formatNumber(el.amount)} ISK</TableRowColumn>
                      <TableRowColumn>{el.description}</TableRowColumn>
                      <TableRowColumn>{el.process ? "Complete" : "In Progress"}</TableRowColumn>
                    </TableRow>
                  )
                })
              }
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