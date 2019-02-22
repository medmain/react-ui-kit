import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';

@withRadiumStarter
export class Heading1 extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    const {style, theme: t, children} = this.props;

    return (
      <h4
        style={{
          marginTop: '2rem',
          marginBottom: '1.5rem',
          color: t.altTextColor,
          lineHeight: 1,
          ...style
        }}
      >
        {children}
      </h4>
    );
  }
}

@withRadiumStarter
export class Heading2 extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    const {style, theme: t, children} = this.props;

    return (
      <h5
        style={{
          marginTop: '1.5rem',
          marginBottom: '1rem',
          color: t.primaryColor,
          lineHeight: 1,
          ...style
        }}
      >
        {children}
      </h5>
    );
  }
}

@withRadiumStarter
export class Heading3 extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    const {style, theme: t, children} = this.props;

    return (
      <h6
        style={{
          marginTop: '1rem',
          marginBottom: '1rem',
          fontWeight: t.strongFontWeight,
          lineHeight: 1,
          ...style
        }}
      >
        {children}
      </h6>
    );
  }
}

@withRadiumStarter
export class Badge extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    const {style, theme: t, styles: s, children} = this.props;

    return (
      <div
        style={{
          display: 'inline-block',
          padding: '5px 7px 5px 7px',
          borderRadius: '15px',
          fontSize: t.smallFontSize,
          ...s.minimumLineHeight,
          backgroundColor: t.grayIconColor,
          color: t.inverseTextColor,
          ...style
        }}
      >
        {children}
      </div>
    );
  }
}
