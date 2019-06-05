import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {List, Menu, MenuItem, MenuDivider} from '@medmain/react-ui-kit';
import {ItemSelection} from '@medmain/core';

import {columns, items} from './list-simple-content';

const ContextMenu = ({item}) => {
  return (
    <Menu>
      <MenuItem onClick={() => console.log('Edit', item)}>Edit</MenuItem>
      <MenuItem onClick={() => console.log('Clone', item)}>Clone</MenuItem>
      <MenuDivider />
      <MenuItem onClick={() => console.log('Delete', item)}>Delete</MenuItem>
    </Menu>
  );
};
ContextMenu.propTypes = {
  item: PropTypes.object.isRequired
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

  return (
    <>
      <p>{selectionInfo()}</p>
      <List
        columns={columns}
        items={items}
        selection={selection}
        onSelect={setSelection}
        onItemClick={console.log}
        renderContextMenu={ContextMenu}
      />
    </>
  );
};
