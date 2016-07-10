import React from 'react';
import ReactDOM from 'react-dom';
import { formatNumber } from '../../utilities';

export default class Tooltip extends React.Component {

  static propTypes = {

    margin: React.PropTypes.object,
    item: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      tooltipVisible: false,
      tooltipUpdated: false,
      tooltipItem: null,
      tooltipX: 0,
      tooltipY: 0,
      tooltipPresentation: ""
    }
  }

  showTooltip(ev, item, presentation) {

    let x = 0;
    let y = 0;

    if (presentation === "spread") {
      x = ev.currentTarget.cx.baseVal.value + this.props.margin.left + ev.currentTarget.r.baseVal.value / 2;
      y = ev.currentTarget.cy.baseVal.value - 15;
    } else if (presentation === "area") {
      x = item.x + this.props.margin.left ;
      y = item.y - 35;
    } else {
      x = (ev.currentTarget.x ? ev.currentTarget.x.baseVal.value : ev.currentTarget.x1.baseVal.value) + this.props.margin.left + (ev.currentTarget.width ? ev.currentTarget.width.baseVal.value / 2 : 0);
      y = (ev.currentTarget.y ? ev.currentTarget.y.baseVal.value : ev.currentTarget.y1.baseVal.value) - (presentation === "volume" ? 15 : 35);
    }

    this.setState({
      tooltipUpdated: true,
      tooltipVisible: false,
      tooltipItem: item,
      tooltipX: x,
      tooltipY: y,
      tooltipPresentation: presentation
    });
  }

  hideTooltip() {

    this.setState({
      tooltipVisible: false,
      tooltipUpdated: false,
    })
  }

  componentDidUpdate() {

    if (this.state.tooltipUpdated === true && this.state.tooltipVisible === false) {

      this.setState({
        tooltipVisible: true,
        tooltipX: this.state.tooltipX - ReactDOM.findDOMNode(this.refs.tooltip).clientWidth / 2,
        tooltipY: this.state.tooltipY - ReactDOM.findDOMNode(this.refs.tooltip).clientHeight / 2,
      });
    }
  }

  render() {

    if (!this.state.tooltipItem) {
      return <div />;
    }

    let contents = null;

    switch(this.state.tooltipPresentation) {

      case "volume":
        contents = (
          <div>
            Volume: {formatNumber(this.state.tooltipItem.volume)}
          </div>
        );
        break;

      case "ohlc":
        contents = (
          <div>
            Open: {formatNumber(this.state.tooltipItem.open)}<br />
            High: {formatNumber(this.state.tooltipItem.high)}<br />
            Low: {formatNumber(this.state.tooltipItem.low)}<br />
            Close: {formatNumber(this.state.tooltipItem.close)}<br />
          </div>
        );
        break;

      case "area":
        contents = (
          <div>
            High: {formatNumber(this.state.tooltipItem.high)}<br />
            Low: {formatNumber(this.state.tooltipItem.low)}<br />
            Buy: {formatNumber(this.state.tooltipItem.close)}<br />
            Sell: {formatNumber(this.state.tooltipItem.sellFifthPercentile)}<br />
          </div>
        );
        break;

      case "spread":
        contents = (
          <div>
            Spread: {this.state.tooltipItem.spread}%
          </div>
        );
        break;
    }

    return (
      <div 
        ref="tooltip"
        style={{transition: "all 350ms ease-in-out", fontWeight: "bold", padding: "0.35rem", fontSize: "0.8rem", background: "rgb(38, 43, 47)", opacity: this.state.tooltipVisible ? 1 : 0, color: "rgb(235, 169, 27)", borderRadius: "4px", position: "absolute", left: this.state.tooltipX, top: this.state.tooltipY}}
        >
        {contents}
      </div>
    )
  }
};