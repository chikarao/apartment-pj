import React, { Component } from 'react';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';
import * as actions from '../../actions';
// import DocumentForm from '../constants/document_form';
import Documents from '../constants/documents';
import Building from '../constants/building';
import SelectField from '../forms/select_field';

import DocumentChoices from './document_choices';
import AppLanguages from '../constants/app_languages';
// import RentPayment from '../constants/rent_payment';
// import Facility from '../constants/facility';
// import Tenants from '../constants/tenants';
// import getInitialValuesObjectFixedTermContract from '../functions/get_initialvalues_object-fixed-term-contract.js';
// let updateCount = 0;

class CreateEditDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // set up state to take input from user
      clickedInfo: { elementX: '', elementY: '', page: '' },
    };
  }

  // initialValues section implement after redux form v7.4.2 updgrade
  // started to force mapStateToProps to be called for EACH Field element;
  // so to avoid Documents[documentKey].method to be called in each msp call
  //(over 100! for important ponts form) use componentDidUpdate;
  // Then to avoid .method to be called after each user input into input field,
  // use shouldComponentUpdate in document_choices; if return false, will not call cdu
  componentDidMount() {
    // document.addEventListener('click', this.printMousePos);
    // document.addEventListener('click', this.printMousePos1);
    // console.log('in create_edit_document, componentDidUpdate');
    if (this.props.bookingData) {
      const {
        flat,
        booking,
        userOwner,
        tenant,
        appLanguageCode,
        // documentFields,
        documentLanguageCode,
        assignments,
        contracts,
        documentKey
      } = this.props;
      const documentFields = Documents[documentKey].form
      // const documentKey = state.documents.createDocumentKey;
      const initialValuesObject = Documents[documentKey].method({ flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentLanguageCode });
      this.props.setInitialValuesObject(initialValuesObject);
    }
  }

  // componentDidUpdate() {
    // if (updateCount < 2) {
      // updateCount++;
    // }
  // }

  // printMousePos1 = (event) => {
  //   // custom version of layerX; takes position of container and
  //   // position of click inside container and takes difference to
  //   // get the coorindates of click inside container on page
  //   // yielded same as layerX and layerY
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
    _.each(Object.keys(this.props.documentFields), pageKey => {
      // if the object has the key, that is the page the key is on
      // so set page variable so we can get choices from input key
      _.each(Object.keys(this.props.documentFields[pageKey]), eachKey => {
        if (this.props.documentFields[pageKey][eachKey].required) {
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
      // console.log('in create_edit_document, checkOtherChoicesVal, choice, key, data[key]: ', choice, key, data[key]);
      if (choice.params.val == data[key]) {
        haveOrNot = true;
      }
    });
    return haveOrNot;
  }

  handleFormSubmit(data) {
    console.log('in create_edit_document, handleFormSubmit, data: ', data);
    // object to send to API; set flat_id
    // const contractName = 'teishaku-saimuhosho';
    const contractName = Documents[this.props.createDocumentKey].file;
    const paramsObject = { flat_id: this.props.flat.id, contract_name: contractName }
    // iterate through each key in data from form

    const requiredKeysArray = this.getRequiredKeys();
    // console.log('in create_edit_document, handleFormSubmit, requiredKeysArray: ', requiredKeysArray);
    const nullRequiredKeys = this.checkIfRequiredKeysNull(requiredKeysArray, data)
    console.log('in create_edit_document, handleFormSubmit, nullRequiredKeys, contractName, requiredKeysArray : ', nullRequiredKeys, contractName, requiredKeysArray );

    _.each(Object.keys(data), key => {
      let page = 0;
      // find out which page the key is on
      // iterate through Document form first level key to see if each object has key in quesiton
      _.each(Object.keys(this.props.documentFields), pageKey => {
        // console.log('in create_edit_document, handleFormSubmit, key, pageKey, (toString(key) in this.props.documentFields[pageKey]), pageKey: ', key, pageKey, (key in this.props.documentFields[pageKey]), this.props.documentFields[pageKey]);
        // if the object has the key, that is the page the key is on
        // so set page variable so we can get choices from input key
        if (key in this.props.documentFields[pageKey]) {
          page = pageKey;
        }
      });
      // console.log('in create_edit_document, handleFormSubmit, key is on page: ', page);
      // console.log('in create_edit_document, handleFormSubmit, data[key]: ', data[key]);
      // this.props.documentFields[key].params.value = data[key];
      // paramsObject[key] = this.props.documentFields[key].params;
      let choice = {};
      _.each(this.props.documentFields[page][key].choices, eachChoice => {
        // console.log('in create_edit_document, handleFormSubmit, eachChoice: ', eachChoice);
        // val = '' means its an input element, not a custom field component
        if (eachChoice.params.val == 'inputFieldValue') {
          choice = eachChoice;
          // console.log('in create_edit_document, handleFormSubmit, choice for empty string val: ', choice);
          // add data[key] (user choice) as value in the object to send to API
          // check for other vals of choices if more than 1 choice
          const otherChoicesHaveVal = Object.keys(this.props.documentFields[page][key].choices).length > 1 ? this.checkOtherChoicesVal(this.props.documentFields[page][key].choices, key, data) : false;
          if (!otherChoicesHaveVal) {
            choice.params.value = data[key];
            choice.params.page = page;
            choice.params.name = this.props.documentFields[page][key].name
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
          choice.params.name = this.props.documentFields[page][key].name
          paramsObject[key] = choice.params;
        }
      });
    });
    console.log('in create_edit_document, handleFormSubmit, object for params in API paramsObject: ', paramsObject);
    if (nullRequiredKeys.length > 0) {
      // console.log('in create_edit_document, handleFormSubmit, construction is required: ', data['construction']);
      this.props.authError('The fields highlighted in blue are required.');
      this.props.requiredFields(nullRequiredKeys);
    } else {
      this.props.authError('');
      this.props.requiredFields([]);
      // this.props.createContract(paramsObject, () => {});
    }
  }

  getModelChoice(model, choice, name) {
    // model refers to a constants file eg building.js
    let returnedChoice;
    _.each(model[name].choices, eachChoice => {
      // console.log('in create_edit_document, getModelChoice model, choice, name, eachChoice: ', model, choice, name, eachChoice);
      // console.log('in create_edit_document, getModelChoice eachChoice, choice.params, eachChoice.value, choice.params.val, eachChoice.value == choice.params.val: ', eachChoice, choice.params, eachChoice.value, choice.params.val, eachChoice.value == choice.params.val);
      if (eachChoice.value === choice.params.val) {
        returnedChoice = eachChoice;
        return;
      }
    });
    return returnedChoice;
  }

  renderSelectChoices(choices, model, name) {
    // rendering options for select fields
  return _.map(Object.keys(choices), (eachKey, i) => {
    const modelChoice = this.getModelChoice(model, choices[eachKey], name);
    // console.log('in create_edit_document, renderSelectChoices, name, modelChoice: ', name, modelChoice);
    const languageCode = this.props.documentLanguageCode;
        return (
        <option key={i} value={choices[eachKey].params.val}>{modelChoice[languageCode]}</option>
      );
    // }
  });
}

  renderEachDocumentField(page) {
    let fieldComponent = '';
    // if (this.props.documentFields[page]) {
      return _.map(this.props.documentFields[page], (formField, i) => {
        console.log('in create_edit_document, renderEachDocumentField');
        // console.log('in create_edit_document, renderEachDocumentField, page, this.props.documentFields[page], formField ', page, this.props.documentFields[page], formField);
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
          // console.log('in create_edit_document, renderEachDocumentField, formField.name this.props.requiredFieldsNull, nullRequiredField: ', formField.name, this.props.requiredFieldsNull, nullRequiredField);
        }
        let otherChoiceValues = [];
        if (fieldComponent == DocumentChoices) {
          _.each(formField.choices, eachChoice => {
            // console.log('in create_edit_document, renderEachDocumentField, eachChoice: ', eachChoice);
            if ((eachChoice.params.val !== 'inputFieldValue') && (formField.type != 'boolean')) {
              otherChoiceValues.push(eachChoice.params.val.toLowerCase());
            }
          })
        }
        // console.log('in create_edit_document, renderEachDocumentField,otherChoiceValues: ', otherChoiceValues);

        if (fieldComponent == 'select') {
          return (
            <div
              style={{ position: 'absolute', top: formField.choices[0].params.top, left: formField.choices[0].params.left, width: formField.choices[0].params.width, borderColor: formField.borderColor, height: formField.choices[0].params.height }}
              key={i}
            >
              <Field
                key={i}
                name={formField.name}
                component={fieldComponent}
                // pass page to custom compoenent, if component is input then don't pass
                // props={fieldComponent == DocumentChoices ? { page, required: formField.required, nullRequiredField, formFields: Documents[this.props.createDocumentKey].form, charLimit: formField.charLimit } : {}}
                type={formField.type}
                className={'form-control'}
                style={{ height: formField.choices[0].params.height, margin: formField.choices[0].params.margin }}
                // className={formField.component == 'input' ? 'form-control' : ''}
              >
                {this.renderSelectChoices(formField.choices, formField.mapToModel, formField.name)}
              </Field>
            </div>
          );
        } else {
          return (
            <Field
              key={i}
              name={formField.name}
              component={fieldComponent}
              // pass page to custom compoenent, if component is input then don't pass
              props={fieldComponent == DocumentChoices ? { page, required: formField.required, nullRequiredField, formFields: Documents[this.props.createDocumentKey].form, charLimit: formField.charLimit, otherChoiceValues } : {}}
              type={formField.type}
              className={formField.component == 'input' ? 'form-control' : ''}
              style={formField.component == 'input' ? { position: 'absolute', top: formField.choices[0].params.top, left: formField.choices[0].params.left, width: formField.choices[0].params.width, borderColor: formField.borderColor, height: formField.choices[0].params.height, padding: formField.choices[0].params.padding } : {}}
            />
          );
        }
      });
    // }
  }
  // NOT USED; Experiment for creating new input fields
  renderNewElements(page) {
    const documentEmpty = _.isEmpty(this.props.documents);
    if (!documentEmpty) {
      const { newElement } = this.props.documents;
      console.log('in create_edit_document, renderNewElements, newElement: ', newElement);
      if (newElement.page == page) {
        // console.log('in create_edit_document, renderNewElements, newElement.page, page: ', newElement.page, page);
        return (
          <Field
            key={newElement.name}
            name={newElement.name}
            component={newElement.component}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == DocumentChoices ? { page } : {}}
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
    const initialValuesEmpty = _.isEmpty(this.props.initialValues);
    if (!initialValuesEmpty) {
      //      <div id="banner" style={{ background: `url(${this.createBackgroundImage('banner_image_1')}` }}>
      // <div className="test-image-pdf-jpg" style={{ background: `url(${this.createBackgroundImageForDocs('phmzxr1sle99vzwgy0qn')})` }}>
      // {this.renderAlert()}
      // <div id="document-background" className="test-image-pdf-jpg-background" style={{ background: `url(${this.createBackgroundImageForDocs('teishasaku-saimuhosho' + '.jpg')})` }}>
      const image = Documents[this.props.createDocumentKey].file;
      // const page = 1;
      // {this.renderNewElements(page)}
      return _.map(Object.keys(this.props.documentFields), page => {
        console.log('in create_edit_document, renderDocument, page: ', page);
        return (
            <div
              key={page}
              value={page}
              id="document-background"
              className="test-image-pdf-jpg-background"
              style={{ backgroundImage: `url(http://res.cloudinary.com/chikarao/image/upload/w_792,h_1122,q_60,pg_${page}/${image}.jpg)` }}
            >
              {this.renderEachDocumentField(page)}
            </div>
        );
      });
    }
  }


  render() {
    const { handleSubmit, appLanguageCode } = this.props;
    // console.log('CreateEditDocument, render, this.props', this.props);
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
  form: 'CreateEditDocument',
  enableReinitialize: true,
  // keepDirtyOnReinitialize: true
})(CreateEditDocument);

function mapStateToProps(state) {
  // const initialValuesObjectEmpty = _.isEmpty(state.documents.initialValuesObject);
  if (state.bookingData.fetchBookingData) {
    let initialValues = {};
    // bookingData.flat gives access to flat.building.inspections
    // const flat = state.bookingData.flat;
    // const booking = state.bookingData.fetchBookingData;
    // const userOwner = state.bookingData.user;
    // const tenant = state.bookingData.fetchBookingData.user;
    // const appLanguageCode = state.languages.appLanguageCode;
    // const documentLanguageCode = state.languages.documentLanguageCode;
    // const assignments = state.bookingData.assignments;
    // const contracts = state.bookingData.contracts;
    // // !!!!!!!!documentKey sent as app state props from booking_cofirmation.js after user click
    // // setCreateDocumentKey action fired and app state set
    // // define new documents in constants/documents.js by identifying
    // // document key eg fixed_term_rental_contract_jp, form and method for setting initialValues
    const documentKey = state.documents.createDocumentKey;
    const documentFields = Documents[documentKey].form;
    // initialValues populates forms with data in backend database
    // parameters sent as props to functions/xxx.js methods
    // const values = Documents[documentKey].method({ flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentLanguageCode });
    // initialValues = Documents[documentKey].method({ flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentLanguageCode });
    initialValues = state.documents.initialValuesObject;
    // const initialValues = { address: '1 Never never land' }

    // console.log('in create_edit_document, mapStateToProps, initialValues: ', initialValues);
    // console.log('in create_edit_document, mapStateToProps, state: ', state);
    console.log('in create_edit_document, mapStateToProps only:');
    return {
      // flat: state.selectedFlatFromParams.selectedFlat,
      errorMessage: state.auth.error,
      auth: state.auth,
      // appLanguageCode: state.languages.appLanguageCode,
      // documentLanguageCode: state.languages.documentLanguageCode,
      bookingData: state.bookingData.fetchBookingData.flat,
      // userOwner: state.bookingData.user,
      // tenant: state.bookingData.fetchBookingData.user,
      // initialValues: state.documents.initialValuesObject,
      initialValues,
      // initialValues: testObject,
      documents: state.documents,
      requiredFieldsNull: state.bookingData.requiredFields,
      createDocumentKey: state.documents.createDocumentKey,
      // !!!!!!for initialValues to be used in componentDidMount
      documentFields,
      flat: state.bookingData.flat,
      booking: state.bookingData.fetchBookingData,
      userOwner: state.bookingData.user,
      tenant: state.bookingData.fetchBookingData.user,
      appLanguageCode: state.languages.appLanguageCode,
      documentLanguageCode: state.languages.documentLanguageCode,
      assignments: state.bookingData.assignments,
      contracts: state.bookingData.contracts,
      // !!!!!!!!documentKey sent as app state props from booking_cofirmation.js after user click
      // setCreateDocumentKey action fired and app state set
      // define new documents in constants/documents.js by identifying
      // document key eg fixed_term_rental_contract_jp, form and method for setting initialValues
      documentKey: state.documents.createDocumentKey,
    };
  } else {
    return {};
  }
}

export default connect(mapStateToProps, actions)(CreateEditDocument);
