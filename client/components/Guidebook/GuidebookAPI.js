import React from 'react';
import s from './GuidebookPage.scss';
import { browserHistory } from 'react-router';

export default class GuidebookAPIAccess extends React.Component {

  setRoute(route) {

    browserHistory.push(route);
  }

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>API Access</div>
        <p>The EVE Exchange API is used by this application for many functions and is documented & accessible by its users from outside the application as well. The documentation for the API can be found <a href="https://api.eve.exchange" target="_blank" className={s.link}>here</a>.</p>
        <p>While the API can be accessed using the token stored in this application, an easier method is to use the provided API key in your profile. In order to use this API key, access must be enabled first. Enabling API access also allows additional exclusive endpoints in order to access market data and other functions.</p>
        <p>In order to use your API key, access must first be enabled, and a monthly ISK fee is required. This fee is tied to your premium subscription, so you must maintain your premium status in order to continue using the API key. This fee is also renewed along with your premium subscription according to your renewal settings. Due to this, the fee is prorated up to your next premium renewal. If there's only half of a month left to your next renewal, you pay half the fee to enable the API key.</p>
        <h3>Benefits</h3>
        <p>Enabled API access grants access to exclusive endpoints otherwise inaccessible. The following is not an extensive list, and is fully explained in the API documentation:</p>
        <ul>
          <li>Current market prices (5 minute cache time)</li>
          <li>Market history (5 minutes, hourly, daily)</li>
          <li>Retrieving portfolios</li>
          <li>Retrieving market orders for all profiles</li>
          <li>Retrieving account notifications</li>
        </ul>
      </div>
    );
  }
}
