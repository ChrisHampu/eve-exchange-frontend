/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './PortfoliosViewAll.scss';
import cx from 'classnames';
import { formatNumberUnit } from '../../utilities';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class PortfoliosViewAll extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  setRoute(path) {

    this.context.router.push(path);
  }

  render() {

    if (this.props.children) {
      
      return (
        <div style={{height: "100%"}}>
          {this.props.children}
        </div>
      )
    }

    return (
      <div>
        <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow selectable={false}>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Description</TableHeaderColumn>
              <TableHeaderColumn>Value</TableHeaderColumn>
              <TableHeaderColumn>Type</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              !this.props.portfolios || this.props.portfolios.length === 0 ?
                <TableRow selectable={false}>
                  <TableRowColumn>No records available</TableRowColumn>
                </TableRow>
                :
                this.props.portfolios.map((el, i) => {
                  return (
                    <TableRow key={i} className={s.row}>
                      <TableRowColumn><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/portfolios/view/${el.portfolioID}`)}}>{el.name}</span></TableRowColumn>
                      <TableRowColumn>{el.description}</TableRowColumn>
                      <TableRowColumn>{formatNumberUnit(el.currentValue)}</TableRowColumn>
                      <TableRowColumn>{el.type === 0 ? "Trading" : "Industry"}</TableRowColumn>
                    </TableRow>
                  )
                })
            }
          </TableBody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { portfolios: store.portfolios.all };
}

export default connect(mapStateToProps)(PortfoliosViewAll);