import React from 'react';
import PropTypes from 'prop-types';

// Source: https://material.io/tools/icons/?icon=arrow_forward

export class ArrowRightIcon extends React.Component {
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
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
      </svg>
    );
  }
}
