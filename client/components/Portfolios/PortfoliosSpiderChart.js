/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import s from './PortfoliosSpiderChart.scss';
import Circle from '../Charts/Circle';
import Tooltip from '../Charts/Tooltip';
import { formatNumberUnit } from '../../utilities';
import { itemIDToName } from '../../market';

import CircularProgress from 'material-ui/CircularProgress';

export default class PortfoliosSpiderChart extends React.Component {

  static propTypes = {

    portfolio: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      margin: {
        top: 40,
        right: 0,
        bottom: 40,
        left: 0
      },
      highlightedArea: 0 //1 for components, 2 for materials
    }
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  componentWillReceiveProps(nextProps) {

    this.props = nextProps;
  }

  handleMouseOut(ev) {

    this.refs.tooltip.hideTooltip();
  }

  handleMouseOverCircle(ev, el, type) {

    const top = ev.clientY - ev.currentTarget.getScreenCTM().f;
    const left = ev.clientX - ev.currentTarget.getScreenCTM().e;

    const content = type === 2 ? <div>Build Cost: {formatNumberUnit(el.materialCost || 0)}</div>:<div>Buy Cost: {formatNumberUnit(el.totalPrice || 0)}</div>;

    this.refs.tooltip.showTooltip(left, top-20, content);
  }

  getSize() {
    return Math.min(this.props.width, this.props.height-this.state.margin.top-this.state.margin.bottom);
  }

  getComponentCount() {
    return this.props.portfolio.components.length;
  }

  getMaxPrice() {
    return Math.max(...this.props.portfolio.components.map(el => el.totalPrice || 1), ...this.props.portfolio.components.map(el => el.materialCost || 1));
  }

  renderComponentCircles() {

    const size = this.getSize();
    const radians = Math.PI * 2;
    const componentCount = this.getComponentCount();
    const maxPrice = this.getMaxPrice();
    const radius = size / 2;

    return this.props.portfolio.components.map((el, i) => {
      return (
        <Circle onMouseOver={(ev)=>this.handleMouseOverCircle(ev, el, 1)} onMouseOut={()=>this.handleMouseOut()} key={i} fill="#59c8e2" cx={radius*(1-(Math.max(el.totalPrice || 0, 0)/maxPrice)*(Math.sin(i*radians/componentCount)))} cy={radius*(1-(Math.max(el.totalPrice || 0, 0)/maxPrice)*(Math.cos(i*radians/componentCount)))} r={5} />
      )
    })
  }

  renderMaterialCircles() {

    const size = this.getSize();
    const radians = Math.PI * 2;
    const componentCount = this.getComponentCount();
    const maxPrice = this.getMaxPrice();
    const radius = size / 2;

    if (!this.props.portfolio.materials || this.props.portfolio.materials.length == 0) {
      return;
    }

    return this.props.portfolio.components.map((el, i) => {
      return (
        <Circle onMouseOver={(ev)=>this.handleMouseOverCircle(ev, el, 2)} onMouseOut={()=>this.handleMouseOut()} key={i} cx={radius*(1-(Math.max(el.materialCost || 0, 0)/maxPrice)*(Math.sin(i*radians/componentCount)))} cy={radius*(1-(Math.max(el.materialCost || 0, 0)/maxPrice)*(Math.cos(i*radians/componentCount)))} r={5} />
      )
    })
  }

