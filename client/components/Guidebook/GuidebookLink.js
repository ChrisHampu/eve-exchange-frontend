import React from 'react';
import cx from 'classnames';
import store from '../../store';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import s from './GuidebookLink.scss';

import { updateGuidebookSetting } from '../../actions/settingsActions';

import RaisedButton from 'material-ui/RaisedButton';

class GuidebookLink extends React.Component {

  static propTypes = {
    settingsKey: React.PropTypes.string.isRequired, // Settings key
    page: React.PropTypes.string.isRequired, // Page to link to
    style: React.PropTypes.object
  };

  setRoute(route) {

    browserHistory.push(route);
  }

  dismiss() {

    this.setState({
      height: "0px"
    });
  }

  dismissForever() {

    this.dismiss();

    setTimeout(()=>store.dispatch(updateGuidebookSetting(this.props.settingsKey, false)), 450);
  }

  constructor(props) {
    super(props);
      
    this.state = {
      height: "68px"
    };
  }

  renderLink() {
    return (
      <div className={s.root} style={this.props.style}>
        <div className={s.transition} style={{height: this.state.height, marginBottom: this.state.height==="0px"?"0":"1rem"}}>
          <div className={s.container}>
            <div className={s.text}>
              This page has a <span className={s.link} onClick={()=>this.setRoute(`/dashboard/reference/${this.props.page}`)}>reference guide</span> that may be helpful to you.
            </div>
            <div className={s.buttons}>
              <RaisedButton
                backgroundColor="rgb(30, 35, 39)"
                labelColor="rgb(235, 169, 27)"
                primary={true}
                label="Dismiss"
                style={{marginRight: "1rem"}}
                onTouchTap={()=>this.dismiss()}
              />
              <RaisedButton
                backgroundColor="rgb(30, 35, 39)"
                labelColor="rgb(235, 169, 27)"
                primary={true}
                label="Don't Show Again"
                onTouchTap={()=>this.dismissForever()}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {

    if (this.props.settings.guidebook && !this.props.settings.guidebook.disable && this.props.settings.guidebook[this.props.settingsKey] && this.props.settings.guidebook[this.props.settingsKey] === true) {

      return this.renderLink();
    }

    return null;
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(GuidebookLink);