/* eslint-disable global-require */
import React from 'react';;
import s from './DashboardPageComponent.scss';
import cx from 'classnames';

export default class DashboardPageComponent extends React.Component {

  static propTypes = {
    fullWidth: React.PropTypes.bool.isRequired,
    style: React.PropTypes.object,
    titleStyle: React.PropTypes.object
  };

  static defaultProps = {
    fullWidth: false
  };

  render() {

    return (
      <div className={cx(s.root, { [s.full]: this.props.fullWidth }, this.props.className)} style={this.props.style}>
        <div className={s.container}>
          {
            this.props.title ? 
              <div className={s.page_title} style={this.props.titleStyle}>
                {this.props.title}
              </div> : false
          }
          {this.props.children}
        </div>
      </div>
    );
  }
}
