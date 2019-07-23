import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter, Input as OriginalRSInput} from 'radium-starter';

import {withForwardedRef} from './helpers';

@withForwardedRef
export class RSInput extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    disabled: PropTypes.bool
  };

  render() {
    const {forwardedRef, type, ...props} = this.props;

    switch (type) {
      case 'checkbox':
      case 'radio':
        return <ToggleInput forwardedRef={forwardedRef} type={type} {...props} />;
      default:
        return <OriginalRSInput ref={forwardedRef} type={type} {...props} />;
    }
  }
}

class ToggleInput extends React.Component {
  inputRef = this.props.forwardedRef || React.createRef();

  handleClick = ({nativeEvent: {shiftKey}}) => {
    const element = this.inputRef.current.domElement;
    const event = new MouseEvent('click', {
      bubbles: true,
      shiftKey
    });
    element.dispatchEvent(event);
  };

  render() {
    const {type, checked, forwardedRef, ...props} = this.props;

    const CustomComponent = type === 'checkbox' ? CheckboxMark : RadioMark;

    return (
      <>
        <CustomComponent {...this.props} onClick={this.handleClick} />
        <OriginalRSInput
          ref={this.inputRef}
          {...props}
          checked={checked}
          type={type}
          style={{
            // Styles used to hide the underlying `<input>` tag.
            // Don't use `display: 'none'` to be able to focus the checkbox with the keyboard
            opacity: 0,
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            width: '0.5rem', // don't set to 0: HTML field validation messages don't show up in Chrome
            height: '0.5rem'
          }}
        />
      </>
    );
  }
}

// sub-components (not exported)

@withRadiumStarter
class CheckboxMark extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  render() {
    const {checked, onClick, disabled, style, theme: t, styles: s} = this.props;

    const getBackgroundColor = () => {
      if (disabled) {
        return t.altBackgroundColor;
      }

      if (checked) {
        return t.primaryColor;
      }

      return 'white';
    };

    const getTickColor = () => {
      if (disabled) {
        return t.altTextColor;
      }
      if (checked) {
        return 'white';
      }
      return undefined;
    };

    const inlineSVG = encodeURIComponent(`
      <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10.6 0.200059C11.0418 0.53143 11.1314 1.15823 10.8 1.60006L4.8 9.60006C4.62607 9.83197 4.36005 9.97699 4.07089 9.99754C3.78173 10.0181 3.49788 9.91215 3.29289 9.70717L0.292893 6.70717C-0.0976311 6.31664 -0.0976311 5.68348 0.292893 5.29295C0.683417 4.90243 1.31658 4.90243 1.70711 5.29295L3.89181 7.47765L9.2 0.400059C9.53137 -0.0417689 10.1582 -0.131312 10.6 0.200059Z"
          fill="${getTickColor()}"
        />
      </svg>
    `);

    return (
      <span
        onClick={onClick}
        style={{
          ...s.border,
          ...s.rounded,
          flex: '0 0 auto',
          display: 'inline-block',
          width: '20px',
          height: '20px',
          borderWidth: '2px',
          borderColor: !checked && !disabled ? t.grayIconColor : 'transparent',
          backgroundColor: getBackgroundColor(),
          backgroundImage: checked ? `url('data:image/svg+xml,${inlineSVG}')` : null,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          MozUserSelect: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          transitionDuration: '0.3s',
          ...style
        }}
      />
    );
  }
}

@withRadiumStarter
class RadioMark extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired
  };

  render() {
    const {checked, onClick, disabled, style, theme: t} = this.props;

    const getOuterColor = () => {
      if (disabled) {
        return t.altBackgroundColor;
      }
      if (checked) {
        return t.primaryColor;
      }
      return t.grayIconColor;
    };

    const getInnerColor = () => {
      if (disabled) {
        return checked ? t.altTextColor : t.altBackgroundColor;
      }
      return 'white';
    };

    return (
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          flexShrink: 0,
          alignItems: 'center',
          backgroundColor: getOuterColor(),
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          justifyContent: 'center',
          verticalAlign: 'middle',
          cursor: disabled ? 'not-allowed' : 'pointer',
          ...style
        }}
      >
        <div
          style={{
            backgroundColor: getInnerColor(),
            borderRadius: '50%',
            width: checked ? '6px' : '16px',
            height: checked ? '6px' : '16px',
            transitionDuration: '0.2s'
          }}
        />
      </div>
    );
  }
}
