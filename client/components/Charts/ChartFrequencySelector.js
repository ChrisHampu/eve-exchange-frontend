import React from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ChartFrequencySelector extends React.Component {

  static propTypes = {
    frequencyLevels: React.PropTypes.object, // key => value obj containing frequencies & their names
    defaultFrequency: React.PropTypes.string, // default key to use
    onFrequencyChanged: React.PropTypes.func // callback with new frequency key
  };

  constructor(props) {
    super(props);

    this.state = {
      frequency: this.props.defaultFrequency || Object.keys(this.props.frequencyLevels)[0] || null
    };
  }

  setFrequency = (event, index, value) => {

    const frequency = Object.keys(this.props.frequencyLevels)[value];

    this.setState({
      frequency
    }, () => {

      this.props.onFrequencyChanged(frequency);
    });
  };

  render() {
    return (
      <SelectField
        style={{ width: '150px', verticalAlign: 'middle' }}
        value={Object.keys(this.props.frequencyLevels).findIndex(el => el === this.state.frequency)}
        onChange={this.setFrequency}
      >
      {
        Object.keys(this.props.frequencyLevels).map((el, i) =>
          <MenuItem key={i} type='text' value={i} primaryText={this.props.frequencyLevels[el]} style={{ cursor: 'pointer' }} />
        )
      }
      </SelectField>
    );
  }
}
