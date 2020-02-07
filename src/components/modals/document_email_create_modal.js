import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import AppLanguages from '../constants/app_languages';
// import languages from '../constants/languages';

let showHideClassName;

class DocumentEmailCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createDocumentEmailCompleted: false,
      selectedDocumentEmail: '',
      checkedDocumentsArray: [],
      signedDocumentsArray: [],
      unmarkAsSignedDocumentsArray: [],
      markAsSigned: true
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleDocumentSelectCheck = this.handleDocumentSelectCheck.bind(this);
    this.handleUnmarkAsSignedCheck = this.handleUnmarkAsSignedCheck.bind(this);
  }

  componentDidMount() {
    if (this.props.booking.agreements && this.props.signedDocumentsModal) {
      const newArray = [...this.state.signedDocumentsArray];
      // console.log('in DocumentEmailCreateModal, componentDidMount, newArray: ', newArray);
      _.each(this.props.booking.agreements, each => {
        if (each.tenant_signed) {
          newArray.push(each.id);
        }
      });
      this.setState({ signedDocumentsArray: newArray }, () => {
        console.log('in DocumentEmailCreateModal, componentDidMount, this.state.signedDocumentsArray: ', this.state.signedDocumentsArray);
      });
    }
  }

  createEmailAddressArray(emailString) {
    let array = [];
    if (emailString) {
      // array = emailString.split(',');
      array = emailString.split(',').map((each) => {
        // trim extra spaces from before and after emails
        return each.trim();
      });
    }
    return array;
  }

  validateEmail(email) {
    // regex for checking for valid email
    // reference: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  handleFormSubmit(data) {
    // const { code } = data;
    // this.setState({ selectedDocumentEmail: languages[code].name });
    const dataToBeSent = {};
    dataToBeSent.documents_array = this.state.checkedDocumentsArray;
    dataToBeSent.booking_id = this.props.booking.id;
    dataToBeSent.user_id = this.props.booking.user_id;
    dataToBeSent.mark_as_signed = this.state.markAsSigned;

    let emailsValid = true;
    if (!this.props.signedDocumentsModal) {
      dataToBeSent.subject = data.subject;
      dataToBeSent.message = data.message;
      // Create arrays of emails from string of emails
      const ccArray = this.createEmailAddressArray(data.cc);
      const bccArray = this.createEmailAddressArray(data.bcc);
      // validate each email in cc and bcc arrays
      _.each(ccArray, each => {
        emailsValid = this.validateEmail(each);
        // console.log('in DocumentEmailCreateModal, handleFormSubmit, ccArray, each, emailsValid: ', ccArray, each, emailsValid);
        if (!emailsValid) {
          return;
        }
      });

      // validate each email in cc and bcc arrays
      _.each(bccArray, each => {
        emailsValid = this.validateEmail(each);
        // console.log('in DocumentEmailCreateModal, handleFormSubmit, ccArray, each, emailsValid: ', ccArray, each, emailsValid);
        if (!emailsValid) {
          return;
        }
      });

      dataToBeSent.cc_array = ccArray;
      dataToBeSent.bcc_array = bccArray;
    }
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in DocumentEmailCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    if (this.state.checkedDocumentsArray.length > 0 && emailsValid) {
      // if documents checked and all emails valid send to api
      this.props.authError('');
      this.props.showLoading();
      if (!this.props.signedDocumentsModal) {
        this.props.emailDocuments(dataToBeSent, () => {
          this.handleFormSubmitCallback();
        });
      } else {
        this.props.markDocumentsSigned(dataToBeSent, () => {
          this.handleFormSubmitCallback();
        });
      }
    } else {
      if (!emailsValid) {
        // if any emails invalid give error
        // console.log('in DocumentEmailCreateModal, handleFormSubmit, in else if !emailsValid: ', emailsValid);
        this.props.authError('Please check your emails and enter valid email address.');
      } else {
        // if no documents checked give error
        this.props.authError('Please select at least one document by checking it.');
      }
    }
  }

  // emptyInputFields() {
  //  const resetFields = { ical_url: '', name: '' }
  //
  //   console.log('in DocumentEmailCreateModal, emptyInputFields: ');
  //   this.props.initialize(resetFields, true); //keepDirty = true;
  // }


  handleFormSubmitCallback() {
    console.log('in DocumentEmailCreateModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ createDocumentEmailCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong></strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  // turn off showDocumentEmailCreateModal app state
  handleClose() {
    this.setState({ createDocumentEmailCompleted: false });
    this.props.handleClose();
    if (this.props.signedDocumentsModal) {
      this.props.turnOffSignedDocuments();
    }
  }

  handleDocumentSelectCheck(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const parsedElementVal = parseFloat(elementVal, 10);
    // console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, elementVal: ', elementVal);
    // const alreadyChecked = this.state.checkedDocumentsArray.includes(parsedElementVal);
    const alreadyChecked = this.state.checkedDocumentsArray.indexOf(parsedElementVal) !== -1;
    // console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, elementVal: ', elementVal);

    if (alreadyChecked) {
      // if document already checked delete id from array
      const newArray = [...this.state.checkedDocumentsArray];
      // create new array from state array since cannot push into state object
      const index = newArray.indexOf(parsedElementVal); // get index of id to be deleted
      newArray.splice(index, 1); // remove one id at index
      this.setState({ checkedDocumentsArray: newArray }, () => {
        // console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, if already checked this.state.checkedDocumentsArray: ', this.state.checkedDocumentsArray);
      });
    } else {
      // if document not yet checked, add to array
      const newArray = [...this.state.checkedDocumentsArray];
      newArray.push(parsedElementVal);
      this.setState({ checkedDocumentsArray: newArray }, () => {
        // console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, this.state.checkedDocumentsArray: ', this.state.checkedDocumentsArray);
      });
    }
  }

  renderEachDocument() {
    const document = (eachAgreement) => {
      return (
        <div key={eachAgreement.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '90%', textAlign: 'left' }}>{eachAgreement.document_name}</div>
            <input
              type="checkbox"
              value={eachAgreement.id}
              onChange={this.handleDocumentSelectCheck}
              style={{ margin: '0 0 0 15px' }}
              // checked={this.props.signedDocumentsModal ? (this.state.signedDocumentsArray.includes(eachAgreement.id) || this.state.checkedDocumentsArray.includes(eachAgreement.id)) : false}
            />
          </div>
      );
    };
    // iterate through each agreement
    return _.map(this.props.agreements, eachAgreement => {
      if (this.props.signedDocumentsModal) {
        // if this is signed documents modal; ie not email documents modal
        const documentSigned = eachAgreement.tenant_signed;
        // find out if agreement has been signed by tenant
        if (this.state.markAsSigned) {
          // if user does not check umarked as signed and document is not signed render document
          if (!documentSigned) return document(eachAgreement);
        } else {
          // if user checks unmark as signed and document IS signed render document
          if (documentSigned) return document(eachAgreement);
        } // end of if markAsSigned
      } else {
        //if this is not signed documents modal; ie IS email documents modal render document
        return document(eachAgreement);
      }
    });
  }

  renderDocuments() {
    return (
      <div className="form-control document-email-documents-box">
        {this.renderEachDocument()}
      </div>
    );
  }

  getUserProfile(profiles) {
    let returnedObject = {};
    _.each(profiles, eachProfile => {
      if (eachProfile.language_code == this.props.appLanguageCode) {
        returnedObject = eachProfile;
      }
    });
    return !_.isEmpty(returnedObject) ? returnedObject : { first_name: 'Tenant' };
  }

  renderCreateDocumentEmailForm() {
    const { handleSubmit } = this.props;
    // const profileEmpty = _.isEmpty(this.props.auth.userProfile);
    // console.log('in modal, render before if props.auth showHideClassName:', showHideClassName);
    if (this.props.auth) {
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // console.log('in modal, render showHideClassName:', showHideClassName);
      const tenantProfile = this.getUserProfile(this.props.booking.user.profiles);
      const tenantEmail = this.props.booking.user.email;
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
          <section className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title">{AppLanguages.emailDocuments[this.props.appLanguageCode]}</h3>
          {this.renderAlert()}
          <div className="edit-profile-scroll-div">
            <fieldset className="form-group">
              <label className="create-flat-form-label">Documents:</label>
              {this.renderDocuments()}
            </fieldset>
            <form onSubmit={handleSubmit(this.handleFormSubmit)}>
              <fieldset key={'to'} className="form-group">
                <label className="create-flat-form-label">To:</label>
                <div style={{ float: 'left', paddingLeft: '0px', fontStyle: 'normal' }}>{tenantEmail} ({tenantProfile.first_name}'s email)</div>
              </fieldset>
              <fieldset key={'cc'} className="form-group">
                <label className="create-flat-form-label">Cc:</label>
                <Field name="cc" component="input" type="string" className="form-control document-email-subject-box" placeholder="Enter email addresses here with commas in between" />
              </fieldset>
              <fieldset key={'Bcc'} className="form-group">
                <label className="create-flat-form-label">Bcc:</label>
                <Field name="bcc" component="input" type="string" className="form-control document-email-subject-box" placeholder="Enter email addresses separated by comma" />
              </fieldset>
              <fieldset key={'subject'} className="form-group">
                <label className="create-flat-form-label">Subject:</label>
                <Field name="subject" component="input" type="string" className="form-control document-email-subject-box" placeholder="Subject of your email..." />
              </fieldset>
              <fieldset key={'message'} className="form-group">
                <label className="create-flat-form-label">Message:</label>
                <Field name="message" component="textarea" type="text" className="form-control document-email-text-box" placeholder="Your message here..." />
              </fieldset>

              <div className="confirm-change-and-button">
                <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">{AppLanguages.send[this.props.appLanguageCode]}</button>
              </div>
            </form>
          </div>
          </section>
        </div>
      );
    }
  }

  handleUnmarkAsSignedCheck() {
    this.setState({ markAsSigned: !this.state.markAsSigned, checkedDocumentsArray: [] }, () => {
      console.log('in DocumentEmailCreateModal, handleUnmarkAsSignedCheck, this.state.markAsSigned, this.state.checkedDocumentsArray: ', this.state.markAsSigned, this.state.checkedDocumentsArray);
    });
  }

  renderUnmarkAsSignedBox() {
    return (
      <div>
        <input type="checkbox" onChange={this.handleUnmarkAsSignedCheck} />
        &nbsp; Unmark document as signed
      </div>
    );
  }

  renderDocumentSignedForm() {
    const { handleSubmit } = this.props;
    // const profileEmpty = _.isEmpty(this.props.auth.userProfile);
    // console.log('in modal, render before if props.auth showHideClassName:', showHideClassName);
    if (this.props.auth) {
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // console.log('in modal, render showHideClassName:', showHideClassName);
      const tenantProfile = this.getUserProfile(this.props.booking.user.profiles);
      const tenantEmail = this.props.booking.user.email;
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
          <section className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title">{AppLanguages.markDocumentsSigned[this.props.appLanguageCode]}</h3>
          {this.renderAlert()}
          <div className="edit-profile-scroll-div">
          <label className="create-flat-form-label">Documents:</label>
            {this.renderDocuments()}
            {this.state.signedDocumentsArray.length > 0 ? this.renderUnmarkAsSignedBox() : ''}
            <form onSubmit={handleSubmit(this.handleFormSubmit)}>
              <div className="confirm-change-and-button">
                <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">{AppLanguages.submit[this.props.appLanguageCode]}</button>
              </div>
            </form>
          </div>
          </section>
        </div>
      );
    }
  }

  renderPostCreateMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    const message = this.props.signedDocumentsModal ? 'The documents have been marked signed.' : 'Your email was successfully sent.'
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">{message}</div>
        </div>
      </div>
    )
  }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    const formToRender = this.props.signedDocumentsModal ? this.renderDocumentSignedForm() : this.renderCreateDocumentEmailForm()
    return (
      <div>
        {this.state.createDocumentEmailCompleted ? this.renderPostCreateMessage() : formToRender}
      </div>
    );
  }
}

DocumentEmailCreateModal = reduxForm({
  form: 'DocumentEmailCreateModal',
  enableReinitialize: true
})(DocumentEmailCreateModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in iCalendar_create_modal, mapStateToProps, state: ', state);
  const flat = state.bookingData.flat;
  const initialValues = { subject: `Documents for your rental: ${flat.address1}`, cc: state.auth.email }
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    // flat: state.selectedFlatFromParams.selectedFlatFromParams,
    flat,
    // userProfile: state.auth.userProfile
    // initialValues: state.auth.userProfile
    languages: state.languages,
    appLanguageCode: state.languages.appLanguageCode,
    agreements: state.bookingData.fetchBookingData.agreements,
    booking: state.bookingData.fetchBookingData,
    // showDocumentEmailCreate: state.modals.showDocumentEmailCreateModal,
    initialValues
  };
}


export default connect(mapStateToProps, actions)(DocumentEmailCreateModal);
