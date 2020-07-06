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
import flatFormObject from './forms/flat_form_object';


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
    console.log('in createflat, handleFormSubmit, data: ', data);
    if (this.state.confirmChecked) {
      //switch on loading modal in action creator
      this.props.showLoading();
      const { address1, city, state, zip, country } = data;
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
      const formData = new FormData();
      delete dataSeparated.flat.appLanguages;

      // IMPORTANT: Data in createFlat is send using FormData which is a multpart/form-data format
      // that can be handled by axios and rails; FormData needs to be sent directly without
      // any wrapper object in the api call body in axios or the files uris are not converted
      // into file data; specifying keys as flat[key] enables strong params to pick permit the params 
      _.each(Object.keys(dataSeparated.flat), eachKey => {
        console.log('in createflat, handleFormSubmit, each flat eachKey:', eachKey);
        // NOTE: IE does not support set; use append
        // Reference: https://medium.com/@jugtuttle/formdata-and-strong-params-ruby-on-rails-react-c230d050e26e
        formData.append(`flat[${eachKey}]`, dataSeparated.flat[eachKey]);
      });

      _.each(Object.keys(dataSeparated.amenity), eachKey => {
        console.log('in createflat, handleFormSubmit, each amenity eachKey:', eachKey);
        // NOTE: IE does not support set; use append
        formData.append(`amenity[${eachKey}]`, dataSeparated.amenity[eachKey]);
      });
      // IMPORTANT:  If user has uploaded images, append images to formData
      // the keys in formData later become keys in params;
      // to distiuguish one file key from another, name them 'file-0' 'file-1' etc
      // formData is a multipart/form data that Rails will wrap with an actiondispatch object

      if (data.files) {
        _.each(data.files, (file, i) => {
          formData.append(`file-${i}`, file);
          console.log('in createflat, handleFormSubmit, file:', file);
        });
      }
      // this.props.createFlat(dataSeparated, () => {});
      this.props.createFlat(formData, (flatId) => this.createFlatCallback(flatId));
      // this.handleGeocode(addressString, dataSeparated, () => this.props.createFlat(dataSeparated, (id, files) => this.handleCreateImages(id, files)));
      // console.log('in createflat, handleFormSubmit, geocodedData:', geocodedData);
    } else {
      window.alert('Please confirm input by checking the box then pressing submit')
    }
  }

  // handleGeocode(addressString, data, callback) {
  //   const geocoder = new google.maps.Geocoder();
  //   console.log('in createflat, handleFormSubmit, geocoder:', geocoder);
  //
  //   geocoder.geocode({ 'address': addressString }, function (results, status) {
  //     if (status === 'OK') {
  //       // console.log('in createflat, geocoder, status:', status);
  //       // console.log('in createflat, geocoder, results:', results);
  //       // console.log('in createflat, geocoder, results[0].geometry.location:', results[0].geometry.location.lat());
  //       // console.log('in createflat, geocoder, results[0].geometry.location:', results[0].geometry.location.lng());
  //       // resultsMap.setCenter(results[0].geometry.location);
  //       // var marker = new google.maps.Marker({
  //       //   map: resultsMap,
  //       //   position: results[0].geometry.location
  //       // });
  //       const dataToPass = data;
  //       dataToPass.flat.lat = results[0].geometry.location.lat();
  //       dataToPass.flat.lng = results[0].geometry.location.lng();
  //       console.log('in createflat, in geocoder, in status ok, data:', dataToPass);
  //       // console.log('in createflat, in geocoder, in status ok, this.props:', this.props);
  //       callback(dataToPass);
  //       // return data;
  //     } else {
  //       // alert('Geocode was not successful for the following reason: ' + status);
  //       console.log('Geocode was not successful for the following reason: ' + status);
  //     }
  //   });
  // }
  // NEED to figure out how to move this to backend;
  // The problem is sending an array of multipart form data format to backend
  // Axios handles the
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

  createFlatCallback(flatId) {
    // console.log('in show_flat createImageCallback, passed from callback: ', imagesArray, imageCount, flatId);
    this.props.history.push(`/show/${flatId}`);
    //switch on loading modal in action creator
    this.props.showLoading();
  }
  // createImageCallback(imagesArray, imageCount, flatId) {
  //   // console.log('in show_flat createImageCallback, passed from callback: ', imagesArray, imageCount, flatId);
  //   const count = imageCount + 1;
  //   if (count <= (imagesArray.length - 1)) {
  //     this.props.createImage(imagesArray, count, flatId, (array, countCb, id) => this.createImageCallback(array, countCb, id));
  //   } else {
  //     this.props.history.push(`/show/${flatId}`);
  //     //switch on loading modal in action creator
  //     this.props.showLoading();
  //   }
  // }

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

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong> &nbsp;</strong> {this.props.errorMessage}
        </div>
      );
    }
  }


  renderRequiredMessages() {
    console.log('in createflat, renderRequiredMessages: ');
    const renderEachMessage = () => {
      return _.map(Object.keys(this.props.formObject.syncErrors), eachKey => {
        return (
          <li key={eachKey}>{this.props.formObject.syncErrors[eachKey]}</li>
        );
      });
    };

    return (
      <div
        className="create-flat-required-message-box"
      >
        <ul>
          {renderEachMessage()}
        </ul>
      </div>
    );
  }

  flatCreateEditMainFields(props) {
    const { appLanguages, appLanguageCode } = props;

    // const flatFormObject = {
    //   address1: {
    //     component: InputField,
    //     appLanguageKey: 'streetAddress',
    //     labelSpanStyle: { color: 'red' },
    //     type: 'string',
    //     className: 'form-control',
    //   },
    //
    //   unit: {
    //     component: InputField,
    //     appLanguageKey: 'unit',
    //     labelSpanStyle: { color: 'red' },
    //     type: 'string',
    //     className: 'form-control',
    //   },
    //
    //   city: {
    //     component: InputField,
    //     appLanguageKey: 'city',
    //     labelSpanStyle: { color: 'red' },
    //     type: 'string',
    //     className: 'form-control',
    //   },
    //
    //   state: {
    //     component: InputField,
    //     appLanguageKey: 'state',
    //     labelSpanStyle: { color: 'red' },
    //     type: 'string',
    //     className: 'form-control',
    //   },
    //
    //   zip: {
    //     component: InputField,
    //     appLanguageKey: 'zip',
    //     labelSpanStyle: { color: 'red' },
    //     type: 'string',
    //     className: 'form-control',
    //   },
    //
    //   country: {
    //     component: InputField,
    //     appLanguageKey: 'country',
    //     labelSpanStyle: { color: 'red' },
    //     type: 'string',
    //     className: 'form-control',
    //   },
    //
    //   price_per_month: {
    //     component: InputField,
    //     appLanguageKey: 'pricePerMonth',
    //     labelSpanStyle: { color: 'red' },
    //     type: 'float',
    //     className: 'form-control',
    //   },
    //
    //   size: {
    //     component: InputField,
    //     appLanguageKey: 'floorSpace',
    //     labelSpanStyle: { color: 'red' },
    //     type: 'integer',
    //     className: 'form-control',
    //   },
    //
    //   rooms: {
    //     component: SelectField,
    //     appLanguageKey: 'rooms',
    //     labelSpanStyle: { color: 'red' },
    //     type: 'float',
    //     className: 'form-control',
    //     optionArray: [
    //       { value: null, textAppLanguagekey: '' },
    //       { value: 1, textAppLanguagekey: '' },
    //       { value: 3, textAppLanguagekey: '' },
    //       { value: 4, textAppLanguagekey: 'orMore4' },
    //     ]
    //   },
    //   minutes_to_station: {
    //     component: SelectField,
    //     appLanguageKey: 'minutesToNearest',
    //     labelSpanStyle: { color: 'red' },
    //     type: 'integer',
    //     className: 'form-control',
    //     optionArray: [
    //       { value: null, textAppLanguagekey: '' },
    //       { value: 1, textAppLanguagekey: 'under1minute' },
    //       { value: 3, textAppLanguagekey: 'under3minutes' },
    //       { value: 5, textAppLanguagekey: 'under5minutes' },
    //       { value: 7, textAppLanguagekey: 'under7minutes' },
    //       { value: 10, textAppLanguagekey: 'under10minutes' },
    //       { value: 15, textAppLanguagekey: 'under15minutes' },
    //       { value: 16, textAppLanguagekey: 'over15minutes' },
    //     ]
    //   },
    // };

    const componentMap = {
      selectField: SelectField,
      inputField: InputField,
      input: 'input'
    };

    const renderOptions = (eachField) => {
      return _.map(eachField.optionArray, eachOption => {
        console.log('in flatCreateEditMainFields, renderOptions , this.props.appLanguages, eachOption: ', this.props.appLanguages, eachOption);
        const optionText = this.props.appLanguages && eachField.languageFromBackEnd && eachOption.value ? this.props.appLanguages[eachOption.value][this.props.appLanguageCode] : eachOption.value
        if (!eachOption.value) return <option key={111111}></option>;
        // If there is value but not textAppLanguagekey, use value for the option text
        if (eachOption.value && !eachOption.textAppLanguagekey) return <option key={eachOption.value} value={eachOption.value}>{optionText}</option>;
        return <option key={eachOption.value} value={eachOption.value}>{appLanguages ? appLanguages[eachOption.textAppLanguagekey][appLanguageCode] : ''}</option>;
      })
    };

    return _.map(Object.keys(flatFormObject), eachName => {

      const eachField = flatFormObject[eachName]
      console.log('in flatCreateEditMainFields, before return , appLanguages, props: ', appLanguages, props);
      if (!eachField.type) {
        return (
          <fieldset key={eachName} className="form-group">
            <div style={eachField.style}><span style={eachField.labelSpanStyle}>*</span>{appLanguages.requiredFields[appLanguageCode]}</div>
          </fieldset>
        )
      }

      return (
        <fieldset key={eachName} className="form-group">
          <label className="create-flat-form-label">{appLanguages ? appLanguages[eachField.appLanguageKey][appLanguageCode] : ''}
          {eachField.labelSpanStyle ? <span style={{ color: 'red' }}>*</span> : ''}:
          </label>
          <Field key={eachName} props={{ required: eachField.required }} name={eachName} component={componentMap[eachField.component]} type={eachField.type} className={eachField.className}>
            {eachField.component === 'selectField' ? renderOptions(eachField) : ''}
          </Field>
        </fieldset>
      );
    })
  }

  renderFields() {
    const { handleSubmit, appLanguageCode } = this.props;
    // console.log('in createflat, renderFields, this.props: ', this.props);
    // this.props.formObject ? console.log('in createflat, renderFields, this.props.formObject: ', this.props.formObject) : '';
    // console.log('in createflat, renderFields, this.props.formObject && this.props.formObject.simple && Object.keys(this.props.formObject.simple.syncErrors).length > 0 && this.state.confirmChecked: ', this.props.formObject && this.props.formObject.syncErrors && Object.keys(this.props.formObject.syncErrors).length > 0 && this.state.confirmChecked);
     // this.props.formObject ? console.log('in createflat, renderFields, this.props.formObject.simple: ', this.props.formObject) : '';
    // console.log('in createflat, renderFields, Object.keys(this.props.formObject.simple.syncErrors ', Object.keys(this.props.formObject.simple.syncErrors));
    // console.log('in createflat, renderFields, Field: ', Field);
    // handle submit came from redux form; fields came from below
    // <form>
    // <button onClick={handleSubmit(() => this.handleFormSubmit)} className="btn btn-primary btn-lg submit-button">{AppLanguages.submit[appLanguageCode]}</button>
    // !!! IMPORTANT: Tried to render redux fields with reusable function with iterator but does not work;
    // First click does not register, backspacing inputs does not work well etc...
    // Having repeating tag code is no desirable but redux form works better thaat so it seems...
    // <fieldset key={'address1'} className="form-group">
    // <label className="create-flat-form-label">{AppLanguages.streetAddress[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
    // <Field name="address1" component={InputField} type="string" className="form-control" />
    // </fieldset>
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit)}>
        <fieldset key={'language_code'} className="form-group">
          <label className="create-flat-form-label">{AppLanguages.listingLanguage[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
          <Field name="language_code" component={SelectField} type="string" className="form-control">
            {this.renderEachSelectLanguageOption(Languages)}
          </Field>
        </fieldset>

        {!_.isEmpty(this.props.appLanguages) && this.flatCreateEditMainFields({ appLanguages: AppLanguages, appLanguageCode })}


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
        <div
          className="confirm-change-and-button-container"
        >
          {this.props.formObject && this.props.formObject.syncErrors && Object.keys(this.props.formObject.syncErrors).length > 0 && this.state.confirmChecked ? this.renderRequiredMessages() : ''}
          <div className="confirm-change-and-button">
            <label className="confirm-radio">
            <input type="checkbox" id="editFlatConfirmCheck" value={this.state.confirmChecked} onChange={this.handleConfirmCheck} /><i className="fa fa-check fa-lg"></i>{AppLanguages.confirmAbove[appLanguageCode]}
            <span className="checkmark"></span>
            </label>
            <button action="submit" id="submit-all" onSubmit={this.handleSubmit} className="btn btn-primary btn-lg submit-button">{AppLanguages.submit[appLanguageCode]}</button>
          </div>
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
// function validate(values) {
//   console.log('in signin modal, validate values: ', values);
//     const errors = {};
//     if (!values.language_code) {
//       errors.language_code = values.appLanguages.requiredLanguage[values.language_code_for_validate];
//         // errors.language_code = 'A language is required';
//     }
//
//     if (!values.address1) {
//       // console.log('in signin modal, validate values, values.appLanguages.requiredAddress1, values.language_code_for_validate: ', values, values.appLanguages.requiredAddress1, values.language_code_for_validate);
//       errors.address1 = values.appLanguages.requiredAddress1[values.language_code_for_validate];
//         // errors.address1 = 'A Street address is required';
//     }
//
//     if (!values.city) {
//       errors.city = values.appLanguages.requiredCity[values.language_code_for_validate];
//         // errors.city = 'A city, district or ward is required';
//     }
//
//     if (!values.state) {
//       errors.state = values.appLanguages.requiredState[values.language_code_for_validate];
//         // errors.state = 'A state or province is required';
//     }
//
//     if (!values.zip) {
//       errors.zip = values.appLanguages.requiredZip[values.language_code_for_validate];
//         // errors.zip = 'A zip or postal code is required';
//     }
//
//     if (!values.country) {
//       errors.country = values.appLanguages.requiredCountry[values.language_code_for_validate];
//         // errors.country = 'A country is required';
//     }
//     if (!values.price_per_month) {
//       errors.price_per_month = values.appLanguages.requiredPricePerMonth[values.language_code_for_validate];
//         // errors.price_per_month = 'A price is required';
//     }
//
//     if (!values.size) {
//       errors.size = values.appLanguages.requiredFloorSpace[values.language_code_for_validate];
//         // errors.size = 'Floor space is required';
//     }
//
//     if (!values.rooms) {
//       errors.rooms = values.appLanguages.requiredRooms[values.language_code_for_validate];
//         // errors.rooms = 'Number of rooms is required';
//     }
//     if (!values.minutes_to_station) {
//       errors.minutes_to_station = values.appLanguages.requiredMinutesToStation[values.language_code_for_validate];
//         // errors.minutes_to_station = 'Minutes to station is required';
//     }

    // if (values.size !== parseInt(values.size, 10)) {
    //     errors.size = 'Floor space needs to be a number';
    // }


    // if(!values.password){
    //     errors.password = 'Password is required'
    // } else if (values.password.length < 6) {
    //   errors.password = 'A password needs to be at least 6 characters'
    //
    // }
    // console.log('in signin modal, validate errors: ', errors);
//     return errors;
// }

CreateFlat = reduxForm({
  form: 'simple'
  // validate
})(CreateFlat);

function mapStateToProps(state) {
  console.log('in feature mapStateToProps: ', state);
  const initialValues = state.form.simple ? { ...state.form.simple.values } : {};
  // For passing appLanguages and appLanguageCode to validate function
  initialValues.language_code_for_validate = state.languages.appLanguageCode;
  // AppLanguages to be moved to backend
  initialValues.appLanguages = AppLanguages;
  initialValues.language_code = state.languages.appLanguageCode;

  return {
    errorMessage: state.auth.message,
    flat: state.flat,
    appLanguageCode: state.languages.appLanguageCode,
    initialValues,
    formObject: state.form.simple,
    appLanguages: state.auth.appLanguages,
    // errorMessage: state.auth.error
   };
}


export default connect(mapStateToProps, actions)(CreateFlat);
