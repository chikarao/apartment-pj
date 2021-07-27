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
  CREATE_PROFILE,
  EDIT_PROFILE,
  DELETE_PROFILE,
  SHOW_LOADING,
  GRAY_OUT_BACKGROUND,
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
  DELETE_STAFF,
  SET_GET_ONLINE_OFFLINE,
  SET_USER_STATUS,
  GET_APP_BASE_OBJECTS,
  SET_MESSAGE_TO_USER_OBJECT
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
  bankAccounts: [],
  appLanguages: {},
  messageToUserObject: null,
}, action) {
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
    console.log('in auth reducer, action, signout UNAUTH_USER: ', action);
      return { ...state,
        id: null,
        email: null,
        image: null,
        authenticated: false,
        customer: {}
      };

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

    case FETCH_PROFILE_FOR_USER:
      return { ...state, userProfile: action.payload.profile, user: action.payload.user };

    case CREATE_PROFILE:
      // return { ...state, userProfile: action.payload.profile, user: action.payload };
      return { ...state, user: action.payload };

    case EDIT_PROFILE:
      return { ...state, user: action.payload };

    case DELETE_PROFILE:
      return { ...state, user: action.payload };

    case SHOW_LOADING:
      console.log('in auth reducer, state.showLoading: ', state.showLoading);

      return { ...state, showLoading: !state.showLoading };

    case GRAY_OUT_BACKGROUND:
      return { ...state, grayOutBackgroundProp: !state.grayOutBackgroundProp };

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

    case GET_APP_BASE_OBJECTS:
      return { ...state, appLanguages: JSON.parse(action.payload.app_languages) };

    case SET_MESSAGE_TO_USER_OBJECT:
    // console.log('in auth reducer, state.messageToUserObject, action.payload: ', state.messageToUserObject, action.payload);
      return { ...state, messageToUserObject: action.payload };

    default:
      return state;
  }
}
