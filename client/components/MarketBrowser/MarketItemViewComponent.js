import React from 'react';
import ReactDOM from 'react-dom';
import s from './MarketItemViewComponent.scss';
import { connect } from 'react-redux';
import store from '../../store';
import { subscribeItem, unsubscribeItem } from '../../market';
import { pinChartToDashboard, unPinChartFromDashboard } from '../../actions/settingsActions';

import MarketBrowserOrderTable from './MarketBrowserOrderTable';
import CandleStickChart from '../Charts/CandleStickChart';

import { Tabs, Tab } from 'material-ui/Tabs';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';

import CloseIcon from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';

class MarketItemViewComponent extends React.Component {

  static propTypes = {

    item: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    subscribeItem(this.props.item.id, 0);
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.item.id !== nextProps.item.id) {
      unsubscribeItem(this.props.item.id, 0);
    }

    subscribeItem(nextProps.item.id, 0);
  }

  isChartPinned() {

    return this.props.settings.pinned_charts[this.props.item.id] || false;
  }

  pinChart() {

    store.dispatch(pinChartToDashboard(this.props.item));
  }

  unPinChart() {

    store.dispatch(unPinChartFromDashboard(parseInt(this.props.item.id)));
  }

  render() {
    return (
      <div className={s.market_item_view}>
        <div className={s.market_item_view_header}>
          <div className={s.market_item_view_header_name}>
            {this.props.item.name}
          </div>
          {
            this.isChartPinned() ?
              <IconButton tooltip="Pinned To Dashboard" disableTouchRipple={true} tooltipPosition="bottom-center" style={{zIndex: 1, cursor: "default", top: "3px", width: 0, height: 0}}>
                <CheckIcon />
              </IconButton>
            : false
          }
          <div className={s.market_item_view_header_menus}>
            <IconButton onClick={()=>{this.props.selector(null);}} tooltip="Close" tooltipPosition="bottom-center" style={{zIndex: 1}}>
              <CloseIcon />
            </IconButton>
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              {
                this.isChartPinned() ? 
                  <MenuItem type="text" primaryText="Unpin From Dashboard" onTouchTap={()=>{this.unPinChart()}}/>
                  : <MenuItem type="text" primaryText="Pin To Dashboard" onTouchTap={()=>{this.pinChart()}}/>
              }
            </IconMenu>
          </div>
        </div>
        <Tabs style={{height: "100%", flex: 1, flexDirection: "column"}} className={s.tab_container} contentContainerClassName={s.tab_content}>
          <Tab label="Chart" style={{backgroundColor: "rgb(38, 43, 47)"}}>
            <div ref="market_container" className={s.market_item_chart_container}>
              <CandleStickChart style={{flex: 1}} item={this.props.item} />
            </div>
          </Tab>
          <Tab label="Orders" style={{backgroundColor: "rgb(38, 43, 47)"}}>
              <MarketBrowserOrderTable item={this.props.item}/>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(MarketItemViewComponent);