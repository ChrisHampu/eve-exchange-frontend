/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import { formatNumber } from '../../utilities';
import { getPaginatedData } from '../../market';
import { scaleLinear } from '../../vendor/d3';
import ChartFrequencySelector from '../Charts/ChartFrequencySelector';
import ChartZoomSelector from '../Charts/ChartZoomSelector';
import ChartContainer from '../Charts/ChartContainer';
import ChartLegend from '../Charts/ChartLegend';
import Indicator from '../Charts/Indicator';
import Scrollbar from '../Charts/Scrollbar';
import Measure from '../UI/Measure';
import Scale from '../Charts/Scale';
import Axis from '../Charts/Axis';
import Area from '../Charts/Area';
import Bars from '../Charts/Bars';

class PortfoliosPerformanceChart extends React.Component {

  static propTypes = {

    portfolio: React.PropTypes.object,
    chartState: React.PropTypes.object
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
      zoomLevels: [15, 30, 50, 80, 100],
      frequency: 'hours'
    });
  }

  getAggregateData() {

    switch (this.state.frequency) {
      default:
      case 'hours':
        return this.props.portfolio.hourlyChart.sort((el1, el2) => el2.time - el1.time);

      case 'daily':
        return this.props.portfolio.dailyChart.sort((el1, el2) => el2.time - el1.time);
    }
  }

  getPaginatedAggregateData() {
    return getPaginatedData(this.getAggregateData(), this.state.zoomLevels[this.state.zoom], this.state.scrollPercent);
  }

  getLegend() {

    const legend = [];
    const focus = this.props.chartState.focusIndex;
    const data = this.getAggregateData();

    if (!data || focus === null || focus < 0) {
      return [];
    }

    if (this.props.portfolio.type === 0) {

      legend.push({ fill: '#59c8e2', text: 'Component Value', value: data.length > focus ? formatNumber(data[focus].portfolioValue) : 0, postfix: '' });
      legend.push({ fill: '#eba91b', text: 'Average Spread', value: data.length > focus ? formatNumber(data[focus].avgSpread) : 0, postfix: '%' });
      legend.push({ fill: '#5CEF70', text: 'Growth', value: data.length > focus ? formatNumber(data[focus].growth) : 0, postfix: '%' });
    } else {
      legend.push({ fill: '#59c8e2', text: 'Component Value', value: data.length > focus ? formatNumber(data[focus].portfolioValue) : 0, postfix: '' });
      legend.push({ fill: '#eba91b', text: 'Material Value', value: data.length > focus ? formatNumber(data[focus].materialValue) : 0, postfix: '' });
      legend.push({ fill: '#5CEF70', text: 'Profit Margin', value: data.length > focus ? formatNumber(data[focus].industrySpread) : 0, postfix: '%' });
    }

    return legend;
  }

  render() {

    let leftScale = null;
    let rightScale = null;

    const data = this.getAggregateData();
    const portfolioType = this.props.portfolio.type;

    if (!data || data.length === 0) {
      return (
        <div style={{ marginTop: '1rem' }}>
        Chart is still updating and should be completed within the next 5 minutes.
        </div>
      );
    }

    if (portfolioType === 0) {

      const percentData = data.map(el => [el.avgSpread, el.growth]).reduce((left, right) => left.concat(right), []).map(el => ({ val: el }));

      rightScale = new Scale(scaleLinear, el => el.val / 100, () => 545, () => 0, [1]);

      rightScale.update(percentData);

      leftScale = new Scale(scaleLinear, el => el.portfolioValue, () => 545, () => 0, [1]);

      leftScale.update(data);
    } else {
      const matData = data.map(el => [el.materialValue, el.portfolioValue]).reduce((left, right) => left.concat(right), []).map(el => ({ val: el }));

      rightScale = new Scale(scaleLinear, el => el.industrySpread / 100, () => 545, () => 0, [1]);

      rightScale.update(data);

      leftScale = new Scale(scaleLinear, el => el.val, () => 545, () => 0, [1]);

      leftScale.update(matData);
    }

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
            leftDataScale={leftScale}
            leftDataAccessor={el => el.portfolioValue}
            rightDataScale={rightScale}
            rightDataAccessor={portfolioType === 0 ? el => el.avgSpread / 100 : el => el.industrySpread / 100}
            frequency={this.state.frequency}
            hasScrollbar
          >
            <Scrollbar onScrollChange={scrollPercent => this.setState({ scrollPercent })} />
            <Axis formatISK tickCount={5} />
            <Axis anchor='right' format='%' tickCount={5} />
            <Axis horizontalLines tickCount={5} />
            <Axis anchor='bottom' tickCount={5} />
            {
              portfolioType === 0 &&
                <Area />
            }
            {
              portfolioType === 0 &&
                <Indicator right thickLine circleColour='#eba91b' lineColour='#eba91b' rightDataAccessor={el => el.avgSpread / 100} />
            }
            {
              portfolioType === 0 &&
                <Indicator right thickLine circleColour='#5CEF70' lineColour='#5CEF70' rightDataAccessor={el => el.growth / 100} />
            }
            {
              portfolioType === 1 &&
                <Indicator thickLine circleColour='#59c8e2' lineColour='#59c8e2' data={data} leftDataAccessor={el => el.portfolioValue} />
            }
            {
              portfolioType === 1 &&
                <Indicator thickLine circleColour='#eba91b' lineColour='#eba91b' data={data} leftDataAccessor={el => el.materialValue} />
            }
            {
              portfolioType === 1 &&
                <Indicator thickLine circleColour='#5CEF70' lineColour='#5CEF70' data={data} rightDataAccessor={el => el.industrySpread / 100} />
            }
          </ChartContainer>
        </Measure>
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { chartState: store.app.charts };
};

export default connect(mapStateToProps)(PortfoliosPerformanceChart);
