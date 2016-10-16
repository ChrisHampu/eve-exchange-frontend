import React from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import { browserHistory } from 'react-router'
import s from './Onboarding.scss';
import cx from 'classnames';
import { isLoggedIn } from '../../auth';

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
        <div>
          <Paper>
            <AppBar className={s.header} title="EVE Exchange" showMenuIconButton={false} iconElementRight={
              <Tabs inkBarStyle={{display:"none"}}>
                {
                  this.state.loggedIn ?
                    <Tab onActive={()=>{ this.setRoute("/dashboard"); }} label="Dashboard" style={{padding: "0.5rem 1.5rem", fontSize: "1.2rem"}} />
                    : <Tab onActive={()=>{ this.setRoute("/login"); }} label="Login" style={{padding: "0.5rem 1.5rem", fontSize: "1.2rem"}} />
                }
                {
                  this.state.loggedIn ?
                    <Tab onActive={()=>{ this.setRoute("/logout"); }} label="Logout" style={{padding: "0.5rem 1.5rem", fontSize: "1.2rem"}} />
                  : false
                }
              </Tabs>
            }/>
        </Paper>
        <div style={{color: "#ffffff", padding: "1rem"}}>This is the onboarding/home page.</div>
      </div>
    );
  }
}
