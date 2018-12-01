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

let deleteImageArray = [];
const AMENITIES = Amenities;
const MAX_NUM_FILES = globalConstants.maxNumImages;


class EditFlat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // confirmChecked: false
      confirmChecked: false,
      selectedLanguageCode: ''
    };
    // this.handleAssignEditBuildingClick = this.handleAssignEditBuildingClick.bind(this);
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
    // this.props.fetchPlaces(this.props.match.params.id);

    // console.log('in edit flat, componentDidMount, this.state.handleConfirmCheck: ', this.state.confirmChecked);
    // if (this.props.flat) {
      // console.log('in edit flat, componentDidMount, editFlatLoad called');
    //   this.props.editFlatLoad(this.props.flat);
    // }
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
        <button className="btn btn-danger btn-sm btn-delete-all-images" onClick={this.deleteCheckedImages.bind(this)}>{AppLanguages.deleteCheckedImages[this.props.appLanguageCode]}</button>
        <button className="btn btn-secondary btn-sm btn-uncheck-all-images" onClick={this.uncheckAllImages.bind(this)}>{AppLanguages.uncheckAllImages[this.props.appLanguageCode]}</button>
        <button className="btn btn-primary btn-sm btn-check-all-images" onClick={this.checkAllImages.bind(this)}>{AppLanguages.checkAllImages[this.props.appLanguageCode]}</button>
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

      // console.log('in show_flat, renderMap, flatArray: ', flatArray);
      // console.log('in show_flat, renderMap, flatArrayMapped: ', flatArrayMapped);

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
      if (language.code == languageCode) {
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
          {Languages[language.code].flag} {Languages[language.code].name}
          <div value={language.code} className="edit-flat-each-available-language-edit-link" onClick={this.handleEditLanguageClick.bind(this)}>{AppLanguages.edit[this.props.appLanguageCode]}</div>
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
         <div value={calendar.id} className="edit-flat-each-available-icalendar-edit-link" onClick={this.handleEditIcalendarClick.bind(this)}>{AppLanguages.edit[this.props.appLanguageCode]}</div>
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
        <div className="edit-flat-language-add-link" onClick={this.handleAddLanguageClick.bind(this)}>{AppLanguages.addAnotherLanguage[this.props.appLanguageCode]}</div>
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
          <div className="edit-flat-language-add-link" onClick={this.handleAddIcalendarClick.bind(this)}>{AppLanguages.addAnotherICalendar[this.props.appLanguageCode]}</div>
          :
          <div className="edit-flat-language-add-link" onClick={this.handleAddIcalendarClick.bind(this)}>{AppLanguages.addAnICalendar[this.props.appLanguageCode]}</div> }

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
          <div value={eachBuilding.id} name="add" className="edit-flat-building-add-link" onClick={this.handleAssignEditBuildingClick.bind(this)}>{AppLanguages.yesAssignThisBuilding[this.props.appLanguageCode]}</div>
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
          <div value={eachInspection.id} name="edit" className="edit-flat-inspection-each-edit-link" onClick={this.handleAddEditInspectionClick.bind(this)}>{AppLanguages.edit[this.props.appLanguageCode]}</div>
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
          <div value={eachBuildingLanguage.id} name="edit" className="edit-flat-inspection-each-edit-link" onClick={this.handleAddEditBuildingLanguageClick.bind(this)}>{AppLanguages.edit[this.props.appLanguageCode]}</div>
        </div>
      );
    });
  }

  renderBuilding(building) {
    const inspection = building.inspections ? this.getInspection(building) : '';
    console.log('in edit flat, renderBuilding, inspection: ', inspection);
    if (building) {
      return (
        <div key={building.name} className="edit-flat-building-choice">
          {building.name}{building.name ? ', ' : ''} {building.address1}, {building.city}, {building.state}, {building.country} &nbsp; Language: {Languages[building.language_code].flag}
        <div value={building.id} name="edit" className="edit-flat-building-add-link" onClick={this.handleAssignEditBuildingClick.bind(this)}>{AppLanguages.editBuilding[this.props.appLanguageCode]}</div>

        {building.inspections && (building.inspections.length > 0) ?
          <div className="edit-flat-inspection-box">{AppLanguages.inspections[this.props.appLanguageCode]}: {this.renderEachInspection()}</div>
          :
          <div>No Inspection Information</div>
        }
        <div value={building.id} name="add" className="edit-flat-building-add-link" onClick={this.handleAddEditInspectionClick.bind(this)}>{AppLanguages.addInspection[this.props.appLanguageCode]}</div>

        {building.building_languages && (building.building_languages.length > 0) ?
          <div className="edit-flat-inspection-box">{AppLanguages.otherLanguages[this.props.appLanguageCode]}: {this.renderEachBuildingLanguage()}</div>
          :
          <div>No Other Building Languages</div>
        }
        <div value={building.id} name="add" className="edit-flat-building-add-link" onClick={this.handleAddEditBuildingLanguageClick.bind(this)}>{AppLanguages.addBuildingLanguage[this.props.appLanguageCode]}</div>
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
            <div value={this.props.flat.id} name="create" className="edit-flat-building-add-link" onClick={this.handleAssignEditBuildingClick.bind(this)}>{AppLanguages.noAddMyBuilding[this.props.appLanguageCode]}</div>
          </div>
        );
      }

      if (!this.props.flat.building && !this.props.buildings.length > 0) {
        // console.log('in edit flat, renderBuildingAddEdit, this.props.buildings: ', this.props.buildings);
        return (
          <div className="edit-flat-language-box">
            <div value={this.props.flat.id} name="create" className="edit-flat-building-add-link" onClick={this.handleAssignEditBuildingClick.bind(this)}>{AppLanguages.addMyBuilding[this.props.appLanguageCode]}</div>
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
            <input name={i} value={eachAccount.id} type="checkbox" checked={isThisAccountDefault} className="my-page-card-default-checkbox" onChange={this.handleBankAcccountDefaultCheck.bind(this)} />
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
        <form onSubmit={handleSubmit(this.handlePaymentMethodFormSubmit.bind(this))}>
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
        <div name="edit" value={eachFacility.id} name="edit" className="edit-flat-building-add-link" onClick={this.handleAddEditFacilityClick.bind(this)}>{AppLanguages.edit[this.props.appLanguageCode]}</div>
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
            <div name="add" className="edit-flat-language-add-link" onClick={this.handleAddEditFacilityClick.bind(this)}>{AppLanguages.addAFacility[this.props.appLanguageCode]}</div>
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
            <div name="add" className="edit-flat-language-add-link" onClick={this.handleAddEditFacilityClick.bind(this)}>{AppLanguages.addAFacility[this.props.appLanguageCode]}</div>
          </div>
        );
      }
    }
  }

  // <fieldset className="form-group">
  // <label className="create-flat-form-label">{AppLanguages.nearestStation[appLanguageCode]}:</label>
  // <Field name="station" component="input" type="string" className="form-control" />
  // </fieldset>
  renderEditForm() {
    const { handleSubmit, appLanguageCode } = this.props;
    const flatEmpty = _.isEmpty(this.props.flat);
    // console.log('in edit flat, renderEditForm, flatEmpty: ', flatEmpty);
    // console.log('in edit flat, renderEditForm, this.props.flat: ', this.props.flat);

    if (!flatEmpty) {
      // console.log('in edit flat, renderEditForm, this.props: ', this.props);
      return (
        <div>
          <h2 style={{ marginBottom: '30px' }}>{AppLanguages.editYourListing[appLanguageCode]}</h2>
          <h4>{AppLanguages.editBasicInformation[this.props.appLanguageCode]}</h4>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.listingLanguage[appLanguageCode]}:</label>
              <div className="edit-flat-address">{Languages[this.props.flat.language_code].flag}{Languages[this.props.flat.language_code].name}</div>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.streetAddress[appLanguageCode]}:</label>
              <div className="edit-flat-address">{this.props.flat.address1}</div>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.city[appLanguageCode]}:</label>
              <div className="edit-flat-address">{this.props.flat.city}</div>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.state[appLanguageCode]}:</label>
              <div className="edit-flat-address">{this.props.flat.state}</div>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.zip[appLanguageCode]}:</label>
              <div className="edit-flat-address">{this.props.flat.zip}</div>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.country[appLanguageCode]}:</label>
              <div className="edit-flat-address">{this.props.flat.country}</div>
            </fieldset>
            <fieldset>
            <div className="edit-flat-form-message"><span style={{ color: 'red' }}>*</span> {AppLanguages.requiredFieldsEdit[appLanguageCode]}</div>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.unit[appLanguageCode]}:</label>
              <Field name="unit" component="input" type="string" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.description[appLanguageCode]}:</label>
              <Field name="description" component="input" type="string" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.area[appLanguageCode]}:</label>
              <Field name="area" component="input" type="string" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.pricePerMonth[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
              <Field name="price_per_month" component="input" type="float" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.paymentDueDate[appLanguageCode]}:</label>
              <Field name="payment_due_date" component="input" type="float" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.keyMoney[appLanguageCode]}:</label>
              <Field name="key_money" component="input" type="float" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.deposit[appLanguageCode]}:</label>
              <Field name="deposit" component="input" type="float" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.managementFees[appLanguageCode]}:</label>
              <Field name="management_fees" component="input" type="float" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.floorSpace[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
              <Field name="size" component="input" type="integer" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.balconySize[appLanguageCode]}:</label>
              <Field name="balcony_size" component="input" type="integer" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.layout[appLanguageCode]}:</label>
              <Field name="layout" component="select" type="string" className="form-control">
                <option></option>
                <option value="LDK">LDK</option>
                <option value="DK">DK</option>
                <option value="L">K</option>
                <option value="One Room">One Room</option>
              </Field>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.toilet[appLanguageCode]}:</label>
              <Field name="toilet" component="select" type="string" className="form-control">
                <option></option>
                <option value="Dedicated Flushing Toilet">Dedicated Flushing Toilet</option>
                <option value="Dedicated Non-flushing Toilet">Dedicated Non-flushing Toilet</option>
                <option value="Shared Flushing Toilet">Shared Flushing Toilet</option>
                <option value="Shared Non-flushing Toilet">Shared Non-flushing Toilet</option>
              </Field>
            </fieldset>
            <fieldset className="form-group">
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
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.salesPoint[appLanguageCode]}:</label>
              <Field name="sales_point" component="input" type="string" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.rooms[appLanguageCode]}:</label>
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
              <label className="create-flat-form-label">{AppLanguages.beds[appLanguageCode]}:</label>
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
              <label className="create-flat-form-label">{AppLanguages.kingOrQueen[appLanguageCode]}:</label>
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
              <label className="create-flat-form-label">{AppLanguages.flatType[appLanguageCode]}:</label>
              <Field name="flat_type" component="select" type="string" className="form-control">
                <option></option>
                <option value="flat_in_building">Flat in building</option>
                <option value="single_family">House</option>
                <option value="town_house">Town House</option>
                <option value="others">Others</option>
              </Field>
            </fieldset>
            <fieldset className="form-group">
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
              <label className="create-flat-form-label">{AppLanguages.intro[appLanguageCode]}:</label>
              <Field name="intro" component="textarea" type="text" className="form-control flat-intro-input" />
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.minutesToNearest[appLanguageCode]}<span style={{ color: 'red' }}>*</span>:</label>
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
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.cancellation[appLanguageCode]}:</label>
              <Field name="cancellation" component="select" type="boolean" className="form-control">
                <option></option>
                <option value={true}>{AppLanguages.yesSeePolicies[appLanguageCode]}</option>
                <option value={false}>{AppLanguages.no[appLanguageCode]}</option>
              </Field>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.parkingIncluded[appLanguageCode]}:</label>
              <Field name="parking_included" component="select" type="boolean" className="form-control">
                <option></option>
                <option value={true}>{AppLanguages.yes[appLanguageCode]}</option>
                <option value={false}>{AppLanguages.no[appLanguageCode]}</option>
              </Field>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.bicycleParkingIncluded[appLanguageCode]}:</label>
              <Field name="bicycle_parking_included" component="select" type="boolean" className="form-control">
                <option></option>
                <option value={true}>{AppLanguages.yes[appLanguageCode]}</option>
                <option value={false}>{AppLanguages.no[appLanguageCode]}</option>
              </Field>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.motorcycleParkingIncluded[appLanguageCode]}:</label>
              <Field name="motorcycle_parking_included" component="select" type="boolean" className="form-control">
                <option></option>
                <option value={true}>{AppLanguages.yes[appLanguageCode]}</option>
                <option value={false}>{AppLanguages.no[appLanguageCode]}</option>
              </Field>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.storageIncluded[appLanguageCode]}:</label>
              <Field name="storage_included" component="select" type="boolean" className="form-control">
                <option></option>
                <option value={true}>{AppLanguages.yes[appLanguageCode]}</option>
                <option value={false}>{AppLanguages.no[appLanguageCode]}</option>
              </Field>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.dedicatedYard[appLanguageCode]}:</label>
              <Field name="dedicated_yard" component="select" type="boolean" className="form-control">
                <option></option>
                <option value={true}>{AppLanguages.yes[appLanguageCode]}</option>
                <option value={false}>{AppLanguages.no[appLanguageCode]}</option>
              </Field>
            </fieldset>
            <fieldset className="form-group">
              <label className="create-flat-form-label">{AppLanguages.smoking[appLanguageCode]}:</label>
              <Field name="smoking" component="select" type="boolean" className="form-control">
                <option></option>
                <option value={true}>{AppLanguages.yes[appLanguageCode]}</option>
                <option value={false}>{AppLanguages.no[appLanguageCode]}</option>
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
              <label className="confirm-radio"><i className="fa fa-check fa-lg"></i> {AppLanguages.confirmAbove[appLanguageCode]}
                <input type="checkbox" id="editFlatConfirmCheck" checked={this.state.confirmChecked} onChange={this.handleConfirmCheck.bind(this)} />
                <span className="checkmark"></span>
              </label>
              <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">{AppLanguages.submit[appLanguageCode]}</button>
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
              <Upload
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
              flat={this.props.flat}
              places={this.props.flat.places}
              currentUserIsOwner={this.currentUserIsOwner()}
              showFlat={false}
            />
          </div>

          <div className="back-button">
            <button className="btn btn-primary btn-lg to-show-btn" onClick={this.handleBackToShowButton.bind(this)}>To Show Page</button>
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
  if (flat) {
    initialValues = getInitialValueObject(flat)
    // console.log('in edit_flat, mapStateToProps, getInitialValueObject(flat): ', getInitialValueObject(flat));
    // console.log('in edit_flat, mapStateToProps, flat: ', flat);
    // console.log('in edit_flat, mapStateToProps, flat: ', flat);
    // console.log('in edit_flat, mapStateToProps, initialValues: ', initialValues);
    return {
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      buildings: state.flat.buildings,
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
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
      initialValues
    };
  } else {
    // return an empty object which is required by mapStateToProps, if there is no flat in state;
    return {};
  }
}

export default connect(mapStateToProps, actions)(EditFlat);
