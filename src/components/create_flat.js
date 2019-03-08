import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';

import cloudinary from 'cloudinary-core';
import axios from 'axios';
import sha1 from 'sha1';

import * as actions from '../actions';
import Amenities from './constants/amenities';
import Languages from './constants/languages';
import RenderDropzoneInput from './images/render_dropzone_input';
import AppLanguages from './constants/app_languages';
import globalConstants from './constants/global_constants';


// const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
// const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });
// const API_KEY = process.env.CLOUDINARY_API_KEY;
// const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// import Upload from './images/upload';

const FILE_FIELD_NAME = 'files';
// const ROOT_URL = 'http://localhost:3000';
const ROOT_URL = globalConstants.rootUrl;
// Amenities imported from /constants
const AMENITIES = Amenities;

class CreateFlat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // confirmChecked: false
      confirmChecked: false
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleConfirmCheck = this.handleConfirmCheck.bind(this);
  }
  // get form input ready for params
  // iterate throughh data from  form submit and separate amanity attributes and flat
  // if object key in data is in AMENTIES object, then add to amenityObj and vice versa
  separateFlatAndAmenities(data) {
    const amenityObj = { flat: {}, amenity: {} };
    console.log('in createflat, separateFlatAndAmenities, data : ', data);
     _.each(Object.keys(data), (key) => {
    // return _.map(AMENITIES, (amenity) => {
      if (AMENITIES[key]) {
        // console.log('in createflat, separateFlatAndAmenities, key, AMENITIES[key] : ', key, AMENITIES[key]);
        // console.log('in createflat, separateFlatAndAmenities, key : ', key);
        // console.log('in createflat, separateFlatAndAmenities, key : ', key);
        amenityObj.amenity[key] = data[key];
      } else {
        amenityObj.flat[key] = data[key];
      }
    });
    // have basic: true in amenity params so to avoid empty params error
    // basic amenity does not show up in amenity list or input
    amenityObj.amenity.basic = true;
    // console.log('in createflat, separateFlatAndAmenities, amenityObj : ', amenityObj);
    return amenityObj;
  }

  handleFormSubmit(data) {
    if (this.state.confirmChecked) {
      //switch on loading modal in action creator
      this.props.showLoading();
      const { address1, city, state, zip, country } = data;
      console.log('in createflat, handleFormSubmit, data: ', data);
      console.log('in createflat, handleFormSubmit, submit clicked');
      console.log('in createflat, handleFormSubmitr, this.props:', this.props);
      const addressHash = { address1, city, state, zip, country }
      // const addressHash = { address1: 'Shibuya', city: 'Shibuya', state: 'Tokyo', zip: '150-0002', country: 'Japan' }
      let addressString = '';
      for (const i in addressHash) {
        addressString += addressHash[i] + ", ";
      }
      // add basic = true to data so that amenity params does not become null
      //in case user does not check any boxes
      const dataSeparated = this.separateFlatAndAmenities(data);
      // for case when user does not select any images
      if (data.files) {
        dataSeparated.files = data.files;
      } else {
        const files = [];
        dataSeparated.files = files;
      }

      // console.log('in createflat, handleFormSubmit, separateFlatAndAmenities,:', this.separateFlatAndAmenities(data));
      // console.log('in createflat, handleFormSubmit, dataSeparated,:', dataSeparated);
      //
      // console.log('in createflat, handleFormSubmit, dataWithBasic:', dataWithBasic);
      // console.log('in createflat, handleFormSubmit, addressString:', addressString);
      // console.log('in createflat, handleFormSubmit, Object.keys(addressHash).length - 1:', Object.keys(addressHash).length - 1);

      // !!!! this one below is it!!!!
      this.handleGeocode(addressString, dataSeparated, () => this.props.createFlat(dataSeparated, (id, files) => this.handleCreateImages(id, files)));
      // console.log('in createflat, handleFormSubmit, geocodedData:', geocodedData);

      // call action creator to createFlat and send in callback to create images, cloudinary and api with flat id
    } else {
      window.alert('Please confirm input by checking the box then pressing submit')
    }
  }

  handleGeocode(addressString, data, callback) {
    const geocoder = new google.maps.Geocoder();
    console.log('in createflat, handleFormSubmit, geocoder:', geocoder);

    geocoder.geocode({ 'address': addressString }, function (results, status) {
      if (status === 'OK') {
        // console.log('in createflat, geocoder, status:', status);
        // console.log('in createflat, geocoder, results:', results);
        // console.log('in createflat, geocoder, results[0].geometry.location:', results[0].geometry.location.lat());
        // console.log('in createflat, geocoder, results[0].geometry.location:', results[0].geometry.location.lng());
        // resultsMap.setCenter(results[0].geometry.location);
        // var marker = new google.maps.Marker({
        //   map: resultsMap,
        //   position: results[0].geometry.location
        // });
        const dataToPass = data;
        dataToPass.flat.lat = results[0].geometry.location.lat();
        dataToPass.flat.lng = results[0].geometry.location.lng();
        console.log('in createflat, in geocoder, in status ok, data:', dataToPass);
        // console.log('in createflat, in geocoder, in status ok, this.props:', this.props);
        callback(dataToPass);
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
    let uploaders = [];
  // Push all the axios request promise into a single array
    if (files.length > 0) {
      uploaders = files.map((file) => {
        console.log('in Upload, handleDrop, uploaders, file: ', file);
        // Initial FormData
        const formData = new FormData();
        // const apiSecret = API_SECRET;
        // const timeStamp = (Date.now() / 1000) | 0;
        // const publicID = `flat_image-${timeStamp}-${index}`;
        // const eager = 'w_400,h_300,c_pad|w_260,h_200,c_crop';
        // const signaturePreSha1 =
        // `eager=${eager}&public_id=${publicID}&timestamp=${timeStamp}${apiSecret}`;
        // const signatureSha1 = sha1(signaturePreSha1);
        //
        // formData.append('timestamp', timeStamp);
        // formData.append('public_id', publicID);
        // formData.append('api_key', API_KEY);
        // formData.append('eager', eager);
        formData.append('file', file);
        formData.append('flatId', flatId);
        // formData.append('signature', signatureSha1);

        // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)

        // console.log('api_key: ', formData.get('api_key'));
        // console.log('in Upload, handleDrop, uploaders, timestamp: ', formData.get('timestamp'));
        // console.log('in Upload, handleDrop, uploaders, public id: ', formData.get('public_id'));
        // // console.log('formData api_key: ', formData.get('api_key'));
        // console.log('in Upload, handleDrop, uploaders, formData eager: ', formData.get('eager'));
        // console.log('in create_flat, handleDrop, uploaders, formData file: ', formData.get('file'));
        // console.log('in create_flat, handleDrop, uploaders, formData flatId: ', formData.get('flatId'));

        // console.log('in Upload, handleDrop, uploaders, signature: ', formData.get('signature'));
        // console.log('in Upload, handleDrop, uploaders, formatData: ', formData);
        return axios.post(`${ROOT_URL}/api/v1/images/upload`, formData, {
          headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
          // return axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
          //   headers: { 'X-Requested-With': 'XMLHttpRequest' },
        }).then(response => {
          // const data = response.data;
          // console.log('in Upload, handleDrop, uploaders, .then, response.data.public_id ', response);
          const filePublicId = response.data.data.response.public_id;
          // You should store this URL for future references in your app
          imagesArray.push(filePublicId);
          // call create image action, send images Array with flat id
        });
        //end of then
      });
      //end of uploaders
    }
  // console.log('in Upload, handleDrop, uploaders: ', uploaders);
  // Once all the files are uploaded
  axios.all(uploaders).then(() => {
    // ... perform after upload is successful operation
    // console.log('in Upload, handleCreateImages, axios all, then, imagesArray: ', imagesArray);
    // if there are no images, call do not create images and just call createImageCallback
    if (imagesArray.length === 0) {
      this.createImageCallback(imagesArray, 0, flatId);
    } else {
      const imageCount = 0;
      this.props.createImage(imagesArray, imageCount, flatId, (array, countCb, id) => this.createImageCallback(array, countCb, id));
    }
  });
}

  createImageCallback(imagesArray, imageCount, flatId) {
    // console.log('in show_flat createImageCallback, passed from callback: ', imagesArray, imageCount, flatId);
    const count = imageCount + 1;
    if (count <= (imagesArray.length - 1)) {
      this.props.createImage(imagesArray, count, flatId, (array, countCb, id) => this.createImageCallback(array, countCb, id));
    } else {
      this.props.history.push(`/show/${flatId}`);
      //switch on loading modal in action creator
      this.props.showLoading();
    }
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
        <strong>Ooops! </strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  handleConfirmCheck(event) {
  // Get the checkbox
  const checkBox = document.getElementById('editFlatConfirmCheck');

  this.setState({ confirmChecked: !this.state.confirmChecked }, () => console.log('in create flat, handleConfirmCheck, this.state.confirmChecked: ', this.state.confirmChecked));
  }

  renderAmenityInput() {
    // <span className="checkmark"></span>
    // <input type="checkbox" className="createFlatAmenityCheckBox"/><i className="fa fa-check fa-lg"></i>
    // get amenities object values of keys
    return _.map(Object.keys(AMENITIES), amenity => {
      return (
        <fieldset key={amenity} className="amenity-input-each col-xs-11 col-sm-3 col-md-3">
          <label className="amenity-radio">{AMENITIES[amenity][this.props.appLanguageCode]}</label>
          <Field name={amenity} component="input" type="checkbox" value="true" className="createFlatAmenityCheckBox" />
        </fieldset>
      );
    })
  }
  //
  // <fieldset key={'station'} className="form-group">
  // <label className="create-flat-form-label">{AppLanguages.nearestStation[appLanguageCode]}:</label>
  // <Field name="station" component="input" type="string" className="form-control" />
  // </fieldset>
  renderEachSelectLanguageOption(languagesObject) {
    return _.map(Object.keys(languagesObject), (eachKey, i) => {
      // if (languagesObject[eachKey].implemented) {
        return (
          <option key={i} value={eachKey}>{languagesObject[eachKey].flag} {languagesObject[eachKey].name}</option>
        );
      // }
    });
  }

  renderFields() {
    const { handleSubmit, appLanguageCode } = this.props;
    console.log('in createflat, renderFields, this.props: ', this.props);
    // console.log('in createflat, renderFields, Field: ', Field);
    // handle submit came from redux form; fields came from below
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit)}>
        <fieldset key={'language_code'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.listingLanguage[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="language_code" component={SelectField} type="string" className="form-control">
            {this.renderEachSelectLanguageOption(Languages)}
          </Field>
        </fieldset>
        <fieldset key={'address1'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.streetAddress[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="address1" component={InputField} type="string" className="form-control" />
        </fieldset>
        <fieldset key={'unit'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.unit[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="unit" component={InputField} type="string" className="form-control" />
        </fieldset>
        <fieldset key={'city'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.city[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="city" component={InputField} type="string" className="form-control" />
        </fieldset>
        <fieldset key={'state'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.state[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="state" component={InputField} type="string" className="form-control" />
        </fieldset>
        <fieldset key={'zip'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.zip[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="zip" component={InputField} type="string" className="form-control" />
        </fieldset>
        <fieldset key={'country'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.country[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="country" component={InputField} type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <div style={{ float: 'left', paddingLeft: '20px', fontStyle: 'italic' }}><span style={{ color: 'red' }}>*</span>{AppLanguages.requiredFields[appLanguageCode]}</div>
        </fieldset>
        <fieldset key={'description'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.description[appLanguageCode]}:</label>
          <Field name="description" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset key={'area'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.area[appLanguageCode]}:</label>
          <Field name="area" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset key={'price_per_month'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.pricePerMonth[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="price_per_month" component={InputField} type="float" className="form-control" />
        </fieldset>
        <fieldset key={'size'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.floorSpace[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="size" component={InputField} type="integer" className="form-control" />
        </fieldset>
        <fieldset key={'balcony_size'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.balconySize[appLanguageCode]}:</label>
          <Field name="balcony_size" component="input" type="integer" className="form-control" />
        </fieldset>
        <fieldset key={'layout'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.layout[appLanguageCode]}:</label>
          <Field name="layout" component="select" type="string" className="form-control">
            <option></option>
            <option value="LDK">LDK</option>
            <option value="DK">DK</option>
            <option value="L">K</option>
            <option value="One Room">One Room</option>
          </Field>
        </fieldset>
        <fieldset key={'toilet'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.toilet[appLanguageCode]}:</label>
          <Field name="toilet" component="select" type="string" className="form-control">
            <option></option>
            <option value="Dedicated Flushing Toilet">Dedicated Flushing Toilet</option>
            <option value="Dedicated Non-flushing Toilet">Dedicated Non-flushing Toilet</option>
            <option value="Shared Flushing Toilet">Shared Flushing Toilet</option>
            <option value="Shared Non-flushing Toilet">Shared Non-flushing Toilet</option>
          </Field>
        </fieldset>
        <fieldset key={'guests'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.guests[appLanguageCode]}:</label>
          <Field name="guests" component="select" type="integer" className="form-control">
            <option></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </Field>
        </fieldset>
        <fieldset key={'sales_point'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.salesPoint[appLanguageCode]}:</label>
          <Field name="sales_point" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset key={'rooms'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.rooms[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="rooms" component="select" type="float" className="form-control">
            <option></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4 or more</option>
          </Field>
        </fieldset>
        <fieldset key={'beds'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.beds[appLanguageCode]}:</label>
          <Field name="beds" component="select" type="integer" className="form-control">
          <option></option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="4">5</option>
          <option value="4">6 or more</option>
          </Field>
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">{AppLanguages.kingOrQueen[appLanguageCode]}:</label>
          <Field name="king_or_queen_bed" component="select" type="integer" className="form-control">
          <option></option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="4">5</option>
          <option value="4">6 or more</option>
          </Field>
        </fieldset>
        <fieldset key={'flat_type'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.flatType[appLanguageCode]}:</label>
          <Field name="flat_type" component="select" type="string" className="form-control">
            <option></option>
            <option value="flat_in_building">Flat in building</option>
            <option value="single_family">House</option>
            <option value="town_house">Town House</option>
            <option value="others">Others</option>
          </Field>
        </fieldset>
        <fieldset key={'bath'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.bath[appLanguageCode]}:</label>
          <Field name="bath" component="select" type="float" className="form-control">
            <option></option>
            <option value="1">1</option>
            <option value="1.5">1.5</option>
            <option value="2">2</option>
            <option value="2.5">2.5</option>
            <option value="3">3 or more</option>
          </Field>
        </fieldset>
        <fieldset className="form-group">
          <label className="create-flat-form-label">{AppLanguages.minutesToNearest[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="minutes_to_station" component={SelectField} type="integer" className="form-control">
            <option></option>
            <option value="1">1 minute or less</option>
            <option value="3">Under 3 minutes</option>
            <option value="5">Under 5 minutes</option>
            <option value="7">Under 7 minutes</option>
            <option value="10">Under 10 minutes</option>
            <option value="15">Under 15 minutes</option>
            <option value="16">Under 15 minutes</option>
          </Field>
        </fieldset>
        <fieldset key={'intro'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.intro[appLanguageCode]}:</label>
          <Field name="intro" component="textarea" type="text" className="form-control flat-intro-input" />
        </fieldset>
        <fieldset key={'owner_name'} className="form-group">
          <label className="create-flat-form-label">Owner Name:</label>
          <Field name="owner_name" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <div style={{ float: 'left', paddingLeft: '20px', fontStyle: 'italic' }}><span style={{ color: 'red' }}>*</span>{AppLanguages.ifOwnerDifferent[this.props.appLanguageCode]}</div>
        </fieldset>
        <fieldset key={'owner_contact_name'} className="form-group">
          <label className="create-flat-form-label">Owner Contact Name:</label>
          <Field name="v" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset key={'owner_address'} className="form-group">
          <label className="create-flat-form-label">Owner Address:</label>
          <Field name="owner_address" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset key={'owner_phone'} className="form-group">
          <label className="create-flat-form-label">Owner Phone:</label>
          <Field name="owner_phone" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset key={'ownership_rights'} className="form-group">
          <label className="create-flat-form-label">Ownership Rights:</label>
          <Field name="ownership_rights" component="input" type="text" className="form-control" />
        </fieldset>
        <fieldset key={'other_rights'} className="form-group">
          <label className="create-flat-form-label">Other Rights than Ownership:</label>
          <Field name="other_rights" component="input" type="text" className="form-control" />
        </fieldset>
        <fieldset key={'cancellation'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.cancellation[appLanguageCode]}:</label>
          <Field name="cancellation" component="select" type="boolean" className="form-control">
            <option></option>
            <option value={true}>{AppLanguages.yesSeePolicies[appLanguageCode]}</option>
            <option value={false}>{AppLanguages.zip[appLanguageCode]}</option>
          </Field>
        </fieldset>
        <fieldset key={'smoking'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.smoking[appLanguageCode]}:</label>
          <Field name="smoking" component="select" type="boolean" className="form-control">
            <option></option>
            <option value={true}>{AppLanguages.yes[appLanguageCode]}</option>
            <option value={false}>{AppLanguages.no[appLanguageCode]}</option>
          </Field>
        </fieldset>
        <div className="container amenity-input-box">
          <div className="row amenity-row">
            {this.renderAmenityInput()}
          </div>
        </div>
        <fieldset key={'123'} className="form-group">
          <label htmlFor={FILE_FIELD_NAME}></label>
          <Field
            name={FILE_FIELD_NAME}
            component={RenderDropzoneInput}
            // message={AppLanguages.dropImages[appLanguageCode]}
          />
        </fieldset>
        {this.renderAlert()}
        <div className="confirm-change-and-button">
          <label className="confirm-radio">
            <input type="checkbox" id="editFlatConfirmCheck" value={this.state.confirmChecked} onChange={this.handleConfirmCheck} /><i className="fa fa-check fa-lg"></i>{AppLanguages.confirmAbove[appLanguageCode]}
            <span className="checkmark"></span>
          </label>
          <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">{AppLanguages.submit[appLanguageCode]}</button>
        </div>
      </form>
    );
  }

  render() {
    return (
      <div>
        <h2 style={{ marginBottom: '40px' }}>{AppLanguages.createListing[this.props.appLanguageCode]}</h2>
        {this.renderFields()}
      </div>
    );
  }
}

// For validation of input and select fields;
//creates component for redux forms in componenet attribute
const InputField = ({
  input,
  type,
  placeholder,
  meta: { touched, error, warning },
  }) => (
      <div>
          <input {...input} type={type} placeholder={placeholder} className="form-control" />
          {touched && error &&
            <div className="error">
              <span style={{ color: 'red' }}>* </span>{error}
            </div>
          }
      </div>
    );

  const SelectField = ({
      input,
      label,
      meta: {touched, error},
      children
    }) => (
        <div>
          <select {...input} className="form-control">
            {children}
          </select>
          {touched && error &&
            <div className="error">
              <span style={{ color: 'red' }}>* </span>{error}
            </div>
          }
        </div>
      );

// reference: https://stackoverflow.com/questions/47286305/the-redux-form-validation-is-not-working
function validate(values) {
  console.log('in signin modal, validate values: ', values);
    const errors = {};
    if (!values.language_code) {
        errors.language_code = 'A language is required';
    }

    if (!values.address1) {
        errors.address1 = 'A Street address is required';
    }

    if (!values.city) {
        errors.city = 'A city, district or ward is required';
    }

    if (!values.state) {
        errors.state = 'A state or province is required';
    }

    if (!values.zip) {
        errors.zip = 'A zip or postal code is required';
    }

    if (!values.country) {
        errors.country = 'A country is required';
    }
    if (!values.price_per_month) {
        errors.price_per_month = 'A price is required';
    }

    if (!values.size) {
        errors.size = 'Floor space is required';
    }

    if (!values.rooms) {
        errors.rooms = 'Number of rooms is required';
    }
    if (!values.minutes_to_station) {
        errors.minutes_to_station = 'Minutes to station is required';
    }

    // if (values.size !== parseInt(values.size, 10)) {
    //     errors.size = 'Floor space needs to be a number';
    // }


    // if(!values.password){
    //     errors.password = 'Password is required'
    // } else if (values.password.length < 6) {
    //   errors.password = 'A password needs to be at least 6 characters'
    //
    // }
    console.log('in signin modal, validate errors: ', errors);
    return errors;
}

CreateFlat = reduxForm({
  form: 'simple',
  validate
})(CreateFlat);

function mapStateToProps(state) {
  console.log('in feature mapStateToProps: ', state);
  const initialValues = {};
  initialValues.language_code = state.languages.appLanguageCode;

  return {
    errorMessage: state.auth.message,
    flat: state.flat,
    appLanguageCode: state.languages.appLanguageCode,
    initialValues
   };
}


export default connect(mapStateToProps, actions)(CreateFlat);
