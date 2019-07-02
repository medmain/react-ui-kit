import React from 'react';
import PropTypes from 'prop-types';
import {Button, withRadiumStarter} from 'radium-starter';
import compact from 'lodash/compact';

@withRadiumStarter
export class Toast extends React.Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    primaryButton: PropTypes.object,
    secondaryButton: PropTypes.object,
    closeAfter: PropTypes.number,
    style: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node
  };

  static defaultProps = {
    closeAfter: 5000 // automatically close the toast after 5 seconds
  };

  componentDidMount() {
    this.startTimeout();
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  startTimeout = () => {
    const {closeAfter, close} = this.props;

    if (closeAfter) {
      this.autoCloseTimeout = setTimeout(() => close(undefined), closeAfter);
    }
  };

  clearTimeout = () => {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
  };

  handleMouseEnter = () => {
    this.clearTimeout();
  };

  handleMouseLeave = () => {
    this.startTimeout();
  };

  render() {
    const {title, primaryButton, secondaryButton, close, style, styles: s, children} = this.props;

    const toastStyle = {
      backgroundColor: '#174eb6', // TODO use the theme
      color: 'rgba(255, 255, 255, 0.85)',
      padding: '1rem',
      margin: '.5rem',
      minWidth: '400px',
      boxShadow: 'rgba(0, 0, 0, 0.16) 0px 4px 16px',
      ...s.rounded
    };

    const buttons = compact([primaryButton, secondaryButton]);

    return (
      <div
        style={{...toastStyle, ...style}}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {title && <div style={{fontSize: '1.2rem', color: 'white'}}>{title}</div>}
        {children}
        {buttons.length > 0 && (
          <div style={{display: 'flex', marginTop: '1rem'}}>
            {buttons.map(({title, value}, index) => {
              const isLast = index === buttons.length - 1;
              return (
                <Button
                  key={index}
                  onClick={() => close(value)}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginRight: !isLast ? '1rem' : undefined
                  }}
                >
                  {title}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}
