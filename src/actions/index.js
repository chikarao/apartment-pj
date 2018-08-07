import axios from 'axios';
import _ from 'lodash';
// import { browserHistory } from 'react-router-dom';
import {
  AUTH_USER,
  UPDATE_USER,
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
  FETCH_CONVERSATIONS_BY_USER,
  FETCH_CONVERSATION_BY_FLAT,
  FETCH_MESSAGE,
  CREATE_MESSAGE,
  NO_CONVERSATION,
  YOUR_FLAT,
  CREATE_CONVERSATION,
  CONVERSATION_TO_SHOW,
  SHOW_CONVERSATIONS,
  CHECKED_CONVERSATIONS,
  UPDATE_CONVERSATIONS,
  CREATE_LIKE,
  CREATE_VIEW,
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
  FETCH_REVIEWS_FOR_FLAT,
  FETCH_PLACES,
  CREATE_PLACE,
  DELETE_PLACE,
  PLACE_SEARCH_LANGUAGE,
  MARK_MESSAGES_READ,
  SET_NEW_MESSAGES,
  SEARCH_FLAT_PARAMENTERS,
  CLEAR_FLATS,
  CLEAR_MAPDIMENSIONS,
  SET_MAP,
  NEW_CUSTOMER,
  SHOW_CARD_INPUT_MODAL,
  FETCH_CUSTOMER,
  SELECTED_CARD_ID,
  UPDATE_CARD_INFO,
  ACTION_TYPE_CARD,
  DELETE_CARD,
  ADD_CARD
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
        dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, id: response.data.data.user.id, image: response.data.data.user.image } });
        // dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, user_id: response.data.data.user.id } });
        // save JWT token
        // localStorage.setItem('token', response.data.token);
        // data.token for express server api
        //redirect to the route '/feature'

        console.log('in action, signin user, .then, response, auth token: ', response.data.data.user.authentication_token);
        localStorage.setItem('token', response.data.data.user.authentication_token);
        localStorage.setItem('email', response.data.data.user.email);
        localStorage.setItem('id', response.data.data.user.id);
        localStorage.setItem('image', response.data.data.user.image);
        // localStorage.setItem('customerId', response.data.data.user.stripe_customer_id);
        // localStorage.setItem('customer_id', response.data.data.user.stripe_customer_id);
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

export function updateUser(image, callback) {
  console.log('in actions index, updateUser, reviewAttributes: ', image);
  console.log('in actions index, updateUser: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = reviewAttributes;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/update_user`, { user: image }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to updateUser, response: ', response);
      console.log('response to updateUser, response.data.data: ', response.data.data.user);
      localStorage.setItem('image', response.data.data.user.image);
      dispatch({
        type: UPDATE_USER,
        payload: response.data.data.user
      });
      // sends back to createreview.js the review_id and the images
      callback();
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
  const image = localStorage.getItem('image');
  return { type: GET_CURRENT_USER, payload: { email, id, image } };
}

