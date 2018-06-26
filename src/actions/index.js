import axios from 'axios';
import _ from 'lodash';
// import { browserHistory } from 'react-router-dom';
import {
  AUTH_USER,
  SIGNED_UP_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  FETCH_FLATS,
  FETCH_FLATS_BY_USER,
  UPDATE_MAP_DIMENSIONS,
  SELECTED_FLAT,
  SELECTED_FLAT_FROM_PARAMS,
  INCREMENT_IMAGE_INDEX,
  DECREMENT_IMAGE_INDEX,
  SET_IMAGE_INDEX,
  START_UP_INDEX,
  GET_PW_RESET_TOKEN,
  SELECTED_DATES,
  REQUEST_BOOKING,
  FETCH_BOOKING,
  FETCH_BOOKINGS_BY_USER,
  DELETE_BOOKING,
  CREATE_FLAT,
  CREATE_IMAGE,
  GET_CURRENT_USER,
  GET_CURRENT_USER_FOR_MY_PAGE,
  DELETE_FLAT,
  EDIT_FLAT_LOAD,
  EDIT_FLAT,
  DELETE_IMAGE,
  FETCH_CONVERSATION_BY_USER_AND_FLAT,
  FETCH_CONVERSATION_BY_FLAT,
  FETCH_MESSAGE,
  CREATE_MESSAGE,
  NO_CONVERSATION,
  CREATE_CONVERSATION,
  CREATE_LIKE,
  DELETE_LIKE,
  LIKES_BY_USER,
  SHOW_SIGNIN_MODAL,
  SHOW_AUTH_MODAL,
  SHOW_RESET_PASSWORD_MODAL,
  FETCH_PROFILE_FOR_USER,
  SHOW_EDIT_PROFILE_MODAL,
  EDIT_PROFILE,
  SHOW_LOADING,
  SHOW_LIGHTBOX,
  CREATE_REVIEW,
  FETCH_REVIEW_FOR_BOOKING_BY_USER,
  UPDATE_REVIEW,
  SHOW_EDIT_REVIEW_MODAL,
  FETCH_REVIEWS_FOR_FLAT
} from './types';

// const ROOT_URL = 'http://localhost:3090';
const ROOT_URL = 'http://localhost:3000';

export function signinUser({ email, password }, callback) {
  // reduxthunk allow return of function and edirect access to dispatch method
//dispatch accepts action and forwards to all reducers;
// main pipeline of redux; dispatch can wait for async
console.log('in action, index, sign in, email and password: ', { email, password });
  // now can place lots of logic
  console.log('in actions index, signinUser:');

  return function (dispatch) {
    // redux thunk let's us call dispatch method; returns action
    // submit email/password to the server
    // same as { email: email, password: password}
    // console.log({ sign_in: { email, password } });
    axios.post(`${ROOT_URL}/api/v1/sign_in`, { sign_in: { email, password } })
    // axios.post(`${ROOT_URL}/sign_in`, { email, password })
    //signin for express server
      .then(response => {
        console.log('in action, index, sign in, response: ', response);
        console.log('in action, index, sign in, esponse.data.data.user.email: ', response.data.data.user.email);
        console.log('in action, index, sign in, esponse.data.data.user.id: ', response.data.data.user.id);
        // request is good
        // Update state to indicate user is authenticated
        // dispatch({ type: AUTH_USER, payload: email });
        // dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, id: response.data.data.user.id } });
        dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, id: response.data.data.user.id } });
        // dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, user_id: response.data.data.user.id } });
        // save JWT token
        // localStorage.setItem('token', response.data.token);
        // data.token for express server api
        //redirect to the route '/feature'

        console.log('in action, signin user, .then, response, auth token: ', response.data.data.user.authentication_token);
        localStorage.setItem('token', response.data.data.user.authentication_token);
        localStorage.setItem('email', response.data.data.user.email);
        localStorage.setItem('id', response.data.data.user.id);
        // authentication_token for rails book review api
        // browserHistory.push('/feature');
        callback();
        // callback for this.props.history.push('/feature') from signin.js
      })
        .catch((error) => {
          // take out error if hard coding error messages
          // if request is bad
          // show error to user
          console.log('action index, sign in, catch, error.response.data.messages:', error.response.data.messages);
          dispatch(authError(error.response.data.messages));
          // dispatch(authError('Bad login info...'));
        });
  };
}

