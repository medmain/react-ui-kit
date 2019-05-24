import React from 'react';
import PropTypes from 'prop-types';
import {Select as RSSelect} from 'radium-starter';
import isEqual from 'lodash/isEqual';

import {withForwardedRef} from './helpers';
import {RSInput} from './rs-input';

@withForwardedRef
export class Select extends React.Component {
  static propTypes = {
    type: PropTypes.string, // 'auto' (default), 'select' or 'radio'
    forwardedRef: PropTypes.object,
    options: PropTypes.array.isRequired,
    hasEmptyOption: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    style: PropTypes.object
  };

  static defaultProps = {
    type: 'auto',
    hasEmptyOption: false
  };

  shouldComponentUpdate(nextProps, _nextState) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.onChange !== this.props.onChange ||
      nextProps.required !== this.props.required ||
      nextProps.disabled !== this.props.disabled ||
      !isEqual(nextProps.options, this.props.options)
    );
  }

  handleChange = event => {
    this.props.onChange(event.target.value);
  };

  render() {
    let {type, forwardedRef, options, hasEmptyOption, style, ...props} = this.props;

    if (type === 'auto') {
      type = options.length < 5 ? 'radio' : 'select';
    }

    if (type === 'radio') {
      return <RadioSelect ref={forwardedRef} {...this.props} />;
    }

    return (
      <RSSelect
        ref={forwardedRef}
        {...props}
        onChange={this.handleChange}
        style={{display: 'block', width: '100%', ...style}}
      >
        {hasEmptyOption && <option value="" />}
        {options.map(option => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </RSSelect>
    );
  }
}

@withForwardedRef
export class RadioSelect extends React.Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.string,
    forwardedRef: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    layout: PropTypes.string // 'vertical' (default) or 'horizontal'
  };

  static defaultProps = {
    layout: 'vertical'
  };

  name = String(Math.round(Math.random() * 1000000000));

  shouldComponentUpdate(nextProps, _nextState) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.onChange !== this.props.onChange ||
      nextProps.required !== this.props.required ||
      !isEqual(nextProps.options, this.props.options)
    );
  }

  handleChange = event => {
    this.props.onChange(event.target.value);
  };

  render() {
    const {options, value, forwardedRef, required, layout} = this.props;

    let rendering = options.map((option, index) => {
      const id = this.name + '-' + option.value;

      return (
        <label
          htmlFor={id}
          key={id}
          ref={index === 0 ? forwardedRef : undefined} // to be able to set focus on the 1st radio button
          style={{
            display: layout === 'vertical' ? 'flex' : 'inline-flex',
            alignItems: 'center',
            marginLeft: layout === 'horizontal' ? '1rem' : undefined
          }}
        >
          <RSInput
            type="radio"
            id={id}
            name={this.name}
            value={option.value}
            checked={value === option.value}
            onChange={this.handleChange}
            required={required}
          />
          <span style={{paddingLeft: '0.5rem'}}>{option.label}</span>
        </label>
      );
    });

    if (layout === 'vertical') {
      return rendering;
    }

    rendering = <div style={{display: 'flex', marginLeft: '-1rem'}}>{rendering}</div>;

    return rendering;
  }
}
