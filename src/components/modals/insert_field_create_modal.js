import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import * as actions from '../../actions';
import languages from '../constants/languages';
import InsertField from '../constants/insert_field';
import AppLanguages from '../constants/app_languages';
import FormChoices from '../forms/form_choices';
// import RenderDropzoneInput from '../images/render_dropzone_input';


let showHideClassName;

class InsertFieldCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createInsertFieldCompleted: false,
      deleteInsertFieldCompleted: false,
      selectedInsertFieldId: ''
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  //
  // componentDidMount() {
  // }

  getRequiredKeys() {
    const array = [];
    _.each(Object.keys(InsertField), eachKey => {
      // if the object has the key, that is the page the key is on
      // so set page variable so we can get choices from input key

      if (InsertField[eachKey].required) {
        array.push(eachKey);
      }
    });
    // console.log('in create_edit_document, getRequiredKeys array: ', array);
    return array;
  }

  checkIfRequiredKeysNull(requiredKeysArray, data) {
    // console.log('in create_edit_document, checkIfRequiredKeysNull, requiredKeys, data: ', requiredKeys, data);
    const array = [];
    _.each(requiredKeysArray, eachKey => {
      // console.log('in create_edit_document, checkIfRequiredKeysNull, eachKey, eachKey, data[eachKey], typeof data[eachKey], data[eachKey] == : ', requiredKeys, eachKey, data[eachKey], typeof data[eachKey], data[eachKey] == ('' || undefined || null));
      if (data[eachKey] == (undefined || null)) {
        array.push(eachKey);
      }
      // for some reason, empty string does not return true to == ('' || undefined || null)
      // so separate out
      if (data[eachKey] == '') {
        array.push(eachKey);
      }
    });
    // console.log('in create_edit_document, checkIfRequiredKeysNull array', array);
    return array;
  }

  handleFormSubmit(data) {
    // const { code } = data;
    // this.setState({ selectedLanguage: languages[code].name });
    // const delta = {}
    // _.each(Object.keys(data), each => {
    //   // console.log('in edit flat, handleFormSubmit, each, data[each], this.props.initialValues[each]: ', each, data[each], this.props.initialValues[each]);
    //   if (data[each] !== this.props.initialValues[each]) {
    //     console.log('in edit flat, handleFormSubmit, each: ', each);
    //     delta[each] = data[each]
    //   }
    // })
    // const dataToBeSent = { insertField: data };
    // const dataToBeSent = { insertField: data, id: this.props.insertFieldId };
    // dataToBeSent.flat_id = this.props.flat.id;
    // console.log('in InsertFieldCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    console.log('in InsertFieldCreateModal, handleFormSubmit, data: ', data);
    // this.props.showLoading();
    // this.props.createInsertField(dataToBeSent, () => {
    //   this.handleFormSubmitCallback();
    // });
    let requiredKeysArray = [];
    let requiredKeysNull = true;
    requiredKeysArray = this.getRequiredKeys();
    requiredKeysNull = this.checkIfRequiredKeysNull(requiredKeysArray, data);

    if (!(requiredKeysNull.length > 0)) {
      console.log('in InsertFieldCreateModal, handleFormSubmit, requiredKeysNull: ', requiredKeysNull);
      this.props.showLoading();
      const dataToBeSent = { insert_field: data };
      dataToBeSent.insert_field.document_insert_id = this.props.documentInsertId;
      this.props.createInsertField(dataToBeSent, () => this.handleFormSubmitCallback());
    } else {
      this.props.authError('Please provide input for all fields.');
    }
  }

  handleFormSubmitCallback() {
    console.log('in InsertFieldCreateModal, handleFormSubmitCallback: ');
    // this.props.selectedInsertFieldId('');
    // showHideClassName = 'modal display-none';
    this.setState({ createInsertFieldCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.authError('');
    this.props.showLoading();
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>!! </strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  // turn off showInsertFieldCreateModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    console.log('in insertField_create_modal, handleClose, this.props.showInsertFieldCreate: ', this.props.showInsertFieldCreate);

    // if (this.props.showInsertFieldCreate) {
      this.props.showInsertFieldCreateModal();
      // this.props.selectedInsertFieldId('');
      // this.props.addNew ? this.props.addNewInsertField() : '';
      this.setState({ createInsertFieldCompleted: false });
    // }
  }

  renderEachInsertFieldField() {
    let fieldComponent = '';
    return _.map(InsertField, (formField, i) => {
      // console.log('in insertField_create_modal, renderEachInsertFieldField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      console.log('in insertField_create_modal, renderEachInsertFieldField, fieldComponent: ', fieldComponent);
      // console.log('in insertField_create_modal, renderEachInsertFieldField, fieldComponent: ', fieldComponent);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}{formField.noColon ? '' : ':'}</label>
          <Field
            name={formField.name}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: InsertField, record: this.props.documentInsert, create: true, existingLanguageArray: [], insertFieldObject: this.props.insertFieldObject } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
          />
        </fieldset>
      );
    });
  }

  handleDeleteInsertFieldClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.props.showLoading();
    this.props.deleteInsertField(elementVal, () => this.handleDeleteInsertFieldCallback());
  }

  handleDeleteInsertFieldCallback() {
    this.setState({ createInsertFieldCompleted: true, deleteInsertFieldCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  renderCreateInsertFieldForm() {
    // console.log('in insertField_create_modal, renderCreateInsertFieldForm, this.props.showInsertFieldCreate: ', this.props.showInsertFieldCreate);
    // console.log('in insertField_create_modal, renderCreateInsertFieldForm, this.props.insertFieldObject: ', this.props.insertFieldObject);
    // <h3 className="auth-modal-title">{this.props.addNew ? AppLanguages.createInsertField[this.props.appLanguageCode] : AppLanguages.addInsertFieldLanguage[this.props.appLanguageCode]}</h3>

    const { handleSubmit } = this.props;

    if (this.props.auth) {
      // console.log('in insertField_create_modal, renderCreateInsertFieldForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">{AppLanguages.createInsertField[this.props.appLanguageCode]}</h3>
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


  renderPostCreateMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          {this.state.deleteInsertFieldCompleted ?
            <div className="post-signup-message">The insertField has been successfully deleted.</div>
            :
            <div className="post-signup-message">The insertField has been successfully created.</div>
          }
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    console.log('in insertField_create_modal, render this.state.createInsertFieldCompleted: ', this.state.createInsertFieldCompleted);
    return (
      <div>
        {this.state.createInsertFieldCompleted ? this.renderPostCreateMessage() : this.renderCreateInsertFieldForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
InsertFieldCreateModal = reduxForm({
  form: 'InsertFieldCreateModal',
  enableReinitialize: true
})(InsertFieldCreateModal);

// function getExistingLanguages(insertFields) {
//   const array = []
//   // _.each()
//   return array;
// }

function getDocumentInsert(documentInserts, id) {
  // placeholder for when add lanauge
  let documentInsert = {};
    _.each(documentInserts, eachDocumentInsert => {
      console.log('in documentInsert_edit_modal, getDocumentInsert, eachDocumentInsert: ', eachDocumentInsert);
      if (eachDocumentInsert.id == id) {
        documentInsert = eachDocumentInsert;
        return;
      }
    });

  return documentInsert;
}

function getAgreement(agreements, id) {
  let agreement = {};
    _.each(agreements, eachAgreement => {
      console.log('in documentInsert_edit_modal, getDocumentInsert, eachAgreement: ', eachAgreement);
      if (eachAgreement.id == id) {
        agreement = eachAgreement;
        return;
      }
    });

  return agreement;
}

function getInsertField(insertFields, id) {
  // placeholder for when add lanauge
  let insertField = {};
    _.each(insertFields, eachInsertField => {
      console.log('in insertField_create_modal, getInsertField, eachInsertField: ', eachInsertField);
      if (eachInsertField.id == id) {
        insertField = eachInsertField;
        return;
      }
    });

  return insertField;
}

function getInitialValues(insertField) {
  const objectReturned = {};
  _.each(Object.keys(InsertField), eachAttribute => {
    // if attribute is indepedent of language (just numbers or buttons)
    if (InsertField[eachAttribute].language_independent) {
      // add to object to be assiged to initialValues
      objectReturned[eachAttribute] = insertField[eachAttribute];
    }
  });
  // add base_record_id that references the original insertField that was created
  objectReturned.base_record_id = insertField.id;
  return objectReturned;
}

// function getLanguageArray(insertFields, baseInsertField) {
//   let array = [];
//   _.each(insertFields, eachInsertField => {
//     if (eachInsertField.base_record_id == baseInsertField.id) {
//       if (!array.includes(eachInsertField.language_code)) {
//         array.push(eachInsertField.language_code);
//       }
//       if (!array.includes(baseInsertField.language_code)) {
//         array.push(baseInsertField.language_code);
//       }
//     }
//   });
//   return array;
// }

function getExistingInsertFieldsObject(insertFields) {
  let objectReturned = {};
  _.each(insertFields, eachField => {
    if (!objectReturned[eachField.name]) {
      objectReturned[eachField.name] = [];
      objectReturned[eachField.name].push(eachField.language_code);
    } else {
      if (!objectReturned[eachField.name].includes(eachField.language_code)) {
        objectReturned[eachField.name].push(eachField.language_code);
      }
    }
  });
  return objectReturned;
}

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in InsertFieldCreateModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state) {
    let initialValues = {};
    // initialValues.language_code = 'en';
    // // console.log('in InsertFieldCreateModal, mapStateToProps, state.auth.user: ', state.auth.user);
    // const agreement = getAgreement(state.bookingData.fetchBookingData.agreements, parseInt(state.modals.selectedAgreementId, 10))
    const documentInsert = getDocumentInsert(state.bookingData.documentInserts, parseInt(state.modals.selectedDocumentInsertId, 10));
    // let insertField = {};
    // let insertFieldLanguageArray = []
    // // if user click is not to create a brand new insertField; ie add a language
    // if (!state.modals.addNewInsertField) {
    //   insertField = getInsertField(insertFields, state.modals.selectedInsertFieldId);
    //   insertFieldLanguageArray = getLanguageArray(insertFields, insertField);
    //   initialValues = getInitialValues(insertField);
    // }
    // console.log('in InsertFieldCreateModal, mapStateToProps, agreement, documentInsert: ', agreement, documentInsert);
    // console.log('in InsertFieldCreateModal, mapStateToProps, insertField: ', insertField);
    // const existingLanguagesArray = getExistingLanguages(insertFields);
    const existingInsertFieldsObject = getExistingInsertFieldsObject(documentInsert.insertFields);
    console.log('in InsertFieldCreateModal, mapStateToProps, existingInsertFieldsObject: ', existingInsertFieldsObject);
    // initialValues = insertField;
    // // initialValues.insertField_date = dateString;
    // console.log('in InsertFieldCreateModal, mapStateToProps, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      // flat: state.selectedFlatFromParams.selectedFlatFromParams,
      showInsertFieldCreate: state.modals.showInsertFieldCreateModal,
      appLanguageCode: state.languages.appLanguageCode,
      // insertFieldId: state.modals.selectedInsertFieldId,
      // insertField,
      documentInsert,
      // addNew: state.modals.addNewInsertField,
      // insertFieldLanguageArray,
      // set initialValues to be first calendar in array to match selectedInsertFieldId
      // initialValues
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(InsertFieldCreateModal);
