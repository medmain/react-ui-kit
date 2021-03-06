import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter, TextArea as RSTextArea} from 'radium-starter';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';

import {withLocale} from './locale-context';
import {withForwardedRef} from './helpers';
import {RSInput} from './rs-input';
import {Asterisk} from './form';

@withForwardedRef
export class Input extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    forwardedRef: PropTypes.object,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    required: PropTypes.bool,
    tabIndex: PropTypes.string,
    style: PropTypes.object
  };

  shouldComponentUpdate(nextProps, _nextState) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.onChange !== this.props.onChange ||
      nextProps.onFocus !== this.props.onFocus ||
      nextProps.onBlur !== this.props.onBlur ||
      nextProps.required !== this.props.required ||
      nextProps.tabIndex !== this.props.tabIndex
    );
  }

  handleChange = event => {
    this.props.onChange(event.target.value);
  };

  render() {
    const {forwardedRef, ...props} = this.props;

    return (
      <RSInput
        ref={forwardedRef}
        {...props}
        onChange={this.handleChange}
        style={{display: 'block', width: '100%', ...this.props.style}}
      />
    );
  }
}

@withForwardedRef
@withLocale
export class TextInput extends React.Component {
  static propTypes = {
    ...Input.propTypes,
    locale: PropTypes.object.isRequired
  };

  handleChange = value => {
    const {onChange, locale} = this.props;
    if (onChange) {
      onChange(locale.parseTextInput(value));
    }
  };

  render() {
    const {value, forwardedRef, onChange, locale, ...props} = this.props;
    return (
      <Input
        ref={forwardedRef}
        {...props}
        value={locale.formatTextInput(value)}
        onChange={this.handleChange}
      />
    );
  }
}

@withForwardedRef
@withLocale
export class NumberInput extends React.Component {
  static propTypes = {
    ...Input.propTypes,
    value: PropTypes.number,
    locale: PropTypes.object.isRequired
  };

  state = {
    draftValue: ''
  };

  static getDerivedStateFromProps({value, locale}) {
    if (value !== undefined && isNaN(value)) {
      return null;
    }
    const draftValue = locale.formatNumberInput(value);
    return {draftValue};
  }

  handleChange = draftValue => {
    const {onChange, locale} = this.props;
    this.setState({draftValue});
    if (onChange) {
      const value = locale.parseNumberInput(draftValue);
      onChange(value);
    }
  };

  render() {
    const {value, forwardedRef, locale, ...props} = this.props;
    const {draftValue} = this.state;
    return (
      <Input
        ref={forwardedRef}
        {...props}
        value={draftValue}
        onChange={this.handleChange}
        rsCustomValidity={
          value !== undefined && isNaN(value) ? locale.numberInputInvalidityMessage : ''
        }
      />
    );
  }
}

@withForwardedRef
@withLocale
export class TextArea extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    style: PropTypes.object,
    locale: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps, _nextState) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.onChange !== this.props.onChange ||
      nextProps.required !== this.props.required
    );
  }

  handleChange = event => {
    const {onChange, locale} = this.props;

    const value = locale.parseTextInput(event.target.value);
    onChange(value);
  };

  render() {
    const {forwardedRef, value, locale, ...props} = this.props;

    const formattedValue = locale.formatTextInput(value);

    return (
      <RSTextArea
        ref={forwardedRef}
        {...props}
        value={formattedValue}
        onChange={this.handleChange}
        style={{display: 'block', width: '100%', ...this.props.style}}
      />
    );
  }
}

@withForwardedRef
export class CheckboxInput extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    style: PropTypes.object
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
    const {label, value, forwardedRef, required, style} = this.props;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          ...style
        }}
        htmlFor={this.id}
      >
        <RSInput
          ref={forwardedRef}
          {...omit(this.props, ['value'])}
          id={this.id}
          type="checkbox"
          checked={value || false}
          onChange={this.handleChange}
        />
        {label && (
          <label style={{paddingLeft: '0', verticalAlign: 'middle'}} htmlFor={this.id}>
            {label}
            {required && <Asterisk />}
          </label>
        )}
      </div>
    );
  }
}