export function getCurrentUserForMyPage(callback) {
  console.log('in actions index, getCurrentUserforMyPage:');
  const id = localStorage.getItem('id');
  const email = localStorage.getItem('email');
  const image = localStorage.getItem('image');
  callback(id);
  return { type: GET_CURRENT_USER_FOR_MY_PAGE, payload: { email, id, image } };
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
  localStorage.removeItem('image');
  // localStorage.removeItem('customer_id');
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

export function showLoading(fromWhere) {
  console.log('in actions index, showLoading:', fromWhere);

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

export function searchFlatParameters(searchParameters) {
  console.log('in actions searchFlatParameters, searchParameters:', searchParameters);
  //flip showResetPasswordModal
  // callback();
  return {
    type: SEARCH_FLAT_PARAMENTERS,
    payload: searchParameters
   };
}

// main fetchflats action for feature page;
// gets mapbounds from gmap adn sends to api which sends back query results
export function fetchFlats(mapBounds, searchAttributes, callback) {
  // showLoading();
  // const { north, south, east, west } = mapBounds;
  // const { price_max, price_min, bedrooms_min, bedrooms_max, bedrooms_exact, size_min, size_max, station_min, station_max, ac, wifi, wheelchair_accessible, parking, kitchen } = searchAttributes;
  // Object assign combines two objects
  const allSearchAttributes = Object.assign(mapBounds, searchAttributes);
  // console.log('in actions index, fetchFlats north, south, east west: ', mapBounds);
  console.log('in actions index, fetchFlats allSearchAttributes: ', allSearchAttributes);

  return function (dispatch) {
    // axios.get(`${ROOT_URL}/api/v1/flats?`, { params: { north, south, east, west, price_max, price_min, bedrooms_min, bedrooms_max, bedrooms_exact, size_min, size_max, station_min, station_max, ac, wifi, wheelchair_accessible, parking, kitchen } }, {
    axios.get(`${ROOT_URL}/api/v1/flats?`, { params: allSearchAttributes }, {
    // axios.get(`${ROOT_URL}/api/v1/flats?`, { params: { north, south, east, west } }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchFlats, response: ', response);
      console.log('response to fetchFlats, response.data.data: ', response.data.data);
      dispatch({
        type: FETCH_FLATS,
        payload: response.data.data
      });
      // showLoading('fetchflats');
      callback();
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
export function fetchConversationsByUser(callback) {
  // better way to do this thn fetchConversationByUserAndFlat
  // gets @user to get conversation where user_id is @user.id and @flats where user id is user_id
  console.log('in actions index, fetchConversationsByUser: localStorage.getItem, token; ', localStorage.getItem('token'));
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1//users/conversations/conversations_by_user`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to fetchConversationsByUser: ', response);
      console.log('in action index, response to fetchConversationsByUser: ', response.data.data.conversations);
      // const { conversations } = response.data.data;
      // if (conversations.length === 0) {
      //   console.log('in action index, fetchConversationByFlatAndUser, if conversation.length === 0: ', conversations.length === 0);
      //   dispatch({
      //     type: NO_CONVERSATION
      //   });
      // }
      dispatch({
        type: FETCH_CONVERSATIONS_BY_USER,
        payload: response.data.data.conversations
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to fetchConversationsByUser: ', error);
    });
  };
}

export function setNewMessages(trueOrFalse) {
  console.log('in actions index, setNewMessages ');
  return {
    type: SET_NEW_MESSAGES,
    payload: trueOrFalse
  };
}

export function yourFlat(yours) {
  console.log('in actions index, yourFlat: ', yours);
  // yours is a boolean
  return {
    type: YOUR_FLAT,
    payload: yours
  };
}
export function checkedConversations(array) {
  console.log('in actions index, checkedConversations array: ', array);
  // callback();
  return {
    type: CHECKED_CONVERSATIONS,
    payload: array
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
  console.log('in actions index, updateMapDimensions: ', mapDimensions);
  return {
    type: UPDATE_MAP_DIMENSIONS,
    payload: mapDimensions
  };
}

export function conversationToShow(conversationId) {
  console.log('in actions index, conversationToShow: ', conversationToShow);
  localStorage.setItem('conversationToShow', conversationId);

  return {
    type: CONVERSATION_TO_SHOW,
    payload: conversationId
  };
}

export function showConversations() {
  console.log('in actions index, showConversations: ');
  return {
    type: SHOW_CONVERSATIONS,
    // payload: conversationId
  };
}

export function clearFlats() {
  console.log('in actions index, clearFlats: ');
  return {
    type: CLEAR_FLATS
  };
}
export function setMap(map) {
  console.log('in actions index, setMap: ', map);
  return {
    type: SET_MAP,
    payload: map
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
      console.log('response to deleteBooking, response.data.data: ', response.data.data.booking);
      dispatch({
        type: DELETE_BOOKING,
        payload: response.data.data.booking
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
export function createView(flatId) {
  console.log('in actions index, createView: localStorage.getItem, token: ', localStorage.getItem('token'));
  console.log('in actions index, createView: flatId: ', flatId);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/flats/${flatId}/views/`, { flat_id: flatId }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createView, response: ', response);
      console.log('response to createView, response.data.data.image: ', response.data.data.flat);

      dispatch({
        type: CREATE_VIEW,
        payload: response.data.data.flat
      });
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

export function createPlace(flatId, placeid, lat, lng, place_name, category, callback) {
  console.log('in actions index, createPlace, localStorage.getItem, token: ', localStorage.getItem('token'));
  console.log('in actions index, createPlace, flatId: ', flatId);
  console.log('in actions index, createPlace, placeid: ', placeid);
  console.log('in actions index, createPlace, lat: ', lat);
  console.log('in actions index, createPlace, lng: ', lng);
  console.log('in actions index, createPlace, category: ', category);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/flats/${flatId}/places`, { place: { placeid, place_name, lat, lng, category } }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createPlace, response: ', response);
      console.log('response to createPlace, response.data.data.image: ', response.data.data.places);
      // the response is a new array of places
      dispatch({
        type: CREATE_PLACE,
        payload: response.data.data.places
      });
      callback();
    });
  };
}

export function fetchPlaces(flatId) {
  console.log('in actions index, fetchPlaces: localStorage.getItem, token: ', localStorage.getItem('token'));
  console.log('in actions index, fetchPlaces: flatId: ', flatId);
  // console.log('in actions index, fetchPlaces: id: ', id);

  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/flats/${flatId}/places`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchPlaces, response: ', response);
      console.log('response to fetchPlaces, response.data.data.places: ', response.data.data.places);
      dispatch({
        type: FETCH_PLACES,
        payload: response.data.data.places
      });
      // callback();
    });
  };
}

export function deletePlace(flatId, id, callback) {
  console.log('in actions index, deletePlace: localStorage.getItem, token: ', localStorage.getItem('token'));
  console.log('in actions index, deletePlace: flatId: ', flatId);
  console.log('in actions index, deletePlace: id: ', id);

  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/flats/${flatId}/places/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to deletePlace, response: ', response);
      console.log('response to deletePlace, response.data.data.place: ', response.data.data.places);

      // the response is a new array of places
      dispatch({
        type: DELETE_PLACE,
        payload: response.data.data.places
      });
      callback();
    });
  };
}

export function placeSearchLanguage(language, callback) {
  console.log('in actions index, placeSearchLanguage:', language);
  return function (dispatch) {
    dispatch({ type: PLACE_SEARCH_LANGUAGE, payload: language });
    callback();
  };
}

export function markMessagesRead(id) {
  console.log('in actions index, markMessagesRead, id: ', id);
  console.log('in actions index, markMessagesRead: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = reviewAttributes;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/conversations/${id}`, { conversation: '' }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to markMessagesRead, response: ', response);
      console.log('response to markMessagesRead, response.data.data: ', response.data.data);
      dispatch({
        type: MARK_MESSAGES_READ,
        payload: response.data.data.conversation
      });
      // sends back to createreview.js the review_id and the images
      // callback();
    });
  };
}
export function updateConversations(idArray, conversationAttributes, callback) {
  console.log('in actions index, updateConversation, id: ', idArray);
  console.log('in actions index, updateConversation, conversationAttributes: ', conversationAttributes);
  console.log('in actions index, updateConversation: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = reviewAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/update_conversation`, { conversation: conversationAttributes, conversation_id_array: idArray }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to updateConversation, response: ', response);
      console.log('response to updateConversation, response.data.data: ', response.data.data);

      callback();

      dispatch({
        type: UPDATE_CONVERSATIONS,
        payload: response.data.data.conversation
      });
      // sends back to createreview.js the review_id and the images
      // callback();
    });
  };
}

export function newCustomer(info) {
  console.log('in action index, newCustomer, info: ', info);
  console.log('in action index, newCustomer, info.email: ', info.client);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/new_customer`, { stripeToken: info.token, client: info.email, detail: '' }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to newCustomer: ', response);
      console.log('in action index, response to newCustomer: ', response.data.data.user);

      dispatch({
        type: NEW_CUSTOMER,
        payload: response.data.data.user
      });
    })
    .catch(error => {
      console.log('in action index, catch error to newCustomer: ', error);
    });
  };
}
export function updateCardInfo(info, callback) {
  console.log('in action index, updateCardInfo, info: ', info);
  const { cardId, customerId, expYear, expMonth } = info;
  // console.log('in action index, updateCardInfo, info.email: ', info.client);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/update_card_info`, { cardId, customerId, expYear, expMonth }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to updateCardInfo: ', response);
      console.log('in action index, response to updateCardInfo: ', response.data.data.customer);

      dispatch({
        type: UPDATE_CARD_INFO,
        payload: response.data.data.customer
      });

      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to newCustomer: ', error);
    });
  };
}

