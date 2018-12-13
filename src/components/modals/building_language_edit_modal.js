import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';

import AppLanguages from '../constants/app_languages';
import Languages from '../constants/languages';

import Building from '../constants/building';
import FormChoices from '../forms/form_choices';

// Note: This component is called in header not my page!!!!!!!!
let showHideClassName;

class BuildingLanguageEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editBuildingLanguageCompleted: false,
      deleteBuildingLanguageCompleted: false
    };
  }

  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    // console.log('in signin, handleFormSubmit, data: ', data);
    const delta = {}
    _.each(Object.keys(data), each => {
      // console.log('in edit flat, handleFormSubmit, each, data[each], this.props.initialValues[each]: ', each, data[each], this.props.initialValues[each]);
      if (data[each] !== this.props.initialValues[each]) {
        // console.log('in edit flat, handleFormSubmit, each: ', each);
        delta[each] = data[each]
      }
    })
    // buildingLanguage id
    delta.id = this.props.initialValues.id;
    // building.id
    delta.building_id = this.props.building.id;
    console.log('in edit flat, handleFormSubmit, delta: ', delta);
    const dataToSend = { building_language: delta, flat_id: this.props.flat.id }
    this.props.editBuildingLanguage(dataToSend, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    // console.log('in signin, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editBuildingLanguageCompleted: true });
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

  handleDeleteBuildingLanguageClick() {
    const deleteParams = { building_id: this.props.building.id, id: this.props.buildingLanguage.id, flat_id: this.props.flat.id}
    this.props.deleteBuildingLanguage(deleteParams, () => this.deleteBuildingLanguageCallback());
  }

  deleteBuildingLanguageCallback() {
    this.setState({ deleteBuildingLanguageCompleted: true, editBuildingLanguageCompleted: true });
  }

  handleEditLanguageClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.props.buildingLanguageToEditId(elementVal);
  }

  renderEditLanguageLink() {
    // get staffs with same id and base_record_id, or same staff group of languages
    // return _.map(this.props.building.staffs, (eachBuildingLanguage, i) => {
    console.log('in building_langugae_edit_modal, renderEditLanguageLink, this.props.building.building_languages: ', this.props.building.building_languages);
    return _.map(this.props.buildingLanguages, (eachBuildingLanguage, i) => {
      // const baseRecordOrNot = this.baseRecordOrNot(eachBuildingLanguage);
      if (this.props.buildingLanguage.id !== eachBuildingLanguage.id) {
        return (
          <div
            key={i}
            value={eachBuildingLanguage.id}
            className="modal-edit-language-link"
            onClick={this.handleEditLanguageClick.bind(this)}
          >
            {Languages[eachBuildingLanguage.language_code].flag}&nbsp;{Languages[eachBuildingLanguage.language_code].name}
          </div>
        );
      }
    });
  }

  handleClose() {
    console.log('in buildingLanguage_edit_modal, handleClose, this.props.showBuildingLanguageEdit: ', this.props.showBuildingLanguageEdit);
      this.props.showBuildingLanguageEditModal();
      this.props.selectedBuildingLanguageId('');
      this.props.selectedBuildingId('');
      this.setState({ editBuildingLanguageCompleted: false, deleteBuildingLanguageCompleted: false });
  }

  renderEachInputField() {
    let fieldComponent = '';

    return _.map(Building, (formField, i) => {
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
        // console.log('in buildingLanguage_edit_modal, in renderEachInputField, formField:', formField);
        // console.log('in buildingLanguage_edit_modal, in renderEachInputField, BuildingLanguage.language_code, this.props.buildingLanguage, this.props.buildingLanguage.language_code:', BuildingLanguage.language_code, this.props.buildingLanguage, this.props.buildingLanguage.language_code);
      if (!formField.language_independent) {
        return (
          <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField[this.props.appLanguageCode]}:</label>
          <Field
            name={formField.name}
            component={fieldComponent}
            props={fieldComponent == FormChoices ? { model: Building, record: this.props.buildingLanguage, create: false } : {}}
            type={formField.type}
            className={formField.component == 'input' || 'textarea' ? 'form-control' : ''}
          />
          </fieldset>
        );
      }
    })
  }

  renderEditBuildingLanguageForm() {
    const { handleSubmit } = this.props;
    const buildingLanguageEmpty = _.isEmpty(this.props.buildingLanguage);
    if (!buildingLanguageEmpty) {
      console.log('in modal, renderEditBuildingLanguageForm this.props.buildingLanguage:', this.props.buildingLanguage);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
          <section className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title">{AppLanguages.editBuildingLanguage[this.props.appLanguageCode]}</h3>
          <div className="modal-edit-delete-edit-button-box">
            <button value={this.props.buildingLanguage.id} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteBuildingLanguageClick.bind(this)}>{AppLanguages.delete[this.props.appLanguageCode]}</button>
            <div className="modal-edit-language-link-box">
                {this.renderEditLanguageLink()}
            </div>
          </div>
          {this.renderAlert()}
          <div className="edit-buildingLanguage-scroll-div">
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
              {this.renderEachInputField()}
              <div className="confirm-change-and-button">
              <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">{AppLanguages.submit[this.props.appLanguageCode]}</button>
              </div>
            </form>
          </div>
          </section>
        </div>
      );
    }
  }

  renderPostEditMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          {this.state.deleteBuildingLanguageCompleted ?
            <div className="post-signup-message">Your building language has been successfully deleted.</div>
            :
            <div className="post-signup-message">Your building language has been successfully updated.</div>
          }
        </div>
      </div>
    )
  }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.state.editBuildingLanguageCompleted ? this.renderPostEditMessage() : this.renderEditBuildingLanguageForm()}
      </div>
    );
  }
}

