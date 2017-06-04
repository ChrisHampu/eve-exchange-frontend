/* eslint-disable global-require */
import React from 'react';
import Circle from './Circle';
import { curveCardinal, line } from '../../vendor/d3';

export default class Indicator extends React.Component {

  static propTypes = {
    showCircles: React.PropTypes.bool,
    lineColour: React.PropTypes.string,
    circleColour: React.PropTypes.string,
    thickLine: React.PropTypes.bool,
    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    fullData: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    timeScale: React.PropTypes.func,
    leftDataScale: React.PropTypes.func,
    timeAccessor: React.PropTypes.func,
    leftDataAccessor: React.PropTypes.func,
    rightDataScale: React.PropTypes.func,
    rightDataAccessor: React.PropTypes.func,
    height: React.PropTypes.number,
    focusIndex: React.PropTypes.number,
    focusPosition: React.PropTypes.number,
    right: React.PropTypes.bool
  };

  static defaultProps = {
    right: false
  };

  constructor(props) {
    super(props);

    this.state = {
      circleFill: '#eba91b'
    };
  }

  render() {

    if (!this.props.data.length) {
      return <g />;
    }

    const _line = line()
      .x(d => this.props.timeScale(this.props.timeAccessor(d)))
      .y(this.props.right ? d => this.props.rightDataScale(this.props.rightDataAccessor(d)) : d => this.props.leftDataScale(this.props.leftDataAccessor(d)))
      .curve(curveCardinal.tension(0.8));

    const linepath = _line(this.props.data);

    const lineColour = this.props.lineColour || '#59c8e2';
    const circleColour = this.props.circleColour || '#eba91b';

    const stroke = this.props.thickLine ? 3 : 2;

    return (
      <g>
        <path
          d={linepath}
          fill='none'
          stroke={lineColour}
          strokeWidth={stroke}
        />
      {
        this.props.focusIndex !== null && this.props.focusIndex >= 0 && this.props.focusIndex < this.props.fullData.length ?
          <Circle
            style={{ stroke: '#fff', strokeWidth: 2 }}
            fill={circleColour}
            data={this.props.fullData[this.props.focusIndex]}
            cx={this.props.focusPosition}
            cy={this.props.right ? this.props.rightDataScale(this.props.rightDataAccessor(this.props.fullData[this.props.focusIndex])) : this.props.leftDataScale(this.props.leftDataAccessor(this.props.fullData[this.props.focusIndex]))}
            r={6}
          /> : null
      }
      </g>
    );
  }
}
