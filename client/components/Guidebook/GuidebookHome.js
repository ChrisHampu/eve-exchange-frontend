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
        <div className={s.title}>Reference</div>
        <h3>Preface</h3>
        <p>Welcome to the <b>EVE Exchange</b> reference manual.</p>
        <p>The purpose of these pages are to provide documentation for each of the core features that this application can provide.
        Additionally, some of the nuances such as cache timers can be provided for features that heavily depend on the EVE API.
        The goal after reading this reference is that you'll be able to understand how to set yourself up to utilize this application to its fullest and have the best possible trading experience.
        </p>
        <h3>Contact & Support</h3>
        <p>If after reading this reference you still have questions or require technical support, the <b className={s.link} onClick={()=>this.setRoute("/dashboard/reference/contact")}>Contact</b> page will outline the best methods to reach a site owner.</p>
        <p>On behalf of the team behind EVE Exchange, we wish you the best in your trading endeavors, and love to hear feedback whether it's good or bad. A significant amount of time and effort has gone into developing this application, and we are constantly thriving for perfection. We look forward to watching you succeed and hearing about your experiences.</p>
      </div>
    );
  }
}
