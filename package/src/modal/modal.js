import React from 'react';
import Base from '@ministate/base';
import subscribe from '@ministate/react';

import {Stack} from './components/stack';

const OK_BUTTON_TITLE = 'OK';
const CANCEL_BUTTON_TITLE = 'Cancel';

export class Modal extends Base {
  constructor({okButtonTitle = OK_BUTTON_TITLE, cancelButtonTitle = CANCEL_BUTTON_TITLE} = {}) {
    super();
    this.okButtonTitle = okButtonTitle;
    this.cancelButtonTitle = cancelButtonTitle;
    this.state = {
      stack: []
    };
  }

  /* Create the React element only once, to avoid blinking effects when the application updates */
  createElement() {
    if (!this._element) {
      this._element = React.createElement(subscribe(this)(Stack), {modal: this});
    }
    return this._element;
  }

  dialog(options = {}) {
    return this.open(options);
  }

  alert(message, {okButton, ...otherOptions} = {}) {
    const options = {
      ...otherOptions,
      message,
      buttons: [this.buildOKButton(okButton)]
    };
    return this.dialog(options);
  }

  confirm(message, {okButton, cancelButton, ...otherOptions} = {}) {
    const buttons = [this.buildOKButton(okButton), this.buildCancelButton(cancelButton)];
    const options = {
      ...otherOptions,
      message,
      buttons
    };
    return this.dialog(options);
  }

  buildOKButton(options) {
    return {title: this.okButtonTitle, value: true, isDefault: true, ...options};
  }

  buildCancelButton(options) {
    return {title: this.cancelButtonTitle, value: false, ...options};
  }

  open(options) {
    return new Promise(resolve => {
      this.state.stack.push({options, resolve});
      this.publish();
    });
  }

  close = value => {
    const {resolve} = this.state.stack.pop();
    this.publish();
    resolve(value);
  };

  getStack() {
    return this.state.stack;
  }
}
