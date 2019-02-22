import React from 'react';
import PropTypes from 'prop-types';
import {
  withRadiumStarter,
  Form as RSForm,
  Input as RSInput,
  Select as RSSelect,
  TextArea as RSTextArea
} from 'radium-starter';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';

import {withLocale} from './locale-context';

export class Form extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit();
  };

  render() {
    return <RSForm {...this.props} onSubmit={this.handleSubmit} />;
  }
}

@withRadiumStarter
export class Label extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  render() {
    const {style, theme: t} = this.props;

    return (
      <label
        {...this.props}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '.35rem',
          color: t.labelColor,
          ...style
        }}
      />
    );
  }
}

@withRadiumStarter
export class LabelHelp extends React.Component {
  render() {
    const {theme: t} = this.props;

    return <small {...this.props} style={{marginLeft: '.6rem', color: t.labelColor}} />;
  }
}

export class Input extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    required: PropTypes.bool,
    tabIndex: PropTypes.string,
    style: PropTypes.object
  };

  rsInputRef = React.createRef();

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

  focus = () => {
    this.rsInputRef.current.focus();
  };

  select = () => {
    this.rsInputRef.current.select();
  };

  blur = () => {
    this.rsInputRef.current.blur();
  };

  render() {
    return (
      <RSInput
        {...this.props}
        ref={this.rsInputRef}
        onChange={this.handleChange}
        style={{display: 'block', width: '100%', ...this.props.style}}
      />
    );
  }
}

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
    const {value, onChange, locale, ...props} = this.props;
    return <Input {...props} value={locale.formatTextInput(value)} onChange={this.handleChange} />;
  }
}

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
    const {value, locale, ...props} = this.props;
    const {draftValue} = this.state;
    return (
      <Input
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

export class TextArea extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
    style: PropTypes.object
  };

  rsInputRef = React.createRef();

  shouldComponentUpdate(nextProps, _nextState) {
    return (
      nextProps.value !== this.props.value ||
      nextProps.onChange !== this.props.onChange ||
      nextProps.required !== this.props.required
    );
  }

  handleChange = event => {
    this.props.onChange(event.target.value);
  };

  focus = () => {
    this.rsInputRef.current.focus();
  };

  select = () => {
    this.rsInputRef.current.select();
  };

  blur = () => {
    this.rsInputRef.current.blur();
  };

  render() {
    return (
      <RSTextArea
        {...this.props}
        ref={this.rsInputRef}
        onChange={this.handleChange}
        style={{display: 'block', width: '100%', ...this.props.style}}
      />
    );
  }
}

export class Select extends React.Component {
  static propTypes = {
    type: PropTypes.string, // 'auto' (default), 'select' or 'radio'
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
    let {type, options, hasEmptyOption, style} = this.props;

    if (type === 'auto') {
      type = options.length < 5 ? 'radio' : 'select';
    }

    if (type === 'radio') {
      return <RadioSelect {...this.props} />;
    }

    return (
      <RSSelect
        {...omit(this.props, ['type', 'options', 'hasEmptyOption'])}
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

class RadioSelect extends React.Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.string,
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
    const {options, value, required, layout} = this.props;

    let rendering = options.map(option => {
      const id = this.name + '-' + option.value;

      return (
        <div key={id} style={layout === 'horizontal' ? {marginLeft: '1rem'} : undefined}>
          <RSInput
            type="radio"
            id={id}
            name={this.name}
            value={option.value}
            checked={value === option.value}
            onChange={this.handleChange}
            required={required}
          />
          &nbsp;
          <label htmlFor={id} style={{verticalAlign: 'middle'}}>
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
    const {label, value, required, style} = this.props;

    return (
      <div style={{lineHeight: 1, ...style}}>
        <RSInput
          {...omit(this.props, ['value'])}
          id={this.id}
          type="checkbox"
          checked={value || false}
          onChange={this.handleChange}
        />
        {label && (
          <>
            &nbsp;
            <label htmlFor={this.id} style={{verticalAlign: 'middle'}}>
              {label}
              {required && <Asterisk />}
            </label>
          </>
        )}
      </div>
    );
  }
}

@withRadiumStarter
export class AutocompleteInput extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    style: PropTypes.object,
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
    if (value !== this.props.value) {
      this.props.onChange(value);
    }
  };

  render() {
    const {
      type,
      id,
      value,
      onFocus,
      onBlur,
      required,
      placeholder,
      maxLength,
      style,
      theme: t,
      styles: s
    } = this.props;
    const {items} = this.state;

    let filteredItems = items.filter(item => item !== value);
    filteredItems = matchSorter(filteredItems, value);

    return (
      <Downshift
        onChange={this.handleChange}
        inputValue={value}
        onInputValueChange={this.handleChange}
        selectedItem={value}
      >
        {({getInputProps, getItemProps, isOpen, highlightedIndex}) => (
          <div style={{position: 'relative'}}>
            <RSInput
              {...getInputProps({
                type,
                id,
                onFocus,
                onBlur,
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

@withRadiumStarter
export class Asterisk extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  shouldComponentUpdate(_nextProps, _nextState) {
    return false;
  }

  render() {
    const {theme: t} = this.props;

    return <span style={{color: t.errorColor}}>*</span>;
  }
}
