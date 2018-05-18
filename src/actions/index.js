import axios from 'axios';
import _ from 'lodash';
// import { browserHistory } from 'react-router-dom';
import {
  AUTH_USER,
  AUTH_ERROR,
  UNAUTH_USER,
  FETCH_FLATS,
  FETCH_FLATS_BY_USER,
  UPDATE_MAP_DIMENSIONS,
  SELECTED_FLAT,
  SELECTED_FLAT_FROM_PARAMS,
  INCREMENT_IMAGE_INDEX,
  DECREMENT_IMAGE_INDEX,
  START_UP_INDEX,
  GET_PW_RESET_TOKEN,
  SELECTED_DATES,
  REQUEST_BOOKING,
  FETCH_BOOKING,
  FETCH_BOOKINGS_BY_USER,
  CREATE_FLAT,
  CREATE_IMAGE,
  GET_CURRENT_USER,
  GET_CURRENT_USER_FOR_MY_PAGE,
  DELETE_FLAT,
  EDIT_FLAT_LOAD,
  EDIT_FLAT,
  DELETE_IMAGE,
  FETCH_MESSAGE
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
          console.log('we are in signin .catch');
          dispatch(authError(error.response.data.data.messages));
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
      dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, id: response.data.data.user.id } });
      console.log('in action, signup user, .then, response, auth token: ', response.data.data.user.authentication_token);
      localStorage.setItem('token', response.data.data.user.authentication_token);
      // localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', response.data.data.user.email);
      localStorage.setItem('id', response.data.data.user.id);

      // browserHistory.push('/feature'); deprecated in router-dom v4
      callback();
      // callback for this.props.history.push('/feature') from signup.js
    }).catch(error => {
      console.log('error.response:', error);
      dispatch(authError(error.response.data.data.messages));
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
  console.log('in actions index, authError:');
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
export function fetchFlatsByUser(id) {
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
export function incrementImageIndex(indexAtMax, maxImageIndex) {
  console.log('in actions incrementImageIndex');
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
  console.log('in actions decrementImageIndex');
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

export function createFlat(flatAttributes, callback) {
  console.log('in actions index, createFlat, flatAttributes: ', flatAttributes);
  console.log('in actions index, createFlat: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/flats`, { flat: flatAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createFlat, response: ', response);
      console.log('response to createFlat, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_FLAT,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback(response.data.data.flat.id, flatAttributes.files);
    });
  };
}

export function editFlat(flatAttributes, callback) {
  const { id } = flatAttributes;
  console.log('in actions index, editFlat, flatAttributes: ', flatAttributes);
  console.log('in actions index, editFlat: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/flats/${id}`, { flat: flatAttributes }, {
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
  console.log('in actions index, createImage, imageArray: ', imagesArray);
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
