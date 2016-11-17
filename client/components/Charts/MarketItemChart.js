/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { scaleUtc, scaleLinear, timeHour, timeMinute, timeDay } from '../../vendor/d3';
import { formatNumber } from '../../utilities';
import { userHasPremium } from '../../auth';

import ChartContainer from './ChartContainer';
import BarChartData from './BarChartData';
import Axis from './Axis';
import Indicator from './Indicator';
import Area from './Area';
import Tooltip from './Tooltip';
import Scrollbar from './Scrollbar';

class MarketItemChart extends React.Component {

  static propTypes = {

    item: React.PropTypes.object,
    title: React.PropTypes.string,
    region: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      xScale: scaleUtc(),
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

    if (!data) {
      return;
    }

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

    this.state.yScale.domain([Math.min(...data.map((el) => { return el.buyPercentile})), Math.max(...data.map((el) => { return el.buyPercentile}))]);

    this.state.volScale.domain([Math.floor(Math.min(...data.map((el) => { return el.tradeVolume !== undefined ? el.tradeVolume : 0}))), Math.ceil(Math.max(...data.map((el) => { return el.tradeVolume !== undefined ? el.tradeVolume : 0})))]);

    this.state.percentScale.domain([Math.min(...data.map((el) => { return Math.max(0, el.spread) / 100 })), Math.max(...data.map((el) => { return Math.max(0, el.spread) / 100 }))]);

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

    this.state.percentScale.nice([1]);

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

    // Check if still loading components
    if (!this.refs.container) {
      return null;
    }

    const region = this.props.region || store.getState().settings.market.region;

    if (typeof this.props.market.item[this.props.item.id] !== 'undefined') {

      switch(this.refs.container.getFrequency()) {
        case "minutes":
          if (!this.props.market.item[this.props.item.id].minutes) {
            return null;
          }
          var arr = this.props.market.item[this.props.item.id].minutes[region];
          if (!arr) {
            return null;
          }
          var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
          if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
            return arr;
          }
          return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
        case "hours":
          if (!this.props.market.item[this.props.item.id].hours) {
            return null;
          }
          var arr = this.props.market.item[this.props.item.id].hours[region];
          if (!arr) {
            return null;
          }
          var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
          if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
            return arr;
          }
          return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
        case "daily":
          if (!this.props.market.item[this.props.item.id].daily) {
            return null;
          }
          var arr = this.props.market.item[this.props.item.id].daily[region];
          if (!arr) {
            return null;
          }
          var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
          if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
            return arr;
          }
          return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
      }
    }

    return null;
  }

  getDataSize() {

    if (!this.refs.container) {
      return 0;
    }

    if (typeof this.props.market.item[this.props.item.id] !== 'undefined') {

      const region = this.props.region || store.getState().settings.market.region;

      switch(this.refs.container.getFrequency()) {
        case "minutes":
          return this.props.market.item[this.props.item.id].minutes ? this.props.market.item[this.props.item.id].minutes[region].length : 0;
        case "hours":
          return this.props.market.item[this.props.item.id].hours ? this.props.market.item[this.props.item.id].hours[region].length : 0;
        case "daily":
          return this.props.market.item[this.props.item.id].daily ? this.props.market.item[this.props.item.id].daily[region].length : 0;
      }
    }

    return 0;
  }

  getHitTestableData() {

    const data = this.getAggregateData();

    if (!data) { 
      return [];
    }

    return data.map(el => this.state.xScale(el.time));
  }

  chartChanged() {

    this.updateScales();
  }

  setFrequency = (event, index, value) => {

    this.refs.container.setFrequency(event, index, value);
  };

  handleScrollChange(scroll) {

    this.refs.container.handleScrollChange(scroll);
  }

  getTooltipPresentation(el) {
    return { 
      view: 
        <div>
          Buy: {formatNumber(el.buyPercentile)}<br />
          Sell: {formatNumber(el.sellPercentile)}<br />
          Spread: {Math.round(el.spread*Math.pow(10,2))/Math.pow(10,2)}%<br />
          {
            this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.spread_sma ?
               <span>Spread SMA: {Math.round((el.spread_sma || 0)*Math.pow(10,2))/Math.pow(10,2)}%<br /></span>
               : false
          }
          Volume: {formatNumber(el.tradeVolume || 0)}<br />
          {
            this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.volume_sma ?
               <span>Volume SMA: {formatNumber(el.volume_sma || 0)}<br /></span>
               : false
          }
        </div>,
      offset: 30 + (this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.volume_sma ? 10 : 0) + (this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.spread_sma ? 10 : 0)
    }
  }

  renderLegend() {

    if (!this.refs.container) {
      return;
    }

    const legend = [];
    let offset = 15;
    let yOffset = 5;

    const addLegend = (fill, text, _offset) => {

      if ((offset + _offset) > this.refs.container.getWidth()) {

        yOffset += 22;
        offset = 15;
      }

      legend.push(<text key={legend.length} fill={fill} fontSize="16" x={offset} y={yOffset} textAnchor="start" alignmentBaseline="middle">{text}</text>);
      offset += _offset;
    };

    if (this.props.chart_visuals.price) {

      addLegend("#59c8e2", "Buy Price", 74);
    }

    if (this.props.chart_visuals.spread) {

      addLegend("#5CEF70", "Spread", 58);
    }

    if (this.refs.container && this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.spread_sma) {

      addLegend("#F8654F", "7 Day Spread SMA", 140);
    }

    if (this.props.chart_visuals.volume) {

      addLegend("#4090A2", "Volume", 60);
    }

    if (this.refs.container && this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.volume_sma) {

      addLegend("#eba91b", "7 Day Volume SMA", 140);
    }

    return (
      <g>
      {legend}
      </g>
    );
  }

  render() {

    const data = this.getAggregateData();
    const width = this.refs.container ? this.refs.container.getWidth() : 0;
    const height = this.refs.container ? this.refs.container.getHeight() : 0;

    return (
      <ChartContainer 
        getTooltipPresentation={(el)=>this.getTooltipPresentation(el)} 
        getHitTestableData={()=>this.getHitTestableData()} 
        frequencyLevels={userHasPremium() ? {minutes: "5 Minutes", hours: "1 Hour", daily: "1 Day"} : {hours: "1 Hour", daily: "1 Day"}} 
        ref="container"
        data={data} 
        title={this.props.title} 
        onChartChanged={()=>this.chartChanged()}
        overrideWidth={this.props.width}
        overrideHeight={this.props.height}
        totalDataSize={this.getDataSize()}
      >
        <g>
        {this.renderLegend()}
        </g>

        <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${height}px)`}} />
        <Axis anchor="left" scale={this.state.yScale} ticks={5} formatISK={true} />
        <Axis anchor="left" scale={this.state.volScale} ticks={5} style={{transform: `translateY(${this.state.ohlcOffset}px)`}} formatISK={true} />
        <Axis anchor="right" scale={this.state.percentScale} ticks={10} style={{transform: `translateX(${width}px)`}} format="%" />
        {
          data && data.length > 0 ?
          <g>
            {
              this.props.chart_visuals.price ?
                <Area viewportHeight={this.state.ohlcHeight} data={data} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={el => el.time} yAccessor={el => el.buyPercentile} />
                : false
            }
            {
              this.props.chart_visuals.volume ?
                <BarChartData data={data} heightOffset={this.state.volHeight} viewportWidth={width} viewportHeight={height} xScale={this.state.xScale} yScale={this.state.volScale} />
                : false
            }
            {
              this.props.chart_visuals.spread ?
                <Indicator thickLine={true} circleColour="#5CEF70" lineColour="#5CEF70" data={data} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => el.spread/100} />
                : false
            }
            { this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.spread_sma ? 
                <Indicator thickLine={true} lineColour="#F8654F" data={data} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => (el.spread_sma || 0)/100 } />
                : false
            }

            { this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.volume_sma ? 
                <Indicator thickLine={true} lineColour="#eba91b" data={data} heightOffset={height-this.state.volHeight} xScale={this.state.xScale} yScale={this.state.volScale} xAccessor={el => el.time} yAccessor={el => el.volume_sma || 0} />
                : false
            }
            <Scrollbar onScrollChange={scroll=>this.handleScrollChange(scroll)} />
          </g> : false
        }
     </ChartContainer>
    );
  }
}

const mapStateToProps = function(store) {
  return { market: store.market, chart_visuals: store.settings.chart_visuals };
}

export default connect(mapStateToProps)(MarketItemChart);