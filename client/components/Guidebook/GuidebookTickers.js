import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookTickers extends React.Component {

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Tickers</div>
        <p>A ticker on EVE Exchange is a group of items that have been aggregated using their price, market orders, volume, and other statistics. The index price itself is adjusted to a more readable number that avoids miniscule changes in prices.</p>
        <p>Tickers are currently being updated on an hourly schedule, and your client will update with new data without having to refresh the page similar to other pages on EVE Exchange.</p>
        <h3>How is this useful?</h3>
        <p>You can watch entire classes of items you are interested in for significant shifts in market volume and prices. You can know if a particular market is being oversaturated, undersaturated, if prices are swinging significantly in one way or another, or if a market is even under stocked. The charts will let you watch for these as long term trends.</p>
        <p>It is also a very quick way to quickly analyze a group of items and how they are stocked in a region, rather than manually browsing through each item in the market browser.</p>
        <h3>Market Watchlist</h3>
        <p>Personalize your market watchlist to get updates on the tickers you're most invested in. This can be done from the main view of a particular ticker using the dropdown menu.</p>
        <h3>What's next?</h3>
        <p>This feature is still new and experimental. We're continuing to work on innovative ways to analyze and visualize market data. If you have ideas, reach out to us and tell what we should work on next.</p>
      </div>
    );
  }
}
