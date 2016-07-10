/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { select, axisLeft, axisBottom, axisRight } from '../../d3.js';
import s from './Axis.scss';
import cx from 'classnames';

export default class Axis extends React.Component {

  static propTypes = {

    format: React.PropTypes.string,
    formatISK: React.PropTypes.bool,
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

    if (this.props.formatISK) {

      const children = ReactDOM.findDOMNode(this.refs.axis).children;

      if (children.length > 1) {

        for (let i = 1; i < children.length; i++) {
        
          const text = children[i].children[1].innerHTML;

          let num = parseInt(text.replace(/,/g, ""));
          let suffix = "";

          if (num > 1000000000) {
            num /= 1000000000;
            suffix = "B";
          } else if (num > 1000000) {
            num /= 1000000;
            suffix = "M";
          } else if (num > 1000) {
            num /= 1000;
            suffix = "K";
          }

          children[i].children[1].innerHTML = num.toString() + suffix;
        }
        
      }
    }
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