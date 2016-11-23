import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookHome extends React.Component {

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Trade Forecast</div>
        <p>The forecast feature allows you to quickly search through every item on the market and find suitable items to trade that match a set of parameters.</p>
        <p>The following search parameters are supported:</p>
        <ul>
          <li>Min/Max Price</li>
          <li>Min/Max Daily Volume</li>
          <li>Min/Max Spread</li>
        </ul>
        <p>Trade Forecast is designed to provide users with in-depth market intelligence allowing them to find unique trading opportunities.</p>
      </div>
    );
  }
}