export function signupUser({ email, password }, callback) {
  console.log('in actions index, signupUser:');

  return function (dispatch) {
    console.log({ user: { email, password } });
    axios.post(`${ROOT_URL}/api/v1/sign_up`, { user: { email, password } })
    // signup for express server; sign_up for rails book review api
    .then(response => {
      console.log('in action, signup user, .then, response: ', response);
      // dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, id: response.data.data.user.id } });
      dispatch({ type: SIGNED_UP_USER, payload: { email: response.data.data.user.email, id: response.data.data.user.id, message: response.data.messages } });
      console.log('in action, signup user, .then, response, auth token: ', response.data.data.user.authentication_token);
      // localStorage.setItem('token', response.data.data.user.authentication_token);
      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('email', response.data.data.user.email);
      // localStorage.setItem('id', response.data.data.user.id);

      // browserHistory.push('/feature'); deprecated in router-dom v4
      callback();
      // callback for this.props.history.push('/feature') from signup.js
    }).catch(error => {
      console.log('action index, sign up, catch, error.response.data.messages:', error.response.data.messages);
      dispatch(authError(error.response.data.messages));
      // dispatch(authError(error));
    });
    // .catch(response => dispatch(console.log(response.data)));
  };
}

export function getCurrentUser() {
  console.log('in actions index, getCurrentUser:');
  const id = localStorage.getItem('id');
  const email = localStorage.getItem('email');
  return { type: GET_CURRENT_USER, payload: { email, id } };
}

export function getCurrentUserForMyPage(callback) {
  console.log('in actions index, getCurrentUserforMyPage:');
  const id = localStorage.getItem('id');
  const email = localStorage.getItem('email');
  callback(id);
  return { type: GET_CURRENT_USER_FOR_MY_PAGE, payload: { email, id } };
}

export function authError(error) {
  console.log('in actions index, authError:', error);
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  console.log('in actions index, signoutUser:');

  //flip authenticated to false
  // delete token from local storage
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('id');
  return { type: UNAUTH_USER };
}

export function showSigninModal() {
  console.log('in actions index, showSigninModal:');

  //flip showSigninModal
  return { type: SHOW_SIGNIN_MODAL };
}

export function showAuthModal() {
  console.log('in actions index, showAuthModal:');

  //flip showAuthModal
  return { type: SHOW_AUTH_MODAL };
}

export function showResetPasswordModal() {
  console.log('in actions index, showResetPasswordModal:');

  //flip showResetPasswordModal
  return { type: SHOW_RESET_PASSWORD_MODAL };
}

export function showEditProfileModal() {
  console.log('in actions index, showEditProfileModal:');

  //flip showResetPasswordModal
  return { type: SHOW_EDIT_PROFILE_MODAL };
}

export function showLoading() {
  console.log('in actions index, showLoading:');

  //flip showResetPasswordModal
  return { type: SHOW_LOADING };
}

export function showLightbox() {
  console.log('in actions index, showLightbox:');

  //flip showResetPasswordModal
  return { type: SHOW_LIGHTBOX };
}
export function showEditReview() {
  console.log('in actions index, showEditReview:');

  //flip showResetPasswordModal
  return { type: SHOW_EDIT_REVIEW_MODAL };
}

// main fetchflats action for feature page;
// gets mapbounds from gmap adn sends to api which sends back query results
export function fetchFlats(mapBounds) {
  const { north, south, east, west } = mapBounds;
  // console.log('in actions index, fetch flats mapBounds.east: ', mapBounds.east);

  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/flats?`, { params: { north, south, east, west } }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchFlats: ', response.data.data.flats);
      dispatch({
        type: FETCH_FLATS,
        payload: response.data.data.flats
      });
    });
  };
}
export function fetchFlatsByUser(id, callback) {
  // const { north, south, east, west } = mapBounds;
  // console.log('in actions index, fetch flats mapBounds.east: ', mapBounds.east);
  console.log('in action index, fetchFlatsByUser, id: ', id);

  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/users/flats`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to fetchFlatsByUser: ', response);
      console.log('in action index, response to fetchFlatsByUser: ', response.data.data.flats);
      dispatch({
        type: FETCH_FLATS_BY_USER,
        payload: response.data.data.flats
      });

      const flatIdArray = [];
      _.each(response.data.data.flats, (flat) => {
        console.log('in action index, response to fetchFlatsByUser, each: ', flat);
        flatIdArray.push(flat.id.toString());
      });

      console.log('in action index, response to fetchFlatsByUser, flatIdArray: ', flatIdArray);
      callback(flatIdArray);
    });
  };
}

