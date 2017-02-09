/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import s from './TickerView.scss';
import { formatNumber, formatPercent } from '../../utilities';
import store from '../../store';
import { addTickerWatchlist, removeTickerWatchlist } from '../../actions/settingsActions';

import Ticker from './Ticker';
import TickerChart from './TickerChart';
import TickerComponents from './TickerComponents';

import { Tabs, Tab } from 'material-ui/Tabs';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';

class TickerView extends React.Component {

  isWatchlisted(ticker) {

    return this.props.watchlist.indexOf(ticker.name) !== -1;
  }

  addWatchlist(ticker) {

    store.dispatch(addTickerWatchlist(ticker.name));
  }

  removeWatchlist(ticker) {

    store.dispatch(removeTickerWatchlist(ticker.name));
  }

  render() {

    if (!this.props.tickers.length) {
      return (
        <div className={s.root}>
        Loading...
        </div>
      );
    }

    const ticker = this.props.tickers.find(el => el.name.toLowerCase() === this.props.params.name.toLowerCase());

    if (!ticker) {
      return (
        <div className={s.root}>
        There's no ticker with the name {this.props.params.name}.
        </div>
      );
    }

    const regionTicker = ticker.regions[this.props.region];

    return (
      <div className={s.root}>
        <div className={s.ticker}>
          <Ticker {...ticker} region={this.props.region}/>
        </div>
        <div className={s.pin}>
        {
          this.isWatchlisted(ticker) ? 
            <IconButton tooltip="Watchlisted" disableTouchRipple={true} tooltipPosition="bottom-center" style={{zIndex: 1, cursor: "default", top: "3px", width: 0, height: 0}}>
              <CheckIcon />
            </IconButton> : false
        }
        </div>
        <div className={s.menu}>
          <IconMenu
            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            {
              !this.isWatchlisted(ticker) ? 
                <MenuItem type="text" primaryText="Add to Watchlist" innerDivStyle={{padding: "0 16px 0 55px"}} onTouchTap={()=>this.addWatchlist(ticker)} style={{cursor: "pointer"}} insetChildren={true} />
                : <MenuItem type="text" primaryText="Remove from Watchlist" innerDivStyle={{padding: "0 16px 0 55px"}} onTouchTap={()=>this.removeWatchlist(ticker)} style={{cursor: "pointer"}} insetChildren={true} />
            }
          </IconMenu>
        </div>
        <Tabs style={{height: "100%", flex: 1, flexDirection: "column"}} className={s.tabs} contentContainerClassName={s.tab_container}>
          <Tab label="Summary" style={{backgroundColor: "rgb(29, 33, 37)"}}>
            <TickerChart {...regionTicker} />
            <div className={s.info_table}>
              <div className={s.row}>
                <div className={s.block}>
                  <div className={s.key}>
                  Avg Buy Price
                  </div>
                  <div className={s.value}>
                  {formatNumber(regionTicker.averageBuyValue)}
                  </div>
                </div>
                <div className={s.block}>
                  <div className={s.key}>
                  Avg Price Change
                  </div>
                  <div className={s.value}>
                  {formatNumber(regionTicker.averageBuyValueChange)}
                  </div>
                </div>
                <div className={s.block}>
                  <div className={s.key}>
                  Change Percent
                  </div>
                  <div className={s.value}>
                  {formatPercent(regionTicker.averageBuyValueChangePercent)}%
                  </div>
                </div>
              </div>
              <div className={s.row}>
                <div className={s.block}>
                  <div className={s.key}>
                  Volume Traded
                  </div>
                  <div className={s.value}>
                  {formatNumber(regionTicker.volumeTraded)}
                  </div>
                </div>
                <div className={s.block}>
                  <div className={s.key}>
                  Volume Traded Change
                  </div>
                  <div className={s.value}>
                  {formatNumber(regionTicker.volumeTradedChange)}
                  </div>
                </div>
                <div className={s.block}>
                  <div className={s.key}>
                  Change Percent
                  </div>
                  <div className={s.value}>
                  {formatPercent(regionTicker.volumeTradedChangePercent)}%
                  </div>
                </div>
              </div>
              <div className={s.row}>
                <div className={s.block}>
                  <div className={s.key}>
                  Avg Spread
                  </div>
                  <div className={s.value}>
                  {formatPercent(regionTicker.averageSpread)}%
                  </div>
                </div>
                <div className={s.block}>
                  <div className={s.key}>
                  Avg Spread Change
                  </div>
                  <div className={s.value}>
                  {formatNumber(regionTicker.spreadChange)}
                  </div>
                </div>
                <div className={s.block}>
                  <div className={s.key}>
                  Change Percent
                  </div>
                  <div className={s.value}>
                  {formatPercent(regionTicker.spreadChangePercent)}%
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab label="Components" style={{backgroundColor: "rgb(29, 33, 37)"}}>
            <TickerComponents components={regionTicker.regionComponents} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { tickers: store.tickers.list, region: store.settings.market.region, watchlist: store.settings.market.ticker_watchlist || [] };
}

export default connect(mapStateToProps)(TickerView);