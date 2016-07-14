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

  setRoute(route) {

    browserHistory.push(route);
  }

  componentWillReceiveProps() {

    
  }

  render() {

    return (
      <div className={s.root}>
        <Paper zDepth={2} className={s.sidebar_container}>
          <div className={s.sidebar_inner}>
            <div  className={s.sidebar_title}>
              Trade Forecaster
            </div>
            <Divider className={s.divider_line} />
            <div className={s.sidebar_menu_divider}>
            Main
            </div>
            <Menu className={s.sidebar_menu}>
              {
                MainMenu.map((item, i) => {
                  return <MenuItem key={i} onTouchTap={()=>{ this.setRoute(item.route); }} type="text"
                   className={this.props.location.pathname===item.route?cx(s.sidebar_menu_item, s.focused):s.sidebar_menu_item}
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
                  return <MenuItem key={i} onTouchTap={()=>{ this.setRoute(item.route); }} type="text"
                   className={this.props.location.pathname===item.route?cx(s.sidebar_menu_item, s.focused):s.sidebar_menu_item}
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
                  return <MenuItem key={i} onTouchTap={()=>{ this.setRoute(item.route); }} type="text"
                   className={this.props.location.pathname===item.route?cx(s.sidebar_menu_item, s.focused):s.sidebar_menu_item}
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
                  className={s.dashboard_header_notifications}
                  badgeContent={0}
                >
                  <IconButton style={{width: "56px", height: "56px"}} tooltip="Notifications">
                    <NotificationsIcon />
                  </IconButton>
                </Badge>
              </div>
              <div className={s.dashboard_user}>
                <div className={s.dashboard_user_inner}>
                  <div>
                    <div className={s.dashboard_username}>
                    {this.props.auth.name}
                    </div>
                    <div className={s.dashboard_corporation}>
                    {this.props.auth.corporation}
                    </div>
                  </div>
                </div>
              </div>
              <Avatar className={s.dashboard_avatar} src={`https://image.eveonline.com/Character/${this.props.auth.id}_64.jpg`} size={48} /> 
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
  return { auth: store.auth };
}

export default connect(mapStateToProps)(Dashboard);