export function fetchReviewsForFlat(id) {
  // const { north, south, east, west } = mapBounds;
  // console.log('in actions index, fetch flats mapBounds.east: ', mapBounds.east);
  console.log('in action index, fetchReviewsForFlat, id: ', id);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/reviews/reviews_for_flat`, { review: { flat_id: id } }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to fetchReviewsForFlat: ', response);
      console.log('in action index, response to fetchReviewsForFlat: ', response.data.data.reviews);
      dispatch({
        type: FETCH_REVIEWS_FOR_FLAT,
        payload: response.data.data.reviews
      });
    });
  };
}

export function fetchConversationByFlat(flatId) {
// flatId is an object {flat_id: id}, with id taken from match params
  console.log('in action index, fetchConversationByFlat, flat_id: ', flatId);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/users/conversations/conversation_by_flat`, { conversation: flatId }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to fetchConversationByFlat: ', response);
      console.log('in action index, response to fetchConversationByFlat: ', response.data.data.conversation);
      const { conversation } = response.data.data;
      if (conversation.length === 0) {
        console.log('in action index, fetchConversationByFlatAndUser, if conversation.length === 0: ', conversation.length === 0);
        dispatch({
          type: NO_CONVERSATION
        });
      }
      dispatch({
        type: FETCH_CONVERSATION_BY_FLAT,
        payload: response.data.data.conversation
      });
    })
    .catch(error => {
      console.log('in action index, catch error to fetchConversationByFlat: ', error);
    });
  };
}

export function fetchConversationByUserAndFlat(flatIdArray) {
  //flatIds is an array
  console.log('in action index, fetchConversationByUserAndFlat, flatIdArray: ', flatIdArray);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/users/conversations/conversations_by_user_and_flat`, { conversation: { flat_id_array: flatIdArray } }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to fetchConversationByUserAndFlat: ', response);
      console.log('in action index, response to fetchConversationByUserAndFlat: ', response.data.data.conversations);
      const { conversations } = response.data.data;
      if (conversations.length === 0) {
        console.log('in action index, fetchConversationByFlatAndUser, if conversation.length === 0: ', conversations.length === 0);
        dispatch({
          type: NO_CONVERSATION
        });
      }
      dispatch({
        type: FETCH_CONVERSATION_BY_USER_AND_FLAT,
        payload: response.data.data.conversations
      });
    })
    .catch(error => {
      console.log('in action index, catch error to fetchConversationByUserAndFlat: ', error);
    });
  };
}

export function createConversation(conversationAttributes, messageAttributes, callback) {
  console.log('in actions index, createConversation, conversationAttributes: ', conversationAttributes);
  console.log('in actions index, createConversation: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/conversations`, { conversation: conversationAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createConversation, response: ', response);
      console.log('response to createConversation, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_CONVERSATION
        // payload: response.data.data.conversation
      });
      const conversationId = response.data.data.conversation.id;
      const userId = response.data.data.conversation.user_id;
      const newMessageAttributes = messageAttributes;
      const convId = 'conversation_id';
      const uId = 'user_id';

      newMessageAttributes[convId] = conversationId;
      newMessageAttributes[uId] = userId;
      callback(newMessageAttributes);
    });
  };
}

// AFer clikcing buttton in resetpassword page, takes email and obtains token from API
export function getPasswordResetToken(email) {
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/password/forgot`, { user: { email } })
    .then(response => {
      console.log('response to getPasswordResetToken: ', response.data);
      dispatch({
        type: GET_PW_RESET_TOKEN
      });
    });
  };
}

// takes parameters from resetpassword page and calls API
export function resetPassword({ email, password, token }) {
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/password/reset`, { user: { email, password, token } })
    .then(response => {
      console.log('response to resetPassword: ', response.data);
      dispatch({
        type: GET_PW_RESET_TOKEN
      });
    });
  };
}

