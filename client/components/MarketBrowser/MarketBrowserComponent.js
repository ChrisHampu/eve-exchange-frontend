/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import s from './MarketBrowserComponent.scss';
import cx from 'classnames';
import { browserHistory } from 'react-router'
import { getMarketGroupTree } from '../../market';

// Components
import MarketItemViewComponent from './MarketItemViewComponent';
import DashboardPage from '../DashboardPage/DashboardPageComponent';

// Material UI
import TextField from 'material-ui/TextField';

// Icons
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowRightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

class MarketBrowserListItem extends React.Component {

  static propTypes = {
    element: React.PropTypes.object,
    depth: React.PropTypes.number,
    selector: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      childrenVisible: false
    };
  }

  renderItems() {

    if (this.props.element.items === undefined) {
      return;
    }

    if (this.state.childrenVisible === false) {
      return;
    }

    return (
      this.props.element.items.map((el, i) => {
        return (<div onClick={(ev)=>{this.handleClickItem(ev, el);}} style={{paddingLeft: `${this.props.depth}.5rem`}} key={i} className={s.market_browser_item}>{el.name}</div>);
      })
    );
  }

  renderList() {

    if (this.state.childrenVisible === false) {
      return;
    }

    return (
      this.props.element.childGroups.map((el, i) => {
        return (<MarketBrowserListItem selector={this.props.selector} depth={this.props.depth+1} element={el} key={i} />);
      })
    );
  }

  handleClickBranch(ev) {

    ev.stopPropagation();
    ev.nativeEvent.stopImmediatePropagation();

    this.setState({
      childrenVisible: !this.state.childrenVisible
    });
  }

  handleClickItem(ev, item) {

    ev.stopPropagation();
    ev.nativeEvent.stopImmediatePropagation();

    this.props.selector(item);
  }

  render() {

    return (
      <div  className={s.market_browser_row} onClick={(ev)=>{this.handleClickBranch(ev);}}>
        <div style={{paddingLeft: `${this.props.depth}rem`}} className={s.market_browser_row_meta}  >
          { this.state.childrenVisible ? <ArrowDownIcon /> : <ArrowRightIcon /> }
          <div className={s.market_browser_row_name}>
            {this.props.element.name}
          </div>
        </div>
        {
          this.renderList()
        }
        {
          this.renderItems()
        }
      </div>
    )
  }
}

export default class MarketBrowserComponent extends React.Component {

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
          getMarketGroupTree(this.state.searchText).map((el, i) => {
            return(<MarketBrowserListItem selector={(item)=>{this.selectItem(item);}} element={el} key={i} depth={0} />);
          })
        }
      </div>
    );
  }

  render() {

    return (
      <DashboardPage title="Market Browser" className={s.root}>
        <div className={s.market_browser_container}>
          <div className={cx(s.tab_stack, s.root)}>
            {this.renderMarketBrowser()}
            <div onClick={()=>this.context.router.push('/dashboard/browser')} className={cx(s.tab_stack_overlay, { [s.open]: this.props.children !== null} )}>
            </div>
          </div>
          <div className={cx(s.tab_stack, s.fadeout, { [s.open]: this.props.children !== null, [s.hidden]: this.props.children === null })}>
            {this.props.children}
          </div>
        </div>
      </DashboardPage>
    );
  }
}