import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import languages from '../constants/languages';
// import Building from '../constants/building';
import FormChoices from '../forms/form_choices';

let showHideClassName;

class BuildingEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editBuildingCompleted: false,
      deleteBuildingCompleted: false,
      selectedBuildingId: ''
    };
    this.handleDeleteBuildingClick = this.handleDeleteBuildingClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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
        delta[each] = data[each]
      }
    });

    delta.id = this.props.flat.building.id;
    const dataToBeSent = { building: delta, building_id: this.props.flat.building.id, flat_id: this.props.flat.id };
    // dataToBeSent.flat_id = this.props.flat.id;
    // console.log('in BuildingEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.updateBuilding(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    // console.log('in BuildingEditModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editBuildingCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  handleDeleteBuildingClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // const elementName = clickedElement.getAttsribute('name');
    // console.log('in building_edit_modal, handleDeleteBuildingClick, elementVal: ', elementVal);
    this.props.showLoading();
    // this.setState({ languageCode: elementName });
    // this.props.deleteBuilding({ id: elementVal }, () => this.handleDeleteCallback());
    // unlink flat with building by assigining null to building_id for flat
    this.props.showLoading()
    this.props.editFlat({ flat_id: this.props.flat.id, flat: { building_id: null }, amenity: { basic: true } }, () => this.handleDeleteCallback());
  }

  handleDeleteCallback() {
    this.setState({ deleteBuildingCompleted: true, editBuildingCompleted: true, selectedBuildingId: '' }, () => {
      this.props.showLoading()
    });
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

  // turn off showBuildingEditModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    if (this.props.showBuildingEdit) {
      this.props.showBuildingEditModal();
      this.setState({ editBuildingCompleted: false, deleteBuildingCompleted: false });
    }
  }

  renderEachBuildingField() {
    let fieldComponent = '';
    // return _.map(Building, (formField, i) => {
    return _.map(this.props.building, (formField, i) => {
      console.log('in building_edit_modal, renderEachBuildingField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in building_edit_modal, renderEachBuildingField, fieldComponent: ', fieldComponent);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}:</label>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            // props={{ appLanguageCode: this.props.appLanguageCode }}
            props={fieldComponent == FormChoices ? { model: this.props.building, record: this.props.flat.building, create: false } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </fieldset>
      );
    });
  }

  renderEditBuildingForm() {
    const { handleSubmit } = this.props;

    if (this.props.flat) {
      // console.log('in building_edit_modal, renderEditBuildingForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Edit Building</h3>

            <div className="edit-profile-scroll-div">
              <div className="edit-flat-delete-language-button">
                <button value={this.props.flat.building.id} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteBuildingClick}>Unlink Building</button>
              </div>
              {this.renderAlert()}

              <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                {this.renderEachBuildingField()}
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
          {this.state.deleteBuildingCompleted ?
            <div className="post-signup-message">The building has been deleted.</div>
            :
            <div className="post-signup-message">The building has been successfully updated.</div>
          }
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.editBuildingCompleted ? this.renderPostEditDeleteMessage() : this.renderEditBuildingForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
BuildingEditModal = reduxForm({
  form: 'BuildingEditModal',
  enableReinitialize: true
})(BuildingEditModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in BuildingEditModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state.selectedFlatFromParams.selectedFlatFromParams) {
    // const initialValues = { asbestos_survey_contents: 'Here are the contents'}
  //   const { calendars } = state.selectedFlatFromParams.selectedFlatFromParams;
  //   const { selectedBuildingId } = state.modals;
  //   // console.log('in BuildingEditModal, mapStateToProps, calendars, selectedBuildingId: ', calendars, selectedBuildingId);
  //   _.each(calendars, calendar => {
  //     if (calendar.id == selectedBuildingId) {
  //       calendarArray.push(calendar);
  //     }
  //   })
  // console.log('in BuildingEditModal, mapStateToProps, calendarArray[0]: ', calendarArray[0]);
  // const calendars = state.selectedFlatFromParams.selectedFlatFromParams.calendars
  // const calendar =
    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // userProfile: state.auth.userProfile
      // initialValues: state.auth.userProfile
      // languages: state.languages,
      showBuildingEdit: state.modals.showBuildingEditModal,
      appLanguageCode: state.languages.appLanguageCode,
      building: state.documents.documentConstants.building,
      // get the first calendar in array to match selectedBuildingId
      // calendar: calendarArray[0],
      // language: state.languages.selectedLanguage,
      // set initialValues to be first calendar in array to match selectedBuildingId
      initialValues: state.selectedFlatFromParams.selectedFlatFromParams.building
      // initialValues
    };
  }

  return {};
}


export default connect(mapStateToProps, actions)(BuildingEditModal);
