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

  notify(title, options) {
    options = normalizeToastOptions(title, options);
    return new Promise(resolve => {
      this.state.stack.set(this.nextToastId, {options, resolve});
      this.nextToastId++;
      this.publish();
    });
  }

  close = id => value => {
    const {stack} = this.state;

    const toast = stack.get(id);
    const {resolve} = toast;

    stack.delete(id);
    this.publish();
    resolve(value);
  };

  getStack() {
    const {stack} = this.state;

    return Array.from(stack.entries()).map(([id, value]) => ({id, ...value}));
  }
}

function normalizeToastOptions(message, options) {
  return {
    message: typeof message === 'function' ? message : () => message,
    ...options
  };
}
