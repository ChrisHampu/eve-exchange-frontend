/* eslint-disable global-require */
import React from 'react';
import s from './DashboardPageMenu.scss';
import cx from 'classnames';

class DashboardPageMenu extends React.Component {

  static propTypes = {
    menu: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  setRoute(path) {

    this.context.router.push(path);
  }

  render() {

    return (
      <div className={s.menu_container}>
        <div className={s.menu}>
        {
          Object.keys(this.props.menu).map(key => {
            return (
              <div
                key={key}
                className={cx(s.menu_item, { [s.active]: this.props.location.pathname === this.props.menu[key] })} 
                onClick={()=>{this.setRoute(this.props.menu[key])}}
              >
                {key}
              </div>
            )
          })
        }
        </div>
      </div>
    );
  }
}

export default DashboardPageMenu;