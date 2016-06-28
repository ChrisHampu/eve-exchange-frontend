/* eslint-disable global-require */
import React from 'react';;
import s from './MarketBrowserComponent.scss';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import cx from 'classnames';

export default class MarketBrowserComponent extends React.Component {

  render() {
    return (
      <DashboardPage title="Market Browser" className={s.root}>
        Test
      </DashboardPage>
    );
  }
}
