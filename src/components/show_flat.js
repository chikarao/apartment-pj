import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';

import * as actions from '../actions';
// import Carousel from './carousel/carousel';
import GoogleMap from './maps/google_map';
import Messaging from './messaging/messaging';

import DatePicker from './date_picker/date_picker';
import Lightbox from './modals/lightbox';

import Amenities from './constants/amenities';
import MapInteraction from './maps/map_interaction';


const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

const GOOGLEMAP_API_KEY = process.env.GOOGLEMAP_API_KEY;

// let placesResults = [];
// let resultsReceived = false;
// const resultsArray = []

const AMENTIES = Amenities;
// let RESULTS_ARRAY = []

class ShowFlat extends Component {
 //  constructor(props) {
 //   super(props);
 //   this.state = { placesResults: [], map: {}, autoCompletePlace: {}, clickedPlaceArray: [] };
 // }
  componentDidMount() {
    console.log('in show flat, componentDidMount, params', this.props.match.params);
    // gets flat id from params set in click of main_cards or infowindow detail click
    // this.props.match.params returns like this: { id: '43' })
    this.props.selectedFlatFromParams(this.props.match.params.id);
    // init
    // this.props.setNoConversation();
    //fetchConversationByFlatAndUser is match.params, NOT match.params.id
    if (this.props.auth.authenticated) {
      this.props.getCurrentUser();
      this.props.fetchConversationByFlat({ flat_id: this.props.match.params.id });
    }
    if (this.props.flat) {
      console.log('in show flat, componentDidMount, this.props.flat', this.props.flat);
    }

    this.props.fetchReviewsForFlat(this.props.match.params.id);
    // this.props.fetchPlaces(this.props.match.params.id);
  }

  // componentDidUpdate() {
    // this.scrollLastMessageIntoView();
    // to handle error InvalidValueError: not an instance of HTMLInputElement
    // handleSearchInput was running before HTML was rendered
    //so input ID map-interaction-input was not getting picked up
    // if (this.props.flat) {
    //   this.handleSearchInput();
    // }
  // }

  handleImageClick(event) {
    console.log('in show_flat handleImageClick, event.target: ', event.target);
    //get image index from div
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value')
    console.log('in show_flat handleImageClick, elementVal: ', elementVal);
    // elementval is taken as string so convert to decimal (10) integer
    // call action creator setImageIndex
    //(note: setImageIndex is shared with infowidow carousel in googlemaps)
    this.props.setImageIndex(parseInt(elementVal, 10));
    // swith on showLightbox action creator and boolean in state to show the modal
    //(showLightbox in part of auth state)
    this.props.showLightbox();
  }

  renderImages(images) {
    console.log('in show_flat renderImages, images: ', images);
    const imagesEmpty = _.isEmpty(images);
    if (!imagesEmpty) {
      console.log('in show_flat renderImages, images: ', images[0].publicid);
      return (
        _.map(images, (image, index) => {
          if (image) {
            console.log('in show_flat renderImages, image: ', image.publicid);
            return (
              <div key={index} className="slide-show">
              <img key={index} value={index} src={'http://res.cloudinary.com/chikarao/image/upload/w_300,h_200/' + image.publicid + '.jpg'} alt="" onClick={this.handleImageClick.bind(this)}/>
              </div>
            );
          }
        })
      );
    } else {
      return (
        <div className="no-results-message">Images are not available for this flat</div>
      );
    }
  }

  renderAmenities() {
    if (this.props.flat.amenity) {
      console.log('in show_flat renderAmenities: ', this.props.flat.amenity);
      console.log('in show_flat renderAmenities, AMENTIES: ', AMENTIES);
      const { amenity } = this.props.flat;

      return _.map(Object.keys(amenity), key => {
        if (amenity[key] === true) {
          // console.log('in show_flat renderAmenities: ', this.props.flat.amenity);
          return (
            <div key={key} className="show-flat-amenity-show-each col-xs-11 col-sm-3 col-md-3">
              <div className="amenity-radio-show-page">{AMENTIES[key]}</div>
            </div>
          );
        }
      });
    }
  }

