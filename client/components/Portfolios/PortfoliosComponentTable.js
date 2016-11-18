/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './PortfoliosComponentTable.scss';
import cx from 'classnames';
import { formatNumberUnit, formatPercent } from '../../utilities';
import { itemIDToName } from '../../market';
import { getAuthToken } from '../../deepstream';
import { updateComponentDataSingle } from '../../actions/portfoliosActions';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const rootUrl = 'http://api.evetradeforecaster.com/market/current/';

export default class PortfoliosComponentTable extends React.Component {

  static propTypes = {
    portfolio: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      componentFilter: 0
    };
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  setComponentFilter = (event, index, value) => this.setState({componentFilter: value});

  render() {

    let components = this.props.portfolio.components || [];

    if (this.state.componentFilter) {
      if (this.state.componentFilter === 1) {

        components = components.sort((el1, el2) => (el2.unitPrice || 0) - (el1.unitPrice || 0));
      } else if (this.state.componentFilter === 2) {

        components = components.sort((el1, el2) => (el2.totalPrice || 0) - (el1.totalPrice || 0));
      } else if (this.state.componentFilter === 3) {

        if (this.props.portfolio.type === 0) {
          components = components.sort((el1, el2) => (el2.spread || 0) - (el1.spread || 0));
        } else {
          components = components.sort((el1, el2) => (el2.buildSpread || 0) - (el1.buildSpread || 0));
        }
      } else if (this.state.componentFilter === 4) {

        components = components.sort((el1, el2) => (el2.quantity || 0) - (el1.quantity || 0));
      }
    }

    return (
      <div className={s.root}>
        <Paper zDepth={2}>
          <div className={s.table_header}>
            <div className={s.table_header_selector}>
              <SelectField value={this.state.componentFilter} onChange={this.setComponentFilter}>
                <MenuItem type="text" value={0} primaryText="Unsorted" style={{cursor: "pointer"}}/>
                <MenuItem type="text" value={1} primaryText="Sort by Unit Price" style={{cursor: "pointer"}} />
                <MenuItem type="text" value={2} primaryText="Sort by Total Price" style={{cursor: "pointer"}} />
                <MenuItem type="text" value={3} primaryText={this.props.portfolio.type===0?"Sort by Spread":"Sort by Build Margin"} style={{cursor: "pointer"}} />
                <MenuItem type="text" value={4} primaryText="Sort by Quantity" style={{cursor: "pointer"}} />
              </SelectField>
            </div>
          </div>
          <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              {
                this.props.portfolio.type === 0 ?
                  <TableRow selectable={false}>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Unit Price</TableHeaderColumn>
                    <TableHeaderColumn>Total Price</TableHeaderColumn>
                    <TableHeaderColumn>Spread</TableHeaderColumn>
                    <TableHeaderColumn>Quantity</TableHeaderColumn>
                  </TableRow>
                  :
                  <TableRow selectable={false}>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Unit Price</TableHeaderColumn>
                    <TableHeaderColumn>Total Price</TableHeaderColumn>
                    <TableHeaderColumn>Build Price</TableHeaderColumn>
                    <TableHeaderColumn>Build Margin</TableHeaderColumn>
                    <TableHeaderColumn>Quantity</TableHeaderColumn>
                  </TableRow>
              }
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {
                this.props.portfolio.type === 0 ?
                  components.map((el, i) => {

                    return (
                      <TableRow key={i}>
                        <TableRowColumn><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.typeID}`)}}>{itemIDToName(el.typeID)}</span></TableRowColumn>
                        <TableRowColumn>{formatNumberUnit(el.unitPrice || 0)}</TableRowColumn>
                        <TableRowColumn>{formatNumberUnit(el.totalPrice || 0)}</TableRowColumn>
                        <TableRowColumn>{formatPercent(el.spread || 0)}%</TableRowColumn>
                        <TableRowColumn>{el.quantity}</TableRowColumn>
                      </TableRow>
                    )
                  })
                  :
                  components.map((el, i) => {

                    return (
                      <TableRow key={i}>
                        <TableRowColumn><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.typeID}`)}}>{itemIDToName(el.typeID)}</span></TableRowColumn>
                        <TableRowColumn>{formatNumberUnit(el.unitPrice || 0)}</TableRowColumn>
                        <TableRowColumn>{formatNumberUnit(el.totalPrice || 0)}</TableRowColumn>
                        <TableRowColumn>{formatNumberUnit((this.props.portfolio.materials && this.props.portfolio.materials.length===0?0:el.materialCost) || 0)}</TableRowColumn>
                        <TableRowColumn>{formatPercent(el.buildSpread || 0)}%</TableRowColumn>
                        <TableRowColumn>{el.quantity}</TableRowColumn>
                      </TableRow>
                    )
                  })
              }
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}