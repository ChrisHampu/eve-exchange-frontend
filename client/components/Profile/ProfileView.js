/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './ProfileView.scss';
import cx from 'classnames';
import { formatNumber } from '../../utilities';
import { APIEndpointURL } from '../../globals';
import { getAuthToken } from '../../deepstream';
import { userHasPremium } from '../../auth';
import { sendAppNotification } from '../../actions/appActions';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';

class ProfileView extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      master_expanded: false,
      expanded: {},
      remove_request: null
    };
  }

  subscriptionLevelToName() {
    switch (this.props.subscription.premium) {
      case false:
        return "Free";
      case true:
        return <span style={{color: "rgb(235, 169, 27)"}}>Premium</span>;
    }
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  handleRemove(id) {

    this.setState({
      remove_request: id
    })
  }

  async doRemoveApiKey() {

    const id = this.state.remove_request;

    this.setState({
      remove_request: null
    });

    const response = await fetch(`${APIEndpointURL}/apikey/remove/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Token ${getAuthToken()}`
      }
    });

    const res = await response.json();

    if (res.error) {

      store.dispatch(sendAppNotification(res.error));

    } else {

      store.dispatch(sendAppNotification("API key has been removed from your account"));
    }
  }

  render() {

    let master = null;

    // Find a profile entry that matches the master account
    for(var i = 0; i < this.props.settings.profiles.length; i++) {
      const profile = this.props.settings.profiles[i];

      if (profile.type === 0 && profile.character_id === this.props.auth.id) {
        master = profile;
      }
    }

    return (
      <div className={s.profile_info}>
        <Dialog
          actions={[
            <FlatButton
              label="Cancel"
              labelStyle={{color: "rgb(235, 169, 27)"}}
              primary={true}
              keyboardFocused={true}
              onTouchTap={()=>this.setState({remove_request: null})}
            />,
            <FlatButton
              label="Confirm"
              labelStyle={{color: "rgb(235, 169, 27)"}}
              primary={true}
              onTouchTap={()=>{this.doRemoveApiKey()}}
            />,
          ]}
          modal={false}
          open={this.state.remove_request ? true : false}
          onRequestClose={()=>this.setState({remove_request: null})}
        >
          You are about to remove an active API key from your account.
        </Dialog>
        <div className={s.container}>
          <div 
            className={s.card}
            style={{width: this.props.settings.profiles.length?"50%":"100%"}}
          >
            <Card
              expanded={this.state.master_expanded}
              onExpandChange={(_expanded) => this.setState({master_expanded: _expanded})}
              containerStyle={{backgroundColor: "#282e33"}}
              style={{paddingRight: "1.5rem", backgroundColor: "rgba(0,0,0,0)", boxShadow:"none"}}
            >
              <CardHeader
                title={this.props.auth.name}
                subtitle={this.props.auth.corporation}
                avatar={`https://image.eveonline.com/Character/${this.props.auth.id}_64.jpg`}
                actAsExpander={true}
                showExpandableButton={true}
                style={{backgroundColor: "#1d2125"}}
                titleColor={this.props.subscription.premium?"rgb(235, 169, 27)":"rgba(255, 255, 255, 0.870588)"}
              />
              <CardText>
                <div>Master Account { master ? <span>- Wallet Balance: {formatNumber(master.wallet_balance||0)} ISK</span>:null}</div>
              </CardText>
              <CardText 
                expandable={true}
              >
                {
                  master ? 
                  <div>
                    <div>Key ID: {master.key_id}</div>
                    <div>vCode: {master.vcode}</div>
                  </div>
                  : <div>Your main character does not yet have an API key entry.</div>
                }
              </CardText>
              {
                master ? 
                  <CardActions>
                    <FlatButton label="Statistics" onTouchTap={()=>this.context.router.push(`/dashboard/profile/${master.id}`)} />
                    <FlatButton label="Remove" onTouchTap={(e,t) => this.handleRemove(master.id)} />
                  </CardActions> :
                  <CardActions>
                    <FlatButton label="Add API Key" onTouchTap={()=>this.context.router.push(`/dashboard/profile/addapi`)} />
                  </CardActions>
              }
            </Card>
          </div>
          {
            this.props.settings.profiles.map((profile, i) => {

              // Don't add a box for master account
              if (profile.character_id === this.props.auth.id && profile.type === 0) {
                return;
              }

              return (
                <div 
                  className={s.card}
                  style={{width: this.props.settings.profiles.length%2==(master?1:0)&&this.props.settings.profiles.length>1&&this.props.settings.profiles.length-1===i?"100%":"50%"}}
                  key={i}
                >
                  <Card 
                    expanded={this.state.expanded[i] || false} 
                    onExpandChange={(_expanded) => {this.setState({expanded: { ...this.state.expanded, [i]: _expanded}});}}
                    containerStyle={{backgroundColor: "#282e33"}}
                    style={{paddingRight: i%2===1&&this.props.settings.profiles.length-1!==i?"1.5rem":"", backgroundColor: "rgba(0,0,0,0)",boxShadow:"none"}}
                  >
                    <CardHeader
                      title={profile.type === 0 ? profile.character_name : profile.corporation_name}
                      subtitle={profile.type === 0 ? profile.corporation_name : `Accessor: ${profile.character_name}`}
                      avatar={`https://image.eveonline.com/${profile.type===0?"Character":"Corporation"}/${profile.type===0?profile.character_id:profile.corporation_id}_64.${profile.type===0?"jpg":"png"}`}
                      actAsExpander={true}
                      showExpandableButton={true}
                      style={{backgroundColor: "#1d2125"}}
                      titleColor={this.props.subscription.premium?"rgb(235, 169, 27)":"rgba(255, 255, 255, 0.870588)"}
                    />
                    <CardText>
                      {
                        !userHasPremium() && profile.type === 1?
                        <div className={s.disabled}>Profit tracking is paused for this profile while you do not have an active premium subscription</div> :
                        <span>Wallet Balance: {formatNumber(profile.wallet_balance||0)} ISK</span>
                      } 
                    </CardText>
                    <CardText 
                      expandable={true}
                    >
                      <div>Key ID: {profile.key_id}</div>
                      <div>vCode: {profile.vcode}</div>
                    </CardText>
                    <CardActions>
                      <FlatButton label="Statistics" onTouchTap={()=>this.context.router.push(`/dashboard/profile/${profile.id}`)} />
                      <FlatButton label="Remove" onTouchTap={(e,t) => {this.handleRemove(profile.id)}} />
                    </CardActions>
                  </Card>
                </div>
              )
            })
          }
        </div>
        <FloatingActionButton 
          backgroundColor="#1d2125" 
          iconStyle={{fill:"rgb(235, 169, 27)", color:"rgb(235, 169, 27)"}}
          style={{position:"fixed", "right":"2rem", "bottom":"2rem"}}
          onTouchTap={()=>this.context.router.push("/dashboard/profile/addapi")}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { auth: store.auth, subscription: store.subscription, eveapi: store.eveapi, settings: store.settings };
}

export default connect(mapStateToProps)(ProfileView);