import React, { Component } from 'react';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';
import * as actions from '../../actions';
import DocumentForm from '../constants/document_form';

import DocumentChoices from './document_choices';
import AppLanguages from '../constants/app_languages';

class CreateEditDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // set up state to take input from user
      clickedInfo: { elementX: '', elementY: '', page: '' }
    };
  }

  componentDidMount() {
    // document.addEventListener('click', this.printMousePos);
    // document.addEventListener('click', this.printMousePos1);
  }

  // printMousePos1 = (event) => {
  //   // custom version of layerX; takes position of container and
  //   // position of click inside container and takes difference to
  //   // get the coorindates of click inside container on page
  //   // yielded same as layerX and layerY
  //   console.log('in create_edit_document, printMousePos1', event);
  //   const clickedElement = event.target;
  //   const elementVal = clickedElement.getAttribute('value');
  //   // const documentContainerArray = document.getElementById('document-background')
  //   const documentContainerArray = document.getElementsByClassName('test-image-pdf-jpg-background');
  //   const pageIndex = elementVal - 1;
  //   const documentContainer = documentContainerArray[pageIndex]
  //   // console.log('in create_edit_document, printMousePos, documentContainer', documentContainer);
  //   const documentContainerPosTop = documentContainer.offsetTop
  //   const documentContainerPosLeft = documentContainer.offsetLeft
  //   console.log('in create_edit_document, printMousePos1, documentContainerPosTop', documentContainerPosTop, documentContainerPosLeft);
  //   const pageX = event.pageX;
  //   const pageY = event.pageY;
  //   console.log('in create_edit_document, printMousePos1, pageX, pageY', pageX, pageY);
  //   console.log('in create_edit_document, printMousePos1, (pageX - documentContainerPosLeft) / 792, (pageY - documentContainerPosTop) / 1122', (pageX - documentContainerPosLeft) / 792, (pageY - documentContainerPosTop) / 1122);
  //   const x = (pageX - documentContainerPosLeft) / 792;
  //   const y = (pageY - documentContainerPosTop) / 1122;
  //   this.setState({ clickedInfo: { left: x, top: y, page: elementVal, name: 'new_input', component: 'input', width: '200px', height: '30px', type: 'string', className: 'form-control', borderColor: 'lightgray' } }, () => {
  //     console.log('in create_edit_document, printMousePos1, clickedInfo.x, clickedInfo.page, ', this.state.clickedInfo.x, this.state.clickedInfo.y, this.state.clickedInfo.page);
  //     this.props.createDocumentElementLocally(this.state.clickedInfo);
  //     document.removeEventListener('click', this.printMousePos1);
  //   })
  //   // console.log('in create_edit_document, printMousePos, event.layerX / 792', event.layerX / 792);
  //   // console.log('in create_edit_document, printMousePos, event.layerY / 1122', event.layerY / 1122);
  //   // document.body.textContent =
  //   //   'clientX: ' + event.clientX +
  //   //   ' - clientY: ' + event.clientY;
  // }

  handleFormSubmit(data) {
    console.log('in create_edit_document, handleFormSubmit, data: ', data);
    // object to send to API; set flat_id
    const paramsObject = { flat_id: 190 }
    // iterate through each key in data from form
    _.each(Object.keys(data), key => {
      let page = 0;
      // find out which page the key is on
      // iterate through Document form first level key to see if each object has key in quesiton
      _.each(Object.keys(DocumentForm), objKey => {
        console.log('in create_edit_document, handleFormSubmit, key, objKey, (toString(key) in DocumentForm[objKey]), objKey: ', key, objKey, (key in DocumentForm[objKey]), DocumentForm[objKey]);
        // if the object has the key, that is the page the key is on
        // so set page variable so we can get choices from input key
        if (key in DocumentForm[objKey]) {
          page = objKey;
        }
      });
      console.log('in create_edit_document, handleFormSubmit, key is on page: ', page);
      // console.log('in create_edit_document, handleFormSubmit, data[key]: ', data[key]);
      // DocumentForm[key].params.value = data[key];
      // paramsObject[key] = DocumentForm[key].params;
      let choice = {};
      _.each(DocumentForm[page][key].choices, eachChoice => {
        // console.log('in create_edit_document, handleFormSubmit, eachChoice: ', eachChoice);
        // val = '' means its an input element, not a custom field component
        if (eachChoice.params.val == '') {
          choice = eachChoice;
          // console.log('in create_edit_document, handleFormSubmit, choice for empty string val: ', choice);
          // add data[key] (user choice) as value in the object to send to API
          choice.params.value = data[key];
          choice.params.page = page;
          choice.params.name = DocumentForm[page][key].name
          // add params object with the top, left, width etc. to object to send to api
          paramsObject[key] = choice.params;
        }
        if (eachChoice.params.val == data[key]) {
          choice = eachChoice;
          // console.log('in create_edit_document, handleFormSubmit, choice val == data[key]: ', choice);
          choice.params.value = data[key];
          choice.params.page = page;
          choice.params.name = DocumentForm[page][key].name
          paramsObject[key] = choice.params;
        }
      });
    });
    console.log('in create_edit_document, handleFormSubmit, object for params in API paramsObject: ', paramsObject);
    if (!data['construction']) {
      // console.log('in create_edit_document, handleFormSubmit, construction is required: ', data['construction']);
      this.props.authError('this is required!!!!');
    } else {
      this.props.createContract(paramsObject);
    }
  }

  renderEachDocumentField(page) {
    let fieldComponent = '';
    // if (DocumentForm[page]) {
    // console.log('in create_edit_document, renderEachDocumentField, page, DocumentForm[page] ', page, DocumentForm[page]);
      return _.map(DocumentForm[page], (formField, i) => {
        // console.log('in create_edit_document, renderEachDocumentField, formField ', formField);
        if (formField.component == 'DocumentChoices') {
          fieldComponent = DocumentChoices;
        } else {
          fieldComponent = formField.component;
        }
        // console.log('in create_edit_document, renderEachDocumentField, formField.top, formField.left: ', formField.top, formField.left);
        // <fieldset key={formField.name} className="form-group document-form-group" style={{ top: formField.top, left: formField.left, borderColor: formField.borderColor }}>
        // <fieldset key={formField.name} className={formField.component == 'input' ? 'form-group form-group-document' : 'form-group'} style={{ borderColor: formField.borderColor, top: formField.choices[0].params.top, left: formField.choices[0].params.left, width: formField.choices[0].params.width }}>
        // </fieldset>
        return (
          <Field
            key={i}
            name={formField.name}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == DocumentChoices ? { page } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            style={formField.component == 'input' ? { position: 'absolute', top: formField.choices[0].params.top, left: formField.choices[0].params.left, width: formField.choices[0].params.width, borderColor: formField.borderColor, height: formField.choices[0].params.height } : {}}
          />
        );
      });
    // }
  }

  renderNewElements(page) {
    const documentEmpty = _.isEmpty(this.props.documents);
    if (!documentEmpty) {
      const { newElement } = this.props.documents;
      console.log('in create_edit_document, renderNewElements, newElement: ', newElement);
      if (newElement.page == page) {
        console.log('in create_edit_document, renderNewElements, newElement.page, page: ', newElement.page, page);
        return (
          <Field
            key={newElement.name}
            name={newElement.name}
            component={newElement.component}
            // pass page to custom compoenent, if component is input then don't pass
            // props={fieldComponent == DocumentChoices ? { page } : {}}
            type={newElement.type}
            className={newElement.component == 'input' ? 'form-control' : ''}
            style={newElement.component == 'input' ? { position: 'absolute', top: `${newElement.top * 100}%`, left: `${newElement.left * 100}%`, width: newElement.width, height: newElement.height, borderColor: newElement.borderColor } : {}}
            // style={newElement.component == 'input' ? { position: 'absolute', top: newElement.top, left: newElement.left, width: newElement.width, height: newElement.height, borderColor: newElement.borderColor } : {}}
          />
        );
      }
    }
    // end of if documentEmpty
  }

  renderDocument() {
    //      <div id="banner" style={{ background: `url(${this.createBackgroundImage('banner_image_1')}` }}>
    // <div className="test-image-pdf-jpg" style={{ background: `url(${this.createBackgroundImageForDocs('phmzxr1sle99vzwgy0qn')})` }}>
    // {this.renderAlert()}
    // <div id="document-background" className="test-image-pdf-jpg-background" style={{ background: `url(${this.createBackgroundImageForDocs('teishasaku-saimuhosho' + '.jpg')})` }}>
    const file = 'teishaku-saimuhosho';
    // const page = 1;
    // {this.renderNewElements(page)}
    return _.map(Object.keys(DocumentForm), page => {
      console.log('in create_edit_document, renderDocument, page: ', page);
      return (
          <div key={page} value={page} id="document-background" className="test-image-pdf-jpg-background" style={{ backgroundImage: `url(http://res.cloudinary.com/chikarao/image/upload/w_792,h_1122,q_60,pg_${page}/${file}.jpg)` }}>
              {this.renderEachDocumentField(page)}
          </div>
      );
    });
  }


  render() {
    const { handleSubmit, appLanguageCode } = this.props;
    // console.log('CreateEditDocument, render value === ', value === '');
    return (
      <div className="test-image-pdf-jpg">
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            {this.renderDocument()}
          <button action="submit" id="submit-all" className="btn btn-primary btn-lg document-submit-button">{AppLanguages.submit[appLanguageCode]}</button>
        </form>
      </div>
    );
  }
}

