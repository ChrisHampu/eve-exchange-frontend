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
        <div className={s.title}>Market Browser</div>
        <p>The market browser is arguably the most important part of EVE Exchange. It encompasses viewing items, charts, and market orders. You can search through all of the items in EVE and see updated prices & charts within seconds for any item.</p>   
        <h3>Charts</h3>
        <p>Charts can be zoomed, scrolled, <span className={s.link} onClick={()=>this.setRoute("/dashboard/reference/settings")}>customized</span>, and changed to show different time spans. Currently the following time spans are supported:</p>
        <ul>
          <li><b>5 Minutes:</b> Shows 5 minute intervals for the past 24 hours</li>
          <li><b>Hourly:</b> Shows the past 1 week in hourly intervals</li>
          <li><b>Daily</b> Shows all historical daily data since we began collecting it</li>
        </ul>
        <p>Moving average data is calculated based on a simple 7 day moving average.</p>
        <h3>Price Ladder</h3>
        <p>The price ladder shows all available buy & sell orders as well as those that are within the top 5% respectively. Additionally, it will highlight the orders that belong to any of your profiles in the price ladder.</p>
        <p><b>Note:</b> Citadel <b>sell</b> orders are excluded from the EVE API and as a result are unavailable.<br />
        <b>Note:</b> Highlighted personal orders are on a 1 hour cache time as opposed to the 5 minute cache time of regular orders.</p>
     </div>
    );
  }
}
