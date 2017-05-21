/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import s from './AlertsViewSingle.scss';
import { sendAppNotification } from '../../actions/appActions';
import store from '../../store';
import { APIEndpointURL } from '../../globals';
import { getAuthToken } from '../../deepstream';
import { prettyDate } from '../../utilities';
import AlertsViewPriceType from './AlertsViewPriceType';

import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import PauseIcon from 'material-ui/svg-icons/av/pause';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

class AlertsViewSingle extends React.Component {

  static propTypes = {
    _id: React.PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      removeDialogOpen: false
    };
  }

  getAlertName() {

    if (this.props.alertType === 0) {
      return 'Price Alert';
    }

    return 'Sales Alert';
  }

  toggleAlert() {

    const state = this.props.paused;

    fetch(`${APIEndpointURL}/alerts/toggle/${this.props._id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Token ${getAuthToken()}`
      }
    })
    .then(res => res.json())
    .then(result => {

      if (result.error) {
        store.dispatch(sendAppNotification(result.error));
      } else {
        store.dispatch(sendAppNotification(state === true ? 'Alert is no longer paused' : 'Alert is now paused'));
      }
    });
  }

  resetAlert() {

    fetch(`${APIEndpointURL}/alerts/reset/${this.props._id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Token ${getAuthToken()}`
      }
    })
    .then(res => res.json())
    .then(result => {

      if (result.error) {
        store.dispatch(sendAppNotification(result.error));
      } else {
        store.dispatch(sendAppNotification('Delay until next alert trigger has been reset'));
      }
    });
  }


  removeAlert() {

    fetch(`${APIEndpointURL}/alerts/remove/${this.props._id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Token ${getAuthToken()}`
      }
    })
    .then(res => res.json())
    .then(result => {

      if (result.error) {
        store.dispatch(sendAppNotification(result.error));
      } else {
        store.dispatch(sendAppNotification('Alert has been removed'));
      }

      this.setState({ removeDialogOpen: false });
    });
  }

  render() {

    const tooltipStyle = {
      transform: 'translate(0, 7px)',
      left: '-18px',
      top: '30px',
      fontSize: '12px'
    };

    const removeActions = [
      <FlatButton
        label='Cancel'
        labelStyle={{ color: 'rgb(235, 169, 27)' }}
        primary
        onTouchTap={() => this.setState({ removeDialogOpen: false })}
      />,
      <FlatButton
        label='Confirm'
        labelStyle={{ color: 'rgb(235, 169, 27)' }}
        primary
        keyboardFocused
        onTouchTap={() => this.removeAlert()}
      />,
    ];

    return (
      <div className={s.root}>
        <Dialog
          actions={removeActions}
          modal={false}
          open={this.state.removeDialogOpen}
          onRequestClose={() => this.setState({ removeDialogOpen: false })}
        >
          Are you sure you want to delete this alert?
        </Dialog>
        <div className={s.header}>
          <div className={s.name}>{this.getAlertName()}</div>
          <IconButton
            tooltip='Delete alert'
            className={s.pause_button}
            tooltipStyles={tooltipStyle}
            onTouchTap={() => this.setState({ removeDialogOpen: true })}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            tooltip={this.props.paused?'Resume alert':'Pause alert'}
            className={s.pause_button}
            tooltipStyles={tooltipStyle}
            onTouchTap={() => this.toggleAlert()}
          >
            {this.props.paused ? <PlayIcon /> : <PauseIcon />}
          </IconButton>
          <IconButton
            tooltip={'Reset alert delay'}
            className={s.pause_button}
            tooltipStyles={tooltipStyle}
            onTouchTap={() => this.resetAlert()}
          >
            <RefreshIcon />
          </IconButton>
        </div>
        <div className={s.body}>
          {
            this.props.alertType === 0 && <AlertsViewPriceType {...this.props} />
          }
          <div className={s.last_trigger}>
            <div>{!this.props.lastTrigger ? 'Has not triggered yet' : `Triggered ${prettyDate(this.props.lastTrigger)}`}</div>
            <div>{new Date(this.props.nextTrigger) < new Date() ? 'Ready to trigger' : `Can trigger again ${prettyDate(this.props.nextTrigger)}`}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function (store) { return { settings: store.settings }; };

export default connect(mapStateToProps)(AlertsViewSingle);
