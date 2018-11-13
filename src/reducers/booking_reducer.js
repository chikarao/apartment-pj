import _ from 'lodash';
import {
  SELECTED_DATES,
  REQUEST_BOOKING,
  FETCH_BOOKING,
  FETCH_BOOKINGS_BY_USER,
  FETCH_ICAL,
  REQUIRED_FIELDS,
  BOOKING_REQUEST_DATA,
  EDIT_BOOKING
  // SELECTED_ICALENDAR_ID
} from '../actions/types';

export default function (state = {
  selectedBookingDates: { to: null, from: null },
  requiredFields: [],
  bookingRequest: {}
}, action) {
  // console.log('in booking reducer, action.payload: ', action.payload);

  switch (action.type) {

    case SELECTED_DATES:
      // console.log('in booking reducer, state: ', state);
      return { ...state, selectedBookingDates: action.payload };

    case REQUEST_BOOKING:
      // console.log('in booking reducer, state: ', state);
      return { ...state, bookingData: action.payload.booking };

    case FETCH_BOOKING:
      // console.log('in booking reducer, state: ', state);
      return { ...state, fetchBookingData: action.payload.booking, user: action.payload.user, flat: action.payload.flat, contracts: action.payload.contracts, assignments: action.payload.assignments };

    case FETCH_BOOKINGS_BY_USER:
      console.log('in booking reducer, FETCH_BOOKINGS_BY_USER, action.payload: ', action.payload);
      // return _.mapKeys(action.payload, 'id');
        // return _.mapKeys(action.payload, 'id');
      return { ...state, fetchBookingsByUserData: _.mapKeys(action.payload, 'id') };

    case FETCH_ICAL:
    // console.log('in booking reducer, state: ', state);
    return { ...state, fetchedIcal: action.payload };

    case REQUIRED_FIELDS:
    // console.log('in booking reducer, state: ', state);
    return { ...state, requiredFields: action.payload };

    case BOOKING_REQUEST_DATA:
    // console.log('in booking reducer, state: ', state);
    return { ...state, bookingRequestData: action.payload };

    case EDIT_BOOKING:
    // console.log('in booking reducer, state: ', state);
    return { ...state, fetchBookingData: action.payload };

    // case SELECTED_ICALENDAR_ID:
    // // console.log('in booking reducer, state: ', state);
    // return { ...state, selectedIcalendarId: action.payload };

    default:
      return state;
  }
}