  renderFlat() {
    // console.log('in show flat, flatId: ', flatId);
    // console.log('in show flat, flat: ', this.props.flat);
    // const flat = _.find(this.props.flats, (f) => {
    //   return f.id === flatId;
    // });
    // console.log('in show flat, flat: ', flat.description);
    const flatEmpty = _.isEmpty(this.props.flat);
    // console.log('in show_flat renderFlat, flat empty: ', flatEmpty);
      if (!flatEmpty) {
        const { description, area, beds, sales_point, price_per_month, images, king_or_queen_bed, intro } = this.props.flat;
        console.log('in show_flat renderFlat, renderImages: ', this.renderImages(images));
        return (
          <div>
            <div key={1234} className="show-flat-image-box">
              <div key={12345} id="carousel-show">
                {this.renderImages(images)}
              </div>
            </div>
            <div className="show-flat-container">
              <div key={description} className="show-flat-desription">
                { description }
              </div>

              <div key={area} className="show-flat-area">
                { area }
              </div>

              <div key={beds} className="show-flat-beds">
                Beds: { beds } <small>{(beds >= 1 && king_or_queen_bed > 0) ? `(${king_or_queen_bed} king or queen sized)` : ''}</small>
              </div>

              <div key={sales_point} className="show-flat-sales_point">
                { sales_point }
              </div>

              <div key={price_per_month} className="show-flat-price">
                ${ parseFloat(price_per_month).toFixed(0) } per month
              </div>
              <div key={this.props.match.params.id} className="show-flat-id">
              <small>flat id: {this.props.match.params.id}</small>
              </div>
              <div key={intro} className="show-flat-intro">
                { intro }
              </div>
            </div>
            <h4>Available Amenities</h4>
            <div className="container amenity-input-box">
              <div className="amenity-row row">
                {this.renderAmenities()}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <div className="spinner">Loading flat...</div>
          </div>
        );
      }
    }

  handleBookingClick() {
    console.log('in show_flat handleBookingClick, this.props.selectedBookingDates: ', this.props.selectedBookingDates);
    if (this.props.selectedBookingDates) {
      console.log('in show_flat handleBookingClick, this.props.selectedBookingDates: ', this.props.selectedBookingDates);
      console.log('in show_flat handleBookingClick, this.props.flat: ', this.props.flat);

      const bookingRequest = { flat_id: this.props.flat.id, user_email: this.props.auth.email, date_start: this.props.selectedBookingDates.from, date_end: this.props.selectedBookingDates.to }
      console.log('in show_flat handleBookingClick, bookingRequest: ', bookingRequest);

      // calls action craetor and sends callback to action to go to the booking confiramtion page
      // this.props.requestBooking(bookingRequest, () => this.props.history.push('/bookingconfirmation'));
      this.props.requestBooking(bookingRequest, (id) => this.bookingRequestCallback(id));
    } else {
      console.log('in show_flat handleBookingClick, NO DATES SELECTED: ');
    }
  }

