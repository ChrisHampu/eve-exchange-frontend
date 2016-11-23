import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookHome extends React.Component {

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Notifications</div>
        <p>Currently we can only deliver notifications to your EVE Exchange clients. In the future we will support multiple forms of notifications and better customization.</p>
        <p>We will currently notify you for the following reasons:</p>
        <ul>
          <li>Upon account creation</li>
          <li>When a deposit has been made into your account</li>
          <li>When a withdrawal request has been completed</li>
          <li>Renewal of services</li>
        </ul>
      </div>
    );
  }
}
