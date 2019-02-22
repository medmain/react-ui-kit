import React from 'react';
import PropTypes from 'prop-types';
import {RadiumStarter, Button} from 'radium-starter';

export const Dialog = ({close, title, message, buttons}) => (
  <div>
    {title && <DialogTitle>{title}</DialogTitle>}
    <DialogBody>
      <div>{message}</div>
    </DialogBody>
    {buttons && (
      <DialogFooter>
        <DialogActionBar close={close} buttons={buttons} />
      </DialogFooter>
    )}
  </div>
);
Dialog.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.string,
  buttons: PropTypes.array,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
};

const DialogTitle = ({children}) => {
  return (
    <RadiumStarter>
      {(t, s) => {
        return (
          <h3
            style={[
              s.regular,
              s.secondaryTextColor,
              s.minimumLineHeight,
              {marginTop: '-0.25rem', marginBottom: '1.5rem'}
            ]}
          >
            {children}
          </h3>
        );
      }}
    </RadiumStarter>
  );
};
DialogTitle.propTypes = {
  children: PropTypes.node
};

const DialogBody = ({children}) => <div style={{whiteSpace: 'pre-line'}}>{children}</div>;
DialogBody.propTypes = {
  children: PropTypes.node
};

const DialogFooter = ({children, ...otherProps}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row-reverse', // render buttons in the opposite order
        marginTop: '1.5rem'
      }}
      {...otherProps}
    >
      {children}
    </div>
  );
};
DialogFooter.propTypes = {
  children: PropTypes.node
};

/*
Use to display the button action bar from a definition of "button" objects
*/
const DialogActionBar = ({close, buttons}) =>
  buttons.map((button, index) => {
    const style = index > 0 ? {marginRight: '.75rem'} : {}; // add space between buttons
    return <DialogButton key={index} close={close} {...button} style={style} />;
  });
DialogActionBar.propTypes = {
  close: PropTypes.func.isRequired,
  buttons: PropTypes.array.isRequired
};

/*
Render an action button inside the modal footer.
*/
const DialogButton = ({close, value, title, onClick: customOnClick, isDefault, style}) => {
  // Default onClick handler: the modal will resolve with the `value` property of the button
  let onClick = () => {
    close(value);
  };
  // When a custom `onClick` handler is provided, the user calls close passing a value.
  // the modal will resolve with the provider value
  if (customOnClick) {
    onClick = () => {
      customOnClick({close});
    };
  }
  return (
    <Button
      onClick={onClick}
      rsPrimary={isDefault}
      autoFocus={isDefault /* to let user validate with Enter key */}
      style={style}
    >
      {renderText(title)}
    </Button>
  );
};
DialogButton.propTypes = {
  close: PropTypes.func.isRequired,
  value: PropTypes.any,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  onClick: PropTypes.func,
  isDefault: PropTypes.bool,
  style: PropTypes.object
};

/*
Render either a String or a function that returns JSX code (part of the current API)
*/
const renderText = text => (typeof text === 'function' ? text() : text);
