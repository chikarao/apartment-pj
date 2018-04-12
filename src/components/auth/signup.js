import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import * as actions from '../../actions';

const FIELDS = {
  email: {
    type: 'input',
    label: 'Email'
  },
  password: {
    type: 'input',
    label: 'Password'
  },
  passwordConfirm: {
    type: 'input',
    label: 'Password Confirmation'
  }
};
// ['email', 'password', 'passwordConfirm'];
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;

class Signup extends Component {
  handleFormSubmit(formProps) {
    // call action creator to sign up user
    // if form is not valid, handlesubmit will not called by redux-form
    // this.props.signupUser(formProps);
    this.props.signupUser(formProps, () => this.props.history.push('/feature')
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

  renderField(fieldConfig, field) {
    const fieldHelper = this.props.fields[field];
    // console.log('here is the fieldhelper: ', fieldHelper);
    // one fieldHelper for each field declared below in redux form

    return (
      <fieldset className="form-group" key={fieldConfig.label}>
        <label>{fieldConfig.label}</label>
        <fieldConfig.type
          className="form-control"
          type={fieldHelper.name === 'password' ||
          fieldHelper.name === 'passwordConfirm' ? 'password' : ''}
          {...fieldHelper}
        />
        {fieldHelper.touched && fieldHelper.error
          && <div className="error">{fieldHelper.error}</div>}
      </fieldset>
    );
  }

  render() {
    // const { handleSubmit, fields: { email, password, passwordConfirm } } = this.props;
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        {_.map(FIELDS, this.renderField.bind(this))}
        {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Sign Up!</button>
      </form>
    );
  }
//   render() {
//     const { handleSubmit, fields: { email, password, passwordConfirm } } = this.props;
//     return (
//       <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
//         <fieldset className="form-group">
//           <label>Email:</label>
//           <input className="form-control" {...email} />
//           {email.touched && email.error && <div className="error">{email.error}</div>}
//         </fieldset>
//         <fieldset className="form-group">
//           <label>Password:</label>
//           <input className="form-control" type="password" {...password} />
//           {password.touched && password.error && <div className="error">{password.error}</div>}
//         </fieldset>
//         <fieldset className="form-group">
//           <label>Confirm Password:</label>
//           <input className="form-control" type="password" {...passwordConfirm} />
//           {passwordConfirm.touched && passwordConfirm.error && <div className="error">
//           {passwordConfirm.error}</div>}
//         </fieldset>
//         {this.renderAlert()}
//         <button action="submit" className="btn btn-primary">Sign Up!</button>
//       </form>
//     );
//   }
}

function validate(formProps) {
  const errors = {};
  // console.log(formProps);
  // if (!formProps.email) {
  //   errors.email = 'Please enter an email';
  // }
  // if (!formProps.password) {
  //   errors.password = 'Please enter a password';
  // }
  // if (!formProps.passwordConfirm) {
  //   errors.passwordConfirm = 'Please enter a password confirmation';
  // }
  _.each(FIELDS, (label, field) => {
    if (!formProps[field]) {
      errors[field] = `Please enter ${field}`;
    }
  });

  if (!emailRegex.test(formProps.email)) {
    errors.email = 'Please input a valid email';
  }

  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match';
  }
  // console.log(errors);
  return errors;
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error
  };
}

export default reduxForm({
  form: 'signup',
  fields: _.keys(FIELDS),
  // fields: ['email', 'password', 'passwordConfirm'],
  //returns array of all different keys of FIELDS which will be email, password and passwordConfirm
// ['email', 'password', 'passwordConfirm'];
  validate
  //same as validate: validate
}, mapStateToProps, actions
)(Signup);
