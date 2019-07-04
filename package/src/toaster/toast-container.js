import React from 'react';
import PropTypes from 'prop-types';

export class ToastContainer extends React.Component {
  static propTypes = {
    position: PropTypes.oneOf(['top', 'bottom']),
    children: PropTypes.node
  };

  static defaultProps = {
    position: 'top'
  };

  render() {
    const {position, children} = this.props;

    const style = {
      position: 'absolute',
      zIndex: 30000, // the toasts should be on top of anything else
      right: 0,
      display: 'flex'
    };

    if (position === 'top') {
      Object.assign(style, {
        top: 0,
        flexDirection: 'column-reverse'
      });
    }
    if (position === 'bottom') {
      Object.assign(style, {
        bottom: 0,
        flexDirection: 'column'
      });
    }

    return <div style={style}>{children}</div>;
  }
}
