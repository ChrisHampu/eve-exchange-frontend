/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { scaleUtc, scaleLinear, timeHour, timeMinute, timeDay } from '../../vendor/d3';
import { formatNumber } from '../../utilities';

import ChartContainer from '../Charts/ChartContainer';
import BarChartData from '../Charts/BarChartData';
import Axis from '../Charts/Axis';
import Indicator from '../Charts/Indicator';
import Line from '../Charts/Line';
import Tooltip from '../Charts/Tooltip';
import Scrollbar from '../Charts/Scrollbar';

import CircularProgress from 'material-ui/CircularProgress';

class ProfitChart extends React.Component {

  static propTypes = {

    title: React.PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      xScale: scaleUtc(),
      profitScale: scaleLinear(),
      taxScale: scaleLinear()
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

    const minDate = new Date(Math.min(...data.map((el) => { return el.time; })));
    const maxDate = new Date(Math.max(...data.map((el) => { return el.time; })));

    minDate.setTime(minDate.getTime() - timePadding);
    maxDate.setTime(maxDate.getTime() + timePadding);

    this.state.xScale.domain([
      new Date(minDate.getTime()),
      new Date(maxDate.getTime())
    ]);

    this.state.profitScale.domain([Math.min(...data.map((el) => { return el.profit})), Math.max(...data.map((el) => { return el.profit}))]);
    this.state.taxScale.domain([Math.min(...data.map((el) => { return Math.abs(el.taxes)+Math.abs(el.broker)})), Math.max(...data.map((el) => { return Math.abs(el.taxes)+Math.abs(el.broker)}))]);

    this.state.xScale.range([0, this.refs.container.getWidth()]);
    this.state.profitScale.range([this.refs.container.getHeight(), 0]);
    this.state.taxScale.range([this.refs.container.getHeight(), 0]);

    this.state.xScale.clamp(true);
    this.state.profitScale.clamp(true);
    this.state.taxScale.clamp(true);

    this.state.xScale.nice(this.refs.container.getFrequency() === "minutes" ? timeMinute : (this.refs.container.getFrequency() === "hours" ? timeHour : timeDay));
    this.state.profitScale.nice([5]);
    this.state.taxScale.nice([5]);

    this.setState({
      xScale: this.state.xScale,
      profitScale: this.state.profitScale,
      taxScale: this.state.taxScale
    });
  }

  getChartData() {

    // Check if still loading components
    if (!this.refs.container) {
      return null;
    }

    switch(this.refs.container.getFrequency()) {
      case "hours":
        var arr = this.props.chart.hourly;
        if (!arr) {
          return null;
        }
        var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
        if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
          return arr;
        }
        return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
      case "days":
        var arr = this.props.chart.daily;
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

  getHitTestableData() {

    return this.getChartData().map(el => this.state.xScale(el.time));
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

  getTooltipPresentation(el) {
    return { 
      view: 
        <div>
          Profit: {formatNumber(el.profit)}<br />
          Taxes: {formatNumber(el.taxes)}<br />
          Broker: {formatNumber(el.broker)}<br />
        </div>,
      offset: 30
    }
  }

  render() {

    const data = this.getChartData();
    const width = this.refs.container ? this.refs.container.getWidth() : 0;
    const height = this.refs.container ? this.refs.container.getHeight() : 0;

    return (
      <div style={{width: "100%", height: "100%"}}>
        <ChartContainer
          frequencyLevels={{hours: "Hourly", days: "Daily"}}
          marginLeft={65}
          marginRight={65}
          ref="container"
          data={data}
          title={this.props.title}
          onChartChanged={()=>this.chartChanged()}
          getTooltipPresentation={(el)=>this.getTooltipPresentation(el)} 
          getHitTestableData={()=>this.getHitTestableData()} 
        >
          <Axis anchor="left" scale={this.state.profitScale} ticks={5} formatISK={true} />
          <Axis anchor="right" scale={this.state.taxScale} ticks={5} style={{transform: `translateX(${width}px)`}} formatISK={true} />
          <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${height}px)`}} />
          {
            data && data.length > 0 ?
            <g>
              <Line fill="#F44336" mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} viewportHeight={height} data={this.getChartData()} xScale={this.state.xScale} yScale={this.state.profitScale} xAccessor={(el) => { return el.time;}} yAccessor={(el) => Math.abs(el.taxes) + Math.abs(el.broker)} />
              <Line fill="#4CAF50" mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} viewportHeight={height} data={this.getChartData()} xScale={this.state.xScale} yScale={this.state.profitScale} xAccessor={(el) => { return el.time;}} yAccessor={(el) => el.profit} />
              <Scrollbar onScrollChange={scroll=>this.handleScrollChange(scroll)} />
           </g> : false
          }
          <text transform={`translate(-55,0)rotate(270 0 ${Math.round(height/2)})`} fill="#4CAF50" fontSize="20" x="0" y={Math.round(height/2)} textAnchor="middle" alignmentBaseline="middle">Profit</text>
          <text transform={`translate(+55,0)rotate(90 ${width} ${Math.round(height/2)})`} fill="#F44336" fontSize="20" x={width} y={Math.round(height/2)} textAnchor="middle" alignmentBaseline="middle">Broker + Taxes</text>
        </ChartContainer>
     </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { chart: store.profit.chart };
}

export default connect(mapStateToProps)(ProfitChart);