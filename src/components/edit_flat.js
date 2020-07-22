import React, { Component } from 'react';

import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';

import * as actions from '../actions';

// import Upload from './images/upload';
import UploadForFlat from './images/upload_for_flat';
import Amenities from './constants/amenities';
import GoogleMap from './maps/google_map';
import MapInteraction from './maps/map_interaction';
import globalConstants from './constants/global_constants';
import Languages from './constants/languages';
import LanguageCreateModal from './modals/language_create_modal';
import LanguageEditModal from './modals/language_edit_modal';
import IcalendarCreateModal from './modals/icalendar_create_modal';
import IcalendarEditModal from './modals/icalendar_edit_modal';
import BuildingEditModal from './modals/building_edit_modal';
import BuildingCreateModal from './modals/building_create_modal';
import FacilityEditModal from './modals/facility_edit_modal';
import FacilityCreateModal from './modals/facility_create_modal';
import InspectionCreateModal from './modals/inspection_create_modal';
import InspectionEditModal from './modals/inspection_edit_modal';
import BuildingLanguageEditModal from './modals/building_language_edit_modal';
import BuildingLanguageCreateModal from './modals/building_language_create_modal';
import AppLanguages from './constants/app_languages';
import GmStyle from './maps/gm-style';
import RentPayment from './constants/rent_payment';
import FormChoices from './forms/form_choices';
import Facility from './constants/facility';
import Ellipsis from './shared_misc/ellipsis';
import flatFormObject from './forms/flat_form_object';

let deleteImageArray = [];
const AMENITIES = Amenities;
const MAX_NUM_FILES = globalConstants.maxNumImages;
const RESIZE_BREAK_POINT = globalConstants.resizeBreakPoint;
// !!!! Took out DOM: { input ....} on React and react-dom 16.2 upgrade
// const { DOM: { input, select, textarea } } = React;

class EditFlat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // confirmChecked: false
      confirmChecked: false,
      selectedLanguageCode: '',
      windowWidth: window.innerWidth,
      lastPanel: ''
    };

    this.deleteCheckedImages = this.deleteCheckedImages.bind(this);
    this.uncheckAllImages = this.uncheckAllImages.bind(this);
    this.checkAllImages = this.checkAllImages.bind(this);
    this.handleImageDeleteCheck = this.handleImageDeleteCheck.bind(this);
    this.handleEditLanguageClick = this.handleEditLanguageClick.bind(this);
    this.handleEditIcalendarClick = this.handleEditIcalendarClick.bind(this);
    this.handleAddLanguageClick = this.handleAddLanguageClick.bind(this);
    this.handleAddIcalendarClick = this.handleAddIcalendarClick.bind(this);
    this.handleAssignEditBuildingClick = this.handleAssignEditBuildingClick.bind(this);
    this.handleAddEditInspectionClick = this.handleAddEditInspectionClick.bind(this);
    this.handleAddEditBuildingLanguageClick = this.handleAddEditBuildingLanguageClick.bind(this);
    this.handleBankAcccountDefaultCheck = this.handleBankAcccountDefaultCheck.bind(this);
    this.handlePaymentMethodFormSubmit = this.handlePaymentMethodFormSubmit.bind(this);
    this.handleAddEditFacilityClick = this.handleAddEditFacilityClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleConfirmCheck = this.handleConfirmCheck.bind(this);
    this.handleBackToShowButton = this.handleBackToShowButton.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
