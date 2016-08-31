/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './PortfoliosComponentTable.scss';
import cx from 'classnames';
import { formatNumberUnit, formatPercent } from '../../utilities';
import { itemIDToName } from '../../market';
import { getAuthToken } from '../../horizon';
import { updateComponentDataSingle } from '../../actions/portfoliosActions';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const rootUrl = 'http://api.evetradeforecaster.com/market/current/';

class PortfoliosComponentTable extends React.Component {

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

  componentWillMount() {

    this.updateComponents();
  }

  async updateComponents() {

    for (const component of this.props.portfolio.components) {

       fetch(`${rootUrl}${component.typeID}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${getAuthToken()}`
        }
      })
      .then(res => res.json())
      .then(result => {

        store.dispatch(updateComponentDataSingle(result.type, result));
      });
    }
  }

  getComponentData(component) {

    const data = this.props.componentData[component.typeID];

    let unitPrice = 0, totalPrice = 0, spread = 0, volume = 0;

    if (data) {

      unitPrice = data.buyFifthPercentile;
      totalPrice = unitPrice * component.quantity;
      spread = data.spread;
      volume = data.tradeVolume;
    }

    return { unitPrice, totalPrice, spread, volume, quantity: component.quantity }
  }

  setComponentFilter = (event, index, value) => this.setState({componentFilter: value});

  render() {

    let components = this.props.portfolio.components;

    if (this.state.componentFilter) {
      if (this.state.componentFilter === 1) {

        components = components.sort((el1, el2) => this.getComponentData(el2).unitPrice - this.getComponentData(el1).unitPrice);
      } else if (this.state.componentFilter === 2) {

        components = components.sort((el1, el2) => this.getComponentData(el2).totalPrice - this.getComponentData(el1).totalPrice);
      } else if (this.state.componentFilter === 3) {

        components = components.sort((el1, el2) => this.getComponentData(el2).spread - this.getComponentData(el1).spread);
      } else if (this.state.componentFilter === 4) {

        components = components.sort((el1, el2) => this.getComponentData(el2).quantity - this.getComponentData(el1).quantity);
      }
    }

    return (
      <Paper zDepth={2}>
        <div className={s.table_header}>
          <div className={s.table_header_title}>
          Components
          </div>
          <div className={s.table_header_selector}>
            <SelectField value={this.state.componentFilter} onChange={this.setComponentFilter}>
              <MenuItem type="text" value={0} primaryText="Unsorted" style={{cursor: "pointer"}}/>
              <MenuItem type="text" value={1} primaryText="Sort by Unit Price" style={{cursor: "pointer"}} />
              <MenuItem type="text" value={2} primaryText="Sort by Total Price" style={{cursor: "pointer"}} />
              <MenuItem type="text" value={3} primaryText="Sort by Spread" style={{cursor: "pointer"}} />
              <MenuItem type="text" value={4} primaryText="Sort by Quantity" style={{cursor: "pointer"}} />
            </SelectField>
          </div>
        </div>
        <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow selectable={false}>
              <TableHeaderColumn style={{textAlign: "center"}}>Name</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>Unit Price</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>Total Price</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>Spread</TableHeaderColumn>
              <TableHeaderColumn style={{textAlign: "center"}}>Quantity</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              components.map((el, i) => {

                const data = this.getComponentData(el);

                return (
                  <TableRow key={i}>
                    <TableRowColumn><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.typeID}`)}}>{itemIDToName(el.typeID)}</span></TableRowColumn>
                    <TableRowColumn>{formatNumberUnit(data.unitPrice)}</TableRowColumn>
                    <TableRowColumn>{formatNumberUnit(data.totalPrice)}</TableRowColumn>
                    <TableRowColumn>{formatPercent(data.spread)}%</TableRowColumn>
                    <TableRowColumn>{el.quantity}</TableRowColumn>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

const mapStateToProps = function(store) {
  return { componentData: store.portfolios.componentData };
}

export default connect(mapStateToProps)(PortfoliosComponentTable);