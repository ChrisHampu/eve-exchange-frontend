/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { scaleUtc, scaleLinear, timeHour, timeMinute, timeDay } from '../../vendor/d3';
import { formatNumber } from '../../utilities';

import ChartContainer from '../Charts/ChartContainer';
import Axis from '../Charts/Axis';
import Indicator from '../Charts/Indicator';
import Area from '../Charts/Area';
import Scrollbar from '../Charts/Scrollbar';

export default class TickerChart extends React.Component {

  static propTypes = {

    ticker: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      xScale: scaleUtc(),
      yScale: scaleLinear(),
      focusedElement: null,
      focusedElementIndex: -1
    }
  }

  updateScales() {

    if (!this.refs.container) {
      return;
    }

    let timePadding = 60000;

    const data = this.getChartData();

    if (!data) {
      return;
    }

    const minDate = new Date(Math.min(...data.map((el) => { return new Date(el.time); })));
    const maxDate = new Date(Math.max(...data.map((el) => { return new Date(el.time); })));

    minDate.setTime(minDate.getTime() - timePadding);
    maxDate.setTime(maxDate.getTime() + timePadding);

    this.state.xScale.domain([
      new Date(minDate.getTime()),
      new Date(maxDate.getTime())
    ]);

    this.state.yScale.domain([Math.min(...data.map((el) => { return el.index })), Math.max(...data.map((el) => { return el.index }))]);

    this.state.xScale.range([0, this.refs.container.getWidth()]);
    this.state.yScale.range([this.refs.container.getHeight(), 0]);

    this.state.xScale.clamp(true);
    this.state.yScale.clamp(true);

    this.state.xScale.nice(this.refs.container.getFrequency() === "hours" ? timeHour : timeDay);
    this.state.yScale.nice([5]);

    this.setState({
      xScale: this.state.xScale,
      yScale: this.state.yScale
    });
  }

  getChartData() {

    // Check if still loading components
    if (!this.refs.container) {
      return null;
    }

    switch(this.refs.container.getFrequency()) {
      case "hours":
        var arr = this.props.hourlyChart;
        if (!arr) {
          return null;
        }
        var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
        if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
          return arr;
        }
        return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
      case "days":
        var arr = this.props.hourlyChart;
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

  getChartDataSize() {

    if (!this.refs.container) {
      return 0;
    }

    switch(this.refs.container.getFrequency()) {
      case "hours":
        var arr = this.props.hourlyChart;
        if (!arr) {
          return 0;
        }

        return arr.length;
        
      case "days":
        var arr = this.props.hourlyChart;
        if (!arr) {
          return 0;
        }

        return arr.length;
    }

    return 0;  
  }

  getHitTestableData() {

    return this.getChartData().map(el => this.state.xScale(new Date(el.time)));
  }

  componentDidMount() {

    this.updateScales();
  }

  componentWillReceiveProps(nextProps) {

    this.props = nextProps;

    this.updateScales();
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


  getLegend() {

    if (!this.refs.container) {
      return;
    }

    const legend = [];

    legend.push({fill: "#59c8e2", text: "Index Value", value: this.state.focusedElement ? formatNumber(this.state.focusedElement.index) : 0, postfix: ""});

    return legend;
  }

  render() {

    const data = this.getChartData();
    const width = this.refs.container ? this.refs.container.getWidth() : 0;
    const height = this.refs.container ? this.refs.container.getHeight() : 0;

    return (
      <div style={{width: "100%", height: "100%"}}>
        <ChartContainer
          overrideHeight={450}
          frequencyLevels={{hours: "Hourly"}}
          marginLeft={65}
          marginRight={65}
          ref="container"
          data={data}
          title=""
          onChartChanged={()=>this.chartChanged()}
          getHitTestableData={()=>this.getHitTestableData()}
          totalDataSize={this.getChartDataSize()}
          legend={this.getLegend()}
          onFocusElement={(el, index)=>this.setState({focusedElement: el, focusedElementIndex: index})}
        >
          <Axis anchor="left" scale={this.state.yScale} ticks={5} tickSize={-width} suppressLabels={true} style={{opacity: 0.5}}/>

          <Axis anchor="left" scale={this.state.yScale} ticks={5} formatISK={true} />
          <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${height}px)`}} />
          {
            data && data.length > 0 ?
            <g>
              <Area focusedIndex={this.state.focusedElementIndex} viewportHeight={height} data={data} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={el => new Date(el.time)} yAccessor={el => el.index} />
              <Scrollbar onScrollChange={scroll=>this.handleScrollChange(scroll)} />
           </g> : false
          }
        </ChartContainer>
     </div>
    );
  }
}