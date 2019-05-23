import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import AppLanguages from '../constants/app_languages';

let showHideClassName;

class ConversationCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createConversationCompleted: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    // console.log('in conversation create modal, handleFormSubmit, data: ', data);
    // console.log('in conversation create modal, handleFormSubmit, this.props.flatId, this.props.sentByUser: ', this.props.flatId, this.props.sentByUser);
    this.props.createConversation({ flat_id: this.props.flatId, user_id: this.props.userId }, { body: data.message, flat_id: this.props.flatId, sent_by_user: this.props.sentByUser }, (messageAttributes) => this.createConversationCallback(messageAttributes));
  }

  createConversationCallback(messageAttributes) {
    // console.log('in show_flat, createConversationCallback, messageAttributes: ', messageAttributes);

    // this.props.createMessage(messageAttributes, (flatId) => this.createMessageCallback(flatId));
    messageAttributes.booking_id = this.props.bookingId;
    this.props.createMessage(messageAttributes, () => this.handleFormSubmitCallback());
  }

  // createMessageCallback(id) {
    // console.log('in show_flat, createMessageCallback, id: ', id);
    // this.props.history.push(`/show/${id}`);
    // this.setState(this.state);
    // this.props.fetchConversationByFlatAndUser(id);
    // this.setState({ messagingToggle: !this.state.messagingToggle });
    // this.scrollLastMessageIntoView();
  // }

  handleFormSubmitCallback() {
    this.setState({ createConversationCompleted: true });
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

  handleClose() {
    // console.log('in profile_edit_modal, handleClose, this.props.showProfileEdit: ', this.props.showProfileEdit);
    this.props.handleClose();
  }

  renderEachInputField() {
        // console.log('in profile_edit_modal, in renderEachInputField, formField:', formField);
        // console.log('in profile_edit_modal, in renderEachInputField, Profile.language_code, this.props.profile, this.props.profile.language_code:', Profile.language_code, this.props.profile, this.props.profile.language_code);
      return (
        <fieldset className="form-group">
          <label className="create-flat-form-label">{AppLanguages.message[this.props.appLanguageCode]}:</label>
          <Field
            name={'message'}
            component={'textarea'}
            type={'text'}
            className={'conversation-create-modal-textarea'}
            />
        </fieldset>
      );
  }

  renderCreateProfileForm() {
    const { handleSubmit } = this.props;
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // console.log('in modal, render showHideClassName:', showHideClassName);
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
          <section className="modal-main small-modal">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title small-modal-title">{AppLanguages.enterMessageToTenant[this.props.appLanguageCode]}</h3>
          {this.renderAlert()}
          <div className="edit-profile-scroll-div">
            <form onSubmit={handleSubmit(this.handleFormSubmit)}>
              {this.renderEachInputField()}
              <div className="confirm-change-and-button">
              <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button conversation-create-modal-submit-btn">{AppLanguages.submit[this.props.appLanguageCode]}</button>
              </div>
            </form>
          </div>
          </section>
        </div>
      );
  }

  renderPostEditMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">Your message has been sent. Please see any responses in the messaging page (click mail icon at top).</div>
        </div>
      </div>
    )
  }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.state.createConversationCompleted ? this.renderPostEditMessage() : this.renderCreateProfileForm()}
      </div>
    );
  }
}

ConversationCreateModal = reduxForm({
  form: 'ConversationCreateModal'
})(ConversationCreateModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  let initialValues = {};

  console.log('in profile_create_modal, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    // userProfile: state.auth.userProfile
    appLanguageCode: state.languages.appLanguageCode,
    initialValues
  };
}


export default connect(mapStateToProps, actions)(ConversationCreateModal);
