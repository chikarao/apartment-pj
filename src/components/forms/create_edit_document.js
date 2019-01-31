import React, { Component } from 'react';
import _ from 'lodash';
import { reduxForm, Field, isDirty } from 'redux-form';
// gettting proptypes warning with isDirty
// import { isDirty } from 'redux-form/immutable'
import { connect } from 'react-redux';
// import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
// import cloudinary from 'cloudinary-core';
import * as actions from '../../actions';
// import DocumentForm from '../constants/document_form';
import Documents from '../constants/documents';
// import Building from '../constants/building';
// import SelectField from '../forms/select_field';

import DocumentChoices from './document_choices';
import AppLanguages from '../constants/app_languages';

// NOTE: userOwner is currently assumed to be the user and is the landlord on documents;
// flatOwner is the title holder of the flat on documents
//  and its input is taken on craeteFlat, editFlat and flatLanuages

class CreateEditDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // set up state to take input from user
      clickedInfo: { elementX: '', elementY: '', page: '' },
      valueWhenInputFocused: '',
      inputFocused: {},
      showDocumentPdf: false,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    // this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleFormCloseDeleteClick = this.handleFormCloseDeleteClick.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleViewPDFClick = this.handleViewPDFClick.bind(this);
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
        documentKey,
        contractorTranslations,
        staffTranslations
      } = this.props;
      const documentFields = Documents[documentKey].form
      let initialValuesObject = {};
      // console.log('in create_edit_document, componentDidMount, flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentLanguageCode', flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentLanguageCode);
      // const documentKey = state.documents.createDocumentKey;
      // if showing a saved document (props set in booking_confirmation.js)
      if (this.props.showSavedDocument) {
        // get values of each agreement document field
        // const agreement = this.getAgreement(this.props.agreementId)
        const agreement = this.props.agreement || {};
        const returnedObject = this.getSavedInitialValuesObject({ agreement });
        initialValuesObject = { initialValuesObject: returnedObject.initialValuesObject, agreementMappedByName: returnedObject.agreementMappedByName, agreementMappedById: returnedObject.agreementMappedById, allFields: {} }
      } else {
        initialValuesObject = Documents[documentKey].method({ flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentLanguageCode, documentKey, contractorTranslations, staffTranslations });
        // console.log('in create_edit_document, componentDidMount, else in if showSavedDocument documentKey, initialValuesObject, flat, booking, userOwner, tenant', documentKey, initialValuesObject, flat, booking, userOwner, tenant);
      }
      // console.log('in create_edit_document, componentDidMount, this.props.agreementId, initialValuesObject', this.props.agreementId, initialValuesObject);
      this.props.setInitialValuesObject(initialValuesObject);
    }
  }

  getSavedInitialValuesObject({ agreement }) {
    // console.log('in create_edit_document, getSavedInitialValuesObject, agreement: ', agreement);
    const initialValuesObject = {};
    const agreementMappedByName = {}
    const agreementMappedById = {}
    // populate initialValues object with backend persisted data;
    // true and false need to be set again since agreement.value is a string column
    // and cannot persist boolean in backend
    initialValuesObject.document_name = agreement.document_name;

    _.each(agreement.document_fields, eachField => {
      if (eachField.value == 'f') {
        initialValuesObject[eachField.name] = false;
      } else if (eachField.value == 't') {
        initialValuesObject[eachField.name] = true;
      } else {
        initialValuesObject[eachField.name] = eachField.value;
      }
      agreementMappedByName[eachField.name] = eachField
      agreementMappedById[eachField.id] = eachField
    });
    return { initialValuesObject, agreementMappedByName, agreementMappedById };
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

  getSelectChoice(choices, value) {
    // model refers to a constants file eg building.js
    console.log('in create_edit_document, getSelectChoice choices, value: ', choices, value);
    let returnedChoice;
    _.each(choices, eachChoice => {
      // console.log('in create_edit_document, getModelChoice eachChoice, choice.params, eachChoice.value, choice.params.val, eachChoice.value == choice.params.val: ', eachChoice, choice.params, eachChoice.value, choice.params.val, eachChoice.value == choice.params.val);
      if (eachChoice.value === value) {
        returnedChoice = eachChoice;
        return;
      }
    });
    return returnedChoice;
  }

  // handleFormSubmitSave(dataPassed) {
  //   console.log('in create_edit_document, handleFormSubmitSave, data: ', data);
  //   const data = dataPassed.data;
  //   const contractName = Documents[this.props.createDocumentKey].file;
  //   const paramsObject = { flat_id: this.props.flat.id, contract_name: contractName }
  //
  // }
  getDeltaFields(dataFormSubmit) {
    console.log('in create_edit_document, getDeltaFields dataFormSubmit, this.props.initialValues: ', dataFormSubmit, this.props.initialValues);
    const delta = {};
    _.each(Object.keys(dataFormSubmit), key => {
      if (dataFormSubmit[key] !== this.props.initialValues[key]) {
        console.log('in create_edit_document, getDeltaFields dataFormSubmit[key], this.props.initialValues[key]: ', dataFormSubmit[key], this.props.initialValues[key]);
        delta[key] = dataFormSubmit[key];
      }
    });
    console.log('in create_edit_document, getDeltaFields delta: ', delta);
    return delta;
  }

  handleFormSubmit({ data, submitAction }) {
    // console.log('in create_edit_document, handleFormSubmit, data, this.props, this.props.allFields, submitAction: ', data, this.props, this.props.allFields, submitAction);
    // object to send to API; set flat_id
    // const contractName = 'teishaku-saimuhosho';
    const contractName = Documents[this.props.createDocumentKey].file;
    const paramsObject = {
      flat_id: this.props.flat.id,
      template_file_name: contractName,
      document_code: this.props.createDocumentKey,
      booking_id: this.props.booking.id,
      document_name: data.document_name,
      document_field: [],
      agreement_id: this.props.agreement ? this.props.agreement.id : null
    };
    // iterate through each key in data from form

    const requiredKeysArray = this.getRequiredKeys();
    // console.log('in create_edit_document, handleFormSubmit, requiredKeysArray: ', requiredKeysArray);
    const nullRequiredKeys = this.checkIfRequiredKeysNull(requiredKeysArray, data)

    // _.each(Object.keys(data), key => {
    // allFields is array of all keys (only) in a document
    let fields = {};
    if (this.props.showSavedDocument) {
      // get delta from data and initialValues
      fields = this.getDeltaFields(data);
    } else {
      fields = this.props.allFields;
    }
      // console.log('in create_edit_document, handleFormSubmit, fields, this.props.documentFields: ', fields, this.props.documentFields);
    // iterate through all fields or just delta fields depending on showSavedDocument
    // ie user is editing an already saved document
    _.each(Object.keys(fields), key => {
      // console.log('in create_edit_document, handleFormSubmit, key : ', key);
      let page = 0;
      // find out which page the key is on
      // iterate through Document form first level key to see if each object has key in quesiton
      _.each(Object.keys(this.props.documentFields), eachPageKey => {
        // console.log('in create_edit_document, handleFormSubmit, key, eachPageKey, (toString(key) in this.props.documentFields[eachPageKey]), eachPageKey: ', key, eachPageKey, (key in this.props.documentFields[eachPageKey]), this.props.documentFields[eachPageKey]);
        // if the object has the key, that is the page the key is on
        // so set page variable so we can get choices from input key
        if (key in this.props.documentFields[eachPageKey]) {
          page = eachPageKey;
        }
      });
      // console.log('in create_edit_document, handleFormSubmit, key is on page: ', page);
      // console.log('in create_edit_document, handleFormSubmit, data[key]: ', data[key]);
      // this.props.documentFields[key].params.value = data[key];
      // paramsObject.document_field.push(this.props.do)cumentFields[key].params;
      let choice = {};
      _.each(this.props.documentFields[page][key].choices, eachChoice => {
        // console.log('in create_edit_document, handleFormSubmit, key, eachChoice, data[key]: ', key, eachChoice, data[key]);
        // val = '' means its an input element, not a custom field component
        if (eachChoice.params.val == 'inputFieldValue') {
          choice = eachChoice;
          // add data[key] (user choice) as value in the object to send to API
          // check for other vals of choices if more than 1 choice
          // in case input has the same value as other buttons
          const otherChoicesHaveVal = Object.keys(this.props.documentFields[page][key].choices).length > 1 ? this.checkOtherChoicesVal(this.props.documentFields[page][key].choices, key, data) : false;
          if (!otherChoicesHaveVal) {
            if (this.props.showSavedDocument) {
              choice.params.id = this.props.agreementMappedByName[key].id
            }
            choice.params.page = page;
            choice.params.name = this.props.documentFields[page][key].name
            if (key in data) {
              choice.params.value = data[key]
              // if need to show full local language text on PDF, use documentLanguageCode from model choice
              if (choice.showLocalLanguage) {
                // get choice on model eg building choice SRC for en is Steel Reinforced Concrete
                const selectChoice = this.getSelectChoice(choice.selectChoices, data[key]);
                // assign display as an attribute in choice params
                choice.params.display_text = selectChoice[this.props.documentLanguageCode];
                // paramsObject.document_field.push(choice.params);
              }
            } else {
              choice.params.value = '';
            }
              // add params object with the top, left, width etc. to object to send to api
              // console.log('in create_edit_document, handleFormSubmit, eachChoice.params.val, key, data[key] choice.params, if null: ', eachChoice.params.val, key, data[key], choice.params);
            paramsObject.document_field.push(choice.params);
          }
        } // end of if inputFieldValue
        // in case of button and there is data[key]
        // console.log('in create_edit_document, handleFormSubmit, key, eachChoice.params.val == data[key] eachChoice.params.val, data[key] eachChoice, eachChoice.params: ', key, eachChoice.params.val == data[key], eachChoice.params.val, data[key], eachChoice, eachChoice.params);
        // console.log('in create_edit_document, handleFormSubmit, eachChoice.params.val == data[k]: ', eachChoice.params.val == data[key]);
        // console.log('in create_edit_document, handleFormSubmit, typeof eachChoice.params.val, typeof data[k]: ', typeof eachChoice.params.val, typeof data[key]);
        let dataRefined = ''
        if (data[key] == 'true') {
          dataRefined = true;
        } else if (data[key] == 'false') {
          dataRefined = false;
        } else {
          dataRefined = data[key];
        }

        if (eachChoice.params.val == dataRefined) {
          console.log('in create_edit_document, handleFormSubmit, eachChoice, key : ', eachChoice, key);
          choice = eachChoice;
          if (this.props.showSavedDocument) {
            choice.params.id = this.props.agreementMappedByName[key].id
          }
          if (choice.showLocalLanguage) {
            // get choice on model eg building choice SRC for en is Steel Reinforced Concrete
            const selectChoice = this.getSelectChoice(choice.selectChoices, dataRefined);
            // assign display as an attribute in choice params
            choice.params.display_text = selectChoice[this.props.documentLanguageCode];
          }
          choice.params.value = data[key];
          choice.params.page = page;
          choice.params.name = this.props.documentFields[page][key].name
          paramsObject.document_field.push(choice.params);
        }

          // if (eachChoice.params.input_type == 'button' && !(key in data)) {
          //   choice = eachChoice;
          //   // console.log('in create_edit_document, handleFormSubmit, eachChoice.params.val, key, data[key] choice.params: ', eachChoice.params.val, key, data[key], choice.params);
          //   choice.params.value = ;
          //   choice.params.page = page;
          //   choice.params.name = this.props.documentFields[page][key].name
          //   paramsObject.document_field.push(choice.params);
          // }
      }); // end of documentFields each choice
    }); // end of each Object.keys(data)
    console.log('in create_edit_document, handleFormSubmit, object for params in API paramsObject: ', paramsObject);
    if (nullRequiredKeys.length > 0) {
      // if required keys that are null exist
      // console.log('in create_edit_document, handleFormSubmit, construction is required: ', data['construction']);
      this.props.authError('The fields highlighted in blue are required.');
      this.props.requiredFields(nullRequiredKeys);
    } else if (submitAction == 'create') {
      this.props.authError('');
      this.props.requiredFields([]);
      // !!!!!!!create contract is creating a pdf
      this.props.showLoading();
      this.props.createContract(paramsObject, () => { this.props.showLoading(); });
    } else if (submitAction == 'save_and_create') {
      this.props.authError('');
      this.props.requiredFields([]);
      // sets flag save_and_create for the backend API to save documentFields first before create PDF
      paramsObject.save_and_create = true;
      this.props.editAgreementFields(paramsObject, (agreement) => {
        this.props.showLoading();
        this.setState({ showDocumentPdf: true });
        let initialValuesObject = {};
        // console.log('in create_edit_document, handleFormSubmit, else if save_and_create in callback editAgreementFields agreement: ', agreement);
        const returnedObject = this.getSavedInitialValuesObject({ agreement });
        initialValuesObject = { initialValuesObject: returnedObject.initialValuesObject, agreementMappedByName: returnedObject.agreementMappedByName, agreementMappedById: returnedObject.agreementMappedById }
        // console.log('in create_edit_document, handleFormSubmit, initialValuesObject: ', initialValuesObject);
        this.props.setInitialValuesObject(initialValuesObject);
      });
      this.props.showLoading();
    } else if (submitAction == 'save') {
      if (!this.props.showSavedDocument) {
        this.props.authError('');
        this.props.requiredFields([]);
        // !!!!!!!createAgreement is creating an agreement and document fields in backend API
        this.props.showLoading();
        this.props.createAgreement(paramsObject, (id) => {
          // clear out editHistory and initialValuesObject; keep documentKey!!!!!
          this.props.editHistory({ editHistoryItem: {}, action: 'clear' })
          this.props.setInitialValuesObject({ initialValuesObject: {}, agreementMappedByName: {}, agreementMappedById: {}, allFields: [], overlappedkeysMapped: {} })
          // calls setState({ agreementId: id }) in BookingConfirmation
          // sets agreementId with id of new agreement and same documentKey sent back from API
          this.props.setAgreementId(id);
          // calls setState({ showSavedDocument: true, showDocument: false }) in BookingConfirmation
          // after agreementId is set, unmount create agreement template
          // by this.state showDocument: false, and mount new by showSavedDocument: true
          this.props.goToSavedDocument();
          this.props.showLoading();
        });
      } else {
        this.props.authError('');
        this.props.requiredFields([]);
        // if showSavedDocument set in booking_confirmation, editAgreement
        this.props.editAgreementFields(paramsObject, (agreement) => {
          this.props.showLoading();
          let initialValuesObject = {};
          const returnedObject = this.getSavedInitialValuesObject({ agreement });
          console.log('in create_edit_document, handleFormSubmit, else in callback editAgreementFields agreement: ', agreement);
          initialValuesObject = { initialValuesObject: returnedObject.initialValuesObject, agreementMappedByName: returnedObject.agreementMappedByName, agreementMappedById: returnedObject.agreementMappedById }
          // console.log('in create_edit_document, handleFormSubmit, initialValuesObject: ', initialValuesObject);
          this.props.setInitialValuesObject(initialValuesObject);
          // initialize if a redux form action creator to set initialValues again, but don't need here
          // this.props.initialize(initialValuesObject.initialValuesObject);
        });
        this.props.showLoading();
      }
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
    const languageCode = this.props.documentLanguageCode;
        return (
        <option key={i} value={choices[eachKey].params.val}>{modelChoice[languageCode]}</option>
      );
    // }
  });
}

