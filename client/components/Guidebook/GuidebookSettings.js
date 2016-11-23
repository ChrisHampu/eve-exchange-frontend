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
          <li><b>Auto Renew Subscription</b>: When your monthly subscription is due, the premium cost will automatically be deducted from your account and an additional 30 days added to your subscription. If left unchecked, your subscription will simply drop to non-premium. In either case, your account will continue to function normally.</li>
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
        <h4>Market</h4>
        <ul>
          <li><b>Default Hub</b>: This hub will be used to determine the default prices, market orders, and charts that are shown when you open the application. Additionally, the prices from this hub will be used to calculate forecast prices, portfolio prices, and other applicable areas. Changing your hub in the market browser or another part of the app is only temporary. To permanently change your hub, it must be done from your account settings page.</li>
          <li><b>Default Tab</b>: The default tab that will open in the market browser when viewing an item.</li>
          <li><b>Simulation Strategy</b>: The trade simulator will either use the fifth percentile prices or will undercut/overcut the top market orders when determining which prices to use for margin trading.</li>
          <li><b>Simulation Broker Fee</b>: Broker fee will be applied to buy price and be subtracted from estimated profit.</li>
          <li><b>Simulation Sales Tax</b>: Sales tax will be applied to sell price and be subtracted from estimated profit.</li>
          <li><b>Simulation Margin Type</b>: Determines how the trading margin is calculated. Exact value will subtract the exact ISK value from the buy & sell price, while the percentage will by multiplied by the buy & sell price.</li>
          <li><b>Simulation Margin</b>: The value to use when calculating margin trading values.</li>
          <li><b>Simulation Overhead Costs</b>: This value will be subtracted from the estimated profit as-is. Can be useful if you have a fixed cost to apply to trades, such as a general shipping cost.</li>
          <li><b>Simulation Minimum Wanted Profit</b>: The simulation sell value will be adjusted to give approximately this much of a percentage of estimated profit after costs are factored in. Can be useful when trying to seed a staging system and wanting to profit by a fixed percentage per item.</li>
        </ul>
      </div>
    );
  }
}
