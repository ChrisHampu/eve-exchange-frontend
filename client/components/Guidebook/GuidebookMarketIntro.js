import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookHome extends React.Component {

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Market Introduction</div>
        <p>EVE Exchange utilizes the CREST market API at 5 minute intervals in order to have the most up-to-date information possible. We calculate buy/sell/margin/volume data in that 5 minute time span and deliver it to every connected client in realtime.</p>
        <p>Because the EVE API can only tell you the total volume is that is being bought or sold, and knowing the total market volume is only somewhat useful, we do our best to calculate the <b>estimated</b> volume that is traded in a 5 minute/hourly/daily timespan. While this data is only a rough estimation, it can provide a good idea over a long enough timespan on how much volume is being moved, and which timezones are the busiest. Therefore it can be useful in planning successful trades or finding items with an optimal volume to match your trading style.</p>
        <p>Due to the sheer amount of data that is available through the market API's and wanting to stick to our promise of delivering fresh data every 5 minutes, we are currently limiting trade hub support to the following:</p>
        <ul>
          <li>Jita</li>
          <li>Amarr</li>
          <li>Dodixie</li>
          <li>Hek</li>
          <li>Rens</li>
        </ul>
        <p>More may be added in the future as needed or by request.</p>
     </div>
    );
  }
}
