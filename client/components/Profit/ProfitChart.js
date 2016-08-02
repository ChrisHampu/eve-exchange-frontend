/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { scaleTime, scaleLinear, timeHour, timeMinute, timeDay } from '../../d3.js';

import ChartContainer from '../Charts/ChartContainer';
import BarChartData from '../Charts/BarChartData';
import Axis from '../Charts/Axis';
import Indicator from '../Charts/Indicator';
import Line from '../Charts/Line';
import Tooltip from '../Charts/Tooltip';
import Scrollbar from '../Charts/Scrollbar';

class ProfitChart extends React.Component {

  static propTypes = {

    item: React.PropTypes.object,
    title: React.PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      xScale: scaleTime(),
      profitScale: scaleLinear(),
      taxScale: scaleLinear()
    }
  }

  updateScales() {

    let timePadding = 60000;

    const data = this.getChartData();

    const minDate = new Date(Math.min(...data.map((el) => { return el.time; })));
    const maxDate = new Date(Math.max(...data.map((el) => { return el.time; })));

    minDate.setTime(minDate.getTime() - timePadding);
    maxDate.setTime(maxDate.getTime() + timePadding);

    this.state.xScale.domain([
      new Date(minDate.getTime()),
      new Date(maxDate.getTime())
    ]);

    this.state.profitScale.domain([Math.min(...data.map((el) => { return el.profit})), Math.max(...data.map((el) => { return el.profit}))]);
    this.state.taxScale.domain([Math.min(...data.map((el) => { return Math.abs(el.taxes)})), Math.max(...data.map((el) => { return Math.abs(el.taxes)}))]);

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

    return this.props.profit.chart.hourly;
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

    const data = this.getChartData();
    const width = this.refs.container ? this.refs.container.getWidth() : 0;
    const height = this.refs.container ? this.refs.container.getHeight() : 0;

    return (
      <ChartContainer frequencyLevels={{hours: "1 Hour"}} marginRight={50} ref="container" data={data} title={this.props.title} onChartChanged={()=>this.chartChanged()}>
        <Axis anchor="left" scale={this.state.profitScale} ticks={5} formatISK={true} />
        <Axis anchor="right" scale={this.state.taxScale} ticks={5} style={{transform: `translateX(${width}px)`}} formatISK={true} />
        <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${height}px)`}} />
        {
          data.length > 0 ?
          <g>
            <Line fill="#F44336" mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} viewportHeight={height} data={this.getChartData()} xScale={this.state.xScale} yScale={this.state.profitScale} xAccessor={(el) => { return el.time;}} yAccessor={(el) => { return Math.abs(el.taxes);}} />
            <Line fill="#4CAF50" mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} viewportHeight={height} data={this.getChartData()} xScale={this.state.xScale} yScale={this.state.profitScale} xAccessor={(el) => { return el.time;}} yAccessor={(el) => { return el.profit;}} />
            <Scrollbar onScrollChange={scroll=>this.handleScrollChange(scroll)} />
          </g> : false
        }
     </ChartContainer>
    );
  }
}

const mapStateToProps = function(store) {
  return { profit: store.profit };
}

export default connect(mapStateToProps)(ProfitChart);