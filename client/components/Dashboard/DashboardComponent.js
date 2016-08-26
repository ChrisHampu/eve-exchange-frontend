/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { browserHistory } from 'react-router'
import cx from 'classnames';
import DashboardView from './DashboardView';
import s from './DashboardComponent.scss';

// Material UI
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Badge from 'material-ui/Badge';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';

// Icons
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import ProfileIcon from 'material-ui/svg-icons/action/account-box';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import ShoppingIcon from 'material-ui/svg-icons/action/shopping-cart';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import LeftArrowIcon from 'material-ui/svg-icons/navigation/arrow-back';
import ProfitIcon from 'material-ui/svg-icons/editor/show-chart';
import ForecastIcon from 'material-ui/svg-icons/action/search';

const MainMenu = [
  {
    "name": "Dashboard",
    "route": "/dashboard",
    "icon": <DashboardIcon />
  },
  {
    "name": "Profile",
    "route": "/dashboard/profile",
    "icon": <ProfileIcon />  
  },
  {
    "name": "Notifications",
    "route": "/dashboard/notifications",
    "icon": <NotificationsIcon />  
  },
  {
    "name": "Logout",
    "route": "/logout",
    "icon": <ExitIcon />
  }
];

const MarketMenu = [
  {
    "name": "Browser",
    "route": "/dashboard/browser",
    "icon": <ShoppingIcon />
  },
  {
    "name": "Profit",
    "route": "/dashboard/profit",
    "icon": <ProfitIcon />
  },
  {
    "name": "Forecast",
    "route": "/dashboard/forecast",
    "icon": <ForecastIcon />
  }
];

const AdminMenu = [
  {
    "name": "Dashboard",
    "route": "/dashboard/admin",
    "icon": <DashboardIcon />
  }
];

class Dashboard extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  setRoute(route) {

    browserHistory.push(route);
  }

  getPathClass(item) {

    let focus = true;

    const routes = this.props.routes.slice(2);
    const matches = item.route.slice(1).split("/");

    if (matches.length > routes.length) {
      focus = false;
    }

    for (var i = 0; i < Math.min(routes.length, 2); i++) {
      if (!matches[i] || routes[i].path !== matches[i]) {
        focus = false;
        
        break;
      }
    }

    return cx(s.sidebar_menu_item, {[s.focused]: focus});
  }

  componentWillReceiveProps() {

  }

  render() {

    return (
      <div className={s.root}>
        <Paper zDepth={2} className={s.sidebar_container}>
          <div className={s.sidebar_inner}>
            <div className={s.sidebar_title}>
              <span className={s.name} onClick={()=>this.setRoute('/')}>Trade Forecaster</span>
            </div>
            <Divider className={s.divider_line} />
            <div className={s.sidebar_menu_divider}>
            Main
            </div>
            <Menu className={s.sidebar_menu}>
              {
                MainMenu.map((item, i) => {
                  return <MenuItem key={i} onTouchTap={()=>{ this.setRoute(item.route); }} type="text" style={{cursor: "pointer"}}
                   className={this.getPathClass(item)}
                   primaryText={item.name} leftIcon={item.icon} />;
                })
              }
            </Menu>
            <Divider className={s.divider_line} />
            <div className={s.sidebar_menu_divider}>
            Market
            </div>
            <Menu className={s.sidebar_menu}>
              {
                MarketMenu.map((item, i) => {
                  return <MenuItem key={i} onTouchTap={()=>{ this.setRoute(item.route); }} type="text" style={{cursor: "pointer"}}
                   className={this.getPathClass(item)}
                   primaryText={item.name} leftIcon={item.icon} />;
                })
              }
            </Menu>
            <Divider className={s.divider_line} />
            <div className={s.sidebar_menu_divider}>
            Admin
            </div>
            <Menu className={s.sidebar_menu}>
              {
                AdminMenu.map((item, i) => {
                  return <MenuItem key={i} onTouchTap={()=>{ this.setRoute(item.route); }} type="text" style={{cursor: "pointer"}}
                   className={this.getPathClass(item)}
                   primaryText={item.name} leftIcon={item.icon} />;
                })
              }
            </Menu>
          </div>
        </Paper>
        <div className={s.body_container}>
          <Toolbar className={s.dashboard_header}>
            <ToolbarGroup firstChild={true} className={cx(s.dashboard_toolbar)}>
              <IconButton className={s.dashboard_header_backbutton} onClick={()=>{ browserHistory.goBack(); }} style={{width: "56px", height: "56px"}} tooltip="Go Back">
                <LeftArrowIcon />
              </IconButton>
            </ToolbarGroup>
            <ToolbarGroup className={cx(s.dashboard_toolbar, s.dashboard_toolbar_right)}>
              <div className={s.dashboard_header_notifications_container}>
                <Badge
                  className={cx(s.dashboard_header_notifications, { [s.dashboard_header_notifications_unread]: this.props.notifications.filter(el => el.read === false).length > 0 })}
                  badgeContent={this.props.notifications.filter(el => el.read === false).length}
                >
                  <IconButton style={{width: "56px", height: "56px"}} tooltip="Notifications" onClick={()=>this.context.router.push("/dashboard/notifications")}>
                    <NotificationsIcon />
                  </IconButton>
                </Badge>
              </div>
              <div className={s.dashboard_user} onClick={()=>this.context.router.push("/dashboard/profile")}>
                <div className={s.dashboard_user_inner}>
                  <div>
                    <div className={s.dashboard_username}>
                    {this.props.auth.name}
                    </div>
                    <div className={s.dashboard_corporation}>
                    {this.props.auth.corporation}
                    </div>
                  </div>
                  <Avatar className={s.dashboard_avatar} src={`https://image.eveonline.com/Character/${this.props.auth.id}_64.jpg`} size={48} />
                </div>
              </div>
            </ToolbarGroup>
          </Toolbar>
          {
            this.props.main !== undefined ? this.props.main :
            <DashboardView />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { auth: store.auth, notifications: store.notifications };
}

export default connect(mapStateToProps)(Dashboard);