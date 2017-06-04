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
    timeScale: React.PropTypes.func,
    leftDataScale: React.PropTypes.func,
    timeAccessor: React.PropTypes.func,
    leftDataAccessor: React.PropTypes.func,
    height: React.PropTypes.number,
    focusIndex: React.PropTypes.number,
    focusPosition: React.PropTypes.number
  };

  render() {

    if (!this.props.height) {
      return <g />;
    }

    if (!this.props.data.length) {
      return <g />;
    }

    const _area = area()
      .x(d => this.props.timeScale(this.props.timeAccessor(d)))
      .y0(d => this.props.height)
      .y1(d => this.props.leftDataScale(this.props.leftDataAccessor(d)))
      .curve(curveCatmullRom.alpha(0.5));

    const path = _area(this.props.data);

    const _line = line()
      .x(d => this.props.timeScale(this.props.timeAccessor(d)))
      .y(d => this.props.leftDataScale(this.props.leftDataAccessor(d)))
      .curve(curveCatmullRom.alpha(0.5));

    const linepath = _line(this.props.data);

    return (
      <g>
       <defs>
          <linearGradient id="linear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(89, 200, 226, 0.3)"/>
            <stop offset="40%" stopColor="rgba(89, 200, 226, 0.3)"/>
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
          this.props.focusIndex !== null && this.props.focusIndex >= 0 && this.props.focusIndex < this.props.fullData.length ?
            <Circle
              fill="rgb(89, 200, 226)"
              data={this.props.fullData[this.props.focusIndex]}
              cx={this.props.focusPosition}
              cy={this.props.leftDataScale(this.props.leftDataAccessor(this.props.fullData[this.props.focusIndex]))}
              style={{"stroke": "#fff", "strokeWidth": 2}}
              r={6}
            /> : null
        }
      </g>
    );
  }
}
