import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import * as actions from '../../actions';
// import languages from '../constants/languages';
import DocumentInsert from '../constants/document_insert';
import Documents from '../constants/documents';
import AppLanguages from '../constants/app_languages';
import FormChoices from '../forms/form_choices';
import RenderDropzoneInput from '../images/render_dropzone_input';
import globalConstants from '../constants/global_constants';

let showHideClassName;
const FILE_FIELD_NAME = 'files';
const ROOT_URL = globalConstants.rootUrl;

// NOTE: this modal enables upload of document inserts  and entire agreements
// inserts are documents that are inserted into ready made documents provided by the app
// inserts enables users to use a different contract with a summary provided by the app
// Entire agreements are templates and completed agreeemnts
// inserts and own agreements are differentiated by this.props.uploadOwnDocument

class DocumentInsertCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createDocumentInsertCompleted: false,
      deleteDocumentInsertCompleted: false,
      selectedDocumentInsertId: ''
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  //
  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    console.log('in DocumentInsertCreateModal, handleFormSubmit, data: ', data);

    this.props.showLoading();
    this.handleCreateImages(data.files, data);
  }

  handleCreateImages(files, data) {
    console.log('in DocumentInsertCreateModal, handleCreateImages, files:', files);

    const imagesArray = [];
    let uploaders = [];
    let pages = null;
  // Push all the axios request promise into a single array
    if (files.length > 0) {
      uploaders = files.map((file) => {
        console.log('in Upload, handleDrop, uploaders, file: ', file);
        // Initial FormData
        const formData = new FormData();
        formData.append('file', file);
        // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
        // console.log('in create_flat, handleDrop, uploaders, formData file: ', formData.get('file'));
        return axios.post(`${ROOT_URL}/api/v1/images/upload`, formData, {
          headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
        }).then(response => {
          // const data = response.data;
          console.log('in Upload, handleDrop, uploaders, .then, response.data.public_id ', response);
          const filePublicId = response.data.data.response.public_id;
          pages = response.data.data.response.pages;
          console.log('in Upload, handleDrop, uploaders, after response, pages ', pages);
          // You should store this URL for future references in your app
          imagesArray.push(filePublicId);
          // call create image action, send images Array with flat id
        });
        //end of then
      });
      //end of uploaders
    }
  console.log('in Upload, handleDrop, uploaders: ', uploaders);
  // Once all the files are uploaded
  axios.all(uploaders).then(() => {
    // ... perform after upload is successful operation
    console.log('in Upload, handleCreateImages, axios all, then, imagesArray: ', imagesArray);
    // if there are no images, call do not create images and just call createImageCallback
    if (imagesArray.length > 0) {
      // this.createImageCallback(imagesArray, 0, flatId);
      // this.props.createImage(imagesArray, imageCount, flatId, (array, countCb, id) => this.createImageCallback(array, countCb, id));
      let dataToBeSent = {};
      // if this is an entire document and not an insert to another document
      if (!this.props.uploadOwnDocument) {
        dataToBeSent = { document_insert: data };
        dataToBeSent.document_insert.agreement_id = this.props.agreementId;
        dataToBeSent.document_insert.publicid = imagesArray[0];
        this.props.createDocumentInsert(dataToBeSent, () => this.handleFormSubmitCallback());
      } else {
        const dataToChange = data;
        dataToChange.document_name = dataToChange.insert_name;
        dataToBeSent = { agreement: dataToChange };
        // if this is to create an upload
        if (this.props.templateCreate) dataToBeSent.agreement.document_type = 'template';
        dataToBeSent.agreement.booking_id = this.props.booking.id;
        dataToBeSent.agreement.document_publicid = imagesArray[0];
        dataToBeSent.agreement.document_pages = pages;
        dataToBeSent.agreement.document_code = globalConstants.ownUploadedDocumentKey;
        // if (this.props.templateCreate) dataToBeSent.agreement.document_code = globalConstants.ownUploadedTemplateKey;
        dataToBeSent.agreement.language_code_1 = this.props.documentLanguageCode;
        // dataToBeSent.agreement.language_code = this.props.documentLanguageCode;
        dataToBeSent.document_field = [];
        console.log('in Upload, handleCreateImages, axios all, then, else dataToBeSent, data: ', dataToBeSent, data);
        this.props.createAgreement(dataToBeSent, () => this.handleFormSubmitCallback());
      }
    } // end of if imagesArray > 0
  });
}

  handleFormSubmitCallback() {
    console.log('in DocumentInsertCreateModal, handleFormSubmitCallback: ');
    // this.props.selectedDocumentInsertId('');
    // showHideClassName = 'modal display-none';
    this.setState({ createDocumentInsertCompleted: true });
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

  // turn off showDocumentInsertCreateModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    console.log('in documentInsert_create_modal, handleClose, this.props.showDocumentInsertCreate: ', this.props.showDocumentInsertCreate);
    this.props.showDocumentInsertCreateModal();

    this.setState({ createDocumentInsertCompleted: false });
  }

  renderEachDocumentInsertField(objects) {
    let fieldComponent = '';
    const insert = (!this.props.uploadOwnDocument && !this.props.templateCreate);

    const renderField = (formField, i) => {
      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}{formField.noColon ? '' : ':'}</label>
          <Field
            name={formField.name}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent === FormChoices ? { model: objects, record: this.props.documentInsert, create: true, existingLanguageArray: this.props.documentInsertLanguageArray, agreement: this.props.agreement[0] } : {}}
            type={formField.type}
            style={formField.component === 'input' ? { width: formField.width } : {}}
            className={formField.component === 'input' ? 'form-control' : ''}
          />
        </fieldset>
      );
    };

    return _.map(objects, (formField, i) => {
      // console.log('in documentInsert_create_modal, renderEachDocumentInsertField, formField: ', formField);
      if (formField.component === 'FormChoices') {
        fieldComponent = FormChoices;
      } else if (formField.component === 'formInsert') {
        fieldComponent = formInsert;
      } else {
        fieldComponent = formField.component;
      }
      console.log('in documentInsert_create_modal, renderEachDocumentInsertField, insert, formField, fieldComponent, objects: ', insert, formField, fieldComponent, objects);
      if (insert && (formField.insert || formField.all)) return renderField(formField, i);

      if (!insert && (!formField.insert || formField.all)) return renderField(formField, i);
      // return renderField(formField, i);
    });
  }

  createTemplateObjects() {
    // Create an object like in constants/document_insert.js
    const object = {
      template_file_name: {
        name: 'template_file_name',
        component: 'FormChoices',
        type: 'string',
        en: 'Type of Document',
        jp: '書類の種類',
        language_independent: true,
        limit_choices: true,
      }
    };

    // get choices from constants/documents.js where templateCompatible is true
    const obj = {};
    _.each(Object.keys(Documents), (eachKey, i) => {
      console.log('in documentInsert_create_modal, createTemplateObjects eachKey, Documents[eachKey]: ', eachKey, Documents[eachKey]);
      if (Documents[eachKey].templateCompatible) {
        obj[i] = { value: eachKey,
                   en: Documents[eachKey].en,
                   jp: Documents[eachKey].jp,
                   type: 'button',
                   className: 'form-rectangle'
                 };
      }
    });

    object.template_file_name.choices = obj;
    console.log('in documentInsert_create_modal, createTemplateObjects: ', object);
    return object;
  }

  handleDeleteDocumentInsertClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.props.showLoading()
    this.props.deleteDocumentInsert(elementVal, () => this.handleDeleteDocumentInsertCallback());
  }

  handleDeleteDocumentInsertCallback() {
    this.setState({ createDocumentInsertCompleted: true, deleteDocumentInsertCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  renderCreateDocumentInsertForm() {
    // console.log('in documentInsert_create_modal, renderCreateDocumentInsertForm, this.props.agreement, this.props.agreementId: ', this.props.agreement, this.props.agreementId);
    // <h3 className="auth-modal-title">{this.props.addNew ? AppLanguages.createDocumentInsert[this.props.appLanguageCode] : AppLanguages.addDocumentInsertLanguage[this.props.appLanguageCode]}</h3>

    const { handleSubmit, appLanguageCode } = this.props;

    if (this.props.auth) {
      console.log('in documentInsert_create_modal, renderCreateDocumentInsertForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">{!this.props.templateCreate ? AppLanguages.createDocumentInsert[appLanguageCode] : AppLanguages.createTemplateDocument[appLanguageCode]}</h3>
            <div className="edit-profile-scroll-div">
              {this.renderAlert()}

              <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                {this.renderEachDocumentInsertField(DocumentInsert)}
                {this.props.templateCreate ? this.renderEachDocumentInsertField(this.createTemplateObjects()) : ''}

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


  renderPostCreateMessage() {
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
            <div className="post-signup-message">The documentInsert has been successfully deleted.</div>
            :
            <div className="post-signup-message">{`The ${documentKind} has been successfully created.`}</div>
          }
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    console.log('in documentInsert_create_modal, render this.state.createDocumentInsertCompleted: ', this.state.createDocumentInsertCompleted);
    return (
      <div>
        {this.state.createDocumentInsertCompleted ? this.renderPostCreateMessage() : this.renderCreateDocumentInsertForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
DocumentInsertCreateModal = reduxForm({
  form: 'DocumentInsertCreateModal',
  enableReinitialize: true
})(DocumentInsertCreateModal);

// function getExistingLanguages(documentInserts) {
//   const array = []
//   // _.each()
//   return array;
// }

// function getDocumentInsert(documentInserts, id) {
//   // placeholder for when add lanauge
//   let documentInsert = {};
//     _.each(documentInserts, eachDocumentInsert => {
//       console.log('in documentInsert_create_modal, getDocumentInsert, eachDocumentInsert: ', eachDocumentInsert);
//       if (eachDocumentInsert.id == id) {
//         documentInsert = eachDocumentInsert;
//         return;
//       }
//     });
//
//   return documentInsert;
// }
//
// function getInitialValues(documentInsert) {
//   const objectReturned = {};
//   _.each(Object.keys(DocumentInsert), eachAttribute => {
//     // if attribute is indepedent of language (just numbers or buttons)
//     if (DocumentInsert[eachAttribute].language_independent) {
//       // add to object to be assiged to initialValues
//       objectReturned[eachAttribute] = documentInsert[eachAttribute];
//     }
//   });
//   // add base_record_id that references the original documentInsert that was created
//   objectReturned.base_record_id = documentInsert.id;
//   return objectReturned;
// }
//
// function getLanguageArray(documentInserts, baseDocumentInsert) {
//   let array = [];
//   _.each(documentInserts, eachDocumentInsert => {
//     if (eachDocumentInsert.base_record_id == baseDocumentInsert.id) {
//       if (array.indexOf(eachDocumentInsert.language_code) === -1) {
//       // if (!array.includes(eachDocumentInsert.language_code)) {
//         array.push(eachDocumentInsert.language_code);
//       }
//       // if (!array.includes(baseDocumentInsert.language_code) === -1) {
//       if (array.indexOf(baseDocumentInsert.language_code) === -1) {
//         array.push(baseDocumentInsert.language_code);
//       }
//     }
//   });
//   return array;
// }

const formInsert = (props) => {
  console.log('in DocumentInsertCreateModal, formInsert, props: ', props);
  return (
    <div
      className="container form-control-custom-container"
    >
      <div
        className="row form-control-custom"
      >
        After page what
      </div>
    </div>
  );
};

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in DocumentInsertCreateModal, mapStateToProps, state: ', state);

  if (state.bookingData.fetchBookingData) {
    console.log('in DocumentInsertCreateModal, mapStateToProps, state #2: ', state);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      showDocumentInsertCreate: state.modals.showDocumentInsertCreateModal,
      appLanguageCode: state.languages.appLanguageCode,
      booking: state.bookingData.fetchBookingData,
      documentKey: state.documents.createDocumentKey,
      documentLanguageCode: state.languages.documentLanguageCode,
      // initialValues
    };
  }
  // else return empty object
  return {};
}


export default connect(mapStateToProps, actions)(DocumentInsertCreateModal);
