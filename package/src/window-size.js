import React from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';

export class WindowSize extends React.Component {
  static propTypes = {
    wait: PropTypes.number,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    wait: 200
  };

  state = this.getWindowSize();

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {width, height};
  }

  setWindowSize = () => {
    const size = this.getWindowSize();
    this.setState(size);
  };

  handleResize = throttle(this.setWindowSize, this.props.wait);

  render() {
    return this.props.children({...this.state});
  }
}
