import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';

@withRadiumStarter
export class Alert extends React.Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    type: PropTypes.oneOf(['info', 'error', 'success']),
    children: PropTypes.node,
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
  };

  render() {
    const {type, style, theme, children} = this.props;

    const styles = {
      info: {
        backgroundColor: '#e6f7ff',
        borderColor: '#91d5ff'
      },
      success: {
        backgroundColor: '#f6ffed',
        borderColor: '#b7eb8f'
      },
      error: {
        backgroundColor: '#fff1f0',
        borderColor: '#ffa39e'
      }
    };

    const defaultType = 'info';

    const containerStyle = {
      ...(styles[type] || styles[defaultType]),
      margin: '1rem 0',
      padding: '1rem',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: theme.borderRadius,
      ...style
    };

    return (
      <div style={containerStyle}>
        {this.renderTitle()}
        {children}
      </div>
    );
  }

  renderTitle() {
    const {title} = this.props;

    if (!title) {
      return null;
    }

    return <p style={{marginBottom: '1rem', fontSize: '1.2rem'}}>{title}</p>;
  }
}
