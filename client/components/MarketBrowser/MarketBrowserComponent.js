/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import s from './MarketBrowserComponent.scss';
import cx from 'classnames';
import { browserHistory } from 'react-router'
import { getMarketGroupTree } from '../../market';

// Components
import MarketBrowserListItem from './MarketBrowserListItem';
import MarketItemViewComponent from './MarketItemViewComponent';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import OverlayStack from '../OverlayStack/OverlayStack';

// Material UI
import TextField from 'material-ui/TextField';

class MarketBrowserComponent extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      searchText: ""
    };
  }

  selectItem(item) {

    this.context.router.push(`/dashboard/browser/${item.id}`);
  }

  handleSearchText(ev) {

    this.setState({
      searchText: ev.currentTarget.value
    });
  }

  renderMarketBrowser() {

    return (
      <div className={s.market_browser}>
        <div className={s.search}>
          <TextField
            className={s.market_browser_search}
            hintText="Search"
            floatingLabelText="Search market"
            onChange={(ev)=>{this.handleSearchText(ev)}}
            fullWidth={true}
          />
        </div>
        {
          getMarketGroupTree(this.props.sde.market_groups, this.state.searchText).map((el, i) => {
            return(<MarketBrowserListItem selector={(item)=>{this.selectItem(item);}} element={el} key={i} depth={0} />);
          })
        }
      </div>
    );
  }

  render() {

    return (
      <DashboardPage title="Market Browser" className={s.root}>
        <OverlayStack popStack={()=>this.context.router.push('/dashboard/browser')}>
          {this.renderMarketBrowser()}
          {this.props.children}
        </OverlayStack>
      </DashboardPage>
    );
  }
}


const mapStateToProps = function(store) {
  return { sde: store.sde };
}

export default connect(mapStateToProps)(MarketBrowserComponent);