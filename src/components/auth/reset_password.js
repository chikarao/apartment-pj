import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';

class ResetPassword extends Component {
  componentWillMount() {
    // this.props.signoutUser();
  }
  render() {
    return (
      <div>
        <form>
          <fieldset className="form-group auth-form-group">
            <label className="auth-form-label">Email:</label>
            <input className="form-control" placeholder="First, enter your email and presss the button" />
          </fieldset>
          <button className="btn btn-primary reset-password-btn">Send Reset Token</button>
          <fieldset className="form-group">
            <label className="auth-form-label">Reset Token:</label>
          <input className="form-control" placeholder="Second, enter the token we sent to your email"/>
          </fieldset>
            <fieldset className="form-group">
            <label className="auth-form-label">New Password:</label>
          <input className="form-control" placeholder="Enter new password" />
          </fieldset>
            <fieldset className="form-group">
            <label className="auth-form-label">Confirm New Password:</label>
          <input className="form-control" placeholder="Enter new password again"/>
          </fieldset>
            <button action="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    );
  }
}

export default connect(null, actions)(ResetPassword);
