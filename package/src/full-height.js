import React from 'react';
import PropTypes from 'prop-types';

import {WindowSize} from './window-size';

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
      <WindowSize>
        {({height}) => (
          <div style={{display: 'flex'}}>
            <div
              style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                [growable ? 'minHeight' : 'height']: height,
                ...style
              }}
            >
              {children}
            </div>
          </div>
        )}
      </WindowSize>
    );
  }
}
