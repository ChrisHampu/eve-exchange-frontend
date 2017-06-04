/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import { formatNumber } from '../../utilities';
import { getPaginatedData } from '../../market';
import ChartFrequencySelector from '../Charts/ChartFrequencySelector';
import ChartZoomSelector from '../Charts/ChartZoomSelector';
import ChartContainer from '../Charts/ChartContainer';
import ChartLegend from '../Charts/ChartLegend';
import Scrollbar from '../Charts/Scrollbar';
import Measure from '../UI/Measure';
import Axis from '../Charts/Axis';
import Area from '../Charts/Area';


class TickerChart extends React.Component {

  static propTypes = {

    ticker: React.PropTypes.object,
    hourlyChart: React.PropTypes.array
  };

  constructor(props) {
    super(props);

    const initialState = {
      frequencyLevels: { hours: 'Hourly' },
      zoom: 0,
      scrollPercent: null
    };

    this.state = Object.assign({}, initialState, {
      initialState,
      zoomLevels: [15, 30, 50, 80, 100],
      frequency: 'hours'
    });
  }

  getChartData() {

    switch (this.state.frequency) {
      case 'hours':
      default:
        return this.props.hourlyChart.map(el => Object.assign({}, el, { time: new Date(el.time) })) || [];
      case 'daily':
        return this.props.hourlyChart || [];
    }
  }

  getPaginatedChartData() {
    return getPaginatedData(this.getChartData(), this.state.zoomLevels[this.state.zoom], this.state.scrollPercent);
  }

  getLegend() {

    const legend = [];
    const focus = this.props.chartState.focusIndex;
    const data = this.getChartData();

    if (!data || focus === null || focus < 0) {
      return [];
    }

    legend.push({ fill: '#59c8e2', text: 'Index Value', value: data.length > focus ? formatNumber(data[focus].index) : 0, postfix: '' });

    return legend;
  }

  render() {

    const data = this.getChartData();

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'none' }}>
        <div>
          <ChartFrequencySelector
            frequencyLevels={this.state.frequencyLevels}
            defaultFrequency={this.state.frequency}
            onFrequencyChanged={frequency => this.setState({ frequency })}
          />
          <ChartZoomSelector
            zoomLevels={this.state.zoomLevels}
            defaultZoom={this.state.initialState.zoom}
            onZoomChanged={zoom => this.setState({ zoom })}
          />
        </div>
        <ChartLegend legendItems={this.getLegend()} data={data} />
        <Measure>
          <ChartContainer
            height={375}
            scrollPercent={this.state.scrollPercent}
            pageSize={this.state.zoomLevels[this.state.zoom]}
            data={data}
            timeAccessor={el => el.time}
            leftDataAccessor={el => el.index}
            rightDataAccessor={() => 0}
            frequency={this.state.frequency}
            hasScrollbar
          >
            <Scrollbar onScrollChange={scrollPercent => this.setState({ scrollPercent })} />
            <Axis formatISK tickCount={5} />
            <Axis horizontalLines tickCount={5} />
            <Axis anchor='bottom' tickCount={5} />
            <Area />
          </ChartContainer>
        </Measure>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { chartState: store.app.charts };
};

export default connect(mapStateToProps)(TickerChart);


//              <Area focusedIndex={this.state.focusedElementIndex} viewportHeight={height} data={data} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={el => new Date(el.time)} yAccessor={el => el.index} />
 