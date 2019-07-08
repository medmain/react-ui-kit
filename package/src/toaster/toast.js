import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';

import {Button} from '../button';
import {Col, Row} from '../row';

@withRadiumStarter
export class Toast extends React.Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    primaryButton: PropTypes.object,
    secondaryButton: PropTypes.object,
    closeAfter: PropTypes.number,
    style: PropTypes.object.isRequired,
    children: PropTypes.node,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired
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

    if (closeAfter && !this.autoCloseTimeout) {
      this.autoCloseTimeout = setTimeout(() => close(undefined), closeAfter);
    }
  };

  clearTimeout = () => {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = undefined;
    }
  };

  handleMouseEnter = () => {
    this.clearTimeout();
  };

  handleMouseLeave = () => {
    this.startTimeout();
  };

  render() {
    const {
      title,
      primaryButton,
      secondaryButton,
      children,
      style,
      styles: s,
      theme: t
    } = this.props;

    const toastStyle = {
      margin: '.5rem',
      padding: '1rem',
      minWidth: '300px',
      maxWidth: '450px',
      backgroundColor: t.backgroundColor,
      boxShadow: 'rgba(0, 0, 0, 0.5) 0px 4px 16px',
      ...s.rounded
    };

    return (
      <div
        style={{...toastStyle, ...style}}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {title && <div style={{fontSize: t.largeFontSize, marginBottom: '.5rem'}}>{title}</div>}
        {children}
        {(primaryButton || secondaryButton) && (
          <Row style={{marginTop: '1rem'}}>
            {secondaryButton && this.renderButton({...secondaryButton})}
            {primaryButton && this.renderButton({...primaryButton, isPrimary: true})}
          </Row>
        )}
      </div>
    );
  }

  renderButton({title, value, isPrimary}) {
    const {close} = this.props;

    return (
      <Col style={{flexGrow: 1}}>
        <Button
          onClick={() => close(value)}
          rsPrimary={isPrimary}
          style={{
            display: 'block',
            width: '100%'
          }}
        >
          {title}
        </Button>
      </Col>
    );
  }
}
