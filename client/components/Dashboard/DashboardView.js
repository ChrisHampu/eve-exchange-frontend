import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './DashboardView.scss';
import { subscribeItem, unsubscribeItem } from '../../market';
import { unPinChartFromDashboard } from '../../actions/settingsActions';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import CandleStickChart from '../Charts/CandleStickChart';

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
    const numRows = Math.ceil(charts.length / 3);

    return (
      <DashboardPage title="Dashboard">
      {
        charts.length === 0 ?
          <div className={s.disclaimer}>
          Pin charts to your dashboard from the market browser for quickly viewing multiple charts at a glance.
          </div>
          :
          <div className={s.dashboard_charts}>
          {
            [...Array(numRows).keys()].map(row => {

              const chartSlice = charts.slice(row * 3, row * 3 + 3);

              return (
                <div key={row} className={s.chart_row}>
                  {
                    chartSlice.map((el, i) => {

                      let flex = "33.333%";
                      if (chartSlice.length === 1) {
                        flex = "100%";
                      } else if (chartSlice.length === 2) {
                        if (i === 1) {
                          flex = "66.6666%";
                        }
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
                              <MenuItem type="text" primaryText="Remove" onTouchTap={()=>{store.dispatch(unPinChartFromDashboard(item.id))}} />
                              <MenuItem type="text" primaryText="View in Browser" onTouchTap={()=>{this.context.router.push(`/dashboard/browser/${item.id}`)}} />
                            </IconMenu>
                          </div>
                          <div className={s.chart}>
                            <CandleStickChart style={{flex: 1}} item={item} title={item.name} />
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
      </DashboardPage>
    )
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(DashboardView);