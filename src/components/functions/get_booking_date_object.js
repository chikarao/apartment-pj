import React from 'react';
import _ from 'lodash';

export default (booking) => {
// function getBookingDateObject(booking) {
  // console.log('in functions getBookingDateObject, booking: ', booking);
  const bookingEndArray = booking.date_end.split('-')
  const bookingStartArray = booking.date_start.split('-')
  const to_year = bookingEndArray[0];
  const to_month = bookingEndArray[1];
  const to_day = bookingEndArray[2];
  const from_year = bookingStartArray[0];
  const from_month = bookingStartArray[1];
  const from_day = bookingStartArray[2];
  // console.log('in get_initialvalues_object-fixed-term-contract, getBookingDateObject, bookingEndArray: ', bookingEndArray);
  const object = { to_year, to_month, to_day, from_year, from_month, from_day }
  // console.log('in get_initialvalues_object-fixed-term-contract, getBookingDateObject, object: ', object);
  return object;
}
