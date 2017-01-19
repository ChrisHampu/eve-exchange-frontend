/* eslint-disable global-require */
import React from 'react';
import { area, curveCatmullRom, line } from '../../vendor/d3';
import Circle from './Circle';

export default class Area extends React.Component {

  static propTypes = {

    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    viewportHeight: React.PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      closestPoint: null
    };
  }

  render() {

    if (!this.props.viewportHeight) {
      return <g />;
    }

    const _area = area()
      .x(d => this.props.xScale(this.props.xAccessor(d)))
      .y0(d => this.props.viewportHeight)
      .y1(d => this.props.yScale(this.props.yAccessor(d)))
      .curve(curveCatmullRom.alpha(0.5));

    const path = _area(this.props.data);

    const _line = line()
      .x(d => this.props.xScale(this.props.xAccessor(d)))
      .y(d => this.props.yScale(this.props.yAccessor(d)))
      .curve(curveCatmullRom.alpha(0.5));

    const linepath = _line(this.props.data);

    return (
      <g>
       <defs>
          <linearGradient id="linear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="rgba(89, 200, 226, 0.3)"/>
            <stop offset="40%"   stopColor="rgba(89, 200, 226, 0.3)"/>
            <stop offset="100%" stopColor="rgba(89, 200, 226, 0.1)"/>
          </linearGradient>
        </defs>
        <path
          d={path}
          fill="rgba(89, 200, 226, 0.1)"
        />
        <path
          d={linepath}
          fill="none"
          stroke="rgb(89, 200, 226)"
          strokeWidth={3}
        />
        {
          this.props.focusedIndex >= 0 ?
            <Circle
              fill="rgb(89, 200, 226)"
              data={this.props.data[this.props.focusedIndex]}
              cx={this.props.xScale(this.props.xAccessor(this.props.data[this.props.focusedIndex]))}
              cy={this.props.yScale(this.props.yAccessor(this.props.data[this.props.focusedIndex]))}
              style={{"stroke": "#fff", "strokeWidth": 2}}
              r={6}
            /> : null
        }
      </g>
    );
  }
}