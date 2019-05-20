import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';
import omit from 'lodash/omit';

import {Asterisk} from './form';

@withRadiumStarter
export class CheckboxInput extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func, // not required when the checkbox is `disabled`
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  id = String(Math.round(Math.random() * 1000000000));

  shouldComponentUpdate(nextProps, _nextState) {
    return (
      nextProps.label !== this.props.label ||
      nextProps.value !== this.props.value ||
      nextProps.onChange !== this.props.onChange ||
      nextProps.required !== this.props.required
    );
  }

  handleChange = event => {
    this.props.onChange(event.target.checked, event);
  };

  render() {
    const {label, disabled} = this.props;

    return (
      <label
        htmlFor={this.id}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        {this.renderCheckboxMark()}
        {this.renderHiddenInput()}
        {label && this.renderLabel()}
      </label>
    );
  }

  renderCheckboxMark = () => {
    const {disabled, value, theme: t, styles: s} = this.props;

    const getBackgroundColor = () => {
      if (disabled) {
        return t.altBackgroundColor;
      }
      if (value) {
        return t.primaryColor;
      }
      return 'white';
    };

    const getTickColor = () => {
      if (disabled) {
        return t.altTextColor;
      }
      if (value) {
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
          borderColor: !value && !disabled ? t.grayIconColor : 'transparent',
          backgroundColor: getBackgroundColor(),
          backgroundImage: value ? `url('data:image/svg+xml,${inlineSVG}')` : null,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          transitionDuration: '0.3s'
        }}
      />
    );
  };

  renderHiddenInput = () => {
    const {value} = this.props;

    return (
      <input
        {...omit(this.props, ['value', 'theme', 'styles'])}
        id={this.id}
        type="checkbox"
        checked={value || false}
        onChange={this.handleChange}
        style={{
          // don't use `display: 'none'` to be able to focus the checkbox with the keyboard
          // don't use `width: 0, height: 0`, otherwise HTML field validation messages don't show up
          opacity: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 0,
          position: 'absolute'
        }}
      />
    );
  };

  renderLabel = () => {
    const {label, disabled, required, theme: t} = this.props;

    return (
      <div style={{marginLeft: '0.5rem', color: disabled ? t.altTextColor : undefined}}>
        {label}
        {required && <Asterisk />}
      </div>
    );
  };
}
