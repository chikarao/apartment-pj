import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';

import * as actions from '../actions';
import Carousel from './carousel/carousel';

import DatePicker from './date_picker/date_picker';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });


class ShowFlat extends Component {
  componentDidMount() {
    this.props.selectedFlatFromParams(this.props.match.params.id);
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
        const { description, area, price_per_month, images } = this.props.flat;
        console.log('in show_flat renderFlat, renderImages: ', renderImages(images));
        return (
          <div>
            <div className="show-flat-image-box">
              <div id="carousel-show">
                {renderImages(images)}
              </div>
            </div>
            <div className="show-container">
              <div>
                { description }
              </div>

              <div>
                { area }
              </div>

              <div>
                ${ parseFloat(price_per_month).toFixed(0) } per month
              </div>
              <div>
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

      this.props.requestBooking(bookingRequest);
    }
  }

  disabledDays(bookings) {
    // Note that new disabledDays does not include the after and before daysr!!!!!!!!!!!!!!!!!!!!!!!
    let daysList = [];
    console.log('in show_flat, disabledDays, days from ', this.props.flat.bookings[0].date_start);
    console.log('in show_flat, disabledDays, days from ', this.props.flat.bookings[0].date_end);

    _.each(bookings, (booking) => {
      console.log('in show_flat, disabledDays, in _.each, booking: ', booking);
      console.log('in show_flat, disabledDays, in _.each, booking.date_start: ', booking.date_start);
      const reformatStart = booking.date_start.split('-').join(', ');
      const reformatEnd = booking.date_end.split('-').join(', ');
      console.log('in show_flat, disabledDays, in _.each, reformatStart: ', reformatStart);
      console.log('in show_flat, disabledDays, in _.each, reformatEnd: ', reformatEnd);
//       function addDays(date, days) {
//   var result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// }
      // // {
      const afterDate = new Date(reformatStart);
      const beforeDate = new Date(reformatEnd);
      console.log('in show_flat, disabledDays, in _.each, afterDate before setDate: ', afterDate);
      console.log('in show_flat, disabledDays, in _.each, before Date before setDate: ', beforeDate);

      afterDate.setDate(afterDate.getDate() - 1);
      beforeDate.setDate(beforeDate.getDate() + 1);

      console.log('in show_flat, disabledDays, in _.each, afterDate after setDate: ', afterDate);
      console.log('in show_flat, disabledDays, in _.each, before Date after setDate: ', beforeDate);
      const bookingRange = { after: afterDate, before: beforeDate };
      // // const bookingRange = { after: new Date(2018, 4, 10), before: new Date(2018, 4, 18) };
      daysList.push(bookingRange);
    });

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

  render() {
    if (this.props.selectedDates) {
    }
    return (
      <div>
        <div>
          {this.renderFlat(this.props.match.params.id)}
        </div>
        {this.renderDatePicker()}
        <button onClick={this.handleBookingClick.bind(this)} className="btn btn-primary">Book Now!</button>
      </div>
    );
  }
}

function renderImages(images) {
  console.log('in show_flat renderImages, images: ', images);
  return (
    _.map(images, (image) => {
      console.log('in show_flat renderImages, image: ', image.publicid);
      return (
          <div className="slide-show">
            <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + image.publicid + '.jpg'} />
            <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + image.publicid + '.jpg'} />
          </div>
      );
    })
  );
}

function mapStateToProps(state) {
  console.log('in show_flat render, mapStateToProps, state: ', state);
  return {
    flat: state.selectedFlatFromParams.selectedFlat,
    selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    auth: state.auth
  };
}

export default connect(mapStateToProps, actions)(ShowFlat);
