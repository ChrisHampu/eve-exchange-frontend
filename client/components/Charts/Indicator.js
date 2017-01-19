/* eslint-disable global-require */
import React from 'react';
import Circle from './Circle';
import { curveCardinal, line } from '../../vendor/d3';

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
    thickLine: React.PropTypes.bool,
    focusedIndex: React.PropTypes.number
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
      .curve(curveCardinal.tension(0.8));

    const linepath = _line(this.props.data);

    const lineColour = this.props.lineColour || "#59c8e2";
    const circleColour = this.props.circleColour || "#eba91b";

    const stroke = this.props.thickLine ? 3 : 2;

    const focusedEl = this.props.data[this.props.focusedIndex >= 0 ? this.props.focusedIndex : 0];

    return (
      <g>
        <path
          d={linepath}
          fill="none"
          stroke={lineColour}
          strokeWidth={stroke}
        />
      {
        this.props.focusedIndex >= 0 ?
          <Circle 
            style={{"stroke": "#fff", "strokeWidth": 2}} 
            fill={circleColour} 
            data={focusedEl} 
            cx={this.props.xScale(this.props.xAccessor(focusedEl))} 
            cy={this.props.yScale(this.props.yAccessor(focusedEl))+(this.props.heightOffset||0)}
            r={6}
          /> : null
      }
      </g>
    )
  }
}