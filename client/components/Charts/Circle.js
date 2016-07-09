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

  constructor(props) {
    super(props);

    this.state = {
      fill: this.props.fill || "#eba91b"
    };
  }

  handleMouseOver(ev) {

    if (this.props.mouseOver) {
      this.props.mouseOver(ev, this.props.data, "spread");
    }

    this.setState({
      fill: this.props.fill || "rgb(255, 222, 78)"
    });
  }

  handleMouseOut() {

    if (this.props.mouseOut) {
      this.props.mouseOut();
    }

    this.setState({
      fill: this.props.fill || "#eba91b"
    });
  }

  render() {
    return (
      <circle style={this.props.style} cx={this.props.cx} cy={this.props.cy} onMouseOver={(ev)=>{ this.handleMouseOver(ev); }} onMouseOut={()=>{ this.handleMouseOut(); }}  fill={this.state.fill} r={this.props.r} />
    )
  }
}