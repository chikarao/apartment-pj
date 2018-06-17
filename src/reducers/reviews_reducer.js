import _ from 'lodash';
import { CREATE_REVIEW, FETCH_REVIEW_FOR_BOOKING_BY_USER, UPDATE_REVIEW } from '../actions/types';
//
// const initialState = {
//   : 0
// };

export default function (state = {}, action) {
  console.log('in image count reducer, state.count:', state);

  switch (action.type) {
    //CREATE_LIKE is an object
    case CREATE_REVIEW:
      return { ...state, createdReview: action.payload };
    // LIKES_BY_USER is an object of objects
    case FETCH_REVIEW_FOR_BOOKING_BY_USER:
      return { ...state, reviewForBookingByUser: action.payload[0] };

    case UPDATE_REVIEW:
      return { ...state, reviewForBookingByUser: action.payload };

    default:
      return state;
  }
}
