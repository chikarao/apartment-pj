import _ from 'lodash';
import {
  CREATE_REVIEW,
  FETCH_REVIEW_FOR_BOOKING_BY_USER,
  UPDATE_REVIEW,
  FETCH_REVIEWS_FOR_FLAT
} from '../actions/types';

export default function (state = {}, action) {
  // console.log('in image count reducer, state.count:', state);

  switch (action.type) {
    //CREATE_LIKE is an object
    case CREATE_REVIEW:
      return { ...state, reviewForBookingByUser: action.payload };

    case FETCH_REVIEW_FOR_BOOKING_BY_USER:
      const reviewsEmpty = _.isEmpty(action.payload);
      if (!reviewsEmpty) {
        return { ...state, reviewForBookingByUser: action.payload[0] };
      } else {
        return { ...state, reviewForBookingByUser: [] };
      }

    case FETCH_REVIEWS_FOR_FLAT:
      return _.mapKeys(action.payload, 'id');

    case UPDATE_REVIEW:
      return { ...state, reviewForBookingByUser: action.payload };

    default:
      return state;
  }
}
