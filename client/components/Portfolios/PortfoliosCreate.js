/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './PortfoliosCreate.scss';
import cx from 'classnames';
import { sendAppNotification } from '../../actions/appActions';
import { getMarketItemNames, itemNameToID, itemIDToName } from '../../market';
import { getAuthToken } from '../../deepstream';
import { getMarketGroupTree } from '../../market';
import { APIEndpointURL } from '../../globals';

import MarketBrowserListItem from '../MarketBrowser/MarketBrowserListItem';

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
import AutoComplete from 'material-ui/AutoComplete';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';

import WarningIcon from 'material-ui/svg-icons/alert/warning';
import RemoveIcon from 'material-ui/svg-icons/content/remove';

class PortfoliosCreate extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      createStepIndex: 0,
      createStepLoading: false,
      portfolioType: 0,
      portfolioName: "",
      portfolioDesc: "",
      portfolioSearchTradingItem: null,
      portfolioSearchIndustryItem: null,
      portfolioSearchTradingQuantity: null,
      portfolioSelectedItems: [],
      portfolioIndustryEfficiency: 0,
      portfolioIndustryItem: null,
      showProgressCircle: false,
      portfolioIndustryQuantity: 1,
    };

    this.blueprints = []; 
 
    for (var i = 0; i < this.props.sde.blueprints.length; i++) { 
 
      this.blueprints.push(itemIDToName(this.props.sde.blueprints[i]));
    } 
  }

  getBlueprints() {

    return this.blueprints;
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  verifyName() {
    if (this.state.portfolioName === null || this.state.portfolioName === "") {
      return "Enter a valid name";
    } else if (this.state.portfolioName.length < 4) {
      return "Minimum of 4 characters";
    } else if (this.state.portfolioName.length > 32) {
      return "Maximum of 32 characters";
    }

    return true;
  }

  verifyDesc() {

    if (this.state.portfolioDesc.length > 100) {
      return "Maximum of 100 characters";
    }

    return true;
  }

  dummyAsync = (cb) => {
    this.setState({createStepLoading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };

  goNextStep() {

    this.dummyAsync(() => this.setState({
      createStepLoading: false,
      createStepIndex: this.state.createStepIndex + 1,
      error: null
    }));
  }

  goPrevStep() {

    this.dummyAsync(() => this.setState({
      createStepLoading: false,
      createStepIndex: Math.max(0, this.state.createStepIndex - 1),
      error: null
    }));
  }

  parseEFT(eft) {

    this.refs.eft.value = "";

    const lines = eft.split('\n');

    if (!lines.length) {
      this.refs.eft.value = "";
      return;
    }

    const header = /^\[(.+), (.+)\]/.exec(lines.shift());

    try {
      if (header.length !== 3) {

        sendAppNotification("Failed to parse EFT header");
        return;
      }
    } catch (err) {

      sendAppNotification("Failed to parse EFT header");
      return;
    }

    const ship = header[1];

    this.addTradingItem({name: ship}, 1);

    for (const line of lines) {

      if (!line.length || line[0] === ' ') {
        continue;
      }

      const match = /^(.+) x([0-9]+)|(.+)/.exec(line);

      const count = parseInt(match[2]) || 1;

      let item = match[1] || match[3];

      // EFT adds a comma with a preloaded ammo type after it. Remove anything after the first comma
      if (item.indexOf(',') !== -1) {
        item = item.split(', ')[0];
      }

      this.addTradingItem({name: item}, count);
    }
  }

  handleCreatePortfolioNext = () => {

    if (!this.state.createStepLoading) {

      if (this.state.createStepIndex === 0) {

        if (this.state.portfolioType !== 0 && this.state.portfolioType !== 1) {
          this.setState({
            createStepLoading: false,
            error: "Select a portfolio type"
          });
        } else {
          
          this.goNextStep();
        }

      } else if (this.state.createStepIndex === 1) {

        if (this.verifyName() !== true || this.verifyDesc() !== true) {
          this.setState({
            createStepLoading: false,
            error: true
          });
        } else {
          
          this.goNextStep();
        }

      } else if (this.state.createStepIndex === 2) {

        if (this.state.portfolioType === 1) {

          if (this.state.portfolioIndustryItem && this.blueprints.indexOf(this.state.portfolioIndustryItem) !== -1) {
            this.goNextStep();
          } else {
            this.setState({
              createStepLoading: false,
              error: "Search for your item using the input box and use the dropdown to select an item, or type in a case-sensitive name if your item doesn't appear in the dropdown"
            });
          }
        } else {
          if (this.state.portfolioSelectedItems.length === 0) {
            this.setState({
              createStepLoading: false,
              error: "There are no selected items"
            });
          } else {
            
            this.goNextStep();
          }
        }

      } else {

        try {

          let components = [];

          if (this.state.portfolioType === 0) {
            components = this.state.portfolioSelectedItems.map(el => {
              return {
                quantity: parseInt(el.quantity),
                typeID: parseInt(itemNameToID(el.name))
              }
            });
          } else {
            components = [{typeID: parseInt(itemNameToID(this.state.portfolioIndustryItem)), quantity: parseInt(this.state.portfolioIndustryQuantity)}]
          }

          const body = {
              name: this.state.portfolioName,
              description: this.state.portfolioDesc,
              components,
              type: this.state.portfolioType,
              efficiency: Math.max(0, Math.min(10, parseInt(this.state.portfolioIndustryEfficiency)))
            };

          this.setState({
            createStepLoading: true,
            showProgressCircle: true
          }, async () => {

            setTimeout(()=>{

              this.setState({
                createStepLoading: false
              });                
            }, 500);

            try {
              const res = await fetch(`${APIEndpointURL}/portfolio/create`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${getAuthToken()}`
                },
                body: JSON.stringify(body)
              });

              const result = await res.json();

              if (result.error) {

                store.dispatch(sendAppNotification(result.error));

                throw (result.error);
              } else {

                store.dispatch(sendAppNotification("Portfolio has been created and will update within 5 minutes"));
              }

              this.setState({
                createStepLoading: true,
                showProgressCircle: false
              }, () => {

                setTimeout(()=>{

                  this.setRoute("/dashboard/portfolios");
                }, 500);
              });

            } catch(e) {
              console.log(e);

              this.setState({
                createStepLoading: false,
                showProgressCircle: false,
                error: `There was a a problem saving your portfolio: ${e}`
              });
            }
          });

        } catch(e) {
          console.log(e);

          this.setState({
            createStepLoading: false,
            showProgressCircle: false,
            error: "There was an error saving your portfolio"
          });
        }
      }
    }
  };

  // TODO: Invalidate state!
  handleCreatePortfolioPrev = () => {

    if (!this.state.createStepLoading) {

      this.goPrevStep();
    }
  };

  renderStepperContent() {

    switch (this.state.createStepIndex) {

      case 0:
        return (
          <div>
            <div style={{marginBottom: "1.5rem"}}>
              Select which type of portfolio to create
            </div>
            <RadioButtonGroup 
              name="selectPortfolioType" 
              defaultSelected="0"
              className={s.select}
              onChange={(ev, val)=>this.setState({portfolioType: parseInt(val)})}>
                <RadioButton
                  value="0"
                  label="Trading"
                  style={{marginBottom: "1rem", fill: "rgb(36, 173, 204)"}}
                />
                <RadioButton
                  value="1"
                  label="Industry"
                  style={{marginBottom: "1rem", fill: "rgb(36, 173, 204)"}}
                />
            </RadioButtonGroup>
            <div>
              Trading: Optimized for tracking profitable trades and long term investments
            </div>
            <div style={{marginTop: "0.5rem"}}>
              Industry: Exclusive to manufacturable items. Optimized for tracking material prices, manufacturing profit, and features specialized charts
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <TextField
              type="text"
              errorText={this.state.error && this.state.createStepIndex === 1 && this.verifyName() !== true ? this.verifyName() : null}
              floatingLabelText="Portfolio Name"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={(event) => this.setState({portfolioName: event.target.value})}
            />
            <TextField
              type="text"
              errorText={this.state.error && this.state.createStepIndex === 1 && this.verifyDesc() !== true ? this.verifyDesc() : null}
              floatingLabelText="Portfolio Description (Optional)"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={(event) => this.setState({portfolioDesc: event.target.value})}
              ref="eft"
            />
          </div>
        );
      case 2:
        if (this.state.portfolioType === 0) {
          return this.renderTradingSelect();
        } else {
          return this.renderIndustrySelect();
        }
      case 3:
        return (
          <div>
            <div style={{color: "#fff", marginBottom: "1rem"}}>
            Confirm portfolio creation
            </div>
            <div style={{marginBottom: "1rem"}}>
            Type: <span style={{color: "#fff"}}>{this.state.portfolioType===0?"Trading":"Industry"}</span>
            </div>
            <div style={{marginBottom: "1rem"}}>
            Name: <span style={{color: "#fff"}}>{this.state.portfolioName}</span>
            </div>
            {
              this.state.portfolioDesc && this.state.portfolioDesc.length ?
                <div>
                  <div style={{marginBottom: "1rem"}}>
                  Description: <span style={{color: "#fff"}}>{this.state.portfolioDesc}</span>
                  </div>
                </div>
                : false
            }
            {
              this.state.portfolioType === 0 ?
                <div>
                  <div style={{marginBottom: "1rem"}}>
                  Components:
                  </div>
                  {this.renderPortfolioItemsArray()}
                </div>
                :
                <div>
                  <div style={{marginBottom: "1rem"}}>
                  Manufactured Item: <span style={{color: "#fff"}}>{this.state.portfolioIndustryItem}</span>
                  </div>
                  <div style={{marginBottom: "1rem"}}>
                  Manufactured Quantity: <span style={{color: "#fff"}}>{this.state.portfolioIndustryQuantity}</span>
                  </div>
                </div>
            }
            <div style={{color: "#fff", margin: "1.25rem 0"}}>
            If the above looks correct, hit Finish to create your new portfolio
            </div>
            {
              this.state.error ?
                <div className={s.error_text}>{this.state.error}</div> : false
            }
          </div>
        )
    }
  }

  updateTradingSearch = (chosenRequest, index) => {

    this.setState({
      portfolioSearchTradingItem: chosenRequest
    });
  };

  updateTradingSearchText = (text) => {

    this.setState({
      portfolioSearchTradingItem: text
    });
  };

  addTradingItem(item, quantity) {

    if (!item && (!this.state.portfolioSearchTradingQuantity || !this.state.portfolioSearchTradingItem)) {
      this.setState({
        error: "Select an item and enter a valid quantity"
      });
    } else {

      const items = this.state.portfolioSelectedItems;

      const newItem = item ? item.name : this.state.portfolioSearchTradingItem;
      const newQuantity = quantity || this.state.portfolioSearchTradingQuantity || 1;

      const existingIndex = items.findIndex(el => el.name == newItem);

      if (existingIndex !== -1) {

        items[existingIndex].quantity += newQuantity;

      } else {
        items.push({
          quantity: newQuantity,
          name: newItem
        });
      }

      this.setState({
        error: null,
        portfolioSelectedItems: items
      });
    }
  }

  removeTradingItem(index) {

    this.state.portfolioSelectedItems.splice(index, 1);

    this.setState({
      portfolioSelectedItems: this.state.portfolioSelectedItems
    });
  }

  renderTradingSelect() {
    return (
      <div className={cx({[s.fullheight]: this.state.createStepIndex === 2 && this.state.portfolioType === 0})}>
        <div style={{marginBottom: "0.5rem"}}>
          Search for portfolio items or select them from the market browser.
        </div>
        <div className={s.select_columns}>
          <div className={s.select_pane} style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex"}}>
              <div style={{verticalAlign: "middle"}}>
                <AutoComplete
                  hintText="Type item name"
                  dataSource={getMarketItemNames()}
                  filter={AutoComplete.caseInsensitiveFilter}
                  maxSearchResults={6}
                  menuStyle={{cursor: "pointer"}}
                  onNewRequest={this.updateTradingSearch}
                  onUpdateInput={this.updateTradingSearchText}
                />
                <TextField
                  type="number"
                  floatingLabelText="Type quantity"
                  inputStyle={{color: "#FFF"}}
                  style={{display: "block", marginBottom: ".8rem"}}
                  onChange={(event) => this.setState({portfolioSearchTradingQuantity: parseInt(event.target.value)})}
                />
              </div>
              <div style={{flex: "1", verticalAlign: "middle", color: "#eba91b", display: "flex", alignItems: "center", fontWeight: 300}}><span style={{minWidth: "30px", width: "100%", textAlign: "center"}}>OR</span></div>
              <div style={{verticalAlign: "middle"}}>
                <div style={{marginTop: "0.75rem", fontSize: "16px", lineHeight: "24px", width: "256px", height: "72px", display: "block", position: "relative", backgroundColor: "transparent", transition: "height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms", marginBottom: "0.8rem"}}>
                  <label style={{position: "absolute", lineHeight: "22px", top: "38px", transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms", zIndex: 1, cursor: "text", pointerEvents: "none", color: "rgba(255, 255, 255, 0.298039)", transform: "scale(1) translate(0px, 0px)", transformOrigin: "left top 0px", userSelect: "none"}}>
                  Paste EFT
                  </label>
                  <textarea onChange={(event)=>this.parseEFT(event.target.value)} ref="eft" type="text" style={{padding: "0px", position: "relative", width: "100%", border: "none", outline: "none", backgroundColor: "rgba(0, 0, 0, 0)", color: "rgb(255, 255, 255)", cursor: "initial", height: "100%", boxSizing: "border-box", marginTop: "14px"}} />
                <div>
                  <hr style={{borderTop: "none rgba(255, 255, 255, 0.298039)", borderRight: "none rgba(255, 255, 255, 0.298039)", borderBottom: "1px solid rgba(255, 255, 255, 0.298039)", borderLeft: "none rgba(255, 255, 255, 0.298039)", bottom: "8px", boxSizing: "content-box", margin: "0px", position: "absolute", width: "100%"}} />
                  <hr style={{borderTop: "none rgb(51, 58, 65)", borderRight: "none rgb(51, 58, 65)", borderBottom: "2px solid rgb(51, 58, 65)", borderLeft: "none rgb(51, 58, 65)", bottom: "8px", boxSizing: "content-box", margin: "0px", position: "absolute", width: "100%", transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms", transform: "scaleX(0)"}} />
                  </div>
                </div>
              </div>
            </div>
            <FlatButton
              label="Add Item"
              labelStyle={{color: "rgb(235, 169, 27)"}}
              style={{maxWidth: "256px"}}
              primary={true}
              onTouchTap={()=>{this.addTradingItem()}}
            />
            <div style={{marginTop: "1.5rem", flex: "1", overflowY: "scroll", overflowX: "hidden", paddingRight: "1rem"}}>
              {this.renderPortfolioItemsArray()}
            </div>
          </div>
          <div className={cx(s.select_pane, s.market_browser)}>
            {
              getMarketGroupTree().map((el, i) => {
                return(<MarketBrowserListItem selector={(item)=>{this.addTradingItem(item, 1)}} element={el} key={i} depth={0} />);
              })
            }
          </div>
        </div>
        {
          this.state.error ?
            <div className={s.error_text}>{this.state.error}</div> : false
        }
      </div>
    )
  }

  renderPortfolioItemsArray() {
    return (
      <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow selectable={false}>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Quantity</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
        {
          this.state.portfolioSelectedItems.length === 0 ? 
            <TableRow selectable={false}>
              <TableRowColumn>No items selected yet</TableRowColumn>
            </TableRow>
            :
            this.state.portfolioSelectedItems.map((el, i) => {
              return (
                <TableRow key={i} selectable={false}>
                  <TableRowColumn>
                    <div className={s.remove_button}>
                      <IconButton onTouchTap={()=>this.removeTradingItem(i)} tooltip={null} tooltipPosition="top-center" style={{cursor: "pointer"}}>
                        <RemoveIcon />
                      </IconButton>
                    </div>
                    <div className={s.item_name}>
                    {el.name}
                    </div>
                  </TableRowColumn>
                  <TableRowColumn>{el.quantity}</TableRowColumn>
                </TableRow>
              )
            })
        }
        </TableBody>
      </Table>
    );
  }

  updateIndustrySearch = (chosenRequest, index) => {

    this.setState({
      portfolioIndustryItem: chosenRequest
    });
  };

  updateIndustrySearchText = (text) => {

    this.setState({
      portfolioIndustryItem: text
    });
  };

  renderIndustrySelect() {
    return (
      <div>
        <div style={{marginBottom: "0.5rem"}}>
          Select which manufactured item to track<br />
          The material modifier should be a number from 0 - 10 as the percentage to reduce input materials
        </div>
        <AutoComplete
          hintText="Type item to manufacture"
          dataSource={this.blueprints}
          filter={AutoComplete.caseInsensitiveFilter}
          maxSearchResults={6}
          menuStyle={{cursor: "pointer"}}
          onNewRequest={this.updateIndustrySearch}
          onUpdateInput={this.updateIndustrySearchText}
        />
        <TextField
          type="number"
          floatingLabelText="Number of runs"
          inputStyle={{color: "#FFF"}}
          style={{display: "block", marginBottom: ".8rem"}}
          onChange={(event) => this.setState({portfolioIndustryQuantity: parseInt(vent.target.value)})}
        />
        <TextField
          type="number"
          floatingLabelText="Material modifier percentage"
          inputStyle={{color: "#FFF"}}
          style={{display: "block", marginBottom: ".8rem"}}
          onChange={(event) => this.setState({portfolioIndustryEfficiency: parseInt(event.target.value)})}
        />
        {
          this.state.error ?
            <div className={s.error_text}>{this.state.error}</div> : false
        }
      </div>
    )
  }

  renderCreatePortfolio() {

    if (this.state.showProgressCircle) {
      return (
        <div style={{display: "flex", alignItems: "center", width: "100%", minHeight: "150px"}}>
          <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
        </div>
      )
    }

    return (
      <div className={cx({[s.fullheight]: this.state.createStepIndex === 2 && this.state.portfolioType === 0})}>
        <div className={cx({[s.fullheight]: this.state.createStepIndex === 2 && this.state.portfolioType === 0})}>
        {this.renderStepperContent()}
        </div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          <RaisedButton
            backgroundColor="#1e2327"
            labelColor="rgb(235, 169, 27)"
            label="Back"
            disabled={this.state.createStepIndex === 0}
            onTouchTap={this.handleCreatePortfolioPrev}
            primary={false}
            disabledBackgroundColor="rgb(30, 35, 39)"
            style={{marginRight: 12}}
          />
          <RaisedButton
            backgroundColor="rgb(30, 35, 39)"
            labelColor="rgb(235, 169, 27)"
            label={this.state.createStepIndex === 3 ? 'Finish' : ( this.state.createStepIndex === 2 ? 'Confirm' : 'Next' )}
            primary={true}
            onTouchTap={this.handleCreatePortfolioNext}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={cx(s.root, { [s.fullheight]: this.state.createStepIndex === 2 && this.state.portfolioType === 0})}>
        <div style={{backgroundColor: "#1e2327", padding: "0 1rem 1rem 1rem", height: "100%", width: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box"}}>
          <div className={s.stepper}>
            <Stepper activeStep={this.state.createStepIndex}>
              <Step>
                {
                  this.state.error && this.state.createStepIndex === 0 ?
                  <StepLabel icon={<WarningIcon />}>Select Portfolio Type</StepLabel>
                  : <StepLabel>Select Portfolio Type</StepLabel>
                }
              </Step>
              <Step>
                <StepLabel>Enter Name and Description</StepLabel>
              </Step>
              <Step>
                <StepLabel>Select Portfolio Components</StepLabel>
              </Step>
              <Step>
                <StepLabel>Finalize Creation</StepLabel>
              </Step>
            </Stepper>
          </div>
          <ExpandTransition loading={this.state.createStepLoading} open={true} className={cx({[s.stepper_content]: this.state.createStepIndex === 2 && this.state.portfolioType === 0})}>
            {this.renderCreatePortfolio()}
          </ExpandTransition>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { sde: store.sde };
}

export default connect(mapStateToProps)(PortfoliosCreate);