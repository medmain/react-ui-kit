import React from 'react';
import PropTypes from 'prop-types';
import {List} from '@medmain/react-ui-kit';

export const FileList = ({files}) => {
  const columns = [
    {
      path: 'name',
      headerCell: {
        render: () => 'File name'
      },
      bodyCell: {
        render: item => item.name
      }
    },
    {
      path: 'type',
      headerCell: {
        render: () => 'File type'
      },
      bodyCell: {
        render: item => item.type
      }
    },
    {
      path: 'date',
      headerCell: {
        render: () => 'Last update'
      },
      bodyCell: {
        render: item => new Date(item.lastModified).toString()
      }
    }
  ];
  return <List columns={columns} items={files} />;
};
FileList.propTypes = {
  files: PropTypes.array.isRequired
};
