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

    return (
      <WindowSize>
        {({height}) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              [growable ? 'minHeight' : 'height']: height,
              ...style
            }}
          >
            {children}
          </div>
        )}
      </WindowSize>
    );
  }
}
