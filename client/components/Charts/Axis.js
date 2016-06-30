/* eslint-disable global-require */
import React from 'react';
import { select, axisLeft, axisBottom, axisRight } from '../../d3.js';
import s from './Axis.scss';
import cx from 'classnames';

export default class Axis extends React.Component {

  static propTypes = {

    format: React.PropTypes.string,
    tickSize: React.PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      anchor: this.props.anchor || "left",
      classname: this.props.className !== undefined ? cx(s.root, this.props.className) : s.root
    };

    switch (this.state.anchor) {

      case "bottom":
        this.state.axis = axisBottom(this.props.scale);
        break;
      case "left":
        this.state.axis = axisLeft(this.props.scale);
        break;
      case "right":
        this.state.axis = axisRight(this.props.scale);
        break;
    }
  }

  update() {

    if (this.props.format) {
      this.state.axis.ticks(this.props.ticks, this.props.format);
    }
    else {
      this.state.axis.ticks(this.props.ticks);
    }

    if (this.props.tickSize) {
      this.state.axis.tickSize(this.props.tickSize, 0, 0);
    }

    this.state.axis(select(this.refs.axis));
  }

  componentDidMount() {

    this.update();
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;

    this.update();
  }

  render() {
    return (
      <g className={this.state.classname} ref="axis" style={this.props.style} />
    )
  }
}