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

class StaffCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createStaffCompleted: false,
      deleteStaffCompleted: false,
      selectedStaffId: ''
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
    // const dataToBeSent = { staff: data };
    let dataToChange = data;
    dataToChange.contractor_id = this.props.contractorId;
    const dataToBeSent = { staff: dataToChange };
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in StaffCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.createStaff(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in StaffCreateModal, handleFormSubmitCallback: ');
    this.props.selectedStaffId('');
    // showHideClassName = 'modal display-none';
    this.setState({ createStaffCompleted: true });
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

  // turn off showStaffCreateModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    console.log('in staff_create_modal, handleClose, this.props.showStaffEdit: ', this.props.showStaffEdit);

    // if (this.props.showStaffEdit) {
      this.props.showStaffCreateModal();
      this.props.selectedStaffId('');
      this.props.addNew ? this.props.addNewStaff() : '';
      this.setState({ createStaffCompleted: false });
    // }
  }

  renderEachStaffField() {
    let fieldComponent = '';
    return _.map(Staff, (formField, i) => {
      // console.log('in staff_create_modal, renderEachStaffField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      console.log('in staff_create_modal, renderEachStaffField, fieldComponent: ', fieldComponent);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}:</label>
          <Field
            name={formField.name}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: Staff, record: this.props.staff, create: true, existingLanguageArray: this.props.staffLanguageArray } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
          />
        </fieldset>
      );
    });
  }

  handleDeleteStaffClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.props.showLoading()
    this.props.deleteStaff(elementVal, () => this.handleDeleteStaffCallback());
  }

  handleDeleteStaffCallback() {
    this.setState({ createStaffCompleted: true, deleteStaffCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  renderEditStaffForm() {
    console.log('in staff_create_modal, renderEditStaffForm, this.props.showStaffEdit: ', this.props.showStaffEdit);

    const { handleSubmit } = this.props;

    if (this.props.auth) {
      console.log('in staff_create_modal, renderEditStaffForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Create Staff</h3>
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
            <div className="post-signup-message">The staff has been successfully deleted.</div>
            :
            <div className="post-signup-message">The staff has been successfully created.</div>
          }
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    console.log('in staff_create_modal, render this.state.createStaffCompleted: ', this.state.createStaffCompleted);
    return (
      <div>
        {this.state.createStaffCompleted ? this.renderPostEditDeleteMessage() : this.renderEditStaffForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
StaffCreateModal = reduxForm({
  form: 'StaffCreateModal',
  enableReinitialize: true
})(StaffCreateModal);

// function getExistingLanguages(staffs) {
//   const array = []
//   // _.each()
//   return array;
// }

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
      console.log('in staff_create_modal, getStaff, eachStaff: ', eachStaff);
      if (eachStaff.id == id) {
        staff = eachStaff;
        return;
      }
    });

  return staff;
}

function getInitialValues(staff) {
  const objectReturned = {};
  _.each(Object.keys(Staff), eachAttribute => {
    // if attribute is indepedent of language (just numbers or buttons)
    if (Staff[eachAttribute].language_independent) {
      // add to object to be assiged to initialValues
      objectReturned[eachAttribute] = staff[eachAttribute];
    }
  });
  // add base_record_id that references the original staff that was created
  // having this identifies staff group to which staff belongs
  objectReturned.base_record_id = staff.id;
  return objectReturned;
}

function getLanguageArray(staffs, baseStaff) {
  let array = [];
  _.each(staffs, eachStaff => {
    if (eachStaff.base_record_id == baseStaff.id) {
      if (!array.includes(eachStaff.language_code)) {
        array.push(eachStaff.language_code);
      }
      if (!array.includes(baseStaff.language_code)) {
        array.push(baseStaff.language_code);
      }
    }
  });
  return array;
}

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in StaffCreateModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state.auth.user) {
    let initialValues = {};
    // initialValues.language_code = 'en';
    const contractor = getContractor(state.auth.user.contractors, state.modals.selectedContractorId);
    const { staffs } = contractor;
    let staff = {};
    let staffLanguageArray = [];
    // if user click is not to create a brand new staff; ie to add a language not a new staff
    if (!state.modals.addNewStaff) {
      staff = getStaff(staffs, state.modals.selectedStaffId);
      console.log('in StaffCreateModal, mapStateToProps, staff: ', staff);
      staffLanguageArray = getLanguageArray(staffs, staff);
      console.log('in StaffCreateModal, mapStateToProps, staffLanguageArray: ', staffLanguageArray);
      initialValues = getInitialValues(staff);
    }
    // console.log('in StaffCreateModal, mapStateToProps, staff: ', staff);
    // const existingLanguagesArray = getExistingLanguages(staffs);
    // console.log('in StaffCreateModal, mapStateToProps, staff: ', staff);
    // initialValues = staff;
    // // initialValues.staff_date = dateString;
    // console.log('in StaffCreateModal, mapStateToProps, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      showStaffEdit: state.modals.showStaffCreateModal,
      appLanguageCode: state.languages.appLanguageCode,
      contractorId: state.modals.selectedContractorId,
      staffId: state.modals.selectedStaffId,
      staff,
      addNew: state.modals.addNewStaff,
      staffLanguageArray,
      // set initialValues to be first calendar in array to match selectedStaffId
      initialValues
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(StaffCreateModal);
