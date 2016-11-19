import React from 'react';
import { browserHistory } from 'react-router'
import s from './Onboarding.scss';
import cx from 'classnames';
import { isLoggedIn } from '../../auth';

import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

export default class OnboardingComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: isLoggedIn()
    };
  }

  setRoute(route) {

    browserHistory.push(route);
  }

  componentWillReceiveProps() {

    this.setState({
      loggedIn: isLoggedIn()
    });
  }

  render() {
    return (
      <div className={s.container}>
        <div className={cx(s.main, s.landing)}>
          <div className={s.dashboard}>
            <FlatButton 
              label="Dashboard" 
              secondary={true} 
              onClick={()=>this.setRoute(this.state.loggedIn?"/dashboard":"/login")}
            />
          </div>
          <div className={s.scroll_down}>
            <IconButton
              style={{width: "48px", height: "48px"}}
            >
              <ArrowDown />
            </IconButton>
          </div>
          <div className={s.main_title}>
            <div className={s.site_title}>
            eve.exchange
            </div>
            <div className={s.site_blurb}>
            The most advanced trading application in New Eden
            </div>
            <RaisedButton
              label={this.state.loggedIn?"Go to your dashboard":"Sign in with SSO"}
              secondary={true}
              icon={<LockIcon />}
              labelColor="#000000"
              labelStyle={{color: "#000000"}}
              onClick={()=>this.setRoute(this.state.loggedIn?"/dashboard":"/login")}
            />
            <div className={s.button_blurb}>
            No registration required, instance access
            </div>
          </div>
        </div>
      </div>
    );
  }
}
