import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../actions';

// !!!!!!!!!!!!!!!!!NOT USED; Using signin_modal.js !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
class Signin extends Component {
  componentWillMount() {
    if (this.props.authenticated) {
      this.props.history.push('/feature');
    }
   }

  handleFormSubmit({ email, password }) {
    console.log('in signin, handleFormSubmit, email, password: ', email, password);
    this.props.signinUser({ email, password }, () => this.props.history.push('/feature'));
    // navigates back to prior page after sign in; call back sent to action signinUser
    // this.props.signinUser({ email, password }, () => this.props.history.goBack());
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

  render() {
    // const { handleSubmit, fields: { email, password } } = this.props;
    const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    console.log('in signin, render, this.props: ', this.props);
    // handle submit came from redux form; fields came from below
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <label className="auth-form-label">Email:</label>
          <Field name="email" component="input" type="email" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="auth-form-label">Password:</label>
          <Field name="password" component="input" type="password" className="form-control" />
        </fieldset>
        <Link to="/resetpassword" className="reset-password">Reset Password</Link>
        <Link to="/signup" className="reset-password">Sign Up!</Link>
          {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Sign in</button>
      </form>
    );
  }
}

Signin = reduxForm({
    // (your redux-form config)
    form: 'signin',
    fields: ['email', 'password']
})(Signin);

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated };
}

// export default reduxForm({
//   form: 'signin',
//   fields: ['email', 'password']
// }, mapStateToProps, actions)(Signin);
export default connect(mapStateToProps, actions)(Signin);

// export wrap it with redux form helper