  disabledDays(bookings) {
    // Note that new disabledDays does not include the after and before daysr!!!!!!!!!!!!!!!!!!!!!!!
    // So need to adjust dates with setDate and getDate
    const bookingsEmpty = _.isEmpty(this.props.flat.bookings);
    const daysList = [];

    if (!bookingsEmpty) {
      console.log('in show_flat, disabledDays, days from ', this.props.flat.bookings[0].date_start);
      console.log('in show_flat, disabledDays, days from ', this.props.flat.bookings[0].date_end);

      _.each(bookings, (booking) => {
        // console.log('in show_flat, disabledDays, in _.each, booking: ', booking);
        // console.log('in show_flat, disabledDays, in _.each, booking.date_start: ', booking.date_start);
        const reformatStart = booking.date_start.split('-').join(', ');
        const reformatEnd = booking.date_end.split('-').join(', ');
        // console.log('in show_flat, disabledDays, in _.each, reformatStart: ', reformatStart);
        // console.log('in show_flat, disabledDays, in _.each, reformatEnd: ', reformatEnd);

        const adjustedAfterDate = new Date(reformatStart);
        const adjustedBeforeDate = new Date(reformatEnd);

        // const adjustedAfterDateForBooking = adjustedAfterDate;
        // console.log('in show_flat, disabledDays, in _.each, afterDate before setDate: ', adjustedAfterDateForBooking);
        // console.log('in show_flat, disabledDays, in _.each, before Date before setDate: ', adjustedBeforeDate);

        adjustedAfterDate.setDate(adjustedAfterDate.getDate() - 1);
        console.log('in show_flat, disabledDays, in _.each, afterDate after setDate: ', adjustedAfterDate);
        // adjustedBeforeDate.setDate(adjustedBeforeDate.getDate() + 1);
        // no need to adjust if check in on check out day

        // console.log('in show_flat, disabledDays, in _.each, afterDate after setDate: ', adjustedAfterDate);
        // console.log('in show_flat, disabledDays, in _.each, before Date after setDate: ', adjustedBeforeDate);
        const bookingRange = { after: adjustedAfterDate, before: adjustedBeforeDate };
        // // const bookingRange = { after: new Date(2018, 4, 10), before: new Date(2018, 4, 18) };


        daysList.push(bookingRange);
      });

      // first of month to today https://stackoverflow.com/questions/13571700/get-first-and-last-date-of-current-month-with-javascript-or-jquery
    }
    const today = new Date();
    // just gate date so that first of month and today can be compared;
    // otherwise there will be time involved
    const todayJustDate = today.toDateString();
    // const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDay() - 2);
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstOfMonthJustDate = firstOfMonth.toDateString();
    console.log('in show_flat, disabledDays, outside _.each, firstOfMonth, today just dates: ', firstOfMonthJustDate, todayJustDate);
    if (todayJustDate !== firstOfMonthJustDate) {
      console.log('in show_flat, disabledDays, outside _.each, firstOfMonth, today: ', new Date(firstOfMonth - 1), today);
      const firstOfMonthRange = { after: new Date(firstOfMonth - 1), before: today }
      daysList.push(firstOfMonthRange);
      console.log('in show_flat, disabledDays, outside _.each, firstOfMonthRange: ', firstOfMonthRange);
    }
    // const firstofMonth = new Date.now()

    console.log('in show_flat, disabledDays, after _.each, daysList ', daysList);
    return daysList;
  }

  renderDatePicker() {
    console.log('in show_flat, renderDatePicker, before if, this.props.flat: ', this.props.flat);
    // const bookingsEmpty = _.isEmpty(this.props.flat.bookings);
    if (this.props.flat) {
      console.log('in show_flat, renderDatePicker, got past if, this.props.flat: ', this.props.flat);
      return (
        <div className="date-picker-container">
        <h4>Select a range of dates you want:</h4>
        <DatePicker
          // initialMonth={new Date(2017, 4)}
          daysToDisable={this.disabledDays(this.props.flat.bookings)}
          // disabledDays={this.disabledDays(this.props.flat.bookings)}
          // daysToDisable={[{ after: new Date(2018, 4, 18), before: new Date(2018, 5, 25), }]}
        />
        </div>
      );
    }
  }

  renderMap() {
    if (this.props.flat) {
      //instantiates autocomplete as soon as flat is loaded in state then mapcenter can be set
      // this.handleSearchInput();
      //calling this here gives error InvalidValueError: not an instance of HTMLInputElement
      // so call in componentDidUpdate

      console.log('in show_flat, renderMap, this.props.flat: ', this.props.flat);
      const initialPosition = { lat: this.props.flat.lat, lng: this.props.flat.lng };
      const flatsEmpty = false;
      const flatArray = [this.props.flat];
      const flatArrayMapped = _.mapKeys(flatArray, 'id');

      console.log('in show_flat, renderMap, flatArray: ', flatArray);
      console.log('in show_flat, renderMap, flatArrayMapped: ', flatArrayMapped);

      return (
        <div>
          <GoogleMap
            showFlat
            flatsEmpty={flatsEmpty}
            flats={flatArrayMapped}
            initialPosition={initialPosition}
          />
        </div>
      );
    }
  }

  bookingRequestCallback(flatId) {
    console.log('in show_flat bookingRequestCallback, passed from callback: ', flatId);
    this.props.history.push(`/bookingconfirmation/${flatId}`);
  }

