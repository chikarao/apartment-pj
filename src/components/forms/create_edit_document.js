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
import RentPayment from '../constants/rent_payment'
import Facility from '../constants/facility'

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

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-warning">
          {this.props.errorMessage}
        </div>
      );
    }
  }

  getRequiredKeys() {
    const array = [];
    _.each(Object.keys(DocumentForm), pageKey => {
      // if the object has the key, that is the page the key is on
      // so set page variable so we can get choices from input key
      _.each(Object.keys(DocumentForm[pageKey]), eachKey => {
        if (DocumentForm[pageKey][eachKey].required) {
          array.push(eachKey);
        }
      });
    });
    // console.log('in create_edit_document, getRequiredKeys array: ', array);
    return array;
  }

  checkIfRequiredKeysNull(requiredKeysArray, data) {
    // console.log('in create_edit_document, checkIfRequiredKeysNull, requiredKeys, data: ', requiredKeys, data);
    const array = [];
    _.each(requiredKeysArray, eachKey => {
      // console.log('in create_edit_document, checkIfRequiredKeysNull, eachKey, eachKey, data[eachKey], typeof data[eachKey], data[eachKey] == : ', requiredKeys, eachKey, data[eachKey], typeof data[eachKey], data[eachKey] == ('' || undefined || null));
      if (data[eachKey] == (undefined || null)) {
        array.push(eachKey);
      }
      // for some reason, empty string does not return true to == ('' || undefined || null)
      // so separate out
      if (data[eachKey] == '') {
        array.push(eachKey);
      }
    });
    // console.log('in create_edit_document, checkIfRequiredKeysNull array', array);
    return array;
  }

  checkOtherChoicesVal(choices, key, data) {
    let haveOrNot = false;
    _.each(choices, choice => {
      console.log('in create_edit_document, checkOtherChoicesVal, choice, key, data[key]: ', choice, key, data[key]);
      if (choice.params.val == data[key]) {
        haveOrNot = true;
      }
    });
    return haveOrNot;
  }

  handleFormSubmit(data) {
    console.log('in create_edit_document, handleFormSubmit, data: ', data);
    // object to send to API; set flat_id
    const contractName = 'teishaku-saimuhosho';
    const paramsObject = { flat_id: this.props.flat, contract_name: contractName }
    // iterate through each key in data from form

    const requiredKeysArray = this.getRequiredKeys();
    // console.log('in create_edit_document, handleFormSubmit, requiredKeysArray: ', requiredKeysArray);
    const nullRequiredKeys = this.checkIfRequiredKeysNull(requiredKeysArray, data)
    // console.log('in create_edit_document, handleFormSubmit, nullRequiredKeys: ', nullRequiredKeys);

    _.each(Object.keys(data), key => {
      let page = 0;
      // find out which page the key is on
      // iterate through Document form first level key to see if each object has key in quesiton
      _.each(Object.keys(DocumentForm), pageKey => {
        // console.log('in create_edit_document, handleFormSubmit, key, pageKey, (toString(key) in DocumentForm[pageKey]), pageKey: ', key, pageKey, (key in DocumentForm[pageKey]), DocumentForm[pageKey]);
        // if the object has the key, that is the page the key is on
        // so set page variable so we can get choices from input key
        if (key in DocumentForm[pageKey]) {
          page = pageKey;
        }
      });
      // console.log('in create_edit_document, handleFormSubmit, key is on page: ', page);
      // console.log('in create_edit_document, handleFormSubmit, data[key]: ', data[key]);
      // DocumentForm[key].params.value = data[key];
      // paramsObject[key] = DocumentForm[key].params;
      let choice = {};
      _.each(DocumentForm[page][key].choices, eachChoice => {
        // console.log('in create_edit_document, handleFormSubmit, eachChoice: ', eachChoice);
        // val = '' means its an input element, not a custom field component
        if (eachChoice.params.val == 'inputFieldValue') {
          choice = eachChoice;
          // console.log('in create_edit_document, handleFormSubmit, choice for empty string val: ', choice);
          // add data[key] (user choice) as value in the object to send to API
          // check for other vals of choices if more than 1 choice
          const otherChoicesHaveVal = Object.keys(DocumentForm[page][key].choices).length > 1 ? this.checkOtherChoicesVal(DocumentForm[page][key].choices, key, data) : false;
          if (!otherChoicesHaveVal) {
            choice.params.value = data[key];
            choice.params.page = page;
            choice.params.name = DocumentForm[page][key].name
            // add params object with the top, left, width etc. to object to send to api
            // console.log('in create_edit_document, handleFormSubmit, eachChoice.params.val, key, data[key] choice.params, if null: ', eachChoice.params.val, key, data[key], choice.params);
            paramsObject[key] = choice.params;
          }
        }
        if (eachChoice.params.val == data[key]) {
          choice = eachChoice;
          // console.log('in create_edit_document, handleFormSubmit, eachChoice.params.val, key, data[key] choice.params: ', eachChoice.params.val, key, data[key], choice.params);
          choice.params.value = data[key];
          choice.params.page = page;
          choice.params.name = DocumentForm[page][key].name
          paramsObject[key] = choice.params;
        }
      });
    });
    // console.log('in create_edit_document, handleFormSubmit, object for params in API paramsObject: ', paramsObject);
    if (nullRequiredKeys.length > 0) {
      // console.log('in create_edit_document, handleFormSubmit, construction is required: ', data['construction']);
      this.props.authError('The fields highlighted in blue are required.');
      // console.log('in create_edit_document, handleFormSubmit, required keys empty!!!: ', nullRequiredKeys);
      this.props.requiredFields(nullRequiredKeys);
    } else {
      this.props.authError('');
      this.props.requiredFields([]);
      this.props.createContract(paramsObject, () => {});
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
        // <fieldset key={formField.name} className="form-group document-form-group" style={{ top: formField.top, left: formField.left, borderColor: formField.borderColor }}>
        // <fieldset key={formField.name} className={formField.component == 'input' ? 'form-group form-group-document' : 'form-group'} style={{ borderColor: formField.borderColor, top: formField.choices[0].params.top, left: formField.choices[0].params.left, width: formField.choices[0].params.width }}>
        // </fieldset>

        let nullRequiredField = false;
        if (this.props.requiredFieldsNull) {
          if (this.props.requiredFieldsNull.length > 0) {
            nullRequiredField = this.props.requiredFieldsNull.includes(formField.name);
            // console.log('in create_edit_document, renderEachDocumentField, this.props.requiredFieldsNull: ', this.props.requiredFieldsNull);
            // console.log('in create_edit_document, renderEachDocumentField, formField.name this.props.requiredFieldsNull, nullRequiredField: ', formField.name, this.props.requiredFieldsNull, nullRequiredField);
          }
        }
        if (nullRequiredField) {
          console.log('in create_edit_document, renderEachDocumentField, formField.name this.props.requiredFieldsNull, nullRequiredField: ', formField.name, this.props.requiredFieldsNull, nullRequiredField);
        }

        return (
          <Field
            key={i}
            name={formField.name}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == DocumentChoices ? { page, required: formField.required, nullRequiredField } : {}}
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
      // console.log('in create_edit_document, renderNewElements, newElement: ', newElement);
      if (newElement.page == page) {
        // console.log('in create_edit_document, renderNewElements, newElement.page, page: ', newElement.page, page);
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
      // console.log('in create_edit_document, renderDocument, page: ', page);
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
            {this.renderAlert()}
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

function getContractLength(booking) {
  // console.log('in create_edit_document, getContractLength, booking: ', booking);
  const dateFrom = new Date(booking.date_start);
  const dateTo = new Date(booking.date_end);
  const difference = Math.floor(dateTo - dateFrom);
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(difference / day);
  const months = days / 30;
  let years = months / 12;
  if (years < 1) {
    years = '';
  } else if (years > 1 && years < 2) {
    years = 1;
  } else if (years >   2 && years < 3) {
    years = 2;
  }
  // console.log('in create_edit_document, getContractLength, months, years: ', months, years);
  const object = { months, years };
  // console.log('in create_edit_document, getContractLength, object: ', object);
  return object;
}

function getContractEndNoticePeriodObject(booking) {
  // const daysInMonth = {
  //   0: 31,
  //   1: 28,
  //   2: 31,
  //   4: 30,
  //   5: 31,
  //   6: 30,
  //   7: 31,
  //   8: 31,
  //   9: 30,
  //   10: 31,
  //   11: 30,
  //   12: 31
  // };

  // const leapYearDay = 29;
  //
  // const leapYears = [2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096, 2104, 2108, 2112, 2116, 2120]
  // console.log('in create_edit_document, getContractEndNoticePeriodObject, booking: ', booking);
  const dateEndOneYear = new Date(booking.date_end);
  const dateEndSixMonths = new Date(booking.date_end);
  // console.log('in create_edit_document, getContractEndNoticePeriodObject, dateEnd: ', dateEnd);
  const oneYearBefore = new Date(dateEndOneYear.setFullYear(dateEndOneYear.getFullYear() - 1));
  const sixMonthsBefore = new Date(dateEndSixMonths.setMonth(dateEndSixMonths.getMonth() - 6));
  const oneYearBeforeDay = oneYearBefore.getDate() == (0 || 1) ? 30 : oneYearBefore.getDate() - 1;
  const sixMonthsBeforeDay = sixMonthsBefore.getDate() == (0 || 1) ? 30 : sixMonthsBefore.getDate() - 1;
  const oneYearBeforeMonth = oneYearBefore.getDate() == (0 || 1) ? oneYearBefore.getMonth() : oneYearBefore.getMonth() + 1;
  const sixMonthsBeforeMonth = sixMonthsBefore.getDate() == (0 || 1) ? sixMonthsBefore.getMonth() : sixMonthsBefore.getMonth() + 1;
  // console.log('in create_edit_document, getContractEndNoticePeriodObject, oneYearBefore: ', oneYearBefore.getFullYear(), oneYearBefore.getMonth() + 1, oneYearBefore.getDate() - 1);
  // console.log('in create_edit_document, getContractEndNoticePeriodObject, sixMonthsBefore: ', sixMonthsBefore.getFullYear(), sixMonthsBefore.getMonth(), sixMonthsBefore.getDate());
  // console.log('in create_edit_document, getContractEndNoticePeriodObject, sixMonthsBefore: ', sixMonthsBefore);
  // console.log('in create_edit_document, getContractEndNoticePeriodObject, dateEnd: ', dateEnd);

  const noticeObject = { from: { year: oneYearBefore.getFullYear(), month: oneYearBeforeMonth, day: oneYearBeforeDay }, to: { year: sixMonthsBefore.getFullYear(), month: sixMonthsBeforeMonth, day: sixMonthsBeforeDay }}
  return noticeObject;
  // console.log('in create_edit_document, getContractEndNoticePeriodObject, noticeObject: ', noticeObject);
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

function getChoice(facility) {
  // console.log('in create_edit_document, getChoice, facility: ', facility);
  const array = [];
  _.each(Facility.facility_type.choices, eachChoice => {
    if (eachChoice.value == facility.facility_type) {
      array.push(eachChoice);
      return;
    }
  });
  return array[0];
}

function calculateAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
}

function getInitialValueObject(flat, booking, userOwner, tenant, appLanguageCode) {
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
          // console.log('in create_edit_document, getInitialValueObject, eachBuildingKey: ', eachBuildingKey);
          // if attributes in flat.building are on DocumentForm, add to initialValues object
          object[eachBuildingKey] = flat.building[eachBuildingKey];
        }
      });
      // end of each Object.keys flat.building
    }

    if (flat.bank_account) {
      // test if bank_account has been added to flat
      _.each(Object.keys(flat.bank_account), eachBankAccountKey => {
        // if (eachBuildingKey == 'name') {
        //   eachBuildingKey = 'flat_bank_account_name';
        // }
        if (eachPageObject[eachBankAccountKey]) {
          // console.log('in create_edit_document, getInitialValueObject, eachBankAccountKey: ', eachBankAccountKey);
          // if attributes in flat.bank_account are on DocumentForm, add to initialValues object
          // if key is account_number, add *** to initial value
          if (eachBankAccountKey == 'account_number') {
            object[eachBankAccountKey] = flat.bank_account[eachBankAccountKey] + '***'
          } else {
            object[eachBankAccountKey] = flat.bank_account[eachBankAccountKey];
          }
        }
      });
    }
    // CALCULATED fields on document
    // set payment due date for fees same as rent payment due date
    if (flat.payment_due_date) {
      object.fees_payment_due_date = flat.payment_due_date;
    }

    if (flat.deposit) {
      object.deposit_amount = (flat.price_per_month * flat.deposit);
    }

    if (flat.price_per_month) {
      // convert float to integer by multiplying flat by integer
      object.price_per_month = (flat.price_per_month * 1);
    }

    // handle rent_payment_method;
    if (flat.rent_payment_method) {
      // if bank transfer, nothing filled on the place to deliver rent line
      if (flat.rent_payment_method == 'bank_transfer') {
        object.rent_payment_method = '';
      } else {
        // if not bank transfer, get the choice from the constants object
        let choice = {}
        // get the choice with the value ==
        _.each(RentPayment.rent_payment_method.choices, eachChoice => {
          if (eachChoice.value == flat.rent_payment_method) {
            // if match record in flat, assign to choice
            choice = eachChoice;
          }
        })
        // if choice is empty, user has entered own method
        if (!_.isEmpty(choice)) {
          // if standard input other than bank transfer, assign method to object
          // get language jp or en
          object.rent_payment_method = choice[appLanguageCode]
        } else {
          // if empty, it is own entry so assign to objct
          object.rent_payment_method = flat.rent_payment_method;
        }
        // if not bank transfer, do not put rectangle on transfer fee paid by
        object.transfer_fee_paid_by = '';
      }
      // end of else
    }
    // end of if flat.rent_payment_method
    // calculate number of facilties, car park, bicycle parking, etc
    // and get a string of their numbers 1A, 2D etc.
    if (flat.facilities) {
      // console.log('in create_edit_document, getInitialValueObject, flat.facilities: ', flat.facilities);
      // set up arrays for each facility
      const carParkingArray = [];
      const bicycleParkingArray = [];
      const motorcycleParkingArray = [];
      const storageArray = [];
      // set up array of each array;
      const facilityArray = [carParkingArray, bicycleParkingArray, motorcycleParkingArray, storageArray];
      // const yardArray = []
      // specify which facility_types should be iterated over
      const facilityTypes = ['car_parking', 'bicycle_parking', 'motorcycle_parking', 'storage'];
      // iterate through each facility.js facility_type choices
      _.each(Facility.facility_type.choices, eachChoice => {
        // iterate over each facility assigned to flat
        _.each(flat.facilities, eachFacility => {
          if (eachFacility.facility_type == eachChoice.value && facilityTypes.includes(eachFacility.facility_type)) {
            // if there is a facility that match the choices and the types that we care about
            // push them in respective arrays
            eachFacility.facility_type == 'car_parking' ? carParkingArray.push(eachFacility) : '';
            eachFacility.facility_type == 'bicycle_parking' ? bicycleParkingArray.push(eachFacility) : '';
            eachFacility.facility_type == 'motorcycle_parking' ? motorcycleParkingArray.push(eachFacility) : '';
            eachFacility.facility_type == 'storage' ? storageArray.push(eachFacility) : '';
            // eachFacility.facility_type == 'dedicated_yard' ? yardArray.push(eachFacility) : '';
          }
        })
      })
      // console.log('in create_edit_document, getInitialValueObject, facilityArray: ', facilityArray);
      // console.log('in create_edit_document, getInitialValueObject, carParkingArray, bicycleParkingArray, motorcycleParkingArray, storageArray, yardArray: ', carParkingArray, bicycleParkingArray, motorcycleParkingArray, storageArray, yardArray);
      // facilityUsageFeeCount to calculate total of all facilities to charge
      let facilityUsageFeeCount = 0;
      // iterate over each array in array of of arrays
      _.each(facilityArray, eachArray => {
        // console.log('in create_edit_document, getInitialValueObject, eachArray: ', eachArray);
        // if an array has something in it, count how many and form their strings
        if (eachArray.length > 0) {
          let count = 0;
          let facilitySpaces = ''
          _.each(eachArray, each => {
            // console.log('in create_edit_document, getInitialValueObject, each: ', each);
            // console.log('in create_edit_document, getInitialValueObject, each: ', each);
            if (count > 0) {
              facilitySpaces = facilitySpaces.concat(', ')
              facilitySpaces = facilitySpaces.concat(each.facility_number)
              // console.log('in create_edit_document, getInitialValueObject, facilitySpaces, count if > 0: ', facilitySpaces, count);
              count++;
            } else {
              facilitySpaces = facilitySpaces.concat(each.facility_number)
              // console.log('in create_edit_document, getInitialValueObject, facilitySpaces, count else: ', facilitySpaces, count);
              count++;
            }
            // get the choice that corresponds to each facility in facility types
            const choiceInEach = getChoice(each);
            // console.log('in create_edit_document, getInitialValueObject, choiceInEach.facilityObjectMap, flat[choiceInEach.facilityObjectMap]: ', choiceInEach.facilityObjectMap, flat[choiceInEach.facilityObjectMap]);
            // if facility NOT included, add up price_per_month
            if (!flat[choiceInEach.facilityObjectMap]) {
              facilityUsageFeeCount += each.price_per_month;
            }
          })
          // console.log('in create_edit_document, getInitialValueObject, facilitySpaces, count: ', facilitySpaces, count);
          // get the choice that corresponds to the facility_type
          const choice = getChoice(eachArray[0]);
          //set each parking_spaces and parking_space_number for car, bicycle, motorcycle and storage
          object[choice.documentFormMap1] = count;
          object[choice.documentFormMap2] = facilitySpaces;
          object.facilities_usage_fee = facilityUsageFeeCount;
        }
      });
    }
    // form string for user owner names
    if (userOwner.profile.first_name && userOwner.profile.last_name) {
      const fullName = userOwner.profile.last_name.concat(` ${userOwner.profile.first_name}`);
      object.owner_name = fullName;
      object.owner_phone = userOwner.profile.phone;
    }

    // form string for user tenant names
    if (booking.user.profile.first_name && booking.user.profile.last_name) {
      const fullName = booking.user.profile.last_name.concat(` ${booking.user.profile.first_name}`);
      object.tenant_name = fullName;
      object.tenant_phone = tenant.profile.phone;
    }

    // form string for address of user owner
    if (userOwner.profile.address1 && userOwner.profile.city) {
      if (userOwner.profile.country.toLowerCase() == 'japan' || '日本'　|| '日本国') {
        let fullAddress = ''
        fullAddress = fullAddress.concat(`${userOwner.profile.zip}${userOwner.profile.state}${userOwner.profile.state}${userOwner.profile.city}${userOwner.profile.address1}`);
        object.owner_address = fullAddress;
      }
    }

    // form get age of tenant
    if (tenant.profile.birthday) {
      const age = calculateAge(tenant.profile.birthday);
      object.tenant_age = age;
    }

    if (flat.building.building_owner_name) {
      object.building_owner_name = flat.building.building_owner_name;
      object.building_owner_address = flat.building.building_owner_address;
      object.building_owner_phone = flat.building.building_owner_phone;
    }

    console.log('in create_edit_document, getInitialValueObject, tenant.profile: ', tenant.profile);
    if (tenant.profile.emergency_contact_name) {
      object.emergency_contact_name = tenant.profile.emergency_contact_name;
      object.emergency_contact_phone = tenant.profile.emergency_contact_phone;
      object.emergency_contact_address = tenant.profile.emergency_contact_address;
      object.emergency_contact_relationship = tenant.profile.emergency_contact_relationship;
    }


      // end of each Object.keys flat.bank_account
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

  // get contract length object with years and months
  const contractLengthObject = getContractLength(booking);
  object.contract_length_years = contractLengthObject.years;
  object.contract_length_months = contractLengthObject.months;

  if (contractLengthObject.years >= 1) {
    const contractEndNoticePeriodObject = getContractEndNoticePeriodObject(booking);
    object.notice_from_year = contractEndNoticePeriodObject.from.year;
    object.notice_from_month = contractEndNoticePeriodObject.from.month;
    object.notice_from_day = contractEndNoticePeriodObject.from.day;
    object.notice_to_year = contractEndNoticePeriodObject.to.year;
    object.notice_to_month = contractEndNoticePeriodObject.to.month;
    object.notice_to_day = contractEndNoticePeriodObject.to.day;
  }

  console.log('in create_edit_document, getInitialValueObject, object: ', object);
  // return object for assignment to initialValues in mapStateToProps
  return object;
}

