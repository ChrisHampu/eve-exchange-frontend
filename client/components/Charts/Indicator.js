/* eslint-disable global-require */
import React from 'react';

export default class Indicator extends React.Component {

  static propTypes = {

    xScale: React.PropTypes.func,
    yScale: React.PropTypes.func,
    data: React.PropTypes.array,
    xAccessor: React.PropTypes.func,
    yAccessor: React.PropTypes.func
  };

  constructor(props) {
    super(props)
  }

  update() {


  }

  componentWillMount() {


  }

  componentWillReceiveProps(nextProps) {

  }

  render() {

    return (
      <g>
      {
        this.props.data.map((el, i, arr) => {

          let line = null;

          if (i > 0) {

              let x1 = this.props.xScale(this.props.xAccessor(arr[i-1]));
              let y1 = this.props.yScale(this.props.yAccessor(arr[i-1]));
              let x2 = this.props.xScale(this.props.xAccessor(el));
              let y2 = this.props.yScale(this.props.yAccessor(el));

            line = <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={2} stroke="#59c8e2" />
          }

          return (
            line
          );
        })
      }
      {
        this.props.data.map((el, i) => {
          return (
            <circle onMouseOver={(ev)=>{this.props.mouseOver(ev,el,"spread");}} mouseOut={()=>{this.props.mouseOut();}} key={i} cx={this.props.xScale(this.props.xAccessor(el))} cy={this.props.yScale(this.props.yAccessor(el))} r="5" fill="#eba91b"/>
          );
        })
      }
      </g>
    )
  }
}