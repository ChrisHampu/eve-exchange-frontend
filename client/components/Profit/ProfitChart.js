/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import { formatNumber } from '../../utilities';
import { getPaginatedData } from '../../market';
import ChartFrequencySelector from '../Charts/ChartFrequencySelector';
import ChartZoomSelector from '../Charts/ChartZoomSelector';
import ChartContainer from '../Charts/ChartContainer';
import ChartLegend from '../Charts/ChartLegend';
import Indicator from '../Charts/Indicator';
import Scrollbar from '../Charts/Scrollbar';
import Measure from '../UI/Measure';
import Axis from '../Charts/Axis';

class ProfitChart extends React.Component {

  static propTypes = {

    title: React.PropTypes.string
  };

  constructor(props) {
    super(props);

    const initialState = {
      frequencyLevels: { hours: '1 Hour', daily: '1 Day' },
      zoom: 1,
      scrollPercent: null
    };

    this.state = Object.assign({}, initialState, {
      initialState,
      comparisonItems: [],
      zoomLevels: [15, 30, 50, 80, 100],
      frequency: 'hours'
    });
  }

  getChartData() {

    switch (this.state.frequency) {
      case 'hours':
      default:
        return this.props.chart.hourly || [];
      case 'daily':
        return this.props.chart.daily || [];
    }
  }

  getPaginatedChartData() {
    return getPaginatedData(this.getChartData(), this.state.zoomLevels[this.state.zoom], this.state.scrollPercent);
  }

  getLegend() {

    const legend = [];
    const focus = this.props.chartState.focusIndex;
    const data = this.getChartData();

    if (!data || focus === null) {
      return [];
    }

    legend.push({ fill: '#4CAF50', text: 'Profit', value: data.length > focus ? formatNumber(data[focus].profit) : 0, postfix: '' });
    legend.push({ fill: '#F44336', text: 'Fees', value: data.length > focus ? formatNumber(data[focus].taxes + data[focus].broker) : 0, postfix: '' });

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
            height={600}
            scrollPercent={this.state.scrollPercent}
            pageSize={this.state.zoomLevels[this.state.zoom]}
            data={data}
            timeAccessor={el => el.time}
            leftDataAccessor={el => el.profit}
            rightDataAccessor={() => 0}
            frequency={this.state.frequency}
            hasScrollbar
          >
            <Scrollbar onScrollChange={scrollPercent => this.setState({ scrollPercent })} />
            <Axis formatISK tickCount={5} />
            <Axis horizontalLines tickCount={5} />
            <Axis anchor='bottom' tickCount={5} />
            <Indicator thickLine circleColour='#F44336' lineColour='#F44336' leftDataAccessor={el => Math.abs(el.taxes) + Math.abs(el.broker)} />
            <Indicator thickLine circleColour='#4CAF50' lineColour='#4CAF50' />
          </ChartContainer>
        </Measure>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { chart: store.profit.chart, chartState: store.app.charts };
};

export default connect(mapStateToProps)(ProfitChart);
