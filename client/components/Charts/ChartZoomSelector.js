import React from 'react';
import IconButton from 'material-ui/IconButton';
import PlusIcon from 'material-ui/svg-icons/content/add';
import MinusIcon from 'material-ui/svg-icons/content/remove';

export default class ChartZoomSelector extends React.Component {

  static propTypes = {
    zoomLevels: React.PropTypes.array,
    defaultZoom: React.PropTypes.number,
    onZoomChanged: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      zoom: props.defaultZoom || 0,
    };
  }

  zoomChanged() {

    if (this.props.onZoomChanged) {
      this.props.onZoomChanged(this.state.zoom);
    }
  }

  increaseZoom() {

    this.setState({
      zoom: Math.max(this.state.zoom - 1, 0)
    }, () => this.zoomChanged());
  }

  decreaseZoom() {

    this.setState({
      zoom: Math.min(this.state.zoom + 1, this.props.zoomLevels.length - 1)
    }, () => this.zoomChanged());
  }

  render() {
    return (
      <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <IconButton tooltip='Zoom In' onClick={() => this.increaseZoom()}>
          <PlusIcon />
        </IconButton>
        <IconButton tooltip='Zoom Out' onClick={() => this.decreaseZoom()}>
          <MinusIcon />
        </IconButton>
      </div>
    );
  }
}
