import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';

import * as actions from '../../actions';

class Signin extends Component {
  componentWillMount() {
    if (this.props.authenticated) {
      this.props.history.push('/feature');
    }
   }

  handleFormSubmit({ email, password }) {
    console.log(email, password);
    this.props.signinUser({ email, password }, () => this.props.history.push('/feature'));
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
    const { handleSubmit, fields: { email, password } } = this.props;
    // handle submit came from redux form; fields came from below
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
          <label className="auth-form-label">Email:</label>
          <input {...email} className="form-control" />
        </fieldset>
        <fieldset className="form-group">
          <label className="auth-form-label">Password:</label>
          <input {...password} type="password" className="form-control" />
        </fieldset>
        <Link to="/resetpassword" className="reset-password">Reset Password</Link>
          {this.renderAlert()}
        <button action="submit" className="btn btn-primary">Sign in</button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated };
}

export default reduxForm({
  form: 'signin',
  fields: ['email', 'password']
}, mapStateToProps, actions)(Signin);

// export wrap it with redux form helper
