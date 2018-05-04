import React, { Component } from 'react';
import { connect } from 'react-redux';

class BookingConfirmation extends Component {
    renderBookingData() {
      if (this.props.flat && this.props.bookingData) {
        return (
          <div>
            <h2>
              Thank you for booking with us!
            </h2>
            <h3>
              You can manage your bookings in My Page.
            </h3>
            <div className="booking-confirmation">
              <div>
                Description: {this.props.flat.description}
              </div>
              <div>
                Area: {this.props.flat.area}
              </div>
              <div>
                Beds: {this.props.flat.beds}
              </div>
              <div>
                Booking start: {this.props.bookingData.date_start}
              </div>
              <div>
                Booking end: {this.props.bookingData.date_end}
              </div>
            </div>
          </div>
        );
      }
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
    bookingData: state.bookingData.bookingData,
    flat: state.flat.selectedFlat
  };
}

export default connect(mapStateToProps)(BookingConfirmation);
