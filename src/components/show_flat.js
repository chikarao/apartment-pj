import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
// import { each, map, isEmpty, mapKeys, round } from 'lodash';

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

import AppLanguages from './constants/app_languages'
import GmStyle from './maps/gm-style';
import MessagingModal from './modals/messaging_modal'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

const GOOGLEMAP_API_KEY = process.env.GOOGLEMAP_API_KEY;

// let placesResults = [];
// let resultsReceived = false;
// const resultsArray = []

const AMENTIES = Amenities;
// let RESULTS_ARRAY = []

class ShowFlat extends Component {
  constructor(props) {
   super(props);
   this.state = {
    messagingOpen: false,
   };

  this.handleImageClick = this.handleImageClick.bind(this);
  this.handleBookingClick = this.handleBookingClick.bind(this);
  this.handleEditFlatClick = this.handleEditFlatClick.bind(this);
  this.handleDeleteFlatClick = this.handleDeleteFlatClick.bind(this);
  this.handleBookingClick = this.handleBookingClick.bind(this);
  this.handleDateBlockSyncClick = this.handleDateBlockSyncClick.bind(this);
  this.handleSignInClick = this.handleSignInClick.bind(this);
  this.handleMessagingOpenClick = this.handleMessagingOpenClick.bind(this);
 }
  componentDidMount() {
    // gets flat id from params set in click of main_cards or infowindow detail click
    // this.props.match.params returns like this: { id: '43' })
    this.props.selectedFlatFromParams(this.props.match.params.id, () => {
      if (this.props.auth.authenticated) {
        this.props.getCurrentUser();
        // fetchConversationByFlat get conversation between currentUser and flat; Not all converations for the flat
        this.props.fetchConversationByFlat({ flat_id: this.props.match.params.id });
        console.log('in show flat, componentDidMount, this.props.auth.id, this.props.flat', this.props.auth.id, this.props.flat);
        this.props.getGoogleMapBoundsKeys();
      }

      this.props.fetchReviewsForFlat(this.props.match.params.id);
      // this.props.fetchPlaces(this.props.match.params.id);
    });
    // init
    // this.props.setNoConversation();
    //fetchConversationByFlatAndUser is match.params, NOT match.params.id
  }

  // componentDidUpdate() {
  //   if (this.props.flat) {
      // console.log('in show flat, componentDidMount, this.props.flat', this.props.flat);
      // !!!!!!! THIS is where iCal is fetched
      // this.props.fetchIcal(this.p  rops.flat.ical_import_url);
    // }
    // this.scrollLastMessageIntoView();
    // to handle error InvalidValueError: not an instance of HTMLInputElement
    // handleSearchInput was running before HTML was rendered
    // so input ID map-interaction-input was not getting picked up
    // if (this.props.flat) {
    //   this.handleSearchInput();
    // }
  // }

  handleImageClick(event) {
    // console.log('in show_flat handleImageClick, event.target: ', event.target);
    //get image index from div
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value')
    // console.log('in show_flat handleImageClick, elementVal: ', elementVal);
    // elementval is taken as string so convert to decimal (10) integer
    // call action creator setImageIndex
    //(note: setImageIndex is shared with infowidow carousel in googlemaps)
    this.props.setImageIndex(parseInt(elementVal, 10));
    // swith on showLightbox action creator and boolean in state to show the modal
    //(showLightbox in part of auth state)
    this.props.showLightbox();
  }

