/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import s from './MarketBrowserComponent.scss';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import CandleStickChart from '../Charts/CandleStickChart';
import cx from 'classnames';

// Market group data
import marketGroups from '../../sde/market_groups';

// Material UI
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

// Icons
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowRightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

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
        <div ref="market_container" className={s.market_item_chart_container}>
          <CandleStickChart width={this.state.containerWidth > 0 ? this.state.containerWidth-72 : 0} height={this.state.containerHeight}/>
        </div>
      </div>
    )
  }
}

export default class MarketBrowserComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedItem: null
    };
  }

  selectItem(item) {

    this.setState({
      selectedItem: item
    });
  }

  renderMarketBrowser() {

    return (
      <div className={s.market_browser}>
        <TextField
          className={s.market_browser_search}
          hintText="Search"
          floatingLabelText="Search market"
        />
        { 
          marketGroups.map((el, i) => {
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