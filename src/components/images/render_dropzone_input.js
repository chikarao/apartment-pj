import React, { Component, PropTypes, } from 'react';
import Dropzone from 'react-dropzone';
import { reduxForm, Field } from 'redux-form';


// const FILE_FIELD_NAME = 'files';

export default (field) => {
  const files = field.input.value;
  console.log('in render_dropzone_input.js, field: ', field);
  console.log('in render_dropzone_input.js, files: ', files);

  // will not rerender so cannot delete!!!!!!
  // function handleImagePreviewDelete(event) {
  //   const clickedElement = event.target;
  //   const elementVal = clickedElement.getAttribute('value');
  //   console.log('in render_dropzone_input.js, handleImagePreviewDelete, elementVal: ', elementVal);
  //   files.splice(elementVal, 1);
  //   console.log('in render_dropzone_input.js, handleImagePreviewDelete, files: ', files);
  // }

  // { files.map((file, i) => <li key={i}>{file.name}</li>) }
  // <img key={i} src={file.preview} className="rdz-dropzone-preview"></img>
  // <i value={i} className="fa fa-times"></i>
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
          <div className="image-upload-preview-ul container">
           <div className="image-upload-preview-ul-row row">
            { files.map((file, i) =>
              <div key={i}
                className="rdz-dropzone-preview col-xs-2 col-sm-3 col-md-3"
                style={{
                  backgroundImage: `url(${file.preview})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '105px 70px'
                }}
              >
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
