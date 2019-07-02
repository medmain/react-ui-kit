import React from 'react';

import {Toast} from './toast';
import {ToastContainer} from './toast-container';

export class Stack extends React.Component {
  render() {
    const {toaster} = this.props;
    const {position} = toaster;

    const stack = toaster.getStack();

    return (
      <ToastContainer position={position}>
        {stack.map(({id, options}) => {
          const {message: ToastContent, ...otherOptions} = options;

          return (
            <Toast key={`toast-${id}`} {...otherOptions} close={toaster.close(id)}>
              {ToastContent && <ToastContent close={toaster.close(id)} />}
            </Toast>
          );
        })}
      </ToastContainer>
    );
  }
}
