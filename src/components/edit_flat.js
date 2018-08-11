import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';

import * as actions from '../actions';
import Upload from './images/upload';
import Amenities from './constants/amenities';
import GoogleMap from './maps/google_map';
import MapInteraction from './maps/map_interaction';

import globalConstants from './constants/global_constants';

let deleteImageArray = [];
const AMENITIES = Amenities;
const MAX_NUM_FILES = globalConstants.maxNumImages;


class EditFlat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // confirmChecked: false
      confirmChecked: false
    };
  }
// reference for checkbox
//https://www.w3schools.com/howto/howto_css_custom_checkbox.asp

  componentDidMount() {
    console.log('in edit flat, componentDidMount, this.props.match.params:', this.props.match.params);
    // gets flat id from params set in click of main_cards or infowindow detail click
    this.props.selectedFlatFromParams(this.props.match.params.id);
    this.props.getCurrentUser();
    // this.props.fetchPlaces(this.props.match.params.id);

    console.log('in edit flat, componentDidMount, this.state.handleConfirmCheck: ', this.state.confirmChecked);
    // if (this.props.flat) {
    //   console.log('in edit flat, componentDidMount, editFlatLoad called');
    //   this.props.editFlatLoad(this.props.flat);
    // }
  }

  currentUserIsOwner() {
    if (this.props.auth && this.props.flat) {
      console.log('in editFlat, currentUserIsOwner, this.props.auth.id == this.props.flat.user_id : ', this.props.auth.id == this.props.flat.user_id);
      return (this.props.auth.id == this.props.flat.user_id);
      // return true;
      // return false;
    }
  }


  separateFlatAndAmenities(data) {
    const amenityObj = { flat: {}, amenity: {} }
    console.log('in editFlat, separateFlatAndAmenities, data : ', data);
     _.each(Object.keys(data), (key) => {
    // return _.map(AMENITIES, (amenity) => {
      if (AMENITIES[key]) {
        console.log('in editFlat, separateFlatAndAmenities, key, AMENITIES[key] : ', key, AMENITIES[key]);
        console.log('in editFlat, separateFlatAndAmenities, key : ', key);
        // console.log('in editFlat, separateFlatAndAmenities, key : ', key);
        amenityObj.amenity[key] = data[key];
      } else {
        amenityObj.flat[key] = data[key];
      }
    });
    // console.log('in editFlat, separateFlatAndAmenities, amenityObj : ', amenityObj);
    return amenityObj;
  }

  handleFormSubmit(data) {
    console.log('in edit flat, handleFormSubmit, data: ', data);
    if (this.state.confirmChecked) {
      const dataSeparated = this.separateFlatAndAmenities(data);
      this.props.editFlat(dataSeparated, (id) => this.editFlatCallback(id));
      this.props.showLoading();
    } else {
      console.log('in edit flat, handleFormSubmit, checkbox not checked: ');
      window.alert('Please check box to confirm your inputs then push submit')
    }
  }

  editFlatCallback(id) {
    console.log('in edit flat, editFlatCallback, id: ', id);
    // this.props.history.push(`/editflat/${id}`);
    //for some reason, history.push does not update the default values in fields
    // reload page; fetches new flat data
    this.props.showLoading();
    document.location.reload()
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

  handleImageDeleteCheck(event) {
    // reference: https://stackoverflow.com/questions/7378228/check-if-an-element-is-present-in-an-array
    console.log('in edit flat, handleImageDeleteCheck, event.target: ', event.target.value);
    // const parent = event.target.parentElement;
    // const parentElement = parent.parentElement;
    // console.log('in edit flat, handleImageDeleteCheck, parentElement: ', parent);
    // console.log('in edit flat, handleImageDeleteCheck, parentElement: ', parentElement);
    const includesImage = deleteImageArray.includes(event.target.value);
    if (!includesImage) {
      deleteImageArray.push(event.target.value);
      // parentElement.style.backgroundColor = 'LightSkyBlue';
    } else {
      deleteImageArray = _.without(deleteImageArray, event.target.value);
    }
    console.log('in edit flat, handleImageDeleteCheck, deleteImageArray: ', deleteImageArray);
  }

  uncheckAllImages() {
    //reference: https://stackoverflow.com/questions/18862149/how-to-uncheck-a-checkbox-in-pure-javascript
    deleteImageArray = [];
    console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);

    const ImageDeleteCheckBoxes = document.getElementsByClassName('editFlatImageDeleteCheck');
    // console.log('in edit flat, uncheckAllImages, ImageDeleteCheckBoxes: ', ImageDeleteCheckBoxes);

    _.each(ImageDeleteCheckBoxes, (checkbox) => {
      checkbox.checked = false;
      console.log('in edit flat, uncheckAllImages, in each, checkbox: ', checkbox);
    });
    console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);
  }

  checkAllImages() {
    console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);

    // const ImageDeleteCheckBoxes = document.getElementsByClassName('checkmarkDeleteImage');
    // const ImageDeleteCheckBoxes = document.getElementById('editFlatImageDeleteCheck');
    const ImageDeleteCheckBoxes = document.getElementsByClassName('editFlatImageDeleteCheck');
    // ImageDeleteCheckBoxes.checked = false;
    console.log('in edit flat, uncheckAllImages, ImageDeleteCheckBoxes: ', ImageDeleteCheckBoxes);

    _.each(ImageDeleteCheckBoxes, (checkbox) => {
      checkbox.checked = true;
      console.log('in edit flat, uncheckAllImages, in each, checkbox: ', checkbox.value);
      deleteImageArray.push(checkbox.value)
    });
    console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);
  }

  deleteImageCallback(imageCount) {
    console.log('in edit flat, deleteImageCallback, deleteImageArray: ', deleteImageArray);
    const currentImageCount = imageCount + 1;
    if (currentImageCount <= (deleteImageArray.length - 1)) {
      this.props.deleteImage(deleteImageArray[currentImageCount], currentImageCount, (countCB) => this.deleteImageCallback(countCB));
    } else {
      this.props.history.push(`/editflat/${this.props.flat.id}`);
      deleteImageArray = [];
      this.props.showLoading();
    }
  }

  deleteCheckedImages() {
    this.props.showLoading();
    console.log('in edit flat, deleteCheckedImages, deleteImageArray: ', deleteImageArray);
    const imageArrayEmpty = _.isEmpty(deleteImageArray);
    if (imageArrayEmpty) {
      window.alert('No images checked')
      return;
    }
    let imageCount = 0;

    const deleteConfirm = window.confirm(`Are you sure you want to delete all checked images?`)
    if (deleteConfirm) {
      console.log('in edit flat, deleteCheckedImages, deleteConfirm Yes.');
      // _.each(deleteImageArray, (image) => {
        this.props.deleteImage(deleteImageArray[imageCount], imageCount, (countCB) => this.deleteImageCallback(countCB));
        console.log('in edit flat, deleteCheckedImages, image:', deleteImageArray[imageCount]);
      // });
    } else {
      console.log('in edit flat, deleteCheckedImages, deleteConfirm No.');
    }
  }

  renderDeleteImageButtons() {
    console.log('in edit flat, renderDeleteImageButtons: ');
    return (
      <div>
      <button className="btn btn-danger btn-sm btn-delete-all-images" onClick={this.deleteCheckedImages.bind(this)}>Delete checked images</button>
      <button className="btn btn-secondary btn-sm btn-uncheck-all-images" onClick={this.uncheckAllImages.bind(this)}>Uncheck all images</button>
      <button className="btn btn-primary btn-sm btn-check-all-images" onClick={this.checkAllImages.bind(this)}>Check all images</button>
      </div>
    );
  }

  renderImages(images) {
    console.log('in edit flat, renderImages, images: ', images);
    // reference: https://stackoverflow.com/questions/8877807/how-can-i-display-the-checkbox-over-the-images-for-selection
    const imagesEmpty = _.isEmpty(images);
    if (!imagesEmpty) {
      return (
        _.map(images, (image) => {
          if (image) {
            console.log('in show_flat renderImages, image: ', image.publicid);
            return (
              <div key={image.id} className="slide-show-edit-flat">
              <img src={"http://res.cloudinary.com/chikarao/image/upload/w_165,h_110/" + image.publicid + '.jpg'} />
              <label className="delete-image-radio">
              <input type="checkbox" value={image.id} className="editFlatImageDeleteCheck" onChange={this.handleImageDeleteCheck.bind(this)} />
              <span className="checkmarkDeleteImage"></span>
              </label>
              </div>
            );
          }
        })
      );
    } else {
      return (
        <div className="no-results-message">No image is available for this flat</div>
      );
    }
  }

  handleConfirmCheck(event) {
  // Get the checkbox
    const checkBox = document.getElementById('editFlatConfirmCheck');

    this.setState({ confirmChecked: !this.state.confirmChecked }, () => console.log('in edit flat, myfunction, handleConfirmCheck, this.state.confirmChecked: ', this.state.confirmChecked));
  }

  renderAmenityInput() {
    // <span className="checkmark"></span>
    // <input type="checkbox" className="createFlatAmenityCheckBox"/><i className="fa fa-check fa-lg"></i>
    // get amenities object values of keys
    return _.map(Object.keys(AMENITIES), amenity => {
      return (
        <fieldset key={amenity} className="amenity-input-each col-xs-11 col-sm-3 col-md-3">
          <label className="amenity-radio">{AMENITIES[amenity]}</label>
          <Field name={amenity} component="input" type="checkbox" value="true" className="createFlatAmenityCheckBox" />
        </fieldset>
      );
    })
  }

  handleBackToShowButton() {
    this.props.history.push(`/show/${this.props.match.params.id}`);
  }

  renderMap() {
    if (this.props.flat) {
      //instantiates autocomplete as soon as flat is loaded in state then mapcenter can be set
      // this.handleSearchInput();
      //calling this here gives error InvalidValueError: not an instance of HTMLInputElement
      // so call in componentDidUpdate

      console.log('in show_flat, renderMap, this.props.flat: ', this.props.flat);
      const initialPosition = { lat: this.props.flat.lat, lng: this.props.flat.lng };
      const flatsEmpty = false;
      const flatArray = [this.props.flat];
      const flatArrayMapped = _.mapKeys(flatArray, 'id');

      console.log('in show_flat, renderMap, flatArray: ', flatArray);
      console.log('in show_flat, renderMap, flatArrayMapped: ', flatArrayMapped);

      return (
        <div>
          <GoogleMap
            showFlat
            flatsEmpty={flatsEmpty}
            flats={flatArrayMapped}
            initialPosition={initialPosition}
          />
        </div>
      );
    }
  }

  renderEditForm() {
    const { handleSubmit } = this.props;
    const flatEmpty = _.isEmpty(this.props.flat);
    console.log('in edit flat, renderEditForm, flatEmpty: ', flatEmpty);
    console.log('in edit flat, renderEditForm, this.props.flat: ', this.props.flat);

    if (!flatEmpty) {
      console.log('in edit flat, renderEditForm, this.props: ', this.props);
      return (
        <div>
        <h2 style={{ marginBottom: '30px' }}>Edit Your Listing</h2>
        <h4>Edit Basic Information and Amenities</h4>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Street Address:</label>
            <div className="edit-flat-address">{this.props.flat.address1}</div>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">City:</label>
          <div className="edit-flat-address">{this.props.flat.city}</div>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">State:</label>
            <div className="edit-flat-address">{this.props.flat.state}</div>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Zip:</label>
            <div className="edit-flat-address">{this.props.flat.zip}</div>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Country:</label>
            <div className="edit-flat-address">{this.props.flat.country}</div>
          </fieldset>
          <fieldset>
          <div className="edit-flat-form-message"><span style={{ color: 'red' }}>*</span> Required fields.  If you need to edit the address, please delete the listing and create a new one</div>
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
            <label className="create-flat-form-label">Price Per Month<span style={{ color: 'red' }}>*</span>:</label>
            <Field name="price_per_month" component="input" type="float" className="form-control" />
          </fieldset>
          <fieldset key={'size'} className="form-group">
            <label className="create-flat-form-label">Floor space (sq m )<span style={{ color: 'red' }}>*</span>:</label>
            <Field name="size" component="input" type="integer" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Guests:</label>
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
          <fieldset className="form-group">
            <label className="create-flat-form-label">Sales Point:</label>
            <Field name="sales_point" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Rooms:</label>
            <Field name="rooms" component="select" type="float" className="form-control">
              <option></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5 or more</option>
            </Field>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Beds:</label>
            <Field name="beds" component="select" type="integer" className="form-control">
            <option></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6 or more</option>
            </Field>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">King or Queen Beds:</label>
            <Field name="king_or_queen_bed" component="select" type="integer" className="form-control">
            <option></option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6 or more</option>
            </Field>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Flat Type:</label>
            <Field name="flat_type" component="select" type="string" className="form-control">
              <option></option>
              <option value="flat_in_building">Flat in building</option>
              <option value="single_house">House</option>
              <option value="room_in_house_or_flat">Room in house or flat</option>
              <option value="share_house">Share house</option>
              <option value="mobile_home">Mobile home</option>
            </Field>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Bath:</label>
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
            <label className="create-flat-form-label">Intro:</label>
            <Field name="intro" component="textarea" type="text" className="form-control flat-intro-input" />
          </fieldset>
          <fieldset key={'station'} className="form-group">
            <label className="create-flat-form-label">Nearest Station:</label>
            <Field name="station" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Minutes to Station<span style={{ color: 'red' }}>*</span>:</label>
            <Field name="minutes_to_station" component="select" type="integer" className="form-control">
              <option></option>
              <option value="1">1 minute or less</option>
              <option value="3">Under 3 minutes</option>
              <option value="5">Under 5 minutes</option>
              <option value="7">Under 7 minutes</option>
              <option value="10">Under 10 minutes</option>
              <option value="15">Under 15 minutes</option>
              <option value="16">Over 15 minutes</option>
            </Field>
          </fieldset>
          <fieldset key={'station1'} className="form-group">
            <label className="create-flat-form-label">2nd nearest Station:</label>
            <Field name="station1" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Minutes to Station:</label>
            <Field name="minutes_to_station1" component="select" type="integer" className="form-control">
              <option></option>
              <option value="1">1 minute or less</option>
              <option value="3">Under 3 minutes</option>
              <option value="5">Under 5 minutes</option>
              <option value="7">Under 7 minutes</option>
              <option value="10">Under 10 minutes</option>
              <option value="15">Under 15 minutes</option>
              <option value="16">Over 15 minutes</option>
            </Field>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Cancellation:</label>
            <Field name="cancellation" component="select" type="boolean" className="form-control">
              <option></option>
              <option value={true}>Yes -- see policies for details</option>
              <option value={false}>No</option>
            </Field>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Smoking:</label>
            <Field name="smoking" component="select" type="boolean" className="form-control">
              <option></option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </Field>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Listing ID: </label>
            <span style={{ fontWeight: 'normal', float: 'left' }}>{this.props.flat.id}</span>
          </fieldset>
          <div className="container amenity-input-box">
            <div className="row amenity-row">
              {this.renderAmenityInput()}
            </div>
          </div>
          {this.renderAlert()}
          <div className="confirm-change-and-button">
            <label className="confirm-radio"><i className="fa fa-check fa-lg"></i>  Confirm above changes then submit
              <input type="checkbox" id="editFlatConfirmCheck" value={this.state.confirmChecked} onChange={this.handleConfirmCheck.bind(this)} />
              <span className="checkmark"></span>
            </label>
            <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">Submit</button>
          </div>
        </form>
        <h4>Add or Delete Photos  <small>({this.props.flat.images.length} images, max: {MAX_NUM_FILES}{this.props.flat.images.length < MAX_NUM_FILES ? '' : ', Please delete images to add'})</small></h4>
        <div className="edit-flat-image-box">
          <div id="carousel-show-edit-flat">
            {this.renderImages(this.props.flat.images)}
          </div>
          <div className="delete-image-buttons">
            {this.renderDeleteImageButtons()}
          </div>
        </div>
        <div>
          {this.props.flat.images.length < MAX_NUM_FILES ?
            <Upload
            flatId={this.props.flat.id}
            flat={this.props.flat}
            /> :
            ''
          }
        </div>
        <h4>Add or Delete Convenient Places Near Your Flat</h4>
        <div>
            <div className="container" id="map">
              {this.renderMap()}
            </div>
              <MapInteraction
                flat={this.props.flat}
                places={this.props.flat.places}
                currentUserIsOwner={this.currentUserIsOwner()}
              />
        </div>
          <div className="back-button">
            <button className="btn btn-primary btn-lg to-show-btn" onClick={this.handleBackToShowButton.bind(this)}>To Show Page</button>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
      {this.renderEditForm()}
      </div>
    );
  }
}

