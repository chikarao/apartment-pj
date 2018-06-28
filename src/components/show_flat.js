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

import Amenities from './constants/amenities'
import SearchTypeList from './constants/search_type_list'


const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

const GOOGLEMAP_API_KEY = process.env.GOOGLEMAP_API_KEY;

// let placesResults = [];
// let resultsReceived = false;
// const resultsArray = []

const AMENTIES = Amenities;
let RESULTS_ARRAY = []

class ShowFlat extends Component {
  constructor(props) {
   super(props);
   this.state = { placesResults: [], map: {}, autoCompletePlace: {}, clickedPlaceArray: [] };
 }
  componentDidMount() {
    console.log('in show flat, componentDidMount, params', this.props.match.params);
    // gets flat id from params set in click of main_cards or infowindow detail click
    // this.props.match.params returns like this: { id: '43' })
    this.props.selectedFlatFromParams(this.props.match.params.id);
    this.props.fetchPlaces(this.props.match.params.id);
    //fetchConversationByFlatAndUser is match.params, NOT match.params.id
    if (this.props.auth.authenticated) {
      this.props.getCurrentUser();
      this.props.fetchConversationByFlat({ flat_id: this.props.match.params.id });
    }
    if (this.props.flat) {
      console.log('in show flat, componentDidMount, this.props.flat', this.props.flat);
    }

    this.props.fetchReviewsForFlat(this.props.match.params.id);
  }

  componentDidUpdate() {
    // this.scrollLastMessageIntoView();
    // to handle error InvalidValueError: not an instance of HTMLInputElement
    // handleSearchInput was running before HTML was rendered
    //so input ID map-interaction-input was not getting picked up
    if (this.props.flat) {
      this.handleSearchInput();
    }
  }

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
              <div className="amenity-radio">{AMENTIES[key]}</div>
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

