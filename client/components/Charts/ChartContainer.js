/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import s from './ChartContainer.scss';
import { formatDate } from '../../utilities';

import Tooltip from './Tooltip';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

import PlusIcon from 'material-ui/svg-icons/content/add';
import MinusIcon from 'material-ui/svg-icons/content/remove';

class ChartContainer extends React.Component {

  static propTypes = {

    frequencyLevels: React.PropTypes.object.isRequired,
    data: React.PropTypes.array.isRequired,
    title: React.PropTypes.string,
    onChartChanged: React.PropTypes.func.isRequired,
    marginRight: React.PropTypes.number
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
        left: 50
      },
      height: 0,
      width: 0,
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
    }
  }

  getChildContext() {
    return {
      width: this.state.width,
      height: this.state.height,
      pageSize: this.state.pageSize,
      dataSize: this.props.data.length
    }
  }

  update() {

    this.state.height = ReactDOM.findDOMNode(this.refs.chart_anchor).clientHeight - this.state.margin.top - this.state.margin.bottom - 5;
    this.state.width = ReactDOM.findDOMNode(this.refs.chart_anchor).clientWidth - this.state.margin.left - this.state.margin.right;

    this.setState({
      width: this.state.width,
      height: this.state.height
    });
  }

  componentDidMount() {

    this.update();
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

  handleMouseOver(ev, item, presentation) {

    this.refs.tooltip.showTooltip(ev, item, presentation);
  }

  handleMouseOut(ev) {

    this.refs.tooltip.hideTooltip();
  }

  setFrequency = (event, index, value) => {

    this.setState({
      frequency: Object.keys(this.props.frequencyLevels)[value]
    }, () => {

      this.update();

      this.props.onChartChanged();
    });
  };

  handleScrollChange(scroll) {

    this.setState({
      scrollPercent: scroll
    }, () => {

      this.update();

      this.props.onChartChanged();
    });
  }

  increaseZoom() {

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

  decreaseZoom() {

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

  render() {

    const data = this.props.data;

    return (
      <div style={{ ...this.props.style, display: "flex", flexDirection: "column", position: "relative", height: "100%", width: "100%" }}>
        <div>
          {
            this.props.title ? 
              <div style={{display: "inline-block", color: "#59c8e2", marginRight: "1rem"}}>
              {this.props.title}
              </div>
              : false
          }
          <div style={{display: "inline-block", marginRight: "1rem"}}>
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
            <svg width={this.state.width+this.state.margin.left+this.state.margin.right} height={this.state.height+this.state.margin.top+this.state.margin.bottom}>
              <g style={{transform: `translate(${this.state.margin.left}px, ${this.state.margin.top}px)`}}>
                {this.props.children}
             </g>
            </svg>
            <Tooltip margin={this.state.margin} ref="tooltip" />
          </div>
        </div>
      </div>
    );
  }
}

export default ChartContainer;