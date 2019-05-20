import {useState} from 'react';

export const FormContainer = ({initialValues, children}) => {
  const [values, setValues] = useState(initialValues);
  const [files, setFiles] = useState([]);

  const onChange = name => value => {
    setValues({...values, [name]: value});
  };

  const addFile = filesToAdd => {
    setFiles([...files, ...filesToAdd]);
  };

  const onSubmit = () => {
    console.log('Form submitted', values);
  };

  return children({values, onChange, files, addFile, onSubmit});
};
