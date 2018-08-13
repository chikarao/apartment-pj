import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../actions';

import globalConstants from '../constants/global_constants';

// import FacebookLogin from './fb_login_function';


let showHideClassName;

class SignupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signUpCompleted: false
    };
  }

  componentDidMount() {
    // this.facebookLogin();
  }

  facebookLogin() {
    // console.log('in facebookLogin, facebookLogin FB', FB);
    window.fbAsyncInit = function () {
      FB.init({
        appId            : '2249093511770692',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v3.1'
      });

      FB.Event.subscribe('auth.statusChange', (response) => {
        if (response.authResponse) {
          this.updateLoggedInState(response)
        } else {
          this.udpateLoggedInState()
        }
      });
      console.log('in SigninModal, facebookLogin, after subscribe, this', this);
  }
  // don't need to bind; FB button will not show
  //.bind(this);
  // for some reason need this again...
    (function(d, s, id) {
       var js, fjs = d.getElementsByTagName(s)[0];
       console.log('in SigninModal, facebookLogin, in lower function');
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  updateLoggedInState(response) {
    console.log('in SigninModal, updateLoggedInState', response);
    // console.log('in SigninModal, updateLoggedInState', response);
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
          <strong>Ooops!  </strong> {this.props.errorMessage}
        </div>
      );
    }

    if (this.props.successMessage) {
      return (
        <div className="alert alert-success success-alert">
        </div>
      );
    }
  }

  handleSigninClick() {
    console.log('in modal, in handleSigninClick:');
    this.props.showSigninModal();
  }
  // do not need fields from redux forms v6
  renderAuthForm() {
    const { handleSubmit } = this.props;
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // console.log('in signup modal, render showHideClassName:', showHideClassName);
    // console.log('in signupmodal, render this.props.show:', this.props.show);
    // console.log('in signup modal, render this.props:', this.props);

    return (
      <div className={showHideClassName}>
      <div className="modal-main">
        <h3 className="auth-modal-title">Sign up</h3>
        <div className="oath-button-box">
          <div className="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false">FB Login</div>
        </div>
        <button className="modal-close-button" onClick={this.props.handleClose}><i className="fa fa-window-close"></i></button>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <fieldset className="form-group">
            <label className="auth-form-label">Email:</label>
            <Field name="email" component={InputField} type="email" className="form-control" placeholder="your@email.com" />
          </fieldset>
          <fieldset className="form-group">
            <label className="auth-form-label">Password:</label>
            <Field name="password" component={InputField} type="password" className="form-control" placeholder={`Enter your password of at least ${MIN_PW_LENGTH} characters`} />
          </fieldset>
          <fieldset className="form-group">
            <label className="auth-form-label">Confirm Password:</label>
            <Field name="passwordConfirm" component={InputField} className="form-control" type="password" placeholder={'Enter your password again for confirmation'} />
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
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.props.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">Thank you for signing up! <br/><br/>We have sent you an email to confirm. <br/>To start using the service, please confirm your sign up.</div>
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
  } // end of render
} // end of class

// Reference: https://hashrocket.com/blog/posts/get-started-with-redux-form
const InputField = ({
  input,
  type,
  placeholder,
  meta: { touched, error, warning },
}) =>
  <div>
      <input {...input} type={type} placeholder={placeholder} className="form-control" />
      {touched && error &&
        <div className="error">
          <span style={{ color: 'red' }}>* </span>{error}
        </div>
      }
  </div>;

const MIN_PW_LENGTH = globalConstants.minPWLength;

// reference: https://stackoverflow.com/questions/47286305/the-redux-form-validation-is-not-working
function validate(values) {
  const errors = {};
    console.log('in signup modal, validate values: ', values);
  // console.log(values);
  if (!values.email) {
      errors.email = 'Please enter an email';
  } else if (!/^.+@.+$/i.test(values.email)) {
  // console.log('email is invalid');
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Please enter a password';
  } else if (values.password.length < 6) {
    errors.password = 'A password needs to be at least 6 characters';
  }

  if (values.password && !values.passwordConfirm) {
    errors.passwordConfirm = 'Please enter a password confirmation';
  }

  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = 'Passwords must match';
  }
  // console.log(errors);
  return errors;
}

// do not need fields from redux forms v6
SignupModal = reduxForm({
    // (your redux-form config)
    form: 'signup',
    // fields: ['email', 'password', 'passwordConfirm'],
    validate
    //returns array of all different keys of FIELDS which will be email,
    // password and passwordConfirm
    // validate
})(SignupModal);

function mapStateToProps(state) {
  console.log('in signup modal, state: ', state);
  return {
    errorMessage: state.auth.error,
    successMessage: state.auth.success,
    auth: state.auth
  };
}
// this does not work!!!
// export default reduxForm({
//   form: 'signup',
//   fields: ['email', 'password', 'passwordConfirm'],
//   validate
//   //same as validate: validate
// }, mapStateToProps, actions
// )(SignupModal);
export default connect(mapStateToProps, actions)(SignupModal);
// export default SignupModal;
