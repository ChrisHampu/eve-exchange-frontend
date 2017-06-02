/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';

import throttle from 'lodash/throttle';

import Scale from './Scale';
import { resetChartState, setChartFocus } from '../../actions/appActions';
import { scaleUtc, scaleLinear, timeHour, timeMinute, timeDay } from '../../vendor/d3';
import { getPaginatedData } from '../../market';

class ChartContainer extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
    offsetWidth: React.PropTypes.number,
    height: React.PropTypes.number,
    timeAccessor: React.PropTypes.func,
    leftDataAccessor: React.PropTypes.func,
    rightDataAccessor: React.PropTypes.func,
    leftDataScale: React.PropTypes.object,
    data: React.PropTypes.array,
    scrollPercent: React.PropTypes.number,
    pageSize: React.PropTypes.number,
    frequency: React.PropTypes.string,
    chartState: React.PropTypes.object,
    hasScrollbar: React.PropTypes.bool
  };

  static defaultProps = {
    height: 200,
    pageSize: 30,
    hasScrollbar: false
  };

  constructor(props) {
    super(props);

    this.state = {
      timeScale: new Scale(scaleUtc, this.props.timeAccessor, () => 0, () => this.getAdjustedWidth(), null),
      leftDataScale: new Scale(scaleLinear, this.props.leftDataAccessor, () => this.getAdjustedHeight(), () => 0, [5]),
      rightDataScale: new Scale(scaleLinear, this.props.rightDataAccessor, () => this.getAdjustedHeight(), () => 0, [5]),
      focusPosition: null,
      focusIndex: null,
      margin: {
        top: 10,
        right: 35,
        bottom: props.hasScrollbar === true ? 45 : 25,
        left: 50
      }
    };
  }

  componentWillMount() {

    store.dispatch(resetChartState());
  }

  componentWillReceiveProps() {

  }

  getPaginatedData() {

    return getPaginatedData(this.props.data, this.props.pageSize, this.props.scrollPercent);
  }

  getHitTestableData() {

    if (!this.props.data) {
      return [];
    }

    return this.props.data.map(el => this.state.timeScale.scale(el.time));
  }

  getAdjustedWidth() {
    return Math.max(0, (this.props.offsetWidth || 0) - this.state.margin.left - this.state.margin.right);
  }

  getAdjustedHeight() {
    return Math.max(0, (this.props.height || 0) - this.state.margin.top - this.state.margin.bottom);
  }

  updateScales() {

    const data = this.props.data;
    const paginated = this.getPaginatedData();

    if (!data || !data.length) {
      return;
    }

    const frequency = this.props.frequency;

    let nice = timeDay;

    if (frequency === 'minutes') {
      nice = timeMinute;
    } else if (frequency === 'hours') {
      nice = timeHour;
    }

    //this.state.timeScale.setNice(nice);
    this.state.timeScale.update(paginated);

    // If the scale is passed in as a prop, the parent component is responsible
    // for updating the scale
    if (!this.props.leftDataScale) {
      this.state.leftDataScale.update(data);
    }

    this.state.rightDataScale.update(data);
  }

  throttledMouseMove = throttle((ev) => {

    const top = ev.clientY - ev.target.getScreenCTM().f;
    const left = ev.clientX - ev.target.getScreenCTM().e;

    if (left < this.state.margin.left || left > this.props.offsetWidth + this.state.margin.left
      || top < this.state.margin.top || top > this.props.height + this.state.margin.top) {
      return;
    }

    const adjustedLeft = left - this.state.margin.left;

    const testable = this.getHitTestableData();
    const hits = testable;

    if (hits.length === 0) {
      return;
    }

    const hitX = hits
      .reduce((prev, cur) => // eslint-disable-line no-confusing-arrow
        Math.abs(cur - adjustedLeft) < Math.abs(prev - adjustedLeft) ? cur : prev
    );

    const hitIndex = hits.indexOf(hitX);

    store.dispatch(setChartFocus(hitIndex));
  }, 16.6);

  handleMouseMove = (ev) => {

    ev.persist();

    this.throttledMouseMove(ev);
  };

  getFocusPosition() {

    const testable = this.getHitTestableData();

    const hitIndex = this.props.chartState.focusIndex;

    if (hitIndex === null) {
      return 0;
    }

    return testable[hitIndex];
  }

  render() {

    const {
      children,
      offsetWidth: width,
      height,
      timeAccessor,
      leftDataAccessor,
      rightDataAccessor,
      data,
      pageSize,
      chartState: {
        focusIndex
      }
    } = this.props;

    const {
      timeScale,
      leftDataScale,
      rightDataScale,
      margin
    } = this.state;

    const focusPosition = this.getFocusPosition();

    const childProps = {
      // Resize child graph elements to make room for the axis'
      width: this.getAdjustedWidth(),
      height: this.getAdjustedHeight(),
      timeScale: timeScale.scale,
      leftDataScale: this.props.leftDataScale ? this.props.leftDataScale.scale : leftDataScale.scale,
      rightDataScale: rightDataScale.scale,
      timeAccessor,
      leftDataAccessor,
      rightDataAccessor,
      data: data ? this.getPaginatedData() : [], // paginated
      fullData: data || [], // non-paginated
      focusIndex,
      focusPosition,
      pageSize,
      margin
    };

    this.updateScales();

    return (
      <div>
        <svg onMouseMove={(ev) => this.handleMouseMove(ev)} height={height} width={width}>
          <g style={{ transform: `translate(${margin.left}px, ${margin.top}px)` }}>
            {
              focusIndex !== null &&
                <line
                  x1={focusPosition}
                  x2={focusPosition}
                  y1={this.state.margin.top}
                  y2={this.props.height - this.state.margin.top - this.state.margin.bottom}
                  style={{ stroke: '#FEB100', strokeDasharray: 2, strokeWidth: 1 }}
                />
            }
            {
              React.Children.map(children, child =>
                child && React.cloneElement(child, Object.assign({}, childProps, child.props))
              )
            }
          </g>
        </svg>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return { chartState: store.app.charts };
};

export default connect(mapStateToProps)(ChartContainer);
