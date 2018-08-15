import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../actions';

import globalConstants from '../constants/global_constants';

let showHideClassName;
let fbResponse = {};

class SigninModal extends Component {
  componentDidMount() {
    if (FB) {
      this.facebookLogin((res) => this.updateLoggedInState(res));
    }
    console.log('in SigninModal, componentDidMount, this  ', this);
  }
  //
  // componentDidUpdate() {
  //
  // }
  // for Facebook signin signup called in componentDidMount;
  // index.html header has facebook sdk which loads js
  // fbAsyncInit initializes FB instance and assigns parameters
  // subscribe gets login status and user token to be sent to backend API
  // callback calls action to API end point to log in user
  // last function renders button?
  facebookLogin(callback) {
    // if (FB) {
    console.log('in SigninModal, facebookLogin, before fbAsyncInit, this  ', this);
      window.fbAsyncInit = function () {
        console.log('in SigninModal, facebookLogin, in fbAsyncInit, this  ', this);
        FB.init({
          appId            : process.env.FACEBOOK_APP_ID,
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v3.1',
          scope            : 'email'
        });

        console.log('in SigninModal, facebookLogin, after fbAsyncInit, this  ', this);
        // console.log('in SigninModal, facebookLogin, in subscribe, response  ', response);
        FB.Event.subscribe('auth.statusChange', (response) => {
          if (response.authResponse) {
            fbResponse = response;
            console.log('in SigninModal, facebookLogin, in subscribe, this  ', this);
            console.log('in SigninModal, facebookLogin, in subscribe, fbResponse  ', fbResponse);
            // this.updateLoggedInState(response)
            callback(fbResponse);
          } else {
            // this.udpateLoggedInState()
          }
        });
      }
      // .bind(this);
      // .bind(this);
      // for some reason need this again...
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        // console.log('in SigninModal, facebookLogin, in lower function, this', this);
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    // }
  }
  // call back to facebookLogin
  updateLoggedInState(response) {
    // console.log('in SigninModal, updateLoggedInState', response);
    if(response.status == 'connected') {
      // console.log('in SigninModal, updateLoggedInState', response.status);
      this.props.authFacebookUser({ facebook_access_token: response.authResponse.accessToken }, () => this.handleFormSubmitCallback())

    } else {
      // console.log('in SigninModal, updateLoggedInState', response.status);
      this.props.authError(response.status)
    }
    // console.log('in SigninModal, updateLoggedInState', response);
  }

  handleFormSubmit({ email, password }) {
    console.log('in signin, handleFormSubmit, email, password: ', email, password);
    // console.log('in signin, handleFormSubmit, error: ', error);
    // this.props.signinUser({ email, password }, () => this.props.history.push('/feature'));
    // this.props.signinUser({ email, password }, () => this.handleFormSubmitCallback());
    // navigates back to prior page after sign in; call back sent to action signinUser
    this.props.signinUser({ email, password }, () => this.handleFormSubmitCallback());
    // this.props.showSigninModal();
    // this.props.showAuthModal();
  }
  // for oauth facebook login
  handleFormSubmitCallback() {
    // showHideClassName = 'modal display-none';
    console.log('in signin, handleFormSubmitCallback: ');
    this.props.showAuthModal(); // turn off
    this.props.showSigninModal(); // turn off to close modal

    // when goBack is called, any code after does not get called
    this.props.history.goBack();
  }

  // clearPasswordInput() {
  //   const passwordInput = document.getElementsByClassName('password-input');
  //   console.log('in signin, clearPasswordInput: ', passwordInput);
  //   passwordInput.value = '';
  // }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Ooops! &nbsp;</strong> {this.props.errorMessage}
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
      this.props.showResetPasswordModal(); // turn on
      this.props.showSigninModal(); // turn off
    } else {
      this.props.showSigninModal(); // turn off
      this.props.showSignupModal(); // turn on
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
    // if (FB) {
      // console.log('in signin modal, render, FB: ', FB);
      return (
        <div className={showHideClassName}>
        <section className="modal-main">
        <h3 className="auth-modal-title">Sign in</h3>
        <div className="oath-button-box">
          <div className="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false">FB Login</div>
        </div>

        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <fieldset className="form-group">
            <label className="auth-form-label">Email:</label>
            <Field name="email" component={InputField} type="email" className="form-control" placeholder="your@email.com"/>
          </fieldset>
          <fieldset className="form-group">
            <label className="auth-form-label">Password:</label>
            <Field name="password" component={InputField} type="password" className="form-control password-input" placeholder="Enter your password"/>
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
  // }
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
