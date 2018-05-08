import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../actions';


class Signup extends Component {
  handleFormSubmit({ email, password }) {
    // call action creator to sign up user
    // if form is not valid, handlesubmit will not called by redux-form
    // this.props.signupUser(formProps);
    console.log('in signup, render, handleFormSubmit: ', email, password);
    this.props.signupUser({ email, password }, () => this.props.history.push('/feature')
    );
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
    const { handleSubmit, pristine, submitting, touched, fields: { email, password, passwordConfirm } } = this.props;
    console.log('in signup, render, this.props: ', this.props);
    console.log('in signup, render, email: ', this.props.fields.email);

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <label>Email:</label>
          <Field name="email" component="input" type="email" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label>Password:</label>
          <Field name="password" component="input" type="password" className="form-control" type="password" />
        </fieldset>
        <fieldset className="form-group">
          <label>Confirm Password:</label>
          <Field name="passwordConfirmation" component="input" className="form-control" type="password" />
        </fieldset>
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Sign Up!</button>
      </form>
    );
  }
}

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

Signup = reduxForm({
    // (your redux-form config)
    form: 'signup',
    fields: ['email', 'password', 'passwordConfirm']
    //returns array of all different keys of FIELDS which will be email,
    // password and passwordConfirm
    // validate
})(Signup);

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
// )(Signup);
export default connect(mapStateToProps, actions)(Signup);
