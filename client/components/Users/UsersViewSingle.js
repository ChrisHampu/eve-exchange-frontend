/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { formatNumberUnit } from '../../utilities';
import s from './UsersViewSingle.scss';


import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import CircularProgress from 'material-ui/CircularProgress';

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

    };
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  render() {

    const sub = this.props.subs.find(el => el.userID === this.props.params.id);

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
          Viewing {sub.userName}
          </div>
          <div className={s.status}>
          {sub.premium ? "Premium" : "Free"} User
          </div>
          <div className={s.balance}>
          Current Balance: {formatNumberUnit(sub.balance)}
          </div>
          <div className={s.actions}>
          Actions
          </div>
          <div className={s.history}>
          History
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { subs: store.admin.subscriptions };
}

export default connect(mapStateToProps)(UsersViewSingle);