  // renderMap() {
  //   if (this.props.flat) {
  //     console.log('in show_flat, renderMap, this.props.flat: ', this.props.flat);
  //     const initialPosition = { lat: this.props.flat.lat, lng: this.props.flat.lng }
  //     const flatsEmpty = false;
  //     const flatArray = [this.props.flat];
  //     const flatArrayMapped = _.mapKeys(flatArray, 'id');
  //
  //     console.log('in show_flat, renderMap, flatArray: ', flatArray);
  //     console.log('in show_flat, renderMap, flatArrayMapped: ', flatArrayMapped);
  //
  //     return (
  //       <div>*******************MAP*********************</div>
  //     );
  //   }
  // }

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

//   scrollLastMessageIntoView() {
//     const items = document.querySelectorAll('.show-flat-each-message-box');
//     console.log('in show_flat, scrollLastMessageIntoView, items: ', items);
//
//     const last = items[items.length - 1];
//     console.log('in show_flat, scrollLastMessageIntoView, last: ', last);
//     if (last) {
//       last.scrollIntoView();
//     }
//   }
//
//   formatDate(date) {
//     let hours = date.getHours();
//     let minutes = date.getMinutes();
//     const ampm = hours >= 12 ? 'pm' : 'am';
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'
//     minutes = minutes < 10 ? `0${minutes}` : minutes;
//     const strTime = `${hours}:${minutes}  ${ampm}`;
//     return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
// }
//
//   renderEachMessage() {
//     if (this.props.conversation) {
//       const { conversation } = this.props;
//       // conversation is an array
//       const messages = conversation[0].messages;
//       console.log('in show_flat, renderEachMessage,this.props.conversation: ', this.props.conversation);
//
//       return _.map(messages, (message, i) => {
//         console.log('in show_flat, renderEachMessage, message: ', message);
//         const date = new Date(message.created_at)
//
//         if (!message.sent_by_user) {
//           console.log('in show_flat, renderEachMessage, message.sent_by_user: ', message.sent_by_user);
//           console.log('in show_flat, renderEachMessage, date message.created_at: ', message.created_at);
//           console.log('in show_flat, renderEachMessage, date message.created_at: ', message.created_at);
//           console.log('in show_flat, renderEachMessage, date message.read: ', message.read);
//           console.log('in show_flat, renderEachMessage, date: ', date);
//           return (
//             <div key={message.id} className="show-flat-each-message-box">
//               <div className="show-flat-each-message-user">
//                 <div className="show-flat-each-message-date">{this.formatDate(date)}</div>
//                 <div className="show-flat-each-message-content-user">{message.body}</div>
//                 <div className="show-flat-each-message-read">{message.read ? 'Seen' : 'Unseen'}</div>
//               </div>
//             </div>
//           );
//         } else {
//           return (
//             <div key={message.id} className="show-flat-each-message-box">
//               <div className="show-flat-each-message">
//                 <div className="show-flat-each-message-date">{this.formatDate(date)}</div>
//                 <div className="show-flat-each-message-content">{message.body}</div>
//                 <div className="show-flat-each-message-read">{message.read ? 'Seen' : 'Unseen'}</div>
//               </div>
//             </div>
//           );
//         }
//       });
//     }
//   }
//
//   renderMessages() {
//     return (
//       <div>
//         {this.renderEachMessage()}
//       </div>
//     );
//   }
//
//   handleMessageSendClick(event) {
//     console.log('in show_flat, handleMessageSendClick, clicked: ', event);
//     const messageText = document.getElementById('show-flat-messsage-textarea');
//     console.log('in show_flat, handleMessageSendClick, messageText: ', messageText);
//   }
//
  renderMessaging() {
    if (!this.currentUserIsOwner() && this.props.conversation) {
      console.log('in show_flat, renderMessaging: ', this.currentUserIsOwner());
      return (
        <div className="message-box-container">
        <div className="message-box">
        <Messaging
          currentUserIsOwner={this.currentUserIsOwner()}
          conversation={this.props.conversation}
          noConversation={this.props.noConversation}
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
  renderButton() {
    console.log('in show_flat, currentUserIsOwner: ', this.currentUserIsOwner());
    console.log('in show_flat, renderButton, this.props.auth.authenticated: ', this.props.auth.authenticated);
      if (this.props.auth.authenticated) {
        if (!this.currentUserIsOwner()) {
          console.log('in show_flat, renderButton, if, not current user; I am not the currentUserIsOwner: ', this.currentUserIsOwner());
          return (
            <div className="show-flat-button-box">
              <button onClick={this.handleBookingClick.bind(this)} className="btn btn-primary btn-lg">Book Reservation</button>
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
              <button onClick={this.handleDateBlockClick.bind(this)} className="btn btn-primary btn-lg">Block Dates</button>
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

  createMap(location, zoom) {
    console.log('in show_flat, createMap, location: ', location);
    const map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom
    });
    this.setState({ map })
    return map;
  }

  getPlaces(criterion) {
    console.log('in show_flat, getPlaces, at top thisthis: ', this);
    console.log('in show_flat, getPlaces, criterion: ', criterion);
    console.log('in show_flat, getPlaces, this.props.flat.lat: ', this.props.flat.lat);
    console.log('in show_flat, getPlaces, this.props.flat.lng: ', this.props.flat.lng);
    const radius = 5000;
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
    const location = { lat: this.props.flat.lat, lng: this.props.flat.lng };
    const flat = this.props.flat;

    // axios.get(`https://maps.googleapis.com/maps/api/place/radarsearch/json?location=${this.props.flat.lat},${this.props.flat.lat}&radius=${radius}&type=${criterion}&key=${GOOGLEMAP_API_KEY}`)
    //   .then(response => {
    //     console.log('in show_flat, getPlaces, gmap request, response: ', response);
    //   });
    // const mapShow = new google.maps.Map(document.getElementById('map'), {
    //      center: location,
    //      zoom: 14
    //    });
    const mapShow = this.createMap(location, 14);

    const service = new google.maps.places.PlacesService(mapShow);
    console.log('in show_flat, getPlaces, service: ', service);
    service.nearbySearch({
      location,
      radius: 2000,
      // if rank by distance, DO NOT use radius
      type: criterion,
      // rankBy: google.maps.places.RankBy.DISTANCE
      // the propblem with rank by distance is in case of lots of results, give irrelevant results
    }, (results, status) => {
      // use () => to bind to this; gives access to this object
      // if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (status === 'OK') {
          console.log('in show_flat, getPlaces, Placeservice, results: ', results);
          // console.log('in show_flat, getPlaces, Placeservice, placesResults: ', placesResults);
          // placesResults = results;
          // console.log('in show_flat, getPlaces, Placeservice, this.props: ', this.props);
          // this.setState({ placesResults: results });
          console.log('in show_flat, getPlaces, after if thisthis?: ', this);

          for (let i = 0; i < results.length; i++) {
            const showLabel = false;
            const marker = this.createMarker(results[i], mapShow, showLabel);
            marker.setMap(mapShow)
            console.log('in show_flat, getPlaces, Placeservice: ', results[i]);
            // resultsArray.push(results[i]);
            // console.log('in show_flat, getPlaces, Placeservice: ', results[i]);
          }
          // create marker for flat each time
          const flatMarker = this.createFlatMarker(flat, mapShow);
          flatMarker.setMap(mapShow);
          // if (resultsArray.length > 0) {
          this.getPlacesCallback(results);
          // this.setState({ map: mapShow })

            // console.log('in show_flat, getPlaces, Placeservice, resultsArray.length: ', resultsArray.length);
            // console.log('in show_flat, getPlaces, Placeservice, resultsArray: ', resultsArray);
          // }
          // getResultsOfPlacesSearch(results);
          // setStateWithResults(results);
        }
      }); // end of callback {} and nearbySearch
  } //end of getPlaces

  createMarker(place, mapShow, showLabel) {
    if (typeof place.geometry !== 'undefined') {
      const infowindow = new google.maps.InfoWindow();
      const markerIcon = {
        // url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
        url: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
        // url: 'https://image.flaticon.com/icons/svg/138/138978.svg',
        // url: 'https://image.flaticon.com/icons/svg/143/143964.svg',        // scaledsize originally 80, 80 taken from medium https://medium.com/@barvysta/google-marker-api-lets-play-level-1-dynamic-label-on-marker-f9b94f2e3585
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        //anchor starts at 0,0 at left corner of marker
        anchor: new google.maps.Point(20, 40),
        //label origin starts at 0, 0 somewhere above the marker
        labelOrigin: new google.maps.Point(20, 33)
      };
      console.log('in show_flat, createMarker, place.geometry: ', place.geometry);
      const placeLoc = place.geometry.location;
      // Don't need map; setMap is run in function where createMarker is called
      const marker = new google.maps.Marker({
        // map: mapShow,
        position: place.geometry.location,
        icon: markerIcon,
        label: showLabel ? { text: '', fontWeight: 'bold' } : ''
      });

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(mapShow, this);
      });
      return marker;
    }
  } // end of createMarker

  createFlatMarker(flat, map) {
    // console.log('in show_flat, createFlatMarker, flatLocation: ', flatLocation);
    console.log('in show_flat, createFlatMarker, flat: ', flat);
    const markerLabel = 'Here is the Flat';
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
    const markerIcon = {
      url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
      // scaledsize originally 80, 80 taken from medium https://medium.com/@barvysta/google-marker-api-lets-play-level-1-dynamic-label-on-marker-f9b94f2e3585
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      //anchor starts at 0,0 at left corner of marker
      anchor: new google.maps.Point(20, 40),
      //label origin starts at 0, 0 somewhere above the marker
      labelOrigin: new google.maps.Point(20, 33)
    };
    // Don't need map; setMap is run in function where createFlatMarker is called
    const marker = new google.maps.Marker({
      key: flat.id,
      position: {
        lat: flat.lat,
        lng: flat.lng
      },
      // map,
      flatId: flat.id,
      icon: markerIcon,
      label: {
        text: markerLabel,
        fontWeight: 'bold'
        // color: 'gray'
      }
    });
    return marker;
  } //end of createFlatMarker

  // Do not need button any more
  // handlePlaceSearchClick(event) {
  //   console.log('in show_flat, handlePlaceSearchClick, clicked: ', event);
  //   const input = document.getElementById('map-interaction-input');
  //   console.log('in show_flat, handlePlaceSearchClick, input: ', input.value);
  //   console.log('in show_flat, handlePlaceSearchClick, thisthis: ', this);
  //   this.getPlaces(input.value);
  //   input.value = '';
  // }



  getPlacesCallback(results) {
    console.log('in show_flat, getPlacesCallback, results ??: ', results);

    this.setState({ placesResults: results }, () => console.log('show flat, getPlacesCallback, setState callback, this.state: ', this.state))
  }

  handleSearchCriterionClick(event) {
    console.log('in show_flat, handleSearchCriterionClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    let elementVal = clickedElement.getAttribute('value');
    console.log('in show_flat, handleSearchCriterionClick, elementVal: ', elementVal);

    this.getPlaces(elementVal);
  }

  renderSearchSelection() {
    // consider moving this somewhere else
    const searchTypeList = SearchTypeList;
    return _.map(searchTypeList, (v, k) => {
        return <option key={k} value={k}>{v}</option>;
      // })
    });
}

  handleSearchTypeSelect() {
    const selection = document.getElementById('typeSelection');
    const type = selection.options[selection.selectedIndex].value;
    console.log('in show_flat, handleSearchTypeSelect, type: ', type);
    this.getPlaces(type, () => this.getPlacesCallback())
  }

  createSelectedMarker(placeId) {
    // IMPORTANT creates marker based on placeID, not place as createMarker does
    // handlePlaceSearchClick gets value of the li which is a place id not the object place
    // so need to get a marker with the place id
    console.log('in show_flat, createSelectedMarker, placeId: ', placeId);
    const location = { lat: this.props.flat.lat, lng: this.props.flat.lng };
    const flat = this.props.flat;
    const infowindow = new google.maps.InfoWindow();
    // need to pass zoom to craeteMap
    const map = this.createMap(location, 14);
    const service = new google.maps.places.PlacesService(map);
    service.getDetails({
      placeId
    }, (result, status) => {
      if (status === 'OK') {
        const markersArray = []
        console.log('in show_flat, createSelectedMarker, after if status, result: ', status, result);
        const pointA = this.createFlatMarker(flat, map);
        markersArray.push(pointA);
        console.log('in show_flat, createSelectedMarker, after if status, pointA: ', pointA);
        // const pointB = this.createMarker(flat, map);

        const markerIcon = {
          // url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
          url: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
          // url: 'https://image.flaticon.com/icons/svg/138/138978.svg',
          // url: 'https://image.flaticon.com/icons/svg/143/143964.svg',
          // scaledsize originally 80, 80 taken from medium https://medium.com/@barvysta/google-marker-api-lets-play-level-1-dynamic-label-on-marker-f9b94f2e3585
          scaledSize: new google.maps.Size(40, 40),
          origin: new google.maps.Point(0, 0),
          //anchor starts at 0,0 at left corner of marker
          anchor: new google.maps.Point(20, 40),
          //label origin starts at 0, 0 somewhere above the marker
          labelOrigin: new google.maps.Point(20, 33)
        };

        const pointB = new google.maps.Marker({
          // map,
          place: {
            placeId,
            location: result.geometry.location
          },
          icon: markerIcon,
          label: {
            text: 'Here is the search result',
            fontWeight: 'bold'
          }
        });
        markersArray.push(pointB);
        const pointALatLng = { lat: pointA.position.lat(), lng: pointA.position.lng() }
        const pointBLatLng = { lat: pointB.place.location.lat(), lng: pointB.place.location.lng() }
        const distance = this.getDistance(pointALatLng, pointBLatLng, pointB, map);
        console.log('in show_flat, createSelectedMarker, after if status, distance: ', distance);
        pointA.setMap(map)

        console.log('in show_flat, createSelectedMarker, after if status, pointB: ', pointB);
        console.log('in show_flat, createSelectedMarker, after if status, markersArray: ', markersArray);

        google.maps.event.addListener(pointB, 'click', function () {
          infowindow.setContent(result.name);
          infowindow.open(map, this);
        });
        const searchClick = true;
        this.calculateAndDisplayRoute(pointA, pointB, markersArray, map, searchClick);
      } // end of if status ok
    }); // end of callback
  } // end of createSelectedMarker

  // FOR getting route from point A to B

  // sets up search input by instantiating auto complete in renderMap as soon as this.props.flat
  // is loaded in props
  handleSearchInput() {
    // setting map center and bounds for autocomplete
    // bounds focuses search results within the area
    const mapCenter = { lat: this.props.flat.lat, lng: this.props.flat.lng };
    const latOffsetNorth = 0.06629999999999825;
    const latOffsetSouth = -0.036700000000003286;
    const lngOffsetWest = -0.14;
    const lngOffsetEast = 0.2;

    // offset the same as the big map, so pans SF area and some of Oakland
    const defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(mapCenter.lat + latOffsetSouth, mapCenter.lng + lngOffsetWest), //more negative, less positive
      new google.maps.LatLng(mapCenter.lat + latOffsetNorth, mapCenter.lng + lngOffsetEast)
    ); //less negative, more positive

      //
      // console.log('in show_flat, handleSearchInput, defaultBounds: ', defaultBounds);
      // gets input for autocomplete focused on bounds from above
      const input = document.getElementById('map-interaction-input');
      const options = {
        bounds: defaultBounds
        // types: ['establishment']
      };

        // instantiate autocomplete and addlistener for when selection made
        const autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.addListener('place_changed', onPlaceChanged.bind(this));
        console.log('in show_flat, handleSearchInput, autocomplete: ', autocomplete);

        // console.log('in show_flat, handleSearchInput, this.state.autoCompletePlace: ', this.state.autoCompletePlace);

        // called when place selected in autocomplete
        function onPlaceChanged() {
          // markers array needed to fit map to marker bounds
          const markersArray = [];
          const place = autocomplete.getPlace();
          // List in 'Top Search Resutls'; put place in array first for getPlacesCallback to handle
          const placeForResultsList = [place];
          this.getPlacesCallback(placeForResultsList);
          // check if place returned; in case return pushed without selection in search input
          if (typeof place.geometry !== 'undefined') {
            console.log('in show_flat, handleSearchInput, place: ', place);
            // this is accessible as this function is bound to this(the class, not the function)
            // console.log('in show_flat, handleSearchInput, thisthis: ', this);

            // latlng for the flat
            const location = { lat: this.props.flat.lat, lng: this.props.flat.lng }
            // create map with flat lat lng and initial zoom, zoom will be overriden by bounds of markers below
            const map = this.createMap(location, 14);

            // boolean passed to create marker to decide whether to show label on marker
            const showLabel = true;
            // marker of place from autocomplete
            const marker = this.createMarker(place, map, showLabel);
            const locationB = { lat: marker.position.lat(), lng: marker.position.lng() };
            const flatMarker = this.createFlatMarker(this.props.flat, map);

            // pushes markers into array for map zooming to bounds of markers
            markersArray.push(marker);
            markersArray.push(flatMarker);

            //  location and location B are not places
            const searchClick = false;
            this.calculateAndDisplayRoute(flatMarker, marker, markersArray, map, searchClick)

            // marker.setMap(map);
            // marker for location B is set on map in getDistance
            flatMarker.setMap(map);

            // zoom map to fit markers drawn
            const bounds = new google.maps.LatLngBounds();
            for (let i = 0; i < markersArray.length; i++) {
              bounds.extend(markersArray[i].getPosition());
            }
            map.fitBounds(bounds);
            // gets distance from flat to searched autocomplete place,
            // and draws marker with distance label and sets on map
            this.getDistance(location, locationB, marker, map);
          } // end of if place !== 'undefined'
        }
        // end of function function onPlaceChanged
        // else {
        //   document.getElementById('autocomplete').placeholder = 'Enter a city';
        // }
      // }
  }

    calculateAndDisplayRoute(pointA, pointB, markersArray, map, searchClick) {
      const directionsService = new google.maps.DirectionsService;
      const directionsDisplay = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true
      });
      console.log('in show_flat, calculateAndDisplayRoute, after if status, pointA, pointB: ', pointA, pointB);
      directionsDisplay.setMap(map);
      console.log('in show_flat, createSelectedMarker, after if status, pointA, pointB: ', pointA, pointB.place);
      // for some reason, better to send markers than lat lng when calling calculateAndDisplayRoute
      const pointALatLng = searchClick ? { lat: pointA.position.lat(), lng: pointA.position.lng() } : { lat: pointA.position.lat(), lng: pointA.position.lng() }
      const pointBLatLng = searchClick ? { lat: pointB.place.location.lat(), lng: pointB.place.location.lng() } : { lat: pointB.position.lat(), lng: pointB.position.lng() }

      console.log('in show_flat, createSelectedMarker, after if status, pointALatLng: ', pointALatLng);
    directionsService.route({
      origin: pointALatLng,
      destination: pointBLatLng,
      travelMode: google.maps.TravelMode.WALKING,
      // preserveViewport: true
    }, (response, status) => {
      if (status === 'OK') {
        console.log('in show_flat, calculateAndDisplayRoute, after if status, response: ', response);
        console.log('in show_flat, calculateAndDisplayRoute, after if status, markersArray: ', markersArray);
        // _.each(markersArray, marker => {
        //   marker.setMap(map)
        // });
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    // this.getDistance();
  }

  getDistance(pointALatLng, pointBLatLng, pointB, map) {
    console.log('in show_flat, getDistance, ointALatLng, pointBLatLng, pointB, map: ', pointALatLng, pointBLatLng, pointB, map);

    const distanceService = new google.maps.DistanceMatrixService();
    let distance = '';
    distanceService.getDistanceMatrix(
      {
        origins: [pointALatLng],
        destinations: [pointBLatLng],
        travelMode: 'WALKING',
      }, (response, status) => {
        if (status === 'OK') {
          console.log('in show_flat, getDistance, after if status, distanceService response distance response.rows[0].elements[0].distance: ', response.rows[0].elements[0].distance);

          distance = { distance: response.rows[0].elements[0].distance.text };
          const distanceText = response.rows[0].elements[0].distance.text;
          const marker = pointB;
          console.log('in show_flat, getDistance, after if status, distanceService after if, marker: ', marker);
          console.log('in show_flat, getDistance, after if status, distanceService after if, distanceText: ', distanceText);
          // marker.label.text = distance.text;
          const markerLabel = marker.getLabel();
          console.log('in show_flat, getDistance, after if status, distanceService after if, markerLabel: ', markerLabel);
          markerLabel.text = distanceText;
          marker.setLabel(markerLabel);
          console.log('in show_flat, getDistance, after if status, distanceService after if, markerLabel.text: ', markerLabel.tet);
          marker.setMap(map)
        }
      }
    );
    return distance;
  }

  unhighlightClickedPlace() {
    _.each(this.state.clickedPlaceArray, place => {
      const placeDiv = place;
      placeDiv.style.color = 'black';
    });
  }

  handlePlaceClick(event) {
    this.unhighlightClickedPlace();

    console.log('in show_flat, handlePlaceClick, event.target: ', event.target);
    const clickedElement = event.target;
    clickedElement.style.color = 'lightGray';
    const elementVal = clickedElement.getAttribute('value');
    console.log('in show_flat, handlePlaceClick, elementVal: ', elementVal);

    this.setState({ clickedclickedPlaceArray: this.state.clickedPlaceArray.push(clickedElement) });
    this.createSelectedMarker(elementVal);
  }

  handleResultAddClick(event) {
    const clickedElement = event.target;
    console.log('in show_flat, handleResultAddClick, event.target, clickedElement: ', clickedElement);
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');
    console.log('in show_flat, handleResultAddClick, elementVal: ', elementVal);
    console.log('in show_flat, handleResultAddClick, elementVal: ', elementName);
    console.log('in show_flat, handleResultAddClick, this.props.flat.id: ', this.props.flat.id);
    this.props.createPlace(this.props.flat.id, elementVal, elementName, () => this.resultAddDeleteClickCallback());
  }

  resultAddDeleteClickCallback() {
    this.props.history.push(`/show/${this.props.flat.id}`);
  }

  renderSearchResultsList() {
    // <div className="search-result-list-radio-label">Add to map <input value={place.place_id} name={place.name} type="checkbox" onChange={this.handleResultAddClick.bind(this)} /></div>
    console.log('in show_flat, renderSearchResultsList, this.state, placesResults: ', this.state);
    const { placesResults } = this.state;
    const resultsArray = [];
    //using placeResults, a state object directly in map gives a error,
    //cannont use object as react child
    _.each(placesResults, result => {
      resultsArray.push(result);
      console.log('in show_flat, renderSearchResultsList, each result.name: ', result);
    });
    console.log('in show_flat, renderSearchResultsList, resultsArray: ', resultsArray);

    return _.map(resultsArray, (place) => {
      console.log('in show_flat, renderSearchResultsList, .map, place: ', place);
      return (
        <div key={place.place_id}>
          <li  value={place.place_id} className="map-interaction-search-result" onClick={this.handlePlaceClick.bind(this)}><i className="fa fa-chevron-right"></i>
          &nbsp;{place.name}
          </li>
          <div className="search-result-list-radio-label"><button className="btn btn-primary btn-sm" value={place.place_id} name={place.name} type="checkbox" onClick={this.handleResultAddClick.bind(this)}>Add</ button></div>
        </div>
      )
    });
  }

  handleResultDeleteClick(event) {
    const clickedElement = event.target;
    console.log('in show_flat, handleResultDeleteClick, event.target, clickedElement: ', clickedElement);
    const placeId = clickedElement.getAttribute('value');
    console.log('in show_flat, handleResultDeleteClick, placeId: ', placeId);
    this.props.deletePlace(this.props.flat.id, placeId, () => this.resultAddDeleteClickCallback())
  }

  handleSelectedPlaceClick(event) {
    this.unhighlightClickedPlace();

    console.log('in show_flat, handlePlaceClick, event.target: ', event.target);
    const clickedElement = event.target;
    clickedElement.style.color = 'lightGray';
    const elementVal = clickedElement.getAttribute('value');
    console.log('in show_flat, handlePlaceClick, elementVal: ', elementVal);

    this.setState({ clickedclickedPlaceArray: this.state.clickedPlaceArray.push(clickedElement) });
    this.createSelectedMarker(elementVal);
  }

  renderSelectedResultsList() {
    const { places } = this.props;
    if (places) {
      console.log('in show_flat, renderSelectedResultsList, places: ', places);
      return _.map(places, (place) => {
        console.log('in show_flat, renderSearchResultsList, .map, place: ', place);
        return (
          <div key={place.id}>
          <li value={place.placeid} className="map-interaction-search-result" onClick={this.handleSelectedPlaceClick.bind(this)}><i className="fa fa-chevron-right"></i>
          &nbsp;{place.place_name}
          </li>
          <div className="search-result-list-radio-label"><button className="btn btn-primary btn-sm" value={place.id} type="checkbox" onClick={this.handleResultDeleteClick.bind(this)}>Remove</ button></div>
          </div>
        );
      });
    }
  }

  renderMapInteractiion() {
    // reference https://developers.google.com/places/web-service/supported_types
    // a tag reference: https://stackoverflow.com/questions/1801732/how-do-i-link-to-google-maps-with-a-particular-longitude-and-latitude
    if(this.props.flat) {
      return (
        <div className="map-interaction-container">
          <div className="map-interaction-box">
            <div className="map-interaction-title"><i className="fa fa-search"></i>  Search for Nearest</div>
            <div value="school"className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Schools</div>
            <div value="convenience_store" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Convenience Stores</div>
            <div value="supermarket" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Supermarkets</div>
            <div value="train_station" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Train Stations</div>
            <div value="subway_station" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Subway Stations</div>
            <select id="typeSelection" onChange={this.handleSearchTypeSelect.bind(this)}>
              {this.renderSearchSelection()}
            </select>
            <input id="map-interaction-input" className="map-interaction-input-area" type="text" placeholder="Enter place name or address..." />
            <div className="btn btn-small search-gm-button"><a href={'http://www.google.com/maps/place/ ' + this.props.flat.lat + ',' + this.props.flat.lng + '/@' + this.props.flat.lat + ',' + this.props.flat.lng + ',14z'} target="_blank" rel="https://wwww.google.com" >Open Google Maps and Search</a></div>
          </div>
          <div className="map-interaction-box">
            <div className="map-interaction-title"><i className="fa fa-chevron-circle-right"></i>  Top Search Results</div>
            <ul>
              {this.renderSearchResultsList()}
            </ul>
          </div>
          <div className="map-interaction-box">
            <div className="map-interaction-title"><i className="fa fa-chevron-circle-right"></i>  Places on Map</div>
            <ul>
              {this.renderSelectedResultsList()}
            </ul>
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
    // if (this.props.selectedDates) {
    // }
    return (
      <div>
          {this.renderLightboxScreen()}
        <div>
          {this.renderFlat(this.props.match.params.id)}
        </div>
        <div>
          {this.renderDatePicker()}
        </div>
        <div className="container" id="map">
          {this.renderMap()}
        </div>
        <div>
          {this.renderMapInteractiion()}
        </div>
        <div>
          {this.currentUserIsOwner() ? <h4>This is your flat! <br/>Block out dates, edit or delete listing.</h4> : this.sendOwnerAMessage()}
          {this.renderMessaging()}
        </div>
        <div>
          {this.renderReviews()}
        </div>
        <footer className="show-flat-footer">
          {this.renderButton()}
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
    reviews: state.reviews,
    places: state.places.places
    // conversation: state.conversation.createMessage
  };
}

export default connect(mapStateToProps, actions)(ShowFlat);
