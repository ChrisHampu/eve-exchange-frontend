/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import s from './MarketBrowserComponent.scss';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import CandleStickChart from '../Charts/CandleStickChart';
import cx from 'classnames';
import horizon from '../../horizon';
import fuzzy from 'fuzzy';
import { subscribeItem, unsubscribeItem } from '../../market';

// Market group data
import marketGroups from '../../sde/market_groups';

// Material UI
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Tabs, Tab} from 'material-ui/Tabs';

// Icons
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowRightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

//horizon('orders').watch().subscribe(msg => console.log(msg));

//horizon('orders').store({region: 1, buy: 2, sell: 3});

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

class MarketItemViewComponent extends React.Component {

  static propTypes = {

    item: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      containerWidth: 0,
      containerHeight: 0
    };
  }

  componentDidMount() {

    this.setState({
      containerWidth: ReactDOM.findDOMNode(this.refs.market_container).clientWidth,
      containerHeight: ReactDOM.findDOMNode(this.refs.market_container).clientHeight
    });
  }

  render() {
    return (
      <div className={s.market_item_view}>
        <div className={s.market_item_view_header}>
          <div className={s.market_item_view_header_name}>
            {this.props.item.name}
          </div>
          <div className={s.market_item_view_header_menus}>
            <IconButton onClick={()=>{this.props.selector(null);}} tooltip="Close">
              <CloseIcon />
            </IconButton>
            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem type="text" primaryText="Refresh" />
              <MenuItem type="text" primaryText="Send feedback" />
              <MenuItem type="text" primaryText="Settings" />
              <MenuItem type="text" primaryText="Help" />
              <MenuItem type="text" primaryText="Sign out" />
            </IconMenu>
          </div>
        </div>
        <Tabs style={{height: "100%"}} contentContainerClassName={s.tab_content}>
          <Tab label="Chart" style={{backgroundColor: "rgb(38, 43, 47)"}}>
            <div ref="market_container" className={s.market_item_chart_container}>
              <CandleStickChart width={this.state.containerWidth > 0 ? this.state.containerWidth-72 : 0} height={this.state.containerHeight}/>
            </div>
          </Tab>
          <Tab label="Orders" style={{backgroundColor: "rgb(38, 43, 47)"}}>
            <div className={s.market_item_order_container}>
              <Table selectable={false} wrapperStyle={{paddingBottom: "20px"}} style={{backgroundColor: "rgb(38, 43, 47)"}}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow style={{height: "30px"}}>
                    <TableHeaderColumn colSpan="3" style={{height: "30px", textAlign: 'center'}}>
                      Active Sell Orders
                    </TableHeaderColumn>
                  </TableRow>
                  <TableRow selectable={false} style={{height: "30px"}}>
                    <TableHeaderColumn style={{height: "30px"}}>Location</TableHeaderColumn>
                    <TableHeaderColumn style={{height: "30px"}}>Price</TableHeaderColumn>
                    <TableHeaderColumn style={{height: "30px"}}>Volume Remaining</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody stripedRows={true} displayRowCheckbox={false}>
                  <TableRow selectable={false} style={{height: "30px"}}>
                    <TableRowColumn style={{height: "30px"}}>Jita</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1,000,000,000 ISK</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1000</TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false} style={{height: "30px"}}>
                    <TableRowColumn style={{height: "30px"}}>Jita</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1,000,000,000 ISK</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1000</TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false} style={{height: "30px"}}>
                    <TableRowColumn style={{height: "30px"}}>Jita</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1,000,000,000 ISK</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1000</TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false} style={{height: "30px"}}>
                    <TableRowColumn style={{height: "30px"}}>Jita</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1,000,000,000 ISK</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1000</TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
              <Table selectable={false} wrapperStyle={{paddingBottom: "60px"}} style={{backgroundColor: "rgb(38, 43, 47)"}}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow style={{height: "30px"}}>
                    <TableHeaderColumn colSpan="3" style={{height: "30px", textAlign: 'center'}}>
                      Active Buy Orders
                    </TableHeaderColumn>
                  </TableRow>
                  <TableRow selectable={false} style={{height: "30px"}}>
                    <TableHeaderColumn style={{height: "30px"}}>Location</TableHeaderColumn>
                    <TableHeaderColumn style={{height: "30px"}}>Price</TableHeaderColumn>
                    <TableHeaderColumn style={{height: "30px"}}>Volume Remaining</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody stripedRows={true} displayRowCheckbox={false}>
                  <TableRow selectable={false} style={{height: "30px"}}>
                    <TableRowColumn style={{height: "30px"}}>Jita</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1,000,000,000 ISK</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1000</TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false} style={{height: "30px"}}>
                    <TableRowColumn style={{height: "30px"}}>Jita</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1,000,000,000 ISK</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1000</TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false} style={{height: "30px"}}>
                    <TableRowColumn style={{height: "30px"}}>Jita</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1,000,000,000 ISK</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1000</TableRowColumn>
                  </TableRow>
                  <TableRow selectable={false} style={{height: "30px"}}>
                    <TableRowColumn style={{height: "30px"}}>Jita</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1,000,000,000 ISK</TableRowColumn>
                    <TableRowColumn style={{height: "30px"}}>1000</TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Tab>
        </Tabs>
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

    if (this.state.selectedItem !== null) {

      unsubscribeItem(this.state.selectedItem.id, 0);
    }

    subscribeItem(item.id, 0);

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