/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { browserHistory } from 'react-router'
import { userHasGroup, userHasPremium } from '../../auth';
import cx from 'classnames';
import DashboardView from './DashboardView';
import s from './DashboardComponent.scss';
import FullscreenComponent from './FullscreenComponent';

import logo_image from 'assets/img/eve-x-logo.png';

// Material UI
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Badge from 'material-ui/Badge';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// Icons
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import ProfileIcon from 'material-ui/svg-icons/action/account-box';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import BrowserIcon from 'material-ui/svg-icons/action/shopping-cart';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import LeftArrowIcon from 'material-ui/svg-icons/navigation/arrow-back';
import RightArrowIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import ProfitIcon from 'material-ui/svg-icons/action/timeline';
import OrderIcon from 'material-ui/svg-icons/content/content-paste';
import ForecastIcon from 'material-ui/svg-icons/action/search';
import UsersIcon from 'material-ui/svg-icons/action/supervisor-account';
import PortfoliosIcon from 'material-ui/svg-icons/notification/folder-special';
import MenuToggleIcon from 'material-ui/svg-icons/navigation/menu';
import GuidebookIcon from 'material-ui/svg-icons/av/library-books';
import LogIcon from 'material-ui/svg-icons/action/assignment-turned-in';
import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import StarIcon from 'material-ui/svg-icons/action/grade';
import AssetsIcon from 'material-ui/svg-icons/action/work';
import TickersIcon from 'material-ui/svg-icons/action/swap-vert';
import AlertsIcon from 'material-ui/svg-icons/action/alarm';

const MainMenu = [
  {
    "name": "Dashboard",
    "route": "/dashboard",
    "icon": <DashboardIcon />,
    "perm": "standard"
  },
  {
    "name": "Profile",
    "route": "/dashboard/profile",
    "icon": <ProfileIcon />,
    "perm": "standard"
  },
  {
    "name": "Feeds",
    "route": "/dashboard/feeds",
    "icon": <NotificationsIcon />,
    "perm": "standard"
  },
  {
    "name": "Reference",
    "route": "/dashboard/reference",
    "icon": <GuidebookIcon />,
    "perm": "standard"
  },
  {
    "name": "Logout",
    "route": "/logout",
    "icon": <ExitIcon />,
    "perm": "standard"
  }
];

const MarketMenu = [
  {
    "name": "Browser",
    "route": "/dashboard/browser",
    "icon": <BrowserIcon />,
    "perm": "standard"
  },
  {
    "name": "Orders",
    "route": "/dashboard/orders",
    "icon": <OrderIcon />,
    "perm": "standard"
  },
  {
    "name": "Profit",
    "route": "/dashboard/profit",
    "icon": <ProfitIcon />,
    "perm": "standard"
  },
  {
    "name": "Assets",
    "route": "/dashboard/assets",
    "icon": <AssetsIcon />,
    "perm": "standard"
  },
  {
    "name": "Alerts",
    "route": "/dashboard/alerts",
    "icon": <AlertsIcon />,
    "perm": "standard",
    'beta': true
  },
  {
    "name": "Forecast",
    "route": "/dashboard/forecast",
    "icon": <ForecastIcon />,
    "perm": "premium"
  },
  {
    "name": "Portfolios",
    "route": "/dashboard/portfolios",
    "icon": <PortfoliosIcon />,
    "perm": "premium"
  },
  {
    "name": "Tickers",
    "route": "/dashboard/tickers",
    "icon": <TickersIcon />,
    "perm": "standard"
  }
];

const AdminMenu = [
  {
    "name": "Dashboard",
    "route": "/dashboard/admin",
    "icon": <DashboardIcon />,
    "perm": "admin"
  },
  {
    "name": "Users",
    "route": "/dashboard/users",
    "icon": <UsersIcon />,
    "perm": "admin"
  },
  {
    "name": "Login Log",
    "route": "/dashboard/loginlog",
    "icon": <LogIcon />,
    "perm": "admin"
  },
  {
    "name": "Audit Log",
    "route": "/dashboard/auditlog",
    "icon": <LockIcon />,
    "perm": "admin"
  },
  {
    "name": "Alerts Log",
    "route": "/dashboard/alertslog",
    "icon": <LogIcon />,
    "perm": "admin"
  }
];

