import {useState} from 'react';

export const FormContainer = ({initialValues, children}) => {
  const [values, setValues] = useState(initialValues);
  const [files, setFiles] = useState([]);

  const onChange = name => value => {
    setValues({...values, [name]: value});
  };

  // Basic onChange event handler used to check RSInput fields
  const handleChangeEvent = event => {
    const {name, value, type, checked} = event.target;

    let newValue = value;
    if (type === 'checkbox') {
      newValue = Boolean(checked);
    }

    setValues({...values, [name]: newValue});
  };

  const addFile = filesToAdd => {
    setFiles([...files, ...filesToAdd]);
  };

  return children({values, onChange, handleChangeEvent, files, addFile});
};
