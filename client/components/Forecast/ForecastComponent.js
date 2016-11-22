/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import s from './ForecastComponent.scss';
import cx from 'classnames';
import { getAuthToken } from '../../deepstream';
import { itemIDToName } from '../../market';
import { formatNumberUnit, formatPercent } from '../../utilities';
import { APIEndpointURL } from '../../globals';

// Components
import DashboardPage from '../DashboardPage/DashboardPageComponent';

import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

export default class ForecastComponent extends React.Component {

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
      sort: 2,
      direction: 1
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

        const res = await fetch(`${APIEndpointURL}/market/forecast/${params}`, {
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

  setSort = (value) => this.setState({sort: value, direction: value === this.state.sort ? this.state.direction === 1 ? 0 : 1 : this.state.direction});

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

      if (this.state.sort === 0) {
        if (this.state.direction === 0) {
          results = results.sort((el1, el2) => +(itemIDToName(el1.type) > itemIDToName(el2.type)) || +(itemIDToName(el1.type) === itemIDToName(el2.type)) - 1);
        } else {
          results = results.sort((el1, el2) => +(itemIDToName(el2.type) > itemIDToName(el1.type)) || +(itemIDToName(el2.type) === itemIDToName(el1.type)) - 1);
        }
      }
      else if (this.state.sort === 1) {

        results = results.sort((el1, el2) => !this.state.direction ? el1.buyPercentile - el2.buyPercentile : el2.buyPercentile - el1.buyPercentile);
      }
      else if (this.state.sort === 2) {

        results = results.sort((el1, el2) => !this.state.direction ? el1.spread_sma - el2.spread_sma : el2.spread_sma - el1.spread_sma);
      }
      else if (this.state.sort === 3) {

        results = results.sort((el1, el2) => !this.state.direction ? el1.volume_sma - el2.volume_sma : el2.volume_sma - el1.volume_sma);
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
                Price
                {
                  this.state.sort == 1 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.table_header} onClick={()=>this.setSort(2)}>
                Spread
                {
                  this.state.sort == 2 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
                }
                </div>
              </TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>
                <div className={s.table_header} onClick={()=>this.setSort(3)}>
                Volume
                {
                  this.state.sort == 3 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
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
                      <td className={s.column}><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.type}`)}}>{itemIDToName(el.type)}</span></td>
                      <td className={s.column}>{formatNumberUnit(el.buyPercentile)}</td>
                      <td className={s.column}>{formatPercent(el.spread_sma)}%</td>
                      <td className={s.column}>{el.volume_sma.toFixed(0)}</td>
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