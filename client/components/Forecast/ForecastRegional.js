/* eslint-disable global-require */
import 'whatwg-fetch';
import store from '../../store';
import { updateForecastRegionalSetting } from '../../actions/settingsActions';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import s from './ForecastRegional.scss';
import cx from 'classnames';
import { getAuthToken } from '../../deepstream';
import { itemIDToName } from '../../market';
import { formatNumberUnit, formatPercent } from '../../utilities';
import { APIEndpointURL } from '../../globals';

// Components
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import OverlayStack from '../OverlayStack/OverlayStack';
import MarketItemViewComponent from '../MarketBrowser/MarketItemViewComponent';
import GuidebookLink from '../Guidebook/GuidebookLink';

import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

class ForecastComponent extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      searchResults: null,
      loading: false,
      queueQuery: true,
      sort: 1,
      direction: 1,
      showItem: null
    };
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  verifyFields() {

    return this.verifyPrice() === null && this.verifyVolume() === null;
  }

  updateSearch() {

    if (this.verifyFields() && this.state.loading === false && this.state.queueQuery === true) {

      let params = '?';

      if (this.props.settings.forecast_regional.max_volume) {
        params += `maxvolume=${this.props.settings.forecast_regional.max_volume}&`;
      }
      if (this.props.settings.forecast_regional.max_price) {
        params += `maxprice=${this.props.settings.forecast_regional.max_price}&`;
      }
      if (this.props.settings.forecast_regional.start_region) {
        params += `start=${this.props.settings.forecast_regional.start_region}&`;
      }
      if (this.props.settings.forecast_regional.end_region) {
        params += `end=${this.props.settings.forecast_regional.end_region}&`;
      }

      if (params.substr(-1) === '&') {
        params = params.slice(0, params.length - 1);
      }

      this.setState({
        loading: true,
        queueQuery: false
      }, async () => {

        const res = await fetch(`${APIEndpointURL}/market/forecast/regional${params}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${getAuthToken()}`
          }
        });

        const result = await res.json();

        this.setState({
          loading: false,
          searchResults: result
        })
      });
    }
  }

  componentDidUpdate() {

    this.updateSearch();
  }

  setVolumeMax = (event) => { this.setState({queueQuery: true}); store.dispatch(updateForecastRegionalSetting('max_volume', parseFloat(event.target.value) || null)) };
  setPriceMax = (event) => { this.setState({queueQuery: true}); store.dispatch(updateForecastRegionalSetting('max_price', parseFloat(event.target.value) || null)) };
  setRegionStart = (event, index, value) => { this.setState({queueQuery: true}); store.dispatch(updateForecastRegionalSetting('start_region', parseInt(value) || null)) };
  setRegionEnd = (event, index, value) => { this.setState({queueQuery: true}); store.dispatch(updateForecastRegionalSetting('end_region', parseInt(value) || null)) };

  setSort = (value) => this.setState({sort: value, direction: value === this.state.sort ? this.state.direction === 1 ? 0 : 1 : this.state.direction});

  verifyPrice() {

    if (!this.props.settings.forecast_regional.max_price) {
      return null;
    }

    if (this.props.settings.forecast_regional.max_price < 100000) {
      return "Maximum price should be at least 100,000";
    }

    if (this.props.settings.forecast_regional.max_price > 1000000000000) {
      return "Maximum price should be less than 1,000,000,000,000";
    }

    return null;
  }

  verifyVolume() {

    if (!this.props.settings.forecast_regional.max_volume) {
      return null;
    }

    if (this.props.settings.forecast_regional.max_volume < 100) {
      return "Maximum volume should be at least 100";
    }

    if (this.props.settings.forecast_regional.max_volume > 10000000) {
      return "Maximum volume should be less than 10,000,000";
    }

    return null;
  }

  renderResults() {

    let results = [];

    if (this.state.searchResults && this.state.searchResults.length) {

      results = this.state.searchResults;

      if (this.state.sort === 0) {
        if (this.state.direction === 0) {
          results = results.sort((el1, el2) => +(itemIDToName(el1.type) > itemIDToName(el2.type)) || +(itemIDToName(el1.type) === itemIDToName(el2.type)) - 1);
        } else {
          results = results.sort((el1, el2) => +(itemIDToName(el2.type) > itemIDToName(el1.type)) || +(itemIDToName(el2.type) === itemIDToName(el1.type)) - 1);
        }
      }
      else if (this.state.sort === 1) {

        results = results.sort((el1, el2) => !this.state.direction ? el1.totalProfit - el2.totalProfit : el2.totalProfit - el1.totalProfit);
      }
      else if (this.state.sort === 2) {

        results = results.sort((el1, el2) => !this.state.direction ? el1.perUnit - el2.perUnit : el2.perUnit - el1.perUnit);
      }
      else if (this.state.sort === 3) {

        results = results.sort((el1, el2) => !this.state.direction ? el1.buyPrice - el2.buyPrice : el2.buyPrice - el1.buyPrice);
      }
      else if (this.state.sort === 4) {

        results = results.sort((el1, el2) => !this.state.direction ? el1.perVolumeProfit - el2.perVolumeProfit : el2.perVolumeProfit - el1.perVolumeProfit);
      }

      results = results.slice(0, 100);

    }

    return (
      <div style={{"paddingLeft": "1rem"}}>
        <div className={s.header}>
          <div className={s.title}>
          Results
          </div>
          <div className={s.counter}>
          Showing {results.length} results
          </div>
        </div>
        <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow selectable={false}>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.table_header} onClick={()=>this.setSort(0)}>
                Name
                {
                  this.state.sort == 0 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.table_header} onClick={()=>this.setSort(1)}>
                Total Profit
                {
                  this.state.sort == 1 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.table_header} onClick={()=>this.setSort(2)}>
                Profit/Unit
                {
                  this.state.sort == 2 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.table_header} onClick={()=>this.setSort(3)}>
                Prices
                {
                  this.state.sort == 3 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.table_header} onClick={()=>this.setSort(4)}>
                Volume
                {
                  this.state.sort == 4 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              !this.state.searchResults || this.state.searchResults.length === 0 ?
                <TableRow selectable={false}>
                  <TableRowColumn>No records available</TableRowColumn>
                </TableRow>
                :
                results.map((el, i) => {
                  return (
                    <tr key={i} className={s.row}>
                      <td className={s.column}>
                        <span className={s.quantity}>{el.quantity}x</span> <span className={s.browser_route} onClick={()=>this.setState({showItem: el.type})}>{itemIDToName(el.type)}</span>
                      </td>
                      <td className={s.column}>
                        {formatNumberUnit(el.totalProfit || 0)}
                      </td>
                      <td className={s.column}>
                        {formatNumberUnit(el.perProfit || 0)}
                      </td>
                      <td className={s.column}>
                        <div className={s.price}>Buy: {formatNumberUnit(el.buyPrice || 0)}</div>
                        <div className={s.price}>Sell: {formatNumberUnit(el.sellPrice || 0)}</div>
                      </td>
                      <td className={s.column}>
                        <div className={s.volume}>{el.volume} M3</div>
                        <div className={s.volume}>{formatNumberUnit(el.perVolumeProfit || 0)} ISK/M3</div>
                      </td>
                    </tr>
                  )
                })
            }
          </TableBody>
        </Table>
      </div>
    )
  }

  render() {

    return (
      <div className={s.root}>
        <GuidebookLink settingsKey="forecast" page="forecast" style={{padding: "0 1rem"}} />
        <OverlayStack popStack={()=>this.setState({showItem: null})}>
          <div className={s.container}>
            <div className={cx(s.pane, s.aside)}>
              <SelectField
                value={this.props.settings.forecast_regional.start_region}
                onChange={this.setRegionStart}
                floatingLabelText="Starting Region"
                floatingLabelStyle={{color: "#BDBDBD"}}
              >
                <MenuItem value={10000002} primaryText="Jita/The Forge" />
                <MenuItem value={10000043} primaryText="Amarr/Domain" />
                <MenuItem value={10000032} primaryText="Dodixie/Sing Laison" />
                <MenuItem value={10000030} primaryText="Rens/Heimatar" />
                <MenuItem value={10000042} primaryText="Hek/Metropolis" />
              </SelectField>
              <SelectField 
                value={this.props.settings.forecast_regional.end_region}
                onChange={this.setRegionEnd}
                floatingLabelText="Destination Region"
                floatingLabelStyle={{color: "#BDBDBD"}}
              >
                <MenuItem value={10000002} primaryText="Jita/The Forge" />
                <MenuItem value={10000043} primaryText="Amarr/Domain" />
                <MenuItem value={10000032} primaryText="Dodixie/Sing Laison" />
                <MenuItem value={10000030} primaryText="Rens/Heimatar" />
                <MenuItem value={10000042} primaryText="Hek/Metropolis" />
              </SelectField>
              <TextField
                type="number"
                errorText={this.verifyVolume()}
                floatingLabelText="Maximum Trade Volume"
                floatingLabelStyle={{color: "#BDBDBD"}}
                underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
                underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
                inputStyle={{color: "#FFF"}}
                style={{display: "block", marginBottom: ".8rem"}}
                onChange={this.setVolumeMax}
                value={this.props.settings.forecast_regional.max_volume}
              />
              <TextField
                type="number"
                errorText={this.verifyPrice()}
                floatingLabelText="Maximum Trade Price"
                floatingLabelStyle={{color: "#BDBDBD"}}
                underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
                underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
                inputStyle={{color: "#FFF"}}
                style={{display: "block", marginBottom: ".8rem"}}
                onChange={this.setPriceMax}
                value={this.props.settings.forecast_regional.max_price}
              />
            </div>
            <div className={cx(s.pane, s.larger)}>
            {
              this.state.loading ?
                <div style={{display: "flex", alignItems: "center", width: "100%", height: "100%"}}>
                  <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
                </div>
              : this.renderResults()
            }
            </div>
          </div>
          {
            this.state.showItem ? <MarketItemViewComponent params={{id: this.state.showItem}} /> : null
          }
        </OverlayStack>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(ForecastComponent);