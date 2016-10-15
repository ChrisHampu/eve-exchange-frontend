/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { formatNumberUnit, formatDate } from '../../utilities';
import deepstream from '../../deepstream';
import s from './UsersViewSingle.scss';

import SubscriptionHistory from '../Profile/SubscriptionHistory';

import TextField from 'material-ui/TextField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

import AddIcon from 'material-ui/svg-icons/content/add';
import RemoveIcon from 'material-ui/svg-icons/content/remove';

class UsersViewSingle extends React.Component {

  static propTypes = {
    params: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      addBalance: null,
      removeBalance: null
    };
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  setAddBalance = (event) => this.setState({addBalance: event.target.value || null});
  setRemoveBalance = (event) => this.setState({removeBalance: event.target.value || null});

  doAddBalance() {

    const sub = this.getSubscription();

    const newBal = parseInt(this.state.addBalance);

    if (!newBal) {
      return;
    }

    deepstream.event.emit('admin_add_balance', {
      user_id: sub.user_id,
      admin_id: store.getState().auth.id,
      admin_name: store.getState().auth.name,
      balance: newBal
    });
  }

  doRemoveBalance() {

    const sub = this.getSubscription();

    const newBal = parseInt(this.state.removeBalance);

    if (!newBal) {
      return;
    }

    deepstream.event.emit('admin_remove_balance', {
      user_id: sub.user_id,
      admin_id: store.getState().auth.id,
      admin_name: store.getState().auth.name,
      balance: newBal
    });
  }

  getSubscription() {

    return this.props.subs.find(el => el.user_id === parseInt(this.props.params.id));
  }

  render() {

    const sub = this.getSubscription();

    if (!sub) {
      return (
        <div style={{display: "flex", alignItems: "center", width: "100%", height: "100%"}}>
          <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
        </div>
      )
    }

    return (
      <div className={s.root}>
        <div className={s.content}>
          <div className={s.title}>
          Viewing <span className={s.name}>{sub.user_name}</span>
          </div>
          <div className={s.status}>
          {sub.premium ? <span><span className={s.premium}>Premium</span> expires {formatDate(new Date(new Date(sub.subscription_date).getTime() + 2592000000))}</span> : "Free"}
          </div>
          <div className={s.balance}>
          {formatNumberUnit(sub.balance)} Balance
          </div>
          <div className={s.actions}>
            <div>
              <TextField
                type="number"
                floatingLabelText="Add Balance"
                floatingLabelStyle={{color: "#BDBDBD"}}
                underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
                underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
                inputStyle={{color: "#FFF"}}
                style={{display: "inline-block"}}
                onChange={this.setAddBalance}
              />
              <FlatButton className={s.button} icon={<AddIcon />} label="Add Balance" secondary={true} onTouchTap={()=>{this.doAddBalance()}} />
            </div>
            <div>
              <TextField
                type="number"
                floatingLabelText="Remove Balance"
                floatingLabelStyle={{color: "#BDBDBD"}}
                underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
                underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
                inputStyle={{color: "#FFF"}}
                style={{display: "inline-block"}}
                onChange={this.setRemoveBalance}
              />
              <FlatButton className={s.button} icon={<RemoveIcon />} label="Remove Balance" secondary={true} onTouchTap={()=>{this.doRemoveBalance()}} />
            </div>
          </div>
          <SubscriptionHistory subscription={sub} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { subs: store.admin.subscriptions, auth: store.auth };
}

export default connect(mapStateToProps)(UsersViewSingle);