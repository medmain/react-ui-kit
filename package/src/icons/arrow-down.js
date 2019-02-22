import React from 'react';
import PropTypes from 'prop-types';

// Source: https://material.io/tools/icons/?icon=arrow_downward

export class ArrowDownIcon extends React.Component {
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
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path fill="#010101" d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
      </svg>
    );
  }
}
