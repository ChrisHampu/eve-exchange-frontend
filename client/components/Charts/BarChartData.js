/* eslint-disable global-require */
import React from 'react';
import Bar from './Bar';

export default class BarChartData extends React.Component {

  static propTypes = {

    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    viewportWidth: React.PropTypes.number,
    viewportHeight: React.PropTypes.number,
    heightOffset: React.PropTypes.number
  };

  constructor(props) {
    super(props);
  }

  render() {

    var xRange = this.props.xScale.range();
    var width = Math.abs(xRange[0] - xRange[1]);
    var barWidth = (this.props.viewportWidth / (this.props.data.length + 2)) * 0.35;

    if (width < 100)
      return (<g />);

    return (
      <g>
        {
          this.props.data.map((el, i) => {

            return (
              <Bar heightOffset={this.props.heightOffset} mouseOver={this.props.mouseOver} mouseOut={this.props.mouseOut} key={i} xValue={el.time} yValue={el.tradeVolume !== undefined ? el.tradeVolume : 0} xScale={this.props.xScale} yScale={this.props.yScale} barWidth={barWidth} viewportHeight={this.props.viewportHeight}/>
            )
          })
        }
      </g>
    );
  }
}