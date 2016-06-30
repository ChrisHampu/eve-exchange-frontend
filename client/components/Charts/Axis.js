/* eslint-disable global-require */
import React from 'react';
import { select, axisLeft, axisBottom } from '../../d3.js';
import s from './Axis.scss';
import cx from 'classnames';

export default class Axis extends React.Component {

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
    }
  }

  update() {

    this.state.axis.ticks(this.props.ticks);
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