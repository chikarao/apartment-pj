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

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

const GOOGLEMAP_API_KEY = process.env.GOOGLEMAP_API_KEY;

// let placesResults = [];
// let resultsReceived = false;
// const resultsArray = []

class ShowFlat extends Component {
  constructor(props) {
   super(props);
   this.state = { placesResults: [] };
 }
  componentDidMount() {
    console.log('in show flat, componentDidMount, params', this.props.match.params);
    // gets flat id from params set in click of main_cards or infowindow detail click
    // this.props.match.params returns like this: { id: '43' })
    this.props.selectedFlatFromParams(this.props.match.params.id);
    this.props.getCurrentUser();
    //fetchConversationByFlatAndUser is match.params, NOT match.params.id
    this.props.fetchConversationByFlat({ flat_id: this.props.match.params.id });
  }

  componentDidUpdate() {
    // this.scrollLastMessageIntoView();
  }

  renderImages(images) {
    console.log('in show_flat renderImages, images: ', images);
    const imagesEmpty = _.isEmpty(images);
    if(!imagesEmpty) {
      return (
        _.map(images, (image, index) => {
          console.log('in show_flat renderImages, image: ', image.publicid);
          return (
            <div key={index} className="slide-show">
              <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + image.publicid + '.jpg'} />
            </div>
          );
        })
      );
    } else {
      return (
        <div className="no-results-message">Images are not available for this flat</div>
      );
    }
  }


  renderFlat(flatId) {
    console.log('in show flat, flatId: ', flatId);
    console.log('in show flat, flat: ', this.props.flat);
    // const flat = _.find(this.props.flats, (f) => {
    //   return f.id === flatId;
    // });
    // console.log('in show flat, flat: ', flat.description);
    const flatEmpty = _.isEmpty(this.props.flat);
    console.log('in show_flat renderFlat, flat empty: ', flatEmpty);


      if (!flatEmpty) {
        const { description, area, beds, sales_point, price_per_month, images } = this.props.flat;
        console.log('in show_flat renderFlat, renderImages: ', this.renderImages(images));
        return (
          <div>
            <div className="show-flat-image-box">
              <div id="carousel-show">
                {this.renderImages(images)}
              </div>
            </div>
            <div className="show-flat-container">
              <div className="show-flat-desription">
                { description }
              </div>

              <div className="show-flat-area">
                { area }
              </div>

              <div className="show-flat-beds">
                Beds: { beds }
              </div>

              <div className="show-flat-sales_point">
                { sales_point }
              </div>

              <div className="show-flat-price">
                ${ parseFloat(price_per_month).toFixed(0) } per month
              </div>
              <div className="show-flat-id">
                <small>flat id: {this.props.match.params.id}</small>
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
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), today.getDay() - 2);
    const firstOfMonthRange = { after: firstOfMonth, before: today }
    daysList.push(firstOfMonthRange);
    console.log('in show_flat, disabledDays, outside _.each, firstOfMonthRange: ', firstOfMonthRange);
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
        <p>Please select a range of dates:</p>
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
      console.log('in show_flat, handleDeleteFlatClick, window.confirm, YES, this.props.flat.id: ', this.props.flat.id);
      // call deleteFlat action creator
      this.props.deleteFlat(this.props.flat.id, () => this.props.history.push('/mypage'));
    } else {
      console.log('in show_flat, handleDeleteFlatClick, window.confirm, NO: ');
    }
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
              <button onClick={this.handleBookingClick.bind(this)} className="btn btn-primary btn-lg">Book Now!</button>
            </div>
          );
        } else {
          console.log('in show_flat, renderButton, if, am current user; I am the currentUser: ', this.currentUserIsOwner());
          return (
            <div className="show-flat-current-user-button-box">
              <div className="show-flat-button-box">
                <button onClick={this.handleDateBlockClick.bind(this)} className="btn btn-primary btn-lg">Block Dates</button>
              </div>
              <div className="show-flat-button-box">
                <button onClick={this.handleEditFlatClick.bind(this)} className="btn btn-warning btn-lg">Edit</button>
              </div>
              <div className="show-flat-button-box">
                <button onClick={this.handleDeleteFlatClick.bind(this)} className="btn btn-danger btn-lg">Delete</button>
              </div>
            </div>
          );
        }
      } else {
        return (
          <div>
            <Link className="btn btn-primary btn-lg" to="/signin">Sign in to Book!</Link>
          </div>
        );
      }
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
    const infowindow = new google.maps.InfoWindow();
    const mapShow = new google.maps.Map(document.getElementById('map'), {
         center: location,
         zoom: 14
       });

    const service = new google.maps.places.PlacesService(mapShow);
    console.log('in show_flat, getPlaces, service: ', service);
    service.nearbySearch({
      location,
      radius: 2000,
      type: criterion
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
            createMarker(results[i], mapShow);
            console.log('in show_flat, getPlaces, Placeservice: ', results[i]);
            // resultsArray.push(results[i]);
            // console.log('in show_flat, getPlaces, Placeservice: ', results[i]);
          }
          // create marker for flat each time
          createFlatMarker(flat, mapShow);
          // if (resultsArray.length > 0) {
          this.getPlacesCallback(results);
            // console.log('in show_flat, getPlaces, Placeservice, resultsArray.length: ', resultsArray.length);
            // console.log('in show_flat, getPlaces, Placeservice, resultsArray: ', resultsArray);
          // }
          // getResultsOfPlacesSearch(results);
          // setStateWithResults(results);
        }
      }); // end of callback {} and nearbySearch

      function createFlatMarker(flat, map) {
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
          labelOrigin: new google.maps.Point(20, 60)
        };

        const marker = new google.maps.Marker({
          key: flat.id,
          position: {
            lat: flat.lat,
            lng: flat.lng
          },
          map,
          flatId: flat.id,
          icon: markerIcon,
          label: {
            text: markerLabel,
            fontWeight: 'bold'
            // color: 'gray'
          }
        });
      } //end of createFlatMarker

      function createMarker(place, mapShow) {
        if (place) {
          const placeLoc = place.geometry.location;
          const marker = new google.maps.Marker({
            map: mapShow,
            position: place.geometry.location
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(mapShow, this);
          });
        }
      } // end of createMarker
  } //end of getPlaces

  handlePlaceSearchClick(event) {
    console.log('in show_flat, handlePlaceSearchClick, clicked: ', event);
    const input = document.getElementById('map-interaction-input');
    console.log('in show_flat, handlePlaceSearchClick, input: ', input.value);
    console.log('in show_flat, handlePlaceSearchClick, thisthis: ', this);
    this.getPlaces(input.value);
    input.value = '';
  }

  getPlacesCallback(results) {
    const resultsArray = [];
    console.log('in show_flat, getPlacesCallback, results ??: ', results);
    // _.each(results, result => {
    //   resultsArray.push(result.name);
    // })
    this.setState({ placesResults: results }, () => console.log('show flat, getPlacesCallback, setState callback, this.state: ', this.state))
  }

  handleSearchCriterionClick(event) {
    console.log('in show_flat, handleSearchCriterionClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    let elementVal = clickedElement.getAttribute('value');
    console.log('in show_flat, handleSearchCriterionClick, elementVal: ', elementVal);
    // if (elementVal === 'train_station') {
    //   elementVal = ['train_station', 'subway_station']
    // }
    this.getPlaces(elementVal);
  }

  renderSearchSelection() {
    const searchTypeList = {
      accounting: 'Accounting',
      airport: 'Airport',
      amusement_park: 'Amusement Park',
      aquarium: 'Aquarium',
      art_gallery: 'Art Gallery',
      atm: 'ATM',
      bakery: 'Bakery',
      bank: 'Bank',
      bar: 'Bar',
      beauty_salon: 'Beauty Salon',
      bicycle_store: 'Bicycle Store',
      book_store: 'Book Store',
      bowling_alley: 'Bowling Alley',
      bus_station: 'Bus Station',
      cafe: 'Cafe',
      campground: 'Campground',
      car_dealer: 'Car Dealer',
      car_rental: 'Car Rental',
      car_repair: 'Car Repair',
      car_wash: 'Car Wash',
      casino: 'Casino',
      cemetery: 'Cemetary',
      church: 'Church',
      city_hall: 'City Hall',
      clothing_store: 'Clothing Store',
      convenience_store: 'Convenience Store',
      courthouse: 'Courthouse',
      dentist: 'Dentist',
      department_store: 'Department Store',
      doctor: 'Doctor',
      electrician: 'Electrician',
      electronics_store: 'Electronics Store',
      embassy: 'Embassy',
      fire_station: 'Fire Station',
      florist: 'Florist',
      funeral_home: 'Funeral Home',
      furniture_store: 'Furniture Store',
      gas_station: 'Gas Station',
      gym: 'Gym',
      hair_care: 'Hair Care',
      hardware_store: 'Hardware Store',
      hindu_temple: 'Hindu Temple',
      home_goods_store: 'Home Goods Store',
      hospital: 'Hospital',
      insurance_agency: 'Insurance Agency',
      jewelry_store: 'Jewelry Store',
      laundry: 'Laundry',
      lawyer: 'Lawyer',
      library: 'Library',
      liquor_store: 'Liquor Store',
      local_government_office: 'Local Government Office',
      locksmith: 'Locksmith',
      lodging: 'Lodging',
      meal_delivery: 'Meal Delivery',
      meal_takeaway: 'Meal Takeaway',
      mosque: 'Mosque',
      movie_rental: 'Movie Rental',
      movie_theater: 'Movie Theater',
      moving_company: 'Moving Company',
      museum: 'Museum',
      night_club: 'Night Club',
      painter: 'Painter',
      park: 'Park',
      parking: 'Parking',
      pet_store: 'Pet Store',
      pharmacy: 'Pharmacy',
      physiotherapist: 'Physiotherapist',
      plumber: 'Plumber',
      police: 'Police',
      post_office: 'Post Office',
      real_estate_agency: 'Real Estate Agency',
      restaurant: 'Restaurant',
      roofing_contractor: 'Roofing Contractor',
      rv_park: 'RV Park',
      school: 'School',
      shoe_store: 'Shoe Store',
      shopping_mall: 'Shopping Mall',
      spa: 'Spa',
      stadium: 'Stadium',
      storage: 'Storage',
      store: 'Store',
      subway_station: 'Subway Station',
      supermarket: 'Supermarket',
      synagogue: 'Synagogue',
      taxi_stand: 'Taxi Stand',
      train_station: 'Train Station',
      transit_station: 'Transit Station',
      travel_agency: 'Travel Agency',
      veterinary_care: 'Veterinary Care',
      zoo: 'Zoo'
    };
    // const searchTypeList = [
    //   'accounting',
    //   'airport',
    //   'amusement_park',
    //   'aquarium',
    //   'art_gallery',
    //   'atm',
    //   'bakery',
    //   'bank',
    //   'bar',
    //   'beauty_salon',
    //   'bicycle_store',
    //   'book_store',
    //   'bowling_alley',
    //   'bus_station',
    //   'cafe',
    //   'campground',
    //   'car_dealer',
    //   'car_rental',
    //   'car_repair',
    //   'car_wash',
    //   'casino',
    //   'cemetery',
    //   'church',
    //   'city_hall',
    //   'clothing_store',
    //   'convenience_store',
    //   'courthouse',
    //   'dentist',
    //   'department_store',
    //   'doctor',
    //   'electrician',
    //   'electronics_store',
    //   'embassy',
    //   'fire_station',
    //   'florist',
    //   'funeral_home',
    //   'furniture_store',
    //   'gas_station',
    //   'gym',
    //   'hair_care',
    //   'hardware_store',
    //   'hindu_temple',
    //   'home_goods_store',
    //   'hospital',
    //   'insurance_agency',
    //   'jewelry_store',
    //   'laundry',
    //   'lawyer',
    //   'library',
    //   'liquor_store',
    //   'local_government_office',
    //   'locksmith',
    //   'lodging',
    //   'meal_delivery',
    //   'meal_takeaway',
    //   'mosque',
    //   'movie_rental',
    //   'movie_theater',
    //   'moving_company',
    //   'museum',
    //   'night_club',
    //   'painter',
    //   'park',
    //   'parking',
    //   'pet_store',
    //   'pharmacy',
    //   'physiotherapist',
    //   'plumber',
    //   'police',
    //   'post_office',
    //   'real_estate_agency',
    //   'restaurant',
    //   'roofing_contractor',
    //   'rv_park',
    //   'school',
    //   'shoe_store',
    //   'shopping_mall',
    //   'spa',
    //   'stadium',
    //   'storage',
    //   'store',
    //   'subway_station',
    //   'supermarket',
    //   'synagogue',
    //   'taxi_stand',
    //   'train_station',
    //   'transit_station',
    //   'travel_agency',
    //   'veterinary_care',
    //   'zoo'];

  return  _.map(searchTypeList, (v, k) => {
      return <option key={k} value={k}>{v}</option>;
    // })
  });
}

  handleSearchTypeSelect() {
    // console.log('in show_flat, handleSearchTypeChange, selected, obj: ', obj);
    // const clickedElementVal = obj.options[obj.selectedIndex].value;
    // // const clickedElementVal = obj.options[obj.selectedIndex];
    // // let elementVal = clickedElement.getAttribute('value');
    // console.log('in show_flat, handleSearchTypeSelect, clickedElementVal: ', clickedElementVal);
    const selection = document.getElementById('typeSelection');
    const type = selection.options[selection.selectedIndex].value;
    console.log('in show_flat, handleSearchTypeSelect, type: ', type);
    this.getPlaces(type, () => this.getPlacesCallback())
  }

  renderSearchResultsList() {
    console.log('in show_flat, renderSearchResultsList, placesResults: ', this.state);
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
      console.log('in show_flat, renderSearchResultsList, map: ', place.name);
      return <li className="map-interaction-search-result"><i className="fa fa-chevron-right"></i>  {place.name}</li>
    });
  }

  renderMapInteractiion() {
    // reference https://developers.google.com/places/web-service/supported_types
    return (
      <div className="map-interaction-container">
        <div className="map-interaction-box">
          <div className="map-interaction-title"><i className="fa fa-question-circle"></i>  Search for Nearest</div>
          <div value="school"className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Schools</div>
          <div value="convenience_store" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Convenient Stores</div>
          <div value="supermarket" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Supermarkets</div>
          <div value="train_station" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Train Stations</div>
          <div value="subway_station" className="map-interaction-search-criterion" onClick={this.handleSearchCriterionClick.bind(this)}>Subway Stations</div>
          <select id="typeSelection" onChange={this.handleSearchTypeSelect.bind(this)}>
            {this.renderSearchSelection()}
          </select>
          <input id="map-interaction-input" className="map-interaction-input-area" type="string" maxLength="50" placeholder="Enter place name or address..." />
          <button className="btn btn-primary btn-sm interaction-btn" onClick={this.handlePlaceSearchClick.bind(this)}>Search</button>
        </div>
        <div className="map-interaction-box">
          <div className="map-interaction-title"><i className="fa fa-chevron-circle-right"></i>  Top Search Results</div>
          <ul>
            {this.renderSearchResultsList()}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    // if (this.props.selectedDates) {
    // }
    return (
      <div>
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
          {this.currentUserIsOwner() ? <h4>This is your flat! <br/>Block out dates, edit or delete listing.</h4> : <h4>Send the Owner a Message</h4>}
          {this.renderMessaging()}
        </div>
        <div>
          {this.renderButton()}
        </div>
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
    noConversation: state.conversation.noConversation
    // conversation: state.conversation.createMessage
  };
}

export default connect(mapStateToProps, actions)(ShowFlat);