// Not used but kept for references
export function fetchMessage() {
  console.log('in actions index, fetchMessage:');

  return function (dispatch) {
    axios.get(ROOT_URL, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      dispatch({
        type: FETCH_MESSAGE,
        payload: response.data.message
    });
  });
};
}

// Gets map dimansions (lat, lng, zoom and center);
// Requred to render map when there are no flats in the panned area
export function updateMapDimensions(mapDimensions) {
  console.log('in actions index, updateMapBounds: ', mapDimensions);
  return {
    type: UPDATE_MAP_DIMENSIONS,
    payload: mapDimensions
  };
}
// selectedFlat has been commented out in feature since show flat can be rendered with only params
// keep just in case need it later
export function selectedFlat(flat) {
  console.log('in actions index, selectedFlat:');
  console.log('in actions index, selectedFlat: ', flat);
  return {
    type: SELECTED_FLAT,
    payload: flat
  };
}

// takes id params in show flat page and fetches flat from api
export function selectedFlatFromParams(id) {
  console.log('in actions index, selectedFlatFromParams id: ', id);
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/flats/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in actions index, response to selectedFlatFromParams: ', response.data.data.flat);
      dispatch({
        type: SELECTED_FLAT_FROM_PARAMS,
        payload: response.data.data.flat
    });
  });
  };
}

// Required for carousel in map infowindow and main cards
export function setImageIndex(index) {
  console.log('in actions setImageIndex', index);
  return {
    type: SET_IMAGE_INDEX,
    payload: index
  };
}
export function incrementImageIndex(indexAtMax, maxImageIndex) {
  console.log('in actions incrementImageIndex, indexAtMax, maxImageIndex', indexAtMax, maxImageIndex);
  if (indexAtMax) {
    return {
      type: INCREMENT_IMAGE_INDEX,
      payload: -maxImageIndex
    };
  }
  return {
    type: INCREMENT_IMAGE_INDEX,
    payload: 1
  };
}

// Required for carousel in map infowindow and main cards
export function decrementImageIndex(indexAtZero, maxImageIndex) {
  console.log('in actions decrementImageIndex, indexAtZero, maxImageIndex', indexAtZero, maxImageIndex);
  if (indexAtZero) {
    return {
      type: DECREMENT_IMAGE_INDEX,
      payload: -maxImageIndex
    };
  }
  return {
    type: DECREMENT_IMAGE_INDEX,
    payload: 1
  };
}

// Flag for finding if state has been updated on shtartup; not used anywhere but keep for future
export function startUpIndex() {
  console.log('in actions index, startUpIndex');
  return {
    type: START_UP_INDEX
  };
}

// receives object of dates from calendar to be used for booking
export function selectedDates(dates) {
  console.log('in actions index, selectedDates, dates', dates);
  return {
    type: SELECTED_DATES,
    payload: dates
  };
}

export function editFlatLoad(flat) {
  console.log('in actions index, editFlatLoad, flat', flat);
  return {
    type: EDIT_FLAT_LOAD,
    payload: flat
  };
}

// called in show flats to post to api; callback to navigate to confirmation page with id as params
export function requestBooking(bookingRequest, callback) {
  console.log('in actions index, requestBooking, bookingRequest: ', bookingRequest);
  console.log('in actions index, requestBooking, localStorage.getItem : ', localStorage.getItem('token'));

  const { flat_id, user_email, date_start, date_end } = bookingRequest;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/bookings`, { booking: { flat_id, user_email, date_start, date_end } }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
      .then(response => {
        console.log('response to requestBooking: ', response.data.data.booking);
        dispatch({
          type: REQUEST_BOOKING,
          payload: response.data.data.booking
        });
        callback(response.data.data.booking.id);
      });
  };
}

//called when BookingConfirmation mounted; sent id from params
export function fetchBooking(id) {
  console.log('in actions index, fetch booking: ', id);

  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/bookings/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchBooking: ', response);
      console.log('response to fetchBooking: ', response.data.data.booking);
      dispatch({
        type: FETCH_BOOKING,
        payload: response.data.data.booking
      });
    });
  };
}
//called when BookingConfirmation mounted; sent id from params
export function fetchBookingsByUser(id) {
  console.log('in actions index, fetchBookingsByUser: ', id);

  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/users/bookings/`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchBookingsByUser, response: ', response);
      console.log('response to fetchBookingsByUser, response.data.data.bookings: ', response.data.data.bookings);
      dispatch({
        type: FETCH_BOOKINGS_BY_USER,
        payload: response.data.data.bookings
      });
    });
  };
}

