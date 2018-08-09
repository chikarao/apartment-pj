import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import SwipeParent from '../payments/parent';
import cardAddressInputObject from '../constants/card_address_input'

let showHideClassName;

class CardInputModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCardCompleted: false,
      updateCardCompleted: false,
      paymentCompleted: false
    };
  }

  componentDidMount() {
    console.log('in CardInputModal, componentDidMount:');
    this.props.authError('');
  }

  componentDidUnMount() {
    console.log('in CardInputModal, componentDidUnMount:');
    this.props.authError('');
    // this.props.selectedCard(undefined, () => {});
  }

  // handleFormSubmit(data) {
    // const dataWithRating = { id: data.id, comment: data.comment, title: data.title, rating: this.state.goldStarNum };
    // // dataWithRating.rating = this.state.goldStarNum;
    // console.log('in CardInputModal, handleFormSubmit, dataWithRating: ', dataWithRating);
    // console.log('in CardInputModal, handleFormSubmit, data: ', data);
    //
  // }

  // handleFormSubmitCallback() {
    // console.log('in CardInputModal, handleFormSubmitCallback: ');
    // // showHideClassName = 'modal display-none';
    // this.setState({ editReviewCompleted: true });
  // }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          {this.props.errorMessage}
        </div>
      );
    }
  }

  handleClose() {
    // switch off showeditreview boolean in state to close modal
    // this.props.showEditReview();
    // // switch off editReviewCompleted so when edit clicked again, it shows form not message
    // this.setState({ addCardCompleted: true });
    this.props.showCardInputModal();
    this.setState({ addCardCompleted: false, updateCardCompleted: false, paymentCompleted: false });
    const expInputs = document.getElementsByClassName('exp-input');
    _.each(expInputs, exp => {
      console.log('in CardInputModal, handleClose, before each exp:', exp.value);
      const expValue = exp;
      expValue.value = '';
      console.log('in CardInputModal, handleClose, after each exp:', exp.value);
    });

    this.props.authError('');
    this.props.selectedCard(undefined, () => {});

    // const editCardInputs = document.getElementsByClassName('exp-input');
    // _.each(editCardInputs, input => {
    //   const inputToChange = input;
    //   inputToChange.value = '';
    // })
  }

  handleFormSubmit(data) {
    console.log('in CardInputModal, handleFormSubmit:', data);
    const customerId = this.props.auth.customer.id;
    const cardId = this.props.auth.selectedCard.id;
    if (!data.name) {
      this.props.authError('Please enter the name of the cardholder.');
      // this.props.showLoading();
    }

    const dataEmpty = _.isEmpty(data);
    if (!dataEmpty && data.name) {
      this.props.showLoading();
      this.props.updateCardInfo({
        customerId,
        cardId,
        exp_month: data.exp_month,
        exp_year: data.exp_year,
        name: data.name,
        address_line1: data.address_line1 ? data.address_line1 : null,
        address_line2: data.address_line2 ? data.address_line2 : null,
        // send address_line2 as null since stripe will not take an empty string
        address_city: data.address_city ? data.address_city : null,
        address_state: data.address_state ? data.address_state : null,
        address_zip: data.address_zip ? data.address_zip : null,
        address_country: data.address_country ? data.address_country : null
        // currency: data.currency,
      }, () => this.handleFormSubmitCallback());
    } else {
      this.props.authError('Please select month and/or year to update');
    }
  }

  handleFormSubmitCallback() {
    this.props.showLoading();
    this.setState({ updateCardCompleted: true });
    if (this.props.errorMessage) {
      this.props.authError('');
    }
  }

  renderCardAddressInputs() {
    return _.map(Object.keys(cardAddressInputObject), (inputs, i) => {
      return (
        <fieldset key={i} className="form-group">
          <label className="create-flat-form-label">{cardAddressInputObject[inputs]}:</label>
          <Field name={inputs} component="input" type="text" className="form-control card-form-control"></ Field>
        </fieldset>

      );
    });
  }

  renderEditCardFields() {
    // const customerEmpty = _.isEmpty(this.props.auth.customer);
    console.log('in CardInputModal, renderEditCardFields, before if this.props.initialValues:', this.props.initialValues);
    if (this.props.initialValues) {
      console.log('in CardInputModal, renderEditCardFields, this.props.initialValues:', this.props.initialValues);
      const { handleSubmit } = this.props;
      return (
        <div>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <fieldset key={1} className="form-group">
          <label className="create-flat-form-label">Exp Month:</label>
          <Field name="exp_month" component="select" type="integer" className="form-control card-form-control">
            <option></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </ Field>
          </fieldset>
          <fieldset key={2} className="form-group">
            <label className="create-flat-form-label">Exp Year:</label>
            <Field name="exp_year" component="input" type="integer" className="form-control card-form-control"></ Field>
          </fieldset>
          {this.renderCardAddressInputs()}
          <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">Submit</button>
        </form>
        </div>
      );
    }
  }

  handlePaymentFormSubmit(data) {
    console.log('in CardInputModal, handlePaymentFormSubmit, data: ', data);
    this.props.showLoading()
    this.props.makePayment({ amount: data.amount, currency: data.currency, description: data.description }, () => this.handlePaymentFormSubmitCallback());
  }

  handlePaymentFormSubmitCallback() {
    this.props.showLoading()
    this.setState({ paymentCompleted: true })
  }

  renderPaymentFields() {
      console.log('in CardInputModal, renderEditCardFields, this.props.initialValues:', this.props.initialValues);
      const { handleSubmit } = this.props;
      return (
        <div>
          <form onSubmit={handleSubmit(this.handlePaymentFormSubmit.bind(this))}>
            <fieldset key={11} className="form-group">
              <label className="create-flat-form-label">Payment Amount:</label>
              <Field name="amount" component="input" type="integer" className="form-control exp-input">
            </ Field>
            </fieldset>
            <fieldset key={12} className="form-group">
              <label className="create-flat-form-label">Currency:</label>
              <Field name="currency" component="select" type="string" className="form-control exp-input">
                <option></option>
                <option value="jpy">Japanese Yen</option>
                <option value="usd">US Dollar</option>
                <option value="eur">Euro</option>
                <option value="gbp">British Pound</option>
              </ Field>
            </fieldset>
            <fieldset key={13} className="form-group">
              <label className="create-flat-form-label">Notes:</label>
              <Field name="description" component="input" type="string" className="form-control exp-input"></ Field>
            </fieldset>
            <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">Submit</button>
          </form>
          {this.renderAlert()}
          {this.state.paymentCompleted ? <div className="alert alert-success" style={{ color: 'gray', fontSize: '17px' }}>Payment Completed!</div> : ''}
        </div>
      );
  }

  renderEachCardInput() {
    console.log('in CardInputModal, renderEachCardInput, this.props.auth.cardActionType:', this.props.auth.cardActionType);
    if (this.props.auth.cardActionType == 'Add a Card') {
      return (
        <div>
          <SwipeParent
            buttonText='Add Card'
            // actionType={this.props.auth.userProfile.user.stripe_customer_id ? 'addCard' : 'addCustomer'}
          />
        </div>
      );
    } else if (this.props.auth.cardActionType == 'Make a Payment') {
        return (
          <div>
            {this.renderPaymentFields()}
          </div>
        );
    } else {
      return (
        <div>
          {this.renderEditCardFields()}
        </div>
      );
    }
  }

  renderCompletedMessage() {
    return (
      <div>Completed!</div>
    );
  }

  renderCardInput() {
    const { handleSubmit } = this.props;
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    //handleClose is a prop passed from header when SigninModal is called
    // {this.state.updateCardCompleted || this.state.addCardCompleted ? this.renderCompletedMessage() : this.renderCardInput()}
    if (this.props.auth.userProfile) {
      return (
        <div className={showHideClassName}>
          <div className="modal-main">
            <h3 className="auth-modal-title">{this.props.auth.cardActionType}</h3>
            <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
            {this.renderEachCardInput()}
            {this.renderAlert()}
            {this.state.updateCardCompleted ? <div className="alert alert-success" style={{ color: 'gray', fontSize: '17px' }}>Card Updated!</div> : ''}
          </div>
        </div>
      );
    }
  }

  // renderPostEditMessage() {
  //   showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
  //   //handleClose is a prop passed from header when SigninModal is called
  //   return (
  //     <div className={showHideClassName}>
  //       <div className="modal-main">
  //         <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
  //         {this.renderAlert()}
  //         <div className="post-signup-message">Your review has been updated.</div>
  //       </div>
  //     </div>
  //   );
  // }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    // {this.state.editReviewCompleted ? this.renderPostEditMessage() : this.renderEditReviewForm()}
    // console.log('in CardInputModal, render, this.state.editReviewCompleted: ', this.state.editReviewCompleted);
    return (
      <div>
      {this.renderCardInput()}
      </div>
    );
  }
}

// Reference: https://stackoverflow.com/questions/42711504/how-to-reset-initial-value-in-redux-form
// !!!!!!enableReinitialize allow for edit modals to be closed and open with new initialValue props.
CardInputModal = reduxForm({
  form: 'CardInputModal',
  enableReinitialize: true
})(CardInputModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  // let initialValues = {};
  // initialValues = state.auth.selectedCard;

  console.log('in CardInputModal, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    charge: state.auth.charge,
    initialValues: state.auth.selectedCard
  };
}


export default connect(mapStateToProps, actions)(CardInputModal);
