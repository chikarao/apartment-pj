import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
// import languages from '../constants/languages';
import BankAccount from '../constants/bank_account';
import FormChoices from '../forms/form_choices';

let showHideClassName;

class BankAccountCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createBankAccountCompleted: false,
      // deleteBankAccountCompleted: false,
      selectedBankAccountId: ''
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
    const dataToBeSent = { bank_account: data };
    // dataToBeSent.flat_id = this.props.flat.id;
    console.log('in BankAccountCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.createBankAccount(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in BankAccountCreateModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ createBankAccountCompleted: true });
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

  // turn off showBankAccountCreateModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    if (this.props.showBankAccountCreateModal) {
      this.props.showBankAccountCreateModal();
      this.setState({ createBankAccountCompleted: false });
    }
  }

  renderEachBankAccountField() {
    let fieldComponent = '';
    return _.map(BankAccount, (formField, i) => {
      // console.log('in bank_account_create_modal, renderEachBankAccountField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in bank_account_create_modal, renderEachBankAccountField, this.props.appLanguageCode: ', this.props.appLanguageCode);

      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{formField[this.props.appLanguageCode]}:</label>
          <Field
            name={formField.name}
            // component={fieldComponent}
            component={fieldComponent}
            // pass page to custom compoenent, if component is input then don't pass
            props={fieldComponent == FormChoices ? { model: BankAccount } : {}}
            type={formField.type}
            className={formField.component == 'input' ? 'form-control' : ''}
            // style={eachKey.component == 'input' ? }
          />
        </fieldset>
      );
    });
  }

  renderCreateBankAccountForm() {
    const { handleSubmit } = this.props;

    // if (this.props.flat) {
      console.log('in bank_account_create_modal, renderCreateBankAccountForm');
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Create Bank Account</h3>

            <div className="edit-profile-scroll-div">
              {this.renderEachBankAccountField()}
              {this.renderAlert()}
              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
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
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">The bank account has been successfully created.</div>
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.createBankAccountCompleted ? this.renderPostEditDeleteMessage() : this.renderCreateBankAccountForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
BankAccountCreateModal = reduxForm({
  form: 'BankAccountCreateModal',
  enableReinitialize: true
})(BankAccountCreateModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in BankAccountCreateModal, mapStateToProps, state: ', state);
  // get clicked calendar
  // const calendarArray = [];
  // if (state.selectedFlatFromParams.selectedFlatFromParams) {
  //   const initialValues = {};
  //   const flat = state.selectedFlatFromParams.selectedFlatFromParams;
  // //   // console.log('in BankAccountCreateModal, mapStateToProps, calendars, selectedBankAccountId: ', calendars, selectedBankAccountId);
  //   _.each(Object.keys(flat), flatKeys => {
  //     console.log('in BankAccountCreateModal, mapStateToProps, flatAttribute, BankAccount[flatKeys]: ', flatKeys, BankAccount[flatKeys]);
  //     if (BankAccount[flatKeys]) {
  //       initialValues[flatKeys] = flat[flatKeys]
  //     }
  //   });
  //     console.log('in BankAccountCreateModal, mapStateToProps, initialValues: ', initialValues);
  // console.log('in BankAccountCreateModal, mapStateToProps, calendarArray[0]: ', calendarArray[0]);
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
    showBankAccountEdit: state.modals.showBankAccountCreateModal,
    appLanguageCode: state.languages.appLanguageCode,
    // get the first calendar in array to match selectedBankAccountId
    // calendar: calendarArray[0],
    // language: state.languages.selectedLanguage,
    // set initialValues to be first calendar in array to match selectedBankAccountId
    // initialValues
    // initialValues: state.selectedFlatFromParams.selectedFlatFromParams
    // initialValues
  };
}


export default connect(mapStateToProps, actions)(BankAccountCreateModal);
