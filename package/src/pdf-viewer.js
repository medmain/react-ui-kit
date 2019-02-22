import React from 'react';
import PropTypes from 'prop-types';

export const PDFViewer = ({url, width = '100%', height = '400'}) => {
  return (
    <object data={url} type="application/pdf" width={width} height={height}>
      <embed src={url} width={width} height={height} type="application/pdf" />
      PDF not supported by your browser!
    </object>
  );
};
PDFViewer.propTypes = {
  url: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string
};
