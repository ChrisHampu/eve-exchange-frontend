/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import s from './TickerWatchlist.scss';
import { formatNumber, formatNumberUnit, formatPercent } from '../../utilities';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import LeftArrowIcon from 'material-ui/svg-icons/navigation/chevron-left';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Arrow from 'material-ui/svg-icons/av/play-arrow';
import Equal from 'material-ui/svg-icons/editor/drag-handle';

class TickerWatchlist extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
     
    this.state = {
      region: this.props.region
    };
  }

  render() {

    const tickers = this.props.tickers.filter(el => this.props.watchlist.indexOf(el.name) !== -1).map(el => {

      const region = el.regions[this.props.region];

      return { name: el.name, ...region };
    });

    if (!tickers.length) {
      return (
        <div className={s.root}>
          <div className={s.empty}>
          Your watchlist is currently empty. Tickers can be added to the watchlist by opening one and selecting 'Add to Watchlist' from the dropdown menu.
          </div>
        </div>
      )
    }

    return (
      <div className={s.root}>
        <div className={s.header}>
          <div className={s.region}>
          Region <div className={s.region_name}>{this.props.all_regions[this.state.region]}</div>
          </div>
          <div className={s.menu}>
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem type="text" primaryText="Change Hub" innerDivStyle={{padding: "0 16px 0 55px"}} style={{cursor: "pointer"}} leftIcon={<LeftArrowIcon />}
                menuItems={[
                  <MenuItem type="text" primaryText="Jita" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({region: 10000002})}/>,
                  <MenuItem type="text" primaryText="Amarr" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({region: 10000043})}/>,
                  <MenuItem type="text" primaryText="Dodixie" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({region: 10000032})}/>,
                  <MenuItem type="text" primaryText="Hek" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({region: 10000042})}/>,
                  <MenuItem type="text" primaryText="Rens" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({region: 10000030})}/>
                ]}
              />
            </IconMenu>
          </div>
        </div>
        <div className={s.table}>
          <div className={s.table_header}>
            <div className={s.table_title}>
            Name
            </div>
            <div className={s.table_title}>
            index
            </div>
            <div className={s.table_title}>
            Change
            </div>
            <div className={s.table_title}>
            Percent
            </div>
            <div className={s.table_title}>
            Volume Traded
            </div>
            <div className={s.table_title}>
            Market Cap
            </div>
          </div>
          <div className={s.table_content}>
          {
            tickers.map((el, i) => {

              const changeType = el.indexChange > 0 ? 1 : el.indexChange < 0 ? -1 : 0;

              return (
                <div className={s.table_row} key={i}>
                  <div className={s.table_column}>
                    <div className={s.name} onClick={()=>this.context.router.push(`/dashboard/tickers/${el.name}`)}>{el.name}</div>
                  </div>
                  <div className={s.table_column}>
                    <div className={cx(s.arrow, {[s.positive]:changeType===1, [s.negative]:changeType===-1})}>
                    {
                      changeType === 1 || changeType === -1 ? <Arrow /> : <Equal />
                    }
                    </div>
                    <div className={s.price}>
                    {formatNumber(el.index)}
                    </div>
                  </div>
                  <div className={s.table_column}>
                    <div className={cx(s.change, {[s.positive]:changeType===1, [s.negative]:changeType===-1})}>
                    {el.indexChange>0?"+":""}{formatNumber(el.indexChange)}
                    </div>
                  </div>
                  <div className={s.table_column}>
                    <div className={cx(s.change, {[s.positive]:changeType===1, [s.negative]:changeType===-1})}>
                    {el.indexChange>0?"+":""}{formatPercent(el.indexChangePercent)}%
                    </div>
                  </div>
                  <div className={s.table_column}>
                    {formatNumber(el.volumeTraded)}
                  </div>
                  <div className={s.table_column}>
                    {formatNumberUnit(el.regionComponents.map(com=>com.marketCap).reduce((el1,el2) => el1+el2, 0))}
                  </div>
                </div>
              );    
            })
          }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { tickers: store.tickers.list, region: store.settings.market.region, watchlist: store.settings.market.ticker_watchlist || [], all_regions: store.sde.regions };
}

export default connect(mapStateToProps)(TickerWatchlist);