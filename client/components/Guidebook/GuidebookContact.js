import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookHome extends React.Component {

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Contact</div>
        <h3>Methods</h3>
        <p>If you need to get in contact with the team for any reason, the following methods are listed in order from most effective to least.</p>
        <ul>
          <li>@maxim on Tweetfleet</li>
          <li>maxim@eve.exchange by email</li>
          <li>Maxim Stride ingame</li>
        </ul>
     </div>
    );
  }
}
