import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';

import * as actions from '../actions';

import Facility from './constants/facility';

class BookingRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addedFacilityArray: []
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
      // console.log('in booking_request, componentDidMount, in if !bookingRequestEmpty,   bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail: ', bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail);
      this.props.bookingRequestData({ date_start: bookingRequestFrom, date_end: bookingRequestTo, user_email: bookingRequestUserEmail, flat_id: bookingRequestFlatId }, () => {})
      this.props.selectedFlatFromParams(bookingRequestFlatId, () => {});
    } else {
      bookingRequestTo = localStorage.getItem('bookingRequestTo');
      bookingRequestFrom = localStorage.getItem('bookingRequestFrom');
      bookingRequestUserEmail = localStorage.getItem('bookingRequestUserEmail');
      bookingRequestFlatId = localStorage.getItem('bookingRequestFlatId');
      // console.log('in booking_request, componentDidMount, bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail: ', bookingRequestTo, bookingRequestFrom, bookingRequestFlatId, bookingRequestUserEmail);
      this.props.bookingRequestData({ date_start: bookingRequestFrom, date_end: bookingRequestTo, user_email: bookingRequestUserEmail, flat_id: bookingRequestFlatId }, () => {})
      this.props.selectedFlatFromParams(bookingRequestFlatId, () => {});
    }
    this.props.fetchProfileForUser(() => {});
  }

  componentDidUpdate() {
    this.addNonOptionalFacilityToState();
  }

  componentWillUnmount() {
    // console.log('in booking confirmation, componentWillUnmount');
    const bookingRequestTo = localStorage.removeItem('bookingRequestTo');
    const bookingRequestFrom = localStorage.removeItem('bookingRequestFrom');
    const bookingRequestFlatId = localStorage.removeItem('bookingRequestFlatId');
    const bookingRequestUserEmail = localStorage.removeItem('bookingRequestFlatId');
  }

  getFacilityObject(facility) {
    const object = {
      facility_type: facility.facility_type,
      id: facility.id,
      facility_number: facility.facility_number,
      price_per_month: facility.price_per_month
    };
    return object;
  }

  isFacilityInStateObject(facility) {
    let facilityIsInState = false;
    _.each(this.state.addedFacilityArray, eachStateFacility => {
      if (facility.id == eachStateFacility.id) {
        facilityIsInState = true;
        return;
      }
    });

    return facilityIsInState;
  }

  addNonOptionalFacilityToState() {
    if (this.props.flat) {
      _.each(this.props.flat.facilities, eachFacility => {
        const facilityObject = this.getFacilityObject(eachFacility);
        const facilityInState = this.isFacilityInStateObject(eachFacility)
        const facilityChoice = this.getFacilityChoice(eachFacility.facility_type)
        console.log('in booking_request, addNonOptionalFacilityToState, facilityChoice: ', facilityChoice);
        const facilityIncluded = this.props.flat[facilityChoice.facilityObjectMap];
        if ((eachFacility.optional == false || facilityIncluded) && !facilityInState) {
          this.setState({
            addedFacilityArray: [...this.state.addedFacilityArray, facilityObject]
          }, () => {
            console.log('in booking_request, addNonOptionalFacilityToState, this.state.addedFacilityArray: ', this.state.addedFacilityArray);
          });
        }
      });
    }
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
    const elementNameSplit = elementName.split(',')
    const facilityObject = {
      facility_type: elementNameSplit[0],
      facility_number: elementNameSplit[1],
      optional: elementNameSplit[2],
      price_per_month: elementNameSplit[3],
      id: elementNameSplit[4]
    };

    if (elementVal == 'yes') {
      this.setState({
        addedFacilityArray: [...this.state.addedFacilityArray, facilityObject]
      }, () => {
        console.log('in booking_request, handleOptionButtonClick, this.state.addedFacilityArray: ', this.state.addedFacilityArray);
      })
    }
    // if button is to delete or value 'no', copy state array, get index of clicked facility
    // then set state with the new copied array that has one element taken out of index
    if (elementVal == 'no') {
      const array = [...this.state.addedFacilityArray];
      // need to have arrow function to keep context for using state
      const elementIndex = () => {
        let index = 0;
        if (this.state.addedFacilityArray.length > 0) {
          _.each(this.state.addedFacilityArray, (eachStateFacility, i) => {
            if (eachStateFacility.id == facilityObject.id) {
              index = i;
              return
            }
          })
        }
        return index;
      }
      // console.log('in booking_request, handleOptionButtonClick, elementIndex: ', elementIndex());
      // get index by running function elementIndex
      array.splice(elementIndex(), 1)
      this.setState({
        addedFacilityArray: array
      }, () => {
        console.log('in booking_request, handleOptionButtonClick, this.state.addedFacilityArray: ', this.state.addedFacilityArray);
      })
    }
  }

  facilityButtonSwitch(facility, facilityString) {
    let optionButton = '';
    if (this.state.addedFacilityArray.length > 0) {
      _.each(this.state.addedFacilityArray, eachStateFacility => {
        if (facility.id == eachStateFacility.id) {
          optionButton = <div value="no" name={facilityString} className="booking-request-box-option-button" onClick={this.handleOptionButtonClick}>Delete Option</div>
        } else {
          optionButton = <div value="yes" name={facilityString} className="booking-request-box-option-button" onClick={this.handleOptionButtonClick}>Add Option</div>
        }
      });
    } else {
      optionButton = <div value="yes" name={facilityString} className="booking-request-box-option-button" onClick={this.handleOptionButtonClick}>Add Option</div>
    }

    console.log('in booking_request, facilityButtonSwitch, optionButton: ', optionButton);
    return optionButton;
  }

  renderEachFacility() {
    // <div value="no" name={eachFacility.facility_type} className="booking-request-box-option-button" onClick={this.handleOptionButtonClick}>Do not Add</div>
    let facilityString = ''
    if (this.props.flat) {
      // if there is flat in props, iterate through each facility to render each facility
      return _.map(this.props.flat.facilities, (eachFacility, i) => {
        // get the choice corresponding to the facility in constants/Facility.js
        const facilityChoice = this.getFacilityChoice(eachFacility.facility_type);
        // form the string to be sent to handleOptionButtonClick when user clicks to add or delete option
        facilityString =  eachFacility.facility_type.toString() + ',' + eachFacility.facility_number.toString() + ',' + eachFacility.optional.toString() + ',' + eachFacility.price_per_month.toString() + ',' + eachFacility.id.toString()
        console.log('in booking_request, renderEachFacility, facilityString: ', facilityString);
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
                this.facilityButtonSwitch(eachFacility, facilityString)
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
