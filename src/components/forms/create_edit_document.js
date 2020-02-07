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
// NOTE: Documents imports constants/fixed_term_rental_contract etc.
import Documents from '../constants/documents';

import DocumentChoices from './document_choices';
import AppLanguages from '../constants/app_languages';
import DefaultMainInsertFieldsObject from '../constants/default_main_insert_fields';
// import UploadForProfile from '../images/upload_for_profile';

// NOTE: userOwner is currently assumed to be the user and is the landlord on documents;
// flatOwner is the title holder of the flat on documents
//  and its input is taken on craeteFlat, editFlat and flatLanuages
// const tabWidth = 70;
// const tabHeight = 23;
// const tabRearSpace = 5;

const TAB_WIDTH = 70;
const TAB_HEIGHT = 23;
const TAB_REAR_SPACE = 5;
// let explanationTimer = 3;
// explanationTimerArray for keeping timer ids so they can be cleared
let explanationTimerArray = [];
// let explanationTimer = 0;

class CreateEditDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // set up state to take input from user
      templateElementAttributes: null,
      valueWhenInputFocused: '',
      inputFocused: {},
      showDocumentPdf: false,
      useMainDocumentInsert: false,
      selectedTemplateElementIdArray: [],
      selectedTemplateElementObjectArray: [],
      templateElementCount: 0,
      createNewTemplateElementOn: false,
      actionExplanationObject: null,
      allElementsChecked: false,
      templateEditHistoryArray: [],
      historyIndex: -1,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    // this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleFormCloseDeleteClick = this.handleFormCloseDeleteClick.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleViewPDFClick = this.handleViewPDFClick.bind(this);
    this.handleDocumentInsertCheckBox = this.handleDocumentInsertCheckBox.bind(this);
    this.handleFieldChoiceClick = this.handleFieldChoiceClick.bind(this);
    this.handleTemplateElementCheckClick = this.handleTemplateElementCheckClick.bind(this);
    this.handleTemplateElementMoveClick = this.handleTemplateElementMoveClick.bind(this);
    this.handleTemplateElementChangeSizeClick = this.handleTemplateElementChangeSizeClick.bind(this);
    this.handleCreateNewTemplateElement = this.handleCreateNewTemplateElement.bind(this);
    this.handleTrashClick = this.handleTrashClick.bind(this);
    this.handleTemplateElementActionClick = this.handleTemplateElementActionClick.bind(this);
    this.handleMouseOverActionButtons = this.handleMouseOverActionButtons.bind(this);
    this.handleMouseLeaveActionButtons = this.handleMouseLeaveActionButtons.bind(this);
  }

  // initialValues section implement after redux form v7.4.2 updgrade
  // started to force mapStateToProps to be called for EACH Field element;
  // so to avoid Documents[documentKey].method to be called in each msp call
  //(over 100! for important ponts form) use componentDidUpdate;
  // Then to avoid .method to be called after each user input into input field,
  // use shouldComponentUpdate in document_choices; if return false, will not call cdu
  componentDidMount() {
    // document.getElementById('document-background').addEventListener('click', this.getMousePosition);
    console.log('in create_edit_document, componentDidMount, document', document);
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
      // const documentKey = state.documents.createDocumentKey;
      // if showing a saved document (props set in booking_confirmation.js)
      const mainDocumentInsert = this.getMainDocumentInsert(this.props.documentInsertsAll[0]);
      let mainInsertFieldsObject = {};
      // mainInsertFieldsObject = this.getMainInsertFieldObject(mainDocumentInsert);
      // if mainInsertFieldsObject is empty; ie user has not created a main agreement and insert fields
      _.isEmpty(mainInsertFieldsObject) ? (mainInsertFieldsObject = DefaultMainInsertFieldsObject) : mainInsertFieldsObject;
      // console.log('in create_edit_document, componentDidMount, mainInsertFieldsObject, mainDocumentInsert', mainInsertFieldsObject, mainDocumentInsert);
      if (this.props.showSavedDocument) {
        // get values of each agreement document field
        // const agreement = this.getAgreement(this.props.agreementId)
        // need to have this to populate document inserts
        this.props.fetchAgreement(this.props.agreementId, () => {});
        const agreement = this.props.agreement || {};
        // const agreements = this.props.agreements || [];
        if (!this.props.showOwnUploadedDocument) {
          // console.log('in create_edit_document, componentDidMount, if !this.props.showOwnUploadedDocument', !this.props.showOwnUploadedDocument);
          const returnedObject = this.getSavedDocumentInitialValuesObject({ agreement, mainDocumentInsert });
          initialValuesObject = {
            initialValuesObject: returnedObject.initialValuesObject,
            agreementMappedByName: returnedObject.agreementMappedByName,
            agreementMappedById: returnedObject.agreementMappedById,
            allFields: {},
            // mainInsertFieldsObject: returnedObject.mainInsertFieldsObject
            mainInsertFieldsObject
          };
          const countMainDocumentInserts = this.countMainDocumentInserts(this.props.agreement);
          if (countMainDocumentInserts > 0) {
            this.setState({ useMainDocumentInsert: true }, () => {
              // console.log('in create_edit_document, componentDidMount, this.state.useMainDocumentInsert', this.state.useMainDocumentInsert);
            });
          }
        } else { // else for if showOwnUploadedDocument
          // console.log('in create_edit_document, componentDidMount, before setStatethis.state.showDocumentPdf', this.state.showDocumentPdf);
          this.setState({ showDocumentPdf: true }, () => {
            // console.log('in create_edit_document, componentDidMount, this.state.showDocumentPdf', this.state.showDocumentPdf);
          });
        }
      } else { // if this.props.showSavedDocument
        // if not save document ie creating new document, call method to assign initialValues
        initialValuesObject = Documents[documentKey].method({ flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentLanguageCode, documentKey, contractorTranslations, staffTranslations, mainInsertFieldsObject });
      }
      this.props.setInitialValuesObject(initialValuesObject);
    }
  }

  // componentDidUpdate() {
  // }

  countMainDocumentInserts(agreement) {
    let count = 0;
    _.each(agreement.document_inserts, each => {
      if (each.main_agreement) {
        count++;
      }
    });
    return count;
  }

  getMainInsertFieldObject(mainDocumentInsert) {
    const mainInsertFieldsObject = {};

    if (!_.isEmpty(mainDocumentInsert)) {
      _.each(mainDocumentInsert.insert_fields, eachInsertField => {
        // console.log('in create_edit_document, getSavedDocumentInitialValuesObject, mainDocumentInsert, eachInsertField: ', mainDocumentInsert, eachInsertField);
        if (!mainInsertFieldsObject[eachInsertField.name]) {
          mainInsertFieldsObject[eachInsertField.name] = [];
          mainInsertFieldsObject[eachInsertField.name].push({ name: eachInsertField.name, value: eachInsertField.value, language_code: eachInsertField.language_code });
        } else {
          mainInsertFieldsObject[eachInsertField.name].push({ name: eachInsertField.name, value: eachInsertField.value, language_code: eachInsertField.language_code });
        }
      });
    }

    return mainInsertFieldsObject;
  }

  getSavedDocumentInitialValuesObject({ agreement, mainDocumentInsert }) {
    // console.log('in create_edit_document, getSavedDocumentInitialValuesObject, agreement: ', agreement);
    const initialValuesObject = {};
    const agreementMappedByName = {}
    const agreementMappedById = {}
    const mainInsertFieldsObject = {};
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
      agreementMappedByName[eachField.name] = eachField;
      agreementMappedById[eachField.id] = eachField;
    });

    return { initialValuesObject, agreementMappedByName, agreementMappedById };
  }

  getMainDocumentInsert(documentInsertsAll) {
    // console.log('in create_edit_document, getMainDocument, documentInsertsAll: ', documentInsertsAll);
    let objectReturned = {};
    if (documentInsertsAll) {
      if (documentInsertsAll.length > 0) {
        _.each(documentInsertsAll, eachInsert => {
          if (eachInsert.main_agreement) {
            objectReturned = eachInsert;
          }
        });
      }
    }
    return objectReturned;
  }


  // componentDidUpdate() {
    // if (updateCount < 2) {
      // updateCount++;
    // }
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
    // console.log('in create_edit_document, getSelectChoice choices, value: ', choices, value);
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
    // console.log('in create_edit_document, getDeltaFields dataFormSubmit, this.props.initialValues: ', dataFormSubmit, this.props.initialValues);
    const delta = {};
    _.each(Object.keys(dataFormSubmit), key => {
      if (dataFormSubmit[key] !== this.props.initialValues[key]) {
        // console.log('in create_edit_document, getDeltaFields dataFormSubmit[key], this.props.initialValues[key]: ', dataFormSubmit[key], this.props.initialValues[key]);
        delta[key] = dataFormSubmit[key];
      }
    });
    console.log('in create_edit_document, getDeltaFields delta: ', delta);
    return delta;
  }

  getSavedDocumentField(choice, key) {
    const { agreementMappedById } = this.props;
    let objectReturned = {};
    // console.log('in create_edit_document, getSavedDocumentField, choice : ', choice);
    // console.log('in create_edit_document, getSavedDocumentField, agreementMappedById : ', agreementMappedById);
    // Iterate through all saved document fields
    _.each(Object.keys(this.props.agreementMappedById), eachSavedFieldKey => {
      // console.log('in create_edit_document, getSavedDocumentField, eachSavedFieldKey : ', eachSavedFieldKey);
      // if the name and key match AND the val matches return object
      if ((agreementMappedById[eachSavedFieldKey].name == key) && (agreementMappedById[eachSavedFieldKey].val == choice.params.val)) {
        objectReturned = agreementMappedById[eachSavedFieldKey];
        return;
      }
    });
    return objectReturned;
  }

  checkIfKeyExists(key, paramsObject) {
    // console.log('in create_edit_document, checkIfKeyExists, key, paramsObject : ', key, paramsObject);
    let booleanReturned = false;
    _.each(paramsObject.document_field, eachDocumentField => {
      if (eachDocumentField.name == key) {
        booleanReturned = true;
        return;
      }
    });
    return booleanReturned;
  }

  handleFormSubmit({ data, submitAction }) {
    console.log('in create_edit_document, handleFormSubmit, data, this.props, this.props.allFields, submitAction: ', data, this.props, this.props.allFields, submitAction);
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
      agreement_id: this.props.agreement ? this.props.agreement.id : null,
      document_language_code: this.props.documentLanguageCode,
      use_own_main_agreement: this.state.useMainDocumentInsert,
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
      // assign all fields to fields for iteration below
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

      let choice = {};
      // use page and key from above to get each choice from each document field from Documents[documentKey].form
      _.each(this.props.documentFields[page][key].choices, eachChoice => {
        // Boolean to test if field has multiple choices
        const keyWithMultipleChoices = Object.keys(this.props.documentFields[page][key].choices).length > 1;
        // console.log('in create_edit_document, handleFormSubmit, key, eachChoice, data, data[key], keyWithMultipleChoices: ', key, eachChoice, data, data[key], keyWithMultipleChoices);
        // val = '' means its an input element, not a custom field component
        // .val is assigned inputFieldValue if it is not a button
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
                // if choice is a baseLanguageField ie not a _translation field,
                // assign Document baseLanguage
                if (choice.baseLanguageField) {
                  choice.params.display_text = selectChoice[Documents[this.props.documentKey].baseLanguage];
                }
                // console.log('in create_edit_document, handleFormSubmit, if showLocalLanguage: selectChoice', selectChoice);
              }
            } else {
              choice.params.value = '';
            }
              // add params object with the top, left, width etc. to object to send to api
            paramsObject.document_field.push(choice.params);
          }
        } // end of if inputFieldValue

        // START of assigning to paramsObject if params.val is NOT inputFieldValue
        let dataRefined = ''
        if ((data[key] == 'true') || (data[key] == 't')) {
          dataRefined = true;
        } else if ((data[key] == 'false') || (data[key] == 'f')) {
          dataRefined = false;
        } else {
          dataRefined = data[key];
        }

        if ((eachChoice.params.val == dataRefined) || (dataRefined == '') || (eachChoice.params.val !== 'inputFieldValue')) {
          // console.log('in create_edit_document, handleFormSubmit, eachChoice, key : ', eachChoice, key);
          choice = eachChoice;
          let paramsForSelectKeyExists = false;
          // if this is a saved document on backend ie not newly creating
          // to get document field id into params
          if (this.props.showSavedDocument) {
            // if this key has multiple choices and is a button field, not a select string
            if (keyWithMultipleChoices && choice.params.input_type == 'button') {
              // use agreementMappedByName to get id
              const savedDocumentField = this.getSavedDocumentField(choice, key);
              // console.log('in create_edit_document, handleFormSubmit, savedDocumentField, keyWithMultipleChoices : ', savedDocumentField, keyWithMultipleChoices);
              choice.params.id = savedDocumentField.id;
            } else {
              choice.params.id = this.props.agreementMappedByName[key].id;
            }
          } // end of if showSavedDocument
          // if choice is string and need to show local language
          if (choice.showLocalLanguage) {
            // checkIfKeyExists is for select fields, so that documentField is not created
            // for each select choice; if change selection, pdf will overlap
            if (keyWithMultipleChoices) {
              // if WITH multiple choices in form eg kitchen (yes or no)
              paramsForSelectKeyExists = this.checkIfKeyExists(key, paramsObject);
              // get choice on model eg building choice SRC for en is Steel Reinforced Concrete
              if (!paramsForSelectKeyExists) {
                // get choice from constants/some_model
                const selectChoice = this.getSelectChoice(choice.selectChoices, dataRefined);
                // assign display as an attribute in choice params
                choice.params.display_text = selectChoice[this.props.documentLanguageCode];
                if (choice.combineLanguages) {
                  const baseString = selectChoice[Documents[this.props.documentKey].baseLanguage];
                  const combinedString = baseString.concat(` ${selectChoice[this.props.documentLanguageCode]}`);
                  // console.log('in create_edit_document, handleFormSubmit, if (choice.combineLanguages: combinedString', combinedString);
                  choice.params.display_text = combinedString
                }
              }
            } else {
              // if without multiple choices in form eg construction, choies come from constants/building
              const selectChoice = this.getSelectChoice(choice.selectChoices, dataRefined);
              // assign display as an attribute in choice params
              choice.params.display_text = selectChoice[this.props.documentLanguageCode];
              if (choice.combineLanguages) {
                const baseString = selectChoice[Documents[this.props.documentKey].baseLanguage];
                const combinedString = baseString.concat(` ${selectChoice[this.props.documentLanguageCode]}`);
                // console.log('in create_edit_document, handleFormSubmit, if (choice.combineLanguages: combinedString', combinedString);
                choice.params.display_text = combinedString
              }
            }
          }
          // assign values common to all document fields and push into paramsObject
          if (!paramsForSelectKeyExists) {
            choice.params.value = data[key];
            choice.params.page = page;
            choice.params.name = this.props.documentFields[page][key].name;
            paramsObject.document_field.push(choice.params);
          }
        } // end of if eachChoice.params.val...

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
        const returnedObject = this.getSavedDocumentInitialValuesObject({ agreement });
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
          const returnedObject = this.getSavedDocumentInitialValuesObject({ agreement });
          // console.log('in create_edit_document, handleFormSubmit, else in callback editAgreementFields agreement: ', agreement);
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
    const languageCode = Documents[this.props.documentKey].baseLanguage;
    const languageCodeTranslation = this.props.documentLanguageCode;
        return (
        <option key={i} value={choices[eachKey].params.val}>{modelChoice[languageCode]} {modelChoice[languageCodeTranslation]}</option>
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
      console.log('in create_edit_document, renderEachDocumentField, formField', formField);
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
      // Field gets the initialValue from this.props.initialValues
      // the 'name' attribute is matched with initialValues object keys
      // and sets initial value of the field
      if (fieldComponent == 'select') {
        return (
          <div
            style={{ position: 'absolute', top: formField.choices[0].params.top, left: formField.choices[0].params.left, width: formField.choices[0].params.width, borderColor: formField.borderColor, height: formField.choices[0].params.height, textAlign: formField.choices[0].params.text_align }}
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
            props={fieldComponent == DocumentChoices ? { page, required: formField.required, nullRequiredField, formFields: Documents[this.props.createDocumentKey].form, charLimit: formField.charLimit, otherChoiceValues, documentKey: this.props.documentKey } : {}}
            type={formField.input_type}
            className={formField.component == 'input' ? 'form-control' : ''}
            style={formField.component == 'input'
                    ?
                    { position: 'absolute', top: formField.choices[0].params.top, left: formField.choices[0].params.left, width: formField.choices[0].params.width, borderColor: formField.borderColor, height: formField.choices[0].params.height, padding: formField.choices[0].params.padding, textAlign: formField.choices[0].params.text_align }
                    :
                    {}}
          />
        );
      }
    });
    // }
  }

  getMousePosition = (event) => {
    // custom version of layerX; takes position of container and
    // position of click inside container and takes difference to
    // get the coorindates of click inside container on page
    // yielded same as layerX and layerY
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const background = document.getElementById('document-background')
    console.log('in create_edit_document, getMousePosition1, background, event.target', background, event.target);
    // const documentContainerArray = document.getElementsByClassName('image-pdf-jpg-background');
    // const pageIndex = elementVal - 1;
    // get x and y positions in PX of cursor in browser view port (not page or parent)
    if (clickedElement.id === 'document-background') {
      const clientX = event.clientX;
      const clientY = event.clientY;
      // get dimensions top, bottom, left and right of parent in view port (each template document page)
      const parentRect = event.target.getBoundingClientRect()
      // console.log('in create_edit_document, getMousePosition1, clientX, clientY, parentRect', clientX, clientY, parentRect);
      // Get x and y PERCENTAGES (xx.xx%) inside the parent (template document pages)
      const x = ((clientX - parentRect.left) / (parentRect.right - parentRect.left)) * 100;
      const y = ((clientY - parentRect.top) / (parentRect.bottom - parentRect.top)) * 100
      // console.log('in create_edit_document, getMousePosition1, x, y', x, y);
      // Set state with count of elements and new element in app state in state.templateElements
      this.setState({
        templateElementCount: this.state.templateElementCount + 1,
        templateElementAttributes: { id: `${this.state.templateElementCount + 1}a`, left: `${x}%`, top: `${y}%`, page: elementVal, name: 'name', component: 'input', width: '25%', height: '1.6%', type: 'text', className: 'document-rectangle', borderColor: 'lightgray' },
        createNewTemplateElementOn: false
      }, () => {
        // console.log('in create_edit_document, getMousePosition1, templateElementAttributes.x, templateElementAttributes.page, ', this.state.templateElementAttributes.x, this.state.templateElementAttributes.y, this.state.templateElementAttributes.page);
        this.props.createDocumentElementLocally(this.state.templateElementAttributes);
        // add action element action before putting in array before setState
        this.state.templateElementAttributes.action = 'create'
        this.setState({ templateEditHistoryArray: [...this.state.templateEditHistoryArray, [this.state.templateElementAttributes]] })
        // remove listener
        document.removeEventListener('click', this.getMousePosition);
      });
    }
  }

  handleTemplateElementCheckClick(event) {
    // when user clicks on each template check icon
    const clickedElement = event.target;
    // elementVal is id or id of template element
    const elementVal = clickedElement.getAttribute('value')
    console.log('in create_edit_document, handleTemplateElementCheckClick, event.target, ', event.target);
    // console.log('in create_edit_document, handleTemplateElementCheckClick, elementVal, ', elementVal);
    // when element has not been checked
    if (!this.state.selectedTemplateElementIdArray.includes(elementVal)) {
      // place in array of checked elements
      this.setState({
        selectedTemplateElementIdArray: [...this.state.selectedTemplateElementIdArray, elementVal],
      }, () => {
        // if all elements checked, set to true
        this.setState({
          allElementsChecked: this.state.selectedTemplateElementIdArray.length === this.props.templateElements.length
        }, () => {
          console.log('in create_edit_document, handleTemplateElementCheckClick, this.state.allElementsChecked, ', this.state.allElementsChecked);
        })
        // console.log('in create_edit_document, handleTemplateElementCheckClick, this.state.selectedTemplateElementIdArray, ', this.state.selectedTemplateElementIdArray);
      });
    } else {
      // if user clicks on check icon of element in checked array
      // form a new array from existing array since cannot mutate state elements
      const newArray = [...this.state.selectedTemplateElementIdArray]
      // get index of element in array
      const index = newArray.indexOf(elementVal);
      // take out element at index in array
      newArray.splice(index, 1);
      // assign new array to state
      this.setState({ selectedTemplateElementIdArray: newArray }, () => {
        this.setState({
          allElementsChecked: this.state.selectedTemplateElementIdArray.length === this.props.templateElements.length
        }, () => {
          console.log('in create_edit_document, handleTemplateElementCheckClick, this.state.allElementsChecked, ', this.state.allElementsChecked);
        })
        // console.log('in create_edit_document, handleTemplateElementCheckClick, this.state.selectedTemplateElementIdArray, ', this.state.selectedTemplateElementIdArray);
      });
    }
  }

  dragElement(element, tabs, inputElements, parentRect, actionCallback, move, elementType, selectedElements) {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    // console.log('in create_edit_document, dragElement, parentElement.style.top, parentElement.leftstyle., ', parentElement.style.top, parentElement.style.left);
    // element.onmousedown = dragMouseDown;
    // CAll main function
    dragMouseDown();

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      // assign close and drag callbacks to native handlers
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      // pos 1 and 2 are deltas from the last round pos 3 and 4
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      // set this round to use for next round in pos 1 and 2
      pos3 = e.clientX;
      pos4 = e.clientY;
      // console.log('in create_edit_document, dragElement, pos3, pos4, parentRect, move ', pos3, pos4, parentRect, move);
      // set the element's new position:
      // element.offsetTop is the number of pixels from the top of the closest relatively positioned parent element.
      // element.style.top = (element.offsetTop - pos2) + "px";
      // element.style.left = (element.offsetLeft - pos1) + "px";
      // In percentages; Assign to element.
      if (move) {
        const modifiedElement = element;
        modifiedElement.style.top = `${((element.offsetTop - pos2) / (parentRect.bottom - parentRect.top)) * 100}%`;
        modifiedElement.style.left = `${((element.offsetLeft - pos1) / (parentRect.right - parentRect.left)) * 100}%`;
        if (selectedElements.length > 0) {
          _.each(selectedElements, eachElement => {
            const modifiedElem = eachElement;
            if (eachElement.id !== element.id) {
              modifiedElem.style.top = `${((eachElement.offsetTop - pos2) / (parentRect.bottom - parentRect.top)) * 100}%`;
              modifiedElem.style.left = `${((eachElement.offsetLeft - pos1) / (parentRect.right - parentRect.left)) * 100}%`;
            }
          })
        }
      } else {
        // get original width and height of element to subtract from or add to
        let originalWidth = parseFloat(element.style.width);
        let originalHeight = parseFloat(element.style.height);
        // margin in PX
        // console.log('in create_edit_document, dragElement, element, originalWidth, originalHeight, ', element, originalWidth, originalHeight);
        // console.log('in create_edit_document, dragElement, tabs, originalTabMarginLeft, pos1 ', tabs, originalTabMarginLeft, pos1);
        // get percentage of the position delta in relation to parent element size in px
        const pos2Percentage = (pos2 / parentRect.height) * 100
        const pos1Percentage = (pos1 / parentRect.width) * 100
        console.log('in create_edit_document, dragElement, selectedElements, ', selectedElements);
        // subtract from, add to original attribute values and form strings to pass
        const modifiedElement = element;
        elementType !== 'string' ? modifiedElement.style.height = `${(originalHeight - pos2Percentage)}%` : '';
        modifiedElement.style.width = `${(originalWidth - pos1Percentage)}%`;

        if (selectedElements.length > 0) {
          _.each(selectedElements, eachElement => {
            if (eachElement.id !== element.id) {
              const modifiedElem = eachElement;
              originalWidth = parseFloat(eachElement.style.width);
              originalHeight = parseFloat(eachElement.style.height);
              elementType !== 'string' ? modifiedElem.style.height = `${(originalHeight - pos2Percentage)}%` : '';
              modifiedElem.style.width = `${(originalWidth - pos1Percentage)}%`;
            }
          })
        }

        // change tabs margin to move with width and height changes
        _.each(tabs, eachTab => {
          const modifiedTab = eachTab;
          const originalTabMarginLeft = parseFloat(eachTab.style.marginLeft);
          modifiedTab.style.marginLeft = `${(originalTabMarginLeft - pos1)}px`;
        });
      }
      console.log('in create_edit_document, dragElement, selectedElements, inputElement, element, tabs, ', selectedElements, inputElements, element, tabs);
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;

      let updatedElementObject = null;
      const array = [];
      const interatedElements = selectedElements.length > 0 ? selectedElements : [element]

      if (move) {
        // id is the index 2 (third element) in split array
        // the wrapper div top and left are same as input element top and left
        _.each(interatedElements, eachElement => {
          updatedElementObject = {
            id: eachElement.id.split('-')[2], // get the id part of template-element-[id]
            left: eachElement.style.left,
            top: eachElement.style.top,
            action: 'update'
          };
          array.push(updatedElementObject);
        });
      } else {
        // if not move (resize) send object to update
        // take out TAB_HEIGHT so that TAB_HEIGHT is not added again
        // to adjust input element height and avoid wrapping div height at render
        // updatedElementObject = {
        //   id: element.id.split('-')[2],
        //   width: element.style.width,
        //   height: `${parseFloat(element.style.height) - (TAB_HEIGHT / parentRect.height)}%`
        // };
        // the actual size of the input element to be updated in app state
        _.each(interatedElements, eachElement => {
            // console.log('in create_edit_document, dragElement, closeDragElement, in each eachElement, inputElements, ', eachElement, inputElements);
          const inputElement = inputElements.filter(each => eachElement.id.split('-')[2] == each.id.split('-')[3])
          const inputElementDimensions = inputElement[0].getBoundingClientRect()
          updatedElementObject = {
            id: eachElement.id.split('-')[2], // get the id part of template-element-[id]
            width: `${(inputElementDimensions.width / parentRect.width) * 100}%`,
            height: `${(inputElementDimensions.height / parentRect.height) * 100}%`,
            action: 'update',
          };
          array.push(updatedElementObject);
        })
      } // end of else
      // place in array to be processed in action and reducer
      console.log('in create_edit_document, dragElement, closeDragElement, array, ', array);
      actionCallback(array);
    }
  }

  getSelectedActualElements(elementIdString, ids) {
    const array = [];
    _.each(ids, id => {
      array.push(document.getElementById(`${elementIdString}${id}`));
    });
    return array;
  }

  handleTemplateElementMoveClick(event) {
    // let selectedElementsId = [];
    let selectedElements = [];
    const clickedElement = event.target;
    // elementVal is id or id of template element
    const elementVal = clickedElement.getAttribute('value');
    const element = document.getElementById(`template-element-${elementVal}`);
    // const parentElement = element.parentElement;
    const parentRect = element.parentElement.getBoundingClientRect()
    // console.log('in create_edit_document, handleTemplateElementMoveClick, parentRect ', parentRect);
    const callback = (updatedElementsArray) => {
      console.log('in create_edit_document, handleTemplateElementMoveClick, updatedElementsArray, ', updatedElementsArray);
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setState({ templateEditHistoryArray: [...this.state.templateEditHistoryArray, updatedElementsArray] }, () => {
        console.log('in create_edit_document, handleTemplateElementMoveClick, this.state.templateEditHistoryArray, ', this.state.templateEditHistoryArray);
      });
    };
    // const tab = document.getElementById(`template-element-tab-${elementVal}`);
    // selectedElementsId = this.props.templateElements.length > 0 ? this.props.templateElements.filter(eachElement => this.state.selectedTemplateElementIdArray.includes(eachElement.id)) : [];
    selectedElements = this.getSelectedActualElements('template-element-', this.state.selectedTemplateElementIdArray)
    // call dragElement and pass in the dragged element, the parent dimensions,
    // and the action to update the element in app state
    // last true is for move or not; in this case this is for move element
    this.dragElement(element, null, null, parentRect, callback, true, null, selectedElements);
  }

  handleTemplateElementChangeSizeClick(event) {
    let selectedElements = [];
    let inputElements = [];
    let tabs = [];
    const clickedElement = event.target;
    // elementVal is id of template element
    console.log('in create_edit_document, handleTemplateElementChangeSizeClick, clickedElement, ', clickedElement);
    const elementVal = clickedElement.getAttribute('value');
    const elementType = clickedElement.getAttribute('type')
    // gets the wrapping div for the template element;
    // This is the base element for attribute changes
    const element = document.getElementById(`template-element-${elementVal}`);
    // const inputElement = document.getElementById(`template-element-input-${elementVal}`);
    if (this.state.selectedTemplateElementIdArray.length > 0) {
      inputElements = this.getSelectedActualElements('template-element-input-', this.state.selectedTemplateElementIdArray)
      // const tab = document.getElementById(`template-element-tab-${elementVal}`);
      tabs = this.getSelectedActualElements('template-element-tab-', this.state.selectedTemplateElementIdArray)
    } else {
      inputElements = [document.getElementById(`template-element-input-${elementVal}`)];
      tabs = [document.getElementById(`template-element-tab-${elementVal}`)];
    }
    // console.log('in create_edit_document, handleTemplateElementChangeSizeClick, inputElements, tabs, ', inputElements, tabs);
    // gets the dimensions of the parent element (document background)
    const parentRect = element.parentElement.getBoundingClientRect()
    selectedElements = this.getSelectedActualElements('template-element-', this.state.selectedTemplateElementIdArray)
    // callback for the action to update element array
    const callback = (updatedElementsArray) => {
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setState({ templateEditHistoryArray: [...this.state.templateEditHistoryArray, updatedElementsArray] }, () => {
        console.log('in create_edit_document, handleTemplateElementChangeSizeClick, this.state.templateEditHistoryArray, ', this.state.templateEditHistoryArray);
      });
    };
    this.dragElement(element, tabs, inputElements, parentRect, callback, false, elementType, selectedElements);
  }

  // NOT USED; Experiment for creating new input fields
  renderTemplateElements(page) {
    const documentEmpty = _.isEmpty(this.props.documents);
    let fieldComponent = '';
    // if (this.props.documentFields[page]) {
    let count = 1;
    if (!documentEmpty) {
      const { templateElements } = this.props;
      return _.map(templateElements, eachElement => {
        if (eachElement.component == 'DocumentChoices') {
          fieldComponent = DocumentChoices;
        } else {
          fieldComponent = eachElement.component;
        }
        console.log('in create_edit_document, renderTemplateElements, eachElement: ', eachElement);
        // console.log('in create_edit_document, renderTemplateElements, eachElement.page, page, eachElement == page: ', eachElement.page, page, eachElement.page == parseInt(page, 10));
        // <div
        // key={count}
        // className="create-edit-new-element"
        // style={{ top: `${eachElement.top * 100}%`, left: `${eachElement.left * 100}%`, zIndex: 'count' }}
        // >
        // </div>
        if (eachElement.page == page) {
          const editTemplate = true;
          const width = parseInt(eachElement.width, 10)
          // const height = parseInt(eachElement.height, 10)
          // count for key and for z-index so elements overlap
          count++
          // tabWidth and height in px

          const background = document.getElementById('document-background');
          // const tabPercentOfContainerW = (TAB_WIDTH / background.getBoundingClientRect().width) * 100
          const tabPercentOfContainerH = (TAB_HEIGHT / background.getBoundingClientRect().height) * 100
          // const tabRearSpacePercentOfContainerW = (TAB_REAR_SPACE / background.getBoundingClientRect().width) * 100
          const eachElementWidthPx = background.getBoundingClientRect().width * (parseFloat(eachElement.width) / 100)
          const tabLeftMarginPx = eachElementWidthPx - TAB_WIDTH - TAB_REAR_SPACE;
          // const inputHeightPercentage = (parseFloat(eachElement.height) / (parseFloat(eachElement.height) + tabPercentOfContainerH)) * 100
          // const containerHeightPx = tabWidth + eachElement.width;
          // const containerWidthPx = tabHeight + eachElement.height;

          // console.log('in create_edit_document, renderTemplateElements, eachElement.height, tabPercentOfContainerH, inputHeightPercentage: ', eachElement.height, tabPercentOfContainerH, inputHeightPercentage);
          // console.log('in create_edit_document, renderTemplateElements, background, background.getBoundingClientRect: ', background, background.getBoundingClientRect());
          // console.log('in create_edit_document, renderTemplateElements, background, tabPercentOfContainerW, tabPercentOfContainerH: ', tabPercentOfContainerW, tabPercentOfContainerH);
          // console.log('in create_edit_document, renderTemplateElements, background, eachElement.width, tabPercentOfContainerW, tabRearSpacePercentOfContainerW: ', eachElement.width, tabPercentOfContainerW, tabRearSpacePercentOfContainerW);
          // Field gets the initialValue from this.props.initialValues
          // the 'name' attribute is matched with initialValues object keys
          // and sets initial value of the field
          // { top: `${eachElement.top * 100}%`, left: `${eachElement.left * 100}%`, width: eachElement.width, height: eachElement.height, borderColor: eachElement.borderColor, margin: '0px !important' }
          // <i class="fas fa-equals"></i>
          // <i class="fas fa-arrows-alt"></i>
          // <i class="fas fa-expand-arrows-alt"></i>
          // <input type="checkbox" />
          // console.log('in create_edit_document, renderTemplateElements, eachElement.id.includes(template-element), ', eachElement.id.includes('template-element'));
          const selected = this.state.selectedTemplateElementIdArray.includes(eachElement.id)
          if (editTemplate) {
            return (
              <div
                key={eachElement.id}
                id={`template-element-${eachElement.id}`}
                className="create-edit-document-template-element-container"
                style={{ top: eachElement.top, left: eachElement.left, width: eachElement.width, height: `${parseFloat(eachElement.height) + tabPercentOfContainerH}%` }}
              >
                <Field
                  key={eachElement.name}
                  name={eachElement.name}
                  id={`template-element-input-${eachElement.id}`}
                  // setting value here does not works unless its an <input or some native element
                  // value='Bobby'
                  component={fieldComponent}
                  // pass page to custom compoenent, if component is input then don't pass
                  props={fieldComponent == DocumentChoices ? { page } : {}}
                  // props={fieldComponent == DocumentChoices ? { page } : {}}
                  type={eachElement.type}
                  className={eachElement.component == 'input' ? 'document-rectangle-template' : ''}
                  // className={eachElement.component == 'input' ? 'form-control' : ''}
                  // className={eachElement.className}
                  style={eachElement.component == 'input' && editTemplate
                    ?
                    // { width: eachElement.width, height: eachElement.height, borderColor: eachElement.borderColor, margin: '0px !important' }
                    // flex: flex-grow, flex-shrink , flex-basis; flex basis sets initial length of flexible item.
                    // user flex: 1 and take out height: auto; later get the actual size of the input when resize drag
                    { width: '100%', borderColor: eachElement.borderColor, margin: '0px !important', flex: '1 1 auto' }
                    :
                    {}}
                  // style={newElement.component == 'input' ? { position: 'absolute', top: newElement.top, left: newElement.left, width: newElement.width, height: newElement.height, borderColor: newElement.borderColor } : {}}
                />
                <div
                  id={`template-element-tab-${eachElement.id}`}
                  className="create-edit-document-template-element-edit-tab"
                  style={{ height: `${TAB_HEIGHT}px`, width: `${TAB_WIDTH}px`, marginLeft: `${tabLeftMarginPx}px` }}
                >
                  <i
                    value={eachElement.id}
                    className="fas fa-check-circle"
                    style={{ lineHeight: '1.5', color: selected ? '#fb4f14' : 'gray' }}
                    onClick={this.handleTemplateElementCheckClick}
                  >
                  </i>
                  <i
                    value={eachElement.id}
                    className="fas fa-truck-moving"
                    style={{ lineHeight: '1.5', color: 'gray' }}
                    onMouseDown={this.handleTemplateElementMoveClick}
                  >
                  </i>
                  <i
                    type={eachElement.type}
                    value={eachElement.id}
                    className="fas fa-expand-arrows-alt" style={{ lineHeight: '1.5', color: 'gray' }}
                    onMouseDown={this.handleTemplateElementChangeSizeClick}
                  >
                  </i>
                </div>
              </div>
            );
          } // end of if editTemplate
          return (
            <Field
              key={eachElement.name}
              name={eachElement.name}
              // setting value here does not works unless its an <input or some native element
              // value='Bobby'
              component={fieldComponent}
              // pass page to custom compoenent, if component is input then don't pass
              props={fieldComponent == DocumentChoices ? { page } : {}}
              // props={fieldComponent == DocumentChoices ? { page } : {}}
              type={eachElement.type}
              className={eachElement.component == 'input' ? 'document-rectangle' : ''}
              // className={eachElement.component == 'input' ? 'form-control' : ''}
              // className={eachElement.className}
              style={eachElement.component == 'input' ? { position: 'absolute', top: `${eachElement.top * 100}%`, left: `${eachElement.left * 100}%`, width: eachElement.width, height: eachElement.height, borderColor: eachElement.borderColor, margin: '0px !important' } : {}}
              // style={newElement.component == 'input' ? { position: 'absolute', top: newElement.top, left: newElement.left, width: newElement.width, height: newElement.height, borderColor: newElement.borderColor } : {}}
            />
          );
        }
      })
    }
    // end of if documentEmpty
  }

  renderEachDocumentTranslation(page) {
    // only render document translations when !showDocumentPdf
    // if (!this.state.showDocumentPdf) {
    return _.map(this.props.documentTranslations[page], (documentTranslation, i) => {
      // console.log('in create_edit_document, renderEachDocumentTranslation, documentTranslation.translations[en] : ', documentTranslation.translations['en']);
      let textToRender = documentTranslation.translations[this.props.documentLanguageCode]

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
          {textToRender}
        </div>
      );
    });
    // }
  }

  handleFieldChoiceClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value')
    console.log('in create_edit_document, handleFieldChoiceClick, elementVal, this.props.document: ', elementVal, this.props.documents);
  }

  renderEachFieldChoice() {
    // NOT yet build out
    return (
      <div
        className="create-edit-document-template-each-choice"
        value={'name'}
        onClick={this.handleFieldChoiceClick}
      >
      Name
      </div>
    );
  }

  handleCreateNewTemplateElement() {
    // Turn on and off createNewTemplateElementOn local state;
    // The actual creation is done in getMousePosition
    this.setState({ createNewTemplateElementOn: !this.state.createNewTemplateElementOn }, () => {
      // In callback to setState, if turning on addEventListener
      if (this.state.createNewTemplateElementOn) {
        document.addEventListener('click', this.getMousePosition);
      } else {
        // In callback to setState, if turning off removeEventListener
        document.removeEventListener('click', this.getMousePosition);
      }
    });
    // turn off any explanations and timers when click
    if (this.state.actionExplanationObject) {
      this.setState({ actionExplanationObject: null });
    }
    this.clearAllTimers(() => {});
    // clear all checks on elements
    if (this.state.selectedTemplateElementIdArray.length > 0) {
      this.setState({ selectedTemplateElementIdArray: [] });
    }
  }

  handleTrashClick() {
   if (this.state.selectedTemplateElementIdArray.length > 0) {
     const array = [];
     _.each(this.props.templateElements, eachElement => {
       console.log('in create_edit_document, handleTrashClick, eachElement: ', eachElement);
       if (this.state.selectedTemplateElementIdArray.includes(eachElement.id)) {
         console.log('in create_edit_document, handleTrashClick, this.state.selectedTemplateElementIdArray: ', this.state.selectedTemplateElementIdArray);
         const modifiedEach = eachElement;
         modifiedEach.action = 'delete';
         array.push(modifiedEach);
       }
     });
     console.log('in create_edit_document, handleTrashClick, array: ', array);
     // elements are deleted in logic in action and reducers,
     // elements are marked deleted in edit history in component state
     this.props.deleteDocumentElementLocally(this.state.selectedTemplateElementIdArray, () => {
       this.setState({
         selectedTemplateElementIdArray: [],
         templateEditHistoryArray: [...this.state.templateEditHistoryArray, array]
       });
     });
    }
  }

