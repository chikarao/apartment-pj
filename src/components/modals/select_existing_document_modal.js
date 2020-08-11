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
      orderByNewest: false,
      orderByOldest: false,
      // showByFlat: false,
      showByBooking: false,
      showAll: true,
      showFromOldest: false,
      showFromNewest: true,
      showFlatSelectionBox: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleSelectionButtonClick = this.handleSelectionButtonClick.bind(this);
    this.handleCloseFlatSelectionBox = this.handleCloseFlatSelectionBox.bind(this);
    this.handleFlatSelectionClick = this.handleFlatSelectionClick.bind(this);
  }

  componentDidMount() {
    const showLoading = () => this.props.showLoading();
    this.props.fetchUserAgreements(showLoading, showLoading);
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
      console.log('in select_exiting_document, handleFlatSelectionClick, this.state.showByFlat, this.state.selectedFlatId: ', this.state.showByFlat, this.state.selectedFlatId);
      this.setState({ showAll: !this.state.selectedFlatId })
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

      const flatSelectionButtonElement = document.getElementById('selection-button-byFlat')
      const modalMainElementArray = document.getElementsByClassName('modal-main')
      // Get the flat selection button dimension so that a control box can be placed below it
      if (flatSelectionButtonElement) flatSelectionButtonDimensions = flatSelectionButtonElement.getBoundingClientRect();
      if (modalMainElementArray[0]) modalMainDimensions = modalMainElementArray[0].getBoundingClientRect();
      const positionWithinModalMain = { top: flatSelectionButtonDimensions.top - modalMainDimensions.top, left: flatSelectionButtonDimensions.left - modalMainDimensions.left  }
      console.log('in select_exiting_document, renderFlatSelectionBox, positionWithinModalMain: ', positionWithinModalMain);

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

  renderEachDocument() {
    const { allUserAgreementsMapped } = this.props;
    return _.map(allUserAgreementsMapped, eachAgreement => {
      return (
        <li
          className="select-existing-document-each-document-box"
          key={eachAgreement.id}
          value={eachAgreement.id}
        >
          <div
            className="select-existing-document-each-document-top-box"
          >
            {eachAgreement.document_name}
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
    return (
      <ul
        className="select-existing-document-main-scroll-box"
      >
        {this.renderEachDocument()}
      </ul>
    );
  }

  handleSelectionButtonClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    let newest = this.state.showFromNewest;
    let oldest = this.state.showFromOldest;
    if (elementVal === 'oldest' || elementVal === 'newest') {
      if (elementVal === 'oldest') newest = !newest;
      if (elementVal === 'newest') oldest = !oldest;
    }

     this.setState({
       showFlatSelectionBox: elementVal === 'byFlat' ? !this.state.showFlatSelectionBox : this.state.showFlatSelectionBox,
       // When user clicks showAll and showAll is false, turn true
       showAll: elementVal === 'showAll' && !this.state.showAll ? true : this.state.showAll,
       showByBooking: elementVal === 'byBooking' ? !this.state.showByBooking : this.state.showByBooking,
       showFromOldest: elementVal === 'oldest' && this.state.showFromNewest ? true : oldest,
       showFromNewest: elementVal === 'newest' && this.state.showFromOldest ? true : newest,
     }, () => {
       // If user clicks byFlat, add addEventListener for closing the box
       // show
       if (elementVal === 'byFlat') {
         window.addEventListener('click', this.handleCloseFlatSelectionBox);
         const flatSelectionBoxArray = document.getElementsByClassName('flat-selection-box-container')
         if (this.state.showFlatSelectionBox) flatSelectionBoxArray[0].style.display = 'block';
       }
       // If user clicks show all and showAll is true, false and null out flat state
       if (elementVal === 'showAll' && this.state.showAll) {
         this.setState({
           showFlatSelectionBox: false,
           selectedFlatId: null,
         });
       }
     });
  }

  renderButtons() {
    const { appLanguageCode } = this.props;
    const buttonObject = {
      // byFlat button gets grayed when 1) there is a flat selected, and 2) when the box is open; Hover is in CSS style
      byFlat: { stateStyleKey: 'selectedFlatId', selectedKey: '', showBoxKey: 'showFlatSelectionBox' },
      byBooking: { stateStyleKey: '', selectedKey: 'showByBooking' },
      showAll: { stateStyleKey: '', selectedKey: 'showAll' },
      oldest: { stateStyleKey: '', selectedKey: 'showFromOldest' },
      newest: { stateStyleKey: '', selectedKey: 'showFromNewest' }
    };
    const renderEachButton = () => {
      return _.map(Object.keys(buttonObject), eachButtonKey => {
        return (
          <div
            className="select-existing-document-button-each"
            id={`selection-button-${eachButtonKey}`}
            value={eachButtonKey}
            key={eachButtonKey}
            onClick={this.handleSelectionButtonClick}
            style={{ color: this.state[buttonObject[eachButtonKey].stateStyleKey] || this.state[buttonObject[eachButtonKey].selectedKey] || this.state[buttonObject[eachButtonKey].showBoxKey]  ? 'gray' : null }}
          >
            {AppLanguages[eachButtonKey][appLanguageCode]}
          </div>
        );
      });
    };

    return (
      <div className="select-existing-document-button-container">
        {renderEachButton()}
        {this.state.showFlatSelectionBox ? this.renderFlatSelectionBox() : ''}
      </div>
    );
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
              {this.props.allUserAgreementsMapped ? this.renderExistingDocuments() : ''}
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
      // userFlatBookingsMapped is all bookings for user's flat with agreeemnts attached
      userFlatBookingsMapped: state.documents.userFlatBookingsMapped,
      // agreementsByFlatMapped contains all agreements mapped to flat regardless of use in booking
      agreementsByUserFlatMapped: state.documents.agreementsByUserFlatMapped,
      allUserFlatsMapped: state.flats.flatsByUser,
      // allUserFlatsMapped: state.documents.allUserFlatsMapped,
    };
  }


export default connect(mapStateToProps, actions)(SelectExitingDocumentModal);
