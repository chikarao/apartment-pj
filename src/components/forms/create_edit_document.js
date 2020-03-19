import React, { Component } from 'react';
import _ from 'lodash';
import {
  reduxForm,
  Field,
  isDirty,
  getFormMeta
} from 'redux-form';
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
import DocumentChoicesTemplate from './document_choices_template';
import AppLanguages from '../constants/app_languages';
import DefaultMainInsertFieldsObject from '../constants/default_main_insert_fields';
import setBoundaries from './set_choice_wrapper_boundaries';
import getUpdatedElementObject from './get_element_update_object';
import getNewDocumentFieldChoices from './get_new_document_field_choices';
import getOtherChoicesObject from './get_other_choices_object';
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
// Since need to update persisted elements from beginning of history array,
// Cannot have a finite MAX_HISTORY_ARRAY_LENGTH; Array length is zeroed out at every save
const MAX_HISTORY_ARRAY_LENGTH = 1000000;
// let explanationTimer = 3;
// explanationTimerArray for keeping timer ids so they can be cleared
let explanationTimerArray = [];
let choiceTimerArray = [];
let mouseUp = false;
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
      historyIndex: 0,
      undoingAndRedoing: false,
      showFontControlBox: false,
      // NOTE: newFontObject is for setting font attributes for new objects
      // selectedElementFontObject is for fonts for checked elements
      // If all elements are checked, selectedElementFontObject === newFontObject
      newFontObject: {
        font_family: 'arial',
        font_size: '12px',
        font_style: 'normal',
        font_weight: 'normal',
        override: false
      },
      selectedElementFontObject: null,
      // modifiedPersistedElementsArray is for elements that have been persisted in backend DB
      // modifiedPersistedElementsArray: [],
      modifiedPersistedElementsObject: {},
      originalPersistedTemplateElements: {},
      selectedChoiceIdArray: [],
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
    this.handleFontControlCloseClick = this.handleFontControlCloseClick.bind(this);
    this.handleShowFontControlBox = this.handleShowFontControlBox.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleButtonTemplateElementMove = this.handleButtonTemplateElementMove.bind(this);
    this.handleButtonTemplateElementClick = this.handleButtonTemplateElementClick.bind(this);
    // this.dragChoice = this.dragChoice.bind(this);
  }

  // initialValues section implement after redux form v7.4.2 updgrade
  // started to force mapStateToProps to be called for EACH Field element;
  // so to avoid Documents[documentKey].method to be called in each msp call
  //(over 100! for important ponts form) use componentDidUpdate;
  // Then to avoid .method to be called after each user input into input field,
  // use shouldComponentUpdate in document_choices; if return false, will not call cdu
  componentDidMount() {
    // document.getElementById('document-background').addEventListener('click', this.getMousePosition);
    // If change name 'documentHistory', comment out this localStorageHistory section
    // before running the code or will raise error of undefined newFontObject and other state objects
    const getLocalHistory = () => {
      const localStorageHistory = localStorage.getItem('documentHistory');
      console.log('in create_edit_document, componentDidMount, getLocalHistory, localStorageHistory', localStorageHistory);
      let destringifiedHistory = {};
      // if localStorageHistory exists, set state to previous values
      // if localStorageHistory does not exist, all state values are set in constructor
      // and next time user refreshes or mounts component on the same machine, it will be there
      if (localStorageHistory) {
        destringifiedHistory = JSON.parse(localStorageHistory);
        if (destringifiedHistory[this.props.agreement.id].elements) {
          // _.each(Object.keys(destringifiedHistory[this.props.agreement.id].elements), eachElementKey => {
          //   highestElementId = highestElementId > parseInt(eachElementKey, 10) ? highestElementId : parseInt(eachElementKey, 10)
          //   this.props.createDocumentElementLocally(destringifiedHistory[this.props.agreement.id].elements[eachElementKey]);
          // }) // end of each elements
          console.log('in create_edit_document, componentDidMount, getLocalHistory, destringifiedHistory', destringifiedHistory);
          // Set state with || in case localStorageHistory exists but history and other objects do not exist
          this.setState({
            templateEditHistoryArray: destringifiedHistory[this.props.agreement.id].history || this.state.templateEditHistoryArray,
            newFontObject: destringifiedHistory[this.props.agreement.id].newFontObject || this.state.newFontObject,
            // modifiedPersistedElementsArray: destringifiedHistory[this.props.agreement.id].modifiedPersistedElementsArray || this.state.modifiedPersistedElementsArray,
            modifiedPersistedElementsObject: destringifiedHistory[this.props.agreement.id].modifiedPersistedElementsObject || this.state.modifiedPersistedElementsObject,
            // templateElementCount: highestElementId,
            originalPersistedTemplateElements: destringifiedHistory[this.props.agreement.id].originalPersistedTemplateElements || this.state.originalPersistedTemplateElements,
          }, () => {
            this.setState({
              // historyIndex: this.state.templateEditHistoryArray.length - 1
              historyIndex: destringifiedHistory[this.props.agreement.id].historyIndex || this.state.historyIndex
            }, () => {
              console.log('in create_edit_document, componentDidMount, getLocalHistory, this.state.templateEditHistoryArray, this.state.templateElementCount', this.state.templateEditHistoryArray, this.state.templateElementCount);
            }); // end of second setState
          }); // end of first setState
        } // end of if destringifiedHistory elements
        // if there is localStorageHistory return an object for use in document reducer
        return {
          templateEditHistoryArray: destringifiedHistory[this.props.agreement.id].history || this.state.templateEditHistoryArray,
          historyIndex: destringifiedHistory[this.props.agreement.id].historyIndex || this.state.historyIndex,
          elements: destringifiedHistory[this.props.agreement.id].elements
        };
      } // end of if localStorageHistory
      // if there is no localStorageHistory return null
      return null;
    }; // end of getLocalHistory

    let templateEditHistory = null;
    if (this.props.showTemplate) {
      // !!!!! When refreshing localStorageHistory, comment out below getLocalHistory
      // templateEditHistory can be null in later code;
      // all local state values set in constructor already
      // templateEditHistory = getLocalHistory();
      // If there is templateEditHistory object, create elements with temporary ids (ie id: '1a')
      // calculate highestElementId for templateElementCount (for numbering element temporary ids)
      if (templateEditHistory && templateEditHistory.elements) {
        let highestElementId = 0;
        _.each(Object.keys(templateEditHistory.elements), eachElementKey => {
          // get the highest id to avoid duplicate element id after templateElements repopulated
          highestElementId = highestElementId > parseInt(eachElementKey, 10) ? highestElementId : parseInt(eachElementKey, 10)
          this.props.createDocumentElementLocally(templateEditHistory.elements[eachElementKey]);
        }); // end of each elements
        this.setState({ templateElementCount: highestElementId });
      }

      console.log('in create_edit_document, componentDidMount, getLocalHistory, right before populateTemplateElementsLocally, this.props.agreement.document_fields', this.props.agreement.document_fields);
      // this.props.populateTemplateElementsLocally(this.props.agreement.document_fields, () => getLocalHistory());
      // If there are elements persisted in backend DB, populate this.props.templateElements
      if (this.props.agreement.document_fields.length > 0) {
        this.props.populateTemplateElementsLocally(this.props.agreement.document_fields, () => {}, templateEditHistory);
      }

    }

    // window.addEventListener('onblur', this.handleUserInput);

    console.log('in create_edit_document, componentDidMount, this.props.agreement', this.props.agreement);
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
  // Do not need componentDidUpdate for setLocalStorageHistory since done in setTemplateHistoryArray
  // componentDidUpdate(prevProps) {
  //   console.log('in create_edit_document, componentDidUpdate, outside if prevProps.templateElements !== this.props.templateElements', prevProps.templateElements !== this.props.templateElements);
  //   if (!_.isEmpty(prevProps.templateElements) && Object.keys(prevProps.templateElements).length !== Object.keys(this.props.templateElements).length) {
  //     console.log('in create_edit_document, componentDidUpdate, inside if prevProps.templateElements !== this.props.templateElements', prevProps.templateElements !== this.props.templateElements);
  //     // this.setLocalStorageHistory('componentDidUpdate');
  //   }
  // }


  componentWillUnmount() {
    // Housekeeping for when component unmounts
    document.removeEventListener('click', this.getMousePosition);
    document.removeEventListener('click', this.handleFontControlCloseClick);
    this.setLocalStorageHistory('componentWillUnmount');
    // window.removeEventListener('onBlur', this.handleUserInput);

    console.log('in create_edit_document, componentWillUnmount ');
  }

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

  handleTemplateSubmitCallback() {
    this.setState({
      modifiedPersistedElementsObject: {},
      templateEditHistoryArray: [],
      historyIndex: 0,
    }, () => {
      this.setLocalStorageHistory('handleTemplateSubmitCallback');
      this.props.showLoading();
    });
  }
  // What's saved in localStorageHistory
  // history: this.state.templateEditHistoryArray,
  // elements: unsavedTemplateElements,
  // historyIndex: this.state.historyIndex,
  // newFontObject: this.state.newFontObject,
  // modifiedPersistedElementsObject; this.state.modifiedPersistedElementsObject

  handleTemplateFormSubmit({ data, submitAction }) {
    const documentFieldArray = [];
    const deletedDocumentFieldIdArray = [];
    // const newDocumentFieldArray = [];
    const paramsObject = {
      flat_id: this.props.flat.id,
      booking_id: this.props.booking.id,
      document_name: this.props.agreement.document_name,
      document_field: documentFieldArray,
        deleted_document_field_id_array: deletedDocumentFieldIdArray,
      // new_document_field: newDocumentFieldArray,
      agreement_id: this.props.agreement ? this.props.agreement.id : null,
      document_language_code: this.props.documentLanguageCode,
      // deleted_document_field: this.state.modifiedPersistedElementsArray,
    };

    console.log('in create_edit_document, handleTemplateFormSubmit, data, submitAction: ', data, submitAction);

    // console.log('in create_edit_document, handleTemplateFormSubmit, data, submitAction: ', data, submitAction);
    _.each(Object.keys(this.state.modifiedPersistedElementsObject), eachKey => {
      let documentField = null;
      // console.log('in create_edit_document, handleTemplateFormSubmit, eachKey.indexOf(a): ', eachKey.indexOf('a'));
      console.log('in create_edit_document, handleTemplateFormSubmit, eachKey, this.state.modifiedPersistedElementsObject[eachKey]: ', eachKey, this.state.modifiedPersistedElementsObject[eachKey]);
      if (this.state.modifiedPersistedElementsObject[eachKey].deleted === true) {
        deletedDocumentFieldIdArray.push(eachKey);
      } else {
        // if not deleted === true, its been modified or newly created
        documentField = this.props.templateElements[eachKey];
      }

      if (documentField) {
        const value = data[documentField.name];
        documentField.value = value;
        documentFieldArray.push(documentField);
      }
    });

    console.log('in create_edit_document, handleTemplateFormSubmit, paramsObject: ', paramsObject);
    this.props.saveTemplateDocumentFields(paramsObject, () => this.handleTemplateSubmitCallback());
    this.props.showLoading()
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
          // nullRequiredField = this.props.requiredFieldsNull.includes(formField.name);
          nullRequiredField = this.props.requiredFieldsNull.indexOf(formField.name) !== -1;
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
      // const templateElementCount = this.state.templateElementCount;
      this.setState({
        templateElementCount: this.state.templateElementCount + 1,
        createNewTemplateElementOn: false,
        // historyIndex: this.historyIndex + 1
      }, () => {
        const templateElementChoice = true;
        // console.log('in create_edit_document, getMousePosition1, templateElementAttributes.x, templateElementAttributes.page, ', this.state.templateElementAttributes.x, this.state.templateElementAttributes.y, this.state.templateElementAttributes.page);
        let templateElementAttributes = {};
        if (templateElementChoice) {
          templateElementAttributes = {
            id: `${this.state.templateElementCount}a`,
            left: `${x}%`,
            top: `${y}%`,
            page: parseInt(elementVal, 10),
            name: 'name',
            component: 'DocumentChoices',
            // component: 'input',
            width: null,
            height: null,
            // type: 'text', // or 'string' if an input component
            input_type: 'button', // or 'string' if an input component
            class_name: 'document-rectangle-template',
            border_color: 'lightgray',
            // font_style: this.state.newFontObject.font_style,
            // font_weight: this.state.newFontObject.font_weight,
            // font_family: this.state.newFontObject.font_family,
            // font_size: this.state.newFontObject.font_size,
            document_field_choices: {
              0: { val: 'Public Water', top: null, left: null, width: '5.5%', height: '1.6%', top_px: null, left_px: null, width_px: null, height_px: null, class_name: 'document-rectangle-template-button', border_radius: '50%', border: '1px solid black', input_type: 'button' },
              1: { val: 'Tank', top: null, left: null, width: '5.5%', height: '1.6%', top_px: null, left_px: null, width_px: null, height_px: null, class_name: 'document-rectangle-template-button', border_radius: '50%', border: '1px solid black', input_type: 'button' },
              2: { val: 'Well', top: null, left: null, width: '5.5%', height: '1.6%', top_px: null, left_px: null, width_px: null, height_px: null, class_name: 'document-rectangle-template-button', border_radius: '50%', border: '1px solid black', input_type: 'button' },
            }
          };
          // in get_initialvalues_object_important_points_explanation.js
          // 0: { params: { val: 'Public Water', top: '66.7%', left: '17.3%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: [], value: '' } },
          // 1: { params: { val: 'Tank', top: '66.7%', left: '23.3%', width: '6.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: [], value: '' } },
          // 2: { params: { val: 'Well', top: '66.7%', left: '30%', width: '5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: [], value: '' } },
        } else {
          templateElementAttributes = {
            id: `${this.state.templateElementCount}a`,
            left: `${x}%`,
            top: `${y}%`,
            page: parseInt(elementVal, 10),
            name: 'name',
            component: 'DocumentChoices',
            // component: 'input',
            width: '25%',
            height: '1.6%',
            input_type: 'text', // or 'string' if an input component
            class_name: 'document-rectangle-template',
            border_color: 'lightgray',
            font_style: this.state.newFontObject.font_style,
            font_weight: this.state.newFontObject.font_weight,
            font_family: this.state.newFontObject.font_family,
            font_size: this.state.newFontObject.font_size
          };
        }

        this.props.createDocumentElementLocally(templateElementAttributes);
        // add action element action before putting in array before setState
        // const elementCopy = this.getNewElementObject(templateElementAttributes)
        // elementCopy.action = 'create'
        this.setTemplateHistoryArray([templateElementAttributes], 'create')
        // this.setState({ templateEditHistoryArray: [...this.state.templateEditHistoryArray, [templateElementAttributes]] })
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
    // if (!this.state.selectedTemplateElementIdArray.includes(elementVal)) {
    if (this.state.selectedTemplateElementIdArray.indexOf(elementVal) === -1) {
      // place in array of checked elements
      this.setState({
        // Push id into array in string type so as to enable temporary id with '1a' char in it
        selectedTemplateElementIdArray: [...this.state.selectedTemplateElementIdArray, elementVal],
        newFontObject: { ...this.state.newFontObject, override: false }
      }, () => {
        // Get the font attributes of selected elements to show on the control box font button
        this.getSelectedFontElementAttributes()
        // if all elements checked, set to true
        this.setState({
          allElementsChecked: this.state.selectedTemplateElementIdArray.length === Object.keys(this.props.templateElements).length
        }, () => {
          console.log('in create_edit_document, handleTemplateElementCheckClick, this.state.allElementsChecked, this.state.selectedTemplateElementIdArray, ', this.state.allElementsChecked, this.state.selectedTemplateElementIdArray);
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
          allElementsChecked: this.state.selectedTemplateElementIdArray.length === Object.keys(this.props.templateElements).length,
          newFontObject: { ...this.state.newFontObject, override: true }
        }, () => {
          console.log('in create_edit_document, handleTemplateElementCheckClick, this.state.allElementsChecked, ', this.state.allElementsChecked);
          // If there are no more checked elements, set selectedElementFontObject to null
          // That means newFontObject will kick in on the font button on the element edit control box
          if (this.state.selectedTemplateElementIdArray.length === 0) {
            this.setState({ selectedElementFontObject: null })
          }
        })
        // console.log('in create_edit_document, handleTemplateElementCheckClick, this.state.selectedTemplateElementIdArray, ', this.state.selectedTemplateElementIdArray);
      });
    }
  }

  dragElement(element, tabs, inputElements, parentRect, actionCallback, move, elementType, selectedElements) {
    // pos1 and 2 are for getting delta of pointer position;
    // pos3 and 4 are for getting updated mouse position
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    // console.log('in create_edit_document, dragElement, inputElements, ', inputElements);
    // Get the original values of each element selected for use in history array
    const originalValueObject = {};
    // Use input elements and not selectedElements since input element dimensions
    // drive the size of the wrapper and the tabs
    if (inputElements) {
      // if inputElements exists then must be resize drag
      _.each(inputElements, eachElement => {
        const inputElementDimensions = eachElement.getBoundingClientRect();
        originalValueObject[eachElement.id.split('-')[3]] = {
          top: inputElementDimensions.top,
          left: inputElementDimensions.left,
          width: inputElementDimensions.width,
          height: inputElementDimensions.height,
        };
      });
    } else if (selectedElements.length > 0) {
      // if inputElement is null and selectedElements is populated,
      // must be a multiple element move
      _.each(selectedElements, eachElement => {
        originalValueObject[eachElement.id.split('-')[2]] = {
          top: eachElement.style.top,
          left: eachElement.style.left,
        };
      });
    } else {
      // if even selectedElements is empty, must be a single eleemnt drag move
      originalValueObject[element.id.split('-')[2]] = {
        top: element.style.top,
        left: element.style.left,
      };
    }

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
      // In percentages; Assign to element.
      // offsetTop returns the distance of the current element relative to the top of the offsetParent node
      if (move) {
        const modifiedElement = element;
        modifiedElement.style.top = `${((element.offsetTop - pos2) / (parentRect.bottom - parentRect.top)) * 100}%`;
        modifiedElement.style.left = `${((element.offsetLeft - pos1) / (parentRect.right - parentRect.left)) * 100}%`;
        if (selectedElements.length > 0) {
          _.each(selectedElements, eachElement => {
            // console.log('in create_edit_document, dragElement, in each selectedElements, eachElement, ', eachElement);
            const modifiedElem = eachElement;
            if (eachElement.id !== element.id) {
              modifiedElem.style.top = `${((eachElement.offsetTop - pos2) / (parentRect.bottom - parentRect.top)) * 100}%`;
              modifiedElem.style.left = `${((eachElement.offsetLeft - pos1) / (parentRect.right - parentRect.left)) * 100}%`;
            }
          })
        }
      } else { // if resize
        // get original width and height of element to subtract from or add to
        let originalWidth = parseFloat(element.style.width);
        let originalHeight = parseFloat(element.style.height);
        // margin in PX
        // get percentage of the position delta in relation to parent element size in px
        const pos2Percentage = (pos2 / parentRect.height) * 100
        const pos1Percentage = (pos1 / parentRect.width) * 100
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
              // originalValueObject[eachElement.id.split('-')[2]] = { originalWidth: eachElement.style.width, originalHeight: eachElement.style.height };
              elementType !== 'string' ? modifiedElem.style.height = `${(originalHeight - pos2Percentage)}%` : '';
              modifiedElem.style.width = `${(originalWidth - pos1Percentage)}%`;
            }
          });
        }

        // change tabs margin to move with width and height changes
        _.each(tabs, eachTab => {
          const modifiedTab = eachTab;
          const originalTabMarginLeft = parseFloat(eachTab.style.marginLeft);
          modifiedTab.style.marginLeft = `${(originalTabMarginLeft - pos1)}px`;
        });
      }
      // console.log('in create_edit_document, dragElement, selectedElements, inputElement, element, tabs, ', selectedElements, inputElements, element, tabs);
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;

      // Object to be sent to reducer in array below
      let updatedElementObject = null;
      const array = [];
      // If no elements selected, use the one element dragged in array
      const interatedElements = selectedElements.length > 0 ? selectedElements : [element];

      if (move) {
        // id is the index 2 (third element) in split array
        // the wrapper div top and left are same as input element top and left
        _.each(interatedElements, eachElement => {
          console.log('in create_edit_document, dragElement, closeDragElement, in each eachElement, inputElements, originalValueObject, ', eachElement, inputElements, originalValueObject);
          updatedElementObject = {
            // !!!!NOTE: Need to keep id as string so can check in backend if id includes "a"
            id: eachElement.id.split('-')[2], // get the id part of template-element-[id]
            left: eachElement.style.left,
            top: eachElement.style.top,
            o_left: originalValueObject[eachElement.id.split('-')[2]].left,
            o_top: originalValueObject[eachElement.id.split('-')[2]].top,
            action: 'update'
          };
          // place in array to be processed in action and reducer
          array.push(updatedElementObject);
        });
      } else {
        // if not move (resize) send object to update
        // take out TAB_HEIGHT so that TAB_HEIGHT is not added again
        // to adjust input element height and avoid wrapping div height at render
        // the actual size of the input element to be updated in app state
        _.each(interatedElements, eachElement => {
          const inputElement = inputElements.filter(each => eachElement.id.split('-')[2] == each.id.split('-')[3])
          const inputElementDimensions = inputElement[0].getBoundingClientRect()
          // oWidth and oHeight for original values for use in history
          updatedElementObject = {
            // !!!!NOTE: Need to keep id as string so can check in backend if id includes "a"
            id: eachElement.id.split('-')[2], // get the id part of template-element-[id]
            width: `${(inputElementDimensions.width / parentRect.width) * 100}%`,
            height: `${(inputElementDimensions.height / parentRect.height) * 100}%`,
            o_width: `${(originalValueObject[eachElement.id.split('-')[2]].width / parentRect.width) * 100}%`,
            o_height: `${(originalValueObject[eachElement.id.split('-')[2]].height / parentRect.height) * 100}%`,
            action: 'update',
          };
          // console.log('in create_edit_document, dragElement, closeDragElement, in each eachElement, inputElements, originalValueObject, ', eachElement, inputElements, originalValueObject);
          // place in array to be processed in action and reducer
          array.push(updatedElementObject);
        });
      } // end of else
      // console.log('in create_edit_document, dragElement, closeDragElement, array, ', array);
      // Callback defined in resize and move handlers
      actionCallback(array);
    }
  }

