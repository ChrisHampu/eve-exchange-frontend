/* eslint-disable global-require */
import React from 'react';
import CandleStick from './CandleStick';
import s from './CandleStickData.scss';

export default class CandleStickData extends React.Component {

  static propTypes = {

    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    viewportWidth: React.PropTypes.number
  };

  constructor(props) {
    super(props);
  }

  render() {

    var xRange = this.props.xScale.range();
    var width = Math.abs(xRange[0] - xRange[1]);
    var candleWidth = (this.props.viewportWidth / (this.props.data.length + 2)) * 0.5;

    if (width < 100)
      return (<g />);

    return (
      <g>
        {
          this.props.data.map((el, i) => {
            return (
              <CandleStick mouseOver={this.props.mouseOver} mouseOut={this.props.mouseOut} key={i} dataElem={el} xScale={this.props.xScale} yScale={this.props.yScale} candleWidth={candleWidth} />
            )
          })
        }
      </g>
    );
  }
}