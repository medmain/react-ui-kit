import React from 'react';

import {Container} from './container';
import {Dialog} from './dialog';

export const Stack = ({modal}) => {
  return modal.getStack().map(({options}, index) => {
    const {render, ...otherOptions} = options;
    const Content = render || Dialog;
    return (
      <Container key={index} onClose={modal.close} {...otherOptions}>
        <Content {...otherOptions} close={modal.close} />
      </Container>
    );
  });
};
