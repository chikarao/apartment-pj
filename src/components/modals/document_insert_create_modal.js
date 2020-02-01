import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import axios from 'axios';

import * as actions from '../../actions';
import languages from '../constants/languages';
import DocumentInsert from '../constants/document_insert';
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
    // const dataToBeSent = { documentInsert: data };
    // const dataToBeSent = { documentInsert: data, id: this.props.documentInsertId };
    // dataToBeSent.flat_id = this.props.flat.id;
    // console.log('in DocumentInsertCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    console.log('in DocumentInsertCreateModal, handleFormSubmit, data: ', data);
    // this.props.showLoading();
    // this.props.createDocumentInsert(dataToBeSent, () => {
    //   this.handleFormSubmitCallback();
    // });
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
        console.log('in Upload, handleCreateImages, axios all, then, else pages: ', pages);
        dataToChange.document_name = dataToChange.insert_name;
        dataToBeSent = { agreement: dataToChange };
        // if this is to create an upload
        if (this.props.templateCreate) dataToBeSent.agreement.language_code_1 = 'template';
        dataToBeSent.agreement.booking_id = this.props.booking.id;
        dataToBeSent.agreement.document_publicid = imagesArray[0];
        dataToBeSent.agreement.document_pages = pages;
        dataToBeSent.agreement.document_code = globalConstants.ownUploadedDocumentKey;
        // if (this.props.templateCreate) dataToBeSent.agreement.document_code = globalConstants.ownUploadedTemplateKey;
        dataToBeSent.agreement.language_code = this.props.documentLanguageCode;
        dataToBeSent.document_field = [];
        this.props.createAgreement(dataToBeSent, () => this.handleFormSubmitCallback());
      }
    } // end of if imagesArray > 0
  });
}

  // createImageCallback(imagesArray, imageCount, flatId) {
  //   console.log('in show_flat createImageCallback, passed from callback: ', imagesArray, imageCount, flatId);
  //   const count = imageCount + 1;
  //   if (count <= (imagesArray.length - 1)) {
  //     this.props.createImage(imagesArray, count, flatId, (array, countCb, id) => this.createImageCallback(array, countCb, id));
  //   } else {
  //     this.props.history.push(`/show/${flatId}`);
  //     //switch on loading modal in action creator
  //     this.props.showLoading();
  //   }
  // }

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

    // if (this.props.showDocumentInsertCreate) {
      this.props.showDocumentInsertCreateModal();
      // this.props.selectedDocumentInsertId('');
      // this.props.addNew ? this.props.addNewDocumentInsert() : '';
      this.setState({ createDocumentInsertCompleted: false });
    // }
  }

  renderEachDocumentInsertField() {
    let fieldComponent = '';
    return _.map(DocumentInsert, (formField, i) => {
      // console.log('in documentInsert_create_modal, renderEachDocumentInsertField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      console.log('in documentInsert_create_modal, renderEachDocumentInsertField, fieldComponent: ', fieldComponent);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}{formField.noColon ? '' : ':'}</label>
          <Field
            name={formField.name}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: DocumentInsert, record: this.props.documentInsert, create: true, existingLanguageArray: this.props.documentInsertLanguageArray } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
          />
        </fieldset>
      );
    });
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
    console.log('in documentInsert_create_modal, renderCreateDocumentInsertForm, this.props.showDocumentInsertCreate: ', this.props.showDocumentInsertCreate);
    // <h3 className="auth-modal-title">{this.props.addNew ? AppLanguages.createDocumentInsert[this.props.appLanguageCode] : AppLanguages.addDocumentInsertLanguage[this.props.appLanguageCode]}</h3>

    const { handleSubmit } = this.props;

    if (this.props.auth) {
      console.log('in documentInsert_create_modal, renderCreateDocumentInsertForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">{AppLanguages.createDocumentInsert[this.props.appLanguageCode]}</h3>
            <div className="edit-profile-scroll-div">
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

function getDocumentInsert(documentInserts, id) {
  // placeholder for when add lanauge
  let documentInsert = {};
    _.each(documentInserts, eachDocumentInsert => {
      console.log('in documentInsert_create_modal, getDocumentInsert, eachDocumentInsert: ', eachDocumentInsert);
      if (eachDocumentInsert.id == id) {
        documentInsert = eachDocumentInsert;
        return;
      }
    });

  return documentInsert;
}

function getInitialValues(documentInsert) {
  const objectReturned = {};
  _.each(Object.keys(DocumentInsert), eachAttribute => {
    // if attribute is indepedent of language (just numbers or buttons)
    if (DocumentInsert[eachAttribute].language_independent) {
      // add to object to be assiged to initialValues
      objectReturned[eachAttribute] = documentInsert[eachAttribute];
    }
  });
  // add base_record_id that references the original documentInsert that was created
  objectReturned.base_record_id = documentInsert.id;
  return objectReturned;
}

function getLanguageArray(documentInserts, baseDocumentInsert) {
  let array = [];
  _.each(documentInserts, eachDocumentInsert => {
    if (eachDocumentInsert.base_record_id == baseDocumentInsert.id) {
      if (!array.includes(eachDocumentInsert.language_code)) {
        array.push(eachDocumentInsert.language_code);
      }
      if (!array.includes(baseDocumentInsert.language_code)) {
        array.push(baseDocumentInsert.language_code);
      }
    }
  });
  return array;
}

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in DocumentInsertCreateModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state.bookingData.fetchBookingData) {
    // let initialValues = {};
    // initialValues.language_code = 'en';
    // // console.log('in DocumentInsertCreateModal, mapStateToProps, state.auth.user: ', state.auth.user);
    // const { documentInserts } = state.auth.user;
    // let documentInsert = {};
    // let documentInsertLanguageArray = []
    // // if user click is not to create a brand new documentInsert; ie add a language
    // if (!state.modals.addNewDocumentInsert) {
    //   documentInsert = getDocumentInsert(documentInserts, state.modals.selectedDocumentInsertId);
    //   documentInsertLanguageArray = getLanguageArray(documentInserts, documentInsert);
    //   initialValues = getInitialValues(documentInsert);
    // }
    console.log('in DocumentInsertCreateModal, mapStateToProps, state #2: ', state);
    // console.log('in DocumentInsertCreateModal, mapStateToProps, documentInsert: ', documentInsert);
    // const existingLanguagesArray = getExistingLanguages(documentInserts);
    // console.log('in DocumentInsertCreateModal, mapStateToProps, documentInsert: ', documentInsert);
    // initialValues = documentInsert;
    // // initialValues.documentInsert_date = dateString;
    // console.log('in DocumentInsertCreateModal, mapStateToProps, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      // flat: state.selectedFlatFromParams.selectedFlatFromParams,
      showDocumentInsertCreate: state.modals.showDocumentInsertCreateModal,
      appLanguageCode: state.languages.appLanguageCode,
      booking: state.bookingData.fetchBookingData,
      documentKey: state.documents.createDocumentKey,
      documentLanguageCode: state.languages.documentLanguageCode,
      // documentInsertId: state.modals.selectedDocumentInsertId,
      // documentInsert,
      // addNew: state.modals.addNewDocumentInsert,
      // documentInsertLanguageArray,
      // set initialValues to be first calendar in array to match selectedDocumentInsertId
      // initialValues
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(DocumentInsertCreateModal);
