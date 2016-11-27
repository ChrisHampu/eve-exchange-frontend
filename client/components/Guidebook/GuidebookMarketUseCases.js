import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookHome extends React.Component {

  setRoute(route) {

    browserHistory.push(route);
  }

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Use Cases</div>
        <p>While this list is by no means exhaustive, it covers a few potential ways that various EVE Exchange tools can be utilized for specific trading patterns.</p>
        <h3>Station Trading</h3>
        <p>Finding suitable items to trade can be done quickly using the Forecast tool and searching for items that fall within a specific price range, volume, and spread. It's important when searching for items this way that you look through the hourly/daily volume history to ensure enough volume moves that you can make successful trades.</p>
        <p>The trade simulator can be configured from your profile Market settings to use a specific sales tax, broker fees, and trading strategy. The simulator will then tell you the buy & sell price and an estimated net profit. When margin trading, this can be useful to quickly get an ideal buy & sell price for an item, and simply click the Copy button to copy the price to your clipboard and paste it into the Market Browser ingame to make a trade. More info on this feature can be found in the <span className={s.link} onClick={()=>this.setRoute("/dashboard/reference/browser")}>Browser</span> section.</p>
        <p>Pinning charts to your dashboard can help with watching hot items in real time since up to 4 charts can be visible at any given time depending on your screen size. This way you can simply tab to the website and take a glance at the current price trends.</p>
        <h3>Long Term Investments</h3>
        <p>If as a speculator you buy a group of items with the intent of selling at a much later date, you can create a trading portfolio which will record the value of the items at time of creation, and show you the growth of the value over time. The portfolio also generates hourly/daily charts so that you can track these values. If you watch the charts and notice a trend that indicates a good time to sell, you can then sell the items and close the portfolio.</p>
        <h3>Staging Systems</h3>
        <p>Wars require a significant amount of resources and rely on haulers, industrialists, and traders alike to keep markets stocked and fuel battles. There's a special setting called <i>Simulation Minimum Wanted Profit</i> in your profile settings that can be set to a specific percentage. The trade simulator will then calculate the sell prices of items such that after overhead costs, sales tax, broker fees, etc, the estimated profit from selling that item becomes roughly that percentage amount. So if you want to sell items in a staging system at a 10% profit markup of a specific hub price, simply set that value to 10% and use the trade simulator to determine what price to sell items at. If you have a general shipping cost for a staging system, you can add that cost into the calculation using the Overhead Costs setting.</p>
        <h3>Region Trading</h3>
        <p>The top right context menu when viewing an item in the Market Browser has a <i>Change Hub</i> option to quickly view the prices, orders, and more of another region. This can help you compare prices and determine if buying and selling in another region can generate a reasonable profit. More in-depth and specialized tools are in the works and will be coming soon (suggestions are welcome).</p>
      </div>
    );
  }
}
