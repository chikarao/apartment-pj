import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import Languages from '../constants/languages';
import InsertField from '../constants/insert_field';
import AppLanguages from '../constants/app_languages';
import FormChoices from '../forms/form_choices';
// import RenderDropzoneInput from '../images/render_dropzone_input';

let showHideClassName;

class InsertFieldEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editInsertFieldCompleted: false,
      deleteInsertFieldCompleted: false,
      selectedInsertFieldId: ''
    };
    this.handleEditLanguageClick = this.handleEditLanguageClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleDeleteInsertFieldClick = this.handleDeleteInsertFieldClick.bind(this);
  }
  //
  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    // const { code } = data;
    // this.setState({ selectedLanguage: languages[code].name });
    const delta = {}
    _.each(Object.keys(data), each => {
      // console.log('in edit flat, handleFormSubmit, each, data[each], this.props.initialValues[each]: ', each, data[each], this.props.initialValues[each]);
      if (data[each] !== this.props.initialValues[each]) {
        console.log('in edit flat, handleFormSubmit, each: ', each);
        delta[each] = data[each]
      }
    })
    delta.document_insert_id = this.props.insertField.document_insert_id;
    const dataToBeSent = { insert_field: delta, id: this.props.insertField.id };
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in InsertFieldEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.editInsertField(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in InsertFieldEditModal, handleFormSubmitCallback: ');
    this.props.selectedInsertFieldId('');
    // showHideClassName = 'modal display-none';
    this.setState({ editInsertFieldCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
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

  // turn off showInsertFieldEditModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    console.log('in insert_field_edit_modal, handleClose, this.props.showInsertFieldEdit: ', this.props.showInsertFieldEdit);

    // if (this.props.showInsertFieldEdit) {
      this.props.showInsertFieldEditModal();
      this.props.selectedInsertFieldId('');
      // this.props.insertFieldToEditId('');
      this.setState({ editInsertFieldCompleted: false });
    // }
  }

  renderEachInsertFieldField() {
    let fieldComponent = '';
    return _.map(InsertField, (formField, i) => {
      console.log('in insert_field_edit_modal, renderEachInsertFieldField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in insert_field_edit_modal, renderEachInsertFieldField, fieldComponent: ', fieldComponent);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}:</label>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: InsertField, record: this.props.insertField, create: false } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </fieldset>
      );
    });
  }

  handleDeleteInsertFieldClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // if the insertField is the base insertField, give warking
    // if (!this.props.insertField.base_record_id) {
    if (window.confirm('Are you sure you want to delete this record?')) {
      this.props.showLoading()
      this.props.deleteInsertField(elementVal, () => this.handleDeleteInsertFieldCallback());
    }
    // } else {
    //   if (window.confirm('Are you sure you want to delete this language?')) {
    //     this.props.showLoading()
    //     this.props.deleteInsertField(elementVal, () => this.handleDeleteInsertFieldCallback());
    //   }
    // }
  }

  handleDeleteInsertFieldCallback() {
    this.setState({ editInsertFieldCompleted: true, deleteInsertFieldCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  handleEditLanguageClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.props.selectedInsertFieldId(elementVal);
  }

  getInsertFieldGroup() {
    const array = [];
    _.each(this.props.documentInsert.insert_fields, eachInsertField => {
      // console.log('in insert_field_edit_modal, getInsertFieldGroup, eachInsertField.id, this.props.selectedInsertFieldId, eachInsertField.base_record_id, this.props.selectedInsertFieldId: ', eachInsertField.id, this.props.insertFieldId, eachInsertField.base_record_id, this.props.insertFieldId);
      if (eachInsertField.name == this.props.insertField.name) {
      array.push(eachInsertField);
      }
    });
    return array;
  }

  renderEditLanguageLink() {
    // get insertFields with same id and base_record_id, or same insertField group of languages
    const insertFieldGroup = this.getInsertFieldGroup();
    // return _.map(this.props.auth.user.insertFields, (eachInsertField, i) => {
    console.log('in insert_field_edit_modal, renderEditLanguageLink, insertFieldGroup: ', insertFieldGroup);
    return _.map(insertFieldGroup, (eachInsertField, i) => {
      // const baseRecordOrNot = this.baseRecordOrNot(eachInsertField);
      if (this.props.insertField.id !== eachInsertField.id) {
        return (
          <div
            key={i}
            value={eachInsertField.id}
            className="modal-edit-language-link"
            onClick={this.handleEditLanguageClick}
          >
            {Languages[eachInsertField.language_code].flag}&nbsp;{Languages[eachInsertField.language_code].name}
          </div>
        );
      }
    });
  }

  renderEditInsertFieldForm() {

    const { handleSubmit } = this.props;
    // <div className="edit-flat-delete-language-button modal-edit-delete-edit-button-box">

    if (this.props.auth) {
      console.log('in insert_field_edit_modal, renderEditInsertFieldForm: ');
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // <div className="modal-edit-language-link-box">
      // {this.renderEditLanguageLink()}
      // </div>

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">{AppLanguages.editInsertField[this.props.appLanguageCode]}</h3>
            <div className="modal-edit-delete-edit-button-box">
              <button value={this.props.insertField.id} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteInsertFieldClick}>{AppLanguages.delete[this.props.appLanguageCode]}</button>
              <div className="modal-edit-language-link-box">
                  {this.renderEditLanguageLink()}
              </div>
            </div>
            <div className="edit-profile-scroll-div">
              {this.renderAlert()}
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                {this.renderEachInsertFieldField()}
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
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          {this.state.deleteInsertFieldCompleted ?
            <div className="post-signup-message">The PDF insert has been successfully deleted.</div>
            :
            <div className="post-signup-message">The PDF insert has been successfully updated.</div>
          }
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    console.log('in insert_field_edit_modal, render this.state.editInsertFieldCompleted: ', this.state.editInsertFieldCompleted);
    return (
      <div>
        {this.state.editInsertFieldCompleted ? this.renderPostEditDeleteMessage() : this.renderEditInsertFieldForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
InsertFieldEditModal = reduxForm({
  form: 'InsertFieldEditModal',
  enableReinitialize: true
})(InsertFieldEditModal);

function getDocumentInsert(documentInserts, id) {
  // placeholder for when add lanauge
  let documentInsert = {};
    _.each(documentInserts, eachDocumentInsert => {
      console.log('in insert_field_edit_modal, getDocumentInsert, eachDocumentInsert: ', eachDocumentInsert);
      if (eachDocumentInsert.id == id) {
        documentInsert = eachDocumentInsert;
        return;
      }
    });

  return documentInsert;
}

function getInsertField(insertFields, id) {
  // placeholder for when add lanauge
  let insertField = {};
    _.each(insertFields, eachInsertField => {
        console.log('in insert_field_edit_modal, getInsertField, eachInsertField: ', eachInsertField);
      if (eachInsertField.id == id) {
        insertField = eachInsertField;
        return;
      }
    });

  return insertField;
}

function getAgreement(agreements, id) {
  let agreement = {};
    _.each(agreements, eachAgreement => {
      console.log('in insert_field_edit_modal, getInsertField, eachAgreement: ', eachAgreement);
      if (eachAgreement.id == id) {
        agreement = eachAgreement;
        return;
      }
    });

  return agreement;
}
// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in InsertFieldEditModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state) {
    let initialValues = {};
    // console.log('in InsertFieldEditModal, mapStateToProps, state.auth.user: ', state.auth.user);
    const agreement = getAgreement(state.bookingData.fetchBookingData.agreements, parseInt(state.modals.selectedAgreementId, 10))
    const documentInsert = getDocumentInsert(state.bookingData.documentInserts, parseInt(state.modals.selectedDocumentInsertId, 10));
    const insertField = getInsertField(documentInsert.insert_fields, parseInt(state.modals.selectedInsertFieldId, 10));
    // const editInsertField = getEditInsertField(agreement.documentInserts, parseInt(state.modals.insertFieldToEditId, 10));
    // const date = new Date(documentInsert.documentInsert_date);
    // const dateString = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + ('00' + date.getDate()).slice(-2);
    console.log('in InsertFieldEditModal, mapStateToProps, documentInsert, agreement, insertField: ', documentInsert, agreement, insertField);
    // if (state.modals.documentInsertToEditId) {
    //   documentInsert = editInsertField;
    // }
    initialValues = insertField;
    // initialValues.documentInsert_date = dateString;
    // console.log('in InsertFieldEditModal, mapStateToProps, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // userProfile: state.auth.userProfile
      // initialValues: state.auth.userProfile
      // languages: state.languages,
      showInsertFieldEdit: state.modals.showInsertFieldEditModal,
      appLanguageCode: state.languages.appLanguageCode,
      documentInsertId: state.modals.selectedInsertFieldId,
      documentInsert,
      insertField,
      // editInsertFieldId: state.modals.documentInsertToEditId,
      // editInsertField,
      // language: state.languages.selectedLanguage,
      // set initialValues to be first calendar in array to match selectedInsertFieldId
      initialValues
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
      // initialValues
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(InsertFieldEditModal);
