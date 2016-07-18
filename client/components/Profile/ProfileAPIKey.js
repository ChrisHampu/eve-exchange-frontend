/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './ProfileAPIKey.scss';
import cx from 'classnames';
import { getAPIKeyInfo } from '../../utilities';
import { updateApiKey, removeApiKey } from '../../actions/settingsActions';

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

class APISettings extends React.Component {

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
          } else {
            this.setState({
              createKeyLoading: false,
              createStepIndex: this.state.createStepIndex + 1,
              apiKeyInfo: api,
              error: null
            })
          }
        });
      } else if (this.state.createStepIndex === 1) {

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
      } else if (this.state.createStepIndex === 2) {

        store.dispatch(updateApiKey({
          keyID: this.state.keyID,
          vCode: this.state.vCode,
          expires: this.state.apiKeyInfo.info.expires,
          characterID: this.state.apiKeyInfo.characters[this.state.selectedCharacter].characterID,
          characterName: this.state.apiKeyInfo.characters[this.state.selectedCharacter].characterName
        }));

        this.dummyAsync(() => this.setState({
          createKeyLoading: false,
          createStepIndex: this.state.createStepIndex + 1,
          error: null
        }));
      } else {
        this.dummyAsync(() => this.setState({
          createKeyLoading: false,
          createStepIndex: 0,
          createKey: false,
          error: null,
          keyiD: "",
          vCode: "",
          apiKeyInfo: {
            info: null,
            characters: []
          }
        }));
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
            <div>Access mask should be set to 23072779</div>
            <div>
              The following permissions should be enabled:
              <ul>
                <li>WalletTransactions, WalletJournal, MarketOrders, AccountBalance under Account and Market</li>
                <li>CharacterInfo, CharacterSheet, AssetList under Private Information</li>
              </ul>
            </div>
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
        return (
          <div>
            <div style={{marginBottom: "1.5rem"}}>
              Select which character to use
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

      case 2:
        return (
          <div>
            <div>This application will use these API features to augment your experience.</div>
            <div style={{marginTop: "0.3rem"}}>If you agree with the following usage, then hit Confirm to continue.</div>
            <ul style={{marginTop: "1rem"}}>
              <li style={{marginBottom: "0.3rem"}}>WalletTransactions & WalletJournal for profit tracking</li>
              <li style={{marginBottom: "0.3rem"}}>MarketOrders to display your open positions in the price ladders</li>
              <li style={{marginBottom: "0.3rem"}}>AccountBalance to display your liquid isk value</li>
              <li style={{marginBottom: "0.3rem"}}>AssetList to display your capital isk value</li>
              <li>CharacterInfo and CharacetSheet to retrieve & verify character Information</li>
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

  openRemoveApiDialog = () => this.setState({removeApiDialogOpen: true});
  closeRemoveApiDialog = () => this.setState({removeApiDialogOpen: false});

  doRemoveApiKey() {

    store.dispatch(removeApiKey());
    this.closeRemoveApiDialog();
  }

  render() {

    const removeApiActions = [
      <FlatButton
        label="Cancel"
        labelStyle={{color: "rgb(235, 169, 27)"}}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.closeRemoveApiDialog}
      />,
      <FlatButton
        label="Confirm"
        labelStyle={{color: "rgb(235, 169, 27)"}}
        primary={true}
        onTouchTap={()=>{this.doRemoveApiKey()}}
      />,
    ];

    return (
      <div className={s.root}>
        <Dialog
          actions={removeApiActions}
          modal={false}
          open={this.state.removeApiDialogOpen}
          onRequestClose={this.closeRemoveApiDialog}
        >
          You are about to remove your active API key from your account.
        </Dialog>
        {
          !this.props.settings.eveApiKey.keyID.length && !this.props.settings.eveApiKey.vCode.length ?
            <div>
            A Character API Key is required in order to access your current market orders, journal transactions, and other extra features.<br />
            You do not currently have an active API key set up.<br />
            {
              !this.state.createKey ? 
                <RaisedButton backgroundColor="rgb(30, 35, 39)"
                  labelColor="rgb(235, 169, 27)"
                  label="Create API Key"
                  style={{marginTop: "1rem"}}
                  onTouchTap={()=>this.setState({createKey: true})}/>
              : false
            }
            </div>
            :
            <div>
              You have an active API key set up.
              <div className={s.key_info}>
                <div className={s.info_row}>
                  <div className={s.info_key}>
                    Name:
                  </div>
                  <div className={s.info_value}>
                    {this.props.settings.eveApiKey.characterName}
                  </div>
                </div>
                <div className={s.info_row}>
                  <div className={s.info_key}>
                    Key ID:
                  </div>
                  <div className={s.info_value}>
                    {this.props.settings.eveApiKey.keyID}
                  </div>
                </div>
                <div className={s.info_row}>
                  <div className={s.info_key}>
                    vCode:
                  </div>
                  <div className={s.info_value}>
                    {this.props.settings.eveApiKey.vCode}
                  </div>
                </div>
                <div className={s.info_row}>
                  <div className={s.info_key}>
                    Access Mask:
                  </div>
                  <div className={s.info_value}>
                    23072779
                  </div>
                </div>
              </div>
              <RaisedButton backgroundColor="rgb(30, 35, 39)"
                labelColor="rgb(235, 169, 27)"
                label="Remove API key"
                onTouchTap={()=>this.setState({removeApiDialogOpen: true})}/>
            </div>
        }
        {
          this.state.createKey ? 
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
                    <StepLabel>Select character</StepLabel>
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
            : false
        }
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(APISettings);