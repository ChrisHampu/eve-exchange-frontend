import React from 'react';
import cx from 'classnames';
import { browserHistory } from 'react-router';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import s from './GuidebookComponent.scss';

import GuidebookHome from './GuidebookHome';

import Paper from 'material-ui/Paper';

class GuidebookSidebar extends React.Component {

  constructor(props) {
    super(props);

    this.items = {
      "Reference Home": "/dashboard/reference",
      "Contact": "/dashboard/reference/contact",
      "About": "/dashboard/reference/about",
      "Account": "Divider",
      "Settings": "/dashboard/reference/settings",
      "Premium": "/dashboard/reference/premium",
      "Profiles": "/dashboard/reference/profile",
      "Notifications": "/dashboard/reference/notifications",
      "Market": "Divider",
      "Intro": "/dashboard/reference/market-intro",
      "Dashboard": "/dashboard/reference/dashboard",
      "Browser": "/dashboard/reference/browser",
      "Orders": "/dashboard/reference/orders",
      "Profit": "/dashboard/reference/profit",
      "Use Cases": "/dashboard/reference/usecases",
      "Tickers": "/dashboard/reference/tickers",
      "Premium Features": "Divider",
      "Forecast": "/dashboard/reference/forecast",
      "Portfolios": "/dashboard/reference/portfolios",
      "API": "/dashboard/reference/api"
    };
  }

  setRoute(route) {

    browserHistory.push(route);
  }

  render() {
    return (
      <Paper Depth={4} className={s.sidebar}>
      {
        Object.keys(this.items).map((el, i) =>
          this.items[el] === "Divider" ? 
          <div key={i} className={s.divider}>{el}</div> :
          <div key={i} className={s.link}>
          {<a onClick={()=>this.setRoute(this.items[el])}>{el}</a>}
          </div>
        )
      }
      </Paper>
    )
  }
}

export default class GuidebookComponent extends React.Component {

  render() {
    return (
      <div className={s.container}>
        <div className={s.inner}>
          <GuidebookSidebar />
          {
            this.props.children ? this.props.children : <GuidebookHome />
          }
        </div>
      </div>
    );
  }
}
