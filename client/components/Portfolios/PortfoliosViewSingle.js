/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import store from '../../store';
import s from './PortfoliosViewSingle.scss';
import cx from 'classnames';
import { sendAppNotification } from '../../actions/appActions';
import { formatNumber, formatPercent } from '../../utilities';
import { getAuthToken } from '../../deepstream';
import { APIEndpointURL } from '../../globals';

import PortfoliosComponentTable from './PortfoliosComponentTable';
import PortfoliosMaterialTable from './PortfoliosMaterialTable';
import PortfoliosPerformanceChart from './PortfoliosPerformanceChart';
import PortfoliosSpiderChart from './PortfoliosSpiderChart';
import PortfoliosTradeSimulation from './PortfoliosTradeSimulation';
import PortfoliosMultiBuy from './PortfoliosMultiBuy';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import { Tabs, Tab } from 'material-ui/Tabs';
import CircularProgress from 'material-ui/CircularProgress';

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
      height: 0,
      deleteRequested: false
    };
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  updateContainer() {

    if (!this.props.portfolios || !this.getPortfolio() || !this.refs.content) {
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

  deletePortfolio() {

    this.setState({
      deleteRequested: true
    }, async () => {

      try {
        const portfolio = this.getPortfolio();

        const res = await fetch(`${APIEndpointURL}/portfolio/delete/${portfolio.portfolioID}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${getAuthToken()}`
          }
        });

        const result = await res.json();

        console.log(result);

        if (result.error) {
          store.dispatch(sendAppNotification("There was a problem deleting the portfolio. Please refresh"));
          throw (result.error);
        } else {
          store.dispatch(sendAppNotification("Portfolio has been deleted"));
        }

        this.setRoute('/dashboard/portfolios/view');

      } catch (e) {

        console.log(e);
        this.setRoute('/dashboard/portfolios/view');
      }
    })
  }

  render() {

    if (!this.props.portfolios) {

      return (
        <div style={{display: "flex", alignItems: "center", width: "100%", minHeight: "150px"}}>
          <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
        </div>
      );
    }

    const portfolio = this.getPortfolio();

    if (!portfolio) {
      return (
        <div className={s.root}>
        {`Cannot find portfolio with id ${this.props.params.id}`}
        </div>
      )
    }

    if (this.state.deleteRequested) {
      return (
        <div style={{display: "flex", alignItems: "center", width: "100%", minHeight: "150px"}}>
          <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
        </div>
      )
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          <Paper zDepth={2}>
            <div className={s.metadata}>
              {
                portfolio.type === 0 ?
                  <div className={s.values}>
                  {portfolio.name} - Total Value of Trading Portfolio: <span className={s.value}>{formatNumber(portfolio.currentValue)} ISK</span>Average Spread: <span className={s.value}>{formatPercent(portfolio.averageSpread)}%</span>Overall Growth: <span className={s.value}>{formatPercent(100 - (portfolio.startingValue / portfolio.currentValue) * 100)}%</span>
                  </div> :
                  <div className={s.values}>
                  {portfolio.name} - Component Value: <span className={s.value}>{formatNumber(portfolio.currentValue)} ISK</span>Sell Value: <span className={s.value}>{formatNumber(portfolio.industryValue || 0)} ISK</span>Profit Margin: <span className={s.value}>{formatPercent(portfolio.industrySpread)}%</span>Potential Profit: <span className={s.value}>{formatNumber((portfolio.industryValue || 0)-portfolio.currentValue)} ISK</span>
                  </div>
              }
              <div className={s.corner_menu}>
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  className={s.icon_menu}
                >
                  <MenuItem type="text" primaryText="Delete" onTouchTap={()=>this.deletePortfolio()} style={{cursor: "pointer"}} />
                </IconMenu>
              </div>
            </div>
          </Paper>
          <div className={s.content} ref="content">
            <Tabs style={{height: "100%", flex: 1, flexDirection: "column"}} className={s.tab_container} contentContainerClassName={s.tab_content} onChange={()=>this.refs.chart.updateContainer()}>
              <Tab label="Components" style={{backgroundColor: "rgb(29, 33, 37)"}}>
                <PortfoliosComponentTable portfolio={portfolio} />
              </Tab>
              {
                portfolio.type === 1 && portfolio.materials && portfolio.materials.length > 0 ?
                  <Tab label="Materials" style={{backgroundColor: "rgb(29, 33, 37)"}}>
                    <PortfoliosMaterialTable portfolio={portfolio} /> 
                  </Tab> : false
              }
              <Tab label="Performance Chart" style={{backgroundColor: "rgb(29, 33, 37)"}}>
                <PortfoliosPerformanceChart ref="chart" width={this.state.width} height={this.state.height} style={{flex: 1}} portfolio={portfolio} />
              </Tab>
              {
                portfolio.type === 1 ?
                  <Tab label="Component Chart" style={{backgroundColor: "rgb(29, 33, 37)"}}>
                    <PortfoliosSpiderChart width={this.state.width} height={this.state.height} portfolio={portfolio} />
                  </Tab>
                   :
                  <Tab label="Trade Simulation" style={{backgroundColor: "rgb(29, 33, 37)"}}>
                    <PortfoliosTradeSimulation portfolio={portfolio} />
                  </Tab>
              }
              <Tab label="Multi Buy" style={{backgroundColor: "rgb(29, 33, 37)"}}>
                <PortfoliosMultiBuy portfolio={portfolio} />
              </Tab>
            </Tabs>
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