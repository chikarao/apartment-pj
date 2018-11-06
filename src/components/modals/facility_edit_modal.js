import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
// import languages from '../constants/languages';
import Facility from '../constants/facility';
import FormChoices from '../forms/form_choices';

let showHideClassName;

class FacilityEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editFacilityCompleted: false,
      deleteFacilityCompleted: false,
      // deleteFacilityCompleted: false,
      selectedFacilityId: ''
    };
  }
  //
  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    // !!!!only persist first 4 characters of account number
    // console.log('in edit flat, handleFormSubmit, data.account_number, data.account_number.slice(0, 4);: ', data.account_number, data.account_number.slice(0, 4));
    const dataToBeChanged = data;
    dataToBeChanged.flat_id = this.props.flat.id;
    const dataToBeSent = { facility: dataToBeChanged };
    // send all data for account; gets assigned user_id on api based on token
    // console.log('in FacilityEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.updateFacility(dataToBeSent, this.props.facilityId, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    // console.log('in FacilityEditModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editFacilityCompleted: true });
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

  // turn off showFacilityEditModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    // console.log('in FacilityEditModal, handleClose, this.props.showFacilityEdit: ', this.props.showFacilityEdit);
    if (this.props.showFacilityEdit) {
      this.props.showFacilityEditModal();
      this.setState({ editFacilityCompleted: false });
    }
  }

  renderEachFacilityField() {
    let fieldComponent = '';
    return _.map(Facility, (formField, i) => {
      // console.log('in bank_account_edit_modal, renderEachFacilityField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in bank_account_edit_modal, renderEachFacilityField, this.props.appLanguageCode: ', this.props.appLanguageCode);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField[this.props.appLanguageCode]}:</label>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: Facility } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </fieldset>
      );
    });
  }

  handleDeleteFacilityClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value')
    // const facilityAttributes = { flat_id: this.props.flat.id }
    this.props.showLoading();
    this.props.deleteFacility(elementVal, () => this.handleDeleteFacilityCallback());
  }

    handleDeleteFacilityCallback() {
    // console.log('in FacilityEditModal, handleDeleteFacilityCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editFacilityCompleted: true, deleteFacilityCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }
  renderEditFacilityForm() {
    const { handleSubmit } = this.props;

    // if (this.props.flat) {
      // console.log('in bank_account_edit_modal, renderEditFacilityForm, this.props.show ', this.props.show );
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Edit Facility</h3>
            <div className="edit-flat-delete-language-button">
              <button value={this.props.facilityId} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteFacilityClick.bind(this)}>Delete</button>
            </div>
            <div className="edit-profile-scroll-div">
              {this.renderAlert()}
              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                {this.renderEachFacilityField()}
                <div className="confirm-change-and-button">
                  <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">Submit</button>
                </div>
              </form>
            </div>

          </section>
        </div>
      );
    // }
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
          <div className="post-signup-message">The facility has been successfully {this.state.deleteFacilityCompleted ? 'deleted' : 'updated'}.</div>
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.editFacilityCompleted ? this.renderPostEditDeleteMessage() : this.renderEditFacilityForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
FacilityEditModal = reduxForm({
  form: 'FacilityEditModal',
  enableReinitialize: true
})(FacilityEditModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in FacilityEditModal, mapStateToProps, state: ', state);
  const { selectedFlatFromParams } = state.selectedFlatFromParams;
  if (selectedFlatFromParams) {
    let initialValues = {};
    _.each(selectedFlatFromParams.facilities, eachFacility => {
      // console.log('in FacilityEditModal, mapStateToProps, eachFacility, state.flat.selectedFacilityId : ', eachFacility, state.flat.selectedFacilityId);
      if (eachFacility.id == parseInt(state.flat.selectedFacilityId, 10)) {
        _.each(Object.keys(Facility), eachKey => {
          initialValues[eachKey] = eachFacility[eachKey];
        })
      }
    });
    // console.log('in FacilityEditModal, mapStateToProps, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // userProfile: state.auth.userProfile
      // initialValues: state.auth.userProfile
      // languages: state.languages,
      showFacilityEdit: state.modals.showFacilityEditModal,
      appLanguageCode: state.languages.appLanguageCode,
      // bankAccounts: state.auth.bankAccounts,
      facilityId: state.flat.selectedFacilityId,
      // set initial values to be bankaccount.id == selectedFacilityId
      initialValues
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(FacilityEditModal);
