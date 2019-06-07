import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {List, Menu, MenuItem, MenuDivider} from '@medmain/react-ui-kit';
import {ItemSelection} from '@medmain/core';

import {columns, items} from './list-simple-content';

const ContextMenu = ({close, selection}) => {
  return (
    <Menu>
      <MenuItem
        onClick={() => {
          console.log('Edit', selection.toJSON());
          close();
        }}
      >
        Edit
      </MenuItem>
      <MenuItem
        onClick={() => {
          console.log('Clone', selection.toJSON());
          close();
        }}
      >
        Clone
      </MenuItem>
      <MenuDivider />
      <MenuItem
        disabled={!selection.itemIds || selection.itemIds.size > 1}
        onClick={() => {
          console.log('Delete', selection.toJSON());
          close();
        }}
      >
        Delete
      </MenuItem>
    </Menu>
  );
};
ContextMenu.propTypes = {
  selection: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired
};

export const ListWithMenu = () => {
  const [selection, setSelection] = useState(new ItemSelection());
  const {itemIds, mode} = selection;
  const selectionInfo = () => {
    if (mode === 'all') {
      return 'All items selected';
    }
    const count = itemIds && itemIds.size;
    if (count === 0) {
      return 'No items selected';
    }
    return `${count} item(s) ${mode === 'pick' ? 'picked' : 'omitted'}`;
  };
  // eslint-disable-next-line react/display-name
  const withSelection = Component => props => <Component {...props} selection={selection} />;

  return (
    <>
      <p>{selectionInfo()}</p>
      <List
        columns={columns}
        items={items}
        selection={selection}
        onSelect={setSelection}
        onItemClick={console.log}
        contextMenu={withSelection(ContextMenu)}
      />
    </>
  );
};
