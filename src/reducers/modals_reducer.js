import _ from 'lodash';
import { SHOW_EDIT_REVIEW_MODAL, SHOW_CARD_INPUT_MODAL } from '../actions/types';
//
// const initialState = {
//   : 0
// };

export default function (state = { showEditReview: false, showCardInputModal: false }, action) {
  console.log('in image count reducer, state.count:', state);

  switch (action.type) {
    case SHOW_EDIT_REVIEW_MODAL:
      return { ...state, showEditReview: !state.showEditReview };

    case SHOW_CARD_INPUT_MODAL:
      return { ...state, showCardInputModal: !state.showCardInputModal };

    default:
      return state;
  }
}
