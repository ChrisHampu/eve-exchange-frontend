/* eslint-disable global-require */
import React from 'react';
import { curveCatmullRom, line } from '../../d3.js';
import Circle from './Circle';

export default class Line extends React.Component {

  static propTypes = {

    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func,
    viewportHeight: React.PropTypes.number,
    fill: React.PropTypes.string
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

    const hits = this.props.data.map(el => this.props.xScale(this.props.xAccessor(el)));

    const hitX = hits
      .reduce((prev,cur) => {
        return (Math.abs(cur - left) < Math.abs(prev - left) ? cur : prev);
    });
      
    const el = this.props.data[hits.indexOf(hitX)];

    if (this.props.mouseOver) {
      this.props.mouseOver(ev, { ...el, x: left, y: top }, el.profit ? "profit" : "market_area");
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

    const _line = line()
      .x(d => this.props.xScale(this.props.xAccessor(d)))
      .y(d => this.props.yScale(this.props.yAccessor(d)))
      .curve(curveCatmullRom.alpha(0.5));

    const linepath = _line(this.props.data);

    const fill = this.props.fill || "rgb(89, 200, 226)";

    return (
      <g>
        <path
          d={linepath}
          fill="none"
          stroke={fill}
          strokeWidth={3}
        />
        {
        this.props.data.map((el, i) => {
          return (
            <Circle
              fill={fill}
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