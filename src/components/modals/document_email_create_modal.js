import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
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

  handleFormSubmit(data) {
    // const { code } = data;
    // this.setState({ selectedDocumentEmail: languages[code].name });
    const dataToBeSent = data;
    dataToBeSent.documents_array = this.state.documentsToSendArray;
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in DocumentEmailCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.emailDocuments(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
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
          <strong>Ooops! </strong> {this.props.errorMessage}
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
    console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, elementVal: ', elementVal);
    const alreadyChecked = this.state.documentsToSendArray.includes(parsedElementVal);
    console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, elementVal: ', elementVal);
    if (alreadyChecked) {
      const newArray = [...this.state.documentsToSendArray];
      const index = newArray.indexOf(parsedElementVal); // get index of id to be deleted
      newArray.splice(index, 1); // remove one id at index
      this.setState({ documentsToSendArray: newArray }, () => {
        console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, if already checked this.state.documentsToSendArray: ', this.state.documentsToSendArray);
      });
    } else {
      const newArray = [...this.state.documentsToSendArray];
      newArray.push(parsedElementVal);
      this.setState({ documentsToSendArray: newArray }, () => {
        console.log('in DocumentEmailCreateModal, handleDocumentSelectCheck, this.state.documentsToSendArray: ', this.state.documentsToSendArray);
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

  renderCreateDocumentEmailForm() {
    const { handleSubmit } = this.props;
    // const profileEmpty = _.isEmpty(this.props.auth.userProfile);
    console.log('in modal, render before if props.auth showHideClassName:', showHideClassName);
    if (this.props.auth) {
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      console.log('in modal, render showHideClassName:', showHideClassName);
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
          <section className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title">Send Documents</h3>
          {this.renderAlert()}
          <div className="edit-profile-scroll-div">
            {this.renderDocuments()}
            <form onSubmit={handleSubmit(this.handleFormSubmit)}>
            <fieldset key={'message'} className="form-group">
              <label className="create-flat-form-label">Message:</label>
              <Field name="message" component="textarea" type="text" className="form-control document-email-text-box" placeholder="Your message here..." />
            </fieldset>

            <div className="confirm-change-and-button">
              <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">Submit</button>
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
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.state.createDocumentEmailCompleted ? this.renderPostCreateMessage() : this.renderCreateDocumentEmailForm()}
      </div>
    );
  }
}

DocumentEmailCreateModal = reduxForm({
  form: 'DocumentEmailCreateModal'
})(DocumentEmailCreateModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in iCalendar_create_modal, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    flat: state.selectedFlatFromParams.selectedFlatFromParams,
    // userProfile: state.auth.userProfile
    // initialValues: state.auth.userProfile
    languages: state.languages,
    agreements: state.bookingData.fetchBookingData.agreements,
    // showDocumentEmailCreate: state.modals.showDocumentEmailCreateModal,
  };
}


export default connect(mapStateToProps, actions)(DocumentEmailCreateModal);
