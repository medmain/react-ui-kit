import React from 'react';
import Base from '@ministate/base';
import subscribe from '@ministate/react';

import {Stack} from './stack';

export class Toaster extends Base {
  constructor({position} = {}) {
    super();
    this.position = position;
    this.state = {
      stack: new Map()
    };
  }

  nextToastId = 0; // will be incremented every time a toast is added to the stack

  createElement() {
    return React.createElement(subscribe(this)(Stack), {toaster: this});
  }

  notify(message, options) {
    options = normalizeToastOptions(message, options);
    return new Promise(resolve => {
      const id = this.nextToastId;

      const close = value => {
        this._close(id);
        resolve(value);
      };

      this.state.stack.set(id, {id, options, close});
      this.nextToastId++;
      this.publish();
    });
  }

  _close = id => {
    const {stack} = this.state;

    stack.delete(id);
    this.publish();
  };

  getStack() {
    const {stack} = this.state;

    return Array.from(stack.values());
  }
}

function normalizeToastOptions(message, options) {
  return {
    message: typeof message === 'function' ? message : () => message,
    ...options
  };
}
