import React from 'react';
import _ from 'lodash';

export default (booking) => {
// function getContractLength(booking) {
  // console.log('in get_initialvalues_object-fixed-term-contract, getContractLength, booking: ', booking);
  const dateFrom = new Date(booking.date_start);
  const dateTo = new Date(booking.date_end);
  const difference = Math.floor(dateTo - dateFrom);
  const day = 1000 * 60 * 60 * 24;
  const days = Math.floor(difference / day);
  const months = days / 30;
  let years = months / 12;
  if (years < 1) {
    years = '';
  } else if (years > 1 && years < 2) {
    years = 1;
  } else if (years >   2 && years < 3) {
    years = 2;
  }
  // console.log('in get_initialvalues_object-fixed-term-contract, getContractLength, months, years: ', months, years);
  const object = { months, years };
  // console.log('in get_initialvalues_object-fixed-term-contract, getContractLength, object: ', object);
  return object;
}
