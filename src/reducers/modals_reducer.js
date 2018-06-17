import _ from 'lodash';
import { SHOW_EDIT_REVIEW_MODAL } from '../actions/types';
//
// const initialState = {
//   : 0
// };

export default function (state = { showEditReview: false }, action) {
  console.log('in image count reducer, state.count:', state);

  switch (action.type) {
    //CREATE_LIKE is an object
    case SHOW_EDIT_REVIEW_MODAL:
      return { ...state, showEditReview: !state.showEditReview };
    // LIKES_BY_USER is an object of objects
    default:
      return state;
  }
}
