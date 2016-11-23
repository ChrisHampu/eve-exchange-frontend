import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookHome extends React.Component {

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Profit Tracking</div>
        <p>Profit data is calculated for each profile on your account and then aggregated each hour. This is due to the EVE API cache timing limit.</p>
        <h3>Profit Chart</h3>
        <p>The profit chart supports hourly and daily intervals along with zooming and scrolling. The information shown on the profit chart is the <b>total raw profit</b>, taxes, and broker fees paid across all of your active profiles. Profit does not have broker fees or taxes subtracted from it. If you lose ISK on any transactions, then it is possible for the chart to go into the negative.</p>
        <h3>Transactions</h3>
        <p>A transaction is when an item is bought and then later resold in any quantity. The profit shown in the transaction log is the total profit made for the quantity shown. Transactions are tagged with the profile that made the sale. In order for a transaction to count, the item has to both be bought and sold on the same profile. Multiple profiles buying and selling the same item will result in separate transactions. Transaction data is on an hourly cache timer.</p>
        <h3>Top Items</h3>
        <p>In order to see which trades are providing the most amount of profit, we track aggregated statistics across all profiles for each item that is sold for both positive and negative profit. This data is throughout the entire history of the account rather than a specific timespan. Removing a profile will not change these statistics.</p>
        <h3>Top Profiles</h3>
        <p>This page provides an overview for all profiles (including removed ones) and how much profit they have generated in total.</p>
        <h3>All Time Statistics</h3>
        <p>The statistics shown are overall profit, taxes, and broker fees generated for all profiles on the account over several time spans.</p>
        <h3>Limits</h3>
        <p>If you have more than 5 profiles on a free account as a result of adding many profiles and then unsubscribing, only your first 5 <b>character</b> profiles will have profit tracking enabled. Corporation profiles are limited to premium subscribers and won't count towards this limit.</p> 
      </div>
    );
  }
}
