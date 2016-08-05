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
    yAccessor: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      circleFill: "#eba91b"
    };
  }

  render() {

    const _line = line()
      .x(d => this.props.xScale(this.props.xAccessor(d)))
      .y(d => this.props.yScale(this.props.yAccessor(d)))
      .curve(curveCatmullRom.alpha(0.5));

    const linepath = _line(this.props.data);

    return (
      <g>
        <path
          d={linepath}
          fill="none"
          stroke="#59c8e2"
          strokeWidth={2}
        />
      {
        this.props.data.map((el, i) => {
          return (
            <Circle data={el} key={i} cx={this.props.xScale(this.props.xAccessor(el))} cy={this.props.yScale(this.props.yAccessor(el))} r={5} />
          );
        })
      }
      </g>
    )
  }
}