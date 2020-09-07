import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import * as actions from '../../actions';
import Languages from '../constants/languages';
import DocumentInsert from '../constants/document_insert';
import AppLanguages from '../constants/app_languages';
import FormChoices from '../forms/form_choices';
import RenderDropzoneInput from '../images/render_dropzone_input';
import globalConstants from '../constants/global_constants';

let showHideClassName;
const FILE_FIELD_NAME = 'files';
const ROOT_URL = globalConstants.rootUrl;

// Works for both agreement edit and documentInsert edit
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
    // const delta = {}
    // _.each(Object.keys(data), each => {
    //   // console.log('in edit flat, handleFormSubmit, each, data[each], this.props.initialValues[each]: ', each, data[each], this.props.initialValues[each]);
    //   if (data[each] !== this.props.initialValues[each]) {
    //     console.log('in edit flat, handleFormSubmit, each: ', each);
    //     delta[each] = data[each];
    //   }
    // });
    // delta.agreement_id = this.props.agreementId;
    const dataToChange = data;
    dataToChange.agreement_id = this.props.agreementId;

    this.props.showLoading();

    const imageFiles = data.files ? data.files : [];
    // NOTE: Don't use delta since there may be no changes in agreement keys;
    // If just a chnage in image, the strong params require agreement params
    // will get tripped in backend
    // this.handleCreateImages(imageFiles, delta);
    this.handleCreateImages(imageFiles, dataToChange);
  }

  handleCreateImages(files, data) {
    console.log('in edit_document_inset, handleCreateImages, data: ', data);
    const formData = new FormData();
    if (files[0]) formData.append('file', files[0]);
    let dataToBeSent = null;
    if (!this.props.uploadOwnDocument) {
      dataToBeSent = { document_insert: data, id: this.props.documentInsertId };
      dataToBeSent.document_insert.agreement_id = this.props.agreementId;
      if (data.insert_name) formData.append('document_insert[insert_name]', data.insert_name);
      // Test for null since value could zero
      if (data.insert_after_page !== null) formData.append('document_insert[insert_after_page]', data.insert_after_page)
      formData.append('id', this.props.documentInsertId);
      formData.append('document_insert[agreement_id]', this.props.agreementId);
      this.props.editDocumentInsert(formData, () => this.handleFormSubmitCallback());
    } else {
      if (data.insert_name) formData.append('agreement[document_name]', data.insert_name);
      if (data.language_code) formData.append('agreement[language_code]', data.language_code);
      formData.append('id', this.props.agreementId);
      if (!this.props.editFlat) formData.append('agreement[booking_id]', this.props.booking.id);
      if (this.props.editFlat) formData.append('edit_flat', true);
      // console.log('in edit_document_inset, handleCreateImages, this.props.agreementId: ', this.props.agreementId);
      this.props.editAgreement(formData, () => this.handleFormSubmitCallback());
    }
  }

