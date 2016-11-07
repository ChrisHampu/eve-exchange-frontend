/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './APIStepperControl.scss';
import cx from 'classnames';
import { getAPIKeyInfo, formatNumber } from '../../utilities';
import { updateApiKey, removeApiKey } from '../../actions/settingsActions';
import { APIEndpointURL } from '../../globals';
import { getAuthToken } from '../../deepstream';

import RaisedButton from 'material-ui/RaisedButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import FlatButton from 'material-ui/FlatButton';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Dialog from 'material-ui/Dialog';

import WarningIcon from 'material-ui/svg-icons/alert/warning';

class APIStepperControl extends React.Component {

  static PropTypes = {
    type: React.PropTypes.number // 0 for character or 1 for corporation
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      createKey: false,
      createStepIndex: 0,
      createKeyLoading: false,
      keyID: "",
      vCode: "",
      error: null,
      apiKeyInfo: {
        info: null,
        characters: []
      },
      selectedCharacter: 0,
      selectedDivision: 0,
      removeApiDialogOpen: false
    };
  }

  dummyAsync = (cb) => {
    this.setState({createKeyLoading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };

  handleCreateKeyNext = () => {

    if (!this.state.createKeyLoading) {

      if (this.state.createStepIndex === 0) {
       getAPIKeyInfo(this.state.keyID, this.state.vCode).then((api) => {

          if (api.error) {
            this.setState({
              createKeyLoading: false,
              error: api.error
            })
          } else if (api.info.type !== this.props.type) {
            this.dummyAsync(() => this.setState({
              createKeyLoading: false,
              error: `Not a valid ${this.props.type===0?"character":"corporation"} key.`
            }));
          } else if (new Date() > api.info.expires) {
            this.dummyAsync(() => this.setState({
              createKeyLoading: false,
              error: 'This API key is expired'
            }));
          } else if (api.info.type === 1 && api.divisions.length === 0) {
            this.dummyAsync(() => this.setState({
              createKeyLoading: false,
              error: 'Failed to load wallet divisions. Do you have the necessary permissions to access the corporation wallets?'
            }));
          } else {
            this.dummyAsync(() => this.setState({
              createKeyLoading: false,
              createStepIndex: this.state.createStepIndex + 1,
              apiKeyInfo: api,
              error: null
            }));
          }
        });
      } else if (this.state.createStepIndex === 1) {

          if (this.props.type === 0) {
            if (this.state.apiKeyInfo.characters[this.state.selectedCharacter] === 'undefined') {
              this.dummyAsync(() => this.setState({
                createKeyLoading: false,
                error: "Not a valid character. Go back and try again."
              }));
            } else {
              this.dummyAsync(() => this.setState({
                createKeyLoading: false,
                createStepIndex: this.state.createStepIndex + 1,
                error: null
              }));
            }
          } else {
            if (this.state.apiKeyInfo.divisions[this.state.selectedDivision] === 'undefined') {
              this.dummyAsync(() => this.setState({
                createKeyLoading: false,
                error: "Not a valid division. Go back and try again."
              }));
            } else {
              this.dummyAsync(() => this.setState({
                createKeyLoading: false,
                createStepIndex: this.state.createStepIndex + 1,
                error: null
              }));
            }
          }
      } else if (this.state.createStepIndex === 2) {

        this.setState({createKeyLoading: true}, async () => {

          try {
            const response = await fetch(`${APIEndpointURL}/apikey/add`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Token ${getAuthToken()}`
              },
              body: JSON.stringify({
                keyID: this.state.keyID,
                vCode: this.state.vCode,
                type: this.state.apiKeyInfo.info.type,
                characterID: parseInt(this.state.apiKeyInfo.info.type == 0 ? 
                  this.state.apiKeyInfo.characters[this.state.selectedCharacter].characterID 
                  : this.state.apiKeyInfo.characters[0].characterID),
                walletKey: this.state.apiKeyInfo.divisions.length ? this.state.apiKeyInfo.divisions[this.state.selectedDivision].key : 0
              })
            });

            const res = await response.json();

            if (res.error) {
              throw res.error;
            }

            this.setState({
              createKeyLoading: false,
              createStepIndex: this.state.createStepIndex + 1,
              error: null
            });

          } catch(e) {
            this.setState({
              createKeyLoading: false,
              error: e.message ? e.message : e // Check for exception vs string error
            });
          }
        });

      } else {
        this.dummyAsync(() => this.context.router.push('/dashboard/profile'));
      }
    }
  };

  handleCreateKeyPrev = () => {

    if (!this.state.createKeyLoading) {

      let state = {
        error: null
      };

      if (this.state.createStepIndex === 1) {
        state.keyiD = "";
        state.vCode = "";
        state.apiKeyInfo = {
          info: null,
          characters: []
        };
      }

      if (this.state.createStepIndex === 2) {
        state.selectedCharacter = 0
      }

      if (this.state.createStepIndex === 3) {
        store.dispatch(removeApiKey());
      }

      this.dummyAsync(() => this.setState({
        createKeyLoading: false,
        createStepIndex: this.state.createStepIndex - 1,
        ...state
      }));
    }
  }

  renderStepperContent() {

    switch (this.state.createStepIndex) {
      case 0:
        return (
          <div>
            {
              this.props.type === 0 ? 
                <div>
                  <div>Access mask should be set to 23072779</div>
                  <div>
                    The following permissions should be enabled:
                    <ul>
                      <li>WalletTransactions, WalletJournal, MarketOrders, AccountBalance under 'Account and Market'</li>
                      <li>CharacterInfo, CharacterSheet, AssetList under Private Information</li>
                    </ul>
                  </div>
                </div>
                :
                <div>
                  <div>Access mask should be set to 3149835</div>
                  <div>
                    The following permissions should be enabled:
                    <ul>
                      <li>WalletTransactions, WalletJournal, MarketOrders, AccountBalance under 'Account and Market'</li>
                      <li>CorporationSheet, AssetList under Private Information</li>
                    </ul>
                  </div>
                </div>
            }
            <TextField
              type="text"
              errorText={this.state.error && this.state.createStepIndex === 0 ? this.state.error : null}
              floatingLabelText="Key ID"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={(event) => this.setState({keyID: event.target.value})}
            />
            <TextField
              type="text"
              errorText={this.state.error && this.state.createStepIndex === 0 ? this.state.error : null}
              floatingLabelText="vCode"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={(event) => this.setState({vCode: event.target.value})}
            />
          </div>
        );

      case 1:
        if (this.props.type === 0)
          return (
            <div>
              <div style={{marginBottom: "1.5rem"}}>
                Select which character to use.
              </div>
              <RadioButtonGroup 
                name="selectCharacter" 
                defaultSelected="0" 
                className={s.char_select}
                onChange={(ev, val)=>this.setState({selectedCharacter: parseInt(val)})}>
                {
                  this.state.apiKeyInfo.characters.map((el, i) => {
                    return (
                      <RadioButton
                        key={i}
                        value={i.toString()}
                        label={el.characterName}
                        style={{marginBottom: "1rem", fill: "rgb(36, 173, 204)"}}
                      />
                    )
                  })
                }
              </RadioButtonGroup>
            </div>
          );
        else
          return (
            <div>
              <div style={{marginBottom: "1.5rem"}}>
                Select which wallet division to use. Division 1 is your master wallet.
              </div>
              <RadioButtonGroup 
                name="selectDivision" 
                defaultSelected="0" 
                className={s.char_select}
                onChange={(ev, val)=>this.setState({selectedDivision: parseInt(val)})}>
                {
                  this.state.apiKeyInfo.divisions.map((el, i) => {
                    return (
                      <RadioButton
                        key={i}
                        value={i.toString()}
                        label={`Division ${el.key-999}  -  Balance: ${formatNumber(el.balance)} ISK`}
                        style={{marginBottom: "1rem", fill: "rgb(36, 173, 204)"}}
                      />
                    )
                  })
                }
              </RadioButtonGroup>
            </div>
          );

      case 2:
        if (this.state.error) {
          return (
            <div>
              There was an error while processing your API key request. You can try to correct the below error and try again,
              or contact Maxim Stride for support.<br />
              Please include this error messagage in any support request.
              <div className={s.error_text}>{this.state.error}</div>
            </div>
          );
        }
        if (this.props.type === 0)
          return (
            <div>
              <div>EVE Exchange will use the following API features using your key.</div>
              <div style={{marginTop: "0.3rem"}}>If you agree with the following usage, then hit Confirm to continue.</div>
              <ul style={{marginTop: "1rem"}}>
                <li style={{marginBottom: "0.3rem"}}>WalletTransactions & WalletJournal for profit tracking</li>
                <li style={{marginBottom: "0.3rem"}}>MarketOrders to display your open positions in the price ladders</li>
                <li style={{marginBottom: "0.3rem"}}>AccountBalance to display your liquid isk value</li>
                <li style={{marginBottom: "0.3rem"}}>AssetList to display your assets & capital isk value</li>
                <li>CharacterInfo and CharacetSheet to retrieve & verify character Information</li>
              </ul>
            </div>
          );
        else
          return (
            <div>
              <div>EVE Exchange will use the following API features using your key</div>
              <div style={{marginTop: "0.3rem"}}>If you agree with the following usage, then hit Confirm to continue.</div>
              <ul style={{marginTop: "1rem"}}>
                <li style={{marginBottom: "0.3rem"}}>WalletTransactions & WalletJournal for profit tracking</li>
                <li style={{marginBottom: "0.3rem"}}>MarketOrders to display your open positions in the price ladders</li>
                <li style={{marginBottom: "0.3rem"}}>AccountBalance to access corporation wallet divisions</li>
                <li style={{marginBottom: "0.3rem"}}>AssetList to display your assets & capital isk value</li>
                <li>CorporationSheet to retrieve & verify corporation Information</li>
              </ul>
            </div>
          );

      case 3:
        return (
          <div>
            <div>Your API is set up and ready for use. Hit Finish to close the setup box.</div>
          </div>
        );
    }
  }

  renderCreateKey() {
    return (
      <div>
        <div>
        {this.renderStepperContent()}
        </div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          <RaisedButton
            backgroundColor="#1e2327"
            labelColor="rgb(235, 169, 27)"
            label="Back"
            disabled={this.state.createStepIndex === 0}
            onTouchTap={this.handleCreateKeyPrev}
            primary={false}
            disabledBackgroundColor="rgb(30, 35, 39)"
            style={{marginRight: 12}}
          />
          <RaisedButton
            backgroundColor="rgb(30, 35, 39)"
            labelColor="rgb(235, 169, 27)"
            label={this.state.createStepIndex === 3 ? 'Finish' : ( this.state.createStepIndex === 2 ? 'Confirm' : 'Next' )}
            primary={true}
            onTouchTap={this.handleCreateKeyNext}
          />
        </div>
      </div>
    )
  }

  render() {

    return (
      <div className={s.root}>
        <div className={s.create_key} style={{backgroundColor: "#1e2327", padding: "0 1rem 1rem 1rem"}}>
          <div className={s.stepper}>
            <Stepper activeStep={this.state.createStepIndex}>
              <Step>
                {
                  this.state.error && this.state.createStepIndex === 0 ?
                  <StepLabel icon={<WarningIcon />}>Enter API Key</StepLabel>
                  : <StepLabel>Enter API Key</StepLabel>
                }
              </Step>
              <Step>
                <StepLabel>{this.props.type === 0 ? "Select character" : "Select wallet division"}</StepLabel>
              </Step>
              <Step>
                <StepLabel>Review permissions</StepLabel>
              </Step>
              <Step>
                <StepLabel>Finalize API setup</StepLabel>
              </Step>
            </Stepper>
          </div>
          <ExpandTransition loading={this.state.createKeyLoading} open={true}>
            {this.renderCreateKey()}
          </ExpandTransition>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(APIStepperControl);