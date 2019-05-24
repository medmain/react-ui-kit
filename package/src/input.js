import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter, Input as OriginalRSInput} from 'radium-starter';

export const withForwardedRef = Wrapped =>
  React.forwardRef((props, ref) => {
    return <Wrapped {...props} forwardedRef={ref} />;
  });

@withForwardedRef
export class RSInput extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    disabled: PropTypes.bool
  };

  getCustomComponent() {
    const {type} = this.props;

    if (type === 'checkbox') {
      return CheckboxMark;
    }
    if (type === 'radio') {
      return RadioMark;
    }

    return undefined;
  }

  render() {
    const {forwardedRef, ...props} = this.props;
    const CustomComponent = this.getCustomComponent();

    if (!CustomComponent) {
      return <OriginalRSInput {...props} ref={forwardedRef} />;
    }

    return (
      <>
        <CustomComponent {...props} style={{cursor: props.disabled ? 'not-allowed' : 'pointer'}} />
        <OriginalRSInput
          ref={forwardedRef}
          {...props}
          style={{
            // Styles used to hide the underlying `<input>` tag.
            // Don't use `display: 'none'` to be able to focus the checkbox with the keyboard
            // Don't use `width: 0, height: 0`, otherwise HTML field validation messages don't show up
            opacity: 0,
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            position: 'absolute'
          }}
        />
      </>
    );
  }
}

// sub-components (not exported)

@withRadiumStarter
export class CheckboxMark extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  render() {
    const {disabled, checked, style, theme: t, styles: s} = this.props;

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
          transitionDuration: '0.3s',
          ...style
        }}
      />
    );
  }
}

@withRadiumStarter
export class RadioMark extends React.Component {
  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired
  };

  render() {
    const {disabled, checked, style, theme: t} = this.props;

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
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: getOuterColor(),
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          justifyContent: 'center',
          margin: '2px',
          verticalAlign: 'middle',
          flexShrink: 0,
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
