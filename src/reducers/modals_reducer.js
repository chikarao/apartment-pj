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
  SHOW_BUILDING_CREATE_MODAL,
  SHOW_BANK_ACCOUNT_EDIT_MODAL,
  SHOW_BANK_ACCOUNT_CREATE_MODAL,
  SHOW_FACILITY_EDIT_MODAL,
  SHOW_FACILITY_CREATE_MODAL,
  SHOW_INSPECTION_CREATE_MODAL,
  SHOW_INSPECTION_EDIT_MODAL,
  SHOW_CONTRACTOR_CREATE_MODAL,
  SHOW_CONTRACTOR_EDIT_MODAL,
  SHOW_STAFF_CREATE_MODAL,
  SHOW_STAFF_EDIT_MODAL,
  SELECTED_STAFF_ID,
  SELECTED_CONTRACTOR_ID,
  CONTRACTOR_TO_EDIT_ID,
  STAFF_TO_EDIT_ID,
  PROFILE_TO_EDIT_ID,
  ADD_NEW_CONTRACTOR,
  ADD_NEW_STAFF,
  SHOW_PROFILE_EDIT_MODAL,
  SHOW_PROFILE_CREATE_MODAL,
  SELECTED_PROFILE_ID
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
    showBuildingEditModal: false,
    showFacilityEditModal: false,
    showFacilityCreateModal: false,
    showInspectionCreateModal: false,
    showInspectionEditModal: false,
    selectedContractorId: '',
    selectedProfileId: '',
    contractorToEditId: '',
    addNewContractor: false,
    addNewStaff: false,
    profileToEditId: ''
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

    case SHOW_BANK_ACCOUNT_EDIT_MODAL:
      return { ...state, showBankAccountEditModal: !state.showBankAccountEditModal };

    case SHOW_BANK_ACCOUNT_CREATE_MODAL:
      return { ...state, showBankAccountCreateModal: !state.showBankAccountCreateModal };

    case SHOW_FACILITY_CREATE_MODAL:
      return { ...state, showFacilityCreateModal: !state.showFacilityCreateModal };

    case SHOW_FACILITY_EDIT_MODAL:
      return { ...state, showFacilityEditModal: !state.showFacilityEditModal };

    case SHOW_INSPECTION_CREATE_MODAL:
      return { ...state, showInspectionCreateModal: !state.showInspectionCreateModal };

    case SHOW_INSPECTION_EDIT_MODAL:
      return { ...state, showInspectionEditModal: !state.showInspectionEditModal };

    case SHOW_CONTRACTOR_CREATE_MODAL:
      return { ...state, showContractorCreateModal: !state.showContractorCreateModal };

    case SHOW_CONTRACTOR_EDIT_MODAL:
      return { ...state, showContractorEditModal: !state.showContractorEditModal };

    case SHOW_STAFF_CREATE_MODAL:
      return { ...state, showStaffCreateModal: !state.showStaffCreateModal };

    case SHOW_STAFF_EDIT_MODAL:
      return { ...state, showStaffEditModal: !state.showStaffEditModal };

    case SELECTED_CONTRACTOR_ID:
    return { ...state, selectedContractorId: action.payload };

    case CONTRACTOR_TO_EDIT_ID:
    return { ...state, contractorToEditId: action.payload };

    case STAFF_TO_EDIT_ID:
    return { ...state, staffToEditId: action.payload };

    case PROFILE_TO_EDIT_ID:
    return { ...state, profileToEditId: action.payload };

    case SELECTED_STAFF_ID:
    return { ...state, selectedStaffId: action.payload };

    case SELECTED_PROFILE_ID:
    return { ...state, selectedProfileId: action.payload };

    case ADD_NEW_CONTRACTOR:
    return { ...state, addNewContractor: !state.addNewContractor };

    case ADD_NEW_STAFF:
    return { ...state, addNewStaff: !state.addNewStaff };

    case SHOW_PROFILE_EDIT_MODAL:
      return { ...state, showProfileEditModal: !state.showProfileEditModal };

    case SHOW_PROFILE_CREATE_MODAL:
      return { ...state, showProfileCreateModal: !state.showProfileCreateModal };


    default:
      return state;
  }// switch
} // function