clearAllTimers(callback) {
  _.each(explanationTimerArray, eachTimerObj => {
    clearInterval(eachTimerObj.timerId);
  });
  // set global variable explanationTimerArray
  explanationTimerArray = [];
  callback();
  // console.log('in create_edit_document, clearAllTimers, explanationTimerArray.length: ', explanationTimerArray.length);
}

  getElement(elementArray, baseElementId) {
    let objectReturned = null;
    _.each(elementArray, eachElement => {
      if (baseElementId === eachElement.id) {
        objectReturned = eachElement;
        return;
      }
    });
    return objectReturned;
  }

  handleTemplateElementActionClick(event) {
    this.clearAllTimers(() => {});
    const clickedElement = event.target;
    // element val is value of i or div in action box eg horizontal or vertical strings
    const elementVal = clickedElement.getAttribute('value');
    // function to be used for aligning horizontal and vertical values
    // make fat arrow function to set context to be able to use this.props and state
    const align = (alignWhat) => {
      if (this.state.selectedTemplateElementIdArray.length > 0) {
        // get the first element to be clicked to make as a basis for move
        const firstClickedId = this.state.selectedTemplateElementIdArray[0];
        const baseElement = this.getElement(this.props.templateElements, firstClickedId);
        if (baseElement) {
          const array = [];
          _.each(this.props.templateElements, eachElement => {
            if (eachElement.id !== baseElement.id && this.state.selectedTemplateElementIdArray.includes(eachElement.id)) {
              if (alignWhat === 'vertical') array.push({ id: eachElement.id, left: baseElement.left, action: 'update' });
              if (alignWhat === 'horizontal') array.push({ id: eachElement.id, top: baseElement.top, action: 'update' });
              if (alignWhat === 'alignWidth') array.push({ id: eachElement.id, width: baseElement.width, action: 'update' });
              if (alignWhat === 'alignHeight') array.push({ id: eachElement.id, height: baseElement.height, action: 'update' });
            } // end of if
          }); // end of each
          console.log('in create_edit_document, handleTemplateElementActionClick, move() elementVal, array: ', elementVal, array);
          // call action to update each template element object in reducer
          this.props.updateDocumentElementLocally(array);
          // empty out array for selected fields
          this.setState({
            // selectedTemplateElementIdArray: [],
            templateEditHistoryArray: [...this.state.templateEditHistoryArray, array]
          }, () => {
            console.log('in create_edit_document, handleTemplateElementActionClick, move() elementVal, this.state.templateEditHistoryArray: ', elementVal, this.state.templateEditHistoryArray);
          });
        } // end of if baseElement
      } // end of if state selectedTemplateElementIdArray
    };

    const move = (direction) => {
      const array = [];
      _.each(this.props.templateElements, eachElement => {
        if (this.state.selectedTemplateElementIdArray.includes(eachElement.id)) {
          if (direction === 'moveLeft') array.push({ id: eachElement.id, left: `${parseFloat(eachElement.left) - 0.1}%`, action: 'update' });
          if (direction === 'moveRight') array.push({ id: eachElement.id, left: `${parseFloat(eachElement.left) + 0.1}%`, action: 'update' });
          if (direction === 'moveDown') array.push({ id: eachElement.id, top: `${parseFloat(eachElement.top) + 0.1}%`, action: 'update' });
          if (direction === 'moveUp') array.push({ id: eachElement.id, top: `${parseFloat(eachElement.top) - 0.1}%`, action: 'update' });
        } // end of if
      }); // end of each
      this.props.updateDocumentElementLocally(array);
      this.setState({
        templateEditHistoryArray: [...this.state.templateEditHistoryArray, array]
      }, () => {
        console.log('in create_edit_document, handleTemplateElementActionClick, move() elementVal, this.state.templateEditHistoryArray: ', elementVal, this.state.templateEditHistoryArray);
      });
    };

    const redoUndo = (doWhat) => {
      if (doWhat === 'undo') {
        // index starts at -1, the last element in index
        const index = this.state.historyIndex
        const lastActionArray = this.state.templateEditHistoryArray[index]
        console.log('in create_edit_document, handleTemplateElementActionClick, elementVal, lastActionArray: ', elementVal, lastActionArray);

      } else {

      }
    }

    console.log('in create_edit_document, handleTemplateElementActionClick, clickedElement, elementVal, this.state.selectedTemplateElementIdArray: ', clickedElement, elementVal, this.state.selectedTemplateElementIdArray);
      switch (elementVal) {
        case 'vertical':
          align(elementVal);
          break;

        case 'horizontal':
          align(elementVal);
          break;

        case 'alignWidth':
          align(elementVal);
          break;

        case 'alignHeight':
          align(elementVal);
          break;

        case 'checkAll': {
          const checkAllArray = [...this.state.selectedTemplateElementIdArray];
          _.each(this.props.templateElements, eachElement => {
            if (!this.state.selectedTemplateElementIdArray.includes(eachElement.id)) {
              checkAllArray.push(eachElement.id);
            }
          });

          if (checkAllArray.length > 0) {
            this.setState({
              allElementsChecked: true,
              selectedTemplateElementIdArray: checkAllArray
            });
          }
          // }
          break;
        } // looks like lint requires having block when case logic too long

        case 'uncheckAll':
          // if there are checked elements clear out selectedTemplateElementIdArray
          // and uncheckAll
            this.setState({
              selectedTemplateElementIdArray: [],
              allElementsChecked: false
            });
            break;

        case 'moveLeft':
          move(elementVal);
          break;

        case 'moveRight':
          move(elementVal);
          break;

        case 'moveDown':
          move(elementVal);
          break;

        case 'moveUp':
          move(elementVal);
          break;

        case 'undo':
          redoUndo(elementVal);
          break;

        case 'redo':
          redoUndo(elementVal);
          break;

        default: return null;
      }
  }

  renderTemplateEditFieldBox() {
    return (
      <div className="create-edit-document-template-edit-field-box">
        {this.renderEachFieldChoice()}
      </div>
    );
  }

  renderExplanationBox() {
    console.log('in create_edit_document, renderExplanationBox, this.state.actionExplanation, this.state.actionExplanationObject: ', this.state.actionExplanationObject);
    const placement = this.state.actionExplanationObject.explanation.split(',')[1]
    const explanation = this.state.actionExplanationObject.explanation.split(',')[0]
    const height = placement === 'top' ? -47 : 27;
    // {this.state.actionExplanationObject.explanation}
    return (
      <div
        className="create-edit-document-explanation-box"
        style={{ top: `${(this.state.actionExplanationObject.top + height)}px`, left: `${(this.state.actionExplanationObject.left + 0)}px` }}
      >
        {explanation}
      </div>
    );
  }

  setExplanationTimer(time, elementName, callback) {
    const lapseTime = () => {
      if (subTimer > 0) {
        subTimer--;
        console.log('in create_edit_document, setExplanationTimer, subTimer > 0: ', subTimer);
      } else {
        // when subtimer is 0, assign typing timer at 0
        subTimer = 0;
        console.log('in create_edit_document, setExplanationTimer, subTimer == 0: ', subTimer);
        // this.setState({ actionExplanationObject: null });
        callback();
        clearInterval(timer);
      }
    };
    let subTimer = time;
    // timer variable is assigned an integer id
    const timer = setInterval(lapseTime, 1000);
    explanationTimerArray.push({ timerId: timer, elementName });
  }

  handleMouseOverActionButtons(event) {
    // When user mouses over a button, show explanation after x seconds over the button;
    // Logic is tricky as timers need to be cleared each time user moves to another button
    const mousedOverElement = event.target;
    // mousedOverElement.style.backgroundColor = '#ccc';
    const elementName = mousedOverElement.getAttribute('name');
    // if moused over element I an i (icon) or SPAN (NOT DIV) to avoid
    // both children and parent setting off this handler
    if (mousedOverElement.tagName === 'I' || mousedOverElement.tagName === 'SPAN') {
      const elementDimensions = mousedOverElement.getBoundingClientRect();
      // if there are timers running AND explanation is showing
      // ie going from one button to another when explanation showing
      if (explanationTimerArray.length > 0 && this.state.actionExplanationObject) {
        // Callback setting existing explanation t null and set new one
        const callback = () => this.setState({
          actionExplanationObject: {
            top: elementDimensions.top,
            left: elementDimensions.left,
            explanation: elementName
          }
        });
        // end of setState callback
        console.log('in create_edit_document, handleMouseOverActionButtons, in if: ', explanationTimerArray);
          // clear timers with callback to null out explantion object and setting new one
          this.clearAllTimers(callback);
      } else { // if timer not runnig and explantion does not show simultaneously
        const showExplantion = () => this.setState({
          actionExplanationObject: {
            top: elementDimensions.top,
            left: elementDimensions.left,
            explanation: elementName
          }
        });
        // if there is no explanation showing
        if (!this.state.actionExplanationObject) {
          console.log('in create_edit_document, handleMouseOverActionButtons, in else if : ', explanationTimerArray);
          // clear timers in case there are timers running
          this.clearAllTimers(() => {});
          // set timer with second, text to show, and callback
          this.setExplanationTimer(1, elementName, showExplantion);
        } else { // catch all
          console.log('in create_edit_document, handleMouseOverActionButtons, in else if else1  : ', explanationTimerArray);
          // !!! Somehow, this handler does not work without this else showExplantion
          showExplantion(); // function call
        }
      }
    }
  }

  handleMouseLeaveActionButtons(event) {
    const mousedLeaveElement = event.target;
    // const elementName = mousedLeaveElement.getAttribute('name')
    console.log('in create_edit_document, handleMouseLeaveActionButtons, mousedLeaveElement, mousedLeaveElement.tagName : ', mousedLeaveElement, mousedLeaveElement.tagName);
    if (this.state.actionExplanationObject) {
      this.setState({ actionExplanationObject: null });
    }
    this.clearAllTimers(() => {});
  }

  renderTemplateEditFieldAction() {
    // <span onMouseOver={this.handleMouseOverActionButtons} name="Change font style" style={{ width: 'auto' }}>
    //   Font
    // </span>
    // const createNewElement = this.state.createNewTemplateElementOn
    const elementsChecked = this.state.selectedTemplateElementIdArray.length > 0;
    const multipleElementsChecked = this.state.selectedTemplateElementIdArray.length > 1;
    const disableCheckAll = !this.props.templateElements || (this.props.templateElements.length < 1) || this.state.allElementsChecked || this.state.createNewTemplateElementOn;
    const disableCreateNewElement = this.state.createNewTemplateElementOn || this.state.selectedTemplateElementIdArray.length < 1;
    const enableUndo = this.state.templateEditHistoryArray.length > 0 && this.state.historyIndex !== 0;
    const enableRedo = this.state.templateEditHistoryArray.length > 0 && this.state.historyIndex !== -1;

    // const createNewTemplateElementOn = this.state.createNewTemplateElementOn || this.state.selectedTemplateElementIdArray.length < 1;
        console.log('in create_edit_document, renderTemplateEditFieldAction, after each, (this.props.templateElements), this.state.allElementsChecked : ', this.props.templateElements, this.state.allElementsChecked);
        console.log('in create_edit_document, renderTemplateEditFieldAction, after each, disableCheckAll : ', disableCheckAll);
    return (
      <div
        className="create-edit-document-template-edit-action-box"
        onMouseLeave={this.handleMouseLeaveActionButtons}
      >
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={disableCreateNewElement ? this.handleCreateNewTemplateElement : () => {}}
          style={this.state.createNewTemplateElementOn ? { backgroundColor: 'lightgray' } : { color: this.state.selectedTemplateElementIdArray.length > 0 ? 'gray' : 'blue' }}
          onMouseOver={this.handleMouseOverActionButtons}
          name="Create a new field,top"
          value="newField"
        >
          <i value="newField" name="Create a new field,top" className="far fa-edit"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={multipleElementsChecked ? this.handleTemplateElementActionClick : () => {}}
          value="vertical"
          onMouseOver={this.handleMouseOverActionButtons}
          name="Align fields vertically,top"
        >
          <i value="vertical" name="Align fields vertically,top" style={{ color: multipleElementsChecked ? 'blue' : 'gray' }} className="fas fa-ruler-vertical"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={multipleElementsChecked ? this.handleTemplateElementActionClick : () => {}}
          value="horizontal"
          onMouseOver={this.handleMouseOverActionButtons}
          name="Align fields horizontally,top"
        >
          <i value="horizontal" name="Align fields horizontally,top" style={{ color: multipleElementsChecked ? 'blue' : 'gray' }} className="fas fa-ruler-horizontal"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={this.props.templateElements.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          value="moveLeft"
          onMouseOver={this.handleMouseOverActionButtons}
          name="Move fields left,top"
        >
          <i value="moveLeft" name="Move fields left,top" style={{ color: elementsChecked ? 'blue' : 'gray' }} className="fas fa-angle-left"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={this.props.templateElements.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          value="moveRight"
          name="Move fields right,top"
        >
          <i value="moveRight" name="Move fields right,top" onMouseOver={this.handleMouseOverActionButtons} style={{ color: elementsChecked ? 'blue' : 'gray' }} className="fas fa-angle-right"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={this.props.templateElements.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          value="moveDown"
          name="Move fields down,top"
        >
          <i value="moveDown" name="Move fields down,top" style={{ color: elementsChecked ? 'blue' : 'gray' }} onMouseOver={this.handleMouseOverActionButtons} className="fas fa-angle-down"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={this.props.templateElements.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          value="moveUp"
          name="Move fields up,top"
        >
          <i value="moveUp" name="Move fields up,top" style={{ color: elementsChecked ? 'blue' : 'gray' }} onMouseOver={this.handleMouseOverActionButtons} className="fas fa-angle-up"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={elementsChecked ? this.handleTrashClick : () => {}}
          name="Throw away field,top"
          value="trash"
        >
          <i onMouseOver={this.handleMouseOverActionButtons} style={{ color: elementsChecked ? 'blue' : 'gray' }} name="Throw away field,top" className="far fa-trash-alt"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          // onMouseOver={this.handleMouseOverActionButtons}
          name="Make font larger,top"
          value="fontLarger"
        >
          <i onMouseOver={this.handleMouseOverActionButtons} style={{ color: elementsChecked ? 'blue' : 'gray' }} name="Make font larger,top" className="fas fa-font"></i>
          <i name="Make font larger,top" style={{ color: elementsChecked ? 'blue' : 'gray' }} className="fas fa-sort-up"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          // onMouseOver={this.handleMouseOverActionButtons}
          name="Make font smaller,bottom"
          value="fontSmaller"
        >
          <i name="Make font smaller,bottom" style={{ fontSize: '12px', padding: '3px', color: elementsChecked ? 'blue' : 'gray'  }} onMouseOver={this.handleMouseOverActionButtons} name="Make font larger" className="fas fa-font"></i>
          <i className="fas fa-sort-down" style={{ color: elementsChecked ? 'blue' : 'gray' }}></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          name="Change font family,bottom"
          value="fontFamily"
        >
          <i onMouseOver={this.handleMouseOverActionButtons} style={{ color: elementsChecked ? 'blue' : 'gray' }} name="Change font family,bottom" className="fas fa-font"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          name="Change font style,bottom"
          value="fontStyle"
        >
          <i onMouseOver={this.handleMouseOverActionButtons} style={{ color: elementsChecked ? 'blue' : 'gray' }} name="Change font style,bottom" className="fas fa-italic"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          name="Undo changes,bottom"
          onClick={this.handleTemplateElementActionClick}
          value="undo"
        >
          <i
            name="Undo changes,bottom"
            value="undo"
            style={{ color: enableUndo ? 'blue' : 'gray' }}
            onClick={enableUndo ? this.handleTemplateElementActionClick : () => {}}
            onMouseOver={this.handleMouseOverActionButtons}
            className="fas fa-undo"
          >
          </i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          name="Redo changes,bottom"
          value="redo"
        >
          <i
            name="Redo changes,bottom,bottom"
            value="redo"
            style={{ color: enableRedo ? 'blue' : 'gray' }}
            onClick={enableRedo ? this.handleTemplateElementActionClick : () => {}}
            onMouseOver={this.handleMouseOverActionButtons}
            className="fas fa-redo"
          >
          </i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={multipleElementsChecked ? this.handleTemplateElementActionClick : () => {}}
          name="Align field width,bottom"
          value="alignWidth"
        >
          <i value="alignWidth" name="Align field width,bottom" style={{ color: multipleElementsChecked ? 'blue' : 'gray' }} onMouseOver={this.handleMouseOverActionButtons} className="fas fa-arrows-alt-h"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={multipleElementsChecked ? this.handleTemplateElementActionClick : () => {}}
          name="Align field height,bottom"
          value="alignHeight"
        >
          <i value="alignHeight" name="Align field height,bottom" style={{ color: multipleElementsChecked ? 'blue' : 'gray' }} onMouseOver={this.handleMouseOverActionButtons} className="fas fa-arrows-alt-v"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={elementsChecked ? this.handleTemplateElementActionClick : () => {}}
          name="Uncheck all fields,bottom"
          value="uncheckAll"
        >
          <i value="uncheckAll" onMouseOver={this.handleMouseOverActionButtons} name="Uncheck all fields,bottom" style={{ fontSize: '15px', color: elementsChecked ? 'blue' : 'gray' }} className="fas fa-check"></i>
          <i name="Uncheck all fields,bottom" value="uncheckAll" style={{ fontSize: '12px', color: elementsChecked ? 'blue' : 'gray' }} className="fas fa-times"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={!disableCheckAll ? this.handleTemplateElementActionClick : () => {}}
          name="Check all fields,bottom"
          value="checkAll"
        >
          <i value="checkAll" onMouseOver={this.handleMouseOverActionButtons} name="Check all fields,bottom" style={{ fontSize: '15px', color: disableCheckAll ? 'gray' : 'blue' }} className="fas fa-check"></i>
          <span name="Check all fields,bottom" value="checkAll" style={{ fontSize: '13px', color: disableCheckAll ? 'gray' : 'blue' }}>all</span>
        </div>
      </div>
    );
  }

  renderDocument() {
    // render each document page as a background image;
    // render each document field and translation field on top of the image
    const initialValuesEmpty = _.isEmpty(this.props.initialValues);
    let pages = [];
    let showDocument = false;
    if (this.props.showSavedDocument) {
      if (this.props.agreement) {
        showDocument = true;
      }
    } else {
      showDocument = true;
    }

    // if (this.props.agreement) {
    if (showDocument) {
      if (!initialValuesEmpty || this.props.showOwnUploadedDocument) {
        // render document only if initialValues NOT empty or if user has uploaded own document (agreement)
        let image;
        // when showing PDF (view pdf or after creating and updating pdf)
        // show entire PDF; Use pages array to push all pages of PDF persisted in agreement
        let constantAssetsFolder = '';
        if (this.state.showDocumentPdf) {
          const array = [];
          // use image in agreement kept in Cloudinary
          image = this.props.agreement.document_publicid;
          // lodosh .times to get array [1, 2, 3 etc....]
          _.times(this.props.agreement.document_pages, i => {
            array.push(i + 1);
          });
          // assign array to pages for later iteration
          pages = array;
          // console.log('in create_edit_document, renderDocument, if this.state.showDocumentPdf, pages: ', pages);
        } else {
          constantAssetsFolder = 'apartmentpj-constant-assets/'
          // if showing document form, get array of pages from constants/documents
          image = Documents[this.props.createDocumentKey].file;
          // assign array to pages varaible for later iteration
          pages = Object.keys(this.props.documentFields);
        }

        const bilingual = Documents[this.props.createDocumentKey].translation;
        // const page = 1;

        return _.map(pages, page => {
          console.log('in create_edit_document, renderDocument, pages, image, page: ', pages, image, page);
          return (
            <div
              key={page}
              value={page}
              id="document-background"
              className="image-pdf-jpg-background"
              style={{ backgroundImage: `url(http://res.cloudinary.com/chikarao/image/upload/w_792,h_1122,q_60,pg_${page}/${constantAssetsFolder}${image}.jpg)` }}
            >
              {this.state.showDocumentPdf ? '' : this.renderEachDocumentField(page)}
              {(bilingual && !this.state.showDocumentPdf) ? this.renderEachDocumentTranslation(page) : ''}
              {this.props.showTemplate ? this.renderTemplateEditFieldBox() : ''}
              {this.props.showTemplate ? this.renderTemplateEditFieldAction() : ''}
              {this.props.showTemplate && this.state.actionExplanationObject ? this.renderExplanationBox() : ''}
              {this.props.showTemplate ? this.renderTemplateElements(page) : ''}
            </div>
          );
        });
      } // end of if !initialValuesEmpty
    } // end of if this.props.agreement
  }

  handleFormCloseDeleteClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    if (elementVal == 'close') {
      this.props.showSavedDocument ? this.props.closeSavedDocument() : this.props.showDocument();
      this.props.editHistory({ editHistoryItem: {}, action: 'clear' });
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

  handleViewPDFClick(event) {
    if (!this.props.showOwnUploadedDocument) {
      this.setState({ showDocumentPdf: !this.state.showDocumentPdf }, () => {
      });
    } else {
      const clickedElement = event.target;
      const elementVal = clickedElement.getAttribute('value');
      this.props.showDocumentInsertEditProp(elementVal);
    }
  }

  switchCreatePDFButton(saveButtonActive, agreementHasPdf) {
    console.log('in create_edit_document, switchCreatePDFButton, saveButtonActive, agreementHasPdf: ', saveButtonActive, agreementHasPdf);
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

  handleDocumentInsertCheckBox() {
    this.setState({ useMainDocumentInsert: !this.state.useMainDocumentInsert }, () => {
      // console.log('in create_edit_document, handleDocumentInsertCheckBox, this.state.useMainDocumentInsert: ', this.state.useMainDocumentInsert);
    });
  }

  renderDocumentButtons() {
    // console.log('in create_edit_document, renderDocumentButtons, this.props.showDocumentInsertBox: ', this.props.showDocumentInsertBox);
    const { handleSubmit, appLanguageCode } = this.props;
    let saveButtonActive = false;
    let agreementHasPdf = false;
    let showDocumentButtons = false;

    if (this.props.formIsDirty && this.props.showSavedDocument) { saveButtonActive = true; }

    if (!this.props.showSavedDocument) { saveButtonActive = true; }

    if (this.props.showSavedDocument) {
      if (this.props.agreement) {
        showDocumentButtons = true;
        if (this.props.agreement.document_publicid) { agreementHasPdf = true; }
      }
    } else {
      showDocumentButtons = true;
    }

    if (showDocumentButtons) {

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
            ''
          }

          {this.state.showDocumentPdf ?
            <a
              className="btn document-floating-button"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: 'lightgray' }}
              href={`http://res.cloudinary.com/chikarao/image/upload/${this.props.agreement.document_publicid}.pdf`}
            >
             {AppLanguages.download[appLanguageCode]}
            </a>
            :
            <div className="update-create-pdf-button-box">
              {this.switchCreatePDFButton(saveButtonActive, agreementHasPdf)}
              {this.props.showDocumentInsertBox ? <input type="checkbox" onChange={this.handleDocumentInsertCheckBox} checked={this.state.useMainDocumentInsert} /> : ''}
              {this.props.showDocumentInsertBox ? <div style={{　fontSize: '10px'　}}>{AppLanguages.useOwnInsert[appLanguageCode]}</div> : ''}
            </div>
          }

          {this.props.showSavedDocument && !this.props.showOwnUploadedDocument ?
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
              // handleSubmit has been destructured from this.props
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
    } // END of if this.props.agreement
  }

  render() {
    // console.log('in create_edit_document, just render: ');
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
  console.log('in create_edit_document, mapStateToProps, state: ', state);
  // const initialValuesObjectEmpty = _.isEmpty(state.documents.initialValuesObject);
  if (state.bookingData.fetchBookingData) {
    let initialValues = {};
    // bookingData.flat gives access to flat.building.inspections
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
    const agreements = state.bookingData.fetchBookingData.agreements
    // initialValues = state.documents.initialValuesObject;
    initialValues = { name: 'Jackie' };
    // selector from redux form; true if any field on form is dirty
    const formIsDirty = isDirty('CreateEditDocument')(state);
    // console.log('in create_edit_document, mapStateToProps, initialValues: ', initialValues);
    return {
      // flat: state.selectedFlatFromParams.selectedFlat,
      errorMessage: state.auth.error,
      auth: state.auth,
      bookingData: state.bookingData.fetchBookingData,
      initialValues,
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
      agreementMappedById: state.documents.agreementMappedById,
      templateElements: state.documents.templateElements,
      formIsDirty,
      agreements,
      documentInsertsAll: state.bookingData.documentInsertsAll
      // isDirty: isDirty('CreateEditDocument')(state)
    };
  } else {
    return {};
  }
}

export default connect(mapStateToProps, actions)(CreateEditDocument);
