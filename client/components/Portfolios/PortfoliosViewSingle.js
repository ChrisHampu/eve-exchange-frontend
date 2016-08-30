/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './PortfoliosViewSingle.scss';
import cx from 'classnames';
import { formatNumberUnit } from '../../utilities';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class PortfoliosViewSingle extends React.Component {

  static propTypes = {
    params: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  setRoute(path) {

    this.context.router.push(path);
  }

  getPortfolio() {
    return this.props.portfolios.find(el => el.portfolioID === parseInt(this.props.params.id));
  }

  render() {

    const portfolio = this.getPortfolio();

    if (!portfolio) {
      return (
        <div>
        {`Cannot find portfolio with id ${this.props.params.id}`}
        </div>
      )
    }

    return (
      <div>
      {portfolio ? portfolio.name : `Cannot find portfolio with id ${this.props.params.id}`}
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { portfolios: store.portfolios };
}

export default connect(mapStateToProps)(PortfoliosViewSingle);