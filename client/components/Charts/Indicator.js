/* eslint-disable global-require */
import React from 'react';
import Circle from './Circle';
import { curveCatmullRom, line } from '../../d3.js';

export default class Indicator extends React.Component {

  static propTypes = {

    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    data: React.PropTypes.array,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    heightOffset: React.PropTypes.number,
    showCircles: React.PropTypes.bool,
    lineColour: React.PropTypes.string,
    circleColour: React.PropTypes.string,
    thickLine: React.PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      circleFill: "#eba91b"
    };
  }

  render() {

    const offset = this.props.heightOffset || 0;

    const _line = line()
      .x(d => this.props.xScale(this.props.xAccessor(d)))
      .y(d => this.props.yScale(this.props.yAccessor(d)) + offset)
      .curve(curveCatmullRom.alpha(0.5));

    const linepath = _line(this.props.data);

    const lineColour = this.props.lineColour || "#59c8e2";
    const circleColour = this.props.circleColour || "#eba91b";

    const stroke = this.props.thickLine ? 3 : 2;

    return (
      <g>
        <path
          d={linepath}
          fill="none"
          stroke={lineColour}
          strokeWidth={stroke}
        />
      {
        this.props.showCircles && this.props.data.map((el, i) => {
          return (
            <Circle fill={circleColour} data={el} key={i} cx={this.props.xScale(this.props.xAccessor(el))} cy={this.props.yScale(this.props.yAccessor(el))+(this.props.heightOffset||0)} r={5} />
          );
        })
      }
      </g>
    )
  }
}