EditFlat = reduxForm({
  form: 'EditFlat'
})(EditFlat);

// !!!!!!!!!! REQUIRES SPECIAL mapStateToProps TO ADDRESS AMENITIES!!!!!!!!!!
// need initialValues object with flat attributes and amenty attributes on the same level
// so iterate through flat object and if amenity, then put into initialValueObj
// and return
function getInitialValueObject(flat) {
  const initialValueObj = {};
  // console.log('in edit_flat, getInitialValueObject: ', flat);
  // Need to have amenity for flat to get initial value
  if (flat.amenity) {
    _.each(Object.keys(flat), key => {
      if (key === 'amenity') {
        // console.log('in edit_flat, getInitialValueObject, if key === amenity, flat[key]: ', flat[key]);
        const amenities = flat[key];
        _.each(Object.keys(amenities), k => {
          // console.log('in edit_flat, getInitialValueObject, if key === amenity, each amenities[k]: ', amenities[k]);
          initialValueObj[k] = amenities[k];
        });
      } else {
        // console.log('in edit_flat, getInitialValueObject, else, flat[key]: ', flat[key]);
        // console.log('in edit_flat, getInitialValueObject, else, key: ', key);
        initialValueObj[key] = flat[key];
      }
    });
    // console.log('in edit_flat, getInitialValueObject, initialValueObj: ', initialValueObj);
    return initialValueObj;
  }
}

// !!!!!! initialValues required for redux form to prepopulate fields
// need to have flat and amenity props for initialvalues to work
// BUT when calling for flat ovject, .amenity is called on undefined obj
// unless call it conditionally when there is flat
// mapStateToProps needs an object returned even without flat, so return empty {}
function mapStateToProps(state) {
  const flat = state.selectedFlatFromParams.selectedFlatFromParams;
  let initialValues = {};
  if (flat) {
    initialValues = getInitialValueObject(flat)
    // console.log('in edit_flat, mapStateToProps, getInitialValueObject(flat): ', getInitialValueObject(flat));
    // console.log('in edit_flat, mapStateToProps, flat: ', flat);
    // console.log('in edit_flat, mapStateToProps, flat: ', flat);
    // console.log('in edit_flat, mapStateToProps, initialValues: ', initialValues);
    return {
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
      amenity: state.selectedFlatFromParams.selectedFlatFromParams.amenity,
      auth: state.auth,
      places: state.places.places,
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
      initialValues
    };
  } else {
    return {};
  }
}

export default connect(mapStateToProps, actions)(EditFlat);
