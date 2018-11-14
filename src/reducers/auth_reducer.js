import {
  AUTH_USER,
  UPDATE_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  SIGNED_UP_USER,
  FETCH_MESSAGE,
  GET_CURRENT_USER,
  GET_CURRENT_USER_FOR_MY_PAGE,
  SHOW_SIGNIN_MODAL,
  SHOW_SIGNUP_MODAL,
  SHOW_AUTH_MODAL,
  SHOW_RESET_PASSWORD_MODAL,
  FETCH_PROFILE_FOR_USER,
  SHOW_EDIT_PROFILE_MODAL,
  EDIT_PROFILE,
  SHOW_LOADING,
  SHOW_LIGHTBOX,
  FETCH_CUSTOMER,
  SELECTED_CARD,
  UPDATE_CARD_INFO,
  ACTION_TYPE_CARD,
  DELETE_CARD,
  ADD_CARD,
  UPDATE_CUSTOMER,
  MAKE_PAYMENT,
  FETCH_BANK_ACCOUNTS_BY_USER,
  CREATE_BANK_ACCOUNT,
  UPDATE_BANK_ACCOUNT,
  SELECTED_BANK_ACCOUNT_ID,
  UPDATE_CONTRACTOR,
  CREATE_CONTRACTOR,
  DELETE_CONTRACTOR,
  UPDATE_STAFF,
  CREATE_STAFF,
  DELETE_STAFF
 } from '../actions/types';

export default function (state = {
  showAuthModal: false,
  showSigninModal: false,
  showSignupModal: false,
  showResetPasswordModal: false,
  showLoading: false,
  authenticated: false,
  existingUser: false,
  customer: {},
  bankAccounts: []
}, action) {
  // console.log('in auth reducer, action: ', action);
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        error: '',
        authenticated: true,
        email: action.payload.email,
        id: action.payload.id,
        image: action.payload.image,
        customerId: action.payload.customerId,
        existingUser: action.payload.existingUser
      };

    case UPDATE_USER:
      return { ...state, image: action.payload.image };

    case SIGNED_UP_USER:
      return { ...state, success: action.payload.message };

    case UNAUTH_USER:
      return { ...state, authenticated: false, customer: {} };

    case GET_CURRENT_USER:
      return { ...state, email: action.payload.email, id: action.payload.id, image: action.payload.image };

    case GET_CURRENT_USER_FOR_MY_PAGE:
      return { ...state, email: action.payload.email, id: action.payload.id, image: action.payload.image };

    case AUTH_ERROR:
    // console.log('in reducer:', action.payload);
      return { ...state, error: action.payload };

    case FETCH_MESSAGE:
      return { ...state, message: action.payload };

    case SHOW_SIGNIN_MODAL:
      return { ...state, showSigninModal: !state.showSigninModal };

    case SHOW_SIGNUP_MODAL:
      return { ...state, showSignupModal: !state.showSignupModal };

    case SHOW_AUTH_MODAL:
      return { ...state, showAuthModal: !state.showAuthModal };

    case SHOW_RESET_PASSWORD_MODAL:
      return { ...state, showResetPasswordModal: !state.showResetPasswordModal };

    case SHOW_EDIT_PROFILE_MODAL:
      return { ...state, showEditProfileModal: !state.showEditProfileModal };

    case FETCH_PROFILE_FOR_USER:
      return { ...state, userProfile: action.payload.profile, user: action.payload.user };

    case EDIT_PROFILE:
      return { ...state, userProfile: action.payload };

    case SHOW_LOADING:
      return { ...state, showLoading: !state.showLoading };

    case SHOW_LIGHTBOX:
      return { ...state, showLightbox: !state.showLightbox };

    case FETCH_CUSTOMER:
      return { ...state, customer: action.payload };

    case SELECTED_CARD:
      return { ...state, selectedCard: action.payload };

    case UPDATE_CARD_INFO:
      return { ...state, customer: action.payload };

    case DELETE_CARD:
      return { ...state, customer: action.payload };

    case ADD_CARD:
      return { ...state, customer: action.payload };

    case UPDATE_CUSTOMER:
      return { ...state, customer: action.payload };

    case ACTION_TYPE_CARD:
      return { ...state, cardActionType: action.payload };

    case MAKE_PAYMENT:
      return { ...state, charge: action.payload };

    case FETCH_BANK_ACCOUNTS_BY_USER:
      return { ...state, bankAccounts: action.payload };

    case CREATE_BANK_ACCOUNT:
      return { ...state, bankAccounts: action.payload };

    case UPDATE_BANK_ACCOUNT:
      return { ...state, bankAccounts: action.payload };

    case SELECTED_BANK_ACCOUNT_ID:
      return { ...state, selectedBankAccountId: action.payload };

    case UPDATE_CONTRACTOR:
      return { ...state, user: action.payload };

    case CREATE_CONTRACTOR:
      return { ...state, user: action.payload };

    case DELETE_CONTRACTOR:
      return { ...state, user: action.payload };

    case UPDATE_STAFF:
      return { ...state, user: action.payload };

    case CREATE_STAFF:
      return { ...state, user: action.payload };

    case DELETE_STAFF:
      return { ...state, user: action.payload };

    default:
      return state;
  }
}
