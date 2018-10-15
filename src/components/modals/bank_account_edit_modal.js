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

class BankAccountEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editBankAccountCompleted: false,
      // deleteBankAccountCompleted: false,
      selectedBankAccountId: ''
    };
  }
  //
  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    // !!!!only persist first 4 characters of account number
    data.account_number = data.account_number.slice(0, 4);
    // console.log('in edit flat, handleFormSubmit, data.account_number, data.account_number.slice(0, 4);: ', data.account_number, data.account_number.slice(0, 4));
    const dataToBeSent = { bank_account: data };
    // send all data for account; gets assigned user_id on api based on token
    console.log('in BankAccountEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.updateBankAccount(dataToBeSent, this.props.bankAccountId, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in BankAccountEditModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editBankAccountCompleted: true });
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

  // turn off showBankAccountEditModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    if (this.props.showBankAccountEditModal) {
      this.props.showBankAccountEditModal();
      this.setState({ editBankAccountCompleted: false });
    }
  }

  renderEachBankAccountField() {
    let fieldComponent = '';
    return _.map(BankAccount, (formField, i) => {
      // console.log('in bank_account_edit_modal, renderEachBankAccountField, formField: ', formField);
      if (formField.component == 'FormChoices') {
        fieldComponent = FormChoices;
      } else {
        fieldComponent = formField.component;
      }
      // console.log('in bank_account_edit_modal, renderEachBankAccountField, this.props.appLanguageCode: ', this.props.appLanguageCode);

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

  renderEditBankAccountForm() {
    const { handleSubmit } = this.props;

    // if (this.props.flat) {
      console.log('in bank_account_edit_modal, renderEditBankAccountForm, this.props.show ', this.props.show );
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Edit Bank Account</h3>

            <div className="edit-profile-scroll-div">
              {this.renderAlert()}
              <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                {this.renderEachBankAccountField()}
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
          <div className="post-signup-message">The bank account has been successfully updated.</div>
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.editBankAccountCompleted ? this.renderPostEditDeleteMessage() : this.renderEditBankAccountForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
BankAccountEditModal = reduxForm({
  form: 'BankAccountEditModal',
  enableReinitialize: true
})(BankAccountEditModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in BankAccountEditModal, mapStateToProps, state: ', state);
  if (state.auth.bankAccounts) {
    let initialValues = {};
    _.each(state.auth.bankAccounts, eachAccount => {
      if (eachAccount.id == state.auth.selectedBankAccountId) {
        _.each(Object.keys(BankAccount), eachKey => {
          initialValues[eachKey] = eachAccount[eachKey];
        })
      }
    });
    console.log('in BankAccountEditModal, mapStateToProps, initialValues: ', initialValues);

    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      // userProfile: state.auth.userProfile
      // initialValues: state.auth.userProfile
      // languages: state.languages,
      showBankAccountEdit: state.modals.showBankAccountEditModal,
      appLanguageCode: state.languages.appLanguageCode,
      bankAccounts: state.auth.bankAccounts,
      bankAccountId: state.auth.selectedBankAccountId,
      // set initial values to be bankaccount.id == selectedBankAccountId
      initialValues
    };
  } else {
    return {};
  }
}


export default connect(mapStateToProps, actions)(BankAccountEditModal);
