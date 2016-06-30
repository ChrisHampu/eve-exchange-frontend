/* eslint-disable global-require */
import React from 'react';
import s from './CandleStick.scss';

export default class CandleStick extends React.Component {

  static propTypes = {

    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    dataElem: React.PropTypes.object,
    barWidth: React.PropTypes.number,
    viewportHeight: React.PropTypes.number
  };

  constructor(props) {
    super(props)
  }

  update() {

    const el = this.props.dataElem;

    this.setState({
      cx: this.props.xScale(el.date) - 0.5 * this.props.barWidth,
      cy: this.props.viewportHeight - this.props.yScale(el.volume),
      barHeight: this.props.yScale(el.volume),
      barWidth: this.props.barWidth,
      fill: "#59c8e2"
    });
  }

  componentWillMount() {

    this.update();
  }

  componentWillReceiveProps(nextProps) {

    this.props = nextProps;
    this.update();
  }

  render() {

    return (
      <g>
        <rect onMouseOver={(ev)=>{this.props.mouseOver(ev,this.props.dataElem,"volume");}} mouseOut={()=>{this.props.mouseOut();}} x={this.state.cx} y={this.state.cy} width={this.state.barWidth} height={this.state.barHeight} fill={this.state.fill} />
      </g>
    )
  }
}