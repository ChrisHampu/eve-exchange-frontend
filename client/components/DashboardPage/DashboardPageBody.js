/* eslint-disable global-require */
import React from 'react';
import s from './DashboardPageBody.scss';
import cx from 'classnames';

class DashboardPageBody extends React.Component {

  static propTypes = {
    defaultComponent: React.PropTypes.object.isRequired
  };

  render() {

    return (
      <div className={s.body_container}>
        <div className={s.body}>
          {this.props.children ? this.props.children : this.props.defaultComponent}
        </div>
      </div>
    );
  }
}

export default DashboardPageBody;