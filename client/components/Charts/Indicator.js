/* eslint-disable global-require */
import React from 'react';

class Circle extends React.Component {

  static propTypes = {

    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    data: React.PropTypes.object,
    r: React.PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      fill: "#eba91b"
    };
  }

  handleMouseOver(ev) {

    this.props.mouseOver(ev, this.props.data, "spread");

    this.setState({
      fill: "rgb(255, 222, 78)"
    });
  }

  handleMouseOut() {

    this.props.mouseOut();

    this.setState({
      fill: "#eba91b"
    });
  }

  render() {
    return (
      <circle cx={this.props.cx} cy={this.props.cy} onMouseOver={(ev)=>{ this.handleMouseOver(ev); }} onMouseOut={()=>{ this.handleMouseOut(); }}  fill={this.state.fill} r={this.props.r} />
    )
  }
}

export default class Indicator extends React.Component {

  static propTypes = {

    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    data: React.PropTypes.array,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      circleFill: "#eba91b"
    };
  }

  render() {

    return (
      <g>
      {
        this.props.data.map((el, i, arr) => {

          let line = null;

          if (i > 0) {

              let x1 = this.props.xScale(this.props.xAccessor(arr[i-1]));
              let y1 = this.props.yScale(this.props.yAccessor(arr[i-1]));
              let x2 = this.props.xScale(this.props.xAccessor(el));
              let y2 = this.props.yScale(this.props.yAccessor(el));

            line = <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={2} stroke="#59c8e2" />
          }

          return (
            line
          );
        })
      }
      {
        this.props.data.map((el, i) => {
          return (
            <Circle data={el} mouseOver={this.props.mouseOver} mouseOut={this.props.mouseOut} key={i} cx={this.props.xScale(this.props.xAccessor(el))} cy={this.props.yScale(this.props.yAccessor(el))} r={5} />
          );
        })
      }
      </g>
    )
  }
}