/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import store from '../../store';
import { scaleTime, scaleLinear, timeHour, timeMinute, timeDay } from '../../d3.js';
import s from './CandleStickChart.scss';
import CandleStickData from './CandleStickData';
import VolumeData from './BarChartData';
import Axis from './Axis';
import Indicator from './Indicator';
import Area from './Area';
import Tooltip from './Tooltip';
import Scrollbar from './Scrollbar';
import { subscribeItem, unsubscribeItem } from '../../market';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class Chart extends React.Component {

  static propTypes = {

    width: React.PropTypes.number,
    height: React.PropTypes.number,
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
      ohlcHeight: Math.floor(this.props.height*0.70),
      ohlcOffset: Math.floor(this.props.height*0.75),
      volHeight: Math.floor(this.props.height*0.25),
      margin: {
        top: 10,
        right: 35,
        bottom: 50,
        left: 50
      },
      height: 0,
      width: 0,
      frequency: "minutes",
      scalesUpdated: false,
      scrollPercent: 1,
      pageSize: 30,
      dataSize: 0
    }
  }

  updateScales() {

    let timePadding = 60000;

    switch( this.state.frequency) {

      case "hours":
      //timePadding = 300000;
      break;
      case "days":
      break;
      case "months":
      break;
    }

    const data = this.getAggregateData();

    this.state.height = ReactDOM.findDOMNode(this.refs.chart_anchor).clientHeight - this.state.margin.top - this.state.margin.bottom;
    this.state.width = ReactDOM.findDOMNode(this.refs.chart_anchor).clientWidth - this.state.margin.left - this.state.margin.right;

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

    this.state.xScale.nice(this.state.frequency === "minutes" ? timeMinute : (this.state.frequency === "hours" ? timeHour : timeDay));
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
      height: this.state.height,
      scalesUpdated: true,
      dataSize: this.getDataSize()
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

      switch(this.state.frequency) {
        case "minutes":
          var arr = this.props.market.region[0].item[this.props.item.id].minutes || [];
          var slice = Math.floor(arr.length * this.state.scrollPercent);
          if (arr.length > 0 && arr.length < this.state.pageSize) {
            return arr;
          }
          return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.state.pageSize, 0), arr.length));
        case "hours":
          var arr = this.props.market.region[0].item[this.props.item.id].hours || [];
          var slice = Math.floor(arr.length * this.state.scrollPercent);
          if (arr.length > 0 && arr.length < this.state.pageSize) {
            return arr;
          }
          return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.state.pageSize, 0), arr.length));
      }
    }

    return [];
  }

  getDataSize() {

    if (typeof this.props.market.region[0] !== 'undefined' && typeof this.props.market.region[0].item[this.props.item.id] !== 'undefined') {

      switch(this.state.frequency) {
        case "minutes":
          return this.props.market.region[0].item[this.props.item.id].minutes ? this.props.market.region[0].item[this.props.item.id].minutes.length : 0;
        case "hours":
          return this.props.market.region[0].item[this.props.item.id].hours ? this.props.market.region[0].item[this.props.item.id].hours.length : 0;
      }
    }

    return 0;
  }

  handleMouseOver(ev, item, presentation) {

    this.refs.tooltip.showTooltip(ev, item, presentation);
  }

  handleMouseOut(ev) {

    this.refs.tooltip.hideTooltip();
  }

  setFrequency = (event, index, value) => {

    this.setState({
      frequency: value === 0 ? "minutes" : (value === 1 ? "hours" : "days"),
      scalesUpdated: false,
    }, () => {

      this.updateScales();
    });
  };

  handleScrollChange(scroll) {

    this.setState({
      scrollPercent: scroll
    }, () => {

      this.updateScales();
    });
  }

  formatDate(date) {

    let minutes = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes();

    return `${date.getUTCDate()} ${this.getMonthText(date.getUTCMonth())} ${date.getUTCHours()}:${minutes}`;
  }

  getMonthText(month) {

    switch (month) {
      case 0:
        return "January";
      case 1:
        return "Februray";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
    }
  }

  render() {

    return (
      <div style={{ ...this.props.style, display: "flex", flexDirection: "column", position: "relative", height: "100%" }}>
        <div>
          {
            this.props.title ? 
              <div style={{display: "inline-block", color: "#59c8e2", marginRight: "1rem"}}>
              {this.props.title}
              </div>
              : false
          }
          <div style={{display: "inline-block"}}>
            <SelectField style={{width: "150px"}} value={this.state.frequency==="minutes"?0:(this.state.frequency==="hours"?1:2)} onChange={this.setFrequency}>
              <MenuItem type="text" value={0} primaryText="5 Minutes" style={{cursor: "pointer"}}/>
              <MenuItem type="text" value={1} primaryText="1 Hour" style={{cursor: "pointer"}} />
              <MenuItem type="text" value={2} primaryText="1 Day" style={{cursor: "pointer"}} />
            </SelectField>
          </div>
          {
            this.getAggregateData().length > 0 && this.state.scalesUpdated ? 
              <div style={{display: "inline-block", position: "absolute", right: 50, top: 25}}>
                Showing <i>{this.formatDate(this.getAggregateData()[this.getAggregateData().length - 1].time)}</i> to <i>{this.formatDate(this.getAggregateData()[0].time)}</i>
              </div> : false
          }
        </div>
        <div style={{display: "flex", width: "100%", height: "100%"}}>
          <div ref="chart_anchor" className={s.chart}>
            <svg width={this.state.width+this.state.margin.left+this.state.margin.right} height={this.state.height+this.state.margin.top+this.state.margin.bottom}>
              <g style={{transform: `translate(${this.state.margin.left}px, ${this.state.margin.top}px)`}}>
                <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${this.state.height}px)`}} />
                <Axis anchor="left" scale={this.state.yScale} ticks={5} formatISK={true} />
                <Axis anchor="left" scale={this.state.volScale} ticks={5} style={{transform: `translateY(${this.state.ohlcOffset}px)`}} formatISK={true} />
                <Axis anchor="right" scale={this.state.percentScale} ticks={10} style={{transform: `translateX(${this.state.width}px)`}} format="%" />
                {
                  this.getAggregateData().length > 0 && this.state.scalesUpdated ? 
                  <g>
                    <Area mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} viewportHeight={this.state.ohlcHeight} data={this.getAggregateData()} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={el => el.time} yAccessor={el => el.buyFifthPercentile} />
                    <VolumeData mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} data={this.getAggregateData()} heightOffset={this.state.volHeight} viewportWidth={this.state.width} viewportHeight={this.state.height} xScale={this.state.xScale} yScale={this.state.volScale} />
                    <Indicator mouseOut={(ev)=>{this.handleMouseOut(ev);}} mouseOver={(ev,item,presentation)=>{ this.handleMouseOver(ev,item,presentation);}} data={this.getAggregateData()} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => el.spread/100} />
                    <Scrollbar pageSize={this.state.pageSize} dataSize={this.state.dataSize} onScrollChange={scroll=>this.handleScrollChange(scroll)} chartWidth={this.state.width} chartHeight={this.state.height} />
                  </g> : false
                }
             </g>
            </svg>
            <Tooltip margin={this.state.margin} ref="tooltip" />
          </div>
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