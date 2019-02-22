import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter, Button as RSButton} from 'radium-starter';

import {ArrowLeftIcon, CloseIcon} from './icons';

export class Button extends React.Component {
  static propTypes = {
    type: PropTypes.string
  };

  static defaultProps = {
    type: 'button'
  };

  render() {
    return <RSButton {...this.props} />;
  }
}

export class RoundButton extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <Button
        {...this.props}
        style={{
          width: '40px',
          height: '40px',
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          lineHeight: 1,
          borderWidth: 0,
          borderRadius: '20px',
          ...this.props.style
        }}
      >
        {this.props.children}
      </Button>
    );
  }
}

@withRadiumStarter
export class RoundBackButton extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  render() {
    const {style, theme: t} = this.props;
    return (
      <RoundButton {...this.props} style={{color: t.altTextColor, ...style}}>
        <ArrowLeftIcon size={24} />
      </RoundButton>
    );
  }
}

@withRadiumStarter
export class RoundCloseButton extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  render() {
    const {style, theme: t} = this.props;

    return (
      <RoundButton {...this.props} style={{color: t.altTextColor, ...style}}>
        <CloseIcon size={24} />
      </RoundButton>
    );
  }
}
