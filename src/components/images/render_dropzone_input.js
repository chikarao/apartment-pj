import React, { Component, PropTypes, } from 'react';
import Dropzone from 'react-dropzone';
import { reduxForm, Field } from 'redux-form';


// const FILE_FIELD_NAME = 'files';
// number of files user can upload in create flat
const MAX_NUM_FILES = 20;

export default (field) => {
  const files = field.input.value;
  console.log('in render_dropzone_input.js, field: ', field);
  console.log('in render_dropzone_input.js, files: ', files);
  // define array to push in index of files exceeding limit MAX_NUM_FILES
  const filesToDelete = [];
  // called to delete from field files exceeding limit
  function deleteFiles() {
    // iterate backwards to take out index from the back so as not to disturb the order in front
    for (let i = filesToDelete.length - 1; i >= 0; i--) {
      // delete from field array one at index i
      field.input.value.splice(filesToDelete[i], 1);
    }
    console.log('in render_dropzone_input.js, field.input.value: ', field.input.value);
  }

  // will not rerender so cannot delete!!!!!!
  // function handleImagePreviewDelete(event) {
  //   const clickedElement = event.target;
  //   const elementVal = clickedElement.getAttribute('value');
  //   console.log('in render_dropzone_input.js, handleImagePreviewDelete, elementVal: ', elementVal);
  //   files.splice(elementVal, 1);
  //   console.log('in render_dropzone_input.js, handleImagePreviewDelete, files: ', files);
  // }
  // Old code for reference
  // { files.map((file, i) => <li key={i}>{file.name}</li>) }
  // <img key={i} src={file.preview} className="rdz-dropzone-preview"></img>
  // <i value={i} className="fa fa-times"></i>

  // Call dropzone compoenet with props
  // if num of files is less than MAX_NUM_FILES, render preview images;
  // otherwise push index in to array for deletion
  return (
    <div>
      <div className="dropzone-area">
        <Dropzone
          name={field.name}
          onDrop={(filesToUpload, e) => field.input.onChange(filesToUpload)}
          maxSize={5000000} // 5MB max
        >
          <p>Drop your images or <br/>click here <br/>to upload <br/><small><small>(max: 5MB per file, 20 files )</small></small></p>
            <i className="fa fa-image"></i>
        </Dropzone>
          {field.meta.touched &&
          field.meta.error &&
          <span className="error">{field.meta.error}</span>}
            {files && Array.isArray(files) && (
          <div className="image-upload-preview-ul container">
           <div className="image-upload-preview-ul-row row">
            { files.map((file, i) => {
              if (i < MAX_NUM_FILES) {
                return (
                  <div key={i}
                  className="rdz-dropzone-preview col-xs-2 col-sm-3 col-md-3"
                  style={{
                    backgroundImage: `url(${file.preview})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '105px 70px'
                  }} // end of style
                  >
                  </div>
                );
              } else {
                filesToDelete.push(i);
              }
            }
            )}
            {deleteFiles()}
            </div>
          </div>
        )}
      </div>
    </div>
  );// end of return
};
