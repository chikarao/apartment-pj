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
  SHOW_AUTH_MODAL,
  SHOW_RESET_PASSWORD_MODAL,
  FETCH_PROFILE_FOR_USER,
  SHOW_EDIT_PROFILE_MODAL,
  EDIT_PROFILE,
  SHOW_LOADING,
  SHOW_LIGHTBOX,
  FETCH_CUSTOMER,
  SELECTED_CARD_ID,
  UPDATE_CARD_INFO,
  ACTION_TYPE_CARD,
  DELETE_CARD,
  ADD_CARD
 } from '../actions/types';

export default function (state = {
  showAuthModal: false,
  showSigninModal: false,
  showResetPasswordModal: false,
  showLoading: false
}, action) {
  console.log('in auth reducer, action.payload: ', action.payload);
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        error: '',
        authenticated: true,
        email: action.payload.email,
        id: action.payload.id,
        image: action.payload.image,
        customerId: action.payload.customerId
      };

    case UPDATE_USER:
      return { ...state, image: action.payload.image };

    case SIGNED_UP_USER:
      return { ...state, success: action.payload.message };

    case UNAUTH_USER:
      return { ...state, authenticated: false };

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

    case SHOW_AUTH_MODAL:
      return { ...state, showAuthModal: !state.showAuthModal };

    case SHOW_RESET_PASSWORD_MODAL:
      return { ...state, showResetPasswordModal: !state.showResetPasswordModal };

    case SHOW_EDIT_PROFILE_MODAL:
      return { ...state, showEditProfileModal: !state.showEditProfileModal };

    case FETCH_PROFILE_FOR_USER:
      return { ...state, userProfile: action.payload };

    case EDIT_PROFILE:
      return { ...state, userProfile: action.payload };

    case SHOW_LOADING:
      return { ...state, showLoading: !state.showLoading };

    case SHOW_LIGHTBOX:
      return { ...state, showLightbox: !state.showLightbox };

    case FETCH_CUSTOMER:
      return { ...state, customer: action.payload };

    case SELECTED_CARD_ID:
      return { ...state, selectedCardId: action.payload };

    case UPDATE_CARD_INFO:
      return { ...state, customer: action.payload };

    case DELETE_CARD:
      return { ...state, customer: action.payload };

    case ADD_CARD:
      return { ...state, customer: action.payload };

    case ACTION_TYPE_CARD:
      return { ...state, cardActionType: action.payload };

    default:
      return state;
  }
}
