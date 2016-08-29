/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import SubscriptionHistory from './SubscriptionHistory';

class ProfileSubscriptionHistory extends React.Component {

  render() {

    return (
      <SubscriptionHistory subscription={this.props.subscription} />
    );
  }
}

const mapStateToProps = function(store) {
  return { subscription: store.subscription };
}

export default connect(mapStateToProps)(ProfileSubscriptionHistory);