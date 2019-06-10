import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';
import compact from 'lodash/compact';

import {Button} from './button';
import {ChevronDownIcon, ChevronUpIcon} from './icons';
import {Popover} from './popover';
import {Menu, MenuItem, MenuDivider} from './menu';

@withRadiumStarter
export class DropdownMenu extends React.Component {
  static propTypes = {
    items: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
    alignment: PropTypes.oneOf(['left', 'right']),
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    position: PropTypes.oneOf(['bottom', 'top']),
    style: PropTypes.object,
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
  };

  static defaultProps = {
    alignment: 'left',
    position: 'bottom',
    disabled: false,
    showChevronIcon: true,
    style: {}
  };

  render() {
    const {items, position, disabled, children} = this.props;

    const content = normalizeItems(items);

    return (
      <Popover {...this.props} content={content}>
        {({open}) =>
          typeof children === 'function' ? (
            children({open})
          ) : (
            <DropdownToggleButton onClick={open} position={position} disabled={disabled}>
              {children}
            </DropdownToggleButton>
          )
        }
      </Popover>
    );
  }
}

export class DropdownToggleButton extends React.Component {
  static propTypes = {
    position: PropTypes.oneOf(['bottom', 'top']),
    style: PropTypes.object,
    children: PropTypes.node.isRequired
  };

  render() {
    const {position, children, style, ...props} = this.props;

    const Icon = position === 'top' ? ChevronUpIcon : ChevronDownIcon;

    return (
      <Button {...props} style={{width: '100%', ...style}}>
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

// === Helper functions ===

function normalizeItems(items) {
  if (typeof items === 'function') {
    return items;
  }

  const DropdownMenu = ({close}) => (
    <Menu>
      {compact(items).map(({type = 'menu-item', label, onClick, ...other}, index) => {
        if (type === 'divider') {
          return <MenuDivider key={index} />;
        }

        const handleClick = event => {
          close();
          return onClick(event);
        };

        return (
          <MenuItem key={index} onClick={handleClick} {...other}>
            {label}
          </MenuItem>
        );
      })}
    </Menu>
  );
  DropdownMenu.propTypes = {
    close: PropTypes.func.isRequired
  };

  return DropdownMenu;
}
