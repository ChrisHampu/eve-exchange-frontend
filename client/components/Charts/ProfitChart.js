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

class ProfitChart extends React.Component {

  static propTypes = {

    width: React.PropTypes.number,
    height: React.PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      xScale: scaleTime(),
      profitScale: scaleLinear(),
      taxScale: scaleLinear(),
      margin: {
        top: 10,
        right: 35,
        bottom: 30,
        left: 50
      },
      height: 0,
      width: 0
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

    const data = this.getChartData();

    this.state.height = ReactDOM.findDOMNode(this.refs.chart_anchor).clientHeight - this.state.margin.top - this.state.margin.bottom - 10;
    this.state.width = ReactDOM.findDOMNode(this.refs.chart_anchor).clientWidth - this.state.margin.left - this.state.margin.right - 10;

    //this.state.ohlcHeight = Math.floor(this.state.height*0.70);
    //this.state.ohlcOffset = Math.floor(this.state.height*0.75);
    //this.state.volHeight = Math.floor(this.state.height*0.25);

    const minDate = new Date(Math.min(...data.map((el) => { return el.time; })));
    const maxDate = new Date(Math.max(...data.map((el) => { return el.time; })));

    minDate.setTime(minDate.getTime() - timePadding);
    maxDate.setTime(maxDate.getTime() + timePadding);

    this.state.xScale.domain([
      new Date(minDate.getTime()),
      new Date(maxDate.getTime())
    ]);

    //this.state.yScale.domain([Math.min(...data.map((el) => { return el.open})), Math.max(...data.map((el) => { return el.close}))]);
    this.state.profitScale.domain([Math.min(...data.map((el) => { return el.profit})), Math.max(...data.map((el) => { return el.profit}))]);
    this.state.taxScale.domain([Math.min(...data.map((el) => { return el.taxes})), Math.max(...data.map((el) => { return el.taxes}))]);

    //this.state.volScale.domain([Math.floor(Math.min(...data.map((el) => { return el.buyVolume}))*0.95), Math.ceil(Math.max(...data.map((el) => { return el.buyVolume}))*1.05)]);

   // this.state.percentScale.domain([0, 1]);

    this.state.xScale.range([0, this.state.width]);
    this.state.profitScale.range([this.state.height, 0]);
    this.state.taxScale.range([this.state.height, 0]);
    //this.state.volScale.range([this.state.volHeight, 0]);
    //this.state.percentScale.range([this.state.ohlcHeight, 0]);

    this.state.xScale.clamp(true);
    this.state.profitScale.clamp(true);
    this.state.taxScale.clamp(true);
    //this.state.volScale.clamp(true);
    //this.state.percentScale.clamp(true);

    this.state.xScale.nice(timeMinute);
    this.state.profitScale.nice([5]);
    this.state.taxScale.nice([5]);
    //this.state.volScale.nice([25]);;
    //this.state.percentScale.nice([5]);

    this.setState({
      xScale: this.state.xScale,
      profitScale: this.state.profitScale,
      taxScale: this.state.taxScale,
      width: this.state.width,
      height: this.state.height
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

  handleMouseOver(ev, item, presentation) {

    this.refs.tooltip.showTooltip(ev, item, presentation);
  }

  handleMouseOut(ev) {

    this.refs.tooltip.hideTooltip();
  }

  render() {

    return (
      <div style={{ ...this.props.style, display: "flex", flexDirection: "column", position: "relative", height: "100%" }}>
        <div ref="chart_anchor" className={s.chart}>
          <svg width={this.state.width+this.state.margin.left+this.state.margin.right} height={this.state.height+this.state.margin.top+this.state.margin.bottom}>
            <g style={{transform: `translate(${this.state.margin.left}px, ${this.state.margin.top}px)`}}>

              <Axis anchor="left" scale={this.state.profitScale} ticks={5} formatISK={true} />
              <Axis anchor="right" scale={this.state.taxScale} ticks={5} style={{transform: `translateX(${this.state.width}px)`}} formatISK={true} />

              <Area mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} viewportHeight={this.state.height} data={this.getChartData()} xScale={this.state.xScale} yScale={this.state.profitScale} xAccessor={(el) => { return el.time;}} yAccessor={(el) => { return el.profit;}} />

            </g>
          </svg>
          <Tooltip margin={this.state.margin} ref="tooltip" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { profit: store.profit };
}

export default connect(mapStateToProps)(ProfitChart);