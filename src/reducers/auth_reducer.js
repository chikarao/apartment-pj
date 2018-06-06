import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  GET_CURRENT_USER,
  GET_CURRENT_USER_FOR_MY_PAGE,
  SHOW_AUTH_MODAL
 } from '../actions/types';

export default function (state = { showAuthModal: false }, action) {
  console.log('in auth reducer, action.payload: ', action.payload);
  switch (action.type) {
    case AUTH_USER:
      return { ...state, error: '', authenticated: true, email: action.payload.email, id: action.payload.id };
      // return { ...state, error: '', authenticated: true, email: action.payload.email, user_id: action.payload.user_id };
    case UNAUTH_USER:
      return { ...state, authenticated: false };

    case GET_CURRENT_USER:
      return { ...state, email: action.payload.email, id: action.payload.id };

    case   GET_CURRENT_USER_FOR_MY_PAGE:
      return { ...state, email: action.payload.email, id: action.payload.id };

    case AUTH_ERROR:
    // console.log('in reducer:', action.payload);
      return { ...state, error: action.payload };

    case FETCH_MESSAGE:
      return { ...state, message: action.payload };

    case SHOW_AUTH_MODAL:
      return { ...state, showAuthModal: !state.showAuthModal };

    default:
      return state;
  }
}
