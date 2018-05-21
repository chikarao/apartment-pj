import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import cloudinary from 'cloudinary-core';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import sha1 from 'sha1';

import { connect } from 'react-redux';
import * as actions from '../../actions';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const ROOT_URL = 'http://localhost:3000';

class Upload extends Component {
  createImageCallback(imagesArray, imageCount, flatId) {
    console.log('in Upload, createImageCallback, flatId: ', flatId);
    const currentCount = imageCount + 1;
    // export function createImage(imagesArray, imageCount, flatId, callback)
    if (currentCount <= (imagesArray.length - 1)) {
      this.props.createImage(imagesArray, currentCount, flatId, (array, countCb, id) => this.createImageCallback(array, countCb, id));

    } else {
      this.props.history.push(`/editflat/${flatId}`);
      // document.location.reload()
      console.log('in Upload, createImageCallback, create image completed, flatId.', flatId);
    }
  }

  handleDrop = files => {
    const imagesArray = [];
  // Push all the axios request promise into a single array
    const uploaders = files.map((file, index) => {
    console.log('in Upload, handleDrop, uploaders, file: ', file);
    // Initial FormData
    const formData = new FormData();
    const apiSecret = API_SECRET;
    const timeStamp = (Date.now() / 1000) | 0;
    const publicID = `flat_image-${timeStamp}-${index}`;
    const eager = 'w_400,h_300,c_pad|w_260,h_200,c_crop';
    const signaturePreSha1 =
    `eager=${eager}&public_id=${publicID}&timestamp=${timeStamp}${apiSecret}`;
    const signatureSha1 = sha1(signaturePreSha1);

    const flatId = 101;
    // formData.append('timestamp', timeStamp);
    // formData.append('public_id', publicID);
    // formData.append('api_key', API_KEY);
    // formData.append('eager', eager);
    formData.append('file', file);
    formData.append('flatId', flatId);
    // formData.append('signature', signatureSha1);
    // formData.append('tags', `chikarao, medium, gist`);
    // formData.append('upload_preset', 'chikarao'); // Replace the preset name with your own
    // const file64 = base64Img.base64Sync('file');
    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)

    // console.log('api_key: ', formData.get('api_key'));
    // console.log('in Upload, handleDrop, uploaders, timestamp: ', formData.get('timestamp'));
    // console.log('in Upload, handleDrop, uploaders, public id: ', formData.get('public_id'));
    // // console.log('formData api_key: ', formData.get('api_key'));
    // console.log('in Upload, handleDrop, uploaders, formData eager: ', formData.get('eager'));
    console.log('in Upload, handleDrop, uploaders, formData file: ', formData.get('file'));
    console.log('in Upload, handleDrop, uploaders, formData flatId: ', formData.get('flatId'));
    // console.log('in Upload, handleDrop, uploaders, signature: ', formData.get('signature'));
    // console.log('in Upload, handleDrop, uploaders, formData: ', formData);
    // console.log('in Upload, handleDrop, uploaders, file: ', file);
    // console.log('in Upload, handleDrop, uploaders, file64: ', file64);

    // return axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
    //   headers: { 'X-Requested-With': 'XMLHttpRequest' },
    // axios.post(`${ROOT_URL}/api/v1/images/upload`, { params: { formData } }, {
    // axios.post(`${ROOT_URL}/api/v1/images/upload`, formData, {
    axios.post(`${ROOT_URL}/api/v1/images/upload`, formData, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    }).then(response => {
      // const data = response.data;
      // const filePublicId = response.data.public_id;
      // You should store this URL for future references in your app
      // console.log('in Upload, handleDrop, uploaders, .then, response.data.public_id ', response.data.public_id);
      console.log('in Upload, handleDrop, uploaders, .then, response.data.public_id ', response);
      // imagesArray.push(filePublicId);
      // call create image action, send images Array with flat id
    });
    //end of then
  });
  //end of uploaders
  console.log('in Upload, handleDrop, uploaders: ', uploaders);
  // Once all the files are uploaded
  axios.all(uploaders).then(() => {
    // console.log('in Upload, handleDrop, axios.all, .then, imagesArray ', imagesArray);
    // call createImage and conditional callback to check for last image
    // ... perform after upload is successful operation
    // CALL createImage and send public id, counter, callback with flat id
    //xport function createImage(imagesArray, imageCount, flatId, callback)
    // const imageCount = 0;
    // console.log('in Upload, handleDrop, axios.all, .then, imageCount ', imageCount);
    // this.props.createImage(imagesArray, imageCount, this.props.flatId, (array, counterCB, id) => this.createImageCallback(array, counterCB, id))
  });
}
//end of handleDrop

    render() {
      return (
          <div>
          <div className="dropzone-area">
            <Dropzone
              onDrop={this.handleDrop}
              multiple
              accept="image/*"
              // className="dropzone"
            // style={styles.dropzone}
            >
              <p>Drop your files or <br/>click here <br/>to upload</p>
              <i className="fa fa-image"></i>
            </Dropzone>
          </div>
          </div>
      );
    }
}
// withRouter used for letting this component use router history; enables rerender witout reload
// must more smooth renering
export default withRouter(connect(null, actions)(Upload));
