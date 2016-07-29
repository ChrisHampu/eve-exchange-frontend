/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import store from '../../store';
import { scaleTime, scaleLinear, timeHour, timeMinute } from '../../d3.js';
import s from './CandleStickChart.scss';
import CandleStickData from './CandleStickData';
import VolumeData from './BarChartData';
import Axis from './Axis';
import Indicator from './Indicator';
import Area from './Area';
import Tooltip from './Tooltip';
import { subscribeItem, unsubscribeItem } from '../../market';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

class Chart extends React.Component {

  static propTypes = {

    width: React.PropTypes.number,
    height: React.PropTypes.number,
    item: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      xScale: scaleTime(),
      yScale: scaleLinear(),
      volScale: scaleLinear(),
      percentScale: scaleLinear(),
      ohlcHeight: Math.floor(this.props.height*0.70),
      ohlcOffset: Math.floor(this.props.height*0.75),
      volHeight: Math.floor(this.props.height*0.25),
      margin: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 50
      },
      height: 0,
      width: 0,
      frequency: "minutes"
    }
  }

  updateScales() {

    let timePadding = 300000;

    switch( this.state.frequency) {

      case "hours":
      break;
      case "days":
      break;
      case "months":
      break;
    }

    const data = this.getAggregateData();

    this.state.height = ReactDOM.findDOMNode(this.refs.chart_anchor).clientHeight - this.state.margin.top - this.state.margin.bottom - 10;
    this.state.width = ReactDOM.findDOMNode(this.refs.chart_anchor).clientWidth - this.state.margin.left - this.state.margin.right - 10;

    this.state.ohlcHeight = Math.floor(this.state.height*0.70);
    this.state.ohlcOffset = Math.floor(this.state.height*0.75);
    this.state.volHeight = Math.floor(this.state.height*0.25);

    const minDate = new Date(Math.min(...data.map((el) => { return el.time; })));
    const maxDate = new Date(Math.max(...data.map((el) => { return el.time; })));

    minDate.setTime(minDate.getTime() - timePadding);
    maxDate.setTime(maxDate.getTime() + timePadding);

    this.state.xScale.domain([
      new Date(minDate.getTime()),
      new Date(maxDate.getTime())
    ]);

    //this.state.yScale.domain([Math.min(...data.map((el) => { return el.open})), Math.max(...data.map((el) => { return el.close}))]);
    this.state.yScale.domain([Math.min(...data.map((el) => { return el.buyFifthPercentile})), Math.max(...data.map((el) => { return el.buyFifthPercentile}))]);

    this.state.volScale.domain([Math.floor(Math.min(...data.map((el) => { return el.buyVolume}))*0.95), Math.ceil(Math.max(...data.map((el) => { return el.buyVolume}))*1.05)]);

    this.state.percentScale.domain([0, 1]);

    this.state.xScale.range([0, this.state.width]);
    this.state.yScale.range([this.state.ohlcHeight, 0]);
    this.state.volScale.range([this.state.volHeight, 0]);
    this.state.percentScale.range([this.state.ohlcHeight, 0]);

    this.state.xScale.clamp(true);
    this.state.yScale.clamp(true);
    this.state.volScale.clamp(true);
    this.state.percentScale.clamp(true);

    this.state.xScale.nice(timeMinute);
    this.state.yScale.nice([5]);
    //this.state.volScale.nice([25]);;
    //this.state.percentScale.nice([5]);

    this.setState({
      xScale: this.state.xScale,
      yScale: this.state.yScale,
      volScale: this.state.volScale,
      percentScale: this.state.percentScale,
      ohlcHeight: this.state.ohlcHeight,
      ohlcOffset: this.state.ohlcOffset,
      volHeight: this.state.volHeight,
      width: this.state.width,
      height: this.state.height
    });
  }

  componentDidMount() {

    this.updateScales();
  }

  componentWillReceiveProps(nextProps) {

    this.props = nextProps;
    this.updateScales();
  }

  getAggregateData() {

    if (typeof this.props.market.region[0] !== 'undefined' && typeof this.props.market.region[0].item[this.props.item.id] !== 'undefined') {
      return this.props.market.region[0].item[this.props.item.id].aggregates;
    }

    return [];
  }

  handleMouseOver(ev, item, presentation) {

    this.refs.tooltip.showTooltip(ev, item, presentation);
  }

  handleMouseOut(ev) {

    this.refs.tooltip.hideTooltip();
  }

  render() {

    return (
      <div style={{ ...this.props.style, display: "flex", flexDirection: "column", position: "relative", height: "100%" }}>
        <RadioButtonGroup name="timespan" defaultSelected="minutes" className={s.radios}>
          <RadioButton
            value="minutes"
            label="5 Minutes"
            labelStyle={{width: "auto"}}
          />
          <RadioButton
            value="hours"
            label="1 Hour"
            labelStyle={{width: "auto"}}
          />
          <RadioButton
            value="days"
            label="1 Day"
            labelStyle={{width: "auto"}}
          />
          <RadioButton
            value="months"
            label="1 Month"
            labelStyle={{width: "auto"}}
          />
        </RadioButtonGroup>
        <div ref="chart_anchor" className={s.chart}>
          <svg width={this.state.width+this.state.margin.left+this.state.margin.right} height={this.state.height+this.state.margin.top+this.state.margin.bottom}>
            <g style={{transform: `translate(${this.state.margin.left}px, ${this.state.margin.top}px)`}}>
              <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${this.state.height}px)`}} />
              <Axis anchor="left" scale={this.state.yScale} ticks={5} formatISK={true} />
              <Axis anchor="left" scale={this.state.volScale} ticks={5} style={{transform: `translateY(${this.state.ohlcOffset}px)`}} formatISK={true} />
              <Axis anchor="right" scale={this.state.percentScale} ticks={10} style={{transform: `translateX(${this.state.width}px)`}} format="%" />

              <Area mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} viewportHeight={this.state.ohlcHeight} data={this.getAggregateData()} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={(el) => { return el.time;}} yAccessor={(el) => { return el.buyFifthPercentile;}} />
              <VolumeData mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} data={this.getAggregateData()} viewportWidth={this.state.width} viewportHeight={this.state.height} xScale={this.state.xScale} yScale={this.state.volScale} />

              <Indicator mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} data={this.getAggregateData()} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={(el) => { return el.time;}} yAccessor={(el) => { return el.spread/100;}} />
            </g>
          </svg>
          <Tooltip margin={this.state.margin} ref="tooltip" />
        </div>
      </div>
    );
  }
}

//<CandleStickData mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} data={this.getAggregateData()} viewportWidth={this.state.width} xScale={this.state.xScale} yScale={this.state.yScale} />

const mapStateToProps = function(store) {
  return { market: store.market };
}

export default connect(mapStateToProps)(Chart);