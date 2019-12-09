import React from 'react';
import PropTypes from 'prop-types';
import {Select as RSSelect} from 'radium-starter';
import isEqual from 'lodash/isEqual';

import {withForwardedRef} from './helpers';
import {RSInput} from './rs-input';

@withForwardedRef
export class Select extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['auto', 'select', 'radio', 'checkbox']), // 'auto' (default), 'select' or 'radio'
    forwardedRef: PropTypes.object,
    options: PropTypes.array.isRequired,
    hasEmptyOption: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
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
      !isEqual(nextProps.value, this.props.value) ||
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
    let {type, forwardedRef, options, value, hasEmptyOption, style, ...otherProps} = this.props;

    if (type === 'auto') {
      const multiValueDefaultType = 'checkbox';
      const singleValueDefaultType = options.length < 5 ? 'radio' : 'select';
      type = Array.isArray(value) ? multiValueDefaultType : singleValueDefaultType;
    }

    if (type === 'radio') {
      return <RadioSelect ref={forwardedRef} {...this.props} />;
    }

    if (type === 'checkbox') {
      return <CheckboxSelect ref={forwardedRef} {...this.props} />;
    }

    return (
      <RSSelect
        ref={forwardedRef}
        value={value}
        {...otherProps}
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
    type: 'radio',
    layout: 'vertical'
  };

  name = getRandomId();

  shouldComponentUpdate(nextProps, _nextState) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.onChange !== this.props.onChange ||
      nextProps.required !== this.props.required ||
      !isEqual(nextProps.options, this.props.options)
    );
  }

  handleChange = event => {
    const {value} = event.target;
    this.props.onChange(value);
  };

  render() {
    const {options, value, forwardedRef, required, layout} = this.props;

    let rendering = options.map((option, index) => {
      const id = this.name + '-' + option.value;

      return (
        <div
          key={id}
          style={{
            display: layout === 'vertical' ? 'flex' : 'inline-flex',
            alignItems: 'center',
            marginLeft: layout === 'horizontal' ? '1rem' : undefined
          }}
        >
          <RSInput
            ref={index === 0 ? forwardedRef : undefined} // to be able to set focus on the 1st radio button
            type="radio"
            id={id}
            name={this.name}
            value={option.value}
            checked={value === option.value}
            onChange={this.handleChange}
            required={required}
          />
          <label htmlFor={id} style={{paddingLeft: '0'}}>
            {option.label}
          </label>
        </div>
      );
    });

    if (layout === 'vertical') {
      return rendering;
    }

    rendering = <div style={{display: 'flex', marginLeft: '-1rem'}}>{rendering}</div>;

    return rendering;
  }
}
@withForwardedRef
export class CheckboxSelect extends React.Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.array.isRequired,
    forwardedRef: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool
  };

  name = getRandomId();

  shouldComponentUpdate(nextProps, _nextState) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.onChange !== this.props.onChange ||
      nextProps.required !== this.props.required ||
      !isEqual(nextProps.options, this.props.options)
    );
  }

  handleChange = event => {
    const {value: inputValues} = this.props;
    const inputNode = event.target;
    const {value, checked} = inputNode;

    const updatedInputValues = checked
      ? [...inputValues, value]
      : inputValues.filter(val => val !== value);
    this.props.onChange(updatedInputValues);
  };

  render() {
    const {options, value, forwardedRef, required} = this.props;

    return options.map((option, index) => {
      const id = this.name + '-' + option.value;

      return (
        <div key={id} style={{display: 'flex', alignItems: 'center'}}>
          <RSInput
            ref={index === 0 ? forwardedRef : undefined} // to be able to set focus on the 1st radio button
            type="checkbox"
            id={id}
            name={this.name}
            value={option.value}
            checked={value.includes(option.value)}
            onChange={this.handleChange}
            required={required}
          />
          <label htmlFor={id} style={{paddingLeft: '0'}}>
            {option.label}
          </label>
        </div>
      );
    });
  }
}

function getRandomId() {
  return String(Math.round(Math.random() * 1000000000));
}
