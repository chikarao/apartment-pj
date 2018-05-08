import React, { Component } from 'react';

import cloudinary from 'cloudinary-core';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import sha1 from 'sha1';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;


class Upload extends Component {
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

    formData.append('timestamp', timeStamp);
    formData.append('public_id', publicID);
    formData.append('api_key', API_KEY);
    formData.append('eager', eager);
    formData.append('file', file);
    formData.append('signature', signatureSha1);
    // formData.append('tags', `chikarao, medium, gist`);
    // formData.append('upload_preset', 'chikarao'); // Replace the preset name with your own

    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)

    // console.log('api_key: ', formData.get('api_key'));
    console.log('in Upload, handleDrop, uploaders, timestamp: ', formData.get('timestamp'));
    console.log('in Upload, handleDrop, uploaders, public id: ', formData.get('public_id'));
    // console.log('formData api_key: ', formData.get('api_key'));
    console.log('in Upload, handleDrop, uploaders, formData eager: ', formData.get('eager'));
    console.log('in Upload, handleDrop, uploaders, formData file: ', formData.get('file'));
    console.log('in Upload, handleDrop, uploaders, signature: ', formData.get('signature'));

    return axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then(response => {
      // const data = response.data;
      const filePublicId = response.data.public_id;
      // You should store this URL for future references in your app
      console.log('in Upload, handleDrop, uploaders, .then, response.data.public_id ', response.data.public_id);
      imagesArray.push(filePublicId);
      // call create image action, send images Array with flat id
    });
    //end of then
  });
  //end of uploaders
  console.log('in Upload, handleDrop, uploaders: ', uploaders);
  // Once all the files are uploaded
  axios.all(uploaders).then(() => {
    // ... perform after upload is successful operation
    //
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

export default Upload;
