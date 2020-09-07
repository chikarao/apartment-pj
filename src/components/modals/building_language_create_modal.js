import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';

import AppLanguages from '../constants/app_languages';
import Building from '../constants/building';
import FormChoices from '../forms/form_choices';

// Note: This component is called in header not my page!!!!!!!!
let showHideClassName;

class BuildingLanguageCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createBuildingLanguageCompleted: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    // console.log('in signin, handleFormSubmit, data: ', data);
    let delta = {}
    delta = data;
    // _.each(Object.keys(data), each => {
    //   // console.log('in edit flat, handleFormSubmit, each, data[each], this.props.initialValues[each]: ', each, data[each], this.props.initialValues[each]);
    //   if (data[each] !== this.props.initialValues[each]) {
    //     console.log('in edit flat, handleFormSubmit, each: ', each);
    //     delta[each] = data[each]
    //   }
    // })
    delta.building_id = this.props.building.id;
    // delta.language_code = this.props.building.id;
    console.log('in building_language_create_modal, handleFormSubmit: ', delta);
    const dataToSend = { building_language: delta, flat_id: this.props.flat.id }
    this.props.createBuildingLanguage(dataToSend, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    // console.log('in signin, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ createBuildingLanguageCompleted: true });
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

  handleClose() {
    // console.log('in buildingLanguage_edit_modal, handleClose, this.props.showBuildingLanguageEdit: ', this.props.showBuildingLanguageEdit);
      this.props.showBuildingLanguageCreateModal();
      this.props.selectedBuildingLanguageId('');
      this.setState({ createBuildingLanguageCompleted: false });
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
            props={fieldComponent == FormChoices ? { model: Building, record: this.props.building, create: true, existingLanguageArray: this.props.buildingLanguageLanguageArray } : {}}
            type={formField.type}
            className={formField.component == 'input' || 'textarea' ? 'form-control' : ''}
          />
          </fieldset>
        );
      }
    })
  }

  renderCreateBuildingLanguageForm() {
    const { handleSubmit, building } = this.props;
    // const buildingLanguageEmpty = _.isEmpty(this.props.buildingLanguage);
    if (building) {
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // console.log('in modal, render showHideClassName:', showHideClassName);
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
          <section className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title">{AppLanguages.createBuildingLanguage[this.props.appLanguageCode]}</h3>
          {this.renderAlert()}
          <div className="edit-buildingLanguage-scroll-div">
            <form onSubmit={handleSubmit(this.handleFormSubmit)}>
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
          <div className="post-action-message">Your buildingLanguage has been successfully created.</div>
        </div>
      </div>
    )
  }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.state.createBuildingLanguageCompleted ? this.renderPostEditMessage() : this.renderCreateBuildingLanguageForm()}
      </div>
    );
  }
}

BuildingLanguageCreateModal = reduxForm({
  form: 'BuildingLanguageCreateModal'
})(BuildingLanguageCreateModal);

function getLanguageArray(buildingLanguages) {
  console.log('in buildingLanguage_create_modal, getLanguageArray, buildingLanguages: ', buildingLanguages);
  let array = [];
  _.each(buildingLanguages, eachBuildingLanguage => {
    // if (!array.includes(eachBuildingLanguage.language_code)) {
    if (array.indexOf(eachBuildingLanguage.language_code) === -1) {
      array.push(eachBuildingLanguage.language_code)
    }
  });
  return array;
}

// function getInitialValues(buildingLanguage) {
//   const objectReturned = {};
//   _.each(Object.keys(BuildingLanguage), eachAttribute => {
//     // if attribute is indepedent of language (just numbers or buttons)
//     if (BuildingLanguage[eachAttribute].language_independent) {
//       // add to object to be assiged to initialValues
//       objectReturned[eachAttribute] = buildingLanguage[eachAttribute];
//     }
//   });
//   // add base_record_id that references the original buildingLanguage that was created
//   // having this identifies buildingLanguage group to which buildingLanguage belongs
//   // objectReturned.base_record_id = buildingLanguage.id;
//   return objectReturned;
// }

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  let initialValues = {};
  const { building } = state.flat.selectedFlatFromParams;
  const { building_languages } = building;
  // const buildingLanguage = state.auth.user.buildingLanguages[0];
  const buildingLanguageLanguageArray = getLanguageArray(building_languages);
  buildingLanguageLanguageArray.push(building.language_code)
  console.log('in buildingLanguage_create_modal, mapStateToProps, buildingLanguageLanguageArray: ', buildingLanguageLanguageArray);
  // initialValues = getInitialValues(buildingLanguage);

  console.log('in buildingLanguage_create_modal, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    // userBuildingLanguage: state.auth.userBuildingLanguage
    appLanguageCode: state.languages.appLanguageCode,
    building,
    flat: state.flat.selectedFlatFromParams,
    buildingLanguageLanguageArray,
    showBuildingLanguageCreate: state.modals.showBuildingLanguageCreateModal,
    initialValues
  };
}


export default connect(mapStateToProps, actions)(BuildingLanguageCreateModal);
