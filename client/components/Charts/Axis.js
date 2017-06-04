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
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    anchor: React.PropTypes.string,
    timeScale: React.PropTypes.func,
    leftDataScale: React.PropTypes.func,
    rightDataScale: React.PropTypes.func,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    horizontalLines: React.PropTypes.bool, // Treat this axis as horizontal lines across the chart
    tickCount: React.PropTypes.number
  };

  static defaultProps = {
    tickCount: 10,
    horizontalLines: false,
    style: {}
  };

  update() {

    let axis = null;

    switch (this.props.anchor) {
      case 'bottom':
        axis = axisBottom(this.props.timeScale);
        break;
      case 'right':
        axis = axisRight(this.props.rightDataScale);
        break;
      default:
        axis = axisLeft(this.props.leftDataScale);
        break;
    }

    if (this.props.format) {
      axis.ticks(this.props.tickCount, this.props.format);
    } else {
      axis.ticks(this.props.tickCount);
    }

    if (this.props.horizontalLines) {
      axis.tickSize(-this.props.width, 0, 0);
      axis.tickFormat('');
    }

    axis(select(this.refs.axis));

    if (this.props.formatISK) {

      const children = ReactDOM.findDOMNode(this.refs.axis).children;

      if (children.length > 1) {

        for (let i = 1; i < children.length; i++) {

          const text = children[i].children[1].innerHTML;

          const num = parseInt(text.replace(/,/g, ''), 10);

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

    const {
      height,
      width,
      horizontalLines,
      className,
      anchor,
      style: propStyle
    } = this.props;

    const yt = anchor === 'bottom' ? height : 0;
    const xt = anchor === 'right' ? width : 0;

    const style = Object.assign({}, {
      opacity: horizontalLines ? 0.5 : 1,
      transform: `translateX(${xt}px) translateY(${yt}px)`
    }, propStyle);

    return (
      <g className={cx(s.root, className)} ref='axis' style={style} />
    );
  }
}
