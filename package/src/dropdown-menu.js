import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';

import {Button} from './button';
import {ChevronDownIcon, ChevronUpIcon} from './icons';
import {Popover} from './popover';
import {Menu, MenuItem} from './menu';

@withRadiumStarter
export class DropdownMenu extends React.Component {
  static propTypes = {
    alignment: PropTypes.oneOf(['left', 'right']),
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    position: PropTypes.oneOf(['bottom', 'top']),
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    alignment: 'left',
    position: 'bottom',
    disabled: false,
    showChevronIcon: true,
    style: {}
  };

  render() {
    const {disabled, label, children} = this.props;

    return (
      <Popover
        {...this.props}
        content={({close}) => {
          return (
            <Menu>{React.Children.map(children, child => React.cloneElement(child, {close}))}</Menu>
          );
        }}
      >
        {({open}) => (
          <DropdownToggleButton onClick={open} disabled={disabled}>
            {label}
          </DropdownToggleButton>
        )}
      </Popover>
    );
  }
}

export class DropdownToggleButton extends React.Component {
  static propTypes = {
    position: PropTypes.oneOf(['bottom', 'top']),
    children: PropTypes.node.isRequired
  };

  render() {
    const {position, children, ...props} = this.props;

    const Icon = position === 'top' ? ChevronUpIcon : ChevronDownIcon;

    return (
      <Button {...props}>
        {children}
        <Icon
          size={20}
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            marginRight: '-0.25rem',
            marginLeft: '0.25rem'
          }}
        />
      </Button>
    );
  }
}

export class DropdownItem extends React.Component {
  static propTypes = {
    close: PropTypes.func,
    children: PropTypes.node.isRequired
  };

  render() {
    const {children, ...props} = this.props;

    const handleClick = (...params) => {
      const {onClick, close} = this.props;

      if (close) {
        close();
      }
      onClick(...params);
    };

    return (
      <MenuItem {...props} onClick={handleClick}>
        {children}
      </MenuItem>
    );
  }
}
