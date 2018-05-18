import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';

import * as actions from '../actions';


class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortByDate: false
    };
  }
  componentDidMount() {
    this.props.getCurrentUserForMyPage((id) => this.fetchData(id));
    // if (this.props.flat) {
    //   console.log('in edit flat, componentDidMount, editFlatLoad called');
    //   this.props.editFlatLoad(this.props.flat);
    // }
    // this.props.fetchUserFlats(this.props.auth.id);
  }

  fetchData(id) {
    //callback from getCurrentUserForMyPageid
    console.log('in mypage, fetchData, this.props.auth.id: ', this.props.auth.id);
    console.log('in mypage, fetchData, callback from getCurrentUserForMyPageid: ', id);
    this.props.fetchFlatsByUser(id);
    this.props.fetchBookingsByUser(id);
  }

  renderEachBookingByUser() {
    console.log('in mypage, renderEachBookingByUser, this.props.bookingsByUser: ', this.props.bookingsByUser);
    // const { bookingsByUser } = this.props;
    const bookingsByUserEmpty = _.isEmpty(this.props.bookingsByUser);
    const { bookingsByUser } = this.props;
    // sort by date_start
    const sortedBookingsByUser = this.sortBookings(bookingsByUser);

    if (!bookingsByUserEmpty) {
      console.log('in mypage, renderEachBookingByUser, after if empty check, bookingsByUser: ', bookingsByUser);
      return _.map(sortedBookingsByUser, (booking, index) => {
        console.log('in mypage, renderEachBookingByUser, in map, booking: ', booking);
        return (
          <li key={index} className="my-page-each-card">
            <div value={booking.id} className="my-page-each-card-click-box" onClick={this.handleFlatCardClick.bind(this)}>
              <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + booking.flat.images[0].publicid + '.jpg'} />
              <div className="my-page-details">
                <ul>
                  <li>{booking.flat.description}</li>
                  <li>check in: {booking.date_start}</li>
                  <li>check out: {booking.date_end}</li>
                  <li>booking id: {booking.id}</li>
                  <li>flat id: {booking.flat.id}</li>
                </ul>
              </div>
            </div>
            <div className="my-page-card-button-box">
            <button className="btn btn-danger btn-sm">Delete</button>
            </div>
          </li>
        );
      });
      //end of map
    }
    //end of if
  }

  renderBookings() {
    console.log('in mypage, renderBookings, this.props.bookingsByUser: ', this.props.bookingsByUser);
      return (
        <div>
          <div className="my-page-category-title">Bookings</div>
          <ul>
            {this.renderEachBookingByUser()}
          </ul>
        </div>
      );
    }

  handleFlatCardClick(event) {
    console.log('in mypage, handleFlatCardClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in mypage, handleFlatCardClick, clicked, elementVal: ', elementVal);
    this.props.history.push(`/show/${elementVal}`);
  }

  handleBookingCardClick(event) {
    console.log('in mypage, handleFlatCardClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in mypage, handleFlatCardClick, clicked, elementVal: ', elementVal);
    this.props.history.push(`/bookingconfirmation/${elementVal}`);
  }

  renderEachFlat() {
    // const { flats } = this.props;
    const flatsEmpty = _.isEmpty(this.props.flats);
    if (!flatsEmpty) {
      const { flats } = this.props;
      console.log('in mypage, renderEachFlat, flats: ', flats);
      return _.map(flats, (flat, index) => {
        console.log('in mypage, renderEachFlat, flat.id: ', flat.id);
        console.log('in mypage, renderEachFlat, flat.desription: ', flat.description);
        return (
          <li key={index} className="my-page-each-card">
            <div value={flat.id} className="my-page-each-card-click-box" onClick={this.handleFlatCardClick.bind(this)}>
              <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + flat.images[0].publicid + '.jpg'} />
              <div className="my-page-details">
                <ul>
                  <li>{flat.description}</li>
                  <li>{flat.area}</li>
                  <li>${parseFloat(flat.price_per_month).toFixed(0)}</li>
                  <li>id: {flat.id}</li>
                </ul>

              </div>
            </div>
            <div className="my-page-card-button-box">
              <button className="btn btn-danger btn-sm">Delete</button>
              <button className="btn btn-sm btn-edit">Edit</button>
            </div>
          </li>
        );
      });
    }
  }

  renderFlats() {
    return (
      <div>
        <div className="my-page-category-title">Flats</div>
        <ul>
        {this.renderEachFlat()}
        </ul>
      </div>
    );
  }

  renderOwnBookings() {
    return (
      <div>
        <div className="my-page-category-title">Bookings for Your Flats</div>
        <ul>
        {this.renderEachOwnBookings()}
        </ul>
      </div>
    );
  }

  sortBookings(bookings) {
    //reference: https://stackoverflow.com/questions/10123953/sort-javascript-object-array-by-date
    console.log('in mypage, sortBookings, bookings: ', bookings);
    let bookingsArray = [];
    // push each object into array then sort
    _.each(bookings, (booking) => {
      bookingsArray.push(booking);
      console.log('in mypage, sortBookings, in each, bookingsArray: ', bookingsArray);
    });

    const sortedBookingsArray = bookingsArray.sort((a, b) => {
      // console.log('in mypage, sortBookings, in each, in sortedBookingsArray, new Date(a.date_start): ', new Date(a.date_start));
      // console.log('in mypage, sortBookings, in each, in sortedBookingsArray, new Date(b.date_start): ', new Date(b.date_start));
      return new Date(a.date_start) - new Date(b.date_start);
    });
    // put sorted array into object format that the app has been using
    console.log('in mypage, sortBookings, in each, sortedBookingsArray: ', sortedBookingsArray);
    const bookingsList = {};
    _.each(sortedBookingsArray, (booking, index) => {
      bookingsList[index] = { id: booking.id, user_id: booking.user_id, date_start: booking.date_start, date_end: booking.date_end, flat: booking.flat }
    });
    console.log('in mypage, sortBookings, in each, bookingsList: ', bookingsList);

    return bookingsList;
  }

  renderEachOwnBookings() {
    // takes flats with bookings and creates object with bookings then flat
    const preSortBookings = this.createBookingObject();
    // sorts preSortBookings by date_start
    const bookings = this.sortBookings(preSortBookings);

    // const bookings = this.createBookingObject((b) => this.sortBookings(b));
    // const sortedBookings = this.sortBookings(bookings);
    console.log('in mypage, renderEachOwnBookings, bookings, h: ', bookings);

        return _.map(bookings, (booking, index) => {
          console.log('in mypage, renderOwnBookings, in each, booking: ', booking);
          const flat = booking.flat;
          console.log('in mypage, renderOwnBookings, in each, flat: ', flat);

            return (
              <li key={index} className="my-page-each-card">
                <div value={flat.id} className="my-page-each-card-click-box" onClick={this.handleBookingCardClick.bind(this)}>
                  <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + flat.images[0].publicid + '.jpg'} />
                  <div className="my-page-details">
                    <ul>
                      <li>{flat.description}</li>
                      <li>check in: {booking.date_start}</li>
                      <li>check out: {booking.date_end}</li>
                      <li>booking id: {booking.id}</li>
                      <li>flat id: {flat.id}</li>
                    </ul>

                  </div>
                </div>
                <div className="my-page-card-button-box">
                  <button className="btn btn-danger btn-sm">Delete</button>
                </div>
              </li>
            );
            // end of return
          // });
          // end of second each
        });
        //end of first each
      // }
  }

  createBookingObject() {
    //reference: https://stackoverflow.com/questions/14234646/adding-elements-to-object
      const { flats } = this.props;
      const flatsEmpty = _.isEmpty(flats);
      // let bookingsObj = {};
      console.log('in mypage, renderOwnBookings, this.props.flats.bookings: ', this.props.flats);
      const bookingsList = {}
      if (!flatsEmpty) {
         _.map(flats, (flat) => {
          console.log('in mypage, renderOwnBookings, in each, flat: ', flat);
          const bookings = flat.bookings;
           _.map(bookings, (booking, index) => {
            console.log('in mypage, renderOwnBookings, in second each, booking: ', booking);
            console.log('in mypage, renderOwnBookings, in second each, flat: ', flat);

            bookingsList[booking.id] = { id: booking.id, user_id: booking.user_id, date_start: booking.date_start, date_end: booking.date_end, flat }
            console.log('in mypage, renderOwnBookings, bookingsList: ', bookingsList);

          });
          // end of second each
        });
        //end of first each
        // callback(bookingsList);
        return bookingsList;
      }
  }

  render() {
    return (
      <div>
        <h2>My Page</h2>
        <div className="container my-page-container">
          <div className="row">
            <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderBookings()}</div>
            <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderFlats()}</div>
            <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderOwnBookings()}</div>
        </div>
        </div>
        <Link to="/createflat" className="btn-create-flat"><button className="btn btn-primary btn-lg btn-create-flat">List a New Flat!</button></Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in mypage, mapStateToProps, state: ', state);
  return {
    flat: state.selectedFlatFromParams.selectedFlat,
    flats: state.flats,
    selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    bookingsByUser: state.fetchBookingsByUserData.fetchBookingsByUserData,
    auth: state.auth,
  };
}

export default connect(mapStateToProps, actions)(MyPage);
