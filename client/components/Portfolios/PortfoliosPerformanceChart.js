/* eslint-disable global-require */
import React from 'react';
import { scaleTime, scaleLinear, timeHour, timeDay } from '../../d3.js';
import { formatNumber } from '../../utilities';

import ChartContainer from '../Charts/ChartContainer';
import BarChartData from '../Charts/BarChartData';
import Axis from '../Charts/Axis';
import Indicator from '../Charts/Indicator';
import Area from '../Charts/Area';
import Tooltip from '../Charts/Tooltip';
import Scrollbar from '../Charts/Scrollbar';

export default class PortfoliosPerformanceChart extends React.Component {

  static propTypes = {

    portfolio: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number
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

  updateContainer() {

    this.refs.container.update();
  }

  updateScales() {

    const timePadding = 60000;

    const data = this.getAggregateData();

    if (!data) {
      return;
    }

    this.state.height = this.refs.container.getHeight();

    const minDate = new Date(Math.min(...data.map((el) => { return el.time; })));
    const maxDate = new Date(Math.max(...data.map((el) => { return el.time; })));

    minDate.setTime(minDate.getTime() - timePadding);
    maxDate.setTime(maxDate.getTime() + timePadding);

    this.state.xScale.domain([
      new Date(minDate.getTime()),
      new Date(maxDate.getTime())
    ]);

    if (this.props.portfolio.type === 1) {
      this.state.yScale.domain([Math.min(...data.map((el) => { return Math.min(el.portfolioValue, el.materialValue)})), Math.max(...data.map((el) => { return Math.max(el.portfolioValue, el.materialValue)}))]);
      this.state.percentScale.domain([Math.min(...data.map((el) => { return Math.max(0, el.industrySpread) / 100 })), Math.max(...data.map((el) => { return Math.max(0, el.industrySpread) / 100 }))]);
    } else {
      this.state.yScale.domain([Math.min(...data.map((el) => { return el.portfolioValue})), Math.max(...data.map((el) => { return el.portfolioValue}))]);
      this.state.percentScale.domain([Math.min(...data.map((el) => { return Math.max(0, Math.min(el.avgSpread, el.growth)) / 100 })), Math.max(...data.map((el) => { return Math.max(0, Math.max(el.avgSpread, el.growth)) / 100 }))]);
    }

    this.state.xScale.range([0, this.refs.container.getWidth()]);
    this.state.yScale.range([this.state.height, 0]);
    this.state.percentScale.range([this.state.height, 0]);

    this.state.xScale.clamp(true);
    this.state.yScale.clamp(true);
    this.state.percentScale.clamp(true);

    this.state.xScale.nice(this.refs.container.getFrequency() === "hours" ? timeHour : timeDay);
    this.state.yScale.nice([5]);
    this.state.percentScale.nice([1]);

    this.setState({
      xScale: this.state.xScale,
      yScale: this.state.yScale,
      percentScale: this.state.percentScale,
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

    // Check if still loading components
    if (!this.refs.container) {
      return null;
    }

    switch(this.refs.container.getFrequency()) {
      case "hours":
        var arr = this.props.portfolio.hourlyChart;
        if (!arr) {
          return null;
        }
        var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
        if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
          return arr;
        }
        return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
      case "daily":
        var arr = this.props.portfolio.dailyChart;
        if (!arr) {
          return null;
        }
        var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
        if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
          return arr;
        }
        return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
    }

    return null;
  }

  getDataSize() {

    switch(this.refs.container.getFrequency()) {
      case "hours":
        return this.props.portfolio.hourlyChart.length;
      case "daily":
        return this.props.portfolio.dailyChart.length;
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
        this.props.portfolio.type === 0 ?
        <div>
          Value: {formatNumber(el.portfolioValue)}<br />
          Avg Spread: {Math.round(el.avgSpread*Math.pow(10,2))/Math.pow(10,2)}%<br />
          Growth: {Math.round(el.growth*Math.pow(10,2))/Math.pow(10,2)}%<br />
        </div>:
        <div>
          Component Value: {formatNumber(el.portfolioValue)}<br />
          Material Value: {formatNumber(el.materialValue)}<br />
          Potential Profit: {Math.round(el.industrySpread*Math.pow(10,2))/Math.pow(10,2)}%<br />
        </div>,
      offset: this.props.portfolio.type === 1 ? 35 : 35
    }
  }

  renderLegend() {

    const legend = [];
    let offset = 15;

    if (this.props.portfolio.type === 0) {

      legend.push(<text key={legend.length} fill="#59c8e2" fontSize="16" x={offset} y="0" textAnchor="start" alignmentBaseline="middle">Portfolio Value</text>);
      offset += 112;

      legend.push(<text key={legend.length} fill="#eba91b" fontSize="16" x={offset} y="0" textAnchor="start" alignmentBaseline="middle">Average Spread</text>);
      offset += 118;

      legend.push(<text key={legend.length} fill="#5CEF70" fontSize="16" x={offset} y="0" textAnchor="start" alignmentBaseline="middle">Growth</text>);
      offset += 58;

    } else {

      legend.push(<text key={legend.length} fill="#59c8e2" fontSize="16" x={offset} y="0" textAnchor="start" alignmentBaseline="middle">Component Value</text>);
      offset += 136;

      legend.push(<text key={legend.length} fill="#eba91b" fontSize="16" x={offset} y="0" textAnchor="start" alignmentBaseline="middle">Material Value</text>);
      offset += 112;

      legend.push(<text key={legend.length} fill="#5CEF70" fontSize="16" x={offset} y="0" textAnchor="start" alignmentBaseline="middle">Potential Profit</text>);
      offset += 58;
    }

    return (
      <g>
      {legend}
      </g>
    );
  }

  renderCharts(data) {

    if (!data || data.length === 0) {
      return;
    }

    if (this.props.portfolio.type === 0) {
      return (
        <g>
          <Area viewportHeight={this.state.height} data={data} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={el => el.time} yAccessor={el => el.portfolioValue} />
          <Indicator thickLine={true} circleColour="#eba91b" lineColour="#eba91b" data={data} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => el.avgSpread/100} />
          <Indicator thickLine={true} circleColour="#5CEF70" lineColour="#5CEF70" data={data} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => el.growth/100} />
        </g>
      )
    } else {
      return (
        <g>
          <Indicator thickLine={true} circleColour="#59c8e2" lineColour="#59c8e2" data={data} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={el => el.time} yAccessor={el => el.portfolioValue} />
          <Indicator thickLine={true} circleColour="#eba91b" lineColour="#eba91b" data={data} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={el => el.time} yAccessor={el => el.materialValue} />
          <Indicator thickLine={true} circleColour="#5CEF70" lineColour="#5CEF70" data={data} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => el.industrySpread/100} />
        </g>
      )
    }
  }

//<Area viewportHeight={this.state.height} data={data} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={el => el.time} yAccessor={el => el.portfolioValue} />

  render() {

    const data = this.getAggregateData();
    const width = this.refs.container ? this.refs.container.getWidth() : 0;
    const height = this.refs.container ? this.refs.container.getHeight() : 0;

    return (
      <ChartContainer 
        getTooltipPresentation={(el)=>this.getTooltipPresentation(el)} 
        getHitTestableData={()=>this.getHitTestableData()} 
        frequencyLevels={{hours: "1 Hour", daily: "1 Day"}} 
        ref="container"
        data={data} 
        title={this.props.portfolio.name}
        onChartChanged={()=>this.chartChanged()}
        overrideHeight={this.props.height}
        overrideWidth={this.props.width}
      >
        <g>
        {this.renderLegend()}
        </g>
        <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${height}px)`}} />
        <Axis anchor="left" scale={this.state.yScale} ticks={5} formatISK={true} />
        <Axis anchor="right" scale={this.state.percentScale} ticks={10} style={{transform: `translateX(${width}px)`}} format="%" />
        {
          this.renderCharts(data)
        }
     </ChartContainer>
    );
  }
}