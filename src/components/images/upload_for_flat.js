import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import cloudinary from 'cloudinary-core';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import sha1 from 'sha1';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import globalConstants from '../constants/global_constants';


const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });
// const API_KEY = process.env.CLOUDINARY_API_KEY;
// const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const ROOT_URL = 'http://localhost:3000';

const MAX_NUM_FILES = globalConstants.maxNumImages;

class UploadForFlat extends Component {
  createImageCallback(flatId) {
    // console.log('in UploadForFlat, createImageCallback, flatId: ', flatId);
    // const currentCount = imageCount + 1;
    // // export function createImage(imagesArray, imageCount, flatId, callback)
    // if (currentCount <= (imagesArray.length - 1)) {
    //   this.props.createImage(imagesArray, currentCount, flatId, (array, countCb, id) => this.createImageCallback(array, countCb, id));
    //
    // } else {
      this.props.history.push(`/editflat/${flatId}`);
      // document.location.reload()
      // console.log('in UploadForFlat, createImageCallback, create image completed, flatId.', flatId);
      this.props.showLoading();
    // }
  }
  // Use FormData (multipart/form-data) for image file upload;
  // Rails will wrap the multipart/form-data in activedispatch object
  // Call uploads image and create image instance for flat  and return flat
  handleDrop = files => {
    // Restrict files that are over limit for number of files
    const numExistingImages = this.props.flat.images.length;
    const numNewImagesAllowed = MAX_NUM_FILES - numExistingImages;
    const numDisallowed = files.length - numNewImagesAllowed;
    // console.log('in UploadForFlat, handleDrop, uploaders, numDisallowed: ', numDisallowed);
    files.splice(-1, numDisallowed);
    // get multipart/fild-data instance
    const formData = new FormData();
    // Backend iterates through params file-0...file-1; so name files
    // with number
    _.each(files, (eachFile, i) => {
      formData.append(`file-${i}`, eachFile);
    });
    formData.append('flat_id', this.props.flatId);
    this.props.showLoading();
    this.props.uploadAndCreateImage(formData, (flatId) => this.createImageCallback(flatId));
  }
// Old handleDrop; Now use formData for sending multiple files and fildId
//   handleDrop0 = files => {
//     this.props.showLoading();
//     const imagesArray = [];
//     // console.log('in UploadForFlat, handleDrop, uploaders, files: ', files);
//     // console.log('in UploadForFlat, handleDrop, uploaders, this.props.flat.images: ', this.props.flat.images);
//     const numExistingImages = this.props.flat.images.length;
//     const numNewImagesAllowed = MAX_NUM_FILES - numExistingImages;
//     // console.log('in UploadForFlat, handleDrop, uploaders, numNewImagesAllowed: ', numNewImagesAllowed);
//     const numDisallowed = files.length - numNewImagesAllowed;
//     // console.log('in UploadForFlat, handleDrop, uploaders, numDisallowed: ', numDisallowed);
//     files.splice(-1, numDisallowed)
//     // console.log('in UploadForFlat, handleDrop, uploaders, after splice files: ', files);
//   // Push all the axios request promise into a single array
//     const uploaders = files.map((file) => {
//     // console.log('in UploadForFlat, handleDrop, uploaders, file: ', file);
//     // Initial FormData
//     const formData = new FormData();
//     // const apiSecret = API_SECRET;
//     // const timeStamp = (Date.now() / 1000) | 0;
//     // const publicID = `flat_image-${timeStamp}-${index}`;
//     // const eager = 'w_400,h_300,c_pad|w_260,h_200,c_crop';
//     // const signaturePreSha1 =
//     // `eager=${eager}&public_id=${publicID}&timestamp=${timeStamp}${apiSecret}`;
//     // const signatureSha1 = sha1(signaturePreSha1);
//
//     // formData.append('timestamp', timeStamp);
//     // formData.append('public_id', publicID);
//     // formData.append('api_key', API_KEY);
//     // formData.append('eager', eager);
//     formData.append('file', file);
//     formData.append('flatId', this.props.flatId);
//
//     // formData.append('signature', signatureSha1);
//
//
//     // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
//
//     // console.log('api_key: ', formData.get('api_key'));
//     // console.log('in UploadForFlat, handleDrop, uploaders, timestamp: ', formData.get('timestamp'));
//     // console.log('in UploadForFlat, handleDrop, uploaders, public id: ', formData.get('public_id'));
//     // console.log('formData api_key: ', formData.get('api_key'));
//     // console.log('in UploadForFlat, handleDrop, uploaders, formData eager: ', formData.get('eager'));
//     // console.log('in UploadForFlat, handleDrop, uploaders, formData file: ', formData.get('file'));
//     // console.log('in UploadForFlat, handleDrop, uploaders, formData flatId: ', formData.get('flatId'));
//
//     // console.log('in UploadForFlat, handleDrop, uploaders, signature: ', formData.get('signature'));
//     // console.log('in UploadForFlat, handleDrop, uploaders, formatData: ', formData);
//
//     console.log('in UploadForFlat, handleDrop, formData.', formData);
//     return axios.post(`${ROOT_URL}/api/v1/images/upload`, formData, {
//     headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
//     // return axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
//     //   headers: { 'X-Requested-With': 'XMLHttpRequest' },
//     }).then(response => {
//       // const data = response.data;
//       const filePublicId = response.data.data.response.public_id;
//       // You should store this URL for future references in your app
//       // console.log('in UploadForFlat, handleDrop, uploaders, .then, response.data.public_id ', response.data.public_id);
//       // console.log('in UploadForFlat, handleDrop, uploaders, .then, response ', response);
//       // console.log('in UploadForFlat, handleDrop, uploaders, .then, response.data.data.response.public_id ', response.data.data.response.public_id);
//       imagesArray.push(filePublicId);
//       // call create image action, send images Array with flat id
//     }); //end of then
//   }); //end of uploaders
//   // console.log('in UploadForFlat, handleDrop, uploaders: ', uploaders);
//   // Once all the files are uploaded
//   axios.all(uploaders).then(() => {
//     // console.log('in UploadForFlat, handleDrop, axios.all, .then, imagesArray ', imagesArray);
//     // call createImage and conditional callback to check for last image
//     // ... perform after upload is successful operation
//     // CALL createImage and send public id, counter, callback with flat id
//     //xport function createImage(imagesArray, imageCount, flatId, callback)
//     const imageCount = 0;
//     // console.log('in UploadForFlat, handleDrop, axios.all, .then, imageCount ', imageCount);
//     this.props.createImage(imagesArray, imageCount, this.props.flatId, (array, counterCB, id) => this.createImageCallback(array, counterCB, id))
//     // document.location.reload();
//     // this.props.history.push(`/editflat/${this.props.flatId}`);
//   });
// }
//end of handleDrop

    render() {
      return (
          <div>
          <div className="dropzone-area">
            <Dropzone
              onDrop={this.handleDrop}
              multiple
              accept="image/*"
              maxSize={globalConstants.maxFileSize}// 8MB max
              // className="dropzone"
            // style={styles.dropzone}
            >
              <p>Drop your files or <br/>click here <br/>to upload <br/><small> (max: {globalConstants.maxFileSize / 10000000}MB per file)</small></p>
              <i className="fa fa-image"></i>
            </Dropzone>
          </div>
          </div>
      );
    }
}
// withRouter used for letting this component use router history; enables rerender witout reload
// must more smooth renering
export default withRouter(connect(null, actions)(UploadForFlat));
