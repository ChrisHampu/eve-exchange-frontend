import React from 'react';
import ReactDOM from 'react-dom';
import s from './MarketItemViewComponent.scss';
import cx from 'classnames';
import { connect } from 'react-redux';
import store from '../../store';
import { subscribeItem, unsubscribeItem, itemIDToName } from '../../market';
import { pinChartToDashboard, unPinChartFromDashboard } from '../../actions/settingsActions';
import { userHasPremium } from '../../auth';
import { formatNumberUnit, formatPercent } from '../../utilities';

import MarketBrowserOrderTable from './MarketBrowserOrderTable';
import MarketBrowserSimulate from './MarketBrowserSimulate';
import MarketItemChart from '../Charts/MarketItemChart';

import { Tabs, Tab } from 'material-ui/Tabs';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';

import CloseIcon from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import LeftArrowIcon from 'material-ui/svg-icons/navigation/chevron-left';

class MarketItemViewComponent extends React.Component {

  static propTypes = {
    params: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      item: {
        id: this.props.params.id,
        name: itemIDToName(this.props.sde.market_items, this.props.params.id)
      },
      tab: (this.props.settings.market && this.props.settings.market.default_tab != undefined) ? this.props.settings.market.default_tab : 0,
      width: 0,
      height: 0,
      regionOverride: null
    };

    subscribeItem(this.state.item.id, 0);
  }

  componentWillReceiveProps(nextProps) {

    if (this.state.item.id !== nextProps.params.id) {
      unsubscribeItem(this.state.item.id, 0);
    }

    subscribeItem(nextProps.params.id, 0);

    this.setState({
      item: {
        id: nextProps.params.id,
        name: itemIDToName(this.props.sde.market_items, nextProps.params.id)
      }
    })
  }

  isChartPinned() {

    return this.props.settings.pinned_charts[this.state.item.id] || false;
  }

  pinChart() {

    store.dispatch(pinChartToDashboard(this.state.item));
  }

  unPinChart() {

    store.dispatch(unPinChartFromDashboard(parseInt(this.state.item.id)));
  }

 getAggregateData() {

    const region = this.state.regionOverride || store.getState().settings.market.region;

    if (typeof this.props.market.item[this.state.item.id] !== 'undefined') {

      if (userHasPremium()) {
        if (!this.props.market.item[this.state.item.id].minutes) {
          return null;
        }
        var arr = this.props.market.item[this.state.item.id].minutes[region];
        if (!arr) {
          return null;
        }
        return arr[arr.length-1];
      } else {
        if (!this.props.market.item[this.state.item.id].hours) {
          return null;
        }
        var arr = this.props.market.item[this.state.item.id].hours[region];
        if (!arr) {
          return null;
        }
        return arr[arr.length-1];
      }
    }

    return null;
  }

  componentDidMount() {
    this.setState({
      height: ReactDOM.findDOMNode(this.refs.container).clientHeight,
      width: ReactDOM.findDOMNode(this.refs.container).clientWidth
    });
  }

  render() {

    const first = this.getAggregateData();

    let buy = 0, sell = 0, spread = 0;

    if (first) {
      buy = first.buyPercentile;
      sell = first.sellPercentile;
      spread = first.spread;
    }

    return (
      <div className={s.market_item_view}>
        <div className={s.market_item_view_header}>
          <div className={s.market_item_view_header_name}>
            {this.state.item.name} - Buy: <span>{formatNumberUnit(buy)}</span>  Sell: <span>{formatNumberUnit(sell)}</span>  Spread: <span>{formatPercent(spread)}%</span>
          </div>
          {
            this.isChartPinned() ?
              <IconButton tooltip="Pinned To Dashboard" disableTouchRipple={true} tooltipPosition="bottom-center" style={{zIndex: 1, cursor: "default", top: "3px", width: 0, height: 0}}>
                <CheckIcon />
              </IconButton>
            : false
          }
          <div className={s.market_item_view_header_menus}>
            <IconButton onClick={()=>{this.context.router.push('/dashboard/browser')}} tooltip="Close" tooltipPosition="bottom-center" style={{zIndex: 1}}>
              <CloseIcon />
            </IconButton>
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              {
                this.isChartPinned() ? 
                  <MenuItem type="text" primaryText="Unpin From Dashboard" innerDivStyle={{padding: "0 16px 0 55px"}} onTouchTap={()=>{this.unPinChart()}} style={{cursor: "pointer"}} insetChildren={true} />
                  : <MenuItem type="text" primaryText="Pin To Dashboard" innerDivStyle={{padding: "0 16px 0 55px"}} onTouchTap={()=>{this.pinChart()}} style={{cursor: "pointer"}} insetChildren={true} />
              }
              <MenuItem type="text" primaryText="Settings" innerDivStyle={{padding: "0 16px 0 55px"}} onTouchTap={()=>this.context.router.push('/dashboard/profile/settings')} style={{cursor: "pointer"}} insetChildren={true} />
              <MenuItem type="text" primaryText="Change Hub" innerDivStyle={{padding: "0 16px 0 55px"}} style={{cursor: "pointer"}} leftIcon={<LeftArrowIcon />}
                menuItems={[
                  <MenuItem type="text" primaryText="Jita" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({regionOverride: 10000002})}/>,
                  <MenuItem type="text" primaryText="Amarr" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({regionOverride: 10000043})}/>,
                  <MenuItem type="text" primaryText="Dodixie" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({regionOverride: 10000032})}/>,
                  <MenuItem type="text" primaryText="Hek" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({regionOverride: 10000042})}/>,
                  <MenuItem type="text" primaryText="Rens" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({regionOverride: 10000030})}/>
                ]}
              />
            </IconMenu>
          </div>
        </div>
        <div style={{height: "100%", flex: 1, display: "flex", flexDirection: "column"}} ref="content">
          <div className={s.button_container}>
            <button className={cx(s.button, { [s.show]: this.state.tab===0})} onClick={()=>this.setState({tab: 0})}>
              <div>
                <div className={s.text}>
                Chart
                </div>
              </div>
            </button>
            <button className={cx(s.button, { [s.show]: this.state.tab===1})} onClick={()=>this.setState({tab: 1})}>              
              <div>
                <div className={s.text}>
                Price Ladder
                </div>
              </div>
            </button>
            <button className={cx(s.button, { [s.show]: this.state.tab===2})} onClick={()=>this.setState({tab: 2})}>
              <div>
                <div className={s.text}>
                Simulate
                </div>
              </div>
            </button>
          </div>
          <div className={s.tabs} ref="container">
            <div className={cx(s.tab, { [s.show]: this.state.tab===0})}>
              <MarketItemChart item={this.state.item} region={this.state.regionOverride} width={this.state.width} height={this.state.height}/>
            </div>
            <div className={cx(s.tab, { [s.show]: this.state.tab===1})}>
              <MarketBrowserOrderTable item={this.state.item} region={this.state.regionOverride} />
            </div>
            <div className={cx(s.tab, { [s.show]: this.state.tab===2})}>
              <MarketBrowserSimulate data={first} item={this.state.item} region={this.state.regionOverride || store.getState().settings.market.region} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings, sde: store.sde, market: store.market };
}

export default connect(mapStateToProps)(MarketItemViewComponent);