  renderImages(images) {
    // console.log('in show_flat renderImages, images: ', images);
    const imagesEmpty = _.isEmpty(images);
    if (!imagesEmpty) {
      // console.log('in show_flat renderImages, images: ', images[0].publicid);
      return (
        _.map(images, (image, index) => {
          if (image) {
            // console.log('in show_flat renderImages, image: ', image.publicid);
            return (
              <div key={image.id} className="slide-show">
                <img key={index} value={index} src={'http://res.cloudinary.com/chikarao/image/upload/w_300,h_200/' + image.publicid + '.jpg'} alt="" onClick={this.handleImageClick}/>
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
      // console.log('in show_flat renderAmenities: ', this.props.flat.amenity);
      // console.log('in show_flat renderAmenities, AMENTIES: ', AMENTIES);
      const { amenity } = this.props.flat;

      return _.map(Object.keys(amenity), (key, i) => {
        // console.log('in show_flat renderAmenities, key: ', key);
        if (amenity[key] === true) {
          // console.log('in show_flat renderAmenities: ', this.props.flat.amenity);
          return (
            <div key={i} className="show-flat-amenity-show-each col-xs-11 col-sm-3 col-md-3">
              <div className="amenity-radio-show-page">{AMENTIES[key][this.props.appLanguageCode]}</div>
            </div>
          );
        }
      });
    }
  }

  getFlatLanguage(flat, appLanguageCode) {
    // console.log('in main cards, getFlatLanguage, flat, appLanguageCode: ', flat, appLanguageCode);
    const array = [];
    _.each(flat.flat_languages, language => {
      if (language.code == appLanguageCode) {
        array.push(language);
      }
    })
    if (flat.language_code == appLanguageCode) {
      array.push(flat);
    }
    return array[0] ? array[0] : null
  }

  getFlatStationPlaces(flat) {
    const array = [];
    if (flat.places) {
      _.each(flat.places, eachPlace => {
        if ((eachPlace.category == 'subway_station') || (eachPlace.category == 'train_station') || (eachPlace.category =='transit_station') || (eachPlace.category == 'bus_station')) {
          array.push(eachPlace);
        }
      })
    }
    return array;
  }

  renderStations(flatStationsArray) {
    return _.map(flatStationsArray, (eachStation, i) => {
      if (this.props.appLanguageCode == eachStation.language) {
        const duration = parseInt(eachStation.duration / 60, 10);
        const distance = eachStation.distance > 1000 ? _.round((eachStation.distance / 1000), 1).toFixed(1) +  'km' : _.round(eachStation.distance, -1) + 'm';
        const stationString = duration + AppLanguages.minutes[this.props.appLanguageCode]　+ ' ' + distance;
        return (
          <div key={i}>
            {eachStation.place_name}
            &nbsp;
            <i style={{ color: 'gray' }} className="fas fa-walking"></i>
            &nbsp;
            {stationString}
          </div>);
      }
    });
  }

  renderFlat() {
    // Multi languge: if flatLanaguge not null (user has created the appLangage), uses that language
    // if flatLanguage is null, uses base language
    const flatEmpty = _.isEmpty(this.props.flat);
    // console.log('in show_flat renderFlat, this.props: ', this.props);
      if (!flatEmpty) {
        const { description, area, beds, sales_point, price_per_month, images, king_or_queen_bed, intro } = this.props.flat;
        // const { flatLanguage } = this.props;
        // get language selected from this.props.flat sent from show flat
        const flatLanguage = this.getFlatLanguage(this.props.flat, this.props.appLanguageCode);
        const flatStationsArray = this.getFlatStationPlaces(this.props.flat);
        console.log('in show_flat renderFlat, flatStationsArray: ', flatStationsArray);
        return (
          <div>
            <div key={97} className="show-flat-image-box">
              <div id="carousel-show">
                {this.renderImages(images)}
              </div>
            </div>
            <div className="show-flat-container">
              <div key={98} className="show-flat-description">
                { flatLanguage ? flatLanguage.description : description }
              </div>

              <div key={99} className="show-flat-area">
                { flatLanguage ? flatLanguage.area.toUpperCase() : area.toUpperCase() }
              </div>

              <div key={100} className="show-flat-beds">
                Beds: { beds } <small>{(beds >= 1 && king_or_queen_bed > 0) ? `(${king_or_queen_bed} king or queen sized)` : ''}</small>
              </div>

              <div key={101} className="show-flat-sales_point">
                { flatLanguage ? flatLanguage.sales_point : sales_point }
              </div>
              <div key={102} className="show-flat-price">
                ${ parseFloat(price_per_month).toFixed(0) } per month
              </div>
              <div key={this.props.match.params.id} className="show-flat-id">
                <small>flat id: {this.props.match.params.id}</small>
              </div>
                <div key={104} className="show-flat-stations">
                {flatStationsArray.length > 0 ? this.renderStations(flatStationsArray) : ''}
                </div>
              <div key={105} className="show-flat-intro">
                { flatLanguage ? flatLanguage.intro : intro }
              </div>
            </div>
            <h4>{AppLanguages.availableAmenities[this.props.appLanguageCode]}</h4>
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
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw loading-spinner-show-flat"></i>
            <div className="spinner">Loading flat...</div>
          </div>
        );
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
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
  }

  handleBookingClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // console.log('in show_flat handleBookingClick, this.props.selectedBookingDates: ', this.props.selectedBookingDates);
    if (this.props.selectedBookingDates.to && this.props.selectedBookingDates.from) {
      // console.log('in show_flat handleBookingClick, this.props.selectedBookingDates: ', this.props.selectedBookingDates);
      // console.log('in show_flat handleBookingClick, this.props.flat: ', this.props.flat);
      if (elementVal == 'userBooking') {
        // const bookingConfirm = window.confirm(`Book reservation from ${this.formatDate(this.props.selectedBookingDates.from)} to ${this.formatDate(this.props.selectedBookingDates.to)}?`)
        // if (bookingConfirm) {
          const bookingRequest = { flat_id: this.props.flat.id, user_email: this.props.auth.email, date_start: this.props.selectedBookingDates.from, date_end: this.props.selectedBookingDates.to }
          console.log('in show_flat handleBookingClick, bookingRequest: ', bookingRequest);
          this.props.bookingRequestData(bookingRequest, () => this.props.history.push('/bookingrequest'))
          // calls action craetor and sends callback to action to go to the booking confiramtion page
          // this.props.requestBooking(bookingRequest, () => this.props.history.push('/bookingconfirmation'));
          // this.props.requestBooking(bookingRequest, (id) => this.bookingRequestCallback(id));
        // }
      } // end of if elementVal userBooking

      if (elementVal == 'ownerBooking') {
        const bookingRequest = { flat_id: this.props.flat.id, user_email: this.props.auth.email, date_start: this.props.selectedBookingDates.from, date_end: this.props.selectedBookingDates.to, booking_by_owner: true, facilities: [], tenants: [], profile: { user_id: this.props.auth.id } }
        this.props.requestBooking(bookingRequest, () => this.bookingRequestCallbackOwner());
      }
    } else {
      // console.log('in show_flat handleBookingClick, NO DATES SELECTED: ');
      alert('Please select dates for booking.')
    }
  }

    bookingRequestCallbackOwner() {
    // this.renderDatePicker()
    alert(`Dates ${this.formatDate(this.props.selectedBookingDates.from)} to ${this.formatDate(this.props.selectedBookingDates.to)} blocked out. To unblock, delete booking on my page`)
  }

  disabledDays(bookings) {
    // Note that new disabledDays does not include the after and before daysr!!!!!!!!!!!!!!!!!!!!!!!
    // So need to adjust dates with setDate and getDate
    const bookingsEmpty = _.isEmpty(this.props.flat.bookings);
    const daysList = [];
    console.log('in show_flat, disabledDays, bookingsEmpty ', bookingsEmpty);

    if (!bookingsEmpty) {
      // console.log('in show_flat, disabledDays, days from ', this.props.flat.bookings[0].date_end);

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
        // console.log('in show_flat, disabledDays, in _.each, afterDate after setDate: ', adjustedAfterDate);
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
    // console.log('in show_flat, disabledDays, outside _.each, firstOfMonth, today just dates: ', firstOfMonthJustDate, todayJustDate);
    if (todayJustDate !== firstOfMonthJustDate) {
      // console.log('in show_flat, disabledDays, outside _.each, firstOfMonth, today: ', new Date(firstOfMonth - 1), today);
      const firstOfMonthRange = { after: new Date(firstOfMonth - 1), before: today }
      daysList.push(firstOfMonthRange);
      // console.log('in show_flat, disabledDays, outside _.each, firstOfMonthRange: ', firstOfMonthRange);
    }
    // const firstofMonth = new Date.now()
    // Add iCalendar imported dates to dates to block out
    // test if fetched ical file exists. if so, read it and add to daysList array
    // ical file is fetched in componentDidMount from this.props flat ical_import_url
    if (this.props.fetchedIcal) {
      // call fucntion to parse ical ics file
      const daysRangeArray = this.readIcal();
      _.each(daysRangeArray, range => {
        // add start and end to range and push into dayList array
        const eachRange = { after: new Date(range.date_start - 1), before: new Date(range.date_end + 1) };
        daysList.push(eachRange);
      });
    }
    console.log('in show_flat, disabledDays, after _.each, daysList ', daysList);
    // daylist array gets fed inot react-date-picker as props
    return daysList;
  }

  renderDatePicker() {
    // const bookingsEmpty = _.isEmpty(this.props.flat.bookings);
    if (this.props.flat) {
      console.log('in show_flat, renderDatePicker, after if, this.disabledDays(this.props.flat.bookings): ', this.disabledDays(this.props.flat.bookings));
      // console.log('in show_flat, renderDatePicker, got past if, this.props.flat: ', this.props.flat);
      return (
        <div className="date-picker-container">
        <h4>{AppLanguages.selectRange[this.props.appLanguageCode]}:</h4>
        <DatePicker
          // initialMonth={new Date(2017, 4)}
          daysToDisable={this.disabledDays(this.props.flat.bookings)}
          numberOfMonths={3}
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

      // console.log('in show_flat, renderMap, this.props.flat: ', this.props.flat);
      const initialPosition = { lat: this.props.flat.lat, lng: this.props.flat.lng };
      const flatsEmpty = false;
      const flatArray = [this.props.flat];
      const flatArrayMapped = _.mapKeys(flatArray, 'id');

      // console.log('in show_flat, renderMap, flatArray: ', flatArray);
      // console.log('in show_flat, renderMap, flatArrayMapped: ', flatArrayMapped);

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
    // console.log('in show_flat bookingRequestCallback, passed from callback: ', flatId);
    this.props.history.push(`/bookingconfirmation/${flatId}`);
  }

  // currentUserIsOwner() {
  //   if (this.props.auth && this.props.flat) {
  //     // console.log('in show_flat, currentUserIsOwner, this.props.auth.id: ', this.props.auth.id);
  //     // console.log('in show_flat, currentUserIsOwner, this.props.flat: ', this.props.flat.user_id);
  //     // console.log('in show_flat, currentUserIsOwner,this.props.auth.id == this.props.flat.user_id: ', (this.props.auth.id == this.props.flat.user_id));
  //     return (this.props.auth.id == this.props.flat.user_id);
  //     // return true;
  //     // return false;
  //   }
  // }

  handleDateBlockSyncClick(event) {
    // console.log('in show_flat, handleDateBlockClick: ');
    // alert('handleDateBlockClick has not yet been implemented')
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // if (elementVal == 'block') {
    //   console.log('in show_flat, handleDateBlockSyncClick elementVal: ', elementVal);
    //   // this.props.createBooking();
    // }
    // switched  block (now name ownerBooking) to handleBooking click
    if (elementVal == 'sync') {
      console.log('in show_flat, handleDateBlockSyncClick elementVal: ', elementVal);
      if (this.props.flat.calendars.length > 0) {
        this.props.syncCalendars({ flat_id: this.props.flat.id });
      } else {
        window.alert('You do not have any iCalendars registered. Please go to edit flat and add calendars')
      }
    }
  }

  handleEditFlatClick() {
    // console.log('in show_flat, handleEditFlatClick, this.props.flat.id: ', this.props.flat.id);
    this.props.history.push(`/editflat/${this.props.flat.id}`);
  }

  handleDeleteFlatClick() {
    // console.log('in show_flat, handleDeleteFlatClick: ');
    if (window.confirm('Are you sure you want to delete this listing?')) {
      this.props.showLoading();
      // console.log('in show_flat, handleDeleteFlatClick, window.confirm, YES, this.props.flat.id: ', this.props.flat.id);
      // call deleteFlat action creator
      this.props.deleteFlat(this.props.flat.id, () => this.deleteFlatClickCallBack());
    } else {
      // console.log('in show_flat, handleDeleteFlatClick, window.confirm, NO: ');
    }
  }

  deleteFlatClickCallBack() {
    this.props.history.push('/mypage');
    this.props.showLoading();
  }

  renderMessaging() {
    if (!this.props.currentUserIsOwner && this.props.conversation) {
      console.log('in show_flat, renderMessaging this.props.currentUserIsOwner, this.props.conversation: ', this.props.currentUserIsOwner, this.props.conversation);
      return (
        <div className="message-box-container">
          <div className="message-box">
          <h3>{AppLanguages.messages[this.props.appLanguageCode]}</h3>
            <Messaging
              currentUserIsOwner={this.props.currentUserIsOwner}
              conversation={this.props.conversation[0]}
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

  handleMessagingOpenClick() {
    this.setState({ messagingOpen: true }, () => {
      // console.log('in show_flat, handleMessagingOpenClick, this.state.messagingOpen: ', this.state.messagingOpen);
    });
  }

  renderChatMessageText() {
    // style={this.props.ownerUserStatus.online ? { color: '#39ff14', fontSize: '12px' } : {}}
    // online color code is lime green from html-colorcodes site, offline color is giants-orange from same site
    return (
      <div
        style={this.props.ownerUserStatus.online ? { color: '#32cd32', fontSize: '12px' } : { color: '#ffa812' }}
        className="show-flat-message-button-text"
      >
        {this.props.ownerUserStatus.online ? 'Chat' : 'Message'}
      </div>
    );
  }

// get boolean returned from currentUserIsOwner and render or do not render an appropriate buttton
// current user that is owner of flat should be able to block out days on calendar without charge
// also need an edit button if current user is owner
  renderButtons() {
    // console.log('in show_flat, renderButton, this.props.auth.authenticated: ', this.props.auth.authenticated);
      if (this.props.auth.authenticated) {
        if (!this.props.currentUserIsOwner) {
          // console.log('in show_flat, renderButton, if, not current user; I am not the currentUserIsOwner: ', this.currentUserIsOwner());
          return (
            <div className="show-flat-button-box">
              <button value="userBooking" onClick={this.handleBookingClick} className="btn btn-primary btn-lg btn-book-submit">{AppLanguages.requestReservation[this.props.appLanguageCode]}</button>
              <button value="message" style={{ padding: '5px 20px 5px 20px' }} onClick={this.handleMessagingOpenClick} className="btn btn-primary btn-lg btn-book-submit btn-message-modal-open">
                <i style={{ fontSize: '40px' }} className="far fa-comment"></i>
                {this.props.userFlatNewMessages ? <div className="show-flat-mail-number-box"><div className="header-mail-number">{this.props.userFlatNewMessages}</div></div> : ''}

                <div className="show-flat-message-button-text-background">
                  { this.props.ownerUserStatus ? this.renderChatMessageText() : <div className="show-flat-message-button-text">Message</div> }
                </div>
              </button>
            </div>
          );
        } else {
          // console.log('in show_flat, renderButton, if, am current user; I am the currentUser: ', this.currentUserIsOwner());
          return (
            <div className="show-flat-current-user-button-box">
              <div className="show-flat-button-box">
                <button onClick={this.handleEditFlatClick} className="btn btn-warning btn-lg show-flat-footer-edit-btn">{AppLanguages.edit[this.props.appLanguageCode]}</button>
              </div>
              <div className="show-flat-button-box">
                <button onClick={this.handleDeleteFlatClick} className="btn btn-danger btn-lg">{AppLanguages.delete[this.props.appLanguageCode]}</button>
              </div>
              <div className="show-flat-button-box">
                <button value="ownerBooking" onClick={this.handleBookingClick} className="btn btn-primary btn-lg btn-book-submit">{AppLanguages.blockDates[this.props.appLanguageCode]}</button>
              </div>
              {this.props.flat.calendars ?
                <div className="show-flat-button-box">
                  <button value="sync" onClick={this.handleDateBlockSyncClick} className="btn btn-primary btn-lg btn-book-submit" style={{ backgroundColor: 'white', color: 'blue' }}>{AppLanguages.syncCalendar[this.props.appLanguageCode]}</button>
                </div> :
                ''
              }

            </div>
          );
        }
      } else {
        return (
          <div>
          <div className="send-owner-a-message-div" onClick={this.handleSignInClick}>
            <h4><i className="fa fa-book"></i>   Sign in to Book!</h4>
          </div>
          </div>
        );
      }
  }

  sendOwnerAMessage() {
    if (!this.props.auth.authenticated) {
      return (
        <div className="send-owner-a-message-div" onClick={this.handleSignInClick}>
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
    const flatEmpty = _.isEmpty(this.props.flat);
    // if (this.props.flat) {
    if (!flatEmpty) {
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
    if (reviews.length > 0) {
      return _.map(reviews, review => {
        console.log('in show_flat, renderEachReview, review : ', review);
        return (
          <div key={review.id} className="show-flat-review-details col-xs-12 col-md-6">
          <div className="review-top-box">

          <div className="review-user-box">
          <div className="review-avatar">
          <img
            src={review.user.image ?
              'http://res.cloudinary.com/chikarao/image/upload/w_50,h_50/' + review.user.image + '.jpg'
            :
             'http://res.cloudinary.com/chikarao/image/upload/w_50,h_50/' + 'blank_profile_picture_4' + '.jpg'
                }
            alt=""
            />
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
  }

  renderReviews() {
    // const reviewsEmpty = _.isEmpty(this.props.reviews)
    const flatEmpty = _.isEmpty(this.props.flat);
    if (!flatEmpty) {
      // console.log('in show_flat, renderReviews, : ', this.props.reviews);
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

  formatIcalDate(date) {
    const startYear = date.substr(0, 4);
    const startMonth = parseInt(date.substr(4, 2), 10) - 1;
    const startDay = date.substr(6, 2);
    // bookings.date_start = dateStart[1];
    const startDate = new Date(startYear, startMonth, startDay);
    return startDate;
  }

  readIcal() {
    // read in ics file fetched from calendar.google.com
    // returns array of objects with date_start and date_end
    if (this.props.fetchedIcal) {
      const { fetchedIcal } = this.props;
      // split file into lines
      const lines = fetchedIcal.split('\n');
      // booking object define
      const bookingsArray = [];
      let bookings;
      //
      // let bookingCount = 0;
      _.each(lines, (line) => {
        // console.log('in landing, readIcal, line: ', line);
        if (line.includes('DTSTART')) {
          bookings = {};
          // if there is DTSTART in a line
          const dateStart = line.split(':');

          // const startYear = dateStart[1].substr(0, 4);
          // const startMonth = parseInt(dateStart[1].substr(4, 2), 10);
          // const startDay = dateStart[1].substr(6, 2);
          // // bookings.date_start = dateStart[1];
          // const startDate = new Date(startYear, startMonth, startDay);
          bookings.date_start = this.formatIcalDate(dateStart[1]);
          // console.log('in landing, readIcal, dateStart: ', dateStart);
          // console.log('in landing, readIcal, startYear: ', startYear);
          // console.log('in landing, readIcal, startMonth: ', startMonth);
          // console.log('in landing, readIcal, startDay: ', startDay);
          // consolstartog('in landing, readIcal, dateStart bookings: ', bookings);
        }
        if (line.includes('DTEND')) {
          const dateEnd = line.split(':');
          // bookings[bookingCount].date_end = dateEnd[1];
          bookings.date_end = this.formatIcalDate(dateEnd[1]);
          // bookings.date_end = dateEnd[1];
          // console.log('in landing, readIcal, dateEnd: ', dateEnd);
          // console.log('in landing, readIcal, dateEnd bookings: ', bookings);
          bookingsArray.push(bookings);
          // bookingCount++;
        }
      });
      // console.log('in show_flat, readIcal, bookingsArray: ', bookingsArray);
      return bookingsArray;
    }
  }

  renderMessagingModal() {
    console.log('in show_flat, renderMessagingModal: ');
    return (
      <MessagingModal
        show={this.state.messagingOpen}
        // show
        showMessagingModal={() => this.setState({ messagingOpen: false })}
        currentUserIsOwner={this.props.currentUserIsOwner}
        conversation={this.props.conversation[0]}
        noConversationForFlat={this.props.noConversationForFlat}
        containerWidth='300px'
        // noConversation={this.props.noConversation}
        fromShowPage
      />
    );
  }

  render() {
    // !!!!!map needs to be id=map for the interaction to work
    // if currentUserIsOwner NOT owner and there are no places assigned to flat, do not show mapInteraction
    const doNotShowContainer = this.props.flat && !this.props.currentUserIsOwner && (this.props.flat.places.length < 1)
    // {this.renderMap()}
    return (
      <div className="show-flat-body">
          {this.state.messagingOpen ? this.renderMessagingModal() : ''}
          {this.renderLightboxScreen()}
        <div>
          {this.renderFlat()}
        </div>
        <div>
          {this.renderDatePicker()}
        </div>
        <div className="container">
          <div className="row">
            <div className={doNotShowContainer ? 'map-container' : 'map-container col-xs-12 col-sm-12 col-md-8'} id="map">
            </div>
            {doNotShowContainer
              ?
              ''
              :
              <div className="col-xs-12 col-sm-12 col-md-4">
                <MapInteraction
                  // check if props updated
                  flat={this.props.flat ? this.props.flat : null}
                  places={this.props.flat ? this.props.flat.places : {}}
                  showFlat
                  // check if currentUserIsOwner to display right messages
                  currentUserIsOwner={this.props.currentUserIsOwner}
                />
              </div>
            }
          </div>
        </div>

          {this.props.currentUserIsOwner ? <h4>This is your flat! <br/>Block out dates, edit or delete listing.</h4> : this.sendOwnerAMessage()}
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
      currentUserIsOwner: state.flat.currentUserIsOwner,
      selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
      auth: state.auth,
      conversation: state.conversation.conversationByFlat,
      noConversation: state.conversation.noConversation,
      noConversationForFlat: state.conversation.noConversationForFlat,
      reviews: state.reviews,
      // places uses flat.selectedFlatFromParams.places
      // places: state.places.places,
      // places: state.flat.selectedFlatFromParams.places,
      language: state.places.placeSearchLanguage,
      // conversation: state.conversation.createMessage
      appLanguageCode: state.languages.appLanguageCode,
      // state.flat.selectedFlatFromParams.flat_language that has been filtered above
      // null means user has not created that language
      // or the appLanaguageCode == flat_language, the base language
      // flatLanguage,
      fetchedIcal: state.bookingData.fetchedIcal,
      ownerUserStatus: state.conversation.ownerUserStatus, // object not array of user statuses
      // integer for new messages sent to current user for flat
      userFlatNewMessages: state.conversation.userFlatNewMessages,
    };
  }

export default connect(mapStateToProps, actions)(ShowFlat);
