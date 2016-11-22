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
      message: "",
      duration: 3000
    };
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;

    if (this.props.notification) {

      this.setState({
        open: true,
        message: this.props.notification.message,
        duration: this.props.notification.duration
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
        autoHideDuration={this.state.duration}
      />
    )
  }
}

const mapStateToProps = function(store) {
  return { notification: store.app.notification };
}

export default connect(mapStateToProps)(AppSnackbar);