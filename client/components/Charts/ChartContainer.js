/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import s from './ChartContainer.scss';
import { formatDate } from '../../utilities';

import Tooltip from './Tooltip';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import CircularProgress from 'material-ui/CircularProgress';

import PlusIcon from 'material-ui/svg-icons/content/add';
import MinusIcon from 'material-ui/svg-icons/content/remove';

class ChartContainer extends React.Component {

  static propTypes = {

    frequencyLevels: React.PropTypes.object.isRequired,
    data: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    title: React.PropTypes.string,
    onChartChanged: React.PropTypes.func.isRequired,
    marginRight: React.PropTypes.number,
    marginLeft: React.PropTypes.number,
    getHitTestableData: React.PropTypes.func.isRequired,
    getTooltipPresentation: React.PropTypes.func.isRequired,
    overrideWidth: React.PropTypes.number,
    overrideHeight: React.PropTypes.number
  };

  static childContextTypes = {

    width: React.PropTypes.number,
    height: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    dataSize: React.PropTypes.number,
    frequency: React.PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      margin: {
        top: 10,
        right: this.props.marginRight || 35,
        bottom: 45,
        left: this.props.marginLeft || 50
      },
      height: 0,
      width: 0,
      containerHeight: 0,
      containerWidth: 0,
      frequency: this.props.frequencyLevels ? Object.keys(this.props.frequencyLevels)[0] : "minutes",
      scrollPercent: 1,
      pageSize: 30,
      dataSize: 0,
      zoomLevels: [
        15,
        30,
        50,
        80,
        100
      ],
      zoom: 1
    };

