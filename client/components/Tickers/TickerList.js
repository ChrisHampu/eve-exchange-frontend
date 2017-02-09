/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import s from './TickerList.scss';

import Ticker from './Ticker';
import GuidebookLink from '../Guidebook/GuidebookLink';

class TickersList extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
     
    this.state = {
      region: this.props.region
    };
  }

  render() {

    return (
      <div className={s.root}>
        <GuidebookLink settingsKey="tickers" page="tickers" />
        {
          Object.keys(this.props.categories).map(category => {

            return (
              <div className={s.category} key={category}>
                <div className={s.name}>
                {this.props.categories[category]}
                </div>
                <div className={s.list}>
                {
                  this.props.tickers.filter(tick => tick.category === parseInt(category)).map(el => {
                    return (
                      <div className={s.ticker} onClick={()=>this.context.router.push(`/dashboard/tickers/${el.name}`)} key={el._id}>
                        <div className={s.container}>
                          <Ticker {...el} region={this.state.region} />
                        </div>
                      </div>
                    );
                  })
                }
                </div>
              </div>
            )
          })
        }
        
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { tickers: store.tickers.list, region: store.settings.market.region, categories: store.tickers.categories };
}

export default connect(mapStateToProps)(TickersList);