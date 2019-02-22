import React from 'react';
import PropTypes from 'prop-types';

export class FullHeight extends React.Component {
  static propTypes = {
    growable: PropTypes.bool,
    style: PropTypes.object,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    growable: true
  };

  render() {
    const {growable, style, children} = this.props;

    // Use IE11 fix: https://codepen.io/chriswrightdesign/pen/emQNGZ/
    return (
      <div style={{display: 'flex'}}>
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            [growable ? 'minHeight' : 'height']: '100vh',
            ...style
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}
