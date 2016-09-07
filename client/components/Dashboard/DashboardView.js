import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './DashboardView.scss';
import { subscribeItem, unsubscribeItem } from '../../market';
import { unPinChartFromDashboard } from '../../actions/settingsActions';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import MarketItemChart from '../Charts/MarketItemChart';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class DashboardView extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render() {

    const charts = Object.keys(this.props.settings.pinned_charts);
    const numRows = Math.ceil(charts.length / 2);

    return (
      <div className={s.root}>
        <div className={s.container}>
        {
          charts.length === 0 ?
            <div className={s.disclaimer}>
              <div className={s.title}>
              Dashboard
              </div>
              <div>
              This is your personalized dashboard that can be used to quickly view multiple realtime charts.<br />
              Use the market browser to find and pin charts to your dashboard to keep track of multiple items from one screen.
              </div>
            </div>
            :
            <div className={s.dashboard_charts}>
            {
              [...Array(numRows).keys()].map(row => {

                const chartSlice = charts.slice(row * 2, row * 2 + 2);

                let height = "100%";

                if (numRows >= 2) { 
                  height = "50%"; 
                } else { 
                  if (row === 0) { 
                    height = "100%"; 
                  } else { 
                    height = "50%"; 
                  }
                }

                return (
                  <div key={row} className={s.chart_row} style={{height: height, maxHeight: height}}>
                    {
                      chartSlice.map((el, i) => {

                        let flex = "50%";

                        if (chartSlice.length === 1) {
                          flex = "100%";
                        }

                        const item = { id: el, name: this.props.settings.pinned_charts[el] };
                        subscribeItem(item.id, 0);
                        return (
                          <div key={i} className={s.chart_container} style={{ flexBasis: flex}}>
                            <div className={s.chart_header}>
                              <IconMenu
                                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                className={s.chart_menu}
                              >
                                <MenuItem type="text" primaryText="Remove" onTouchTap={()=>{store.dispatch(unPinChartFromDashboard(item.id))}} style={{cursor: "pointer"}} />
                                <MenuItem type="text" primaryText="View in Browser" onTouchTap={()=>{this.context.router.push(`/dashboard/browser/${item.id}`)}} style={{cursor: "pointer"}} />
                                <MenuItem type="text" primaryText="Settings" onTouchTap={()=>{this.context.router.push('dashboard/profile/settings')}} style={{cursor: "pointer"}} />
                               </IconMenu>
                            </div>
                            <div className={s.chart}>
                              <MarketItemChart style={{flex: 1}} item={item} title={item.name} />
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            }
            </div>
        }
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(DashboardView);