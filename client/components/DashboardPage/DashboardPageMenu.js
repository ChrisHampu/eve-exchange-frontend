/* eslint-disable global-require */
import React from 'react';
import s from './DashboardPageMenu.scss';
import cx from 'classnames';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

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

    let pathName = this.props.location.pathname;

    if (pathName[pathName.length-1] === "/") {
      pathName = pathName.slice(0, pathName.length-1);
    }

    return (
      <div className={s.menu_container}>
        <div className={s.menu}>
        {
          Object.keys(this.props.menu).map((key, i) => {
            return (
              <div
                key={i}
                className={cx(s.menu_item, { [s.active]: pathName === this.props.menu[key] })} 
                onClick={()=>{this.setRoute(this.props.menu[key])}}
              >
                {key}
              </div>
            )
          })
        }
        </div>
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          className={s.icon_menu}
        >
        {
          Object.keys(this.props.menu).map((key, i) => {
            return (
              <MenuItem type="text" primaryText={key} key={i} onTouchTap={()=>this.setRoute(this.props.menu[key])} style={{cursor: "pointer"}} />
            )
          })
        }
        </IconMenu>
      </div>
    );
  }
}

export default DashboardPageMenu;