import React from 'react';
import {withRadiumStarter} from 'radium-starter';
import PropTypes from 'prop-types';
import {Button} from './button';
import {ChevronDownIcon, ChevronUpIcon} from './icons';

@withRadiumStarter
export class DropdownMenu extends React.Component {
  static propTypes = {
    alignment: PropTypes.oneOf(['left', 'right']),
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    position: PropTypes.oneOf(['bottom', 'top']),
    showChevronIcon: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node
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
    const {
      alignment,
      disabled,
      position,
      label,
      showChevronIcon,
      style,
      theme: t,
      styles: s,
      children
    } = this.props;
    const {isOpen} = this.state;

    const Icon = position === 'top' ? ChevronUpIcon : ChevronDownIcon;

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

    const dropdownStyle = {
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

    const dropdownContentStyle = {
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
          position: 'relative'
        }}
      >
        <Button onClick={this.open} disabled={disabled}>
          {typeof label === 'function' ? label() : label}
          {showChevronIcon && (
            <Icon
              size={20}
              style={{
                display: 'inline-block',
                verticalAlign: 'top',
                marginRight: '-0.25rem',
                marginLeft: '0.25rem'
              }}
            />
          )}
        </Button>
        {isOpen && (
          <div style={dropdownStyle}>
            <div style={dropdownContentStyle}>{children}</div>
          </div>
        )}
      </div>
    );
  }
}

@withRadiumStarter
export class DropdownItem extends React.Component {
  static propTypes = {
    key: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  render() {
    const {key, disabled, onClick, theme: t, children} = this.props;

    const props = {
      key,
      style: {
        padding: '.15rem .75rem'
      }
    };

    if (disabled) {
      Object.assign(props.style, {
        cursor: t.disabledCursor,
        opacity: 0.5
      });
    } else {
      Object.assign(props.style, {
        cursor: 'pointer',
        ':hover': {backgroundColor: t.hoveredButtonBackgroundColor}
      });
      props.onClick = onClick;
    }

    return <div {...props}>{children}</div>;
  }
}
