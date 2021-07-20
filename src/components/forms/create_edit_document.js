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
import GlobalConstants from '../constants/global_constants';

import DocumentChoices from './document_choices';
import DocumentChoicesTemplate from './document_choices_template';
import DefaultMainInsertFieldsObject from '../constants/default_main_insert_fields';
import GetFieldValueChoiceModal from '../modals/get_field_value_choice_modal';
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
import getElementLabel from '../functions/get_element_label';
import getDocumentFieldsWithSameName from '../functions/get_document_fields_with_same_name';
import getSelectedFieldObject from '../functions/get_selected_field_object';
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

// let scrollCount = 0
let scrollingTimer = 0
let moveElementClickingTimer = 0

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
      getFieldValues: false,
      selectedGetFieldValueChoiceArray: [],
      getFieldValuesCompletedArray: false,
      originalValuesExistForSelectedFields: false,
      getSelectDataBaseValues: false,
      findIfDatabaseValuesExistForFields: false,
      databaseValuesExistForFields: false,
      showCustomInputCreateMode: false,
      customFieldNameInputValue: '',
      documentPagesObject: { documentPagesArray: [], prevPagesInViewport: [], pagesInViewport: [1], parentOfAlldocumentPages: null, documentPagesMapAgainstParent: {} },
      moveIncrement: 0
      // editActionBoxCallForActionObject: { top: 0, left: 0, message: '', value: null },
      // importFieldsFromOtherDocumentsObject: [],
    };

    // this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
    this.handleEditClickTemplate = this.handleEditClickTemplate.bind(this);
    this.handleViewPDFClickTemplate = this.handleViewPDFClickTemplate.bind(this);
    this.handleFieldChoiceMouseOver = this.handleFieldChoiceMouseOver.bind(this);
    this.handleGetValueChoiceClick = this.handleGetValueChoiceClick.bind(this);
    this.handleCloseGetFieldValuesChoiceBox = this.handleCloseGetFieldValuesChoiceBox.bind(this);
    this.handleCustomFieldNameInput = this.handleCustomFieldNameInput.bind(this);
    this.handleCustomFieldPathDelete = this.handleCustomFieldPathDelete.bind(this);
    this.handleOverlayClickBox = this.handleOverlayClickBox.bind(this);
    this.handleDocumentTabClick = this.handleDocumentTabClick.bind(this);
    this.handleDocumentScroll = this.handleDocumentScroll.bind(this);
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
    // ************ Code for when user scrolls on document **********
    // Maps each page location relative to parent and when user scrolls,
    // handleDocumentScroll gets the parent bounds relative to the viewport
    // and calculates if each page is in the viewport
      window.addEventListener('scroll', this.handleDocumentScroll);
      const documentPagesArray = document.getElementsByClassName('image-pdf-jpg-background')
      const parentOfAlldocumentPages = document.getElementsByClassName('test-image-pdf-jpg')[0]
      const parentBoundingClientRect = parentOfAlldocumentPages.getBoundingClientRect()
      let eachPageBoundingClientRect = null;
      const documentPagesMapAgainstParent = {};

      _.each(documentPagesArray, eachPageObject => {
        eachPageBoundingClientRect = eachPageObject.getBoundingClientRect();
        // Create object mapped by page number with dimensions relative to parent
        documentPagesMapAgainstParent[parseInt(eachPageObject.getAttribute('value'), 10)] = {
          top: eachPageBoundingClientRect.top - parentBoundingClientRect.top,
          bottom: eachPageBoundingClientRect.bottom - parentBoundingClientRect.top,
        };
      });

      this.setState({ documentPagesObject: { ...this.state.documentPagesObject, documentPagesArray, parentOfAlldocumentPages, documentPagesMapAgainstParent } }, () => {

      });

    const getRestOfDocumentFieldsForAgreement = (localHistory) => {
      // ************ Code for caching rest of document_fields for agreement **********
      // standard documents are already cached
      console.log('in create_edit_document, componentDidMount, before cacheDocumentFieldsForRestOfPages, this.props.agreement, this.props.templateElementsByPage, localHistory: ', this.props.agreement, this.props.templateElementsByPage, localHistory);
      // if (!this.props.agreement.standard_document) this.props.cacheDocumentFieldsForRestOfPages(this.props.agreementId);
      const getDocumentFieldsPagesArray = () => {
        const arrayReturned = [];
        _.each(this.props.agreement.document_fields, eachDF => {
          if (arrayReturned.indexOf(eachDF.page) === -1) arrayReturned.push(eachDF.page);
        });
        return arrayReturned;
      };

      const documentFieldsPagesAlreadyReceivedArray = this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreementId]
                                                      ?
                                                      Object.keys(this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreementId])
                                                      :
                                                      getDocumentFieldsPagesArray();

      this.props.cacheDocumentFieldsForRestOfPages(this.props.agreementId, documentFieldsPagesAlreadyReceivedArray, localHistory, this.props.agreement);
      // ************ Code for caching rest of document_fields for agreement **********
    }

      const getLocalHistory = () => {
        const localStorageHistory = localStorage.getItem('documentHistory');
        let destringifiedHistory = {};
        // if localStorageHistory exists, set state to previous values
        // if localStorageHistory does not exist, all state values are set in constructor (ie empty)
        // and next time user refreshes or mounts component on the same machine, it will be there
        if (localStorageHistory) {
          destringifiedHistory = JSON.parse(localStorageHistory);
          if (destringifiedHistory[this.props.agreement.id] && destringifiedHistory[this.props.agreement.id].elements) {
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
                // console.log('in create_edit_document, componentDidMount, getLocalHistory, this.state.templateEditHistoryArray, this.state.templateElementCount', this.state.templateEditHistoryArray, this.state.templateElementCount);
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
      // *****************************************************************
      // !!!!! IMPORTATNT: When refreshing localStorageHistory, comment out below getLocalHistory
      // *****************************************************************
      // gotohistory
      templateEditHistory = getLocalHistory();
      console.log('in create_edit_document, componentDidMount, getLocalHistory, after getLocalHistory templateEditHistory', templateEditHistory);

      // If there is templateEditHistory object, create elements with temporary ids (ie id: '1a')
      // calculate highestElementId for templateElementCount (for numbering element temporary ids)
      if (templateEditHistory && templateEditHistory.elements) {
        let highestElementId = 0;
        let highestTranslationElementId = 0;
        const newElementArray = [];

        _.each(Object.keys(templateEditHistory.elements), eachElementKey => {
          // get the highest id to avoid duplicate element id after templateElements repopulated
          if (!templateEditHistory.elements[eachElementKey].translation_element) {
            highestElementId = highestElementId > parseInt(eachElementKey, 10) ? highestElementId : parseInt(eachElementKey, 10)
          } else {
            highestTranslationElementId = highestTranslationElementId > parseInt(eachElementKey, 10) ? highestTranslationElementId : parseInt(eachElementKey, 10);
          }
          newElementArray.push(templateEditHistory.elements[eachElementKey]);
          // get template elements in localstorage into app state as templateElements and templateTranslationElements
          // this.props.createDocumentElementLocally(templateEditHistory.elements[eachElementKey]);
        }); // end of each elements

        this.props.createDocumentElementLocally(newElementArray);

        this.setState({
          templateElementCount: highestElementId,
          translationElementCount: highestTranslationElementId,
          unsavedTemplateElements: templateEditHistory.elements
        }, () => {
          // console.log('in create_edit_document, componentDidMount, getLocalHistory, right before populateTemplateElementsLocally, this.state.templateElementCount', this.state.templateElementCount);
          // getRestOfDocumentFieldsForAgreement(templateEditHistory)
        });
      } else { //if (templateEditHistory && templateEditHistory.elements) {
        // getRestOfDocumentFieldsForAgreement({})
      }
      // If there are elements persisted in backend DB, populate this.props.templateElements
      // mappedAgreementsWithCachedDocumentFields has cached document_fields and agreement.document_field would be null
      if ((this.props.agreement.document_fields && this.props.agreement.document_fields.length > 0)
          || this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreement.id]) {
        // get template elements in DB into app state as templateElements and templateTranslationElements
        let newArray = [];
        if (this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreement.id]) {
          const pageToLoad = 1;
          _.each(Object.keys(this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreement.id]), eachPage => {
            if (eachPage == pageToLoad) newArray = newArray.concat(this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreement.id][eachPage])
            // console.log('in create_edit_document, componentDidMount, inside if this.props.agreement.document_fields this.props.agreement.document_fields, this.props.mappedAgreementsWithCachedDocumentFields, newArray, eachPage', this.props.agreement.document_fields, this.props.mappedAgreementsWithCachedDocumentFields, newArray, eachPage);
          })
        } else {
          newArray = this.props.agreement.document_fields;
          // this.props.populateTemplateElementsLocally(this.props.agreement.document_fields, () => {}, templateEditHistory);
        }
        // this.props.populateTemplateElementsLocally(newArray, () => {}, templateEditHistory, this.props.agreement);
        this.props.populateTemplateElementsLocally(newArray, () => getRestOfDocumentFieldsForAgreement(), templateEditHistory, this.props.agreement);
      }
    } // if (this.props.showTemplate) {

      // setLastMountedocumentId to current agreementId so that can
      // track if is running componentDidUpdateuser has changed agreements or
      // or another reason
    this.props.setLastMountedocumentId(this.props.agreementId);
  }

  componentDidUpdate(prevProps, prevState) {
    // Template document intitialValues in componentDidUpdate
    // Use selectedFlatFromParams to test since bookingData also has flat
    // so need to distinguish flat does not test positive in bookingConfirmation
    const templateElementsCountChanged = (Object.keys(prevProps.templateElements).length !== Object.keys(this.props.templateElements).length)
    const templateTranslationElementsCountChanged = (Object.keys(prevProps.templateTranslationElements).length !== Object.keys(this.props.templateTranslationElements).length)
    const documentMountedChanged = prevProps.lastMountedocumentId !== this.props.agreementId;

    // console.log('in create_edit_document, componentDidUpdate, prevProps.agreementId, this.props.agreementId, prevProps.lastMountedocumentId, this.props.lastMountedocumentId, prevProps.templateElements, this.props.templateElements: ', prevProps.agreementId, this.props.agreementId, prevProps.lastMountedocumentId, this.props.lastMountedocumentId, prevProps.templateElements, this.props.templateElements);
    if ((this.props.bookingData || this.props.selectedFlatFromParams)
        &&
        (
        // The number of templateElements hanged
        templateElementsCountChanged
        // (Object.keys(prevProps.templateElements).length !== Object.keys(this.props.templateElements).length)
        ||
        // The number of templateTranslationElements changed
        templateTranslationElementsCountChanged
        // (Object.keys(prevProps.templateTranslationElements).length !== Object.keys(this.props.templateTranslationElements).length)
        ||
        // another document was mounted
        documentMountedChanged
        ||
        // Run if documentLanguageCode changes
        (this.props.showDocument && (prevProps.documentLanguageCode !== this.props.documentLanguageCode))
        ||
        // When user clicks getFieldValues, this.state.getSelectDataBaseValues is turned true in this.getSelectDataBaseValues
        ((prevState.getSelectDataBaseValues !== this.state.getSelectDataBaseValues) && this.state.getSelectDataBaseValues)
        ||
        // When user clics opens getFieldValuesBox, state.findIfDatabaseValuesExistForFields is turned true
        ((prevState.findIfDatabaseValuesExistForFields !== this.state.findIfDatabaseValuesExistForFields) && this.state.findIfDatabaseValuesExistForFields))
       ) {
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
        documentConstants,
        templateElementsMappedByName
      } = this.props;

      const mainInsertFieldsObject = null;
      let templateElementsSubset = {};
      // If trying to get subset of allObject; use templateElementsSubset
      // getInitialValueObject each documentFields is an object not the key
      // os name key or id key does not matter
      if (this.state.getSelectDataBaseValues || this.state.findIfDatabaseValuesExistForFields) {
        _.each(this.state.selectedTemplateElementIdArray, eachId => {
          // templateElementsSubset[templateElements[eachId].name] = templateElements[eachId];
          templateElementsSubset[eachId] = templateElements[eachId];
        });
      } else if (_.isEmpty(prevProps.templateElements)) {
        // if prevProps is empty, createEditDocument is loading the agreement
        templateElementsSubset = templateElements;
      } else {
        // This needs work; Needs to add to initialValuesObject; not create new object
        // If prevProps is not empty, there was an element added
        // Find any new elements in templateElements that are not in prevProps
        // and put them in templateElementsSubset
        _.each(Object.keys(templateElements), eachId => {
          if (!prevProps.templateElements[eachId]) templateElementsSubset[eachId] = templateElements[eachId];
        });
        // if (_.isEmpty(templateElementsSubset)) templateElementsSubset = templateElements;
      }
      const allObject = this.props.allDocumentObjects[Documents[this.props.agreement.template_file_name].propsAllKey]
      // allObject has all keys and objects for document type
      // fixedTermRentalContractBilingualAll and importantPointsExplanationBilingualAll
      // const initialValuesObject = Documents[this.props.agreement.template_file_name].templateMethod({ flat, booking, userOwner, tenant, appLanguageCode, documentFields: templateElementsSubset, assignments, contracts, documentLanguageCode, documentKey, contractorTranslations, staffTranslations, mainInsertFieldsObject, template: true, allObject, agreement, templateMappingObjects });
      // Get date object at the beginning to run once instead of running on each field
      const bookingDatesObject = booking ? getBookingDateObject(booking) : null;
      // if values exist for for documentCached use cached values
      // otherwise, AND the document HAS chnaged run getInitialValuesObject
      // Keep the current initialValues for later merge with new elements
      const currentInitialValuesObject = this.props.initialValues;

      const initialValuesObject = (this.props.cachedInitialValuesObject[this.props.agreementId]
        && documentMountedChanged)
        ?
         { initialValuesObject: this.props.cachedInitialValuesObject[this.props.agreementId] }
        :
        Documents[this.props.agreement.template_file_name].templateMethod({
          flat,
          booking,
          userOwner,
          tenant,
          appLanguageCode,
          documentFields: (this.state.getSelectDataBaseValues
                          || this.state.findIfDatabaseValuesExistForFields
                          || templateElementsCountChanged
                          || templateTranslationElementsCountChanged
                          || prevProps.documentLanguageCode !== this.props.documentLanguageCode
                        )
                        ? templateElementsSubset : allObject,
          // documentFields: allObject,
          templateTranslationElements: this.props.templateTranslationElements,
          documentTranslationsAllInOne: this.props.documentTranslationsAllInOne,
          assignments,
          contracts,
          documentLanguageCode,
          documentKey,
          contractorTranslations,
          staffTranslations,
          mainInsertFieldsObject,
          template: true,
          allObject,
          agreement,
          templateMappingObjects,
          documentConstants,
          bookingDatesObject,
          templateElementsMappedByName,
          getSelectDataBaseValues: this.state.getSelectDataBaseValues,
          findIfDatabaseValuesExistForFields: this.state.findIfDatabaseValuesExistForFields,
          getSelectDataBaseValuesCallback: () => {},
          // getSelectDataBaseValuesCallback: () => { this.getSelectDataBaseValues(); },
          findIfDatabaseValuesExistForFieldsCallback: (objectReturned) => { this.findIfDatabaseValuesExistForFields(objectReturned); }
        });


      // If the document has not changed a templateelement has been added
      // so merge the initialValues for the elements subset with the original initialValues
      // Second property overwrites first if same key exists
      const finalInitialValuesObject = !documentMountedChanged ? { ...currentInitialValuesObject, ...initialValuesObject.initialValuesObject } : initialValuesObject.initialValuesObject;
      // console.log('in create_edit_document, componentDidUpdate, prevProps.agreementId, this.props.agreementId, prevProps.lastMountedocumentId, documentMountedChanged, currentInitialValuesObject, initialValuesObject.initialValuesObject, finalInitialValuesObject: ', prevProps.agreementId, this.props.agreementId, prevProps.lastMountedocumentId, documentMountedChanged, currentInitialValuesObject, initialValuesObject.initialValuesObject, finalInitialValuesObject);
      // If not for getting database values, for getting initial values for the form
      // Just importing fields, not value so current value takes precedence
      // if (!this.state.getSelectDataBaseValues && !this.state.findIfDatabaseValuesExistForFields) this.props.setInitialValuesObject({ initialValuesObject: finalInitialValuesObject, ...initialValuesObject });
      if (!this.state.getSelectDataBaseValues && !this.state.findIfDatabaseValuesExistForFields) this.props.setInitialValuesObject({ initialValuesObject: finalInitialValuesObject });
      // Update cachedInitialValuesObject with values with new elements added
      if (!documentMountedChanged) this.props.setCachedInitialValuesObject({ ...this.props.cachedInitialValuesObject, [this.props.agreementId]: finalInitialValuesObject });
      // If getting data base values set objects for GetFieldValueChoiceModal
      if (this.state.getSelectDataBaseValues) {
        const fieldObject = getDocumentFieldsWithSameName({
          documentFields: this.props.agreement.document_fields,
          selectedFieldObject: this.props.selectedFieldObject,
          valuesInForm: this.props.valuesInForm,
          fromCreateEditDocument: true,
          initialValuesObject: initialValuesObject.initialValuesObject,
          getSelectDataBaseValues: this.state.getSelectDataBaseValues
        });

        if (!this.props.showGetFieldValuesChoice) {
          this.props.showGetFieldValuesChoiceModal(() => {});
          window.addEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
          window.addEventListener('keydown', this.handleCloseGetFieldValuesChoiceBox);
        }
        // call action to set state.documents.fieldValueDocumentObject to be used in GetFieldValueChoiceModal
        this.props.setGetFieldValueDocumentObject({
          agreement: this.props.agreement,
          fieldObject: fieldObject.object,
          differentValueCount: fieldObject.differentValueCount,
          selectedFieldNameArray: [],
          fieldValueAppliedArray: [],
          flatDbValuesObject: initialValuesObject.initialValuesObject
        });
      }
      // this.props.setInitialValuesObject(initialValuesObject);
    } // end of if bookingData

    if ((this.props.importFieldsFromOtherDocumentsObject
      && prevProps.importFieldsFromOtherDocumentsObject
      && prevProps.importFieldsFromOtherDocumentsObject.fieldsArray.length !==
         this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length)
      ) {
      const actionButton = document.getElementById('create-edit-document-template-edit-action-box-elements-pasteFields');
      if (actionButton) {
        const actionButtonDimensions = actionButton.getBoundingClientRect() || { top: 0, left: 0 };

        this.props.setEditActionBoxCallForActionObject({
              ...this.props.editActionBoxCallForActionObject,
              top: actionButtonDimensions.top,
              left: actionButtonDimensions.left,
              message: actionButton.getAttribute('name'),
              value: actionButton.getAttribute('value')
            });
      } // End of if (actionButton) {
    } // End of if ((this.props.importFieldsFromOtherDocumentsObject
      // console.log('in create_edit_document, componentDidUpdate, this.props.showLoadingProp, templateElementsCountChanged, templateTranslationElementsCountChanged: ', this.props.showLoadingProp, templateElementsCountChanged, templateTranslationElementsCountChanged);
      // if ((templateElementsCountChanged
      //       || templateTranslationElementsCountChanged)
      //     && this.props.showLoadingProp
      //   ) {
      //     if (this.props.showLoadingProp) this.props.showLoading();
      //     // gotoscroll
      //     console.log('in create_edit_document, componentDidUpdate, inside if this.props.showLoadingProp: ', this.props.showLoadingProp);
      //   }
  } // End of componentDidUpdate

  componentWillUnmount() {
    // console.log('in create_edit_document, componentWillUnmount fired');
    // Housekeeping for when component unmounts
    document.removeEventListener('click', this.getMousePosition);
    document.removeEventListener('click', this.handleFontControlCloseClick);
    document.removeEventListener('keydown', this.handleFontControlCloseClick);

    window.removeEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
    window.removeEventListener('keydown', this.handleCloseGetFieldValuesChoiceBox);
    window.removeEventListener('scroll', this.handleDocumentScroll);
    // this.setLocalStorageHistory('componentWillUnmount');
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
    return array;
  }

  checkIfRequiredKeysNull(requiredKeysArray, data) {
    const array = [];
    _.each(requiredKeysArray, eachKey => {
      if (data[eachKey] == (undefined || null)) {
        array.push(eachKey);
      }
      // for some reason, empty string does not return true to == ('' || undefined || null)
      // so separate out
      if (data[eachKey] == '') {
        array.push(eachKey);
      }
    });
    return array;
  }

  checkOtherChoicesVal(choices, key, data) {
    let haveOrNot = false;
    _.each(choices, choice => {
      if (choice.params.val == data[key]) {
        haveOrNot = true;
      }
    });
    return haveOrNot;
  }

  getSelectChoice(choices, value) {
    // model refers to a constants file eg building.js
    let returnedChoice;
    _.each(choices, eachChoice => {
      if (eachChoice.value === value) {
        returnedChoice = eachChoice;
        return;
      }
    });
    return returnedChoice;
  }

  // handleFormSubmitSave(dataPassed) {
  //   const data = dataPassed.data;
  //   const contractName = Documents[this.props.createDocumentKey].file;
  //   const paramsObject = { flat_id: this.props.flat.id, contract_name: contractName }
  //
  // }
  getDeltaFields(dataFormSubmit) {
    const delta = {};
    _.each(Object.keys(dataFormSubmit), key => {
      if (dataFormSubmit[key] !== this.props.initialValues[key]) {
        delta[key] = dataFormSubmit[key];
      }
    });
    return delta;
  }

  getSavedDocumentField(choice, key) {
    const { agreementMappedById } = this.props;
    let objectReturned = {};
    // Iterate through all saved document fields
    _.each(Object.keys(this.props.agreementMappedById), eachSavedFieldKey => {
      // if the name and key match AND the val matches return object
      if ((agreementMappedById[eachSavedFieldKey].name == key) && (agreementMappedById[eachSavedFieldKey].val == choice.params.val)) {
        objectReturned = agreementMappedById[eachSavedFieldKey];
        return;
      }
    });
    return objectReturned;
  }

  checkIfKeyExists(key, paramsObject) {
    let booleanReturned = false;
    _.each(paramsObject.document_field, eachDocumentField => {
      if (eachDocumentField.name == key) {
        booleanReturned = true;
        return;
      }
    });
    return booleanReturned;
  }

  handleTemplateSubmitCallback(saveOrCreate) {
    console.log('in create_edit_document, handleTemplateSubmitCallback, saveOrCreate: ', saveOrCreate);

    this.setState({
      modifiedPersistedElementsObject: {},
      modifiedPersistedTranslationElementsObject: {},
      templateEditHistoryArray: [],
      historyIndex: 0,
      unsavedTemplateElements: {},
      // If creating pdf, set showDocumentPdf to true for renderDocument
      showDocumentPdf: (saveOrCreate === 'save_and_create') || (saveOrCreate === 'create'),
      useMainDocumentInsert: false
    }, () => {
      this.setLocalStorageHistory('handleTemplateSubmitCallback');
      this.props.showLoading();
      this.props.setProgressStatus(null);
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
    // deletedDocumentFieldTranslationsArray array of objects
    const deletedDocumentFieldTranslationsArray = [];
    const paramsObject = {
      flat_id: this.props.flat.id,
      booking_id: this.props.booking ? this.props.booking.id : null,
      document_name: this.props.agreement.document_name,
      document_field: documentFieldArray,
      deleted_document_field_id_array: deletedDocumentFieldIdArray,
      deleted_document_field_translations_array: deletedDocumentFieldTranslationsArray,
      // new_document_field: newDocumentFieldArray,
      agreement_id: this.props.agreement ? this.props.agreement.id : null,
      document_language_code: this.props.documentLanguageCode,
      use_main_document_insert: this.state.useMainDocumentInsert,
      pages_in_viewport: this.state.documentPagesObject.pagesInViewport
      // deleted_document_field: this.state.modifiedPersistedElementsArray,
    };

    const object = {
      templateElements: { modifiedObject: this.state.modifiedPersistedElementsObject },
      templateTranslationElements: { modifiedObject: this.state.modifiedPersistedTranslationElementsObject, translations: true }
    }

    _.each(Object.keys(object), eachElementTypeKey => {
      _.each(Object.keys(object[eachElementTypeKey].modifiedObject), eachKey => {
        let documentField = null;
        // if elements have ids with 'a' or 'b' and are deleted in the modified object
        if (object[eachElementTypeKey].modifiedObject[eachKey].deleted === true && eachKey.indexOf('a') === -1 && eachKey.indexOf('b') === -1) {
          deletedDocumentFieldIdArray.push(parseInt(eachKey, 10));
        } else {
          // if not deleted === true, its been modified or newly created
          // eachElementTypeKey is this.props[templateElements] or templateTranslationElements
          documentField = this.props[eachElementTypeKey][eachKey];
          // Keep track of which document_field_translations were deleted
          // if the documentField is a translation element and not a new element with id 'b'
          // and has document_field_translations
          if (documentField
            && object[eachElementTypeKey].translations
            && documentField.translation_element
            && documentField.document_field_translations
            && (documentField.id.indexOf('b') === -1)) {
            _.each(Object.keys(documentField.document_field_translations), languageCodeKey => {
              if (documentField.document_field_translations[languageCodeKey].id && documentField.document_field_translations[languageCodeKey].deleted) {
                // deletedDocumentFieldTranslationsArray.push({ document_field_id: documentField.id, document_field_translation_id: documentField.document_field_translations[languageCodeKey].id })
                deletedDocumentFieldTranslationsArray.push(documentField.document_field_translations[languageCodeKey].id)
              }
            });
          } // end of if (object[eachElementTypeKey].translations
        } // end of  if (object[eachElementTypeKey].modifiedObject[eachKey].deleted

        if (documentField) {
          // const value = data[documentField.name];
          let array = null;
          let arrayTranslation = null;

          if (documentField.translation_element) documentField.value = data[`${documentField.name}+translation`];
          if (!documentField.translation_element) documentField.value = data[documentField.name];
          // if custom field, assign value for custom_name in initialValuesObject
          if (documentField.custom_name) documentField.value = data[documentField.custom_name];

          if (documentField.document_field_choices) {
            array = [];
            const selectArray = [];
            _.each(Object.keys(documentField.document_field_choices), each => {
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
              if (documentField.id.indexOf('b') !== -1) {
                // if a new element with a 'b' in the id, and not deleted
                if (!documentField.document_field_translations[eachLanguageCodeKey].deleted) arrayTranslation.push(documentField.document_field_translations[eachLanguageCodeKey]);
              } else {
                arrayTranslation.push(documentField.document_field_translations[eachLanguageCodeKey]);
              }
            });
          }

          documentField.document_field_choices_attributes = array;
          documentField.document_field_translations_attributes = arrayTranslation;
          documentFieldArray.push(documentField);
        } // end of if (documentField) {
      }); // end of _.each(Object.keys(object[eachElementTypeKey].modifiedObject
    }); // end of _.each(Object.keys(object), eachElementTypeKey => {
    // If creating pdf or updating
    if (submitAction === 'save_and_create' || submitAction === 'create') {
      paramsObject.save_and_create = true;
      paramsObject.document_language_code = this.props.documentLanguageCode;
      this.props.saveTemplateDocumentFields(paramsObject, submitAction, (saveOrCreate) => this.handleTemplateSubmitCallback(saveOrCreate));
    } else {
      this.props.saveTemplateDocumentFields(paramsObject, submitAction, (saveOrCreate) => this.handleTemplateSubmitCallback(saveOrCreate));
    }
    console.log('in create_edit_document, handleTemplateFormSubmit, paramsObject, data: ', paramsObject, data);
    this.props.showLoading();
    // Do not call setProgressStatus here so that if action cable is disconnected, the progress bar will come up and not dismount
    // this.props.setProgressStatus({ progress_percentage: 0, message: 'Received request' });
  }
  // NOTE: This is not for template documents!!!! Outdated!!!
//   handleFormSubmit({ data, submitAction }) {
//     // object to send to API; set flat_id
//     // const contractName = 'teishaku-saimuhosho';
//     const contractName = Documents[this.props.createDocumentKey].file;
//     const paramsObject = {
//       flat_id: this.props.flat.id,
//       template_file_name: contractName,
//       document_code: this.props.createDocumentKey,
//       booking_id: this.props.booking.id,
//       document_name: data.document_name,
//       document_field: [],
//       agreement_id: this.props.agreement ? this.props.agreement.id : null,
//       document_language_code: this.props.documentLanguageCode,
//       use_own_main_agreement: this.state.useMainDocumentInsert,
//     };
//     // iterate through each key in data from form
//
//     const requiredKeysArray = this.getRequiredKeys();
//     const nullRequiredKeys = this.checkIfRequiredKeysNull(requiredKeysArray, data)
//
//     // _.each(Object.keys(data), key => {
//     // allFields is array of all keys (only) in a document
//     let fields = {};
//     if (this.props.showSavedDocument) {
//       // get delta from data and initialValues
//       fields = this.getDeltaFields(data);
//     } else {
//       // assign all fields to fields for iteration below
//       fields = this.props.allFields;
//     }
//     // iterate through all fields or just delta fields depending on showSavedDocument
//     // ie user is editing an already saved document
//     _.each(Object.keys(fields), key => {
//       let page = 0;
//       // find out which page the key is on
//       // iterate through Document form first level key to see if each object has key in quesiton
//       _.each(Object.keys(this.props.documentFields), eachPageKey => {
//         // if the object has the key, that is the page the key is on
//         // so set page variable so we can get choices from input key
//         if (key in this.props.documentFields[eachPageKey]) {
//           page = eachPageKey;
//         }
//       });
//
//       let choice = {};
//       // use page and key from above to get each choice from each document field from Documents[documentKey].form
//       _.each(this.props.documentFields[page][key].choices, eachChoice => {
//         // Boolean to test if field has multiple choices
//         const keyWithMultipleChoices = Object.keys(this.props.documentFields[page][key].choices).length > 1;
//         // val = '' means its an input element, not a custom field component
//         // .val is assigned inputFieldValue if it is not a button
//         if (eachChoice.params.val == 'inputFieldValue') {
//           choice = eachChoice;
//           // add data[key] (user choice) as value in the object to send to API
//           // check for other vals of choices if more than 1 choice
//           // in case input has the same value as other buttons
//           const otherChoicesHaveVal = Object.keys(this.props.documentFields[page][key].choices).length > 1 ? this.checkOtherChoicesVal(this.props.documentFields[page][key].choices, key, data) : false;
//           if (!otherChoicesHaveVal) {
//             if (this.props.showSavedDocument) {
//               choice.params.id = this.props.agreementMappedByName[key].id
//             }
//             choice.params.page = page;
//             choice.params.name = this.props.documentFields[page][key].name
//             if (key in data) {
//               choice.params.value = data[key]
//               // if need to show full local language text on PDF, use documentLanguageCode from model choice
//               if (choice.showLocalLanguage) {
//                 // get choice on model eg building choice SRC for en is Steel Reinforced Concrete
//                 const selectChoices = choice.selectChoices || choice.select_choices;
//                 const selectChoice = this.getSelectChoice(selectChoices, data[key]);
//                 // assign display as an attribute in choice params
//                 choice.params.display_text = selectChoice[this.props.documentLanguageCode];
//                 // paramsObject.document_field.push(choice.params);
//                 // if choice is a baseLanguageField ie not a _translation field,
//                 // assign Document baseLanguage
//                 if (choice.baseLanguageField) {
//                   choice.params.display_text = selectChoice[Documents[this.props.documentKey].baseLanguage];
//                 }
//               }
//             } else {
//               choice.params.value = '';
//             }
//               // add params object with the top, left, width etc. to object to send to api
//             paramsObject.document_field.push(choice.params);
//           }
//         } // end of if inputFieldValue
//
//         // START of assigning to paramsObject if params.val is NOT inputFieldValue
//         let dataRefined = ''
//         if ((data[key] == 'true') || (data[key] == 't')) {
//           dataRefined = true;
//         } else if ((data[key] == 'false') || (data[key] == 'f')) {
//           dataRefined = false;
//         } else {
//           dataRefined = data[key];
//         }
//
//         if ((eachChoice.params.val == dataRefined) || (dataRefined == '') || (eachChoice.params.val !== 'inputFieldValue')) {
//           choice = eachChoice;
//           let paramsForSelectKeyExists = false;
//           // if this is a saved document on backend ie not newly creating
//           // to get document field id into params
//           if (this.props.showSavedDocument) {
//             // if this key has multiple choices and is a button field, not a select string
//             if (keyWithMultipleChoices && choice.params.input_type == 'button') {
//               // use agreementMappedByName to get id
//               const savedDocumentField = this.getSavedDocumentField(choice, key);
//               choice.params.id = savedDocumentField.id;
//             } else {
//               choice.params.id = this.props.agreementMappedByName[key].id;
//             }
//           } // end of if showSavedDocument
//           // if choice is string and need to show local language
//           if (choice.showLocalLanguage) {
//             // checkIfKeyExists is for select fields, so that documentField is not created
//             // for each select choice; if change selection, pdf will overlap
//             if (keyWithMultipleChoices) {
//               // if WITH multiple choices in form eg kitchen (yes or no)
//               paramsForSelectKeyExists = this.checkIfKeyExists(key, paramsObject);
//               // get choice on model eg building choice SRC for en is Steel Reinforced Concrete
//               if (!paramsForSelectKeyExists) {
//                 // get choice from constants/some_model
//                 const selectChoices = choice.selectChoices || choice.select_choices;
//                 const selectChoice = this.getSelectChoice(selectChoices, dataRefined);
//                 // assign display as an attribute in choice params
//                 choice.params.display_text = selectChoice[this.props.documentLanguageCode];
//                 if (choice.combineLanguages) {
//                   const baseString = selectChoice[Documents[this.props.documentKey].baseLanguage];
//                   const combinedString = baseString.concat(` ${selectChoice[this.props.documentLanguageCode]}`);
//                   choice.params.display_text = combinedString
//                 }
//               }
//             } else {
//               // if without multiple choices in form eg construction, choies come from constants/building
//               const selectChoices = choice.selectChoices || choice.select_choices;
//               const selectChoice = this.getSelectChoice(selectChoices, dataRefined);
//               // assign display as an attribute in choice params
//               choice.params.display_text = selectChoice[this.props.documentLanguageCode];
//               if (choice.combineLanguages) {
//                 const baseString = selectChoice[Documents[this.props.documentKey].baseLanguage];
//                 const combinedString = baseString.concat(` ${selectChoice[this.props.documentLanguageCode]}`);
//                 choice.params.display_text = combinedString
//               }
//             }
//           }
//           // assign values common to all document fields and push into paramsObject
//           if (!paramsForSelectKeyExists) {
//             choice.params.value = data[key];
//             choice.params.page = page;
//             choice.params.name = this.props.documentFields[page][key].name;
//             paramsObject.document_field.push(choice.params);
//           }
//         } // end of if eachChoice.params.val...
//
//           // if (eachChoice.params.input_type == 'button' && !(key in data)) {
//           //   choice = eachChoice;
//           //   choice.params.value = ;
//           //   choice.params.page = page;
//           //   choice.params.name = this.props.documentFields[page][key].name
//           //   paramsObject.document_field.push(choice.params);
//           // }
//       }); // end of documentFields each choice
//     }); // end of each Object.keys(data)
//     if (nullRequiredKeys.length > 0) {
//       // if required keys that are null exist
//       this.props.authError('The fields highlighted in blue are required.');
//       this.props.requiredFields(nullRequiredKeys);
//     } else if (submitAction == 'create') {
//       this.props.authError('');
//       this.props.requiredFields([]);
//       // !!!!!!!create contract is creating a pdf
//       this.props.showLoading();
//       this.props.createContract(paramsObject, () => { this.props.showLoading(); });
//     } else if (submitAction == 'save_and_create') {
//       this.props.authError('');
//       this.props.requiredFields([]);
//       // sets flag save_and_create for the backend API to save documentFields first before create PDF
//       paramsObject.save_and_create = true;
//       this.props.editAgreementFields(paramsObject, (agreement) => {
//         this.props.showLoading();
//         this.setState({ showDocumentPdf: true });
//         let initialValuesObject = {};
//         const returnedObject = this.getSavedDocumentInitialValuesObject({ agreement });
//         initialValuesObject = { initialValuesObject: returnedObject.initialValuesObject, agreementMappedByName: returnedObject.agreementMappedByName, agreementMappedById: returnedObject.agreementMappedById }
//         this.props.setInitialValuesObject(initialValuesObject);
//       });
//       this.props.showLoading();
//     } else if (submitAction == 'save') {
//       if (!this.props.showSavedDocument) {
//         this.props.authError('');
//         this.props.requiredFields([]);
//         // !!!!!!!createAgreement is creating an agreement and document fields in backend API
//         this.props.showLoading();
//         this.props.createAgreement(paramsObject, (id) => {
//           // clear out editHistory and initialValuesObject; keep documentKey!!!!!
//           this.props.editHistory({ editHistoryItem: {}, action: 'clear' })
//           this.props.setInitialValuesObject({ initialValuesObject: {}, agreementMappedByName: {}, agreementMappedById: {}, allFields: [], overlappedkeysMapped: {} })
//           // calls setState({ agreementId: id }) in BookingConfirmation
//           // sets agreementId with id of new agreement and same documentKey sent back from API
//           this.props.setAgreementId(id);
//           // calls setState({ showSavedDocument: true, showDocument: false }) in BookingConfirmation
//           // after agreementId is set, unmount create agreement template
//           // by this.state showDocument: false, and mount new by showSavedDocument: true
//           this.props.goToSavedDocument();
//           this.props.showLoading();
//         });
//       } else {
//         this.props.authError('');
//         this.props.requiredFields([]);
//         // if showSavedDocument set in booking_confirmation, editAgreement
//         this.props.editAgreementFields(paramsObject, (agreement) => {
//           this.props.showLoading();
//           let initialValuesObject = {};
//           const returnedObject = this.getSavedDocumentInitialValuesObject({ agreement });
//           initialValuesObject = { initialValuesObject: returnedObject.initialValuesObject, agreementMappedByName: returnedObject.agreementMappedByName, agreementMappedById: returnedObject.agreementMappedById }
//           this.props.setInitialValuesObject(initialValuesObject);
//           // initialize if a redux form action creator to set initialValues again, but don't need here
//           // this.props.initialize(initialValuesObject.initialValuesObject);
//         });
//         this.props.showLoading();
//       }
//     }
//   }
//
//   getModelChoice(model, choice, name) {
//     // model refers to a constants file eg building.js
//     let returnedChoice;
//     _.each(model[name].choices, eachChoice => {
//       if (eachChoice.value === choice.params.val) {
//         returnedChoice = eachChoice;
//         return;
//       }
//     });
//     return returnedChoice;
//   }
//
//   renderSelectChoices(choices, model, name) {
//     // rendering options for select fields
//   return _.map(Object.keys(choices), (eachKey, i) => {
//     const modelChoice = this.getModelChoice(model, choices[eachKey], name);
//     const languageCode = Documents[this.props.documentKey].baseLanguage;
//     const languageCodeTranslation = this.props.documentLanguageCode;
//       return (
//         <option key={i} value={choices[eachKey].params.val}>{modelChoice[languageCode]} {modelChoice[languageCodeTranslation]}</option>
//       );
//     // }
//   });
// }

handleOnBlur(event) {
  const blurredInput = event.target
  if (blurredInput.value != this.state.valueWhenInputFocused) {
    const newEditHistoryItem = { before: { value: this.state.valueWhenInputFocused, name: blurredInput.name }, after: { value: blurredInput.value, name: blurredInput.name } }
    // this.setState(prevState => ({
      //   editHistory: [...prevState.editHistory, editHistoryItem]
      // })); // end of setState
      this.props.editHistory({ newEditHistoryItem, action: 'add' });
    }
}

handleOnFocus(event) {
  const focusedInput = event.target;
  const valueWhenInputFocused = event.target.value;
  this.setState({ focusedInput, valueWhenInputFocused }, () => {
  });
}

// renderEachDocumentField(page) {
//   let fieldComponent = '';
//   // if (this.props.documentFields[page]) {
//     return _.map(this.props.documentFields[page], (formField, i) => {
//       if (formField.component == 'DocumentChoices') {
//         fieldComponent = DocumentChoices;
//       } else {
//         fieldComponent = formField.component;
//       }
//
//       let nullRequiredField = false;
//       if (this.props.requiredFieldsNull) {
//         if (this.props.requiredFieldsNull.length > 0) {
//           // nullRequiredField = this.props.requiredFieldsNull.includes(formField.name);
//           nullRequiredField = this.props.requiredFieldsNull.indexOf(formField.name) !== -1;
//         }
//       }
//
//       let otherChoiceValues = [];
//       if (fieldComponent == DocumentChoices) {
//         _.each(formField.choices, eachChoice => {
//           if ((eachChoice.params.val !== 'inputFieldValue') && (formField.input_type != 'boolean')) {
//             otherChoiceValues.push(eachChoice.params.val.toLowerCase());
//           }
//         })
//       }
//       // select objects that are not DocumentChoices components
//       // Field gets the initialValue from this.props.initialValues
//       // the 'name' attribute is matched with initialValues object keys
//       // and sets initial value of the field
//       if (fieldComponent == 'select') {
//         return (
//           <div
//             style={{ position: 'absolute', top: formField.choices[0].params.top, left: formField.choices[0].params.left, width: formField.choices[0].params.width, borderColor: formField.borderColor, height: formField.choices[0].params.height, textAlign: formField.choices[0].params.text_align }}
//             key={i}
//           >
//             <Field
//               key={i}
//               name={formField.name}
//               component={fieldComponent}
//               onBlur={this.handleOnBlur}
//               onFocus={this.handleOnFocus}
//               // pass page to custom compoenent, if component is input then don't pass
//               // props={fieldComponent == DocumentChoices ? { page, required: formField.required, nullRequiredField, formFields: Documents[this.props.createDocumentKey].form, charLimit: formField.charLimit } : {}}
//               type={formField.input_type}
//               className={'form-control'}
//               style={{ height: formField.choices[0].params.height, margin: formField.choices[0].params.margin }}
//               // className={formField.component == 'input' ? 'form-control' : ''}
//             >
//               {this.renderSelectChoices(formField.choices, formField.mapToModel, formField.name)}
//             </Field>
//           </div>
//         );
//       } else {
//         return (
//           <Field
//             key={i}
//             name={formField.name}
//             component={fieldComponent}
//             // pass page to custom compoenent, if component is input then don't pass
//             props={fieldComponent == DocumentChoices ? { page, required: formField.required, nullRequiredField, formFields: Documents[this.props.createDocumentKey].form, charLimit: formField.charLimit, otherChoiceValues, documentKey: this.props.documentKey } : {}}
//             type={formField.input_type}
//             className={formField.component == 'input' ? 'form-control' : ''}
//             style={formField.component == 'input'
//                     ?
//                     { position: 'absolute', top: formField.choices[0].params.top, left: formField.choices[0].params.left, width: formField.choices[0].params.width, borderColor: formField.borderColor, height: formField.choices[0].params.height, padding: formField.choices[0].params.padding, textAlign: formField.choices[0].params.text_align }
//                     :
//                     {}}
//           />
//         );
//       }
//     });
//     // }
//   }

  getMousePosition = (event) => {
    // custom version of layerX; takes position of container and
    // position of click inside container and takes difference to
    // get the coorindates of click inside container on page
    // yielded same as layerX and layerY
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const background = document.getElementById('document-background');

    // test if custom name input is empty, do not create if empty
    let customNameInputNotEmpty = true;
    if (this.state.showCustomInputCreateMode) {
      customNameInputNotEmpty = this.state.customFieldNameInputValue;
    } else {
      customNameInputNotEmpty = !this.state.customFieldNameInputValue;
    }

    // const pageIndex = elementVal - 1;
    // get x and y positions in PX of cursor in browser view port (not page or parent)
    if (clickedElement.id === 'document-background' && customNameInputNotEmpty) {
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
        // if costum name has changed since selecting field choice, update
        const customName = this.state.templateElementAttributes.custom_name === this.state.customFieldNameInputValue
                          ? this.state.templateElementAttributes.custom_name
                          : this.state.customFieldNameInputValue;
        // Assign templateElementAttributes from state and specify left, top, page
        const id = !this.state.translationModeOn ? `${this.state.templateElementCount}a` : `${this.state.translationElementCount}b`;

        templateElementAttributes = {
          ...this.state.templateElementAttributes,
          left: `${x}%`,
          top: `${y}%`,
          page: parseInt(elementVal, 10),
          id,
          custom_name: customName
        };
        // add action element action before putting in array before setState
        this.props.createDocumentElementLocally([templateElementAttributes]);
        // IMPORTANT: If the new element does not have document_field_choices, call setTemplateHistoryArray here;
        // If it has document_field_choices, history is set after coordinates for document_field_choices is set
        // in dragElement closeDragElement function and subsequent callback. getChoiceCoordinates is called in documentChoicesTemplate componentDidMount;
        // If it is a newElement, it calls dragElement function and sets the coordinates of the documentFieldChoices
      // } else {
        // templateElementAttributes = { ...this.state.templateElementAttributes, left: `${x}%`, top: `${y}%`, page: parseInt(elementVal, 10), id: `${this.state.translationElementCount}b` };
        // }
        if (!templateElementAttributes.document_field_choices) this.setTemplateHistoryArray([templateElementAttributes], 'create');
        // remove listener
        document.removeEventListener('click', this.getMousePosition);

        this.setState({
          templateElementAttributes: null,
          templateElementActionIdObject: { ...INITIAL_TEMPLATE_ELEMENT_ACTION_ID_OBJECT, array: [] },
          customFieldNameInputValue: '',
          showCustomInputCreateMode: false
        }, () => {
          document.getElementById('document-background').style.cursor = 'default';
        });
      }); // end of setState templateElementCount
    } // end of if (clickedElement.id === 'document-background') {
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
    // when element has not been checked
    const templateElementRunningCount = !this.props.translationModeOn ? this.props.templateElementsRunningCountTotal : this.props.templateTranslationElementsRunningCountTotal;

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
          // allElementsChecked: this.state.selectedTemplateElementIdArray.length === Object.keys(this.props.templateElements).length
          allElementsChecked: this.state.selectedTemplateElementIdArray.length === templateElementRunningCount
        }, () => {
          // console.log('in create_edit_document, handleTemplateElementCheckClick, this.state.allElementsChecked, ', this.state.allElementsChecked);
        });
      });
    } else {
      // if user clicks on check icon of element in checked array
      // form a new array from existing array since cannot mutate state elements
      const newArray = [...this.state.selectedTemplateElementIdArray];
      // get index of element in array
      const index = newArray.indexOf(elementVal);
      // take out element at index in array
      newArray.splice(index, 1);
      // assign new array to state
      this.setState({ selectedTemplateElementIdArray: newArray }, () => {
        this.setState({
          // allElementsChecked: this.state.selectedTemplateElementIdArray.length === Object.keys(this.props.templateElements).length,
          allElementsChecked: this.state.selectedTemplateElementIdArray.length === templateElementCount,
          newFontObject: { ...this.state.newFontObject, override: true }
        }, () => {
          // Get the font attributes of selected elements to show on the control box font button
          this.getSelectedFontElementAttributes();
          // If there are no more checked elements, set selectedElementFontObject to null
          // That means newFontObject will kick in on the font button on the element edit control box
          if (this.state.selectedTemplateElementIdArray.length === 0) {
            this.setState({ selectedElementFontObject: null })
          }
        });
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
    };
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
      // set the element's new position:
      // In percentages; Assign to element.
      // offsetTop returns the distance of the current element relative to the top of the offsetParent node
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
    };

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
            // place in array to be processed in action and reducer
            array.push(updatedElementObject);
          // }
        });
      } // end of else
      // console.log('in create_edit_document, dragElement, closeDragElement, array, ', array);
      // Callback defined in resize and move handlers
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
        } // if (againstTop) {

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
        } // if (newWrapperDivDimensions.width > (TAB_WIDTH + TAB_REAR_SPACE)) {
      } // if (pos1 !== 0) {
    } //function elementDrag(e) {
    // gotodrag
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
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
      } // if (choiceMoved) {
    } // function closeDragElement() {
} // dragChoice(props) {

