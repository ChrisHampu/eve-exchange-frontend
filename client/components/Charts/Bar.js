/* eslint-disable global-require */
import React from 'react';
import s from './CandleStick.scss';

export default class Bar extends React.Component {

  static propTypes = {

    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    dataElem: React.PropTypes.object,
    barWidth: React.PropTypes.number,
    viewportHeight: React.PropTypes.number
  };

  constructor(props) {
    super(props)

    this.state = {
      mouseOver: false,
      fill: "#59c8e2"
    };
  }

  update() {

    const el = this.props.dataElem;

    this.setState({
      cx: this.props.xScale(el.date) - 0.5 * this.props.barWidth,
      cy: this.props.viewportHeight - this.props.yScale(el.volume),
      barHeight: this.props.yScale(el.volume),
      barWidth: this.props.barWidth,
    });
  }

  componentWillMount() {

    this.update();
  }

  componentWillReceiveProps(nextProps) {

    this.props = nextProps;
    this.update();
  }

  handleMouseOver(ev) {

    this.props.mouseOver(ev,this.props.dataElem,"volume");

    this.setState({
      mouseOver: true,
      fill: "rgb(145, 234, 255)"
    });
  }

  handleMouseOut() {

    this.props.mouseOut();

    this.setState({
      mouseOver: true,
      fill: "#59c8e2"
    });
  }

  render() {

    return (
      <g>
        <rect onMouseOver={(ev)=>{ this.handleMouseOver(ev); }} onMouseOut={()=>{ this.handleMouseOut(); }} x={this.state.cx} y={this.state.cy} width={this.state.barWidth} height={this.state.barHeight} fill={this.state.fill} />
      </g>
    )
  }
}