dragChoice(choiceButton, choiceId, choiceIndex, otherChoicesArray, wrapperDiv, choiceButtonDimensions, wrapperDivDimensions, backgroundDimensions, tab, templateElements, callback) {
  // ************************************
  // IMPORTANT: The basic idea of this function is to draw the wrapper
  // around the choice buttons which start with width and height % against the background;
  // The fucntion gets the top and left % against the background when first moved;
  // From the second time onwards, the top, left, width and height pxs are calculated
  // from % against the background and passed on to state. Only one button moves,
  // so the others (called others herein) keep their exact values in each run.
  // Passing on exact values is important so that the buttons do not move or change
  // in size in each call of this function.
  // ************************************
    // pos1 and 2 are for getting delta of pointer position;
    // pos3 and 4 are for getting updated mouse position
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    // Assign to modifiable objects
    const modifiedChoiceButton = choiceButton;
    const modifiedwrapperDiv = wrapperDiv;
    // Turn choiceMoved boolean true if mouse moved dragMouseDown
    // If remains false in closeDragElement, do not run code in closeDragElement
    let choiceMoved = false;

      // console.log('in create_edit_document, dragChoice, pos1, pos2, pos3, pos4 ', pos1, pos2, pos3, pos4);
    let newWrapperDivDimensions = null;
    let newChoiceButtonDimensions = null;
    // Get choice stored in app state
    const choiceInState = templateElements[choiceId].document_field_choices[choiceIndex];
    // Get original values in PX of choice being moved based on % stored in app state
    const choiceButtonHeightInPx = (parseFloat(choiceInState.height) / 100) * backgroundDimensions.height;
    const choiceButtonWidthInPx = (parseFloat(choiceInState.width) / 100) * backgroundDimensions.width;
    // Define variables for getting values in object for
    // other choice buttons (buttons not being moved)
    // const otherChoicesObject = {};
    // gotodragchoice
    const otherChoicesObject = getOtherChoicesObject({ wrapperDiv, otherChoicesArray, templateElements, backgroundDimensions, wrapperDivDimensions });
    // let otherIndex = null;
    // let eachOtherDims = null;
    // let eachOtherInState = null;
    // let elementId = wrapperDiv.getAttribute('id').split('-')[2];
    // // Get dimensions in PX of EACH OF other choices
    // _.each(otherChoicesArray, each => {
    //   otherIndex = parseInt(each.getAttribute('value').split(',')[1], 10);
    //   otherChoicesObject[otherIndex] = {};
    //   eachOtherDims = each.getBoundingClientRect();
    //   eachOtherInState = templateElements[elementId].document_field_choices[otherIndex]
    //   // If document_field_choices already have top and other attributes,
    //   // Get values from state. Otherwise get top from getBoundingClientRect object
    //   if (eachOtherInState.top) {
    //     otherChoicesObject[otherIndex].widthInPx = (parseFloat(eachOtherInState.width) / 100) * backgroundDimensions.width;
    //     otherChoicesObject[otherIndex].heightInPx = (parseFloat(eachOtherInState.height) / 100) * backgroundDimensions.height;
    //     otherChoicesObject[otherIndex].topInPx = (((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top);
    //     otherChoicesObject[otherIndex].leftInPx = (((parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left);
    //     otherChoicesObject[otherIndex].originalTopInPx = (((parseFloat(eachOtherInState.top) / 100) * backgroundDimensions.height) + backgroundDimensions.top) - wrapperDivDimensions.top;
    //     otherChoicesObject[otherIndex].originalLeftInPx = (((parseFloat(eachOtherInState.left) / 100) * backgroundDimensions.width) + backgroundDimensions.left) - wrapperDivDimensions.left;
    //
    //   } else {
    //     otherChoicesObject[otherIndex].widthInPx = (parseFloat(eachOtherInState.width) / 100) * backgroundDimensions.width;
    //     otherChoicesObject[otherIndex].heightInPx = (parseFloat(eachOtherInState.height) / 100) * backgroundDimensions.height;
    //     otherChoicesObject[otherIndex].topInPx = eachOtherDims.top;
    //     otherChoicesObject[otherIndex].leftInPx = eachOtherDims.left;
    //     otherChoicesObject[otherIndex].originalTopInPx = eachOtherDims.top - wrapperDivDimensions.top;
    //     otherChoicesObject[otherIndex].originalLeftInPx = eachOtherDims.left - wrapperDivDimensions.left;
    //   }
    //   otherChoicesObject[otherIndex].element = each;
    // });

    // const setBoundaries = (elementsArray, newWrapperDims, adjustmentPx) => {
    //   let dimensionsObject = {};
    //   let highestTopInPx = 10000; // set at really high value so first lower will be selected
    //   let lowestBottomInPx = 0;
    //   let mostLeftInPx = 10000;
    //   let mostRightInPx = 0;
    //
    //   _.each(elementsArray, elementDimensions => {
    //     highestTopInPx = highestTopInPx > elementDimensions.top ? elementDimensions.top - adjustmentPx : highestTopInPx;
    //     lowestBottomInPx = lowestBottomInPx < elementDimensions.bottom ? elementDimensions.bottom : lowestBottomInPx;
    //     mostLeftInPx = mostLeftInPx > elementDimensions.left ? elementDimensions.left - adjustmentPx : mostLeftInPx;
    //     mostRightInPx = mostRightInPx < elementDimensions.right ? elementDimensions.right : mostRightInPx;
    //   })
    //
    //   dimensionsObject = {
    //     highestTopInPx,
    //     lowestBottomInPx,
    //     mostLeftInPx,
    //     mostRightInPx,
    //     top: `${((highestTopInPx - newWrapperDims.top) / newWrapperDims.height) * 100}%`,
    //     left: `${((mostLeftInPx - newWrapperDims.left) / newWrapperDims.width) * 100}%`,
    //     width: `${((mostRightInPx - mostLeftInPx) / newWrapperDims.width) * 100}%`,
    //     height: `${((lowestBottomInPx - highestTopInPx) / newWrapperDims.height) * 100}%`,
    //     topInPx: highestTopInPx,
    //     leftInPx: mostLeftInPx,
    //     widthInPx: mostRightInPx - mostLeftInPx,
    //     heightInPx: lowestBottomInPx - highestTopInPx,
    //   };
    //
    //   return dimensionsObject;
    // };
    // Create offsets or distance between element and wrapperDiv; There is no native function
    let offsetRight = 0;
    let offsetBottom = 0;
    let offsetTop = 1000;
    let offsetLeft = 1000;

    let againstTop = false;
    let againstBottom = false;
    let againstLeft = false;
    let againstRight = false;

    let againstOtherTop = false;
    let againstOtherBottom = false;
    let againstOtherLeft = false;
    let againstOtherRight = false;

  // Get boundaries for other choices (not dragged choice);
  // for when wrapper bounary needs to stop
   const originalOtherDims = () => {
     const array = [];
     _.each(otherChoicesArray, eachOther => {
       const eachDims = eachOther.getBoundingClientRect();
       array.push(eachDims);
     });
     // const object = setBoundaries(array);
     const object = setBoundaries({ elementsArray: array, newWrapperDims: wrapperDivDimensions, adjustmentPx: 0 });
     return object;
   };
   // Get original dimensions of other choice elements AS A GROUP
   const originalOtherDimensions = originalOtherDims();

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
      // || 0 to eliminate NaN
      pos1 = (pos3 - e.clientX) || 0;
      pos2 = (pos4 - e.clientY) || 0;
      // set this round to use for next round in pos 1 and 2
      pos3 = e.clientX;
      pos4 = e.clientY;

      // for some reason, using innerDiv does not work; use TAB_HEIGHT instead
      // newInnerDivDimensions = innerDiv.getBoundingClientRect();
      // Get object with element dimensions { top: xxpx, height: xxpx }
      newWrapperDivDimensions = modifiedwrapperDiv.getBoundingClientRect();
      newChoiceButtonDimensions = modifiedChoiceButton.getBoundingClientRect();
      console.log('in create_edit_document, test for choicebutton width and height dragChoice, closeDragElement, wrapperDivDimensions.bottom, newWrapperDivDimensions.bottom, wrapperDivDimensions.left, newWrapperDivDimensions.left', wrapperDivDimensions.bottom, newWrapperDivDimensions.bottom, wrapperDivDimensions.bottom - newWrapperDivDimensions.bottom, wrapperDivDimensions.left, newWrapperDivDimensions.left, wrapperDivDimensions.bottom - newWrapperDivDimensions.bottom, wrapperDivDimensions.left - newWrapperDivDimensions.left);

      // Get change in top of original wrapper div and updated wrapper div
      const cumulDeltaTop = newWrapperDivDimensions.top - wrapperDivDimensions.top;
      // If there is vertical movement
      if (pos2 !== 0) {
        choiceMoved = true;
        offsetBottom = (newWrapperDivDimensions.bottom - TAB_HEIGHT) - newChoiceButtonDimensions.bottom;
        offsetTop = newChoiceButtonDimensions.top - newWrapperDivDimensions.top;
        // If wrapper div is pushing against other choice elements
        againstOtherTop = originalOtherDimensions.highestTopInPx - newWrapperDivDimensions.top <= 0;
        // if there is no more px between top of wrapperDiv and choiceButton
        againstTop = offsetTop <= 1 && !againstOtherTop;
        // Move choice element and wrapper up if no more room
        // and not pushing up against other choices
        if (againstTop) {
          againstOtherBottom = false;
          againstBottom = false;
          // Set height and top of wrapperDiv
          modifiedwrapperDiv.style.height = `${((newWrapperDivDimensions.height + pos2) / backgroundDimensions.height) * 100}%`;
          modifiedwrapperDiv.style.top = `${((((parseFloat(modifiedwrapperDiv.style.top) / 100) * backgroundDimensions.height) - pos2) / backgroundDimensions.height) * 100}%`;
          // Set top and height of choice button element
          // Use 0% instead of below code so that choiceButton does not overrun wrapper boundaries
          // modifiedChoiceButton.style.top = `${(((parseFloat(modifiedChoiceButton.style.top) / 100) * (newWrapperDivDimensions.height - TAB_HEIGHT)) / (newWrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`;
          modifiedChoiceButton.style.top = '0%';
          modifiedChoiceButton.style.height = `${(choiceButtonHeightInPx / (newWrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`;
          // Adjust height of other buttons since the wrapper div height will change
          // Set height and top of other elements within the wrapperDiv
          // Use cumulDeltaTop to get difference in original and new wrapper top
          // Use original height to get new % in new wrapper height
          _.each(Object.keys(otherChoicesObject), eachIndex => {
            otherChoicesObject[eachIndex].element.style.height = `${(otherChoicesObject[eachIndex].heightInPx / (newWrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`;
            otherChoicesObject[eachIndex].element.style.top = `${((otherChoicesObject[eachIndex].originalTopInPx - cumulDeltaTop) / (newWrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`;
          });
        }

        // if there is no more px between bottom of wrapperDiv and choiceButton
        againstOtherBottom = (newWrapperDivDimensions.bottom - TAB_HEIGHT) - originalOtherDimensions.lowestBottomInPx <= 0;
        againstBottom = (offsetBottom <= 1) && !againstOtherBottom;
        if (againstBottom) {
          againstOtherTop = false;
          againstTop = false;
          // Set height and top of wrapperDiv
          modifiedwrapperDiv.style.height = `${((newWrapperDivDimensions.height - pos2) / backgroundDimensions.height) * 100}%`;
          // Set height and top of choiceButton
          modifiedChoiceButton.style.top = `${(1 - (choiceButtonHeightInPx / (newWrapperDivDimensions.height - TAB_HEIGHT))) * 100}%`;
          // console.log('in create_edit_document, dragChoice, in if offsetBottom <= 0, pos1, pos2, pos3, pos4, modifiedChoiceButton.style.top, newWrapperDivDimensions, newInnerDivDimensions, newChoiceButtonDimensions  ', pos1, pos2, pos3, pos4, modifiedChoiceButton.style.top, newWrapperDivDimensions, newInnerDivDimensions, newChoiceButtonDimensions);
          modifiedChoiceButton.style.height = `${(choiceButtonHeightInPx / (newWrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`;
          // Adjust height of other buttons since the wrapper div height will change
          // Set height and top of other elements within the wrapperDiv
          _.each(Object.keys(otherChoicesObject), eachIndex => {
            otherChoicesObject[eachIndex].element.style.height = `${(otherChoicesObject[eachIndex].heightInPx / (newWrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`;
            otherChoicesObject[eachIndex].element.style.top = `${((otherChoicesObject[eachIndex].originalTopInPx - cumulDeltaTop) / (newWrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`;
          });
        } // end of if offsetBottom

        // If the button is not touching either wrapperDiv boundary, change top
        // i.e. in middle of other choice divs
        if (!againstTop && !againstBottom) {
          modifiedChoiceButton.style.top = `${((((parseFloat(modifiedChoiceButton.style.top) / 100) * (newWrapperDivDimensions.height - TAB_HEIGHT)) - pos2) / (newWrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`;
          modifiedChoiceButton.style.height = `${(choiceButtonHeightInPx / (newWrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`;
          // if choice element is pushing up against top or bottom of wrapper (excl tab height),
          // KEY: Move the wrapper top so that againstOtherBottom and againstOtherTop become false
          // to make againstTop and againstBottom true and move wrapper div top up and down
          if (offsetTop <= 1 || offsetBottom <= 1) {
            modifiedwrapperDiv.style.top = `${((((parseFloat(modifiedwrapperDiv.style.top) / 100) * backgroundDimensions.height) - pos2) / backgroundDimensions.height) * 100}%`;
          }
        } // end of if !againstTop && !againstBottom
      } // end of if pos2 !== 0

      // If there is horizontal movement
      if (pos1 !== 0) {
        choiceMoved = true;
        // Get difference between choice element and wrapper div right and left
        offsetRight = newWrapperDivDimensions.right - newChoiceButtonDimensions.right;
        offsetLeft = newChoiceButtonDimensions.left - newWrapperDivDimensions.left;
        // Get difference between other choices and
        againstOtherRight = newWrapperDivDimensions.right - originalOtherDimensions.mostRightInPx <= 0;
        againstOtherLeft = originalOtherDimensions.mostLeftInPx - newWrapperDivDimensions.left <= 0;
        // if there is no more px between top of wrapperDiv and choiceButton;
        // AND wrapper div is not pressing up against other choices
        // move right and left
        againstRight = offsetRight <= 1 && !againstOtherRight;
        againstLeft = offsetLeft <= 1 && !againstOtherLeft;
        // Get difference between original wrapper div dimensions and new dimensions
        const cumulDeltaLeft = newWrapperDivDimensions.left - wrapperDivDimensions.left;
        // Move wrapper and choice element left when pressed up against wrapper
        if (againstLeft) {
          // Keep track of how much the wrapperDiv has been moved
          // Set width and left of wrapperDiv
          modifiedwrapperDiv.style.width = `${((newWrapperDivDimensions.width + pos1) / backgroundDimensions.width) * 100}%`;
          modifiedwrapperDiv.style.left = `${((((parseFloat(modifiedwrapperDiv.style.left) / 100) * backgroundDimensions.width) - pos1) / backgroundDimensions.width) * 100}%`;
          // Set width and left of choiceBox left and keep pressing up
          modifiedChoiceButton.style.left = '0%';
          modifiedChoiceButton.style.width = `${(choiceButtonWidthInPx / (newWrapperDivDimensions.width)) * 100}%`;
          // Set left and width of other elements within the wrapper
          _.each(Object.keys(otherChoicesObject), eachIndex => {
            otherChoicesObject[eachIndex].element.style.width = `${(otherChoicesObject[eachIndex].widthInPx / (newWrapperDivDimensions.width)) * 100}%`;
            otherChoicesObject[eachIndex].element.style.left = `${((otherChoicesObject[eachIndex].originalLeftInPx - cumulDeltaLeft) / (newWrapperDivDimensions.width)) * 100}%`;
          });
        }
        // Move wrapper left and choice left and set width
        // when pressed up against right wall of wrapper div
        if (againstRight) {
          // Set width and left of wrapperDiv
          modifiedwrapperDiv.style.width = `${((newWrapperDivDimensions.width - pos1) / backgroundDimensions.width) * 100}%`;
          // Set width and left of choiceBox left is kept at 0%
          modifiedChoiceButton.style.left = `${(1 - (newChoiceButtonDimensions.width / newWrapperDivDimensions.width)) * 100}%`;
          modifiedChoiceButton.style.width = `${(choiceButtonWidthInPx / (newWrapperDivDimensions.width)) * 100}%`;
          // Set left and width of other elements within the wrapper
          _.each(Object.keys(otherChoicesObject), eachIndex => {
            otherChoicesObject[eachIndex].element.style.width = `${(otherChoicesObject[eachIndex].widthInPx / (newWrapperDivDimensions.width)) * 100}%`;
            otherChoicesObject[eachIndex].element.style.left = `${((otherChoicesObject[eachIndex].originalLeftInPx - cumulDeltaLeft) / (newWrapperDivDimensions.width)) * 100}%`;
          });
        }
        // if not hitting either wrapperDiv boundary, adjust left of choiceButton
        if (!againstRight && !againstLeft) {
          // console.log('in create_edit_document, dragChoice, elementDrag pos1 if NOT against right or left offsetLeft, offsetRight, againstOtherLeft, againstOtherRight, newWrapperDivDimensions ', offsetLeft, offsetRight, againstOtherLeft, againstOtherRight, newWrapperDivDimensions);
          modifiedChoiceButton.style.left = `${((((parseFloat(modifiedChoiceButton.style.left) / 100) * newWrapperDivDimensions.width) - pos1) / (newWrapperDivDimensions.width)) * 100}%`;
          if (offsetLeft <= 1 || offsetRight <= 1) {
            modifiedwrapperDiv.style.left = `${((((parseFloat(modifiedwrapperDiv.style.left) / 100) * backgroundDimensions.width) - pos1) / backgroundDimensions.width) * 100}%`;
          }
        }

        // Make tab move with expansion/contraction of wrapperDiv width
        // The tab should move only if wrapperDiv width is wider than the tab and rear space
        const modifiedTab = tab;
        if (newWrapperDivDimensions.width > (TAB_WIDTH + TAB_REAR_SPACE)) {
          modifiedTab.style.marginLeft = `${(newWrapperDivDimensions.width - (TAB_WIDTH + TAB_REAR_SPACE))}px`;
        }
      }
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      // console.log('in create_edit_document, dragChoice, closeDragElement, document.onmouseup, document.onmousemove: ',  document.onmouseup, document.onmousemove);
      console.log('in create_edit_document, dragChoice, closeDragElement, otherChoicesObject: ', otherChoicesObject);
      // Get all elements in array
      if (choiceMoved) {
        const iteratedElements = [...otherChoicesArray, choiceButton];
        const elementId = choiceButton.getAttribute('value').split(',')[0];
        // const newDocumentFieldChoices = {};
        // const oldDocumentFieldChoices = {};
        // // let elementId = null;
        // let elementIndex = null;
        // let parentElement = null;
        // let choiceElement = null;
        // let top = null;
        // let left = null;
        // let width = null;
        // let height = null;
        // let widthPx = null;
        // let heightPx = null;
        // let topPx = null;
        // let leftPx = null;
        // const array = [];
        // let elementDimensions = null;
        // let adjElementDimensions = null;
        //
        // // Iterate through each element;
        // _.each(iteratedElements, eachElement => {
        //   // Get dimensions in px for each element;
        //   elementDimensions = eachElement.getBoundingClientRect();
        //   // Get the id and index of each choice
        //   elementId = eachElement.getAttribute('value').split(',')[0];
        //   elementIndex = parseInt(eachElement.getAttribute('value').split(',')[1], 10);
        //   // Get the parent template element from this.props.templateElements
        //   parentElement = templateElements[elementId];
        //   // Get the document_field_choice for eachElement
        //   choiceElement = parentElement.document_field_choices[elementIndex];
        //   // console.log('in create_edit_document, dragChoice, closeDragElement, eachElement, elementDimensions, otherChoicesObject, choiceButtonDimensions, wrapperDivDimensions, innerDiv, innerDivDimensions, backgroundDimensions: ', eachElement, elementDimensions, otherChoicesObject, choiceButtonDimensions, wrapperDivDimensions, innerDiv, innerDivDimensions, backgroundDimensions);
        //   // Get the values in percentages i.e. 5% NOT 0.05
        //   // Use original px values to avoid shrinking after each move
        //   if (elementIndex === choiceIndex) {
        //     top = `${((elementDimensions.top - backgroundDimensions.top) / backgroundDimensions.height) * 100}%`
        //     left = `${((elementDimensions.left - backgroundDimensions.left) / backgroundDimensions.width) * 100}%`
        //     width = `${(choiceButtonWidthInPx / backgroundDimensions.width) * 100}%`;
        //     height = `${(choiceButtonHeightInPx / backgroundDimensions.height) * 100}%`;
        //     widthPx = choiceButtonWidthInPx;
        //     heightPx = choiceButtonHeightInPx;
        //     topPx = elementDimensions.top;
        //     leftPx = elementDimensions.left;
        //     adjElementDimensions = {
        //       left: elementDimensions.left,
        //       top: elementDimensions.top,
        //       right: elementDimensions.left + choiceButtonWidthInPx,
        //       bottom: elementDimensions.top + choiceButtonHeightInPx,
        //       width: choiceButtonWidthInPx,
        //       height: choiceButtonHeightInPx
        //     };
        //   } else {
        //     top = `${((otherChoicesObject[elementIndex].topInPx - backgroundDimensions.top) / backgroundDimensions.height) * 100}%`
        //     left = `${((otherChoicesObject[elementIndex].leftInPx - backgroundDimensions.left) / backgroundDimensions.width) * 100}%`
        //     width = `${(otherChoicesObject[elementIndex].widthInPx / backgroundDimensions.width) * 100}%`;
        //     height = `${(otherChoicesObject[elementIndex].heightInPx / backgroundDimensions.height) * 100}%`;
        //     widthPx = otherChoicesObject[elementIndex].widthInPx;
        //     heightPx = otherChoicesObject[elementIndex].heightInPx;
        //     topPx = otherChoicesObject[elementIndex].originalTopInPx;
        //     leftPx = otherChoicesObject[elementIndex].originalLeftInPx;
        //     adjElementDimensions = {
        //       left: otherChoicesObject[elementIndex].leftInPx,
        //       top: otherChoicesObject[elementIndex].topInPx,
        //       right: otherChoicesObject[elementIndex].leftInPx + otherChoicesObject[elementIndex].widthInPx,
        //       bottom: otherChoicesObject[elementIndex].topInPx + otherChoicesObject[elementIndex].heightInPx,
        //       width: otherChoicesObject[elementIndex].widthInPx,
        //       height: otherChoicesObject[elementIndex].heightInPx
        //     };
        //   }
        //   // Get the choice into an object mapped { 0: choice, 1: choice ...}
        //   newDocumentFieldChoices[elementIndex] = { ...choiceElement, top, left, width, height, width_px: widthPx, height_px: heightPx, top_px: topPx, left_px: leftPx }
        //   oldDocumentFieldChoices[elementIndex] = choiceElement;
        //   array.push(adjElementDimensions);
        // });
        const documentFieldObject = getNewDocumentFieldChoices({ choiceIndex, templateElements, iteratedElements, otherChoicesObject, backgroundDimensions, choiceButtonWidthInPx, choiceButtonHeightInPx });
        // Array with updated bounds/coordinates of all choices to be sent to setBoundaries
        const array = documentFieldObject.array;
        // New and old records of choices to be set in app stata in templateElements
        const newDocumentFieldChoices = documentFieldObject.newDocumentFieldChoices;
        const oldDocumentFieldChoices = documentFieldObject.oldDocumentFieldChoices;
        // Get an object to pass to action UPDATE_DOCUMENT_ELEMENT_LOCALLY.
        // This will also be used for history with undo and redo
        const lastWrapperDivDimsPre = wrapperDiv.getBoundingClientRect();
        // setBoundaries and getUpdatedElementObject imported
        const lastWrapperDivDims = setBoundaries({ elementsArray: array, newWrapperDims: lastWrapperDivDimsPre, adjustmentPx: 0 });
        // Object to be sent to documents reducer UPDATE_DOCUMENT_ELEMENT_LOCALLY
        const updatedElementObject = getUpdatedElementObject({ elementId, lastWrapperDivDims, backgroundDimensions, wrapperDivDimensions, newDocumentFieldChoices, oldDocumentFieldChoices, tabHeight: TAB_HEIGHT });
        // const updatedElementObject = {
        //   id: elementId,
        //   // new, updated dimensions
        //   top: `${((lastWrapperDivDims.topInPx - backgroundDimensions.top) / backgroundDimensions.height) * 100}%`,
        //   left: `${((lastWrapperDivDims.leftInPx - backgroundDimensions.left) / backgroundDimensions.width) * 100}%`,
        //   width: `${(lastWrapperDivDims.widthInPx / backgroundDimensions.width) * 100}%`,
        //   height: `${((lastWrapperDivDims.heightInPx) / backgroundDimensions.height) * 100}%`,
        //
        //   // old, before updated dimensions
        //   o_top: `${((wrapperDivDimensions.top - backgroundDimensions.top) / backgroundDimensions.height) * 100}%`,
        //   o_left: `${((wrapperDivDimensions.left - backgroundDimensions.left) / backgroundDimensions.width) * 100}%`,
        //   o_width: `${(wrapperDivDimensions.width / backgroundDimensions.width) * 100}%`,
        //   o_height: `${((wrapperDivDimensions.height - TAB_HEIGHT) / backgroundDimensions.height) * 100}%`,
        //
        //   document_field_choices: newDocumentFieldChoices,
        //   o_document_field_choices: oldDocumentFieldChoices,
        //   action: 'update'
        // };
        // Callback for updating state and writing history
        callback([updatedElementObject]);
      }
    } // end of if choiceMoved
}

  // Gets the actual elements (not just ids) of selected elements in handlers resize and mvoe
  getSelectedActualElements(elementIdString, ids) {
    const array = [];
    _.each(ids, id => {
      array.push(document.getElementById(`${elementIdString}${id}`));
    });
    return array;
  }

  handleTemplateElementMoveClick(event) {
    // For dragging and moving template elements; Use with dragElement function
    // let selectedElementsId = [];
    let selectedElements = [];
    const clickedElement = event.target;
    // elementVal is id or id of template element
    const elementVal = clickedElement.getAttribute('value');
    // Get the element being dragged directly
    const element = document.getElementById(`template-element-${elementVal}`);
    // Get the dimensions of the parent element
    const parentRect = element.parentElement.getBoundingClientRect()
    // console.log('in create_edit_document, handleTemplateElementMoveClick, parentRect ', parentRect);
    // define callback to be called in dragElement closeDragElement
    const callback = (updatedElementsArray) => {
      console.log('in create_edit_document, handleTemplateElementMoveClick, updatedElementsArray, ', updatedElementsArray);
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setTemplateHistoryArray(updatedElementsArray, 'update');
    };
    // Get array of elements selected or checked by user
    selectedElements = this.getSelectedActualElements('template-element-', this.state.selectedTemplateElementIdArray)
    // call dragElement and pass in the dragged element, the parent dimensions,
    // and the action to update the element in app state
    // last true is for move or not; in this case this is for move element
    this.dragElement(element, null, null, parentRect, callback, true, null, selectedElements);
  }

  handleTemplateElementChangeSizeClick(event) {
    // For dragging and resizing template elements
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
    // Get the actual input elements so they can be resized directly
    if (this.state.selectedTemplateElementIdArray.length > 0) {
      // If multiple elements selected, get array of multiple input elements
      inputElements = this.getSelectedActualElements('template-element-input-', this.state.selectedTemplateElementIdArray)
      // const tab = document.getElementById(`template-element-tab-${elementVal}`);
      // Get array of tabs attached to elements so marginLeft can be set dynamically
      tabs = this.getSelectedActualElements('template-element-tab-', this.state.selectedTemplateElementIdArray)
    } else {
      // If no other elements are selected, just put the one element into an array
      inputElements = [document.getElementById(`template-element-input-${elementVal}`)];
      // Place the one tab into an array
      tabs = [document.getElementById(`template-element-tab-${elementVal}`)];
    }
    console.log('in create_edit_document, handleTemplateElementChangeSizeClick, inputElements, elementVal, ', inputElements, elementVal);
    // console.log('in create_edit_document, handleTemplateElementChangeSizeClick, inputElements, tabs, ', inputElements, tabs);
    // gets the dimensions of the parent element (document background)
    const parentRect = element.parentElement.getBoundingClientRect()
    selectedElements = this.getSelectedActualElements('template-element-', this.state.selectedTemplateElementIdArray)
    // callback for the action to update element array, and to update history array and historyIndex
    const callback = (updatedElementsArray) => {
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setTemplateHistoryArray(updatedElementsArray, 'update');
    };
    // Call drag element
    this.dragElement(element, tabs, inputElements, parentRect, callback, false, elementType, selectedElements);
  }

  handleButtonTemplateElementClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value')
    const elementId = elementVal.split(',')[0];
    const choiceIndex = elementVal.split(',')[1];

    if (this.state.selectedChoiceIdArray.indexOf(`${elementId}-${choiceIndex}`) === -1) {
      this.setState({ selectedChoiceIdArray: [...this.state.selectedChoiceIdArray, `${elementId}-${choiceIndex}`] }, () => {
        console.log('in create_edit_document, handleButtonTemplateElementClick, this.state.selectedChoiceIdArray: ', this.state.selectedChoiceIdArray);
      });
    } else {
      const newArray = [...this.state.selectedChoiceIdArray];
      const index = newArray.indexOf(`${elementId}-${choiceIndex}`);
      newArray.splice(index, 1);
      this.setState({ selectedChoiceIdArray: newArray }, () => {
        console.log('in create_edit_document, handleButtonTemplateElementClick, this.state.selectedChoiceIdArray: ', this.state.selectedChoiceIdArray);
      });
    }
  }

  handleButtonTemplateElementMove(event) {
    const clickedElement = event.target;
    // const elementName = clickedElement.getAttribute('name')
    const elementVal = clickedElement.getAttribute('value')
    // console.log('in create_edit_document, handleButtonTemplateElementMove, elementVal, ', elementVal);
    const choiceId = elementVal.split(',')[0];
    const choiceIndex = parseInt(elementVal.split(',')[1], 10);
    const choiceButton = document.getElementById(`template-element-button-${choiceId},${choiceIndex}`);
    const wrapperDiv = choiceButton.parentElement.parentElement.parentElement;
    // const choiceButtonInState = this.props.templateElements[choiceId].document_field_choices[choiceIndex]
    const tab = document.getElementById(`template-element-tab-${choiceId}`)
    const choiceButtonDims = choiceButton.getBoundingClientRect();
    // To keep width and height of button elements from changing, keep track of width_px and height_px
    // in this.props.templateElements and pass to dragChoice
    const choiceButtonDimensions = choiceButton.getBoundingClientRect();
    const wrapperDivDimensions = wrapperDiv.getBoundingClientRect();
    const backgroundDimensions = wrapperDiv.parentElement.getBoundingClientRect();
    const documentFieldChoices = this.props.templateElements[choiceId].document_field_choices;
    const otherChoicesArray = [];
    let button = null;
    _.times(Object.keys(documentFieldChoices).length, (i) => {
      if (i !== parseInt(choiceIndex, 10)) {
        button = document.getElementById(`template-element-button-${choiceId},${i}`);
        otherChoicesArray.push(button);
      }
    });

    const callback = (updatedElementsArray) => {
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setTemplateHistoryArray(updatedElementsArray, 'update');
      // const newArray = [...this.state.selectedChoiceIdArray];
      // const index = newArray.indexOf(`${elementId}-${choiceIndex}`);
      // newArray.splice(index, 1);
      // this.setState({ selectedChoiceIdArray: newArray }, () => {
      //   console.log('in create_edit_document, handleButtonTemplateElementMove, mouseUpFunc, in setState, this.state.selectedChoiceIdArray, ', this.state.selectedChoiceIdArray);
      //   // window.removeEventListener('mouseup', mouseUpFunc);
      // });
    };

    console.log('in create_edit_document, handleButtonTemplateElementMove, choiceButton, choiceButtonDimensions, wrapperDiv, wrapperDivDimensions, otherChoicesArray: ', choiceButton, choiceButtonDimensions, wrapperDiv, wrapperDivDimensions, otherChoicesArray);
    this.dragChoice(choiceButton, choiceId, choiceIndex, otherChoicesArray, wrapperDiv, choiceButtonDimensions, wrapperDivDimensions, backgroundDimensions, tab, this.props.templateElements, callback);
  }

  // For creating new input fields
  renderTemplateElements(page) {
    const documentEmpty = _.isEmpty(this.props.documents);
    let fieldComponent = '';
    let noTabs = false;
    let newElement = false;
    let inputElement = true;
    let localTemplateElementsByPage = null;

    const renderTab = (eachElement, selected, tabLeftMarginPx) => {
    const tabWidth = inputElement ? TAB_WIDTH : 55;
    const modTabLeftMarginPx = inputElement ? tabLeftMarginPx : tabLeftMarginPx - 6;
      return (
        <div
          id={`template-element-tab-${eachElement.id}`}
          className="create-edit-document-template-element-edit-tab"
          style={{ height: `${TAB_HEIGHT}px`, width: `${tabWidth}px`, marginLeft: `${modTabLeftMarginPx}px` }}
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
          {inputElement
            ?
            <i
              type={eachElement.input_type}
              value={eachElement.id}
              className="fas fa-expand-arrows-alt" style={{ lineHeight: '1.5', color: 'gray' }}
              onMouseDown={this.handleTemplateElementChangeSizeClick}
            >
          </i> : null}
        </div>
      );
    };

    const getLocalTemplateElementsByPage = (eachElement, box, backgroundDim, marginBetween, isNew) => {
      const { document_field_choices } = eachElement;
      const object = { [eachElement.page]: { [eachElement.id]: { choices: {} } } };
      const choicesObject = object[eachElement.page][eachElement.id].choices;

      let currentTop = '0%';

      let widthInPx = null;
      let heightInPx = null;
      let topInPx = null;
      let leftInPx = null;
      let elementRemoved = null;
      // let i = 0;
      let top = 0;
      console.log('in create_edit_document, renderTemplateElements, getLocalTemplateElementsByPage, eachElement, box, backgroundDim, marginBetween, isNew: ', eachElement, box, backgroundDim, marginBetween, isNew);
        _.each(document_field_choices, (eachChoice, i) => {
          // elementRemoved = document.getElementById(`${eachElement.id},${i}`);
          // if (elementRemoved) elementRemoved.remove();
          // Convert NaN to zero
          top = (currentTop / box.height) || 0;
          // NOTE: get px of dimensions from box top, left etc.
          topInPx = ((parseFloat(eachChoice.top) / 100) * backgroundDim.height) - ((box.top) * backgroundDim.height);
          leftInPx = (((parseFloat(eachChoice.left) / 100) * backgroundDim.width) - ((box.left) * backgroundDim.width));
          // widthInPx = eachChoice.width_px;
          // heightInPx = eachChoice.height_px;
          widthInPx = (parseFloat(eachChoice.width) / 100) * backgroundDim.width;
          heightInPx = (parseFloat(eachChoice.height) / 100) * backgroundDim.height;
          // widthInPx = (parseFloat(eachChoice.width) / 100) * backgroundDim.width;
          // heightInPx = (parseFloat(eachChoice.height) / 100) * backgroundDim.height;
          console.log('in create_edit_document, renderTemplateElements, getLocalTemplateElementsByPage, eachElement, eachChoice, topInPx, leftInPx, widthInPx, heightInPx, isNew: ', eachElement, eachChoice, topInPx, leftInPx, widthInPx, heightInPx, isNew);
          console.log('in create_edit_document, renderTemplateElements, test for choicebutton width and height, getLocalTemplateElementsByPage, eachChoice, widthInPx, heightInPx, isNew: ', eachChoice, widthInPx, heightInPx, isNew);

          choicesObject[i] = {};
          choicesObject[i].val = eachChoice.val;

          choicesObject[i].top = isNew ? `${top * 100}%` : `${(topInPx / ((box.height) * backgroundDim.height)) * 100}%`;
          choicesObject[i].left = isNew ? '0.0%' : `${(leftInPx / ((box.width) * backgroundDim.width)) * 100}%`;
          choicesObject[i].width = isNew ? `${(parseFloat(eachChoice.width) / box.width) * 100}%` : `${(widthInPx / (box.width * backgroundDim.width)) * 100}%`;
          choicesObject[i].height = isNew ? `${(parseFloat(eachChoice.height) / box.height) * 100}%` : `${(heightInPx / (box.height * backgroundDim.height)) * 100}%`;
          console.log('in create_edit_document, renderTemplateElements, getLocalTemplateElementsByPage, heightInPx, eachChoice.height, choicesObject[i].height, box.height, isNew: ', heightInPx, eachChoice.height, choicesObject[i].height, box.height, isNew);
          console.log('in create_edit_document, renderTemplateElements, getLocalTemplateElementsByPage, topInPx, eachChoice.top, choicesObject[i].top, box.top: ', topInPx, eachChoice.top, choicesObject[i].top, box.top);
          // console.log('in create_edit_document, renderTemplateElements, test for choicebutton width and height, getLocalTemplateElementsByPage, : ', (parseFloat(choicesObject[i].width) / 100) * );
          // console.log('in create_edit_document, renderTemplateElements, getLocalTemplateElementsByPage, topInPx, eachChoice.top, choicesObject[i].top, box.top: ', topInPx, eachChoice.top, choicesObject[i].top, box.top);
          // choicesObject[i].top = `${(currentTop / box.height) * 100}%`;

          choicesObject[i].class_name = eachChoice.class_name;
          choicesObject[i].border_radius = eachChoice.border_radius;
          choicesObject[i].border = eachChoice.border;
          choicesObject[i].input_type = eachChoice.input_type;
          choicesObject[i].choice_index = parseInt(i, 10);
          choicesObject[i].element_id = eachElement.id;
          choicesObject[i].name = eachElement.name;

          currentTop = parseFloat(currentTop) + marginBetween + parseFloat(eachChoice.height);
        });

        console.log('in create_edit_document, renderTemplateElements, getLocalTemplateElementsByPage, object: ', object);
        return object;
    };
    // if (this.props.documentFields[page]) {
    // let count = 1;
    if (!documentEmpty) {
      // const { templateElements } = this.props;
      // Map through each element
      // return _.map(templateElements, eachElement => {
      return _.map(this.props.templateElementsByPage[page], eachElement => {
        // if there are document_field_choices, assign true else false
        inputElement = !eachElement.document_field_choices;
        newElement = eachElement.document_field_choices && eachElement.top && !eachElement.document_field_choices[0].top;
        const modifiedElement = eachElement;
        if (eachElement.component == 'DocumentChoices') {
          fieldComponent = DocumentChoicesTemplate;
        } else {
          fieldComponent = eachElement.component;
        }
        console.log('in create_edit_document, renderTemplateElements, eachElement, page, inputElement, newElement: ', eachElement, page, inputElement, newElement);

        // if (eachElement.page === page) {
          const editTemplate = true;
          // const width = parseInt(eachElement.width, 10)
          const nullRequiredField = false;
          const otherChoiceValues = [];
          // count++;
          // Wait until document-background class is rendered to enable some logic
          const background = document.getElementById('document-background');
          const selected = this.state.selectedTemplateElementIdArray.indexOf(eachElement.id) !== -1;
          // console.log('in create_edit_document, renderTemplateElements, eachElement, editTemplate, background: ', eachElement, editTemplate, background);
          // Wait for the background to be rendered to get its dimensions
          if (editTemplate && background) {
            // console.log('in create_edit_document, renderTemplateElements, in if editTemplate && background eachElement, selected, this.state.selectedTemplateElementIdArray: ', eachElement, selected, this.state.selectedTemplateElementIdArray);
            // let tabPercentOfContainerH = 0;
            // if (newElement || inputElement) {
            const tabPercentOfContainerH = (TAB_HEIGHT / background.getBoundingClientRect().height) * 100;
            // }
            const eachElementWidthPx = background.getBoundingClientRect().width * (parseFloat(modifiedElement.width) / 100)
            let tabLeftMarginPx = eachElementWidthPx - TAB_WIDTH - TAB_REAR_SPACE;
            if (eachElementWidthPx < TAB_WIDTH) {
              tabLeftMarginPx = 0;
            }
            let wrappingDivDocumentCreateH = parseFloat(modifiedElement.height) / (parseFloat(modifiedElement.height) + tabPercentOfContainerH);

            if (eachElement.document_field_choices) {
              const { document_field_choices } = eachElement;
              // if document_field_choices first element does not have a top,
              // it is a new element just created
              if (newElement) {
                let totalHeight = 0;
                let totalWidth = 0;
                const marginBetween = 0.25;
                _.each(Object.keys(document_field_choices), (eachKey, i) => {
                  const eachChoice = document_field_choices[eachKey];
                  if (eachChoice.class_name === 'document-circle') {
                    totalWidth = parseFloat(eachChoice.width);
                    totalHeight = parseFloat(eachChoice.height);
                    if (i === Object.keys(document_field_choices).length - 1) totalWidth += (i * marginBetween);
                  }

                  if (eachChoice.class_name === 'document-rectangle-template-button') {
                    totalWidth = parseFloat(eachChoice.width)
                    totalHeight += parseFloat(eachChoice.height)
                    if (i === Object.keys(document_field_choices).length - 1) totalHeight += (i * marginBetween);
                  }
                }) // end of each document_field_choices
                console.log('in create_edit_document, renderTemplateElements, newElement, eachElement, page, totalWidth, totalHeight: ', newElement, eachElement, page, totalWidth, totalHeight);
                modifiedElement.width = `${totalWidth}%`;
                modifiedElement.height = `${totalHeight}%`;
                localTemplateElementsByPage = getLocalTemplateElementsByPage(eachElement, { width: totalWidth, height: totalHeight }, background.getBoundingClientRect(), marginBetween, true);

              } else { // else for if newElement

                const backgroundDimensions = background.getBoundingClientRect();
                // Send wrapper div dimensions in fractions, .50 not 5%
                const adjustedHeightInPx = ((parseFloat(eachElement.height) / 100) * backgroundDimensions.height);
                const adjustedHeightInFracs = (adjustedHeightInPx / backgroundDimensions.height);

                localTemplateElementsByPage = getLocalTemplateElementsByPage(eachElement, { width: (parseFloat(eachElement.width) / 100), height: adjustedHeightInFracs, top: (parseFloat(eachElement.top) / 100), left: (parseFloat(eachElement.left) / 100) }, background.getBoundingClientRect(), null, false);
                console.log('in create_edit_document, renderTemplateElements, eachElement in if else document_field_choices, eachElement, document_field_choices, localTemplateElementsByPage: ', eachElement, document_field_choices, localTemplateElementsByPage);
                // console.log('in create_edit_document, renderTemplateElements, eachElement in if else document_field_choices, eachElement: ', eachElement, adjustedHeightInPx);
              } // end of if newElement
            } // end of if eachElement.document_field_choices
            // if ()
            if (inputElement) {
              return (
                <div
                  key={modifiedElement.id}
                  id={`template-element-${modifiedElement.id}`}
                  className="create-edit-document-template-element-container"
                  style={{ top: modifiedElement.top, left: modifiedElement.left, width: modifiedElement.width, height: `${parseFloat(modifiedElement.height) + tabPercentOfContainerH}%` }}
                >
                  <Field
                    key={modifiedElement.name}
                    name={modifiedElement.name}
                    // id={`template-element-input-${modifiedElement.choices[0].params.element_id}`}
                    // setting value here does not works unless its an <input or some native element
                    // value='Bobby'
                    component={fieldComponent}
                    // pass page to custom compoenent, if component is input then don't pass
                    // props={fieldComponent == DocumentChoices ? { page } : {}}
                    props={fieldComponent === DocumentChoicesTemplate ?
                      {
                        eachElement: modifiedElement,
                        page,
                        required: modifiedElement.required,
                        nullRequiredField,
                        formFields: newElement
                          ?
                          // {}
                          this.props.templateElementsByPage // doesn't have choices for input element
                          :
                          // create a templateElementsByPage with choices just for the input element
                          { [modifiedElement.page]: { [modifiedElement.id]:
                            { choices: { 0: { val: 'inputFieldValue',
                                              top: modifiedElement.top,
                                              left: modifiedElement.left,
                                              width: modifiedElement.width,
                                              height: modifiedElement.height,
                                              font_size: modifiedElement.font_size,
                                              font_family: modifiedElement.font_family,
                                              font_style: modifiedElement.font_style,
                                              font_weight: modifiedElement.font_weight,
                                              // change from input componnet use document-rectange
                                              // class_name: 'document-rectangle',
                                              class_name: modifiedElement.class_name,
                                              // !!! height works only with px
                                              input_type: modifiedElement.input_type,
                                              element_id: modifiedElement.id
                            } } } } },
                        charLimit: modifiedElement.charLimit,
                        otherChoiceValues,
                        documentKey: this.props.documentKey,
                        editTemplate,
                        wrappingDivDocumentCreateH,
                        modifiedElement,
                        elementName: modifiedElement.name,
                        elementId: modifiedElement.id
                      }
                      :
                      {}}
                    type={modifiedElement.input_type}
                    className={modifiedElement.component == 'input' ? 'document-rectangle-template' : 'document-rectangle-template'}
                    // onBlur={this.handleUserInput}
                    style={modifiedElement.component == 'input' && editTemplate
                      ?
                      // { width: modifiedElement.width, height: modifiedElement.height, borderColor: modifiedElement.borderColor, margin: '0px !important' }
                      // flex: flex-grow, flex-shrink , flex-basis; flex basis sets initial length of flexible item.
                      // user flex: 1 and take out height: auto; later get the actual size of the input when resize drag
                      {
                        width: '100%',
                        fontSize: modifiedElement.font_size,
                        fontFamily: modifiedElement.font_family,
                        fontStyle: modifiedElement.font_style,
                        fontWeight: modifiedElement.font_weight,
                        borderColor: modifiedElement.border_color,
                        margin: '0px !important',
                        flex: '1 1 auto'
                      }
                      :
                      {}
                    }
                  />
                  {renderTab(modifiedElement, selected, tabLeftMarginPx)}
                </div>
              );
            } else { // else if inputElement
              console.log('in create_edit_document, renderTemplateElements, else if inputElement, modifiedElement, page, this.props.templateElementsByPage, localTemplateElementsByPage: ', modifiedElement, page, this.props.templateElementsByPage, localTemplateElementsByPage);
              return (
                <div
                  key={modifiedElement.id}
                  id={`template-element-${modifiedElement.id}`}
                  className="create-edit-document-template-element-container"
                  style={{ border: '1px solid #ccc', top: modifiedElement.top, left: modifiedElement.left, width: modifiedElement.width, height: `${parseFloat(modifiedElement.height) + tabPercentOfContainerH}%` }}
                >
                  <div
                    key={modifiedElement.id}
                    className="create-edit-document-template-element-container-choice-innner"
                  >
                  <Field
                    key={modifiedElement.name}
                    name={modifiedElement.name}
                    // id={`template-element-buttons-box-${modifiedElement.choices[0].element_id}`}
                    // setting value here does not works unless its an <input or some native element
                    // value='Bobby'
                    component={fieldComponent}
                    // pass page to custom compoenent, if component is input then don't pass
                    // props={fieldComponent == DocumentChoices ? { page } : {}}
                    props={fieldComponent === DocumentChoicesTemplate ?
                      {
                        eachElement: modifiedElement,
                        page,
                        required: modifiedElement.required,
                        nullRequiredField,
                        formFields: localTemplateElementsByPage,
                        charLimit: modifiedElement.charLimit,
                        otherChoiceValues,
                        documentKey: this.props.documentKey,
                        editTemplate,
                        wrappingDivDocumentCreateH,
                        modifiedElement,
                        elementName: modifiedElement.name,
                        elementId: modifiedElement.id,
                        handleButtonTemplateElementMove: () => this.handleButtonTemplateElementMove,
                        handleButtonTemplateElementClick: () => this.handleButtonTemplateElementClick,
                        editFieldsOn: this.state.editFieldsOn,
                        selectedChoiceIdArray: this.state.selectedChoiceIdArray
                        // dragChoice: () => this.dragChoice()
                      }
                      :
                      {}}
                    type={modifiedElement.input_type}
                    className={modifiedElement.component == 'input' ? 'document-rectangle-template' : 'document-rectangle-template'}
                    // onBlur={this.handleUserInput}
                    style={modifiedElement.component == 'input' && editTemplate
                      ?
                      // { width: modifiedElement.width, height: modifiedElement.height, borderColor: modifiedElement.borderColor, margin: '0px !important' }
                      // flex: flex-grow, flex-shrink , flex-basis; flex basis sets initial length of flexible item.
                      // user flex: 1 and take out height: auto; later get the actual size of the input when resize drag
                      {
                        width: '100%',
                        fontSize: modifiedElement.font_size,
                        fontFamily: modifiedElement.font_family,
                        fontStyle: modifiedElement.font_style,
                        fontWeight: modifiedElement.font_weight,
                        borderColor: modifiedElement.border_color,
                        margin: '0px !important',
                        flex: '1 1 auto'
                      }
                      :
                      {}
                    }
                  />
                  </div>
                  {renderTab(modifiedElement, selected, tabLeftMarginPx)}
                </div>
              );
            }// end of if inputElement

            if (noTabs) { // noTabs a placeholder for now
              return (
                <Field
                  key={modifiedElement.name}
                  name={modifiedElement.name}
                  // setting value here does not works unless its an <input or some native element
                  // value='Bobby'
                  component={fieldComponent}
                  // pass page to custom compoenent, if component is input then don't pass
                  props={fieldComponent == DocumentChoices ? { page } : {}}
                  // props={fieldComponent == DocumentChoices ? { page } : {}}
                  type={modifiedElement.input_type}
                  className={modifiedElement.component == 'input' ? 'document-rectangle' : ''}
                  // className={modifiedElement.component == 'input' ? 'form-control' : ''}
                  // className={modifiedElement.className}
                  style={modifiedElement.component == 'input' ? { position: 'absolute', top: `${eachElement.top * 100}%`, left: `${eachElement.left * 100}%`, width: eachElement.width, height: eachElement.height, borderColor: eachElement.borderColor, margin: '0px !important' } : {}}
                  // style={newElement.component == 'input' ? { position: 'absolute', top: newElement.top, left: newElement.left, width: newElement.width, height: newElement.height, borderColor: newElement.borderColor } : {}}
                />
              );
            } // end of if no tabs
          } // end of if editTemplate && background
        // } // eachElement page === page
      });
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

  getNewElementObject(element) {
    const object = {};
    _.each(Object.keys(element), eachKey => {
      object[eachKey] = element[eachKey];
    });
    return object;
  }

  // For leeping track of modifications in elements both persisted
  // and new template elements. Final object ooks like
  // { 1a: { deleted: false, updated: 1 }, 25: { deleted: true, updated: 3} }.
  // This will drive save button enabling and how element creation and updates will be done. So no need to iterate through all elements everytime save is run; AND centralizes persisted code for identifying elements to be created and updated, AS WELL AS updating persisted elements in action creator populate persisted template elements
  getModifiedObject(redoOrUndo) {
    const returnObject = { ...this.state.modifiedPersistedElementsObject };

    const setEditObject = (editObject) => {
      console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, redoOrUndo, returnObject, editObject, this.historyIndex, index: ', redoOrUndo, returnObject, editObject, this.state.historyIndex, index);
      if (returnObject[editObject.id]) {
        // Think 1. CRUD (Create, [Read], Update, Delete),
        // 2. temporary and persisted elements,
        // 3. Undo and Redo
        if (editObject.action === 'create') {
          console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, in create redoOrUndo, returnObject, editObject, this.historyIndex, index: ', redoOrUndo, returnObject, editObject, this.state.historyIndex, index);
          // Create undo can only happen to temporary elements with ids with 'a' ie '1a'
          if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) delete returnObject[editObject.id];
          if (redoOrUndo === 'redo' && editObject.id.indexOf('a') !== -1) returnObject[editObject.id] = { deleted: false, updated: 0 };
        }

        if (editObject.action === 'update') {
          console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, in update redoOrUndo, returnObject, editObject, this.historyIndex, index: ', redoOrUndo, returnObject, editObject, this.state.historyIndex, index);
          // In case of update and object exists, increment up update
          if (redoOrUndo !== 'undo' && redoOrUndo !== 'redo') returnObject[editObject.id].updated++;
          // returnObject[editObject.id].updated++;
          // In case of undo update and object exists, increment up update, decrement if undo
          // if (redoOrUndo === 'undo') returnObject[editObject.id].updated = returnObject[editObject.id].updated - 1;
          if (redoOrUndo === 'undo') {
            // NOTE: temporary template element may come to have negagtive update
            // since their can modifiedPersistedElementsObject
            // can be deleted even when their update number is non-zero;
            // The only thing that matters is their deleted attribute
            returnObject[editObject.id].updated--;
            if (returnObject[editObject.id].deleted === false && editObject.id.indexOf('a') === -1 && returnObject[editObject.id].updated === 0) delete returnObject[editObject.id];
          }
          if (redoOrUndo === 'redo') returnObject[editObject.id].updated++;
        }
        // In case of delete and object exists in modifiedPersistedElementsObject
        if (editObject.action === 'delete') {
          // If persisted element id, update delete to true
          if (redoOrUndo !== 'undo' && redoOrUndo !== 'redo') {
            if (editObject.id.indexOf('a') === -1) returnObject[editObject.id].deleted = true;
            // Case of temporary id ie '1a', take out the key '1a'
            if (editObject.id.indexOf('a') !== -1) delete returnObject[editObject.id];
          }
          // Don't worry about updated count for temporary elements since only matter if they exist
          if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) returnObject[editObject.id] = { deleted: false, updated: 0 };
          if (redoOrUndo === 'redo' && editObject.id.indexOf('a') !== -1) delete returnObject[editObject.id];
          if (redoOrUndo === 'undo' && editObject.id.indexOf('a') === -1) {
            returnObject[editObject.id].deleted = false
            if (returnObject[editObject.id].updated === 0) delete returnObject[editObject.id]
          }
          if (redoOrUndo === 'redo' && editObject.id.indexOf('a') === -1) returnObject[editObject.id].deleted = true;
        }
      } else { // if object with element id does not exist in object
        // If object for element does not exist in modifiedPersistedElementsObject
        if (editObject.action === 'create') {
          console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, in else create redoOrUndo, returnObject, editObject, this.historyIndex, index: ', redoOrUndo, returnObject, editObject, this.state.historyIndex, index);
          if (redoOrUndo !== 'undo' && redoOrUndo !== 'redo') returnObject[editObject.id] = { deleted: false, updated: 0 };
          if (redoOrUndo === 'redo' && editObject.id.indexOf('a') !== -1) returnObject[editObject.id] = { deleted: false, updated: 0 };
          // undo create for temporary elements not needed since object will have been created
          // if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) delete returnObject[editObject.id];
          // if (redoOrUndo === 'undo' && editObject.id.indexOf('a') === -1) returnObject[editObject.id] = { deleted: false, updated: 0 };
        }

        // If object does not exist for element, create object with updated 1;
        // Don't need redo or undo since object will have been created in modifiedPersistedElementsObject
        if (editObject.action === 'update') {
          returnObject[editObject.id] = { deleted: false, updated: 1 };
        }

        if (editObject.action === 'delete') {
          // In case of delete, can only happen to backend-persisted elements
          if (editObject.id.indexOf('a') === -1) returnObject[editObject.id] = { deleted: true, updated: 0 };
          // Can only undo delete if object does not exist for temporary elements
          // If redo delete, there would be an object existing
          if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) returnObject[editObject.id] = { deleted: false, updated: 0 };
        }
      }
    }
    // templateEditHistoryArray is an array of array of objects;
    // [[{ id: '1', width: 10, action: update }, { id: '1a', font_family: 'arial'... action: 'create'}], [...]]
    // Each array within the outermost array is i. No need to adjust for redo
    let index = this.state.historyIndex;
    if (redoOrUndo === 'undo') index = this.state.historyIndex + 1;
    // if (redoOrUndo === 'redo') index = this.state.historyIndex - 1;

    if (_.isEmpty(this.state.modifiedPersistedElementsObject)) {
      _.each(this.state.templateEditHistoryArray, (eachEditArray, i) => {
        if (i <= index) {
        // if (i <= this.state.historyIndex) {
          _.each(eachEditArray, eachEditObject => {
            setEditObject(eachEditObject);
          });
        }
      });
    } else {
      // if modifiedPersistedElementsObject has at least one object in it,
      // adjust index to get the history array that is redone or undone
      _.each(this.state.templateEditHistoryArray[index], eachEditObject => {
        setEditObject(eachEditObject);
      });
    }

    return returnObject;
  }

  setLocalStorageHistory(fromWhere) {
    // Set storage object for given point in time for agreement for when user accidentally has to refresh
    // Called after element creation, deletion, update, redo, undo (after index increment, decrement)
    let destringifiedHistory = {};
    const localStorageHistory = localStorage.getItem('documentHistory');
    console.log('in create_edit_document, setLocalStorageHistory, this.state.historyIndex, this.state.templateEditHistoryArray, fromWhere: ', this.state.historyIndex, this.state.templateEditHistoryArray, fromWhere);
    // Get latest localHistory object
    if (localStorageHistory) {
      // if historystring, unstringify it and add agreementId = historyArray
      destringifiedHistory = JSON.parse(localStorageHistory);
    }

    // Get an object like lookes like: { 1a: { deleted: false, updated: 1 }, 2: { deleted: true; updated: 0 }}
    // To be used
    const modifiedObject = this.getModifiedObject(fromWhere);

    // Save new elements not persisted in backend DB
    // Go thorough each modifiedObject to become modifiedPersistedElementsObject
    // lookes like: { 1a: { deleted: false, updated: 1 }, 2: { deleted: true; updated: 0 }}
    // Get ids of elements in modified object and get element from this.props.templateElements
    const unsavedTemplateElements = {};
    // Run only if not called from handleTemplateSubmitCallback()
    if (fromWhere !== 'handleTemplateSubmitCallback') {
      _.each(Object.keys(modifiedObject), eachElementKey => {
        // console.log('in create_edit_doc ument, setLocalStorageHistory, eachElementKey: ', eachElementKey);
        if (eachElementKey.indexOf('a') !== -1) {
          unsavedTemplateElements[eachElementKey] = this.props.templateElements[eachElementKey];
        }
      });
    }

    this.setState({
      modifiedPersistedElementsObject: modifiedObject
    }, () => {
      destringifiedHistory[this.props.agreement.id] = {
        history: this.state.templateEditHistoryArray,
        // unsavedTemplateElements is not saved in state
        elements: unsavedTemplateElements,
        historyIndex: this.state.historyIndex,
        newFontObject: this.state.newFontObject,
        // modifiedPersistedElementsArray: this.state.modifiedPersistedElementsArray,
        // modifiedPersistedElementsObject: this.state.modifiedPersistedElementsObject
        modifiedPersistedElementsObject: this.state.modifiedPersistedElementsObject
      }
      // Looks like { 3: { elements: { top: y, left: x, ... }, history: [[history array], ...], historyIndex: x, newFontObject: { fontFamily: 'arial' ...}}}
      console.log('in create_edit_document, setLocalStorageHistory, destringifiedHistory, destringifiedHistory.modifiedPersistedElementsObject: ', destringifiedHistory, destringifiedHistory[this.props.agreement.id].modifiedPersistedElementsObject);
      localStorage.setItem('documentHistory', JSON.stringify(destringifiedHistory));
    })
  }

  setTemplateHistoryArray(elementArray, action) {
    // !!! NOTE: ONLY set historyId and templateEditHistoryArray HERE to avoid unruly code !!!!!
    console.log('in create_edit_document, setTemplateHistoryArray, action, elementArray: ', action, elementArray);
    // Function to create a new array so don't have to mutate state
    const getNewExistingHistoryArray = () => {
      const newArray = [];
      _.each(this.state.templateEditHistoryArray, eachHistoryArray => {
        const arr = [];
        _.each(eachHistoryArray, eachElement => {
          const obj = {};
          _.each(Object.keys(eachElement), eachKey => {
            obj[eachKey] = eachElement[eachKey];
          });
          arr.push(obj);
        });
        newArray.push(arr);
      });
      return newArray;
    };
    // For the newest rung of edits to be put into templateEditHistoryArray
    const array = [];
    // get new history array since cannot modify state elements; Looks like spread operator is good enough
    // const newArray = getNewExistingHistoryArray();
    const newArray = [...this.state.templateEditHistoryArray];
    // iterate through each selected element ids
    // if there is no element in parameters, ie the action was based on selected elements
    if (!elementArray) {
      console.log('in create_edit_document, setTemplateHistoryArray, if !elementArray: ', action, elementArray);
      _.each(this.state.selectedTemplateElementIdArray, eachSelectedId => {
        // if id is in mapped template elements object { id: {element} }
        if (this.props.templateElements[eachSelectedId]) {
          // Get a new object to modify so all other objects in templateEditHistoryArray
          // do not get modified
          const modifiedElement = this.getNewElementObject(this.props.templateElements[eachSelectedId]);
          modifiedElement.action = action;
          array.push(modifiedElement);
        }
      });
    } else { // else there is an element e.g. new element
      console.log('in create_edit_document, setTemplateHistoryArray, if else !elementArray: ', action, elementArray);
      _.each(elementArray, eachElement => {
        const modifiedElement = this.getNewElementObject(eachElement);
        modifiedElement.action = action;
        array.push(modifiedElement);
      }); // end of each
    } // end of if else !elementArray
    // elements are deleted in logic in action and reducers, when sent an array of elements
    // elements are marked deleted in edit history in component state
    // splice(start) remove all elements after index start; start is INCLUSIVE
    newArray.splice(this.state.historyIndex + 1);
    // if the new array equals MAX_HISTORY_ARRAY_LENGTH, drop the first element in the array
    // to make room for new array; Not used effectively since max is set so high
    let droppedHistory = null;
    if (newArray.length >= MAX_HISTORY_ARRAY_LENGTH) droppedHistory = newArray.shift();

    // if action was to delete, empty out selectedTemplateElementIdArray and allElementsChecked false
    // templateEditHistoryArray gets a new shifted, splced array with a new rung of edits in an array
    this.setState({
      // empty out selected elements array
      selectedTemplateElementIdArray: action === 'delete' ? [] : this.state.selectedTemplateElementIdArray,
      // if action IS delete, all elements are not checked anymore
      allElementsChecked: action === 'delete' ? false : this.state.selectedTemplateElementIdArray.length === Object.keys(this.props.templateElements).length,
      templateEditHistoryArray: [...newArray, array], // add new array of history
    }, () => {
      // console.log('in create_edit_document, setTemplateHistoryArray, this.state.templateEditHistoryArray: ', this.state.templateEditHistoryArray);
      this.setState({
        // !!!!! Index is set at End of array when user creates, deletes or updates (not in redo or undo)
        historyIndex: this.state.templateEditHistoryArray.length - 1,
      }, () => {
        console.log('in create_edit_document, setTemplateHistoryArray, this.state.undoingAndRedoing, droppedHistory, this.state.historyIndex, this.state.templateEditHistoryArray: ', droppedHistory, this.state.historyIndex, this.state.templateEditHistoryArray);
        // Persist the history objects in localStorage
        this.setLocalStorageHistory('setTemplateHistoryArray');
      });
    });// end of setState
  }

  handleTrashClick() {
   if (this.state.selectedTemplateElementIdArray.length > 0) {
     // call setTemplateHistoryArray delete in callback to setState so modifiedPersistedElementsArray is in state
     // to be stringified in localStorage
     this.props.deleteDocumentElementLocally(this.state.selectedTemplateElementIdArray, () => this.setTemplateHistoryArray(null, 'delete'));
   } // end of if selectedTemplateElementIdArray.length > 0
  }

  clearAllTimers(callback) {
    _.each(explanationTimerArray, eachTimerObj => {
      clearInterval(eachTimerObj.timerId);
    });
    // set global variable explanationTimerArray
    explanationTimerArray = [];
    callback();
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
    // Main function for handling template element action box button clicks
    // e.g. align, redo, trash buttons, etc
    this.clearAllTimers(() => {});
    const clickedElement = event.target;
    // element val is value of i or div in action box eg horizontal or vertical strings
    let elementVal = clickedElement.getAttribute('value');
    // elementValue is for FONTS!!!!!
    let elementValue = '';
    // elementName is for select inputs in font control box
    const elementName = clickedElement.getAttribute('name');
    // Select inputs and font control box buttons (bold and italic) are sent via 'name'
    const fontControlSelectArray = ['fontFamily', 'fontSize', 'fontStyle', 'fontWeight'];
    // if element name is included in fontControlArray, then reassign elementVal to elementName for the switch
    // NOTE: The select field does not have a value attribute but can access clickedElement.value when option is selected
    // So, the select passes what is 'elementVal' by name attribute;
    //  The bold and italic buttons have value and name so assign as follows
    // elementValue will be null for the select fields; elementName is assigned to elementVal for swith
    if (fontControlSelectArray.indexOf(elementName) !== -1) {
      elementValue = elementVal;
      elementVal = elementName;
    };
    // console.log('in create_edit_document, handleTemplateElementActionClick, after re-assign elementVal, elementValue, elementName, clickedElement, clickedElement.value: ', elementVal, elementValue, elementName, clickedElement, clickedElement.value);
    // function to be used for aligning horizontal and vertical values
    // make fat arrow function to set context to be able to use this.props and state
    const align = (alignWhat) => {
      const aligningElement = this.state.selectedTemplateElementIdArray.length > 0;
      const aligningChoice = this.state.selectedChoiceIdArray.length > 0;
      console.log('in create_edit_document, handleTemplateElementActionClick, move() elementVal, aligningElement, aligningChoice, this.state.selectedChoiceIdArray: ', elementVal, aligningElement, aligningChoice, this.state.selectedChoiceIdArray);
      if (aligningElement || aligningChoice) {
        // get the first element to be clicked to make as a basis for move
        // first clicked element (one user clicked first, so first in array) is baseElement
        let baseElement = null;
        let baseChoice = null;
        let baseElementId = null;
        let baseChoiceIndex = null;
        let choiceButtonDimensions = null;
        let choiceButton = null;
        if (this.state.selectedTemplateElementIdArray.length > 0) {
          baseElement = this.props.templateElements[this.state.selectedTemplateElementIdArray[0]];
        } else {
          baseElementId = this.state.selectedChoiceIdArray[0].split('-')[0];
          baseChoiceIndex = parseInt(this.state.selectedChoiceIdArray[0].split('-')[1], 10);
          baseElement = this.props.templateElements[baseElementId];
          baseChoice = this.props.templateElements[baseElementId].document_field_choices[baseChoiceIndex];
          choiceButton = document.getElementById(`template-element-button-${baseElementId},${baseChoiceIndex}`);
          choiceButtonDimensions = choiceButton.getBoundingClientRect();
        }
        // const baseElement = this.getElement(this.props.templateElements, firstClickedId);
        if (baseElement && aligningElement) {
          const array = [];
          const originalValueObject = {};
          _.each(this.state.selectedTemplateElementIdArray, eachElementId => {
            const eachElement = this.props.templateElements[eachElementId];
            if (eachElement && eachElement.id !== baseElement.id) {
              originalValueObject[eachElement.id] = {
                top: eachElement.top,
                left: eachElement.left,
                width: eachElement.width,
                height: eachElement.height
              };
              if (alignWhat === 'vertical') array.push({ id: eachElement.id, left: baseElement.left, o_left: originalValueObject[eachElement.id].left, action: 'update' });
              if (alignWhat === 'horizontal') array.push({ id: eachElement.id, top: baseElement.top, o_top: originalValueObject[eachElement.id].top, action: 'update' });
              if (alignWhat === 'alignWidth') array.push({ id: eachElement.id, width: baseElement.width, oWidth: originalValueObject[eachElement.id].width, action: 'update' });
              if (alignWhat === 'alignHeight') array.push({ id: eachElement.id, height: baseElement.height, oHeight: originalValueObject[eachElement.id].height, action: 'update' });
            } // end of if
          }); // end of each
          console.log('in create_edit_document, handleTemplateElementActionClick, move() elementVal, array: ', elementVal, array);
          // call action to update each template element object in reducer
          this.props.updateDocumentElementLocally(array);
          this.setTemplateHistoryArray(array, 'update');
        } // end of if baseElement

        if (baseChoice) {
          // const array = [];
          // choiceButton is the first choice to be selected
          let alignControlArray = [];
          const choiceButton = document.getElementById(`template-element-button-${baseElementId},${baseChoiceIndex}`);
          const wrapperDiv = choiceButton.parentElement.parentElement.parentElement;
          const wrapperDivDimensions = wrapperDiv.getBoundingClientRect();
          const lastWrapperDivDimsPre = wrapperDiv.getBoundingClientRect();
          const backgroundDimensions = wrapperDiv.parentElement.getBoundingClientRect();
          let eachChoiceIndex = null;
          let eachElementId = null;
          let otherChoice = null;
          let changeChoice = null;
          let eachElementInState = null;
          let eachBaseChoiceInState = null;
          let eachChoiceDimensions = null;
          let eachBaseChoice = null;
          let eachBaseChoiceDimensions = null;
          let otherChoicesObject = null;
          let eachWrapperDiv = null;
          const elementsArray = [];
          let documentFieldChoices = [];
          let otherChoicesArray = [];
          let changeChoicesArray = [];
          let choiceButtonWidthInPx = null;
          let choiceButtonHeightInPx = null;
          let newTopAbsPx = null;
          let newLeftAbsPx = null;
          const arrayForAction = [];
          // let eachWrapperHeightPx = null;
          let eachWrapperDivDimensions = null;
          // let changeInWidthPx = 0;
          // let changeInHeightPx = 0;
          // let changeInTopPx = 0;
          // let changeInLeftPx = 0;
          // let baseChoiceTopPx = null;
          // let baseChoiceLeftPx = null;
          // let baseChoiceWidthPx = null;
          // let baseChoiceHeightPx = null;
          let attribute = null;

          const alignObject = { vertical: { choiceAttr: 'top', backAttr: 'height', baseAttrPx: null, changeAttrPx: null },
                                horizontal: { choiceAttr: 'left', backAttr: 'width', baseAttrPx: null, changeAttrPx: null },
                                width: { choiceAttr: 'width', backAttr: 'width', baseAttrPx: null, changeAttrPx: null },
                                height: { choiceAttr: 'height', backAttr: 'height', baseAttrPx: null, changeAttrPx: null },
                              }
          _.each(this.state.selectedChoiceIdArray, eachChoiceId => {
            // if (eachChoiceId !== this.state.selectedChoiceIdArray[0]) {
              eachElementId = eachChoiceId.split('-')[0];
              // If element has not been aligned
              if (alignControlArray.indexOf(eachElementId) === -1) {
                // push eachElementId avoid doing the same element multiple times
                alignControlArray.push(eachElementId);
                eachChoiceIndex = parseInt(eachChoiceId.split('-')[1], 10);
                eachElementInState = this.props.templateElements[eachElementId];
                console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice eachElementId, this.props.templateElements: ', eachElementId, this.props.templateElements);
                eachBaseChoiceInState = this.props.templateElements[eachElementId].document_field_choices[eachChoiceIndex];
                eachBaseChoice = document.getElementById(`template-element-button-${eachElementId},${eachChoiceIndex}`);
                eachBaseChoiceDimensions = eachBaseChoice.getBoundingClientRect();
                eachWrapperDiv = eachBaseChoice.parentElement.parentElement.parentElement;
                eachWrapperDivDimensions = eachWrapperDiv.getBoundingClientRect();

                _.each(Object.keys(eachElementInState.document_field_choices), eachIdx => {
                  console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice attribute set elementVal, eachIdx, eachChoiceIndex, baseChoiceIndex: ', elementVal, eachIdx, eachChoiceIndex, baseChoiceIndex);
                  // If choice not selected or not base (first selected), push into array to get obejct
                  if (this.state.selectedChoiceIdArray.indexOf(`${baseElementId}-${eachIdx}`) === -1 || `${baseElementId}-${eachIdx}` === `${baseElementId}-${baseChoiceIndex}`) {
                    // if (this.state.selectedChoiceIdArray.indexOf(`${baseElementId}-${eachIdx}`) === -1 && parseInt(eachIdx, 10) !== baseChoiceIndex) {
                    otherChoice = document.getElementById(`template-element-button-${eachElementId},${eachIdx}`);
                    otherChoicesArray.push(otherChoice);
                  } else if (`${baseElementId}-${eachIdx}` !== `${baseElementId}-${baseChoiceIndex}`) {
                    // else if the only highlighted choice in element is the first base choice,
                    // push choice into array for change
                    changeChoice = document.getElementById(`template-element-button-${eachElementId},${eachIdx}`);
                    changeChoicesArray.push(changeChoice)
                  }
                }); // end of _.each(Object.keys(eachElementInState.document_field_choices
                  // get the px values of each other object
                  choiceButtonWidthInPx = ((parseFloat(eachBaseChoiceInState.width) / 100) * backgroundDimensions.width);
                  choiceButtonHeightInPx = ((parseFloat(eachBaseChoiceInState.height) / 100) * backgroundDimensions.height);

                  // _.each(Object)
                  // if (alignWhat === 'vertical') {
                // Iterate through choices that are to be chnaged per element set
                _.each(changeChoicesArray, each => {
                  console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice test of each choice changeChoicesArray, each.style: ', changeChoicesArray, each.style);
                  const idx = parseInt(each.getAttribute('value').split(',')[1], 10);
                  const eachInState = eachElementInState.document_field_choices[idx]
                  console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice attribute set elementVal, eachElementInState, idx, achInState, each: ', elementVal, eachElementInState, idx, eachInState, each);
                  // attribute is vertical, horizontal, width, height
                  // baseAttrPx is top in px, left in px, width in px...
                  // choiceAttr is top, left, width, height
                  // backAttr is height, width of backgroundDimensions
                  attribute = alignObject[alignWhat];
                  // if baseChoice already has a top value, get top from state,
                  // otherwise use getBoundingClientRect
                  // if (baseChoice.top) {
                  //   attribute.baseAttrPx = (parseFloat(baseChoice[attribute.choiceAttr]) / 100) * backgroundDimensions[attribute.backAttr];
                  //   console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice attribute set elementVal, baseChoice, attribute.baseAttrPx: ', elementVal, baseChoice, attribute.baseAttrPx);
                  // } else {
                  //   attribute.baseAttrPx = choiceButtonDimensions[attribute.choiceAttr] * backgroundDimensions[attribute.backAttr];
                  // }
                  // // changeAttrPx is variable for the required change in top, left, width and height in px
                  // if (eachInState[attribute.choiceAttr]) {
                  //   attribute.changeAttrPx = attribute.baseAttrPx - ((parseFloat(eachInState[attribute.choiceAttr]) / 100) * backgroundDimensions[attribute.backAttr]);
                  //   console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice attribute set elementVal, attribute.changeAttrPx: ', elementVal, attribute.changeAttrPx);
                  // } else {
                  //   if (attribute.choiceAttr === 'width' || attribute.choiceAttr === 'height') {
                  //     attribute.changeAttrPx = attribute.baseAttrPx - ((eachInState[attribute.choiceAttr] / 100) * backgroundDimensions[attribute.backAttr]);
                  //   } else {
                  //     const eachDims = each.getBoundingClientRect();
                  //     attribute.changeAttrPx = attribute.baseAttrPx - eachDims[attribute.choiceAttr];
                  //   }
                  // }
                  // Move choices, test for top or height to adjust to tab height
                  if (attribute.choiceAttr === 'top' || attribute.backAttr === 'height') {
                    newTopAbsPx = (((parseFloat(choiceButton.style[attribute.choiceAttr]) / 100) * (wrapperDivDimensions[attribute.backAttr] - TAB_HEIGHT)) + wrapperDivDimensions[attribute.choiceAttr]);
                    // eachWrapperHeightPx = eachWrapperDiv
                    each.style[attribute.choiceAttr] = `${((newTopAbsPx - eachWrapperDivDimensions[attribute.choiceAttr]) / (eachWrapperDivDimensions[attribute.backAttr] - TAB_HEIGHT)) * 100}%`;
                    console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice attribute set choiceButton, each, attribute.choiceAttr, attribute.backAttr, each.style[attribute.choiceAttr], choiceButton.style[attribute.choiceAttr], newTopAbsPx, choiceButton.getBoundingClientRect().top, wrapperDivDimensions, eachWrapperDivDimensions: ', choiceButton, each, attribute.choiceAttr, attribute.backAttr, each.style[attribute.choiceAttr], choiceButton.style[attribute.choiceAttr], newTopAbsPx, choiceButton.getBoundingClientRect().top, wrapperDivDimensions, eachWrapperDivDimensions);
                    // each.style[attribute.choiceAttr] = `${((((parseInt(each.style[attribute.choiceAttr], 10) / 100) * (wrapperDivDimensions[attribute.backAttr] - TAB_HEIGHT)) + attribute.changeAttrPx) / (wrapperDivDimensions[attribute.backAttr] - TAB_HEIGHT)) * 100}%`;
                  } else {
                    newLeftAbsPx = (((parseFloat(choiceButton.style[attribute.choiceAttr]) / 100) * wrapperDivDimensions[attribute.backAttr]) + wrapperDivDimensions[attribute.choiceAttr]);
                    each.style[attribute.choiceAttr] = `${((newLeftAbsPx - eachWrapperDivDimensions[attribute.choiceAttr]) / eachWrapperDivDimensions[attribute.backAttr]) * 100}%`;
                    // each.style[attribute.choiceAttr] = `${((((parseInt(each.style[attribute.choiceAttr], 10) / 100) * wrapperDivDimensions[attribute.backAttr]) + attribute.changeAttrPx) / wrapperDivDimensions[attribute.backAttr]) * 100}%`;
                  }
                  console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice attribute set elementVal, eachChoiceIndex, each, attribute.choiceAttr, attribute.backAttr, attribute.changeAttrPx, each.style[attribute.choiceAttr], wrapperDivDimensions[attribute.backAttr]: ', elementVal, eachChoiceIndex, each, attribute.choiceAttr, attribute.backAttr, attribute.changeAttrPx, each.style[attribute.choiceAttr], wrapperDivDimensions[attribute.backAttr]);
                }); //  end of _.each(changeChoicesArray, each
                console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice attribute set elementVal, eachChoiceIndex, baseChoice, eachBaseChoiceInState, attribute.baseAttrPx, attribute.changeAttrPx, otherChoicesObject, changeChoicesArray: ', elementVal, eachChoiceIndex, baseChoice, eachBaseChoiceInState, attribute.baseAttrPx, attribute.changeAttrPx, otherChoicesObject, changeChoicesArray);
                // }

                // }
                // chnnge document field choices based on base choice
                otherChoicesObject = getOtherChoicesObject({ wrapperDiv: eachWrapperDiv, otherChoicesArray: otherChoicesArray.concat(changeChoicesArray), templateElements: this.props.templateElements, backgroundDimensions, wrapperDivDimensions: eachWrapperDiv.getBoundingClientRect(), notDrag: true });
                // otherChoicesObject = getOtherChoicesObject({ wrapperDiv, otherChoicesArray: otherChoicesArray.concat(changeChoicesArray), templateElements: this.props.templateElements, backgroundDimensions, wrapperDivDimensions: wrapperDiv.getBoundingClientRect(), notDrag: true });
                const documentFieldObject = getNewDocumentFieldChoices({ choiceIndex: null, templateElements: this.props.templateElements, iteratedElements: otherChoicesArray.concat(changeChoicesArray), otherChoicesObject, backgroundDimensions, choiceButtonWidthInPx, choiceButtonHeightInPx });
                console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice attribute set documentFieldObject: ', documentFieldObject);
                console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice test of each choice documentFieldObject: ', documentFieldObject);
                const array = documentFieldObject.array;
                // // New and old records of choices to be set in app stata in templateElements
                // // get new and old document field choices
                const newDocumentFieldChoices = documentFieldObject.newDocumentFieldChoices;
                const oldDocumentFieldChoices = documentFieldObject.oldDocumentFieldChoices;
                // // get wrapper dimensions
                const lastWrapperDivDims = setBoundaries({ elementsArray: array, newWrapperDims: lastWrapperDivDimsPre, adjustmentPx: 0 });
                const updatedElementObject = getUpdatedElementObject({ elementId: eachElementId, lastWrapperDivDims, backgroundDimensions, wrapperDivDimensions: eachWrapperDivDimensions, newDocumentFieldChoices, oldDocumentFieldChoices, tabHeight: TAB_HEIGHT })
                arrayForAction.push(updatedElementObject)

                otherChoicesObject = {};
                otherChoicesArray = [];
                changeChoicesArray = [];
                attribute.changeAttrPx = 0;
                attribute.baseAttrPx = 0;
              } // end of if (alignControlArray.indexOf(eachElementId
          }); // end of each selectedChoiceIdArray
          // call action
          // Object to be sent to documents reducer UPDATE_DOCUMENT_ELEMENT_LOCALLY
          // this.props.updateDocumentElementLocally(arrayForAction);
          // set history
          // this.setTemplateHistoryArray(arrayForAction, 'update');
          //iamhere
          // if (alignWhat === 'vertical') array.push({ id: eachElement.id, left: baseElement.left, o_left: eachElement.left, action: 'update' });
          // if (alignWhat === 'horizontal') array.push({ id: eachElement.id, top: baseElement.top, o_top: eachElement.top, action: 'update' });
          // if (alignWhat === 'alignWidth') array.push({ id: eachElement.id, width: baseElement.width, oWidth: eachElement.width, action: 'update' });
          // if (alignWhat === 'alignHeight') array.push({ id: eachElement.id, height: baseElement.height, oHeight: eachElement.height, action: 'update' });
        } // end of if baseChoice
      } // end of if state selectedTemplateElementIdArray > 0
    };

    const moveElements = (direction) => {
      // console.log('in create_edit_document, handleTemplateElementActionClick, move() direction, this.state.selectedTemplateElementIdArray: ', direction, this.state.selectedTemplateElementIdArray);
      const array = [];
      const originalValueObject = {};

      _.each(this.state.selectedTemplateElementIdArray, eachElementId => {
      // _.each(this.props.templateElements, eachElement => {
        // if (this.state.selectedTemplateElementIdArray.includes(eachElement.id)) {
        const eachElement = this.props.templateElements[eachElementId];
        // if (this.state.selectedTemplateElementIdArray.indexOf(eachElement.id) !== -1) {
        if (eachElement) {
          originalValueObject[eachElement.id] = {
            top: eachElement.top,
            left: eachElement.left,
          };

          if (direction === 'moveLeft') array.push({ id: eachElement.id, left: `${parseFloat(eachElement.left) - 0.1}%`, o_left: originalValueObject[eachElement.id].left, action: 'update' });
          if (direction === 'moveRight') array.push({ id: eachElement.id, left: `${parseFloat(eachElement.left) + 0.1}%`, o_left: originalValueObject[eachElement.id].left, action: 'update' });
          if (direction === 'moveDown') array.push({ id: eachElement.id, top: `${parseFloat(eachElement.top) + 0.1}%`, o_top: originalValueObject[eachElement.id].top, action: 'update' });
          if (direction === 'moveUp') array.push({ id: eachElement.id, top: `${parseFloat(eachElement.top) - 0.1}%`, o_top: originalValueObject[eachElement.id].top, action: 'update' });
        } // end of if
      }); // end of each

      this.setTemplateHistoryArray(array, 'update');
      this.props.updateDocumentElementLocally(array);
    };

    const changeFont = (fontAttribute) => {
      const array = [];
      const originalValueObject = {};
      const fontKeySwitch = { fontFamily: 'font_family', fontSize: 'font_size', fontWeight: 'font_weight', fontStyle: 'font_style' };
      // If elements have been selected, apply changes to selected elements
      if (this.state.selectedTemplateElementIdArray.length > 0) {
        _.each(this.state.selectedTemplateElementIdArray, eachElementId => {
          const eachElement = this.props.templateElements[eachElementId];
          if (eachElement) {
            originalValueObject[eachElement.id] = {
              fontFamily: eachElement.font_family,
              fontSize: eachElement.font_size,
              fontStyle: eachElement.font_style,
              fontWeight: eachElement.font_weight
            };
          } // end of if eachElement
          // Set elemntValue to turn on and off bold and italic
          console.log('in create_edit_document, handleTemplateElementActionClick, changeFont, before turning on and off style and weight fontAttribute, elementVal, elementName, elementValue, clickedElement.value, this.state.allElementsChecked: ', fontAttribute, elementVal, elementName, elementValue, clickedElement.value, this.state.allElementsChecked);
          if (fontAttribute === 'fontWeight') elementValue = eachElement.font_weight === 'bold' ? 'normal' : elementValue;
          if (fontAttribute === 'fontStyle') elementValue = eachElement.font_style === 'italic' ? 'normal' : elementValue

          if (fontAttribute === 'fontFamily') array.push({ id: eachElement.id, font_family: clickedElement.value, o_font_family: originalValueObject[eachElement.id].fontFamily, action: 'update' });
          if (fontAttribute === 'fontSize') array.push({ id: eachElement.id, font_size: clickedElement.value, o_font_size: originalValueObject[eachElement.id].fontSize, action: 'update' });
          if (fontAttribute === 'fontWeight') array.push({ id: eachElement.id, font_weight: elementValue, o_font_weight: originalValueObject[eachElement.id].fontWeight, action: 'update' });
          if (fontAttribute === 'fontStyle') array.push({ id: eachElement.id, font_style: elementValue, o_font_style: originalValueObject[eachElement.id].fontStyle, action: 'update' });
          if (fontAttribute === 'fontLarger') array.push({ id: eachElement.id, font_size: parseFloat(eachElement.font_size) < 48 ? `${parseFloat(eachElement.font_size) + 0.5}px` : eachElement.font_size, o_font_size: originalValueObject[eachElement.id].fontSize, action: 'update' });
          if (fontAttribute === 'fontSmaller') array.push({ id: eachElement.id, font_size: parseFloat(eachElement.font_size) > 8 ? `${parseFloat(eachElement.font_size) - 0.5}px` : eachElement.font_size, o_font_size: originalValueObject[eachElement.id].fontSize, action: 'update' });
        }); // end of each
        // If ALL elements are checked, update the newFontObject
        if (this.state.allElementsChecked) {
          this.setState({
            newFontObject: {
              ...this.state.newFontObject,
              [fontKeySwitch[fontAttribute]]: elementValue || clickedElement.value,
              override: true
            },
            selectedElementFontObject: {
              ...this.state.selectedElementFontObject,
              [fontKeySwitch[fontAttribute]]: elementValue || clickedElement.value,
            }
          }, () => {
            // console.log('in create_edit_document, handleTemplateElementActionClick, changeFont, if all checked this.state.newFontObject, this.state.selectedElementFontObject: ', this.state.newFontObject, this.state.selectedElementFontObject);
            this.props.updateDocumentElementLocally(array);
            this.setTemplateHistoryArray(array, 'update');
            this.setFontControlBoxValues();
          });
        } else { // if one or more but not all checked
          this.setState({
            selectedElementFontObject: {
              ...this.state.selectedElementFontObject,
              [fontKeySwitch[fontAttribute]]: elementValue || clickedElement.value,
            }
          }, () => {
            this.props.updateDocumentElementLocally(array);
            this.setTemplateHistoryArray(array, 'update');
            this.setFontControlBoxValues();
          });
        }
      } else { // else of if selectedTemplateElementIdArray.length > 0
        if (fontAttribute === 'fontWeight') elementValue = this.state.newFontObject.fontWeight === 'bold' ? 'normal' : elementValue;
        if (fontAttribute === 'fontStyle') elementValue = this.state.newFontObject.fontStyle === 'italic' ? 'normal' : elementValue
        // if there are NO elements selected turn override true so that
        // font button will show the attributes user wants for new element
        this.setState({
          newFontObject: {
            ...this.state.newFontObject, // spread operator to copy the state object
            // elementValue will be null for the select fields so use clickedElement.value (the selected option)
            [fontKeySwitch[fontAttribute]]: elementValue || clickedElement.value,
            override: true
          }
        }, () => {
          this.setTemplateHistoryArray(array, 'update');
          this.setFontControlBoxValues();
          console.log('in create_edit_document, handleTemplateElementActionClick, changeFont, this.state.newFontObject: ', this.state.newFontObject);
        })
      }
    }; // end of changeFont

    const createElement = (elementObject) => {
      this.props.createDocumentElementLocally(elementObject);
    };

    const deleteElement = (elementsIdArray) => {
      this.props.deleteDocumentElementLocally(elementsIdArray, () => {});
    };

    const updateElement = (elementsArray) => {
      this.props.updateDocumentElementLocally(elementsArray);
    };

    const redoUndoAction = (lastActionArray, doWhatNow) => {
      // Remove action attribute from object when recreating and updating elements
      const removeActionAttribute = (lastActionArr) => {
        const array = [];
        _.each(lastActionArr, eachObject => {
          const eachObjectModified = this.getNewElementObject(eachObject);
          delete eachObjectModified.action;
          array.push(eachObjectModified);
        });
        return array;
      };

      const getOriginalAttributes = (lastActionArr) => {
        const array = [];
        _.each(lastActionArr, eachObject => {
          // const eachModified = this.getNewElementObject(each);
          const object = {};
          _.each(Object.keys(eachObject), eachKey => {
            // if ((eachKey[0] === 'o' && eachKey[1] === eachKey[1].toUpperCase())) {
            if ((eachKey[0] === 'o' && eachKey[1] === '_')) {
              // substring is (inclusive, exclusive)
              const withoutO = eachKey.substring(2, eachKey.length);
              // const newKey = withoutO[0].toLowerCase() + withoutO.substring(1);
              // console.log('in create_edit_document, handleTemplateElementActionClick, redoUndoAction, getOriginalAttributes typeof eachKey, eachKey, newKey: ', typeof eachKey, eachKey, newKey);
              // object[newKey] = eachObject[eachKey];
              object[withoutO] = eachObject[eachKey];
            }

            if (eachKey === 'id') {
              object[eachKey] = eachObject[eachKey];
            }
          });
          array.push(object);
        });
        return array;
      };
      // if the last action taken was to craete an element,
      // if from undo action, call delete, and if redo, call create
      if (lastActionArray[0].action === 'create') {
        console.log('in create_edit_document, handleTemplateElementActionClick, redoUndoAction, in last action create lastActionArray, doWhatNow: ', lastActionArray, doWhatNow);
        if (doWhatNow === 'undo') {
          deleteElement([lastActionArray[0].id])
          // Take the checked element ids out of selectedTemplateElementIdArray
          const newArray = [...this.state.selectedTemplateElementIdArray];
          // If element id is in selectedTemplateElementIdArray, take it out of the array
          const index = this.state.selectedTemplateElementIdArray.indexOf(lastActionArray[0].id);

          if (index !== -1) {
            newArray.splice(index, 1);
          }

          this.setState({
            selectedTemplateElementIdArray: newArray,
          });
        } // send array of id
        // No need to do logic for persisted elements since none are created just fetched from backend
        if (doWhatNow === 'redo') createElement(lastActionArray[0]); // send just object hash
      }

      if (lastActionArray[0].action === 'update') {
        // const modifiedPersistedObject = [...this.state.modifiedPersistedElementsObject];

        if (doWhatNow === 'undo') {
          // Get attributes without 'o' infront
          const newLastAction = getOriginalAttributes(lastActionArray);
          updateElement(newLastAction);
          console.log('in create_edit_document, handleTemplateElementActionClick, redoUndoAction, in last action update lastActionArray, doWhatNow, newLastAction: ', lastActionArray, doWhatNow, newLastAction);
        } else {
          // Use lastActionArray as is [{ id: xx, left: xx, top: xx}, { id: xx, left: xx, top: xx}]
          updateElement(lastActionArray);
          console.log('in create_edit_document, handleTemplateElementActionClick, redoUndoAction, in last action update lastActionArray, doWhatNow: ', lastActionArray, doWhatNow);
        }
      }

      if (lastActionArray[0].action === 'delete') {
        console.log('in create_edit_document, handleTemplateElementActionClick, redoUndoAction, in last action delete lastActionArray, doWhatNow: ', lastActionArray, doWhatNow);
        const newLastAction = removeActionAttribute(lastActionArray);
        if (doWhatNow === 'undo') {
          _.each(newLastAction, eachElement => {
            createElement(eachElement);
          });
        }

        if (doWhatNow === 'redo') {
          const elementsIdArray = [];
          const newArray = [...this.state.selectedTemplateElementIdArray];

          _.each(newLastAction, eachElement => {
            elementsIdArray.push(eachElement.id);
            // if element id is in selectedTemplateElementIdArray, remove it
            const index = newArray.indexOf(eachElement.id);
            if (index !== -1) {
              newArray.splice(index, 1);
            }
          });

          deleteElement(elementsIdArray);
          this.setState({
            selectedTemplateElementIdArray: newArray,
          });
        }
      }
    };

    const redoUndo = (doWhat) => {
      let lastActionArray = [];
      if (doWhat === 'undo') {
        if (this.state.historyIndex >= 0) {
          // Get the array of objects at historyIndex
          lastActionArray = this.state.templateEditHistoryArray[this.state.historyIndex];
          // Call the action
          redoUndoAction(lastActionArray, doWhat)
          // Decrement historyIndex
          this.setState({ historyIndex: this.state.historyIndex - 1 }, () => {
            // console.log('in create_edit_document, handleTemplateElementActionClick, in if else state !undoingAndRedoing after setState elementVal, this.state.templateEditHistoryArray, this.state.historyIndex, lastActionArray: ', elementVal, this.state.templateEditHistoryArray, this.state.historyIndex, lastActionArray);
            this.setLocalStorageHistory('undo');
          })
        }
      } else { // else for if doWhat undo; else REDO
        // console.log('in create_edit_document, handleTemplateElementActionClick, in else doWhat == redo elementVal, this.state.templateEditHistoryArray, this.state.historyIndex, lastActionArray: ', elementVal, this.state.templateEditHistoryArray, this.state.historyIndex, lastActionArray);
        // First increment historyIndex
        this.setState({
          historyIndex: this.state.historyIndex + 1
        }, () => {
          // Get array of objects at historyIndex
          lastActionArray = this.state.templateEditHistoryArray[this.state.historyIndex]
          redoUndoAction(lastActionArray, doWhat);
          // console.log('in create_edit_document, handleTemplateElementActionClick, in else doWhat == redo after set state historyIndex elementVal, this.state.templateEditHistoryArray, this.state.historyIndex, lastActionArray: ', elementVal, this.state.templateEditHistoryArray, this.state.historyIndex, lastActionArray);
          this.setLocalStorageHistory('redo')
        });
      }
    };

    console.log('in create_edit_document, handleTemplateElementActionClick, clickedElement, elementVal, this.state.selectedTemplateElementIdArray: ', clickedElement, elementVal, this.state.selectedTemplateElementIdArray);
      switch (elementVal) {
        case 'editFields':
          this.setState({ editFieldsOn: !this.state.editFieldsOn }, () => {
            console.log('in create_edit_document, handleTemplateElementActionClick, this.state.editFieldsOn: ', this.state.editFieldsOn);
          })
          break;

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
            // IE does not support includes
            if (this.state.selectedTemplateElementIdArray.indexOf(eachElement.id === -1)) {
              // Push id into array in string type so as to enable temporary id with '1a' char in it
              checkAllArray.push(eachElement.id);
            }
          });


          if (checkAllArray.length > 0) {
            this.setState({
              allElementsChecked: true,
              selectedTemplateElementIdArray: checkAllArray,
              newFontObject: { ...this.state.newFontObject, override: false },
              // selectedElementFontObject: fontObject.selectObject
            }, () => {
              // Gets a map of all font attributes used in elements on agreement
              const fontObject = this.getSelectedFontElementAttributes();
              // fontObject is { object: {element font mapping}, selectObject: { fontFamily: 'arial', fontSize: '12px' ...}}
              console.log('in create_edit_document, handleTemplateElementActionClick, fontObject, this.state.newFontObject: ', fontObject, this.state.newFontObject);
              this.setState({ selectedElementFontObject: fontObject.selectObject })
            });
          }
          // }
          break;
        } // looks like lint requires having block when case logic too long

        case 'uncheckAll':
          // if there are checked elements clear out selectedTemplateElementIdArray, and nullout selectedElementFontObject
          // and uncheckAll
            this.setState({
              selectedTemplateElementIdArray: [],
              allElementsChecked: false,
              selectedElementFontObject: null
            });
            break;

        case 'moveLeft':
          moveElements(elementVal);
          break;

        case 'moveRight':
          moveElements(elementVal);
          break;

        case 'moveDown':
          moveElements(elementVal);
          break;

        case 'moveUp':
          moveElements(elementVal);
          break;

        case 'undo':
          redoUndo(elementVal);
          break;

        case 'redo':
          redoUndo(elementVal);
          break;

        case 'fontFamily':
          changeFont(elementVal);
          break;

        case 'fontSize':
          changeFont(elementVal);
          break;

        case 'fontWeight':
          changeFont(elementVal);
          break;

        case 'fontStyle':
          changeFont(elementVal);
          break;

        case 'fontSmaller':
          changeFont(elementVal);
          break;

        case 'fontLarger':
          changeFont(elementVal);
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

  handleFontControlCloseClick(event) {
    const clickedElement = event.target;
    // if clicked element does not include any elements in the font control box,
    // call setState to close the showFontControlBox
    const fontControlClassesArray = [
      'create-edit-document-font-control-box',
      'create-edit-document-font-family-select',
      'create-edit-document-font-size-select',
      'create-edit-document-font-style-button-box',
      'create-edit-document-font-style-button'
    ];
    // If className of clicked element is NOT in the array
    if (fontControlClassesArray.indexOf(clickedElement.className) === -1) {
      this.setState({ showFontControlBox: false });
      const fontControlBox = document.getElementById('create-edit-document-font-control-box');
      fontControlBox.style.display = 'none';
      // console.log('in create_edit_document, handleFontControlCloseClick, fontControlBox: ', fontControlBox);
      document.removeEventListener('click', this.handleFontControlCloseClick);
    }
    // remove event listener
  }

  renderFontControlBox() {
    // For rendering box for setting font family, size, style and weight
    // Get the font button in array
    let fontButtonDimensions = {};
    const fontButtonArray = document.getElementsByClassName('create-edit-document-template-edit-action-box-elements-double')
    // Get the font button dimension so that a control box can be placed below it
    if (fontButtonArray.length > 0) fontButtonDimensions = fontButtonArray[0].getBoundingClientRect();
    // const controlBoxWidth = '165px';
    // add listner for clicks outside the control box opened
    return (
      <div
        className="create-edit-document-font-control-box"
        id="create-edit-document-font-control-box"
        // Set the top and left of control box to be right underneath the button
        style={{ display: 'none', top: fontButtonArray.length > 0 ? fontButtonDimensions.top + 55 : null, left: fontButtonArray.length > 0 ? fontButtonDimensions.left - 40 : null }}
      >
        <select
          className="create-edit-document-font-family-select"
          name="fontFamily"
          id="fontFamily"
          style={{ width: '100%', backgroundColor: 'white' }}
          onChange={this.handleTemplateElementActionClick}
        >
          <option value="MSゴシック">MSゴシック</option>
          <option value="ＭＳ Ｐ明朝">ＭＳ Ｐ明朝</option>
          <option value="osaka">Osaka</option>
          <option value="arial">Arial</option>
          <option value="times new roman">Times New Roman</option>
          <option value="helvetica">Helvetica</option>
          <option value="century gothic">Century Gothic</option>
        </select>
        <div style={{ margin: '5px', float: 'left' }}>Font Size</div>

        <select
          className="create-edit-document-font-size-select"
          name="fontSize"
          id="fontSize"
          style={{ width: '100%', backgroundColor: 'white' }}
          onChange={this.handleTemplateElementActionClick}
        >
          <option value="8px">8</option>
          <option value="9px">9</option>
          <option value="10px">10</option>
          <option value="10.5px">10.5</option>
          <option value="11px">11</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="20px">20</option>
          <option value="22px">22</option>
          <option value="24px">24</option>
          <option value="26px">26</option>
          <option value="28px">28</option>
          <option value="36px">36</option>
          <option value="48px">48</option>
        </select>
        <div
          className="create-edit-document-font-style-button-box"
        >
          <div
            className="create-edit-document-font-style-button"
            id="fontWeight"
            value="bold"
            name="fontWeight"
            style={{ fontWeight: 'bold' }}
            onClick={this.handleTemplateElementActionClick}
          >
            Bold
          </div>
          <div
            className="create-edit-document-font-style-button"
            id="fontStyle"
            value="italic"
            name="fontStyle"
            style={{ fontStyle: 'italic' }}
            onClick={this.handleTemplateElementActionClick}
          >
            Italic
          </div>
        </div>
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

  getSelectedFontElementAttributes() {
    // getCheckElementFontObject
    const object = { font_family: {}, font_size: {}, font_weight: {}, font_style: {} };
    const selectObject = {};
    let eachElement = null;
    if (this.state.selectedTemplateElementIdArray.length > 0) {
      _.each(this.state.selectedTemplateElementIdArray, eachId => {
        eachElement = this.props.templateElements[eachId];
        console.log('in create_edit_document, getSelectedFontElementAttributes, eachElement: ', eachElement);
        _.each(Object.keys(object), eachKey => {
          if (!object[eachKey][eachElement[eachKey]]) {
            object[eachKey][eachElement[eachKey]] = [];
            object[eachKey][eachElement[eachKey]].push(eachElement.id);
            console.log('in create_edit_document, getSelectedFontElementAttributes, !object[eachKey], object[eachKey][eachElement[eachKey]]: ', object[eachKey], object[eachKey][eachElement[eachKey]]);
          } else {
            console.log('in create_edit_document, getSelectedFontElementAttributes, else !object[eachKey], object[eachKey][eachElement[eachKey]]: ', object[eachKey], object[eachKey][eachElement[eachKey]]);
            object[eachKey][eachElement[eachKey]].push(eachElement.id);
          }
        });
      });

      // let objectLength = 0;
      let selectValue = [];

      _.each(Object.keys(object), eachFontAttribute => {
        // Get the number of fonts actually used in document fontFamily: { arial: [id], times: [id] }
        // would be 2
        // objectLength = Object.keys(object[eachFontAttribute]).length;
        // Get an array of actual fonts used in selected elements
        selectValue = Object.keys(object[eachFontAttribute])
        selectObject[eachFontAttribute] = null;
        if (selectValue.length === 1) {
          selectObject[eachFontAttribute] = selectValue[0];
        }
        // if (objectLength === 1 && eachFontAttribute === 'fontSize') fontSize.value = selectValue[0];
        // if (objectLength === 1 && eachFontAttribute === 'fontWeight') fontFamily.value = selectValue[0];
        // if (objectLength === 1 && eachFontAttribute === 'fontStyle') fontFamily.value = selectValue[0];
      })
      // this.setState({ selectedElementFontObject: })
    }

    console.log('in create_edit_document, getSelectedFontElementAttributes, object, selectObject: ', object, selectObject);
    this.setState({ selectedElementFontObject: _.isEmpty(selectObject) ? null : selectObject });
    return { object, selectObject };
  }

  setFontControlBoxValues() {
    const fontAttributeObject = this.state.selectedElementFontObject || this.state.newFontObject;
    // Gets the select field for fontFamily
    const fontFamily = document.getElementById('fontFamily');
    const fontSize = document.getElementById('fontSize');
    const fontWeight = document.getElementById('fontWeight');
    const fontStyle = document.getElementById('fontStyle');
    // const fontInputs = [fontFamily, fontSize, fontWeight, fontStyle];
    console.log('in create_edit_document, setFontControlBoxValues, fontAttributeObject, fontSize, fontFamily: ', fontAttributeObject, fontSize, fontFamily);
    // let objectLength;
    // Go through array of fontAttributeObject ie fontFamily, fontSize, fontWeight, fontStyle
    _.each(Object.keys(fontAttributeObject), eachFontAttribute => {
      // Get the number of fonts actually used in document fontFamily: { arial: [id], times: [id] }
      // would be 2
      // objectLength = Object.keys(fontAttributeObject[eachFontAttribute]).length;
      // Get an array of actual fonts used in selected elements
      // const selectValue = Object.keys(fontAttributeObject[eachFontAttribute])
      console.log('in create_edit_document, setFontControlBoxValues, fontAttributeObject[eachFontAttribute]: ', fontAttributeObject[eachFontAttribute]);
      if (eachFontAttribute === 'font_family') fontFamily.value = fontAttributeObject[eachFontAttribute];
      if (eachFontAttribute === 'font_size') fontSize.value = fontAttributeObject[eachFontAttribute];
      if (eachFontAttribute === 'font_weight') {
         if (fontAttributeObject[eachFontAttribute] === 'bold') {
           // fontWeight.style.border = '1px solid black'
           fontWeight.style.fontWeight = 'bold'
         } else {
           // fontWeight.style.border = '1px solid #ccc'
           fontWeight.style.fontWeight = 'normal'
         }
      }

      if (eachFontAttribute === 'font_style') {
        if (fontAttributeObject[eachFontAttribute] === 'italic') {
          fontStyle.style.fontStyle = 'italic';
        } else {
          fontStyle.style.fontStyle = 'normal';
        }
      }
      // if (objectLength === 1 && eachFontAttribute === 'fontStyle') fontFamily.value = selectValue[0];
      // _.each(fontInputs, eachInput => {
      //   const modEachInput = eachInput;
      //   modEachInput.value = fontAttributeObject[eachFontAttribute];
      // });
    });
  }

  handleUserInput(event) {
    const blurredElement = event.target;
    console.log('in create_edit_document, handleUserInput, blurredElement ', blurredElement);
  }

  handleShowFontControlBox() {
    const fontControlBox = document.getElementById('create-edit-document-font-control-box')
    // 'Open' the font control box by setting display to 'block'
    fontControlBox.style.display = 'block';
    // Add a listener for user clicks outside the box to close and set display: 'none'
    document.addEventListener('click', this.handleFontControlCloseClick)
    // Get object with attributes assigned to each element (ie fontFamily: { arial: [id]})
    // const fontAttributeObject = this.getSelectedFontElementAttributes();
    this.setFontControlBoxValues();
  }

  renderTemplateElementEditAction() {
    // Define all button conditions for enabling and disabling buttons
    const templateElementsLength = Object.keys(this.props.templateElements).length
    const elementsChecked = this.state.selectedTemplateElementIdArray.length > 0;
    const multipleElementsChecked = this.state.selectedTemplateElementIdArray.length > 1;
    const multipleChoicesChecked = this.state.selectedChoiceIdArray.length > 1;
    // NOTE: disableSave does not work after saving since initialValues have to be updated
    const disableSave = !this.props.templateElements || (_.isEmpty(this.state.modifiedPersistedElementsObject) && !this.props.formIsDirty) || this.state.selectedTemplateElementIdArray.length > 0 || this.state.createNewTemplateElementOn;
    // const enableSave = !this.props.templateElements || _.isEmpty(this.state.modifiedPersistedElementsObject) || this.state.selectedTemplateElementIdArray.length > 0 || this.state.createNewTemplateElementOn;
    // disableSave = !this.props.formIsDirty;
    const disableCheckAll = !this.props.templateElements || (templateElementsLength < 1) || this.state.allElementsChecked || this.state.createNewTemplateElementOn;
    const disableCreateNewElement = this.state.createNewTemplateElementOn || this.state.selectedTemplateElementIdArray.length < 1;
    const enableUndo = (this.state.templateEditHistoryArray.length > 0 && this.state.historyIndex > -1) && !this.state.createNewTemplateElementOn;
    const enableRedo = (this.state.templateEditHistoryArray.length > 0 && this.state.historyIndex !== this.state.templateEditHistoryArray.length - 1) && !this.state.createNewTemplateElementOn;
    // const saveButtonActive = this.state.templateEditHistoryArray.length > 0;
    // if this.props.onlyFontAttributeObject is not null, use this.props.onlyFontAttributeObject
    let onlyFontAttributeObject = this.state.selectedElementFontObject ? this.state.selectedElementFontObject : this.state.newFontObject;
    const disableEditFields = templateElementsLength < 1 || this.state.editFieldsOn;
    // let onlyFontAttributeObject = this.state.newFontObject;
    // if (this.state.newFontObject.override) onlyFontAttributeObject = this.state.newFontObject;


    // const createNewTemplateElementOn = this.state.createNewTemplateElementOn || this.state.selectedTemplateElementIdArray.length < 1;
    // console.log('in create_edit_document, renderTemplateElementEditAction, after each, (this.props.templateElements), this.state.allElementsChecked : ', this.props.templateElements, this.state.allElementsChecked);
    console.log('in create_edit_document, renderTemplateElementEditAction, this.props.formIsDirty : ', this.props.formIsDirty);
    // console.log('in create_edit_document, renderTemplateElementEditAction, this.state.selectedElementFontObject : ', this.state.selectedElementFontObject);
        // console.log('in create_edit_document, renderTemplateElementEditAction, after each, disableCheckAll : ', disableCheckAll);
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
          <i value="newField" name="Create a new field,top" className="fas fa-plus-circle"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          name="Save your work,top"
          value="save"
        >
          <i
            value="save"
            onMouseOver={this.handleMouseOverActionButtons}
            name="Save your work,top"
            style={{ fontSize: '19px', padding: '4px 0 0 2px', color: disableSave ? 'gray' : 'blue' }}
            className="far fa-save"
            onClick={!disableSave ? this.props.handleSubmit(data => this.handleTemplateFormSubmit({ data, submitAction: 'save' })) : () => {}}
          >
          </i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={this.handleTemplateElementActionClick}
          name="Edit document fields,top"
          value="editFields"
        >
          <i value="editFields" onMouseOver={this.handleMouseOverActionButtons} name="Edit document fields,top" style={{ fontSize: '17px', color: disableEditFields ? 'gray' : 'blue' }} className="far fa-edit"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={multipleElementsChecked || multipleChoicesChecked ? this.handleTemplateElementActionClick : () => {}}
          value="vertical"
          onMouseOver={this.handleMouseOverActionButtons}
          name="Align fields vertically,top"
        >
          <i value="vertical" name="Align fields vertically,top" style={{ color: multipleElementsChecked || multipleChoicesChecked ? 'blue' : 'gray' }} className="fas fa-ruler-vertical"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={multipleElementsChecked || multipleChoicesChecked ? this.handleTemplateElementActionClick : () => {}}
          value="horizontal"
          onMouseOver={this.handleMouseOverActionButtons}
          name="Align fields horizontally,top"
        >
          <i value="horizontal" name="Align fields horizontally,top" style={{ color: multipleElementsChecked || multipleChoicesChecked ? 'blue' : 'gray' }} className="fas fa-ruler-horizontal"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          // onClick={templateElementsLength > 0 ? this.handleTemplateElementActionClick : () => {}}
          value="moveLeft"
          onMouseOver={this.handleMouseOverActionButtons}
          name="Move fields left,top"
        >
          <i
            value="moveLeft"
            name="Move fields left,top"
            style={{ color: elementsChecked ? 'blue' : 'gray' }}
            className="fas fa-angle-left"
            onClick={templateElementsLength > 0 ? this.handleTemplateElementActionClick : () => {}}
          >
          </i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          value="moveRight"
          name="Move fields right,top"
        >
          <i
            value="moveRight"
            name="Move fields right,top"
            onMouseOver={this.handleMouseOverActionButtons}
            style={{ color: elementsChecked ? 'blue' : 'gray' }}
            className="fas fa-angle-right"
            onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          >
          </i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          // onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          value="moveDown"
          name="Move fields down,top"
        >
          <i
            value="moveDown"
            name="Move fields down,top"
            style={{ color: elementsChecked ? 'blue' : 'gray' }}
            onMouseOver={this.handleMouseOverActionButtons}
            className="fas fa-angle-down"
            onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          >
          </i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          // onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          value="moveUp"
          name="Move fields up,top"
        >
          <i
            value="moveUp"
            name="Move fields up,top"
            style={{ color: elementsChecked ? 'blue' : 'gray' }}
            onMouseOver={this.handleMouseOverActionButtons}
            className="fas fa-angle-up"
            onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          >
          </i>
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
          name="Make font larger,bottom"
        >
          <i
            onMouseOver={this.handleMouseOverActionButtons}
            value="fontLarger"
            onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
            style={{ color: elementsChecked ? 'blue' : 'gray' }}
            name="Make font larger,bottom"
            className="fas fa-font"
          >
          </i>
          <i name="Make font larger,bottom" style={{ color: elementsChecked ? 'blue' : 'gray' }} className="fas fa-sort-up"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          // onMouseOver={this.handleMouseOverActionButtons}
          name="Make font smaller,bottom"
        >
          <i
            onMouseOver={this.handleMouseOverActionButtons}
            onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
            value="fontSmaller"
            name="Make font smaller,bottom"
            style={{ fontSize: '12px', padding: '3px', color: elementsChecked ? 'blue' : 'gray' }}
            className="fas fa-font"
          >
          </i>
          <i className="fas fa-sort-down" style={{ color: elementsChecked ? 'blue' : 'gray' }}></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements-double"
          value="fontStyle"
          // onMouseOver={this.handleMouseOverActionButtons}
          // onClick={() => this.setState({ showFontControlBox: !this.state.showFontControlBox })}
          onClick={this.handleShowFontControlBox}
        >
          <span
            style={{
              width: 'auto',
              // fontSize: onlyFontAttributeObject.fontSize && parseFloat(onlyFontAttributeObject.fontSize) < 20 ? onlyFontAttributeObject.fontSize : '12px',
              fontSize: '11.5px',
              fontFamily: onlyFontAttributeObject.font_family ? onlyFontAttributeObject.font_family : this.state.newFontObject.font_family,
              fontStyle: onlyFontAttributeObject.font_style ? onlyFontAttributeObject.font_style : this.state.newFontObject.font_style,
              fontWeight: onlyFontAttributeObject.font_weight ? onlyFontAttributeObject.font_weight : this.state.newFontObject.font_weight,
              color: elementsChecked ? 'blue' : 'gray',
              padding: '10px 0 0 0',
              overFlow: 'hidden'
            }}
            onMouseOver={this.handleMouseOverActionButtons}
            name="Change font family and style,bottom"
          >
            {onlyFontAttributeObject.font_family ? `${(onlyFontAttributeObject.font_family).charAt(0).toUpperCase() + onlyFontAttributeObject.font_family.slice(1)}` : 'Font'}
          </span>
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
          name="Undo changes,bottom"
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
              {this.props.showTemplate ? this.renderTemplateElementEditAction() : ''}
              {this.props.showTemplate && this.state.actionExplanationObject ? this.renderExplanationBox() : ''}
              {this.props.showTemplate ? this.renderFontControlBox() : ''}
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
    // let fontAttributeObject = {};
    // const elementsEmpty = _.isEmpty(state.documents.templateElements)
    // console.log('in create_edit_document, mapStateToProps, elementsEmpty: ', elementsEmpty);
    // if (!elementsEmpty) {
    //   fontAttributeObject = getElementFontAttributes(state.documents.templateElements);
    //   console.log('in create_edit_document, mapStateToProps, in if !elementsEmpty: ', elementsEmpty);
    // }
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
      documentInsertsAll: state.bookingData.documentInsertsAll,
      // isDirty: isDirty('CreateEditDocument')(state)
      // fontAttributeObject: state.documents.fontAttributeObject,
      // onlyFontAttributeObject: state.documents.onlyFontAttributeObject,
      templateDocumentChoicesObject: state.documents.templateDocumentChoicesObject,
      templateElementsByPage: state.documents.templateElementsByPage,
      // meta is for getting touched, active and visited for initialValue key
      // meta: getFormMeta('CreateEditDocument')(state)
    };
  }

  return {};
}

export default connect(mapStateToProps, actions)(CreateEditDocument);

// renderTemplateElementEditAction(
// handleShowFontControlBox(
// getSelectedFontElementAttributes(
// handleTemplateElementCheckClick(
// setTemplateHistoryArray(