  renderChart() {

    if (!this.props.portfolio.components) {
      return;
    }

    const size = this.getSize();
    const radians = Math.PI * 2;
    const componentCount = this.getComponentCount();
    const maxPrice = this.getMaxPrice();
    const radius = size / 2;
    const levels = 5;

    const componentPath = 
      this.props.portfolio.components.map((d, i) => {
        return (
          [
            radius*(1-(Math.max(d.totalPrice || 0, 0)/maxPrice)*Math.sin(i*radians/componentCount)),
            radius*(1-(Math.max(d.totalPrice || 0, 0)/maxPrice)*Math.cos(i*radians/componentCount))
          ].join(",")
        )
      }
    );

    const materialPath = 
      this.props.portfolio.components.map((d, i) => {
        return (
          [
            radius*(1-(Math.max(d.materialCost || 0, 0)/maxPrice)*Math.sin(i*radians/componentCount)),
            radius*(1-(Math.max(d.materialCost || 0, 0)/maxPrice)*Math.cos(i*radians/componentCount))
          ].join(",")
        )
      }
    );

    return (
      <g>
      {
        this.props.portfolio.components.map((el, i) => {
          return (
            <g key={i}>
              <line x1={radius} y1={radius} x2={radius * (1-Math.sin(i*radians/componentCount))} y2={radius * (1-Math.cos (i*radians/componentCount))} stroke="#bdbdbd" strokeWidth="1px" />
              {
                [...Array(levels).keys()].map(segment => {

                  const factor = radius * ((segment) / levels);

                  return (
                    <line key={segment} style={{transform: `translate(${radius - factor}px, ${radius - factor}px)`}} x1={factor*(1-Math.sin(i*radians/componentCount))} y1={factor*(1-Math.cos(i*radians/componentCount))} x2={factor*(1-Math.sin((i+1)*radians/componentCount))} y2={factor*(1-Math.cos((i+1)*radians/componentCount))} stroke="#bdbdbd" strokeOpacity="0.75" strokeWidth="0.5px" />
                  )
                })
              }
              <text fontSize="0.95em" fill="#95a1ac" x={radius*(1-Math.sin(i*radians/componentCount))-30*Math.sin(i*radians/componentCount)} y={radius*(1-Math.cos(i*radians/componentCount))-20*Math.cos(i*radians/componentCount)} textAnchor="middle" dy="1em" style={{transform: `translate(0, -10px)`}}>{itemIDToName(el.typeID)}</text>
           </g>
          )
        })
      }
      {
        [...Array(levels).keys()].map((segment, i) => {

          const factor = radius * ((segment+1) / levels);

          return (
            <text fontSize="0.85em" key={i} x={factor*(1-Math.sin(0))} y={factor*(1-Math.cos(0))} fill="#95a1ac" style={{transform: `translate(${radius - factor+5}px, ${radius - factor}px)`}} >{formatNumberUnit((segment+1)*maxPrice / levels)}</text>
          )
        })
      }
      <polygon
        points={componentPath}
        fill="#59c8e2"
        fillOpacity={this.state.highlighted===1?"0.8":(this.state.highlighted===2?"0.2":"0.5")}
        stroke="#59c8e2"
        strokeWidth="2px"
        onMouseOver={()=>this.setState({highlighted:1})}
        onMouseOut={()=>this.setState({highlighted:0})}
      />
      {
        this.props.portfolio.materials && this.props.portfolio.materials.length ? 
          <polygon
            points={materialPath}
            fill="#eba91b"
            fillOpacity={this.state.highlighted===2?"0.8":(this.state.highlighted===1?"0.2":"0.5")}
            stroke="#eba91b"
            strokeWidth="2px"
            onMouseOver={()=>this.setState({highlighted:2})}
            onMouseOut={()=>this.setState({highlighted:0})}
          /> : false
      }
      {
        this.state.highlighted === 1 ?
          <g>
          {
            this.renderMaterialCircles()
          }
          {
            this.renderComponentCircles()
          }
          </g>
          :
          <g>
          {
            this.renderComponentCircles()
          }
          {
            this.renderMaterialCircles()
          }
          </g>
      }
      </g>
    );
  }

  render() {

    if (!this.props.portfolio.components) {
      return (
        <div style={{display: "flex", alignItems: "center", width: "100%", height: "100%"}}>
          <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
        </div>
      )
    }

    const size = Math.min(this.props.width, this.props.height-this.state.margin.top-this.state.margin.bottom);

    return (
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <svg width={this.props.width} height={this.props.height}>
          <g style={{transform: `translate(${(this.props.width - size) / 2 + this.state.margin.left}px, ${(this.props.height - size) / 2}px)`}}>
          {
            this.renderChart()
          }
          </g>
        </svg>
        <Tooltip ref="tooltip" style={{transform: `translate(${(this.props.width - size) / 2 + this.state.margin.left}px, ${(this.props.height - size) / 2}px)`}} />
      </div>
    );
  }
}