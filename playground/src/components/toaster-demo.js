/* eslint-disable react/display-name, react/prop-types */
import React from 'react';
import {Button} from '@medmain/react-ui-kit';

export async function showSimpleToast(toaster) {
  const answer = await toaster.notify(
    ({close}) => (
      <div>
        Don't think twice, it's alright! <Button onClick={() => close('OK')}>Close</Button>
      </div>
    ),
    {
      title: 'Custom message'
    }
  );
  console.info({answer});
}

export async function showAppUpdateToast(toaster) {
  const answer = await toaster.notify(
    'An update is available, click on the "Update" button to reload the page.',
    {
      title: 'Application update',
      primaryButton: {title: 'Update', value: true},
      secondaryButton: {title: 'Not now', value: false},
      closeAfter: 0
    }
  );
  console.info({answer});
}
