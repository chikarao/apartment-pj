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
      showByFlat: false,
      showByBooking: false,
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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

  renderEachDocument() {
    const { allUserAgreementsMapped } = this.props;
    return _.map(allUserAgreementsMapped, eachAgreement => {
      return (
        <div
          className="select-existing-document-each-document-box"
          key={eachAgreement.id}
          value={eachAgreement.id}
        >
          {eachAgreement.document_name}
        </div>
      );
    });
  }

  renderExistingDocuments() {
    return (
      <div
        className="select-existing-document-main-scroll-box"
      >
        {this.renderEachDocument()}
      </div>
    );
  }

  renderButtons() {
    const { appLanguageCode } = this.props;
    const buttonArray = ['byFlat', 'byBooking', 'showAll', 'oldest', 'newest'];
    const renderEachButton = () => {
      return _.map(buttonArray, eachButton => {
        return (
          <div
            className="select-existing-document-button-each"
            value={eachButton}
          >
            {AppLanguages[eachButton][appLanguageCode]}
          </div>
        );
      });
    };

    return (
      <div className="select-existing-document-button-container">
        {renderEachButton()}
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
    };
  }


export default connect(mapStateToProps, actions)(SelectExitingDocumentModal);
