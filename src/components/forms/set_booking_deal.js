import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';
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
    console.log('in ReviewEditModal, handleFormSubmit, bookingAttributes: ', bookingAttributes);
    console.log('in ReviewEditModal, handleFormSubmit, data: ', data);
    console.log('in ReviewEditModal, handleFormSubmit, booking: ', this.props.booking);
    this.props.editBooking(bookingAttributes, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in ReviewEditModal, handleFormSubmitCallback: ', this.props);
    // showHideClassName = 'modal display-none';
    // this.setState({ editReviewCompleted: true });
    // this.props.history.push(`/bookingconfirmation/${this.props.booking.id}`);
  }

  // handleStarClick(event) {
  //   const clickedElement = event.target;
  //   const elementVal = clickedElement.getAttribute('value');
  //   // console.log('in ReviewEditModal, handleStarClick, elementVal:', elementVal);
  //   const elementValNum = parseInt(elementVal, 10);
  //   this.setState({ clickedStar: elementValNum, starClicked: true }, () => {
  //     // console.log('in ReviewEditModal, handleStarClick, this.state.clickedStar:', this.state.clickedStar);
  //     this.setState({ goldStarNum: this.state.clickedStar + 1 }, () => {
  //       // console.log('in ReviewEditModal, handleStarClick, this.state.goldStarNum:', this.state.goldStarNum);
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
  //   // console.log('in ReviewEditModal, renderStars, rating:', rating);
  //   //
  //   // for (let i = 0; i < rating; i++) {
  //   // }
  //   if (!this.state.starClicked) {
  //     return _.times(totalStars, (i) => {
  //       if (i < rating) {
  //         // console.log('in ReviewEditModal, renderStars, in loop, if: ', i);
  //         return <i key={i} value={i} className="fa fa-star gold-star-edit" onClick={this.handleStarClick}></i>;
  //       } else {
  //         // console.log('in ReviewEditModal, renderStars, in loop, else:', i);
  //         return <i key={i} value={i} className="fa fa-star gray-star-edit" onClick={this.handleStarClick}></i>
  //       }
  //     });
  //   } else {
  //     return _.times(totalStars, (i) => {
  //       if (i < this.state.goldStarNum) {
  //         // console.log('in ReviewEditModal, renderStars, in loop, if: ', i);
  //         return <i key={i} value={i} className="fa fa-star gold-star-edit" onClick={this.handleStarClick}></i>;
  //       } else {
  //         // console.log('in ReviewEditModal, renderStars, in loop, else:', i);
  //         return <i key={i} value={i} className="fa fa-star gray-star-edit" onClick={this.handleStarClick}></i>
  //       }
  //     });
  //
  //   }
  // }

  renderSetBookingTermsForm() {
    const { handleSubmit } = this.props;
    return (
        <div>
          <form onSubmit={handleSubmit(this.handleFormSubmit)}>
            <fieldset className="form-group">
              <label className="auth-form-label">Final Rent</label>
              <Field name="final_rent" component="input" type="string" className="form-control set-booking-terms-input" />
            </fieldset>

            <fieldset className="form-group">
              <label className="auth-form-label">Final Deposit xMonths</label>
              <Field name="final_deposit" component="input" type="string" className="form-control set-booking-terms-input" />
            </fieldset>

            <fieldset className="form-group">
              <label className="auth-form-label">Final Key Money xMonths</label>
              <Field name="final_key_money" component="input" type="string" className="form-control set-booking-terms-input" />
            </fieldset>

            <fieldset className="form-group">
              <label className="auth-form-label">{AppLanguages.parkingIncluded[this.props.appLanguageCode]}</label>
              <Field name="parking_included" component="select" type="boolean" className="form-control set-booking-terms-input">
                <option></option>
                <option value={true}>{AppLanguages.yes[this.props.appLanguageCode]}</option>
                <option value={false}>{AppLanguages.no[this.props.appLanguageCode]}</option>
              </Field>
            </fieldset>

            <div className="review-edit-star-box">
            </div>
              {this.renderAlert()}
            <button action="submit" className="btn btn-primary review-create-btn">Update Final Terms</button>
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
    const initialValues = { final_rent: flat.price_per_month, parking_included: flat.parking_included, final_deposit: flat.deposit, final_key_money: flat.key_money };
    return {
      errorMessage: state.auth.error,
      authenticated: state.auth.authenticated,
      appLanguageCode: state.languages.appLanguageCode,
      initialValues
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