  currentUserIsOwner() {
    if (this.props.auth && this.props.flat) {
      console.log('in show_flat, currentUserIsOwner, this.props.auth.id: ', this.props.auth.id);
      console.log('in show_flat, currentUserIsOwner, this.props.flat: ', this.props.flat.user_id);
      console.log('in show_flat, currentUserIsOwner,this.props.auth.id == this.props.flat.user_id: ', (this.props.auth.id == this.props.flat.user_id));
      return (this.props.auth.id == this.props.flat.user_id);
      // return true;
      // return false;
    }
  }

  handleDateBlockClick() {
    console.log('in show_flat, handleDateBlockClick: ');
  }

  handleEditFlatClick() {
    console.log('in show_flat, handleEditFlatClick, this.props.flat.id: ', this.props.flat.id);
    this.props.history.push(`/editflat/${this.props.flat.id}`);
  }

  handleDeleteFlatClick() {
    console.log('in show_flat, handleDeleteFlatClick: ');
    if (window.confirm('Are you sure you want to delete this listing?')) {
      this.props.showLoading();
      console.log('in show_flat, handleDeleteFlatClick, window.confirm, YES, this.props.flat.id: ', this.props.flat.id);
      // call deleteFlat action creator
      this.props.deleteFlat(this.props.flat.id, () => this.deleteFlatClickCallBack());
    } else {
      console.log('in show_flat, handleDeleteFlatClick, window.confirm, NO: ');
    }
  }

  deleteFlatClickCallBack() {
    this.props.history.push('/mypage');
    this.props.showLoading();
  }

    renderMessaging() {
    if (!this.currentUserIsOwner() && this.props.conversation) {
      console.log('in show_flat, renderMessaging: ', this.currentUserIsOwner());
      return (
        <div className="message-box-container">
          <div className="message-box">
          <h3>Messages</h3>
            <Messaging
              currentUserIsOwner={this.currentUserIsOwner()}
              conversation={this.props.conversation}
              noConversationForFlat={this.props.noConversationForFlat}
              // noConversation={this.props.noConversation}
              fromShowPage
            />
          </div>
        </div>
      );
    }
  }
  // header has a check on showAuthModal to show modal or not; default show sign UP modal
  handleSignInClick() {
    // calls showAuthModal action to toggle boolean;
    this.props.showAuthModal();
  }
// get boolean returned from currentUserIsOwner and render or do not render an appropriate buttton
// current user that is owner of flat should be able to block out days on calendar without charge
// also need an edit button if current user is owner
  renderButtons() {
    console.log('in show_flat, currentUserIsOwner: ', this.currentUserIsOwner());
    console.log('in show_flat, renderButton, this.props.auth.authenticated: ', this.props.auth.authenticated);
      if (this.props.auth.authenticated) {
        if (!this.currentUserIsOwner()) {
          console.log('in show_flat, renderButton, if, not current user; I am not the currentUserIsOwner: ', this.currentUserIsOwner());
          return (
            <div className="show-flat-button-box">
              <button onClick={this.handleBookingClick.bind(this)} className="btn btn-primary btn-lg btn-book-submit">Book Reservation</button>
            </div>
          );
        } else {
          console.log('in show_flat, renderButton, if, am current user; I am the currentUser: ', this.currentUserIsOwner());
          return (
            <div className="show-flat-current-user-button-box">
              <div className="show-flat-button-box">
                <button onClick={this.handleEditFlatClick.bind(this)} className="btn btn-warning btn-lg">Edit</button>
              </div>
              <div className="show-flat-button-box">
                <button onClick={this.handleDeleteFlatClick.bind(this)} className="btn btn-danger btn-lg">Delete</button>
              </div>
              <div className="show-flat-button-box">
              <button onClick={this.handleDateBlockClick.bind(this)} className="btn btn-primary btn-lg btn-book-submit">Block Dates</button>
              </div>
            </div>
          );
        }
      } else {
        return (
          <div>
          <div className="send-owner-a-message-div" onClick={this.handleSignInClick.bind(this)}>
            <h4><i className="fa fa-book"></i>   Sign in to Book!</h4>
          </div>
          </div>
        );
      }
  }

