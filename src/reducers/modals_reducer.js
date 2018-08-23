import _ from 'lodash';
import { SHOW_EDIT_REVIEW_MODAL, SHOW_CARD_INPUT_MODAL, SHOW_LANGUAGE_CREATE_MODAL } from '../actions/types';
//
// const initialState = {
//   : 0
// };

export default function (
  state = {
    showEditReview: false,
    showCardInputModal: false,
    showLanguageCreateModal: false }, action) {
  console.log('in image count reducer, state.count:', state);

  switch (action.type) {
    case SHOW_EDIT_REVIEW_MODAL:
      return { ...state, showEditReview: !state.showEditReview };

    case SHOW_CARD_INPUT_MODAL:
      return { ...state, showCardInputModal: !state.showCardInputModal };

    case SHOW_LANGUAGE_CREATE_MODAL:
      return { ...state, showLanguageCreateModal: !state.showLanguageCreateModal };

    default:
      return state;
  }// switch
} // function
