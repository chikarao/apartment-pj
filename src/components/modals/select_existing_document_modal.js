import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import AppLanguages from '../constants/app_languages';
import Documents from '../constants/documents';

import getDocumentFieldsWithSameName from '../functions/get_document_fields_with_same_name';
import globalConstants from '../constants/global_constants.js';

let showHideClassName;

class SelectExitingDocumentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showAllDocuments: true,
      // showByFlat: false,
      showByBooking: false,
      showFromOldest: false,
      showFromNewest: true,
      selectedFlatId: null,
      showFlatSelectionBox: false,
      agreementsTreatedArray: null,
      showAll: true,
      showRentalContracts: true,
      showImportantPoints: true,
      selectedDocumentsArray: [],
      expandBookingId: null,
      shrinkModal: false,
      loadingMessage: false,
      selectedAgreementId: null,
      showNameAgreementsSubModal: false,
      blankInputElementArray: [],
      newAgreementNameByIdObject: {},
      agreementIdUserWorkingOn: null,
      showStandardDocuments: false,
    };
    this.handleClose = this.handleClose.bind(this);
    // this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleSelectionButtonClick = this.handleSelectionButtonClick.bind(this);
    this.handleCloseFlatSelectionBox = this.handleCloseFlatSelectionBox.bind(this);
    this.handleFlatSelectionClick = this.handleFlatSelectionClick.bind(this);
    this.handleDocumentCheck = this.handleDocumentCheck.bind(this);
    this.handleAddExistingAgreementsClick = this.handleAddExistingAgreementsClick.bind(this);
    this.handleBookingCaretClick = this.handleBookingCaretClick.bind(this);
    this.handleAgreementShowClick = this.handleAgreementShowClick.bind(this);
    this.handleGetFieldValuesForAgreementClick = this.handleGetFieldValuesForAgreementClick.bind(this);
    this.handleCloseGetFieldValuesChoiceBox = this.handleCloseGetFieldValuesChoiceBox.bind(this);
    this.handleNameChangeAddClick = this.handleNameChangeAddClick.bind(this);
    this.handleDocumentNameInputChange = this.handleDocumentNameInputChange.bind(this);
  }

  componentDidMount() {
    // const showLoading = () => this.props.showLoading();
    // console.log('in SelectExitingDocumentModal, componentDidMount, this.props: ', this.props);
    // send showLoading twice to
    // const loading = !this.props.getFieldValues ? showLoading : () => { this.setState({ loadingMessage: !this.state.loadingMessage }); };
    this.props.fetchUserAgreements(() => this.props.showLoading());
    // if (this.props.getFieldValues) this.props.fetchUserAgreements(showLoading);
    this.setState({ agreementIdUserWorkingOn: this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
                    ?
                    this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
                    :
                    this.props.agreementId }, () => {
      // console.log('in select_existing_document_modal, componentDidMount, this.state.agreementIdUserWorkingOn: ', this.state.agreementIdUserWorkingOn);
    });
  }
  // Not yet used
  // componentDidUpdate(prevProps, prevState) {
  //   if ((prevProps.showGetFieldValuesChoice !== this.props.showGetFieldValuesChoice) && this.props.showGetFieldValuesChoice) {
  //     window.addEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
  //   }
  //   if (prevState.showFromNewest !== this.state.showFromNewest
  //       ||
  //       prevState.showByBooking !== this.state.showByBooking
  //       ||
  //       prevState.selectedFlatId !== this.state.selectedFlatId
  //       ||
  //       prevState.showImportantPoints !== this.showImportantPoints
  //     ) {
  //       console.log('in SelectExitingDocumentModal, componentDidUpdate, prevState, this.state: ', prevState, this.state);
  //     }
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log('in select_existing_document_modal, componentDidUpdate, prevProps.allUserAgreementsArray, this.props.allUserAgreementsArray, this.props.importFieldsFromOtherDocumentsObject.baseAgreementId: ', prevProps.allUserAgreementsArray, this.props.allUserAgreementsArray,this.props.importFieldsFromOtherDocumentsObject.baseAgreementId);
  //   if (!prevProps.allUserAgreementsArray
  //       && this.props.allUserAgreementsArray
  //       && this.props.importFieldsFromOtherDocumentsObject.baseAgreementId) {
  //     const agreementsTreatedArray = [];
  //     _.each(this.props.allUserAgreementsArray, eachAgreement => {
  //
  //       if (eachAgreement.id !== this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
  //         && eachAgreement.template_file_name === this.props.allUserAgreementsArrayMapped[this.props.importFieldsFromOtherDocumentsObject.baseAgreementId].template_file_name
  //       ) agreementsTreatedArray.push(eachAgreement)
  //     });
  //     this.setState({ agreementsTreatedArray });
  //   }
  // }
  // handleFormSubmit(data) {
    // !!!!only persist first 4 characters of account number
    // console.log('in edit flat, handleFormSubmit, data.account_number, data.account_number.slice(0, 4);: ', data.account_number, data.account_number.slice(0, 4));
    // const dataToBeChanged = data;
    // dataToBeChanged.flat_id = this.props.flat.id;
    // const dataToBeSent = { facility: dataToBeChanged };
    // // send all data for account; gets assigned user_id on api based on token
    // console.log('in SelectExitingDocumentModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    // this.props.showLoading();
    // this.props.createFacility(dataToBeSent, () => {
    //   this.addExistingAgreementsCallback();
    // });
  // }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleCloseFlatSelectionBox);
    window.removeEventListener('keydown', this.handleCloseFlatSelectionBox);
    window.removeEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
    window.removeEventListener('keydown', this.handleCloseGetFieldValuesChoiceBox);
    if (this.props.showGetFieldValuesChoice) this.props.showGetFieldValuesChoiceModal(() => {});
    if (this.state.shrinkModal) {
      //If user is importing fields from other documents, do not null out agreementId
      if (!this.props.importFieldsFromOtherDocumentsObject.baseAgreementId) {
        this.props.setAgreementId(null, false, false, false, false, () => {});
        this.props.setTemplateElementsObject({
          templateElements: {},
          templateElementsByPage: {},
          templateTranslationElements: {},
          templateTranslationElementsByPage: {}
        });
      } else {
        console.log('in SelectExitingDocumentModal, componentWillUnmount in else: ');
        // this.props.setAgreementId(this.props.importFieldsFromOtherDocumentsObject.baseAgreementId, true, true, true, true);
        // this.props.setTemplateElementsObject({
        //   templateElements: this.props.importFieldsFromOtherDocumentsObject.baseAgreementElements.templateElements,
        //   templateElementsByPage: this.props.importFieldsFromOtherDocumentsObject.baseAgreementElements.templateElementsByPage,
        //   templateTranslationElements: this.props.importFieldsFromOtherDocumentsObject.baseAgreementElements.templateTranslationElements,
        //   templateTranslationElementsByPage: this.props.importFieldsFromOtherDocumentsObject.baseAgreementElements.templateTranslationElementsByPage
        // });
      }
    }
  }

  addExistingAgreementsCallback() {
    // console.log('in SelectExitingDocumentModal, addExistingAgreementsCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ selectExistingDocumentCompleted: true,
                    showNameAgreementsSubModal: false
                  });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
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
  // turn off showSelectExitingDocumentModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    if (this.props.show) {
      if (this.props.importFieldsFromOtherDocumentsObject.baseAgreementId) {
        // this.props.importFieldsFromOtherDocumentsAction(() => {});
        // if (this.props.grayOutBackgroundProp) this.props.grayOutBackground(() => {});
        // When user closes modal, null out and close current agreement, and
        // display the base agreement (original) in a callback
        // callback to setCreateDocumentKey; Set agreementId to pass to CreateEditDocument
        // this.props.setAgreementId(null, false, false, false, false, () => {
        //   this.props.setAgreementId(this.props.importFieldsFromOtherDocumentsObject.baseAgreementId, true, true, true, true, () => {});
        //   this.props.setCreateDocumentKey(globalConstants.ownUploadedDocumentKey, () => {
        //   // Empty out element-related objects when close agreement
        //   this.props.setTemplateElementsObject({
        //     templateElements: {},
        //     templateElementsByPage: {},
        //     templateTranslationElements: {},
        //     templateTranslationElementsByPage: {}
        //   });
        //
        // });
        // console.log('in SelectExitingDocumentModal, handleClose, this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length: ', this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length);
        // });
      } //  if (this.props.importFieldsFromOtherDocuments) {

      const callback = this.props.getFieldValues ? () => { this.props.showSelectExistingDocumentModalForGetFieldValues(); } : () => {}
      this.props.showSelectExistingDocumentModal(callback);
      this.setState({ selectExistingDocumentCompleted: false,
        // shrinkModal: false
      });
    } //if (this.props.show) {
  }

  handleFlatSelectionClick(event) {
    const clickedElement = event.target;
    let currentElement = clickedElement;
    // console.log('in select_exiting_document, handleFlatSelectionClick, clickedElement, clickedElement.parentElement: ', clickedElement, clickedElement.parentElement);
    // Clicks are detected in the children of the LI selected so
    // get the parentElement until the element is an LI element
    while (currentElement.nodeName !== 'LI') {
      currentElement = currentElement.parentElement;
    }

    const clickedFlatId = parseInt(currentElement.getAttribute('value'), 10);

    this.setState({
      // showByFlat: clickedFlatId !== this.state.selectedFlatId,
      selectedFlatId: clickedFlatId === this.state.selectedFlatId ? null : clickedFlatId
    }, () => {
      // if user selects flat, false out showAll
      console.log('in select_exiting_document, handleFlatSelectionClick, this.state.showByFlat, this.state.selectedFlatId: ', this.state.showByFlat, this.state.selectedFlatId);
      this.setState({ showAll: !this.state.selectedFlatId }, () => {
        // After flat selection, get a new treatedAgreementObject
        this.treatAgreementsObject();
      });
    });
  }

  renderEachFlat() {
    // <img className="flat-selection-box-each-image-box" src={''} alt="" />
    return _.map(this.props.allUserFlatsMapped, eachFlat => {
      console.log('in select_exiting_document, renderEachFlat, eachFlat: ', eachFlat);
      return (
        <li
          key={eachFlat.id}
          className="flat-selection-box-each"
          id={`flat-selection-box-${eachFlat.id}`}
          value={eachFlat.id}
          onClick={this.handleFlatSelectionClick}
          style={{ backgroundColor: eachFlat.id === this.state.selectedFlatId ? 'lightgray' : null }}
        >
          <img className="flat-selection-box-each-image-box" src={'http://res.cloudinary.com/chikarao/image/upload/v1524032785/' + eachFlat.images[0].publicid + '.jpg'} alt="" />
          <div className="flat-selection-box-each-text-box">
            <div className="flat-selection-box-each-text-box-address">{eachFlat.address1}</div>
            <div className="flat-selection-box-each-text-box-unit-city-box">
              {eachFlat.unit ? <div className="flat-selection-box-each-text-box-unit">Unit: {eachFlat.unit}</div> : ''}
              <div className="flat-selection-box-each-text-box-city">{eachFlat.city}</div>
            </div>
            <div className="flat-selection-box-each-text-box-id-box">
              <div className="flat-selection-box-each-text-box-id">id: {eachFlat.id}</div>
            </div>
          </div>
        </li>
      )
    })
  }

  handleCloseFlatSelectionBox(event) {
    const clickedElement = event.target;

    const array = [
      'flat-selection-box-container',
      'flat-selection-box-scrollbox',
      'flat-selection-box-each',
      'flat-selection-box-each-image-box',
      'flat-selection-box-each-text-box-address',
      'flat-selection-box-each-text-box-unit',
      'flat-selection-box-each-text-box-city',
      'flat-selection-box-each-text-box-id',
      'flat-selection-box-each-text-box-id-box',
      'select-existing-document-button-each'
    ];
    // && !event.key in case user clicks non-eaccape key
    if ((array.indexOf(clickedElement.className) === -1 && !event.key) || (event.key === 'Escape' || event.key === 'Esc')) {
      const flatSelectionBoxArray = document.getElementsByClassName('flat-selection-box-container');
      if (flatSelectionBoxArray[0]) flatSelectionBoxArray[0].style.display = 'none';
      this.setState({
        showFlatSelectionBox: !this.state.showFlatSelectionBox
      }, () => {
        window.removeEventListener('click', this.handleCloseFlatSelectionBox);
        window.removeEventListener('keydown', this.handleCloseFlatSelectionBox);
      });
    }
  }

  renderFlatSelectionBox() {
    // if (this.state.showFlatSelectionBox) {
    let flatSelectionButtonDimensions = {};
    let modalMainDimensions = {};

    const flatSelectionButtonElement = document.getElementById('selection-button-showByFlat')
    const modalMainElementArray = document.getElementsByClassName('modal-main')
    // Get the flat selection button dimension so that a control box can be placed below it
    if (flatSelectionButtonElement) flatSelectionButtonDimensions = flatSelectionButtonElement.getBoundingClientRect();
    if (modalMainElementArray[0]) modalMainDimensions = modalMainElementArray[0].getBoundingClientRect();
    const positionWithinModalMain = { top: flatSelectionButtonDimensions.top - modalMainDimensions.top, left: flatSelectionButtonDimensions.left - modalMainDimensions.left  }

    return (
      <div
        className="flat-selection-box-container"
        style={{ display: 'none', top: positionWithinModalMain.top ? positionWithinModalMain.top + 25 : 0, left: positionWithinModalMain.left ? positionWithinModalMain.left : 0 }}
      >
      <ul
        className="flat-selection-box-scrollbox"
      >
        {this.renderEachFlat()}
      </ul>
      </div>
    );
    // }
  }

  handleDocumentCheck(event) {
    const checkedElement = event.target;
    const elementVal = checkedElement.getAttribute('value')
    const selectedDocumentsArray = [...this.state.selectedDocumentsArray];
    const index = selectedDocumentsArray.indexOf(parseInt(elementVal, 10))

    if (index === -1) {
      selectedDocumentsArray.push(parseInt(elementVal, 10));
    } else {
      selectedDocumentsArray.splice(index, 1);
    }

    this.setState({ selectedDocumentsArray }, () => {
      console.log('in select_exiting_document, handleDocumentCheck, checkedElement, elementVal, this.state.selectedDocumentsArray: ', checkedElement, elementVal, this.state.selectedDocumentsArray);
    })
  }

  handleBookingCaretClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.setState({ expandBookingId: this.state.expandBookingId ? null : parseInt(elementVal, 10) }, () => {
    });
  }

  // getUpdatedSelectedFieldObject() {
  //   const object = {};
  //   let eachId = null;
  //   _.each(this.props.selectedFieldObject, eachFieldObject => {
  //     console.log('in select_exiting_document, handleCloseGetFieldValuesChoiceBox, this.props.selectedFieldObject, eachFieldObject: ', this.props.selectedFieldObject, eachFieldObject);
  //     eachId = eachFieldObject.element.id
  //     object[this.props.templateElements[eachId].name] = { element: this.props.templateElements[eachId], currentValue: this.props.valuesInForm[this.props.templateElements[eachId].name] };
  //   });
  //   return _.isEmpty(object) ? null : object;
  // }

  resetSelectedFieldObject() {
    // When user closes GetFieldValueChoiceModal,
    // take out keys that are craeted in the modal to reset it
    // to when user opens the SelectExitingDocumentModal
    const newObject = { ...this.props.selectedFieldObject, fieldValueAppliedArray: [] };
    if (newObject.valueChanged) {
      _.each(Object.keys(newObject.fields), eachFieldNameKey => {
        if (newObject.fields[eachFieldNameKey].currentValue !== this.props.valuesInForm[eachFieldNameKey]) newObject.fields[eachFieldNameKey].currentValue = this.props.valuesInForm[eachFieldNameKey];
        if (newObject.fields[eachFieldNameKey].newValue) delete newObject.fields[eachFieldNameKey].newValue
      });
      delete newObject.valueChanged
    }
    console.log('in select_exiting_document, resetSelectedFieldObject, newObject ', newObject);
    return newObject;
  }

  handleCloseGetFieldValuesChoiceBox(event) {
    // Get updated object with attributes about selected elements
    // updated with new values in form

    const clickedElement = event.target;
    // Find out if user clicked in any elements with classNames that start with below
    const clickedOnModal = clickedElement.className.indexOf('get-field-value-choice-modal') !== -1;
    const clickedOnAgreementEach = clickedElement.className.indexOf('select-existing-document-each-document') !== -1;
    const pushedEscapeKey = (event.key === 'Escape') || (event.key === 'Esc');
    console.log('in select_exiting_document, handleCloseGetFieldValuesChoiceBox, event.key, pushedEscapeKey', event.key, pushedEscapeKey);

    // If user clicks on something other than a document or a getFieldValues modal element
    // close the modal, and do clean up
    if ((!clickedOnModal && !clickedOnAgreementEach && !event.key) || pushedEscapeKey) {
      // When user closes the showGetFieldValuesChoiceModal, get a new setSelectedFieldObject
      // to reflect the new value in the form
      // this.props.setSelectedFieldObject(this.getUpdatedSelectedFieldObject());
      // Switch off modal show
      this.props.showGetFieldValuesChoiceModal(() => {});
      this.props.setSelectedFieldObject(this.resetSelectedFieldObject());
      window.removeEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
      window.removeEventListener('keydown', this.handleCloseGetFieldValuesChoiceBox);

      this.setState({ selectedAgreementId: null });
    }
  }

  handleGetFieldValuesForAgreementClick(event) {
    // const getDocumentFieldsWithSameName = (documentFields, selectedFieldObject) => {
    //   const object = {};
    //   const controlObject = {};
    //   // Go through each field in document to see if the name of the field
    //   // is in selectedFieldObject with fields selected by user
    //   _.each(documentFields, eachField => {
    //     // Keep track of multiple fields with the same name
    //     if (!controlObject[eachField.name]) {
    //       controlObject[eachField.name] = 1;
    //     } else {
    //       controlObject[eachField.name]++;
    //     }
    //     console.log('in select_exiting_document, handleGetFieldValuesForAgreementClick, this.props.selectedFieldObject, eachField.name, controlObject[eachField.name]: ', this.props.selectedFieldObject, eachField.name, controlObject[eachField.name]);
    //     // selectedFieldObject is set in CreateEditDocument in case 'getFieldValues':
    //     if (
    //       selectedFieldObject[eachField.name] // was selected by user
    //       && eachField.value // documentField of document has a value
    //       // value is not the same as the current value of field in form props selected by user
    //       // && (eachField.value !== this.props.valuesInForm[eachField.name])
    //       && controlObject[eachField.name] <= 1 // test if not a repeat of documentField
    //     ) {
    //       // if pass test, place in object to be sent to action setGetFieldValueDocumentObject
    //       // object[eachField.name] = { fieldName: eachField.name, [eachField.name]: eachField.value, currentValue: this.props.selectedFieldObject[eachField.name].currentValue };
    //       object[eachField.name] = { field: eachField, fieldName: eachField.name, [eachField.name]: eachField.value, currentValue: this.props.valuesInForm[eachField.name], sameValues: eachField.value === this.props.valuesInForm[eachField.name] };
    //     }
    //   });
    //
    //   return object;
    // };

    const clickedElement = event.target;
    let currentElement = clickedElement;
    while (currentElement.className !== 'select-existing-document-each-document-top-box') {
      currentElement = currentElement.parentElement;
    }
    const elementVal = parseInt(currentElement.getAttribute('value'), 10);
    // If the selectedAgreementId is different from the user clicked agreemnt id
    if (elementVal !== this.state.selectedAgreementId) {
      // this.props.setGetFieldValueDocumentObject(null);
      this.setState({ selectedAgreementId: elementVal }, () => {
        const selectedAgreement = this.props.allUserAgreementsMapped[elementVal];
        // const templateElement = this.props.templateElements[parseInt(elementVal, 10)]
        // const fieldObject = this.props.showGetFieldValuesChoice ? this.getUpdatedSelectedFieldObject() : getDocumentFieldsWithSameName(selectedAgreement.document_fields);
        const fieldObject = getDocumentFieldsWithSameName({
          documentFields: selectedAgreement.document_fields,
          selectedFieldObject: this.props.selectedFieldObject,
          valuesInForm: this.props.valuesInForm,
          allObject: this.props.allDocumentObjects[selectedAgreement.template_file_name],
          documentConstants: this.props.documentConstants,
          appLanguageCode: this.props.appLanguageCode
        });
        // If not open, open the modal
        // addEventListener is called in componentDidUpdate
        if (!this.props.showGetFieldValuesChoice) {
          this.props.showGetFieldValuesChoiceModal(() => {});
          // console.log('in select_exiting_document, handleGetFieldValuesForAgreementClick, this.handleCloseGetFieldValuesChoiceBox, typeof this.handleCloseGetFieldValuesChoiceBox: ', this.handleCloseGetFieldValuesChoiceBox, typeof this.handleCloseGetFieldValuesChoiceBox);
          window.addEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
          window.addEventListener('keydown', this.handleCloseGetFieldValuesChoiceBox);
        }
        console.log('in select_exiting_document, handleGetFieldValuesForAgreementClick, fieldObject: ', fieldObject);
        // call action to set state.documents.fieldValueDocumentObject to be used in showGetFieldValuesChoiceModal
        this.props.setGetFieldValueDocumentObject({ agreement: selectedAgreement, fieldObject: fieldObject.object, differentValueCount: fieldObject.differentValueCount, selectedFieldNameArray: [], fieldValueAppliedArray: [] });
        // console.log('in select_exiting_document, handleGetFieldValuesForAgreementClick, clickedElement, selectedAgreement, this.props.selectedFieldObject, fieldObject: ', clickedElement, selectedAgreement, this.props.selectedFieldObject, fieldObject);
      });
    }
  }

  handleAgreementShowClick(event) {
    const clickedElement = event.target;
    let clickedAgreementId = null;
    let currentElement = clickedElement;
    const userClickedExpand = clickedElement.nodeName === 'I';
    const userClickedCheckbox = clickedElement.nodeName === 'INPUT' || clickedElement.className === 'select-existing-document-each-document-top-box-right';
    // if uswer is not clicking on the expand icon when modal is shrunken
    if (!userClickedExpand && !userClickedCheckbox) {
      // Clicks are detected in the children of the LI selected so
      // get the parentElement until the element is an LI element
      while (currentElement.className !== 'select-existing-document-each-document-top-box') {
        currentElement = currentElement.parentElement;
      }

      clickedAgreementId = parseInt(currentElement.getAttribute('value'), 10);
    }

    // Turn shrinkModal both when clicking agreement and expand icon
    this.setState({
      shrinkModal: !userClickedCheckbox ? !this.state.shrinkModal : this.state.shrinkModal,
    }, () => {
      // props coming from this modal call in editFlat or bookingConfirmation
      // empty out agreement and other element related objects to be sent to CreateEditDocument.
      if (this.props.grayOutBackgroundProp) this.props.grayOutBackground(() => {});

      // Clicked expand while showing agreement
      // Nulls out agreementId and template element objects
      if (userClickedExpand) {
        this.props.setAgreementId(null, false, false, false, false, () => {});
        this.props.setTemplateElementsObject({
          templateElements: {},
          templateElementsByPage: {},
          templateTranslationElements: {},
          templateTranslationElementsByPage: {}
        });
      }

      if (clickedAgreementId) {
        // setAgreementId sets showDocument to true as second argument
        if (this.props.importFieldsFromOtherDocumentsObject.baseAgreementId) {
        // if (this.props.importFieldsFromOtherDocuments && this.props.importFieldsFromOtherDocumentsObject.agreementId) {
          let newAssociationObject = {}
          // If associationObject is empty assign new one
          if (_.isEmpty(this.props.importFieldsFromOtherDocumentsObject.associationObject)) {
            newAssociationObject = { [this.props.importFieldsFromOtherDocumentsObject.baseAgreementId]: [clickedAgreementId] }
          } else { // if (!this.props.importFieldsFromOtherDocumentsObject.association) {
            newAssociationObject = { ...this.props.importFieldsFromOtherDocumentsObject.associationObject };
            if (newAssociationObject[this.props.importFieldsFromOtherDocumentsObject.baseAgreementId]
                && newAssociationObject[this.props.importFieldsFromOtherDocumentsObject.baseAgreementId].indexOf(clickedAgreementId) === -1
              ) {
              newAssociationObject[this.props.importFieldsFromOtherDocumentsObject.baseAgreementId].push(clickedAgreementId)
            } else {
              newAssociationObject[this.props.importFieldsFromOtherDocumentsObject.baseAgreementId] = [clickedAgreementId]
            }
          } // end of else   if (!this.props.importFieldsFromOtherDocumentsObject.association) {
          const newObject = { ...this.props.importFieldsFromOtherDocumentsObject,
                              fieldsArray: [],
                              agreementId: clickedAgreementId,
                              associationObject: newAssociationObject
                            };
          this.props.importFieldsFromOtherDocumentsObjectAction(newObject);
        }
        // In import fields When user chooses an agreement
        // Props from bookingConfirmation
        // console.log('in SelectExistingDocumentModal, handleAgreementShowClick, clickedAgreementId tthis.props.valuesInForm: ', clickedAgreementId, this.props.valuesInForm);
        // Keep each agreement's values in a mapped object for later use
        this.props.setCachedInitialValuesObject({ ...this.props.cachedInitialValuesObject, [this.props.agreementId]: this.props.valuesInForm });
        // openOrSwitchAgreements is props from bookingConfirmation
        this.props.openOrSwitchAgreements(clickedAgreementId, true, true);
        this.handleClose();
      }
      // show other documents
    });
  }

  renderEachDocument(agreementsTreatedArray) {
    const renderEachAgreement = (eachAgreement) => {
      if (this.props.allUserAgreementsMapped[eachAgreement.id] && this.props.allUserAgreementsMapped[eachAgreement.id].document_name) {
        return (
          <div
            className="select-existing-document-each-document-top-box"
            onClick={this.props.getFieldValues ? this.handleGetFieldValuesForAgreementClick : this.handleAgreementShowClick}
            value={eachAgreement.id}
            key={eachAgreement.id}
          >
            <div
              className="select-existing-document-each-document-top-box-left"
            >
              <div
                className="select-existing-document-each-document-top-box-left-name"
              >
                {this.props.allUserAgreementsMapped[eachAgreement.id].document_name}
              </div>
              <div
                className="select-existing-document-each-document-top-box-left-date"
              >
                id: { `${eachAgreement.id}`} Last updated: {`${eachAgreement.updated_at.getMonth() + 1}/${eachAgreement.updated_at.getDate()}/${eachAgreement.updated_at.getFullYear()}`}
              </div>
            </div>
            <div
              className="select-existing-document-each-document-top-box-right"
            >
              {this.props.getFieldValues || this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
              ?
              null
              :
              <input
                type="checkbox"
                value={eachAgreement.id}
                onChange={this.handleDocumentCheck}
                checked={this.state.selectedDocumentsArray.indexOf(eachAgreement.id) !== -1}
              />}
            </div>
          </div>
        );
      }
    };

    const renderAgreements = (agreementArray) => {
      return _.map(agreementArray, eachAgreement => {
        return renderEachAgreement(eachAgreement);
      });
    };

    const renderEachBooking = (eachBooking) => {
      const tenant = this.props.allBookingsForUserFlatsMapped[eachBooking.id]
                      && this.props.allBookingsForUserFlatsMapped[eachBooking.id].user
                      ?
                      this.props.allBookingsForUserFlatsMapped[eachBooking.id].user
                      :
                      null;
      // const tenant = {};
      if (tenant) {
        return (
          <div
            key={eachBooking.id}
            className="select-existing-document-each-document-top-box"
          >
            <div
              className="select-existing-document-each-document-top-box-left"
            >
              <div
                className="select-existing-document-each-document-top-box-left-name"
              >
                Booking for: {tenant.profiles.length > 0 ? ` ${tenant.profiles[0].first_name} ${tenant.profiles[0].last_name}` : 'The user has no profile'}
              </div>
              <div
                className="select-existing-document-each-document-top-box-left-date"
              >
                Start Date: {`${eachBooking.date_start.getMonth() + 1}/${eachBooking.date_start.getDate()}/${eachBooking.date_start.getFullYear()}`}
              </div>
            </div>
            <div
              className="select-existing-document-each-document-top-box-right"
            >
              {this.state.expandBookingId === eachBooking.id
                ?
                <i className="fas fa-caret-down" style={{ fontSize: '20px' }} value={eachBooking.id} onClick={this.handleBookingCaretClick}></i>
                :
                <i className="fas fa-caret-left" style={{ fontSize: '20px' }} value={eachBooking.id} onClick={this.handleBookingCaretClick}></i>
              }
            </div>
          </div>
        );
      }
    };

    const bookingHasSameTemplateFileNameDiffIds = (eachBooking, templateFileName, id) => {
      let returnBoolean = false;
      _.each(eachBooking.agreements, eachAgreement => {
        if (eachAgreement.template_file_name === templateFileName
            && eachAgreement.id !== id) returnBoolean = true;
      });
      return returnBoolean;
    };
    // if (this.props.importFieldsFromOtherDocuments
    //       && agreementUserWorkingOn
    //       && Documents[agreementUserWorkingOn.template_file_name].appLanguagesKey === eachButtonKey)
    // Render top box for agreement and booking;
    // Render bottom box only if there are agreements attached to bookings when showByBooking true
    let renderAgreementOrBooking = true;
    const agreementUserWorkingOn = this.props.allUserAgreementsArrayMapped
                                    && this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
                                    ?
                                    this.props.allUserAgreementsArrayMapped[this.state.agreementIdUserWorkingOn]
                                    :
                                    null;

    console.log('in SelectExistingDocumentModal, renderEachDocument, this.props.allUserAgreementsArrayMapped, agreementUserWorkingOn, Documents: ', this.props.allUserAgreementsArrayMapped, agreementUserWorkingOn, Documents);
    // agreementsTreatedArray is an array that has either array of agreements or bookings
    // based on user choice
    return _.map(agreementsTreatedArray, each => {
      renderAgreementOrBooking = true;
      // If importing fields (i.e. baseAgreementId exists)
      // this.state.agreementsTreatedArray
      // Do not render the same agreement being worked on OR
      // a different type of template (i.d. rental contract vs. important points)
      if ((!this.state.agreementsTreatedArray
            && this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
            // && agreementUserWorkingOn
           )
            && (each.id === this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
            || each.template_file_name !== this.props.allUserAgreementsArrayMapped[this.props.importFieldsFromOtherDocumentsObject.baseAgreementId].template_file_name)
          ) renderAgreementOrBooking = false;

      // if (renderAgreementOrBooking) {
      if (renderAgreementOrBooking) {
        return (
          <li
            className="select-existing-document-each-document-box"
            key={each.id}
            value={each.id}
          >
            {this.state.showByBooking ? renderEachBooking(each) : renderEachAgreement(each)}

            <div
              className="select-existing-document-each-document-bottom-box"
            >
              {this.state.showByBooking && this.state.expandBookingId ? renderAgreements(each.agreements) : null}
            </div>
          </li>
        );
      }
    });
  }

  renderExistingDocuments() {
    const { allUserAgreementsArray } = this.props;
    // const agreementsTreatedArray = this.state.agreementsTreatedArray ? this.state.agreementsTreatedArray : allUserAgreementsArray;
    const agreementsTreatedArray = this.state.agreementsTreatedArray ? this.state.agreementsTreatedArray : allUserAgreementsArray;

    console.log('in SelectExistingDocumentModal, renderExistingDocuments, agreementsTreatedArray: ', agreementsTreatedArray);

    return (
      <ul
        className="select-existing-document-main-scroll-box"
      >
        {this.renderEachDocument(agreementsTreatedArray)}
      </ul>
    );
  }

  indicateLoading() {
    return <div style={{ margin: '30px 0 0 0' }}>Loading Agreements...</div>;
  }

  treatAgreementsObject() {
    const agreementsTreatedArray = [];
    const { baseAgreementId } = this.props.importFieldsFromOtherDocumentsObject;
    const showRentalContracts = baseAgreementId ? this.props.allUserAgreementsArrayMapped[baseAgreementId].template_file_name === 'fixed_term_rental_contract_bilingual' : this.state.showRentalContracts;
    const showImportantPoints = baseAgreementId ? this.props.allUserAgreementsArrayMapped[baseAgreementId].template_file_name === 'important_points_explanation_bilingual' : this.state.showImportantPoints;

    if (!this.state.showByBooking) {
      const filterAgreements = () => {
        _.each(this.props.allUserAgreementsArray, eachAgreement => {
          // Test if user is adding agreements or adding fields from other agreements
          // And if user has selected an agreement for own flat
          const addAgreement = (!this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
                                  && (this.state.selectedFlatId === null || (this.state.selectedFlatId === eachAgreement.flat_id && !eachAgreement.standard_document))
                                  && ((this.state.showStandardDocuments && eachAgreement.standard_document) || (!this.state.showStandardDocuments && !eachAgreement.standard_document))
                               )
                                ||
                               (baseAgreementId
                                  && eachAgreement.id !== baseAgreementId
                                  && (this.state.selectedFlatId === null || (this.state.selectedFlatId === eachAgreement.flat_id && !eachAgreement.standard_document))
                               )

          // If addAgreement is true test to see if user has selected rental or important points agreements
          // And add to array only if same agreement type
          if (addAgreement
              && showRentalContracts
              && eachAgreement.template_file_name === 'fixed_term_rental_contract_bilingual'
            ) agreementsTreatedArray.push(eachAgreement);

          if (addAgreement
              && showImportantPoints
              && eachAgreement.template_file_name === 'important_points_explanation_bilingual'
            ) agreementsTreatedArray.push(eachAgreement)
          // if (this.state.selectedFlatId && eachAgreement.flat_id === this.state.selectedFlatId) agreementsTreatedArray.push(eachAgreement)
          // console.log('in SelectExistingDocumentModal, treatAgreementsObject, addAgreement, agreementsTreatedArray, eachAgreement, this.props.allUserAgreementsArrayMapped[this.props.importFieldsFromOtherDocumentsObject.baseAgreementId],  ', addAgreement, agreementsTreatedArray, eachAgreement, this.props.allUserAgreementsArrayMapped[this.props.importFieldsFromOtherDocumentsObject.baseAgreementId]);
        });
      };

      filterAgreements();
      // Sort by date updated_at;
      // allUserAgreementsArray has date objects created in the reducer for updated_at
      if (this.state.showFromOldest) agreementsTreatedArray.sort((a, b) => b.updated_at - a.updated_at);
      if (this.state.showFromNewest) agreementsTreatedArray.sort((a, b) => a.updated_at - b.updated_at);
    } else { // if show by booking
        let agreementsArray = null;
        let bookingObject = null;
        let addAgreement = true;

      _.each(this.props.allBookingsForUserFlatsArray, eachBooking => {
        // Go through the booking adding process only if there is no flat selected or for flat that is selected
        if (this.state.selectedFlatId === null || (this.state.selectedFlatId === eachBooking.flat_id)) {
          bookingObject = {};
          bookingObject.id = eachBooking.id;
          bookingObject.date_start = eachBooking.date_start;
          bookingObject.user = this.props.allBookingsForUserFlatsMapped[eachBooking.id].user
          agreementsArray = [];

          _.each(this.props.allBookingsForUserFlatsMapped[eachBooking.id].agreements, eachAgreement => {
            // Test if under import fields whether agreements is being worked on
            // with baseAgreementId
            addAgreement = true;
            if ((baseAgreementId
                  && this.props.allUserAgreementsArrayMapped[baseAgreementId].id === eachAgreement.id)
                || eachAgreement.standard_document
                ) addAgreement = false;

          console.log('in SelectExistingDocumentModal, treatAgreementsObject, eachAgreement, addAgreement, baseAgreementId, this.props.allUserAgreementsArrayMapped: ', eachAgreement, addAgreement, baseAgreementId, this.props.allUserAgreementsArrayMapped);
            if (addAgreement && showImportantPoints && eachAgreement.template_file_name === 'important_points_explanation_bilingual') agreementsArray.push(this.props.allUserAgreementsArrayMapped[eachAgreement.id]);
            if (addAgreement && showRentalContracts && eachAgreement.template_file_name === 'fixed_term_rental_contract_bilingual') agreementsArray.push(this.props.allUserAgreementsArrayMapped[eachAgreement.id]);
          });
          bookingObject.agreements = agreementsArray;
          // Add booking to array only if there are agreements in the bookingObject array
          // if (bookingObject.agreements.length > 0)
          agreementsTreatedArray.push(bookingObject);
        }
      });
      if (this.state.showFromOldest) agreementsTreatedArray.sort((a, b) => b.date_start - a.date_start);
      if (this.state.showFromNewest) agreementsTreatedArray.sort((a, b) => a.date_start - b.date_start);
    }
    // Set state to be used in render
    this.setState({ agreementsTreatedArray });
  }

  handleSelectionButtonClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // let newestBool = this.state.showFromNewest;
    // let oldestBool = this.state.showFromOldest;
    // if (elementVal === 'showFromOldest' || elementVal === 'showFromNewest') {
    //   if (elementVal === 'showFromOldest') newestBool = !newestBool;
    //   if (elementVal === 'showFromNewest') oldestBool = !oldestBool;
    // }

   this.setState({
     showFlatSelectionBox: elementVal === 'showByFlat' ? !this.state.showFlatSelectionBox : this.state.showFlatSelectionBox,
     // When user clicks showAll and showAll is false, turn true
     showAll: elementVal === 'showAll' ? true : this.state.showAll,
     // showAll: elementVal === 'showAll' && !this.state.showAll ? true : this.state.showAll,
     showByBooking: elementVal === 'showByBooking' ? !this.state.showByBooking : this.state.showByBooking,
     showFromOldest: elementVal === 'showFromOldest' && this.state.showFromNewest ? true : this.state.showFromNewest,
     showFromNewest: elementVal === 'showFromNewest' && this.state.showFromOldest ? true : this.state.showFromOldest,
     // showFromOldest: elementVal === 'showFromOldest' && this.state.showFromNewest ? true : oldestBool,
     // showFromNewest: elementVal === 'showFromNewest' && this.state.showFromOldest ? true : newestBool,
     showRentalContracts: elementVal === 'showRentalContracts' && this.state.showImportantPoints ? !this.state.showRentalContracts : this.state.showRentalContracts,
     showImportantPoints: elementVal === 'showImportantPoints' && this.state.showRentalContracts ? !this.state.showImportantPoints : this.state.showImportantPoints,
     showStandardDocuments: elementVal === 'showStandardDocuments' ? true : this.state.showStandardDocuments,
   }, () => {
     // If user clicks showByFlat, add addEventListener for closing the box
     // show
     if (elementVal === 'showByFlat') {
       window.addEventListener('click', this.handleCloseFlatSelectionBox);
       window.addEventListener('keydown', this.handleCloseFlatSelectionBox);
       const flatSelectionBoxArray = document.getElementsByClassName('flat-selection-box-container')
       if (this.state.showFlatSelectionBox) flatSelectionBoxArray[0].style.display = 'block';
     }

     let {
       showAll,
       showFlatSelectionBox,
       selectedFlatId,
       showByBooking,
       showRentalContracts,
       showImportantPoints,
       showStandardDocuments
     } = this.state;

     // If user clicks show all and showAll is true, false and null out flat state
     if (elementVal === 'showAll' && this.state.showAll) {
        showFlatSelectionBox = false;
        selectedFlatId = null;
        showRentalContracts = true;
        showImportantPoints = true;
        showStandardDocuments = false;
     }
     // If selectedFlatId is not null, showAll is always false
     // If showRentalContracts and showImportantPoints turn showAll true
     if (showRentalContracts && showImportantPoints && !showAll && !selectedFlatId && !showStandardDocuments) {
       showAll = true;
     } else if (selectedFlatId && showAll) {
       // turn showAll false if there is a flatid and showall is true
       showAll = false;
     }

     if (elementVal === 'showStandardDocuments') {
       showAll = false;
       selectedFlatId = null;
       showFlatSelectionBox = false;
       showByBooking = false;
     }

     if (showFlatSelectionBox || showAll || showByBooking) {
       showStandardDocuments = false;
     }

     this.setState({
       showAll,
       showFlatSelectionBox,
       selectedFlatId,
       showByBooking,
       showRentalContracts,
       showImportantPoints,
       showStandardDocuments,
     }, () => {
       // Code for getting subset of agreements based on state set above
       console.log('in SelectExistingDocumentModal, handleSelectionButtonClick, this.state ', this.state);

       this.treatAgreementsObject();
     });
   });
  }

  renderButtons() {
    const { appLanguageCode } = this.props;
    const buttonObjectTop = {
      // showByFlat button gets grayed when 1) there is a flat selected, and 2) when the box is open; Hover is in CSS style
      showByFlat: { stateStyleKey: 'selectedFlatId', selectedKey: '', showBoxKey: 'showFlatSelectionBox' },
      showByBooking: { stateStyleKey: '' },
      showAll: { stateStyleKey: '' },
      showFromOldest: { stateStyleKey: '' },
      showFromNewest: { stateStyleKey: '' },
    };

    const middleObjectBottom = {
      // showByFlat button gets grayed when 1) there is a flat selected, and 2) when the box is open; Hover is in CSS style
      showStandardDocuments: { stateStyleKey: '' },
    };

    const buttonObjectBottom = {
      // showByFlat button gets grayed when 1) there is a flat selected, and 2) when the box is open; Hover is in CSS style
      showRentalContracts: { stateStyleKey: '' },
      showImportantPoints: { stateStyleKey: '' },
    };

    const renderEachButton = (buttonObject) => {
      return _.map(Object.keys(buttonObject), eachButtonKey => {
        return (
          <div
            className="select-existing-document-button-each"
            id={`selection-button-${eachButtonKey}`}
            value={eachButtonKey}
            key={eachButtonKey}
            onClick={this.handleSelectionButtonClick}
            style={this.state[buttonObject[eachButtonKey].stateStyleKey] || this.state[eachButtonKey] || this.state[buttonObject[eachButtonKey].showBoxKey] ? { color: 'gray', borderBottom: 'solid 1.2px gray' } : null}
          >
            {AppLanguages[eachButtonKey][appLanguageCode]}
          </div>
        );
      });
    };

    return (
      <div className="select-existing-document-button-container">
        <div className="select-existing-document-button-container-sub">
         {renderEachButton(buttonObjectTop)}
        </div>
         {!this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
           ?
           <div className="select-existing-document-button-container-sub select-existing-document-button-container-sub-bottom">
            {renderEachButton(middleObjectBottom)}
           </div>
           :
           null}
         {!this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
           ?
           <div className="select-existing-document-button-container-sub select-existing-document-button-container-sub-bottom">
            {renderEachButton(buttonObjectBottom)}
           </div>
           :
           null}
        {this.state.showFlatSelectionBox ? this.renderFlatSelectionBox() : ''}
      </div>
    );
  }

  handleAddExistingAgreementsClick() {
    // use word agreements to accord with agreements model in api
    const newAgreementNameByIdObject = {}
    _.each(this.state.selectedDocumentsArray, eachAgreementId => {
      newAgreementNameByIdObject[eachAgreementId] = `copy of ${this.props.allUserAgreementsMapped[eachAgreementId].document_name}`;
    });

    this.setState({ showNameAgreementsSubModal: true,
                    newAgreementNameByIdObject
                  });
  }

  renderEachThumbnail() {
    return _.map(this.state.selectedDocumentsArray, eachId => {
      const document = this.props.allUserAgreementsMapped[eachId];
      return (
        <div className="select-existing-document-thumbnail-each" key={document.id}>
          <div className="select-existing-document-thumbnail-each-left">{document.document_name}</div>
          <i
            className="fas fa-times select-existing-document-thumbnail-each-right"
            onClick={this.handleDocumentCheck}
            value={document.id}
          ></i>
        </div>
      );
    });
  }

  renderSelectedDocumentsThumbnail() {
    return (
      <div
        className="select-existing-document-thumbnail-container"
      >
        {this.renderEachThumbnail()}
      </div>
    );
  }

  renderExistingDocumentsMain() {
    // const { handleSubmit } = this.props;
    // if (this.props.flat) {
    console.log('in SelectExistingDocumentModal, renderExistingDocumentsMain, this.props.importFieldsFromOtherDocumentsObject.baseAgreementId, this.props.getFieldValues ', this.props.importFieldsFromOtherDocumentsObject.baseAgreementId, this.props.getFieldValues);
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // <section className="modal-main">
    const title = this.props.getFieldValues ? 'selectDocumentForFlat' : 'selectDocumentForFieldValues';
    const copiedMessage = this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length > 0
                          ? `${this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length} field${this.props.importFieldsFromOtherDocumentsObject.fieldsArray.length > 1 ? 's' : ''} copied to clipboard`
                          :
                          '';
    return (
      <div
        className={showHideClassName}
        style={this.state.shrinkModal ? { background: 'transparent',
                                          pointerEvents: 'none'
                                         } : null}
      >
        <section
          className={`modal-main ${this.state.shrinkModal ? 'shrink-modal-main' : ''}`}
          style={{ pointerEvents: 'auto' }}
        >

          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title select-existing-document-title">{AppLanguages[title][this.props.appLanguageCode]}</h3>
          {this.state.shrinkModal
            ?
            <div className="select-existing-document-control-and-message">
              <div className="select-existing-document-message"></div>
              <div className="select-existing-document-control">
                <i
                className="fas fa-expand expand-modal-main-icon"
                onClick={this.handleAgreementShowClick}
                ></i>
              </div>
              <div className="select-existing-document-message">
                {copiedMessage}
              </div>
            </div>
            :
            ''}

          {this.renderButtons()}
          <div className="select-existing-document-scroll-div">
            {this.renderAlert()}
            {this.props.allUserAgreementsArray ? this.renderExistingDocuments() : this.indicateLoading()}
            {this.renderSelectedDocumentsThumbnail()}
            {
              !this.props.getFieldValues && !this.props.importFieldsFromOtherDocumentsObject.baseAgreementId
              ?
              <div
                className="btn btn-primary select-existing-document-add-button"
                onClick={this.state.selectedDocumentsArray.length > 0 ? this.handleAddExistingAgreementsClick : null}
                style={this.state.selectedDocumentsArray.length > 0 ? null : { backgroundColor: 'lightgray', border: 'solid 1px #ccc'}}
              >
                {AppLanguages.addAgreementToFlat[this.props.appLanguageCode]}
              </div>
              :
              null
            }
          </div>

        </section>
      </div>
    );
    // }
  }

  setBlankInputElementArray(agreementId, emptyBool, index) {
    const blankInputElementArray = [...this.state.blankInputElementArray];
    // const elementId = `${agreementId},${this.props.allUserAgreementsMapped[agreementId].document_name}`
    // const blankInputElement = document.getElementById()
    // const index = this.state.blankInputElementArray.indexOf(agreementId);
    // if id is not in the array and the field is blank, push into array
    if (index === -1 && emptyBool) blankInputElementArray.push(agreementId);
    // if id is in the array and the field is not empty, take the id out
    if (index !== -1 && !emptyBool) blankInputElementArray.splice(index, 1);

    this.setState({ blankInputElementArray }, () => {
      console.log('in SelectExistingDocumentModal, setBlankInputElementArray, this.state.blankInputElementArray, agreementId ', this.state.blankInputElementArray, agreementId);
    });
  }

  addExistingAgreements(newAgreementNameByIdObject) {
    this.props.addExistingAgreements({
      agreementIdObject: newAgreementNameByIdObject,
      // agreementIdArray: this.state.selectedDocumentsArray,
      flatId: this.props.editFlat ? this.props.flat.id : null,
      bookingId: this.props.editFlat ? null : this.props.booking.id,
      fromEditFlat: this.props.editFlat,
      callback: () => this.addExistingAgreementsCallback()
    });
    this.props.showLoading();
  }

  handleNameChangeAddClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');

    if (elementVal === 'add') {
      // If there is something in new agreement by id objecg and there are
      // no blank inputs, call action
      if (!_.isEmpty(this.state.newAgreementNameByIdObject) && this.state.blankInputElementArray.length === 0) this.addExistingAgreements(this.state.newAgreementNameByIdObject);

    } else {
      // close name agreement submodal if click on cancel
      this.setState({ showNameAgreementsSubModal: false })
    }
  }

  handleDocumentNameInputChange(event) {
    const changedElement = event.target;
    const agreementId = parseInt(changedElement.getAttribute('id'), 10);
    console.log('in SelectExistingDocumentModal, handleDocumentNameInputChange, event.target, event.target.getAttribute(id), event.target.value ', event.target, event.target.getAttribute('id'), event.target.value);
    const newObject = { ...this.state.newAgreementNameByIdObject, [agreementId]: changedElement.value }
    this.setState({ newAgreementNameByIdObject: newObject }, () => {
      const index = this.state.blankInputElementArray.indexOf(agreementId)
      if (changedElement.value === '' && index === -1) {
        this.setBlankInputElementArray(agreementId, true, index);
      } else if (index !== -1) {
        this.setBlankInputElementArray(agreementId, false, index);
      }
    });
  }

  renderEachDocumentNameInput() {
    let documentName = null;
    let elementId = '';
    return _.map(this.state.selectedDocumentsArray, eachAgreementId => {

      documentName = this.props.allUserAgreementsMapped[eachAgreementId].document_name;
      elementId = `${eachAgreementId},${documentName}`

      return (
        <li key={eachAgreementId} className="select-existing-document-modal-name-agreement-sub-modal-scroll-each">
          <div className="select-existing-document-modal-name-agreement-sub-modal-scroll-each-original">
            {documentName}
          </div>
          <input
            id={eachAgreementId}
            type="text"
            name="eachAgreementId"
            value={this.state.newAgreementNameByIdObject[eachAgreementId]}
            onChange={this.handleDocumentNameInputChange}
            className="select-existing-document-modal-name-agreement-sub-modal-scroll-each-new"
            style={this.state.blankInputElementArray.indexOf(eachAgreementId) !== -1 ? { border: '2px solid red' } : null}
          />
        </li>);
    });
  }

  renderNameAgreementSubModal() {
    // Parent div is used to center the submodal on page
    return (
      <div className="select-existing-document-modal-name-agreement-sub-modal-centering-div">
        <div className="select-existing-document-modal-name-agreement-sub-modal">
          <div className="select-existing-document-modal-name-agreement-sub-modal-title">
            Name Added Document
          </div>

          <ul className="select-existing-document-modal-name-agreement-sub-modal-scroll">
            {this.renderEachDocumentNameInput()}
          </ul>


          <div className="select-existing-document-modal-name-agreement-sub-modal-buttons-box-error">
          {this.state.blankInputElementArray.length > 0 ? 'Please fill in a name for the document' : ''}
          </div>

          <div className="select-existing-document-modal-name-agreement-sub-modal-buttons-box">
            <div
              className="btn select-existing-document-modal-name-agreement-sub-modal-buttons-box-cancel"
              onClick={this.handleNameChangeAddClick}
              value="cancel"
            >
              Cancel
            </div>
            <div
              className="btn select-existing-document-modal-name-agreement-sub-modal-buttons-box-add"
              onClick={this.state.blankInputElementArray.length > 0 ? null : this.handleNameChangeAddClick}
              style={this.state.blankInputElementArray.length > 0 ? { backgroundColor: 'lightgray' } : null}
              value="add"
              // type="submit"
            >
              Add
            </div>

          </div>
        </div>
      </div>
    );
  }


  renderPostActionMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div
        className={showHideClassName}
        // style={this.props.importFieldsFromOtherDocuments ? { pointerEvents: 'none' } : {}}
      >
        <div
          className="modal-main"
        >
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-action-message">{AppLanguages.selectDocumentCompleted[this.props.appLanguageCode]}</div>
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.selectExistingDocumentCompleted ? this.renderPostActionMessage() : this.renderExistingDocumentsMain()}
        {this.state.showNameAgreementsSubModal ? this.renderNameAgreementSubModal() : null}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
