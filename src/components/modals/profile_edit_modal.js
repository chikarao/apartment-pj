import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';

import AppLanguages from '../constants/app_languages';
import Languages from '../constants/languages';

import Profile from '../constants/profile';
import FormChoices from '../forms/form_choices';

// Note: This component is called in header not my page!!!!!!!!
let showHideClassName;

class ProfileEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editProfileCompleted: false,
      deleteProfileCompleted: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleEditLanguageClick = this.handleEditLanguageClick.bind(this);
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
    delta.id = this.props.initialValues.id;
    this.props.editProfile(delta, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    // console.log('in signin, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editProfileCompleted: true });
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

  handleDeleteProfileClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in staff_edit_modal, renderEditLanguageLink, elementVal: ', elementVal);
    this.props.deleteProfile(elementVal, () => this.handleDeleteProfileCallback());
  }

  handleDeleteProfileCallback() {
    // console.log('in signin, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ deleteProfileCompleted: true, editProfileCompleted: true });
  }

  handleEditLanguageClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.props.profileToEditId(elementVal);
  }


  renderEditLanguageLink() {
    // get staffs with same id and base_record_id, or same staff group of languages
    // return _.map(this.props.auth.user.staffs, (eachProfile, i) => {
    console.log('in staff_edit_modal, renderEditLanguageLink, this.props.auth.user.profiles: ', this.props.auth.user.profiles);
    return _.map(this.props.auth.user.profiles, (eachProfile, i) => {
      // const baseRecordOrNot = this.baseRecordOrNot(eachProfile);
      if (this.props.profile.id !== eachProfile.id) {
        return (
          <div
            key={i}
            value={eachProfile.id}
            className="modal-edit-language-link"
            onClick={this.handleEditLanguageClick}
          >
            {Languages[eachProfile.language_code].flag}&nbsp;{Languages[eachProfile.language_code].name}
          </div>
        );
      }
    });
  }

  handleClose() {
    console.log('in profile_edit_modal, handleClose, this.props.showProfileEdit: ', this.props.showProfileEdit);
      this.props.showProfileEditModal();
      this.props.selectedProfileId('');
      this.setState({ editProfileCompleted: false });
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
            props={fieldComponent == FormChoices ? { model: Profile, record: this.props.profile, create: false } : {}}
            type={formField.type}
            className={formField.component == 'input' || 'textarea' ? 'form-control' : ''}
            />
        </fieldset>
      );
    })
  }

  renderEditProfileForm() {
    const { handleSubmit } = this.props;
    const profileEmpty = _.isEmpty(this.props.auth.user.profiles[0]);
    if (!profileEmpty) {
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // console.log('in modal, render showHideClassName:', showHideClassName);
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
          <section className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title">{AppLanguages.editProfile[this.props.appLanguageCode]}</h3>
          <div className="modal-edit-delete-edit-button-box">
            {this.props.auth.user.profiles.length > 1 ?
              <button value={this.props.profile.id} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteProfileClick.bind(this)}>{AppLanguages.delete[this.props.appLanguageCode]}</button>
              :
              ''
            }
            <div className="modal-edit-language-link-box">
              {this.renderEditLanguageLink()}
            </div>
          </div>
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
          {this.state.deleteProfileCompleted ?
            <div className="post-action-message">Your profile has been successfully deleted.</div>
            :
            <div className="post-action-message">Your profile has been successfully updated.</div>
          }
        </div>
      </div>
    );
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

ProfileEditModal = reduxForm({
  form: 'ProfileEditModal',
  enableReinitialize: true
})(ProfileEditModal);

function getProfile(profiles, id) {
  // placeholder for when add lanauge
  let profile = {};
    _.each(profiles, eachProfile => {
      console.log('in staff_create_modal, getProfile, eachProfile: ', eachProfile);
      if (eachProfile.id == id) {
        profile = eachProfile;
        return;
      }
    });

  return profile;
}

function getEditProfile(profiles, id) {
  // placeholder for when add lanauge
  let profile = {};
    _.each(profiles, eachProfile => {
      console.log('in profile_edit_modal, getEditProfile, eachProfile: ', eachProfile);
      if (eachProfile.id == id) {
        profile = eachProfile;
        return;
      }
    });

  return profile;
}

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  let initialValues = {};
  // console.log('in profile_edit_modal, mapStateToProps, state: ', state);
  const { profiles } = state.auth.user;
  let profile = getProfile(profiles, state.modals.selectedProfileId);
  const editProfile = getEditProfile(profiles, parseInt(state.modals.profileToEditId, 10));

  if (state.modals.profileToEditId) {
    console.log('in profile_edit_modal, mapStateToProps, editProfile: ', editProfile);
    profile = editProfile;
  }

  initialValues = profile;
  console.log('in profile_edit_modal, mapStateToProps, initialValues: ', initialValues);

  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    // user: state.auth.user,
    appLanguageCode: state.languages.appLanguageCode,
    profile,
    profileId: state.modals.selectedProfileId,
    showProfileEdit: state.modals.showProfileEditModal,
    initialValues
  };
}


export default connect(mapStateToProps, actions)(ProfileEditModal);
