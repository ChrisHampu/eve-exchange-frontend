/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import s from './MarketBrowserComponent.scss';
import cx from 'classnames';
import fuzzy from 'fuzzy';

// Components
import MarketItemViewComponent from './MarketItemViewComponent';
import DashboardPage from '../DashboardPage/DashboardPageComponent';

// Market group data
import marketGroups from '../../sde/market_groups';

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

  handleClick(ev) {

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
      <div  className={s.market_browser_row} onClick={(ev)=>{this.handleClick(ev);}}>
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

  constructor(props) {
    super(props);

    this.state = {
      selectedItem: null,
      searchText: ""
    };
  }

  selectItem(item) {

    this.setState({
      selectedItem: item
    });
  }

  handleSearchText(ev) {

    this.setState({
      searchText: ev.currentTarget.value
    })
  }

  _getGroups(group, accumulator) {

    if (group.items && group.items.length) {

      const items = fuzzy.filter(this.state.searchText, group.items, { extract: item => item.name });

      if (items.length) {

        const _items = items.map((el) => {
          return group.items[el.index]
        });

        accumulator.push({...group, items: _items});
      }

      return;
    }

    const children = [];

    for (const child of group.childGroups) {

      this._getGroups(child, children);
    }

    if (children.length) {
      accumulator.push({...group, childGroups: children});
    }
  }

  getGroups() {

    if (this.state.searchText.length === 0) {
      return marketGroups;
    }

    const groups = [];

    for (const group of marketGroups) {

      const add = [];

      this._getGroups(group, add);

      if (add.length) {
        groups.push(...add);
      }
    }
    
    return groups;
  }

  renderMarketBrowser() {

    return (
      <div className={s.market_browser}>
        <TextField
          className={s.market_browser_search}
          hintText="Search"
          floatingLabelText="Search market"
          onChange={(ev)=>{this.handleSearchText(ev)}}
        />
        { 
          this.getGroups().map((el, i) => {
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
          {this.renderMarketBrowser()}
          {this.state.selectedItem!==null ? <MarketItemViewComponent selector={(item)=>{this.selectItem(item);}} item={this.state.selectedItem}/> : false}
        </div>
      </DashboardPage>
    );
  }
}