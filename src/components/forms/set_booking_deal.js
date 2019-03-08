import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, Field, isDirty } from 'redux-form';
// import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';
import AppLanguages from '../constants/app_languages';

class SetFinalBookingTermsFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // editReviewCompleted: false,
      // clickedStar: 0,
      // starClicked: false,
      // goldStarNum: 0
    };
    // this.handleStarClick = this.handleStarClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    const { id, user_id, flat_id } = this.props.booking;
    console.log('in SetFinalBookingTermsFrom, handleFormSubmit, data: ', data);
    const bookingAttributes = { booking_id: id, user_id, flat_id };
    // bookingAttributes.rating = this.state.goldStarNum;
    console.log('in SetFinalBookingTermsFrom, handleFormSubmit, bookingAttributes: ', bookingAttributes);
    console.log('in SetFinalBookingTermsFrom, handleFormSubmit, data: ', data);
    console.log('in SetFinalBookingTermsFrom, handleFormSubmit, booking: ', this.props.booking);
    this.props.editBooking(bookingAttributes, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    // console.log('in SetFinalBookingTermsFrom, handleFormSubmitCallback: ', this.props);
    // showHideClassName = 'modal display-none';
    // this.setState({ editReviewCompleted: true });
    // this.props.history.push(`/bookingconfirmation/${this.props.booking.id}`);
  }

  // handleStarClick(event) {
  //   const clickedElement = event.target;
  //   const elementVal = clickedElement.getAttribute('value');
  //   // console.log('in SetFinalBookingTermsFrom, handleStarClick, elementVal:', elementVal);
  //   const elementValNum = parseInt(elementVal, 10);
  //   this.setState({ clickedStar: elementValNum, starClicked: true }, () => {
  //     // console.log('in SetFinalBookingTermsFrom, handleStarClick, this.state.clickedStar:', this.state.clickedStar);
  //     this.setState({ goldStarNum: this.state.clickedStar + 1 }, () => {
  //       // console.log('in SetFinalBookingTermsFrom, handleStarClick, this.state.goldStarNum:', this.state.goldStarNum);
  //     })
  //   });
  // }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Ooops! </strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  // renderStars() {
  //   // const { rating } = this.props.review;
  //   const rating = 0;
  //   const totalStars = 5;
  //   const grayStarsNum = 5 - rating;
  //   // console.log('in SetFinalBookingTermsFrom, renderStars, rating:', rating);
  //   //
  //   // for (let i = 0; i < rating; i++) {
  //   // }
  //   if (!this.state.starClicked) {
  //     return _.times(totalStars, (i) => {
  //       if (i < rating) {
  //         // console.log('in SetFinalBookingTermsFrom, renderStars, in loop, if: ', i);
  //         return <i key={i} value={i} className="fa fa-star gold-star-edit" onClick={this.handleStarClick}></i>;
  //       } else {
  //         // console.log('in SetFinalBookingTermsFrom, renderStars, in loop, else:', i);
  //         return <i key={i} value={i} className="fa fa-star gray-star-edit" onClick={this.handleStarClick}></i>
  //       }
  //     });
  //   } else {
  //     return _.times(totalStars, (i) => {
  //       if (i < this.state.goldStarNum) {
  //         // console.log('in SetFinalBookingTermsFrom, renderStars, in loop, if: ', i);
  //         return <i key={i} value={i} className="fa fa-star gold-star-edit" onClick={this.handleStarClick}></i>;
  //       } else {
  //         // console.log('in SetFinalBookingTermsFrom, renderStars, in loop, else:', i);
  //         return <i key={i} value={i} className="fa fa-star gray-star-edit" onClick={this.handleStarClick}></i>
  //       }
  //     });
  //
  //   }
  // }

  renderSetBookingTermsForm() {
    const { handleSubmit } = this.props;
    let saveButtonActive = false;

    if (this.props.formIsDirty) { saveButtonActive = true; }

    console.log('in SetFinalBookingTermsFrom, renderSetBookingTermsForm saveButtonActive: ', saveButtonActive);

    // <button action="submit" className="btn btn-primary review-create-btn">Update Final Terms</button>
    // <form onSubmit={handleSubmit(this.handleFormSubmit)}>
    return (
        <div>
          <form>
            <fieldset className="form-group">
              <label className="auth-form-label">{AppLanguages.finalRent[this.props.appLanguageCode]}</label>
              <Field name="final_rent" component="input" className="form-control set-booking-terms-input" />
            </fieldset>

            <fieldset className="form-group">
              <label className="auth-form-label">{AppLanguages.finalDeposit[this.props.appLanguageCode]}</label>
              <Field name="final_deposit" component="input" className="form-control set-booking-terms-input" />
            </fieldset>

            <fieldset className="form-group">
              <label className="auth-form-label">{AppLanguages.finalKeyMoney[this.props.appLanguageCode]}</label>
              <Field name="final_key_money" component="input" className="form-control set-booking-terms-input" />
            </fieldset>

            <fieldset className="form-group">
              <label className="auth-form-label">{AppLanguages.parkingIncluded[this.props.appLanguageCode]}</label>
              <Field name="parking_included" component="select" type="boolean" className="form-control set-booking-terms-input">
                <option></option>
                <option value={true}>{AppLanguages.yesTrue[this.props.appLanguageCode]}</option>
                <option value={false}>{AppLanguages.noFalse[this.props.appLanguageCode]}</option>
              </Field>
            </fieldset>

            <div className="review-edit-star-box">
            </div>
              {this.renderAlert()}
              <button
                  value='save'
                  // submit save only if formIsDirty
                  onClick={saveButtonActive ?
                    handleSubmit(data =>
                      this.handleFormSubmit({
                        data,
                        submitAction: 'save'
                      }))
                      :
                      () => {}
                  }
                  className={saveButtonActive ? 'btn btn-primary review-create-btn' : 'btn btn-primary review-create-btn'  }
                  style={saveButtonActive ? { backgroundColor: 'cornflowerblue' } : { backgroundColor: 'white', border: '1px solid lightgray', color: 'lightgray' }}
                >
                {AppLanguages.updateFinalTerms[this.props.appLanguageCode]}
              </button>
          </form>
        </div>
    );
  }


  render() {
    return (
      <div className="set-final-booking-deal-container">
        {this.renderSetBookingTermsForm()}
      </div>
    );
  }
}

