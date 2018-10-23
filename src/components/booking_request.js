import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';

import * as actions from '../actions';

import Facility from './constants/facility'

class BookingRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // showReviewEditModal: false
    };
    this.handleOptionButtonClick = this.handleOptionButtonClick.bind(this);
  }
  componentDidMount() {
    // gets flat id from params set in click of main_cards or infowindow detail click
    // const bookingId = parseInt(this.props.match.params.id, 10);
    // this.props.fetchBooking(bookingId);
    // this.props.fetchReviewForBookingByUser(bookingId);
    let bookingRequestUserEmail = '';
    let bookingRequestFlatId = '';
    let bookingRequestTo = '';
    let bookingRequestFrom = '';

    const bookingRequestEmpty = _.isEmpty(this.props.bookingRequest);

    if (!bookingRequestEmpty) {
      localStorage.setItem('bookingRequestTo', this.props.bookingRequest.date_end);
      localStorage.setItem('bookingRequestFrom', this.props.bookingRequest.date_start);
      localStorage.setItem('bookingRequestFlatId', this.props.bookingRequest.flat_id);
      localStorage.setItem('bookingRequestUserEmail', this.props.bookingRequest.user_email);
      bookingRequestTo = localStorage.getItem('bookingRequestTo');
      bookingRequestFrom = localStorage.getItem('bookingRequestFrom');
      bookingRequestUserEmail = localStorage.getItem('bookingRequestUserEmail');
      bookingRequestFlatId = localStorage.getItem('bookingRequestFlatId');
      console.log('in booking_request, componentDidMount, in if !bookingRequestEmpty,   bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail: ', bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail);
      this.props.bookingRequestData({ date_start: bookingRequestFrom, date_end: bookingRequestTo, user_email: bookingRequestUserEmail, flat_id: bookingRequestFlatId }, () => {})
      this.props.selectedFlatFromParams(bookingRequestFlatId, () => {});
    } else {
      bookingRequestTo = localStorage.getItem('bookingRequestTo');
      bookingRequestFrom = localStorage.getItem('bookingRequestFrom');
      bookingRequestUserEmail = localStorage.getItem('bookingRequestUserEmail');
      bookingRequestFlatId = localStorage.getItem('bookingRequestFlatId');
      console.log('in booking_request, componentDidMount, bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail: ', bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail);
      this.props.bookingRequestData({ date_start: bookingRequestFrom, date_end: bookingRequestTo, user_email: bookingRequestUserEmail, flat_id: bookingRequestFlatId }, () => {})
      this.props.selectedFlatFromParams(bookingRequestFlatId, () => {});
    }
      this.props.fetchProfileForUser(() => {});
  }

    componentWillUnmount() {
      console.log('in booking confirmation, componentWillUnmount');
      const bookingRequestTo = localStorage.removeItem('bookingRequestTo');
      const bookingRequestFrom = localStorage.removeItem('bookingRequestFrom');
      const bookingRequestFlatId = localStorage.removeItem('bookingRequestFlatId');
      const bookingRequestUserEmail = localStorage.removeItem('bookingRequestFlatId');
    }


  formatDate(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes}  ${ampm}`;
    return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear()
  }

  renderEachDateLine() {
    const array = [
      { title: 'Booking from:', data: this.formatDate(new Date(this.props.bookingRequest.date_start)) },
      { title: 'Booking to:', data: this.formatDate(new Date(this.props.bookingRequest.date_end)) },
    ];

    return _.map(array, (eachLine, i) => {
      return (
        <div key={i} className="booking-request-box-each-line">
          <div className="booking-request-box-each-line-title">
            {eachLine.title}
          </div>
          <div className="booking-request-box-each-line-data">
            {eachLine.data}
          </div>
        </div>
      );
    });
  }

  renderBookingInfo() {
    if (this.props.bookingRequest && this.props.flat) {
      return (
        <div>
          <div className="booking-request-box-title">Booking Info</div>
          <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + this.props.flat.images[0].publicid + '.jpg'} alt="" />
          <div>{this.props.flat.area}</div>
          <div>{this.props.flat.description.toUpperCase()}</div>
          <div>{this.props.flat.city}</div>
          <div>{this.props.flat.state}</div>
          {this.renderEachDateLine()}
        </div>
      );
    }
  }

  getFacilityChoice(facilityType) {
    let facilityChoice = {};
    _.each(Facility.facility_type.choices, eachChoice => {
      if (eachChoice.value == facilityType) {
        facilityChoice = eachChoice;
        return;
      }
    });
    return facilityChoice;
  }

  handleOptionButtonClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');
    console.log('in booking_request, handleOptionButtonClick, elementVal, elementName: ', elementVal, elementName);

  }

  renderEachFacility() {
    // <div value="no" name={eachFacility.facility_type} className="booking-request-box-option-button" onClick={this.handleOptionButtonClick}>Do not Add</div>
    if (this.props.flat) {
      return _.map(this.props.flat.facilities, (eachFacility, i) => {
        const facilityChoice = this.getFacilityChoice(eachFacility.facility_type);
        return (
          <div key={i} >
            <div className="booking-request-box-each-line">
              <div className="booking-request-box-each-line-title">
                {facilityChoice[this.props.appLanguageCode]}
              </div>
              <div>{this.props.flat[facilityChoice.facilityObjectMap] ? 'Price Included' : `Price per month: ${eachFacility.price_per_month}`}</div>
              <div className="booking-request-box-each-line-data">
              </div>
            </div>
            <div className="booking-request-box-option-button-box">
              {this.props.flat[facilityChoice.facilityObjectMap] || !eachFacility.optional ? '' :
              <div value="yes" name={eachFacility.facility_type} className="booking-request-box-option-button" onClick={this.handleOptionButtonClick}>Add</div>
              }
            </div>
          </div>
        );
      });
    }
  }

  renderFacilities() {
    return (
      <div>
        <div className="booking-request-box-title">Facilities</div>
        {this.renderEachFacility()}
      </div>
    );
  }

  renderUserInfo() {
    return (
      <div>
        <div className="booking-request-box-title">User Information</div>
      </div>
    );
  }

  renderBookingRequest() {
    return (
      <div className="container booking-request-container">
        <div className="row booking-request-row">
          <div className="booking-request-each-box">{this.renderBookingInfo()}</div>
          <div className="booking-request-each-box">{this.renderFacilities()}</div>
          <div className="booking-request-each-box">{this.renderUserInfo()}</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderBookingRequest()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in booking request, mapStateToProps, state: ', state);
  return {
    bookingData: state.bookingData.fetchBookingData,
    bookingRequest: state.bookingData.bookingRequestData,
    flat: state.selectedFlatFromParams.selectedFlatFromParams,
    userProfile: state.auth.userProfile,
    appLanguageCode: state.languages.appLanguageCode
    // review: state.reviews.reviewForBookingByUser,
    // showEditReviewModal: state.modals.showEditReview
    // flat: state.flat.selectedFlat
  };
}

export default connect(mapStateToProps, actions)(BookingRequest);
