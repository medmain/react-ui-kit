import React from 'react';

import {Container} from './container';
import {Dialog} from './dialog';

export class Stack extends React.Component {
  root = React.createRef(); // used to mount ReactModal inside the <Fullscreen> container

  render() {
    const {modal} = this.props;
    return (
      <div ref={this.root}>
        {modal.getStack().map(({options}, index) => {
          const {render, ...otherOptions} = options;
          const Content = render || Dialog;
          return (
            <Container key={index} onClose={modal.close} rootRef={this.root} {...otherOptions}>
              <Content {...otherOptions} close={modal.close} />
            </Container>
          );
        })}
      </div>
    );
  }
}
