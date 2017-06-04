import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import Measure from '../UI/Measure';
import Scrollbar from '../Charts/Scrollbar';
import ChartContainer from '../Charts/ChartContainer';
import ChartFrequencySelector from '../Charts/ChartFrequencySelector';
import ChartZoomSelector from '../Charts/ChartZoomSelector';
import MarketItemComparisonSearch from '../Charts/MarketItemComparisonSearch';
import Axis from '../Charts/Axis';
import Area from '../Charts/Area';
import Bars from '../Charts/Bars';
import Indicator from '../Charts/Indicator';
import ChartLegend from '../Charts/ChartLegend';
import Scale from '../Charts/Scale';
import { scaleLinear } from '../../vendor/d3';
import { subscribeItem, unsubscribeItem, itemIDToName, getPaginatedData } from '../../market';
import { formatNumber } from '../../utilities';
import { sendAppNotification } from '../../actions/appActions';

import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

class MarketItemChartComponent extends React.Component {

  static propTypes = {
    item: React.PropTypes.object,
    region: React.PropTypes.number,
    frequency: React.PropTypes.number,
    dashboardMode: React.PropTypes.bool
  };

  static defaultProps = {
    region: 10000002,
    frequency: 0,
    dashboardMode: false
  };

  constructor(props) {
    super(props);

    const initialState = {
      frequencyLevels: { minutes: '5 Minutes', hours: '1 Hour', daily: '1 Day' },
      zoom: 1,
      comparisonType: 'buyPercentile',
      scrollPercent: null
    };

    this.state = Object.assign({}, initialState, {
      initialState,
      comparisonItems: [],
      zoomLevels: [15, 30, 50, 80, 100],
      data: null,
      frequency: Object.keys(initialState.frequencyLevels)[props.frequency],
      comparisonColors: [
        '#59c8e2',
        '#5CEF70',
        '#F8654F',
        '#4090A2',
        '#eba91b',
        '#7E57C2',
        '#E91E63',
        '#795548'
      ],
    });
  }

  getPageSize() {
    return this.state.zoomLevels[this.state.zoom];
  }

  getAggregateData(id) {

    if (!id) {
      return null;
    }

    const {
      region
    } = this.props;

    const {
      frequency
    } = this.state;

    let data = null;

    if (id in this.props.market.item) {
      if (frequency in this.props.market.item[id]) {
        if (region in this.props.market.item[id][frequency]) {
          data = this.props.market.item[id][frequency][region];
        }
      }
    }

    return data;
  }

  getPrimaryLegend() {

    const legend = [];

    const addLegend = (fill, text, key, postfix) => legend.push({ fill, text, key, postfix: postfix || '' });

    if (this.props.chart_visuals.price) {

      addLegend('#59c8e2', 'Buy Price', 'buyPercentile');
    }

    if (this.props.chart_visuals.spread) {

      addLegend('#5CEF70', 'Spread', 'spread', '%');
    }

    if (this.state.frequency === 'daily' && this.props.chart_visuals.spread_sma) {

      addLegend('#F8654F', '7 Day Spread SMA', 'spread_sma', '%');
    }

    return legend;
  }

  getSecondaryLegend() {

    const legend = [];

    const addLegend = (fill, text, key, postfix) => legend.push({ fill, text, key, postfix: postfix || '' });

    if (this.props.chart_visuals.volume) {

      addLegend('#4090A2', 'Volume', 'tradeVolume');
    }

    if (this.state.frequency === 'daily' && this.props.chart_visuals.volume_sma) {

      addLegend('#eba91b', '7 Day Volume SMA', 'volume_sma');
    }

    return legend;
  }

  getComparisonLegend() {
    const legend = [];

    if (this.props.chartState.focusIndex === null) {
      return [];
    }

    const addLegend = (fill, text, key, id, postfix, ignoreButton) => {

      let value = 0;
      const data = this.getAggregateData(id);

      // Check if this dataset is still loading
      if (data && data.length >= this.props.chartState.focusIndex && data[this.props.chartState.focusIndex]) {

        value = formatNumber(data[this.props.chartState.focusIndex][this.state.comparisonType]);
      }

      legend.push({
        fill,
        text,
        value,
        postfix: postfix || '',
        button: ignoreButton ? null : <IconButton
          style={{ width: 19, height: 19, padding: '0 0 1px 0', verticalAlign: 'bottom' }}
          iconStyle={{ width: 18, height: 18 }}
          onClick={() => this.removeComparisonItem(id)}
        >
          <CloseIcon />
        </IconButton>
      });
    };

    addLegend('#59c8e2', this.props.item.name, 'buyPercentile', this.props.item.id, '', true);

    this.state.comparisonItems.forEach((el, i) => {

      addLegend(this.state.comparisonColors[i + 1], itemIDToName(el), this.state.comparisonType, el);
    });

    return legend;
  }

  getVelocityLegend() {

    return [{ fill: '#5CEF70', text: '10 Day Buy Price Velocity', key: 'velocity', postfix: '' }];
  }

  addComparisonItem = (itemID) => {

    if (this.state.comparisonItems >= 5) {
      store.dispatch(sendAppNotification('There\'s a limit of 5 comparisons at a time', 5000));
      return;
    }

    const items = this.state.comparisonItems;

    if (items.indexOf(itemID) !== -1) {
      store.dispatch(sendAppNotification('Item is already being compared', 5000));
      return;
    }

    items.push(itemID);

    subscribeItem(itemID);

    this.setState({ comparisonItems: items });
  };

  removeComparisonItem = (itemID) => {

    const items = this.state.comparisonItems;

    items.splice(items.findIndex(el => el === itemID), 1);

    unsubscribeItem(itemID);

    this.setState({ comparisonItems: items });
  };

