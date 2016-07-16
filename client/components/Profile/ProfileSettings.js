/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
//import s from './ProfileComponent.scss';
import cx from 'classnames';

class Settings extends React.Component {

  render() {

    return (
      <div>
      Settings
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(Settings);