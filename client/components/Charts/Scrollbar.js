/* eslint-disable global-require */
import React from 'react';
import s from './Scrollbar.scss';

export default class Scrollbar extends React.Component {

  static propTypes = {

    onScrollChange: React.PropTypes.func
  };

  static contextTypes = {

    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    pageSize: React.PropTypes.number.isRequired,
    dataSize: React.PropTypes.number.isRequired,
    totalDataSize: React.PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      dragging: false,
      handleX: 0,
      startX: 0,
      barWidth: 0,
      contextWidth: 0,
      resistance: 3,
      dataSize: 0
    }; 
  }

  update() {

    if (!this.context.totalDataSize || !this.context.width || (this.context.width === this.state.contextWidth && this.context.totalDataSize == this.state.dataSize)) {
      return;
    }

    let startX = this.state.startX;

    if (this.context.totalDataSize !== this.state.dataSize) {

      // reset variables if data changes
      startX = 0;
    }

    let barWidth = 0;

    if (this.context.dataSize >= this.context.pageSize ) {

      const minimum = 0;
      const maximum = Math.max(this.context.width, this.context.width * (this.context.totalDataSize / this.context.pageSize));
      const thumbLength = this.context.width / (maximum) * this.context.width;

      barWidth = Math.max(thumbLength, 25);
    }

    this.setState({
      handleX: this.context.width - barWidth,
      barWidth: barWidth,
      contextWidth: this.context.width,
      dataSize: this.context.totalDataSize,
      startX: startX
    });
  }

  componentDidMount() {

    this.listen = true;

    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));

    this.update();
  }

  componentWillReceiveProps() {

    this.update();
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
      let x = Math.min(Math.max(delta + this.state.handleX, 0), this.context.width - this.state.barWidth);

      if (delta < this.state.resistance || delta > this.state.resistance) {
        this.setState({
          handleX: x,
          startX: ev.clientX
        });

        this.props.onScrollChange((x + this.state.barWidth) / this.context.width);
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
        <rect className={s.bar} x={0} y={this.context.height+25} width={this.context.width} height={12} />
        <rect className={s.handle} onMouseDown={ev=>this.handleMouseDown(ev)}  x={this.state.handleX} y={this.context.height+25} width={this.state.barWidth} height={12} />
      </g>
    )
  }
}