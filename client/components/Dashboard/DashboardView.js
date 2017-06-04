import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './DashboardView.scss';
import { browserHistory } from 'react-router';
import { subscribeItem, unsubscribeItem } from '../../market';
import { unPinChartFromDashboard } from '../../actions/settingsActions';
import MarketItemChartComponent from '../MarketBrowser/MarketItemChartComponent';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class DashboardView extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  setRoute(route) {

    browserHistory.push(route);
  }

  removeChart(id) {

    store.dispatch(unPinChartFromDashboard(id));
    unsubscribeItem(id);
  }

  render() {

    const charts = Object.keys(this.props.settings.pinned_charts);

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
                You do not have any charts pinned to your dashboard yet.<br />You can do so from the <b><span className={s.link} onClick={() => this.setRoute('/dashboard/browser')}>Market Browser</span></b> by selecting an item and clicking <i>Pin to Dashboard</i> from the top right context menu.
              </div>
            </div>
            :
            <div className={s.dashboard_charts}>
            {
              charts.map((chart, i) => {

                const item = { id: chart, name: this.props.settings.pinned_charts[chart] };

                subscribeItem(item.id);

                return (
                  <div key={i} className={s.chart_container}>
                    <div className={s.chart_header}>
                      <IconMenu
                        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                        className={s.chart_menu}
                      >
                        <MenuItem type="text" primaryText="Remove" onTouchTap={() => this.removeChart(item.id)} style={{cursor: "pointer"}} />
                        <MenuItem type="text" primaryText="View in Browser" onTouchTap={()=>{this.context.router.push(`/dashboard/browser/${item.id}`)}} style={{cursor: "pointer"}} />
                        <MenuItem type="text" primaryText="Settings" onTouchTap={()=>{this.context.router.push('dashboard/profile/settings')}} style={{cursor: "pointer"}} />
                      </IconMenu>
                    </div>
                    <div className={s.chart}>
                      <MarketItemChartComponent item={item} dashboardMode />
                    </div>
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
