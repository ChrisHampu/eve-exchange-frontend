/* eslint-disable global-require */
import React from 'react';

export default class Bars extends React.Component {

  static propTypes = {

    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    leftDataScale: React.PropTypes.func,
    timeAccessor: React.PropTypes.func,
    timeScale: React.PropTypes.func,
    leftDataAccessor: React.PropTypes.func,
    margin: React.PropTypes.object
  };

  render() {

    const xRange = this.props.timeScale.range();
    const width = Math.abs(xRange[0] - xRange[1]);
    const barWidth = (this.props.width / (this.props.data.length + 2)) * 0.35;

    if (width < 100 || !this.props.data.length) {
      return (<g />);
    }

    return (
      <g>
        {
          this.props.data.map((el, i) =>
            <rect
              key={i}
              x={this.props.timeScale(this.props.timeAccessor(el)) - 0.5 * barWidth}
              y={this.props.height - this.props.leftDataScale(this.props.leftDataAccessor(el))}
              width={barWidth}
              height={this.props.leftDataScale(this.props.leftDataAccessor(el))}
              fill='#4090A2'
            />
          )
        }
      </g>
    );
  }
}
