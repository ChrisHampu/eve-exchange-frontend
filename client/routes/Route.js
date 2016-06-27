import React from 'react';
import { IndexRoute, Route, Redirect } from 'react-router';

import AppComponent from '../components/App/AppComponent';
import OnboardingComponent from '../components/Onboarding/OnboardingComponent';
import LoginComponent from '../components/Login/LoginComponent';
import DashboardComponent from '../components/Dashboard/DashboardComponent';

import { requireAccess, redirectIfAuthed, userLevels, logout } from '../auth';

export default (
  <Route>
    <Route path='/login' component={LoginComponent} onEnter={redirectIfAuthed()} />
    <Route path='/logout' onEnter={logout(true)} />
    <Route path='/' component={AppComponent} >
      <IndexRoute component={OnboardingComponent} />
      <Route path="/dashboard" component={DashboardComponent} onEnter={requireAccess("standard")} />
    </Route>
    <Redirect from='*' to='/' />
  </Route>
);

