import React from 'react';
import {withRadiumStarter} from 'radium-starter';
import PropTypes from 'prop-types';

@withRadiumStarter
export class Popover extends React.Component {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    alignment: PropTypes.oneOf(['left', 'right']),
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    position: PropTypes.oneOf(['bottom', 'top', 'cursor']),
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    alignment: 'left',
    position: 'bottom',
    disabled: false,
    style: {}
  };

  state = {
    isOpen: false,
    overlayPosition: {} // where to position the overlay when the Popover position is "cursor"
  };

  componentDidMount() {
    document.addEventListener('click', this.close);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.close);
  }

  open = (event, context) => {
    const {offsetX, offsetY} = event.nativeEvent;

    const overlayPosition = {
      x: event.target.offsetLeft + offsetX,
      y: event.target.offsetTop + offsetY
    };

    if (!this.state.isOpen) {
      setTimeout(() => {
        this.setState({isOpen: true, overlayPosition, context});
      }, 30);
    }
  };

  close = () => {
    if (this.state.isOpen) {
      this.setState({isOpen: false});
    }
  };

  render() {
    const {content, alignment, position, style, theme: t, styles: s, children} = this.props;
    const {isOpen, overlayPosition, context} = this.state;

    const dropdownContentOffset = '4px';

    let alignmentStyle = {};

    if (alignment === 'right') {
      alignmentStyle = {
        left: 'auto',
        right: 0
      };
    }

    if (position === 'top') {
      alignmentStyle = {
        ...alignmentStyle,
        bottom: '100%',
        paddingBottom: dropdownContentOffset,
        top: 'auto'
      };
    }

    if (position === 'cursor') {
      alignmentStyle = {
        ...alignmentStyle,
        bottom: 'auto',
        left: overlayPosition.x,
        top: overlayPosition.y
      };
    }

    const containerStyle = {
      position: 'absolute',
      display: 'block',
      left: 0,
      minWidth: '10rem',
      paddingTop: dropdownContentOffset,
      top: '100%',
      zIndex: 4000,
      ...alignmentStyle,
      ...style
    };

    const contentStyle = {
      ...s.border,
      ...s.rounded,
      borderColor: t.buttonBorderColor,
      backgroundColor: t.buttonBackgroundColor,
      paddingBottom: '0.5rem',
      paddingTop: '0.5rem'
    };

    return (
      <div
        style={{
          position: 'relative',
          display: 'inline-block'
        }}
      >
        {children({isOpen, open: this.open})}
        {isOpen && (
          <div style={containerStyle}>
            <div style={contentStyle}>
              {typeof content === 'function' ? content({close: this.close, ...context}) : content}
            </div>
          </div>
        )}
      </div>
    );
  }
}
