/* eslint-disable global-require */
import React from 'react';
import { area, curveCatmullRom, line } from '../../d3.js';
import Circle from './Circle';

export default class Area extends React.Component {

  static propTypes = {

    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    viewportHeight: React.PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      closestPoint: null
    };
  }

  handleMouseOver(ev) {

    const top = ev.clientY - ev.currentTarget.getScreenCTM().f;
    const left = ev.clientX - ev.currentTarget.getScreenCTM().e;

    const hits = this.props.data
      .map(el => this.props.xScale(this.props.xAccessor(el)));

    const hitX = hits
      .reduce((prev,cur) => {
        return (Math.abs(cur - left) < Math.abs(prev - left) ? cur : prev);
    });
      
    const el = this.props.data[hits.indexOf(hitX)];

    if (this.props.mouseOver) {
      this.props.mouseOver(ev, { ...el, x: left, y: top }, "area");
    }

    this.setState({
      closestPoint: el
    });
  }

  handleMouseOut() {

    if (this.props.mouseOut) {
      this.props.mouseOut();
    }

    this.setState({
      closestPoint: null
    });
  }

  render() {

    if (!this.props.viewportHeight) {
      return <g />;
    }

    const _area = area()
      .x(d => this.props.xScale(this.props.xAccessor(d)))
      .y0(d => this.props.viewportHeight)
      .y1(d => this.props.yScale(this.props.yAccessor(d)))
      .curve(curveCatmullRom.alpha(0.5));

    const path = _area(this.props.data);

    const _line = line()
      .x(d => this.props.xScale(this.props.xAccessor(d)))
      .y(d => this.props.yScale(this.props.yAccessor(d)))
      .curve(curveCatmullRom.alpha(0.5));

    const linepath = _line(this.props.data);

    return (
      <g>
       <defs>
          <linearGradient id="linear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="rgba(89, 200, 226, 0.3)"/>
            <stop offset="40%"   stopColor="rgba(89, 200, 226, 0.3)"/>
            <stop offset="100%" stopColor="rgba(89, 200, 226, 0.1)"/>
          </linearGradient>
        </defs>
        <path
          d={path}
          fill="url(#linear)"
          onMouseMove={(ev)=>{this.handleMouseOver(ev);}}
          onMouseOut={(ev)=>{this.handleMouseOut();}}
        />
        <path
          d={linepath}
          fill="none"
          stroke="rgb(89, 200, 226)"
          strokeWidth={3}
        />
        {
        this.props.data.map((el, i) => {
          return (
            <Circle
              fill="rgb(89, 200, 226)"
              data={el}
              key={i}
              cx={this.props.xScale(this.props.xAccessor(el))}
              cy={this.props.yScale(this.props.yAccessor(el))}
              r={this.state.closestPoint === el ? 8 : 5}
              style={{transition: "r 350ms ease-in-out"}}
              mouseOver={(ev)=>{this.handleMouseOver(ev);}}
              mouseOut={(ev)=>{this.handleMouseOut();}}
            />
          );
        })
        }
      </g>
    );
  }
}