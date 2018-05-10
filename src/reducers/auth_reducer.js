import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, FETCH_MESSAGE, GET_CURRENT_USER } from '../actions/types';

export default function (state = {}, action) {
  console.log('in auth reducer, action.payload: ', action.payload);
  switch (action.type) {
    case AUTH_USER:
      return { ...state, error: '', authenticated: true, email: action.payload.email, id: action.payload.id };
      // return { ...state, error: '', authenticated: true, email: action.payload.email, user_id: action.payload.user_id };
    case UNAUTH_USER:
      return { ...state, authenticated: false };
    case GET_CURRENT_USER:
      return { ...state, email: action.payload.email, id: action.payload.id };
    case AUTH_ERROR:
    // console.log('in reducer:', action.payload);
      return { ...state, error: action.payload };
    case FETCH_MESSAGE:
      return { ...state, message: action.payload };
    default:
      return state;
  }
}
