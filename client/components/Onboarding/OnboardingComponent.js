import React from 'react';
import { browserHistory } from 'react-router'
import s from './Onboarding.scss';
import cx from 'classnames';
import { isLoggedIn } from '../../auth';

import logo_image from '../../assets/img/eve-x-logo.png';

import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import LockIcon from 'material-ui/svg-icons/action/lock-outline';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import NotificationIcon from 'material-ui/svg-icons/social/notifications';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ReferenceIcon from 'material-ui/svg-icons/av/library-books';
import CheckIcon from 'material-ui/svg-icons/navigation/check';

export default class OnboardingComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loggedIn: isLoggedIn()
    };
  }

  setRoute(route) {

    browserHistory.push(route);
  }

  componentWillReceiveProps() {

    this.setState({
      loggedIn: isLoggedIn()
    });
  }

  render() {
    return (
      <div className={s.container}>
        <div className={cx(s.main, s.landing)}>
          <div className={s.dashboard}>
            <FlatButton 
              label="Dashboard" 
              secondary={true} 
              onClick={()=>this.setRoute(this.state.loggedIn?"/dashboard":"/login")}
            />
          </div>
          <div className={s.scroll_down}>
            <IconButton
              style={{width: "48px", height: "48px"}}
              onClick={()=>this.refs.first.scrollIntoView({behavior: "smooth"})}
            >
              <ArrowDown />
            </IconButton>
          </div>
          <div className={s.main_title}>
            <div className={s.site_title}>
            eve.exchange
            </div>
            <div className={s.site_blurb}>
            The most advanced trading application in New Eden
            </div>
            <RaisedButton
              label={this.state.loggedIn?"Go to your dashboard":"Sign in with SSO"}
              secondary={true}
              icon={<LockIcon />}
              labelColor="#000000"
              labelStyle={{color: "#000000"}}
              onClick={()=>this.setRoute(this.state.loggedIn?"/dashboard":"/login")}
            />
            <div className={s.button_blurb}>
            No registration required, instance access
            </div>
          </div>
        </div>
        <div className={s.landing} ref="first">
          <div className={s.l_container}>
            <div className={s.text}>
              <div className={s.text_container}>
                <div className={s.block}>
                  <h3 className={s.header}>
                  Real-Time Charts
                  </h3>
                  <p className={s.body}>
                  Watch charts update in 5 minute intervals without refreshing your browser, or access daily data with moving averages to track long term trends. The market browser is instantly searchable and will help you quickly find desired items. Pin charts to your personal dashboard to view as many charts at a time as your screen size will allow.
                  </p>
                </div>
                <div className={s.block}>
                  <h3 className={s.header}>
                  Price Ladder & Order Tracking
                  </h3>
                  <p className={s.body}>
                  See all active orders in a hub with surrounding citadel buy orders in the region. These orders update in real-time every 5 minutes and will show you the top 5% so you know which orders to pay attention to. Your personal orders will show up highlighted so you can quickly see if you're being undercut.
                  </p>
                </div>
                <div className={s.block}>
                  <h3 className={s.header}>
                  Multiple Regions & Trade Simulation
                  </h3>
                  <p className={s.body}>
                  Switch between hubs with the click of a button without having to refresh. The trade simulator will let you pick a trading strategy, set an undercut/overcut margin, taxes, overhead costs, and more, and instantly show your estimated profit for a trade. Copy the value into the game client to quickly make the trade.
                  </p>
                </div>
              </div>
            </div>
            <div className={s.image}>
              <img src="/assets/img/Landing2.jpg" />
            </div>
          </div>
        </div>
        <div className={cx(s.landing, s.dark)}>
          <div className={cx(s.l_container, s.reverse)}>
            <div className={s.text}>
              <div className={s.text_container}>
                <div className={s.block}>
                  <h3 className={s.header}>
                  Automated Profit Tracking
                  </h3>
                  <p className={s.body}>
                  View hourly statistics about your profitable trades, how many items you've sold, and overall best items and all time profit statistics. The profit chart will show hourly & daily aggregated statistics for profit & taxes.
                  </p>
                </div>
                <div className={s.block}>
                  <h3 className={s.header}>
                  Multiple Characters & Corporations
                  </h3>
                  <p className={s.body}>
                  With support for corporations, you can add multiple character & corporation API keys to your account to view aggregated statistics. Track unique trades, market orders, and profit for each API key you add, as well as overall statistics across all keys. Your top profile breakdown will show you which character or corporation is generating the most profit.
                  </p>
                </div>
              </div>
            </div>
            <div className={s.image}>
              <img src="/assets/img/Landing3.jpg" />
            </div>
          </div>
        </div>
        <div className={s.landing}>
          <div className={s.l_container}>
            <div className={s.text}>
              <div className={s.text_container}>
                <div className={s.block}>
                  <h3 className={s.header}>
                  Aggregate Items Into Portfolios
                  </h3>
                  <p className={s.body}>
                  Group items together to get updated prices across all of them every 5 minutes. Personalized charts will show you statistics over time and inform you which items are performing best as well as the value of your portfolio.
                  </p>
                </div>
                <div className={s.block}>
                  <h3 className={s.header}>
                  Trading & Investment
                  </h3>
                  <p className={s.body}>
                  Group together tradeable items in individual quantities to track long term investments, fittings for seeding staging systems, or to watch your most profitable items. Simulates a trade every 5 minutes for each item to give you an overall profit value using your personalized settings. The performance chart will help you watch your investment grow.
                  </p>
                </div>
                <div className={s.block}>
                  <h3 className={s.header}>
                  Industrial
                  </h3>
                  <p className={s.body}>
                  Select any manufacturable item and instantly see all of components & base raw materials needed to build all of the components. Track the value of the item, components, and raw materials over time, track cost effectiveness of building vs buying components, and use specialized charts to see hot spots in the costs of the build.
                  </p>
                </div>
              </div>
            </div>
            <div className={s.image}>
              <img src="/assets/img/Landing4.jpg" />
            </div>
          </div>
        </div>
        <div className={s.intermediate}>
          <div className={s.box}>
            <SearchIcon color="#eba91b" style={{height: "48px", width: "48px"}} />
            <div className={s.box_title}>
            Trade Forecasting
            </div>
            <div className={s.box_blurb}>
            Instantly search every item in EVE to find the ones that match your trading style. Search by a combination of minimum/maximum price, daily trading volume, and spread.
            </div>
          </div>
          <div className={cx(s.box, s.box_inverse)}>
            <NotificationIcon color="#eba91b" style={{height: "48px", width: "48px"}} />
            <div className={s.box_title}>
            Alerts
            </div>
            <div className={s.box_blurb}>
            TBD
            </div>
          </div>
          <div className={s.box}>
            <ReferenceIcon color="#eba91b" style={{height: "48px", width: "48px"}} />
            <div className={s.box_title}>
            Reference Guide
            </div>
            <div className={s.box_blurb}>
            Access complete documentation for all core features of EVE Exchange from within the platform. Find answers to common questions, guides on how to best utilize the platform, and read about usage scenarios for different types of traders.
            </div>
          </div>
        </div>
        <div className={cx(s.landing, s.dark)}>
          <div className={s.comparison}>
            <div style={{height: "auto", overflow: "auto"}}>
              <div>
                <table style={{backgroundColor: "inherit", padding: "0px 24px", width: "100%", borderCollapse: "collapse", borderSpacing: "0px", tableLayout: "fixed"}}>
                  <thead style={{borderBottom: "1px solid rgba(255, 255, 255, 0.298039)"}}>
                    <tr style={{borderBottom: "1px solid rgba(255, 255, 255, 0.298039)", color: "rgb(255, 255, 255)", height: "48px"}}>
                      <th style={{padding: "0 24px", height: "56px", textAlign: "center", whiteSpace: "nowrap", textOverflow: "ellipsis", color: "rgb(235, 169, 27)", position: "relative", backgroundColor: "inherit"}}>
                      
                      </th>
                      <th style={{padding: "0 24px", height: "56px", textAlign: "center", whiteSpace: "nowrap", textOverflow: "ellipsis", color: "#ffffff", position: "relative", backgroundColor: "inherit", fontWeight: "700", fontSize: "1.4rem"}}>
                        Basic
                      </th>
                      <th style={{padding: "0 24px", height: "56px", textAlign: "center", whiteSpace: "nowrap", textOverflow: "ellipsis", color: "rgb(235, 169, 27)", position: "relative", backgroundColor: "inherit", fontWeight: "700", fontSize: "1.4rem"}}>
                        Premium
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div style={{height: "inherit", overflowX: "hidden", overflowY: "auto"}}>
                <table style={{backgroundColor: "inherit", padding: "0px 24px", width: "100%", borderCollapse: "collapse", borderSpacing: "0px", tableLayout: "fixed"}}>
                  <tbody style={{backgroundColor: "inherit"}}>
                    <tr className={s.row}>
                      <td className={cx(s.column, s.gold, s.left)}>Cost</td>
                      <td className={s.column}>Free</td>
                      <td className={cx(s.column, s.gold)}>150M ISK/Month</td>
                    </tr>
                    <tr className={s.row}>
                      <td className={cx(s.column, s.gold, s.left)}>Real-time charts & market browser</td>
                      <td className={s.column}><CheckIcon color="#ffffff" /></td>
                      <td className={s.column}><CheckIcon color="#eba91b" /></td>
                    </tr>
                    <tr className={s.row}>
                      <td className={cx(s.column, s.gold, s.left)}>Price ladder & order tracking</td>
                      <td className={s.column}><CheckIcon color="#ffffff" /></td>
                      <td className={s.column}><CheckIcon color="#eba91b" /></td>
                    </tr>
                    <tr className={s.row}>
                      <td className={cx(s.column, s.gold, s.left)}>Customizable dashboard</td>
                      <td className={s.column}><CheckIcon color="#ffffff" /></td>
                      <td className={s.column}><CheckIcon color="#eba91b" /></td>
                    </tr>
                    <tr className={s.row}>
                      <td className={cx(s.column, s.gold, s.left)}>Complete documentation</td>
                      <td className={s.column}><CheckIcon color="#ffffff" /></td>
                      <td className={s.column}><CheckIcon color="#eba91b" /></td>
                    </tr>
                    <tr className={s.row}>
                      <td className={cx(s.column, s.gold, s.left)}>Profit tracking for</td>
                      <td className={s.column}>Up to 5 characters</td>
                      <td className={cx(s.column, s.gold)}>Up to 15 characters & corporations</td>
                    </tr>
                    <tr className={s.row}>
                      <td className={cx(s.column, s.left)}><a className={s.blue} href="https://api.eve.exchange" target="_blank">REST API Access</a></td>
                      <td className={s.column}>Most endpoints</td>
                      <td className={cx(s.column, s.gold)}>All endpoints</td>
                    </tr>
                    <tr className={s.row}>
                      <td className={cx(s.column, s.gold, s.left)}>Trade forecasting</td>
                      <td className={s.column}></td>
                      <td className={s.column}><CheckIcon color="#eba91b" /></td>
                    </tr>
                    <tr className={s.row}>
                      <td className={cx(s.column, s.gold, s.left)}>Portfolios</td>
                      <td className={s.column}></td>
                      <td className={s.column}><CheckIcon color="#eba91b" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className={s.signup_button}>
              <div className={s.cta}>
              Get started in just a few clicks, no registration required
              </div>
              <RaisedButton
                label={this.state.loggedIn?"Go to your dashboard":"Sign in with SSO"}
                secondary={true}
                icon={<LockIcon />}
                labelColor="#000000"
                labelStyle={{color: "#000000"}}
                onClick={()=>this.setRoute(this.state.loggedIn?"/dashboard":"/login")}
              />
            </div>
          </div>
        </div>
        <div className={s.footer}>
          <div className={s.logo}>
            <img src={`${logo_image.src}`} />
          </div>
          <div className={s.copyright}>
            Copyright <span>&copy;</span> 2016 EVE Exchange
          </div>
        </div>
      </div>
    );
  }
}
