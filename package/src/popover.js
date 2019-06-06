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
    overlayPosition: {}, // where to position the overlay when the Popover position is "cursor"
    context: undefined // data from the customer, to be passed to the context menu
  };

  targetRef = React.createRef(); // to access the element that triggers the popover (a button for example)

  popoverRef = React.createRef();

  componentWillUnmount() {
    this.cleanup();
  }

  cleanup = () => {
    document.body.removeEventListener('click', this.handleBodyClick);
    document.body.removeEventListener('keydown', this.handleBodyKeyDown);
  };

  handleBodyClick = event => {
    if (this.isOutsideClick(event)) {
      this.close(); // close if the user has clicked outside the popover
    }
  };

  isOutsideClick = event => {
    const targetNode = this.targetRef.current;
    const popoverNode = this.popoverRef.current;

    if (targetNode.contains(event.target)) {
      return false;
    }

    if (popoverNode.contains(event.target)) {
      return false;
    }

    return true;
  };

  handleBodyKeyDown = e => {
    if (e.keyCode === 27) {
      this.close(); // Escape key
    }
  };

  open = (event, context) => {
    const overlayPosition = this.getOverlayPosition(event);

    this.setState({isOpen: true, overlayPosition, context});

    document.body.addEventListener('click', this.handleBodyClick);
    document.body.addEventListener('keydown', this.handleBodyKeyDown);
  };

  close = () => {
    this.setState({isOpen: false});
    this.cleanup();
  };

  toggle = (...params) => {
    if (this.state.isOpen) {
      this.close(...params);
    } else {
      this.open(...params);
    }
  };

  getOverlayPosition = event => {
    const {offsetX, offsetY} = event.nativeEvent;
    const {offsetLeft, offsetTop} = event.currentTarget;

    return {
      x: offsetLeft + offsetX,
      y: offsetTop + offsetY
    };
  };

  render() {
    const {content, alignment, position, style, theme: t, styles: s, children} = this.props;
    const {isOpen, overlayPosition, context} = this.state;

    const overlayOffset = '4px';
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
        paddingBottom: overlayOffset,
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

    return (
      <div
        style={{
          position: 'relative',
          display: 'inline-block'
        }}
      >
        <div ref={this.popoverRef}>
          {children({isOpen, open: this.open, toggle: this.toggle, close: this.close})}
        </div>
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              display: 'block',
              left: 0,
              minWidth: '10rem',
              paddingTop: overlayOffset,
              top: '100%',
              zIndex: 4000,
              ...alignmentStyle,
              ...style
            }}
          >
            <div
              ref={this.targetRef}
              style={{
                ...s.border,
                ...s.rounded,
                borderColor: t.buttonBorderColor,
                backgroundColor: t.buttonBackgroundColor,
                paddingBottom: '0.5rem',
                paddingTop: '0.5rem'
              }}
            >
              {typeof content === 'function' ? content({close: this.close, ...context}) : content}
            </div>
          </div>
        )}
      </div>
    );
  }
}
