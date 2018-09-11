import _ from 'lodash';
import {
  SELECTED_DATES,
  REQUEST_BOOKING,
  FETCH_BOOKING,
  FETCH_BOOKINGS_BY_USER,
  FETCH_ICAL
} from '../actions/types';

export default function (state = {
  selectedBookingDates: { to: null, from: null }
}, action) {
  console.log('in booking reducer, action.payload: ', action.payload);

  switch (action.type) {

    case SELECTED_DATES:
      // console.log('in booking reducer, state: ', state);
      return { ...state, selectedBookingDates: action.payload };

    case REQUEST_BOOKING:
      // console.log('in booking reducer, state: ', state);
      return { ...state, bookingData: action.payload };

    case FETCH_BOOKING:
      // console.log('in booking reducer, state: ', state);
      return { ...state, fetchBookingData: action.payload };

    case FETCH_BOOKINGS_BY_USER:
      console.log('in booking reducer, FETCH_BOOKINGS_BY_USER, action.payload: ', action.payload);
      // return _.mapKeys(action.payload, 'id');
        // return _.mapKeys(action.payload, 'id');
      return { ...state, fetchBookingsByUserData: _.mapKeys(action.payload, 'id') };
    case FETCH_ICAL:
    // console.log('in booking reducer, state: ', state);
    return { ...state, fetchedIcal: action.payload };

    default:
      return state;
  }
}