    this.mounted = false;
    this.forceUpdate = false;
  }

  getChildContext() {
    return {
      width: this.state.width,
      height: this.state.height,
      pageSize: this.state.pageSize,
      dataSize: this.props.data ? this.props.data.length : 0
    }
  }

  update() {

    if (!this.refs.chart_anchor || !this.props.data) {
      return;
    }

    let newHeight = this.props.overrideHeight || ReactDOM.findDOMNode(this.refs.chart_anchor).clientHeight;
    const newWidth = this.props.overrideWidth || ReactDOM.findDOMNode(this.refs.chart_anchor).clientWidth;

    if (this.props.overrideHeight) {
      newHeight -= ReactDOM.findDOMNode(this.refs.header).clientHeight + 5;
    }

    if (this.forceUpdate === true || (this.state.containerWidth === 0 && this.state.containerHeight === 0 && newHeight !== this.state.containerHeight && newWidth !== this.state.containerWidth)) {
       
      this.setState({
        width: newWidth - this.state.margin.left - this.state.margin.right,
        height: Math.max(0, newHeight- this.state.margin.top - this.state.margin.bottom),
        containerWidth: newWidth,
        containerHeight: newHeight
      }, () => {

        this.props.onChartChanged();
      });

      this.forceUpdate = false;
      
    }
  }

  onResize() {

    if (!this.mounted) {
      return;
    }

    this.update();
  }

  componentDidMount() {

    this.update();

    window.addEventListener("resize", ()=>this.onResize());

    this.mounted = true;
  }

  componentDidUpdate() {

    this.update();
  }

  componentWillUnmount() {

    window.removeEventListener("resize", ()=>this.onResize());

    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {

    this.props = nextProps;

    this.update();
  }

  getScrollPercent() {
    return this.state.scrollPercent;
  }

  getHeight() {
    return this.state.height;
  }

  getWidth() {
    return this.state.width;
  }

  getFrequency() {
    return this.state.frequency;
  }

  getPageSize() {
    return this.state.pageSize;
  }

  handleMouseOut(ev) {

    this.refs.tooltip.hideTooltip();
  }

  setFrequency = (event, index, value) => {

    // TODO: Pretty much a race condition
    // The chart will update by reading off the new frequency and adjusting its data
    // But if we render/update now, before the chart updates, the size will be in an inconsistent state
    // because the container will update, then the chart/data will update, and the container won't re-update in time
    // so the data could require a different container than we pre-render
    // onChartChanged() could trigger a container update, but then we could be in an infinite loop all over again from re-rendering
    this.state.frequency = Object.keys(this.props.frequencyLevels)[value]

    this.props.onChartChanged();

    this.setState({
      frequency: Object.keys(this.props.frequencyLevels)[value]
    }, () => {

      this.forceUpdate = true;

      this.update();
    });
  };

  handleMouseMove(ev) {

    const top = ev.clientY - ev.currentTarget.getScreenCTM().f;
    const left = ev.clientX - ev.currentTarget.getScreenCTM().e;

    if (left < this.state.margin.left || left > this.state.width + this.state.margin.left 
      || top < this.state.margin.top || top > this.state.height + this.state.margin.top) {
      this.refs.tooltip.hideTooltip();
      return;
    }

    const adjustedLeft = left - this.state.margin.left;

    const testable = this.props.getHitTestableData();
    const hits = testable;

    if (hits.length === 0) {
      return;
    }

    const hitX = hits
      .reduce((prev,cur) => {
        return (Math.abs(cur - adjustedLeft) < Math.abs(prev -adjustedLeft) ? cur : prev);
    });
      
    const el = this.props.data[hits.indexOf(hitX)];
    const presentation = this.props.getTooltipPresentation(el);

    this.refs.tooltip.showTooltip(left, top-presentation.offset, presentation.view);
  }

  handleScrollChange(scroll) {

    this.setState({
      scrollPercent: scroll
    }, () => {

      this.update();

      this.props.onChartChanged();
    });
  }

  increaseZoom() {

    if (this.state.zoom <= 0) {
      return;
    }

    this.setState({
      zoom: this.state.zoom-1,
      pageSize: this.state.zoomLevels[this.state.zoom-1]
    }, () => {

      this.update();

      this.props.onChartChanged();
    });
  }

  decreaseZoom() {

    if (this.state.zoom >= this.state.zoomLevels.length-1) {
      return;
    }

    this.setState({
      zoom: this.state.zoom+1,
      pageSize: this.state.zoomLevels[this.state.zoom+1]
    }, () => {

      this.update();

      this.props.onChartChanged();
    });
  }

  render() {

    if (!this.props.data) {
      return (
        <div style={{ ...this.props.style, display: "flex", flexDirection: "column", position: "relative", height: "100%", width: "100%" }}>
          <div style={{display: "flex", alignItems: "center", width: "100%", height: "100%"}}>
            <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
          </div>
        </div>
      )
    }

    const data = this.props.data;

    return (
      <div style={{ ...this.props.style, display: "flex", flexDirection: "column", position: "relative", height: "100%", width: "100%" }}>
        <div ref="header">
          {
            this.props.title ? 
              <div style={{display: "inline-block", color: "#59c8e2", marginRight: "1rem", verticalAlign: "middle"}}>
              {this.props.title}
              </div>
              : false
          }
          <div style={{display: "inline-block", marginRight: "1rem", verticalAlign: "middle"}}>
          {
            this.props.frequencyLevels ? 
            <SelectField style={{width: "150px"}} value={Object.keys(this.props.frequencyLevels).findIndex(el=>el===this.state.frequency)} onChange={this.setFrequency}>
              {
                Object.keys(this.props.frequencyLevels).map((el, i) => {
                  return (
                    <MenuItem key={i} type="text" value={i} primaryText={this.props.frequencyLevels[el]} style={{cursor: "pointer"}} />
                  )
                })
              }
            </SelectField> : false
          }
          </div>
          <div style={{display: "inline-block"}}>
            {
              data.length > 0 ?
              <div style={{verticalAlign: "middle", display: "inline-block"}}>
                Showing <i>{formatDate(data[data.length - 1].time)}</i> to <i>{formatDate(data[0].time)}</i>
              </div> : false
            }
            <div style={{display: "inline-block", marginLeft: "1rem", verticalAlign: "middle"}}>
              <IconButton tooltip="Zoom In" onClick={()=>this.increaseZoom()}>
                <PlusIcon />
              </IconButton>
              <IconButton tooltip="Zoom Out" onClick={()=>this.decreaseZoom()}>
                <MinusIcon />
              </IconButton>
            </div>
          </div>
        </div>
        <div style={{display: "flex", width: "100%", height: "100%"}}>
          <div ref="chart_anchor" className={s.chart}>
            <svg onMouseMove={(ev) => this.handleMouseMove(ev)} onMouseOut={()=>this.handleMouseOut()} width={this.state.width+this.state.margin.left+this.state.margin.right} height={this.state.height+this.state.margin.top+this.state.margin.bottom}>
              <g style={{transform: `translate(${this.state.margin.left}px, ${this.state.margin.top}px)`}}>
                {this.props.children}
              </g>
            </svg>
          <Tooltip ref="tooltip" />
          </div>
        </div>
      </div>
    );
  }
}

export default ChartContainer;