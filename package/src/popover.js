import React from 'react';
import {withRadiumStarter} from 'radium-starter';
import PropTypes from 'prop-types';

@withRadiumStarter
export class Popover extends React.Component {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    alignment: PropTypes.oneOf(['left', 'right']),
    position: PropTypes.oneOf(['bottom', 'top', 'cursor']),
    style: PropTypes.object,
    contentStyle: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    alignment: 'left',
    position: 'bottom'
  };

  state = {
    isOpen: false,
    overlayPosition: undefined, // where to position the overlay when the Popover position is "cursor"
    context: undefined // data from the customer, to be passed to the context menu
  };

  triggerRef = React.createRef(); // to access the element that triggers the popover (a button for example)

  contentRef = React.createRef();

  componentWillUnmount() {
    this.removeEventListeners();
  }

  handleBodyClick = event => {
    // TODO: Strop propagation and preventDefault?
    if (this.isOutsideClick(event)) {
      this.close(); // close if the user has clicked outside the popover
    }
  };

  isOutsideClick = event => {
    const triggerNode = this.triggerRef.current;
    const contentNode = this.contentRef.current;

    if (triggerNode.contains(event.target)) {
      return false;
    }

    if (contentNode.contains(event.target)) {
      return false;
    }

    return true;
  };

  handleBodyKeyDown = e => {
    if (e.keyCode === 27) {
      // TODO: Strop propagation and preventDefault?
      this.close(); // Escape key
    }
  };

  open = (event, context) => {
    const overlayPosition = this.getOverlayPosition(event);
    this.setState({isOpen: true, overlayPosition, context});
    this.addEventListeners();
  };

  close = () => {
    this.setState({isOpen: false});
    this.removeEventListeners();
  };

  toggle = (...params) => {
    if (this.state.isOpen) {
      this.close(...params);
    } else {
      this.open(...params);
    }
  };

  addEventListeners = () => {
    document.body.addEventListener('click', this.handleBodyClick);
    document.body.addEventListener('keydown', this.handleBodyKeyDown);
  };

  removeEventListeners = () => {
    document.body.removeEventListener('click', this.handleBodyClick);
    document.body.removeEventListener('keydown', this.handleBodyKeyDown);
  };

  getOverlayPosition = event => {
    const {offsetLeft: containerX, offsetTop: containerY} = event.currentTarget;
    const {offsetX, offsetY} = event.nativeEvent;

    return {
      x: containerX + offsetX,
      y: containerY + offsetY
    };
  };

  render() {
    const {
      content,
      alignment,
      position,
      style,
      contentStyle,
      theme: t,
      styles: s,
      children
    } = this.props;
    const {isOpen, overlayPosition, context} = this.state;

    let alignmentStyle;
    if (isOpen) {
      alignmentStyle = {
        paddingTop: '4px',
        paddingBottom: '4px'
      };

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
    }

    return (
      <div style={{position: 'relative', ...style}}>
        <div ref={this.triggerRef}>
          {children({isOpen, open: this.open, toggle: this.toggle, close: this.close})}
        </div>
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              display: 'block',
              left: 0,
              minWidth: '10rem',
              top: '100%',
              zIndex: 20000,
              ...alignmentStyle,
              ...contentStyle
            }}
          >
            <div
              ref={this.contentRef}
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
