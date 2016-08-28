/* eslint-disable global-require */
import React from 'react';
import s from './OverlayStack.scss';
import cx from 'classnames';

export default class OverlayStack extends React.Component {

  static propTypes = {
    popStack: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      topOpen: false
    };
  }

  componentDidMount() {

    this.transitionIn();
  }

  transitionIn() {

    setTimeout(() => {

      this.setState({
        topOpen: true
      });

    }, 250);
  }

  componentWillReceiveProps(newProps) {

    this.setState({
      topOpen: false

    }, async () => {

      this.transitionIn();
    });
  }

  transitionOut() {

    this.setState({
      topOpen: false

    }, async () => {

      setTimeout(() => {

        this.props.popStack()

      }, 350);
    });
  }

  render() {

    if (!Array.isArray(this.props.children)) {
      return (
        <div className={s.root}><div className={s.tab_stack}>{this.props.children}</div></div>
      )
    }

    let topChildren = this.props.children.slice(Math.max(0, this.props.children.length - 2), Math.max(2, this.props.children.length));

    return (
      <div className={s.root}>
      {
        this.props.children.map((el, i) => {

          if (!el) {
            return null;
          }

          let lowerChild = el === topChildren[0];
          let topChild = el === topChildren[1];

          return (
            <div key={i} className={cx(s.tab_stack, { [s.root]: lowerChild, [s.fadeout]: topChild, [s.open]: topChild && this.state.topOpen, [s.hidden]: !lowerChild && !topChild })}>
              <div className={s.pane}>{el}</div>
              {
                lowerChild && topChildren[1] ?
                  <div onClick={()=>this.transitionOut()} className={cx(s.tab_stack_overlay, { [s.open]: this.props.children !== null} )}>
                  </div> : false
              }
            </div>
          )
        })
      }
      </div>
    );
  }
}