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
      documentsToSendArray: []
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleDocumentSelectCheck = this.handleDocumentSelectCheck.bind(this);
  }

  // componentDidMount() {
  // }

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
    dataToBeSent.documents_array = this.state.documentsToSendArray;
    dataToBeSent.subject = data.subject;
    dataToBeSent.message = data.message;
    // Create arrays of emails from string of emails
    const ccArray = this.createEmailAddressArray(data.cc);
    const bccArray = this.createEmailAddressArray(data.bcc);
    let emailsValid = true;
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
    dataToBeSent.booking_id = this.props.booking.id;
    dataToBeSent.user_id = this.props.booking.user_id;
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in DocumentEmailCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    if (this.state.documentsToSendArray.length > 0 && emailsValid) {
      // if documents checked and all emails valid send to api
      this.props.authError('');
      this.props.showLoading();
      this.props.emailDocuments(dataToBeSent, () => {
        this.handleFormSubmitCallback();
      });
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

  emptyInputFields() {
   const resetFields = { ical_url: '', name: '' }

    console.log('in DocumentEmailCreateModal, emptyInputFields: ');
    this.props.initialize(resetFields, true); //keepDirty = true;
  }


  handleFormSubmitCallback() {
    console.log('in DocumentEmailCreateModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ createDocumentEmailCompleted: true });
    // this.resetAdvancedFilters();
    this.emptyInputFields();
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
  }

  handleDocumentSelectCheck(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const parsedElementVal = parseFloat(elementVal, 10);
    // console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, elementVal: ', elementVal);
    const alreadyChecked = this.state.documentsToSendArray.includes(parsedElementVal);
    // console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, elementVal: ', elementVal);
    if (alreadyChecked) {
      // if document already checked delete id from array
      const newArray = [...this.state.documentsToSendArray];
      // create new array from state array since cannot push into state object
      const index = newArray.indexOf(parsedElementVal); // get index of id to be deleted
      newArray.splice(index, 1); // remove one id at index
      this.setState({ documentsToSendArray: newArray }, () => {
        // console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, if already checked this.state.documentsToSendArray: ', this.state.documentsToSendArray);
      });
    } else {
      // if document not yet checked, add to array
      const newArray = [...this.state.documentsToSendArray];
      newArray.push(parsedElementVal);
      this.setState({ documentsToSendArray: newArray }, () => {
        // console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, this.state.documentsToSendArray: ', this.state.documentsToSendArray);
      });
    }
  }

  renderEachDocument() {
    return _.map(this.props.agreements, each => {
      return (
        <div key={each.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '90%', textAlign: 'left' }}>{each.document_name}</div>
          <input
            type="checkbox"
            value={each.id}
            onChange={this.handleDocumentSelectCheck}
            style={{ margin: '0 0 0 15px' }}
          />
        </div>
      );
    });
  }

  renderDocuments() {
    return (
      <div className="document-email-documents-box">
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
          <label className="create-flat-form-label">Documents:</label>
            {this.renderDocuments()}
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

  // towerOfHanoi(n, from, to, aux) {
  //   if (n == 1) {
  //     console.log(`TOH ${n} going from ${from} to ${to}`);
  //     return;
  //   }
  //   this.towerOfHanoi((n - 1), from, aux, to);
  //   console.log(`TOH ${n} going from ${from} to ${to}`);
  //   this.towerOfHanoi((n - 1), aux, to, from);
  // }

  // sum(a) {
  //   return (b) => {
  //     if (b) {
  //       return this.sum(a + b);
  //     }
  //     return a;
  //   };
  // }

  renderPostCreateMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">Your email was successfully sent.</div>
        </div>
      </div>
    )
  }

  render() {
    // this.towerOfHanoi(5, 'A', 'C', 'B');
    // console.log('HERE is the this.sum(1)(2)(3)(4): ', this.sum(1)(2)(3)(4)());
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.state.createDocumentEmailCompleted ? this.renderPostCreateMessage() : this.renderCreateDocumentEmailForm()}
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
