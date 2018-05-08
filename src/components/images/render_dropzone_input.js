import React, { Component, PropTypes, } from 'react';
import Dropzone from 'react-dropzone';
import { reduxForm, Field } from 'redux-form';


// const FILE_FIELD_NAME = 'files';

export default (field) => {
  const files = field.input.value;
  console.log('in render_dropzone_input.js, field: ', field);
  console.log('in render_dropzone_input.js, files: ', files);

  return (
    <div>
      <div className="dropzone-area">
        <Dropzone
          name={field.name}
          onDrop={(filesToUpload, e) => field.input.onChange(filesToUpload)}
        >
          <p>Drop your images or <br/>click here <br/>to upload</p>
            <i className="fa fa-image"></i>
        </Dropzone>
          {field.meta.touched &&
          field.meta.error &&
          <span className="error">{field.meta.error}</span>}
            {files && Array.isArray(files) && (
          <ul className="image-upload-preview-ul">
            { files.map((file, i) => <li key={i}>{file.name}</li>) }
          </ul>
        )}
      </div>
    </div>
  );
}