//   handleCreateImages0(files, data) {
//     console.log('in DocumentInsertCreateModal, handleCreateImages, files:', files);
//
//     const imagesArray = [];
//     let uploaders = [];
//     let pages = '';
//     let pageSize = '';
//   // Push all the axios request promise into a single array
//     if (files.length > 0) {
//       uploaders = files.map((file) => {
//         console.log('in Upload, handleDrop, uploaders, file: ', file);
//         // Initial FormData
//         const formData = new FormData();
//         formData.append('file', file);
//         // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
//         // console.log('in create_flat, handleDrop, uploaders, formData file: ', formData.get('file'));
//         return axios.post(`${ROOT_URL}/api/v1/images/upload`, formData, {
//           headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
//         }).then(response => {
//           // const data = response.data;
//           console.log('in Upload, handleDrop, uploaders, .then, response.data.public_id ', response);
//           const filePublicId = response.data.data.response.public_id;
//           pages = response.data.data.response.pages;
//           pageSize = `${response.data.data.response.width},${response.data.data.response.height}`;
//           // You should store this URL for future references in your app
//           imagesArray.push(filePublicId);
//           // call create image action, send images Array with flat id
//         });
//         //end of then
//       });
//       //end of uploaders
//     }
//   console.log('in Upload, handleDrop, uploaders: ', uploaders);
//   // Once all the files are uploaded
//   axios.all(uploaders).then(() => {
//     // ... perform after upload is successful operation
//     console.log('in Upload, handleCreateImages, axios all, then, imagesArray: ', imagesArray);
//     // if there are no images, call do not create images and just call createImageCallback
//     let dataToBeSent = {};
//     if (imagesArray.length > 0) {
//       if (!this.props.uploadOwnDocument) {
//         dataToBeSent = { document_insert: data, id: this.props.documentInsertId };
//         // this.createImageCallback(imagesArray, 0, flatId);
//         // this.props.createImage(imagesArray, imageCount, flatId, (array, countCb, id) => this.createImageCallback(array, countCb, id));
//         dataToBeSent.document_insert.publicid = imagesArray[0];
//         dataToBeSent.document_insert.pages = pages;
//         dataToBeSent.document_insert.page_size = pageSize;
//         dataToBeSent.document_insert.agreement_id = this.props.agreementId;
//         this.props.editDocumentInsert(dataToBeSent, () => this.handleFormSubmitCallback());
//       } else {
//         const dataToChange = data;
//         dataToChange.document_name = data.insert_name;
//         dataToChange.booking_id = this.props.booking.id;
//         dataToChange.document_publicid = imagesArray[0];
//         dataToChange.document_pages = pages;
//         dataToChange.document_page_size = pageSize;
//         dataToBeSent = { agreement: dataToChange, id: this.props.agreementId };
//         this.props.editAgreement(dataToBeSent, () => this.handleFormSubmitCallback());
//       }
//     } else {
//       if (!this.props.uploadOwnDocument) {
//         dataToBeSent = { document_insert: data, id: this.props.documentInsertId };
//         dataToBeSent.document_insert.agreement_id = this.props.agreementId;
//         this.props.editDocumentInsert(dataToBeSent, () => this.handleFormSubmitCallback());
//       } else {
//         const dataToChange = data;
//         // dataToChange.document_publicid = imagesArray[0];
//         dataToChange.document_name = data.insert_name;
//         dataToChange.booking_id = this.props.booking.id;
//         dataToBeSent = { agreement: dataToChange, id: this.props.agreementId };
//         this.props.editAgreement(dataToBeSent, () => this.handleFormSubmitCallback());
//       }
//     }
//   });
// }

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
    // console.log('in documentInsert_edit_modal, handleClose, this.props.showDocumentInsertEdit: ', this.props.showDocumentInsertEdit);
      this.props.showDocumentInsertEditModal();
      this.props.selectedDocumentInsertId('');
      this.setState({ editDocumentInsertCompleted: false });
  }

  renderEachDocumentInsertField() {
    let fieldComponent = '';
    const insert = (!this.props.uploadOwnDocument && !this.props.templateCreate);
    console.log('in documentInsert_edit_modal, renderEachDocumentInsertField, this.props.agreement, this.props.documentInsert: ', this.props.agreement, this.props.documentInsert);

    const renderField = (formField, i) => {
      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}:</label>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent === FormChoices ? { model: DocumentInsert, record: this.props.documentInsert, create: false, agreement: this.props.agreement } : {}}
            type={formField.type}
            style={formField.component === 'input' ? { width: formField.width } : {}}
            className={formField.component === 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </fieldset>
      );
    }

    return _.map(DocumentInsert, (formField, i) => {
      console.log('in documentInsert_edit_modal, renderEachDocumentInsertField, formField: ', formField);
      if (formField.component === 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in documentInsert_edit_modal, renderEachDocumentInsertField, fieldComponent: ', fieldComponent);
      if (insert && (formField.insert || formField.all)) return renderField(formField, i);

      if (!insert && (!formField.insert || formField.all)) return renderField(formField, i);
    });
  }

  handleDeleteDocumentInsertClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // if the documentInsert is the base documentInsert, give warking
    // if (!this.props.documentInsert.base_record_id) {
    if (!this.props.uploadOwnDocument) {
      if (window.confirm('Are you sure you want to delete this documentInsert? Deleting this record will delete fields and PDF attached to it.')) {
        this.props.showLoading();
        this.props.deleteDocumentInsert(elementVal, () => this.handleDeleteDocumentInsertCallback());
      }
    } else {
      if (window.confirm('Are you sure you want to delete this document?')) {
        this.props.showLoading();
        // this.props.deleteOwnDocumentCompleted();
        this.props.deleteAgreement(elementVal, () => this.handleDeleteDocumentInsertCallback());
      }
    }
    // } else {
    //   if (window.confirm('Are you sure you want to delete this language?')) {
    //     this.props.showLoading()
    //     this.props.deleteDocumentInsert(elementVal, () => this.handleDeleteDocumentInsertCallback());
    //   }
    // }
  }

  handleDeleteDocumentInsertCallback() {
    this.setState({ editDocumentInsertCompleted: true, deleteDocumentInsertCompleted: true }, () => {
      console.log('in documentInsert_edit_modal, handleDeleteDocumentInsertCallback, handleDeleteDocumentInsertCallback this.state.editDocumentInsertCompleted: ', this.state.editDocumentInsertCompleted);
      // Close document prop passed in props in call in bookingConfirmation after deleting agreement
      if (this.props.uploadOwnDocument) this.props.closeDocument();
    });
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

  renderDocumentInsertImage() {
    // console.log('in documentInsert_edit_modal, renderDocumentInsertImage, this.props.documentInsert: ', this.props.documentInsert);
    // let image = null;
    const image = this.props.uploadOwnDocument ? this.props.agreement.document_publicid : this.props.documentInsert.publicid
    // image = this.props.documentInsert && this.props.documentInsert.publicid ? this.props.documentInsert.publicid : image;
    // image = this.props.agreement && this.props.agreement.document_publicid ? this.props.agreement.document_publicid : image;
    // console.log('in documentInsert_edit_modal, renderDocumentInsertImage, image: ', image);
    if (image) {
      return (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`http://res.cloudinary.com/chikarao/image/upload/${image}.pdf`}
        >
          <div
            className="document-insert-modal-image"
            style={{ backgroundImage: `url(http://res.cloudinary.com/chikarao/image/upload/w_100,h_142,q_60,pg_1/${image}.jpg)` }}
          >
          </div>
        </a>
      );
    }
  }

  renderEditDocumentForm() {
    const { handleSubmit, appLanguageCode } = this.props;
    // <div className="edit-flat-delete-language-button modal-edit-delete-edit-button-box">
    const documentAvailable = this.props.uploadOwnDocument ? this.props.agreement : this.props.documentInsert;
    console.log('in documentInsert_edit_modal, renderEditDocumentForm, this.props.show, this.props.auth, this.props.documentInsert, this.props.agreement: ', this.props.show, this.props.auth, this.props.documentInsert, this.props.agreement);
    // if (this.props.auth && (this.props.documentInsert || this.props.agreement)) {
    if (this.props.auth && documentAvailable) {
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">{!this.props.showTemplate ? AppLanguages.editDocumentInsert[appLanguageCode] : AppLanguages.editTemplateDocument[appLanguageCode]}</h3>
            <div className="modal-edit-delete-edit-button-box">
              <button value={this.props.uploadOwnDocument ? this.props.agreementId : this.props.documentInsertId} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteDocumentInsertClick}>{AppLanguages.delete[this.props.appLanguageCode]}</button>
            </div>
            <div className="edit-profile-scroll-div">
            {this.renderDocumentInsertImage()}
              {this.renderAlert()}
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                {this.renderEachDocumentInsertField()}
                <Field
                  name={FILE_FIELD_NAME}
                  component={RenderDropzoneInput}
                  props={{ pdfUpload: true }}
                  // message={AppLanguages.dropImages[appLanguageCode]}
                />
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
    const documentKind = this.props.uploadOwnDocument ? 'agreement' : 'document insert';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          {this.state.deleteDocumentInsertCompleted ?
            <div className="post-action-message">{`The ${documentKind} has been successfully deleted.`}</div>
            :
            <div className="post-action-message">{`The ${documentKind} has been successfully updated.`}</div>
          }
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    console.log('in documentInsert_edit_modal, render this.state.editDocumentInsertCompleted, this.props.agreementId: ', this.state.editDocumentInsertCompleted, this.props.agreementId);
    return (
      <div>
        {this.state.editDocumentInsertCompleted ? this.renderPostEditDeleteMessage() : this.renderEditDocumentForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
DocumentInsertEditModal = reduxForm({
  form: 'DocumentInsertEditModal',
  enableReinitialize: true
})(DocumentInsertEditModal);

// function getDocumentInsert(documentInserts, id) {
//   // placeholder for when add lanauge
//   let documentInsert = {};
//     _.each(documentInserts, eachDocumentInsert => {
//       console.log('in documentInsert_edit_modal, getDocumentInsert, eachDocumentInsert: ', eachDocumentInsert);
//       if (eachDocumentInsert.id == id) {
//         documentInsert = eachDocumentInsert;
//         return;
//       }
//     });
//
//   return documentInsert;
// }

// function getAgreement(agreements, id) {
//   let agreement = {};
//     _.each(agreements, eachAgreement => {
//       console.log('in documentInsert_edit_modal, getDocumentInsert, eachAgreement: ', eachAgreement);
//       if (eachAgreement.id == id) {
//         agreement = eachAgreement;
//         return;
//       }
//     });
//
//   return agreement;
// }
// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in DocumentInsertEditModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state) {
    let initialValues = {};
    // console.log('in DocumentInsertEditModal, mapStateToProps, state.auth.user: ', state.auth.user);
    // const agreement = getAgreement(state.bookingData.fetchBookingData.agreements, parseInt(state.modals.selectedAgreementId, 10))
    const agreement = state.bookingData.fetchBookingData ? state.bookingData.fetchBookingData.agreements.filter((agr) => agr.id === parseInt(state.modals.selectedAgreementId, 10)) : [state.flat.selectedFlatFromParams.agreements[state.modals.selectedAgreementId]];
    console.log('in DocumentInsertEditModal, mapStateToProps, state.bookingData.fetchBookingData agreement, state.flat.selectedFlatFromParams, state.modals.selectedAgreementId: ', agreement, state.flat.selectedFlatFromParams, state.modals.selectedAgreementId);
    // const documentInsert = getDocumentInsert(agreement.document_inserts, parseInt(state.modals.selectedDocumentInsertId, 10));
    const documentInsert = agreement[0] && agreement[0].document_inserts ? agreement[0].document_inserts.filter((insert) => insert.id === parseInt(state.modals.selectedDocumentInsertId, 10)) : [];
    // const editDocumentInsert = getEditDocumentInsert(agreement.documentInserts, parseInt(state.modals.documentInsertToEditId, 10));
    // const date = new Date(documentInsert.documentInsert_date);
    // const dateString = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + ('00' + date.getDate()).slice(-2);
    // if (state.modals.documentInsertToEditId) {
    //   documentInsert = editDocumentInsert;
    // }
    if (_.isEmpty(documentInsert)) {
      initialValues.insert_name = agreement[0] ? agreement[0].document_name : '';
      initialValues.language_code = agreement[0] ? agreement[0].language_code : '';
    } else {
      initialValues = documentInsert[0];
    }
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
      booking: state.bookingData.fetchBookingData,
      documentInsert: documentInsert[0] ? documentInsert[0] : null,
      agreement: agreement[0] ? agreement[0] : null,
      // editDocumentInsertId: state.modals.documentInsertToEditId,
      // editDocumentInsert,
      // language: state.languages.selectedLanguage,
      // set initialValues to be first calendar in array to match selectedDocumentInsertId
      initialValues
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
      // initialValues
    };
  }

  return {};
}

export default connect(mapStateToProps, actions)(DocumentInsertEditModal);
