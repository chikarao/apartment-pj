import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';

import AppLanguages from '../constants/app_languages';
import Profile from '../constants/profile';
import FormChoices from '../forms/form_choices';

// Note: This component is called in header not my page!!!!!!!!
let showHideClassName;

class ProfileCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createProfileCompleted: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    // console.log('in signin, handleFormSubmit, data: ', data);
    const delta = {}
    _.each(Object.keys(data), each => {
      // console.log('in edit flat, handleFormSubmit, each, data[each], this.props.initialValues[each]: ', each, data[each], this.props.initialValues[each]);
      if (data[each] !== this.props.initialValues[each]) {
        console.log('in edit flat, handleFormSubmit, each: ', each);
        delta[each] = data[each]
      }
    })
    this.props.createProfile(delta, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    // console.log('in signin, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ createProfileCompleted: true });
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

  handleClose() {
    // console.log('in profile_edit_modal, handleClose, this.props.showProfileEdit: ', this.props.showProfileEdit);
      this.props.showProfileCreateModal();
      this.props.selectedProfileId('');
      this.setState({ createProfileCompleted: false });
  }

  renderEachInputField() {
    let fieldComponent = '';

    return _.map(Profile, (formField, i) => {
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
        // console.log('in profile_edit_modal, in renderEachInputField, formField:', formField);
        // console.log('in profile_edit_modal, in renderEachInputField, Profile.language_code, this.props.profile, this.props.profile.language_code:', Profile.language_code, this.props.profile, this.props.profile.language_code);
      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField[this.props.appLanguageCode]}:</label>
          <Field
            name={formField.name}
            component={fieldComponent}
            props={fieldComponent == FormChoices ? { model: Profile, record: this.props.profile, create: true, existingLanguageArray: this.props.profileLanguageArray } : {}}
            type={formField.type}
            className={formField.component == 'input' || 'textarea' ? 'form-control' : ''}
            />
        </fieldset>
      );
    })
  }

  renderCreateProfileForm() {
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
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title">{AppLanguages.createProfile[this.props.appLanguageCode]}</h3>
          {this.renderAlert()}
          <div className="edit-profile-scroll-div">
            <form onSubmit={handleSubmit(this.handleFormSubmit)}>
              {this.renderEachInputField()}
              <div className="confirm-change-and-button">
              <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">{AppLanguages.submit[this.props.appLanguageCode]}</button>
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
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">Your profile has been successfully created.</div>
        </div>
      </div>
    )
  }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.state.createProfileCompleted ? this.renderPostEditMessage() : this.renderCreateProfileForm()}
      </div>
    );
  }
}

ProfileCreateModal = reduxForm({
  form: 'ProfileCreateModal'
})(ProfileCreateModal);

function getLanguageArray(profiles) {
  let array = [];
  _.each(profiles, eachProfile => {
    // if (!array.includes(eachProfile.language_code)) {
    if (array.indexOf(eachProfile.language_code) === -1) {
      array.push(eachProfile.language_code)
    }
  });
  return array;
}

function getInitialValues(profile) {
  const objectReturned = {};
  _.each(Object.keys(Profile), eachAttribute => {
    // if attribute is indepedent of language (just numbers or buttons)
    if (Profile[eachAttribute].language_independent) {
      // add to object to be assiged to initialValues
      objectReturned[eachAttribute] = profile[eachAttribute];
    }
  });
  // add base_record_id that references the original profile that was created
  // having this identifies profile group to which profile belongs
  // objectReturned.base_record_id = profile.id;
  return objectReturned;
}

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  let initialValues = {};
  const { profiles } = state.auth.user;
  console.log('in profile_create_modal, mapStateToProps, profiles: ', profiles);
  const profile = state.auth.user.profiles[0];
  const profileLanguageArray = getLanguageArray(profiles);
  initialValues = getInitialValues(profile);

  console.log('in profile_create_modal, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    // userProfile: state.auth.userProfile
    appLanguageCode: state.languages.appLanguageCode,
    profile,
    profileLanguageArray,
    showProfileCreate: state.modals.showProfileCreateModal,
    initialValues
  };
}


export default connect(mapStateToProps, actions)(ProfileCreateModal);
