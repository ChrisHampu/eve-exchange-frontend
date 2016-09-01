/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import store from '../../store';
import s from './PortfoliosViewSingle.scss';
import cx from 'classnames';
import { formatNumber, formatPercent } from '../../utilities';
import { itemIDToName } from '../../market';

import PortfoliosComponentTable from './PortfoliosComponentTable';
import PortfoliosPerformanceChart from './PortfoliosPerformanceChart';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import { Tabs, Tab } from 'material-ui/Tabs';

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
      width: 0,
      height: 0
    };
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  updateContainer() {

    if (!this.getPortfolio()) {
      return;
    }

    const newHeight = ReactDOM.findDOMNode(this.refs.content).clientHeight - 50; // -50 for the tab header
    const newWidth = ReactDOM.findDOMNode(this.refs.content).clientWidth;

    if (newHeight != this.state.height || newWidth != this.state.width) {
      this.setState({
        width: newWidth,
        height: newHeight
      });
    }
  }

  componentDidMount() {

    this.updateContainer();
  }

  componentDidUpdate() {

    this.updateContainer();
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
        <div className={s.content} ref="content">
          <Tabs style={{height: "100%", flex: 1, flexDirection: "column"}} className={s.tab_container} contentContainerClassName={s.tab_content} onChange={()=>this.refs.chart.updateContainer()}>
            <Tab label="Components" style={{backgroundColor: "rgb(29, 33, 37)"}}>
              <PortfoliosComponentTable portfolio={portfolio} />
            </Tab>
            <Tab label="Performance Chart" style={{backgroundColor: "rgb(29, 33, 37)"}}>
              <PortfoliosPerformanceChart ref="chart" width={this.state.width} height={this.state.height} style={{flex: 1}} portfolio={portfolio} />
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { portfolios: store.portfolios.all };
}

export default connect(mapStateToProps)(PortfoliosViewSingle);