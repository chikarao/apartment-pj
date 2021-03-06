import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import Languages from '../constants/languages';
import Staff from '../constants/staff';
import AppLanguages from '../constants/app_languages';
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
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleEditLanguageClick = this.handleEditLanguageClick.bind(this);
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
    const dataToBeSent = { staff: delta, id: this.props.staff.id };
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in StaffEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.updateStaff(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in StaffEditModal, handleFormSubmitCallback: ');
    this.props.selectedStaffId('');
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
      this.props.selectedStaffId('');
      this.props.staffToEditId('');
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
            props={fieldComponent == FormChoices ? { model: Staff, record: this.props.staff, create: false } : {}}
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
    // if the staff is the base staff, give warking
    if (!this.props.staff.base_record_id) {
      if (window.confirm('Are you sure you want to delete this staff? Deleting this record will delete all languages associated with the staff')) {
        this.props.showLoading()
        this.props.deleteStaff(elementVal, () => this.handleDeleteStaffCallback());
      }
    } else {
      if (window.confirm('Are you sure you want to delete this language?')) {
        this.props.showLoading()
        this.props.deleteStaff(elementVal, () => this.handleDeleteStaffCallback());
      }
    }
  }

  handleDeleteStaffCallback() {
    this.setState({ editStaffCompleted: true, deleteStaffCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  handleEditLanguageClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.props.staffToEditId(elementVal);
  }

  getStaffGroup() {
    let array = [];
    const staffByBase = {};
    _.each(this.props.contractor.staffs, each => {
      if (!each.base_record_id) {
        staffByBase[each.id] = [each];
      }
      if (each.base_record_id) {
        if (staffByBase[each.base_record_id]) {
          staffByBase[each.base_record_id].push(each);
        } else {
          staffByBase[each.base_record_id] = [];
          staffByBase[each.base_record_id].push(each);
        }
      }
    });
    console.log('in staff_edit_modal, getStaffGroup, staffByBase: ', staffByBase);

    // _.each(this.props.contractor.staffs, eachStaff => {
    //   console.log('in staff_edit_modal, getStaffGroup, eachStaff.id, this.props.StaffId, eachStaff.base_record_id, this.props.StaffId: ', eachStaff.id, this.props.staffId, eachStaff.base_record_id, this.props.staffId);
    //   if ((eachStaff.id == this.props.staffId) || (eachStaff.base_record_id == this.props.staffId)) {
    //     array.push(eachStaff);
    //   }
    // });
    let flag = false;
    _.each(staffByBase, each => {
      console.log('in staff_edit_modal, getStaffGroup, staffByBase each: ', staffByBase, each);
      // if (each.includes(this.props.StaffId)) {
      //   array = each;
      //   return;
      // }
      _.each(each, eachStaff => {
        if (eachStaff.id == this.props.staffId) {
          flag = true;
          array = each;
        }
      });
    });

    return array;
  }

  renderEditLanguageLink() {
    // get staffs with same id and base_record_id, or same staff group of languages
    const staffGroup = this.getStaffGroup();
    // return _.map(this.props.auth.user.staffs, (eachStaff, i) => {
    console.log('in staff_edit_modal, renderEditLanguageLink, staffGroup: ', staffGroup);
    return _.map(staffGroup, (eachStaff, i) => {
      // const baseRecordOrNot = this.baseRecordOrNot(eachStaff);
      if (this.props.staff.id != eachStaff.id) {
        return (
          <div
            key={i}
            value={eachStaff.id}
            className="modal-edit-language-link"
            onClick={this.handleEditLanguageClick}
          >
            {Languages[eachStaff.language_code].flag}&nbsp;{Languages[eachStaff.language_code].name}
          </div>
        );
      }
    });
  }

  renderEditStaffForm() {
    const { handleSubmit } = this.props;
    // <div className="edit-flat-delete-language-button modal-edit-delete-edit-button-box">

    if (this.props.auth) {
      // console.log('in staff_edit_modal, renderEditStaffForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Edit Staff</h3>
            <div className="modal-edit-delete-edit-button-box">
              <button value={this.props.staff.id} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteStaffClick.bind(this)}>{AppLanguages.delete[this.props.appLanguageCode]}</button>
              <div className="modal-edit-language-link-box">
                  {this.renderEditLanguageLink()}
              </div>
            </div>
            <div className="edit-profile-scroll-div">
              {this.renderAlert()}
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>
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
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          {this.state.deleteStaffCompleted ?
            <div className="post-action-message">The staff has been successfully deleted.</div>
            :
            <div className="post-action-message">The staff has been successfully updated.</div>
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
  console.log('in staff_create_modal, getContractor, contractors, id: ', contractors, id);
  let contractor = {};
    _.each(contractors, eachContractor => {
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
      console.log('in staff_edit_modal, getStaff, eachStaff: ', eachStaff);
      if (eachStaff.id == id) {
        staff = eachStaff;
        return;
      }
    });

  return staff;
}

function getEditStaff(staffs, id) {
  // placeholder for when add lanauge
  let staff = {};
    _.each(staffs, eachStaff => {
      console.log('in staff_edit_modal, getStaff, eachStaff: ', eachStaff);
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
    // console.log('in StaffEditModal, mapStateToProps, state.auth.user: ', state.auth.user);
    const contractor = getContractor(state.auth.user.contractors, state.modals.selectedContractorId);
    const { staffs } = contractor;
    let staff = getStaff(staffs, parseInt(state.modals.selectedStaffId, 10));
    const editStaff = getEditStaff(staffs, parseInt(state.modals.staffToEditId, 10));
    // const date = new Date(staff.staff_date);
    // const dateString = date.getFullYear() + '-' + date.getMonth() + 1 + '-' + ('00' + date.getDate()).slice(-2);
    console.log('in StaffEditModal, mapStateToProps, staff: ', staff);
    if (state.modals.staffToEditId) {
      staff = editStaff;
    }
    initialValues = staff;
    // initialValues.staff_date = dateString;
    console.log('in StaffEditModal, mapStateToProps, initialValues: ', initialValues);

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
      contractorId: state.modals.selectedContractorId,
      staffId: state.modals.selectedStaffId,
      staff,
      contractor,
      // editStaffId: state.modals.staffToEditId,
      // editStaff,
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
