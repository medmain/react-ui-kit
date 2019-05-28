import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter, Form as RSForm} from 'radium-starter';

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