@withForwardedRef
@withRadiumStarter
@withLocale
export class AutocompleteInput extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    style: PropTypes.object,
    forwardedRef: PropTypes.object,
    locale: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  static defaultProps = {
    items: []
  };

  state = {
    items: []
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.onChange !== this.props.onChange ||
      nextProps.onFocus !== this.props.onFocus ||
      nextProps.onBlur !== this.props.onBlur ||
      nextProps.disabled !== this.props.disabled ||
      nextProps.required !== this.props.required ||
      nextProps.items !== this.props.items ||
      !isEqual(nextState.items, this.state.items)
    );
  }

  componentDidUpdate({items: prevItems}) {
    const {items} = this.props;

    if (items === prevItems) {
      return;
    }

    if (typeof items.then === 'function') {
      // items is a Promise
      items.then(items => {
        this.setState({items});
      });
    } else {
      this.setState({items});
    }
  }

  handleChange = value => {
    const {value: previousValue, locale} = this.props;

    const nextValue = locale.parseTextInput(value);
    if (nextValue !== previousValue) {
      this.props.onChange(nextValue);
    }
  };

  render() {
    const {
      type,
      forwardedRef,
      id,
      value,
      onFocus,
      onBlur,
      disabled,
      required,
      placeholder,
      maxLength,
      style,
      locale,
      theme: t,
      styles: s
    } = this.props;
    const {items} = this.state;

    let filteredItems = items.filter(item => item !== value);
    filteredItems = matchSorter(filteredItems, value);

    const formattedValue = locale.formatTextInput(value);

    return (
      <Downshift
        onChange={this.handleChange}
        inputValue={formattedValue}
        onInputValueChange={this.handleChange}
        selectedItem={formattedValue}
      >
        {({getInputProps, getItemProps, isOpen, highlightedIndex}) => (
          <div style={{position: 'relative'}}>
            <RSInput
              {...getInputProps({
                type,
                ref: forwardedRef,
                id,
                onFocus,
                onBlur,
                disabled,
                required,
                placeholder,
                maxLength,
                autoComplete: 'nope',
                style: {display: 'block', width: '100%', ...style}
              })}
            />
            {filteredItems.length > 0 && isOpen && (
              <div
                style={{
                  ...s.field,
                  padding: '0.5rem 0',
                  position: 'absolute',
                  width: '100%',
                  maxHeight: '190px',
                  marginTop: '-1px',
                  overflowY: 'auto',
                  zIndex: 1,
                  cursor: 'default',
                  backgroundColor: t.inputBackgroundColor,
                  borderColor: t.focusedInputBorderColor
                }}
              >
                {filteredItems.map((item, index) => (
                  <div
                    {...getItemProps({item})}
                    key={item}
                    style={{
                      padding: '0 0.625rem',
                      color: highlightedIndex === index ? t.inverseTextColor : undefined,
                      backgroundColor: highlightedIndex === index ? t.primaryColor : undefined
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Downshift>
    );
  }
}

@withForwardedRef
export class MultiInput extends React.Component {
  static propTypes = {
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    spacing: PropTypes.string,
    layout: PropTypes.oneOf(['horizontal', 'vertical']),
    style: PropTypes.object,
    children: PropTypes.func.isRequired,
    forwardedRef: PropTypes.object
  };

  static defaultProps = {
    layout: 'horizontal',
    spacing: '0.75rem'
  };

  handleChange = (index, newValue) => {
    const {onChange} = this.props;

    const updatedValues = this.getRenderedValues()
      .map((currentValue, i) => {
        return index === i ? newValue : currentValue;
      })
      .filter(value => value !== undefined);

    return onChange(updatedValues);
  };

  getRenderedValues = () => {
    const {values} = this.props;

    const lastValue = values[values.length - 1];
    const hasExtraEmptyInput = values.length && lastValue === undefined;

    return hasExtraEmptyInput ? values : [...values, undefined];
  };

  handleClear = index => {
    const {values, onChange} = this.props;

    const newValues = values.filter((_, i) => i !== index);

    return onChange(newValues);
  };

  isEmpty = () => {
    const {values} = this.props;

    return values.every(value => isEmpty(value));
  };

  render() {
    const {required, layout, spacing, style, children, forwardedRef} = this.props;

    const isMultiInputEmpty = this.isEmpty();

    const renderedValues = this.getRenderedValues();

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: layout === 'horizontal' ? 'wrap' : undefined,
          flexDirection: layout === 'horizontal' ? 'row' : 'column',
          marginTop: `-${spacing}`,
          marginLeft: layout === 'horizontal' ? `-${spacing}` : undefined,
          ...style
        }}
      >
        {renderedValues.map((value, index) => {
          const isFirst = index === 0;
          const isLast = index === renderedValues.length - 1;

          return (
            <div
              key={index}
              style={{
                paddingTop: spacing,
                paddingLeft: layout === 'horizontal' ? spacing : undefined
              }}
            >
              {children({
                forwardedRef: isFirst ? forwardedRef : undefined,
                value,
                onChange: value => this.handleChange(index, value),
                onClear: isLast ? undefined : () => this.handleClear(index),
                required: required && isMultiInputEmpty && isFirst,
                index,
                isFirst,
                isLast
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
