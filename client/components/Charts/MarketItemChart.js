/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { scaleTime, scaleLinear, timeHour, timeMinute, timeDay } from '../../d3.js';

import ChartContainer from './ChartContainer';
import BarChartData from './BarChartData';
import Axis from './Axis';
import Indicator from './Indicator';
import Area from './Area';
import Tooltip from './Tooltip';
import Scrollbar from './Scrollbar';
import { subscribeItem, unsubscribeItem } from '../../market';

class MarketItemChart extends React.Component {

  static propTypes = {

    item: React.PropTypes.object,
    title: React.PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      xScale: scaleTime(),
      yScale: scaleLinear(),
      volScale: scaleLinear(),
      percentScale: scaleLinear(),
      ohlcHeight: 0,
      ohlcOffset: 0,
      volHeight: 0,
    }
  }

  updateScales() {

    const timePadding = 60000;

    const data = this.getAggregateData();

    this.state.ohlcHeight = Math.floor(this.refs.container.getHeight()*0.70);
    this.state.ohlcOffset = Math.floor(this.refs.container.getHeight()*0.75);
    this.state.volHeight = Math.floor(this.refs.container.getHeight()*0.25);

    const minDate = new Date(Math.min(...data.map((el) => { return el.time; })));
    const maxDate = new Date(Math.max(...data.map((el) => { return el.time; })));

    minDate.setTime(minDate.getTime() - timePadding);
    maxDate.setTime(maxDate.getTime() + timePadding);

    this.state.xScale.domain([
      new Date(minDate.getTime()),
      new Date(maxDate.getTime())
    ]);

    this.state.yScale.domain([Math.min(...data.map((el) => { return el.buyFifthPercentile})), Math.max(...data.map((el) => { return el.buyFifthPercentile}))]);

    this.state.volScale.domain([Math.floor(Math.min(...data.map((el) => { return el.buyVolume}))*0.95), Math.ceil(Math.max(...data.map((el) => { return el.buyVolume}))*1.05)]);

    this.state.percentScale.domain([0, 1]);

    this.state.xScale.range([0, this.refs.container.getWidth()]);
    this.state.yScale.range([this.state.ohlcHeight, 0]);
    this.state.volScale.range([this.state.volHeight, 0]);
    this.state.percentScale.range([this.state.ohlcHeight, 0]);

    this.state.xScale.clamp(true);
    this.state.yScale.clamp(true);
    this.state.volScale.clamp(true);
    this.state.percentScale.clamp(true);

    this.state.xScale.nice(this.refs.container.getFrequency() === "minutes" ? timeMinute : (this.refs.container.getFrequency() === "hours" ? timeHour : timeDay));
    this.state.yScale.nice([5]);

    this.setState({
      xScale: this.state.xScale,
      yScale: this.state.yScale,
      volScale: this.state.volScale,
      percentScale: this.state.percentScale,
      ohlcHeight: this.state.ohlcHeight,
      ohlcOffset: this.state.ohlcOffset,
      volHeight: this.state.volHeight
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

      switch(this.refs.container.getFrequency()) {
        case "minutes":
          var arr = this.props.market.region[0].item[this.props.item.id].minutes || [];
          var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
          if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
            return arr;
          }
          return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
        case "hours":
          var arr = this.props.market.region[0].item[this.props.item.id].hours || [];
          var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
          if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
            return arr;
          }
          return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
      }
    }

    return [];
  }

  getDataSize() {

    if (typeof this.props.market.region[0] !== 'undefined' && typeof this.props.market.region[0].item[this.props.item.id] !== 'undefined') {

      switch(this.refs.container.getFrequency()) {
        case "minutes":
          return this.props.market.region[0].item[this.props.item.id].minutes ? this.props.market.region[0].item[this.props.item.id].minutes.length : 0;
        case "hours":
          return this.props.market.region[0].item[this.props.item.id].hours ? this.props.market.region[0].item[this.props.item.id].hours.length : 0;
      }
    }

    return 0;
  }

  chartChanged() {

    this.updateScales();
  }

  handleMouseOver(ev, item, presentation) {

    this.refs.container.handleMouseOver(ev, item, presentation);
  }

  handleMouseOut(ev) {

    this.refs.container.handleMouseOut(ev);
  }

  setFrequency = (event, index, value) => {

    this.refs.container.setFrequency(event, index, value);
  };

  handleScrollChange(scroll) {

    this.refs.container.handleScrollChange(scroll);
  }

  render() {

    const data = this.getAggregateData();
    const width = this.refs.container ? this.refs.container.getWidth() : 0;
    const height = this.refs.container ? this.refs.container.getHeight() : 0;

    return (
      <ChartContainer ref="container" data={data} title={this.props.title} onChartChanged={()=>this.chartChanged()}>
        <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${height}px)`}} />
        <Axis anchor="left" scale={this.state.yScale} ticks={5} formatISK={true} />
        <Axis anchor="left" scale={this.state.volScale} ticks={5} style={{transform: `translateY(${this.state.ohlcOffset}px)`}} formatISK={true} />
        <Axis anchor="right" scale={this.state.percentScale} ticks={10} style={{transform: `translateX(${width}px)`}} format="%" />
        {
          data.length > 0 ?
          <g>
            <Area mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} viewportHeight={this.state.ohlcHeight} data={data} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={el => el.time} yAccessor={el => el.buyFifthPercentile} />
            <BarChartData mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} data={data} heightOffset={this.state.volHeight} viewportWidth={width} viewportHeight={height} xScale={this.state.xScale} yScale={this.state.volScale} />
            <Indicator mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} data={data} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => el.spread/100} />
            <Scrollbar onScrollChange={scroll=>this.handleScrollChange(scroll)} />
          </g> : false
        }
     </ChartContainer>
    );
  }
}

const mapStateToProps = function(store) {
  return { market: store.market };
}

export default connect(mapStateToProps)(MarketItemChart);