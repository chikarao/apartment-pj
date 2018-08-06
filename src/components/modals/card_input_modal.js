import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import SwipeInput from '../payments/parent';

let showHideClassName;

class CardInputModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCardCompleted: false
    };
  }

  componentDidMount() {
    console.log('in CardInputModal, componentDidMount:');
  }

  // handleFormSubmit(data) {
    // const dataWithRating = { id: data.id, comment: data.comment, title: data.title, rating: this.state.goldStarNum };
    // // dataWithRating.rating = this.state.goldStarNum;
    // console.log('in CardInputModal, handleFormSubmit, dataWithRating: ', dataWithRating);
    // console.log('in CardInputModal, handleFormSubmit, data: ', data);
    //
  // }

  handleFormSubmitCallback() {
    // console.log('in CardInputModal, handleFormSubmitCallback: ');
    // // showHideClassName = 'modal display-none';
    // this.setState({ editReviewCompleted: true });
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
    // switch off showeditreview boolean in state to close modal
    // this.props.showEditReview();
    // // switch off editReviewCompleted so when edit clicked again, it shows form not message
    this.setState({ addCardCompleted: true });
    this.props.showCardInputModal();
  }

  handleFormSubmit(data) {
    console.log('in CardInputModal, handleFormSubmit:', data);
    const customerId = this.props.auth.customer.id;
    const cardId = this.props.auth.selectedCardId;

    this.props.updateCardInfo({ customerId, cardId, expMonth: data.expMonth, expYear: data.expYear });

  }

  renderAddCardInput() {
      const { handleSubmit, initialValues } = this.props;
      console.log('in CardInputModal, renderAddCardInput, initialValues:', initialValues);
    if (this.props.actionType == 'Add a Card') {
      return (
        <div>
        <SwipeInput
          buttonText='Add Card'
          actionType={this.props.auth.userProfile.user.stripe_customer_id ? 'addCard' : 'addCustomer'}
        />
        </div>
      );
    } else {
      return (
        <div>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <fieldset key={1} className="form-group">
            <label className="create-flat-form-label">Exp Month:</label>
            <Field name="expMonth" component="select" type="integer" className="form-control">
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
            <Field name="expYear" component="select" type="integer" className="form-control">
            <option></option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
              <option value="2029">2029</option>
              <option value="2030">2030</option>
              </ Field>
          </fieldset>

        <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">Submit</button>

        </form>
        </div>
      );
    }
  }

  renderCardInput() {
    const { handleSubmit } = this.props;
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    //handleClose is a prop passed from header when SigninModal is called
    if (this.props.auth.userProfile) {
      console.log('in CardInputModal, this.props.actionType:', this.props.actionType);
      return (
        <div className={showHideClassName}>
          <div className="modal-main">
            <h3 className="auth-modal-title">{this.props.actionType}</h3>
            <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
            {this.renderAddCardInput()}
            {this.renderAlert()}
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

// function getCardForEdit(cards, selectedCardId) {
//   console.log('in CardInputModal, getCardForEdit, cards, selectedCardId : ', selectedCardId);
//   const cardArray = [];
//   _.each(cards, card => {
//     if (card.id == selectedCardId) {
//       cardArray.push(card);
//     }
//   });
//   return cardArray[0];
// }

CardInputModal = reduxForm({
  form: 'CardInputModal'
  // fields: [
  //   'address1',
  //   'city',
  //   'zip',
  //   'country',
  //   'area',
  //   'price_per_day',
  //   'price_per_month',
  //   'guests',
  //   'sales_point',
  //   'description',
  //   'rooms',
  //   'beds',
  //   'flat_type',
  //   'bath'
  // ]
})(CardInputModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  // let initialValues = {};
  // if (state.auth.customer) {
  //   const cards = state.auth.customer.sources.data;
  //   if (state.auth.selectedCardId) {
  //     const cardId = getCardForEdit(cards, state.auth.selectedCardId);
  //     console.log('in CardInputModal, mapStateToProps, initialValues: ', initialValues);
  //   }
  // }
  // initialValues =
  console.log('in CardInputModal, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    // review: state.reviews,
    // userProfile: state.auth.userProfile
    // initialValues: state.reviews.reviewForBookingByUser
    // initialValues
  };
}


export default connect(mapStateToProps, actions)(CardInputModal);
