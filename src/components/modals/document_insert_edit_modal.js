import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import Languages from '../constants/languages';
import DocumentInsert from '../constants/document_insert';
import AppLanguages from '../constants/app_languages';
import FormChoices from '../forms/form_choices';
import RenderDropzoneInput from '../images/render_dropzone_input';

let showHideClassName;

class DocumentInsertEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editDocumentInsertCompleted: false,
      deleteDocumentInsertCompleted: false,
      selectedDocumentInsertId: ''
    };
    // this.handleEditLanguageClick = this.handleEditLanguageClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleDeleteDocumentInsertClick = this.handleDeleteDocumentInsertClick.bind(this);
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
    delta.agreement_id = this.props.agreementId;
    const dataToBeSent = { document_insert: delta, id: this.props.documentInsertId };
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in DocumentInsertEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.editDocumentInsert(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in DocumentInsertEditModal, handleFormSubmitCallback: ');
    this.props.selectedDocumentInsertId('');
    // showHideClassName = 'modal display-none';
    this.setState({ editDocumentInsertCompleted: true });
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

  // turn off showDocumentInsertEditModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    console.log('in documentInsert_edit_modal, handleClose, this.props.showDocumentInsertEdit: ', this.props.showDocumentInsertEdit);

    // if (this.props.showDocumentInsertEdit) {
      this.props.showDocumentInsertEditModal();
      this.props.selectedDocumentInsertId('');
      // this.props.documentInsertToEditId('');
      this.setState({ editDocumentInsertCompleted: false });
    // }
  }

  renderEachDocumentInsertField() {
    let fieldComponent = '';
    return _.map(DocumentInsert, (formField, i) => {
      console.log('in documentInsert_edit_modal, renderEachDocumentInsertField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in documentInsert_edit_modal, renderEachDocumentInsertField, fieldComponent: ', fieldComponent);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}:</label>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: DocumentInsert, record: this.props.documentInsert, create: false } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </fieldset>
      );
    });
  }

  handleDeleteDocumentInsertClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // if the documentInsert is the base documentInsert, give warking
    // if (!this.props.documentInsert.base_record_id) {
    if (window.confirm('Are you sure you want to delete this documentInsert? Deleting this record will delete fields and PDF attached to it.')) {
      this.props.showLoading()
      this.props.deleteDocumentInsert(elementVal, () => this.handleDeleteDocumentInsertCallback());
    }
    // } else {
    //   if (window.confirm('Are you sure you want to delete this language?')) {
    //     this.props.showLoading()
    //     this.props.deleteDocumentInsert(elementVal, () => this.handleDeleteDocumentInsertCallback());
    //   }
    // }
  }

  handleDeleteDocumentInsertCallback() {
    this.setState({ editDocumentInsertCompleted: true, deleteDocumentInsertCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  // handleEditLanguageClick(event) {
  //   const clickedElement = event.target;
  //   const elementVal = clickedElement.getAttribute('value');
  //   this.props.documentInsertToEditId(elementVal);
  // }

  // getDocumentInsertGroup() {
  //   const array = [];
  //   _.each(this.props.auth.user.documentInserts, eachDocumentInsert => {
  //     // console.log('in documentInsert_edit_modal, getDocumentInsertGroup, eachDocumentInsert.id, this.props.selectedDocumentInsertId, eachDocumentInsert.base_record_id, this.props.selectedDocumentInsertId: ', eachDocumentInsert.id, this.props.documentInsertId, eachDocumentInsert.base_record_id, this.props.documentInsertId);
  //     if ((eachDocumentInsert.id == this.props.documentInsertId) || (eachDocumentInsert.base_record_id == this.props.documentInsertId)) {
  //       array.push(eachDocumentInsert);
  //     }
  //   })
  //   return array;
  // }

  // renderEditLanguageLink() {
  //   // get documentInserts with same id and base_record_id, or same documentInsert group of languages
  //   const documentInsertGroup = this.getDocumentInsertGroup();
  //   // return _.map(this.props.auth.user.documentInserts, (eachDocumentInsert, i) => {
  //   console.log('in documentInsert_edit_modal, renderEditLanguageLink, documentInsertGroup: ', documentInsertGroup);
  //   return _.map(documentInsertGroup, (eachDocumentInsert, i) => {
  //     // const baseRecordOrNot = this.baseRecordOrNot(eachDocumentInsert);
  //     if (this.props.documentInsert.id !== eachDocumentInsert.id) {
  //       return (
  //         <div
  //           key={i}
  //           value={eachDocumentInsert.id}
  //           className="modal-edit-language-link"
  //           onClick={this.handleEditLanguageClick}
  //         >
  //           {Languages[eachDocumentInsert.language_code].flag}&nbsp;{Languages[eachDocumentInsert.language_code].name}
  //         </div>
  //       );
  //     }
  //   });
  // }

  renderEditDocumentInsertForm() {

    const { handleSubmit } = this.props;
    // <div className="edit-flat-delete-language-button modal-edit-delete-edit-button-box">

    if (this.props.auth) {
      // console.log('in documentInsert_edit_modal, renderEditDocumentInsertForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // <div className="modal-edit-language-link-box">
      // {this.renderEditLanguageLink()}
      // </div>

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">{AppLanguages.editDocumentInsert[this.props.appLanguageCode]}</h3>
            <div className="modal-edit-delete-edit-button-box">
              <button value={this.props.documentInsert.id} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteDocumentInsertClick}>{AppLanguages.delete[this.props.appLanguageCode]}</button>
            </div>
            <div className="edit-profile-scroll-div">
              {this.renderAlert()}
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                {this.renderEachDocumentInsertField()}
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
          {this.state.deleteDocumentInsertCompleted ?
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
    console.log('in documentInsert_edit_modal, render this.state.editDocumentInsertCompleted: ', this.state.editDocumentInsertCompleted);
    return (
      <div>
        {this.state.editDocumentInsertCompleted ? this.renderPostEditDeleteMessage() : this.renderEditDocumentInsertForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
DocumentInsertEditModal = reduxForm({
  form: 'DocumentInsertEditModal',
  enableReinitialize: true
})(DocumentInsertEditModal);

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
// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in DocumentInsertEditModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state) {
    let initialValues = {};
    // console.log('in DocumentInsertEditModal, mapStateToProps, state.auth.user: ', state.auth.user);
    const agreement = getAgreement(state.bookingData.fetchBookingData.agreements, parseInt(state.modals.selectedAgreementId, 10))
    const documentInsert = getDocumentInsert(agreement.document_inserts, parseInt(state.modals.selectedDocumentInsertId, 10));
    // const editDocumentInsert = getEditDocumentInsert(agreement.documentInserts, parseInt(state.modals.documentInsertToEditId, 10));
    // const date = new Date(documentInsert.documentInsert_date);
    // const dateString = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + ('00' + date.getDate()).slice(-2);
    console.log('in DocumentInsertEditModal, mapStateToProps, documentInsert, agreement: ', documentInsert, agreement);
    // if (state.modals.documentInsertToEditId) {
    //   documentInsert = editDocumentInsert;
    // }
    initialValues = documentInsert;
    // initialValues.documentInsert_date = dateString;
    // console.log('in DocumentInsertEditModal, mapStateToProps, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // userProfile: state.auth.userProfile
      // initialValues: state.auth.userProfile
      // languages: state.languages,
      showDocumentInsertEdit: state.modals.showDocumentInsertEditModal,
      appLanguageCode: state.languages.appLanguageCode,
      documentInsertId: state.modals.selectedDocumentInsertId,
      documentInsert,
      // editDocumentInsertId: state.modals.documentInsertToEditId,
      // editDocumentInsert,
      // language: state.languages.selectedLanguage,
      // set initialValues to be first calendar in array to match selectedDocumentInsertId
      initialValues
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
      // initialValues
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(DocumentInsertEditModal);