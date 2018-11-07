import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import languages from '../constants/languages';
// import Building from '../constants/building';
import Inspection from '../constants/inspection';
import FormChoices from '../forms/form_choices';

let showHideClassName;

class InspectionCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createInspectionCompleted: false,
      // deleteBuildingCompleted: false,
      selectedInspectionId: ''
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
    console.log('in InspectionCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.createBuilding(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in InspectionCreateModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ createInspectionCompleted: true });
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

  // turn off showInspectionCreateModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    if (this.props.showInspectionCreate) {
      this.props.showInspectionCreateModal();
      this.setState({ createInspectionCompleted: false });
    }
  }

  renderEachInspectionField() {
    let fieldComponent = '';
    return _.map(Inspection, (formField, i) => {
      console.log('in building_edit_modal, renderEachInspectionField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in building_edit_modal, renderEachInspectionField, fieldComponent: ', fieldComponent);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField.en}:</label>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: Inspection } : {}}
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
            <h3 className="auth-modal-title">Create Inspection</h3>

            <div className="edit-profile-scroll-div">
              {this.renderAlert()}

              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                {this.renderEachInspectionField()}
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
        {this.state.createInspectionCompleted ? this.renderPostEditDeleteMessage() : this.renderCreateBuildingForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
InspectionCreateModal = reduxForm({
  form: 'InspectionCreateModal',
  enableReinitialize: true
})(InspectionCreateModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in InspectionCreateModal, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    flat: state.selectedFlatFromParams.selectedFlatFromParams,
    showInspectionCreate: state.modals.showInspectionCreateModal,
    appLanguageCode: state.languages.appLanguageCode
  };
}

export default connect(mapStateToProps, actions)(InspectionCreateModal);
