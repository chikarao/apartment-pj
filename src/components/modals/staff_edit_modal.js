import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import languages from '../constants/languages';
import Staff from '../constants/staff';
import FormChoices from '../forms/form_choices';

let showHideClassName;

class StaffEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editStaffCompleted: false,
      deleteStaffCompleted: false,
      selectedStaffId: ''
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
    const dataToBeSent = { staff: delta, id: this.props.staffId };
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in StaffEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.updateStaff(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in StaffEditModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editStaffCompleted: true });
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

  // turn off showStaffEditModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    console.log('in staff_edit_modal, handleClose, this.props.showStaffEdit: ', this.props.showStaffEdit);

    // if (this.props.showStaffEdit) {
      this.props.showStaffEditModal();
      this.setState({ editStaffCompleted: false });
    // }
  }

  renderEachStaffField() {
    let fieldComponent = '';
    return _.map(Staff, (formField, i) => {
      console.log('in staff_edit_modal, renderEachStaffField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in staff_edit_modal, renderEachStaffField, fieldComponent: ', fieldComponent);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}:</label>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: Staff } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </fieldset>
      );
    });
  }

  handleDeleteStaffClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    if (window.confirm('Are you sure you want to delete this staff?')) {
      this.props.showLoading()
      this.props.deleteStaff(elementVal, () => this.handleDeleteStaffCallback());
    }
  }

  handleDeleteStaffCallback() {
    this.setState({ editStaffCompleted: true, deleteStaffCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  renderEditStaffForm() {
    console.log('in staff_edit_modal, renderEditStaffForm, this.props.showStaffEdit: ', this.props.showStaffEdit);

    const { handleSubmit } = this.props;
    //!!!!!!! Make sure to change this if condition when adapting model to new modal
    if (this.props.auth) {
      console.log('in staff_edit_modal, renderEditStaffForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Edit Staff</h3>
            <div className="edit-flat-delete-language-button">
              <button value={this.props.staffId} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteStaffClick.bind(this)}>Delete</button>
            </div>
            <div className="edit-profile-scroll-div">
              {this.renderAlert()}

              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                {this.renderEachStaffField()}
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
          {this.state.deleteStaffCompleted ?
            <div className="post-signup-message">The staff has been successfully deleted.</div>
            :
            <div className="post-signup-message">The staff has been successfully updated.</div>
          }
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    console.log('in staff_edit_modal, render this.state.editStaffCompleted: ', this.state.editStaffCompleted);
    return (
      <div>
        {this.state.editStaffCompleted ? this.renderPostEditDeleteMessage() : this.renderEditStaffForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
StaffEditModal = reduxForm({
  form: 'StaffEditModal',
  enableReinitialize: true
})(StaffEditModal);

function getContractor(contractors, id) {
  // placeholder for when add lanauge
  let contractor = {};
    _.each(contractors, eachContractor => {
      console.log('in staff_edit_modal, getContractor, eachContractor, id: ', eachContractor, id);
      if (eachContractor.id == id) {
        contractor = eachContractor;
        return;
      }
    });

  return contractor;
}

function getStaff(staffs, id) {
  // placeholder for when add lanauge
  let staff = {};
    _.each(staffs, eachStaff => {
      console.log('in staff_edit_modal, getStaff, eachStaff, id: ', eachStaff, id);
      if (eachStaff.id == id) {
        staff = eachStaff;
        return;
      }
    });

  return staff;
}
// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in StaffEditModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state.auth.user) {
    let initialValues = {};
    const { contractors } = state.auth.user;
    const contractor = getContractor(contractors, parseInt(state.modals.selectedContractorId, 10));
    console.log('in StaffEditModal, mapStateToProps, contractor: ', contractor);
    const staff = getStaff(contractor.staffs, parseInt(state.modals.selectedStaffId, 10));
    console.log('in StaffEditModal, mapStateToProps, staff: ', staff);
    // // const date = new Date(staff.staff_date);
    // // const dateString = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + ('00' + date.getDate()).slice(-2);
    // console.log('in StaffEditModal, mapStateToProps, staff: ', staff);
    initialValues = staff;
    // // initialValues.staff_date = dateString;
    // console.log('in StaffEditModal, mapStateToProps, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // userProfile: state.auth.userProfile
      // initialValues: state.auth.userProfile
      // languages: state.languages,
      showStaffEdit: state.modals.showStaffEditModal,
      appLanguageCode: state.languages.appLanguageCode,
      staffId: state.modals.selectedStaffId,
      // language: state.languages.selectedLanguage,
      // set initialValues to be first calendar in array to match selectedStaffId
      initialValues
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
      // initialValues
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(StaffEditModal);
