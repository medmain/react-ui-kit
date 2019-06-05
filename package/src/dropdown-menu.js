import React from 'react';
import {withRadiumStarter} from 'radium-starter';
import PropTypes from 'prop-types';
import {Button} from './button';
import {ChevronDownIcon, ChevronUpIcon} from './icons';
import {Popover} from './popover';
import {Menu} from './menu';

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
    children: PropTypes.node
  };

  static defaultProps = {
    alignment: 'left',
    position: 'bottom',
    disabled: false,
    showChevronIcon: true,
    style: {}
  };

  render() {
    const {disabled, position, label, children} = this.props;

    const Icon = position === 'top' ? ChevronUpIcon : ChevronDownIcon;

    return (
      <Popover {...this.props} content={() => <Menu>{children}</Menu>}>
        {({open}) => (
          <Button onClick={open} disabled={disabled}>
            {label}
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
        )}
      </Popover>
    );
  }
}