  sendOwnerAMessage() {
    if (!this.props.auth.authenticated) {
      return (
        <div className="send-owner-a-message-div" onClick={this.handleSignInClick.bind(this)}>
        <h4><i className="fa fa-envelope"></i>   Sign in to Send the Owner a Message</h4>
        </div>
      );
    } else {
      <div className="send-owner-a-message-div-no-link">
      <h4>Send the Owner a Message</h4>
      </div>
    }
  }

  renderLightboxScreen() {
    if (this.props.flat) {
      // console.log('in show_flat, renderLightboxScreen, ');
      return (
        <div>
          <Lightbox
            // this is where to tell if to show loading or not
            // show={true}
            show={this.props.auth.showLightbox}
            images={this.props.flat.images}
            // imageIndex is handled in app state using setImageIndex
            // and increment decrement indexEmpty
          />
        </div>
      );
    }
  }

  renderEachReview() {
    const { reviews } = this.props;
    // all review classnames and styles are shared with booking confirmation reviewsEmpty
    // unless they start with "show-flat"
    return _.map(reviews, review => {
      return (
        <div key={review.id} className="show-flat-review-details col-xs-12 col-md-6">
        <div className="review-top-box">

        <div className="review-user-box">
        <div className="review-avatar">
        <img src={'http://res.cloudinary.com/chikarao/image/upload/w_50,h_50/' + review.user.profile.image + '.jpg'} alt="" />
        </div>
        <div className="review-username">
          {review.user.profile.username}
        </div>
        </div>
        <div className="show-flat-review-title">
          {review.title}
        </div>
        </div>

        <div className="review-comment-box">
        <p className="review-comment-text">
          {review.comment}
        </p>
        </div>
        </div>
      );
    })
  }

  renderReviews() {
    const reviewsEmpty = _.isEmpty(this.props.reviews)
    if (!reviewsEmpty) {
      console.log('in show_flat, renderReviews, : ', this.props.reviews);
      return (
        <div className="container show-flat-review-container">
        <h3 className="review-section-heading">Reviews</h3>
          <div className="row show-flat-review-row">
           {this.renderEachReview()}
          </div>
        </div>
      );
    }
  }

  render() {
  // !!!!!map needs to be id=map for the interaction to work
    return (
      <div className="show-flat-body">
          {this.renderLightboxScreen()}
        <div>
          {this.renderFlat(this.props.match.params.id)}
        </div>
        <div>
          {this.renderDatePicker()}
        </div>
        <div className="container">
          <div className="row">
            <div className="map-container col-xs-12 col-sm-12 col-md-8" id="map">
              {this.renderMap()}
            </div>
            <div className="col-xs-12 col-sm-12 col-md-4">
              <MapInteraction
                // check if props updated
                flat={this.props.flat ? this.props.flat : {}}
                places={this.props.flat ? this.props.flat.places : {}}
                showFlat
                // check if currentUserIsOwner to display right messages
                currentUserIsOwner={this.currentUserIsOwner()}
              />
            </div>
          </div>
        </div>

          {this.currentUserIsOwner() ? <h4>This is your flat! <br/>Block out dates, edit or delete listing.</h4> : this.sendOwnerAMessage()}

            {this.renderMessaging()}

          {this.renderReviews()}
        <div className="clear-div" style={{ height: '70px' }}></div>
        <footer className="show-flat-footer">
          {this.renderButtons()}
        </footer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in show_flat, mapStateToProps, state: ', state);
  return {
    flat: state.flat.selectedFlatFromParams,
    selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    auth: state.auth,
    conversation: state.conversation.conversationByFlat,
    noConversation: state.conversation.noConversation,
    noConversationForFlat: state.conversation.noConversationForFlat,
    reviews: state.reviews,
    // places uses flat.selectedFlatFromParams.places
    // places: state.places.places,
    // places: state.flat.selectedFlatFromParams.places,
    language: state.places.placeSearchLanguage
    // conversation: state.conversation.createMessage
  };
}

export default connect(mapStateToProps, actions)(ShowFlat);
