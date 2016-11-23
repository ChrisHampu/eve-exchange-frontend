import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookHome extends React.Component {

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Market Dashboard</div>
        <p>Your dashboard can be personalized to display multiple charts, providing you with in-depth information on your most watched items. These charts also update in realtime, and can be used as shortcuts to view the item in the market browser to quickly see market orders.</p>
        <p>In order to pin a chart to your dashboard, you must view it in the market browser and select the Pin option from the top-right context menu.</p>
      </div>
    );
  }
}