export function deleteBooking(id, callback) {
  console.log('in actions index, deleteBooking, id: ', id);
  console.log('in actions index, deleteBooking: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/bookings/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to deleteBooking, response: ', response);
      console.log('response to deleteBooking, response.data.data: ', response.data.data);
      dispatch({
        type: DELETE_FLAT,
        payload: response.data.data
      });
      // redirects to mypage
      callback();
      window.alert('Deleted booking');
    });
    //end of then
  };
  //end of return function
}

export function createFlat(flatAttributes, callback) {
  console.log('in actions index, createFlat, flatAttributes: ', flatAttributes);
  console.log('in actions index, createFlat: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/flats`, { flat: flatAttributes.flat, amenity: flatAttributes.amenity }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createFlat, response: ', response);
      console.log('response to createFlat, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_FLAT
      });
      // sends back to createflat.js the flat_id and the images
      callback(response.data.data.flat.id, flatAttributes.files);
    });
  };
}

export function createMessage(messageAttributes, callback) {
  console.log('in actions index, createMessage, messageAttributes: ', messageAttributes);
  console.log('in actions index, createMessage: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/conversations/${messageAttributes.conversation_id}/messages`, { message: messageAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createMessage, response: ', response);
      console.log('response to createMessage, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_MESSAGE,
        payload: response.data.data.conversation
      });
      // sends back to createflat.js the flat_id and the images
      callback(response.data.data.conversation.flat_id);
    });
  };
}

export function editFlat(flatAttributes, callback) {
  const { flat_id } = flatAttributes.flat;
  console.log('in actions index, editFlat, flatAttributes: ', flatAttributes);
  console.log('in actions index, editFlat, flat_id: ', flat_id);
  console.log('in actions index, editFlat: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/flats/${flat_id}`, { flat: flatAttributes.flat, amenity: flatAttributes.amenity }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to editFlat, response: ', response);
      console.log('response to editFlat, response.data.data: ', response.data.data);
      dispatch({
        type: EDIT_FLAT,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback(response.data.data.flat.id, flatAttributes.files);
    });
  };
}
export function editProfile(profileAttributes, callback) {
  const { id } = profileAttributes;
  console.log('in actions index, editProfile, profileAttributes: ', profileAttributes);
  console.log('in actions index, editeditProfileFlat: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/profiles/${id}`, { profile: profileAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to editProfile, response: ', response);
      console.log('response to editProfile, response.data.data: ', response.data.data.profile);
      dispatch({
        type: EDIT_PROFILE,
        payload: response.data.data.profile
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function deleteFlat(id, callback) {
  console.log('in actions index, deleteFlat, flatAttributes: ', id);
  console.log('in actions index, deleteFlat: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/flats/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to deleteFlat, response: ', response);
      console.log('response to deleteFlat, response.data.data: ', response.data.data);
      dispatch({
        type: DELETE_FLAT,
        payload: response.data.data
      });
      // redirects to mypage
      callback();
      window.alert('Deleted listing');
    });
    //end of then
  };
  //end of return function
}

