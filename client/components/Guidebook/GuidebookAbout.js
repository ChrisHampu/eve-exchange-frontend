import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookHome extends React.Component {

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>About EVE Exchange</div>
        <p>EVE Exchange is a comprehensive market platform that aims to provide accurate, up-to-date information about the EVE markets as well as provide tools to track trading performance and make better informed trades. Our data can also be used by industrials to determine the best items to build and track profitability over time.</p>
        <p>This application uses the CREST market API to pull market orders every 5 minutes, crunch all of the data, and deliver it to your client in the form of real time charts and updated order tables. We do all of the heavy lifting so that all you have to do is watch the charts and update your orders. We then track your sales and provide data on overall profitability and trading performance.</p>
      </div>
    );
  }
}
