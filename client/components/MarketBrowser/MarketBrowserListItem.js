import React from 'react';
import ReactDOM from 'react-dom';
import s from './MarketBrowserListItem.scss';
import cx from 'classnames';

// Icons
import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowRightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

export default class MarketBrowserListItem extends React.Component {

  static propTypes = {
    element: React.PropTypes.object,
    depth: React.PropTypes.number,
    selector: React.PropTypes.func,
    open: React.PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      childrenVisible: props.open || false
    };
  }

  componentWillReceiveProps(nextProps) {
    
    this.setState({
      childrenVisible: this.state.childrenVisible || nextProps.open || false
    });
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
        return (<MarketBrowserListItem selector={this.props.selector} depth={this.props.depth+1} element={el} key={i} open={this.props.open} />);
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