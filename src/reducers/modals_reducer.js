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
  SELECTED_PROFILE_ID,
  SHOW_BUILDING_LANGUAGE_CREATE_MODAL,
  SHOW_BUILDING_LANGUAGE_EDIT_MODAL,
  SELECTED_BUILDING_LANGUAGE_ID,
  SELECTED_BUILDING_ID,
  BUILDING_LANGUAGE_TO_EDIT_ID,
  SHOW_DOCUMENT_INSERT_CREATE_MODAL,
  SHOW_DOCUMENT_INSERT_EDIT_MODAL,
  SHOW_INSERT_FIELD_CREATE_MODAL,
  SHOW_INSERT_FIELD_EDIT_MODAL,
  SELECTED_DOCUMENT_INSERT_ID,
  SELECTED_INSERT_FIELD_ID,
  SELECTED_AGREEMENT_ID,
  INSERT_FIELD_TO_EDIT_ID
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
    profileToEditId: '',
    buildingLanguageToEditId: '',
    selectedBuildingId: '',
    selectedBuildingLanguageId: '',
    showBuildingLanguageCreateModal: false,
    showBuildingLanguageEditModal: false,
    selectedAgreementId: '',
    selectedDocumentInsertId: '',
    selectedInsertFieldId: '',
    showInsertFieldCreateModal: false,
    showInsertFieldEditModal: false,
    showDocumentInsertCreateModal: false,
    showDocumentInsertEditModal: false,
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

    case BUILDING_LANGUAGE_TO_EDIT_ID:
    return { ...state, buildingLanguageToEditId: action.payload };

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

    case SHOW_BUILDING_LANGUAGE_CREATE_MODAL:
      return { ...state, showBuildingLanguageCreateModal: !state.showBuildingLanguageCreateModal };

    case SHOW_BUILDING_LANGUAGE_EDIT_MODAL:
      return { ...state, showBuildingLanguageEditModal: !state.showBuildingLanguageEditModal };

    case SELECTED_BUILDING_LANGUAGE_ID:
      return { ...state, selectedBuildingLanguageId: action.payload };

    case SELECTED_BUILDING_ID:
      return { ...state, selectedBuildingId: action.payload };

    case SHOW_DOCUMENT_INSERT_CREATE_MODAL:
    return { ...state, showDocumentInsertCreateModal: !state.showDocumentInsertCreateModal };

    case SHOW_DOCUMENT_INSERT_EDIT_MODAL:
    return { ...state, showDocumentInsertEditModal: !state.showDocumentInsertEditModal };

    case SHOW_INSERT_FIELD_CREATE_MODAL:
    return { ...state, showInsertFieldCreateModal: !state.showInsertFieldCreateModal };

    case SHOW_INSERT_FIELD_EDIT_MODAL:
    return { ...state, showInsertFieldEditModal: !state.showInsertFieldEditModal };

    case SELECTED_DOCUMENT_INSERT_ID:
    return { ...state, selectedDocumentInsertId: action.payload };

    case SELECTED_INSERT_FIELD_ID:
    return { ...state, selectedInsertFieldId: action.payload };

    case SELECTED_AGREEMENT_ID:
    return { ...state, selectedAgreementId: action.payload };

    case INSERT_FIELD_TO_EDIT_ID:
    return { ...state, insertFieldToEditId: action.payload };

    default:
      return state;
  }// switch
} // function
