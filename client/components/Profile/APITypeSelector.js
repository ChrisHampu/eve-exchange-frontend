import React from 'react';
import cx from 'classnames';
import s from './APITypeSelector.scss';
import APIStepperControl from './APIStepperControl';
import { userHasPremium } from '../../auth';

class APITypeSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      type: -1
    };
  }

  render() {

    // Default screen
    if (this.state.type === -1) {

      return (
        <div style={{display: "flex", width: "100%", "height": "100%", alignItems:"center"}}>
          <div style={{margin:"0 auto"}}>
            <div className={s.card}>
              <div onClick={()=>this.setState({type: 0})} className={s.text}>
                <div>Add Character</div>
              </div>
            </div>
            <div className={cx(s.card, { [s.premium]: !userHasPremium()})}>
              <div onClick={()=>!userHasPremium() ? null : this.setState({type: 1})} className={s.text}>
                <div>Add Corporation
                {
                  !userHasPremium() ? <div className={s.premium_text}>Requires a premium subscription</div> : null
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.type === 0) {
      return (<APIStepperControl type={0} />);
    } else {
      return (<APIStepperControl type={1} />);
    }
  }
}

export default APITypeSelector;