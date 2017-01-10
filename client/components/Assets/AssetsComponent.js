/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import cx from 'classnames';
import { itemIDToName } from '../../market';
import { formatNumberUnit } from '../../utilities';
import s from './AssetsComponent.scss';
import PaginatedTable from '../UI/PaginatedTable';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';

import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

class AssetRow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collapsed: false
    };
  }

  getLocationName(location) {

    if (!location) {
      return "-";
    }

    return parseInt(location) > 1000000000000 ? "Citadel" : (this.props.sde.stationid2name[parseInt(location)] || "Unknown Station");
  }

  render() {

    const el = this.props.row;
    const style = { 
      backgroundColor: this.props.depth > 0 ? "#1d2125" : null,
      ...this.props.style
    };

    if (!el.children || !el.children.length) {

      return (
        <tr style={{borderBottom: "1px solid rgba(255, 255, 255, 0.298039)", color: "rgb(255, 255, 255)", height: "48px", ...style}}>
          <TableRowColumn style={{textAlign: "left"}}>
            <span style={{marginLeft: this.props.depth * 15 + "px"}}>{itemIDToName(el.typeID)}</span>
          </TableRowColumn>
          <TableRowColumn style={{textAlign: "center"}}>{formatNumberUnit(parseInt(el.quantity))}</TableRowColumn>
          <TableRowColumn style={{textAlign: "center"}}>{formatNumberUnit(el.value)}</TableRowColumn>
          <TableRowColumn style={{textAlign: "center"}}>{this.getLocationName(el.locationID)}</TableRowColumn>
          <TableRowColumn style={{textAlign: "center"}}>{!el.locationID ? "-" : el.who}</TableRowColumn>
        </tr>
      )
    }

    return (
      <tr style={{borderBottom: "1px solid rgba(255, 255, 255, 0.298039)", color: "rgb(255, 255, 255)", height: "48px", ...style}}>
        <td colSpan={5}>
          <table style={{width: "100%", backgroundColor: "rgb(40, 46, 51)", padding: "0px 24px", borderCollapse: "collapse", borderSpacing: "0px", tableLayout: "fixed", fontFamily: "Roboto, sans-serif"}}>
            <tbody>
              <tr onClick={()=>this.setState({collapsed: !this.state.collapsed})} style={{borderBottom: "1px solid rgba(255, 255, 255, 0.298039)", color: "rgb(255, 255, 255)", height: "48px"}}>
                <TableRowColumn style={{textAlign: "left"}}>
                  <span style={{verticalAlign: "middle", display: "inline-block", marginLeft: this.props.depth * 15 + "px"}}>{itemIDToName(el.typeID)}</span>
                  <span style={{verticalAlign: "middle", display: "inline-block"}}>{this.state.collapsed? <UpArrow /> : <DownArrow />}</span>
                </TableRowColumn>
                <TableRowColumn style={{textAlign: "center"}}>{formatNumberUnit(parseInt(el.quantity))}</TableRowColumn>
                <TableRowColumn style={{textAlign: "center"}}>{formatNumberUnit(el.value)}</TableRowColumn>
                <TableRowColumn style={{textAlign: "center"}}>{this.getLocationName(el.locationID)}</TableRowColumn>
                <TableRowColumn style={{textAlign: "center"}}>{!el.locationID ? "-" : el.who}</TableRowColumn>
              </tr>
              {
                this.state.collapsed ? el.children.map((el, i) => <AssetRow row={el} sde={this.props.sde} key={i} depth={this.props.depth + 1}/>) : null
              }
            </tbody>
          </table>
        </td>
      </tr>
    )
  }
}

class AssetsComponent extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {

