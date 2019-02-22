import React from 'react';
import PropTypes from 'prop-types';

// Source: https://material.io/tools/icons/?icon=fullscreen

export class FullscreenEnterIcon extends React.Component {
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
        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
      </svg>
    );
  }
}
