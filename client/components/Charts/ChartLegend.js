import React from 'react';
import { connect } from 'react-redux';
import { formatNumber } from '../../utilities';

class ChartLegend extends React.Component {

  /*
    Legend item data structure:
    {
      button: React component,
      fill: color string for text and border,
      postfix: string on end of item value,
      value: value to override and show in the legend,
      key: if value not given, key to access data object for value
    }
  */

  static propTypes = {
    chartState: React.PropTypes.object,
    legendItems: React.PropTypes.array,
    data: React.PropTypes.array
  };

  static defaultProps = {
    legendItems: [],
    data: []
  }

  getLegendData(key) {

    const {
      data,
      chartState
    } = this.props;

    if (!key || !data || !data.length || chartState.focusIndex === null) {
      return 0;
    }

    if (data.length < chartState.focusIndex || data[chartState.focusIndex] === undefined) {
      return 0;
    }

    if (key in data[chartState.focusIndex]) {
      return formatNumber(data[chartState.focusIndex][key]);
    }

    return 0;
  }

  render() {
    return (
      <div style={{ paddingBottom: '0.5rem' }}>
      {
        this.props.legendItems.map(el =>
          <div key={el.text} style={{ lineHeight: 'initial', display: 'inline-block', borderBottom: '2px solid', borderBottomColor: el.fill, color: 'rgb(185, 197, 208)', marginRight: '10px', paddingBottom: '3px' }}>
          {el.button} {el.text} / <span style={{ color: '#fff' }}>{el.value || this.getLegendData(el.key)}{el.postfix}</span>
          </div>
        )
      }
      </div>
    );
  }
}

const mapStateToProps = store => {
  return { chartState: store.app.charts };
};

export default connect(mapStateToProps)(ChartLegend);
