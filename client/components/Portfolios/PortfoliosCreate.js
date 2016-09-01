/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './PortfoliosCreate.scss';
import cx from 'classnames';
import { getMarketItemNames, itemNameToID, itemIDToName } from '../../market';
import { getAuthToken } from '../../horizon';

import blueprints from '../../sde/blueprints';
import marketGroups from '../../sde/market_groups';

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

export default class PortfoliosCreate extends React.Component {

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
      portfolioIndustryQuantity: 1
    };

    this.blueprints = [];

    for (var bp in blueprints) {

      this.blueprints.push(blueprints[bp].name);
    }
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
              error: "Type into the input box to select an item"
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
              type: this.state.portfolioType
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
              const res = await fetch(`http://api.evetradeforecaster.com/portfolio/create`, {
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
                throw (result.error);
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
                error: "There was an error saving your portfolio"
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
              name="selectCharacter" 
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
            <div>
              Industry: Optimized for tracking material prices, manufacturing profit, and features specialized charts
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

  addTradingItem() {

    if (!this.state.portfolioSearchTradingQuantity || !this.state.portfolioSearchTradingItem) {
      this.setState({
        error: "Select an item and enter a valid quantity"
      });
    } else {

      const items = this.state.portfolioSelectedItems;

      items.push({
        quantity: this.state.portfolioSearchTradingQuantity,
        name: this.state.portfolioSearchTradingItem
      });

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
      <div>
        <div style={{marginBottom: "0.5rem"}}>
          Select the items for this portfolio
        </div>
        <AutoComplete
          hintText="Type item name"
          dataSource={getMarketItemNames()}
          filter={AutoComplete.caseInsensitiveFilter}
          maxSearchResults={6}
          menuStyle={{cursor: "pointer"}}
          onNewRequest={this.updateTradingSearch}
        />
        <TextField
          type="number"
          floatingLabelText="Type quantity"
          inputStyle={{color: "#FFF"}}
          style={{display: "block", marginBottom: ".8rem"}}
          onChange={(event) => this.setState({portfolioSearchTradingQuantity: event.target.value})}
        />
        <FlatButton
          label="Add Item"
          labelStyle={{color: "rgb(235, 169, 27)"}}
          primary={true}
          onTouchTap={()=>{this.addTradingItem()}}
        />
        <div style={{marginTop: "1.5rem"}}>
          {this.renderPortfolioItemsArray()}
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

  renderIndustrySelect() {
    return (
      <div>
        <div style={{marginBottom: "0.5rem"}}>
          Select which manufactured item to track
        </div>
        <AutoComplete
          hintText="Type item name"
          dataSource={this.blueprints}
          filter={AutoComplete.caseInsensitiveFilter}
          maxSearchResults={6}
          menuStyle={{cursor: "pointer"}}
          onNewRequest={this.updateIndustrySearch}
        />
        <TextField
          type="number"
          floatingLabelText="Number of runs"
          inputStyle={{color: "#FFF"}}
          style={{display: "block", marginBottom: ".8rem"}}
          onChange={(event) => this.setState({portfolioIndustryQuantity: event.target.value})}
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
      <div className={s.root}>
        <div style={{backgroundColor: "#1e2327", padding: "0 1rem 1rem 1rem"}}>
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
          <ExpandTransition loading={this.state.createStepLoading} open={true}>
            {this.renderCreatePortfolio()}
          </ExpandTransition>
        </div>
      </div>
    )
  }
}