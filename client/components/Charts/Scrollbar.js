/* eslint-disable global-require */
import React from 'react';
import s from './Scrollbar.scss';

export default class Scrollbar extends React.Component {

  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    onScrollChange: React.PropTypes.func,
    pageSize: React.PropTypes.number,
    data: React.PropTypes.array,
    fullData: React.PropTypes.array
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

  componentDidMount() {

    this.listen = true;

    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));

    this.update();
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;

    this.update();
  }

  componentWillUnmount() {

    this.listen = false;

    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  update() {

    if (!this.props.fullData.length || !this.props.width || (this.props.width === this.state.contextWidth && this.props.fullData.length === this.state.dataSize)) {
      return;
    }

    let startX = this.state.startX;

    if (this.props.fullData.length !== this.state.dataSize) {

      // reset variables if data changes
      startX = 0;
    }

    let barWidth = 0;

    if (this.props.data.length >= this.props.pageSize) {

      // const minimum = 0;
      const maximum = Math.max(this.props.width, this.props.width * (this.props.fullData.length / this.props.pageSize));
      const thumbLength = this.props.width / (maximum) * this.props.width;

      barWidth = Math.max(thumbLength, 25);
    }

    this.setState({
      handleX: this.props.width - barWidth,
      contextWidth: this.props.width,
      dataSize: this.props.fullData.length,
      barWidth,
      startX
    });
  }

  handleMouseMove(ev) {

    if (!this.listen) {
      return;
    }

    if (this.state.dragging) {

      const delta = ev.clientX - this.state.startX;
      const x = Math.min(Math.max(delta + this.state.handleX, 0), this.props.width - this.state.barWidth);

      if (delta < this.state.resistance || delta > this.state.resistance) {
        this.setState({
          handleX: x,
          startX: ev.clientX
        });

        this.props.onScrollChange((x + this.state.barWidth) / this.props.width);
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
        <rect className={s.bar} x={0} y={this.props.height + 25} width={this.props.width} height={12} />
        <rect className={s.handle} onMouseDown={ev => this.handleMouseDown(ev)} x={this.state.handleX} y={this.props.height + 25} width={this.state.barWidth} height={12} />
      </g>
    );
  }
}
