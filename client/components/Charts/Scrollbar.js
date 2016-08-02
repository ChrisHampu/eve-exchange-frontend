/* eslint-disable global-require */
import React from 'react';
import s from './Scrollbar.scss';

export default class Scrollbar extends React.Component {

  static propTypes = {

    chartWidth: React.PropTypes.number,
    chartHeight: React.PropTypes.number,
    dataSize: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    onScrollChange: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    let barWidth = 0;

    if (this.props.dataSize >= this.props.pageSize ) {
      barWidth = this.props.dataSize ? Math.max(Math.round(this.props.chartWidth / this.props.dataSize), 25) : 100;
    }

    this.state = {
      dragging: false,
      handleX: this.props.chartWidth - barWidth,
      startX: 0,
      barWidth: barWidth,
      resistance: 3
    }; 
  }

  componentDidMount() {

    this.listen = true;

    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  componentWillUnmount() {

    this.listen = false;

    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  handleMouseMove(ev) {

    if (!this.listen) {
      return;
    }

    if (this.state.dragging) {

      let delta = ev.clientX - this.state.startX;
      let x = Math.min(Math.max(delta + this.state.handleX, 0), this.props.chartWidth - this.state.barWidth);

      if (delta < this.state.resistance || delta > this.state.resistance) {
        this.setState({
          handleX: x,
          startX: ev.clientX
        });

        this.props.onScrollChange((x + this.state.barWidth) / this.props.chartWidth );
      }
    }
  }

  handleMouseDown(ev) {

    if (!this.listen) {
      return;
    }

    this.setState({
      dragging: true,
      startX: ev.clientX
    });

    ev.preventDefault();
    ev.stopPropagation();
  }

  handleMouseUp() {

    if (!this.listen) {
      return;
    }

    this.setState({
      dragging: false
    });
  }

  render() {

    return (
      <g className={s.root}>
        <rect className={s.bar} x={0} y={this.props.chartHeight+25} width={this.props.chartWidth} height={12} />
        <rect className={s.handle} onMouseDown={ev=>this.handleMouseDown(ev)}  x={this.state.handleX} y={this.props.chartHeight+25} width={this.state.barWidth} height={12} />
      </g>
    )
  }
}