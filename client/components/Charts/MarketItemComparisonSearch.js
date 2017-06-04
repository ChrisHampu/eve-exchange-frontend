import React from 'react';
import store from '../../store';
import { sendAppNotification } from '../../actions/appActions';
import { marketItemFilter, getMarketItemNamesSorted, itemNameToID } from '../../market';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';

export default class MarketItemComparisonSearch extends React.Component {

  static propTypes = {
    comparisonFields: React.PropTypes.object, // key => value (key is data variable, value is name)
    defaultComparison: React.PropTypes.string,
    onComparisonTypeChanged: React.PropTypes.func,
    onComparisonItemsChanged: React.PropTypes.func,
    comparisonLimit: React.PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      comparisonType: props.defaultComparison || Object.keys(props.comparisonFields)[0],
      limit: props.comparisonLimit || 5,
      searchText: '',
      marketItems: getMarketItemNamesSorted()
    };
  }

  onRequestComparison = (chosenRequest) => {

    const items = this.state.marketItems;

    if (items.indexOf(chosenRequest) === -1) {
      store.dispatch(sendAppNotification('Not a valid item', 5000));
      return;
    }

    const itemID = itemNameToID(chosenRequest);

    if (this.props.onComparisonItemsChanged) {
      this.props.onComparisonItemsChanged(itemID);
    }
  };

  onUpdateInput = searchText => this.setState({ searchText });

  setComparisonType = (_ev, _idx, type) => {

    this.setState({
      comparisonType: type
    }, () => {

      if (this.props.onComparisonTypeChanged) {
        this.props.onComparisonTypeChanged(type);
      }
    });
  };

  render() {
    return (
      <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <div style={{ marginRight: '1rem', verticalAlign: 'middle', width: '150px', display: 'inline-block' }}>
          <AutoComplete
            dataSource={this.state.marketItems}
            filter={marketItemFilter}
            maxSearchResults={5}
            menuStyle={{ cursor: 'pointer' }}
            onNewRequest={this.onRequestComparison}
            onUpdateInput={this.onUpdateInput}
            hintText='Compare item'
            underlineStyle={{ borderColor: 'rgba(255, 255, 255, 0.298039)' }}
            underlineFocusStyle={{ borderColor: 'rgb(235, 169, 27)' }}
            fullWidth
          />
        </div>
        {
          this.state.searchText.length > 0 &&
            <SelectField
              style={{ width: '150px', verticalAlign: 'middle' }}
              value={this.state.comparisonType}
              onChange={this.setComparisonType}
            >
            {
            Object.keys(this.props.comparisonFields).map((el, i) =>
              <MenuItem key={i} type='text' value={el} primaryText={this.props.comparisonFields[el]} style={{ cursor: 'pointer' }} />
            )
            }
            </SelectField>
        }
      </div>
    );
  }
}
