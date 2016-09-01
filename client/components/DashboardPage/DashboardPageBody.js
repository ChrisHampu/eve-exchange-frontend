/* eslint-disable global-require */
import React from 'react';
import s from './DashboardPageBody.scss';
import cx from 'classnames';

class DashboardPageBody extends React.Component {

  static propTypes = {
    defaultComponent: React.PropTypes.object.isRequired,
    padding: React.PropTypes.bool
  };

  render() {

    let ignorePadding = false;

    if (this.props.padding === false) {
      ignorePadding = true;
    }

    return (
      <div className={cx(s.body_container, { [s.nopadding]: ignorePadding })}>
        <div className={cx(s.body, { [s.nopadding]: ignorePadding })}>
          {this.props.children ? this.props.children : this.props.defaultComponent}
        </div>
      </div>
    );
  }
}

export default DashboardPageBody;