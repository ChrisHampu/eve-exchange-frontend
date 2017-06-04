import React from 'react';
import throttle from 'lodash/throttle';

export default class Measure extends React.Component {

  static propTypes = {
    children: React.PropTypes.node,
    component: React.PropTypes.node,
    properties: React.PropTypes.array
  }

  static defaultProps = {
    properties: ['offsetWidth', 'offsetHeight']
  };

  componentDidMount() {

    this.measure();
    this.measure.flush();

    window.addEventListener('resize', this.measure);
  }

  componentWillUnmount() {

    window.removeEventListener('resize', this.measure);
    this.measure.cancel();
  }

  measure = throttle(() => {

    const root = this.refs.root;

    if (!root) {
      return;
    }

    const {
      properties
    } = this.props;

    const nextState = {};

    properties.forEach(prop => {
      nextState[prop] = root[prop];
    });

    /*
    console.log(getComputedStyle(root));
    if (computedStyleProps) {

      nextState.computedStyle = {};

      const computedStyle = getComputedStyle(root);

      computedStyleProps.forEach(prop => {
        nextState.computedStyle[prop] = computedStyle[prop];
      });
    }
    */
    this.setState(nextState);

  }, 16.6);

  render() {

    return (
      <div ref='root' style={{ flex: 1, lineHeight: 0 }}>
        {React.Children.map(this.props.children, child => child && React.cloneElement(child, this.state))}
      </div>
    );
  }
}