  render() {

    const {
      item: {
        id
      }
    } = this.props;

    const data = this.getAggregateData(id);

    const spreadScale = new Scale(scaleLinear, el => Math.max(0, el.spread) / 100, () => 345, () => 0, [1]);
    spreadScale.update(data);

    let leftScale = null;

    if (this.state.comparisonItems.length) {
      const aggregates = this.state.comparisonItems
      .map(el => this.getAggregateData(el))
      .filter(el => el && el !== undefined)
      .reduce((acc, val) => acc.concat(val), []);

      leftScale = new Scale(scaleLinear, el => el[this.state.comparisonType], () => 345, () => 0, [1]);

      leftScale.update([...aggregates, ...data]);
    } else {
      leftScale = new Scale(scaleLinear, el => el.buyPercentile, () => 345, () => 0, [1]);

      leftScale.update(data);
    }

    /**
     * TODO:
     * Clean up scales, place them somewhere more persistent (update when receiving new props?)
     * Cache aggregate data into an id -> data map, and only call getAggregateData() and getPaginatedData() when necessary
     */

    return (
      <div style={{ marginBottom: this.props.dashboardMode ? '1rem' : '3rem', width: '100%' }}>
        <div>
          {
            this.props.dashboardMode &&
              <div style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '1rem', color: '#eba91b' }}>
                {this.props.item.name}
              </div>
          }
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
          <MarketItemComparisonSearch
            comparisonFields={{ buyPercentile: 'Price', spread: 'Spread', tradeVolume: 'Trade Volume' }}
            defaultComparison={this.state.initialState.comparisonType}
            onComparisonItemsChanged={this.addComparisonItem}
            onComparisonTypeChanged={comparisonType => this.setState({ comparisonType })}
          />
        </div>
        <Measure>
          <ChartLegend legendItems={this.state.comparisonItems.length > 0 ? this.getComparisonLegend() : this.getPrimaryLegend()} data={data} />
          <ChartContainer
            height={400}
            scrollPercent={this.state.scrollPercent}
            pageSize={this.state.zoomLevels[this.state.zoom]}
            data={data}
            timeAccessor={el => el.time}
            leftDataAccessor={this.state.comparisonItems.length ? el => el[this.state.comparisonType] : el => el.buyPercentile}
            leftDataScale={leftScale}
            rightDataAccessor={el => el.spread}
            frequency={this.state.frequency}
            hasScrollbar
          >
            <Scrollbar onScrollChange={scrollPercent => this.setState({ scrollPercent })} />
            <Axis formatISK tickCount={5} leftDataScale={leftScale.scale} />
            <Axis horizontalLines tickCount={5} />
            <Axis anchor='bottom' tickCount={5} />
            {
              !this.state.comparisonItems.length &&
                <Axis anchor='right' tickCount={5} format='%' rightDataScale={spreadScale.scale} />
            }
            {
              this.state.comparisonItems.length ?
                [this.props.item.id, ...this.state.comparisonItems].map((el, i) =>
                  <Indicator
                    key={i}
                    data={getPaginatedData(this.getAggregateData(el), this.getPageSize(), this.state.scrollPercent)}
                    fullData={this.getAggregateData(el)}
                    thickLine
                    lineColour={this.state.comparisonColors[i]}
                    circleColour={this.state.comparisonColors[i]}
                  />)
                : <Area />
            }
            {
              this.props.chart_visuals.spread && !this.state.comparisonItems.length &&
                <Indicator thickLine lineColour='#5CEF70' circleColour='#5CEF70' right />
            }
            {
              this.state.frequency === 'daily' && this.props.chart_visuals.spread_sma && !this.state.comparisonItems.length &&
                <Indicator thickLine lineColour='#F8654F' circleColour='#F8654F' right rightDataAccessor={el => el.spread_sma} />
            }
          </ChartContainer>
          <ChartLegend legendItems={this.getSecondaryLegend()} data={data} />
          <ChartContainer
            height={200}
            scrollPercent={this.state.scrollPercent}
            pageSize={this.state.zoomLevels[this.state.zoom]}
            data={data}
            timeAccessor={el => el.time}
            leftDataAccessor={el => el.tradeVolume}
            frequency={this.state.frequency}
          >
            <Axis formatISK tickCount={5} />
            <Axis horizontalLines tickCount={5} />
            <Axis anchor='bottom' tickCount={5} />
            {
              this.props.chart_visuals.volume &&
                <Bars />
            }
            {
              this.state.frequency === 'daily' && this.props.chart_visuals.volume_sma &&
                <Indicator thickLine lineColour='#eba91b' />
            }
          </ChartContainer>
          {
            this.state.frequency === 'daily' &&
              <ChartLegend legendItems={this.getVelocityLegend()} data={data} />
          }
          {
            this.state.frequency === 'daily' &&
              <ChartContainer
                height={200}
                scrollPercent={this.state.scrollPercent}
                pageSize={this.state.zoomLevels[this.state.zoom]}
                data={data}
                timeAccessor={el => el.time}
                leftDataAccessor={el => el.velocity}
                frequency={this.state.frequency}
              >
                <Axis formatISK tickCount={5} />
                <Axis horizontalLines tickCount={5} />
                <Axis anchor='bottom' tickCount={5} />
                <Indicator thickLine lineColour='#5CEF70' circleColour='#5CEF70' />
              </ChartContainer>
          }
        </Measure>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return { market: store.market, chart_visuals: store.settings.chart_visuals, frequency: store.settings.market.default_timespan, chartState: store.app.charts };
};

export default connect(mapStateToProps)(MarketItemChartComponent);
