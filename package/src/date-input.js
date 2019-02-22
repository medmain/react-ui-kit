import React from 'react';
import PropTypes from 'prop-types';
import {Style} from 'radium';
import {withRadiumStarter, Input as RSInput} from 'radium-starter';
import DayPicker from 'react-day-picker/lib/src/DayPicker';

import {withLocale} from './locale-context';

export const ESC = 27;
export const TAB = 9;

@withLocale
export class DateInput extends React.Component {
  static propTypes = {
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    locale: PropTypes.object.isRequired
  };

  static defaultProps = {
    value: null,
    onChange: () => {},
    disabled: false,
    required: false
  };

  input = React.createRef();

  inputBlurTimeout = null;

  inputFocusTimeout = null;

  overlayBlurTimeout = null;

  state = {
    isOpen: false
  };

  componentWillUnmount() {
    clearTimeout(this.inputFocusTimeout);
    clearTimeout(this.inputBlurTimeout);
    clearTimeout(this.overlayBlurTimeout);
  }

  showDayPicker = () => {
    const {isOpen} = this.state;
    if (isOpen) {
      return;
    }

    this.setState({isOpen: true});
  };

  hideDayPicker = () => {
    if (this.state.isOpen === false) {
      return;
    }

    this.setState({isOpen: false});
  };

  handleInputClick = () => {
    const {disabled} = this.props;

    if (!disabled) {
      this.showDayPicker();
    }
  };

  handleInputFocus = () => {
    this.showDayPicker();
    this.inputFocusTimeout = setTimeout(() => {
      this.overlayHasFocus = false;
    }, 2);
  };

  handleInputBlur = () => {
    this.inputBlurTimeout = setTimeout(() => {
      if (!this.overlayHasFocus) {
        this.hideDayPicker();
      }
    }, 1);
  };

  handleOverlayFocus = e => {
    e.preventDefault();
    this.overlayHasFocus = true;
    if (!this.input) {
      return;
    }
    this.input.current.focus();
  };

  handleOverlayBlur = () => {
    this.overlayBlurTimeout = setTimeout(() => {
      this.overlayHasFocus = false;
    }, 3);
  };

  handleInputChange = e => {
    const {onChange} = this.props;
    const draftValue = e.target.value;

    // TODO: DRY the following logic
    if (draftValue.trim() === '') {
      this.setState({draftValue: undefined});
      onChange(null);
    } else {
      const value = this.parseDate(draftValue);
      if (value) {
        this.setState({draftValue: undefined}, () => {
          onChange(value);
        });
      } else {
        this.setState({draftValue});
        onChange(null);
      }
    }
  };

  handleInputKeyDown = ({keyCode}) => {
    if (keyCode === TAB) {
      this.hideDayPicker();
    } else {
      this.showDayPicker();
    }
  };

  handleInputKeyUp = ({keyCode}) => {
    if (keyCode === ESC) {
      this.hideDayPicker();
    } else {
      this.showDayPicker();
    }
  };

  handleDayClick = date => {
    const {onChange} = this.props;

    // Fix 12:00 time issue (https://github.com/gpbl/react-day-picker/issues/473)
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    this.setState({draftValue: undefined, isOpen: false}, () => {
      onChange(date);
    });
  };

  parseDate = value => {
    const {locale} = this.props;

    return locale.parseDateInput(value);
  };

  formatDate = value => {
    const {locale} = this.props;

    return locale.formatDateInput(value);
  };

  renderOverlay = () => {
    let {value, locale} = this.props;
    const {draftValue} = this.state;

    if (value) {
      // Transform UTC date to locale date
      value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());
    }