BuildingLanguageEditModal = reduxForm({
  form: 'BuildingLanguageEditModal',
  enableReinitialize: true
})(BuildingLanguageEditModal);

function getBuildingLanguage(buildingLanguages, id) {
  // placeholder for when add lanauge
  let buildingLanguage = {};
    _.each(buildingLanguages, eachBuildingLanguage => {
      console.log('in staff_create_modal, getBuildingLanguage, eachBuildingLanguage: ', eachBuildingLanguage);
      if (eachBuildingLanguage.id == id) {
        buildingLanguage = eachBuildingLanguage;
        return;
      }
    });

  return buildingLanguage;
}

function getEditBuildingLanguage(buildingLanguages, id) {
  // placeholder for when add lanauge
  let buildingLanguage = {};
    _.each(buildingLanguages, eachBuildingLanguage => {
      console.log('in buildingLanguage_edit_modal, getEditBuildingLanguage, eachBuildingLanguage: ', eachBuildingLanguage);
      if (eachBuildingLanguage.id == id) {
        buildingLanguage = eachBuildingLanguage;
        return;
      }
    });

  return buildingLanguage;
}

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  if (state.flat.selectedFlatFromParams) {
    let initialValues = {};
    const { building_languages } = state.flat.selectedFlatFromParams.building;
    const buildingLanguage = getBuildingLanguage(building_languages, state.modals.selectedBuildingLanguageId);
    console.log('in buildingLanguage_edit_modal, mapStateToProps, buildingLanguage: ', buildingLanguage);
    // const editBuildingLanguage = getEditBuildingLanguage(building_languages, parseInt(state.modals.buildingLanguageToEditId, 10));
    //
    // if (state.modals.buildingLanguageToEditId) {
    //   console.log('in buildingLanguage_edit_modal, mapStateToProps, editBuildingLanguage: ', editBuildingLanguage);
    //   buildingLanguage = editBuildingLanguage;
    // }

    initialValues = buildingLanguage;
    console.log('in buildingLanguage_edit_modal, mapStateToProps, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      // user: state.auth.user,
      appLanguageCode: state.languages.appLanguageCode,
      buildingLanguage,
      buildingLanguageId: state.modals.selectedBuildingLanguageId,
      showBuildingLanguageEdit: state.modals.showBuildingLanguageEditModal,
      building: state.flat.selectedFlatFromParams.building,
      flat: state.flat.selectedFlatFromParams,
      initialValues
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(BuildingLanguageEditModal);