SelectExitingDocumentModal = reduxForm({
  form: 'SelectExitingDocumentModal',
  enableReinitialize: true
})(SelectExitingDocumentModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in SelectExitingDocumentModal, mapStateToProps, state: ', state);
    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // languages: state.languages,
      showFacilityCreate: state.modals.showSelectExitingDocumentModal,
      appLanguageCode: state.languages.appLanguageCode,
        // allUserAgreementsMapped is all agreements mapped by agreeement id
      allUserAgreementsMapped: state.documents.allUserAgreementsMapped,
      // agreementsByFlatMapped contains all agreements mapped to flat regardless of use in booking
      allUserFlatsMapped: state.flats.flatsByUser,
      // userFlatBookingsMapped is all bookings for user's flat with agreeemnts attached
      allBookingsForUserFlatsMapped: state.documents.allBookingsForUserFlatsMapped,
      allBookingsForUserFlatsArray: state.documents.allBookingsForUserFlatsArray,
      // all agreements, flats and bookings array have date objects for created_at and updated_at
      allUserAgreementsArray: state.documents.allUserAgreementsArray,
      // allUserAgreementsArrayMapped same as allUserAgreementsArray with date objects but mapped
      allUserAgreementsArrayMapped: state.documents.allUserAgreementsArrayMapped,
      allUserFlatsArray: state.documents.allUserFlatsArray,
      allBookingsForUserFlats: state.documents.allBookingsForUserFlats,
      fieldValueDocumentObject: state.documents.fieldValueDocumentObject,
      showGetFieldValuesChoice: state.modals.showGetFieldValuesChoiceModal,
      selectedFieldObject: state.documents.selectedFieldObject,
      templateElements: state.documents.templateElements,
      valuesInForm: state.form.CreateEditDocument && state.form.CreateEditDocument.values ? state.form.CreateEditDocument.values : {},
      allDocumentObjects: state.documents.allDocumentObjects,
      documentConstants: state.documents.documentConstants,
      // importFieldsFromOtherDocuments: state.documents.importFieldsFromOtherDocuments,
      importFieldsFromOtherDocumentsObject: state.documents.importFieldsFromOtherDocumentsObject,
      grayOutBackgroundProp: state.auth.grayOutBackgroundProp,
      cachedInitialValuesObject: state.documents.cachedInitialValuesObject,
    };
  }


export default connect(mapStateToProps, actions)(SelectExitingDocumentModal);