function mapStateToProps(state) {
  // const testObject = { address: 'まかろに町', flat_building_name: 'ほうれん荘', auto_lock: true, bath: true, rooms: 1 };
  if (state.bookingData.fetchBookingData) {
    const flat = state.bookingData.fetchBookingData.flat;
    const booking = state.bookingData.fetchBookingData;
    const userOwner = state.bookingData.user;
    const tenant = state.bookingData.fetchBookingData.user
    // console.log('in create_edit_document, mapStateToProps, flat: ', flat);
    // console.log('in create_edit_document, mapStateToProps, DocumentForm: ', DocumentForm);
    const initialValues = getInitialValueObject(flat, booking, userOwner, tenant, state.languages.appLanguageCode);

    console.log('in create_edit_document, mapStateToProps, state: ', state);
    return {
      // flat: state.selectedFlatFromParams.selectedFlat,
      errorMessage: state.auth.error,
      auth: state.auth,
      appLanguageCode: state.languages.appLanguageCode,
      bookingData: state.bookingData.fetchBookingData.flat,
      userOwner: state.bookingData.user,
      tenant: state.bookingData.fetchBookingData.user,
      initialValues,
      // initialValues: testObject,
      documents: state.documents,
      requiredFieldsNull: state.bookingData.requiredFields
    };
  } else {
    return {};
  }
}

export default connect(mapStateToProps, actions)(CreateEditDocument);
