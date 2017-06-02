/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import s from './FullscreenComponent.scss';
import { appExitFullscreen } from '../../actions/appActions';

// Possible full screen components
//import MarketItemChart from '../Charts/MarketItemChart';
import ProfitChart from '../Profit/ProfitChart';

// Material UI
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

class FullscreenComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillReceiveProps(newProps) {
    this.props = newProps;

  }

  renderVisual() {

    if (this.props.fullscreen.visual_type === 1) {
      return <div />;
    } else if(this.props.fullscreen.visual_type === 2) {
      return <ProfitChart {...this.props.fullscreen.props} />;
    }

    return <div></div>;
  }

  render() {

    if (!this.props.fullscreen.visual_type) {
      return <div style={{display: "none"}} />
    }

    return (
      <div className={s.root}>
        <div className={s.overlay}>
          <div className={s.container}>
            <div className={s.close_container}>
              <div className={s.close}>
                <IconButton tooltip="Close" onClick={()=>store.dispatch(appExitFullscreen())} iconStyle={{width: "32px", height: "32px"}} style={{width: "49px", height: "49px", padding: "0px"}}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            {this.renderVisual()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { fullscreen: store.app.fullscreen };
}

export default connect(mapStateToProps)(FullscreenComponent);
