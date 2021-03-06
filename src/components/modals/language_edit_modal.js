import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import languages from '../constants/languages';
import AppLanguages from '../constants/app_languages';

let showHideClassName;

class LanguageEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editLanguageCompleted: false,
      deleteLanguageCompleted: false,
      selectedLanguage: '',
      languageCode: ''
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleDeleteLanguageClick = this.handleDeleteLanguageClick.bind(this);
  }
  //
  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    const { language_code } = data;
    this.setState({ selectedLanguage: languages[language_code].name });
    const dataToBeSent = data;
    dataToBeSent.flat_id = this.props.flat.id;
    console.log('in LanguageEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.updateFlatLanguage(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in LanguageEditModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editLanguageCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  handleDeleteLanguageClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');
    console.log('in show_flat, handleDeleteLanguageClick, elementVal: ', elementVal);
    this.props.showLoading();
    this.setState({ languageCode: elementName });
    this.props.deleteFlatLanguage({ id: elementVal, flat_id: this.props.flat.id }, () => this.handleDeleteLanguageCallback());
  }

  handleDeleteLanguageCallback() {
    this.setState({ deleteLanguageCompleted: true, editLanguageCompleted: true, selectedLanguage: languages[this.state.languageCode].name }, () => {
      this.props.showLoading()
    });
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

  // turn off showLanguageEditModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    if (this.props.showLanguageEdit) {
      this.props.showLanguageEditModal();
      this.setState({ editLanguageCompleted: false, deleteLanguageCompleted: false });
    }
  }

  renderEditLanguageForm() {
    const { handleSubmit } = this.props;

    if (this.props.language) {
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Edit Flat Language</h3>

            <div className="edit-profile-scroll-div">
              <div className="edit-flat-delete-language-button">
                <button name={this.props.language.code} value={this.props.language.id} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteLanguageClick}>Delete</button>
              </div>
              <div key={'code'} className="edit-flat-delete-language-language-box">
                <label className="edit-flat-delete-language-language-label">Language:</label>
                <div className="edit-flat-language-delete-language">{this.props.language.language_code ? <div>{languages[this.props.language.language_code].flag} {languages[this.props.language.language_code].name}</div> : ''}</div>
              </div>
              {this.renderAlert()}
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>
              <fieldset key={'address1'} className="form-group">
                <label className="create-flat-form-label">Street Address:</label>
                <Field name="address1" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'city'} className="form-group">
                <label className="create-flat-form-label">City:</label>
                <Field name="city" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'state'} className="form-group">
                <label className="create-flat-form-label">State:</label>
                <Field name="state" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'zip'} className="form-group">
                <label className="create-flat-form-label">Zip:</label>
                <Field name="zip" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'country'} className="form-group">
                <label className="create-flat-form-label">Country:</label>
                <Field name="country" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'description'} className="form-group">
                <label className="create-flat-form-label">Description:</label>
                <Field name="description" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'area'} className="form-group">
                <label className="create-flat-form-label">Area:</label>
                <Field name="area" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'sales_point'} className="form-group">
                <label className="create-flat-form-label">Sales Point:</label>
                <Field name="sales_point" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'station'} className="form-group">
                <label className="create-flat-form-label">Nearest Station:</label>
                <Field name="station" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'owner_name'} className="form-group">
                <label className="create-flat-form-label">Owner Name (property title):</label>
                <Field name="owner_name" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset className="form-group">
                <div style={{ float: 'left', paddingLeft: '20px', fontStyle: 'italic' }}><span style={{ color: 'red' }}>*</span>{AppLanguages.ifOwnerDifferent[this.props.appLanguageCode]}</div>
              </fieldset>
              <fieldset key={'owner_contact_name'} className="form-group">
                <label className="create-flat-form-label">Owner Contact Name:</label>
                <Field name="owner_contact_name" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'owner_address'} className="form-group">
                <label className="create-flat-form-label">Owner Address:</label>
                <Field name="owner_address" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'ownership_rights'} className="form-group">
                <label className="create-flat-form-label">Ownership Rights:</label>
                <Field name="ownership_rights" component="input" type="text" className="form-control" />
              </fieldset>
              <fieldset key={'other_rights'} className="form-group">
                <label className="create-flat-form-label">Other Rights than Ownership:</label>
                <Field name="other_rights" component="input" type="text" className="form-control" />
              </fieldset>
              <fieldset key={'intro'} className="form-group">
                <label className="create-flat-form-label">Intro:</label>
                <Field name="intro" component="textarea" type="text" className="form-control flat-intro-input" />
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


  renderPostEditDeleteMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          {this.state.deleteLanguageCompleted ?
            <div className="post-action-message">The {this.state.selectedLanguage} language version has been deleted.</div>
            :
            <div className="post-action-message">The {this.state.selectedLanguage} language version has been successfully updated.</div>
          }
        </div>
      </div>
    )
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.editLanguageCompleted ? this.renderPostEditDeleteMessage() : this.renderEditLanguageForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
LanguageEditModal = reduxForm({
  form: 'LanguageEditModal',
  enableReinitialize: true
})(LanguageEditModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in LanguageEditModal, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    flat: state.selectedFlatFromParams.selectedFlatFromParams,
    // userProfile: state.auth.userProfile
    // initialValues: state.auth.userProfile
    // languages: state.languages,
    showLanguageEdit: state.modals.showLanguageEditModal,
    language: state.languages.selectedLanguage,
    initialValues: state.languages.selectedLanguage,
    appLanguageCode: state.languages.appLanguageCode,
  };
}


export default connect(mapStateToProps, actions)(LanguageEditModal);
