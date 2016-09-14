import React from 'react';
import s from './LoginComponent.scss';
import horizon from '../../horizon';
import { getAuthEndpoint } from '../../horizon';
import sso_image from '../../assets/img/EVESSO_Button.png';

export default class Login extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      endpoint: ""
    };
  }

  async componentWillMount() {

    this.setState({
      endpoint: await getAuthEndpoint()
    });
  }

  render() {
    return (
      <div className={s.root}>
        <div>
          <div className={s.text}>
          Sign in to begin using EVE Trade Forecaster
          </div>
          <a href={this.state.endpoint} style={{backgroundImage: `url(${sso_image.src})`}}></a>
        </div>
      </div>
    );
  }
}
