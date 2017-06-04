/* eslint-disable global-require */
import React from 'react';
import s from './PortfoliosSpiderChart.scss';
import Measure from '../UI/Measure';
import Circle from '../Charts/Circle';
import Tooltip from '../Charts/Tooltip';
import { formatNumberUnit } from '../../utilities';
import { itemIDToName } from '../../market';

import CircularProgress from 'material-ui/CircularProgress';

class SpiderChartContent extends React.Component {

  static propTypes = {

    portfolio: React.PropTypes.object,
    offsetWidth: React.PropTypes.number,
    offsetHeight: React.PropTypes.number
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
      height: 700,
      highlightedArea: 0 // 1 for components, 2 for materials
    };
  }

  handleMouseOut(ev) {

    this.refs.tooltip.hideTooltip();
  }

  handleMouseOverCircle(ev, el, type) {

    const top = ev.clientY - ev.currentTarget.getScreenCTM().f;
    const left = ev.clientX - ev.currentTarget.getScreenCTM().e;

    const content = type === 2 ? <div>Build Cost: {formatNumberUnit(el.materialCost || 0)}</div>:<div>Buy Cost: {formatNumberUnit(el.totalPrice || 0)}</div>;

    this.refs.tooltip.showTooltip(left, top - 20, content);
  }

  getSize() {
    return Math.min(this.props.offsetWidth, this.state.height - this.state.margin.top - this.state.margin.bottom);
  }

  getComponentCount() {
    return this.props.portfolio.components.length;
  }

  getMaxPrice() {
    return Math.max(...this.props.portfolio.components.map(el => el.totalPrice || 1), ...this.props.portfolio.components.map(el => el.materialCost || 1));
  }

  renderLegend() {

    const legend = [];
    let offset = 15;

    legend.push(<text key={legend.length} fill='#59c8e2' fontSize='16' x={offset} y='0' textAnchor='start' alignmentBaseline='middle'>Component Value</text>);
    offset += 136;

    legend.push(<text key={legend.length} fill='#eba91b' fontSize='16' x={offset} y='0' textAnchor='start' alignmentBaseline='middle'>Material Value</text>);
    offset += 112;

    return (
      <g>
      {legend}
      </g>
    );
  }

  renderComponentCircles() {

    const size = this.getSize();
    const radians = Math.PI * 2;
    const componentCount = this.getComponentCount();
    const maxPrice = this.getMaxPrice();
    const radius = size / 2;

    return this.props.portfolio.components.map((el, i) => {
      return (
        <Circle onMouseOver={(ev)=>this.handleMouseOverCircle(ev, el, 1)} onMouseOut={()=>this.handleMouseOut()} key={i} fill='#59c8e2' cx={radius*(1-(Math.max(el.totalPrice || 0, 0)/maxPrice)*(Math.sin(i*radians/componentCount)))} cy={radius*(1-(Math.max(el.totalPrice || 0, 0)/maxPrice)*(Math.cos(i*radians/componentCount)))} r={5} />
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
          ].join(',')
        )
      }
    );

    const materialPath = 
      this.props.portfolio.components.map((d, i) => {
        return (
          [
            radius*(1-(Math.max(d.materialCost || 0, 0)/maxPrice)*Math.sin(i*radians/componentCount)),
            radius*(1-(Math.max(d.materialCost || 0, 0)/maxPrice)*Math.cos(i*radians/componentCount))
          ].join(',')
        )
      }
    );

    return (
      <g>
      {
        this.props.portfolio.components.map((el, i) => {
          return (
            <g key={i}>
              <line x1={radius} y1={radius} x2={radius * (1-Math.sin(i*radians/componentCount))} y2={radius * (1-Math.cos (i*radians/componentCount))} stroke='#bdbdbd' strokeWidth='1px' />
              {
                Array(levels).fill().map((_, segment) => {

                  const factor = radius * ((segment) / levels);

                  return (
                    <line key={segment} style={{transform: `translate(${radius - factor}px, ${radius - factor}px)`}} x1={factor*(1-Math.sin(i*radians/componentCount))} y1={factor*(1-Math.cos(i*radians/componentCount))} x2={factor*(1-Math.sin((i+1)*radians/componentCount))} y2={factor*(1-Math.cos((i+1)*radians/componentCount))} stroke='#bdbdbd' strokeOpacity='0.75' strokeWidth='0.5px' />
                  );
                })
              }
              <text fontSize='0.95em' fill='#95a1ac' x={radius*(1-Math.sin(i*radians/componentCount))-30*Math.sin(i*radians/componentCount)} y={radius*(1-Math.cos(i*radians/componentCount))-20*Math.cos(i*radians/componentCount)} textAnchor='middle' dy='1em' style={{transform: `translate(0, -10px)`}}>{itemIDToName(el.typeID)}</text>
            </g>
          );
        })
      }
      {
        Array(levels).fill().map((_, segment) => {

          const factor = radius * ((segment + 1) / levels);

          return (
            <text fontSize='0.85em' key={segment} x={factor*(1-Math.sin(0))} y={factor*(1-Math.cos(0))} fill='#95a1ac' style={{transform: `translate(${radius - factor+5}px, ${radius - factor}px)`}} >{formatNumberUnit((segment+1)*maxPrice / levels)}</text>
          );
        })
      }
      <polygon
        points={componentPath}
        fill='#59c8e2'
        fillOpacity={this.state.highlighted===1?'0.8':(this.state.highlighted===2?'0.2':'0.5')}
        stroke='#59c8e2'
        strokeWidth='2px'
        onMouseOver={()=>this.setState({highlighted:1})}
        onMouseOut={()=>this.setState({highlighted:0})}
      />
      {
        this.props.portfolio.materials && this.props.portfolio.materials.length ? 
          <polygon
            points={materialPath}
            fill='#eba91b'
            fillOpacity={this.state.highlighted===2?'0.8':(this.state.highlighted===1?'0.2':'0.5')}
            stroke='#eba91b'
            strokeWidth='2px'
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
      {
        this.renderLegend()
      }
      </g>
    );
  }

  render() {

    if (!this.props.offsetWidth || !this.props.offsetWidth) {
      return (<div />);
    }

    const size = Math.min(this.props.offsetWidth, this.state.height-this.state.margin.top-this.state.margin.bottom);

    return (
      <div>
        <svg width={this.props.offsetWidth} height={this.state.height}>
          <g style={{transform: `translate(${(this.props.offsetWidth - size) / 2 + this.state.margin.left}px, ${(this.state.height - size) / 2}px)`}}>
          {
            this.renderChart()
          }
          </g>
        </svg>
        <Tooltip ref='tooltip' style={{transform: `translate(${(this.props.offsetWidth - size) / 2 + this.state.margin.left}px, ${(this.state.height - size) / 2}px)`}} />
      </div>
    );
  }
}

export default class PortfoliosSpiderChart extends React.Component {

  static propTypes = {

    portfolio: React.PropTypes.object
  };

  render() {

    if (!this.props.portfolio.components) {
      return (
        <div style={{display: 'flex', alignItems: 'center', width: '100%', height: '100%'}}>
          <CircularProgress color='#eba91b' style={{margin: '0 auto'}}/>
        </div>
      );
    }

    if (this.props.portfolio.materialCost === 0) {
      return (
        <div style={{ marginTop: '1rem' }}>
        Chart is still updating and should be completed within the next 5 minutes.
        </div>
      );
    }

    return (
      <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex' }}>
        <Measure>
          <SpiderChartContent {...this.props} />
        </Measure>
      </div>
    );
  }
}
