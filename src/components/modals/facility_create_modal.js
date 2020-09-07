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

class FacilityCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createFacilityCompleted: false,
      // deleteFacilityCompleted: false,
      selectedFacilityId: ''
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
    console.log('in FacilityCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.createFacility(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in FacilityCreateModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ createFacilityCompleted: true });
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
  // turn off showFacilityCreateModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    console.log('in FacilityCreateModal, handleClose, this.props.showFacilityCreate: ', this.props.showFacilityCreate);
    if (this.props.showFacilityCreate) {
      this.props.showFacilityCreateModal();
      this.setState({ createFacilityCompleted: false });
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

  renderEditFacilityForm() {
    const { handleSubmit } = this.props;

    // if (this.props.flat) {
      console.log('in bank_account_edit_modal, renderEditFacilityForm, this.props.show ', this.props.show );
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Add Facility</h3>

            <div className="edit-profile-scroll-div">
              {this.renderAlert()}
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>
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
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-action-message">The facility has been successfully created.</div>
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.createFacilityCompleted ? this.renderPostEditDeleteMessage() : this.renderEditFacilityForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
FacilityCreateModal = reduxForm({
  form: 'FacilityCreateModal',
  enableReinitialize: true
})(FacilityCreateModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in FacilityCreateModal, mapStateToProps, state: ', state);
    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // languages: state.languages,
      showFacilityCreate: state.modals.showFacilityCreateModal,
      appLanguageCode: state.languages.appLanguageCode,
    };
  }


export default connect(mapStateToProps, actions)(FacilityCreateModal);
