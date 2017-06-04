import React from 'react';
import ReactDOM from 'react-dom';
import { formatNumber } from '../../utilities';

export default class Tooltip extends React.Component {

  static propTypes = {

    item: React.PropTypes.object,
    style: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      tooltipVisible: false,
      tooltipUninteractive: false,
      tooltipUpdated: false,
      tooltipItem: null,
      tooltipX: 0,
      tooltipY: 0,
      tooltipPresentation: null
    }
  }

  showTooltip(x, y, presentation) {

    this.setState({
      tooltipUpdated: true,
      tooltipUninteractive: false,
      tooltipVisible: false,
      tooltipItem: null,
      tooltipX: x,
      tooltipY: y,
      tooltipPresentation: presentation
    });
  }

  hideTooltip() {

    this.setState({
      tooltipVisible: false,
      tooltipUpdated: false,
    }, () => {

      setTimeout(() => {

        if (!this.state.tooltipVisible) {
          this.setState({
            tooltipUninteractive: true
          });
        }
      }, 350);
    });
  }

  componentDidUpdate() {

    if (this.state.tooltipUpdated === true && this.state.tooltipVisible === false) {

      if (!this.refs.tooltip) {

        return;
      }

      this.setState({
        tooltipVisible: true,
        tooltipX: this.state.tooltipX - ReactDOM.findDOMNode(this.refs.tooltip).clientWidth / 2,
        tooltipY: this.state.tooltipY - ReactDOM.findDOMNode(this.refs.tooltip).clientHeight / 2,
      });
    }
  }

  render() {

    if (!this.state.tooltipPresentation) {
      return <div />;
    }

    let contents = this.state.tooltipPresentation || "Loading";

    return (
      <div 
        ref="tooltip"
        style={{...this.props.style, pointerEvents: "none", cursor: "pointer", transition: "opacity 350ms ease-in-out", fontWeight: "bold", padding: "0.75rem 0.5rem", fontSize: "0.8rem", background: "rgb(38, 43, 47)", display: this.state.tooltipUninteractive ? "none" : "block", opacity: this.state.tooltipVisible ? 1 : 0, color: "rgb(235, 169, 27)", borderRadius: "4px", position: "absolute", left: this.state.tooltipX, top: this.state.tooltipY}}
        >
        {contents}
      </div>
    )
  }
};
