/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import s from './TickerList.scss';
import { itemIDToName } from '../../market';

import Ticker from './Ticker';
import GuidebookLink from '../Guidebook/GuidebookLink';

import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import LeftArrowIcon from 'material-ui/svg-icons/navigation/chevron-left';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class TickersList extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
     
    this.state = {
      region: this.props.region,
      search: null
    };
  }

  render() {

    return (
      <div className={s.root}>
        <div className={s.header}>
          <div>
          <GuidebookLink settingsKey="tickers" page="tickers" />
          </div>
          <div className={s.items}>
            <div className={s.search}>
              <TextField
                floatingLabelText="Filter by ticker or item name"
                onChange={(ev)=>this.setState({search: ev.currentTarget.value})}
              />
            </div>
            <div className={s.region}>
            Region <div className={s.region_name}>{this.props.all_regions[this.state.region]}</div>
            </div>
            <div className={s.menu}>
              <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem type="text" primaryText="Change Hub" innerDivStyle={{padding: "0 16px 0 55px"}} style={{cursor: "pointer"}} leftIcon={<LeftArrowIcon />}
                  menuItems={[
                    <MenuItem type="text" primaryText="Jita" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({region: 10000002})}/>,
                    <MenuItem type="text" primaryText="Amarr" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({region: 10000043})}/>,
                    <MenuItem type="text" primaryText="Dodixie" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({region: 10000032})}/>,
                    <MenuItem type="text" primaryText="Hek" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({region: 10000042})}/>,
                    <MenuItem type="text" primaryText="Rens" style={{cursor: "pointer"}} onTouchTap={()=>this.setState({region: 10000030})}/>
                  ]}
                />
              </IconMenu>
            </div>
          </div>
        </div>  
        <div className={s.body}>
          <div className={s.body_container}>
            {
              Object.keys(this.props.categories).map(category => {

                let catTickers = this.props.tickers.filter(tick => tick.category === parseInt(category));

                if (this.state.search) {

                  catTickers = catTickers.filter(el => {

                    return el.name.toLowerCase().match(this.state.search) ||
                      el.components.map(com=>itemIDToName(com)).filter(item=>item.toLowerCase().match(this.state.search)).length > 0;
                  });
                }

                // Skip category if all items filtered out
                if (!catTickers.length) {
                  return;
                }

                return (
                  <div className={s.category} key={category}>
                    <div className={s.name}>
                    {this.props.categories[category]}
                    </div>
                    <div className={s.list}>
                    {
                      catTickers.map(el => {
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
        </div>        
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { tickers: store.tickers.list, region: store.settings.market.region, categories: store.tickers.categories, all_regions: store.sde.regions };
}

export default connect(mapStateToProps)(TickersList);