/* eslint-disable global-require */
import React from 'react';
import s from './CandleStick.scss';

export default class CandleStick extends React.Component {

  static propTypes = {

    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    dataElem: React.PropTypes.object,
    candleWidth: React.PropTypes.number
  };

  constructor(props) {
    super(props)

    this.state = {
      fill: this.props.dataElem.open <= this.props.dataElem.close ? "#2E7D32" : "#C62828"
    };
  }

  update() {

    const el = this.props.dataElem;

    this.setState({
      cx: this.props.xScale(el.time) - 0.5 * this.props.candleWidth,
      cy: this.props.yScale(Math.max(el.open, el.close)),
      candleHeight: Math.max(3, Math.abs(this.props.yScale(el.open) - this.props.yScale(el.close))),
      candleWidth: this.props.candleWidth,

      wx1: this.props.xScale(el.time),
      wy1: this.props.yScale(el.high),
      wx2: this.props.xScale(el.time),
      wy2: this.props.yScale(el.low)
    });
  }

  componentWillMount() {

    this.update();
  }

  componentWillReceiveProps(nextProps) {

    this.props = nextProps;
    this.update();
  }

  handleMouseOver(ev) {

    this.props.mouseOver(ev,this.props.dataElem,"ohlc");

    this.setState({
      fill: this.props.dataElem.open <= this.props.dataElem.close ? "rgb(71, 152, 75)" : "rgb(222, 75, 75)"
    });
  }

  handleMouseOut() {

    this.props.mouseOut();

    this.setState({
      fill: this.props.dataElem.open <= this.props.dataElem.close ? "#2E7D32" : "#C62828"
    });
  }

  render() {

    return (
      <g>
        <line x1={this.state.wx1} y1={this.state.wy1} x2={this.state.wx2} y2={this.state.wy2} strokeWidth={2} stroke={this.state.fill} />
        <rect  x={this.state.cx} y={this.state.cy} width={this.state.candleWidth} height={this.state.candleHeight} fill={this.state.fill} />
      </g>
    )
  }
}