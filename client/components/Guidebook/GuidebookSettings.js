import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';
import { browserHistory } from 'react-router';

export default class GuidebookHome extends React.Component {

  setRoute(route) {

    browserHistory.push(route);
  }

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Settings</div>
        <p>Your account settings can be accessed from the <b>Profile</b> menu under <b>Settings</b> or by <span className={s.link} onClick={()=>this.setRoute("/dashboard/profile/settings")}>clicking here</span>.</p>
        <p>Settings are global and cover your entire account. Changing any settings will save them instantly, so upon refreshing the page, they will stay as you set them.</p>
        <h3>Options</h3>
        <p>Settings are currently broken up between 3 categories that will be explained below.</p>
        <h4>General</h4>
        <ul>
          <li><b>Auto Renew Subscription</b>: When your subscription is due to renew monthly, the premium cost will automatically be deducated from your account and add an additional 30 days to your subscription time. If left unchecked, your subscription will simply drop to non-premium. In either case, your account will continue to function normally.</li>
        </ul>
        <h4>Market</h4>
        <ul>
          <li><b>Default Hub</b>: This hub will be used to determine the default prices, market orders, and charts that are shown when you open the application. Additionally, the prices from this hub will be used to calculate forecast prices, portfolio prices, and other applicable areas. Changing your hub in the market browser or another part of the app is only temporary. To permanently change your hub, it must be done from your account settings page.</li>
        </ul>
        <h4>Visualizations</h4>
        <p>You can customize the market charts to only show the information relevant to you. This applies to both dashboard & market browser charts.</p>
        <ul>
          <li><b>Price</b>: Whether to show the buy price line.</li>
          <li><b>Spread</b>: Whether to show the spread percentage line.</li>
          <li><b>Spread SMA</b>: Whether to show the spread simple 7 day moving average line.</li>
          <li><b>Volume</b>: Whether to show the volume bars.</li>
          <li><b>Price</b>: Whether to show the volume simple 7 day moving average line.</li>
        </ul>
      </div>
    );
  }
}
