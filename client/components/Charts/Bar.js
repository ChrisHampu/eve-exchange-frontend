/* eslint-disable global-require */
import React from 'react';
import s from './CandleStick.scss';

export default class Bar extends React.Component {

  static propTypes = {

    xValue: React.PropTypes.object,
    yValue: React.PropTypes.number,
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    barWidth: React.PropTypes.number,
    viewportHeight: React.PropTypes.number,
    heightOffset: React.PropTypes.number
  };

  constructor(props) {
    super(props)

    this.state = {
      mouseOver: false,
      fill: "#4090A2"
    };
  }

  update() {

    this.setState({
      cx: this.props.xScale(this.props.xValue) - 0.5 * this.props.barWidth,
      cy: this.props.viewportHeight - this.props.heightOffset + this.props.yScale(this.props.yValue),
      barHeight: this.props.heightOffset - this.props.yScale(this.props.yValue),
      barWidth: this.props.barWidth,
    });
  }

  componentWillMount() {

    this.update();
  }

  componentWillReceiveProps(nextProps) {

    this.props = nextProps;
    this.update();
  }

  render() {

    return (
      <g>
        <rect x={this.state.cx} y={this.state.cy} width={this.state.barWidth} height={this.state.barHeight} fill={this.state.fill} />
      </g>
    )
  }
}