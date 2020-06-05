import React, { Component } from 'react';
import _ from 'lodash';
import {
  reduxForm,
  Field,
  isDirty,
  getFormMeta,
  change
} from 'redux-form';
// gettting proptypes warning with isDirty
import { connect } from 'react-redux';
// import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
// import cloudinary from 'cloudinary-core';
import * as actions from '../../actions';
// import DocumentForm from '../constants/document_form';
// NOTE: Documents imports constants/fixed_term_rental_contract etc.
import Documents from '../constants/documents';
import AppLanguages from '../constants/app_languages';

import DocumentChoices from './document_choices';
import DocumentChoicesTemplate from './document_choices_template';
import DefaultMainInsertFieldsObject from '../constants/default_main_insert_fields';
// Functions for choices
import setBoundaries from './set_choice_wrapper_boundaries';
import getUpdatedElementObject from './get_element_update_object';
import getNewDocumentFieldChoices from './get_new_document_field_choices';
import getOtherChoicesObject from './get_other_choices_object';
import getUpdatedElementObjectMoveWrapper from './get_updated_element_object_move_wrapper';
import getUpdatedElementObjectNoBase from './get_updated_element_object_no_base';
// import getListValues from './get_list_values';
import getBookingDateObject from '../functions/get_booking_date_object';
import getTranslationObject from './get_translation_object';

// Just for test
// import FixedTermRentalContractBilingual from '../constants/fixed_term_rental_contract_bilingual';
// import FixedTermRentalContractBilingualAll from '../constants/fixed_term_rental_contract_bilingual_all';
// import FixedTermRentalContractBilingualByPage from '../constants/fixed_term_rental_contract_bilingual_by_page';
// import ImportantPointsExplanationBilingual from '../constants/important_points_explanation_bilingual';

// NOTE: userOwner is currently assumed to be the user and is the landlord on documents;
// flatOwner is the title holder of the flat on documents
//  and its input is taken on craeteFlat, editFlat and flatLanuages

