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
        <p>The purpose of these pages is to provide documentation for each of the core features of the application. Some additional information is also provided on the nuances of the EVE API and how they relate to EVE Exchange. After reading the reference guide users should understand how to set yourself up and utilize this application to its fullest leading to the best possible trading experience.
        </p>
        <h3>Contact & Support</h3>
        <p>If after reading this reference you still have questions or require technical support, the <b className={s.link} onClick={()=>this.setRoute("/dashboard/reference/contact")}>Contact</b> page will outline the best methods to reach a site owner.</p>
        <p>On behalf of the team behind EVE Exchange, we wish you the best in your trading endeavors, and love to hear feedback whether it's good or bad. A significant amount of time and effort has gone into developing this application, and we are constantly thriving for perfection. We look forward to watching you succeed and hearing about your experiences.</p>
      </div>
    );
  }
}
