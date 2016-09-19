/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';

import Snackbar from 'material-ui/Snackbar';

class AppSnackbar extends React.Component {

  static propTypes = {
    className: React.PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      message: ""
    };
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;

    if (this.props.notification) {

      this.setState({
        open: true,
        message: this.props.notification
      });
    } else if(this.state.open) {

      this.setState({
        open: false
      });
    }
  }

  render() {

    return (
      <Snackbar
        className={this.props.className}
        open={this.state.open}
        message={this.state.message}
        autoHideDuration={2500}
      />
    )
  }
}

const mapStateToProps = function(store) {
  return { notification: store.app.notification };
}

export default connect(mapStateToProps)(AppSnackbar);