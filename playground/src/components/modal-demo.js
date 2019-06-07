import React from 'react';
import PropTypes from 'prop-types';
import {Button, Popover} from '@medmain/react-ui-kit';

import Root from '../components/root';

export const ModalDemo = ({modal}) => {
  return (
    <Root>
      {modal.createElement()}
      <Button onClick={showConfirm(modal)}>Confirm</Button>{' '}
      <Button onClick={showDialog(modal)}>Show Dialog</Button>
    </Root>
  );
};
ModalDemo.propTypes = {
  modal: PropTypes.object.isRequired
};

export const showConfirm = modal => async () => {
  const answer = await modal.confirm('Do you want to delete it?', {width: 700});
  console.info(answer);
};

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl augue, condimentum vel feugiat vel, ullamcorper vitae nunc. Nulla facilisi. Praesent porta magna convallis vestibulum luctus. Integer lacinia, purus eget condimentum porta, mauris sem molestie purus, sit amet ultricies eros nisl sed tortor. Morbi sed rutrum mauris. Suspendisse orci urna, dapibus ut metus quis, scelerisque bibendum magna. Phasellus in nunc a elit ornare mattis. Quisque ultrices urna nisi. Sed eu pellentesque nisl, nec convallis massa. Etiam vitae turpis risus. Proin varius suscipit dui, id rhoncus mi sagittis sed. In rhoncus lacus velit, vel placerat lorem convallis quis. Duis ornare neque tortor, porttitor consectetur tellus cursus vitae. In vulputate porta libero id blandit. Duis fermentum sed sem et efficitur. Suspendisse potenti.';

export const showDialog = modal => async () => {
  const result = await modal.confirm(text, {
    title: 'Warning!',
    width: '700px',
    okButton: {
      onClick: async ({close}) => {
        const okay = await modal.confirm('Are you sure?');
        if (okay) {
          close(true);
        }
      }
    }
  });
  console.info(result);
};

export const ModalWithPopover = ({close}) => (
  <div style={{height: 600, display: 'flex', flexDirection: 'column'}}>
    <p>Hello from the dialog!</p>
    <div style={{flexGrow: 1}}>
      <Popover
        content={
          <div
            style={{
              width: 240,
              height: 240,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}
          >
            <div style={{textAlign: 'center'}}>This is the `content` of the Popover component.</div>
          </div>
        }
      >
        {({open}) => <Button onClick={open}>Show Popover</Button>}
      </Popover>
    </div>
    <Button rsPrimary onClick={close}>
      Close the modal
    </Button>
  </div>
);
ModalWithPopover.propTypes = {
  close: PropTypes.func.isRequired
};
