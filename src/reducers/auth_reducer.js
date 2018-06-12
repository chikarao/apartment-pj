import {
  AUTH_USER,
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
  SHOW_LIGHTBOX
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
        id: action.payload.id
      };
    case SIGNED_UP_USER:
      return { ...state, success: action.payload.message };

    case UNAUTH_USER:
      return { ...state, authenticated: false };

    case GET_CURRENT_USER:
      return { ...state, email: action.payload.email, id: action.payload.id };

    case GET_CURRENT_USER_FOR_MY_PAGE:
      return { ...state, email: action.payload.email, id: action.payload.id };

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

    default:
      return state;
  }
}
