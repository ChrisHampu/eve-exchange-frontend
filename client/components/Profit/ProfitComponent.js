/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import ProfitChart from './ProfitChart';
import cx from 'classnames';

import { appEnterFullscreen } from '../../actions/appActions';

import IconButton from 'material-ui/IconButton';
import FullscreenIcon from 'material-ui/svg-icons/navigation/fullscreen';

class ProfitComponent extends React.Component {

  render() {

    return (
      <DashboardPage title="Profit Report" fullWidth={true}>
        <DashboardPageMenu menu={{
          'Chart': "/dashboard/profit",
          'Transactions': "/dashboard/profit/transactions",
          'Top Items': "/dashboard/profit/topitems",
          'Top Profiles': "/dashboard/profit/profiles",
          'All Time': "/dashboard/profit/alltime"}}
          location={this.props.location}
        />
        <DashboardPageBody children={this.props.children} defaultComponent={
          <div style={{flex: 1, width: "100%", height: "100%", display: "flex"}}>
            <div style={{margin: "0 1rem 0 0", float: "right", position: "absolute", right: 0}}>
              <div style={{position: "relative"}}>
                <IconButton tooltip="Fullscreen" onClick={()=>store.dispatch(appEnterFullscreen(2, {title: ""}))} iconStyle={{width: "32px", height: "32px"}} style={{width: "49px", height: "49px", padding: "0px", zIndex:this.props.fullscreen.visual_type>0?0:1}}>
                  <FullscreenIcon />
                </IconButton>
              </div>
            </div>
            <ProfitChart style={{flex: 1, width: "100%"}} />
          </div>
        }/>
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { profit: store.profit, fullscreen: store.app.fullscreen };
}

export default connect(mapStateToProps)(ProfitComponent);