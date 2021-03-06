import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { reduxForm, Field } from 'redux-form';

import globalConstants from '../constants/global_constants';


// const FILE_FIELD_NAME = 'files';
// number of files user can upload in create flat
const MAX_NUM_FILES = globalConstants.maxNumImages;
const MAX_NUM_PDF_FILES = globalConstants.maxNumPdfFiles;
let imageCount = 0;

export default (field) => {
  imageCount = 0;
  const files = field.input.value;
  console.log('in render_dropzone_input.js, field: ', field);
  console.log('in render_dropzone_input.js, files: ', files);
  // console.log('in render_dropzone_input.js, field.pdfUpload: ', field.pdfUpload);
  // define array to push in index of files exceeding limit MAX_NUM_FILES
  const filesToDelete = [];
  // called to delete from field files exceeding limit

  function deleteFiles() {
    // iterate backwards to take out index from the back so as not to disturb the order in front
    if (filesToDelete.length > 0) {
      let count = 0;
      for (let i = filesToDelete.length - 1; i >= 0; i--) {
        // delete from field array one at index i
        field.input.value.splice(filesToDelete[i], 1);
        count++;
      }

      console.log('in render_dropzone_input.js, field.input.value: ', field.input.value);
      console.log('in render_dropzone_input.js, count: ', count);
      if (count > 0) {
        window.alert(`There ${count > 1 ? 'are' : 'is'} ${count} too many file${count > 1 ? 's' : ''} to upload. The max is ${MAX_NUM_FILES}. Please keep in mind that you can always add or delete images on the edit page.`)
      }
    }
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
          maxSize={globalConstants.maxFileSize} // 8MB max
          accept={field.pdfUpload ? '.pdf' : 'image/*'}
          // accept='image/*'
          // accept='.pdf'
        >
          {field.pdfUpload ?
            <p>Drop your PDF file or <br/>click here <br/>to upload <br/><small><small>(max: {globalConstants.maxFileSize / 10000000}MB per file, One file )</small></small></p>
            :
            <p>Drop your images or <br/>click here <br/>to upload <br/><small><small>(max: {globalConstants.maxFileSize / 10000000}MB per file, {MAX_NUM_FILES} files )</small></small></p>
          }
            <i className="fa fa-image"></i>
        </Dropzone>
          {field.meta.touched &&
          field.meta.error &&
          <span className="error">{field.meta.error}</span>}
            {files && Array.isArray(files) && (
          <div className="image-upload-preview-ul container">
           <div className="image-upload-preview-ul-row row">
            { files.map((file, i) => {
              console.log('in render_dropzone_input.js, files.map, file: ', file);

              // if the upload is for a pdf file
              if (field.pdfUpload) {
                if (i < MAX_NUM_PDF_FILES) {
                  imageCount++;
                  return (
                    <div
                      key={i}
                      className="rdz-dropzone-preview col-xs-2 col-sm-3 col-md-3"
                      style={{
                        // backgroundImage: `url(${file.preview})`,
                        // backgroundRepeat: 'no-repeat',
                        // backgroundSize: '105px 70px'
                      }} // end of style
                    >
                    {file.name}
                    </div>
                  );
                }
              } else {
                // if upload is for an image file
                if (i < MAX_NUM_FILES) {
                  imageCount++;
                  console.log('in render_dropzone_input.js, inside map if imageCount: ', imageCount);
                  return (
                    <div
                      key={i}
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
            }
            )}
            {deleteFiles()}
            </div>
            <div style={{ fontWeight: 'bold' }}>Upload Preview ({imageCount} {field.pdfUpload ? 'file' : 'image'}{imageCount > 1 ? 's' : ''})</div>
          </div>
        )}
      </div>
    </div>
  );// end of return
};
