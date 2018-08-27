import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import languages from '../constants/languages';

let showHideClassName;

class LanguageCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createLanguageCompleted: false,
      selectedLanguage: ''
    };
  }

  componentDidMount() {
  }

  handleFormSubmit(data) {
    const { code } = data;
    this.setState({ selectedLanguage: languages[code].name });
    const dataToBeSent = data;
    dataToBeSent.flat_id = this.props.flat.id;
    console.log('in LanguageCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.createFlatLanguage(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  // emptyInputFields() {
  //   const inputs = document.getElementsByClassName('form-control');
  //   console.log('in LanguageCreateModal, emptyInputFields, inputs: ', inputs);
  //   _.each(inputs, each => {
  //     const inputToChange = each;
  //     console.log('in LanguageCreateModal, emptyInputFields, each: ', each);
  //     inputToChange.setAttribute('value', '');
  //   });
  // }

  // resetAdvancedFilters(){
  //     const fields = ['code', 'address1', 'city', 'state', 'zip', 'country', 'description', 'area', 'sales_point', 'station', 'intro']
  //     _.each(fields, field => {
  //       this.props.dispatch(change('LanguageCreateModal', field, null))
  //       this.props.dispatch(untouch('LanguageCreateModal', field))
  //     })
  //   }

  emptyInputFields() {
   let resetFields = { code: '', address1: '', city: '', state: '', zip: '', country: '', description: '', area: '', sales_point: '', station: '', intro: '' }

    console.log('in LanguageCreateModal, emptyInputFields: ');
    this.props.initialize(resetFields, true); //keepDirty = true;
  }


  handleFormSubmitCallback() {
    console.log('in LanguageCreateModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ createLanguageCompleted: true });
    // this.resetAdvancedFilters();
    this.emptyInputFields();
    this.props.showLoading();
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


  // turn off showLanguageCreateModal app state
  handleClose() {
    if (this.props.showLanguageCreate) {
      this.props.showLanguageCreateModal();
      this.setState({ createLanguageCompleted: false })
    }
  }

  renderLanguageSelectOptions() {
    // console.log('in modal, in renderLanguageSelectOptions, languages:', languages);
    const languageCodesArray = [];
    _.each(this.props.flat.flat_languages, (language) => {
      languageCodesArray.push(language.code);
    });
    return _.map(languages, (v, k) => {
      const languageAlreadyCreated = languageCodesArray.includes(k);
        // console.log('in modal, in renderLanguageSelectOptions, v, k:', v, k);
        if ((this.props.flat.language_code !== k) && !languageAlreadyCreated) {
          return (
            <option key={k} value={k}>{v.flag} {v.name}</option>
          );
        }
    });
  }

  renderCreateLanguageForm() {
    const { handleSubmit } = this.props;
    // const profileEmpty = _.isEmpty(this.props.auth.userProfile);
    if (this.props.flat) {
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // console.log('in modal, render showHideClassName:', showHideClassName);
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
          <section className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title">Create Flat Language</h3>
          {this.renderAlert()}
          <div className="edit-profile-scroll-div">
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <fieldset key={'code'} className="form-group">
              <label className="create-flat-form-label">Select Language:</label>
              <Field name="code" component="select" type="string" className="form-control">
                <option></option>
                {this.renderLanguageSelectOptions()}
              </ Field>
            </fieldset>
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


  renderPostCreateMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">A {this.state.selectedLanguage} language version has been successfully created for your listing.</div>
        </div>
      </div>
    )
  }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.state.createLanguageCompleted ? this.renderPostCreateMessage() : this.renderCreateLanguageForm()}
      </div>
    );
  }
}

LanguageCreateModal = reduxForm({
  form: 'LanguageCreateModal'
})(LanguageCreateModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in show_flat, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    flat: state.selectedFlatFromParams.selectedFlatFromParams,
    // userProfile: state.auth.userProfile
    // initialValues: state.auth.userProfile
    languages: state.languages,
    showLanguageCreate: state.modals.showLanguageCreateModal,
  };
}


export default connect(mapStateToProps, actions)(LanguageCreateModal);
