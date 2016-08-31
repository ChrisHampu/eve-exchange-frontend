/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './PortfoliosViewSingle.scss';
import cx from 'classnames';
import { formatNumber, formatPercent } from '../../utilities';
import { itemIDToName } from '../../market';

import PortfoliosComponentTable from './PortfoliosComponentTable';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class PortfoliosViewSingle extends React.Component {

  static propTypes = {
    params: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

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
      <div className={s.root}>
        <Paper zDepth={2}>
          <div className={s.metadata}>
            {
              portfolio.type === 0 ?
                <div className={s.values}>
                Total Value of Trading Portfolio: <span className={s.value}>{formatNumber(portfolio.currentValue)} ISK</span>Average Spread: <span className={s.value}>{formatPercent(portfolio.averageSpread)}%</span>
                </div> :
                <div className={s.values}>
                Component Value: <span className={s.value}>{formatNumber(portfolio.currentValue)} ISK</span>Sell Value: <span className={s.value}>{formatNumber(portfolio.industryValue || 0)} ISK</span>Profit Margin: <span className={s.value}>{formatPercent(portfolio.industrySpread)}%</span>Potential Profit: <span className={s.value}>{formatNumber((portfolio.industryValue || 0)-portfolio.currentValue)} ISK</span>
                </div>
            }
            <div className={s.corner_menu}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                className={s.icon_menu}
              >
                <MenuItem type="text" primaryText="Delete" onTouchTap={()=>{}} style={{cursor: "pointer"}} />
               </IconMenu>
            </div>
          </div>
        </Paper>
        <div className={s.content}>
          <div className={s.left}>
            <PortfoliosComponentTable portfolio={portfolio} />
          </div>
          <div className={s.right}>
          
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { portfolios: store.portfolios.all };
}

export default connect(mapStateToProps)(PortfoliosViewSingle);