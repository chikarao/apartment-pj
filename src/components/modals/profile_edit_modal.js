import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';


import * as actions from '../../actions';

let showHideClassName;

class EditProfileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editProfileCompleted: false
    };
  }

  componentDidMount() {
  }

  handleFormSubmit(data) {
    console.log('in signin, handleFormSubmit, data: ', data);
    this.props.editProfile(data, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in signin, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editProfileCompleted: true })
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Ooops! </strong> {this.props.errorMessage}
        </div>
      );
    }

    // if (this.props.successMessage) {
    //   return (
    //     <div className="alert alert-success success-alert">
    //       {this.props.successMessage}
    //     </div>
    //   );
    // }
  }

  // handleSubmitClick(event) {
  //   // console.log('in modal, in handleAuthClick, event.target:', event.target);
  //   // const clickedElement = event.target;
  //   // const elementVal = clickedElement.getAttribute('value');
  //   // if (elementVal === 'reset-password') {
  //   //   console.log('in modal, in handleAuthClick, if reset-password, true:');
  //   //   this.props.showResetPasswordModal();
  //   //   this.props.showSigninModal();
  //   // } else {
  //   //   this.props.showSigninModal();
  //   // }
  // }

  renderEditProfileForm() {
    const { handleSubmit } = this.props;
    const profileEmpty = _.isEmpty(this.props.auth.userProfile);
    if (!profileEmpty) {
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // console.log('in modal, render showHideClassName:', showHideClassName);
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
        <section className="modal-main">
        <button className="modal-close-button" onClick={this.props.handleClose}><i className="fa fa-window-close"></i></button>
        <h3 className="auth-modal-title">Edit Profile</h3>
        {this.renderAlert()}
        <div className="edit-profile-scroll-div">
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <fieldset className="form-group">
        <label className="create-flat-form-label">Username:</label>
        <Field name="username" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
        <label className="create-flat-form-label">Title:</label>
        <Field name="title" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
        <label className="create-flat-form-label">First Name:</label>
        <Field name="first_name" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
        <label className="create-flat-form-label">Last Name:</label>
        <Field name="last_name" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
        <label className="create-flat-form-label">Birthday:</label>
        <Field name="birthday" component="input" type="date" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
        <label className="create-flat-form-label">Street Address:</label>
        <Field name="address1" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
        <label className="create-flat-form-label">City:</label>
        <Field name="city" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
        <label className="create-flat-form-label">State:</label>
        <Field name="state" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
        <label className="create-flat-form-label">Zip:</label>
        <Field name="zip" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group">
        <label className="create-flat-form-label">Country:</label>
        <Field name="country" component="input" type="string" className="form-control" />
        </fieldset>
        <fieldset className="form-group introduction">
        <label className="create-flat-form-label">Self Intro:</label>
        <Field name="introduction" component="textarea" type="text" className="form-control" />
        </fieldset>
        <div className="confirm-change-and-button">
        <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">Submit</button>
        </div>
        </form>
        </div>
        </section>
        </div>
      );
    }
  }

  renderPostEditMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.props.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">Your profile has been successfully updated.</div>
        </div>
      </div>
    )
  }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.state.editProfileCompleted ? this.renderPostEditMessage() : this.renderEditProfileForm()}
      </div>
    );
  }
}

EditProfileModal = reduxForm({
  form: 'EditProfileModal'
  // fields: [
  //   'address1',
  //   'city',
  //   'zip',
  //   'country',
  //   'area',
  //   'price_per_day',
  //   'price_per_month',
  //   'guests',
  //   'sales_point',
  //   'description',
  //   'rooms',
  //   'beds',
  //   'flat_type',
  //   'bath'
  // ]
})(EditProfileModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in show_flat, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    // userProfile: state.auth.userProfile
    initialValues: state.auth.userProfile
  };
}


export default connect(mapStateToProps, actions)(EditProfileModal);
