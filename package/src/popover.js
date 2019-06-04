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
    position: PropTypes.oneOf(['bottom', 'top']),
    showChevronIcon: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
  };

  static defaultProps = {
    alignment: 'left',
    position: 'bottom',
    disabled: false,
    showChevronIcon: true,
    style: {}
  };

  state = {
    isOpen: false
  };

  componentDidMount() {
    document.addEventListener('click', this.close);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.close);
  }

  open = () => {
    if (!this.state.isOpen) {
      setTimeout(() => {
        this.setState({isOpen: true});
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
    const {isOpen} = this.state;

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
        {typeof children === 'function' ?
          children({isOpen, open: this.open}) :
          React.cloneElement(children, {onClick: this.open})}
        {isOpen && (
          <div style={containerStyle}>
            <div style={contentStyle}>
              {typeof content === 'function' ? content({close: this.close}) : content}
            </div>
          </div>
        )}
      </div>
    );
  }
}