export function createImage(imagesArray, imageCount, flatId, callback) {
  console.log('in actions index, createImage, imagesArray: ', imagesArray);
  console.log('in actions index, createImage: localStorage.getItem, token: ', localStorage.getItem('token'));
  console.log('in actions index, createImage: imageCount: ', imageCount);
  console.log('in actions index, createImage: flatId: ', flatId);
  const image = imagesArray[imageCount];
  console.log('in actions index, createImage: image: ', image);

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/images`, { publicid: image, flat_id: flatId }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createImage, response: ', response);
      console.log('response to createImage, response.data.data.image: ', response.data.data.image);

      callback(imagesArray, imageCount, response.data.data.image.flat_id);
      dispatch({
        type: CREATE_IMAGE,
        payload: response.data.data.image
      });
    });
  };
}
export function deleteImage(id, imageCount, callback) {
  console.log('in actions index, createImage: id: ', id);

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/images/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createImage, response: ', response);
      console.log('response to createImage, response.data.data.image: ', response.data.data.image);

      callback(imageCount);
      dispatch({
        type: DELETE_IMAGE,
        payload: response.data.data.image
      });
    });
  };
}
// creates like by flat id and user id; user id is taken from the token in hte API
// called in main_cards
export function createLike(flatId, callback) {
  console.log('in actions index, createLike: localStorage.getItem, token: ', localStorage.getItem('token'));
  console.log('in actions index, createLike: flatId: ', flatId);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/likes/`, { flat_id: flatId }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createLike, response: ', response);
      console.log('response to createLike, response.data.data.image: ', response.data.data.like);

      dispatch({
        type: CREATE_LIKE,
        payload: response.data.data.like
      });
      callback();
    });
  };
}
// gets likes by user; API takes token and fetches likes by user.id
// called in feature
export function fetchLikesByUser() {
  console.log('in actions index, fetchLikesByUser: localStorage.getItem, token: ', localStorage.getItem('token'));

  return function (dispatch) {
    //for some reason, get works but post does not; with postman, post works with no params
    axios.get(`${ROOT_URL}/api/v1/users/likes/likes_by_user`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchLikesByUser, response: ', response);
      console.log('response to fetchLikesByUser, response.data.data.image: ', response.data.data.likes);

      // callback();
      dispatch({
        type: LIKES_BY_USER,
        payload: response.data.data.likes
      });
    });
  };
}

// deletes like for given user and flat; user id in API is taken from token
// called in main_cards
export function deleteLike(flatId, callback) {
  console.log('in actions index, deleteLike: like id: ', flatId);

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/likes/${flatId}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to deleteLike, response: ', response);
      console.log('response to deleteLike, response.data.data.image: ', response.data.data);

      // callback(imageCount);
      dispatch({
        type: DELETE_LIKE,
        payload: response.data.data
      });
      callback();
    });
  };
}

export function fetchProfileForUser() {
  // console.log('in actions index, fetch flats mapBounds.east: ', mapBounds.east);

  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/users/profiles/profile_for_user?`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchProfileForUser, response: ', response);
      console.log('response to fetchProfileForUser, response.data.data.profile: ', response.data.data.profile);
      dispatch({
        type: FETCH_PROFILE_FOR_USER,
        payload: response.data.data.profile
      });
    });
  };
}
export function fetchReviewForBookingByUser(booking_id) {
  // console.log('in actions index, fetch flats mapBounds.east: ', mapBounds.east);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/reviews/review_for_booking_by_user?`, { review: { booking_id } }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchReviewForBookingByUser, response: ', response);
      console.log('response to fetchReviewForBookingByUser, response.data.data.review: ', response.data.data.review);
      dispatch({
        type: FETCH_REVIEW_FOR_BOOKING_BY_USER,
        payload: response.data.data.review
      });
    });
  };
}

export function createReview(reviewAttributes, callback) {
  console.log('in actions index, createReview, reviewAttributes: ', reviewAttributes);
  console.log('in actions index, createReview: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = reviewAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/reviews`, { review: reviewAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createReview, response: ', response);
      console.log('response to createReview, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_REVIEW,
        payload: response.data.data.review
      });
      // sends back to createreview.js the review_id and the images
      callback();
    });
  };
}
export function updateReview(reviewAttributes, callback) {
  console.log('in actions index, updateReview, reviewAttributes: ', reviewAttributes);
  console.log('in actions index, updateReview: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = reviewAttributes;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/reviews/${reviewAttributes.id}`, { review: reviewAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to updateReview, response: ', response);
      console.log('response to updateReview, response.data.data: ', response.data.data);
      dispatch({
        type: UPDATE_REVIEW,
        payload: response.data.data.review
      });
      // sends back to createreview.js the review_id and the images
      callback();
    });
  };
}