      searchText: "",
      orderBy: 0,
      direction: 1 // 0 - ascending, 1 - descending
    };
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  setSort(newSort) {

    this.setState({
      orderBy: newSort,
      direction: newSort === this.state.orderBy ? this.state.direction === 1 ? 0 : 1 : this.state.direction
    });
  }

  render() {

    let assets = this.props.assets.list || [];

    if (this.props.assets.list.length) {

      if (this.state.searchText.length > 0) {

        assets = assets.filter(el =>
          itemIDToName(el.typeID).toLowerCase().match(this.state.searchText) ||
          (this.props.sde.stationid2name[parseInt(el.locationID)] || "").toLowerCase().match(this.state.searchText) ||
          el.who.toLowerCase().match(this.state.searchText)
        );
      }

      let sorter = () => 0;

      if (this.state.direction === 0) {
        switch(this.state.orderBy) {
          case 0: // name
            sorter = (el1, el2) => +(itemIDToName(el1.typeID) > itemIDToName(el2.typeID)) || +(itemIDToName(el1.typeID) === itemIDToName(el2.typeID)) - 1;
            break;
          case 1: // quant
            sorter = (el1, el2) => parseInt(el1.quantity) - parseInt(el2.quantity);
            break;
          case 2: // Val
            sorter = (el1, el2) => el1.value - el2.value;
            break;
          case 3: // volume
            sorter = (el1, el2) => +(this.props.sde.stationid2name[parseInt(el1.locationID)] > this.props.sde.stationid2name[parseInt(el2.locationID)]) || +(this.props.sde.stationid2name[parseInt(el1.locationID)] === this.props.sde.stationid2name[parseInt(el2.locationID)]) - 1;
            break;
          case 4: // buy or sell
            sorter = (el1, el2) => el1.whoID - el2.whoID;
            break;
        }
      } else {
        switch(this.state.orderBy) {
          case 0: // name
            sorter = (el1, el2) => +(itemIDToName(el2.typeID) > itemIDToName(el1.typeID)) || +(itemIDToName(el2.typeID) === itemIDToName(el1.typeID)) - 1;
            break;
          case 1: // quant
            sorter = (el1, el2) => parseInt(el2.quantity) - parseInt(el1.quantity);
            break;
          case 2: // Val
            sorter = (el1, el2) => el2.value - el1.value;
            break;
          case 3: // location
            sorter = (el1, el2) => +(this.props.sde.stationid2name[parseInt(el2.locationID)] > this.props.sde.stationid2name[parseInt(el1.locationID)]) || +(this.props.sde.stationid2name[parseInt(el2.locationID)] === this.props.sde.stationid2name[parseInt(el1.locationID)]) - 1;
            break;
          case 4: // buy or sell
            sorter = (el1, el2) => el2.whoID - el1.whoID;
            break;
        }
      }

      assets = assets.sort(sorter);
    }

    return (
      <DashboardPage>
        <TextField
          className={s.assets_search}
          floatingLabelText="Search assets"
          onChange={(ev)=>this.setState({searchText: ev.currentTarget.value})}
        />
        <PaginatedTable
          headers={[
            <TableHeaderColumn key={0} style={{textAlign: "center"}}>
              <div className={s.header} onClick={()=>this.setSort(0)}>
              Item Name
              {
                this.state.orderBy == 0 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
              }
              </div>
            </TableHeaderColumn>,
            <TableHeaderColumn key={1} style={{textAlign: "center"}}>
              <div className={s.header} onClick={()=>this.setSort(1)}>
              Quantity
              {
                this.state.orderBy == 1 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
              }
              </div>
            </TableHeaderColumn>,
            <TableHeaderColumn key={2} style={{textAlign: "center"}}>
              <div className={s.header} onClick={()=>this.setSort(2)}>
              Value
              {
                this.state.orderBy == 2 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
              }
              </div>
            </TableHeaderColumn>,
            <TableHeaderColumn key={3} style={{textAlign: "center"}}>
              <div className={s.header} onClick={()=>this.setSort(3)}>
              Location
              {
                this.state.orderBy == 3 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
              }
              </div>
            </TableHeaderColumn>,
            <TableHeaderColumn key={4} style={{textAlign: "center"}}>
              <div className={s.header} onClick={()=>this.setSort(4)}>
              Who
              {
                this.state.orderBy == 4 ? this.state.direction === 0 ? <UpArrow /> : <DownArrow /> : null
              }
              </div>
            </TableHeaderColumn>
          ]}
          items={assets.length === 0 ?
                [<TableRow key={0} selectable={false}>
                  {
                    this.props.settings.profiles.length === 0 ? 
                    <TableRowColumn>Assets will be begin to show within an hour of an API key being added, and on and hourly schedule afterwards</TableRowColumn> 
                    : <TableRowColumn>You do not have any assets currently listed. Assets are updated on an hourly schedule and will show within an hour of being created</TableRowColumn>
                  }
                </TableRow>]
                :
                assets.map((el, i) => <AssetRow key={i} row={el} sde={this.props.sde} depth={0} />)
            }
        />
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { assets: store.profit.assets, sde: store.sde, settings: store.settings };
}

export default connect(mapStateToProps)(AssetsComponent);