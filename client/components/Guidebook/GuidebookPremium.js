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
        <div className={s.title}>Premium</div>
        <p>While most features of this application are free to use, a subscription can be added to your account for a monthly fee of <b>150M ISK</b>. Subscribing gives a small incentive to our team for the time that is put into building this application and gives access to the following additional features:</p>
        <ul>
          <li><b>Forecasting</b>: Allows you to near-instantly search through the entire market for tradeable items that meet specific criteria of price, margin, and daily volume.</li>
          <li><b>Investment Portfolio</b>: Allows you to track a grouping of tradeable items with aggregated prices, volume, and margin over a long period of time, complete with hourly and daily performance charts.</li>
          <li><b>Industrial Portfolio</b>: Select any manufacturable item and instantly see the components and raw materials necessary to build it along with profit margins, performance charts to track profitability over time, and component charts to see component price hot spots. Calculates materials based on user given material efficiency and other options.</li>
          <li><b>API Access</b>: Our extensive API can provide endpoints for retrieving market data, portfolios, forecasts, orders, and more. Full API features require an additional subscription. More information can be found in your profile with complete documentation.</li>
       </ul>
        <p>
        You can find further details on these features throughout the reference pages.
        </p>
        <p>
        You can manage your subscription settings at your <span className={s.link} onClick={()=>this.setRoute("/dashboard/profile/subscription")}>profile subscription page</span>.
        </p>
        <h3>How to Subscribe</h3>
        <p>Upgrading your account to a Premium subscription requires that you have a balance on your EVE Exchange account that can cover the minimum of 1 month of Premium. The upgrade can be performed any time from your profile subscription page. In order to add a balance to your account, you can follow the deposit instructions below.</p>
        <h4>Deposit</h4>
        <p>A deposit can be made by sending any ISK amount to <b>EVE Exchange Holdings</b> with the ticker <b>E-XCH</b> and CEO <b>Maxim Stride</b>. Deposits are fully automated and processed during regular API pulls which happen on the hour. You'll be notified once the deposit has been confirmed.</p>
        <p>In order to ensure that deposits are applied to the correct account, make sure that the ISK is sent from the main character of your account. That is the character shown in the top right of the application. If a deposit is done incorrectly, the ISK will be returned by a site admin, but will take a while.</p>
        <p>Any subscription balance added to your EVE Exchange account will never expire.</p>
        <h3>Downgrade</h3>
        <p>If you wish to cancel your subscription, you can do so anytime from your profile subscription page. Please note that if you do, you will <b>forfeit the remaining time on your active subscription</b>. 
        An alternative is to disable <b>Auto Renew</b> in your account settings and let your subscription expire, downgrading you to a free account. Your balance will stay the same, and you can re-subscribe at a later date.</p>
        <p>If you have active <span className={s.link} onClick={()=>this.setRoute("/dashboard/reference/api")}>API access</span>, it will be disabled without a refund, as API access is dependent on premium status.</p>
        <h3>Withdrawals</h3>
        <p>If you have deposited a large amount of ISK into your EVE Exchange account and wish to withdraw it for any reason, you may do so anytime by using the withdrawal feature on your subscription page. 
        You must have enough ISK remaining in your account that you wish to withdraw. This process could take up to 24 hours to complete, and you will be notified when it is processed. Your account history log will reflect the withdrawal and whether it has been procssed yet. If you encounter any issues during this process, feel free to contact us to have it sorted out.</p>
      </div>
    );
  }
}