    return (
      <Overlay onFocus={this.handleOverlayFocus} onBlur={this.handleOverlayBlur}>
        <DayPicker
          month={value || new Date()}
          selectedDays={draftValue ? null : value}
          onDayClick={this.handleDayClick}
          firstDayOfWeek={locale.firstDayOfWeek}
        />
      </Overlay>
    );
  };

  render() {
    const {value, required, disabled, locale} = this.props;
    const {draftValue, isOpen} = this.state;

    const errorMessage = draftValue ? locale.dateInputInvalidityMessage : '';

    // TODO: Don't include <DayPickerStyles /> in each rendering
    return (
      <>
        <DayPickerStyles />
        <RSInput
          ref={this.input}
          placeholder={locale.dateInputPlaceholder}
          value={draftValue || this.formatDate(value)}
          disabled={disabled}
          required={required}
          rsCustomValidity={errorMessage}
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          onKeyDown={this.handleInputKeyDown}
          onKeyUp={this.handleInputKeyUp}
          onClick={this.handleInputClick}
          style={{display: 'block', width: '100%'}}
        />
        {isOpen && this.renderOverlay()}
      </>
    );
  }
}

export const Overlay = withRadiumStarter(({children, onFocus, onBlur, theme: t}) => {
  return (
    <div
      style={{
        position: 'relative'
      }}
      onBlur={onBlur}
      onFocus={onFocus}
      tabIndex={0} // tabIndex is necessary to catch focus/blur events on Safari
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          zIndex: 1,
          background: t.backgroundColor,
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
          ':focus': {
            outlineWidth: '1px',
            outlineColor: t.focusedInputBorderColor
          }
        }}
      >
        {children}
      </div>
    </div>
  );
});
Overlay.displayName = 'DateInputOverlay';
Overlay.propTypes = {
  children: PropTypes.node,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired
};

