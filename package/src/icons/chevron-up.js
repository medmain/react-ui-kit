import React from 'react';
import PropTypes from 'prop-types';

// Source: https://material.io/tools/icons/?icon=keyboard_arrow_up

export class ChevronUpIcon extends React.Component {
  static propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    size: 32,
    color: 'currentColor'
  };

  render() {
    const {size, color, style} = this.props;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill={color}
        viewBox="0 0 24 24"
        style={style}
      >
        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    );
  }
}
