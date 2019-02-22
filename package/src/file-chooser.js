import React from 'react';
import PropTypes from 'prop-types';

export class FileChooser extends React.Component {
  static propTypes = {
    onChoose: PropTypes.func.isRequired,
    acceptedTypes: PropTypes.array,
    acceptedExtensions: PropTypes.array
  };

  static defaultProps = {
    acceptedTypes: [],
    acceptedExtensions: []
  };

  fileInputRef = React.createRef();

  open = () => {
    this.fileInputRef.current.click();
  };

  handleFileInputChange = () => {
    const {onChoose} = this.props;

    const element = this.fileInputRef.current;

    const files = [];
    for (let i = 0; i < element.files.length; i++) {
      files.push(element.files[i]);
    }

    if (files.length) {
      onChoose(files);
    }

    element.value = '';
    if (element.value) {
      // For IE
      element.type = 'text';
      element.type = 'file';
    }
  };

  render() {
    const {acceptedTypes, acceptedExtensions} = this.props;

    return (
      <input
        type="file"
        ref={this.fileInputRef}
        onChange={this.handleFileInputChange}
        accept={[...acceptedTypes, ...acceptedExtensions].join(',')}
        multiple
        style={{display: 'none'}}
      />
    );
  }
}

export default FileChooser;
