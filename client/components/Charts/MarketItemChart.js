/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { scaleUtc, scaleLinear, timeHour, timeMinute, timeDay } from '../../vendor/d3';
import { formatNumber } from '../../utilities';
import { userHasPremium } from '../../auth';
import { getMarketItemNames, itemNameToID, itemIDToName, subscribeItem, unsubscribeItem } from '../../market';
import { sendAppNotification } from '../../actions/appActions';

import ChartContainer from './ChartContainer';
import BarChartData from './BarChartData';
import Axis from './Axis';
import Indicator from './Indicator';
import Area from './Area';
import Scrollbar from './Scrollbar';

import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

class MarketItemChart extends React.Component {

  static propTypes = {

    item: React.PropTypes.object,
    title: React.PropTypes.string,
    region: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      xScale: scaleUtc(),
      yScale: scaleLinear(),
      volScale: scaleLinear(),
      percentScale: scaleLinear(),
      ohlcHeight: 0,
      ohlcOffset: 0,
      volHeight: 0,
      focusedElement: null,
      focusedElementIndex: -1,
      comparisonColors: [
        "#59c8e2",
        "#5CEF70",
        "#F8654F",
        "#4090A2",
        "#eba91b",
        "#7E57C2",
        "#E91E63",
        "#795548"
      ],
      comparisonItems: [],
      comparisonType: 'buyPercentile'
    }
  }

  updateScales() {

    const timePadding = 60000;

    let data = this.getAggregateData(this.props.item.id);

    if (!data) {
      return;
    }

    let completeData = this.getCompleteAggregateData(this.props.item.id);

    // Append data for comparison items
    if (this.state.comparisonItems.length !== 0) {

      this.state.comparisonItems.forEach(id => {

        const _data = this.getAggregateData(id);

        // If null, then this item hasn't yet been loaded
        if (!_data) {
          return;
        }

        data = data.concat(_data);

        completeData = completeData.concat(this.getCompleteAggregateData(id));
      });
    }

    this.state.ohlcHeight = Math.floor(this.refs.container.getHeight()*0.70);
    this.state.ohlcOffset = Math.floor(this.refs.container.getHeight()*0.75);
    this.state.volHeight = Math.floor(this.refs.container.getHeight()*0.25);

    const minDate = new Date(Math.min(...data.map((el) => { return el.time; })));
    const maxDate = new Date(Math.max(...data.map((el) => { return el.time; })));

    minDate.setTime(minDate.getTime() - timePadding);
    maxDate.setTime(maxDate.getTime() + timePadding);

    this.state.xScale.domain([
      new Date(minDate.getTime()),
      new Date(maxDate.getTime())
    ]);

    if (this.state.comparisonItems.length > 0) {

      if (this.isComparisonSpread()) {
        this.state.yScale.domain([Math.min(...completeData.map((el) => { return Math.max(0, el[this.state.comparisonType]) / 100 })), Math.max(...completeData.map((el) => { return Math.max(0, el[this.state.comparisonType]) / 100 }))]);
      } else {
        this.state.yScale.domain([Math.min(...completeData.map((el) => { return el[this.state.comparisonType]})), Math.max(...completeData.map((el) => { return el[this.state.comparisonType]}))]);
      }
    } else {
      this.state.yScale.domain([Math.min(...completeData.map((el) => { return el.buyPercentile})), Math.max(...completeData.map((el) => { return el.buyPercentile}))]);
    }

    this.state.volScale.domain([Math.floor(Math.min(...completeData.map((el) => { return el.tradeVolume !== undefined ? el.tradeVolume : 0}))), Math.ceil(Math.max(...completeData.map((el) => { return el.tradeVolume !== undefined ? el.tradeVolume : 0})))]);

    this.state.percentScale.domain([Math.min(...completeData.map((el) => { return Math.max(0, el.spread) / 100 })), Math.max(...completeData.map((el) => { return Math.max(0, el.spread) / 100 }))]);

    this.state.xScale.range([0, this.refs.container.getWidth()]);
    this.state.yScale.range([this.state.ohlcHeight, 0]);
    this.state.volScale.range([this.state.volHeight, 0]);
    this.state.percentScale.range([this.state.ohlcHeight, 0]);

    this.state.xScale.clamp(true);
    this.state.yScale.clamp(true);
    this.state.volScale.clamp(true);
    this.state.percentScale.clamp(true);

    this.state.xScale.nice(this.refs.container.getFrequency() === "minutes" ? timeMinute : (this.refs.container.getFrequency() === "hours" ? timeHour : timeDay));
    this.state.yScale.nice([this.isComparisonSpread()?1:5]);

    this.state.percentScale.nice([1]);

    this.setState({
      xScale: this.state.xScale,
      yScale: this.state.yScale,
      volScale: this.state.volScale,
      percentScale: this.state.percentScale,
      ohlcHeight: this.state.ohlcHeight,
      ohlcOffset: this.state.ohlcOffset,
      volHeight: this.state.volHeight
    });
  }

  componentDidMount() {

    this.updateScales();
  }

  componentWillReceiveProps(nextProps) {

    this.props = nextProps;

    this.updateScales();
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.refs.container.getFrequency() !== "daily" && (this.state.comparisonType === 'volume_sma' || this.state.comparisonType === 'spread_sma')) {
      this.setState({
        comparisonType: 'buyPercentile'
      });
    }

    if (prevState.comparisonType !== this.state.comparisonType) {
      this.updateScales();
    }
  }

  getAggregateData(itemID) {

    // Check if still loading components
    if (!this.refs.container || !itemID) {
      return null;
    }

    const region = this.props.region || store.getState().settings.market.region || 10000002;

    if (typeof this.props.market.item[itemID] !== 'undefined') {

      switch(this.refs.container.getFrequency()) {
        case "minutes":
          if (!this.props.market.item[itemID].minutes) {
            return null;
          }
          var arr = this.props.market.item[itemID].minutes[region];
          if (!arr) {
            return null;
          }
          arr = arr.sort((el1, el2) => el2.time - el1.time);
          var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
          if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
            return arr;
          }
          return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
        case "hours":
          if (!this.props.market.item[itemID].hours) {
            return null;
          }
          var arr = this.props.market.item[itemID].hours[region];
          if (!arr) {
            return null;
          }
          var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
          if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
            return arr;
          }
          return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
        case "daily":
          if (!this.props.market.item[itemID].daily) {
            return null;
          }
          var arr = this.props.market.item[itemID].daily[region];
          if (!arr) {
            return null;
          }
          var slice = Math.floor(arr.length * this.refs.container.getScrollPercent());
          if (arr.length > 0 && arr.length < this.refs.container.getPageSize()) {
            return arr;
          }
          return arr.length === 0 ? arr : arr.slice(arr.length-slice, Math.min(Math.max(arr.length-slice+this.refs.container.getPageSize(), 0), arr.length));
      }
    }

    return null;
  }

  getCompleteAggregateData(itemID) {

    // Check if still loading components
    if (!this.refs.container|| !itemID) {
      return null;
    }

    const region = this.props.region || store.getState().settings.market.region || 10000002;

    if (typeof this.props.market.item[itemID] !== 'undefined') {

      switch(this.refs.container.getFrequency()) {
        case "minutes":
          if (!this.props.market.item[itemID].minutes) {
            return null;
          }
          var arr = this.props.market.item[itemID].minutes[region];
          if (!arr) {
            return null;
          }
          return arr;
        case "hours":
          if (!this.props.market.item[itemID].hours) {
            return null;
          }
          var arr = this.props.market.item[itemID].hours[region];
          if (!arr) {
            return null;
          }
          return arr;
        case "daily":
          if (!this.props.market.item[itemID].daily) {
            return null;
          }
          var arr = this.props.market.item[itemID].daily[region];
          if (!arr) {
            return null;
          }
          return arr;
      }
    }

    return null;
  }

  getDataSize() {

    if (!this.refs.container) {
      return 0;
    }

    if (typeof this.props.market.item[this.props.item.id] !== 'undefined') {

      const region = this.props.region || store.getState().settings.market.region || 10000002;

      switch(this.refs.container.getFrequency()) {
        case "minutes":
          return this.props.market.item[this.props.item.id].minutes ? this.props.market.item[this.props.item.id].minutes[region].length : 0;
        case "hours":
          return this.props.market.item[this.props.item.id].hours ? this.props.market.item[this.props.item.id].hours[region].length : 0;
        case "daily":
          return this.props.market.item[this.props.item.id].daily ? this.props.market.item[this.props.item.id].daily[region].length : 0;
      }
    }

    return 0;
  }

  getHitTestableData() {

    const data = this.getAggregateData(this.props.item.id);

    if (!data) { 
      return [];
    }

    return data.map(el => this.state.xScale(el.time));
  }

  chartChanged() {

    this.updateScales();
  }

  handleScrollChange(scroll) {

    this.refs.container.handleScrollChange(scroll);
  }

  getLegend() {

    if (!this.refs.container) {
      return;
    }

    const legend = [];

    if (this.state.comparisonItems.length === 0) {

      const addLegend = (fill, text, value, postfix) => legend.push({fill, text, value: this.state.focusedElement ? formatNumber(this.state.focusedElement[value]) : 0, postfix: postfix || ""});

      if (this.props.chart_visuals.price) {

        addLegend("#59c8e2", "Buy Price", 'buyPercentile');
      }

      if (this.props.chart_visuals.spread) {

        addLegend("#5CEF70", "Spread", 'spread', '%');
      }

      if (this.refs.container && this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.spread_sma) {

        addLegend("#F8654F", "7 Day Spread SMA", 'spread_sma', '%');
      }

      if (this.props.chart_visuals.volume) {

        addLegend("#4090A2", "Volume", 'tradeVolume');
      }

      if (this.refs.container && this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.volume_sma) {

        addLegend("#eba91b", "7 Day Volume SMA", 'volume_sma');
      }
    } else {

      const addLegend = (fill, id, valueType, postfix) => {
        
        let value = 0;
        const data = this.getAggregateData(id);

        // Check if this dataset is still loading
        if (data && data.length >= this.state.focusedElementIndex && data[this.state.focusedElementIndex]) {

          value = formatNumber(data[this.state.focusedElementIndex][valueType]);
        }

        legend.push({
          button: <IconButton
            style={{width: 19, height: 19, padding: "0 0 1px 0", verticalAlign: "bottom"}}
            iconStyle={{width: 18, height: 18}}
            onClick={() => {
              const items = this.state.comparisonItems;
              items.splice(items.findIndex(el=>el===id), 1);

              this.setState({comparisonItems: items});
            }}
          >
            <CloseIcon />
          </IconButton>,
          fill,
          value,
          text: itemIDToName(id),
          postfix: this.isComparisonSpread() ? '%' : ""
        });
      };

      // Add main item
      legend.push({
        fill: this.state.comparisonColors[0],
        text: itemIDToName(this.props.item.id),
        value: this.state.focusedElement ? formatNumber(this.state.focusedElement[this.state.comparisonType]) : 0,
        postfix: this.isComparisonSpread() ? '%' : ""
      });

      // Then add the comparisons
      this.state.comparisonItems.forEach((el, i) => {

        addLegend(this.state.comparisonColors[i+1], el, this.state.comparisonType);
      });
    }

    return legend;
  }

  updateTradingSearch = (chosenRequest, index) => {

    const items = getMarketItemNames();

    if (items.indexOf(chosenRequest) === -1) {

      // TODO: Notify user item is invalid
      store.dispatch(sendAppNotification("Not a valid item", 5000));
      return;
    }

    if (this.state.comparisonItems.length >= 5) {

      // TODO: Notify user of max number of comparisons
      store.dispatch(sendAppNotification("There's a limit of 5 comparisons at a time", 5000));
      return;
    }

    const itemID = itemNameToID(chosenRequest);

    if (this.state.comparisonItems.indexOf(itemID) !== -1) {

      store.dispatch(sendAppNotification("Item is already being compared", 5000));
      return;
    }

    const comparisons = this.state.comparisonItems;

    comparisons.push(itemID);

    subscribeItem(itemID, 0);

    this.setState({
      comparisonItems: comparisons
    });
  };

  updateTradingSearchText = (text) => {

    // No-op
  };

  setComparisonType = (event, index, value) => {

    this.setState({
      comparisonType: value
    });
  };

  getComparisonIndicator(id, index, data) {

    const colour = this.state.comparisonColors[index + 1];

    if (this.state.comparisonType === 'spread') {
      return <Indicator key={id} thickLine={true} circleColour={colour} lineColour={colour} data={data} focusedIndex={this.state.focusedElementIndex} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => el.spread/100} />;
    } else if (this.state.comparisonType === 'spread_sma') {
      return <Indicator key={id} thickLine={true} circleColour={colour} lineColour={colour} data={data} focusedIndex={this.state.focusedElementIndex} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => (el.spread_sma || 0)/100} />;
    }
    
    return <Indicator key={id} thickLine={true} circleColour={colour} lineColour={colour} data={data} xScale={this.state.xScale} focusedIndex={this.state.focusedElementIndex} yScale={this.state.yScale} xAccessor={el => el.time} yAccessor={el => el[this.state.comparisonType]} />;
  }

  isComparisonSpread() {
    return this.state.comparisonType === 'spread' || this.state.comparisonType === 'spread_sma';
  }

  render() {

    const data = this.getAggregateData(this.props.item.id);
    const width = this.refs.container ? this.refs.container.getWidth() : 0;
    const height = this.refs.container ? this.refs.container.getHeight() : 0;

    return (
      <ChartContainer 
        getHitTestableData={()=>this.getHitTestableData()} 
        frequencyLevels={{minutes: "5 Minutes", hours: "1 Hour", daily: "1 Day"}} 
        ref="container"
        data={data} 
        title={this.props.title} 
        onChartChanged={()=>this.chartChanged()}
        overrideWidth={this.props.width}
        overrideHeight={this.props.height}
        totalDataSize={this.getDataSize()}
        defaultFrequency={this.props.frequency}
        legend={this.getLegend()}
        onFocusElement={(el, index)=>this.setState({focusedElement: el, focusedElementIndex: index})}
        widgets={
          <div>
            <div style={{marginRight: "1rem", verticalAlign: "middle", width:"150px", display: "inline-block"}}>
              <AutoComplete
                dataSource={getMarketItemNames()}
                filter={AutoComplete.caseInsensitiveFilter}
                maxSearchResults={5}
                menuStyle={{cursor: "pointer"}}
                onNewRequest={this.updateTradingSearch}
                onUpdateInput={this.updateTradingSearchText}
                hintText="Compare item"
                underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
                underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
                fullWidth={true}
              />
            </div>
            {
              this.state.comparisonItems.length > 0 && this.refs.container.getFrequency() === "daily" ?
                <SelectField style={{width: "150px", verticalAlign: "middle"}} value={this.state.comparisonType} onChange={this.setComparisonType}>
                  <MenuItem key={0} type="text" value="buyPercentile" primaryText="Price" style={{cursor: "pointer"}} />
                  <MenuItem key={1} type="text" value="spread" primaryText="Spread" style={{cursor: "pointer"}} />
                  <MenuItem key={2} type="text" value="tradeVolume" primaryText="Volume" style={{cursor: "pointer"}} />
                  <MenuItem key={3} type="text" value="spread_sma" primaryText="Spread SMA" style={{cursor: "pointer"}} />
                  <MenuItem key={4} type="text" value="volume_sma" primaryText="Volume SMA" style={{cursor: "pointer"}} />
                </SelectField>
              : this.state.comparisonItems.length > 0 ?
                <SelectField style={{width: "150px", verticalAlign: "middle"}} value={this.state.comparisonType} onChange={this.setComparisonType}>
                  <MenuItem key={0} type="text" value="buyPercentile" primaryText="Price" style={{cursor: "pointer"}} />
                  <MenuItem key={1} type="text" value="spread" primaryText="Spread" style={{cursor: "pointer"}} />
                  <MenuItem key={2} type="text" value="tradeVolume" primaryText="Volume" style={{cursor: "pointer"}} />
                </SelectField> : false
            }
          </div>
        }
      >
        <Axis anchor="left" scale={this.state.yScale} ticks={10} tickSize={-width} suppressLabels={true} style={{opacity: 0.5}}/>
        <Axis anchor="left" scale={this.state.volScale} ticks={5} tickSize={-width} suppressLabels={true} style={{opacity: 0.5, transform: `translateY(${this.state.ohlcOffset}px)`}} />

        <Axis anchor="bottom" scale={this.state.xScale} ticks={5} style={{transform: `translateY(${height}px)`}} />
        <Axis anchor="left" scale={this.state.yScale} ticks={10} formatISK={!this.isComparisonSpread()} format={this.isComparisonSpread() ? "%" : null} />
        <Axis anchor="left" scale={this.state.volScale} ticks={5} style={{transform: `translateY(${this.state.ohlcOffset}px)`}} formatISK={true} />
        <Axis anchor="right" scale={this.state.percentScale} ticks={10} style={{transform: `translateX(${width}px)`}} format="%" />
        {
          data && data.length > 0 && this.state.comparisonItems.length > 0 ?
          <g>
            {this.getComparisonIndicator(this.props.item.id, -1, data)}
            {
              this.state.comparisonItems.map((id, i) => {

                const _data = this.getAggregateData(id);

                if (!_data || _data.length === 0) {
                  return;
                }

                return this.getComparisonIndicator(id, i, _data);
              })
            }
            <Scrollbar onScrollChange={scroll=>this.handleScrollChange(scroll)} />
          </g>
          :
          data && data.length > 0 ?
          <g>
            {
              this.props.chart_visuals.price ?
                <Area viewportHeight={this.state.ohlcHeight} data={data} focusedIndex={this.state.focusedElementIndex} xScale={this.state.xScale} yScale={this.state.yScale} xAccessor={el => el.time} yAccessor={el => el.buyPercentile} />
                : false
            }
            {
              this.props.chart_visuals.volume ?
                <BarChartData data={data} heightOffset={this.state.volHeight} viewportWidth={width} viewportHeight={height} xScale={this.state.xScale} yScale={this.state.volScale} />
                : false
            }
            {
              this.props.chart_visuals.spread ?
                <Indicator thickLine={true} circleColour="#5CEF70" lineColour="#5CEF70" data={data} focusedIndex={this.state.focusedElementIndex} xScale={this.state.xScale} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => el.spread/100} />
                : false
            }
            { this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.spread_sma ? 
                <Indicator thickLine={true} lineColour="#F8654F" circleColour="#F8654F" data={data} xScale={this.state.xScale} focusedIndex={this.state.focusedElementIndex} yScale={this.state.percentScale} xAccessor={el => el.time} yAccessor={el => (el.spread_sma || 0)/100 } />
                : false
            }

            { this.refs.container.getFrequency() === "daily" && this.props.chart_visuals.volume_sma ? 
                <Indicator thickLine={true} lineColour="#eba91b" data={data} focusedIndex={this.state.focusedElementIndex} heightOffset={height-this.state.volHeight} xScale={this.state.xScale} yScale={this.state.volScale} xAccessor={el => el.time} yAccessor={el => el.volume_sma || 0} />
                : false
            }
            <Scrollbar onScrollChange={scroll=>this.handleScrollChange(scroll)} />
          </g> : false
        }
     </ChartContainer>
    );
  }
}

const mapStateToProps = function(store) {
  return { market: store.market, chart_visuals: store.settings.chart_visuals, frequency: store.settings.market.default_timespan };
}

export default connect(mapStateToProps)(MarketItemChart);