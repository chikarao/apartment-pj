import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../actions';

let showHideClassName;

class ResetPasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetCompleted: false
    };
  }
  handleEmailFormSubmit({ email }) {
    console.log('in reset_password, handleEmailFormSubmit email entered, clicked, email:', email);
    this.props.getPasswordResetToken(email);
  }

  handlePasswordFormSubmit({ email, token, password }) {
    console.log('in reset_password, handlePasswordFormSubmit token entered, clicked, token', token);
    console.log('in reset_password, handlePasswordFormSubmit password entered, clicked, password', password);
    console.log('in reset_password, handlePasswordFormSubmit password entered, clicked, email', email);
    this.props.resetPassword({ email, token, password });
  }

    handleFormSubmitCallback() {
      showHideClassName = 'modal display-none';
    }
  // on click of 'reset password', swith on showSigninModal, and switchoff showResetPasswordModal
  handleAuthClick() {
    this.props.showSigninModal();
    this.props.showResetPasswordModal();
  }

  renderAuthForm() {
    const { handleSubmit, fields: { email, password, token } } = this.props;
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    console.log('in modal, render showHideClassName:', showHideClassName);
    console.log('in modal, render this.props.show:', this.props.show);
    console.log('in modal, render this.props:', this.props);
    return (
      <div className={showHideClassName}>
      <section className="modal-main">
      <h3 className="auth-modal-title">Reset Password</h3>
      <button className="modal-close-button" onClick={this.props.handleClose}><i className="fa fa-window-close"></i></button>
      <form onSubmit={handleSubmit(this.handleEmailFormSubmit.bind(this))}>
      <fieldset className="form-group">
      <label className="auth-form-label">Email:</label>
      <Field name="email" component="input" type="email" placeholder="First, enter your email and press the first button below" className="form-control" />
      </fieldset>
      <button className="btn btn-primary reset-password-btn">Send Reset Token to My Email</button>
      </form>
      <form id="auth-reset-password-form" onSubmit={handleSubmit(this.handlePasswordFormSubmit.bind(this))}>
      <fieldset className="form-group">
      <label className="auth-form-label">Reset Token:</label>
      <Field name="token" component="input" type="token" placeholder="Second, enter the token we sent to your email" className="form-control" />
      </fieldset>
      <fieldset className="form-group">
      <label className="auth-form-label">New Password:</label>
      <Field name="password" component="input" type="password" placeholder="Enter new password" className="form-control" />
      </fieldset>
      <fieldset className="form-group">
      <label className="auth-form-label">Confirm New Password:</label>
      <Field name="passwordConfirmation" component="input" type="password"placeholder="Enter new password again" className="form-control" />
      </fieldset>
      <span value="reset-password"className="goto-signin-link" onClick={this.handleAuthClick.bind(this)}>Back to Sign in</span>
      <button action="submit" className="btn btn-primary reset-password-btn">Submit</button>
      </form>
      </section>
      </div>
    );
  }

  renderPostResetMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.props.handleClose}><i className="fa fa-window-close"></i></button>
          <div className="post-signup-message">Your password has been reset. Please sign in.</div>
          <span value="reset-password"className="goto-signin-link" onClick={this.handleAuthClick.bind(this)}>Back to Sign in</span>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.state.resetCompleted ? this.renderPostResetMessage() : this.renderAuthForm()}
      </div>
    );
  } // end of render
} // end of class

ResetPasswordModal = reduxForm({
    // (your redux-form config)
    form: 'resetPassword',
    fields: ['email', 'password', 'token']
})(ResetPasswordModal);

function mapStateToProps(state) {
  console.log('in signin modal, state: ', state);

  return {
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated };
}

// export default reduxForm({
//   form: 'signin',
//   fields: ['email', 'password']
// }, mapStateToProps, actions)(Signin);
export default connect(mapStateToProps, actions)(ResetPasswordModal);
// export default Modal;
