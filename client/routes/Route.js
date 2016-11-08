import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import AppComponent from '../components/App/AppComponent';
import OnboardingComponent from '../components/Onboarding/OnboardingComponent';
import LoginComponent from '../components/Login/LoginComponent';
import DashboardComponent from '../components/Dashboard/DashboardComponent';
import ProfileComponent from '../components/Profile/ProfileComponent';
import ProfileSubscription from '../components/Profile/ProfileSubscription';
import ProfileSubscriptionHistory from '../components/Profile/ProfileSubscriptionHistory';
import ProfileSettings from '../components/Profile/ProfileSettings';
import APITypeSelector from '../components/Profile/APITypeSelector';
import AdminComponent from '../components/Admin/AdminComponent';
import MarketBrowserComponent from '../components/MarketBrowser/MarketBrowserComponent';
import MarketItemViewComponent from '../components/MarketBrowser/MarketItemViewComponent';
import NotificationsComponent from '../components/Notifications/NotificationsComponent';
import ProfitComponent from '../components/Profit/ProfitComponent';
import ProfitTopItems from '../components/Profit/ProfitTopItems';
import ProfitAlltime from '../components/Profit/ProfitAlltime';
import ProfitTransactions from '../components/Profit/ProfitTransactions';
import ForecastComponent from '../components/Forecast/ForecastComponent';
import OrdersComponent from '../components/Orders/OrdersComponent';
import UsersComponent from '../components/Users/UsersComponent';
import UsersView from '../components/Users/UsersView';
import UsersViewSingle from '../components/Users/UsersViewSingle';
import PortfoliosComponent from '../components/Portfolios/PortfoliosComponent';
import PortfoliosCreate from '../components/Portfolios/PortfoliosCreate';
import PortfoliosViewAll from '../components/Portfolios/PortfoliosViewAll';
import PortfoliosViewSingle from '../components/Portfolios/PortfoliosViewSingle';
import ProfitProfileStatistics from '../components/Profit/ProfitProfileStatistics';

import { requireAccess, redirectIfAuthed, userLevels, logout } from '../auth';

export default (
  <Route>
    <Route path='/login' component={LoginComponent} onEnter={redirectIfAuthed()} />
    <Route path='/logout' onEnter={logout(true)} />
    <Route path='/' component={AppComponent} >
      <IndexRoute component={OnboardingComponent} />
      <Route path="dashboard" component={DashboardComponent} onEnter={requireAccess("standard")}>
        <Route path="profile" components={{main: ProfileComponent}}>
          <Route path="subscription" component={ProfileSubscription} />
          <Route path="history" component={ProfileSubscriptionHistory} />
          <Route path="settings" component={ProfileSettings} />
          <Route path="addapi" component={APITypeSelector} />
          <Route path=":id" component={ProfitProfileStatistics} />
        </Route>
        <Route path="notifications" components={{main: NotificationsComponent }} />
        <Route path="browser" components={{main: MarketBrowserComponent}}>
          <Route path=":id" component={MarketItemViewComponent} />
        </Route>
        <Route path="orders" components={{main: OrdersComponent}} />
        <Route path="forecast" components={{main: ForecastComponent}} onEnter={requireAccess("premium")}/>
        <Route path="profit" components={{main: ProfitComponent }}>
          <Route path="topitems" component={ProfitTopItems} />
          <Route path="stats" component={ProfitAlltime} />
          <Route path="transactions" component={ProfitTransactions} />
        </Route>
        <Route path="portfolios" components={{main: PortfoliosComponent}} onEnter={requireAccess("premium")}>
          <Route path="create" component={PortfoliosCreate} />
          <Route path="view" component={PortfoliosViewAll}>
            <Route path=":id" component={PortfoliosViewSingle} />
          </Route>
        </Route>
        <Route path="admin" components={{main: AdminComponent}} onEnter={requireAccess("admin")}/>
        <Route path="users" components={{main: UsersComponent}} onEnter={requireAccess("admin")}>
          <Route path="view" component={UsersView}>
            <Route path=":id" component={UsersViewSingle} />
          </Route>
        </Route>
      </Route>
    </Route>
    <Redirect from='*' to='/' />
  </Route>
);