import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

export class WindowSize extends React.Component {
  static propTypes = {
    throttleMs: PropTypes.number,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    throttleMs: 200
  };

  state = this.getWindowSize();

  getWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {width, height};
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  setWindowSize = () => {
    const size = this.getWindowSize();
    this.setState(size);
  };

  handleResize = throttle(this.setWindowSize, this.props.throttleMs);

  render() {
    return this.props.children({...this.state});
  }
}
