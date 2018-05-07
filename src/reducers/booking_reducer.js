// import _ from 'lodash';
import { SELECTED_DATES, REQUEST_BOOKING, FETCH_BOOKING } from '../actions/types';

export default function (state = {}, action) {
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

    default:
      return state;
  }
}