// reference for checkbox
//https://www.w3schools.com/howto/howto_css_custom_checkbox.asp

  componentDidMount() {
    // console.log('in edit flat, componentDidMount, this.props.match.params:', this.props.match.params);
    // gets flat id from params set in click of main_cards or infowindow detail click
    this.props.selectedFlatFromParams(this.props.match.params.id, () => {
      this.selectedFlatFromParamsCallback();
    });
    this.props.getCurrentUser();
    this.props.fetchBankAccountsByUser();
    this.props.getGoogleMapBoundsKeys();
    window.addEventListener('resize', this.handleResize);
    // this.props.fetchPlaces(this.props.match.params.id);

    // console.log('in edit flat, componentDidMount, this.state.handleConfirmCheck: ', this.state.confirmChecked);
    // if (this.props.flat) {
      // console.log('in edit flat, componentDidMount, editFlatLoad called');
    //   this.props.editFlatLoad(this.props.flat);
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('in edit flat, componentDidUpdate, prevState, this.state: ', prevState, this.state);

  }

  componentWillUnmount() {
    // remove event listeners when closing page or unmounting
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('click', this.choiceEllipsisCloseClick);
  }

  handleResize() {
    this.setState({ windowWidth: window.innerWidth });
  }

  selectedFlatFromParamsCallback() {
    // console.log('in edit flat, selectedFlatFromParamsCallback, this.props.flat: ', this.props.flat);
    if (this.props.flat) {
      if (!this.props.flat.building) {
        this.props.searchBuildings({ address1: this.props.flat.address1, city: this.props.flat.city });
      }
    }
  }

  currentUserIsOwner() {
    if (this.props.auth && this.props.flat) {
      // console.log('in editFlat, currentUserIsOwner, this.props.auth.id == this.props.flat.user_id : ', this.props.auth.id == this.props.flat.user_id);
      return (this.props.auth.id == this.props.flat.user_id);
      // return true;
      // return false;
    }
  }


  separateFlatAndAmenities(data) {
    const amenityObj = { flat: { user_id: this.props.flat.user_id }, amenity: { basic: true } }
    // populage flat and amenity object with something to avoid empty params error on the API
    // console.log('in editFlat, separateFlatAndAmenities, data : ', data);
     _.each(Object.keys(data), (key) => {
    // return _.map(AMENITIES, (amenity) => {
      if (AMENITIES[key]) {
        // console.log('in editFlat, separateFlatAndAmenities, key, AMENITIES[key] : ', key, AMENITIES[key]);
        // console.log('in editFlat, separateFlatAndAmenities, key : ', key);
        // console.log('in editFlat, separateFlatAndAmenities, key : ', key);
        amenityObj.amenity[key] = data[key];
      } else {
        amenityObj.flat[key] = data[key];
      }
    });
      amenityObj.flat_id = this.props.flat.id;
      // amenityObj.amenity.id = this.props.flat.amenity.id;
    // console.log('in editFlat, separateFlatAndAmenities, amenityObj : ', amenityObj);
    return amenityObj;
  }

  getDelta(data) {
    const delta = {}
    _.each(Object.keys(data), each => {
      // console.log('in edit flat, handleFormSubmit, each, data[each], this.props.initialValues[each]: ', each, data[each], this.props.initialValues[each]);
      if (data[each] !== this.props.initialValues[each]) {
        // console.log('in edit flat, getDelta, each: ', each);
        delta[each] = data[each];
      }
    });
    return delta;
  }

  handleFormSubmit(data) {
    // console.log('in edit flat, handleFormSubmit, data: ', data);
    // console.log('in edit flat, handleFormSubmit, this.props.initialValues: ', this.props.initialValues);
    const delta = this.getDelta(data);
    // console.log('in edit flat, handleFormSubmit, delta: ', delta);

    if (this.state.confirmChecked) {
      const dataSeparated = this.separateFlatAndAmenities(delta);
      this.props.editFlat(dataSeparated, (id) => this.editFlatCallback(id));
      this.props.showLoading();
    } else {
      // console.log('in edit flat, handleFormSubmit, checkbox not checked: ');
      window.alert('Please check box to confirm your inputs then push submit')
    }
  }

  editFlatCallback(id) {
    // console.log('in edit flat, editFlatCallback, id: ', id);
    // this.props.history.push(`/editflat/${id}`);
    //for some reason, history.push does not update the default values in fields
    // reload page; fetches new flat data
    this.setState({ confirmChecked: false }, () => {
      this.props.showLoading();
    });
    // document.location.reload()
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
    // console.log('in edit flat, handleImageDeleteCheck, event.target: ', event.target.value);
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
    // console.log('in edit flat, handleImageDeleteCheck, deleteImageArray: ', deleteImageArray);
  }

  uncheckAllImages() {
    //reference: https://stackoverflow.com/questions/18862149/how-to-uncheck-a-checkbox-in-pure-javascript
    deleteImageArray = [];
    // console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);

    const ImageDeleteCheckBoxes = document.getElementsByClassName('editFlatImageDeleteCheck');
    // console.log('in edit flat, uncheckAllImages, ImageDeleteCheckBoxes: ', ImageDeleteCheckBoxes);

    _.each(ImageDeleteCheckBoxes, (checkbox) => {
      checkbox.checked = false;
      // console.log('in edit flat, uncheckAllImages, in each, checkbox: ', checkbox);
    });
    // console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);
  }

  checkAllImages() {
    // console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);

    // const ImageDeleteCheckBoxes = document.getElementsByClassName('checkmarkDeleteImage');
    // const ImageDeleteCheckBoxes = document.getElementById('editFlatImageDeleteCheck');
    const ImageDeleteCheckBoxes = document.getElementsByClassName('editFlatImageDeleteCheck');
    // ImageDeleteCheckBoxes.checked = false;
    // console.log('in edit flat, uncheckAllImages, ImageDeleteCheckBoxes: ', ImageDeleteCheckBoxes);

    _.each(ImageDeleteCheckBoxes, (checkbox) => {
      checkbox.checked = true;
      // console.log('in edit flat, uncheckAllImages, in each, checkbox: ', checkbox.value);
      deleteImageArray.push(checkbox.value)
    });
    // console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);
  }

  deleteImageCallback(imageCount) {
    // console.log('in edit flat, deleteImageCallback, deleteImageArray: ', deleteImageArray);
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
    // console.log('in edit flat, deleteCheckedImages, deleteImageArray: ', deleteImageArray);
    const imageArrayEmpty = _.isEmpty(deleteImageArray);
    if (imageArrayEmpty) {
      window.alert('No images checked')
      return;
    }
    let imageCount = 0;

    if (!imageArrayEmpty) {
      const deleteConfirm = window.confirm(`Are you sure you want to delete all checked images?`)
      if (deleteConfirm) {
        this.props.showLoading();
        // console.log('in edit flat, deleteCheckedImages, deleteConfirm Yes.');
        // _.each(deleteImageArray, (image) => {
        this.props.deleteImage(deleteImageArray[imageCount], imageCount, (countCB) => this.deleteImageCallback(countCB));
        // console.log('in edit flat, deleteCheckedImages, image:', deleteImageArray[imageCount]);
        // });
      } else {
        // console.log('in edit flat, deleteCheckedImages, deleteConfirm No.');
      }
    }
  }

  renderDeleteImageButtons() {
    // console.log('in edit flat, renderDeleteImageButtons: ');
    return (
      <div>
        <button className="btn btn-danger btn-sm btn-delete-all-images" onClick={this.deleteCheckedImages}>{AppLanguages.deleteCheckedImages[this.props.appLanguageCode]}</button>
        <button className="btn btn-secondary btn-sm btn-uncheck-all-images" onClick={this.uncheckAllImages}>{AppLanguages.uncheckAllImages[this.props.appLanguageCode]}</button>
        <button className="btn btn-primary btn-sm btn-check-all-images" onClick={this.checkAllImages}>{AppLanguages.checkAllImages[this.props.appLanguageCode]}</button>
      </div>
    );
  }

  renderImages(images) {
    // console.log('in edit flat, renderImages, images: ', images);
    // reference: https://stackoverflow.com/questions/8877807/how-can-i-display-the-checkbox-over-the-images-for-selection
    const imagesEmpty = _.isEmpty(images);
    if (!imagesEmpty) {
      return (
        _.map(images, (image) => {
          if (image) {
            // console.log('in show_flat renderImages, image: ', image.publicid);
            return (
              <div key={image.id} className="slide-show-edit-flat">
                <img src={"http://res.cloudinary.com/chikarao/image/upload/w_165,h_110/" + image.publicid + '.jpg'} />
                <label className="delete-image-radio">
                <input type="checkbox" value={image.id} className="editFlatImageDeleteCheck" onChange={this.handleImageDeleteCheck} />
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

    this.setState({ confirmChecked: !this.state.confirmChecked }, () => {});
  }

  renderAmenityInput() {
    // <span className="checkmark"></span>
    // <input type="checkbox" className="createFlatAmenityCheckBox"/><i className="fa fa-check fa-lg"></i>
    // get amenities object values of keys
    return _.map(Object.keys(AMENITIES), amenity => {
      // console.log('in show_flat, renderAmenityInput, amenity: ', amenity);
      return (
        <fieldset key={amenity} className="amenity-input-each col-xs-11 col-sm-3 col-md-3">
          <label className="amenity-radio">{AMENITIES[amenity][this.props.appLanguageCode]}</label>
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

      // console.log('in show_flat, renderMap, this.props.flat: ', this.props.flat);
      const initialPosition = { lat: this.props.flat.lat, lng: this.props.flat.lng };
      const flatsEmpty = false;
      const flatArray = [this.props.flat];
      const flatArrayMapped = _.mapKeys(flatArray, 'id');

      console.log('in edit_flat, renderMap, flatArray, initialPosition: ', flatArray, initialPosition);
      console.log('in edit_flat, renderMap, flatArrayMapped: ', flatArrayMapped);

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

  getSelectedLanguage(languageCode) {
    // console.log('in show_flat, getSelectedLanguage, languageCode: ', languageCode);
    const array = []
    _.each(this.props.flat.flat_languages, language => {
      if (language.language_code == languageCode) {
        array.push(language);
      }
    });
    return array[0];
  }

  handleEditLanguageClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // console.log('in show_flat, handleEditLanguageClick, elementVal: ', elementVal);
    this.props.showLanguageEditModal();
    // this.setState({ selectedLanguageCode: elementVal });
    const selectedLanguage = this.getSelectedLanguage(elementVal);
    this.props.selectedLanguage(selectedLanguage);
  }

  handleEditIcalendarClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // console.log('in show_flat, handleEditIcalendarClick, elementVal: ', elementVal);
    this.props.showIcalendarEditModal();
    // this.setState({ selectedLanguageCode: elementVal });
    this.props.selectedIcalendarId(elementVal);
  }

  renderAvailableLanguages() {
    return _.map(this.props.flat.flat_languages, language => {
      return (
        <div key={language.id} className="edit-flat-each-available-language col-xs-6 col-sm-6 col-md-4">
          {Languages[language.language_code].flag} {Languages[language.language_code].name}
          <div value={language.language_code} className="edit-flat-each-available-language-edit-link" onClick={this.handleEditLanguageClick}>{AppLanguages.edit[this.props.appLanguageCode]}</div>
        </div>
      );
    })
  }

  handleAddLanguageClick() {
    // console.log('in show_flat, handleAddLanguageClick: ');
    this.props.showLanguageCreateModal();
  }

  renderAvailableICalendars() {
    return _.map(this.props.flat.calendars, calendar => {
      return (
        <div key={calendar.id} className="edit-flat-each-available-icalendar col-xs-6 col-sm-6 col-md-4">
         {calendar.name}
         <div value={calendar.id} className="edit-flat-each-available-icalendar-edit-link" onClick={this.handleEditIcalendarClick}>{AppLanguages.edit[this.props.appLanguageCode]}</div>
        </div>
      );
    })
  }

  handleAddIcalendarClick() {
    this.props.showIcalendarCreateModal();
  }

  renderLanguages() {
    return (
      <div className="edit-flat-language-box">
        <div className="edit-flat-base-language-box">{AppLanguages.baseLanguage[this.props.appLanguageCode]}: {Languages[this.props.flat.language_code].flag}<span style={{ fontStyle: 'italic' }}> {Languages[this.props.flat.language_code].name}</span></div>
        <div className="edit-flat-available-language-box">
          <h5>{AppLanguages.availableLanguages[this.props.appLanguageCode]}</h5>
          {this.props.flat.flat_languages.length > 0 ?
            <div className="edit-flat-available-languages-box-container container">
              <div className="edit-flat-available-languages-box-row row">
                {this.renderAvailableLanguages()}
              </div>
            </div>
            : <div style={{ margin: '15px auto 25px auto' }}>{AppLanguages.noOtherLanguages[this.props.appLanguageCode]}</div> }
        </div>
        <div className="edit-flat-language-add-link" onClick={this.handleAddLanguageClick}>{AppLanguages.addAnotherLanguage[this.props.appLanguageCode]}</div>
      </div>
    );
  }

  renderIcalendarAddEdit() {
    return (
      <div className="edit-flat-language-box">
        <div className="edit-flat-available-language-box">
          <h5>{AppLanguages.addedIcalendars[this.props.appLanguageCode]}</h5>
          {this.props.flat.calendars.length > 0 ?
            <div className="edit-flat-available-languages-box-container container">
              <div className="edit-flat-available-languages-box-row row">
                {this.renderAvailableICalendars()}
              </div>
            </div>
            : <div style={{ margin: '15px auto 25px auto' }}>{AppLanguages.noIcalendarsAdded[this.props.appLanguageCode]}</div> }
        </div>
        {this.props.flat.calendars.length > 0 ?
          <div className="edit-flat-language-add-link" onClick={this.handleAddIcalendarClick}>{AppLanguages.addAnotherICalendar[this.props.appLanguageCode]}</div>
          :
          <div className="edit-flat-language-add-link" onClick={this.handleAddIcalendarClick}>{AppLanguages.addAnICalendar[this.props.appLanguageCode]}</div> }

      </div>
    );
  }

  handleAssignEditBuildingClick(event) {
    const clickedElement = event.target;
    // console.log('in edit flat, handleAssignEditBuildingClick, clickedElement: ', clickedElement);
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');
    // console.log('in edit flat, handleAssignEditBuildingClick, elementVal: ', elementVal);
    if (elementName == 'add') {
      this.props.editFlat({ flat_id: this.props.flat.id, flat: { building_id: elementVal }, amenity: { basic: true } }, () => {});
    }

    if (elementName == 'edit') {
      this.props.showBuildingEditModal();
    }

    if (elementName == 'create') {
      this.props.showBuildingCreateModal();
    }
  }

  renderEachBuildingChoice() {
    return _.map(this.props.buildings, eachBuilding => {
      return (
        <div key={eachBuilding.name} className="edit-flat-building-choice">
          {eachBuilding.name}{eachBuilding.name ? ', ' : ''} {eachBuilding.address1}, {eachBuilding.city}, {eachBuilding.state}
          <div value={eachBuilding.id} name="add" className="edit-flat-building-add-link" onClick={this.handleAssignEditBuildingClick}>{AppLanguages.yesAssignThisBuilding[this.props.appLanguageCode]}</div>
        </div>
      );
    });
  }

  handleAddEditInspectionClick(event) {
    const clickedElement = event.target;
    const elementName = clickedElement.getAttribute('name')
    // elementVal is insection.id
    const elementVal = clickedElement.getAttribute('value')
    if (elementName == 'edit') {
      this.props.showInspectionEditModal();
      this.props.selectedInspectionId(elementVal);
    }
    if (elementName == 'add') {
      this.props.showInspectionCreateModal();
    }
  }

  formatDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes}  ${ampm}`;
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  }

  getInspection(building) {
    // placeholder for when add lanauge
    const array = [];
      _.each(building.inspections, eachInspection => {
        // console.log('in edit flat, getInspection, eachInspection: ', eachInspection);
        array.push(eachInspection);
      });

    return array[0];
  }

  renderEachInspection() {
    const { inspections } = this.props.flat.building;
    return _.map(inspections, (eachInspection, i) => {
      return (
        <div key={i} className="edit-flat-inspection-each">
          {this.formatDate(new Date(eachInspection.inspection_date))}
           &nbsp;
          {Languages[eachInspection.inspection_language].flag}{Languages[eachInspection.inspection_language].local}
          &nbsp;
          <div value={eachInspection.id} name="edit" className="edit-flat-inspection-each-edit-link" onClick={this.handleAddEditInspectionClick}>{AppLanguages.edit[this.props.appLanguageCode]}</div>
        </div>
      );
    });
  }

  handleAddEditBuildingLanguageClick(event) {
    const clickedElement = event.target;
    // buildingLanguage.id when edit and building.id when add
    const elementVal = clickedElement.getAttribute('value');
    // add or edit
    const elementName = clickedElement.getAttribute('name');

    if (elementName == 'edit') {
      this.props.selectedBuildingLanguageId(elementVal);
      this.props.showBuildingLanguageEditModal();
    }

    if (elementName == 'add') {
      this.props.showBuildingLanguageCreateModal();
      this.props.selectedBuildingId(elementVal);
    }
  }

  renderEachBuildingLanguage() {
    const { building_languages } = this.props.flat.building;
    return _.map(building_languages, (eachBuildingLanguage, i) => {
      return (
        <div key={i} className="edit-flat-inspection-each">
          {Languages[eachBuildingLanguage.language_code].flag}{Languages[eachBuildingLanguage.language_code].name}
          &nbsp;
          <div value={eachBuildingLanguage.id} name="edit" className="edit-flat-inspection-each-edit-link" onClick={this.handleAddEditBuildingLanguageClick}>{AppLanguages.edit[this.props.appLanguageCode]}</div>
        </div>
      );
    });
  }

  renderBuilding(building) {
    const inspection = building.inspections ? this.getInspection(building) : '';
    // console.log('in edit flat, renderBuilding, inspection: ', inspection);
    if (building) {
      return (
        <div key={building.name} className="edit-flat-building-choice">
            {building.name}{building.name ? ', ' : ''} {building.address1}, {building.city}, {building.state}, {building.country} &nbsp; Language: {Languages[building.language_code].flag}
          <div value={building.id} name="edit" className="edit-flat-building-add-link" onClick={this.handleAssignEditBuildingClick}>{AppLanguages.editBuilding[this.props.appLanguageCode]}</div>

          {building.building_languages && (building.building_languages.length > 0) ?
            <div className="edit-flat-inspection-box">{AppLanguages.otherLanguages[this.props.appLanguageCode]}: {this.renderEachBuildingLanguage()}</div>
            :
            <div>No Other Building Languages</div>
          }
          <div value={building.id} name="add" className="edit-flat-building-add-link" onClick={this.handleAddEditBuildingLanguageClick}>{AppLanguages.addBuildingLanguage[this.props.appLanguageCode]}</div>

          {building.inspections && (building.inspections.length > 0) ?
            <div className="edit-flat-inspection-box">{AppLanguages.inspections[this.props.appLanguageCode]}: {this.renderEachInspection()}</div>
            :
            <div>No Inspection Information</div>
          }
          <div value={building.id} name="add" className="edit-flat-building-add-link" onClick={this.handleAddEditInspectionClick}>{AppLanguages.addInspection[this.props.appLanguageCode]}</div>
        </div>
      );
    }
  }

  renderBuildingAddEdit() {
    // if (this.props.flat) {
    //   if (!this.props.flat.building && !this.props.buildings) {
    //     // search buildings if flat has no building assigned or flat.buildings is null
    //     this.props.searchBuildings({ address1: this.props.flat.address1 });
    //   }
      if (!this.props.flat.building && this.props.buildings.length > 0) {
        // console.log('in edit flat, renderBuildingAddEdit, this.props.buildings: ', this.props.buildings);
        return (
          <div className="edit-flat-language-box">
            <div>No building has been identified for your listing. <br/>Is one of these buildings for your listing?</div>
            <div className="edit-flat-building-choice-scroll-box" style={this.props.buildings.length > 1 ? { height: '170px' } : { height: '85px'}}>
                {this.renderEachBuildingChoice()}
            </div>
            <div value={this.props.flat.id} name="create" className="edit-flat-building-add-link" onClick={this.handleAssignEditBuildingClick}>{AppLanguages.noAddMyBuilding[this.props.appLanguageCode]}</div>
          </div>
        );
      }

      if (!this.props.flat.building && !this.props.buildings.length > 0) {
        // console.log('in edit flat, renderBuildingAddEdit, this.props.buildings: ', this.props.buildings);
        return (
          <div className="edit-flat-language-box">
            <div value={this.props.flat.id} name="create" className="edit-flat-building-add-link" onClick={this.handleAssignEditBuildingClick}>{AppLanguages.addMyBuilding[this.props.appLanguageCode]}</div>
          </div>
        );
      }

      if (this.props.flat.building) {
        // console.log('in edit flat, renderBuildingAddEdit, this.props.flat.building: ', this.props.flat.building);
        return (
          <div className="edit-flat-language-box">
          <div>Here is your building information</div>
          {this.renderBuilding(this.props.flat.building)}
          </div>
        );
      }
    // }
    // end of if this.props.flat
  }

  handleBankAcccountDefaultCheck(event) {
    const checkedElement = event.target;
    const elementVal = checkedElement.getAttribute('value');
    // console.log('in edit flat, handleBankAcccountDefaultCheck, elementVal: ', elementVal);
    this.props.showLoading();
    this.props.editFlat({ flat_id: this.props.flat.id, flat: { bank_account_id: elementVal }, amenity: { basic: true } }, () => this.handleBankAcccountDefaultCheckCallback())
  }

  handleBankAcccountDefaultCheckCallback() {
    this.props.showLoading();
  }

  renderEachBankAccountChoice() {
    if (this.props.flat) {
      const bankAccountsArray = this.props.bankAccounts;
      if (this.props.flat.bank_account && this.props.bankAccounts.length > 0) {
        //get index of flat bank account id
        // move index to top
        // console.log('in edit flat, renderEachBankAccountChoice, this.props.bankAccounts: ', this.props.bankAccounts);
        // console.log('in edit flat, renderEachBankAccountChoice, this.props.flat.bank_account: ', this.props.flat.bank_account);
        let index;
        _.each(this.props.bankAccounts, (each, i) => {
          // console.log('in edit flat, renderEachBankAccountChoice, this.props.bankAccounts, each: ', each);
          if (each.id == this.props.flat.bank_account.id) {
            index = i;
          }
        });
        // take out one checked bank account from array at index
        const selectedBankAccount = bankAccountsArray.splice(index, 1)
        // insert one account at index 0 (take out 0); splice take out returns an array
        bankAccountsArray.splice(0, 0, selectedBankAccount[0]);
        // console.log('in edit flat, renderEachBankAccountChoice, bankAccountsArray: ', bankAccountsArray);
      }

      return _.map(bankAccountsArray, (eachAccount, i) => {
        // console.log('in edit flat, renderEachBankAccountChoice, eachAccount.id: ', eachAccount.id);
        // check if this account is the flat.bank_account, if so check off
        const isThisAccountDefault = this.props.flat.bank_account ? (this.props.flat.bank_account.id == eachAccount.id) : false;
        return (
          <div key={i} className="edit-flat-building-choice">
            {eachAccount.bank_name} {eachAccount.account_name} <br/>{AppLanguages[eachAccount.account_type][this.props.appLanguageCode]} {eachAccount.account_number}***&ensp;&ensp;
            <input name={i} value={eachAccount.id} type="checkbox" checked={isThisAccountDefault} className="my-page-card-default-checkbox" onChange={this.handleBankAcccountDefaultCheck} />
          </div>
        );
      });
    }
  }

  renderSelectBankAccount() {
    // console.log('in edit flat, renderSelectBankAccount, this.props.bankAccounts: ', this.props.bankAccounts);
    if (!this.props.bankAccounts) {
      return (
        <div className="edit-flat-language-box">
          <div>You have not registered any bank accounts. <br/>Add your bank account on My Page</div>
        </div>
      );
    }

    if (this.props.flat.bank_account || (this.props.flat.rent_payment_method == 'bank_transfer')) {
      return (
        <div className="edit-flat-language-box">
          <div>{AppLanguages.selectBankAccountMessage[this.props.appLanguageCode]}</div>
          <div className="edit-flat-building-choice-scroll-box">
            {this.renderEachBankAccountChoice()}
          </div>
        </div>
      );
    }
  }

  handlePaymentMethodFormSubmit(data) {
    let dataToBeSent = {};
    if (data.rent_payment_method == 'bank_tranfer') {
      const delta = this.getDelta(data);
      dataToBeSent = { flat_id: this.props.flat.id, flat: delta, amenity: { basic: true } };
    } else {
      const dataToBeChanged = data;
      dataToBeChanged.bank_account_id = null;
      const delta = this.getDelta(dataToBeChanged);
      dataToBeSent = { flat_id: this.props.flat.id, flat: delta, amenity: { basic: true } };
    }
    // dataToBeSent.flat_id = this.props.flat.id;
    // console.log('in BankAccountCreateModal, handlePaymentMethodFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.editFlat(dataToBeSent, () => {
      this.handlePaymentMethodFormSubmitCallback();
    });
  }

  handlePaymentMethodFormSubmitCallback() {
    this.props.showLoading();
  }

  renderEachRentPaymentMethodField() {
    return _.map(RentPayment, formField => {
      return (
        <div key={formField.name}>
          <h5>{formField[this.props.appLanguageCode]}</h5>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={FormChoices}
            // pass model rentpayment object
            props={{ model: RentPayment }}
            // props={fieldComponent == FormChoices ? { model: RentPayment } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </div>
      );
    });
  }

  renderRentPaymentMethod() {
    const { handleSubmit } = this.props;
    // const formField = RentPayment.rent_payment_method;
    return (
      <div>
        {this.renderAlert()}
        <form onSubmit={handleSubmit(this.handlePaymentMethodFormSubmit)}>
          {this.renderEachRentPaymentMethodField()}
          <div className="confirm-change-and-button">
            <button action="submit" id="submit-all" className="btn btn-primary btn-sm submit-button">Submit</button>
          </div>
        </form>
      </div>
    )
  }

  handleAddEditFacilityClick(event) {
    // console.log('in edit flat, handleAddEditFacilityClick: ');
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');

    if (elementName == 'add') {
      this.props.showFacilityCreateModal();
    }

    if (elementName == 'edit') {
      this.props.showFacilityEditModal();
      this.props.selectedFacilityId(elementVal);
    }
  }

  getFacilityType(facility) {
    let choice = {}
    // console.log('in edit flat, getFacilityType facility: ', facility);
    // console.log('in edit flat, getFacilityType Facility: ', Facility);
    // console.log('in edit flat, getFacilityType Facility[facility.facility_type]: ', Facility.facility_type);
    _.each(Facility.facility_type.choices, eachChoice => {
      if (eachChoice.value == facility.facility_type) {
        choice = eachChoice;
      }
    });
    return choice[this.props.appLanguageCode];
  }

  renderEachFacility() {
    // console.log('in edit flat, renderEachFacility this.props.flat.facilities: ', this.props.flat.facilities);
    // <input name={i} value={eachFacility.id} type="checkbox" className="my-page-card-default-checkbox" onChange={this.handleBankAcccountDefaultCheck.bind(this)} />
    return _.map(this.props.flat.facilities, (eachFacility, i) => {
      return (
        <div key={i} className="edit-flat-building-choice">
        {this.getFacilityType(eachFacility)}  &nbsp;{eachFacility.facility_number ? eachFacility.facility_number : ''} &nbsp;¥{eachFacility.price_per_month} /{AppLanguages.month[this.props.appLanguageCode]}  &nbsp; {eachFacility.optional ? AppLanguages.optional[this.props.appLanguageCode] : AppLanguages.notOptional[this.props.appLanguageCode]}
        <div name="edit" value={eachFacility.id} name="edit" className="edit-flat-building-add-link" onClick={this.handleAddEditFacilityClick}>{AppLanguages.edit[this.props.appLanguageCode]}</div>
        </div>
      );
    });
  }

  renderFacilitiesAddEdit() {
    // console.log('in edit flat, renderFacilitiesAddEdit');
    if (this.props.flat) {
      if (!this.props.flat.facilities) {
        return (
          <div className="edit-flat-language-box">
            <div>Add or Edit Facilities (parking for cars, bicycles, motorcycles, external storage etc.)</div>
              <div style={{ margin: '20px 0 20px 0' }}>No Facilities to List</div>
            <div name="add" className="edit-flat-language-add-link" onClick={this.handleAddEditFacilityClick}>{AppLanguages.addAFacility[this.props.appLanguageCode]}</div>
          </div>
        );
      }

      if (this.props.flat.facilities) {
        return (
          <div className="edit-flat-language-box">
            <div>Add or Edit Facilities (parking for bicycles, motorcycles, storage)</div>
              <div className="edit-flat-building-choice-scroll-box" style={{ height: `${this.props.flat.facilities.length * 85}px !important` }}>
                {this.renderEachFacility()}
              </div>
            <div name="add" className="edit-flat-language-add-link" onClick={this.handleAddEditFacilityClick}>{AppLanguages.addAFacility[this.props.appLanguageCode]}</div>
          </div>
        );
      }
    }
  }

  // renderOwnerFields() {
  //   // if (this.props.flat.owner_name != 'user') {
  //     return (
  //       <div>
  //         <fieldset key={'owner_name'} className="form-group">
  //           <label className="create-flat-form-label">Owner Name:</label>
  //           <Field name="owner_name" component="input" type="string" className="form-control" />
  //         </fieldset>
  //         <fieldset className="form-group">
  //           <div style={{ float: 'left', paddingLeft: '20px', fontStyle: 'italic' }}><span style={{ color: 'red' }}>*</span>{AppLanguages.ifOwnerDifferent[this.props.appLanguageCode]}</div>
  //         </fieldset>
  //         <fieldset key={'owner_contact_name'} className="form-group">
  //           <label className="create-flat-form-label">Owner Contact Name:</label>
  //           <Field name="owner_contact_name" component="input" type="string" className="form-control" />
  //         </fieldset>
  //         <fieldset key={'owner_address'} className="form-group">
  //           <label className="create-flat-form-label">Owner Address:</label>
  //           <Field name="owner_address" component="input" type="string" className="form-control" />
  //         </fieldset>
  //         <fieldset key={'owner_phone'} className="form-group">
  //           <label className="create-flat-form-label">Owner Phone:</label>
  //           <Field name="owner_phone" component="input" type="string" className="form-control" />
  //         </fieldset>
  //         <fieldset key={'ownership_rights'} className="form-group">
  //           <label className="create-flat-form-label">Ownership Rights:</label>
  //           <Field name="ownership_rights" component="input" type="text" className="form-control" />
  //         </fieldset>
  //         <fieldset key={'other_rights'} className="form-group">
  //           <label className="create-flat-form-label">Other Rights than Ownership:</label>
  //           <Field name="other_rights" component="input" type="text" className="form-control" />
  //         </fieldset>
  //       </div>
  //     )
  //   // }
  // }

  // renderUserIsOwnerPicker() {
  //   return (
  //     <div>
  //       <fieldset key={'user_is_owner'} className="form-group">
  //         <label className="create-flat-form-label">User is Owner:</label>
  //         <Field name="user_is_owner" component="input" type="checkbox" />
  //       </fieldset>
  //     </div>
  //   );
  // }

  renderEachEditFlatMainFields(props) {
    const { appLanguages, appLanguageCode } = props;

    const componentMap = {
      selectField: SelectField,
      inputField: InputField,
      input: 'input'
    };

    const renderOptions = (eachField) => {
      return _.map(eachField.optionArray, eachOption => {
        // console.log('in renderEachEditFlatMainFields, renderOptions , this.props.appLanguages, eachOption: ', this.props.appLanguages, eachOption);
        const optionText = this.props.appLanguages && eachField.languageFromBackEnd && eachOption.value ? this.props.appLanguages[eachOption.value][this.props.appLanguageCode] : eachOption.value
        // return empty option in case there is nothing chosen or assigned to field
        if (eachOption.value === null) return <option key={111111}></option>;
        // If there is value but not textAppLanguagekey, use value for the option text
        if (eachOption.value && !eachOption.textAppLanguagekey) return <option key={eachOption.value} value={eachOption.value}>{optionText}</option>;
        return <option key={eachOption.value} value={eachOption.value}>{appLanguages ? appLanguages[eachOption.textAppLanguagekey][appLanguageCode] : ''}</option>;
      })
    };

    return _.map(Object.keys(flatFormObject), eachName => {
      const eachField = flatFormObject[eachName];
      // console.log('in renderEachEditFlatMainFields, in map eachName flatFormObject[eachName], componentMap[flatFormObject[eachName].component]: ', eachName, flatFormObject[eachName], componentMap[flatFormObject[eachName].component]);
      // If undchangeable field
      if (eachField.editFlatUnchangeable) {
        return (
          <fieldset key={eachName} className="form-group">
            <label className="create-flat-form-label">{AppLanguages[eachField.appLanguageKey][appLanguageCode]}:</label>
            <div className="edit-flat-address">{this.props.flat[eachName]}</div>
          </fieldset>
        );
      } // end of if (eachField.editFlatUnchangeable)

      if (!eachField.type && eachField.edit) {
        return (
          <fieldset key={eachName} className="form-group">
            <div style={eachField.style}><span style={eachField.labelSpanStyle}>*</span>{appLanguages[eachField.appLanguageKey][appLanguageCode]}</div>
          </fieldset>
        )
      } // end of if (!eachField.type)

      if (!eachField.type && eachField.create) {
        return;
      } // end of if (!eachField.type)

      return (
        <fieldset key={eachName} className="form-group">
          <label className="create-flat-form-label">{appLanguages ? appLanguages[eachField.appLanguageKey][appLanguageCode] : ''}
          {eachField.labelSpanStyle ? <span style={{ color: 'red' }}>*</span> : ''}:
          </label>
          <Field key={eachName} name={eachName} component={componentMap[eachField.component]} type={eachField.type} className={eachField.className}>
            {eachField.component === 'selectField' ? renderOptions(eachField) : ''}
          </Field>
        </fieldset>
      );
    });
  }

  renderRequiredMessages() {
    console.log('in editflat, renderRequiredMessages: ');
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

  renderEditForm() {
    const { handleSubmit, appLanguageCode } = this.props;
    const flatEmpty = _.isEmpty(this.props.flat);

    const showMobileView = this.state.windowWidth < RESIZE_BREAK_POINT;

    // const doNotShowContainer = this.props.flat && !this.props.currentUserIsOwner && (this.props.flat.places.length < 1)
    // console.log('in edit flat, renderEditForm, flatEmpty: ', flatEmpty);
    // console.log('in edit flat, renderEditForm, this.props.flat: ', this.props.flat);

    // <h2 style={{ marginBottom: '30px' }}>{AppLanguages.editYourListing[appLanguageCode]}</h2>
    if (!flatEmpty) {
      // console.log('in edit flat, renderEditForm, this.props: ', this.props);
      return (
        <div>
          <div className="page-title">
            <div className="page-title-box"></div>
              <div className="page-title-box">
                {AppLanguages.editYourListing[this.props.appLanguageCode]}
              </div>
              <div className="page-title-box page-title-box-right">
              {showMobileView
                ?
                <Ellipsis
                  choiceObject={{
                    editBasicInfo: 'Basic Info & Amenities',
                    editBuildingInfo: 'Building Info',
                    editRentPayments: 'Rent Payments',
                    editFacilitiesInfo: 'Facilities Info',
                    editLanguages: 'Languages',
                    editCalendars: 'Calendars',
                    editImages: 'Images',
                    editPlaces: 'Convenient Places' }}
                  setLastPanelState={(stateObject, callBack) => this.setState(stateObject, callBack)}
                  lastPanel={this.state.lastPanel}
                />
                :
                ''}
              </div>
          </div>
          <h4>{AppLanguages.editBasicInformation[this.props.appLanguageCode]}</h4>
          <form onSubmit={handleSubmit(this.handleFormSubmit)}>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.listingId[appLanguageCode]}: </label>
              <span style={{ fontWeight: 'normal', float: 'left' }}>{this.props.flat.id}</span>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.listingLanguage[appLanguageCode]}:</label>
              <div className="edit-flat-address">{Languages[this.props.flat.language_code].flag}{Languages[this.props.flat.language_code].name}</div>
            </fieldset>

            {!_.isEmpty(this.props.appLanguages) && this.renderEachEditFlatMainFields({ appLanguages: AppLanguages, appLanguageCode })}

            <div className="container amenity-input-box">
              <div className="row amenity-row">
                {this.renderAmenityInput()}
              </div>
            </div>
            {this.renderAlert()}

            <div
              className="confirm-change-and-button-container"
            >
            {this.props.formObject && this.props.formObject.syncErrors && Object.keys(this.props.formObject.syncErrors).length > 0 && this.state.confirmChecked ? this.renderRequiredMessages() : ''}

              <div className="confirm-change-and-button">
                <label className="confirm-radio"><i className="fa fa-check fa-lg"></i> {AppLanguages.confirmAbove[appLanguageCode]}
                  <input type="checkbox" id="editFlatConfirmCheck" checked={this.state.confirmChecked} onChange={this.handleConfirmCheck} />
                  <span className="checkmark"></span>
                </label>
                <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">{AppLanguages.submit[appLanguageCode]}</button>
              </div>
            </div>
          </form>


          <h4>{AppLanguages.addEditBuilding[appLanguageCode]}</h4>
              {this.renderBuildingAddEdit()}

          <h4>{AppLanguages.rentPayment[appLanguageCode]}</h4>
            {this.renderRentPaymentMethod()}

          {this.props.flat.rent_payment_method == 'bank_transfer' ? <h4>{AppLanguages.selectBankAccount[appLanguageCode]}</h4> : ''}
          {this.props.flat.rent_payment_method == 'bank_transfer' ? this.renderSelectBankAccount() : ''}

          <h4>{AppLanguages.addEditFacilties[appLanguageCode]}</h4>
            {this.renderFacilitiesAddEdit()}

          <h4>{AppLanguages.addEditLanguages[appLanguageCode]}</h4>
            {this.renderLanguages()}

          <h4>{AppLanguages.addEditCalendars[appLanguageCode]}</h4>
            {this.renderIcalendarAddEdit()}

          <h4>{AppLanguages.addDeletePhotos[appLanguageCode]}  <small>({this.props.flat.images.length} images, max: {MAX_NUM_FILES}{this.props.flat.images.length < MAX_NUM_FILES ? '' : ', Please delete images to add'})</small></h4>
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
              <UploadForFlat
                flatId={this.props.flat.id}
                flat={this.props.flat}
              /> :
              ''
            }
          </div>

          <h4>{AppLanguages.addDeleteConvenient[appLanguageCode]}</h4>
          <div>
            <div className="container" id="map">
              {this.renderMap()}
            </div>
                <MapInteraction
                  flat={this.props.flat ? this.props.flat : ''}
                  places={this.props.flat ? this.props.flat.places : ''}
                  currentUserIsOwner={this.props.currentUserIsOwner}
                  showFlat={false}
                />
          </div>

          <div className="back-button">
            <button className="btn btn-primary btn-lg to-show-btn" onClick={this.handleBackToShowButton}>To Show Page</button>
          </div>
        </div>
      );
    }
  }

  renderLanguageCreateModal() {
    if (this.props.showLanguageCreate) {
      return (
        <div>
          <LanguageCreateModal
            show={this.props.showLanguageCreate}
          />
        </div>
      );
    }
  }

  renderLanguageEditModal() {
    if (this.props.showLanguageEdit) {
      return (
        <div>
          <LanguageEditModal
            show={this.props.showLanguageEdit}
          />
        </div>
      );
    }
  }

  renderIcalendarCreateModal() {
    if (this.props.showIcalendarCreate) {
      return (
        <div>
          <IcalendarCreateModal
            show={this.props.showIcalendarCreate}
          />
        </div>
      );
    }
  }
  renderIcalendarEditModal() {
    if (this.props.showIcalendarEdit) {
      return (
        <div>
          <IcalendarEditModal
            show={this.props.showIcalendarEdit}
          />
        </div>
      );
    }
  }

  renderBuildingEditModal() {
    if (this.props.showBuildingEdit) {
      if (this.props.flat) {
        if (this.props.flat.building) {
          return (
            <div>
              <BuildingEditModal
              // show
                show={this.props.showBuildingEdit}
              />
            </div>
          );
        }
      }
    }
  }
  renderBuildingCreateModal() {
    if (this.props.showBuildingCreate) {
      if (this.props.flat) {
        return (
          <div>
            <BuildingCreateModal
            // show
              show={this.props.showBuildingCreate}
            />
          </div>
        );
      }
    }
  }

  renderInspectionCreateModal() {
    console.log('in edit flat, renderInspectionCreateModal, this.props.showInspectionCreate: ', this.props.showInspectionCreate);
    if (this.props.showInspectionCreate) {
      if (this.props.flat) {
        return (
          <div>
            <InspectionCreateModal
            // show
              show={this.props.showInspectionCreate}
            />
          </div>
        );
      }
    }
  }

  renderInspectionEditModal() {
    if (this.props.showInspectionEdit) {
      if (this.props.flat) {
        return (
          <div>
            <InspectionEditModal
            // show
              show={this.props.showInspectionEdit}
            />
          </div>
        );
      }
    }
  }

  renderFacilityEditModal() {
    if (this.props.showFacilityEdit) {
      if (this.props.flat) {
        return (
          <div>
            <FacilityEditModal
            // show
              show={this.props.showFacilityEdit}
            />
          </div>
        );
      }
    }
  }

  renderFacilityCreateModal() {
    if (this.props.showFacilityCreate) {
      if (this.props.flat) {
        return (
          <div>
            <FacilityCreateModal
            // show
              show={this.props.showFacilityCreate}
            />
          </div>
        );
      }
    }
  }

  renderBuildingLanguageEditForm() {
    return (
      <BuildingLanguageEditModal
        show={this.props.showBuildingLanguageEdit}
      />
    );
  }

  renderBuildingLanguageCreateForm() {
    console.log('in mypage, renderBuildingLanguageCreateForm, this.props.showBuildingLanguageCreate: ', this.props.showBuildingLanguageCreate);
    return (
      <BuildingLanguageCreateModal
        show={this.props.showBuildingLanguageCreate}
      />
    );
  }

  render() {
    return (
      <div>
        {this.renderBuildingCreateModal()}
        {this.renderBuildingEditModal()}
        {this.renderInspectionCreateModal()}
        {this.renderInspectionEditModal()}
        {this.renderFacilityEditModal()}
        {this.renderFacilityCreateModal()}
        {this.renderLanguageCreateModal()}
        {this.renderLanguageEditModal()}
        {this.renderIcalendarCreateModal()}
        {this.renderIcalendarEditModal()}
        {this.renderEditForm()}
        {this.props.showBuildingLanguageEdit ? this.renderBuildingLanguageEditForm() : ''}
        {this.props.showBuildingLanguageCreate ? this.renderBuildingLanguageCreateForm() : ''}
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
  className,
  meta: { touched, error, warning },
  }) => (
      <div>
          <input {...input} type={type} placeholder={placeholder} className={className} />
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
          if (values.appLanguages) {
          // if (!_.isEmpty(values)) {
            if (!values.language_code) {
              errors.language_code = values.appLanguages.requiredLanguage[values.languageCodeForValidate];
              // errors.language_code = 'A language is required';
            }

            if (!values.address1) {
              // console.log('in signin modal, validate values, values.appLanguages.requiredAddress1, values.languageCodeForValidate: ', values, values.appLanguages.requiredAddress1, values.languageCodeForValidate);
              errors.address1 = values.appLanguages.requiredAddress1[values.languageCodeForValidate];
              // errors.address1 = 'A Street address is required';
            }

            if (!values.city) {
              errors.city = values.appLanguages.requiredCity[values.languageCodeForValidate];
              // errors.city = 'A city, district or ward is required';
            }

            if (!values.state) {
              errors.state = values.appLanguages.requiredState[values.languageCodeForValidate];
              // errors.state = 'A state or province is required';
            }

            if (!values.zip) {
              errors.zip = values.appLanguages.requiredZip[values.languageCodeForValidate];
              // errors.zip = 'A zip or postal code is required';
            }

            if (!values.country) {
              errors.country = values.appLanguages.requiredCountry[values.languageCodeForValidate];
              // errors.country = 'A country is required';
            }
            if (!values.price_per_month) {
              errors.price_per_month = values.appLanguages.requiredPricePerMonth[values.languageCodeForValidate];
              // errors.price_per_month = 'A price is required';
            }

            if (!values.size) {
              errors.size = values.appLanguages.requiredFloorSpace[values.languageCodeForValidate];
              // errors.size = 'Floor space is required';
            }

            if (!values.rooms) {
              errors.rooms = values.appLanguages.requiredRooms[values.languageCodeForValidate];
              // errors.rooms = 'Number of rooms is required';
            }
            if (!values.minutes_to_station) {
              errors.minutes_to_station = values.appLanguages.requiredMinutesToStation[values.languageCodeForValidate];
              // errors.minutes_to_station = 'Minutes to station is required';
            }
          }

          // if (values.size !== parseInt(values.size, 10)) {
          //     errors.size = 'Floor space needs to be a number';
          // }
          //
          // if(!values.password){
          //     errors.password = 'Password is required'
          // } else if (values.password.length < 6) {
          //   errors.password = 'A password needs to be at least 6 characters'
          //
          // }
          console.log('in signin modal, validate errors: ', errors);
          return errors;
      }

EditFlat = reduxForm({
  form: 'EditFlat',
  validate
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
    // iterate through each each key in flat
    _.each(Object.keys(flat), key => {
      if (key === 'amenity') {
        // console.log('in edit_flat, getInitialValueObject, if key === amenity, flat[key]: ', flat[key]);
        // get array of amenities from flat
        const amenities = flat[key];
        // iterate through each amnnity and put them in the object for initialValues
        _.each(Object.keys(amenities), k => {
          // console.log('in edit_flat, getInitialValueObject, if key === amenity, each amenities[k]: ', amenities[k]);
          initialValueObj[k] = amenities[k];
        });
      } else {
        // console.log('in edit_flat, getInitialValueObject, else, flat[key]: ', flat[key]);
        // console.log('in edit_flat, getInitialValueObject, else, key: ', key);
        // if not an amenity key (just flat), put them in the object for initial values
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
  console.log('in edit_flat, mapStateToProps: ', state);
  const flat = state.selectedFlatFromParams.selectedFlatFromParams;
  let initialValues = {};
  initialValues.languageCodeForValidate = state.languages.appLanguageCode;
  // AppLanguages to be moved to backend
  initialValues.appLanguages = AppLanguages;
  initialValues.language_code = state.languages.appLanguageCode;
  if (flat) {
    // const initialValues = state.form.simple ? { ...state.form.simple.values } : {};
    const object = getInitialValueObject(flat);
    // initialValues = { ...initialValues, object }
    initialValues = _.merge({}, object, initialValues);
    console.log('in edit_flat, mapStateToProps, initialValues: ', initialValues);
    // console.log('in edit_flat, mapStateToProps, getInitialValueObject(flat): ', getInitialValueObject(flat));
    // console.log('in edit_flat, mapStateToProps, flat: ', flat);
    // console.log('in edit_flat, mapStateToProps, flat: ', flat);
    // console.log('in edit_flat, mapStateToProps, initialValues: ', initialValues);
    return {
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      buildings: state.flat.buildings,
      currentUserIsOwner: state.flat.currentUserIsOwner,
      // selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
      amenity: state.selectedFlatFromParams.selectedFlatFromParams.amenity,
      auth: state.auth,
      places: state.places.places,
      showLanguageCreate: state.modals.showLanguageCreateModal,
      showLanguageEdit: state.modals.showLanguageEditModal,
      showIcalendarCreate: state.modals.showIcalendarCreateModal,
      showIcalendarEdit: state.modals.showIcalendarEditModal,
      showBuildingEdit: state.modals.showBuildingEditModal,
      showBuildingCreate: state.modals.showBuildingCreateModal,
      appLanguageCode: state.languages.appLanguageCode,
      bankAccounts: state.auth.bankAccounts,
      selectedFacility: state.flat.selectedFacilityId,
      showFacilityEdit: state.modals.showFacilityEditModal,
      showFacilityCreate: state.modals.showFacilityCreateModal,
      showInspectionEdit: state.modals.showInspectionEditModal,
      showInspectionCreate: state.modals.showInspectionCreateModal,
      showBuildingLanguageCreate: state.modals.showBuildingLanguageCreateModal,
      showBuildingLanguageEdit: state.modals.showBuildingLanguageEditModal,
      buildingId: state.modals.buildingId,
      buildingLanguageId: state.modals.buildingLanguageId,
      appLanguages: state.auth.appLanguages,
      formObject: state.form.EditFlat,
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
      initialValues
    };
  } else {
    // return an empty object which is required by mapStateToProps, if there is no flat in state;
    return {};
  }
}

export default connect(mapStateToProps, actions)(EditFlat);