class Dashboard extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showMenu: null,
      collapsed: false,
      logoutRequested: false
    };
  }

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

    return cx(s.sidebar_menu_item, {[s.focused]: focus, [s.collapsed]: this.state.collapsed});
  }

  componentWillReceiveProps() {

  }

  slideoutMenuRequestChange = (open, reason) => this.setState({showMenu: open});
  slideoutMenuClickItem = (route) => this.setState({showMenu: false}, () => this.setRoute(route));

  renderMenu(items) {

    return items.map((item, i) => {

      const functor = item.route === "/logout" ? 
        () => this.setState({logoutRequested: true}) : () => this.setRoute(item.route);

      return (item.perm === "premium" ? userHasPremium() : userHasGroup(item.perm) ) ?
        this.state.collapsed ?
          <IconButton key={item.route} onTouchTap={functor} className={this.getPathClass(item)}>
            {item.icon}
          </IconButton> :
        <div className={s.menu_item_container} key={item.name}>
          <MenuItem onTouchTap={functor} type="text" style={{cursor: "pointer"}}
            className={this.getPathClass(item)}
            primaryText={item.name} leftIcon={item.icon}
          />
          {
            item.beta && <div className={s.beta_badge}>Beta</div>
          }
        </div> : null;
    });
  }

  renderAdminMenu() {

    return (
      <div>
        <Divider className={s.divider_line} />
        <div className={s.sidebar_menu_divider}>
        Admin
        </div>
        <Menu className={s.sidebar_menu} width={225}>
          {
            AdminMenu.map((item, i) => {
              return this.state.collapsed ?
              <IconButton key={item.route} onTouchTap={()=>{ this.setRoute(item.route); }} className={this.getPathClass(item)}>
                {item.icon}
              </IconButton>
              : <MenuItem key={item.name} onTouchTap={()=>{ this.setRoute(item.route); }} type="text" style={{cursor: "pointer"}}
                  className={this.getPathClass(item)}
                  primaryText={item.name} leftIcon={item.icon}
                />;
            })
          }
        </Menu>
      </div>
    )
  }

  renderSlideoutMenu(items) {

    return items.map((item, i) => {
      return (item.perm === "premium" ? userHasPremium() : userHasGroup(item.perm) )? 
      <MenuItem 
        key={item.route} 
        onTouchTap={()=>{ this.slideoutMenuClickItem(item.route); }} 
        type="text" 
        style={{cursor: "pointer"}}
        className={s.slideout_menu_item}
        primaryText={item.name}
        leftIcon={item.icon} 
      /> : null;
    });
  }

  render() {

    return (
      <div className={s.root}>
        <Dialog
          actions={[
            <FlatButton
              label="Cancel"
              labelStyle={{color: "rgb(235, 169, 27)"}}
              primary={true}
              onTouchTap={()=>this.setState({logoutRequested: false})}
            />,
            <FlatButton
              label="Confirm"
              labelStyle={{color: "rgb(235, 169, 27)"}}
              primary={true}
              keyboardFocused={true}
              onTouchTap={()=>this.setRoute("/logout")}
            />
          ]}
          modal={false}
          open={this.state.logoutRequested}
          onRequestClose={()=>this.setState({logoutRequested: false})}
        >
          Are you sure you want to log out?
        </Dialog>
        <Paper zDepth={2} className={cx(s.sidebar_container, {[s.collapsed]: this.state.collapsed})}>
          <div className={s.sidebar_inner}>
            <div className={s.sidebar_title}>
              <span className={s.name} onClick={()=>this.setRoute('/')}><img src={logo_image} /></span>
            </div>
            <div className={s.sidebar_menu_container}>
              <Divider className={s.divider_line} />
              <div className={s.sidebar_menu_divider}>
              Main
              </div>
              <Menu className={s.sidebar_menu} width={225}>
              { this.renderMenu(MainMenu) }
              </Menu>
              <Divider className={s.divider_line} />
              <div className={s.sidebar_menu_divider}>
              Market
              </div>
              <Menu className={s.sidebar_menu} width={225}>
              { this.renderMenu(MarketMenu) }
              </Menu>
              {
                userHasGroup("admin") ? this.renderAdminMenu() : false
              }
            </div>
            <div className={cx(s.sidebar_collapse, {[s.collapsed]: this.state.collapsed})} onClick={()=>this.setState({collapsed: !this.state.collapsed})}>
              <div className={s.sidebar_collapse_inner}>
                <div className={s.sidebar_collapse_icon}>
                  { this.state.collapsed ? <RightArrowIcon color="#95a1ac" viewBox="0 0 18 18"/> : <LeftArrowIcon color="#95a1ac" viewBox="0 0 18 18"/> }
                </div>
                <div className={s.sidebar_collapse_text}>
                  Collapse
                </div>
              </div>
            </div>
          </div>
        </Paper>
        <Drawer
          docked={false}
          //width={200}
          open={this.state.showMenu}
          swipeAreaWidth={40}
          onRequestChange={this.slideoutMenuRequestChange}
          containerClassName={s.slideout_container}
        >
          <div className={s.slideout_header}>
            <div className={s.slideout_info}>
              {this.props.auth.name}
              <IconButton style={{width: "36px", height: "36px", "right": "0.5rem", "bottom": "0.5rem", "position": "absolute"}} tooltip="Notifications" onClick={()=>this.slideoutMenuClickItem("/dashboard/feeds/notifications")}>
                <NotificationsIcon />
              </IconButton>
            </div>
          </div>
          { this.renderSlideoutMenu(MainMenu) }
          { this.renderSlideoutMenu(MarketMenu) }
          { userHasGroup("admin") ? this.renderSlideoutMenu(AdminMenu) : false }
        </Drawer>
        <div className={s.body_container}>
          <Toolbar className={s.dashboard_header}>
            <ToolbarGroup firstChild={true} className={cx(s.dashboard_toolbar)}>
              <IconButton className={s.dashboard_header_menutogglebutton} onClick={()=>this.setState({showMenu: this.state.showMenu ? null : true})} style={{width: "56px", height: "56px"}} tooltip="Toggle Menu">
                <MenuToggleIcon />
              </IconButton>
              <IconButton className={s.dashboard_header_backbutton} onClick={()=>{ browserHistory.goBack(); }} style={{width: "56px", height: "56px"}} tooltip="Go Back">
                <LeftArrowIcon />
              </IconButton>
            </ToolbarGroup>
            <ToolbarGroup className={cx(s.dashboard_toolbar, s.dashboard_toolbar_right)}>
              {
                !userHasPremium() ?
                  <div className={s.dashboard_header_premium_icon}>
                      <IconButton style={{width: "56px", height: "56px"}} tooltip="Enjoy Premium Benefits" onClick={()=>this.context.router.push("/dashboard/reference/premium")}>
                        <StarIcon />
                      </IconButton>
                  </div> : false
              }
              <div className={s.dashboard_header_notifications_container}>
                <Badge
                  className={cx(s.dashboard_header_notifications, { [s.dashboard_header_notifications_unread]: this.props.notifications.filter(el => el.read === false).length > 0 })}
                  badgeContent={this.props.notifications.filter(el => el.read === false).length}
                >
                  <IconButton style={{width: "56px", height: "56px"}} tooltip="Notifications" onClick={()=>this.context.router.push("/dashboard/feeds/notifications")}>
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
        <FullscreenComponent />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { auth: store.auth, notifications: store.feeds.notifications, subscription: store.subscription };
}

export default connect(mapStateToProps)(Dashboard);