longActionPress(props) {
  // longActionPress enable user to press mouse down and increase/decrease width and height
  // When user mouses up, the coordinates are set in app state
  const { action, choicesArray, templateElements, choicesOriginalObject, selectedChoiceIdArray, actionCallback } = props;

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
      });
    } else {
      const newArray = [...this.state.selectedChoiceIdArray];
      const index = newArray.indexOf(`${elementId}-${choiceIndex}`);
      newArray.splice(index, 1);
      this.setState({ selectedChoiceIdArray: newArray }, () => {
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
      choicesArray.push(button);
      choicesOriginalObject[each] = { eachElementId, eachChoiceId, choice: button, choiceDimensions: button.getBoundingClientRect(), width: button.style.width, height: button.style.height };
    });
    const actionCallback = (updatedElementsArray) => {
      this.props.updateDocumentElementLocally(updatedElementsArray);
      this.setTemplateHistoryArray(updatedElementsArray, 'update');
    };

    this.longActionPress({ action: elementVal, choicesArray, templateElements: this.props.templateElements, choicesOriginalObject, selectedChoiceIdArray: this.state.selectedChoiceIdArray, actionCallback });
  }

  renderTab(eachElement, selected, tabLeftMarginPx, inputElement, dummyTab) {
    const tabWidth = inputElement ? TAB_WIDTH : 55;
    const modTabLeftMarginPx = inputElement ? tabLeftMarginPx : tabLeftMarginPx - 6;
    const className = !this.state.translationModeOn ? 'template-element' : 'template-translation-element'
    if (!dummyTab) {
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
            style={{ fontSize: '14.5px', lineHeight: '1.5', color: selected ? '#fb4f14' : 'gray' }}
            onClick={this.handleTemplateElementCheckClick}
          >
          </i>
          <i
            key={2}
            value={eachElement.id}
            className="fas fa-truck-moving"
            style={{ fontSize: '14.5px', lineHeight: '1.5', color: 'gray' }}
            onMouseDown={this.handleTemplateElementMoveClick}
          >
          </i>
          {inputElement
            ?
            <i
              key={3}
              type={eachElement.input_type}
              value={eachElement.id}
              className="fas fa-expand-arrows-alt" style={{ fontSize: '14.5px', lineHeight: '1.5', color: 'gray' }}
              onMouseDown={this.handleTemplateElementChangeSizeClick}
            >
          </i> : null}
        </div>
      );
    } else {
      return (
        <div
          id={`${className}-tab-${eachElement.id}`}
          className="create-edit-document-template-element-edit-tab"
          style={{ minHeight: `${TAB_HEIGHT}px`, width: `${tabWidth}px`, marginLeft: `${modTabLeftMarginPx}px`, borderColor: 'transparent' }}
        >
        </div>
      );
    }
  }

  renderTemplateTranslationElements(page) {
    const { valuesInForm, documentLanguageCode, appLanguageCode, agreement, documentTranslationsAllInOne } = this.props;
    const documentEmpty = _.isEmpty(this.props.templateTranslationElementsByPage);
    let translationText = '';
    // Check if agreementId agreement is editable (i.e. for current booking for flat)
    const documentForBookingOrFlat = this.props.allUserAgreementsArrayMappedWithDocumentFields ? this.checkIfAgreementForBookingOrFlat() : true;

    if (!documentEmpty) {
      return _.map(this.props.templateTranslationElementsByPage[page], eachElement => {

        translationText = valuesInForm[`${eachElement.name}+translation`]
                          ||
                          valuesInForm[`${eachElement.custom_name}+translation`]
                          || (documentTranslationsAllInOne[eachElement.name]
                              && documentTranslationsAllInOne[eachElement.name].translations[documentLanguageCode])
                          || '';
        if (this.state.translationModeOn && this.state.editFieldsOn) {
          const background = document.getElementById('document-background');
          if (background) {
            const category = documentTranslationsAllInOne[eachElement.name] ? documentTranslationsAllInOne[eachElement.name].category : 'building'
            const translation = documentTranslationsAllInOne[eachElement.name] ? documentTranslationsAllInOne[eachElement.name].translations[appLanguageCode] : ''
            const selected = this.state.selectedTemplateElementIdArray.indexOf(eachElement.id) !== -1;
            const tabPercentOfContainerH = (TAB_HEIGHT / background.getBoundingClientRect().height) * 100;
            const eachElementWidthPx = background.getBoundingClientRect().width * (parseFloat(eachElement.width) / 100)
            let tabLeftMarginPx = eachElementWidthPx - TAB_WIDTH - TAB_REAR_SPACE;
            if (eachElementWidthPx < TAB_WIDTH) tabLeftMarginPx = 0;
            const label = eachElement.custom_name
                          ||
                          `${AppLanguages[category][appLanguageCode]}/${translation}`
                          ||
                          'No name';
            const wrappingDivDocumentCreateH = parseFloat(eachElement.height) / (parseFloat(eachElement.height) + tabPercentOfContainerH);
            const wrapperDivHeight = `${parseFloat(eachElement.height) + tabPercentOfContainerH}%`;
            const innerDivPercentageOfWrapper = `${(1 - (tabPercentOfContainerH / parseFloat(wrapperDivHeight))) * 100}%`;
            return (
              <div
                key={eachElement.id}
                id={`template-translation-element-${eachElement.id}`}
                className="create-edit-document-template-element-container"
                style={{
                  top: eachElement.top,
                  left: eachElement.left,
                  width: eachElement.width,
                  height: wrapperDivHeight,
                  transform: `rotate(-${parseInt(eachElement.transform, 10)}deg)`,
                  transformOrigin: 'top left',
                  border: !documentForBookingOrFlat ? 'transparent' : 'lightgray'
                }}
              >
                <Field
                  key={eachElement.name}
                  name={`${eachElement.custom_name && !eachElement.name ? eachElement.custom_name : eachElement.name}+translation`}
                  component={DocumentChoicesTemplate}
                  type={eachElement.input_type}
                  className={'document-rectangle-template'}
                  props={{
                      fromWhere: 'templateTranslationElements',
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
                                            element_id: eachElement.id,
                                            // transform: eachElement.transform ? `deg(-${eachElement.tranform})` : null,
                                            // transform_origin: eachElement.transform_origin
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
                      inputElement: true,
                      documentForBookingOrFlat
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
                {documentForBookingOrFlat
                  ?
                  this.renderTab(eachElement, selected, tabLeftMarginPx, true, false)
                  :
                  this.renderTab(eachElement, selected, tabLeftMarginPx, true, true)}
              </div>
            );
          } // if background
        } else {
          // if not translationModeOn, must render a simple div
          return (
            <div
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
                fontWeight: eachElement.font_weight,
                transform: `rotate(-${parseInt(eachElement.transform, 10)}deg)`,
                // transformOrigin: eachElement.transform_origin
                transformOrigin: 'top left'
              }}
            // top: 10.5%; left: 27.5%; font-size: 12px; font-weight: bold; width: 45%; text-align: center;
            // class_name="document-rectangle-template"
              className='document-translation'
            >
              <div
                className='document-translation-inner-textarea'
                // defaultValue={translationText}
              >
                {translationText}
              </div>
            </div>
          ); // End of return
        } // End of if (translationModeOn)
      }); // End of _.map
    } // if (!documentEmpty) {
  }

  getLocalTemplateElementsByPage(eachElement, box, backgroundDim, marginBetween, isNew, forRenderTemplateElements) {
    const { document_field_choices } = eachElement;
    const object = { [eachElement.page]: { [eachElement.id]: { choices: {} } } };
    const choicesObject = object[eachElement.page][eachElement.id].choices;
    let editObject = {};
    let currentTop = '0%';

    let widthInPx = null;
    let heightInPx = null;
    let topInPx = null;
    let leftInPx = null;
    // let i = 0;

    if (!forRenderTemplateElements) console.log('in create_edit_document, getLocalTemplateElementsByPage, moveElements, moveElementsRendered, eachElement, box, backgroundDim, marginBetween, isNew, forRenderTemplateElements, document_field_choices: ', eachElement, box, backgroundDim, marginBetween, isNew, forRenderTemplateElements, document_field_choices);

    let top = 0;
      _.each(document_field_choices, (eachChoice, i) => {
        // Convert NaN to zero
        top = (currentTop / box.height) || 0;
        // NOTE: get px of dimensions from box top, left etc.
        topInPx = ((parseFloat(eachChoice.top) / 100) * backgroundDim.height) - ((box.top) * backgroundDim.height);
        leftInPx = (((parseFloat(eachChoice.left) / 100) * backgroundDim.width) - ((box.left) * backgroundDim.width));
        widthInPx = (parseFloat(eachChoice.width) / 100) * backgroundDim.width;
        heightInPx = (parseFloat(eachChoice.height) / 100) * backgroundDim.height;

        choicesObject[i] = {};

        choicesObject[i].top = isNew ? `${top * 100}%` : `${(topInPx / ((box.height) * backgroundDim.height)) * 100}%`;
        choicesObject[i].left = isNew ? '0.0%' : `${(leftInPx / ((box.width) * backgroundDim.width)) * 100}%`;
        choicesObject[i].width = isNew ? `${(parseFloat(eachChoice.width) / box.width) * 100}%` : `${(widthInPx / (box.width * backgroundDim.width)) * 100}%`;
        choicesObject[i].height = isNew ? `${(parseFloat(eachChoice.height) / box.height) * 100}%` : `${(heightInPx / (box.height * backgroundDim.height)) * 100}%`;


        if (forRenderTemplateElements) {
          choicesObject[i].val = eachChoice.val;
          choicesObject[i].class_name = eachChoice.class_name;
          choicesObject[i].border_radius = eachChoice.border_radius;
          choicesObject[i].border = eachChoice.border;
          choicesObject[i].input_type = eachChoice.input_type;
          choicesObject[i].choice_index = parseInt(i, 10);
          choicesObject[i].element_id = eachElement.id;
          choicesObject[i].name = eachElement.name;
          choicesObject[i].selectChoices = eachChoice.selectChoices || eachChoice.select_choices;
        }

        currentTop = parseFloat(currentTop) + marginBetween + parseFloat(eachChoice.height);
      });
      // For getting choice dimensions in moveElements
      editObject = choicesObject;

      return forRenderTemplateElements ? object : editObject;
  }
  // For creating new input fields
  renderTemplateElements(page) {
    const { documentLanguageCode } = this.props;
    const documentEmpty = this.props.agreement.document_fields && this.props.agreement.document_fields.length === 0 && _.isEmpty(this.props.templateElementsByPage);
    let fieldComponent = '';
    let newElement = false;
    let inputElement = true;
    let localTemplateElementsByPage = null;

    // Function to get object used in document_choices_template.js to render fields
    // as the top, left, height, width coordinates of document_field_choices
    // are persited relative to the BACKGROUND, not the inner divs of templateElements
    // Looks like { 1: { 100: {element attr}, 101: { element attr } }}


    if (!documentEmpty) {
      // Map through each element
      let label = null;
      let translationKey = null;
      let translationText = '';
      let splitKey = null;
      let category = null;
      const documentForBookingOrFlat = this.props.allUserAgreementsArrayMappedWithDocumentFields ? this.checkIfAgreementForBookingOrFlat() : true;

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

        label = eachElement.custom_name
                ?
                `${eachElement.custom_name} ${eachElement.translation ? 'Translation' : ''}`
                :
                getElementLabel({
                    allDocumentObjects: this.props.allDocumentObjects,
                    documents: Documents,
                    agreement: this.props.agreement,
                    modifiedElement,
                    fieldName: modifiedElement.name,
                    documentTranslationsAll: this.props.documentTranslationsAll,
                    appLanguages: AppLanguages,
                    appLanguageCode: this.props.appLanguageCode,
                    fromCreateEditDocument: true
                  });

        const editTemplate = true;
        const nullRequiredField = false;

        const otherChoiceValues = [];
        // For populating array with values of other buttons;
        // input and select val === 'inputFieldValue'
        if (fieldComponent === DocumentChoicesTemplate) {
          _.each(modifiedElement.document_field_choices, eachChoice => {
            if ((eachChoice.val !== 'inputFieldValue') && (eachElement.input_type !== 'boolean')) {
              otherChoiceValues.push(eachChoice.val.toString().toLowerCase());
            }
          });
        }
        // count++;
        // Wait until document-background class is rendered to enable some logic
        const background = document.getElementById('document-background');
        const selected = this.state.selectedTemplateElementIdArray.indexOf(eachElement.id) !== -1;
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
              }); // end of each document_field_choices
              modifiedElement.width = `${totalWidth}%`;
              modifiedElement.height = `${totalHeight}%`;
              localTemplateElementsByPage = this.getLocalTemplateElementsByPage(eachElement, { width: totalWidth, height: totalHeight }, background.getBoundingClientRect(), marginBetween, true, true);

            } else { // else for if newElement
              const backgroundDimensions = background.getBoundingClientRect();
              // Send wrapper div dimensions in fractions, .50 not 5%
              const adjustedHeightInPx = ((parseFloat(eachElement.height) / 100) * backgroundDimensions.height);
              const adjustedHeightInFracs = (adjustedHeightInPx / backgroundDimensions.height);

              localTemplateElementsByPage = this.getLocalTemplateElementsByPage(eachElement, { width: (parseFloat(eachElement.width) / 100), height: adjustedHeightInFracs, top: (parseFloat(eachElement.top) / 100), left: (parseFloat(eachElement.left) / 100) }, background.getBoundingClientRect(), null, false, true);
            } // end of if newElement
          } // end of if eachElement.document_field_choices

          // NOTE: Render an editable element if editFieldsOn false and noEditOrButtons false
          // editFieldsOn is default true and can be turned off by user in the edit controls;
          // noEditOrButtons is turned on when user views document from SelectExistingDocumentModal
          if (inputElement && this.state.editFieldsOn && !this.state.translationModeOn && !this.props.noEditOrButtons) {
            return (
              <div
                key={modifiedElement.id}
                id={`template-element-${modifiedElement.id}`}
                className="create-edit-document-template-element-container"
                style={{
                  top: modifiedElement.top,
                  left: modifiedElement.left,
                  width: modifiedElement.width,
                  height: `${parseFloat(modifiedElement.height) + tabPercentOfContainerH}%`,
                  borderColor: !documentForBookingOrFlat ? 'transparent' : null
                }}
              >
                <Field
                  key={modifiedElement.name}
                  name={modifiedElement.custom_name ? modifiedElement.custom_name : modifiedElement.name}
                  // id={`template-element-input-${modifiedElement.choices[0].params.element_id}`}
                  // setting value here does not works unless its an <input or some native element
                  // value='Bobby'
                  component={fieldComponent}
                  // pass page to custom compoenent, if component is input then don't pass
                  // props={fieldComponent == DocumentChoices ? { page } : {}}
                  props={fieldComponent === DocumentChoicesTemplate ?
                    {
                      fromWhere: '(inputElement && this.state.editFieldsOn && !this.state.translationModeOn && !this.props.noEditOrButtons)',
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
                {documentForBookingOrFlat
                  ?
                  this.renderTab(modifiedElement, selected, tabLeftMarginPx, inputElement, false)
                  :
                  this.renderTab(modifiedElement, selected, tabLeftMarginPx, inputElement, true)}
              </div>
            );
          } else if (this.state.editFieldsOn && !this.state.translationModeOn) { // else if inputElement
            return (
              <div
                key={modifiedElement.id}
                id={`template-element-${modifiedElement.id}`}
                className="create-edit-document-template-element-container"
                style={{
                  border: '1px solid #ccc',
                  borderColor: !documentForBookingOrFlat ? 'transparent' : 'lightgray',
                  top: modifiedElement.top,
                  left: modifiedElement.left,
                  width: modifiedElement.width,
                  height: `${parseFloat(modifiedElement.height) + tabPercentOfContainerH}%`
                }}
              >
                <div
                  key={modifiedElement.id}
                  className="create-edit-document-template-element-container-choice-innner"
                >
                <Field
                  key={modifiedElement.name}
                  // name={modifiedElement.name}
                  name={modifiedElement.custom_name ? modifiedElement.custom_name : modifiedElement.name}
                  // id={`template-element-buttons-box-${modifiedElement.choices[0].element_id}`}
                  // setting value here does not works unless its an <input or some native element
                  // value='Bobby'
                  component={fieldComponent}
                  // pass page to custom compoenent, if component is input then don't pass
                  // props={fieldComponent == DocumentChoices ? { page } : {}}
                  props={fieldComponent === DocumentChoicesTemplate ?
                    {
                      fromWhere: 'else if (this.state.editFieldsOn && !this.state.translationModeOn)',
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
                      border: !documentForBookingOrFlat ? 'transparent' : modifiedElement.border_color,
                      margin: '0px !important',
                      flex: '1 1 auto',
                    }
                    :
                    {}
                  }
                />
                </div>
                {documentForBookingOrFlat
                  ?
                  this.renderTab(modifiedElement, selected, tabLeftMarginPx, inputElement, false)
                  :
                  this.renderTab(modifiedElement, selected, tabLeftMarginPx, inputElement, true) }
              </div>
            );
          }// end of if inputElement
            return (
              <Field
                key={modifiedElement.id}
                // name={modifiedElement.name}
                name={modifiedElement.custom_name ? modifiedElement.custom_name : modifiedElement.name}
                // setting value here does not works unless its an <input or some native element
                // value='Bobby'
                component={fieldComponent}
                // pass page to custom compoenent, if component is input then don't pass
                props={fieldComponent === DocumentChoicesTemplate ? {
                  fromWhere: 'last return in renderTemplateElements',
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
        } // end of if editTemplate && background
      });
    }
    // end of if documentEmpty
  }

  // renderEachDocumentTranslation(page) {
  //   // only render document translations when !showDocumentPdf
  //   // if (!this.state.showDocumentPdf) {
  //   return _.map(this.props.documentTranslations[page], (documentTranslation, i) => {
  //     console.log('in create_edit_document, renderEachDocumentTranslation, this.props.documentTranslations, documentTranslation, page: ', this.props.documentTranslations, documentTranslation, page);
  //     if (documentTranslation.attributes) {
  //       let textToRender = documentTranslation.translations[this.props.documentLanguageCode]
  //
  //       return (
  //         <div
  //         key={i}
  //         className={documentTranslation.attributes.class_name}
  //         style={{
  //           top: documentTranslation.attributes.top,
  //           left: documentTranslation.attributes.left,
  //           fontSize: `${documentTranslation.attributes.font_size}px`,
  //           fontWeight: documentTranslation.attributes.font_weight,
  //           transform: `rotate(-${documentTranslation.attributes.rotate}deg)`,
  //           // transformOrigin: 'top left',
  //           transformOrigin: documentTranslation.attributes.transform_origin,
  //           width: documentTranslation.attributes.width,
  //           textAlign: documentTranslation.attributes.text_align,
  //         }}
  //         >
  //         {textToRender}
  //         </div>
  //       );
  //     }
  //   });
  //   // }
  // }

  handleCreateNewTemplateElement() {
    // Turn on and off createNewTemplateElementOn local state;
    // The actual creation is done in getMousePosition
    this.setState({
      createNewTemplateElementOn: !this.state.createNewTemplateElementOn,
    }, () => {
      // In callback to setState, if turning on addEventListener
      if (this.state.createNewTemplateElementOn) {
        document.addEventListener('click', this.getMousePosition);
        this.setState({ editFieldsOn: true });
        // If user has selected a new element to be created and templateElementAttributes is not null
        // turn cursor to non-default
        if (this.state.templateElementAttributes) document.getElementById('document-background').style.cursor = 'crosshair';
      } else {
        // In callback to setState, if turning off removeEventListener
        document.removeEventListener('click', this.getMousePosition);
        if (!this.state.editFieldsOnPrevious) this.setState({ editFieldsOn: false });
        // if user turns off createNewTemplateElementOn and templateElementAttributes is not null;
        // turn cursor back to default
        if (this.state.templateElementAttributes) document.getElementById('document-background').style.cursor = 'default';
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
  //       }
  //
  //       if (editObject.action === 'update') {
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
          }

          if (editObject.action === 'update') {
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
          // if element is a template element with an 'a' put into unsavedTemplateElements from this.props.templateElements
          if (eachElementKey.indexOf('a') !== -1) {
            this.props.templateElements[eachElementKey] ? unsavedTemplateElements[eachElementKey] = this.props.templateElements[eachElementKey] : cleanUpObjects(eachObject, eachElementKey);
          }
          // if element is translation with 'b' put into unsavedTemplateElements from this.props.templateTranslationElements
          if (eachElementKey.indexOf('b') !== -1) {
            this.props.templateTranslationElements[eachElementKey] ? unsavedTemplateElements[eachElementKey] = this.props.templateTranslationElements[eachElementKey] : cleanUpObjects(eachObject, eachElementKey);
          }

          if (eachElementKey === 'undefined' || eachElementKey === null) delete modifiedEachObject[eachElementKey]
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
      localStorage.setItem('documentHistory', JSON.stringify(destringifiedHistory));
    })
  }

  setTemplateHistoryArray(elementArray, action) {
    // !!! NOTE: ONLY set historyId and templateEditHistoryArray HERE to avoid unruly code !!!!!
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
      this.setState({
        // !!!!! Index is set at End of array when user creates, deletes or updates (not in redo or undo)
        historyIndex: this.state.templateEditHistoryArray.length - 1,
      }, () => {
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

  getSelectedFieldObject() {
    return getSelectedFieldObject({
      selectedTemplateElementIdArray: this.state.selectedTemplateElementIdArray,
      templateElements: this.props.templateElements,
      allDocumentObjects: this.props.allDocumentObjects,
      documents: Documents,
      agreement: this.props.agreement,
      documentTranslationsAll: this.props.documentTranslationsAll,
      appLanguages: AppLanguages,
      appLanguageCode: this.props.appLanguageCode,
      valuesInForm: this.props.valuesInForm,
    });
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
    // function to be used for aligning horizontal and vertical values
    // make fat arrow function to set context to be able to use this.props and state
    // const getChangeChoiceIdArray = () => {
    //
    // }

    const pasteFields = () => {
      const copiedAgreement = this.props.allUserAgreementsArrayMappedWithDocumentFields[this.props.importFieldsFromOtherDocumentsObject.agreementId]
      let newElement = {};
      const newElementArray = [];
      let newDocumentFieldChoice = {};
      let newDocumentFieldChoices = {};
      let newSelectChoice = {};
      let newSelectChoices = {};
      let templateElementCount = this.state.templateElementCount;
      let translationElementCount = this.state.translationElementCount;
      // templateElementCount: this.state.templateElementCount + 1,
      // translationElementCount: this.state.translationElementCount + 1
      _.each(copiedAgreement.document_fields, eachField => {
        newDocumentFieldChoice = {};
        newDocumentFieldChoices = {};
        newSelectChoice = {};
        newSelectChoices = {};
        //fieldArrays ids are string
        if (this.props.importFieldsFromOtherDocumentsObject.fieldsArray.indexOf(eachField.id.toString()) !== -1) {
          // increment count to assign to elements; Later update state
          if (!eachField.translation_element) {
            templateElementCount++;
            // null out document_field_choices ids
            if (eachField.document_field_choices) {
              _.each(Object.keys(eachField.document_field_choices), (eachKey) => {
                if (eachField.document_field_choices[eachKey].select_choices) {
                  _.each(Object.keys(eachField.document_field_choices[eachKey].select_choices), (eachSelectKey) => {
                    newSelectChoice = { ...eachField.document_field_choices[eachKey].select_choices[eachSelectKey], id: null, document_field_choice_id: null };
                    newSelectChoices[eachSelectKey] = newSelectChoice;
                  })
                }
                newDocumentFieldChoice = { ...eachField.document_field_choices[eachKey], document_field_id: null, id: null, select_choices: eachField.document_field_choices[eachKey].select_choices ? newSelectChoices : null }
                newDocumentFieldChoices[eachKey] = newDocumentFieldChoice;
              })
            }
            newElement = { ...eachField, id: templateElementCount + 'a', agreement_id: this.props.agreementId, document_field_choices: _.isEmpty(newDocumentFieldChoices) ? null : newDocumentFieldChoices, action: 'create' };
          } else { //  if (!eachField.translation_element) {
            translationElementCount++;
            newElement = { ...eachField, id: translationElementCount + 'b', agreement_id: this.props.agreementId, action: 'create' };
          } // else if (eachField.translation_element) {
            newElementArray.push(newElement);
        } //  if (this.props.importFieldsFromOtherDocumentsObject.fieldsArray.indexOf(eachField.id.toString()) !== -1)
      }) // _.each(copiedAgreement.document_fields, eachField => {
        // create elements in template elements and templateElementsByPage in document reducer
        createElement(newElementArray);
        // Persist in localStroageHistory
        this.setTemplateHistoryArray(newElementArray, 'create');
        // Emplty out clipboard
        this.props.importFieldsFromOtherDocumentsObjectAction({
          ...this.props.importFieldsFromOtherDocumentsObject,
          agreementId: null,
          fieldsArray: [],
          // baseAgreementId: this.props.agreementId,
        });
    }; // const pasteFields = () => {


    const align = (alignWhat) => {
      // aligningElement for aligning wrappers
      const aligningElement = this.state.selectedTemplateElementIdArray.length > 0;
      // aligningChoice for aligning choice buttons
      const aligningChoice = this.state.selectedChoiceIdArray.length > 0;
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
                array.push(updatedElementObject)
              } // end of if (!eachElement.document_field_choices
            } // end of if (eachElement && eachElement.id !== baseElement.id)
          }); // end of each
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
        array = getUpdatedElementObjectNoBase({ selectedChoiceIdArray: this.state.selectedChoiceIdArray, expandContractIncrement, expandContract, tabHeight: TAB_HEIGHT, templateElements: this.props.templateElements });

      } // End of if (this.state.selectedTemplateElementIdArray.length > 0)
      this.setTemplateHistoryArray(array, 'update');
      this.props.updateDocumentElementLocally(array);
    }

    const moveElements = (direction) => {
      let array = [];
      const originalValueObject = {};
      let moveIncrement = 1;

      let wrapperDiv = null;
      let wrapperDivChoice = null;
      let eachChoice = null;
      let choiceCoordinatesObject = {}

      let backgroundDimensions = null;
      let wrapperDivDimensions = null;

      const moveEachWrapperDiv = () => {
        if (direction === 'moveLeft') wrapperDiv.style.left = `${((((parseFloat(wrapperDiv.style.left) / 100) * backgroundDimensions.width) - moveIncrement) / backgroundDimensions.width) * 100}%`;
        if (direction === 'moveRight') wrapperDiv.style.left = `${((((parseFloat(wrapperDiv.style.left) / 100) * backgroundDimensions.width) + moveIncrement) / backgroundDimensions.width) * 100}%`;
        if (direction === 'moveDown') wrapperDiv.style.top = `${((((parseFloat(wrapperDiv.style.top) / 100) * backgroundDimensions.height) + moveIncrement) / backgroundDimensions.height) * 100}%`;
        if (direction === 'moveUp') wrapperDiv.style.top = `${((((parseFloat(wrapperDiv.style.top) / 100) * backgroundDimensions.height) - moveIncrement) / backgroundDimensions.height) * 100}%`;
      }

      const moveElementsRendered = () => {
        if (this.state.selectedTemplateElementIdArray.length > 0
            // || this.state.selectedChoiceIdArray.length > 0
            ) {
          if (this.state.selectedTemplateElementIdArray.length > 0) {
            const idName = !this.state.translationModeOn ? 'template-element' : 'template-translation-element';
            backgroundDimensions = document.getElementById(`${idName}-${this.state.selectedTemplateElementIdArray[0]}`).parentElement.getBoundingClientRect();

            _.each(this.state.selectedTemplateElementIdArray, eachElementId => {
              // wrapperDiv = document.getElementById(`template-element-${eachElementId}`);
              wrapperDiv = document.getElementById(`${idName}-${eachElementId}`);
              // console.log('in create_edit_document, handleTemplateElementActionClick, moveElements, moveElementsRendered, after each, eachElementId, wrapperDiv: ', eachElementId, wrapperDiv);
              // If elements are not rendered, they will be null
              // wrapperDiv.style will be kept in memory until used to persist them
              if (wrapperDiv) {
                moveEachWrapperDiv()
                // if (direction === 'moveLeft') wrapperDiv.style.left = `${((((parseFloat(wrapperDiv.style.left) / 100) * backgroundDimensions.width) - moveIncrement) / backgroundDimensions.width) * 100}%`;
                // if (direction === 'moveRight') wrapperDiv.style.left = `${((((parseFloat(wrapperDiv.style.left) / 100) * backgroundDimensions.width) + moveIncrement) / backgroundDimensions.width) * 100}%`;
                // if (direction === 'moveDown') wrapperDiv.style.top = `${((((parseFloat(wrapperDiv.style.top) / 100) * backgroundDimensions.height) + moveIncrement) / backgroundDimensions.height) * 100}%`;
                // if (direction === 'moveUp') wrapperDiv.style.top = `${((((parseFloat(wrapperDiv.style.top) / 100) * backgroundDimensions.height) - moveIncrement) / backgroundDimensions.height) * 100}%`;
              }
            }); //  _.each(this.state.selectedTemplateElementIdArray, eachElementId => {
            console.log('in create_edit_document, handleTemplateElementActionClick, moveElements, moveElementsRendered, after each, wrapperDiv.style.left, wrapperDiv.style.top: ', wrapperDiv.style.left, wrapperDiv.style.top);
          } //  if (this.state.selectedTemplateElementIdArray.length > 0) {
        } //  if (this.state.selectedTemplateElementIdArray.length > 0 || this.state.selectedChoiceIdArray.length > 0) {

        // if (this.state.selectedChoiceIdArray.length > 0) {
        //   // updateDocumentElementLocally for when moving choices themselves
        //   // and not moving wrapperDiv
        //   const arr = getUpdatedElementObjectNoBase({ selectedChoiceIdArray: this.state.selectedChoiceIdArray, moveIncrement, direction, tabHeight: TAB_HEIGHT, templateElements: this.props.templateElements });
        //   // array = getUpdatedElementObjectNoBase({ selectedChoiceIdArray: this.state.selectedChoiceIdArray, moveIncrement, direction, tabHeight: TAB_HEIGHT, templateElements: this.props.templateElements });
        //   _.each(arr, eachElementObject => {
        //     wrapperDivChoice = document.getElementById(`template-element-${eachElementObject.id}`);
        //     backgroundDimensions = wrapperDivChoice.parentElement.getBoundingClientRect();
        //     // wrapperDivChoice = eachElementObject.document_field_choices[0].parentElement.parentElement.parentElement;
        //     wrapperDivChoice.style.left = eachElementObject.left;
        //     wrapperDivChoice.style.top = eachElementObject.top;
        //     wrapperDivChoice.style.width = eachElementObject.width;
        //     wrapperDivChoice.style.height = `${parseFloat(eachElementObject.height) + ((TAB_HEIGHT / backgroundDimensions) * 100)}%`;
        //     choiceCoordinatesObject = this.getLocalTemplateElementsByPage(eachElementObject, { top: parseFloat(eachElementObject.top) / 100, left: parseFloat(eachElementObject.left) / 100, width: parseFloat(eachElementObject.width) / 100, height: ((parseFloat(eachElementObject.height) / 100) - (TAB_HEIGHT / backgroundDimensions)) }, backgroundDimensions, 0, false, false)
        //     console.log('in create_edit_document, handleTemplateElementActionClick, moveElements, moveElementsRendered, this.state.selectedChoiceIdArray, arr, eachElementObject, choiceCoordinatesObject), wrapperDivChoice.style.height, eachElementObject.height: ', this.state.selectedChoiceIdArray, arr, eachElementObject, choiceCoordinatesObject, wrapperDivChoice.style.height, eachElementObject.height);
        //     _.each(Object.keys(eachElementObject.document_field_choices), eachChoiceIndex => {
        //       eachChoice = document.getElementById(`template-element-button-${eachElementObject.id},${eachChoiceIndex}`);
        //       console.log('in create_edit_document, handleTemplateElementActionClick, moveElements, moveElementsRendered, after each, this.state.selectedChoiceIdArray, arr, wrapperDivChoice, eachChoice, eachElementObject.document_field_choices[eachChoiceIndex].left, eachChoiceIndex: ', this.state.selectedChoiceIdArray, arr, eachChoice, wrapperDivChoice, eachElementObject.document_field_choices[eachChoiceIndex].left, eachChoiceIndex);
        //       eachChoice.style.left = choiceCoordinatesObject[eachChoiceIndex].left;
        //       eachChoice.style.top = choiceCoordinatesObject[eachChoiceIndex].top;
        //       eachChoice.style.width = choiceCoordinatesObject[eachChoiceIndex].width;
        //       eachChoice.style.height = choiceCoordinatesObject[eachChoiceIndex].height;
        //     }); //  _.each(eachElementObject.document_field_choices, eachChoiceIndex => {
        //   }); // _.each(arr, eachElementObject => {
        // } // if (this.state.selectedChoiceIdArray.length > 0) {
      }; //  moveElementsRendered = () => {

      // *************Timer******************
      if (this.state.selectedTemplateElementIdArray.length > 0) {
        const afterClickingStopped = () => {
          // moveIncrement = this.state.moveIncrement;
          console.log('in create_edit_document, handleTemplateElementActionClick, moveElements, afterClickingStopped, this.state.moveIncrement: ', this.state.moveIncrement);
          persistTotalMoveInProps();
        }

        if (moveElementClickingTimer !== null) {
          clearTimeout(moveElementClickingTimer);
          this.setState({ moveIncrement: this.state.moveIncrement + moveIncrement }, () => {
            console.log('in create_edit_document, handleTemplateElementActionClick, moveElements, in clearTimeout, this.state.moveElements, moveIncrement: ', this.state.moveIncrement);
          });
          // Only move the elements in the viewport (or ones rendered)
          moveElementsRendered();
        }

        moveElementClickingTimer = setTimeout(() => {
          // In setTimeout callback
          afterClickingStopped();
        }, 700);
        // *************Timer******************
      } //  if (this.state.selectedTemplateElementIdArray.length > 0) {

        // // *************** Start of Persist *********************
      const persistTotalMoveInProps = () => {
        if (this.state.selectedTemplateElementIdArray.length > 0
            || this.state.selectedChoiceIdArray.length > 0
          ) {
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
                    if (direction === 'moveLeft') array.push({ id: eachElement.id, left: `${((((parseFloat(eachElement.left) / 100) * backgroundDimensions.width) - this.state.moveIncrement) / backgroundDimensions.width) * 100}%`, o_left: originalValueObject[eachElement.id].left, translation_element: eachElement.translation_element, action: 'update' });
                    if (direction === 'moveRight') array.push({ id: eachElement.id, left: `${((((parseFloat(eachElement.left) / 100) * backgroundDimensions.width) + this.state.moveIncrement) / backgroundDimensions.width) * 100}%`, o_left: originalValueObject[eachElement.id].left, translation_element: eachElement.translation_element, action: 'update' });
                    if (direction === 'moveDown') array.push({ id: eachElement.id, top: `${((((parseFloat(eachElement.top) / 100) * backgroundDimensions.height) + this.state.moveIncrement) / backgroundDimensions.height) * 100}%`, o_top: originalValueObject[eachElement.id].top, translation_element: eachElement.translation_element, action: 'update' });
                    if (direction === 'moveUp') array.push({ id: eachElement.id, top: `${((((parseFloat(eachElement.top) / 100) * backgroundDimensions.height) - this.state.moveIncrement) / backgroundDimensions.height) * 100}%`, o_top: originalValueObject[eachElement.id].top, translation_element: eachElement.translation_element, action: 'update' });
                  } else { // else of if (!eachElement.document_field_choices)
                    // Move the wrapper div and the choices will follow then get the new state values
                    wrapperDiv = document.getElementById(`template-element-${eachElementId}`);
                    // wrapperDivDimensions = wrapperDiv.getBoundingClientRect();
                    console.log('in create_edit_document, handleTemplateElementActionClick, moveElements, persistTotalMoveInProps, wrapperDiv, eachElementId: ', wrapperDiv, eachElementId);

                    wrapperDivDimensions = {
                      top: ((parseFloat(originalValueObject[eachElementId].top) / 100) * backgroundDimensions.height) + backgroundDimensions.top,
                      left: ((parseFloat(originalValueObject[eachElementId].left) / 100) * backgroundDimensions.width) + backgroundDimensions.left,
                      width: ((parseFloat(originalValueObject[eachElementId].width) / 100) * backgroundDimensions.width),
                      height: (((parseFloat(originalValueObject[eachElementId].height) / 100) + (TAB_HEIGHT / backgroundDimensions.height)) * backgroundDimensions.height)
                    }
                    // backgroundDimensions = wrapperDiv.parentElement.getBoundingClientRect();
                    // wrapperDivDimensions = wrapperDiv.getBoundingClientRect();
                    if (direction === 'moveLeft') wrapperDiv.style.left = `${((((parseFloat(wrapperDiv.style.left) / 100) * backgroundDimensions.width)) / backgroundDimensions.width) * 100}%`;
                    if (direction === 'moveRight') wrapperDiv.style.left = `${((((parseFloat(wrapperDiv.style.left) / 100) * backgroundDimensions.width)) / backgroundDimensions.width) * 100}%`;
                    if (direction === 'moveDown') wrapperDiv.style.top = `${((((parseFloat(wrapperDiv.style.top) / 100) * backgroundDimensions.height)) / backgroundDimensions.height) * 100}%`;
                    if (direction === 'moveUp') wrapperDiv.style.top = `${((((parseFloat(wrapperDiv.style.top) / 100) * backgroundDimensions.height)) / backgroundDimensions.height) * 100}%`;
                    // if (direction === 'moveLeft') wrapperDiv.style.left = `${((((parseFloat(wrapperDiv.style.left) / 100) * backgroundDimensions.width) - this.state.moveIncrement) / backgroundDimensions.width) * 100}%`;
                    // if (direction === 'moveRight') wrapperDiv.style.left = `${((((parseFloat(wrapperDiv.style.left) / 100) * backgroundDimensions.width) + this.state.moveIncrement) / backgroundDimensions.width) * 100}%`;
                    // if (direction === 'moveDown') wrapperDiv.style.top = `${((((parseFloat(wrapperDiv.style.top) / 100) * backgroundDimensions.height) + this.state.moveIncrement) / backgroundDimensions.height) * 100}%`;
                    // if (direction === 'moveUp') wrapperDiv.style.top = `${((((parseFloat(wrapperDiv.style.top) / 100) * backgroundDimensions.height) - this.state.moveIncrement) / backgroundDimensions.height) * 100}%`;
                    // getUpdatedElementObjectMoveWrapper for moving wrapper div and
                    // having choices move along with it
                    const updatedElementObject = getUpdatedElementObjectMoveWrapper({ wrapperDiv, eachElementId, originalWrapperDivDimensions: wrapperDivDimensions, templateElements: this.props.templateElements, elementDrag: true, tabHeight: TAB_HEIGHT })
                    array.push(updatedElementObject);
                  } // end of else if eachElement.document_field_choices
                } // end of if (eachElement)
              }); // end of each
            } // End of if (this.state.selectedTemplateElementIdArray.length > 0

          if (this.state.selectedChoiceIdArray.length > 0) {
            // updateDocumentElementLocally for when moving choices themselves
            // and not moving wrapperDiv
            array = getUpdatedElementObjectNoBase({ selectedChoiceIdArray: this.state.selectedChoiceIdArray, moveIncrement, direction, tabHeight: TAB_HEIGHT, templateElements: this.props.templateElements });
            console.log('in create_edit_document, handleTemplateElementActionClick, moveElements, persistTotalMoveInProps, this.state.moveIncrement, array: ', this.state.moveIncrement, array);
          }

          this.setTemplateHistoryArray(array, 'update');
          this.props.updateDocumentElementLocally(array);
          // this.setState({ moveIncrement: 0 }, () => {
            //   console.log('in create_edit_document, handleTemplateElementActionClick, moveElements, at end of function, this.state.moveIncrement: ', this.state.moveIncrement);
            // });
        } // End of if (this.state.selectedTemplateElementIdArray.length > 0 || ...
      }; // const persistTotalMoveInProps = () => {
      //   // *************** End of Persist *********************

      if (this.state.selectedChoiceIdArray.length > 0) {
        persistTotalMoveInProps();
        // console.log('in create_edit_document, handleTemplateElementActionClick, moveElements, in selectedChoiceIdArray.length > 0, typeof persistTotalMoveInProps: ', typeof persistTotalMoveInProps);
      }
    }; // const moveElements = (direction) => {

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
        });
      }
    }; // end of changeFont

    const changeDirection = () => {
      if (this.state.selectedTemplateElementIdArray.length > 0) {
        let eachElement = null;
        let templateElements = this.props.translationModeOn ? this.props.templateElements : this.props.templateTranslationElements;
        const array = [];
        let originalTransform = '';
        let newTransform = '';
        _.each(this.state.selectedTemplateElementIdArray, eachId => {
          eachElement = templateElements[eachId];
          // transform is persisted as transform: '90'
          originalTransform = eachElement.transform ? parseInt(eachElement.transform, 10) : 0;
          newTransform = originalTransform >= 270 ? 0 : originalTransform + 90;
          // array.push({ id: eachId, transform: originalTransform ? `${originalTransform + 90}` : '90', o_transform: originalTransform, translation_element: eachElement.translation_element, action: 'update', addKey: 'transform' });
          array.push({ id: eachId, transform: newTransform, o_transform: originalTransform, translation_element: eachElement.translation_element, action: 'update', addKey: 'transform' });
        });
        updateElement(array);
        this.setTemplateHistoryArray(array, 'update');
      }
    } // end of changeDirection

    const createElement = (elementObjectArray) => {
      this.props.createDocumentElementLocally(elementObjectArray);
    };

    const deleteElement = (elementsIdArray, translationModeOn) => {
      this.props.deleteDocumentElementLocally({ selectedTemplateElementIdArray: elementsIdArray, translationModeOn, callback: () => {} });
    };

    const updateElement = (elementsArray) => {
      this.props.updateDocumentElementLocally(elementsArray);
    };
    // redoUndoAction receives array of update objects [{ id: 123, o_width: '', width: '', action: 'update' }]
    // and doWhatNow is 'undo', 'redo'
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
      }; // End of const removeActionAttribute = (lastActionArr) => {

      const getOriginalAttributes = (lastActionArr) => {
        const array = [];
        let withoutO = '';
        _.each(lastActionArr, eachObject => {
          // const eachModified = this.getNewElementObject(each);
          const object = {};
          _.each(Object.keys(eachObject), eachKey => {
            // console.log('in create_edit_document, handleTemplateElementActionClick, getOriginalAttributes, in last action create eachKey, eachKey[0] === o, eachKey[1] === _  : ', eachKey, eachKey[0] === 'o', eachKey[1] === '_');
            // if ((eachKey[0] === 'o' && eachKey[1] === eachKey[1].toUpperCase())) {
            if ((eachKey[0] === 'o' && eachKey[1] === '_')) {
              // substring is (inclusive, exclusive)
              withoutO = eachKey.substring(2, eachKey.length);
              // const newKey = withoutO[0].toLowerCase() + withoutO.substring(1);
              // object[newKey] = eachObject[eachKey];
              object[withoutO] = eachObject[eachKey];
            }
            // Let id, translation_element (for separating templateElements and templateTranslationElements)
            // and previous_value (for dealing with translation element history) in the returned object
            if (eachKey === 'id' || eachKey === 'translation_element' || eachKey === 'previous_value' || eachKey === 'value') {
              object[eachKey] = eachObject[eachKey] === undefined ? '' : eachObject[eachKey];
            }
          });
          array.push(object);
        });
        return array;
      }; // End of const getOriginalAttributes = ()
      // if the last action taken was to craete an element,
      // if from undo action, call delete, and if redo, call create
      if (lastActionArray[0].action === 'create') {
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
        if (doWhatNow === 'redo') createElement(lastActionArray); // send just object hash
      }

      if (lastActionArray[0].action === 'update') {
        // const modifiedPersistedObject = [...this.state.modifiedPersistedElementsObject];
        if (doWhatNow === 'undo') {
          // Get attributes without 'o' infront
          const newLastAction = getOriginalAttributes(lastActionArray);
          updateElement(newLastAction);
          // if there is previous_value in newLastAction,
          // Change back value of field; Only one change in value is made per history array
          // if (newLastAction[0].previous_value) {
            const templateElement = !newLastAction[0].translation_element ? this.props.templateElements : this.props.templateTranslationElements;
            const translationOrNot = !newLastAction[0].translation_element ? '' : '+translation';
            let name = null;
            // this.props.change is imported from redux-form
            _.each(newLastAction, eachAction => {
              name = templateElement[eachAction.id].custom_name ? templateElement[eachAction.id].custom_name : templateElement[eachAction.id].name
              // change is a reduxForm method
              this.props.change(`${name}${translationOrNot}`, eachAction.previous_value)
            });
          // }
        } else {
          // Use lastActionArray as is [{ id: xx, left: xx, top: xx}, { id: xx, left: xx, top: xx}]
          updateElement(lastActionArray);
          // if there is previous_value in lastActionArray,
          // Change back value of field; Only one change in value is made per history array
          // if (lastActionArray[0].previous_value) {
            const templateElement = !lastActionArray[0].translation_element ? this.props.templateElements : this.props.templateTranslationElements;
            const translationOrNot = !lastActionArray[0].translation_element ? '' : '+translation';
            let name = null;
            // this.props.change is imported from redux-form
            _.each(lastActionArray, eachAction => {
              name = templateElement[eachAction.id].custom_name ? templateElement[eachAction.id].custom_name : templateElement[eachAction.id].name
              // change is a reduxForm method
              this.props.change(`${name}${translationOrNot}`, eachAction.value)
            });
            // this.props.change(`${templateElement[lastActionArray[0].id].name}${translationOrNot}`, lastActionArray[0].value)
          // }
        }
      }

      if (lastActionArray[0].action === 'delete') {
        const newLastActionArray = removeActionAttribute(lastActionArray);
        if (doWhatNow === 'undo') {
          // _.each(newLastAction, eachElement => {
          createElement(newLastActionArray);
          // });
          // _.each(newLastAction, eachElement => {
          //   createElement(eachElement);
          // });
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
            // Update historyIndex in localStorageHistory
            this.setLocalStorageHistory('undo');
          })
        }
      } else { // else for if doWhat undo; else REDO
        // First increment historyIndex
        this.setState({
          historyIndex: this.state.historyIndex + 1
        }, () => {
          // Get array of objects at historyIndex
          lastActionArray = this.state.templateEditHistoryArray[this.state.historyIndex]
          redoUndoAction(lastActionArray, doWhat);
          this.setLocalStorageHistory('redo')
        });
      }
    };

      switch (elementVal) {
        case 'editFields':
          this.setState({
            // editFieldsOnPrevious for if user selects createNewTemplateElementOn when editFieldsOn
            // User does not have to turn off or on editFieldsOn each time turns on/off createNewTemplateElementOn
            editFieldsOn: !this.state.editFieldsOn,
            editFieldsOnPrevious: !this.state.editFieldsOnPrevious,
            selectedTemplateElementIdArray: [],
            allElementsChecked: false
          }, () => {
            // If user turns off editFieldsOn, turn off createNewTemplateElementOn
            if (!this.state.editFieldsOn) this.setState({ createNewTemplateElementOn: false });
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
          });
          break;
        // align method aligns elements and choices to a base element or choice
        case 'pasteFields':
          pasteFields(elementVal);
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
              this.setState({ selectedElementFontObject: fontObject.selectObject });
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
              selectedChoiceIdArray: [],
              databaseValuesExistForFields: false
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

        case 'changeDirection':
          changeDirection(elementVal);
          break;

        case 'getFieldValues':
          // Open getFieldValuesBox
          const originalValuesExistForSelectedFields = this.findIfOriginalValuesExistForFields();
          // findIfDatabaseValuesExistForFields runs initialValues method in componentDidUpdate
          if (!this.state.translationModeOn && this.state.selectedTemplateElementIdArray.length > 0) this.findIfDatabaseValuesExistForFields();

          this.setState({
            getFieldValues: !this.state.getFieldValues,
            getFieldValuesCompletedArray: [],
            selectedGetFieldValueChoiceArray: [],
            originalValuesExistForSelectedFields,
            // originalValuesExistForSelectedFields: false
          }, () => {
            if (!this.state.translationModeOn) this.props.setSelectedFieldObject(this.getSelectedFieldObject());
            // this.props.showSelectExistingDocumentModal(this.state.selectedTemplateElementIdArray);
            document.addEventListener('click', this.handleFontControlCloseClick);
            document.addEventListener('keydown', this.handleFontControlCloseClick);
            if (this.state.getFieldValues) this.props.grayOutBackground(() => this.props.showLoading())
          });

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
    // this.state.templateElementActionIdObject.array.indexOf('input,custom') === -1
    // When showCustomInputCreateMode is true, do not reinitiallize
    this.setState({
      templateFieldChoiceArray: newArray,
      // Somehow, array needs to be assigned specifically like below or does not empty out
      // templateElementActionIdObject and templateElementAttributes
      templateElementActionIdObject: !this.state.showCustomInputCreateMode
                                      ?
                                      { ...INITIAL_TEMPLATE_ELEMENT_ACTION_ID_OBJECT, array: [] }
                                      :
                                      this.state.templateElementActionIdObject,
      templateElementAttributes: null
    }, () => {
      // After set state, use the array as a path for templateMappingObject to get outermost node
      this.setState({ templateFieldChoiceObject: this.getFieldChoiceObject() }, () => {
      document.getElementById('document-background').style.cursor = 'default';

      })
    });
  }

  getFieldChoiceObject() {
    let currentObject = !this.state.translationModeOn
                        ? this.props.templateMappingObjects[this.props.agreement.template_file_name]
                        : this.state.documentTranslationsTreated;
    // Use the templateFieldChoiceArray like ['flat', 'amenities'] to get to the currentObject
    _.each(this.state.templateFieldChoiceArray, each => {
      if (currentObject[each]) {
        if (currentObject[each].choices && Object.keys(currentObject[each]).length > 1) {
          currentObject = currentObject[each].choices;
        } else {
          currentObject = currentObject[each];
        }
      }
    });
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
    // *********** Start of logic after user click ************
    const clickedElement = event.target;
    const elementId = clickedElement.getAttribute('id');
    const elementIdArray = elementId.split(',');
    // elementType (button, input, select, list)
    let elementType = elementIdArray[0];
    // id if user clicks on custom field button
    const customInputId = 'input,custom';
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
        newObject.array.push(elementId);
        // if there is an increment value (e.g. select)
        increment ? newObject[elementType] = newObject[elementType] + increment : newObject[elementType]++;
        // newObject[elementType]++;
      }
    } else { // else of if !input && !buttons
      if (elementType === 'buttons') {
        newObject = takeOutOtherTypes(elementType, newObject);
      }

      if (elementType === 'input') {
        // Get index of clicked elementId
        const elementIdIndex = this.state.templateElementActionIdObject.array.indexOf(elementId);
        if (elementIdIndex !== -1 && elementId !== customInputId) {
          // If elementId is already in array, take out to swich off button
          this.setState({
            templateElementAttributes: null,
            customFieldNameInputValue: ''
           });
          newObject.array.splice(elementIdIndex, 1);
          newObject[elementType]--;
        } else if (this.state.templateElementActionIdObject.array.length > 0 && elementId !== customInputId) {
          // If something is already in the array, empty out amd push the current elementId
          newObject = { ...INITIAL_TEMPLATE_ELEMENT_ACTION_ID_OBJECT, array: [], [elementType]: 0 };
          newObject.array.push(elementId);
          newObject[elementType]++;
        } else if (elementId === customInputId) {
          // If custom button is clicked initialize newObject
          newObject = { ...INITIAL_TEMPLATE_ELEMENT_ACTION_ID_OBJECT, array: ['input,,'], input: 1 };
        } else if (elementId !== customInputId) {
          // If input and any button is clicked other than the custom button, push into array
          newObject.array.push(elementId);
          newObject[elementType]++;
        }
      }
    }

    this.setState({
      templateElementActionIdObject: newObject
    }, () => {
      // NOTE: buttons plural; If input or buttons, add element
      if (elementType === 'input' || elementType === 'buttons') {
      // if (elementType === 'input' || elementType === 'buttons' || trueOrFalseSelect) {
        if (elementIdArray[1] === 'custom') {
          this.setState({
            showCustomInputCreateMode: !this.state.showCustomInputCreateMode,
            templateElementAttributes: null,
            customFieldNameInputValue: '',
            templateFieldChoiceArray: [],
            templateFieldChoiceObject: null
          }, () => {
            if (this.state.showCustomInputCreateMode) {
              this.handleTemplateElementAddClick();
            }
          });
        } else {
          // If input of button and not custom create the templateElementAttributes object
          // so user can click on document and place the new element
          this.handleTemplateElementAddClick();
        } // if (elementIdArray[1] === 'custom') {
      } // if (elementType === 'input' || elementType === 'buttons') {
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

    const createObject = () => {
      let templateElementAttributes = {};
      let createdObject = null;
      // No parent in summaryObject indciates it is an input (no choices) or button/select (true or false)
      if (!summaryObject.parent) {
        // input only has one in array; Used for custom input
        if (summaryObject.input.length > 0) {
          // IMPORTANT: translation field uses input to crate the templateElementAttributes
          const { translationModeOn } = this.state;
          createdObject = summaryObject.input[0];

          templateElementAttributes = {
            id: null,
            // left, top and page assigned in getMousePosition
            name: !translationModeOn ? createdObject.name : elementIdArray[elementIdArray.length - 1],
            component: !translationModeOn ? createdObject.component : null,
            // width: createdObject.choices[0].params.width,
            width: !translationModeOn ? createdObject.choices[Object.keys(createdObject.choices)[0]].params.width : '20%',
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
            translation_element: this.state.translationModeOn,
            // custom_element: this.state.showCustomInputCreateMode,
            custom_name: createdObject.custom_name,
            transform_origin: 'top left',
            transform: null,
            translation: this.state.templateElementActionIdObject.translation
          };
        } else if (summaryObject.buttons.length > 0) {
          // else of if (summaryObject.input.length > 0) {
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
              document_field_choices: {},
              transform_origin: 'top left',
              transform: null
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
                border: '1px solid black',
              };
            });
          } else if (summaryObject.select.length > 0) {
            // else of if (summaryObject.input.length > 0) {
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
              transform_origin: 'top left',
              transform: null,
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
                  // input_type: createdObject.type,
                  input_type: 'string', // cannot have button or will not render on pdf
                  font_size: '12px',
                  translation: this.state.templateElementActionIdObject.translation,
                  // border_radius: '3px',
                  border: '1px solid black',
                  // 0 for true is a peculiarity we need to live with
                  selectChoices: {
                    0: { value: true },
                    1: { value: false }
                  }
                }
              }
            };
          } else if (summaryObject.list.length > 0) {
            // else of if (summaryObject.input.length > 0) {
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
              list_parameters: listParameters,
              transform_origin: 'top left',
              transform: null
            };
          } // end of if (summaryObject.input.length > 0) {
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
              document_field_choices: {},
              transform_origin: 'top left',
              transform: null
            };

            if (summaryObject.button.length > 0) {
              _.each(summaryObject.button, each => {
                createdObject = each;
                templateElementAttributes.document_field_choices[count] = {
                  val: createdObject.value || createdObject.val || createdObject.params.val,
                  // val: createdObject.val,
                  top: null,
                  left: null,
                  width: createdObject.width || createdObject.params.width,
                  // height: createdObject.choices[eachIndex].params.height,
                  height: createdObject.height || createdObject.params.height || '2.0%',
                  // class_name: createdObject.choices[eachIndex].params.class_name,
                  font_size: '12px',
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
                // input_type: createdObject.type,
                input_type: 'string', // Cannot have button or will not render on pdf
                font_size: '12px',
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
                    selectChoices[i] = each;
                  }
                });
              }
            } // end of  if (summaryObject.button.length > 0
          }
          // Placeholder until create element completed.
          this.setState({
            templateElementAttributes
          }, () => {
            // Change the mouse cursor if createNewTemplateElementOn
            if (this.state.createNewTemplateElementOn) document.getElementById('document-background').style.cursor = 'crosshair';
            // console.log('in create_edit_document, handleTemplateElementAddClick, this.state.templateElementAttributes, summaryObject: ', this.state.templateElementAttributes, summaryObject);
          });
    }; // end of createObject function

    if (this.state.templateElementActionIdObject.array.length > 0) {
      if (!this.state.showCustomInputCreateMode) {
        _.each(this.state.templateElementActionIdObject.array, (each, i) => {
          elementIdArray = each.split(',');
          elementType = elementIdArray[0];
          // get path to relevant object e.g. [building, construction]
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
            // console.log('in create_edit_document, handleFieldChoiceActionClick, in each modEach, currentObject, objectPathArray, this.state.templateElementActionIdObject.array: ', modEach, currentObject, objectPathArray, this.state.templateElementActionIdObject.array);
            currentObject = currentObject[modEach];
          });
          summaryObject.parent = parent;
          summaryObject[elementType].push(currentObject);
          // console.log('in create_edit_document, handleTemplateElementAddClick, elementIdArray, elementType, objectPathArray, currentObject, parent, indexOfChoices, summaryObject: ', elementIdArray, elementType, objectPathArray, currentObject, parent, indexOfChoices, summaryObject);
        });
        createObject();
      } else { // if (!this.state.showCustomInputCreateMode), i.e. customField on
        // logic for summaryObject for custom element
        const elementId = this.state.templateElementActionIdObject.array[0];
        // split string looking like 'input,building,construction'
        // custom elementId is 'input,,'
        elementIdArray = elementId.split(',');
        // array like [input,building,construction]
        elementType = elementIdArray[0];
        // name like 'construction'
        const name = elementIdArray[elementIdArray.length - 1];

        const customCurrentObject = {
          name,
          custom_name: this.state.customFieldNameInputValue,
          component: 'DocumentChoices',
          choices: {
            inputFieldValue: { params: { val: 'inputFieldValue', top: '0%', left: '0%', width: '20%', class_name: 'document-rectangle', input_type: 'text' } },
          }
        };

        // If customFieldNameInputValue empty or has a custom name already assign name
        if ((this.state.customFieldNameInputValue === '' && name)
            || this.state.customFieldNameInputValue.indexOf('custom-') !== -1) {
          this.setState({ customFieldNameInputValue: `custom-${name}` }, () => {
            customCurrentObject.custom_name = this.state.customFieldNameInputValue;
            summaryObject[elementType].push(customCurrentObject);
            createObject();
            // console.log('in create_edit_document, handleFieldChoiceActionClick, in else summaryObject, elementType, this.state.customFieldNameInputValue: ', summaryObject, elementType, this.state.customFieldNameInputValue);
          });
        } else {
          customCurrentObject.custom_name = this.state.customFieldNameInputValue;
          summaryObject[elementType].push(customCurrentObject);
          createObject();
        } // if (this.state.customFieldNameInputValue === '' || ...
      } //// if (!this.state.showCustomInputCreateMode),
    } //  if (this.state.templateElementActionIdObject.array.length > 0)
  }

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
        // console.log('in create_edit_document, renderEachTranslationFieldChoice, in else translationMappingObject, eachKey, this.state.templateElementActionIdObject, elementIdArray: ', translationMappingObject, eachKey, this.state.templateElementActionIdObject, elementIdArray);
        // if the object of the eachKey has no translations, must be a category or group
        if (translationMappingObject[eachKey] && !translationMappingObject[eachKey].translations) {

          choiceText = AppLanguages[eachKey] ? AppLanguages[eachKey][this.props.appLanguageCode] : eachKey;

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
          // object has translations so not group or category
          choiceText = translationMappingObject[eachKey] ? translationMappingObject[eachKey].translations[this.props.agreement.language_code] : eachKey;
          // choiceText = translationMappingObject[eachKey] ? translationMappingObject[eachKey].translations[this.props.appLanguageCode] : eachKey;
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
                  style={elementIdArray.indexOf('input,' + valueString) !== -1
                          ?
                          { backgroundColor: 'lightgray' } : {}}

                  // className="create-edit-document-template-each-choice-action-box-button"
                >
                  {this.state.showCustomInputCreateMode ? 'Link Value' : 'Add Translation'}
                </div>
              </div>
            </div>
          );
        }
      });
    }
  }

  handleFieldChoiceMouseOver(event) {
    const mousedOverElement = event.target;
    const elementId = mousedOverElement.getAttribute('id');
    // placeholder; not yet built out
  }

  renderEachCustomFieldChoice() {
    const elementIdArray = this.state.templateElementActionIdObject.array;

    let choiceText = null;
    let inputElement = null;
    let translationSibling = null;
    let choices = null;
    let choicesYesOrNo = null;
    let choicesObject = null;
    let selectChoices = null;
    let valueString = null;
    let firstChoice = null;
    let count = 0;

    const templateMappingObject = this.state.templateFieldChoiceObject === null ? this.props.templateMappingObjects[this.props.agreement.template_file_name] : this.state.templateFieldChoiceObject;

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
          count++;
          return this.renderGroupElement({ eachKey, choiceText, templateMappingObject });
        } else if (templateMappingObject[eachKey]) { // else of if not group
          firstChoice = templateMappingObject[eachKey].choices ? templateMappingObject[eachKey].choices[Object.keys(templateMappingObject[eachKey].choices)[0]] : null;
          inputElement = !templateMappingObject[eachKey].params && firstChoice.params.val === 'inputFieldValue';
          valueString = 'input,' + this.state.templateFieldChoiceArray.join(',') + ',' + eachKey;
          translationSibling = !templateMappingObject[eachKey].params && templateMappingObject[eachKey].translation_sibling;

          choices = !templateMappingObject[eachKey].params && Object.keys(templateMappingObject[eachKey].choices).length > 1;
          choicesObject = templateMappingObject[eachKey].params;
          choicesYesOrNo = !templateMappingObject[eachKey].params && firstChoice.valName === 'y';

          // if (inputElement) {
          count++;
          return this.renderAddInputElement({ eachKey, templateMappingObject, choiceText, valueString, translationSibling, customField: true })
          // }
        }
      });
    } // if (templateMappingObject)
  }

  renderAddInputElement({ eachKey, templateMappingObject, choiceText, valueString, translationSibling, customField }) {
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
            onMouseOver={this.handleFieldChoiceMouseOver}
            style={this.state.templateElementActionIdObject.array.indexOf(valueString) !== -1 ? { backgroundColor: 'lightgray' } : {}}
          >
            {customField ? 'Link Value' : 'Add Input'}
          </div>
          <div
            id={valueString + ',translation_sibling'}
            style={!translationSibling ? { border: 'none' } : {}}
            onClick={this.handleFieldChoiceActionClick}
          >
          {translationSibling && !customField ? 'Add Translation' : ''}
          {translationSibling && customField ? 'Link Translation' : ''}
          </div>
        </div>
      </div>
    );
  }

  renderGroupElement({ eachKey, choiceText, templateMappingObject }) {
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
  }

  renderEachFieldChoice() {
    const elementIdArray = this.state.templateElementActionIdObject.array;
    const renderChoiceDivs = (props) => {
      const { eachIndex, valueString, choiceText } = props;
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

          return this.renderGroupElement({ eachKey, choiceText, templateMappingObject });
          // return (
          //   <div
          //     key={eachKey}
          //     className="create-edit-document-template-each-choice-group"
          //     value={eachKey}
          //     onClick={this.handleFieldChoiceClick}
          //   >
          //     {choiceText}&ensp;&ensp;{!templateMappingObject[eachKey].component ? <i className="fas fa-angle-right" style={{ color: 'blue' }}></i> : ''}
          //   </div>
          // );
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

            return this.renderAddInputElement({ eachKey, templateMappingObject, choiceText, valueString, translationSibling })
            // return (
            //   <div
            //     key={eachKey}
            //     className="create-edit-document-template-each-choice"
            //     style={templateMappingObject[eachKey].extraHeightTemplate ? { height: '70px' } : {}}
            //   >
            //     <div
            //       className="create-edit-document-template-each-choice-label"
            //       style={templateMappingObject[eachKey].extraHeightTemplate ? { marginBottom: '10px' } : {}}
            //     >
            //       {choiceText}
            //     </div>
            //     <div
            //       className="create-edit-document-template-each-choice-action-box"
            //     >
            //       <div
            //         id={valueString}
            //         onClick={this.handleFieldChoiceActionClick}
            //         onMouseOver={this.handleFieldChoiceMouseOver}
            //       >
            //         Add Input
            //       </div>
            //       <div
            //         id={valueString + ',translation_sibling'}
            //         style={!translationSibling ? { border: 'none' } : {}}
            //         onClick={this.handleFieldChoiceActionClick}
            //       >
            //       {translationSibling ? 'Add Translation' : ''}</div>
            //     </div>
            //   </div>
            // );
          } // End of if inputElement

          // Case of field being choices but not Yes or No choices
          if (choicesObject && !choicesYesOrNo) {
            // receivs eachKey of 0, 1 of templateMappingObject is {0=>{}, 1=>{}}
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
    const newObject = { ...this.state.templateElementActionIdObject, [elementVal]: !this.state.templateElementActionIdObject[elementVal] };
    this.setState({
      templateElementActionIdObject: newObject,
      // If there is already templateElementAttributes, turn translation true/false
      templateElementAttributes: this.state.templateElementAttributes
                                  ?
                                  { ...this.state.templateElementAttributes, translation: !this.state.templateElementAttributes.translation }
                                  :
                                  this.state.templateElementAttributes
    }, () => {
      // console.log('in create_edit_document, handleFieldPreferencesClick, elementVal, this.state.templateElementActionIdObject, this.state.templateElementAttributes: ', elementVal, this.state.templateElementActionIdObject, this.state.templateElementAttributes);
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
    const disableTranslation = ((this.state.templateElementActionIdObject.list > 0
                                  || this.state.templateElementActionIdObject.select > 0)
                                && this.state.templateElementActionIdObject.translation)
                                || (this.state.showCustomInputCreateMode && this.state.templateElementActionIdObject.translation)
                                || (this.state.templateElementAttributes && this.state.templateElementAttributes.translation);
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
          {this.state.templateElementActionIdObject.list > 0
            || this.state.templateElementActionIdObject.select > 0
            || (this.state.showCustomInputCreateMode && !this.state.translationModeOn)
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

  renderCustomFieldButton() {
    return (
      <div
        className="create-edit-document-template-each-choice-custom"
      >
        <div
          className="create-edit-document-template-each-choice-label-custom"
        >
          Custom Field
        </div>
        <div
          className="create-edit-document-template-each-choice-action-box-custom"
        >
          <div
            id={'input,custom'}
            onClick={this.handleFieldChoiceActionClick}
            // style={this.state.templateElementActionIdObject.array.indexOf('input,custom') !== -1 ? { backgroundColor: 'lightgray' } : {}}
            style={this.state.showCustomInputCreateMode ? { backgroundColor: 'lightgray' } : {}}
            // className="create-edit-document-template-each-choice-action-box-button"
          >
            Create
          </div>
        </div>
      </div>
    )
  }

  handleCustomFieldNameInput(event) {
    // const clickedElement = event.target;
    // const elementVal = clickedElement.getAttribute('value');
    // For some reaons, event.target.value works but elementVal does not
    this.setState({ customFieldNameInputValue: event.target.value }, () => {
      // console.log('in create_edit_document, handleCustomFieldNameInput, this.state.customFieldNameInputValue: ', this.state.customFieldNameInputValue);
    });
  }

  renderCustomFieldNameInput() {
    // console.log('in create_edit_document, renderCustomFieldNameInput, this.state.templateElementAttributes: ', this.state.templateElementAttributes);
    return (
      <div
        className="create-edit-document-template-each-choice-input"
      >
        <div
          className="create-edit-document-template-each-choice-label-input"
        >
          Name New Custom Field
        </div>
        <input
          type="string"
          value={this.state.customFieldNameInputValue}
          onChange={this.handleCustomFieldNameInput}
          style={this.state.templateElementAttributes && !this.state.customFieldNameInputValue
                  ?
                { border: '2px solid red' }
                  :
                {}}
          className="create-edit-document-template-each-choice-action-box-input"
        />
      </div>
    );
  }

  handleCustomFieldPathDelete() {
    this.setState({
      templateElementAttributes: null,
      customFieldNameInputValue: '',
      templateElementActionIdObject: { ...INITIAL_TEMPLATE_ELEMENT_ACTION_ID_OBJECT, array: [] }
    }, () => {
      // console.log('in create_edit_document, handleCustomFieldPathDelete, this.state.templateElementActionIdObject: ', this.state.templateElementActionIdObject);
    });
  }

  renderCustomFieldNameControls() {
    // console.log('in create_edit_document, renderCustomFieldNameControls, this.state.templateElementAttributes: ', this.state.templateElementAttributes);
    const fieldPath = this.state.templateElementAttributes && this.state.templateElementAttributes.name
            ?
            getElementLabel({
              allDocumentObjects: !this.state.translationModeOn ? this.props.allDocumentObjects : this.props.documentTranslationsAllInOne,
              documents: Documents,
              agreement: this.props.agreement,
              // modifiedElement,
              modifiedElement: {},
              fieldName: this.state.templateElementAttributes.name,
              documentTranslationsAll: this.props.documentTranslationsAll,
              appLanguages: AppLanguages,
              appLanguageCode: this.props.appLanguageCode,
              fromCreateEditDocument: true,
              translationModeOn: this.state.translationModeOn,
              translationElement: this.state.translation
            })
            :
            null;

    return (
      <div
        className="create-edit-document-template-each-choice-input"
      >
        <div
          className="create-edit-document-template-each-choice-label-input"
        >
          Link to Database Value
        </div>
        <div className="create-edit-document-template-edit-field-box-controls-action">
           {this.state.templateElementAttributes && this.state.templateElementAttributes.name
             ?
             <div
             className="create-edit-document-template-edit-field-box-controls-action-thumbnail"
             >
              <div>{fieldPath}</div>
              <i
                className="fas fa-times" style={{ margin: '3px' }}
                onClick={this.handleCustomFieldPathDelete}
              ></i>
             </div>
             :
             null}
        </div>
      </div>
    );
  }

  renderTemplateEditFieldBox() {
    // console.log('in create_edit_document, renderTemplateEditFieldBox, this.state.translationModeOn, this.state.showCustomInputCreateMode: ', this.state.translationModeOn, this.state.showCustomInputCreateMode);
    return (
      <div className="create-edit-document-template-edit-field-box">
        {this.renderFieldBoxControls()}
        {this.renderCustomFieldButton()}
        {this.state.showCustomInputCreateMode ? this.renderCustomFieldNameInput() : null}
        {this.state.showCustomInputCreateMode ? this.renderCustomFieldNameControls() : null}
        <div className="create-edit-document-template-edit-field-box-choices">
          {this.state.translationModeOn ? this.renderEachTranslationFieldChoice() : null}
          {!this.state.showCustomInputCreateMode && !this.state.translationModeOn ? this.renderEachFieldChoice() : null}
          {!this.state.translationModeOn && this.state.showCustomInputCreateMode ? this.renderEachCustomFieldChoice() : null}
        </div>
      </div>
    );
  }

  renderExplanationBox() {
    // console.log('in create_edit_document, renderExplanationBox, this.state.actionExplanation, this.state.actionExplanationObject: ', this.state.actionExplanationObject);
    const placement = this.state.actionExplanationObject.explanation.split(',')[1]
    const explanation = this.state.actionExplanationObject.explanation.split(',')[0]
    const height = placement === 'top' ? -47 : 27;
    // {this.state.actionExplanationObject.explanation}
    if (!this.props.editActionBoxCallForActionObject.value
        || (this.props.editActionBoxCallForActionObject.value && (this.state.actionExplanationObject.value !== this.props.editActionBoxCallForActionObject.value))
      ) {
      return (
        <div
          className="create-edit-document-explanation-box"
          style={{ top: `${(this.state.actionExplanationObject.top + height)}px`, left: `${(this.state.actionExplanationObject.left + 0)}px` }}
        >
          {explanation}
        </div>
      );
    }
  }

  renderExplanationBoxCallForAction() {
    const placement = this.props.editActionBoxCallForActionObject.message.split(',')[1];
    const message = this.props.editActionBoxCallForActionObject.message.split(',')[0];
    const height = placement === 'top' ? -47 : 27;
    // {this.state.actionExplanationObject.explanation}
    // console.log('in create_edit_document, renderExplanationBoxCallForAction, this.state.editActionBoxCallForActionObject, this.state.actionExplanationObject: ', this.props.editActionBoxCallForActionObject, this.state.actionExplanationObject);
    return (
      <div
        className="create-edit-document-explanation-box"
        style={{
          top: `${(this.props.editActionBoxCallForActionObject.top + height)}px`,
          left: `${(this.props.editActionBoxCallForActionObject.left + 0)}px`,
          backgroundColor: 'white',
          color: 'black',
          border: '2px solid green',
          zIndex: '14'
        }}
      >
        {message}
      </div>
    );
  }

  handleFontControlCloseClick(event) {
    // console.log('in create_edit_document, handleFontControlCloseClick, event.key: ', event.key);
    // NOTE: handleFontControlCloseClick used to close getFieldValuesModal
    const clickedElement = event.target;
    // if clicked element does not include any elements in the font control box,
    // call setState to close the showFontControlBox
    if (!this.props.showGetFieldValuesChoice) {
      const fontControlClassesArray = [
        'create-edit-document-font-control-box',
        'create-edit-document-font-family-select',
        'create-edit-document-font-size-select',
        'create-edit-document-font-style-button-box',
        'create-edit-document-font-style-button',
        //getFieldValues eleements
        'create-edit-document-get-field-values-button',
        'create-edit-document-get-field-values-button button-hover',
        'create-edit-document-get-field-values-box'
      ];
      const didNotclickedOnButtonOrModal = fontControlClassesArray.indexOf(clickedElement.className) === -1;
      // Dont close the modal if clicked on another modal linked to it.
      const clickedOnOtherModal = didNotclickedOnButtonOrModal && this.props.showGetFieldValuesChoice && clickedElement.className.indexOf('get-field-value-choice-modal') !== -1;
      const pushedEscapeKey = (event.key === 'Escape') || (event.key === 'Esc');
      // If className of clicked element is NOT in the array
      if (((didNotclickedOnButtonOrModal && !event.key) || pushedEscapeKey) && !clickedOnOtherModal) {
        // console.log('in create_edit_document, handleFontControlCloseClick, event.key inside if : ', event.key);
        this.setState({
          showFontControlBox: false,
          getFieldValues: false,
          getFieldValuesCompletedArray: [],
          selectedGetFieldValueChoiceArray: [],
          originalValuesExistForSelectedFields: false,
        });
        const fontControlBox = document.getElementById('create-edit-document-font-control-box');
        if (fontControlBox) fontControlBox.style.display = 'none';
        const getFieldValuesBox = document.getElementById('create-edit-document-get-field-values-box');
        if (getFieldValuesBox) getFieldValuesBox.style.display = 'none';
        // this.props.setSelectedFieldObject(null);
        // Remove listener set in handle open
        document.removeEventListener('click', this.handleFontControlCloseClick);
        document.removeEventListener('keydown', this.handleFontControlCloseClick);
        if (!this.state.getFieldValues) this.props.grayOutBackground(() => this.props.showLoading());
        // clean up of other modals open linked to modal
        // if (this.props.showGetFieldValuesChoice && pushedEscapeKey) {
          //   document.removeEventListener('click', this.handleFontControlCloseClick);
          //   this.props.showGetFieldValuesChoiceModal(() => {});
          // }
        }
    }
  }

  findIfOriginalValuesExistForFields() {
    const array = [];
    let templateElement = null;
    _.each(this.state.selectedTemplateElementIdArray, eachId => {
      templateElement = this.props.templateElements[eachId] || this.props.templateElements[parseInt(eachId, 10)];

      if (templateElement.original_value && templateElement.original_value !== this.props.valuesInForm[templateElement.name]) array.push(templateElement.id)
    });

    return array.length > 0;
  }

  findIfDatabaseValuesExistForFields(formValuesObject) {
    // Turning findIfDatabaseValuesExistForFields true will trigger a run of componentDidUpdate
    this.setState({ findIfDatabaseValuesExistForFields: !this.state.findIfDatabaseValuesExistForFields}, () => {
      // Callback in initialValuesObject method will turn findIfDatabaseValuesExistForFields false
      if (!this.state.findIfDatabaseValuesExistForFields) {
        // If any key value pairs exist with not null value,
        let count = 0;
        _.each(Object.keys(formValuesObject), eachKey => {
          // Count up if values in database not equal to value in redusForm prop
          // i.e. state.forms.CreateEditDocument.value
          if (formValuesObject[eachKey] !== this.props.valuesInForm[eachKey]) count++;
        });
        // this.setState({ databaseValuesExistForFields: Object.keys(formValuesObject).length > 0 })
        this.setState({ databaseValuesExistForFields: count > 0 });
      }
    });
    // databaseValuesExistForFields
  }

  getOriginalValues(callback) {
    let templateElement = null;
    const array = [];
    let updateObject = {};
    _.each(this.state.selectedTemplateElementIdArray, eachId => {
      templateElement = this.props.templateElements[parseInt(eachId, 10)];
      // prep obejct to be sent to updateDocumentElementLocally and setTemplateHistoryArray
      updateObject = { id: templateElement.id, value: templateElement.original_value, previous_value: this.props.valuesInForm[templateElement.name] };
      array.push(updateObject);
      // change the value in props/form/CreateEditDocument/templateElement.name
      this.props.change(templateElement.name, templateElement.original_value);
    });
    // Update in appstate and persist history in localStorage
    this.props.updateDocumentElementLocally(array);
    this.setTemplateHistoryArray(array, 'update');
    // Call back to set getFieldValuesCompletedArray to true
    callback();
  }

  // Get an object with all selected field in the agreement
  // getSelectedFieldObject(callback) {
  //   const object = { fields: {}, customFieldExists: false };
  //   let name = null;
  //   let dBlinkPath = '';
  //
  //   _.each(this.state.selectedTemplateElementIdArray, eachId => {
  //     name = this.props.templateElements[eachId].custom_name ? this.props.templateElements[eachId].custom_name : this.props.templateElements[eachId].name;
  //     dBlinkPath = '';
  //
  //     if (this.props.templateElements[eachId].custom_name) {
  //       object.customFieldExists = true;
  //       dBlinkPath = this.props.templateElements[eachId].name
  //                     ?
  //                     getElementLabel({
  //                       allDocumentObjects: this.props.allDocumentObjects,
  //                       documents: Documents,
  //                       agreement: this.props.agreement,
  //                       modifiedElement: this.props.templateElements[eachId],
  //                       fieldName: this.props.templateElements[eachId].name,
  //                       documentTranslationsAll: this.props.documentTranslationsAll,
  //                       appLanguages: AppLanguages,
  //                       appLanguageCode: this.props.appLanguageCode,
  //                       fromCreateEditDocument: true
  //                     })
  //                     :
  //                     null;
  //     }
  //
  //     object.fields[name] = {
  //       element: this.props.templateElements[eachId],
  //       currentValue: this.props.templateElements[eachId].custom_name
  //                     ?
  //                     this.props.valuesInForm[this.props.templateElements[eachId].custom_name]
  //                     :
  //                     this.props.valuesInForm[this.props.templateElements[eachId].name],
  //       customField: this.props.templateElements[eachId].custom_name,
  //       dBlinkPath
  //     };
  //   });
  //   // Call back to set getFieldValuesCompletedArray to true
  //   callback();
  //   return _.isEmpty(object) ? null : object;
  // }

  getSelectDataBaseValues() {
    this.setState({ getSelectDataBaseValues: !this.state.getSelectDataBaseValues }, () => {
      // Turning getSelectDataBaseValues on triggers componentDidUpdate if (this.state.getSelectDataBaseValues)
      if (!this.state.getSelectDataBaseValues) {
        // If getSelectDataBaseValues is completed,
        // push databaseValues into getFieldValuesCompletedArray
        // Of button rendering etc.
        const newArray = [...this.state.getFieldValuesCompletedArray];
        // newArray.push('databaseValues');
        this.setState({
          getFieldValuesCompletedArray: newArray,
          // originalValuesExistForSelectedFields
        }, () => {
          const originalValuesExistForSelectedFields = this.findIfOriginalValuesExistForFields();
          this.setState({ originalValuesExistForSelectedFields })
        });
      } else {
        // console.log('in create_edit_document, getSelectDataBaseValues, this.state.getSelectDataBaseValues: ', this.state.getSelectDataBaseValues);
      }
    });
  }

  getOtherDocumentValues() {
    // Note: showSelectExistingDocumentModalForGetFieldValues is defined in bookingConfirmation
    this.props.showSelectExistingDocumentModal(() => this.props.showSelectExistingDocumentModalForGetFieldValues());
    // this.props.showSelectExistingDocumentModalForGetFieldValues();
  }

  importFieldsFromOtherDocuments() {
    // Turn on importFieldsFromOtherDocumentsAction and assign the current agreementId to baseAgreementId
    const getBaseAgreementId = () => {
      let agreementIdReturned = this.props.importFieldsFromOtherDocumentsObject.baseAgreementId;
      // If baseAgreementId is different from currently open document
      // return currently opened document if has booking_id of current booking
      if (this.props.importFieldsFromOtherDocumentsObject.baseAgreementId !== this.props.agreementId
          && this.props.booking.agreements_mapped[this.props.agreementId]
        ) agreementIdReturned = this.props.agreementId;

      return agreementIdReturned;
    };

    this.props.showSelectExistingDocumentModal(
      // Turn on switch to import fields
      // Callback
      () => {
      // Reinitialize object for import fields with current baseAgreementId
      // If object already populated, keep data until next fields clicked
        this.props.importFieldsFromOtherDocumentsObjectAction({
          agreementId: this.props.importFieldsFromOtherDocumentsObject.agreementId ? this.props.importFieldsFromOtherDocumentsObject.agreementId : null,
          fieldsArray: this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length > 0 ? this.props.importFieldsFromOtherDocumentsObject.fieldsArray : [],
          // baseAgreementId: this.props.importFieldsFromOtherDocumentsObject.baseAgreementId ? this.props.importFieldsFromOtherDocumentsObject.baseAgreementId : getBaseAgreementId(),
          baseAgreementId: getBaseAgreementId(),
          associationObject: _.isEmpty(this.props.importFieldsFromOtherDocumentsObject.associationObject) ? {} : this.props.importFieldsFromOtherDocumentsObject.associationObject,
        });
      }); // end of first callback
  }

  renderGetFieldValuesChoiceBox() {
    return (
      <GetFieldValueChoiceModal
        top={'20%'}
        left={'50%'}
        updateDocumentElementLocallyAndSetHistory={(array) => {
          // set value for each templateElement
          this.props.updateDocumentElementLocally(array);
          // set localHistory
          this.setTemplateHistoryArray(array, 'update');
          // Run initialValues function in componentDidUpdate
          // To find out if there are any database values available
          // and different from state.forms.CreateEditDocument.values in reduxForm
          this.findIfDatabaseValuesExistForFields();
        }}
        changeFormValue={this.props.change}
        getSelectDataBaseValues={this.state.getSelectDataBaseValues}
      />
    );
  }

  // getSelectDataBaseValuesCallback() {}

  handleGetValueChoiceClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');

    const setCompletedCallback = () => {
      const newArray = [...this.state.getFieldValuesCompletedArray];
      newArray.push(elementVal);
      this.setState({ getFieldValuesCompletedArray: newArray });
    };

    const newArray = [...this.state.selectedGetFieldValueChoiceArray];
    newArray.push(elementVal);

    this.setState({
      selectedGetFieldValueChoiceArray: newArray
      // getFieldValuesCompletedArray: [...this.state.getFieldValuesCompletedArray]
    }, () => {
      switch (elementVal) {
        case 'originalValues': {
          // this.getOriginalValues(setCompletedCallback)
          // this.props.setSelectedFieldObject(this.getSelectedFieldObject())
          const fieldObject = getDocumentFieldsWithSameName(
                                { documentFields: this.props.agreement.document_fields,
                                  selectedFieldObject: this.props.selectedFieldObject,
                                  valuesInForm: this.props.valuesInForm,
                                  fromCreateEditDocument: true,
                                  translationModeOn: false
                                });

          if (!this.props.showGetFieldValuesChoice) {
            this.props.showGetFieldValuesChoiceModal(() => {});
            window.addEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
            window.addEventListener('keydown', this.handleCloseGetFieldValuesChoiceBox);
          }
          // call action to set state.documents.fieldValueDocumentObject to be used in showGetFieldValuesChoiceModal
          this.props.setGetFieldValueDocumentObject({ agreement: this.props.agreement, fieldObject });
          break;
        }
        case 'databaseValues':
          // getSelectDataBaseValues turns on this.state.getSelectDataBaseValues
          // Which triggers componenetDidMount to call getInitialValueObject
          // getSelectDataBaseValues function turns on this.state.getDataBaseValues Which
          // triggers componentDidUpdate logic
          this.getSelectDataBaseValues();
          break;

        case 'otherDocumentValues':
          this.getOtherDocumentValues();
          break;

        case 'importFieldsFromOtherDocuments':
          this.importFieldsFromOtherDocuments();
          break;
        default: return null;
      }
    });
  }

  handleCloseGetFieldValuesChoiceBox(event) {
    // Get updated object with attributes about selected elements
    // updated with new values in form
    const clickedElement = event.target;

    const clickedOnModal = clickedElement.className.indexOf('get-field-value-choice-modal') !== -1;
    const clickedOnButton = clickedElement.className.indexOf('create-edit-document-get-field-values-button button-hover') !== -1;
    const pushedEscapeKey = (event.key === 'Escape') || (event.key === 'Esc');
    // If user clicks on something other than a document or a getFieldValues modal element
    // close the modal, and do clean up
    if ((!clickedOnModal && !clickedOnButton && !event.key) || pushedEscapeKey) {
      // When user closes the showGetFieldValuesChoiceModal, get a new setSelectedFieldObject
      // to reflect the new value in the form
      // this.props.setSelectedFieldObject(this.getUpdatedSelectedFieldObject());
      // Switch off modal show
      this.props.showGetFieldValuesChoiceModal(() => {});
      this.props.setSelectedFieldObject(this.getSelectedFieldObject());
      // Switch off this.state.getSelectDataBaseValues and do clean up after
      if (this.state.getSelectDataBaseValues) this.getSelectDataBaseValues();
      window.removeEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
      window.removeEventListener('keydown', this.handleCloseGetFieldValuesChoiceBox);
      // this.setState({ selectedAgreementId: null });
    }
  }

  renderGetFieldValuesBox() {
    const { selectedGetFieldValueChoiceArray, getFieldValuesCompletedArray } = this.state;

    let getFieldValueButtonDimensions = {};

    const getFieldValueButtonElement = document.getElementById('create-edit-document-template-edit-action-box-elements-get-field-values');

    if (getFieldValueButtonElement) getFieldValueButtonDimensions = getFieldValueButtonElement.getBoundingClientRect();

    const fieldValuesArray = ['originalValues', 'databaseValues', 'otherDocumentValues', 'importFieldsFromOtherDocuments'];

    let disableButton = false;
    // Disable the button if there are no original_values stored in templateElements
    const renderButtons = () => {
      let hoverClass = '';
      return _.map(fieldValuesArray, each => {
        disableButton = (each === 'originalValues' && !this.state.originalValuesExistForSelectedFields)
                        || (each === 'databaseValues' && !this.state.databaseValuesExistForFields)
                        || (each === 'otherDocumentValues' && !this.state.databaseValuesExistForFields);
        // Add hover to button if button active; Take away button-hover if button disabled
        disableButton ? hoverClass = '' : hoverClass = 'button-hover';
        return (
          <div
            key={each}
            className={`create-edit-document-get-field-values-button ${hoverClass}`}
            value={each}
            onClick={disableButton ? null : this.handleGetValueChoiceClick}
            style={disableButton ? { border: '1px solid #ccc', color: '#ccc' } : null}
          >
            {AppLanguages[each][this.props.appLanguageCode]}&nbsp;&nbsp;{selectedGetFieldValueChoiceArray.indexOf(each) !== -1 & getFieldValuesCompletedArray.indexOf(each) !== -1 ? <i style={{ color: '#33a532', fontSize: '15px' }} className="fas fa-check-circle"></i> : ''}
          </div>
        );
      });
    };

    return (
      <div
        className="create-edit-document-get-field-values-box"
        id="create-edit-document-get-field-values-box"
        // Set the top and left of control box to be right underneath the button
        style={{ display: 'block', top: getFieldValueButtonElement ? getFieldValueButtonDimensions.top + 47 : null, left: getFieldValueButtonElement ? getFieldValueButtonDimensions.left - 73 : null }}
      >
        {renderButtons()}
      </div>
    );
  }

  renderFontControlBox() {
    const onlyFontAttributeObject = this.state.selectedElementFontObject ? this.state.selectedElementFontObject : this.state.newFontObject;
    // For rendering box for setting font family, size, style and weight
    // Get the font button in array
    let fontButtonDimensions = {};
    const fontButtonArray = document.getElementsByClassName('create-edit-document-template-edit-action-box-elements-double')
    // Get the font button dimension so that a control box can be placed below it
    if (fontButtonArray.length > 0) fontButtonDimensions = fontButtonArray[0].getBoundingClientRect();

    // add listner for clicks outside the control box opened
    // <option value="arial">Arial</option>
    // <option value="times new roman">Times New Roman</option>
    // <option value="century gothic">Century Gothic</option>
    // <option value="osaka">Osaka</option>
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
          style={{ width: '100%', backgroundColor: 'white', fontFamily: onlyFontAttributeObject.font_family }}
          onChange={this.handleTemplateElementActionClick}
        >
          <option value="MSゴシック">MSゴシック</option>
          <option value="ＭＳ Ｐ明朝">ＭＳ Ｐ明朝</option>
          <option value="symbol">Symbol</option>
          <option value="courier">Courier</option>
          <option value="times">Times</option>
          <option value="helvetica">Helvetica</option>
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
            style={{ fontFamily: onlyFontAttributeObject.font_family }}
            onClick={this.handleTemplateElementActionClick}
          >
            Bold
          </div>
          <div
            className="create-edit-document-font-style-button"
            id="fontStyle"
            value="italic"
            name="fontStyle"
            style={{ fontFamily: onlyFontAttributeObject.font_family }}
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
      } else {
        // when subtimer is 0, assign typing timer at 0
        subTimer = 0;
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
    const elementValue = mousedOverElement.getAttribute('value');
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
            explanation: elementName,
            value: elementValue
          }
        });
        // end of setState callback
          // clear timers with callback to null out explantion object and setting new one
          this.clearAllTimers(callback);
      } else { // if timer not runnig and explantion does not show simultaneously
        const showExplantion = () => this.setState({
          actionExplanationObject: {
            top: elementDimensions.top,
            left: elementDimensions.left,
            explanation: elementName,
            value: elementValue
          }
        });
        // if there is no explanation showing
        if (!this.state.actionExplanationObject) {
          // clear timers in case there are timers running
          this.clearAllTimers(() => {});
          // set timer with second, text to show, and callback
          this.setExplanationTimer(1, elementName, showExplantion);
        } else { // catch all
          // !!! Somehow, this handler does not work without this else showExplantion
          showExplantion(); // function call
        }
      }
    }
  }

  handleMouseLeaveActionButtons(event) {
    const mousedLeaveElement = event.target;
    // const elementName = mousedLeaveElement.getAttribute('name')
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
    // let objectLength;
    // Go through array of fontAttributeObject ie fontFamily, fontSize, fontWeight, fontStyle
    _.each(Object.keys(fontAttributeObject), eachFontAttribute => {
      // Get the number of fonts actually used in document fontFamily: { arial: [id], times: [id] }
      // would be 2
      // objectLength = Object.keys(fontAttributeObject[eachFontAttribute]).length;
      // Get an array of actual fonts used in selected elements
      // const selectValue = Object.keys(fontAttributeObject[eachFontAttribute])
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
  }

  handleShowFontControlBox() {
    const fontControlBox = document.getElementById('create-edit-document-font-control-box')
    // 'Open' the font control box by setting display to 'block'
    fontControlBox.style.display = 'block';
    // Add a listener for user clicks outside the box to close and set display: 'none'
    document.addEventListener('click', this.handleFontControlCloseClick);
    document.addEventListener('keydown', this.handleFontControlCloseClick);
    this.props.grayOutBackground(() => this.props.showLoading())

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
    const templateElementsChecked = this.state.selectedTemplateElementIdArray.length > 0;
    const otherAgreementsExist = this.props.agreements.length > 1;
    const elementsChecked = this.state.selectedTemplateElementIdArray.length > 0 || this.state.selectedChoiceIdArray.length > 0;
    const translationElementsChecked = this.state.selectedTemplateElementIdArray.length > 0 && this.state.translationModeOn;
    const choicesChecked = this.state.selectedChoiceIdArray.length > 0;
    const multipleElementsChecked = this.state.selectedTemplateElementIdArray.length > 1;
    const multipleChoicesChecked = this.state.selectedChoiceIdArray.length > 1;
    // NOTE: disableSave does not work after saving since initialValues have to be updated
    const disableSave = !this.props.templateElements || (_.isEmpty(this.state.modifiedPersistedElementsObject) && _.isEmpty(this.state.modifiedPersistedTranslationElementsObject) && !this.props.formIsDirty) || this.state.selectedTemplateElementIdArray.length > 0 || this.state.createNewTemplateElementOn;
    const disableCheckAll = !this.state.editFieldsOn || (templateElementsLength < 1) || this.state.allElementsChecked || this.state.createNewTemplateElementOn;
    const disableCreateNewElement = this.state.createNewTemplateElementOn || this.state.selectedTemplateElementIdArray.length < 1;
    const enableUndo = (this.state.templateEditHistoryArray.length > 0 && this.state.historyIndex > -1) && !this.state.createNewTemplateElementOn;
    const enableRedo = (this.state.templateEditHistoryArray.length > 0 && this.state.historyIndex !== this.state.templateEditHistoryArray.length - 1) && !this.state.createNewTemplateElementOn;
    // if this.props.onlyFontAttributeObject is not null, use this.props.onlyFontAttributeObject
    let onlyFontAttributeObject = this.state.selectedElementFontObject ? this.state.selectedElementFontObject : this.state.newFontObject;
    const disableEditFields = templateElementsLength < 1 || this.state.editFieldsOn;
    const disableTranslation = this.state.translationModeOn;

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
        {
          this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length > 0
          ?
          <div
            className="create-edit-document-template-edit-action-box-elements"
            onClick={this.handleTemplateElementActionClick}
            name={`Copied ${this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length} field${this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length > 1 ? 's' : ''},top`}
            value="pasteFields"
            onMouseOver={this.handleMouseOverActionButtons}
            id="create-edit-document-template-edit-action-box-elements-pasteFields"
          >
            <i value="pasteFields" name={`Copied ${this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length} field${this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length > 1 ? 's' : ''},top`} style={{ color: this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length > 0 ? 'blue' : 'gray' }} onMouseOver={this.handleMouseOverActionButtons} className="fas fa-paste"></i>
          </div>
          :
          <div
            className="create-edit-document-template-edit-action-box-elements"
            // onClick={() => {}}
            // name="Change text direction,bottom"
            value="blank"
            // onMouseOver={this.handleMouseOverActionButtons}
            // <i value="emptyButton" name="This button empty,bottom" style={{ color: 'gray'}} onMouseOver={this.handleMouseOverActionButtons} className="fas fa-arrows-alt-h"></i>
            // onClick={translationElementsChecked ? this.handleTemplateElementActionClick : () => {}}
          >
          </div>
        }
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
          // id="create-edit-document-template-edit-action-box-elements-get-field-values"
          value="getFieldValues"
          onMouseOver={this.handleMouseOverActionButtons}
          name="Get field values,bottom"
        >
          <i
            value="getFieldValues"
            name="Get field values,bottom"
            onClick={templateElementsChecked || otherAgreementsExist ? this.handleTemplateElementActionClick : () => {}}
            id="create-edit-document-template-edit-action-box-elements-get-field-values"
            style={{ color: templateElementsChecked || otherAgreementsExist ? 'blue' : 'gray' }}
            className="fas fa-database"
          ></i>
        </div>
        <div
          className="create-edit-document-template-edit-action-box-elements"
          // onClick={() => {}}
          name="Change text direction,bottom"
          value="changeDirection"
          // onMouseOver={this.handleMouseOverActionButtons}
          // <i value="emptyButton" name="This button empty,bottom" style={{ color: 'gray'}} onMouseOver={this.handleMouseOverActionButtons} className="fas fa-arrows-alt-h"></i>
          onClick={translationElementsChecked ? this.handleTemplateElementActionClick : () => {}}
        >
          <i
            onMouseOver={this.handleMouseOverActionButtons}
            value="changeDirection"
            style={{ color: translationElementsChecked ? 'blue' : 'gray' }}
            name="Change text direction,bottom"
            className="fas fa-ruler"
            // className="far fa-compass"
          ></i>
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
        {`< id: ${this.props.agreement.id}  ${this.props.agreement.document_name}   `} (page: {` ${page} of ${this.props.agreement.document_pages}) >`}
      </div>
    );
  }

  handleOverlayClickBox(event) {
    const { agreementId, fieldsArray, baseAgreementId } = this.props.importFieldsFromOtherDocumentsObject;
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const elementName = parseInt(clickedElement.getAttribute('name'), 10);
    let newArray = [...fieldsArray];
    const elementIndex = newArray.indexOf(elementVal);

    // if same agreement keep array and agreementId
    // Otherwise update agreementId and create new array with new clicked field
    if (elementName === agreementId) {
      if (elementIndex === -1) {
        newArray.push(elementVal);
      } else {
        newArray.splice(elementIndex, 1);
      }
    } else {
      newArray = [elementVal];
    }

    const newObject = {
      ...this.props.importFieldsFromOtherDocumentsObject,
      agreementId: agreementId === elementName ? agreementId : elementName,
      fieldsArray: newArray,
    };

    this.props.importFieldsFromOtherDocumentsObjectAction(newObject);
  }

  renderTemplateElementsOverLayClickBoxes(page) {
      const elementsObjectArray = [this.props.templateElementsByPage, this.props.templateTranslationElementsByPage];

      return _.map(elementsObjectArray, eachByPageObject => {
        // return _.map(this.props.templateElementsByPage[page], eachElement => {
        return _.map(eachByPageObject[page], eachElement => {
          return (
            <div
              key={eachElement.id}
              value={eachElement.id}
              name={eachElement.agreement_id}
              id={`template-element-overlay-click-box-${eachElement.id}`}
              className="create-edit-document-template-element-container"
              onClick={this.handleOverlayClickBox}
              style={{
                top: eachElement.top,
                left: eachElement.left,
                width: eachElement.width,
                height: eachElement.height,
                borderRadius: '5px',
                margin: eachElement.input_type === 'string' || eachElement.input_type === 'text' ? '0 0 0 5px' : '',
                border: this.props.importFieldsFromOtherDocumentsObject.fieldsArray.indexOf(eachElement.id) !== -1
                        &&
                        this.props.importFieldsFromOtherDocumentsObject.agreementId
                        &&
                        this.props.importFieldsFromOtherDocumentsObject.agreementId === eachElement.agreement_id
                        ?
                        '3px solid blue'
                        :
                        '1.5px solid blue',
                // transform: `rotate(${parseInt(eachElement.transform, 10)}deg)`,
                // transformOrigin: 'top left'
              }}
            >
            </div>
          );
        });
      }); // end of each
  }

  // closeRelatedTabs(agreementIdClicked) {
  //
  // }

  handleDocumentTabClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // comma delimted close or activate, inactive or active, agreementId
    const closeOrActivate = elementVal.split(',')[0];
    const activeOrInactive = elementVal.split(',')[1];
    const agreementIdClicked = parseInt(elementVal.split(',')[2], 10);
    // LOGIC: If the user clicks close, the tabs are either active or inactive
    // If inactive, take out that agreementId from the selectedAgreementIdArray
    // it is no longer rendered; If active, run openOrSwitchAgreements
    // If not close, and inactive, run openOrSwitchAgreements, props from bookingConfirmation.js
    const processAgreementIfBaseAgreement = () => {
      // this.closeRelatedTabs(agreementIdClicked)
      let newAssociationObject = {};
      const newArray = [...this.props.selectedAgreementIdArray];
      newAssociationObject = { ...this.props.importFieldsFromOtherDocumentsObject.associationObject };
      // Take out associated agreements from tab array
      _.each(newAssociationObject[agreementIdClicked], eachAssociatedAgreementId => {
        newArray.splice(newArray.indexOf(eachAssociatedAgreementId), 1);
      });
      // Take out relevant clicked base agreement from tab array
      newArray.splice(newArray.indexOf(agreementIdClicked), 1);
      this.props.setSelectedAgreementIdArray(newArray);
      delete newAssociationObject[agreementIdClicked];

      const closedBaseAgreement = agreementIdClicked === this.props.importFieldsFromOtherDocumentsObject.baseAgreementId;

      this.props.importFieldsFromOtherDocumentsObjectAction({
            agreementId: closedBaseAgreement ? null : this.props.importFieldsFromOtherDocumentsObject.agreementId,
            fieldsArray: closedBaseAgreement ? [] : this.props.importFieldsFromOtherDocumentsObject.fieldsArray,
            baseAgreementId: closedBaseAgreement ? null : this.props.importFieldsFromOtherDocumentsObject.baseAgreementId,
            associationObject: newAssociationObject
          });
      // If no more tabs, close CreateEditDocument
      if (newArray.length < 1) this.handleClose();
    };

    const takeOutFromAssociatedObject = (inactive) => {
      const newAssociationObject = { ...this.props.importFieldsFromOtherDocumentsObject.associationObject };
      let newArray = null;
      let index = null;
      _.each(Object.keys(newAssociationObject), eachBaseAgreementId => {
        newArray = [...newAssociationObject[eachBaseAgreementId]]
        // _.each(newAssociationObject[eachBaseAgreementId], eachAssociatedAgreementId => {
        index = newArray.indexOf(agreementIdClicked);
        if (index !== -1) newArray.splice(index, 1);
        // })
        newAssociationObject[eachBaseAgreementId] = newArray;
        if (newArray.length < 1) delete newAssociationObject[eachBaseAgreementId];
      });
        const nothingInFieldsArrayOrAssociation =  this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length < 1
                      && _.isEmpty(newAssociationObject)
        this.props.importFieldsFromOtherDocumentsObjectAction({ ...this.props.importFieldsFromOtherDocumentsObject,
            associationObject: newAssociationObject,
            // If nothing in fieldsarray and associationObject empty, null out
            agreementId: nothingInFieldsArrayOrAssociation
                          ? null : this.props.importFieldsFromOtherDocumentsObject.agreementId,
            baseAgreementId: nothingInFieldsArrayOrAssociation
                          ? null : this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
            // !!!!keep agreementId and fieldsArray; Can still copy even if closed
          });
    };

    const processCachedInitialValueObject = (action) => {
      const newObject = { ...this.props.cachedInitialValuesObject };
      let changed = false;

      if (action === 'close') delete newObject[agreementIdClicked];
      // If tab made inactive and not yet in object, put it in
      if (action === 'activate' && !newObject[this.props.agreementId]) {
        newObject[this.props.agreementId] = this.props.valuesInForm;
        changed = true;
      }
      // Run setCachedInitialValuesObject only if object changed
      if (action === 'close' || changed) this.props.setCachedInitialValuesObject(newObject);
    };

    let oneOfBaseAgreements = false;

    if (closeOrActivate === 'close') {
      const newArray = [...this.props.selectedAgreementIdArray];
      if (this.props.importFieldsFromOtherDocumentsObject.associationObject
          && this.props.importFieldsFromOtherDocumentsObject.associationObject[agreementIdClicked]) {
        processAgreementIfBaseAgreement();
        oneOfBaseAgreements = true;
      }

      processCachedInitialValueObject('close');

      if (activeOrInactive === 'inactive' && !oneOfBaseAgreements) {
        newArray.splice(newArray.indexOf(agreementIdClicked), 1);
        this.props.setSelectedAgreementIdArray(newArray);
        // true inactive
        takeOutFromAssociatedObject(true);
      } else if (!oneOfBaseAgreements) { //if (activeOrInactive === 'inactive') {
        if (this.props.selectedAgreementIdArray.length > 1) {
          // has more than 1 agreement open
          // this.props.setInitialValuesObject({ initialValuesObject: {}, agreementMappedByName: {}, agreementMappedById: {}, allFields: [], overlappedkeysMapped: {} })
          // if (!_.isEmpty(this.props.templateElements)) this.props.setTemplateElementsObject({ templateElements: {}, templateElementsByPage: {}, templateTranslationElements: {}, templateTranslationElementsByPage: {},  });
          newArray.splice(newArray.indexOf(agreementIdClicked), 1);
          this.props.setSelectedAgreementIdArray(newArray);
          // false inactive
          takeOutFromAssociatedObject(false);
          // props from bookingConfirmation.js
          this.props.openOrSwitchAgreements(parseInt(newArray[0], 10), true, false);
        } else { // has only 1 agreement open
          this.handleClose();
          this.props.setSelectedAgreementIdArray([]);
        } //  if (this.props.selectedAgreementIdArray.length > 1) {
      } // else if (activeOrInactive === 'inactive') {
    } else if (activeOrInactive === 'inactive') { // else if (elementVal === 'close') {
      processCachedInitialValueObject('activate');
      // User clicks inactive tab to switch documents to show
      this.props.openOrSwitchAgreements(agreementIdClicked, true, false);
    }
  }

  getMappedAgreementObject() {
    return (
      // this.props.showSelectExistingDocument
        // &&
        this.props.allUserAgreementsArrayMappedWithDocumentFields
        && this.props.allUserAgreementsArrayMappedWithDocumentFields[this.props.agreementId]
      ?
      this.props.allUserAgreementsArrayMappedWithDocumentFields
      :
      this.props.mappedAgreementObject
    );
  }

  handleDocumentScrollCallback(callShowLoading) {
    if (callShowLoading) this.props.showLoading();
    console.log('in create_edit_document, handleDocumentScrollCallback, callShowLoading, this.props.showLoadingProp', callShowLoading, this.props.showLoadingProp);
    window.addEventListener('scroll', this.handleDocumentScroll);
  }

  handleDocumentScroll() {
    // scrollCount++;
    const afterScrollingStopped = () => {
      const viewportHeight = window.innerHeight;
      const newArray = [];
      let topInViewPort = false;
      let viewPortInMiddle = false;
      let bottomInViewPort = false;
      let boundingClientRect = null;

      const currentParentBoundingClientRect = this.state.documentPagesObject.parentOfAlldocumentPages.getBoundingClientRect()

        const { documentPagesMapAgainstParent } = this.state.documentPagesObject;
      _.each(Object.keys(documentPagesMapAgainstParent), eachPageNumberKey => {
        boundingClientRect = { top: currentParentBoundingClientRect.top + documentPagesMapAgainstParent[eachPageNumberKey].top,
                               bottom: currentParentBoundingClientRect.top + documentPagesMapAgainstParent[eachPageNumberKey].bottom };
        // Figure if top, buttom in viewport, or middle of page is inside viewport
        topInViewPort = boundingClientRect.top > 0 && Math.abs(boundingClientRect.top) < viewportHeight;
        viewPortInMiddle = boundingClientRect.top < 0 && boundingClientRect.bottom > viewportHeight;
        bottomInViewPort = boundingClientRect.bottom > 0 && viewportHeight > Math.abs(boundingClientRect.bottom);
        if (topInViewPort || bottomInViewPort || viewPortInMiddle) newArray.push(parseInt(eachPageNumberKey, 10));
      });

      this.setState({ documentPagesObject: { ...this.state.documentPagesObject, prevPagesInViewport: this.state.documentPagesObject.pagesInViewport, pagesInViewport: newArray.length < 1 ? [1] : newArray } }, () => {
        console.log('in create_edit_document, handleDocumentScroll, afterScrollingStopped, this.state.documentPagesObject, this.state.documentPagesObject.pagesInViewport ', this.state.documentPagesObject, this.state.documentPagesObject.pagesInViewport);
        let pageToFetch = null
        // For each page in the viewPort, if there are document fields on the page, AND
        // both templateElements and templateTranslationElements are empty set pageToFetch to that page
        _.each(this.state.documentPagesObject.pagesInViewport, eachPage => {
          if (this.props.agreement.agreement_meta.document_fields_num_by_page[eachPage]
              && (_.isEmpty(this.props.templateElementsByPage[eachPage])
                  && _.isEmpty(this.props.templateTranslationElementsByPage[eachPage]))
            ) {
              pageToFetch = eachPage;
          } //  if (this.props.agreement.agreement_meta.document_fields_num_by_page[eachPage]
        }); //  _.each(this.state.documentPagesObject.pagesInViewport, eachPage => {
          // console.log('in create_edit_document, handleDocumentScroll, afterScrollingStopped, in setState callback, pageToFetch ', pageToFetch);
          if (pageToFetch) {
            //templateEditHistory to be used in populateTemplateElementsLocally
            const templateEditHistory = { historyIndex: this.state.historyIndex, templateEditHistoryArray: this.state.templateEditHistoryArray }
            window.removeEventListener('scroll', this.handleDocumentScroll);
            const pagesInPropsTemplateElements = this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreementId]
                                                  ? Object.keys(this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreementId])
                                                  : []
            // this.props.fetchDocumentFieldsForPage(pageToFetch, this.props.agreement.id, templateEditHistory, () => { this.handleDocumentScrollCallback(); }, pagesInPropsTemplateElements)
            if (!this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreement.id]
                  ||
                !this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreement.id][pageToFetch]
                ) {
              this.props.fetchDocumentFieldsForPage(pageToFetch, this.props.agreement.id, templateEditHistory, () => { this.handleDocumentScrollCallback(true); }, pagesInPropsTemplateElements, this.props.agreement)
              // this.props.fetchDocumentFieldsForPage(pageToFetch, this.props.agreement.id, templateEditHistory, () => { this.handleDocumentScrollCallback(); })
            } else {
              // this.props.showLoading();
              console.log('in create_edit_document, handleDocumentScroll, afterScrollingStopped, in setState callback just called action showLoading ');
              this.props.populateTemplateElementsLocally(this.props.mappedAgreementsWithCachedDocumentFields[this.props.agreement.id][pageToFetch], () => { this.handleDocumentScrollCallback(false); }, templateEditHistory, this.props.agreement)
              // gotoscroll
            }
          }
      }); //this.setState({ documentPagesObject:
    }; // const afterScrollingStopped = () => {

    if (scrollingTimer !== null) {
      clearTimeout(scrollingTimer);
    }

    scrollingTimer = setTimeout(() => {
      // In setTimeout callback
      afterScrollingStopped();
     }, 100);
    // const eachPage = documet.getElementById('document-background')
  }

  renderEachDocumentTab() {
    let activeTab = false;
    const mappedAgreementObject = this.getMappedAgreementObject();
    // console.log('in create_edit_document, renderEachDocumentTab, mappedAgreementObject, this.props.selectedAgreementIdArray', mappedAgreementObject, this.props.selectedAgreementIdArray);

    return _.map(this.props.selectedAgreementIdArray, eachAgreementId => {
      activeTab = this.props.agreementId === eachAgreementId;
      return (
        <div
          className="create-edit-document-document-tab-each"
          style={activeTab ? { backgroundColor: 'white' } : { backgroundColor: 'rgb(252, 252, 252)', borderBottom: '1px solid #ccc' }}
          key={eachAgreementId}
          value={`activate,${activeTab ? 'active' : 'inactive'},${eachAgreementId}`}
          onClick={this.handleDocumentTabClick}
        >
          <div
            className="create-edit-document-document-tab-each-text"
          >
           {mappedAgreementObject[eachAgreementId].document_name}
          </div>
          <i
            className="fas fa-times-circle"
            value={`close,${activeTab ? 'active' : 'inactive'},${eachAgreementId}`}
            onClick={this.handleDocumentTabClick}
          ></i>
        </div>
      );
    });
  }

  renderDocumentTab() {
    // console.log('in create_edit_document, renderDocumentTab, this.props.selectedAgreementIdArray, this.getAgreementArray(), this.props.mappedAgreementObject: ', this.props.selectedAgreementIdArray, this.getMappedAgreementObject(), this.props.mappedAgreementObject);
    return (
      <div
        className="create-edit-document-document-tab-container"
      >
        {this.renderEachDocumentTab()}
        <div
          className="create-edit-document-document-tab-remaining"
          style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #ccc', backgroundColor: 'rgb(252,252,252)' }}
          key={'remaining'}
        >
        </div>
      </div>
    );
  }

  checkIfAgreementForBookingOrFlat() {
    return this.props.booking.id === this.props.allUserAgreementsArrayMappedWithDocumentFields[this.props.agreementId].booking_id
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
    // To be used when pages other than a4 used.
    // 595 points is 794 pixels
    const dimensionConversion = { 595: 794, 841: 1122 };

    // if (this.props.agreement) {
    // console.log('in create_edit_document, renderDocument, before if showDocument, this.props.showTemplate, initialValuesEmpty, this.props.showOwnUploadedDocument, this.state.showDocumentPdf: ', showDocument, this.props.showTemplate, initialValuesEmpty, this.props.showOwnUploadedDocument, this.state.showDocumentPdf);
    // console.log('in create_edit_document, renderDocument, before if showDocument, this.props.showTemplate, this.state.showDocumentPdf, this.props.importFieldsFromOtherDocuments, this.props.showSelectExistingDocument: ', showDocument, this.state.showDocumentPdf, this.props.showTemplate, this.props.importFieldsFromOtherDocuments, this.props.showSelectExistingDocument);
    if (showDocument) {
      if (!initialValuesEmpty || this.props.showOwnUploadedDocument) {
        // console.log('in create_edit_document, renderDocument, inside if this.showDocument, this.state.showDocumentPdf, showDocument, this.props.agreement, this.props.showTemplate: ', this.state.showDocumentPdf, showDocument, this.props.agreement, this.props.showTemplate);
        // render document only if initialValues NOT empty or if user has uploaded own document (agreement)
        let image;
        // when showing PDF (view pdf or after creating and updating pdf)
        // show entire PDF; Use pages array to push all pages of PDF persisted in agreement
        let constantAssetsFolder = '';
        const array = [];
        if (this.state.showDocumentPdf) {
          // use image in agreement kept in Cloudinary
          image = this.props.showTemplate ? this.props.agreement.document_pdf_publicid : this.props.agreement.document_publicid;
          const documentPages = this.props.showTemplate ? this.props.agreement.document_pdf_pages : this.props.agreement.document_pages
          // lodosh .times to get array [1, 2, 3 etc....]
          _.times(documentPages, i => {
            array.push(i + 1);
          });
          // assign array to pages for later iteration
          pages = array;
        } else {
          if (this.props.showTemplate) {
            image = this.props.agreement.document_publicid;
            _.times(this.props.agreement.document_pages, i => {
              array.push(i + 1);
            });
            pages = array;
          } else {
            // constantAssetsFolder = 'apartmentpj-constant-assets/'
            constantAssetsFolder = GlobalConstants.constantAssetsFolder;
            // if showing document form, get array of pages from constants/documents
            image = Documents[this.props.createDocumentKey].file;
            // assign array to pages varaible for later iteration
            pages = Object.keys(this.props.documentFields);
          }
        }

        const bilingual = Documents[this.props.createDocumentKey].translation;
        // const page = 1;
        let documentForBookingOrFlat = false;
        // if (this.props.importFieldsFromOtherDocuments
        if (this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
            && this.props.allUserAgreementsArrayMappedWithDocumentFields
            && this.props.allUserAgreementsArrayMappedWithDocumentFields[this.props.agreementId]
            ) {
          // documentForBookingOrFlat = this.props.booking.id === this.props.allUserAgreementsArrayMappedWithDocumentFields[this.props.agreementId].booking_id
          documentForBookingOrFlat = this.props.allUserAgreementsArrayMappedWithDocumentFields ? this.checkIfAgreementForBookingOrFlat() : true;
        }

        // let pageInViewport = false;
        let doNotRenderElementsOnPage = false;

        // console.log('in create_edit_document, renderDocument, this.state.documentPagesObject.pagesInViewport: ', this.state.documentPagesObject.pagesInViewport);
        return _.map(pages, page => {
          doNotRenderElementsOnPage = this.state.documentPagesObject.pagesInViewport.indexOf(page) === -1
                                      && !this.state.allElementsChecked;
          // doNotRenderElementsOnPage = this.state.documentPagesObject.pagesInViewport.indexOf(page) === -1 && this.state.editFieldsOn;
          // console.log('in create_edit_document, renderDocument, inside map this.state.documentPagesObject.pagesInViewport, page, doNotRenderElementsOnPage: ', this.state.documentPagesObject.pagesInViewport, page, doNotRenderElementsOnPage);

              // {this.state.showDocumentPdf ? '' : this.renderEachDocumentField(page)}
              // {(bilingual && !this.state.showDocumentPdf) ? this.renderEachDocumentTranslation(page) : ''}
              // {this.props.showTemplate && !this.state.showDocumentPdf && this.props.importFieldsFromOtherDocuments && this.props.showSelectExistingDocument && !documentForBookingOrFlat ? this.renderTemplateElementsOverLayClickBoxes(page) : ''}
          return (
            <div
              key={page}
              value={page}
              id="document-background"
              className="image-pdf-jpg-background"
              // style={{ backgroundImage: `url(http://res.cloudinary.com/chikarao/image/upload/w_792,h_1122,q_60,pg_${page}/${constantAssetsFolder}${image}.pdf)` }}
              style={{ backgroundImage: `url(http://res.cloudinary.com/chikarao/image/upload/w_792,h_1122,q_60,pg_${page}/${constantAssetsFolder}${image}.jpg)` }}
            >
              {this.props.showTemplate && !this.state.showDocumentPdf && !this.props.noEditOrButtons ? this.renderTemplateEditFieldBox() : ''}
              {this.props.showTemplate && !this.state.showDocumentPdf && !this.props.noEditOrButtons ? this.renderTemplateElementEditAction() : ''}
              {this.props.showTemplate && this.state.actionExplanationObject && !this.props.noEditOrButtons ? this.renderExplanationBox() : ''}
              {this.props.showTemplate && !this.state.showDocumentPdf && !this.props.noEditOrButtons ? this.renderFontControlBox() : ''}
              {this.props.showTemplate && !this.state.showDocumentPdf && !this.props.noEditOrButtons && this.state.getFieldValues ? this.renderGetFieldValuesBox() : ''}
              {this.props.showTemplate && !this.state.showDocumentPdf && !doNotRenderElementsOnPage ? this.renderTemplateElements(page) : ''}
              {this.props.showTemplate && !this.state.showDocumentPdf && !doNotRenderElementsOnPage ? this.renderTemplateTranslationElements(page) : ''}
              {this.props.showTemplate && !this.state.showDocumentPdf ? this.renderDocumentName(page) : ''}
              {this.props.showTemplate && !this.state.showDocumentPdf && this.props.showGetFieldValuesChoice ? this.renderGetFieldValuesChoiceBox() : ''}
              {this.props.showTemplate && !this.state.showDocumentPdf && this.props.importFieldsFromOtherDocumentsObject.baseAgreementId && !documentForBookingOrFlat ? this.renderTemplateElementsOverLayClickBoxes(page) : ''}
              {this.props.showTemplate && this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length > 0 && !this.props.noEditOrButtons ? this.renderExplanationBoxCallForAction() : ''}
            </div>
          );
        });
      } // end of if !initialValuesEmpty
    } // end of if this.props.agreement
  }

  handleClose() {
    this.props.showSavedDocument ? this.props.closeSavedDocument() : this.props.showDocument();
    this.props.editHistory({ editHistoryItem: {}, action: 'clear' });
    this.props.setCreateDocumentKey('', () => {});
    this.props.setInitialValuesObject({ initialValuesObject: {}, agreementMappedByName: {}, agreementMappedById: {}, allFields: [], overlappedkeysMapped: {} })
    if (!_.isEmpty(this.props.templateElements)) this.props.setTemplateElementsObject({ templateElements: {}, templateElementsByPage: {}, templateTranslationElements: {}, templateTranslationElementsByPage: {},  });
  }

  handleFormCloseDeleteClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    if (elementVal == 'close') {
      this.handleClose();
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

  handleViewPDFClickTemplate() {
    this.setState({ showDocumentPdf: !this.state.showDocumentPdf }, () => {
    });
  }

  handleEditClickTemplate(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.props.showDocumentInsertEditProp(elementVal);
    this.props.selectedAgreementId(parseInt(elementVal, 10));
  }

  switchCreatePDFButton(saveButtonActive, agreementHasPdf, editTemplate) {
    const { handleSubmit, appLanguageCode } = this.props;
    const submitFunction = editTemplate ? 'handleTemplateFormSubmit' : 'handleFormSubmit';

    if (this.props.showSavedDocument || (this.props.showTemplate)) {
      return <button
              onClick={
                handleSubmit(data =>
                  this[submitFunction]({
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

  renderTemplateDocumentButtons() {
    const { appLanguageCode } = this.props;
    const saveButtonActive = false;
    let agreementHasPdf = false;
    let showDocumentButtons = false;
    // console.log('in create_edit_document, renderDocumentButtons, this.props.showDocumentInsertBox, this.props.agreementId: ', this.props.showDocumentInsertBox, this.props.agreementId);

    if (this.props.showSavedDocument) {
      showDocumentButtons = true;
      if (this.props.agreement && this.props.agreement.document_pdf_publicid) agreementHasPdf = true;
    }
    // noEditOrButtons is true when user is selecting from existing documents;
    // i.e. from select_exiting_document_modal
    if (showDocumentButtons) {
      return (
          <div className="document-floating-button-box">
              <button
                value={this.props.agreementId}
                onClick={this.handleEditClickTemplate}
                className="btn document-floating-button"
                style={{ backgroundColor: 'blue' }}
              >
                {AppLanguages.document[appLanguageCode]}
              </button>

            {agreementHasPdf && !this.state.showDocumentPdf ?
              <button
                onClick={this.handleViewPDFClickTemplate}
                className="btn document-floating-button"
                style={{ backgroundColor: 'blue', color: 'white' }}
              >
                {AppLanguages.viewPdf[appLanguageCode]}
              </button>
              :
              <button
                onClick={this.handleViewPDFClickTemplate}
                className={"btn document-floating-button"}
                style={agreementHasPdf ? { backgroundColor: 'blue', color: 'white' } : { display: 'none'}}
              >
                {AppLanguages.edit[appLanguageCode]}
              </button>
            }

              <div className="update-create-pdf-button-box">
                {this.switchCreatePDFButton(saveButtonActive, agreementHasPdf, true)}
                {this.props.showDocumentInsertBox ? <input type="checkbox" onChange={this.handleDocumentInsertCheckBox} checked={this.state.useMainDocumentInsert} /> : ''}
                {this.props.showDocumentInsertBox ? <div style={{　fontSize: '10px'　}}>{AppLanguages.insertDocument[appLanguageCode]}</div> : ''}
              </div>

            {agreementHasPdf ?
              <a
                className="btn document-floating-button"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: 'lightgray' }}
                href={`http://res.cloudinary.com/chikarao/image/upload/${this.props.agreement.document_pdf_publicid}.pdf`}
              >
               {AppLanguages.download[appLanguageCode]}
              </a>
              :
              ''
            }

            <button
              value='close'
              className="btn document-floating-button"
              style={{ backgroundColor: 'gray' }}
              onClick={this.handleFormCloseDeleteClick}
            >
              {AppLanguages.close[appLanguageCode]}
            </button>
          </div>
        );
    } // END of if this.props.agreement
  }

  renderDocumentButtons() {
    // console.log('in create_edit_document, renderDocumentButtons, this.props.showDocumentInsertBox: ', this.props.showDocumentInsertBox);
    const { handleSubmit, appLanguageCode } = this.props;
    let saveButtonActive = false;
    let agreementHasPdf = false;
    let showDocumentButtons = false;

    if (this.props.formIsDirty && this.props.showSavedDocument) saveButtonActive = true;

    if (!this.props.showSavedDocument) saveButtonActive = true;

    if (this.props.showSavedDocument) {
      if (this.props.agreement) {
        showDocumentButtons = true;
        if (this.props.agreement.document_publicid) agreementHasPdf = true;
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
                {this.switchCreatePDFButton(saveButtonActive, agreementHasPdf, false)}
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
  // KEEP!!!! NOT USED FOR NOW
  // renderDocumentTabs() {
  //   return (
  //     <div className="create-edit-document-tabs-box">
  //       <div className="create-edit-document-tabs-each-box create-edit-document-tab-active">
  //         <div className="create-edit-document-tabs-each-box-name">
  //         tab 1
  //         </div>
  //         <i className="fas fa-times"></i>
  //       </div>
  //       <div className="create-edit-document-tabs-each-box create-edit-document-tab-inactive">
  //        <div className="create-edit-document-tabs-each-box-name create-edit-document-tabs-each-box-name-inactive-on-right">
  //         tab 2
  //        </div>
  //        <i className="fas fa-times"></i>
  //       </div>
  //       <div className="create-edit-document-tabs-each-box create-edit-document-tab-inactive">
  //        <div className="create-edit-document-tabs-each-box-name create-edit-document-tabs-each-box-name-inactive-on-right">
  //         tab 3
  //        </div>
  //        <i className="fas fa-times"></i>
  //       </div>
  //     </div>
  //   );
  // }
  // NOTE: noEditOrButtons is turned on when user views document from SelectExistingDocumentModal
  render() {
    // console.log('in create_edit_document, just render, this.props.showTemplate, this.props.flat : ', this.props.showTemplate, this.props.flat);
    // {this.renderDocumentTabs()}
    return (
      <div className="test-image-pdf-jpg">
        {this.renderDocumentTab()}
        {this.renderDocument()}
        {this.renderAlert()}
        {!this.props.showTemplate ? this.renderDocumentButtons() : ''}
        {this.props.showTemplate && !this.props.noEditOrButtons ? this.renderTemplateDocumentButtons() : ''}
      </div>
    );
  } // end of render
}// end of class

CreateEditDocument = reduxForm({
  form: 'CreateEditDocument',
  enableReinitialize: true,
  // keepDirtyOnReinitialize: true
})(CreateEditDocument);

function mapStateToProps(state) {
  console.log('in create_edit_document, mapStateToProps, state: ', state);
  // const initialValuesObjectEmpty = _.isEmpty(state.documents.initialValuesObject);
  const formIsDirty = isDirty('CreateEditDocument')(state);
  if (state.bookingData.fetchBookingData) {
    let initialValues = {};
    // bookingData.flat gives access to flat.building.inspections
    // // !!!!!!!!documentKey sent as app state props from booking_cofirmation.js after user click
    // // setCreateDocumentKey action fired and app state set
    // // define new documents in constants/documents.js by identifying
    // // document key eg fixed_term_rental_contract_jp, form and method for setting initialValues
    const documentKey = state.documents.createDocumentKey;
    // const documentFields = Documents[documentKey].form;
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

    // if (state.documents.documentTranslationsAllInOne) console.log('in create_edit_document, mapStateToProps, state.documents.documentTranslationsAllInOne: ', state.documents.documentTranslationsAllInOne);

    // initialValues = { ...state.documents.initialValuesObject, name: 'Jackie' };
    // console.log('in create_edit_document, mapStateToProps, state.documents.documentTranslations: ', state.documents.documentTranslations);
    // initialValues = { name: 'Jackie' };
    // selector from redux form; true if any field on form is dirty
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
      // documentFields,
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
      templateElementsMappedByName: state.documents.templateElementsMappedByName,
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
      showGetFieldValuesChoice: state.modals.showGetFieldValuesChoiceModal,
      // importFieldsFromOtherDocuments: state.documents.importFieldsFromOtherDocuments,
      showSelectExistingDocument: state.modals.showSelectExistingDocumentModal,
      importFieldsFromOtherDocumentsObject: state.documents.importFieldsFromOtherDocumentsObject,
      allUserAgreementsArrayMappedWithDocumentFields: state.documents.allUserAgreementsArrayMappedWithDocumentFields,
      selectedAgreementIdArray: state.documents.selectedAgreementIdArray,
      editActionBoxCallForActionObject: state.documents.editActionBoxCallForActionObject,
      cachedInitialValuesObject: state.documents.cachedInitialValuesObject,
      lastMountedocumentId: state.documents.lastMountedocumentId,
      mappedAgreementsWithCachedDocumentFields: state.documents.mappedAgreementsWithCachedDocumentFields,
      showLoadingProp: state.auth.showLoading,
      templateElementsRunningCountTotal: state.documents.templateElementsRunningCountTotal,
      templateTranslationElementsRunningCountTotal: state.documents.templateTranslationElementsRunningCountTotal,
    };
  }
  // Return object for edit flat where there is selectedFlatFromParams
  if (state.flat.selectedFlatFromParams) {
    const initialValues = state.documents.initialValuesObject;

    return {
      flat: state.flat.selectedFlatFromParams,
      selectedFlatFromParams: state.flat.selectedFlatFromParams,
      booking: null,
      userOwner: state.flat.selectedFlatFromParams.user,
      tenant: null,
      appLanguageCode: state.languages.appLanguageCode,
      documentLanguageCode: state.languages.documentLanguageCode,
      assignments: null,
      contracts: null,
      // NOTE: documentKey is sent as props in editFlat CreateEditDocument call
      // documentKey: null,
      contractorTranslations: null,
      staffTranslations: null,
      allDocumentObjects: state.documents.allDocumentObjects,
      templateMappingObjects: state.documents.templateMappingObjects,
      documentFields: {},
      documentTranslations: {},
      templateElements: state.documents.templateElements,
      templateTranslationElements: state.documents.templateTranslationElements,
      templateElementsByPage: state.documents.templateElementsByPage,
      templateTranslationElementsByPage: state.documents.templateTranslationElementsByPage,
      documentTranslationsAll: state.documents.documentTranslations,
      documentTranslationsAllInOne: state.documents.documentTranslationsAllInOne,
      templateElementsMappedByName: state.documents.templateElementsMappedByName,
      selectedFieldObject: state.documents.selectedFieldObject,
      initialValues,
      formIsDirty,
      valuesInForm: state.form.CreateEditDocument && state.form.CreateEditDocument.values ? state.form.CreateEditDocument.values : {},
      showGetFieldValuesChoice: state.modals.showGetFieldValuesChoiceModal,
      // importFieldsFromOtherDocuments: state.documents.importFieldsFromOtherDocuments,
      showSelectExistingDocument: state.modals.showSelectExistingDocumentModal,
      importFieldsFromOtherDocumentsObject: state.documents.importFieldsFromOtherDocumentsObject,
      allUserAgreementsArrayMappedWithDocumentFields: state.documents.allUserAgreementsArrayMappedWithDocumentFields,
      selectedAgreementIdArray: state.documents.selectedAgreementIdArray,
      editActionBoxCallForActionObject: state.documents.editActionBoxCallForActionObject,
      cachedInitialValuesObject: state.documents.cachedInitialValuesObject,
      lastMountedocumentId: state.documents.lastMountedocumentId,
      mappedAgreementsWithCachedDocumentFields: state.documents.mappedAgreementsWithCachedDocumentFields,
      showLoadingProp: state.auth.showLoading,
      templateElementsRunningCountTotal: state.documents.templateElementsRunningCountTotal,
      templateTranslationElementsRunningCountTotal: state.documents.templateTranslationElementsRunningCountTotal,
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