CreateEditDocument = reduxForm({
  form: 'CreateEditDocument'
})(CreateEditDocument);

// takes booking and creates object of start date and end date years, months and days
function getBookingDateObject(booking) {
  // console.log('in create_edit_document, getBookingDateObject, booking: ', booking);
  const bookingEndArray = booking.date_end.split('-')
  const bookingStartArray = booking.date_start.split('-')
  const to_year = bookingEndArray[0];
  const to_month = bookingEndArray[1];
  const to_day = bookingEndArray[2];
  const from_year = bookingStartArray[0];
  const from_month = bookingStartArray[1];
  const from_day = bookingStartArray[2];
  // console.log('in create_edit_document, getBookingDateObject, bookingEndArray: ', bookingEndArray);
  const object = { to_year, to_month, to_day, from_year, from_month, from_day }
  // console.log('in create_edit_document, getBookingDateObject, object: ', object);
  return object;
}

function createAddress(flat) {
  let addressFieldArray = [];
  // if (flat.country.toLowerCase() == ('usa' || 'united states of america' || 'us' || 'united states')) {
  // change order of address depending on country
  if (flat.country.toLowerCase() == ('japan' || '日本' || '日本国' || 'japon')) {
    addressFieldArray = ['zip', 'state', 'city', 'address2', 'address1'];
  } else {
    addressFieldArray = ['address1', 'address2', 'city', 'state', 'zip'];
  }
  // const address = '';
  const addressArray = [];
  _.each(addressFieldArray, each => {
    // console.log('in create_edit_document, createAddress, address: ', address);
    // console.log('in create_edit_document, createAddress, each, type of flat[each]: ', each, typeof flat[each]);
    if ((typeof flat[each]) == 'string') {
      // const addressString = address.concat(toString(flat[each]));
      addressArray.push(flat[each])
    }
  });
  const address = addressArray.join(', ')
  // console.log('in create_edit_document, createAddress, address: ', address);
  return address;
}