SetFinalBookingTermsFrom = reduxForm({
    // (your redux-form config)
    form: 'SetFinalBookingTermsFrom',
    // fields: ['email', 'password']
})(SetFinalBookingTermsFrom);

function mapStateToProps(state) {
  if (state.bookingData.fetchBookingData) {
    console.log('in SetFinalBookingTermsFrom, mapStateToProps, state: ', state);
    const flat = state.bookingData.fetchBookingData.flat;
    console.log('in SetFinalBookingTermsFrom, mapStateToProps, flat: ', flat);
    // Convert values to string to get redux form dirty to work; Only seems to work with string (not integers or floats)
    const finalRentFloat = parseFloat(flat.price_per_month);
    const finalRentStringNoDecimal = finalRentFloat.toFixed(0);
    const initialValues = { final_rent: finalRentStringNoDecimal, parking_included: flat.parking_included.toString(), final_deposit: flat.deposit.toString(), final_key_money: flat.key_money.toString() };
    const formIsDirty = isDirty('SetFinalBookingTermsFrom')(state);

    return {
      errorMessage: state.auth.error,
      authenticated: state.auth.authenticated,
      appLanguageCode: state.languages.appLanguageCode,
      booking: state.bookingData.fetchBookingData,
      initialValues,
      formIsDirty
    };
  } else {
    return {};
  }
}

// function mapStateToProps(state) {
//   console.log('in SetFinalBookingTermsFrom, mapStateToProps, state: ', state);
//   return {
//     bookingData: state.bookingData.fetchBookingData,
//     review: state.reviews.reviewForBookingByUser,
//     // showEditReviewModal: state.modals.showEditReview
//     // flat: state.flat.selectedFlat
//   };
// }

export default connect(mapStateToProps, actions)(SetFinalBookingTermsFrom);
