import React from 'react';
import PropTypes from 'prop-types';
import {withRadiumStarter} from 'radium-starter';
import compact from 'lodash/compact';

export class Menu extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    onClick: PropTypes.func
  };

  render() {
    const {items, onClick: menuOnClick} = this.props;

    return (
      <MenuRoot>
        {compact(items).map(({type = 'menu-item', label, onClick, ...other}, index) => {
          if (type === 'divider') {
            return <MenuDivider key={index} />;
          }

          const handleClick = event => {
            if (menuOnClick) {
              menuOnClick(event);
            }
            return onClick(event);
          };

          return (
            <MenuItem key={index} onClick={handleClick} {...other}>
              {label}
            </MenuItem>
          );
        })}
      </MenuRoot>
    );
  }
}

// === Low level components ===

export class MenuRoot extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    const {children} = this.props;

    return <div>{children}</div>;
  }
}

@withRadiumStarter
export class MenuItem extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func, // not required for `disabled` items
    theme: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    const {disabled, onClick, theme: t, children} = this.props;

    const props = {
      style: {
        padding: '.15rem .75rem'
      }
    };

    if (disabled) {
      Object.assign(props.style, {
        cursor: t.disabledCursor,
        opacity: 0.5
      });
    } else {
      Object.assign(props.style, {
        cursor: 'pointer',
        ':hover': {backgroundColor: t.hoveredButtonBackgroundColor}
      });
      props.onClick = onClick;
    }

    return <div {...props}>{children}</div>;
  }
}

@withRadiumStarter
export class MenuDivider extends React.Component {
  static propTypes = {
    styles: PropTypes.object.isRequired
  };

  render() {
    const {styles: s} = this.props;

    return (
      <div
        style={{
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
          borderBottomWidth: s.border.borderWidth,
          borderBottomColor: s.border.borderColor,
          borderBottomStyle: s.border.borderStyle
        }}
      />
    );
  }
}
