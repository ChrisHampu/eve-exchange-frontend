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

    const newChildren = this.getTopChildren(newProps);
    const oldChildren = this.getTopChildren(this.props);

    // This check ensures there's no unecessary re-rendering or transitions
    if (newChildren[1] && newChildren[1] !== oldChildren[1]) {

      this.setState({
        topOpen: false

      }, async () => {

        setTimeout(() => {

          this.transitionIn();

        }, 100);
      });
    }
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

  getTopChildren(props) {

    return props.children.slice(Math.max(0, this.props.children.length - 2), Math.max(2, this.props.children.length));
  }

  render() {

    if (!Array.isArray(this.props.children)) {
      return (
        <div className={s.root}><div className={s.tab_stack}>{this.props.children}</div></div>
      )
    }

    const topChildren = this.getTopChildren(this.props);

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