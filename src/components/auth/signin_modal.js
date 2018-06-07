import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../actions';

let showHideClassName;

class SigninModal extends Component {
  componentDidMount() {
  }

  handleFormSubmit({ email, password }) {
    console.log('in signin, handleFormSubmit, email, password: ', email, password);
    // this.props.signinUser({ email, password }, () => this.props.history.push('/feature'));
    this.props.signinUser({ email, password }, () => this.handleFormSubmitCallback());
    // navigates back to prior page after sign in; call back sent to action signinUser
    // this.props.signinUser({ email, password }, () => this.props.history.goBack());
  }

  handleFormSubmitCallback() {
    showHideClassName = 'modal display-none';
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
    const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    console.log('in modal, render showHideClassName:', showHideClassName);
    console.log('in modal, render this.props.show:', this.props.show);
    console.log('in modal, render this.props:', this.props);

    return (
      <div className={showHideClassName}>
       <section className="modal-main">
         <h3 className="auth-modal-title">Sign in</h3>
         <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
           <fieldset className="form-group">
             <label className="auth-form-label">Email:</label>
             <Field name="email" component="input" type="email" className="form-control" />
           </fieldset>
           <fieldset className="form-group">
             <label className="auth-form-label">Password:</label>
             <Field name="password" component="input" type="password" className="form-control" />
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

SigninModal = reduxForm({
    // (your redux-form config)
    form: 'signin',
    fields: ['email', 'password']
})(SigninModal);

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
export default connect(mapStateToProps, actions)(SigninModal);
// export default Modal;
