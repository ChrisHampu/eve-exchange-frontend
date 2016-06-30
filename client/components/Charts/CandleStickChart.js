/* eslint-disable global-require */
import React from 'react';
import { scaleTime, scaleLinear, timeHour } from '../../d3.js';
import s from './CandleStickChart.scss';
import CandleStickData from './CandleStickData';
import VolumeData from './BarChartData';
import Axis from './Axis';

const data = [
  {
    date: new Date(Date.now()),
    open: 5,
    close: 3,
    high: 8,
    low: 1,
    volume: 152
  },
  {
    date: new Date(Date.now() + 2000000),
    open: 2,
    close: 4,
    high: 5,
    low: 1,
    volume: 196
  },
  {
    date: new Date(Date.now() + 4000000),
    open: 7,
    close: 5,
    high: 11,
    low: 4,
    volume: 126
  },
  {
    date: new Date(Date.now() + 8000000),
    open: 6,
    close: 10,
    high: 11,
    low: 3,
    volume: 214
  },
  {
    date: new Date(Date.now() + 10000000),
    open: 9,
    close: 6,
    high: 11,
    low: 3,
    volume: 250
  },
  {
    date: new Date(Date.now() + 1400000),
    open: 6,
    close: 7,
    high: 11,
    low: 3,
    volume: 115
  }
];

export default class Chart extends React.Component {

  static propTypes = {

    width: React.PropTypes.number,
    height: React.PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      xScale: scaleTime(),
      yScale: scaleLinear(),
      volScale: scaleLinear(),
      ohlcHeight: Math.floor(this.props.height*0.70),
      ohlcOffset: Math.floor(this.props.height*0.75),
      volHeight: Math.floor(this.props.height*0.25),
      margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      },
      height: 350,
      width: 600
    }
  }

  updateScales() {

    this.state.height = this.props.height - this.state.margin.top - this.state.margin.bottom;
    this.state.width = this.props.width - this.state.margin.left - this.state.margin.right;

    this.state.ohlcHeight = Math.floor(this.state.height*0.70);
    this.state.ohlcOffset = Math.floor(this.state.height*0.75);
    this.state.volHeight = Math.floor(this.state.height*0.25);

    const minDate = new Date(Math.min(...data.map((el) => { return el.date; })));
    const maxDate = new Date(Math.max(...data.map((el) => { return el.date; })));

    //this.state.xScale = scaleTime();
    //this.state.yScale = scaleLinear();
    //this.state.volScale = scaleLinear();

    this.state.xScale.domain([
      new Date(minDate.getTime()),
      new Date(maxDate.getTime())
    ]);

    this.state.yScale.domain([Math.min(...data.map((el) => { return el.low})), Math.max(...data.map((el) => { return el.high}))]);
    this.state.volScale.domain([Math.floor(Math.min(...data.map((el) => { return el.volume}))*0.95), Math.ceil(Math.max(...data.map((el) => { return el.volume}))*1.05)]);

    this.state.xScale.range([0, this.state.width]);
    this.state.yScale.range([this.state.ohlcHeight, 0]);
    this.state.volScale.range([this.state.volHeight, 0]);

    this.state.xScale.clamp(true);
    this.state.yScale.clamp(true);
    this.state.volScale.clamp(true);

    this.state.xScale.nice(timeHour);
    this.state.yScale.nice([5]);
    this.state.volScale.nice([25]);

    this.setState({
      xScale: this.state.xScale,
      yScale: this.state.yScale,
      volScale: this.state.volScale,
      ohlcHeight: this.state.ohlcHeight,
      ohlcOffset: this.state.ohlcOffset,
      volHeight: this.state.volHeight,
      width: this.state.width,
      height: this.state.height
    });
  }

  componentWillMount() {

    this.updateScales();
  }

  componentWillReceiveProps(nextProps) {

    console.log(nextProps);
    this.props = nextProps;
    this.updateScales();
  }

  render() {

    return (
      <svg width={this.state.width+this.state.margin.left+this.state.margin.right} height={this.state.height+this.state.margin.top+this.state.margin.bottom}>
        <g style={{transform: `translate(${this.state.margin.left}px, ${this.state.margin.top}px)`}}>
          <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${this.state.height}px)`}} />
          <Axis anchor="left" scale={this.state.yScale} ticks={10} />
          <Axis anchor="left" scale={this.state.volScale} ticks={5} style={{transform: `translateY(${this.state.ohlcOffset}px)`}} />

          <CandleStickData data={data} viewportWidth={this.state.width} xScale={this.state.xScale} yScale={this.state.yScale} />
          <VolumeData data={data} viewportWidth={this.state.width} viewportHeight={this.state.height} xScale={this.state.xScale} yScale={this.state.volScale} />
        </g>
      </svg>
    );
  }
}
