/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import s from './TickerAnalysis.scss';
import { formatNumber, formatPercent } from '../../utilities';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import LeftArrowIcon from 'material-ui/svg-icons/navigation/chevron-left';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class TickerAnalysis extends React.Component {

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

    if (!this.props.tickers.length) {
      return (
        <div className={s.root}>
        Loading...
        </div>
      );
    }

    const tickers = this.props.tickers.map(el => {

      const region = el.regions[this.state.region];

      return { name: el.name, ...region };
    });

    const highest = tickers.sort((el1, el2) => el2.indexChange - el1.indexChange).slice(0, 10);
    const lowest = tickers.sort((el1, el2) => el1.indexChange - el2.indexChange).slice(0, 10);

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
        <div className={s.pane}>
          <div className={s.group}>
            <div className={s.group_title}>
            Gainers
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
              </div>
              <div className={s.table_content}>
              {
                highest.map((el, i) => {

                  const changeType = el.indexChange > 0 ? 1 : el.indexChange < 0 ? -1 : 0;

                  return (
                    <div className={s.table_row} key={i}>
                      <div className={s.table_column}>
                        <div className={s.name} onClick={()=>this.context.router.push(`/dashboard/tickers/${el.name}`)}>{el.name}</div>
                      </div>
                      <div className={s.table_column}>
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
                    </div>
                  )
                })
              }
              </div>
            </div>
          </div>
        </div>
        <div className={s.pane}>
          <div className={s.group}>
            <div className={s.group_title}>
            Losers
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
              </div>
              <div className={s.table_content}>
              {
                lowest.map((el, i) => {

                  const changeType = el.indexChange > 0 ? 1 : el.indexChange < 0 ? -1 : 0;

                  return (
                    <div className={s.table_row} key={i}>
                      <div className={s.table_column}>
                        <div className={s.name} onClick={()=>this.context.router.push(`/dashboard/tickers/${el.name}`)}>{el.name}</div>
                      </div>
                      <div className={s.table_column}>
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
                    </div>
                  )
                })
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { tickers: store.tickers.list, region: store.settings.market.region, all_regions: store.sde.regions };
}

export default connect(mapStateToProps)(TickerAnalysis);