/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { select, axisLeft, axisBottom, axisRight } from '../../vendor/d3';
import s from './Axis.scss';
import cx from 'classnames';
import { formatNumberUnit } from '../../utilities';

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

          children[i].children[1].innerHTML = formatNumberUnit(num);
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