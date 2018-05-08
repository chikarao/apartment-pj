import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import cloudinary from 'cloudinary-core';
import axios from 'axios';
import sha1 from 'sha1';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

import Upload from './images/upload';
import * as actions from '../actions';
import RenderDropzoneInput from './images/render_dropzone_input';

const FILE_FIELD_NAME = 'files';

class CreateFlat extends Component {

  handleFormSubmit(data) {
    const { address1, city, state, zip, country } = data;
    console.log('in createflat, handleFormSubmit, data: ', data);
    console.log('in createflat, handleFormSubmit, submit clicked');
    console.log('in createflat, handleFormSubmitr, this.props:', this.props);
    const addressHash = { address1, city, state, zip, country }
    // const addressHash = { address1: '4-2-23 Shibuya', city: 'Shibuya', state: 'Tokyo', zip: '150-0002', country: 'Japan' }
    let addressString = '';
    for (const i in addressHash) {
       addressString += addressHash[i] + ", ";
    }

    console.log('in createflat, handleFormSubmit, addressString:', addressString);
    console.log('in createflat, handleFormSubmit, Object.keys(addressHash).length - 1:', Object.keys(addressHash).length - 1);

    this.handleGeocode(addressString, data, () => this.props.createFlat(data, (id, files) => this.handleCreateImages(id, files)));
    // console.log('in createflat, handleFormSubmit, geocodedData:', geocodedData);

    // this.props.createFlat(geocodedData, (id) => this.handleCreateImages(id));

    // call action creator to createFlat and send in callback to create images, cloudinary and api with flat id

    // console.log('in createflat, handleFormSubmit, description: ', description);
    // console.log('in createflat, handleFormSubmit, area: ', area);
    // this.props.signinUser({ email, password }, () => this.props.history.push('/feature'));
    // navigates back to prior page after sign in; call back sent to action signinUser
    // this.props.signinUser({ email, password }, () => this.props.history.goBack());
    // this.props.createFlat({ flatAttributes }, (images) => this.props.history.goBack(images));
  }

  handleGeocode(addressString, data, callback) {
    const geocoder = new google.maps.Geocoder();
    console.log('in createflat, handleFormSubmit, geocoder:', geocoder);

    geocoder.geocode({ 'address': addressString }, function (results, status) {
      if (status === 'OK') {
        console.log('in createflat, geocoder, status:', status);
        console.log('in createflat, geocoder, results:', results);
        console.log('in createflat, geocoder, results[0].geometry.location:', results[0].geometry.location.lat());
        console.log('in createflat, geocoder, results[0].geometry.location:', results[0].geometry.location.lng());
        // resultsMap.setCenter(results[0].geometry.location);
        // var marker = new google.maps.Marker({
        //   map: resultsMap,
        //   position: results[0].geometry.location
        // });
        data.lat = results[0].geometry.location.lat();
        data.lng = results[0].geometry.location.lng();
        console.log('in createflat, in geocoder, in status ok, data:', data);
        // console.log('in createflat, in geocoder, in status ok, this.props:', this.props);
        callback(data);
        // return data;
      } else {
        // alert('Geocode was not successful for the following reason: ' + status);
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });

  }

  handleCreateImages(flatId, files) {
    console.log('in createflat, handleCreateImages, flat_id:', flatId);
    console.log('in createflat, handleCreateImages, files:', files);

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
    console.log('in Upload, handleCreateImages, axios all, then, imagesArray: ', imagesArray);
    //
    _.each(imagesArray, (image) => {
      this.props.createImage(image, flatId);
    });
  });
}


  // createImages(images) {
  //  upload image code here...
  // }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
        <strong>Ooops! </strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  // :user_id, :lat, :lng, :address1, :address2, :city, :state, :region, :zip, :country, :area,
  // :price_per_day, :price_per_month, :guests, :sales_point, :description, :rooms, :beds,
  // :flat_type,:bath, :intro, :cancellation, :smoking

  renderFields() {
    const { handleSubmit } = this.props;
    console.log('in createflat, renderFields, this.props: ', this.props);
    // console.log('in createflat, renderFields, Field: ', Field);
    // handle submit came from redux form; fields came from below
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Street Address:</label>
          <Field name="address1" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">City:</label>
          <Field name="city" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">State:</label>
          <Field name="state" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Zip:</label>
          <Field name="zip" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Country:</label>
          <Field name="country" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Description:</label>
          <Field name="description" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Area:</label>
          <Field name="area" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Price Per Month:</label>
          <Field name="price_per_month" component="input" type="float" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Guests:</label>
          <Field name="guests" component="input" type="integer" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Sales Point:</label>
          <Field name="sales_point" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Rooms:</label>
          <Field name="rooms" component="input" type="float" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Beds:</label>
          <Field name="beds" component="input" type="integer" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Flat Type:</label>
          <Field name="flat_type" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Bath:</label>
          <Field name="bath" component="input" type="float" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Intro:</label>
          <Field name="intro" component="input" type="text" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Cancellation:</label>
          <Field name="cancellation" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">Smoking:</label>
          <Field name="smoking" component="input" type="boolean" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label htmlFor={FILE_FIELD_NAME}></label>
          <Field
            name={FILE_FIELD_NAME}
            component={RenderDropzoneInput}
          />
        </fieldset>
        {this.renderAlert()}
        <button action="submit" id="submit-all" className="btn btn-primary btn-lg">Submit</button>
      </form>
    );
  }

  render() {
    return (
      <div>
        {this.renderFields()}
      </div>
    );
  }
}
//   render() {
//     return (
//       <div>
//         {this.renderFields()}
//       <div>
//         <Upload />
//       </div>
//       </div>
//     );
//   }
// }
//   render() {
//     return (
//       <div>
//         {this.renderFields()}
//       <div>
//       <label htmlFor={FILE_FIELD_NAME}>Files</label>
//        <Field
//          name={FILE_FIELD_NAME}
//          component={RenderDropzoneInput}
//        />
//       </div>
//       </div>
//     );
//   }
// }
CreateFlat = reduxForm({
  form: 'simple'
  // fields: [
  //   'address1',
  //   'city',
  //   'zip',
  //   'country',
  //   'area',
  //   'price_per_day',
  //   'price_per_month',
  //   'guests',
  //   'sales_point',
  //   'description',
  //   'rooms',
  //   'beds',
  //   'flat_type',
  //   'bath'
  // ]
})(CreateFlat);

function mapStateToProps(state) {
  console.log('in feature mapStateToProps: ', state);
  return {
    errorMessage: state.auth.message,
    flat: state.flat
   };
}


export default connect(mapStateToProps, actions)(CreateFlat);
