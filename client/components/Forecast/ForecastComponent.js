/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import s from './ForecastComponent.scss';
import cx from 'classnames';
import horizon, { getAuthToken } from '../../horizon';
import { itemIDToName } from '../../market';
import { formatNumberUnit, formatPercent } from '../../utilities';

// Components
import DashboardPage from '../DashboardPage/DashboardPageComponent';

import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const rootUrl = "http://api.evetradeforecaster.com/market/forecast/";

class ForecastComponent extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      spreadMinimum: null,
      spreadMaximum: null,
      volumeMinimum: null,
      volumeMaximum: null,
      priceMinimum: null,
      priceMaximum: null,
      searchResults: null,
      loading: false,
      queueQuery: true,
      sort: 0,
      direction: 0
    };
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  verifyFields() {

    return this.verifyPrice() === null && this.verifySpread() === null && this.verifyVolume() === null;
  }

  updateSearch() {

    if (this.verifyFields() && this.state.loading === false && this.state.queueQuery === true) {

      let params = '?';

      if (this.state.spreadMinimum) {
        params += `minspread=${this.state.spreadMinimum}&`;
      }
      if (this.state.volumeMinimum) {
        params += `minvolume=${this.state.volumeMinimum}&`;
      }
      if (this.state.priceMinimum) {
        params += `minprice=${this.state.priceMinimum}&`;
      }
      if (this.state.spreadMaximum) {
        params += `maxspread=${this.state.spreadMaximum}&`;
      }
      if (this.state.volumeMaximum) {
        params += `maxvolume=${this.state.volumeMaximum}&`;
      }
      if (this.state.priceMaximum) {
        params += `maxprice=${this.state.priceMaximum}&`;
      }

      if (params.substr(-1) === '&') {
        params = params.slice(0, params.length - 1);
      }

      this.setState({
        loading: true,
        queueQuery: false
      }, async () => {

        const res = await fetch(`${rootUrl}${params}`, {
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

  setSpreadMin = (event) => this.setState({queueQuery: true, spreadMinimum: event.target.value || null});
  setSpreadMax = (event) => this.setState({queueQuery: true, spreadMaximum: event.target.value || null});
  setVolumeMin = (event) => this.setState({queueQuery: true, volumeMinimum: event.target.value || null});
  setVolumeMax = (event) => this.setState({queueQuery: true, volumeMaximum: event.target.value || null});
  setPriceMin = (event) => this.setState({queueQuery: true, priceMinimum: event.target.value || null});
  setPriceMax = (event) => this.setState({queueQuery: true, priceMaximum: event.target.value || null});

  setSort = (event, index, value) => this.setState({sort: value});
  setDirection = (event, index, value) => this.setState({direction: value});

  verifyPrice() {

    if (!this.state.priceMinimum && !this.state.priceMaximum) {
      return "At least one price field is required";
    }

    return null;
  }

  verifySpread() {

    if (!this.state.spreadMinimum && !this.state.spreadMaximum) {
      return "At least one spread field is required";
    }

    return null;
  }

  verifyVolume() {

    if (!this.state.volumeMinimum && !this.state.volumeMaximum) {
      return "At least one volume field is required";
    }

    return null;
  }

  renderResults() {

    let results = [];

    if (this.state.searchResults && this.state.searchResults.length) {

      results = this.state.searchResults;

      if (this.state.sort) {

        if (this.state.sort === 1) {

          results = results.sort((el1, el2) => this.state.direction ? el1.buyFifthPercentile - el2.buyFifthPercentile : el2.buyFifthPercentile - el1.buyFifthPercentile);
        }
        else if (this.state.sort === 2) {

          results = results.sort((el1, el2) => this.state.direction ? el1.spreadSMA - el2.spreadSMA : el2.spreadSMA - el1.spreadSMA);
        }
        else if (this.state.sort === 3) {

          results = results.sort((el1, el2) => this.state.direction ? el1.tradeVolumeSMA - el2.tradeVolumeSMA : el2.tradeVolumeSMA - el1.tradeVolumeSMA);
        }
      }

      results = results.slice(0, 100);

    }

    return (
      <div>
        <div className={s.header}>
          <div className={s.title}>
          Forecast Results
          </div>
          <div className={s.selector}>
            <SelectField value={this.state.sort} onChange={this.setSort}>
              <MenuItem type="text" value={0} primaryText="Unsorted" style={{cursor: "pointer"}}/>
              <MenuItem type="text" value={1} primaryText="Sort by Price" style={{cursor: "pointer"}} />
              <MenuItem type="text" value={2} primaryText="Sort by Spread" style={{cursor: "pointer"}} />
              <MenuItem type="text" value={3} primaryText="Sort by Volume" style={{cursor: "pointer"}} />
            </SelectField>
          </div>
          <div className={s.selector}>
            <SelectField value={this.state.direction} onChange={this.setDirection}>
              <MenuItem type="text" value={0} primaryText="Descending" style={{cursor: "pointer"}}/>
              <MenuItem type="text" value={1} primaryText="Ascending" style={{cursor: "pointer"}} />
            </SelectField>
          </div>
          <div className={s.counter}>
          Showing {results.length} results
          </div>
        </div>
        <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow selectable={false}>
              <TableHeaderColumn style={{textAlign: "center"}}>Name</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>Price</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>Spread</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>Volume</TableHeaderColumn>
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
                      <td className={s.column}><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.type}`)}}>{itemIDToName(this.props.market_items, el.type)}</span></td>
                      <td className={s.column}>{formatNumberUnit(el.buyFifthPercentile)}</td>
                      <td className={s.column}>{formatPercent(el.spreadSMA)}%</td>
                      <td className={s.column}>{el.tradeVolumeSMA.toFixed(0)}</td>
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
      <DashboardPage title="Forecast" className={s.root} fullWidth={true}>
        <div className={s.container}>
          <div className={s.pane}>
            <TextField
              type="number"
              errorText={this.verifyPrice()}
              floatingLabelText="Minimum Buy Price"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={this.setPriceMin}
            />
            <TextField
              type="number"
              errorText={this.verifyPrice()}
              floatingLabelText="Maximum Buy Price"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={this.setPriceMax}
            />
            <TextField
              type="number"
              errorText={this.verifySpread()}
              floatingLabelText="Minimum Spread"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={this.setSpreadMin}
            />
            <TextField
              type="number"
              errorText={this.verifySpread()}
              floatingLabelText="Maximum Spread"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={this.setSpreadMax}
            />
            <TextField
              type="number"
              errorText={this.verifyVolume()}
              floatingLabelText="Minimum Volume"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={this.setVolumeMin}
            />
            <TextField
              type="number"
              errorText={this.verifyVolume()}
              floatingLabelText="Maximum Volume"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={this.setVolumeMax}
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
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { market_items: store.sde.market_items };
}

export default connect(mapStateToProps)(ForecastComponent);