import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import languages from '../constants/languages';
import Building from '../constants/building';
import FormChoices from '../forms/form_choices';

let showHideClassName;

class BuildingCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createBuildingCompleted: false,
      // deleteBuildingCompleted: false,
      selectedBuildingId: ''
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
    const dataToBeSent = { building: data, flat_id: this.props.flat.id };
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in BuildingCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.createBuilding(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in BuildingCreateModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ createBuildingCompleted: true });
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

  // turn off showBuildingCreateModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    if (this.props.showBuildingEdit) {
      this.props.showBuildingCreateModal();
      this.setState({ createBuildingCompleted: false });
    }
  }

  renderEachBuildingField() {
    let fieldComponent = '';
    return _.map(Building, (formField, i) => {
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
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </fieldset>
      );
    });
  }

  renderCreateBuildingForm() {
    const { handleSubmit } = this.props;

    if (this.props.flat) {
      console.log('in building_edit_modal, renderEditBuildingForm, this.props.flat: ', this.props.flat);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Create Building</h3>

            <div className="edit-profile-scroll-div">
              {this.renderAlert()}

              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
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
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">The building has been successfully created.</div>
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.createBuildingCompleted ? this.renderPostEditDeleteMessage() : this.renderCreateBuildingForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
BuildingCreateModal = reduxForm({
  form: 'BuildingCreateModal',
  enableReinitialize: true
})(BuildingCreateModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in BuildingCreateModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  if (state.selectedFlatFromParams.selectedFlatFromParams) {
    const initialValues = {};
    const flat = state.selectedFlatFromParams.selectedFlatFromParams;
  //   // console.log('in BuildingCreateModal, mapStateToProps, calendars, selectedBuildingId: ', calendars, selectedBuildingId);
    _.each(Object.keys(flat), flatKeys => {
      console.log('in BuildingCreateModal, mapStateToProps, flatAttribute, Building[flatKeys]: ', flatKeys, Building[flatKeys]);
      if (Building[flatKeys]) {
        initialValues[flatKeys] = flat[flatKeys]
      }
    });
      console.log('in BuildingCreateModal, mapStateToProps, initialValues: ', initialValues);
  // console.log('in BuildingCreateModal, mapStateToProps, calendarArray[0]: ', calendarArray[0]);
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
      showBuildingEdit: state.modals.showBuildingCreateModal,
      appLanguageCode: state.languages.appLanguageCode,
      // get the first calendar in array to match selectedBuildingId
      // calendar: calendarArray[0],
      // language: state.languages.selectedLanguage,
      // set initialValues to be first calendar in array to match selectedBuildingId
      initialValues
      // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
      // initialValues
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(BuildingCreateModal);