const TAB_WIDTH = 70;
const TAB_HEIGHT = 23;
const TAB_REAR_SPACE = 5;
// Since need to update persisted elements from beginning of history array,
// Cannot have a finite MAX_HISTORY_ARRAY_LENGTH; Array length is zeroed out at every save
const MAX_HISTORY_ARRAY_LENGTH = 1000000;
// let explanationTimer = 3;
// explanationTimerArray for keeping timer ids so they can be cleared (for edit action buttons)
let explanationTimerArray = [];
const INITIAL_TEMPLATE_ELEMENT_ACTION_ID_OBJECT = { array: [], select: 0, list: 0, input: 0, button: 0, buttons: 0, translation: false };

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
      translationElementCount: 0,
      createNewTemplateElementOn: false,
      actionExplanationObject: null,
      allElementsChecked: false,
      templateEditHistoryArray: [],
      historyIndex: 0,
      unsavedTemplateElements: {},
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
      // modifiedPersistedElementsObject is for elements that have been persisted in backend DB
      modifiedPersistedElementsObject: {},
      modifiedPersistedTranslationElementsObject: {},
      // originalPersistedTemplateElements: {},
      selectedChoiceIdArray: [],
      renderChoiceEditButtonDivs: false,
      templateFieldChoiceArray: [],
      templateFieldChoiceObject: null,
      templateElementActionIdObject: INITIAL_TEMPLATE_ELEMENT_ACTION_ID_OBJECT,
      editFieldsOn: false,
      editFieldsOnPrevious: false,
      translationModeOn: false,
      documentTranslationsTreated: {},
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
    this.handleTemplateChoiceActionMouseDown = this.handleTemplateChoiceActionMouseDown.bind(this);
    this.handleFieldChoiceActionClick = this.handleFieldChoiceActionClick.bind(this);
    this.handleTemplateElementAddClick = this.handleTemplateElementAddClick.bind(this);
    this.handleFieldPreferencesClick = this.handleFieldPreferencesClick.bind(this);
  }

  // InitialValues section implement after redux form v7.4.2 upgrade
  // started to force mapStateToProps to be called for EACH Field element;
  // so to avoid Documents[documentKey].method to be called in each msp call
  //(over 100! for important ponts form) use componentDidUpdate;
  // Then to avoid .method to be called after each user input into input field,
  // use shouldComponentUpdate in document_choices; if return false, will not call cdu

  // IMPORTANT: This component enables user to keep history of edit changes of template elements
  // If template element is created, updated or deleted, setTemplateHistoryArray function
  // keeps the history in an array of objects set in localStorage as 'documentHistory'
  // The main purpose of the history feature is to enable user to recover his/her work
  // If the page is refreshed for any reason. The history is combined with backend persisted
  // elements in createDocumentElementLocally action.
  // NOTE: The history is cleared out when user saves work to backend.
  componentDidMount() {
    // let testCount = 0;
    // const object = {};
    // const duplicateArray = [];
    // const duplicateObject = {};
    // // const translations = this.props.testDocumentTranslations.important_points_explanation_bilingual
    // const translations = this.props.testDocumentTranslations.fixed_term_rental_contract_bilingual
    // _.each(Object.keys(translations), eachPage => {
    //   // _.each(Object.keys(FixedTermRentalContractBilingualAll), eachKey => {
    //   _.each(Object.keys(translations[eachPage]), eachKey => {
    //   if (!object[eachPage]) {
    //     // object[eachPage] = { [eachKey]: ImportantPointsExplanationBilingual[eachPage][eachKey] };
    //     object[eachPage] = { [eachKey]: `Base[:${eachKey}]` };
    //   } else {
    //     object[eachPage][eachKey] = `Base[:${eachKey}]`;
    //     // object[eachPage][eachKey] = ImportantPointsExplanationBilingual[eachPage][eachKey];
    //     if (!object[eachKey]) {
    //         object[eachKey] = 1;
    //         duplicateObject[eachKey] = [eachPage];
    //       } else {
    //           object[eachKey]++;
    //           // duplicateArray.push(eachKey);
    //
    //           duplicateObject[eachKey].push(eachPage);
    //         }
    //   }
    //     testCount++;
    //   });
    // });
    //
    // _.each(Object.keys(duplicateObject), each => {
    //   if (duplicateObject[each].length < 2) {
    //     delete duplicateObject[each];
    //   }
    // })
    // console.log('in create_edit_document, componentDidMount, getLocalHistory, testCount, object, duplicateObject', testCount, object, duplicateObject);
    // // console.log('in create_edit_document, componentDidMount, this.props.documentTranslations', this.props.documentTranslation);
    const name = 'Jack';
    const object = { name: 'ben', condition: name !== 'david', parameters: { name } };
    const test = { test: (props) => {
      console.log('create_edit_document, componentDidMount, props', props);

      object.name = props.name;
      return;
    } };
    if (object.condition) console.log('create_edit_document, componentDidMount, test.test(name), object', test.test(object.parameters), object);
    // test.test(name);
    const getLocalHistory = () => {
      const localStorageHistory = localStorage.getItem('documentHistory');
      // console.log('in create_edit_document, componentDidMount, getLocalHistory, localStorageHistory', localStorageHistory);
      let destringifiedHistory = {};
      // if localStorageHistory exists, set state to previous values
      // if localStorageHistory does not exist, all state values are set in constructor (ie empty)
      // and next time user refreshes or mounts component on the same machine, it will be there
      if (localStorageHistory) {
        destringifiedHistory = JSON.parse(localStorageHistory);
        if (destringifiedHistory[this.props.agreement.id] && destringifiedHistory[this.props.agreement.id].elements) {
          console.log('in create_edit_document, componentDidMount, getLocalHistory, destringifiedHistory', destringifiedHistory);
          // Set state with || in case localStorageHistory exists but history and other objects do not exist
          this.setState({
            templateEditHistoryArray: destringifiedHistory[this.props.agreement.id].history || this.state.templateEditHistoryArray,
            newFontObject: destringifiedHistory[this.props.agreement.id].newFontObject || this.state.newFontObject,
            // modifiedPersistedElementsArray: destringifiedHistory[this.props.agreement.id].modifiedPersistedElementsArray || this.state.modifiedPersistedElementsArray,
            modifiedPersistedElementsObject: destringifiedHistory[this.props.agreement.id].modifiedPersistedElementsObject || this.state.modifiedPersistedElementsObject,
            modifiedPersistedTranslationElementsObject: destringifiedHistory[this.props.agreement.id].modifiedPersistedTranslationElementsObject || this.state.modifiedPersistedTranslationElementsObject,
            // templateElementCount: highestElementId,
            // originalPersistedTemplateElements: destringifiedHistory[this.props.agreement.id].originalPersistedTemplateElements || this.state.originalPersistedTemplateElements,
          }, () => {
            this.setState({
              historyIndex: destringifiedHistory[this.props.agreement.id].historyIndex || this.state.historyIndex
            }, () => {
              console.log('in create_edit_document, componentDidMount, getLocalHistory, this.state.templateEditHistoryArray, this.state.templateElementCount', this.state.templateEditHistoryArray, this.state.templateElementCount);
            }); // end of second setState
          }); // end of first setState
        } // end of if destringifiedHistory elements
        // if there is localStorageHistory return an object for use in document reducer
        if (destringifiedHistory[this.props.agreement.id]) {
          return {
            templateEditHistoryArray: destringifiedHistory[this.props.agreement.id].history || this.state.templateEditHistoryArray,
            historyIndex: destringifiedHistory[this.props.agreement.id].historyIndex || this.state.historyIndex,
            elements: destringifiedHistory[this.props.agreement.id].elements
          };
        }
      } // end of if localStorageHistory
      // if there is no localStorageHistory return null
      return null;
    }; // end of getLocalHistory

    let templateEditHistory = null;
    if (this.props.showTemplate) {
      // templateEditHistory can be null in later code;
      // all local state values set in constructor already
      // !!!!! IMPORTATNT: When refreshing localStorageHistory, comment out below getLocalHistory
      // gotohistory
      templateEditHistory = getLocalHistory();
      // If there is templateEditHistory object, create elements with temporary ids (ie id: '1a')
      // calculate highestElementId for templateElementCount (for numbering element temporary ids)
      if (templateEditHistory && templateEditHistory.elements) {
        let highestElementId = 0;
        let highestTranslationElementId = 0;
        _.each(Object.keys(templateEditHistory.elements), eachElementKey => {
          // get the highest id to avoid duplicate element id after templateElements repopulated
          if (!templateEditHistory.elements[eachElementKey].translation_element) {
            highestElementId = highestElementId > parseInt(eachElementKey, 10) ? highestElementId : parseInt(eachElementKey, 10)
          } else {
            highestTranslationElementId = highestTranslationElementId > parseInt(eachElementKey, 10) ? highestTranslationElementId : parseInt(eachElementKey, 10);
          }
          this.props.createDocumentElementLocally(templateEditHistory.elements[eachElementKey]);
        }); // end of each elements
        this.setState({
          templateElementCount: highestElementId,
          translationElementCount: highestTranslationElementId,
          unsavedTemplateElements: templateEditHistory.elements
        }, () => {
          console.log('in create_edit_document, componentDidMount, getLocalHistory, right before populateTemplateElementsLocally, this.state.templateElementCount', this.state.templateElementCount);
        });
      }

      console.log('in create_edit_document, componentDidMount, getLocalHistory, right before populateTemplateElementsLocally, this.props.agreement.document_fields', this.props.agreement.document_fields);
      // If there are elements persisted in backend DB, populate this.props.templateElements
      if (this.props.agreement.document_fields.length > 0) {
        this.props.populateTemplateElementsLocally(this.props.agreement.document_fields, () => {}, templateEditHistory);
      }
    }

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
      // if showing a saved document (props set in booking_confirmation.js)
      const mainDocumentInsert = this.getMainDocumentInsert(this.props.documentInsertsAll[0]);
      let mainInsertFieldsObject = {};
      // if mainInsertFieldsObject is empty; ie user has not created a main agreement and insert fields
      _.isEmpty(mainInsertFieldsObject) ? (mainInsertFieldsObject = DefaultMainInsertFieldsObject) : mainInsertFieldsObject;
      // console.log('in create_edit_document, componentDidMount, mainInsertFieldsObject, mainDocumentInsert', mainInsertFieldsObject, mainDocumentInsert);
      if (this.props.showSavedDocument) {
        // get values of each agreement document field
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
            mainInsertFieldsObject
          };
          const countMainDocumentInserts = this.countMainDocumentInserts(this.props.agreement);
          if (countMainDocumentInserts > 0) {
            this.setState({ useMainDocumentInsert: true }, () => {
            });
          }
        } else { // else for if showOwnUploadedDocument
          this.setState({ showDocumentPdf: true }, () => {
          });
        }
      } else { // if this.props.showSavedDocument
        // if not save document ie creating new document, call method to assign initialValues
        initialValuesObject = Documents[documentKey].method({ flat, booking, userOwner, tenant, appLanguageCode, documentFields, assignments, contracts, documentLanguageCode, documentKey, contractorTranslations, staffTranslations, mainInsertFieldsObject });
      }
      this.props.setInitialValuesObject(initialValuesObject);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.bookingData && Object.keys(prevProps.templateElements).length !== Object.keys(this.props.templateElements).length) {
      // this.props.setInitialValuesObject(initialValuesObject);
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
        staffTranslations,
        templateElements,
        agreement,
        templateMappingObjects,
        documentConstants
      } = this.props;
      const mainInsertFieldsObject = null;
      let templateElementsSubset = {};
      if (_.isEmpty(prevProps.templateElements)) {
        templateElementsSubset = templateElements;
      } else {
        // Find any new elements in templateElements that are not in prevProps
        // and put them in templateElementsSubset
        _.each(Object.keys(templateElements), eachId => {
          if (Object.keys(prevProps.templateElements).indexOf(eachId) === -1) templateElementsSubset[eachId] = templateElements[eachId];
        });
        if (_.isEmpty(templateElementsSubset)) templateElementsSubset = templateElements;
      }
      const allObject = this.props.allDocumentObjects[Documents[this.props.agreement.template_file_name].propsAllKey]
      // const initialValuesObject = Documents[this.props.agreement.template_file_name].templateMethod({ flat, booking, userOwner, tenant, appLanguageCode, documentFields: templateElementsSubset, assignments, contracts, documentLanguageCode, documentKey, contractorTranslations, staffTranslations, mainInsertFieldsObject, template: true, allObject, agreement, templateMappingObjects });
      // Get date object at the beginning to run once instead of running on each field
      const bookingDatesObject = getBookingDateObject(booking);
      const initialValuesObject = Documents[this.props.agreement.template_file_name].templateMethod({ flat, booking, userOwner, tenant, appLanguageCode, documentFields: allObject, templateTranslationElements: this.props.templateTranslationElements, documentTranslationsAllInOne: this.props.documentTranslationsAllInOne, assignments, contracts, documentLanguageCode, documentKey, contractorTranslations, staffTranslations, mainInsertFieldsObject, template: true, allObject, agreement, templateMappingObjects, documentConstants, bookingDatesObject });
      console.log('in create_edit_document, componentDidUpdate, prevProps.templateElements, this.props.templateElements, initialValuesObject, this.props.agreement.template_file_name: ', prevProps.templateElements, this.props.templateElements, initialValuesObject, this.props.agreement.template_file_name);
      this.props.setInitialValuesObject(initialValuesObject);
    } // end of if bookingData
  }

  componentWillUnmount() {
    // Housekeeping for when component unmounts
    document.removeEventListener('click', this.getMousePosition);
    document.removeEventListener('click', this.handleFontControlCloseClick);
    // this.setLocalStorageHistory('componentWillUnmount');

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
      modifiedPersistedTranslationElementsObject: {},
      templateEditHistoryArray: [],
      historyIndex: 0,
      unsavedTemplateElements: {}
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

    const object = {
      templateElements: { modifiedObject: this.state.modifiedPersistedElementsObject },
      templateTranslationElements: { modifiedObject: this.state.modifiedPersistedTranslationElementsObject }
    }

    console.log('in create_edit_document, handleTemplateFormSubmit, data, submitAction: ', data, submitAction);
    _.each(Object.keys(object), eachElementTypeKey => {
      _.each(Object.keys(object[eachElementTypeKey].modifiedObject), eachKey => {
        let documentField = null;
        console.log('in create_edit_document, handleTemplateFormSubmit, eachKey, object[eachElementTypeKey].modifiedObject[eachKey]: ', eachKey, object[eachElementTypeKey].modifiedObject[eachKey]);
        // if elements have ids with 'a' or 'b' and are deleted in the modified object
        if (object[eachElementTypeKey].modifiedObject[eachKey].deleted === true && eachKey.indexOf('a') === -1 && eachKey.indexOf('b') === -1) {
          deletedDocumentFieldIdArray.push(parseInt(eachKey, 10));
        } else {
          // if not deleted === true, its been modified or newly created
          // eachElementTypeKey is this.props[templateElements] or templateTranslationElements
          documentField = this.props[eachElementTypeKey][eachKey];
        }

        if (documentField) {
          // const value = data[documentField.name];
          let array = null;
          let arrayTranslation = null;

          documentField.value = data[documentField.name];
          if (documentField.document_field_choices) {
            array = [];
            const selectArray = [];
            _.each(Object.keys(documentField.document_field_choices), each => {
              console.log('in create_edit_document, handleTemplateFormSubmit, documentField.document_field_choices, each, documentField.document_field_choices[each]: ', documentField.document_field_choices, each, documentField.document_field_choices[each]);
              if (documentField.document_field_choices[each].selectChoices || documentField.document_field_choices[each].select_choices) {
                const selectChoices = documentField.document_field_choices[each].selectChoices || documentField.document_field_choices[each].select_choices;
                _.each(Object.keys(selectChoices), eachSelect => {
                  if (eachSelect < 10) selectArray.push(selectChoices[eachSelect])
                });
                documentField.document_field_choices[each].select_choices_attributes = selectArray;
              } // end of if (documentField.document_field_choices[each].
              array.push(documentField.document_field_choices[each]);
            }); // end of _.each(Object.keys(documentField.document_field_choices)
            // documentField.document_field_choices = null;
          } // end of if (documentField.document_field_choices)

          if (documentField.document_field_translations) {
            arrayTranslation = [];
            _.each(Object.keys(documentField.document_field_translations), eachLanguageCodeKey => {
              arrayTranslation.push(documentField.document_field_translations[eachLanguageCodeKey]);
            });
          }

          documentField.document_field_choices_attributes = array;
          documentField.document_field_translations_attributes = arrayTranslation;
          documentFieldArray.push(documentField);
        } // end of if (documentField) {
      }); // end of _.each(Object.keys(object[eachElementTypeKey].modifiedObject
    }); // end of _.each(Object.keys(object), eachElementTypeKey => {

    console.log('in create_edit_document, handleTemplateFormSubmit, paramsObject: ', paramsObject);
    // this.props.saveTemplateDocumentFields(paramsObject, () => this.handleTemplateSubmitCallback());
    // this.props.showLoading();
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
                const selectChoices = choice.selectChoices || choice.select_choices;
                const selectChoice = this.getSelectChoice(selectChoices, data[key]);
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
                const selectChoices = choice.selectChoices || choice.select_choices;
                const selectChoice = this.getSelectChoice(selectChoices, dataRefined);
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
              const selectChoices = choice.selectChoices || choice.select_choices;
              const selectChoice = this.getSelectChoice(selectChoices, dataRefined);
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
    // const pageIndex = elementVal - 1;
    // get x and y positions in PX of cursor in browser view port (not page or parent)
    if (clickedElement.id === 'document-background') {
      const clientX = event.clientX;
      const clientY = event.clientY;
      // get dimensions top, bottom, left and right of parent in view port (each template document page)
      const parentRect = event.target.getBoundingClientRect()
      // Get x and y PERCENTAGES (xx.xx%) inside the parent (template document pages)
      const x = ((clientX - parentRect.left) / (parentRect.right - parentRect.left)) * 100;
      const y = ((clientY - parentRect.top) / (parentRect.bottom - parentRect.top)) * 100
      // Set state with count of elements and new element in app state in state.templateElements
      // const templateElementCount = this.state.templateElementCount;
      this.setState({
        templateElementCount: this.state.templateElementCount + 1,
        translationElementCount: this.state.translationElementCount + 1,
        // createNewTemplateElementOn: false,
      }, () => {
        let templateElementAttributes = {};
        // Assign templateElementAttributes from state and specify left, top, page
          const id = !this.state.translationModeOn ? `${this.state.templateElementCount}a` : `${this.state.translationElementCount}b`
          templateElementAttributes = { ...this.state.templateElementAttributes, left: `${x}%`, top: `${y}%`, page: parseInt(elementVal, 10), id };
          // add action element action before putting in array before setState
          this.props.createDocumentElementLocally(templateElementAttributes);
          // IMPORTANT: If the new element does not have document_field_choices, call setTemplateHistoryArray here;
          // If it has document_field_choices, history is set after coordinates for document_field_choices is set
          // in dragElement closeDragElement function and subsequent callback. getChoiceCoordinates is called in documentChoicesTemplate componentDidMount;
          // If it is a newElement, it calls dragElement function and sets the coordinates of the documentFieldChoices
        // } else {
          // templateElementAttributes = { ...this.state.templateElementAttributes, left: `${x}%`, top: `${y}%`, page: parseInt(elementVal, 10), id: `${this.state.translationElementCount}b` };
          console.log('in create_edit_document, getMousePosition1, templateElementAttributes', templateElementAttributes);
        // }
        if (!templateElementAttributes.document_field_choices) this.setTemplateHistoryArray([templateElementAttributes], 'create');
        // remove listener
        document.removeEventListener('click', this.getMousePosition);
        this.setState({
          templateElementAttributes: null,
          templateElementActionIdObject: { ...INITIAL_TEMPLATE_ELEMENT_ACTION_ID_OBJECT, array: [] },
         });
      });
    }
  }

  getChoiceCoordinates(props) {
    // After template element is created and rendered, getChoiceCoordinates is called
    // in componentDidMount of document_choices_template.js
    // id of template element newly created
    const id = props.id;
    // Flag to be passed to dragChoice
    const fromDocumentChoices = props.fromDocumentChoices;
    // Get the element being dragged directly
    const element = document.getElementById(`template-element-${id}`);
    const templateElement = this.props.templateElements[id];
    const backgroundDimensions = element.parentElement.getBoundingClientRect();
    // Get the dimensions of the parent element
    const parentRect = element.parentElement.getBoundingClientRect()
    // define callback to be called in dragElement closeDragElement
    // call dragElement and pass in the dragged element, the parent dimensions,
    // and the action to update the element in app state
    const actionCallback = (updatedElementsArray) => {
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setTemplateHistoryArray(updatedElementsArray, 'create');
    };
    // last true is for move or not; in this case this is for move element
    this.dragElement({ element, tabs: null, inputElements: null, parentRect, actionCallback, move: true, elementType: null, selectedElements: [], backgroundDimensions, templateElements: this.props.templateElements, fromDocumentChoices, templateElement });
  }

  handleTemplateElementCheckClick(event) {
    // when user clicks on each template check icon
    const clickedElement = event.target;
    // elementVal is id or id of template element
    const elementVal = clickedElement.getAttribute('value')
    console.log('in create_edit_document, handleTemplateElementCheckClick, event.target, ', event.target);
    // console.log('in create_edit_document, handleTemplateElementCheckClick, elementVal, ', elementVal);
    // when element has not been checked
    if (this.state.selectedTemplateElementIdArray.indexOf(elementVal) === -1) {
      // place in array of checked elements
      this.setState({
        // Push id into array in string type so as to enable temporary id with '1a' char in it
        selectedTemplateElementIdArray: [...this.state.selectedTemplateElementIdArray, elementVal],
        selectedChoiceIdArray: [], // deselect any choice buttons if element selected
        newFontObject: { ...this.state.newFontObject, override: false }
      }, () => {
        // Get the font attributes of selected elements to show on the control box font button
        this.getSelectedFontElementAttributes();
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
          // Get the font attributes of selected elements to show on the control box font button
          this.getSelectedFontElementAttributes();
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

  dragElement(dragProps) {
    const { element, tabs, inputElements, parentRect, actionCallback, move, elementType, selectedElements, backgroundDimensions, templateElements, fromDocumentChoices, templateElement, translationModeOn } = dragProps;
    // pos1 and 2 are for getting delta of pointer position;
    // pos3 and 4 are for getting updated mouse position
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    // Get the original values of each element selected for use in history array
    const originalValueObject = {};
    // ids looke like 'template-element-input-id' and 'template-translation-element-input-id'
    let eachElementId = !translationModeOn ? element.id.split('-')[2] : element.id.split('-')[3]
    // Use input elements and not selectedElements since input element dimensions
    // drive the size of the wrapper and the tabs
    if (inputElements) {
      console.log('in create_edit_document, dragElement, inputElements, ', inputElements);
      // if inputElements exists then must be resize drag
      _.each(inputElements, eachElement => {
        const inputElementDimensions = eachElement.getBoundingClientRect();
        // ids looke like 'template-element-input-id' and 'template-translation-element-input-id'
        eachElementId = !translationModeOn ? eachElement.id.split('-')[3] : eachElement.id.split('-')[4]
        // originalValueObject[eachElement.id.split('-')[3]] = {
        originalValueObject[eachElementId] = {
          top: inputElementDimensions.top,
          left: inputElementDimensions.left,
          width: inputElementDimensions.width,
          height: inputElementDimensions.height
        };
      });
    } else if (selectedElements.length > 0) {
      // if inputElement is null and selectedElements is populated,
      // must be a multiple element move vs resize
      // ids looke like 'template-element-id' and 'template-translation-element-id'
      _.each(selectedElements, eachElement => {
        eachElementId = !translationModeOn ? eachElement.id.split('-')[2] : eachElement.id.split('-')[3];
        // originalValueObject[eachElement.id.split('-')[2]] = {
        originalValueObject[eachElementId] = {
          top: eachElement.style.top,
          left: eachElement.style.left,
          width: eachElement.style.width,
          height: eachElement.style.height
        };
      });
    } else {
      // if even selectedElements is empty, must be a single eleemnt drag move not resize
      // ids looke like 'template-element-id' and 'template-translation-element-input-id'
      // eachElementId assigned at top
      originalValueObject[eachElementId] = {
        top: element.style.top,
        left: element.style.left,
        width: element.style.width,
        height: element.style.height
      };
    }
    console.log('in create_edit_document, dragElement, element, inputElements, selectedElements, originalValueObject, ', element, inputElements, selectedElements, originalValueObject);

    // CAll main function
    dragMouseDown();

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      // assign close and drag callbacks to native handlers
      if (!fromDocumentChoices) {
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      } else {
        closeDragElement();
      }
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

      let eachElementId = null;
      let deltaX = 0;
      let deltaY = 0;
      let choiceElement = null;
      let wrapperDiv = null;
      let wrapperDivDimensions = null;

      console.log('in create_edit_document, dragElement, closeDragElement, in each, pos3, pos4, deltaX, deltaY, originalValueObject, ', pos3, pos4, deltaX, deltaY, originalValueObject);

      // Object to be sent to reducer in array below
      let updatedElementObject = null;
      const array = [];
      // If no elements selected, use the one element dragged in array
      const interatedElements = selectedElements.length > 0 ? selectedElements : [element];

      if (move) {
        // id is the index 2 (third element) in split array
        // the wrapper div top and left are same as input element top and left
        _.each(interatedElements, (eachElement, i) => {
          eachElementId = !translationModeOn ? eachElement.id.split('-')[2] : eachElement.id.split('-')[3];

          if (templateElements[eachElementId].document_field_choices) {
            // get change in x and y from the actual DOM elements moved by drag
            if (i === 0) {
              deltaX = ((parseFloat(interatedElements[0].style.left) / 100) * backgroundDimensions.width) - ((parseFloat(originalValueObject[eachElementId].left) / 100) * backgroundDimensions.width);
              deltaY = ((parseFloat(interatedElements[0].style.top) / 100) * backgroundDimensions.height) - ((parseFloat(originalValueObject[eachElementId].top) / 100) * backgroundDimensions.height);
            }
            // Get the element stored in app state this.props.templateElements
            // elementInState = templateElements[eachElementId];
            // // Get each choice in the dragged element into an array
            // _.each(Object.keys(elementInState.document_field_choices), eachChoiceIdx => {
            //   choiceElement = document.getElementById(`template-element-button-${eachElementId},${eachChoiceIdx}`);
            //   choiceElementsArray.push(choiceElement);
            // })
            choiceElement = document.getElementById(`template-element-button-${eachElementId},${0}`);
            // Get the wrapper div of the choice
            wrapperDiv = choiceElement.parentElement.parentElement.parentElement;
            // wrapperDivDimensions is the original wrapper dimensions, not after drag
            // Original wrapperDivDimensions based on originalValueObject
            wrapperDivDimensions = {
              top: ((parseFloat(originalValueObject[eachElementId].top) / 100) * backgroundDimensions.height) + backgroundDimensions.top,
              left: ((parseFloat(originalValueObject[eachElementId].left) / 100) * backgroundDimensions.width) + backgroundDimensions.left,
              width: ((parseFloat(originalValueObject[eachElementId].width) / 100) * backgroundDimensions.width),
              height: ((parseFloat(originalValueObject[eachElementId].height) / 100) * backgroundDimensions.height)
            }
            updatedElementObject = getUpdatedElementObjectMoveWrapper({ wrapperDiv, originalWrapperDivDimensions: wrapperDivDimensions, eachElementId, templateElements, elementDrag: true, tabHeight: TAB_HEIGHT, delta: { x: deltaX, y: deltaY } });
            // If dragElement called from DocumentChoices, means just populating coordinates of document_field_choices
            if (fromDocumentChoices) {
              // Get values updatedElementObject values from this.props.templateElements,
              // then fill in updatates, and take out old 'o_' attributes
              updatedElementObject = { ...templateElement,
                document_field_choices: updatedElementObject.document_field_choices,
                width: updatedElementObject.width,
                height: updatedElementObject.height,
              };
              updatedElementObject.action = 'create';
              delete updatedElementObject.o_width;
              delete updatedElementObject.o_height;
              delete updatedElementObject.o_top;
              delete updatedElementObject.o_left;
              delete updatedElementObject.o_document_field_choices;
            }
            console.log('in create_edit_document, dragElement, closeDragElement, in each, eachElementId, interatedElements, originalValueObject, array, ', eachElementId, interatedElements, originalValueObject, array);
          } else { // else of if (templateElements[elementId].document_field_choices

            updatedElementObject = {
              // !!!!NOTE: Need to keep id as string so can check in backend if id includes "a"
              id: eachElementId, // get the id part of template-element-[id]
              left: eachElement.style.left,
              top: eachElement.style.top,
              translation_element: templateElement.translation_element,
              o_left: originalValueObject[eachElementId].left,
              o_top: originalValueObject[eachElementId].top,
              action: 'update'
            };
          }  // end of if (templateElements[elementId].document_field_choices
            array.push(updatedElementObject);
          // place in array to be processed in action and reducer
        }); //  end of  _.each(interatedElements
      } else { // else of if move
        // if not move (resize) send object to update
        // take out TAB_HEIGHT so that TAB_HEIGHT is not added again
        // to adjust input element height and avoid wrapping div height at render
        // the actual size of the input element to be updated in app state
        let inputElement = null;
        let inputElementDimensions = null;

        _.each(interatedElements, eachElement => {
          // when translationModeOn, elementId is in index 3
          eachElementId = !translationModeOn ? eachElement.id.split('-')[2] : eachElement.id.split('-')[3]
          console.log('in create_edit_document, dragElement, closeDragElement, eachElement, inputElements, originalValueObject, ', eachElement, inputElements, originalValueObject);

          !translationModeOn
          ?
          inputElement = inputElements.filter(each => eachElementId == each.id.split('-')[3])
          // inputElement = inputElements.filter(each => eachElement.id.split('-')[2] == each.id.split('-')[3])
          :
          inputElement = inputElements.filter(each => eachElementId == each.id.split('-')[4]);
          // inputElement = inputElements.filter(each => eachElement.id.split('-')[3] == each.id.split('-')[4]);

          inputElementDimensions = inputElement[0].getBoundingClientRect()
          // if (!templateElements[elementId].document_field_choices) {
            // oWidth and oHeight for original values for use in history
            updatedElementObject = {
              // !!!!NOTE: Need to keep id as string so can check in backend if id includes "a"
              id: eachElementId, // get the id part of template-element-[id]
              width: `${(inputElementDimensions.width / parentRect.width) * 100}%`,
              height: `${(inputElementDimensions.height / parentRect.height) * 100}%`,
              translation_element: templateElement.translation_element,
              o_width: `${(originalValueObject[eachElementId].width / parentRect.width) * 100}%`,
              o_height: `${(originalValueObject[eachElementId].height / parentRect.height) * 100}%`,
              action: 'update',
            };
            // console.log('in create_edit_document, dragElement, closeDragElement, in each eachElement, inputElements, originalValueObject, ', eachElement, inputElements, originalValueObject);
            // place in array to be processed in action and reducer
            array.push(updatedElementObject);
          // }
        });
      } // end of else
      // console.log('in create_edit_document, dragElement, closeDragElement, array, ', array);
      // Callback defined in resize and move handlers
      console.log('in create_edit_document, dragElement, closeDragElement, before callback, array, ', array);
      actionCallback(array);
    }
  }

dragChoice(props) {
  const { choiceButton, choiceId, choiceIndex, otherChoicesArray, wrapperDiv, choiceButtonDimensions, wrapperDivDimensions, backgroundDimensions, tab, templateElements, actionCallback } = props;
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
    const otherChoicesObject = getOtherChoicesObject({ wrapperDiv, otherChoicesArray, templateElements, backgroundDimensions, wrapperDivDimensions, dragChoice: true });
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
    // gotodrag
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
      // console.log('in create_edit_document, dragChoice, closeDragElement, document.onmouseup, document.onmousemove: ',  document.onmouseup, document.onmousemove);
      console.log('in create_edit_document, dragChoice, closeDragElement, choiceButton, otherChoicesObject: ', choiceButton, otherChoicesObject);
      // Get all elements in array
      if (choiceMoved) {
        const iteratedElements = [...otherChoicesArray, choiceButton];
        const elementId = choiceButton.getAttribute('value').split(',')[0];

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
        // Callback for updating state and writing history
        actionCallback([updatedElementObject]);
      }
    } // end of if choiceMoved
}

longActionPress(props) {
  // longActionPress enable user to press mouse down and increase/decrease width and height
  // When user mouses up, the coordinates are set in app state
  const { action, choicesArray, templateElements, choicesOriginalObject, selectedChoiceIdArray, actionCallback } = props;

  console.log('in create_edit_document, longActionPress action, choicesArray, templateElements, ', action, choicesArray, templateElements);
  let timer = null;
  let increment = 1;
  let totalIncremented = 0;
  let wrapperDiv = null;
  let wrapperDivDimensions = null;
  let eachModifiedChoice = null;
  let count = 0;
  let currentWidthInPx = 0;
  let currentHeightInPx = 0;

  // background is before the choice wrapper, the inner Divwrapper, outer DivWrapper (4 levels up)
  const backgroundDimensions = choicesArray[0].parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
  let eachChoice = null;

  // CAll main function
  dragMouseDown();

  function dragMouseDown() {
    // assign close and drag callbacks to native handlers
    document.onmouseup = closeLongActionPress;
    // SetInterval to call elementChange every x milliseconds
    // timer is an integer ID for use in clearing interval
    timer = setInterval(elementChange, 100);
  }

  function elementChange() {
    count++;
    // As user presses longer, the increments increase
    if (count > 5 && (action === 'expandHorizontal' || action === 'contractHorizontal')) increment *= 1.05;
    if (count > 10 && (action === 'expandHorizontal' || action === 'contractHorizontal')) increment *= 1.075;
    totalIncremented += increment;

    _.each(Object.keys(choicesOriginalObject), eachKey => {
      eachChoice = choicesOriginalObject[eachKey].choice;

      eachModifiedChoice = eachChoice;
      wrapperDiv = eachChoice.parentElement.parentElement.parentElement;
      wrapperDivDimensions = wrapperDiv.getBoundingClientRect();
      currentWidthInPx = ((parseFloat(eachChoice.style.width) / 100) * wrapperDivDimensions.width);
      currentHeightInPx = ((parseFloat(eachChoice.style.height) / 100) * (wrapperDivDimensions.height - TAB_HEIGHT));

      if (action === 'expandHorizontal') eachModifiedChoice.style.width = `${((currentWidthInPx + increment) / wrapperDivDimensions.width) * 100}%`
      if (action === 'contractHorizontal') eachModifiedChoice.style.width = `${((currentWidthInPx - increment) / wrapperDivDimensions.width) * 100}%`
      if (action === 'expandVertical') eachModifiedChoice.style.height = `${((currentHeightInPx + increment) / (wrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`
      if (action === 'contractVertical') eachModifiedChoice.style.height = `${((currentHeightInPx - increment) / (wrapperDivDimensions.height - TAB_HEIGHT)) * 100}%`
    });
  }

  function closeLongActionPress() {
    // stop changing choice elements when button is released:
    document.onmouseup = null;
    // Sends timer ID (integer) to clearInterval
    clearInterval(timer);
    // getUpdatedElementObjectNoBase gets new wrapper div attributes,
    // and new choice element attributes to send to action creator and reducer
    const array = getUpdatedElementObjectNoBase({ selectedChoiceIdArray, choicesArray, tabHeight: TAB_HEIGHT, templateElements, longActionPress: true, action });
    console.log('in create_edit_document, longActionPress, closeLongActionPress, choicesArray, array, totalIncremented ', choicesArray, array, totalIncremented);
    // !!!!! IMPORTANT: Somehow, each choice in the DOM needs to be reset to
    // its original % style.width and height, or when rerender from values
    // in app state, the same DOM choice width and height values become
    // inaccurate and become much larger. Resetting back after changing works.
    _.each(Object.keys(choicesOriginalObject), eachKey => {
      choicesOriginalObject[eachKey].choice.style.width = choicesOriginalObject[eachKey].width;
      choicesOriginalObject[eachKey].choice.style.height = choicesOriginalObject[eachKey].height;
    });
    // Call action creator and setTemplateHistoryArray in callback
    actionCallback(array);
  }
}

  // Gets the actual elements (not just ids) of selected elements in handlers resize and mvoe
  getSelectedActualElements(elementIdString, ids, resize) {
    const array = [];
    const templateElements = !this.state.translationModeOn ? this.props.templateElements : this.props.templateTranslationElements;

    _.each(ids, id => {
      if (resize) {
        if (!templateElements[id].document_field_choices) {
          array.push(document.getElementById(`${elementIdString}${id}`));
        }
      } else {
        array.push(document.getElementById(`${elementIdString}${id}`));
      }
    });
    console.log('in create_edit_document, getSelectedActualElements, elementIdString, ids, resize, array, ', elementIdString, ids, resize, array);
    return array;
  }

  handleTemplateElementMoveClick(event) {
    // For dragging and moving template elements; Use with dragElement function
    let selectedElements = [];
    const clickedElement = event.target;
    const fromDocumentChoices = event.fromDocumentChoices;
    // elementVal is id or id of template element
    const elementVal = clickedElement.getAttribute('value');
    // Get the element being dragged directly
    // if translationModeOn not on, get template-element-id, otherwise, get template-translation-element
    const idName = !this.state.translationModeOn ? 'template-element' : 'template-translation-element'
    const element = document.getElementById(`${idName}-${elementVal}`);
    const backgroundDimensions = element.parentElement.getBoundingClientRect();
    // Get the dimensions of the parent element
    const parentRect = element.parentElement.getBoundingClientRect()
    // define callback to be called in dragElement closeDragElement
    // Get array of elements selected or checked by user
    selectedElements = this.getSelectedActualElements(`${idName}-`, this.state.selectedTemplateElementIdArray, false)
    // call dragElement and pass in the dragged element, the parent dimensions,
    // and the action to update the element in app state
    // const action = fromDocumentChoices ? 'create' : 'update'
    const actionCallback = (updatedElementsArray) => {
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setTemplateHistoryArray(updatedElementsArray, 'update');
    };
    // last true is for move or not; in this case this is for move element
    this.dragElement({
      element,
      tabs: null,
      inputElements: null,
      parentRect,
      actionCallback,
      move: true,
      elementType: null,
      selectedElements,
      backgroundDimensions,
      templateElements: !this.state.translationModeOn ? this.props.templateElements : this.props.templateTranslationElements,
      templateElement: !this.state.translationModeOn ? this.props.templateElements[elementVal] : this.props.templateTranslationElements[elementVal],
      fromDocumentChoices,
      translationModeOn: this.state.translationModeOn
    });
  }
  // gotomove

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
    const idName = !this.state.translationModeOn ? 'template-element' : 'template-translation-element'
    const element = document.getElementById(`${idName}-${elementVal}`);
    // Get the actual input elements so they can be resized directly
    if (this.state.selectedTemplateElementIdArray.length > 0) {
      // If multiple elements selected, get array of multiple input elements
      inputElements = this.getSelectedActualElements(`${idName}-input-`, this.state.selectedTemplateElementIdArray, true)
      // Get array of tabs attached to elements so marginLeft can be set dynamically
      tabs = this.getSelectedActualElements(`${idName}-tab-`, this.state.selectedTemplateElementIdArray, true)
    } else {
      // If no other elements are selected, just put the one element into an array
      inputElements = [document.getElementById(`${idName}-input-${elementVal}`)];
      // Place the one tab into an array
      tabs = [document.getElementById(`${idName}-tab-${elementVal}`)];
    }
    // Gets the dimensions of the parent element (document background)
    const parentRect = element.parentElement.getBoundingClientRect()
    selectedElements = this.getSelectedActualElements(`${idName}-`, this.state.selectedTemplateElementIdArray, true)
    // Callback for the action to update element array, and to update history array and historyIndex
    const actionCallback = (updatedElementsArray) => {
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setTemplateHistoryArray(updatedElementsArray, 'update');
    };
    // Call drag element
    this.dragElement({
      element,
      tabs,
      inputElements,
      parentRect,
      actionCallback,
      move: false,
      elementType,
      selectedElements,
      backgroundDimensions: null,
      templateElements: !this.state.translationModeOn ? this.props.templateElements : this.props.templateTranslationElements,
      templateElement: !this.state.translationModeOn ? this.props.templateElements[elementVal] : this.props.templateTranslationElements[elementVal],
      translationModeOn: this.state.translationModeOn
    });
  }

  handleButtonTemplateElementClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value')
    const elementId = elementVal.split(',')[0];
    const choiceIndex = elementVal.split(',')[1];

    if (this.state.selectedChoiceIdArray.indexOf(`${elementId}-${choiceIndex}`) === -1) {
      this.setState({
        selectedChoiceIdArray: [...this.state.selectedChoiceIdArray, `${elementId}-${choiceIndex}`],
        selectedTemplateElementIdArray: []
      }, () => {
        // console.log('in create_edit_document, handleButtonTemplateElementClick, this.state.selectedChoiceIdArray: ', this.state.selectedChoiceIdArray);
      });
    } else {
      const newArray = [...this.state.selectedChoiceIdArray];
      const index = newArray.indexOf(`${elementId}-${choiceIndex}`);
      newArray.splice(index, 1);
      this.setState({ selectedChoiceIdArray: newArray }, () => {
        // console.log('in create_edit_document, handleButtonTemplateElementClick, this.state.selectedChoiceIdArray: ', this.state.selectedChoiceIdArray);
      });
    }
  }

  handleButtonTemplateElementMove(event) {
    const clickedElement = event.target;
    // const elementName = clickedElement.getAttribute('name')
    const elementVal = clickedElement.getAttribute('value')
    const choiceId = elementVal.split(',')[0];
    const choiceIndex = parseInt(elementVal.split(',')[1], 10);
    const choiceButton = document.getElementById(`template-element-button-${choiceId},${choiceIndex}`);
    const wrapperDiv = choiceButton.parentElement.parentElement.parentElement;
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
    // Get choices that have not been selected into an array
    _.times(Object.keys(documentFieldChoices).length, (i) => {
      if (i !== parseInt(choiceIndex, 10)) {
        button = document.getElementById(`template-element-button-${choiceId},${i}`);
        otherChoicesArray.push(button);
      }
    });
    // Callback to be called at the end of move
    const actionCallback = (updatedElementsArray) => {
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setTemplateHistoryArray(updatedElementsArray, 'update');
    };

    console.log('in create_edit_document, handleButtonTemplateElementMove, choiceButton, choiceButtonDimensions, wrapperDiv, wrapperDivDimensions, otherChoicesArray: ', choiceButton, choiceButtonDimensions, wrapperDiv, wrapperDivDimensions, otherChoicesArray);
    this.dragChoice({ choiceButton, choiceId, choiceIndex, otherChoicesArray, wrapperDiv, choiceButtonDimensions, wrapperDivDimensions, backgroundDimensions, tab, templateElements: this.props.templateElements, actionCallback });
  }

  handleTemplateChoiceActionMouseDown(event) {
    const clickedElement = event.target;
    // elementVal is expandHorizontal, contractHorizontal etc
    const elementVal = clickedElement.getAttribute('value')
    let button = null;
    let eachElementId = null;
    let eachChoiceId = null;
    const choicesArray = [];
    const choicesOriginalObject = {}
    _.each(this.state.selectedChoiceIdArray, each => {
      eachElementId = each.split('-')[0];
      eachChoiceId = each.split('-')[1];
      button = document.getElementById(`template-element-button-${eachElementId},${eachChoiceId}`);
      console.log('in create_edit_document, handleTemplateChoiceActionMouseDown, button: ', button);
      choicesArray.push(button);
      choicesOriginalObject[each] = { eachElementId, eachChoiceId, choice: button, choiceDimensions: button.getBoundingClientRect(), width: button.style.width, height: button.style.height };
    });
    const actionCallback = (updatedElementsArray) => {
      console.log('in create_edit_document, handleTemplateChoiceActionMouseDown, updatedElementsArray, ', updatedElementsArray);
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setTemplateHistoryArray(updatedElementsArray, 'update');
    };

    this.longActionPress({ action: elementVal, choicesArray, templateElements: this.props.templateElements, choicesOriginalObject, selectedChoiceIdArray: this.state.selectedChoiceIdArray, actionCallback });
  }

  renderTab(eachElement, selected, tabLeftMarginPx, inputElement) {
    const tabWidth = inputElement ? TAB_WIDTH : 55;
    const modTabLeftMarginPx = inputElement ? tabLeftMarginPx : tabLeftMarginPx - 6;
    const className = !this.state.translationModeOn ? 'template-element' : 'template-translation-element'
    return (
      <div
        id={`${className}-tab-${eachElement.id}`}
        className="create-edit-document-template-element-edit-tab"
        style={{ height: `${TAB_HEIGHT}px`, width: `${tabWidth}px`, marginLeft: `${modTabLeftMarginPx}px` }}
      >
        <i
          key={1}
          value={eachElement.id}
          className="fas fa-check-circle"
          style={{ lineHeight: '1.5', color: selected ? '#fb4f14' : 'gray' }}
          onClick={this.handleTemplateElementCheckClick}
        >
        </i>
        <i
          key={2}
          value={eachElement.id}
          className="fas fa-truck-moving"
          style={{ lineHeight: '1.5', color: 'gray' }}
          onMouseDown={this.handleTemplateElementMoveClick}
        >
        </i>
        {inputElement
          ?
          <i
            key={3}
            type={eachElement.input_type}
            value={eachElement.id}
            className="fas fa-expand-arrows-alt" style={{ lineHeight: '1.5', color: 'gray' }}
            onMouseDown={this.handleTemplateElementChangeSizeClick}
          >
        </i> : null}
      </div>
    );
  }

  renderTemplateTranslationElements(page) {
    const { documentLanguageCode, appLanguageCode, agreement, documentTranslationsAllInOne } = this.props;
    const documentEmpty = _.isEmpty(this.props.templateTranslationElementsByPage);
    // const documentEmpty = this.props.agreement.document_fields.length === 0 && _.isEmpty(this.props.templateElementsByPage);
    let translationText = '';

    if (!documentEmpty) {
      return _.map(this.props.templateTranslationElementsByPage[page], eachElement => {
        translationText = this.props.valuesInForm[`${eachElement.name}+translation`] || documentTranslationsAllInOne[eachElement.name].translations[documentLanguageCode];
        if (this.state.translationModeOn && this.state.editFieldsOn) {
          const background = document.getElementById('document-background');
          if (background) {
            const selected = this.state.selectedTemplateElementIdArray.indexOf(eachElement.id) !== -1;
            const tabPercentOfContainerH = (TAB_HEIGHT / background.getBoundingClientRect().height) * 100;
            const eachElementWidthPx = background.getBoundingClientRect().width * (parseFloat(eachElement.width) / 100)
            let tabLeftMarginPx = eachElementWidthPx - TAB_WIDTH - TAB_REAR_SPACE;
            if (eachElementWidthPx < TAB_WIDTH) tabLeftMarginPx = 0;
            const label = 'Placeholder'
            const wrappingDivDocumentCreateH = parseFloat(eachElement.height) / (parseFloat(eachElement.height) + tabPercentOfContainerH);
            const wrapperDivHeight = `${parseFloat(eachElement.height) + tabPercentOfContainerH}%`;
            const innerDivPercentageOfWrapper = `${(1 - (tabPercentOfContainerH / parseFloat(wrapperDivHeight))) * 100}%`
            // console.log('in create_edit_document, renderTemplateTranslationElements, getLocalTemplateElementsByPage, eachElement, this.props.documentTranslationsAllInOne, translationText, eachElement.height, tabPercentOfContainerH, innerDivPercentageOfWrapper: ', eachElement, this.props.documentTranslationsAllInOne, translationText, eachElement.height, tabPercentOfContainerH, innerDivPercentageOfWrapper);
            return (
              <div
                key={eachElement.id}
                id={`template-translation-element-${eachElement.id}`}
                className="create-edit-document-template-element-container"
                style={{ top: eachElement.top, left: eachElement.left, width: eachElement.width, height: wrapperDivHeight }}
              >
                <Field
                  key={eachElement.name}
                  name={`${eachElement.name}+translation`}
                  component={DocumentChoicesTemplate}
                  type={eachElement.input_type}
                  className={'document-rectangle-template'}
                  props={{
                      eachElement,
                      page,
                      // required: modifiedElement.required,
                      // nullRequiredField,
                      // newElement,
                      documentLanguageCode,
                      getChoiceCoordinates: (props) => { this.getChoiceCoordinates(props); },
                      // create a templateElementsByPage with choices just for the input element
                      formFields: { [eachElement.page]: { [eachElement.id]:
                          { choices: { 0: { val: 'inputFieldValue',
                                            top: eachElement.top,
                                            left: eachElement.left,
                                            width: eachElement.width,
                                            height: eachElement.height,
                                            font_size: eachElement.font_size,
                                            font_family: eachElement.font_family,
                                            font_style: eachElement.font_style,
                                            font_weight: eachElement.font_weight,
                                            // change from input componnet use document-rectange
                                            // class_name: 'document-rectangle',
                                            class_name: eachElement.class_name,
                                            // !!! height works only with px
                                            input_type: eachElement.input_type,
                                            element_id: eachElement.id
                          } } } } },
                      charLimit: eachElement.charLimit,
                      // otherChoiceValues,
                      documentKey: this.props.documentKey,
                      editTemplate: true,
                      wrappingDivDocumentCreateH,
                      modifiedElement: eachElement,
                      elementName: eachElement.name,
                      elementId: eachElement.id,
                      editFieldsOn: this.state.editFieldsOn,
                      translationModeOn: this.state.translationModeOn,
                      setTemplateHistoryArray: (array) => { this.setTemplateHistoryArray(array, 'update'); },                      // label: modifiedElement.name,
                      label,
                      agreement: this.props.agreement,
                      selectedChoiceIdArray: [],
                      innerDivPercentageOfWrapper,
                      inputElement: true
                    }}
                  // props={{ model: }}
                  style={{}}
                  // style={{
                  //     width: '100%',
                  //     fontSize: eachElement.font_size,
                  //     fontFamily: eachElement.font_family,
                  //     fontStyle: eachElement.font_style,
                  //     fontWeight: eachElement.font_weight,
                  //     borderColor: eachElement.border_color,
                  //     margin: '0px !important',
                  //     flex: '1 1 auto'
                  //   }}
                />
                {this.renderTab(eachElement, selected, tabLeftMarginPx, true)}
              </div>
            );
          } // if background
        } else {
          // if not translationModeOn, must render a simple div
          return (
            <div
            // component: null
            id={eachElement.id}
            key={eachElement.id}
            style={{
              top: eachElement.top,
              left: eachElement.left,
              height: eachElement.height,
              width: eachElement.width,
              fontFamily: eachElement.font_family,
              fontSize: eachElement.font_size,
              fontStyle: eachElement.font_style,
              fontWeight: eachElement.font_weight
            }}
            // top: 10.5%; left: 27.5%; font-size: 12px; font-weight: bold; width: 45%; text-align: center;
            // class_name="document-rectangle-template"
            className='document-translation'
            >
            {translationText}
            </div>
          ); // End of return
        } // End of if (translationModeOn)
      }); // End of _.map
    } // if (!documentEmpty) {
  }
  // For creating new input fields
  renderTemplateElements(page) {
    const { documentLanguageCode } = this.props;
    // const documentEmpty = _.isEmpty(this.props.documents);
    const documentEmpty = this.props.agreement.document_fields.length === 0 && _.isEmpty(this.props.templateElementsByPage);
    let fieldComponent = '';
    // let noTabs = false;
    let newElement = false;
    let inputElement = true;
    let localTemplateElementsByPage = null;

    // const renderTab = (eachElement, selected, tabLeftMarginPx, inputElement) => {
    //   const tabWidth = inputElement ? TAB_WIDTH : 55;
    //   const modTabLeftMarginPx = inputElement ? tabLeftMarginPx : tabLeftMarginPx - 6;
    //   return (
    //     <div
    //       id={`template-element-tab-${eachElement.id}`}
    //       className="create-edit-document-template-element-edit-tab"
    //       style={{ height: `${TAB_HEIGHT}px`, width: `${tabWidth}px`, marginLeft: `${modTabLeftMarginPx}px` }}
    //     >
    //       <i
    //         key={1}
    //         value={eachElement.id}
    //         className="fas fa-check-circle"
    //         style={{ lineHeight: '1.5', color: selected ? '#fb4f14' : 'gray' }}
    //         onClick={this.handleTemplateElementCheckClick}
    //       >
    //       </i>
    //       <i
    //         key={2}
    //         value={eachElement.id}
    //         className="fas fa-truck-moving"
    //         style={{ lineHeight: '1.5', color: 'gray' }}
    //         onMouseDown={this.handleTemplateElementMoveClick}
    //       >
    //       </i>
    //       {inputElement
    //         ?
    //         <i
    //           key={3}
    //           type={eachElement.input_type}
    //           value={eachElement.id}
    //           className="fas fa-expand-arrows-alt" style={{ lineHeight: '1.5', color: 'gray' }}
    //           onMouseDown={this.handleTemplateElementChangeSizeClick}
    //         >
    //       </i> : null}
    //     </div>
    //   );
    // };
    // Function to get object used in document_choices_template.js to render fields
    // Looks like { 1: { 100: {element attr}, 101: { element attr } }}
    const getLocalTemplateElementsByPage = (eachElement, box, backgroundDim, marginBetween, isNew) => {
      const { document_field_choices } = eachElement;
      const object = { [eachElement.page]: { [eachElement.id]: { choices: {} } } };
      const choicesObject = object[eachElement.page][eachElement.id].choices;

      let currentTop = '0%';

      let widthInPx = null;
      let heightInPx = null;
      let topInPx = null;
      let leftInPx = null;
      // let i = 0;
      let top = 0;
      console.log('in create_edit_document, renderTemplateElements, getLocalTemplateElementsByPage, eachElement, box, backgroundDim, marginBetween, isNew: ', eachElement, box, backgroundDim, marginBetween, isNew);
        _.each(document_field_choices, (eachChoice, i) => {
          // Convert NaN to zero
          top = (currentTop / box.height) || 0;
          // NOTE: get px of dimensions from box top, left etc.
          topInPx = ((parseFloat(eachChoice.top) / 100) * backgroundDim.height) - ((box.top) * backgroundDim.height);
          leftInPx = (((parseFloat(eachChoice.left) / 100) * backgroundDim.width) - ((box.left) * backgroundDim.width));
          widthInPx = (parseFloat(eachChoice.width) / 100) * backgroundDim.width;
          heightInPx = (parseFloat(eachChoice.height) / 100) * backgroundDim.height;

          choicesObject[i] = {};
          choicesObject[i].val = eachChoice.val;

          choicesObject[i].top = isNew ? `${top * 100}%` : `${(topInPx / ((box.height) * backgroundDim.height)) * 100}%`;
          choicesObject[i].left = isNew ? '0.0%' : `${(leftInPx / ((box.width) * backgroundDim.width)) * 100}%`;
          choicesObject[i].width = isNew ? `${(parseFloat(eachChoice.width) / box.width) * 100}%` : `${(widthInPx / (box.width * backgroundDim.width)) * 100}%`;
          choicesObject[i].height = isNew ? `${(parseFloat(eachChoice.height) / box.height) * 100}%` : `${(heightInPx / (box.height * backgroundDim.height)) * 100}%`;

          choicesObject[i].class_name = eachChoice.class_name;
          choicesObject[i].border_radius = eachChoice.border_radius;
          choicesObject[i].border = eachChoice.border;
          choicesObject[i].input_type = eachChoice.input_type;
          choicesObject[i].choice_index = parseInt(i, 10);
          choicesObject[i].element_id = eachElement.id;
          choicesObject[i].name = eachElement.name;
          choicesObject[i].selectChoices = eachChoice.selectChoices || eachChoice.select_choices;

          currentTop = parseFloat(currentTop) + marginBetween + parseFloat(eachChoice.height);
        });

        console.log('in create_edit_document, renderTemplateElements, getLocalTemplateElementsByPage, object: ', object);
        return object;
    };
    // if (this.props.documentFields[page]) {
    // let count = 1;
    if (!documentEmpty) {
      // Map through each element
      let label = null;
      let translationKey = null;
      let translationText = '';
      let splitKey = null;
      let category = null;
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

        // Test if modifiedElement.name exists in the all object; list elements would not be in there (i.e. amentiies_list)
        const elementObject = this.props.allDocumentObjects[Documents[this.props.agreement.template_file_name].propsAllKey][modifiedElement.name];
        if (elementObject) {
          translationKey = elementObject.translation_key;
          translationText = elementObject.translation_object ? 'Translation' : '';
          console.log('in create_edit_document, renderTemplateElements, eachElement, elementObject, this.props.documentTranslationsAll: ', eachElement, elementObject, this.props.documentTranslationsAll);
          const documentTranslations = this.props.documentTranslationsAll[`${this.props.agreement.template_file_name}_all`][translationKey]
          // const appLanguages = AppLanguages[translationKey];
          label = (documentTranslations ? documentTranslations.translations[this.props.appLanguageCode] : '')
                  ||
                  (AppLanguages[translationKey] ? AppLanguages[translationKey][this.props.appLanguageCode] : '');
          const category = (AppLanguages[elementObject.category] ? `${AppLanguages[elementObject.category][this.props.appLanguageCode]}/` : '');
          const group = (AppLanguages[elementObject.group] ? `${AppLanguages[elementObject.group][this.props.appLanguageCode]}/` : '');
          label = group ? category + group + label + ' ' + translationText : category + label + ' ' + translationText;
          // modifiedElement.name;
          // console.log('in create_edit_document, renderTemplateElements, eachElement, page, inputElement, newElement, group, translationKey, this.props.documentTranslationsAll[`${this.props.agreement.template_file_name}_all`][translationKey], label: ', eachElement, page, inputElement, newElement, group, translationKey, this.props.documentTranslationsAll[`${this.props.agreement.template_file_name}_all`][translationKey], label);
        } else {
          // If no object existins in fixed and important_points, must be a list;
          // Get first part of name to get translation from appLanguages; last part to get
          splitKey = modifiedElement.name.split('_');
          category = modifiedElement.list_parameters ? `${AppLanguages[modifiedElement.list_parameters.split(',')[2]][this.props.appLanguageCode]}/` : '';
          translationText = splitKey[splitKey.length - 1] === 'translation' ? 'Translation' : ''
          splitKey.splice(splitKey.length - 1, 1)[0]
          console.log('in create_edit_document, renderTemplateElements, eachElement, splitKey: ', eachElement, splitKey);
          const keyText = AppLanguages[splitKey[0]][this.props.appLanguageCode] || translationKey
          label = category + keyText + ' ' + translationText;
          // label = modifiedElement.name;
        }
      // if (eachElement.page === page) {
        const editTemplate = true;
        // const width = parseInt(eachElement.width, 10)
        const nullRequiredField = false;
        // const otherChoiceValues = [];

        const otherChoiceValues = [];
        // For populating array with values of other buttons;
        // input and select val === 'inputFieldValue'
        if (fieldComponent === DocumentChoicesTemplate) {
          console.log('in create_edit_document, renderTemplateElements, in fieldComponent = DocumentChoices, modifiedElement: ', modifiedElement);
          _.each(modifiedElement.document_field_choices, eachChoice => {
            // console.log('in create_edit_document, renderEachDocumentField, eachChoice: ', eachChoice);
            if ((eachChoice.val !== 'inputFieldValue') && (eachElement.input_type !== 'boolean')) {
              otherChoiceValues.push(eachChoice.val.toString().toLowerCase());
            }
          })
        }
        // count++;
        // Wait until document-background class is rendered to enable some logic
        const background = document.getElementById('document-background');
        const selected = this.state.selectedTemplateElementIdArray.indexOf(eachElement.id) !== -1;
        // console.log('in create_edit_document, renderTemplateElements, eachElement, editTemplate, background: ', eachElement, editTemplate, background);
        // Wait for the background to be rendered to get its dimensions
        if (editTemplate && background) {
          const tabPercentOfContainerH = (TAB_HEIGHT / background.getBoundingClientRect().height) * 100;
          const eachElementWidthPx = background.getBoundingClientRect().width * (parseFloat(modifiedElement.width) / 100)
          let tabLeftMarginPx = eachElementWidthPx - TAB_WIDTH - TAB_REAR_SPACE;
          if (eachElementWidthPx < TAB_WIDTH) tabLeftMarginPx = 0;

          const wrappingDivDocumentCreateH = parseFloat(modifiedElement.height) / (parseFloat(modifiedElement.height) + tabPercentOfContainerH);

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
                if (eachChoice.class_name === 'document-circle-template') {
                  totalWidth = parseFloat(eachChoice.width);
                  totalHeight = parseFloat(eachChoice.height);
                  if (i === Object.keys(document_field_choices).length - 1) totalWidth += (i * marginBetween);
                }

                if (eachChoice.class_name === 'document-rectangle-template-button' || eachChoice.class_name === 'document-circle-template') {
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
              // console.log('in create_edit_document, renderTemplateElements, eachElement in if else document_field_choices, eachElement, document_field_choices, localTemplateElementsByPage, adjustedHeightInPx, backgroundDimensions: ', eachElement, document_field_choices, localTemplateElementsByPage, adjustedHeightInPx, backgroundDimensions);
              // console.log('in create_edit_document, renderTemplateElements, eachElement in if else document_field_choices, eachElement: ', eachElement, adjustedHeightInPx);
            } // end of if newElement
          } // end of if eachElement.document_field_choices
          // if ()
          if (inputElement && this.state.editFieldsOn && !this.state.translationModeOn) {
            // console.log('in create_edit_document, renderTemplateElements, eachElement in if inputElement and newElement, modifiedElement: ', modifiedElement);
            console.log('in create_edit_document, renderTemplateElements, eachElement, eachElement.height, tabPercentOfContainerH: ', eachElement, eachElement.height, tabPercentOfContainerH);

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
                      newElement,
                      documentLanguageCode,
                      getChoiceCoordinates: (props) => { this.getChoiceCoordinates(props); },
                      setTemplateHistoryArray: (array) => { this.setTemplateHistoryArray(array, 'update'); },
                      formFields: newElement
                        ?
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
                      elementId: modifiedElement.id,
                      editFieldsOn: this.state.editFieldsOn,
                      // label: modifiedElement.name,
                      label,
                      agreement: this.props.agreement
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
                {this.renderTab(modifiedElement, selected, tabLeftMarginPx, inputElement)}
              </div>
            );
          } else if (this.state.editFieldsOn && !this.state.translationModeOn) { // else if inputElement
            console.log('in create_edit_document, test for 1a-0 renderTemplateElements, else if inputElement, modifiedElement, page, this.props.templateElementsByPage, localTemplateElementsByPage, this.props.editFieldsOn, this.props.agreement: ', modifiedElement, page, this.props.templateElementsByPage, localTemplateElementsByPage, this.props.editFieldsOn, this.props.agreement);
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
                      newElement,
                      getChoiceCoordinates: (props) => { this.getChoiceCoordinates(props); },
                      setTemplateHistoryArray: (array) => { this.setTemplateHistoryArray(array, 'update'); },
                      required: modifiedElement.required,
                      nullRequiredField,
                      documentLanguageCode,
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
                      selectedChoiceIdArray: this.state.selectedChoiceIdArray,
                      // label: modifiedElement.name,
                      label,
                      agreement: this.props.agreement
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
                {this.renderTab(modifiedElement, selected, tabLeftMarginPx, inputElement)}
              </div>
            );
          }// end of if inputElement

          // if (noTabs) { // noTabs a placeholder for now
          console.log('in create_edit_document, before last return inputElement, this.props.editFieldsOn, this.state.translationModeOn: ', inputElement, this.props.editFieldsOn, this.state.translationModeOn);
            return (
              <Field
                key={modifiedElement.id}
                name={modifiedElement.name}
                // setting value here does not works unless its an <input or some native element
                // value='Bobby'
                component={fieldComponent}
                // pass page to custom compoenent, if component is input then don't pass
                props={fieldComponent === DocumentChoicesTemplate ? {
                  page,
                  formFields: this.props.templateElementsByPage,
                  otherChoiceValues,
                  modifiedElement,
                  documentLanguageCode,
                  editFieldsOn: this.state.editFieldsOn,
                  translationModeOn: this.state.translationModeOn,
                  eachElement: modifiedElement,
                  required: modifiedElement.required,
                  nullRequiredField,
                  charLimit: modifiedElement.charLimit,
                  elementName: modifiedElement.name,
                  elementId: modifiedElement.id,
                  handleButtonTemplateElementMove: () => {},
                  handleButtonTemplateElementClick: () => {},
                  selectedChoiceIdArray: this.state.selectedChoiceIdArray,
                  documentKey: this.props.documentKey,
                  editTemplate,
                  agreement: this.props.agreement
                } : {}}
                // props={fieldComponent == DocumentChoices ? { page } : {}}
                type={modifiedElement.input_type}
                className={modifiedElement.component == 'input' ? 'document-rectangle' : ''}
                // className={modifiedElement.component == 'input' ? 'form-control' : ''}
                // className={modifiedElement.className}
                style={modifiedElement.component == 'input' ? { position: 'absolute', top: `${eachElement.top * 100}%`, left: `${eachElement.left * 100}%`, width: eachElement.width, height: eachElement.height, borderColor: eachElement.borderColor, margin: '0px !important' } : {}}
                // style={newElement.component == 'input' ? { position: 'absolute', top: newElement.top, left: newElement.left, width: newElement.width, height: newElement.height, borderColor: newElement.borderColor } : {}}
              />
            );
          // } // end of if no tabs
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
      console.log('in create_edit_document, renderEachDocumentTranslation, this.props.documentTranslations, documentTranslation, page: ', this.props.documentTranslations, documentTranslation, page);
      if (documentTranslation.attributes) {
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
      }
    });
    // }
  }

  handleCreateNewTemplateElement() {
    // Turn on and off createNewTemplateElementOn local state;
    // The actual creation is done in getMousePosition
    this.setState({
      createNewTemplateElementOn: !this.state.createNewTemplateElementOn,
    }, () => {
      // In callback to setState, if turning on addEventListener
      // console.log('in create_edit_document, handleCreateNewTemplateElement, this.state.createNewTemplateElementOn, this.state.translationModeOn: ', this.state.createNewTemplateElementOn, this.state.translationModeOn);
      if (this.state.createNewTemplateElementOn) {
        document.addEventListener('click', this.getMousePosition);
        this.setState({ editFieldsOn: true });
      } else {
        // In callback to setState, if turning off removeEventListener
        document.removeEventListener('click', this.getMousePosition);
        if (!this.state.editFieldsOnPrevious) this.setState({ editFieldsOn: false });
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

  // // For keeping track of modifications in elements both persisted
  // // and new template elements. Final object looks like
  // // { 1a: { deleted: false, updated: 1 }, 25: { deleted: true, updated: 3} }.
  // // This will drive save button enabling and how element creation and updates will be done. So no need to iterate through all elements everytime save is run; AND centralizes persisted code for identifying elements to be created and updated, AS WELL AS updating persisted elements in action creator populate persisted template elements
  // getModifiedObject(redoOrUndo) {
  //   // Set initial values of returnObject depending on translationModeOn
  //   const returnObject = !this.state.translationModeOn
  //                         ?
  //                         { ...this.state.modifiedPersistedElementsObject }
  //                         :
  //                         { ...this.state.modifiedPersistedTranslationElementsObject };
  //                         // { '0b': { deleted: false, updated: 0 } }
  //   const returnEditObject = {};
  //   const setEditObject = (editObject) => {
  //     console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, redoOrUndo, returnObject, editObject, this.historyIndex, index: ', redoOrUndo, returnObject, editObject, this.state.historyIndex, index);
  //     if (returnObject[editObject.id]) {
  //       // Think 1. CRUD (Create, [Read], Update, Delete),
  //       // 2. temporary and persisted elements,
  //       // 3. Undo and Redo
  //       if (editObject.action === 'create') {
  //         // Create undo can only happen to temporary elements with ids with 'a' ie '1a'
  //         if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) delete returnObject[editObject.id];
  //         if (redoOrUndo === 'redo' && editObject.id.indexOf('a') !== -1) {
  //           returnObject[editObject.id] = { deleted: false, updated: 0 };
  //           returnEditObject[editObject.id] = editObject;
  //         }
  //         console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, in create redoOrUndo, returnObject, editObject, this.historyIndex, index: ', redoOrUndo, returnObject, editObject, this.state.historyIndex, index);
  //       }
  //
  //       if (editObject.action === 'update') {
  //         console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, in update redoOrUndo, returnObject, editObject, this.historyIndex, index: ', redoOrUndo, returnObject, editObject, this.state.historyIndex, index);
  //         // In case of update and object exists, increment up update
  //         if (redoOrUndo !== 'undo' && redoOrUndo !== 'redo') returnObject[editObject.id].updated++;
  //         // returnObject[editObject.id].updated++;
  //         // In case of undo update and object exists, increment up update, decrement if undo
  //         // if (redoOrUndo === 'undo') returnObject[editObject.id].updated = returnObject[editObject.id].updated - 1;
  //         if (redoOrUndo === 'undo') {
  //           // NOTE: temporary template element may come to have negagtive update
  //           // since their can modifiedPersistedElementsObject
  //           // can be deleted even when their update number is non-zero;
  //           // The only thing that matters is their deleted attribute
  //           returnObject[editObject.id].updated--;
  //           if (returnObject[editObject.id].deleted === false && editObject.id.indexOf('a') === -1 && returnObject[editObject.id].updated === 0) delete returnObject[editObject.id];
  //         }
  //         if (redoOrUndo === 'redo') returnObject[editObject.id].updated++;
  //       }
  //       // In case of delete and object exists in modifiedPersistedElementsObject
  //       if (editObject.action === 'delete') {
  //         // If persisted element id, update delete to true
  //         if (redoOrUndo !== 'undo' && redoOrUndo !== 'redo') {
  //           if (editObject.id.indexOf('a') === -1) returnObject[editObject.id].deleted = true;
  //           // Case of temporary id ie '1a', take out the key '1a'
  //           if (editObject.id.indexOf('a') !== -1) delete returnObject[editObject.id];
  //         }
  //         // Don't worry about updated count for temporary elements since only matter if they exist
  //         if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) returnObject[editObject.id] = { deleted: false, updated: 0 };
  //         if (redoOrUndo === 'redo' && editObject.id.indexOf('a') !== -1) delete returnObject[editObject.id];
  //         if (redoOrUndo === 'undo' && editObject.id.indexOf('a') === -1) {
  //           returnObject[editObject.id].deleted = false
  //           if (returnObject[editObject.id].updated === 0) delete returnObject[editObject.id]
  //         }
  //         if (redoOrUndo === 'redo' && editObject.id.indexOf('a') === -1) returnObject[editObject.id].deleted = true;
  //       }
  //     } else { // if object with element id does not exist in object
  //       // If object for element does not exist in modifiedPersistedElementsObject
  //       if (editObject.action === 'create') {
  //         console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, in else create redoOrUndo, returnObject, editObject, this.historyIndex, index: ', redoOrUndo, returnObject, editObject, this.state.historyIndex, index);
  //         if (redoOrUndo !== 'undo' && redoOrUndo !== 'redo') returnObject[editObject.id] = { deleted: false, updated: 0 };
  //         if (redoOrUndo === 'redo' && editObject.id.indexOf('a') !== -1) {
  //           returnObject[editObject.id] = { deleted: false, updated: 0 };
  //           returnEditObject[editObject.id] = editObject;
  //         }
  //         // undo create for temporary elements not needed since object will have been created
  //         // if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) delete returnObject[editObject.id];
  //         // if (redoOrUndo === 'undo' && editObject.id.indexOf('a') === -1) returnObject[editObject.id] = { deleted: false, updated: 0 };
  //       }
  //
  //       // If object does not exist for element, create object with updated 1;
  //       // Don't need redo or undo since object will have been created in modifiedPersistedElementsObject
  //       if (editObject.action === 'update') {
  //         returnObject[editObject.id] = { deleted: false, updated: 1 };
  //       }
  //
  //       if (editObject.action === 'delete') {
  //         // In case of delete, can only happen to backend-persisted elements
  //         if (editObject.id.indexOf('a') === -1) returnObject[editObject.id] = { deleted: true, updated: 0 };
  //         // Can only undo delete if object does not exist for temporary elements
  //         // If redo delete, there would be an object existing
  //         if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) returnObject[editObject.id] = { deleted: false, updated: 0 };
  //       }
  //     }
  //   }
  //   // templateEditHistoryArray is an array of array of objects;
  //   // [[{ id: '1', width: 10, action: update }, { id: '1a', font_family: 'arial'... action: 'create'}], [...]]
  //   // Each array within the outermost array is i. No need to adjust for redo
  //   let index = this.state.historyIndex;
  //   if (redoOrUndo === 'undo') index = this.state.historyIndex + 1;
  //   // if (_.isEmpty(this.state.modifiedPersistedElementsObject)) {
  //   if (_.isEmpty(returnObject)) {
  //     // Go through each history array in templateEditHistoryArray
  //     _.each(this.state.templateEditHistoryArray, (eachEditArray, i) => {
  //       if (i <= index) {
  //         _.each(eachEditArray, eachEditObject => {
  //           // if translationModeOn, run setEditObject only if translation_element true
  //           if (this.state.translationModeOn) {
  //             if (eachEditObject.translation_element) setEditObject(eachEditObject);
  //           } else if (!eachEditObject.translation_element) {
  //             setEditObject(eachEditObject);
  //           }
  //         });
  //       }
  //     });
  //   } else {
  //     // if modifiedPersistedElementsObject has at least one object in it,
  //     // adjust index to get the history array that is redone or undone
  //     _.each(this.state.templateEditHistoryArray[index], eachEditObject => {
  //       // if translationModeOn, run setEditObject only if translation_element true
  //       // setEditObject(eachEditObject);
  //       if (this.state.translationModeOn) {
  //         if (eachEditObject.translation_element) setEditObject(eachEditObject);
  //       } else if (!eachEditObject.translation_element) {
  //         setEditObject(eachEditObject);
  //       }
  //     });
  //   }
  //
  //   return { returnObject, returnEditObject };
  // }

  setLocalStorageHistory(fromWhere) {
    // For keeping track of modifications in elements both persisted
    // and new template elements. Final object looks like
    // { 1a: { deleted: false, updated: 1 }, 25: { deleted: true, updated: 3} }.
    // This will drive save button enabling and how element creation and updates will be done. So no need to iterate through all elements everytime save is run; AND centralizes persisted code for identifying elements to be created and updated, AS WELL AS updating persisted elements in action creator populate persisted template elements
    const getModifiedObject = (redoOrUndo) => {
      // Set initial values of returnObject depending on translationModeOn
                            // { '0b': { deleted: false, updated: 0 } }
      const setEditObject = (editObject) => {
        // const returnEditObject = {};
        // reassign selectedObject based on what type editObject is
        selectedObject = !editObject.translation_element
        ?
        modifiedPersistedObject
        :
        modifiedPersistedTranslationObject;
        console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, redoOrUndo, selectedObject, editObject, this.historyIndex, index: ', redoOrUndo, selectedObject, editObject, this.state.historyIndex, index);
        if (selectedObject[editObject.id]) {
          // Think 1. CRUD (Create, [Read], Update, Delete),
          // 2. temporary and persisted elements,
          // 3. Undo and Redo
          if (editObject.action === 'create') {
            // Create undo can only happen to temporary elements with ids with 'a' ie '1a'
            if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) delete selectedObject[editObject.id];
            if (redoOrUndo === 'redo' && editObject.id.indexOf('a') !== -1) {
              selectedObject[editObject.id] = { deleted: false, updated: 0 };
              returnEditObject[editObject.id] = editObject;
            }
            console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, in create redoOrUndo, selectedObject, editObject, this.historyIndex, index: ', redoOrUndo, selectedObject, editObject, this.state.historyIndex, index);
          }

          if (editObject.action === 'update') {
            console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, in update redoOrUndo, selectedObject, editObject, this.historyIndex, index: ', redoOrUndo, selectedObject, editObject, this.state.historyIndex, index);
            // In case of update and object exists, increment up update
            if (redoOrUndo !== 'undo' && redoOrUndo !== 'redo') selectedObject[editObject.id].updated++;
            // selectedObject[editObject.id].updated++;
            // In case of undo update and object exists, increment up update, decrement if undo
            // if (redoOrUndo === 'undo') selectedObject[editObject.id].updated = selectedObject[editObject.id].updated - 1;
            if (redoOrUndo === 'undo') {
              // NOTE: temporary template element may come to have negagtive update
              // since their can modifiedPersistedElementsObject
              // can be deleted even when their update number is non-zero;
              // The only thing that matters is their deleted attribute
              selectedObject[editObject.id].updated--;
              if (selectedObject[editObject.id].deleted === false && editObject.id.indexOf('a') === -1 && selectedObject[editObject.id].updated === 0) delete selectedObject[editObject.id];
            }
            if (redoOrUndo === 'redo') selectedObject[editObject.id].updated++;
          }
          // In case of delete and object exists in modifiedPersistedElementsObject
          if (editObject.action === 'delete') {
            // If persisted element id, update delete to true
            if (redoOrUndo !== 'undo' && redoOrUndo !== 'redo') {
              if (editObject.id.indexOf('a') === -1) selectedObject[editObject.id].deleted = true;
              // Case of temporary id ie '1a', take out the key '1a'
              if (editObject.id.indexOf('a') !== -1) delete selectedObject[editObject.id];
            }
            // Don't worry about updated count for temporary elements since only matter if they exist
            if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) selectedObject[editObject.id] = { deleted: false, updated: 0 };
            if (redoOrUndo === 'redo' && editObject.id.indexOf('a') !== -1) delete selectedObject[editObject.id];
            if (redoOrUndo === 'undo' && editObject.id.indexOf('a') === -1) {
              selectedObject[editObject.id].deleted = false
              if (selectedObject[editObject.id].updated === 0) delete selectedObject[editObject.id]
            }
            if (redoOrUndo === 'redo' && editObject.id.indexOf('a') === -1) selectedObject[editObject.id].deleted = true;
          }
        } else { // if object with element id does not exist in object
          // If object for element does not exist in modifiedPersistedElementsObject
          if (editObject.action === 'create') {
            console.log('in create_edit_document, setLocalStorageHistory, getModifiedObject, in else create redoOrUndo, selectedObject, editObject, this.historyIndex, index: ', redoOrUndo, selectedObject, editObject, this.state.historyIndex, index);
            if (redoOrUndo !== 'undo' && redoOrUndo !== 'redo') selectedObject[editObject.id] = { deleted: false, updated: 0 };
            if (redoOrUndo === 'redo' && editObject.id.indexOf('a') !== -1) {
              selectedObject[editObject.id] = { deleted: false, updated: 0 };
              returnEditObject[editObject.id] = editObject;
            }
            // undo create for temporary elements not needed since object will have been created
            // if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) delete selectedObject[editObject.id];
            // if (redoOrUndo === 'undo' && editObject.id.indexOf('a') === -1) selectedObject[editObject.id] = { deleted: false, updated: 0 };
          }

          // If object does not exist for element, create object with updated 1;
          // Don't need redo or undo since object will have been created in modifiedPersistedElementsObject
          if (editObject.action === 'update') {
            selectedObject[editObject.id] = { deleted: false, updated: 1 };
          }

          if (editObject.action === 'delete') {
            // In case of delete, can only happen to backend-persisted elements
            if (editObject.id.indexOf('a') === -1) selectedObject[editObject.id] = { deleted: true, updated: 0 };
            // Can only undo delete if object does not exist for temporary elements
            // If redo delete, there would be an object existing
            if (redoOrUndo === 'undo' && editObject.id.indexOf('a') !== -1) selectedObject[editObject.id] = { deleted: false, updated: 0 };
          }
        }
      }
      // templateEditHistoryArray is an array of array of objects;
      // [[{ id: '1', width: 10, action: update }, { id: '1a', font_family: 'arial'... action: 'create'}], [...]]
      // Each array within the outermost array is i. No need to adjust for redo
      let index = this.state.historyIndex;
      if (redoOrUndo === 'undo') index = this.state.historyIndex + 1;
      // if (_.isEmpty(this.state.modifiedPersistedElementsObject)) {
      let selectedObject = !this.state.translationModeOn
      ?
      modifiedPersistedObject
      :
      modifiedPersistedTranslationObject;

      if (_.isEmpty(selectedObject)) {
        // Go through each history array in templateEditHistoryArray
        _.each(this.state.templateEditHistoryArray, (eachEditArray, i) => {
          if (i <= index) {
            _.each(eachEditArray, eachEditObject => {
              // if translationModeOn, run setEditObject only if translation_element true
              if (this.state.translationModeOn) {
                if (eachEditObject.translation_element) setEditObject(eachEditObject);
              } else if (!eachEditObject.translation_element) {
                setEditObject(eachEditObject);
              }
            });
          }
        });
      } else {
        // if modifiedPersistedElementsObject has at least one object in it,
        // adjust index to get the history array that is redone or undone
        _.each(this.state.templateEditHistoryArray[index], eachEditObject => {
          // if translationModeOn, run setEditObject only if translation_element true
          // setEditObject(eachEditObject);
          if (this.state.translationModeOn) {
            if (eachEditObject.translation_element) setEditObject(eachEditObject);
          } else if (!eachEditObject.translation_element) {
            setEditObject(eachEditObject);
          }
        });
      }
      // return { returnObject, returnEditObject };
    }


    // Set storage object for given point in time for agreement for when user accidentally has to refresh
    // Called after element creation, deletion, update, redo, undo (after index increment, decrement)
    let destringifiedHistory = {};
    const localStorageHistory = localStorage.getItem('documentHistory');
    const returnEditObject = {};
    // Get latest localHistory object
    if (localStorageHistory) {
      // if historystring, unstringify it and add agreementId = historyArray
      destringifiedHistory = JSON.parse(localStorageHistory);
    }

    const modifiedPersistedObject = { ...this.state.modifiedPersistedElementsObject }
    // const modifiedPersistedTranslationObject = { '0b': { deleted: false, updated: 0 }, '1b': { deleted: false, updated: 0 } };
    const modifiedPersistedTranslationObject = { ...this.state.modifiedPersistedTranslationElementsObject }
    // Get an object like lookes like: { 1a: { deleted: false, updated: 1 }, 2: { deleted: true; updated: 0 }}
    // To be used
    getModifiedObject(fromWhere);
    console.log('in create_edit_document, setLocalStorageHistory, right after call of getModifiedObjec: ');
    const unsavedTemplateElements = { ...this.state.unsavedTemplateElements };

    const cleanUpObjects = (eachObject, eachElementKey) => {
      const modifiedEachObject = eachObject;
      modifiedEachObject[eachElementKey].deleted = true;
      delete unsavedTemplateElements[eachElementKey];
    };
    // Save new elements not persisted in backend DB (have 'a' or 'b' on ids)
    // Go thorough each of modifiedPersistedElementsObject and modifiedPersistedTranslationObject
    // lookes like: { 1a: { deleted: false, updated: 1 }, 2: { deleted: true; updated: 0 }}
    // Get ids of elements in modified object and get element from this.props.templateElements
    // Run only if not called from handleTemplateSubmitCallback();
    // since handleTemplateSubmitCallback function empties out all history-related state
    if (fromWhere !== 'handleTemplateSubmitCallback') {
      _.each([modifiedPersistedObject, modifiedPersistedTranslationObject], eachObject => {
        const modifiedEachObject = eachObject;
        // _.each(Object.key.returnObject), eachElementKey => {
        _.each(Object.keys(eachObject), eachElementKey => {

          console.log('in create_edit_doc ument, setLocalStorageHistory, fromWhere, eachElementKey: ', fromWhere, eachElementKey);
          // if element is a template element with an 'a' put into unsavedTemplateElements from this.props.templateElements
          if (eachElementKey.indexOf('a') !== -1) {
            this.props.templateElements[eachElementKey] ? unsavedTemplateElements[eachElementKey] = this.props.templateElements[eachElementKey] : cleanUpObjects(eachObject, eachElementKey);
          }
          // if element is translation with 'b' put into unsavedTemplateElements from this.props.templateTranslationElements
          if (eachElementKey.indexOf('b') !== -1) {
            this.props.templateTranslationElements[eachElementKey] ? unsavedTemplateElements[eachElementKey] = this.props.templateTranslationElements[eachElementKey] : cleanUpObjects(eachObject, eachElementKey);
          }

          if (eachElementKey === 'undefined' || eachElementKey === null) delete modifiedEachObject[eachElementKey]
          // console.log('in create_edit_document, setLocalStorageHistory, this.state.historyIndex, this.state.templateEditHistoryArray, fromWhere, this.props.agreement, this.props.templateElements, eachElementKey: ', this.state.historyIndex, this.state.templateEditHistoryArray, fromWhere, this.props.agreement, this.props.templateElements, eachElementKey);
          console.log('in create_edit_document, setLocalStorageHistory, eachObject, eachElementKey, unsavedTemplateElements: ', eachObject, eachElementKey, unsavedTemplateElements);
        });
      });
    }

    this.setState({
      // if translation mode is on return the exising modifiedPersistedElementsObject
      // and opposite for modifiedPersistedTranslationElementsObject
      modifiedPersistedElementsObject: modifiedPersistedObject,
      modifiedPersistedTranslationElementsObject: modifiedPersistedTranslationObject,
      // modifiedPersistedTranslationElementsObject: { '0a': { deleted: false, updated: 0 } },
      unsavedTemplateElements
    }, () => {
      destringifiedHistory[this.props.agreement.id] = {
        history: this.state.templateEditHistoryArray,
        // unsavedTemplateElements is not saved in state
        elements: this.state.unsavedTemplateElements,
        historyIndex: this.state.historyIndex,
        newFontObject: this.state.newFontObject,
        // modifiedPersistedElementsArray: this.state.modifiedPersistedElementsArray,
        // modifiedPersistedElementsObject: this.state.modifiedPersistedElementsObject
        modifiedPersistedElementsObject: this.state.modifiedPersistedElementsObject,
        modifiedPersistedTranslationElementsObject: this.state.modifiedPersistedTranslationElementsObject
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
    // if there is no element in parameters, ie the action was based on selected elements ie 'delete'
    const templateElements = !this.state.translationModeOn ? this.props.templateElements : this.props.templateTranslationElements;
    if (!elementArray) {
      console.log('in create_edit_document, setTemplateHistoryArray, if !elementArray: ', action, elementArray);
      _.each(this.state.selectedTemplateElementIdArray, eachSelectedId => {
        // if id is in mapped template elements object { id: {element} }
        if (templateElements[eachSelectedId]) {
          // Get a new object to modify so all other objects in templateEditHistoryArray
          // do not get modified
          const modifiedElement = this.getNewElementObject(templateElements[eachSelectedId]);
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
      allElementsChecked: action === 'delete' ? false : this.state.selectedTemplateElementIdArray.length === Object.keys(templateElements).length,
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
     this.props.deleteDocumentElementLocally({ selectedTemplateElementIdArray: this.state.selectedTemplateElementIdArray, translationModeOn: this.state.translationModeOn, callback: () => this.setTemplateHistoryArray(null, 'delete') });
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
    // const getChangeChoiceIdArray = () => {
    //
    // }

    const align = (alignWhat) => {
      // aligningElement for aligning wrappers
      const aligningElement = this.state.selectedTemplateElementIdArray.length > 0;
      // aligningChoice for aligning choice buttons
      const aligningChoice = this.state.selectedChoiceIdArray.length > 0;
      console.log('in create_edit_document, handleTemplateElementActionClick, move() elementVal, aligningElement, aligningChoice, this.state.selectedChoiceIdArray: ', elementVal, aligningElement, aligningChoice, this.state.selectedChoiceIdArray);
      if (aligningElement || aligningChoice) {
        // get the first element to be clicked to make as a basis for move
        // first clicked element (one user clicked first, so first in array) is baseElement
        let baseElement = null;
        let baseChoice = null;
        let baseElementId = null;
        let baseChoiceIndex = null;
        // let choiceButtonDimensions = null;
        // let choiceButton = null;
        // If there are more than one elements (wrappers divs, not choices) chosen
        if (this.state.selectedTemplateElementIdArray.length > 0) {
          baseElement = !this.state.translationModeOn ? this.props.templateElements[this.state.selectedTemplateElementIdArray[0]] : this.props.templateTranslationElements[this.state.selectedTemplateElementIdArray[0]];
        } else {
          // The first choice in selectedChoiceIdArray is the base upon which others move
          // choiceIds look like '1a-0'
          baseElementId = this.state.selectedChoiceIdArray[0].split('-')[0];
          baseChoiceIndex = parseInt(this.state.selectedChoiceIdArray[0].split('-')[1], 10);
          baseElement = this.props.templateElements[baseElementId];
          baseChoice = this.props.templateElements[baseElementId].document_field_choices[baseChoiceIndex];
        }
        // If aligning elements or wrapper divs
        if (baseElement && aligningElement) {
          const array = [];
          const originalValueObject = {};
          let wrapperDiv = null;
          let eachElement = null;
          let wrapperDivDimensions = null;
          let updatedElementObject = null;

          _.each(this.state.selectedTemplateElementIdArray, eachElementId => {
            eachElement = !this.state.translationModeOn ? this.props.templateElements[eachElementId] : this.props.templateTranslationElements[eachElementId];
            if (eachElement && eachElement.id !== baseElement.id) {
              // If the element is an input element
              if (!eachElement.document_field_choices) {
                // Get original attributes for use in history in undo/redo
                originalValueObject[eachElement.id] = {
                  top: eachElement.top,
                  left: eachElement.left,
                  width: eachElement.width,
                  height: eachElement.height
                };
                // Assign relevant attributes including translation element
                // These objects wil be kept in history and templateElements
                if (alignWhat === 'vertical') array.push({ id: eachElement.id, top: baseElement.top, o_top: originalValueObject[eachElement.id].top, translation_element: eachElement.translation_element, action: 'update' });
                if (alignWhat === 'horizontal') array.push({ id: eachElement.id, left: baseElement.left, o_left: originalValueObject[eachElement.id].left, translation_element: eachElement.translation_element, action: 'update' });
                if (alignWhat === 'alignWidth') array.push({ id: eachElement.id, width: baseElement.width, oWidth: originalValueObject[eachElement.id].width, translation_element: eachElement.translation_element, action: 'update' });
                if (alignWhat === 'alignHeight') array.push({ id: eachElement.id, height: baseElement.height, oHeight: originalValueObject[eachElement.id].height, translation_element: eachElement.translation_element, action: 'update' });
              } else { // else of if (!eachElement.document_field_choices
                // Get the wrapper div and move it to the base top or left (Don't align width or height)
                // All document_field_choices move along with it. Then save in app state
                wrapperDiv = document.getElementById(`template-element-${eachElementId}`);
                // backgroundDimensions = wrapperDiv.parentElement.getBoundingClientRect();
                wrapperDivDimensions = wrapperDiv.getBoundingClientRect();
                // Move the wrapperDiv then get new coordinates of child choices in getUpdatedElementObjectMoveWrapper
                if (alignWhat === 'vertical') wrapperDiv.style.top = baseElement.top;
                if (alignWhat === 'horizontal') wrapperDiv.style.left = baseElement.left;

                updatedElementObject = getUpdatedElementObjectMoveWrapper({ wrapperDiv, eachElementId, originalWrapperDivDimensions: wrapperDivDimensions, templateElements: this.props.templateElements, elementDrag: true, tabHeight: TAB_HEIGHT });
                // console.log('in create_edit_document, dragElement, closeDragElement, in each eachElement, lastWrapperDivDims, wrapperDivDimensions, updatedElementObject, lastWrapperDivDimsInPx ', eachElement, lastWrapperDivDims, wrapperDivDimensions, updatedElementObject, lastWrapperDivDimsInPx);
                array.push(updatedElementObject)
              } // end of if (!eachElement.document_field_choices
            } // end of if (eachElement && eachElement.id !== baseElement.id)
          }); // end of each
          console.log('in create_edit_document, handleTemplateElementActionClick, move() elementVal, array: ', elementVal, array);
          // call action to update each template element object in reducer
          this.props.updateDocumentElementLocally(array);
          this.setTemplateHistoryArray(array, 'update');
        } // end of if baseElement
        // For aligning individual choices NOT entire elements or wrapper divs
        if (baseChoice) {
          // choiceButton is the first choice to be selected
          const alignControlArray = [];
          let changeChoiceIndexArray = [];
          // !!!! choiceButton is the one that was clicked first and thus other choices align to it
          const choiceButton = document.getElementById(`template-element-button-${baseElementId},${baseChoiceIndex}`);
          const wrapperDiv = choiceButton.parentElement.parentElement.parentElement;
          const backgroundDimensions = wrapperDiv.parentElement.getBoundingClientRect();
          const lastWrapperDivDimsPre = wrapperDiv.getBoundingClientRect();
          let eachChoiceIndex = null;
          let eachElementId = null;
          let otherChoice = null;
          let changeChoice = null;
          let eachElementInState = null;
          // let eachBaseChoiceInState = null;
          let eachBaseChoice = null;
          let allChoicesObject = null;
          let eachWrapperDiv = null;
          let otherChoicesArray = [];
          let changeChoicesArray = [];
          // let choiceButtonWidthInPx = null;
          // let choiceButtonHeightInPx = null;
          const arrayForAction = [];
          let eachWrapperDivDimensions = null;
          let documentFieldObject = null;
          let eachChoicePxDimensionsArray = null;
          let newDocumentFieldChoices = null;
          let oldDocumentFieldChoices = null;
          let lastWrapperDivDims = null;
          let updatedElementObject = null;

          let attribute = null;

          const alignObject = { vertical: { choiceAttr: 'top', backAttr: 'height' },
                                horizontal: { choiceAttr: 'left', backAttr: 'width' },
                                alignWidth: { choiceAttr: 'width', backAttr: 'width' },
                                alignHeight: { choiceAttr: 'height', backAttr: 'height' },
                              };

          const widthHeight = alignWhat === 'alignWidth' || alignWhat === 'alignHeight';
          // Iterate through each of the choices selected;
          // Note, choices may be in difference wrappers,
          // and may not be any particular in order in selectedChoiceIdArray
          // (except for the first which is the base for alignment)
          _.each(this.state.selectedChoiceIdArray, eachChoiceId => {
              eachElementId = eachChoiceId.split('-')[0];
              console.log('in create_edit_document, handleTemplateElementActionClick, test for multi align if baseChoice this.state.selectedChoiceIdArray, eachChoiceId, alignControlArray: ', this.state.selectedChoiceIdArray, eachChoiceId, alignControlArray);
              // If element (wrapper and its choices) has not been aligned
              if (alignControlArray.indexOf(eachElementId) === -1) {
                // push eachElementId avoid doing the same element multiple times
                alignControlArray.push(eachElementId);
                eachChoiceIndex = parseInt(eachChoiceId.split('-')[1], 10);
                eachElementInState = this.props.templateElements[eachElementId];
                // eachBaseChoiceInState = this.props.templateElements[eachElementId].document_field_choices[eachChoiceIndex];
                eachBaseChoice = document.getElementById(`template-element-button-${eachElementId},${eachChoiceIndex}`);
                // eachBaseChoiceDimensions = eachBaseChoice.getBoundingClientRect();
                eachWrapperDiv = eachBaseChoice.parentElement.parentElement.parentElement;
                eachWrapperDivDimensions = eachWrapperDiv.getBoundingClientRect();

                _.each(Object.keys(eachElementInState.document_field_choices), eachIdx => {
                  // If choice not selected or not base (first selected), push into array to get obejct
                  if (this.state.selectedChoiceIdArray.indexOf(`${eachElementId}-${eachIdx}`) === -1 || `${eachElementId}-${eachIdx}` === `${baseElementId}-${baseChoiceIndex}`) {
                    otherChoice = document.getElementById(`template-element-button-${eachElementId},${eachIdx}`);
                    otherChoicesArray.push(otherChoice);
                  } else if (`${eachElementId}-${eachIdx}` !== `${baseElementId}-${baseChoiceIndex}` && this.state.selectedChoiceIdArray.indexOf(`${eachElementId}-${eachIdx}`) !== -1) {
                    // else if the only highlighted choice in element is the first base choice,
                    // push choice into array for change
                    changeChoice = document.getElementById(`template-element-button-${eachElementId},${eachIdx}`);
                    changeChoicesArray.push(changeChoice)
                    changeChoiceIndexArray.push(parseInt(eachIdx, 10));
                  }
                }); // end of _.each(Object.keys(eachElementInState.document_field_choices

                attribute = alignObject[alignWhat];
                console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice attribute set otherChoicesArray, changeChoicesArray, eachWrapperDiv, wrapperDiv: ', otherChoicesArray, changeChoicesArray, eachWrapperDiv, wrapperDiv);
                // change and align document field choices based on base choice
                allChoicesObject = getOtherChoicesObject({ wrapperDiv: eachWrapperDiv, baseWrapperDiv: wrapperDiv, otherChoicesArray: otherChoicesArray.concat(changeChoicesArray), templateElements: this.props.templateElements, backgroundDimensions, wrapperDivDimensions: eachWrapperDiv.getBoundingClientRect(), notDrag: true, tabHeight: TAB_HEIGHT, widthHeight, changeChoiceIndexArray, choiceButton, attribute: attribute.choiceAttr });

                documentFieldObject = getNewDocumentFieldChoices({ choiceIndex: null, templateElements: this.props.templateElements, iteratedElements: otherChoicesArray.concat(changeChoicesArray), otherChoicesObject: allChoicesObject, backgroundDimensions });
                eachChoicePxDimensionsArray = documentFieldObject.array;
                // // New and old records of choices to be set in app stata in templateElements
                // // get new and old document field choices
                newDocumentFieldChoices = documentFieldObject.newDocumentFieldChoices;
                oldDocumentFieldChoices = documentFieldObject.oldDocumentFieldChoices;
                // // get wrapper dimensions
                lastWrapperDivDims = setBoundaries({ elementsArray: eachChoicePxDimensionsArray, newWrapperDims: lastWrapperDivDimsPre, adjustmentPx: 0 });
                updatedElementObject = getUpdatedElementObject({ elementId: eachElementId, lastWrapperDivDims, backgroundDimensions, wrapperDivDimensions: eachWrapperDivDimensions, newDocumentFieldChoices, oldDocumentFieldChoices, tabHeight: TAB_HEIGHT })
                console.log('in create_edit_document, handleTemplateElementActionClick, align if baseChoice attribute set updatedElementObject: ', updatedElementObject);
                arrayForAction.push(updatedElementObject)

                allChoicesObject = {};
                otherChoicesArray = [];
                changeChoicesArray = [];
                changeChoiceIndexArray = [];
              } // end of if (alignControlArray.indexOf(eachElementId
          }); // end of each selectedChoiceIdArray
          // call action
          // Object to be sent to documents reducer UPDATE_DOCUMENT_ELEMENT_LOCALLY
          this.props.updateDocumentElementLocally(arrayForAction);
          // set history
          this.setTemplateHistoryArray(arrayForAction, 'update');
          //iamhere
        } // end of if baseChoice
      } // end of if state selectedTemplateElementIdArray > 0
    };

    const expandContractElements = (expandContract) => {
      let array = [];
      if (this.state.selectedChoiceIdArray.length > 0) {
        const expandContractIncrement = 1;
        console.log('in create_edit_document, handleTemplateElementActionClick, expandContractElements expandContract : ', expandContract);
        array = getUpdatedElementObjectNoBase({ selectedChoiceIdArray: this.state.selectedChoiceIdArray, expandContractIncrement, expandContract, tabHeight: TAB_HEIGHT, templateElements: this.props.templateElements });

      } // End of if (this.state.selectedTemplateElementIdArray.length > 0)
      this.setTemplateHistoryArray(array, 'update');
      this.props.updateDocumentElementLocally(array);
    }

    const moveElements = (direction) => {
      // console.log('in create_edit_document, handleTemplateElementActionClick, move() direction, this.state.selectedTemplateElementIdArray: ', direction, this.state.selectedTemplateElementIdArray);
      let array = [];
      const originalValueObject = {};
      const moveIncrement = 1;

      let wrapperDiv = null;
      let backgroundDimensions = null;
      let wrapperDivDimensions = null;

      console.log('in create_edit_document, handleTemplateElementActionClick, moveElements() direction, backgroundDimensions: ', direction, backgroundDimensions);
      if (this.state.selectedTemplateElementIdArray.length > 0 || this.state.selectedChoiceIdArray.length > 0) {
        if (this.state.selectedTemplateElementIdArray.length > 0) {
          const idName = !this.state.translationModeOn ? 'template-element' : 'template-translation-element';
          backgroundDimensions = document.getElementById(`${idName}-${this.state.selectedTemplateElementIdArray[0]}`).parentElement.getBoundingClientRect();

          _.each(this.state.selectedTemplateElementIdArray, eachElementId => {
            const eachElement = !this.state.translationModeOn ? this.props.templateElements[eachElementId] : this.props.templateTranslationElements[eachElementId];
                // if (this.state.selectedTemplateElementIdArray.indexOf(eachElement.id) !== -1) {
            if (eachElement) {
              originalValueObject[eachElement.id] = {
                top: eachElement.top,
                left: eachElement.left,
                width: eachElement.width,
                height: eachElement.height,
              };

              if (!eachElement.document_field_choices) {
                // If the element has no document_field_choices, push object in array for the action and reducer
                if (direction === 'moveLeft') array.push({ id: eachElement.id, left: `${((((parseFloat(eachElement.left) / 100) * backgroundDimensions.width) - moveIncrement) / backgroundDimensions.width) * 100}%`, o_left: originalValueObject[eachElement.id].left, translation_element: eachElement.translation_element, action: 'update' });
                if (direction === 'moveRight') array.push({ id: eachElement.id, left: `${((((parseFloat(eachElement.left) / 100) * backgroundDimensions.width) + moveIncrement) / backgroundDimensions.width) * 100}%`, o_left: originalValueObject[eachElement.id].left, translation_element: eachElement.translation_element, action: 'update' });
                if (direction === 'moveDown') array.push({ id: eachElement.id, top: `${((((parseFloat(eachElement.top) / 100) * backgroundDimensions.height) + moveIncrement) / backgroundDimensions.height) * 100}%`, o_top: originalValueObject[eachElement.id].top, translation_element: eachElement.translation_element, action: 'update' });
                if (direction === 'moveUp') array.push({ id: eachElement.id, top: `${((((parseFloat(eachElement.top) / 100) * backgroundDimensions.height) - moveIncrement) / backgroundDimensions.height) * 100}%`, o_top: originalValueObject[eachElement.id].top, translation_element: eachElement.translation_element, action: 'update' });
              } else { // else of if (!eachElement.document_field_choices)
                // Move the wrapper div and the choices will follow then get the new state values
                wrapperDiv = document.getElementById(`template-element-${eachElementId}`);
                // wrapperDivDimensions = wrapperDiv.getBoundingClientRect();
                wrapperDivDimensions = {
                  top: ((parseFloat(originalValueObject[eachElementId].top) / 100) * backgroundDimensions.height) + backgroundDimensions.top,
                  left: ((parseFloat(originalValueObject[eachElementId].left) / 100) * backgroundDimensions.width) + backgroundDimensions.left,
                  width: ((parseFloat(originalValueObject[eachElementId].width) / 100) * backgroundDimensions.width),
                  height: ((parseFloat(originalValueObject[eachElementId].height) / 100) * backgroundDimensions.height)
                }
                // backgroundDimensions = wrapperDiv.parentElement.getBoundingClientRect();
                // wrapperDivDimensions = wrapperDiv.getBoundingClientRect();
                if (direction === 'moveLeft') wrapperDiv.style.left = `${((((parseFloat(wrapperDiv.style.left) / 100) * backgroundDimensions.width) - moveIncrement) / backgroundDimensions.width) * 100}%`;
                if (direction === 'moveRight') wrapperDiv.style.left = `${((((parseFloat(wrapperDiv.style.left) / 100) * backgroundDimensions.width) + moveIncrement) / backgroundDimensions.width) * 100}%`;
                if (direction === 'moveDown') wrapperDiv.style.top = `${((((parseFloat(wrapperDiv.style.top) / 100) * backgroundDimensions.height) + moveIncrement) / backgroundDimensions.height) * 100}%`;
                if (direction === 'moveUp') wrapperDiv.style.top = `${((((parseFloat(wrapperDiv.style.top) / 100) * backgroundDimensions.height) - moveIncrement) / backgroundDimensions.height) * 100}%`;
                // getUpdatedElementObjectMoveWrapper for moving wrapper div and
                // having choices move along with it
                const updatedElementObject = getUpdatedElementObjectMoveWrapper({ wrapperDiv, eachElementId, originalWrapperDivDimensions: wrapperDivDimensions, templateElements: this.props.templateElements, elementDrag: true, tabHeight: TAB_HEIGHT })

                // console.log('in create_edit_document, dragElement, closeDragElement, in each eachElement, lastWrapperDivDims, wrapperDivDimensions, updatedElementObject, lastWrapperDivDimsInPx ', eachElement, lastWrapperDivDims, wrapperDivDimensions, updatedElementObject, lastWrapperDivDimsInPx);
                array.push(updatedElementObject);
              } // end of else if eachElement.document_field_choices
            } // end of if (eachElement)
          }); // end of each
        } // End of if (this.state.selectedTemplateElementIdArray.length > 0

        if (this.state.selectedChoiceIdArray.length > 0) {
          // updateDocumentElementLocally for when moving choices themselves
          // and not moving wrapperDiv
          array = getUpdatedElementObjectNoBase({ selectedChoiceIdArray: this.state.selectedChoiceIdArray, moveIncrement, direction, tabHeight: TAB_HEIGHT, templateElements: this.props.templateElements });
          console.log('in create_edit_document, dragElement, closeDragElement, in if selectedChoiceIdArray array ', array);
        }

        this.setTemplateHistoryArray(array, 'update');
        this.props.updateDocumentElementLocally(array);
      } // End of if (this.state.selectedTemplateElementIdArray.length > 0 || ...
    };

    const changeFont = (fontAttribute) => {
      const array = [];
      const originalValueObject = {};
      // Object to deal with naming convention differences between js and rails
      const fontKeySwitch = { fontFamily: 'font_family', fontSize: 'font_size', fontWeight: 'font_weight', fontStyle: 'font_style' };
      // If elements have been selected, apply changes to selected elements
      if (this.state.selectedTemplateElementIdArray.length > 0) {
        _.each(this.state.selectedTemplateElementIdArray, eachElementId => {
          const eachElement = !this.state.translationModeOn ? this.props.templateElements[eachElementId] : this.props.templateTranslationElements[eachElementId];
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

          if (fontAttribute === 'fontFamily') array.push({ id: eachElement.id, font_family: clickedElement.value, o_font_family: originalValueObject[eachElement.id].fontFamily, translation_element: eachElement.translation_element, action: 'update' });
          if (fontAttribute === 'fontSize') array.push({ id: eachElement.id, font_size: clickedElement.value, o_font_size: originalValueObject[eachElement.id].fontSize, translation_element: eachElement.translation_element, action: 'update' });
          if (fontAttribute === 'fontWeight') array.push({ id: eachElement.id, font_weight: elementValue, o_font_weight: originalValueObject[eachElement.id].fontWeight, translation_element: eachElement.translation_element, action: 'update' });
          if (fontAttribute === 'fontStyle') array.push({ id: eachElement.id, font_style: elementValue, o_font_style: originalValueObject[eachElement.id].fontStyle, translation_element: eachElement.translation_element, action: 'update' });
          if (fontAttribute === 'fontLarger') array.push({ id: eachElement.id, font_size: parseFloat(eachElement.font_size) < 48 ? `${parseFloat(eachElement.font_size) + 0.5}px` : eachElement.font_size, o_font_size: originalValueObject[eachElement.id].fontSize, translation_element: eachElement.translation_element, action: 'update' });
          if (fontAttribute === 'fontSmaller') array.push({ id: eachElement.id, font_size: parseFloat(eachElement.font_size) > 8 ? `${parseFloat(eachElement.font_size) - 0.5}px` : eachElement.font_size, o_font_size: originalValueObject[eachElement.id].fontSize, translation_element: eachElement.translation_element, action: 'update' });
        }); // end of each
        // If ALL elements are checked, update the newFontObject (font used for new elements creted)
        // and selectedElementFontObject font attribute values common to all checked elements
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
        } else { // if one or more but NOT ALL checked
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
      } else { // else of if selectedTemplateElementIdArray.length > 0 i.e. no elements checked
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

    const deleteElement = (elementsIdArray, translationModeOn) => {
      this.props.deleteDocumentElementLocally({ selectedTemplateElementIdArray: elementsIdArray, translationModeOn, callback: () => {} });
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
        let withoutO = '';
        _.each(lastActionArr, eachObject => {
          // const eachModified = this.getNewElementObject(each);
          const object = {};
          _.each(Object.keys(eachObject), eachKey => {
            console.log('in create_edit_document, handleTemplateElementActionClick, getOriginalAttributes, in last action create eachKey, eachKey[0] === o, eachKey[1] === _  : ', eachKey, eachKey[0] === 'o', eachKey[1] === '_');
            // if ((eachKey[0] === 'o' && eachKey[1] === eachKey[1].toUpperCase())) {
            if ((eachKey[0] === 'o' && eachKey[1] === '_')) {
              // substring is (inclusive, exclusive)
              withoutO = eachKey.substring(2, eachKey.length);
              // const newKey = withoutO[0].toLowerCase() + withoutO.substring(1);
              // console.log('in create_edit_document, handleTemplateElementActionClick, redoUndoAction, getOriginalAttributes typeof eachKey, eachKey, newKey: ', typeof eachKey, eachKey, newKey);
              // object[newKey] = eachObject[eachKey];
              object[withoutO] = eachObject[eachKey];
              console.log('in create_edit_document, handleTemplateElementActionClick, getOriginalAttributes, in last action create eachObject, eachKey, withoutO, eachObject[eachKey], eachObject[withoutO]: ', eachObject, eachKey, withoutO, eachObject[eachKey], eachObject[withoutO]);
            }
            // Let id, translation_element (for separating templateElements and templateTranslationElements)
            // and previous_value (for dealing with translation element history) in the returned object
            if (eachKey === 'id' || eachKey === 'translation_element' || eachKey === 'previous_value' || eachKey === 'value') {
              object[eachKey] = eachObject[eachKey];
            }
          });
          array.push(object);
        });
        console.log('in create_edit_document, handleTemplateElementActionClick, getOriginalAttributes, in last action create lastActionArr, array: ', lastActionArr, array);
        return array;
      };
      // if the last action taken was to craete an element,
      // if from undo action, call delete, and if redo, call create
      if (lastActionArray[0].action === 'create') {
        console.log('in create_edit_document, handleTemplateElementActionClick, redoUndoAction, in last action create lastActionArray, doWhatNow: ', lastActionArray, doWhatNow);
        if (doWhatNow === 'undo') {
          deleteElement([lastActionArray[0].id], lastActionArray[0].translation_element)
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
          // if there is previous_value in newLastAction,
          // Change back value of field; Only one change in value is made per history array
          if (newLastAction[0].previous_value) {
            const templateElement = !newLastAction[0].translation_element ? this.props.templateElements : this.props.templateTranslationElements;
            const translationOrNot = !newLastAction[0].translation_element ? '' : '+translation';
            // this.props.change is imported from redux-form
            this.props.change(`${templateElement[newLastAction[0].id].name}${translationOrNot}`, newLastAction[0].previous_value)
          }
          console.log('in create_edit_document, handleTemplateElementActionClick, redoUndoAction, in last action update lastActionArray, doWhatNow, newLastAction: ', lastActionArray, doWhatNow, newLastAction);
        } else {
          // Use lastActionArray as is [{ id: xx, left: xx, top: xx}, { id: xx, left: xx, top: xx}]
          updateElement(lastActionArray);
          console.log('in create_edit_document, handleTemplateElementActionClick, redoUndoAction, in last action update lastActionArray, doWhatNow: ', lastActionArray, doWhatNow);
          // if there is previous_value in lastActionArray,
          // Change back value of field; Only one change in value is made per history array
          if (lastActionArray[0].previous_value) {
            const templateElement = !lastActionArray[0].translation_element ? this.props.templateElements : this.props.templateTranslationElements;
            const translationOrNot = !lastActionArray[0].translation_element ? '' : '+translation';
            // this.props.change is imported from redux-form
            this.props.change(`${templateElement[lastActionArray[0].id].name}${translationOrNot}`, lastActionArray[0].value)
          }
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

          const translationModeOn = newLastAction[0].translation_element;
          deleteElement(elementsIdArray, translationModeOn);
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
          this.setState({
            // editFieldsOnPrevious for if user selects createNewTemplateElementOn when editFieldsOn
            // User does not have to turn off or on editFieldsOn each time turns on/off createNewTemplateElementOn
            editFieldsOn: !this.state.editFieldsOn,
            editFieldsOnPrevious: !this.state.editFieldsOnPrevious,
            selectedTemplateElementIdArray: []
          }, () => {
            // If user turns off editFieldsOn, turn off createNewTemplateElementOn
            if (!this.state.editFieldsOn) this.setState({ createNewTemplateElementOn: false });
            // console.log('in create_edit_document, handleTemplateElementActionClick, this.state.editFieldsOn: ', this.state.editFieldsOn);
          })
          break;
        //gotoswitchtranslation
        case 'translation':
          this.setState({
            // translationModeOn to view and create only translation objects
            translationModeOn: !this.state.translationModeOn,
            // null out object for keeping which field user wants to create
            templateFieldChoiceObject: null,
            // emplty out array keeping user's checked elements
            selectedTemplateElementIdArray: [],
            // null out object that identifies what font attributes checked elements have in commen
            selectedElementFontObject: null
          }, () => {
            // Get the translation object to render in the choice box
            const returnedObject = getTranslationObject({ object1: this.props.documentTranslationsAll.fixed_term_rental_contract_bilingual_all, object2: this.props.documentTranslationsAll.important_points_explanation_bilingual_all, action: 'categorize' })
            this.setState({
              documentTranslationsTreated: returnedObject.treatedObject,
            });
            console.log('in create_edit_document, handleTemplateElementActionClick, this.state.translationModeOn: ', this.state.translationModeOn);
          })
          break;
        // align method aligns elements and choices to a base element or choice
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
          // If translationModeOn, get templateTranslationElements, else get templateElements
          const templateElements = !this.state.translationModeOn ? this.props.templateElements : this.props.templateTranslationElements;
          _.each(templateElements, eachElement => {
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
              selectedChoiceIdArray: [],
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
              selectedElementFontObject: null,
              selectedChoiceIdArray: []
            });
            break;

        // move methods move one or more elements or choices
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
        // Expland and contract methods alters one or more elements or choices
        case 'expandVertical':
          expandContractElements(elementVal);
          break;

        case 'contractVertical':
          expandContractElements(elementVal);
          break;

        case 'expandHorizontal':
          expandContractElements(elementVal);
          break;

        case 'contractHorizontal':
          expandContractElements(elementVal);
          break;

        case 'undo':
          redoUndo(elementVal);
          break;

        case 'redo':
          redoUndo(elementVal);
          break;
        // Font elementVals sent from children of create-edit-document-font-control-box
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

  handleFieldChoiceClick(event) {
    // IMPORTANT: Logic to update array that drives object selection for template element create
    // Array is like [building, construction] which serve as the path for
    // templateMappingObject which is like { building: { construction ...}, listing: {amenities...}}
    // Each run updates array and gets templateFieldChoiceObject for rendering the current choices
    // in renderEachFieldChoice method
    // Also initializes templateElementActionIdObject if user navigates to new choice
    // Gets value of clicked link
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    let newArray = [];
    // Places value in array if empty
    if (this.state.templateFieldChoiceArray.length === 0) {
      newArray = [elementVal];
    } else {
      newArray = [...this.state.templateFieldChoiceArray];
      // If value is in array, take out everything after value index with splice method
      // if value not included, push into array
      const index = this.state.templateFieldChoiceArray.indexOf(elementVal);
      if (index !== -1) {
        newArray.splice((index + 1));
      } else {
        newArray.push(elementVal);
      }
    }
    // Null elementVal means home or root, so initialize array
    if (elementVal === null) newArray = [];

    this.setState({
      templateFieldChoiceArray: newArray,
      // Somehow, array needs to be assigned specifically like below or does not empty out
      templateElementActionIdObject: { ...INITIAL_TEMPLATE_ELEMENT_ACTION_ID_OBJECT, array: [] },
      templateElementAttributes: null
    }, () => {
      // After set state, use the array as a path for templateMappingObject to get outermost node
      this.setState({ templateFieldChoiceObject: this.getFieldChoiceObject() }, () => {
        console.log('in create_edit_document, handleFieldChoiceClick, elementVal, this.state.templateFieldChoiceArray, this.state.templateFieldChoiceObject, this.state.templateElementActionIdObject: ', elementVal, this.state.templateFieldChoiceArray, this.state.templateFieldChoiceObject, this.state.templateElementActionIdObject);
      })
    });
  }

  getFieldChoiceObject() {
    let currentObject = !this.state.translationModeOn
                        ? this.props.templateMappingObjects[this.props.agreement.template_file_name]
                        : this.state.documentTranslationsTreated;
    // Use the templateFieldChoiceArray like ['flat', 'amenities'] to get to the currentObject
    _.each(this.state.templateFieldChoiceArray, each => {
      console.log('in create_edit_document, handleFieldChoiceClick, each, this.state.templateFieldChoiceArray, currentObject: ', each, this.state.templateFieldChoiceArray, currentObject);
      if (currentObject[each]) {
        if (currentObject[each].choices && Object.keys(currentObject[each]).length > 1) {
          currentObject = currentObject[each].choices;
        } else {
          currentObject = currentObject[each];
        }
      }
    });
    console.log('in create_edit_document, handleFieldChoiceClick, before return currentObject: ', currentObject);
    return currentObject;
  }

  handleFieldChoiceActionClick(event) {
    // Get an array of unique elementIds when user clicks on action ie add button, add to select
    const getTakeOutIndex = (elementIdNoType) => {
      let takeOutIndex = -1;
      let eachNoType = null;
      let elementType = null;
      let elementTypeReturned = null;
      _.each(this.state.templateElementActionIdObject.array, (each, i) => {
        // Get a elementId without the type ie select, list, button
        eachNoType = each.split(',').slice(1).join(',');
        elementType = each.split(',')[0];
        // If there is already the same element in the array, get index to take it out
        if (eachNoType === elementIdNoType) {
          takeOutIndex = i;
          // newObject[elementType]--;
          elementTypeReturned = elementType;
        }
      }); // end of each
      return { takeOutIndex, elementTypeReturned };
    };

    const takeOutOtherTypes = (baseType, newObject) => {
      const modNewObject = newObject;
      let takeOutIndex = -1;
      let takeOutIndexArray = [];
      // let eachNoType = null;
      let elementType = null;
      let increment = null;
      // let elementTypeReturned = null;
      _.each(this.state.templateElementActionIdObject.array, (each, i) => {
        // Get a elementId without the type ie select, list, button
        // eachNoType = each.split(',').slice(1).join(',');
        elementType = each.split(',')[0];
        increment = each.split(',')[3];
        if (baseType !== elementType) {
          takeOutIndex = modNewObject.array.indexOf(each);
          takeOutIndexArray.push(takeOutIndex)
          // if (takeOutIndex !== -1) {
          //   modNewObject.array.splice(takeOutIndex, 1);
          //   modNewObject[elementType]--;
          // }
        }
        console.log('in create_edit_document, handleFieldChoiceActionClick, takeOutOtherTypes, each, baseType modNewObject: ', each, baseType, modNewObject);
      }); // end of each
      const takoutIndexArrayLength = takeOutIndexArray.length;
      if (takoutIndexArrayLength > 0) {
        let lastIndex = takoutIndexArrayLength - 1;
        _.times(takoutIndexArrayLength, i => {
          elementType = modNewObject.array[takeOutIndexArray[lastIndex]].split(',')[0];
          modNewObject.array.splice(takeOutIndexArray[lastIndex], 1);
          increment ? modNewObject[elementType] - increment : modNewObject[elementType]--;
          // modNewObject[elementType]--;
          lastIndex--;
        });
      }

      return modNewObject;
    };

    const clickedElement = event.target;
    const elementId = clickedElement.getAttribute('id');
    const elementIdArray = elementId.split(',');
    // elementType (button, input, select, list)
    let elementType = elementIdArray[0];
    // Select for true or false are given increments of 2
    // for templateElementActionIdObject select count so 'add' button gets enabled
    const increment = parseInt(elementIdArray[3], 10);
    const objectPathArray = elementIdArray.slice(1);
    const elementIdNoType = objectPathArray.join(',');
    let takeOutIndex = -1;
    let returnedObject = {};

    let newObject = { ...this.state.templateElementActionIdObject };
    // input and buttons are created with one click; others are selected and added with add link
    if (elementType !== 'input' && elementType !== 'buttons') {
      // Iterate if there is something in templateElementActionIdObject
      if (this.state.templateElementActionIdObject.array.length > 0) {
        // Get index and type of id in array with same id and different type
        returnedObject = getTakeOutIndex(elementIdNoType);
        takeOutIndex = returnedObject.takeOutIndex;
        // Take out id if included in array and increment down type
        if (takeOutIndex !== -1) newObject.array.splice(takeOutIndex, 1);
        if (returnedObject.elementTypeReturned) newObject[returnedObject.elementTypeReturned]--;
        // Get elementType of current element clicked and increment it up
        elementType = elementId.split(',')[0];
        // If increment has value, increment up the value otherwise increment just 1
        increment ? newObject[elementType] = newObject[elementType] + increment : newObject[elementType]++;
        // Push into array after iteration and taking out same id with different type
        newObject.array.push(elementId);
        // console.log('in create_edit_document, handleFieldChoiceActionClick, inside > 0 if !input !buttons elementId, elementType, newObject, this.state.templateElementActionIdObject, increment : ', elementId, elementType, newObject, this.state.templateElementActionIdObject, increment);
      } else { // else of length > 0
        // If nothing in array, push elementId
        // console.log('in create_edit_document, handleFieldChoiceActionClick, in else inside if !input !buttons elementId, elementType, newObject, this.state.templateElementActionIdObject : ', elementId, elementType, newObject, this.state.templateElementActionIdObject);
        newObject.array.push(elementId);
        // if there is an increment value (e.g. select)
        increment ? newObject[elementType] = newObject[elementType] + increment : newObject[elementType]++;
        // newObject[elementType]++;
      }
    } else { // else of if !input || !buttons
      if (elementType === 'buttons') {
        // Get index and elementType of same id with different type ie list
        // returnedObject = getTakeOutIndex(elementIdNoType);
        // takeOutIndex = returnedObject.takeOutIndex;
        // // // Take out id if included in array and increment down type
        // if (takeOutIndex !== -1) newObject.array.splice(takeOutIndex, 1);
        // if (returnedObject.elementTypeReturned) newObject[returnedObject.elementTypeReturned]--;
        newObject = takeOutOtherTypes(elementType, newObject);
      }
      console.log('in create_edit_document, handleFieldChoiceActionClick, in if elementType === buttons elementId, elementType, newObject, this.state.templateElementActionIdObject : ', elementId, elementType, newObject, this.state.templateElementActionIdObject);
      newObject.array.push(elementId);
      newObject[elementType]++;
    }
    console.log('in create_edit_document, handleFieldChoiceActionClick, test before setState after each each elementId, elementType, this.state.templateElementActionIdObject : ', elementId, elementType, this.state.templateElementActionIdObject);

    this.setState({ templateElementActionIdObject: newObject }, () => {
      console.log('in create_edit_document, handleFieldChoiceActionClick, test after setState each elementId, elementType, this.state.templateElementActionIdObject, increment: ', elementId, elementType, this.state.templateElementActionIdObject, increment);
      // if (elementType === 'select') {
      //   allObjectEach = this.props.allDocumentObjects[Documents[this.props.agreement.template_file_name].propsAllKey][allObjectKey];
      //   trueOrFalseSelect = allObjectEach && (allObjectEach.choices[true].valName === 'y' || allObjectEach.choices[0].valName === 'y');
      // }
      // console.log('in create_edit_document, handleFieldChoiceActionClick, before if clickedElement, this.props.allDocumentObjects, this.props.allDocumentObjects[this.props.agreement.template_file_name], elementIdArray, allObjectKey, this.props.agreement: ', clickedElement, this.props.allDocumentObjects, this.props.allDocumentObjects[this.props.agreement.template_file_name], elementIdArray, allObjectKey, this.props.agreement);
      // console.log('in create_edit_document, handleFieldChoiceActionClick, before if allObjectEach: ', allObjectEach);
      // NOTE: buttons plural; If input or buttons, add element
      // if (elementType === 'input' || elementType === 'buttons' || (elementType === 'select')) {
      if (elementType === 'input' || elementType === 'buttons') {
      // if (elementType === 'input' || elementType === 'buttons' || trueOrFalseSelect) {
        this.handleTemplateElementAddClick();
      }
    });
  }

  handleTemplateElementAddClick() {
    let elementIdArray = [];
    let objectPathArray = [];
    let elementType = '';
    let indexOfChoices = objectPathArray.indexOf('choices');
    let parent = null;
    let modEach = null;
    let elementIdLength = null;
    const numbers = ['0', '1', '2', '3', '4', '5', '6'];
    const summaryObject = { parent: null, input: [], select: [], button: [], buttons: [], list: [] };

    if (this.state.templateElementActionIdObject.array.length > 0) {
      _.each(this.state.templateElementActionIdObject.array, (each, i) => {
        elementIdArray = each.split(',');
        elementType = elementIdArray[0];
        objectPathArray = elementIdArray.slice(1);
        // Take out increment number 2 for select used in handleFieldChoiceActionClick
        if (objectPathArray[objectPathArray.length - 1] === '2') objectPathArray.splice(objectPathArray.length - 1, 1)
        indexOfChoices = objectPathArray.indexOf('choices');
        let currentObject = !this.state.translationModeOn
                            ?
                            this.props.templateMappingObjects[this.props.agreement.template_file_name]
                            :
                            this.state.documentTranslationsTreated;
        // let choice = null;
        _.each(objectPathArray, (eachKey, i) => {
          modEach = eachKey;
          if (numbers.indexOf(each) !== -1) modEach = parseInt(modEach, 10)
          if (i === (indexOfChoices - 1)) parent = currentObject[modEach];
          console.log('in create_edit_document, handleFieldChoiceActionClick, in each modEach, currentObject, objectPathArray: ', modEach, currentObject, objectPathArray);
          currentObject = currentObject[modEach];
        });
        summaryObject.parent = parent;
        summaryObject[elementType].push(currentObject);
        console.log('in create_edit_document, handleTemplateElementAddClick, elementIdArray, elementType, objectPathArray, currentObject, parent, indexOfChoices, summaryObject: ', elementIdArray, elementType, objectPathArray, currentObject, parent, indexOfChoices, summaryObject);
      });
    }

    let templateElementAttributes = {};
    let createdObject = null;
    // No parent in summaryObject indciates it is an input (no choices) or button (true or false)
    if (!summaryObject.parent) {
      // input only has one in array
      if (summaryObject.input.length > 0) {
        // IMPORTANT: translation field uses input to crate the templateElementAttributes
        const { translationModeOn } = this.state;
        createdObject = summaryObject.input[0];
        templateElementAttributes = {
          // id: `${this.state.templateElementCount}a`,
          id: null,
          // left, top and page assigned in getMousePosition
          name: !translationModeOn ? createdObject.name : elementIdArray[elementIdArray.length - 1],
          component: !translationModeOn ? createdObject.component : null,
          // width: createdObject.choices[0].params.width,
          width: !translationModeOn ? createdObject.choices[Object.keys(createdObject.choices)[0]].params.width : '10%',
          height: '1.6%',
          // input_type: createdObject.choices[0].params.input_type, // or 'string' if an input component
          input_type: !translationModeOn ? createdObject.choices[Object.keys(createdObject.choices)[0]].params.input_type : 'text', // or 'string' if an input component
          // class_name: createdObject.choices[0].params.class_name,
          class_name: 'document-rectangle-template',
          border_color: 'lightgray',
          font_style: this.state.newFontObject.font_style,
          font_weight: this.state.newFontObject.font_weight,
          font_family: this.state.newFontObject.font_family,
          font_size: this.state.newFontObject.font_size,
          // !!!!!!!!!If this is a translation field, assign true
          translation_element: this.state.translationModeOn
        };
      } else if (summaryObject.buttons.length > 0) {
      // } else {
        createdObject = summaryObject.buttons[0];
        templateElementAttributes = {
          // id: `${this.state.templateElementCount}a`,
          id: null,
          // left, top and page assigned in getMousePosition
          name: createdObject.name,
          component: createdObject.component,
          // component: 'DocumentChoicesTemplate',
          // width: createdObject.choices[0].params.width,
          width: createdObject.choices[Object.keys(createdObject.choices)[0]].params.width,
          height: null,
          // height: '1.6%',
          // input_type: createdObject.choices[0].params.input_type, // or 'string' if an input component
          input_type: createdObject.choices[Object.keys(createdObject.choices)[0]].params.input_type, // or 'string' if an input component
          // class_name: createdObject.choices[0].params.class_name,
          class_name: 'document-rectangle-template',
          border_color: 'lightgray',
          document_field_choices: {}
        };

        _.each(Object.keys(createdObject.choices), eachIndex => {
          templateElementAttributes.document_field_choices[eachIndex] = {
            val: createdObject.choices[eachIndex].params.val,
            top: null,
            left: null,
            width: createdObject.choices[eachIndex].params.width,
            // height: createdObject.choices[eachIndex].params.height,
            height: '1.6%',
            // class_name: createdObject.choices[eachIndex].params.class_name,
            class_name: 'document-circle-template',
            input_type: createdObject.choices[eachIndex].params.input_type,
            border_radius: '50%',
            border: '1px solid black'
          };
        });
      } else if (summaryObject.select.length > 0) {
        createdObject = summaryObject.select[0];
        const selectFirstChoice = createdObject.choices[true] || createdObject.choices[0]
        templateElementAttributes = {
          id: null,
          // left, top and page assigned in getMousePosition
          name: createdObject.name,
          component: createdObject.component,
          agreement_id: this.props.agreement.id,
          width: '10%',
          height: '1.6%',
          input_type: createdObject.input_type, // or 'string' if an input component
          // class_name: createdObject.choices[0].params.class_name,
          class_name: 'document-rectangle-template',
          border_color: 'lightgray',
          font_style: this.state.newFontObject.font_style,
          font_weight: this.state.newFontObject.font_weight,
          font_family: this.state.newFontObject.font_family,
          font_size: this.state.newFontObject.font_size,
          document_field_choices: {
            0: {
              val: 'inputFieldValue',
              top: null,
              left: null,
              // width: summaryObject.select[0].width || summaryObject.select[0].choices[0].params.width,
              width: '12%',
              // height: createdObject.choices[eachIndex].params.height,
              height: selectFirstChoice.params.height || '2.0%',
              // height: summaryObject.select[0].height || summaryObject.select[0].params.height || '2.0%',
              // class_name: createdObject.choices[eachIndex].params.class_name,
              class_name: 'document-rectangle-template-button',
              input_type: createdObject.type,
              translation: this.state.templateElementActionIdObject.translation,
              // border_radius: '3px',
              border: '1px solid black',
              selectChoices: {
                0: { value: true },
                1: { value: false }
              }
            }
          }
        };

        console.log('in create_edit_document, handleTemplateElementAddClick, summaryObject, createdObject, templateElementAttributes: ', summaryObject, createdObject, templateElementAttributes);
        // return;
      } else if (summaryObject.list.length > 0) {
        createdObject = summaryObject.list[0];
        let nameString = '';
        // If user has selected translation
        const translation = this.state.templateElementActionIdObject.translation;
        const languageCode = translation ? 'translation' : 'base';
        // listParameters for populating initialvalues in document reducer
        let listParameters = `${this.props.agreement.template_file_name},${languageCode},${createdObject.category},${createdObject.group},true,`;

        _.each(summaryObject.list, (each, i) => {
          nameString = `${each.name}`
          if (i < summaryObject.list.length - 1) nameString = `${each.name},`
          listParameters = listParameters.concat(nameString);
          console.log('in create_edit_document, handleTemplateElementAddClick, if !parent list in each summaryObject, each, listParameters: ', summaryObject, each, listParameters);
        });

        templateElementAttributes = {
          // totoaddelement
          // id: `${this.state.templateElementCount}a`,
          id: null,
          // left, top and page assigned in getMousePosition
          name: translation ? `${createdObject.group.toLowerCase()}_list_translation` : `${createdObject.group.toLowerCase()}_list`,
          // name: `${createdObject.group}_list`,
          component: createdObject.component,
          agreement_id: this.props.agreement.id,
          // component: 'DocumentChoicesTemplate',
          width: '25%',
          height: '1.6%',
          input_type: 'text', // or 'string' if an input component
          // class_name: createdObject.choices[0].params.class_name,
          class_name: 'document-rectangle-template',
          border_color: 'lightgray',
          font_style: this.state.newFontObject.font_style,
          font_weight: this.state.newFontObject.font_weight,
          font_family: this.state.newFontObject.font_family,
          font_size: this.state.newFontObject.font_size,
          list_parameters: listParameters
        };
      }
    } else { // else of if (!summaryObject.parent)
      if (summaryObject.button.length > 0 || summaryObject.select.length > 0) {
        let count = 0;
        createdObject = summaryObject.parent;
        templateElementAttributes = {
          // id: `${this.state.templateElementCount}a`,
          id: null,
          // left, top and page assigned in getMousePosition
          name: createdObject.name,
          component: createdObject.component,
          // component: 'DocumentChoicesTemplate',
          // width: createdObject.choices[0].params.width,
          width: createdObject.choices[Object.keys(createdObject.choices)[0]].params.width,
          height: null,
          input_type: createdObject.choices[Object.keys(createdObject.choices)[0]].params.input_type, // or 'string' if an input component
          // input_type: createdObject.choices[0].params.input_type, // or 'string' if an input component
          // class_name: createdObject.choices[0].params.class_name,
          class_name: 'document-rectangle-template',
          border_color: 'lightgray',
          font_style: this.state.newFontObject.font_style,
          font_weight: this.state.newFontObject.font_weight,
          font_family: this.state.newFontObject.font_family,
          font_size: this.state.newFontObject.font_size,
          document_field_choices: {}
        };

        if (summaryObject.button.length > 0) {
          _.each(summaryObject.button, each => {
            createdObject = each;
            console.log('in create_edit_document, handleTemplateElementAddClick, if parent, summaryObject.button > 0, each, summaryObject, createdObject, templateElementAttributes: ', each, summaryObject, createdObject, templateElementAttributes);
            templateElementAttributes.document_field_choices[count] = {
              val: createdObject.value || createdObject.val || createdObject.params.val,
              // val: createdObject.val,
              top: null,
              left: null,
              width: createdObject.width || createdObject.params.width,
              // height: createdObject.choices[eachIndex].params.height,
              height: createdObject.height || createdObject.params.height || '2.0%',
              // class_name: createdObject.choices[eachIndex].params.class_name,
              class_name: 'document-rectangle-template-button',
              input_type: createdObject.type || createdObject.params.input_type,
              // border_radius: '3px',
              border: '1px solid black'
            };
            count++;
          });
        }

        if (summaryObject.select.length > 0) {
          templateElementAttributes.document_field_choices[count] = {
            val: 'inputFieldValue',
            top: null,
            left: null,
            width: summaryObject.select[0].width || summaryObject.select[0].params.width,
            // height: createdObject.choices[eachIndex].params.height,
            height: summaryObject.select[0].height || summaryObject.select[0].params.height || '2.0%',
            // class_name: createdObject.choices[eachIndex].params.class_name,
            class_name: 'document-rectangle-template-button',
            input_type: createdObject.type,
            translation: this.state.templateElementActionIdObject.translation,
            // border_radius: '3px',
            border: '1px solid black',
            selectChoices: {}
          };

          let selectChoices = null;
          _.each(summaryObject.select, (each, i) => {
            // createdObject = each;
            selectChoices = templateElementAttributes.document_field_choices[count].selectChoices || templateElementAttributes.document_field_choices[count].select_choices;
            selectChoices[i] = {};
            if (each.params) {
              selectChoices[i] = { ...each.translation, val: each.params.val };
            } else {
              // _.each(Object.keys(each), eachKey => {
              //   console.log('in create_edit_document, handleTemplateElementAddClick, if button || select summaryObject, each, eachKey, each[eachKey]: ', summaryObject, each, eachKey, each[eachKey]);
              //   selectChoices[i][eachKey] = each[eachKey];
              // });
              selectChoices[i] = each;
            }
          });
        }
      } // end of  if (summaryObject.button.length > 0
      console.log('in create_edit_document, handleTemplateElementAddClick, if button || select summaryObject, createdObject, templateElementAttributes: ', summaryObject, createdObject, templateElementAttributes);
    }

    // Placeholder until create element completed.
    this.setState({
      // templateElementActionIdObject: { ...INITIAL_TEMPLATE_ELEMENT_ACTION_ID_OBJECT, array: [] },
      templateElementAttributes
    }, () => {
      console.log('in create_edit_document, handleTemplateElementAddClick, this.state.templateElementAttributes, summaryObject: ', this.state.templateElementAttributes, summaryObject);
    });
  }

  // const templateElementChoice = true;
  // let templateElementAttributes = {};
  // if (templateElementChoice) {
  //   templateElementAttributes = {
  //     id: `${this.state.templateElementCount}a`,
  //     left: `${x}%`,
  //     top: `${y}%`,
  //     page: parseInt(elementVal, 10),
  //     name: 'name',
  //     component: 'DocumentChoices',
  //     // component: 'input',
  //     width: null,
  //     height: null,
  //     // type: 'text', // or 'string' if an input component
  //     input_type: 'button', // or 'string' if an input component
  //     class_name: 'document-rectangle-template',
  //     border_color: 'lightgray',
  //     // font_style: this.state.newFontObject.font_style,
  //     // font_weight: this.state.newFontObject.font_weight,
  //     // font_family: this.state.newFontObject.font_family,
  //     // font_size: this.state.newFontObject.font_size,
  //     document_field_choices: {
  //       0: { val: 'Public Water', top: null, left: null, width: '5.5%', height: '1.6%', top_px: null, left_px: null, width_px: null, height_px: null, class_name: 'document-rectangle-template-button', border_radius: '50%', border: '1px solid black', input_type: 'button' },
  //       1: { val: 'Tank', top: null, left: null, width: '5.5%', height: '1.6%', top_px: null, left_px: null, width_px: null, height_px: null, class_name: 'document-rectangle-template-button', border_radius: '50%', border: '1px solid black', input_type: 'button' },
  //       2: { val: 'Well', top: null, left: null, width: '5.5%', height: '1.6%', top_px: null, left_px: null, width_px: null, height_px: null, class_name: 'document-rectangle-template-button', border_radius: '50%', border: '1px solid black', input_type: 'button' },
  //     }
  //   };
  //   // in get_initialvalues_object_important_points_explanation.js
  //   // 0: { params: { val: 'Public Water', top: '66.7%', left: '17.3%', width: '5.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: [], value: '' } },
  //   // 1: { params: { val: 'Tank', top: '66.7%', left: '23.3%', width: '6.5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: [], value: '' } },
  //   // 2: { params: { val: 'Well', top: '66.7%', left: '30%', width: '5%', class_name: 'document-rectangle', input_type: 'button' }, dependentKeys: { fields: [], value: '' } },
  // } else {
  //   templateElementAttributes = {
  //     id: `${this.state.templateElementCount}a`,
  //     left: `${x}%`,
  //     top: `${y}%`,
  //     page: parseInt(elementVal, 10),
  //     name: 'name',
  //     component: 'DocumentChoices',
  //     // component: 'input',
  //     width: '25%',
  //     height: '1.6%',
  //     input_type: 'text', // or 'string' if an input component
  //     class_name: 'document-rectangle-template',
  //     border_color: 'lightgray',
  //     font_style: this.state.newFontObject.font_style,
  //     font_weight: this.state.newFontObject.font_weight,
  //     font_family: this.state.newFontObject.font_family,
  //     font_size: this.state.newFontObject.font_size
  //   };
  // }

  // handleListClick() {
  //   console.log('in create_edit_document, handleListClick: ');
  // }

  renderEachTranslationFieldChoice() {
    const { documentTranslationsTreated } = this.state;
    // Get the translation object originally obtained when user clicks on the translation button
    const translationMappingObject = this.state.templateFieldChoiceObject === null ? documentTranslationsTreated : this.state.templateFieldChoiceObject;
    // const translationObject = getTranslationObject({ object1: this.props.documentTranslationsAll.fixed_term_rental_contract_bilingual_all, object2: this.props.documentTranslationsAll.important_points_explanation_bilingual_all, action: 'categorize' });
    if (translationMappingObject) {
      let choiceText = '';
      let valueString = '';
      const elementIdArray = this.state.templateElementActionIdObject.array;

      return _.map(Object.keys(translationMappingObject), eachKey => {
        // if the object of the eachKey has no translations, must be a category or group
        if (translationMappingObject[eachKey] && !translationMappingObject[eachKey].translations) {
          choiceText = AppLanguages[eachKey] ? AppLanguages[eachKey][this.props.appLanguageCode] : eachKey;
          console.log('in create_edit_document, renderEachTranslationFieldChoice, after if eachKey, translationMappingObject, translationMappingObject[eachKey], choiceText: ', eachKey, translationMappingObject, translationMappingObject[eachKey], choiceText);
          return (
            <div
              key={eachKey}
              className="create-edit-document-template-each-choice-group"
              value={eachKey}
              onClick={this.handleFieldChoiceClick}
            >
              {choiceText}&ensp;&ensp;{!translationMappingObject[eachKey].translations ? <i className="fas fa-angle-right" style={{ color: 'blue' }}></i> : ''}
            </div>
          );
        } else {
          choiceText = translationMappingObject[eachKey] ? translationMappingObject[eachKey].translations[this.props.agreement.language_code] : eachKey;
          valueString = this.state.templateFieldChoiceArray.join(',') + ',' + eachKey;

          return (
            <div
              key={eachKey}
              className="create-edit-document-template-each-choice"
              // value={valueString}
              style={{ height: '80px' }}
              // onClick={this.handleFieldChoiceClick}
            >
              <div
                className="create-edit-document-template-each-choice-label"
              >
                {choiceText}
              </div>
              <div
                className="create-edit-document-template-each-choice-action-box"
              >
                <div
                  id={'input,' + valueString}
                  onClick={this.handleFieldChoiceActionClick}
                  style={elementIdArray.indexOf('input,' + valueString) !== -1 ? { backgroundColor: 'lightgray'} : {}}
                  // className="create-edit-document-template-each-choice-action-box-button"
                >
                  Add Translation
                </div>
              </div>
            </div>
          );
        }
      });
    }
  }

  renderEachFieldChoice() {
    const elementIdArray = this.state.templateElementActionIdObject.array;
    const renderChoiceDivs = (props) => {
      const { eachIndex, valueString, choiceText } = props;
      // console.log('in create_edit_document, renderChoiceDivs, choiceText, valueString: ', choiceText, valueString);
      return (
        <div
          key={eachIndex}
          className="create-edit-document-template-each-choice"
          // value={valueString}
          style={{ height: '80px' }}
          // onClick={this.handleFieldChoiceClick}
        >
          <div
            className="create-edit-document-template-each-choice-label"
          >
            {choiceText}
          </div>
          <div
            className="create-edit-document-template-each-choice-action-box"
          >
            <div
              id={'button,' + valueString}
              onClick={this.handleFieldChoiceActionClick}
              style={elementIdArray.indexOf('button,' + valueString) !== -1 ? { backgroundColor: 'lightgray'} : {}}
              // className="create-edit-document-template-each-choice-action-box-button"
            >
              Add Button
            </div>
            <div
              id={'select,' + valueString}
              onClick={this.handleFieldChoiceActionClick}
              style={elementIdArray.indexOf('select,' + valueString) !== -1 ? { backgroundColor: 'lightgray'} : {}}
              // className="create-edit-document-template-each-choice-action-box-button"
            >
              Add to Select
            </div>
          </div>
        </div>
      );
    };

    const templateMappingObject = this.state.templateFieldChoiceObject === null ? this.props.templateMappingObjects[this.props.agreement.template_file_name] : this.state.templateFieldChoiceObject;

    let choiceText = null;
    let inputElement = null;
    let translationSibling = null;
    let choices = null;
    let choicesYesOrNo = null;
    let choicesObject = null;
    let selectChoices = null;
    let valueString = null;
    let firstChoice = null;

    if (templateMappingObject) {
      return _.map(Object.keys(templateMappingObject), eachKey => {
        // If there is a translation in AppLanguages, text comes from AppLanguages
        if (AppLanguages[eachKey]) choiceText = AppLanguages[eachKey][this.props.appLanguageCode];
        // If there is a translation object under eachKey, text become translation
        if (templateMappingObject[eachKey] && templateMappingObject[eachKey].translation) choiceText = templateMappingObject[eachKey].translation[this.props.appLanguageCode];
        // If object is a group heading such as building or tenant, list element with angle
        // to indicate, there is something behind it
        if (templateMappingObject[eachKey] && !(templateMappingObject[eachKey].component || templateMappingObject[eachKey].params)) {
          // To deal with translations of objects with one choice inputFieldValue and a selectChoices associated with it
          if (templateMappingObject[eachKey] && templateMappingObject[eachKey][eachKey] && templateMappingObject[eachKey][eachKey].translation) {
            choiceText = templateMappingObject[eachKey][eachKey].translation[this.props.appLanguageCode];
          }
          // console.log('in create_edit_document, handleFieldChoiceClick, eachKey, AppLanguages[eachKey], templateMappingObject[eachKey], templateMappingObject: ', eachKey, AppLanguages[eachKey], templateMappingObject[eachKey], templateMappingObject);
          return (
            <div
              key={eachKey}
              className="create-edit-document-template-each-choice-group"
              value={eachKey}
              onClick={this.handleFieldChoiceClick}
            >
              {choiceText}&ensp;&ensp;{!templateMappingObject[eachKey].component ? <i className="fas fa-angle-right" style={{ color: 'blue' }}></i> : ''}
            </div>
          );
        } else if (templateMappingObject[eachKey]) {
          firstChoice = templateMappingObject[eachKey].choices ? templateMappingObject[eachKey].choices[Object.keys(templateMappingObject[eachKey].choices)[0]] : null;
          // Get the type of element to distinguish which to render
          inputElement = !templateMappingObject[eachKey].params && firstChoice.params.val === 'inputFieldValue';
          // inputElement = !templateMappingObject[eachKey].params && templateMappingObject[eachKey].choices[0].params.val === 'inputFieldValue';
          choices = !templateMappingObject[eachKey].params && Object.keys(templateMappingObject[eachKey].choices).length > 1;
          choicesObject = templateMappingObject[eachKey].params;
          choicesYesOrNo = !templateMappingObject[eachKey].params && firstChoice.valName === 'y';
          // choicesYesOrNo = !templateMappingObject[eachKey].params && templateMappingObject[eachKey].choices[0].valName === 'y';
          translationSibling = !templateMappingObject[eachKey].params && templateMappingObject[eachKey].translation_sibling;
          console.log('in create_edit_document, handleFieldChoiceClick, in else if eachKey, AppLanguages[eachKey], templateMappingObject[eachKey], templateMappingObject, inputElement, choices, choicesObject, choicesYesOrNo: ', eachKey, AppLanguages[eachKey], templateMappingObject[eachKey], templateMappingObject, inputElement, choices, choicesObject, choicesYesOrNo);

          if (inputElement) {
            valueString = 'input,' + this.state.templateFieldChoiceArray.join(',') + ',' + eachKey;
            // if (translationSibling) valueString = valueString + ',' + 'translation_sibling';
            // If there is a select field in choices object render select
            selectChoices = firstChoice.selectChoices || firstChoice.select_choices;
            // selectChoices = templateMappingObject[eachKey].choices[0].selectChoices || templateMappingObject[eachKey].choices[0].select_choices;
            if (selectChoices) {
              return _.map(Object.keys(selectChoices), eachIndex => {
                valueString = this.state.templateFieldChoiceArray.join(',') + ',' + eachKey + ',choices,0' + ',selectChoices,' + eachIndex;
                choiceText = selectChoices[eachIndex][this.props.appLanguageCode]
                return renderChoiceDivs({ eachIndex, valueString, choiceText });
              });
            }

            return (
              <div
                key={eachKey}
                className="create-edit-document-template-each-choice"
                style={templateMappingObject[eachKey].extraHeightTemplate ? { height: '70px' } : {}}
              >
                <div
                  className="create-edit-document-template-each-choice-label"
                  style={templateMappingObject[eachKey].extraHeightTemplate ? { marginBottom: '10px' } : {}}
                >
                  {choiceText}
                </div>
                <div
                  className="create-edit-document-template-each-choice-action-box"
                >
                  <div
                    id={valueString}
                    onClick={this.handleFieldChoiceActionClick}
                  >
                    Add Input
                  </div>
                  <div
                    id={valueString + ',translation_sibling'}
                    style={!translationSibling ? { border: 'none' } : {}}
                    onClick={this.handleFieldChoiceActionClick}
                  >
                  {translationSibling ? 'Add Translation' : ''}</div>
                </div>
              </div>
            );
          } // End of if inputElement

          // Case of field being choices but not Yes or No choices
          // console.log('in create_edit_document, handleFieldChoiceClick, eachKey, in if choices not yes or no templateMappingObject[eachKey], templateMappingObject, choices, choicesYesOrNo: ', eachKey, templateMappingObject[eachKey], templateMappingObject, choices, choicesYesOrNo);
          if (choicesObject && !choicesYesOrNo) {
            // receivs eachKey of 0, 1 of templateMappingObject is {0=>{}, 1=>{}}
            // console.log('in create_edit_document, handleFieldChoiceClick, eachKey, in if choices not yes or no eachKey, this.state.templateFieldChoiceArray, templateMappingObject: ', eachKey, this.state.templateFieldChoiceArray, templateMappingObject);
            selectChoices = templateMappingObject[eachKey].selectChoices || templateMappingObject[eachKey].select_choices;
            choiceText = templateMappingObject[eachKey].translation ? templateMappingObject[eachKey].translation[this.props.appLanguageCode] : templateMappingObject[eachKey].params.val;
            if (selectChoices) {
              return _.map(Object.keys(selectChoices), eachIndex => {
                valueString = this.state.templateFieldChoiceArray.join(',') + ',choices,' + eachKey + ',selectChoices,' + eachIndex;
                choiceText = selectChoices[eachIndex][this.props.appLanguageCode]
                return renderChoiceDivs({ eachIndex, valueString, choiceText });
              });
            } else if (!templateMappingObject[eachKey].nonTemplate) {
              valueString = this.state.templateFieldChoiceArray.join(',') + ',choices,' + eachKey;
              // Render choice divs that are not select
              return renderChoiceDivs({ eachIndex: eachKey, valueString, choiceText })
            }
          }

          // console.log('in create_edit_document, handleFieldChoiceClick, eachKey, templateMappingObject[eachKey], templateMappingObject, choices, choicesYesOrNo: ', eachKey, templateMappingObject[eachKey], templateMappingObject, choices, choicesYesOrNo);
          // For yes or now (true, false) fields such as amenities
          // IMPORTANT: Note that id has 'buttons' (plural)
          if (choices && choicesYesOrNo) {
            choiceText = templateMappingObject[eachKey].translation ? templateMappingObject[eachKey].translation[this.props.appLanguageCode] : templateMappingObject[eachKey].params.val;
            valueString = this.state.templateFieldChoiceArray.join(',') + ',' + eachKey;
            return (
              <div
                key={eachKey}
                className="create-edit-document-template-each-choice"
                value={eachKey}
                style={templateMappingObject[eachKey].extraHeightTemplate ? { height: '70px' } : {}}
                // onClick={this.handleFieldChoiceClick}
              >
                <div
                  className="create-edit-document-template-each-choice-label"
                  style={templateMappingObject[eachKey].extraHeightTemplate ? { marginBottom: '10px' } : {}}
                >
                  {choiceText}
                </div>
                <div
                  className="create-edit-document-template-each-choice-action-box"
                >
                  <div
                    id={'buttons,' + valueString}
                    onClick={this.handleFieldChoiceActionClick}
                    style={elementIdArray.indexOf('buttons,' + valueString) !== -1 ? { backgroundColor: 'lightgray' } : {}}
                  >
                    Add Buttons
                  </div>
                  {this.state.templateFieldChoiceArray.indexOf('amenities') !== -1
                    ?
                    <div
                      id={'list,' + valueString}
                      onClick={this.handleFieldChoiceActionClick}
                      style={elementIdArray.indexOf('list,' + valueString) !== -1 ? { backgroundColor: 'lightgray'} : {}}
                    >
                      Add to List
                    </div>
                    :
                    <div
                      id={'select,' + valueString + ',2'}
                      onClick={this.handleFieldChoiceActionClick}
                      style={elementIdArray.indexOf('select,' + valueString) !== -1 ? { backgroundColor: 'lightgray'} : {}}
                      // className="create-edit-document-template-each-choice-action-box-button"
                    >
                      Add Select
                    </div>
                }
                </div>
              </div>
            );
          }

          if (!templateMappingObject[eachKey].nonTemplate) {
            // for keys such as dates with years, month and day behind it
            // valueString = this.state.templateFieldChoiceArray.join(',') + ',' + eachKey;
            console.log('in create_edit_document, handleFieldChoiceClick, in if (!templateMappingObject[eachKey].nonTemplate eachKey, choiceText, templateMappingObject, templateMappingObject[eachKey]: ', eachKey, choiceText, templateMappingObject, templateMappingObject[eachKey]);
            // To place a button for creating a list along with a nav div (click through)
            if (templateMappingObject[eachKey].button_on_field_choice_nav) {
              valueString = this.state.templateFieldChoiceArray.join(',') + ',' + eachKey;
              return (
                <div
                  className="create-edit-document-template-each-choice-action-box-nav"
                >
                  <div
                    key={eachKey}
                    className="create-edit-document-template-each-choice-group"
                    value={eachKey}
                    onClick={this.handleFieldChoiceClick}
                    style={{ borderBottom: 'none' }}
                  >
                    {choiceText}&ensp;&ensp;<i className="fas fa-angle-right" style={{ color: 'blue' }}></i>
                  </div>
                  <div
                    id={'list,' + valueString}
                    onClick={this.handleFieldChoiceActionClick}
                    style={elementIdArray.indexOf('list,' + valueString) !== -1 ? { backgroundColor: 'lightgray' } : {}}
                    // className="create-edit-document-template-each-choice-group"
                  >
                    Add to List
                  </div>
                </div>
              );
            }

            return (
              <div
                key={eachKey}
                className="create-edit-document-template-each-choice-group"
                value={eachKey}
                onClick={this.handleFieldChoiceClick}
              >
                {choiceText}&ensp;&ensp;<i className="fas fa-angle-right" style={{ color: 'blue' }}></i>
              </div>
            );
          }
        }
      });
    }
  }

  renderEachFieldControlButton() {
    let currentObject = this.props.templateMappingObjects[this.props.agreement.template_file_name];
    let choiceText = null;
    return _.map(this.state.templateFieldChoiceArray, eachKey => {
      if (currentObject[eachKey] && currentObject[eachKey].translation) {
        choiceText = currentObject[eachKey].translation[this.props.appLanguageCode];
      } else {
        choiceText = AppLanguages[eachKey] ? AppLanguages[eachKey][this.props.appLanguageCode] : eachKey;
      }
      currentObject = currentObject[eachKey];
      return (
        <div
          key={eachKey}
          className="create-edit-document-template-edit-field-box-controls-navigate-each"
          value={eachKey}
          onClick={this.handleFieldChoiceClick}
        >
         {choiceText}
        </div>
      );
    });
  }

  handleFieldPreferencesClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in create_edit_document, handleFieldPreferencesClick, elementVal, this: ', elementVal, this);
    const newObject = { ...this.state.templateElementActionIdObject, [elementVal]: !this.state.templateElementActionIdObject[elementVal] };
    this.setState({ templateElementActionIdObject: newObject }, () => {
      console.log('in create_edit_document, handleFieldPreferencesClick, elementVal, this.state.templateElementActionIdObject: ', elementVal, this.state.templateElementActionIdObject);
    });
  }

  renderFieldBoxControls() {
    // 1) Enable "add" button if there are more than 1 select buttons selected
    // (or if a one-click select is selected)
    // 2) Enable if 1 or more button selected and more than 1 select selected
    // OR if more than 1 button selected and more than 1 select OR 0 select selected
    // 3) Enable if 1 or more list selected
    // disable "add" if there is a value for tempalteElementAttributes
    // disableTranslation if there is alread a templateElementAttributes
    // or if there are list or selected AND translation is true for templateElementActionIdObject
    const selectOk = this.state.templateElementActionIdObject.select > 1;
    const buttonOk = (this.state.templateElementActionIdObject.button > 0 && this.state.templateElementActionIdObject.select > 1)
                      ||
                      (this.state.templateElementActionIdObject.button > 1
                        && (this.state.templateElementActionIdObject.select > 1 || this.state.templateElementActionIdObject.select === 0));
    const listOk = this.state.templateElementActionIdObject.list > 0;
    const enableAdd = (selectOk || buttonOk || listOk) && !this.state.templateElementAttributes;
    const disableTranslation = ((this.state.templateElementActionIdObject.list > 0 || this.state.templateElementActionIdObject.select > 0) && this.state.templateElementActionIdObject.translation) || this.state.templateElementAttributes;
    // console.log('in create_edit_document, renderFieldBoxControls, this.state.actionExplanation, selectOk, enableAdd, disableTranslation: ', selectOk, enableAdd, disableTranslation);

    return (
      <div className="create-edit-document-template-edit-field-box-controls">
        <div className="create-edit-document-template-edit-field-box-controls-navigate">
          <div
            className="create-edit-document-template-edit-field-box-controls-navigate-each-icon"
            value={null}
            onClick={this.handleFieldChoiceClick}
          >
            <i className="fas fa-home"></i>
          </div>
          {this.renderEachFieldControlButton()}
        </div>
        <div className="create-edit-document-template-edit-field-box-controls-action">
          {this.state.templateElementActionIdObject.list > 0 || this.state.templateElementActionIdObject.select > 0
            ?
            <div
              className="create-edit-document-template-edit-field-box-controls-action-button"
              onClick={this.handleFieldPreferencesClick}
              value={'translation'}
              style={disableTranslation ? { color: 'gray' } : { color: 'blue' }}
            >
              Translation
            </div>
            :
            ''
          }
          <div
            className="create-edit-document-template-edit-field-box-controls-action-button"
            onClick={enableAdd ? this.handleTemplateElementAddClick : () => {}}
            style={enableAdd ? {} : { color: 'gray' }}
          >
            Add
          </div>
        </div>
      </div>
    );
  }

  renderTemplateEditFieldBox() {
    return (
      <div className="create-edit-document-template-edit-field-box">
        {this.renderFieldBoxControls()}
        <div className="create-edit-document-template-edit-field-box-choices">
          {this.state.translationModeOn ? this.renderEachTranslationFieldChoice() : this.renderEachFieldChoice()}
        </div>
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
        // console.log('in create_edit_document, setExplanationTimer, subTimer > 0: ', subTimer);
      } else {
        // when subtimer is 0, assign typing timer at 0
        subTimer = 0;
        // console.log('in create_edit_document, setExplanationTimer, subTimer == 0: ', subTimer);
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

  // gets the font attributes of checked elements
  getSelectedFontElementAttributes() {
    // gotofont
    // getCheckElementFontObject
    const findIfHasSelectChoice = (element) => {
      let hasSelectChoice = false;
      _.each(Object.keys(element.document_field_choices), eachIndex => {
        if (element.document_field_choices[eachIndex].val === 'inputFieldValue') hasSelectChoice = true;
      });
      return hasSelectChoice;
    };

    const object = { font_family: {}, font_size: {}, font_weight: {}, font_style: {} };
    let eachElement = null;
    let elementWithInputOrSelect = false;
    const selectObject = {};
    // Go through each element checked
    if (this.state.selectedTemplateElementIdArray.length > 0) {
      _.each(this.state.selectedTemplateElementIdArray, eachId => {
        // Get element from id;
        // Go through each attribute in object;
        // Get an array of ids for each type of font_family, font_size etc.
        eachElement = !this.state.translationModeOn ? this.props.templateElements[eachId] : this.props.templateTranslationElements[eachId];
        // console.log('in create_edit_document, getSelectedFontElementAttributes, eachElement: ', eachElement);
        elementWithInputOrSelect = !eachElement.document_field_choices || (eachElement.document_field_choices && findIfHasSelectChoice(eachElement));
        // If element is an input element or has a select choice (only element that matter for fonts)
        // populate object; eachKey is font_family, font_size etc
        // Will look like fontFamily: { arial: [id], times: [id] }
        if (elementWithInputOrSelect) {
          _.each(Object.keys(object), eachKey => {
            if (!object[eachKey][eachElement[eachKey]]) {
              object[eachKey][eachElement[eachKey]] = [];
              object[eachKey][eachElement[eachKey]].push(eachElement.id);
            } else {
              object[eachKey][eachElement[eachKey]].push(eachElement.id);
            }
          }); // end of each object keys
        } // end of if elementWithInputOrSelect
      }); // end of each state.selectedTemplateElementIdArray

      // let objectLength = 0;
      let selectValueArray = [];
      // Go through each attribute in object created above
      // Get the number of fonts actually used in document fontFamily: { arial: [id], times: [id] }
      // would be 2
      _.each(Object.keys(object), eachFontAttribute => {
        // Get an array of actual fonts used in selected elements
        // selectValueArray Could look like [arial, times]
        selectValueArray = Object.keys(object[eachFontAttribute]);
        // create an object like { fontFamily: null } to be filled out later
        selectObject[eachFontAttribute] = null;
        // If there is only one value or say one font style in selectValueArray array
        if (selectValueArray.length === 1) {
          // selectObject will now look like { fontFamily: 'arial' } if there is only one
          selectObject[eachFontAttribute] = selectValueArray[0];
        }
      });
    }
    // this.state.selectedElementFontObject looks like { fontFamily: 'arial' }
    console.log('in create_edit_document, getSelectedFontElementAttributes, object, selectObject: ', object, selectObject);
    this.setState({ selectedElementFontObject: _.isEmpty(selectObject) ? null : selectObject });
    return { object, selectObject };
  }

  setFontControlBoxValues() {
    // if selectedElementFontObject is null (i.e. no elements checked), assigns the newFontObject
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
           fontWeight.style.fontWeight = 'bold';
         } else {
           // fontWeight.style.border = '1px solid #ccc'
           fontWeight.style.fontWeight = 'normal';
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

  renderChoiceOrElementButtons(props) {
    const { templateElementsLength, elementsChecked, choicesChecked, onlyFontAttributeObject } = props;
    const elementDivActionButtonArray = [
      <div
        key={1}
        className="create-edit-document-template-edit-action-box-elements"
        // onMouseOver={this.handleMouseOverActionButtons}
        name="Make font larger,bottom"
      >
        <i
          onMouseOver={this.handleMouseOverActionButtons}
          value="fontLarger"
          onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          style={{ color: elementsChecked && !choicesChecked ? 'blue' : 'gray' }}
          name="Make font larger,bottom"
          className="fas fa-font"
        >
        </i>
        <i name="Make font larger,bottom" style={{ color: elementsChecked && !choicesChecked ? 'blue' : 'gray' }} className="fas fa-sort-up"></i>
      </div>,
      <div
        key={2}
        className="create-edit-document-template-edit-action-box-elements"
        // onMouseOver={this.handleMouseOverActionButtons}
        name="Make font smaller,bottom"
      >
        <i
          onMouseOver={this.handleMouseOverActionButtons}
          onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          value="fontSmaller"
          name="Make font smaller,bottom"
          style={{ fontSize: '12px', padding: '3px', color: elementsChecked && !choicesChecked ? 'blue' : 'gray' }}
          className="fas fa-font"
        >
        </i>
        <i className="fas fa-sort-down" style={{ color: elementsChecked && !choicesChecked ? 'blue' : 'gray' }}></i>
      </div>,
      <div
        key={3}
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
    ];

    const choiceDivActionButtonArray = [
      <div
        key={1}
        className="create-edit-document-template-edit-action-box-elements"
        name="Expand horizontally,bottom"
        value="expandHorizontal"
      >
        <i
          name="Expand horizontally,bottom"
          value="expandHorizontal"
          style={{ color: choicesChecked ? 'blue' : 'gray',  width: '14px' }}
          onClick={choicesChecked ? this.handleTemplateElementActionClick : () => {}}
          onMouseDown={choicesChecked ? this.handleTemplateChoiceActionMouseDown : () => {}}
          onMouseOver={this.handleMouseOverActionButtons}
          className="fas fa-angle-left"
        >
        </i>
        <i
          name="Expand horizontally,bottom"
          value="expandHorizontal"
          style={{ color: choicesChecked ? 'blue' : 'gray',  width: '14px' }}
          onClick={choicesChecked ? this.handleTemplateElementActionClick : () => {}}
          onMouseDown={choicesChecked ? this.handleTemplateChoiceActionMouseDown : () => {}}
          className="fas fa-angle-right"
        >
        </i>
      </div>,
      <div
        key={2}
        className="create-edit-document-template-edit-action-box-elements"
        name="Contract horizontally,bottom"
        value="constractHorizontal"
      >
        <i
          name="Contract horizontally,bottom"
          value="contractHorizontal"
          style={{ color: choicesChecked ? 'blue' : 'gray', width: '14px' }}
          onClick={choicesChecked ? this.handleTemplateElementActionClick : () => {}}
          onMouseDown={choicesChecked ? this.handleTemplateChoiceActionMouseDown : () => {}}
          onMouseOver={this.handleMouseOverActionButtons}
          className="fas fa-angle-right"
        >
        </i>
        <i
          name="Contract horizontally,bottom"
          value="contractHorizontal"
          style={{ color: choicesChecked ? 'blue' : 'gray', width: '14px' }}
          onClick={choicesChecked ? this.handleTemplateElementActionClick : () => {}}
          onMouseDown={choicesChecked ? this.handleTemplateChoiceActionMouseDown : () => {}}
          className="fas fa-angle-left"
        >
        </i>
      </div>,
      <div
        key={3}
        className="create-edit-document-template-edit-action-box-elements"
        name="Expand vertically,bottom"
        value="expandVertical"
        style={{ padding: '2px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <i
            name="Expand vertically,bottom"
            value="expandVertical"
            style={{ color: choicesChecked ? 'blue' : 'gray', height: '12px' }}
            onClick={choicesChecked ? this.handleTemplateElementActionClick : () => {}}
            onMouseDown={choicesChecked ? this.handleTemplateChoiceActionMouseDown : () => {}}
            onMouseOver={this.handleMouseOverActionButtons}
            className="fas fa-angle-up"
            >
          </i>
          <i
            name="Expand vertically,bottom"
            value="expandVertical"
            style={{ color: choicesChecked ? 'blue' : 'gray', height: '12px' }}
            onClick={choicesChecked ? this.handleTemplateElementActionClick : () => {}}
            onMouseDown={choicesChecked ? this.handleTemplateChoiceActionMouseDown : () => {}}
            onMouseOver={this.handleMouseOverActionButtons}
            className="fas fa-angle-down"
            >
          </i>
        </div>
      </div>,
      <div
        key={4}
        className="create-edit-document-template-edit-action-box-elements"
        name="Contract vertically,bottom"
        value="contractVertical"
        style={{ padding: '2px'}}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <i
            name="Contract vertically,bottom"
            value="contractVertical"
            style={{ color: choicesChecked ? 'blue' : 'gray', height: '12px' }}
            onClick={choicesChecked ? this.handleTemplateElementActionClick : () => {}}
            onMouseDown={choicesChecked ? this.handleTemplateChoiceActionMouseDown : () => {}}
            onMouseOver={this.handleMouseOverActionButtons}
            className="fas fa-angle-down"
            >
          </i>
          <i
            name="Contract vertically,bottom"
            value="contractVertical"
            style={{ color: choicesChecked ? 'blue' : 'gray', height: '12px' }}
            onClick={choicesChecked ? this.handleTemplateElementActionClick : () => {}}
            onMouseDown={choicesChecked ? this.handleTemplateChoiceActionMouseDown : () => {}}
            onMouseOver={this.handleMouseOverActionButtons}
            className="fas fa-angle-up"
          >
          </i>
        </div>
      </div>
    ];

    return this.state.selectedChoiceIdArray.length > 0 ? choiceDivActionButtonArray : elementDivActionButtonArray
  }

  renderTemplateElementEditAction() {
    // Define all button conditions for enabling and disabling buttons
    const templateElementsLength = !this.state.translationModeOn ? Object.keys(this.props.templateElements).length : Object.keys(this.props.templateTranslationElements).length
    const elementsChecked = this.state.selectedTemplateElementIdArray.length > 0 || this.state.selectedChoiceIdArray.length > 0;
    const choicesChecked = this.state.selectedChoiceIdArray.length > 0;
    const multipleElementsChecked = this.state.selectedTemplateElementIdArray.length > 1;
    const multipleChoicesChecked = this.state.selectedChoiceIdArray.length > 1;
    // NOTE: disableSave does not work after saving since initialValues have to be updated
    const disableSave = !this.props.templateElements || (_.isEmpty(this.state.modifiedPersistedElementsObject) && !this.props.formIsDirty) || this.state.selectedTemplateElementIdArray.length > 0 || this.state.createNewTemplateElementOn;
    const disableCheckAll = !this.state.editFieldsOn || (templateElementsLength < 1) || this.state.allElementsChecked || this.state.createNewTemplateElementOn;
    const disableCreateNewElement = this.state.createNewTemplateElementOn || this.state.selectedTemplateElementIdArray.length < 1;
    const enableUndo = (this.state.templateEditHistoryArray.length > 0 && this.state.historyIndex > -1) && !this.state.createNewTemplateElementOn;
    const enableRedo = (this.state.templateEditHistoryArray.length > 0 && this.state.historyIndex !== this.state.templateEditHistoryArray.length - 1) && !this.state.createNewTemplateElementOn;
    // if this.props.onlyFontAttributeObject is not null, use this.props.onlyFontAttributeObject
    let onlyFontAttributeObject = this.state.selectedElementFontObject ? this.state.selectedElementFontObject : this.state.newFontObject;
    const disableEditFields = templateElementsLength < 1 || this.state.editFieldsOn;
    const disableTranslation = this.state.translationModeOn;
    // const object = {
    //   newField: {
    //     wrapper: {
    //       onClick: disableCreateNewElement ? this.handleCreateNewTemplateElement : () => {},
    //       style: this.state.createNewTemplateElementOn ? { backgroundColor: 'lightgray' } : { color: this.state.selectedTemplateElementIdArray.length > 0 ? 'gray' : 'blue' },
    //       onMouseOver: this.handleMouseOverActionButtons,
    //       name: 'Create a new field,top'
    //     },
    //     children: [
    //       {
    //         // value
    //         tag: 'i',
    //         name: 'Create a new field,top',
    //         className: 'fas fa-plus-circle'
    //       }
    //     ]
    //   }
    // };
    //
    // const classNameForAll = 'create-edit-document-template-edit-action-box-elements';
    //
    // const createButtons = () => {
    //   function renderChildren(children, value) {
    //     return _.map(children, eachChild => {
    //       if (eachChild.tag === 'i') {
    //         return (
    //           <i
    //             name={eachChild.name}
    //             className={eachChild.className}
    //             value={value}
    //           ></i>
    //         );
    //       }
    //     });
    //   }
    //   return _.map(Object.keys(object), each => {
    //     return (
    //       <div
    //         className={classNameForAll}
    //         onClick={object[each].onClick}
    //         style={object[each].style}
    //         name={object[each].name}
    //       >
    //         {renderChildren(object[each].children, each)}
    //       </div>
    //     )
    //   })
    // };

    // {createButtons()}
    console.log('in create_edit_document, renderTemplateElementEditAction, this.props.formIsDirty : ', this.props.formIsDirty);
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
          onClick={this.handleTemplateElementActionClick}
          style={{ color: disableTranslation ? 'gray' : 'blue', backgroundColor: disableTranslation ? 'lightgray' : '' }}
          onMouseOver={this.handleMouseOverActionButtons}
          name="Work on translations,top"
          value="translation"
        >
          <i value="translation" name="Work on translations,top" className="fas fa-language" style={{ fontSize: '20px', padding: '3.5px 0 0 1px' }}></i>
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
            onClick={elementsChecked || choicesChecked ? this.handleTemplateElementActionClick : () => {}}
          >
          </i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          // onClick={templateElementsLength > 0 && this.state.selectedTemplateElementIdArray.length > 0 ? this.handleTemplateElementActionClick : () => {}}
          value="moveRight"
          name="Move fields right,top"
        >
          <i
            value="moveRight"
            name="Move fields right,top"
            onMouseOver={this.handleMouseOverActionButtons}
            style={{ color: elementsChecked ? 'blue' : 'gray' }}
            className="fas fa-angle-right"
            onClick={elementsChecked || choicesChecked ? this.handleTemplateElementActionClick : () => {}}
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
            onClick={elementsChecked || choicesChecked ? this.handleTemplateElementActionClick : () => {}}
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
            onClick={elementsChecked || choicesChecked ? this.handleTemplateElementActionClick : () => {}}
          >
          </i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={elementsChecked && !choicesChecked ? this.handleTrashClick : () => {}}
          name="Throw away field,top"
          value="trash"
        >
          <i onMouseOver={this.handleMouseOverActionButtons} style={{ color: elementsChecked && !choicesChecked ? 'blue' : 'gray' }} name="Throw away field,top" className="far fa-trash-alt"></i>
        </div>
        {this.renderChoiceOrElementButtons({ templateElementsLength, elementsChecked, choicesChecked, onlyFontAttributeObject })}
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={() => {}}
          name="This button empty,bottom"
          value="emptyButton"
          onMouseOver={this.handleMouseOverActionButtons}
          // <i value="emptyButton" name="This button empty,bottom" style={{ color: 'gray'}} onMouseOver={this.handleMouseOverActionButtons} className="fas fa-arrows-alt-h"></i>
        >
        </div>

        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={multipleElementsChecked || multipleChoicesChecked ? this.handleTemplateElementActionClick : () => {}}
          name="Align field width,bottom"
          value="alignWidth"
        >
          <i value="alignWidth" name="Align field width,bottom" style={{ color: multipleElementsChecked || multipleChoicesChecked ? 'blue' : 'gray' }} onMouseOver={this.handleMouseOverActionButtons} className="fas fa-arrows-alt-h"></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          onClick={multipleElementsChecked || multipleChoicesChecked ? this.handleTemplateElementActionClick : () => {}}
          name="Align field height,bottom"
          value="alignHeight"
        >
          <i value="alignHeight" name="Align field height,bottom" style={{ color: multipleElementsChecked || multipleChoicesChecked ? 'blue' : 'gray' }} onMouseOver={this.handleMouseOverActionButtons} className="fas fa-arrows-alt-v"></i>
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

  renderDocumentName(page) {
    return (
      <div
        className="create-edit-document-document-name-and-pages"
      >
        {`< ${this.props.agreement.document_name}   `} (page: {` ${page} of ${this.props.agreement.document_pages}) >`}
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
              {this.props.showTemplate ? this.renderTemplateTranslationElements(page) : ''}
              {this.props.showTemplate ? this.renderDocumentName(page) : ''}
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
      if (!_.isEmpty(this.props.templateElements)) this.props.setTemplateElementsObject({ templateElements: {}, templateElementsByPage: {} })
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
    // !!!!!!!!IMPORTANT! initialValues populates forms with data in backend database
    // parameters sent as props to functions/xxx.js methods
    const agreements = state.bookingData.fetchBookingData.agreements;
    // IMPORTANT: Somehow, list initial values in createDocumentElementLocally come up undefined
    // so created state prop listInitialValuesObject which gets passed so merge with setInitialValuesObject here
    // const newObject = { name: 'Jackie' };
    // if (!_.isEmpty(state.documents.listInitialValuesObject)) {
    //   initialValues = _.merge(newObject, state.documents.initialValuesObject, state.documents.listInitialValuesObject);
    // } else {
    //   initialValues = newObject;
    // }
    initialValues = state.documents.initialValuesObject;
    // initialValues = { ...state.documents.initialValuesObject, name: 'Jackie' };
    console.log('in create_edit_document, mapStateToProps, state.documents.documentTranslations: ', state.documents.documentTranslations);
    // initialValues = { name: 'Jackie' };
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
      // documentTranslationsAll has both fixed and important points translation all objects
      documentTranslationsAll: state.documents.documentTranslations,
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
      // documentTranslationsTreated: state.documents.documentTranslationsTreated,
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
      // fixedTermRentalContractBilingualAll: state.bookingData.fixedTermRentalContractBilingualAll,
      // meta is for getting touched, active and visited for initialValue key
      // meta: getFormMeta('CreateEditDocument')(state)
      // testDocumentTranslations: state.documents.documentTranslations,
      templateMappingObjects: state.documents.templateMappingObjects,
      // documentTranslationsAll: state.documents.documentTranslations,
      allDocumentObjects: state.documents.allDocumentObjects,
      documentConstants: state.documents.documentConstants,
      templateTranslationElements: state.documents.templateTranslationElements,
      templateTranslationElementsByPage: state.documents.templateTranslationElementsByPage,
      documentTranslationsAllInOne: state.documents.documentTranslationsAllInOne,
      valuesInForm: state.form.CreateEditDocument && state.form.CreateEditDocument.values ? state.form.CreateEditDocument.values : {},
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
