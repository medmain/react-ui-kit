import React from 'react';
import PropTypes from 'prop-types';

export const VerticalContainer = ({height = 200, children}) => {
  return (
    <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', height}}>{children}</div>
  );
};
VerticalContainer.propTypes = {
  height: PropTypes.number,
  children: PropTypes.node.isRequired
};
