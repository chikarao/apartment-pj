import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import * as actions from '../../actions';

class ResetPassword extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     shouldHide: true
  //   };
  // }

  // componentDidMount() {
  //   // this.props.signoutUser();
  //   // document.getElementById('auth-reset-password-form').className = 'hide';
  // }

  handleEmailFormSubmit({ email }) {
    console.log('in reset_password, handleFormSubmit email entered, clicked, email:', email);
    // this.props.requestPasswordResetToken({ email }, () => this.props.history.push('/feature'));
    this.props.getPasswordResetToken(email);
  }

  handlePasswordFormSubmit({ email, token, password }) {
    console.log('in reset_password, handleFormSubmit token entered, clicked, token', token);
    console.log('in reset_password, handleFormSubmit password entered, clicked, password', password);
    this.props.resetPassword({ email, token, password });

  }
  //
  // renderTokenEnterAndPasswordReset() {
  //   return (
  //     <div>
  //     </div>
  //   );
  // }


  render() {
      const { handleSubmit, fields: { email, password, token } } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit(this.handleEmailFormSubmit.bind(this))}>
          <fieldset className="form-group auth-form-group">
            <label className="auth-form-label">Email:</label>
            <input {...email} className="form-control" placeholder="First, enter your email and press the button" />
          </fieldset>
          <button className="btn btn-primary reset-password-btn">Send Reset Token to My Email</button>
        </form>
        <form id="auth-reset-password-form" onSubmit={handleSubmit(this.handlePasswordFormSubmit.bind(this))}>
          <fieldset id="form-group">
            <label className="auth-form-label">Reset Token:</label>
            <input {...token} className="form-control" placeholder="Second, enter the token we sent to your email"/>
          </fieldset>
          <fieldset className="form-group">
            <label className="auth-form-label">New Password:</label>
            <input {...password} className="form-control" placeholder="Enter new password" />
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

export default reduxForm({
  form: 'resetPassword',
  fields: ['email', 'password', 'token']
}, null, actions)(ResetPassword);
// export default connect(null, actions)(ResetPassword);
