import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookHome extends React.Component {

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Market Orders</div>
        <p>EVE Exchange will track all of the market orders for each profile that you add to your account. These market orders are on a 1 hour cache timer as opposed to the 5 minute cache timer of regular market orders, and is a limitation of the EVE API.</p>
        <p>These market orders are under Orders on the main menu and will show which profile each order belongs to. These orders are also highlighted in the market browser price ladder so that you can see where your orders are relative to other traders.</p>
      </div>
    );
  }
}
