import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import AppLanguages from '../constants/app_languages';
import getDocumentFieldsWithSameName from '../functions/get_document_fields_with_same_name';

let showHideClassName;

class SelectExitingDocumentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAllDocuments: true,
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
      selectedAgreementId: null
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
  }

  componentDidMount() {
    const showLoading = () => this.props.showLoading();
    console.log('in SelectExitingDocumentModal, componentDidMount, this.props: ', this.props);
    // send showLoading twice to
    // const loading = !this.props.getFieldValues ? showLoading : () => { this.setState({ loadingMessage: !this.state.loadingMessage }); };
    this.props.fetchUserAgreements(showLoading);
    // if (this.props.getFieldValues) this.props.fetchUserAgreements(showLoading);
  }
  // Not yet used
  // componentDidUpdate(prevProps, prevState) {
    // if ((prevProps.showGetFieldValuesChoice !== this.props.showGetFieldValuesChoice) && this.props.showGetFieldValuesChoice) {
    //   window.addEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
    // }
    // if (prevState.showFromNewest !== this.state.showFromNewest
    //     ||
    //     prevState.showByBooking !== this.state.showByBooking
    //     ||
    //     prevState.selectedFlatId !== this.state.selectedFlatId
    //     ||
    //     prevState.showImportantPoints !== this.showImportantPoints
    //   ) {
    //     console.log('in SelectExitingDocumentModal, componentDidUpdate, prevState, this.state: ', prevState, this.state);
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
    if (this.props.showGetFieldValuesChoice) this.props.showGetFieldValuesChoiceModal(() => {});
    if (this.state.shrinkModal) {
      this.props.setTemplateElementsObject({
        templateElements: {},
        templateElementsByPage: {},
        templateTranslationElements: {},
        templateTranslationElementsByPage: {}
      });
      this.props.setAgreementId(null, false);
    }
  }

  addExistingAgreementsCallback() {
    console.log('in SelectExitingDocumentModal, addExistingAgreementsCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ selectExistingDocumentCompleted: true });
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
    console.log('in SelectExitingDocumentModal, handleClose, this.props.showFacilityCreate: ', this.props.showFacilityCreate);
    if (this.props.show) {
      const callback = this.props.getFieldValues ? () => { this.props.showSelectExistingDocumentModalForGetFieldValues(); } : () => {}
      this.props.showSelectExistingDocumentModal(callback);
      this.setState({ selectExistingDocumentCompleted: false });
    }
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
      // console.log('in select_exiting_document, handleDocumentCheck, checkedElement, elementVal, this.state.selectedDocumentsArray: ', checkedElement, elementVal, this.state.selectedDocumentsArray);
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

  handleCloseGetFieldValuesChoiceBox(event) {
    // Get updated object with attributes about selected elements
    // updated with new values in form

    const clickedElement = event.target;

    const clickedOnModal = clickedElement.className.indexOf('get-field-value-choice-modal') !== -1;
    const clickedOnAgreementEach = clickedElement.className.indexOf('select-existing-document-each-document') !== -1;
    // If user clicks on something other than a document or a getFieldValues modal element
    // close the modal, and do clean up
    if (!clickedOnModal && !clickedOnAgreementEach) {
      // When user closes the showGetFieldValuesChoiceModal, get a new setSelectedFieldObject
      // to reflect the new value in the form
      // this.props.setSelectedFieldObject(this.getUpdatedSelectedFieldObject());
      // Switch off modal show
      this.props.showGetFieldValuesChoiceModal(() => {});
      window.removeEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
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
      this.setState({ selectedAgreementId: elementVal }, () => {
        const selectedAgreement = this.props.allUserAgreementsMapped[elementVal];
        // const templateElement = this.props.templateElements[parseInt(elementVal, 10)]
        // const fieldObject = this.props.showGetFieldValuesChoice ? this.getUpdatedSelectedFieldObject() : getDocumentFieldsWithSameName(selectedAgreement.document_fields);
        const fieldObject = getDocumentFieldsWithSameName({ documentFields: selectedAgreement.document_fields, selectedFieldObject: this.props.selectedFieldObject, valuesInForm: this.props.valuesInForm });
        // If not open, open the modal
        // addEventListener is called in componentDidUpdate
        if (!this.props.showGetFieldValuesChoice) {
          this.props.showGetFieldValuesChoiceModal(() => {});
          console.log('in select_exiting_document, handleGetFieldValuesForAgreementClick, this.handleCloseGetFieldValuesChoiceBox, typeof this.handleCloseGetFieldValuesChoiceBox: ', this.handleCloseGetFieldValuesChoiceBox, typeof this.handleCloseGetFieldValuesChoiceBox);
          window.addEventListener('click', this.handleCloseGetFieldValuesChoiceBox);
        }
        // call action to set state.documents.fieldValueDocumentObject to be used in showGetFieldValuesChoiceModal
        this.props.setGetFieldValueDocumentObject({ agreement: selectedAgreement, fieldObject: fieldObject.object, differentValuesExist: fieldObject.differentValuesExist });
        console.log('in select_exiting_document, handleGetFieldValuesForAgreementClick, clickedElement, selectedAgreement, this.props.selectedFieldObject, fieldObject: ', clickedElement, selectedAgreement, this.props.selectedFieldObject, fieldObject);
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
      if (clickedAgreementId) this.props.setAgreementId(clickedAgreementId, true);
      // console.log('in select_exiting_document, handleAgreementShowClick, clickedElement, currentElement, this.state.shrinkModal, this.state.agreementId: ', clickedElement, currentElement, this.state.shrinkModal, this.state.agreementId);
      // empty out agreement and other element related objects to be sent to CreateEditDocument.
      if (userClickedExpand) {
        this.props.setAgreementId(null, false);
        this.props.setTemplateElementsObject({
          templateElements: {},
          templateElementsByPage: {},
          templateTranslationElements: {},
          templateTranslationElementsByPage: {}
        });
      }
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
                Last updated: {`${eachAgreement.updated_at.getMonth() + 1}/${eachAgreement.updated_at.getDate()}/${eachAgreement.updated_at.getFullYear()}`}
              </div>
            </div>
            <div
              className="select-existing-document-each-document-top-box-right"
            >
              {this.props.getFieldValues
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
      const tenant = this.props.allBookingsForUserFlatsMapped[eachBooking.id] && this.props.allBookingsForUserFlatsMapped[eachBooking.id].user ? this.props.allBookingsForUserFlatsMapped[eachBooking.id].user : null;
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
    // Render top box for agreement and booking;
    // Render bottom box only if there are agreements attached to bookings when showByBooking true
    // console.log('in select_exiting_document, renderEachDocument, agreementsTreatedArray, this.state.showByBooking: ', agreementsTreatedArray, this.state.showByBooking);
    return _.map(agreementsTreatedArray, each => {
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
    });
  }

  renderExistingDocuments() {
    const { allUserAgreementsArray } = this.props;
    const agreementsTreatedArray = this.state.agreementsTreatedArray ? this.state.agreementsTreatedArray : allUserAgreementsArray;
    console.log('in SelectExistingDocumentModal, renderExistingDocuments, agreementsTreatedArray, allUserAgreementsArray ', agreementsTreatedArray, allUserAgreementsArray);
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
    console.log('in SelectExistingDocumentModal, treatAgreementsObject, this.state, allUserAgreementsArray, this.state.agreementsTreatedArray,  ', this.state, this.props.allUserAgreementsArray, this.state.agreementsTreatedArray);
    const agreementsTreatedArray = [];

    if (!this.state.showByBooking) {

      const filterAgreements = () => {

        _.each(this.props.allUserAgreementsArray, eachAgreement => {
          const addAgreement = this.state.selectedFlatId === null || (this.state.selectedFlatId === eachAgreement.flat_id)
          if (addAgreement && this.state.showRentalContracts && eachAgreement.template_file_name === 'fixed_term_rental_contract_bilingual') agreementsTreatedArray.push(eachAgreement)
          if (addAgreement && this.state.showImportantPoints && eachAgreement.template_file_name === 'important_points_explanation_bilingual') agreementsTreatedArray.push(eachAgreement)
          // if (this.state.selectedFlatId && eachAgreement.flat_id === this.state.selectedFlatId) agreementsTreatedArray.push(eachAgreement)
        });
      };

      filterAgreements();
      // Sort by date updated_at;
      // allUserAgreementsArray has date objects created in the reducer for updated_at
      if (this.state.showFromOldest) agreementsTreatedArray.sort((a, b) => b.updated_at - a.updated_at);
      if (this.state.showFromNewest) agreementsTreatedArray.sort((a, b) => a.updated_at - b.updated_at);
    } else {
        let agreementsArray = null;
        let bookingObject = null;
      _.each(this.props.allBookingsForUserFlatsArray, eachBooking => {
        // Go through the booking adding process only if there is no flat selected or for flat that is selected
        if (this.state.selectedFlatId === null || (this.state.selectedFlatId === eachBooking.flat_id)) {
          bookingObject = {};
          bookingObject.id = eachBooking.id;
          bookingObject.date_start = eachBooking.date_start;
          bookingObject.user = this.props.allBookingsForUserFlatsMapped[eachBooking.id].user
          agreementsArray = [];
          _.each(this.props.allBookingsForUserFlatsMapped[eachBooking.id].agreements, eachAgreement => {
            if (this.state.showImportantPoints && eachAgreement.template_file_name === 'important_points_explanation_bilingual') agreementsArray.push(this.props.allUserAgreementsArrayMapped[eachAgreement.id])
            if (this.state.showRentalContracts && eachAgreement.template_file_name === 'fixed_term_rental_contract_bilingual') agreementsArray.push(this.props.allUserAgreementsArrayMapped[eachAgreement.id])
          });
          bookingObject.agreements = agreementsArray;
          // Add booking to array only if there are agreements in the bookingObject array
          if (bookingObject.agreements.length > 0) agreementsTreatedArray.push(bookingObject);
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
    let newestBool = this.state.showFromNewest;
    let oldestBool = this.state.showFromOldest;
    if (elementVal === 'showFromOldest' || elementVal === 'showFromNewest') {
      if (elementVal === 'showFromOldest') newestBool = !newestBool;
      if (elementVal === 'showFromNewest') oldestBool = !oldestBool;
    }

   this.setState({
     showFlatSelectionBox: elementVal === 'showByFlat' ? !this.state.showFlatSelectionBox : this.state.showFlatSelectionBox,
     // When user clicks showAll and showAll is false, turn true
     showAll: elementVal === 'showAll' ? true : this.state.showAll,
     // showAll: elementVal === 'showAll' && !this.state.showAll ? true : this.state.showAll,
     showByBooking: elementVal === 'showByBooking' ? !this.state.showByBooking : this.state.showByBooking,
     showFromOldest: elementVal === 'showFromOldest' && this.state.showFromNewest ? true : oldestBool,
     showFromNewest: elementVal === 'showFromNewest' && this.state.showFromOldest ? true : newestBool,
     showRentalContracts: elementVal === 'showRentalContracts' && this.state.showImportantPoints ? !this.state.showRentalContracts : this.state.showRentalContracts,
     showImportantPoints: elementVal === 'showImportantPoints' && this.state.showRentalContracts ? !this.state.showImportantPoints : this.state.showImportantPoints,
   }, () => {
     // If user clicks showByFlat, add addEventListener for closing the box
     // show
     if (elementVal === 'showByFlat') {
       window.addEventListener('click', this.handleCloseFlatSelectionBox);
       window.addEventListener('keydown', this.handleCloseFlatSelectionBox);
       const flatSelectionBoxArray = document.getElementsByClassName('flat-selection-box-container')
       if (this.state.showFlatSelectionBox) flatSelectionBoxArray[0].style.display = 'block';
     }

     let showAll = this.state.showAll;
     let showFlatSelectionBox = this.state.showFlatSelectionBox;
     let selectedFlatId = this.state.selectedFlatId;
     let showRentalContracts = this.state.showRentalContracts;
     let showImportantPoints = this.state.showImportantPoints;

     // If user clicks show all and showAll is true, false and null out flat state
     if (elementVal === 'showAll' && this.state.showAll) {
        showFlatSelectionBox = false;
        selectedFlatId = null;
        showRentalContracts = true;
        showImportantPoints = true;
     }
     // If selectedFlatId is not null, showAll is always false
     // If showRentalContracts and showImportantPoints turn showAll true
     if (showRentalContracts && showImportantPoints && !showAll && !selectedFlatId) {
       showAll = true;
     } else if (selectedFlatId && showAll) {
       // turn showAll false if there is a flatid and showall is true
       showAll = false;
     }

     this.setState({
       showAll,
       showFlatSelectionBox,
       selectedFlatId,
       showRentalContracts,
       showImportantPoints,
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
      showFromNewest: { stateStyleKey: '' }
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
        <div className="select-existing-document-button-container-sub select-existing-document-button-container-sub-bottom">
         {renderEachButton(buttonObjectBottom)}
        </div>
        {this.state.showFlatSelectionBox ? this.renderFlatSelectionBox() : ''}
      </div>
    );
  }

  handleAddExistingAgreementsClick() {
    console.log('in SelectExistingDocumentModal, handleAddExistingAgreementsClick, this.state.selectedDocumentsArray, this.props.editFlat ', this.state.selectedDocumentsArray, this.props.editFlat);
    this.props.addExistingAgreements({
      agreementIdArray: this.state.selectedDocumentsArray,
      flatId: this.props.flat.id,
      bookingId: this.props.editFlat ? null : this.props.booking.id,
      fromEditFlat: this.props.editFlat,
      callback: () => this.addExistingAgreementsCallback()
    });
    this.props.showLoading();
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
      console.log('in SelectExistingDocumentModal, renderExistingDocumentsMain, this.props.show, this.props.getFieldValues ', this.props.show, this.props.getFieldValues);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // <section className="modal-main">
      const title = this.props.getFieldValues ? 'selectDocumentForFlat' : 'selectDocumentForFieldValues'
      return (
        <div
          className={showHideClassName}
          style={this.state.shrinkModal ? { background: 'transparent' } : null}
        >
          <section className={`modal-main ${this.state.shrinkModal ? 'shrink-modal-main' : ''}`}>

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">{AppLanguages[title][this.props.appLanguageCode]}</h3>
            {this.state.shrinkModal
              ?
              <i
                className="fas fa-expand expand-modal-main-icon"
                onClick={this.handleAgreementShowClick}
              ></i>
              :
              ''}
            {this.renderButtons()}
            {this.renderSelectedDocumentsThumbnail()}
            <div className="edit-profile-scroll-div">
              {this.renderAlert()}
              {this.props.allUserAgreementsArray ? this.renderExistingDocuments() : this.indicateLoading()}
              {
                !this.props.getFieldValues
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


  renderPostActionMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
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
    };
  }


export default connect(mapStateToProps, actions)(SelectExitingDocumentModal);
