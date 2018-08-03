import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../actions';

import globalConstants from '../constants/global_constants';

let showHideClassName;

class SigninModal extends Component {
  componentDidMount() {
  }

  handleFormSubmit({ email, password }) {
    console.log('in signin, handleFormSubmit, email, password: ', email, password);
    // console.log('in signin, handleFormSubmit, error: ', error);
    // this.props.signinUser({ email, password }, () => this.props.history.push('/feature'));
    // this.props.signinUser({ email, password }, () => this.handleFormSubmitCallback());
    // navigates back to prior page after sign in; call back sent to action signinUser
    this.props.signinUser({ email, password }, () => this.props.history.goBack());
    this.props.showSigninModal();
    this.props.showAuthModal();
  }

  handleFormSubmitCallback() {
    showHideClassName = 'modal display-none';
    this.props.showAuthModal();
    this.props.showSigninModal();
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

  handleAuthClick(event) {
    console.log('in modal, in handleAuthClick, event.target:', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    if (elementVal === 'reset-password') {
      console.log('in modal, in handleAuthClick, if reset-password, true:');
      this.props.showResetPasswordModal();
      this.props.showSigninModal();
    } else {
      this.props.showSigninModal();
    }
  }

  render() {
    const { handleSubmit } = this.props;
    console.log('in signin modal, this.props: ', this.props);
    // const fieldHelper = this.props.fields;
    // console.log('in signin modal, fieldHelper: ', fieldHelper);
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // console.log('in modal, render showHideClassName:', showHideClassName);
    // console.log('in modal, render this.props.show:', this.props.show);
    // console.log('in modal, render this.props:', this.props);
    //handleClose is a prop passed from header when SigninModal is called
    // {email.touched ? 'email touched' : ''}
    return (
      <div className={showHideClassName}>
       <section className="modal-main">
         <h3 className="auth-modal-title">Sign in</h3>
         <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
           <fieldset className="form-group">
             <label className="auth-form-label">Email:</label>
             <Field name="email" component={InputField} type="email" className="form-control" placeholder="your@email.com"/>
           </fieldset>
           <fieldset className="form-group">
             <label className="auth-form-label">Password:</label>
             <Field name="password" component={InputField} type="password" className="form-control" placeholder="Enter your password"/>
           </fieldset>
           <span value="reset-password"className="goto-signin-link" onClick={this.handleAuthClick.bind(this)}>Forgot? Reset Password</span>
           <span value="signup" className="goto-signin-link" onClick={this.handleAuthClick.bind(this)}>Sign Up!</span>
           {this.renderAlert()}
           <button action="submit" className="btn btn-primary signin-btn">Sign in</button>
         </form>
         <button className="modal-close-button" onClick={this.props.handleClose}><i className="fa fa-window-close"></i></button>
       </section>
     </div>
    );
  }
}
// set minimum password length in src/constants/global_constants.js
const MIN_PW_LENGTH = globalConstants.minPWLength;

// Reference: https://hashrocket.com/blog/posts/get-started-with-redux-form
const InputField = ({
  input,
  type,
  placeholder,
  meta: { touched, error, warning },
}) =>
  <div className="input-error-box">
      <input {...input} type={type} placeholder={placeholder} className="form-control" />
      {touched && error &&
      <div className="error">
        <span style={{ color: 'red' }}>* </span>{error}
      </div>
      }
  </div>;

// reference: https://stackoverflow.com/questions/47286305/the-redux-form-validation-is-not-working
function validate(values) {
  console.log('in signin modal, validate values: ', values);
    const errors = {};

    if (!values.email) {
        errors.email = 'An email is required';
    } else if (!/^.+@.+$/i.test(values.email)) {
    // console.log('email is invalid');
    errors.email = 'Invalid email address';
  }
    if (!values.password) {
        errors.password = 'A password is required';
    } else if (values.password.length < 6) {
      errors.password = `Passwords need to be at least ${MIN_PW_LENGTH} characters`;
    }
    console.log('in signin modal, validate errors: ', errors);
    return errors;
}

// Reference: https://stackoverflow.com/questions/40262564/how-to-export-mapstatetoprops-and-redux-form
// do not need fields from redux forms v6
SigninModal = reduxForm({
    // redux-form config
    form: 'signin',
    // fields: ['email', 'password'],
    validate
})(SigninModal);

function mapStateToProps(state) {
  console.log('in signin modal, state: ', state);

  return {
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated };
}
// combining does not work!!!
// export default reduxForm({
//   form: 'signin',
//   validate
//   // fields: ['email', 'password']
// }, mapStateToProps, actions)(SigninModal);
export default connect(mapStateToProps, actions)(SigninModal);
