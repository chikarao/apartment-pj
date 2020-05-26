import React from 'react';
import _ from 'lodash';

export default (booking) => {
// function getBookingDateObject(booking) {
  // console.log('in functions getBookingDateObject, booking: ', booking);
  // Below code brought for dateFrom in from getContractLength
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

  //==========================
  // Notice; brought in from get_initialvalues_object
  // !!!!!need to have one year test
  let noticeObject = {}
  if (years > 1) {
    const dateEndOneYear = new Date(booking.date_end);
    const dateEndSixMonths = new Date(booking.date_end);
    // console.log('in get_initialvalues_object-fixed-term-contract, getContractEndNoticePeriodObject, dateEnd: ', dateEnd);
    const oneYearBefore = new Date(dateEndOneYear.setFullYear(dateEndOneYear.getFullYear() - 1));
    const sixMonthsBefore = new Date(dateEndSixMonths.setMonth(dateEndSixMonths.getMonth() - 6));
    const oneYearBeforeDay = oneYearBefore.getDate() == (0 || 1) ? 30 : oneYearBefore.getDate() - 1;
    const sixMonthsBeforeDay = sixMonthsBefore.getDate() == (0 || 1) ? 30 : sixMonthsBefore.getDate() - 1;
    const oneYearBeforeMonth = oneYearBefore.getDate() == (0 || 1) ? oneYearBefore.getMonth() : oneYearBefore.getMonth() + 1;
    const sixMonthsBeforeMonth = sixMonthsBefore.getDate() == (0 || 1) ? sixMonthsBefore.getMonth() : sixMonthsBefore.getMonth() + 1;
    noticeObject = { notice_from_year: oneYearBefore.getFullYear(), notice_from_month: oneYearBeforeMonth, notice_from_day: oneYearBeforeDay, notice_to_year: sixMonthsBefore.getFullYear(), notice_to_month: sixMonthsBeforeMonth, notice_to_day: sixMonthsBeforeDay }
  } else {
    noticeObject = { notice_from_year: 0, notice_from_month: 0, notice_from_day: 0, notice_to_year: 0, notice_to_month: 0, notice_to_day: 0 }
  }
  //==========================

  // console.log('in get_initialvalues_object-fixed-term-contract, getContractLength, months, years: ', months, years);
  // const object = { months, years };

  const bookingEndArray = booking.date_end.split('-')
  const bookingStartArray = booking.date_start.split('-')
  const to_year = bookingEndArray[0];
  const to_month = bookingEndArray[1];
  const to_day = bookingEndArray[2];
  const from_year = bookingStartArray[0];
  const from_month = bookingStartArray[1];
  const from_day = bookingStartArray[2];

  const date_prepared = new Date();
  // console.log('in get_initialvalues_object-fixed-term-contract, getBookingDateObject, bookingEndArray: ', bookingEndArray);
  const object = { to_year, to_month, to_day, from_year, from_month, from_day, contract_length_months: months, contract_length_years: years, noticeObject, date_prepared }
  // console.log('in get_initialvalues_object-fixed-term-contract, getBookingDateObject, object: ', object);
  return object;
}
