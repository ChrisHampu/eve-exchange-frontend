import React from 'react';

export default class Circle extends React.Component {

  static propTypes = {

    cx: React.PropTypes.number,
    cy: React.PropTypes.number,
    data: React.PropTypes.object,
    r: React.PropTypes.number,
    fill: React.PropTypes.string,
    style: React.PropTypes.object
  };

  render() {
    return (
      <circle style={this.props.style} cx={this.props.cx} cy={this.props.cy} fill={this.props.fill || "#eba91b"} r={this.props.r} />
    )
  }
}