/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import s from './PortfoliosMaterialTable.scss';
import cx from 'classnames';
import { formatNumberUnit, formatPercent } from '../../utilities';
import { itemIDToName } from '../../market';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class PortfoliosMaterialTable extends React.Component {

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

    let materials = this.props.portfolio.materials;

    if (this.state.componentFilter) {
      if (this.state.componentFilter === 1) {

        materials = materials.sort((el1, el2) => (el2.quantity || 0) - (el1.quantity || 0));
      }
    }

    return (
      <div className={s.root}>
        <Paper zDepth={2}>
          <div className={s.table_header}>
            <div className={s.table_header_selector}>
              <SelectField value={this.state.componentFilter} onChange={this.setComponentFilter}>
                <MenuItem type="text" value={0} primaryText="Unsorted" style={{cursor: "pointer"}}/>
                <MenuItem type="text" value={1} primaryText="Sort by Quantity" style={{cursor: "pointer"}} />
              </SelectField>
            </div>
          </div>
          <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              {
                <TableRow selectable={false}>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Quantity</TableHeaderColumn>
                </TableRow>
              }
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {
                materials.map((el, i) => {

                  return (
                    <TableRow key={i}>
                      <TableRowColumn><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/browser/${el.typeID}`)}}>{itemIDToName(this.props.market_items, el.typeID)}</span></TableRowColumn>
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

const mapStateToProps = function(store) {
  return { market_items: store.sde.market_items };
}

export default connect(mapStateToProps)(PortfoliosMaterialTable);