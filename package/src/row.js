import React from 'react';
import PropTypes from 'prop-types';

export const Row = ({halfGap = '.375rem', style, children}) => (
  <div
    className="row"
    style={{display: 'flex', marginLeft: '-' + halfGap, marginRight: '-' + halfGap, ...style}}
  >
    {children}
  </div>
);
Row.propTypes = {
  halfGap: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired
};

export const Col = ({halfGap = '.375rem', style, children}) => (
  <div className="col" style={{marginLeft: halfGap, marginRight: halfGap, ...style}}>
    {children}
  </div>
);
Col.propTypes = {
  halfGap: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired
};
