import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';


class BookingConfirmation extends Component {
  componentDidMount() {
    // gets flat id from params set in click of main_cards or infowindow detail click
    this.props.fetchBooking(this.props.match.params.id);
    console.log('in booking confirmation, getting params, this.props.match.params.id: ', this.props.match.params.id);
  }

    componentWillUnmount() {
      console.log('in booking confirmation, componentWillUnmount');
    }

    renderBookingData() {
      if (this.props.bookingData) {
        // const data = this.props.bookingData.id;
        // localStorage.setItem('data', data);
        // const localData = localStorage.getItem('data');
        // console.log('in booking confirmation, renderBookingData, localstorage data: ', localData);

        return (
          <div>
            <h2>
              Thank you for your booking!
            </h2>
            <h3>
              You can manage your bookings in My Page.
            </h3>
            <div className="booking-confirmation">
              <div>
                Description: {this.props.bookingData.flat.description}
              </div>
              <div>
                Area: {this.props.bookingData.flat.area}
              </div>
              <div>
                Beds: {this.props.bookingData.flat.beds}
              </div>
              <div>
                Booking start: {this.props.bookingData.date_start}
              </div>
              <div>
                Booking end: {this.props.bookingData.date_end}
              </div>
              <div>
                Booking ID: {this.props.bookingData.id}
              </div>
            </div>
          </div>
        );
      }
      // } else {
      //   const data = localStorage.getItem('data')
      //   return (
      //     <div>
      //     <h2>
      //     Thank you for booking with us!
      //     </h2>
      //     <h3>
      //     You can manage your bookings in My Page.
      //     </h3>
      //     <div className="booking-confirmation">
      //     <div>
      //     Description: {data.flat.description}
      //     </div>
      //     <div>
      //     Area: {data.flat.area}
      //     </div>
      //     <div>
      //     Beds: {data.flat.beds}
      //     </div>
      //     <div>
      //     Booking start: {data.bookingData.date_start}
      //     </div>
      //     <div>
      //     Booking end: {data.bookingData.date_end}
      //     </div>
      //     </div>
      //     </div>
      //
      //   );
      // }
  }
    // renderBookingData() {
    //   if (this.props.flat && this.props.bookingData) {
    //     return (
    //       <div>
    //         Booking Data
    //       </div>
    //     );
    //   }
    // }
  render() {
    return (
      <div>
        {this.renderBookingData()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in booking confirmation, mapStateToProps, state: ', state);
  return {
    bookingData: state.bookingData.fetchBookingData
    // flat: state.flat.selectedFlat
  };
}

export default connect(mapStateToProps, actions)(BookingConfirmation);
