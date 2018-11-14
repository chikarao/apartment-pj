import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import languages from '../constants/languages';
import Contractor from '../constants/contractor';
import FormChoices from '../forms/form_choices';

let showHideClassName;

class ContractorEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editContractorCompleted: false,
      deleteContractorCompleted: false,
      selectedContractorId: ''
    };
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
    const dataToBeSent = { contractor: delta, id: this.props.contractorId };
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in ContractorEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.updateContractor(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in ContractorEditModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editContractorCompleted: true });
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

  // turn off showContractorEditModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    console.log('in contractor_edit_modal, handleClose, this.props.showContractorEdit: ', this.props.showContractorEdit);

    // if (this.props.showContractorEdit) {
      this.props.showContractorEditModal();
      this.setState({ editContractorCompleted: false });
    // }
  }

  renderEachContractorField() {
    let fieldComponent = '';
    return _.map(Contractor, (formField, i) => {
      console.log('in contractor_edit_modal, renderEachContractorField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in contractor_edit_modal, renderEachContractorField, fieldComponent: ', fieldComponent);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}:</label>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: Contractor, record: this.props.contractor, create: false } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </fieldset>
      );
    });
  }

  handleDeleteContractorClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    if (window.confirm('Are you sure you want to delete this contractor?')) {
      this.props.showLoading()
      this.props.deleteContractor(elementVal, () => this.handleDeleteContractorCallback());
    }
  }

  handleDeleteContractorCallback() {
    this.setState({ editContractorCompleted: true, deleteContractorCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  renderEditContractorForm() {
    console.log('in contractor_edit_modal, renderEditContractorForm, this.props.showContractorEdit: ', this.props.showContractorEdit);

    const { handleSubmit } = this.props;

    if (this.props.auth) {
      console.log('in contractor_edit_modal, renderEditContractorForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Edit Contractor</h3>
            <div className="edit-flat-delete-language-button">
              <button value={this.props.contractorId} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteContractorClick.bind(this)}>Delete</button>
            </div>
            <div className="edit-profile-scroll-div">
              {this.renderAlert()}

              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                {this.renderEachContractorField()}
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
          {this.state.deleteContractorCompleted ?
            <div className="post-signup-message">The contractor has been successfully deleted.</div>
            :
            <div className="post-signup-message">The contractor has been successfully updated.</div>
          }
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    console.log('in contractor_edit_modal, render this.state.editContractorCompleted: ', this.state.editContractorCompleted);
    return (
      <div>
        {this.state.editContractorCompleted ? this.renderPostEditDeleteMessage() : this.renderEditContractorForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
ContractorEditModal = reduxForm({
  form: 'ContractorEditModal',
  enableReinitialize: true
})(ContractorEditModal);

function getContractor(contractors, id) {
  // placeholder for when add lanauge
  let contractor = {};
    _.each(contractors, eachContractor => {
      console.log('in contractor_edit_modal, getContractor, eachContractor: ', eachContractor);
      if (eachContractor.id == id) {
        contractor = eachContractor;
        return;
      }
    });

  return contractor;
}
// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in ContractorEditModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state.auth.user) {
    let initialValues = {};
    // console.log('in ContractorEditModal, mapStateToProps, state.auth.user: ', state.auth.user);
    const { contractors } = state.auth.user;
    const contractor = getContractor(contractors, parseInt(state.modals.selectedContractorId, 10));
    // const date = new Date(contractor.contractor_date);
    // const dateString = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + ('00' + date.getDate()).slice(-2);
    console.log('in ContractorEditModal, mapStateToProps, contractor: ', contractor);
    initialValues = contractor;
    // initialValues.contractor_date = dateString;
    console.log('in ContractorEditModal, mapStateToProps, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // userProfile: state.auth.userProfile
      // initialValues: state.auth.userProfile
      // languages: state.languages,
      showContractorEdit: state.modals.showContractorEditModal,
      appLanguageCode: state.languages.appLanguageCode,
      contractorId: state.modals.selectedContractorId,
      contractor,
      // language: state.languages.selectedLanguage,
      // set initialValues to be first calendar in array to match selectedContractorId
      initialValues
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
      // initialValues
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(ContractorEditModal);
