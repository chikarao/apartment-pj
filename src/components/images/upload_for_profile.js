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
// const API_KEY = process.env.CLOUDINARY_API_KEY;
// const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const ROOT_URL = 'http://localhost:3000';

class UploadForProfile extends Component {
  // componentDidMount() {
  //
  // }
  createImageCallback() {
    // console.log('in UploadForProfile, createImageCallback, flatId: ');
    // export function createImage(imagesArray, imageCount, flatId, callback)

      this.props.history.push('/myPage');
      // switch off loading page
      this.props.showLoading();
      // document.location.reload()
      console.log('in UploadForProfile, createImageCallback, create image completed');

  }

  handleDrop = files => {
    // switch on show loading state prop
    this.props.showLoading();
    const imagesArray = [];
  // Push all the axios request promise into a single array
    const uploaders = files.map((file) => {
    console.log('in UploadForProfile, handleDrop, uploaders, file: ', file);
    // Initial FormData
    const formData = new FormData();
    console.log('in UploadForProfile, handleDrop, uploaders, formData: ', formData);
    // const apiSecret = API_SECRET;
    // const timeStamp = (Date.now() / 1000) | 0;
    // const publicID = `flat_image-${timeStamp}-${index}`;
    // const eager = 'w_400,h_300,c_pad|w_260,h_200,c_crop';
    // const signaturePreSha1 =
    // `eager=${eager}&public_id=${publicID}&timestamp=${timeStamp}${apiSecret}`;
    // const signatureSha1 = sha1(signaturePreSha1);

    // formData.append('timestamp', timeStamp);
    // formData.append('public_id', publicID);
    // formData.append('api_key', API_KEY);
    // formData.append('eager', eager);
    formData.append('file', file);
    formData.append('flatId', this.props.flatId);

    // formData.append('signature', signatureSha1);

    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
    // !!!!! formData.get errror not a function STOPS execution on Safari
    // console.log('api_key: ', formData.get('api_key'));
    // console.log('in UploadForProfile, handleDrop, uploaders, timestamp: ', formData.get('timestamp'));
    // console.log('in UploadForProfile, handleDrop, uploaders, public id: ', formData.get('public_id'));
    // console.log('formData api_key: ', formData.get('api_key'));
    // console.log('in UploadForProfile, handleDrop, uploaders, formData eager: ', formData.get('eager'));
    // console.log('in UploadForProfile, handleDrop, uploaders, formData file: ', formData.get('file'));
    // console.log('in UploadForProfile, handleDrop, uploaders, formData flatId: ', formData.get('flatId'));

    // console.log('in UploadForProfile, handleDrop, uploaders, signature: ', formData.get('signature'));
    // console.log('in UploadForProfile, handleDrop, uploaders, formatData: ', formData);

    return axios.post(`${ROOT_URL}/api/v1/images/upload`, formData, {
    headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    // return axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
    //   headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then(response => {
      // const data = response.data;
      const filePublicId = response.data.data.response.public_id;
      // You should store this URL for future references in your app
      // console.log('in UploadForProfile, handleDrop, uploaders, .then, response.data.public_id ', response.data.public_id);
      console.log('in UploadForProfile, handleDrop, uploaders, .then, response ', response);
      console.log('in UploadForProfile, handleDrop, uploaders, .then, response.data.data.response.public_id ', response.data.data.response.public_id);
      imagesArray.push(filePublicId);
      // call create image action, send images Array with flat id
    });
    //end of then
  });
  //end of uploaders
  // console.log('in UploadForProfile, handleDrop, uploaders: ', uploaders);
  // Once all the files are uploaded
  axios.all(uploaders).then(() => {
    console.log('in UploadForProfile, handleDrop, axios.all, .then, imagesArray ', imagesArray);
    // call createImage and conditional callback to check for last image
    // ... perform after upload is successful operation
    // CALL createImage and send public id, counter, callback with flat id
    //xport function createImage(imagesArray, imageCount, flatId, callback)
    // const imageCount = 0;
    // console.log('in UploadForProfile, handleDrop, axios.all, .then, imageCount ', imageCount);
    // this.props.createImage(imagesArray, imageCount, this.props.flatId, (array, counterCB, id) => this.createImageCallback(array, counterCB, id))
    // this.props.editProfile({ id: this.props.profileId, image: imagesArray[0] }, () => this.createImageCallback())
    this.props.updateUser({ image: imagesArray[0] }, () => this.createImageCallback())
    // document.location.reload();
    // this.props.history.push(`/editflat/${this.props.flatId}`);
  });
}
//end of handleDrop

    render() {
      return (
          <div>
          <div className="profile-dropzone-area">
            <Dropzone
              onDrop={this.handleDrop}
              // multiple
              accept="image/*"
              // className="dropzone"
            // style={styles.dropzone}
            >
              <p><br/>Change your profile picture</p>
            </Dropzone>
          </div>
          </div>
      );
    }
}
// withRouter used for letting this component use router history; enables rerender witout reload
// must more smooth renering
export default withRouter(connect(null, actions)(UploadForProfile));