function getInitialValueObject(flat, booking) {
  const object = {};
  _.each(DocumentForm, eachPageObject => {
    // for each page in DocumentForm
    _.each(Object.keys(flat), key => {
      // for each flat in boooking
      if (eachPageObject[key]) {
        // if flat key is in one of the pages, on DocumentForm
        // add to object to be returned as initialValues
        object[key] = flat[key];
      }
      // iterate through flat amenity
      // end of each flat amenity
    });
    // end of Object.keys flat
    _.each(Object.keys(flat.amenity), eachAmenityKey => {
      if (eachPageObject[eachAmenityKey]) {
        // if attributes in flat.amenity are on DocumentForm, add to initialValues object
        object[eachAmenityKey] = flat.amenity[eachAmenityKey];
      }
    });
    // end of each Object.keys flat.amenity
    if (flat.building) {
      // test if building has been added to flat
      _.each(Object.keys(flat.building), eachBuildingKey => {
        // if (eachBuildingKey == 'name') {
        //   eachBuildingKey = 'flat_building_name';
        // }
        if (eachPageObject[eachBuildingKey]) {
          console.log('in create_edit_document, getInitialValueObject, eachBuildingKey: ', eachBuildingKey);
          // if attributes in flat.building are on DocumentForm, add to initialValues object
          object[eachBuildingKey] = flat.building[eachBuildingKey];
        }
      });
      // end of each Object.keys flat.building
    }
    // end of if flat.building
    // !!!!!after going through each by each flat, amenity and building,
    // go through page object to see if document object (page) has 'attributes'
    // set by multipe amenity keys
    // _.each(Object.keys(eachPageObject), documentPageKey => {
    //   // iterate through each page object key
    //   if ('attributes' in eachPageObject[documentPageKey]) {
    //     // if attributes key is in one of the objects in one of the pages
    //     // take each name in names array and get the value of that key in amenity
    //     // count up a counter if one of the amenities is true
    //     let attributeBoolCount = 0;
    //     _.each(eachPageObject[documentPageKey].attributes.names, eachName => {
    //       console.log('in create_edit_document, getInitialValueObject, each attributes eachName, flat.amenity[eachName]: ', eachName, flat.amenity[eachName]);
    //       if (flat.amenity[eachName]) {
    //         attributeBoolCount++;
    //       }
    //     });
    //     if (attributeBoolCount > 0) {
    //       object[documentPageKey] = true;
    //     } else {
    //       object[documentPageKey] = false;
    //     }
    //   }
    // });
  });
  // end of documentForm eachPageObject
  // deal with booking dates dates (separates year, month and day of to and from attributes)
  const bookingDatesObject = getBookingDateObject(booking);
  _.each(Object.keys(bookingDatesObject), dateKey => {
    object[dateKey] = bookingDatesObject[dateKey];
  });
  // end of each bookingDatesObject
  // get address1, city, state, zip in one string
  const address = createAddress(flat);
  // console.log('in create_edit_document, getInitialValueObject, address: ', address);
  // add address to initialvalues object
  object.address = address;

  console.log('in create_edit_document, getInitialValueObject, object: ', object);
  // return object for assignment to initialValues in mapStateToProps
  return object;
}

function mapStateToProps(state) {
  // const testObject = { address: 'まかろに町', flat_building_name: 'ほうれん荘', auto_lock: true, bath: true, rooms: 1 };
  if (state.bookingData.fetchBookingData) {
    const flat = state.bookingData.fetchBookingData.flat;
    const booking = state.bookingData.fetchBookingData;
    // console.log('in create_edit_document, mapStateToProps, flat: ', flat);
    // console.log('in create_edit_document, mapStateToProps, DocumentForm: ', DocumentForm);
    const initialValues = getInitialValueObject(flat, booking);

    console.log('in create_edit_document, mapStateToProps, state: ', state);
    return {
      // flat: state.selectedFlatFromParams.selectedFlat,
      errorMessage: state.auth.error,
      auth: state.auth,
      appLanguageCode: state.languages.appLanguageCode,
      bookingData: state.bookingData.fetchBookingData.flat,
      initialValues,
      // initialValues: testObject,
      documents: state.documents
    };
  } else {
    return {};
  }
}

export default connect(mapStateToProps, actions)(CreateEditDocument);