handleOnBlur(event) {
  // console.log('in create_edit_document, handleOnBlur, event.target.value: ', event.target.value);
  const blurredInput = event.target
  // console.log('DocumentChoices, handleOnBlur, blurredInput', blurredInput);
  // console.log('DocumentChoices, handleOnBlur, this.state.valueWhenInputFocused', this.state.valueWhenInputFocused);
  if (blurredInput.value != this.state.valueWhenInputFocused) {
    const newEditHistoryItem = { before: { value: this.state.valueWhenInputFocused, name: blurredInput.name }, after: { value: blurredInput.value, name: blurredInput.name } }
    // this.setState(prevState => ({
      //   editHistory: [...prevState.editHistory, editHistoryItem]
      // })); // end of setState
      this.props.editHistory({ newEditHistoryItem, action: 'add' });
    }
}

handleOnFocus(event) {
  // console.log('in create_edit_document, handleOnFocus, event.target.value: ', event.target.value);
  const focusedInput = event.target
  const valueWhenInputFocused = event.target.value
  this.setState({ focusedInput, valueWhenInputFocused }, () => {
    // console.log('DocumentChoices, handleOnFocus, this.state.focusedInput', this.state.focusedInput);
  })
}

renderEachDocumentField(page) {
  let fieldComponent = '';
  // if (this.props.documentFields[page]) {
    return _.map(this.props.documentFields[page], (formField, i) => {
      // console.log('in create_edit_document, renderEachDocumentField, formField', formField);
      if (formField.component == 'DocumentChoices') {
        fieldComponent = DocumentChoices;
      } else {
        fieldComponent = formField.component;
      }

      let nullRequiredField = false;
      if (this.props.requiredFieldsNull) {
        if (this.props.requiredFieldsNull.length > 0) {
          nullRequiredField = this.props.requiredFieldsNull.includes(formField.name);
        }
      }

      let otherChoiceValues = [];
      if (fieldComponent == DocumentChoices) {
        _.each(formField.choices, eachChoice => {
          // console.log('in create_edit_document, renderEachDocumentField, eachChoice: ', eachChoice);
          if ((eachChoice.params.val !== 'inputFieldValue') && (formField.input_type != 'boolean')) {
            otherChoiceValues.push(eachChoice.params.val.toLowerCase());
          }
        })
      }
      // console.log('in create_edit_document, renderEachDocumentField,otherChoiceValues: ', otherChoiceValues);
      // select objects that are not DocumentChoices components
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
              onBlur={this.handleOnBlur}
              onFocus={this.handleOnFocus}
              // pass page to custom compoenent, if component is input then don't pass
              // props={fieldComponent == DocumentChoices ? { page, required: formField.required, nullRequiredField, formFields: Documents[this.props.createDocumentKey].form, charLimit: formField.charLimit } : {}}
              type={formField.input_type}
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
            type={formField.input_type}
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

  renderEachDocumentTranslation(page) {
    return _.map(this.props.documentTranslations[page], (documentTranslation, i) => {
      // console.log('in create_edit_document, renderEachDocumentTranslation, documentTranslation.translations[en] : ', documentTranslation.translations['en']);
      return (
        <div
          key={i}
          className={documentTranslation.attributes.class_name}
          style={{
            top: documentTranslation.attributes.top,
            left: documentTranslation.attributes.left,
            fontSize: `${documentTranslation.attributes.font_size}px`,
            fontWeight: documentTranslation.attributes.font_weight,
            transform: `rotate(-${documentTranslation.attributes.rotate}deg)`,
            // transformOrigin: 'top left',
            transformOrigin: documentTranslation.attributes.transform_origin,
            width: documentTranslation.attributes.width,
            textAlign: documentTranslation.attributes.text_align,
          }}
        >
          {documentTranslation.translations[this.props.documentLanguageCode]}
        </div>
      );
    });
  }

  renderDocument() {
    const initialValuesEmpty = _.isEmpty(this.props.initialValues);
    if (!initialValuesEmpty) {
      //      <div id="banner" style={{ background: `url(${this.createBackgroundImage('banner_image_1')}` }}>
      // <div className="test-image-pdf-jpg" style={{ background: `url(${this.createBackgroundImageForDocs('phmzxr1sle99vzwgy0qn')})` }}>
      // {this.renderAlert()}
      // <div id="document-background" className="test-image-pdf-jpg-background" style={{ background: `url(${this.createBackgroundImageForDocs('teishasaku-saimuhosho' + '.jpg')})` }}>
      let image;
      if (this.state.showDocumentPdf) {
        image = this.props.agreement.document_publicid;
      } else {
        image = Documents[this.props.createDocumentKey].file;
      }

      const bilingual = Documents[this.props.createDocumentKey].translation;
      // const page = 1;
      // {this.renderNewElements(page)}
      return _.map(Object.keys(this.props.documentFields), page => {
        // console.log('in create_edit_document, renderDocument, page: ', page);
        return (
            <div
              key={page}
              value={page}
              id="document-background"
              className="test-image-pdf-jpg-background"
              style={{ backgroundImage: `url(http://res.cloudinary.com/chikarao/image/upload/w_792,h_1122,q_60,pg_${page}/${image}.jpg)` }}
            >
              {this.state.showDocumentPdf ? '' : this.renderEachDocumentField(page)}
              {!bilingual ? '' : this.renderEachDocumentTranslation(page)}
            </div>
        );
      });
    }
  }

  handleFormCloseDeleteClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    if (elementVal == 'close') {
      this.props.showSavedDocument ? this.props.closeSavedDocument() : this.props.showDocument();
      this.props.editHistory({ editHistoryItem: {}, action: 'clear' })
      this.props.setCreateDocumentKey('', () => {});
      this.props.setInitialValuesObject({ initialValuesObject: {}, agreementMappedByName: {}, agreementMappedById: {}, allFields: [], overlappedkeysMapped: {} })
    }
    if (elementVal == 'delete') {
      if (window.confirm('Are you sure you want to delete this agreement?')) {
        this.props.showLoading()
        this.props.deleteAgreement(this.props.agreement.id, () => {
          this.props.showLoading();
        });
        this.props.editHistory({ editHistoryItem: {}, action: 'clear' })
        this.props.setCreateDocumentKey('', () => {});
        this.props.setInitialValuesObject({ initialValuesObject: {}, agreementMappedByName: {}, agreementMappedById: {}, allFields: [], overlappedkeysMapped: {} })
        this.props.closeSavedDocument();
        this.props.setAgreementId(null);
      }
    }
  }

  handleViewPDFClick() {
    this.setState({ showDocumentPdf: !this.state.showDocumentPdf }, () => {
      // console.log('in create_edit_document, handleViewPDFClick, this.state.showDocumentPdf: ', this.state.showDocumentPdf);
    })
  }

  swithCreatePDFButton(saveButtonActive, agreementHasPdf) {
    const { handleSubmit, appLanguageCode } = this.props;
    if (this.props.showSavedDocument) {
      return <button
              onClick={
              handleSubmit(data =>
                this.handleFormSubmit({
                  data,
                  submitAction: this.props.showSavedDocument ? 'save_and_create' : 'create'
                }))
              }
              className={'btn document-floating-button'}
              style={{ backgroundColor: 'green' }}
              // className={saveButtonActive ? 'btn document-floating-button' : 'document-floating-button'  }
              // style={saveButtonActive ? { backgroundColor: 'green' } : { backgroundColor: 'white', border: '1px solid lightgray', color: 'lightgray' }}
            >
              {agreementHasPdf ? AppLanguages.updatePdf[appLanguageCode] : AppLanguages.createPdf[appLanguageCode]}
            </button>
    } else {
      return '';
    }
  }

  renderDocumentButtons() {
    const { handleSubmit, appLanguageCode } = this.props;
    let saveButtonActive = false;
    let agreementHasPdf = false;

    if (this.props.formIsDirty && this.props.showSavedDocument) { saveButtonActive = true; }

    if (!this.props.showSavedDocument) { saveButtonActive = true; }

    if (this.props.agreement) {
      if (this.props.agreement.document_publicid) { agreementHasPdf = true; }
    }

    return (
      <div className="document-floating-button-box">
        {agreementHasPdf ?
          <button
            onClick={this.handleViewPDFClick}
            className="btn document-floating-button"
            style={{ backgroundColor: 'blue' }}
          >
            {this.state.showDocumentPdf ? AppLanguages.edit[appLanguageCode] : AppLanguages.viewPdf[appLanguageCode]}
          </button>
          :
          this.swithCreatePDFButton(saveButtonActive, agreementHasPdf)
        }

        {this.state.showDocumentPdf ?
          <a
            className="btn document-floating-button"
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: 'lightgray' }}
            href={`http://res.cloudinary.com/chikarao/image/upload/${this.props.agreement.document_publicid}.pdf`}
          >
          Download
          </a>
          :
          this.swithCreatePDFButton(saveButtonActive, agreementHasPdf)
        }

        {this.props.showSavedDocument ?
          <button
            value='delete'
            className="btn document-floating-button"
            style={{ backgroundColor: 'red' }}
            onClick={this.handleFormCloseDeleteClick}
          >
            {AppLanguages.delete[appLanguageCode]}
          </button>
          : ''
        }
        <button
          value='close'
          className="btn document-floating-button"
          style={{ backgroundColor: 'gray' }}
          onClick={this.handleFormCloseDeleteClick}
        >
          {AppLanguages.close[appLanguageCode]}
        </button>
        <div
            value='save'
            // submit save only if formIsDirty
            onClick={saveButtonActive ?
              handleSubmit(data =>
                this.handleFormSubmit({
                  data,
                  submitAction: 'save'
                }))
                :
                () => {}
            }
            className={saveButtonActive ? 'btn document-floating-button' : 'document-floating-button'  }
            style={saveButtonActive ? { backgroundColor: 'cornflowerblue' } : { backgroundColor: 'white', border: '1px solid lightgray', color: 'lightgray' }}
          >
            {AppLanguages.save[appLanguageCode]}
          </div>
      </div>
    );
  }

  render() {
    return (
      <div className="test-image-pdf-jpg">
            {this.renderDocument()}
            {this.renderAlert()}
            {this.renderDocumentButtons()}
      </div>
    );
  }
  // render() {
  //   const { handleSubmit, appLanguageCode } = this.props;
  //   // console.log('CreateEditDocument, render, this.props', this.props);
  //   return (
  //     <div className="test-image-pdf-jpg">
  //       <div value='close' className="btn document-floating-button" style={{ left: '45%', backgroundColor: 'gray' }} onClick={this.handleFormCloseDeleteClick.bind(this)}>Close</div>
  //       <div value='save' className="btn document-floating-button" style={{ left: '60%', backgroundColor: 'cornflowerblue' }} onClick={this.handleFormCloseDeleteClick.bind(this)}>Save</div>
  //       <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
  //           {this.renderDocument()}
  //           {this.renderAlert()}
  //         <button action="submit" id="submit-all" className="btn document-floating-button" style={{ left: '30%', backgroundColor: 'blue' }}>{AppLanguages.submit[appLanguageCode]}</button>
  //       </form>
  //     </div>
  //   );
  // }
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
    // const documentTranslations = Documents[documentKey].translation;
    const documentTranslations = state.documents.documentTranslations[documentKey];
    // initialValues populates forms with data in backend database
    // parameters sent as props to functions/xxx.js methods
    // const values = Documents[documentKey].method({ flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentLanguageCode });
    // initialValues = Documents[documentKey].method({ flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentLanguageCode });
    initialValues = state.documents.initialValuesObject;
    // const initialValues = { address: '1 Never never land' }
    // selector from redux form; true if any field on form is dirty
    const formIsDirty = isDirty('CreateEditDocument')(state);
    // console.log('in create_edit_document, mapStateToProps, initialValues: ', initialValues);
    console.log('in create_edit_document, mapStateToProps, state: ', state);
    // console.log('in create_edit_document, mapStateToProps, documentTranslations: ', documentTranslations);
    // console.log('in create_edit_document, mapStateToProps state:', state);
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
      allFields: state.documents.allFields,
      editHistoryArrayProp: state.documents.editHistoryArray,
      // !!!!!!for initialValues to be used in componentDidMount
      documentFields,
      documentTranslations,
      flat: state.bookingData.flat,
      booking: state.bookingData.fetchBookingData,
      userOwner: state.bookingData.user,
      tenant: state.bookingData.fetchBookingData.user,
      appLanguageCode: state.languages.appLanguageCode,
      documentLanguageCode: state.languages.documentLanguageCode,
      assignments: state.bookingData.assignments,
      contracts: state.bookingData.contracts,
      contractorTranslations: state.bookingData.contractorTranslations,
      staffTranslations: state.bookingData.staffTranslations,
      // agreements: state.bookingData.agreements,
      // !!!!!!!!documentKey sent as app state props from booking_cofirmation.js after user click
      // setCreateDocumentKey action fired and app state set
      // define new documents in constants/documents.js by identifying
      // document key eg fixed_term_rental_contract_jp, form and method for setting initialValues
      documentKey: state.documents.createDocumentKey,
      agreementMappedByName: state.documents.agreementMappedByName,
      formIsDirty,
      // isDirty: isDirty('CreateEditDocument')(state)
    };
  } else {
    return {};
  }
}

export default connect(mapStateToProps, actions)(CreateEditDocument);
