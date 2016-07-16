/* eslint-disable global-require */
import React from 'react';;
import s from './DashboardPageComponent.scss';
import cx from 'classnames';

export default class DashboardPageComponent extends React.Component {

  render() {
    return (
      <div className={cx(s.root, this.props.className)} style={this.props.style}>
        <div className={s.page_title}>
          {this.props.title}
        </div>
        {this.props.children}
      </div>
    );
  }
}
