import React from 'react';
import s from './LoginComponent.scss';

import { APIEndpointURL } from '../../globals';

import sso_image from 'assets/img/EVESSO_Button.png';
import logo_image from 'assets/img/eve-x-logo.png';

export default class Login extends React.Component {

  render() {
    return (
      <div className={s.root}>
        <div>
          <div className={s.text}>
          Sign in to begin using EVE Exchange
          </div>
          <a href={`${APIEndpointURL}/oauth`} style={{backgroundImage: `url(${sso_image})`}}></a>
        </div>
        <div className={s.hover}>
          <div className={s.logo}>
            <img src={logo_image} />
          </div>
        </div>
      </div>
    );
  }
}
