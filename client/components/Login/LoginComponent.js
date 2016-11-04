import React from 'react';
import s from './LoginComponent.scss';
import sso_image from '../../assets/img/EVESSO_Button.png';

export default class Login extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      endpoint: "http://api.eve.exchange/oauth"
    };
  }

  render() {
    return (
      <div className={s.root}>
        <div>
          <div className={s.text}>
          Sign in to begin using EVE Exchange
          </div>
          <a href={this.state.endpoint} style={{backgroundImage: `url(${sso_image.src})`}}></a>
        </div>
      </div>
    );
  }
}
