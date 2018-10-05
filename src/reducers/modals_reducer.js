import _ from 'lodash';
import {
  SHOW_EDIT_REVIEW_MODAL,
  SHOW_CARD_INPUT_MODAL,
  SHOW_LANGUAGE_CREATE_MODAL,
  SHOW_LANGUAGE_EDIT_MODAL,
  SHOW_ICALENDAR_CREATE_MODAL,
  SHOW_ICALENDAR_EDIT_MODAL,
  SELECTED_ICALENDAR_ID,
  SHOW_BUILDING_EDIT_MODAL,
  SHOW_BUILDING_CREATE_MODAL
} from '../actions/types';
//
// const initialState = {
//   : 0
// };

export default function (
  state = {
    showEditReview: false,
    showCardInputModal: false,
    showLanguageCreateModal: false,
    showIcalendarCreateModal: false,
    showIcalendarEditModal: false,
    showBuildingCreateModal: false,
    showBuildingEditModal: false
  }, action) {
  // console.log('in image count reducer, state.count:', state);

  switch (action.type) {
    case SHOW_EDIT_REVIEW_MODAL:
      return { ...state, showEditReview: !state.showEditReview };

    case SHOW_CARD_INPUT_MODAL:
      return { ...state, showCardInputModal: !state.showCardInputModal };

    case SHOW_LANGUAGE_CREATE_MODAL:
      return { ...state, showLanguageCreateModal: !state.showLanguageCreateModal };

    case SHOW_LANGUAGE_EDIT_MODAL:
      return { ...state, showLanguageEditModal: !state.showLanguageEditModal };

    case SHOW_ICALENDAR_CREATE_MODAL:
      return { ...state, showIcalendarCreateModal: !state.showIcalendarCreateModal };

    case SHOW_ICALENDAR_EDIT_MODAL:
      return { ...state, showIcalendarEditModal: !state.showIcalendarEditModal };

    case SELECTED_ICALENDAR_ID:
    // console.log('in booking reducer, state: ', state);
    return { ...state, selectedIcalendarId: action.payload };

    case SHOW_BUILDING_EDIT_MODAL:
      return { ...state, showBuildingEditModal: !state.showBuildingEditModal };

    case SHOW_BUILDING_CREATE_MODAL:
      return { ...state, showBuildingCreateModal: !state.showBuildingCreateModal };


    default:
      return state;
  }// switch
} // function
