import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import AppLanguages from '../constants/app_languages';

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
      selectedAgreementsArray: [],
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleSelectionButtonClick = this.handleSelectionButtonClick.bind(this);
    this.handleCloseFlatSelectionBox = this.handleCloseFlatSelectionBox.bind(this);
    this.handleFlatSelectionClick = this.handleFlatSelectionClick.bind(this);
    this.handleAgreementCheck = this.handleAgreementCheck.bind(this);
    this.handleAddAgreementsClick = this.handleAddAgreementsClick.bind(this);
  }

  componentDidMount() {
    const showLoading = () => this.props.showLoading();
    this.props.fetchUserAgreements(showLoading, showLoading);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showFromNewest !== this.state.showFromNewest
        ||
        prevState.showByBooking !== this.state.showByBooking
        ||
        prevState.selectedFlatId !== this.state.selectedFlatId
        ||
        prevState.showImportantPoints !== this.showImportantPoints
      ) {
        console.log('in SelectExitingDocumentModal, componentDidUpdate, prevState, this.state: ', prevState, this.state);
      }
  }

  handleFormSubmit(data) {
    // !!!!only persist first 4 characters of account number
    // console.log('in edit flat, handleFormSubmit, data.account_number, data.account_number.slice(0, 4);: ', data.account_number, data.account_number.slice(0, 4));
    // const dataToBeChanged = data;
    // dataToBeChanged.flat_id = this.props.flat.id;
    // const dataToBeSent = { facility: dataToBeChanged };
    // // send all data for account; gets assigned user_id on api based on token
    // console.log('in SelectExitingDocumentModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    // this.props.showLoading();
    // this.props.createFacility(dataToBeSent, () => {
    //   this.handleFormSubmitCallback();
    // });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleCloseFlatSelectionBox);
  }

  handleFormSubmitCallback() {
    console.log('in SelectExitingDocumentModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    // this.setState({ selectExistingDocumentCompleted: true });
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
      this.props.showSelectExistingDocumentModal();
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

    const clickedFlatId = parseInt(currentElement.getAttribute('value'), 10)

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

    if (array.indexOf(clickedElement.className) === -1) {
      const flatSelectionBoxArray = document.getElementsByClassName('flat-selection-box-container');
      flatSelectionBoxArray[0].style.display = 'none';
      this.setState({
        showFlatSelectionBox: !this.state.showFlatSelectionBox
      }, () => {
        window.removeEventListener('click', this.handleCloseFlatSelectionBox);
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

  handleAgreementCheck(event) {
    const checkedElement = event.target;
    const elementVal = checkedElement.getAttribute('value')
    const selectedAgreementsArray = [...this.state.selectedAgreementsArray];
    const index = selectedAgreementsArray.indexOf(parseInt(elementVal, 10))

    if (index === -1) {
      selectedAgreementsArray.push(parseInt(elementVal, 10));
    } else {
      selectedAgreementsArray.splice(index, 1);
    }

    this.setState({ selectedAgreementsArray }, () => {
      console.log('in select_exiting_document, handleAgreementCheck, checkedElement, elementVal, this.state.selectedAgreementsArray: ', checkedElement, elementVal, this.state.selectedAgreementsArray);
    })
  }

  renderEachDocument(agreementsTreatedArray) {
    return _.map(agreementsTreatedArray, eachAgreement => {
      return (
        <li
          className="select-existing-document-each-document-box"
          key={eachAgreement.id}
          value={eachAgreement.id}
        >
          <div
            className="select-existing-document-each-document-top-box"
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
                Last updated: {`${eachAgreement.updated_at.getMonth()}/${eachAgreement.updated_at.getDay()}/${eachAgreement.updated_at.getFullYear()}`}
              </div>
            </div>
            <div
              className="select-existing-document-each-document-top-box-right"
            >
              <input type="checkbox" value={eachAgreement.id} onChange={this.handleAgreementCheck}/>
            </div>
          </div>

          <div
            className="select-existing-document-each-document-bottom-box"
          >
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

  treatAgreementsObject() {
    console.log('in SelectExistingDocumentModal, treatAgreementsObject, this.state, allUserAgreementsArray, this.state.agreementsTreatedArray,  ', this.state, this.props.allUserAgreementsArray, this.state.agreementsTreatedArray);
    const agreementsTreatedArray = [];

    const filterAgreements = () => {
      _.each(this.props.allUserAgreementsArray, eachAgreement => {
        const addAgreement = this.state.selectedFlatId === null || (this.state.selectedFlatId === eachAgreement.flat_id)
        if (addAgreement && this.state.showRentalContracts && eachAgreement.template_file_name === 'fixed_term_rental_contract_bilingual') agreementsTreatedArray.push(eachAgreement)
        if (addAgreement && this.state.showImportantPoints && eachAgreement.template_file_name === 'important_points_explanation_bilingual') agreementsTreatedArray.push(eachAgreement)
        // if (this.state.selectedFlatId && eachAgreement.flat_id === this.state.selectedFlatId) agreementsTreatedArray.push(eachAgreement)
      });
    }

    filterAgreements();
    // Sort by date updated_at;
    // allUserAgreementsArray has date objects created in the reducer for updated_at
    if (this.state.showFromOldest) agreementsTreatedArray.sort((a, b) => b.updated_at - a.updated_at)
    if (this.state.showFromNewest) agreementsTreatedArray.sort((a, b) => a.updated_at - b.updated_at)

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
       // Code for getting subset of agreements
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

  handleAddAgreementsClick() {
    console.log('in SelectExistingDocumentModal, handleAddAgreementsClick, this.state.selectedAgreementsArray ', this.state.selectedAgreementsArray);

  }

  renderExistingDocumentsMain() {
    const { handleSubmit } = this.props;

    // if (this.props.flat) {
      console.log('in SelectExistingDocumentModal, renderExistingDocumentsMain, this.props.show ', this.props.show );
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">{AppLanguages.selectDocumentForFlat[this.props.appLanguageCode]}</h3>
            {this.renderButtons()}
            <div className="edit-profile-scroll-div">
              {this.renderAlert()}
              {this.props.allUserAgreementsArray ? this.renderExistingDocuments() : ''}
              {this.state.selectedAgreementsArray.length > 0
                ?
                <div
                  className="btn btn-primary select-existing-document-add-button"
                  onClick={this.handleAddAgreementsClick}
                >
                  {AppLanguages.addAgreementToFlat[this.props.appLanguageCode]}
                </div>
                :
                <div
                  className="btn btn-primary select-existing-document-add-button"
                  style={{ backgroundColor: 'lightgray', border: 'solid 1px #ccc'}}
                >
                  {AppLanguages.addAgreementToFlat[this.props.appLanguageCode]}
                </div>
              }

            </div>

          </section>
        </div>
      );
    // }
  }


  renderPostEditDeleteMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">{AppLanguages.selectDocumentCompleted[this.props.appLanguageCode]}</div>
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.selectExistingDocumentCompleted ? this.renderPostEditDeleteMessage() : this.renderExistingDocumentsMain()}
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
      allBookingsForUserFlatsMapped: state.documents.allBookingsForUserFlats,
      // all agreements, flats and bookings array have date objects for created_at and updated_at
      allUserAgreementsArray: state.documents.allUserAgreementsArray,
      allUserFlatsArray: state.documents.allUserFlatsArray,
      allBookingsForUserFlats: state.documents.allBookingsForUserFlats,
    };
  }


export default connect(mapStateToProps, actions)(SelectExitingDocumentModal);
