import {useState} from 'react';
import {ItemSelection} from '@medmain/core';

export const ListSelectionContainer = ({children}) => {
  const [selection, setSelection] = useState(new ItemSelection());

  return children({selection, setSelection});
};

export const ListSelectionInfo = ({selection}) => {
  const {itemIds, mode} = selection;

  if (mode === 'all') {
    return 'All items selected';
  }

  const count = itemIds && itemIds.size;
  if (count === 0) {
    return 'No items selected';
  }

  return `${count} item(s) ${mode === 'pick' ? 'picked' : 'omitted'}`;
};