const DayPickerStyles = withRadiumStarter(({theme: t}) => {
  const dayPickerStyles = {
    '.DayPicker-wrapper': {
      position: 'relative',
      flexDirection: 'row',
      paddingBottom: '1em',
      userSelect: 'none'
    },
    '.DayPicker': {
      display: 'inline-block',
      fontSize: '1rem'
    },
    '.DayPicker-Months': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    '.DayPicker-Month': {
      display: 'table',
      margin: '0 1em',
      marginTop: '1em',
      borderSpacing: 0,
      borderCollapse: 'collapse',
      userSelect: 'none'
    },
    '.DayPicker-NavButton': {
      position: 'absolute',
      top: '1em',
      right: '1.5em',
      left: 'auto',
      display: 'inline-block',
      marginTop: '2px',
      width: '1.25em',
      height: '1.25em',
      backgroundPosition: 'center',
      backgroundSize: '50%',
      backgroundRepeat: 'no-repeat',
      cursor: 'pointer',
      ':hover': {
        opacity: 0.8
      }
    },
    '.DayPicker-NavButton--prev': {
      marginRight: '1.5em',
      backgroundImage:
        'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAVVJREFUWAnN2G0KgjAYwPHpGfRkaZeqvgQaK+hY3SUHrk1YzNLay/OiEFp92I+/Mp2F2Mh2lLISWnflFjzH263RQjzMZ19wgs73ez0o1WmtW+dgA01VxrE3p6l2GLsnBy1VYQOtVSEH/atCCgqpQgKKqYIOiq2CBkqtggLKqQIKgqgCBjpJ2Y5CdJ+zrT9A7HHSTA1dxUdHgzCqJIEwq0SDsKsEg6iqBIEoq/wEcVRZBXFV+QJxV5mBtlDFB5VjYTaGZ2sf4R9PM7U9ZU+lLuaetPP/5Die3ToO1+u+MKtHs06qODB2zBnI/jBd4MPQm1VkY79Tb18gB+C62FdBFsZR6yeIo1YQiLJWMIiqVjQIu1YSCLNWFgijVjYIuhYYCKoWKAiiFgoopxYaKLUWOii2FgkophYp6F3r42W5A9s9OcgNvva8xQaysKXlFytoqdYmQH6tF3toSUo0INq9AAAAAElFTkSuQmCC")'
    },
    '.DayPicker-NavButton--next': {
      backgroundImage:
        'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAwCAYAAAB5R9gVAAAABGdBTUEAALGPC/xhBQAAAXRJREFUWAnN119ugjAcwPHWzJ1gnmxzB/BBE0n24m4xfNkTaOL7wOtsl3AXMMb+Vjaa1BG00N8fSEibPpAP3xAKKs2yjzTPH9RAjhEo9WzPr/Vm8zgE0+gXATAxxuxtqeJ9t5tIwv5AtQAApsfT6TPdbp+kUBcgVwvO51KqVhMkXKsVJFXrOkigVhCIs1Y4iKlWZxB1rX4gwlpRIIpa8SDkWmggrFq4IIRaJKCYWnSgnrXIQV1r8YD+1Vrn+bReagysIFfLABRt31v8oBu1xEBttfRbltmfjgEcWh9snUS2kNdBK6WN1vrOWxObWsz+fjxevsxmB1GQDfINWiev83nhaoiB/CoOU438oPrhXS0WpQ9xc1ZQWxWHqUYe0I0qrKCQKjygDlXIQV2r0IF6ViEBxVTBBSFUQQNhVYkHIVeJAtkNsbQ7c1LtzP6FsObhb2rCKv7NBIGoq4SDmKoEgTirXAcJVGkFSVVpgoSrXICGUMUH/QBZNSUy5XWUhwAAAABJRU5ErkJggg==")'
    },
    '.DayPicker-NavButton--interactionDisabled': {
      display: 'none'
    },
    '.DayPicker-Caption': {
      display: 'table-caption',
      marginBottom: '0.5em',
      padding: '0 0.5em',
      textAlign: 'left'
    },
    '.DayPicker-Caption > div': {
      fontWeight: 500,
      fontSize: '1.15em'
    },
    '.DayPicker-Weekdays': {
      display: 'table-header-group',
      marginTop: '1em'
    },
    '.DayPicker-WeekdaysRow': {
      display: 'table-row'
    },
    '.DayPicker-Weekday': {
      display: 'table-cell',
      padding: '0.5em',
      color: t.altTextColor,
      textAlign: 'center',
      smallFontSize: t.smallFontSize,
      'abbr[title]': {
        borderBottom: 'none',
        textDecoration: 'none'
      }
    },
    '.DayPicker-Body': {
      display: 'table-row-group'
    },
    '.DayPicker-Week': {
      display: 'table-row'
    },

    '.DayPicker-Day': {
      display: 'table-cell',
      padding: '0.5em',
      borderRadius: '50%',
      verticalAlign: 'middle',
      textAlign: 'center',
      cursor: 'pointer',

      lineHeight: t.smallLineHeight
    },

    '.DayPicker--interactionDisabled .DayPicker-Day': {
      cursor: 'default'
    },

    '.DayPicker-Footer': {
      paddingTop: '0.5em'
    },

    /* Modifiers */

    '.DayPicker-Day--today': {
      fontWeight: t.strongFontWeight
    },

    '.DayPicker-Day--outside': {
      cursor: 'default'
    },

    '.DayPicker-Day--disabled': {
      cursor: 'default',
      color: t.mutedTextColor
    },

    '.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)': {
      position: 'relative',
      backgroundColor: t.primaryButtonBackgroundColor,
      color: t.inverseTextColor
    },

    '.DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):hover': {
      backgroundColor: t.hoveredPrimaryButtonBackgroundColor
    },

    '.DayPicker:not(.DayPicker--interactionDisabled) .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover': {
      color: t.buttonTextColor,
      backgroundColor: t.hoveredButtonBackgroundColor
    }
  };

  return Object.entries(dayPickerStyles).map(([scopeSelector, rules]) => (
    <Style key={scopeSelector} scopeSelector={scopeSelector} rules={rules} />
  ));
});
DayPickerStyles.displayName = 'DayPickerStyles';
