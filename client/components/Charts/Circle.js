import React from 'react';

export default class Circle extends React.Component {

  static propTypes = {

    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    data: React.PropTypes.object,
    r: React.PropTypes.number,
    fill: React.PropTypes.string,
    style: React.PropTypes.object,
    onMouseOver: React.PropTypes.func,
    onMouseOut: React.PropTypes.func
  };

  render() {
    return (
      <circle
        onMouseOver={(ev)=>this.props.onMouseOver?this.props.onMouseOver(ev):false}
        onMouseOut={(ev)=>this.props.onMouseOver?this.props.onMouseOut(ev):false}
        style={this.props.style}
        cx={this.props.cx}
        cy={this.props.cy}
        fill={this.props.fill || "#eba91b"}
        r={this.props.r}
      />
    )
  }
}