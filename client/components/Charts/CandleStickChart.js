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
      height: 350,
      width: 600,
      tooltipVisible: false,
      tooltipUpdated: false,
      tooltipItem: null,
      tooltipX: 0,
      tooltipY: 0,
      tooltipPresentation: "ohlc"
    }
  }

  updateScales() {

    const data = this.getAggregateData();

    this.state.height = this.props.height - this.state.margin.top - this.state.margin.bottom;
    this.state.width = this.props.width - this.state.margin.left - this.state.margin.right;

    this.state.ohlcHeight = Math.floor(this.state.height*0.70);
    this.state.ohlcOffset = Math.floor(this.state.height*0.75);
    this.state.volHeight = Math.floor(this.state.height*0.25);

    const minDate = new Date(Math.min(...data.map((el) => { return el.time; })));
    const maxDate = new Date(Math.max(...data.map((el) => { return el.time; })));


    this.state.xScale.domain([
      new Date(minDate.getTime()),
      new Date(maxDate.getTime())
    ]);

    this.state.yScale.domain([Math.min(...data.map((el) => { return el.low})), Math.max(...data.map((el) => { return el.high}))]);
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
    this.state.volScale.nice([25]);;

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

  componentWillMount() {

    this.updateScales();
  }

  componentWillReceiveProps(nextProps) {

    if (this.props.item.id !== nextProps.item.id) {
      unsubscribeItem(this.props.item.id, 0);
    }

    subscribeItem(nextProps.item.id, 0);

    this.props = nextProps;
    this.updateScales();
  }

  getAggregateData() {

    if (typeof this.props.market.region[0] !== 'undefined' && typeof this.props.market.region[0].item[this.props.item.id] !== 'undefined') {
      return this.props.market.region[0].item[this.props.item.id].aggregates;
    }

    return [];
  }

  renderTooltip() {

    if (!this.state.tooltipItem) {
      return;
    }

    let contents = null;

    switch(this.state.tooltipPresentation) {

      case "volume":
        contents = (
          <div>
            Volume: {this.state.tooltipItem.volume}
          </div>
        );
        break;

      case "ohlc":
        contents = (
          <div>
            Open: {this.state.tooltipItem.open}<br />
            High: {this.state.tooltipItem.high}<br />
            Low: {this.state.tooltipItem.low}<br />
            Close: {this.state.tooltipItem.close}<br />
          </div>
        );
        break;

      case "spread":
        contents = (
          <div>
            Spread: {this.state.tooltipItem.spread}%
          </div>
        );
        break;
    }

    return (
      <div ref="tooltip" style={{transition: "all 350ms ease-in-out", padding: "0.35rem", fontSize: "0.8rem", fontWeight: "300", background: "rgb(38, 43, 47)", opacity: this.state.tooltipVisible ? 1 : 0, color: "rgb(235, 169, 27)", borderRadius: "4px", position: "absolute", left: this.state.tooltipX, top: this.state.tooltipY}}>
        {contents}
      </div>
    );
  }

  handleMouseOver(ev, item, presentation) {

    let x = 0;
    let y = 0;

    if (presentation === "spread") {
      x = ev.currentTarget.cx.baseVal.value + this.state.margin.left + ev.currentTarget.r.baseVal.value / 2;
      y = ev.currentTarget.cy.baseVal.value - 15;
    } else {
      x = ev.currentTarget.x.baseVal.value + this.state.margin.left + ev.currentTarget.width.baseVal.value / 2;
      y = ev.currentTarget.y.baseVal.value - (presentation === "volume" ? 15 : 35);
    }

    this.setState({
      tooltipUpdated: true,
      tooltipVisible: false,
      tooltipItem: item,
      tooltipX: x,
      tooltipY: y,
      tooltipPresentation: presentation
    });
  }

  handleMouseOut(ev) {

    this.setState({
      tooltipVisible: false,
      tooltipUpdated: false
    });
  }

  componentDidUpdate() {

    if (this.state.tooltipUpdated === true && this.state.tooltipVisible === false) {

      this.setState({
        tooltipVisible: true,
        tooltipX: this.state.tooltipX - ReactDOM.findDOMNode(this.refs.tooltip).clientWidth / 2,
        tooltipY: this.state.tooltipY - ReactDOM.findDOMNode(this.refs.tooltip).clientHeight / 2,
      });
    }
  }

  render() {

    return (
      <div style={{position: "relative"}}>
        <RadioButtonGroup name="timespan" defaultSelected="minutes" className={s.radios}>
          <RadioButton
            value="minutes"
            label="5 Minutes"
          />
          <RadioButton
            value="hours"
            label="1 Hour"
          />
          <RadioButton
            value="days"
            label="1 Day"
          />
          <RadioButton
            value="months"
            label="1 Month"
          />
        </RadioButtonGroup>
        <div className={s.chart}>
          <svg width={this.state.width+this.state.margin.left+this.state.margin.right} height={this.state.height+this.state.margin.top+this.state.margin.bottom}>
            <g style={{transform: `translate(${this.state.margin.left}px, ${this.state.margin.top}px)`}}>
              <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${this.state.height}px)`}} />
              <Axis anchor="left" scale={this.state.yScale} ticks={5} />
              <Axis anchor="left" scale={this.state.volScale} ticks={5} style={{transform: `translateY(${this.state.ohlcOffset}px)`}} />
              <Axis anchor="right" scale={this.state.percentScale} ticks={10} style={{transform: `translateX(${this.state.width}px)`}} format="%" />

              <CandleStickData mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} data={this.getAggregateData()} viewportWidth={this.state.width} xScale={this.state.xScale} yScale={this.state.yScale} />
              <VolumeData mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} data={this.getAggregateData()} viewportWidth={this.state.width} viewportHeight={this.state.height} xScale={this.state.xScale} yScale={this.state.volScale} />

              <Indicator mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} data={this.getAggregateData()} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={(el) => { return el.time;}} yAccessor={(el) => { return el.spread/100;}} />
            </g>
          </svg>
          {this.renderTooltip()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { market: store.market };
}

export default connect(mapStateToProps)(Chart);