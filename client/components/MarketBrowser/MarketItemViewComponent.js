import React from 'react';
import ReactDOM from 'react-dom';
import s from './MarketItemViewComponent.scss';
import { connect } from 'react-redux';
import store from '../../store';
import { subscribeItem, unsubscribeItem, itemIDToName } from '../../market';
import { pinChartToDashboard, unPinChartFromDashboard } from '../../actions/settingsActions';

import MarketBrowserOrderTable from './MarketBrowserOrderTable';
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
        name: itemIDToName(this.props.sde.market_items, this.props.params.id),
        regionOverride: null
      }
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

  render() {
    return (
      <div className={s.market_item_view}>
        <div className={s.market_item_view_header}>
          <div className={s.market_item_view_header_name}>
            {this.state.item.name}
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
          <Tabs style={{height: "100%", flex: 1, flexDirection: "column"}} className={s.tab_container} contentContainerClassName={s.tab_content}>
            <Tab label="Chart" style={{backgroundColor: "rgb(38, 43, 47)"}}>
              <div className={s.market_item_chart_container}>
                <MarketItemChart style={{flex: 1}} item={this.state.item} region={this.state.regionOverride} />
              </div>
            </Tab>
            <Tab label="Price Ladder" style={{backgroundColor: "rgb(38, 43, 47)"}}>
                <MarketBrowserOrderTable item={this.state.item} region={this.state.regionOverride} />
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings, sde: store.sde };
}

export default connect(mapStateToProps)(MarketItemViewComponent);