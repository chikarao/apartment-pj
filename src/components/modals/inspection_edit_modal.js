import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import languages from '../constants/languages';
import Inspection from '../constants/inspection';
import FormChoices from '../forms/form_choices';

let showHideClassName;

class InspectionEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editInspectionCompleted: false,
      deleteInspectionCompleted: false,
      selectedInspectionId: ''
    };
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
    const dataToBeSent = { Inspection: data, building_id: this.props.flat.building.id };
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in InspectionEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.updateInspection(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in InspectionEditModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editInspectionCompleted: true });
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

  // turn off showInspectionEditModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    if (this.props.showInspectionEdit) {
      this.props.showInspectionEditModal();
      this.setState({ editInspectionCompleted: false });
    }
  }

  renderEachInspectionField() {
    let fieldComponent = '';
    return _.map(Inspection, (formField, i) => {
      console.log('in inspection_edit_modal, renderEachInspectionField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in inspection_edit_modal, renderEachInspectionField, fieldComponent: ', fieldComponent);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}:</label>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: Inspection } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </fieldset>
      );
    });
  }

  handleDeleteInspectionClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.props.showLoading()
    this.props.deleteInspection(elementVal, () => this.handleDeleteInspectionCallback());
  }

  handleDeleteInspectionCallback() {
    this.setState({ editInspectionCompleted: true, deleteInspectionCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  renderEditInspectionForm() {
    const { handleSubmit } = this.props;

    if (this.props.flat) {
      console.log('in inspection_edit_modal, renderEditInspectionForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Edit Inspection</h3>
            <div className="edit-flat-delete-language-button">
              <button value={this.props.inspectionId} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteInspectionClick.bind(this)}>Delete</button>
            </div>
            <div className="edit-profile-scroll-div">
              {this.renderAlert()}

              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                {this.renderEachInspectionField()}
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
          {this.state.deleteInspectionCompleted ?
            <div className="post-signup-message">The inspection has been successfully deleted.</div>
            :
            <div className="post-signup-message">The inspection has been successfully updated.</div>
          }
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.editInspectionCompleted ? this.renderPostEditDeleteMessage() : this.renderEditInspectionForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
InspectionEditModal = reduxForm({
  form: 'InspectionEditModal',
  enableReinitialize: true
})(InspectionEditModal);

function getInspection(building, id) {
  // placeholder for when add lanauge
  let inspection = {};
    _.each(building.inspections, eachInspection => {
      console.log('in edit flat, getInspection, eachInspection: ', eachInspection);
      if (eachInspection.id == id) {
        inspection = eachInspection;
        return;
      }
    });

  return inspection;
}
// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in InspectionEditModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state.selectedFlatFromParams.selectedFlatFromParams) {
    let initialValues = {};
    const { building } = state.selectedFlatFromParams.selectedFlatFromParams;
    const inspection = getInspection(building, parseInt(state.flat.selectedInspectionId, 10));
    const date = new Date(inspection.inspection_date);
    const dateString = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + ('00' + date.getDate()).slice(-2);
    initialValues = inspection;
    initialValues.inspection_date = dateString;
    // console.log('in InspectionEditModal, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // userProfile: state.auth.userProfile
      // initialValues: state.auth.userProfile
      // languages: state.languages,
      showInspectionEdit: state.modals.showInspectionEditModal,
      appLanguageCode: state.languages.appLanguageCode,
      inspectionId: state.flat.selectedInspectionId,
      // language: state.languages.selectedLanguage,
      // set initialValues to be first calendar in array to match selectedInspectionId
      initialValues
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
      // initialValues
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(InspectionEditModal);