export function fetchCustomer() {
  console.log('in action index, fetchCustomer: ');

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/retrieve_customer`, {}, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to fetchCustomer: ', response);
      console.log('in action index, response to fetchCustomer: ', response.data.data.customer);

      dispatch({
        type: FETCH_CUSTOMER,
        payload: response.data.data.customer
      });
    })
    .catch(error => {
      console.log('in action index, catch error to fetchCustomer: ', error);
    });
  };
}
export function deleteCard(cardId) {
  console.log('in action index, fetchCustomer: ');

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/delete_card`, { cardId }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to deleteCard: ', response);
      console.log('in action index, response to deleteCard: ', response.data.data.customer);

      dispatch({
        type: DELETE_CARD,
        payload: response.data.data.customer
      });
    })
    .catch(error => {
      console.log('in action index, catch error to deleteCard: ', error);
    });
  };
}
export function addCard(info) {
  console.log('in action index, fetchCustomer: ');

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/add_card`, { stripeToken: info.token }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to addCard: ', response);
      console.log('in action index, response to addCard: ', response.data.data.customer);

      dispatch({
        type: ADD_CARD,
        payload: response.data.data.customer
      });
    })
    .catch(error => {
      console.log('in action index, catch error to addCard: ', error);
    });
  };
}

export function showCardInputModal() {
  console.log('in actions index, showCardInputModal:');

  //flip showResetPasswordModal
  return { type: SHOW_CARD_INPUT_MODAL };
}
export function selectedCardId(cardId) {
  console.log('in actions index, selectedcardId:', cardId);

  //flip showResetPasswordModal
  return { type: SELECTED_CARD_ID, payload: cardId };
}
export function actionTypeCard(action) {
  console.log('in actions index, actionTypeCard:', action);

  //flip showResetPasswordModal
  return { type: ACTION_TYPE_CARD, payload: action };
}
