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
        <div className={s.title}>Profiles</div>
        <p>EVE Exchange allows you to aggregate together multiple characters & corporations using what we call profiles. A profile is essentially an EVE API key for a specific entity that we use to track the market orders, journals, and transactions for. From that data, we calculate profit over time and show you formatted graphs and tables of your trading performance.</p>
        <p>The character that you use to log into EVE Exchange is what we consider the <b>master</b> character for your account. We create account data the moment you login and all of the data that we store is tied to the currently logged in character. This means that you can choose to add all your API keys to a single account and have your data grouped together, or make a unique EVE Exchange account for each API key and only have a single API key tied to each account. This means that API keys can be reused across different EVE Exchange accounts without conflicting. The choice is yours.</p>
        <h3>Profile Data</h3>
        <p>Market orders, journal history, and transactions are all pulled each hour from the EVE API using the key attached to each individual profile. All of the data is tagged to each profile, so you can get aggregated statistics as well as see how each individual profile is performing. Your active orders page & transactions page will show which profile any data belongs to. Clicking <b>Statistics</b> on your profile page can show you individualized data for a profile.</p>
        <h3>Adding a new profile</h3>
        <p>Profiles can be created by clicking the <b>+</b> at the bottom right of your profile page or <span className={s.link} onClick={()=>this.setRoute("/dashboard/profile/addapi")}>clicking here</span>. You'll need to select whether you want to add a character or corporation API key. The relevant page will outline the <b>exact</b> permissions that your API key must have in order to be accepted. We don't wish to have access to more than we need to from your API keys.</p>
        <p><b>Keep in mind that after creating a new profile, it may take up to an hour for data to begin showing up for that profile.</b></p>
        <h3>Limits</h3>
        <p>Corporation profiles are limited to <b>premium</b> subscribers. There is currently a limit of 5 character profiles for free accounts, and up to 15 character or corporation profiles for premium subscribers.</p>
      </div>
    );
  }
}
