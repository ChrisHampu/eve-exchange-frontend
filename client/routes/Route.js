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
import ProfileAPIKey from '../components/Profile/ProfileAPIKey';
import AdminComponent from '../components/Admin/AdminComponent';
import MarketBrowserComponent from '../components/MarketBrowser/MarketBrowserComponent';
import MarketItemViewComponent from '../components/MarketBrowser/MarketItemViewComponent';
import NotificationsComponent from '../components/Notifications/NotificationsComponent';
import ProfitComponent from '../components/Profit/ProfitComponent';
import ProfitTopItems from '../components/Profit/ProfitTopItems';

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
          <Route path="apikey" component={ProfileAPIKey} />
        </Route>
        <Route path="notifications" components={{main: NotificationsComponent }} />
        <Route path="browser" components={{main: MarketBrowserComponent}}>
          <Route path=":id" component={MarketItemViewComponent} />
        </Route>
        <Route path="profit" components={{main: ProfitComponent }}>
          <Route path="topitems" component={ProfitTopItems} />
        </Route>
        <Route path="admin" components={{main: AdminComponent}} />
      </Route>
    </Route>
    <Redirect from='*' to='/' />
  </Route>
);

