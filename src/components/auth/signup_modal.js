import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../actions';

let showHideClassName;

class SignupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signUpCompleted: false
    };
  }
  componentDidMount() {
  }

  handleFormSubmit({ email, password }) {
    // call action creator to sign up user
    // if form is not valid, handlesubmit will not called by redux-form
    // this.props.signupUser(formProps);
    console.log('in signup, render, handleFormSubmit: ', email, password);
    this.props.signupUser({ email, password }, () => this.handleFormSubmitCallback());
  }

  handleFormSubmitCallback() {
    this.setState({ signUpCompleted: true })
    // showHideClassName = 'modal display-none';
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

  handleSigninClick() {
    console.log('in modal, in handleSigninClick:');
    this.props.showAuthModal();
  }

  renderAuthForm() {
    const { handleSubmit, pristine, submitting, touched, fields: { email, password, passwordConfirm } } = this.props;
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    console.log('in modal, render showHideClassName:', showHideClassName);
    console.log('in modal, render this.props.show:', this.props.show);
    console.log('in modal, render this.props:', this.props);

    return (
      <div className={showHideClassName}>
      <div className="modal-main">
      <button className="modal-close-button" onClick={this.props.handleClose}><i className="fa fa-window-close"></i></button>
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
      <fieldset className="form-group">
      <label className="auth-form-label">Email:</label>
      <Field name="email" component="input" type="email" className="form-control" />
      </fieldset>
      <fieldset className="form-group">
      <label className="auth-form-label">Password:</label>
      <Field name="password" component="input" type="password" className="form-control" type="password" />
      </fieldset>
      <fieldset className="form-group">
      <label className="auth-form-label">Confirm Password:</label>
      <Field name="passwordConfirmation" component="input" className="form-control" type="password" />
      </fieldset>
      {this.renderAlert()}
      <span className="goto-signin-link" onClick={this.handleSigninClick.bind(this)}>Already signed up? Sign in</span>
      <button action="submit" className="btn btn-primary btn-lg signup-btn">Sign Up!</button>
      </form>
      </div>
      </div>
    );
  }

  renderPostSignUpMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    return (
      <div className={showHideClassName}>
      <div className="modal-main">
      <button className="modal-close-button" onClick={this.props.handleClose}><i className="fa fa-window-close"></i></button>
      <div className="post-signup-message">Thank you for signing up! <br/><br/>We have sent you an email. <br/>Please confirm your sign up to starting using the service.</div>
      </div>
      </div>
    )
  }


  render() {
    return (
      <div>
        {this.state.signUpCompleted ? this.renderPostSignUpMessage() : this.renderAuthForm()}
      </div>
    );
  }
  // end of render
} // end of class


function validate(formProps) {
  const errors = {};
  // console.log(formProps);
  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }
  if (!formProps.password) {
    errors.password = 'Please enter a password';
  }
  if (!formProps.passwordConfirm) {
    errors.passwordConfirm = 'Please enter a password confirmation';
  }

  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match';
  }
  // console.log(errors);
  return errors;
}

SignupModal = reduxForm({
    // (your redux-form config)
    form: 'signup',
    fields: ['email', 'password', 'passwordConfirm']
    //returns array of all different keys of FIELDS which will be email,
    // password and passwordConfirm
    // validate
})(SignupModal);

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error
  };
}
// export default reduxForm({
//   form: 'signup',
//   fields: ['email', 'password', 'passwordConfirm'],
//   validate
//   //same as validate: validate
// }, mapStateToProps, actions
// )(SignupModal);
export default connect(mapStateToProps, actions)(SignupModal);
// export default SignupModal;
