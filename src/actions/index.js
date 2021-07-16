import axios from 'axios';
import _ from 'lodash';
// import { each } from 'lodash';
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
  EDIT_BOOKING,
  FETCH_BOOKING,
  EMPTY_BOOKING_DATA,
  EMPTY_SELECTED_FLAT_FROM_PARAMS,
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
  DELETE_IMAGES,
  FETCH_CONVERSATION_BY_USER_AND_FLAT,
  FETCH_CONVERSATIONS_BY_USER,
  FETCH_CONVERSATION_BY_FLAT,
  FETCH_MESSAGE,
  CREATE_MESSAGE,
  NO_CONVERSATION,
  NO_CONVERSATION_FOR_FLAT,
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
  SHOW_SIGNUP_MODAL,
  SHOW_AUTH_MODAL,
  SHOW_RESET_PASSWORD_MODAL,
  FETCH_PROFILE_FOR_USER,
  SHOW_PROFILE_EDIT_MODAL,
  EDIT_PROFILE,
  CREATE_PROFILE,
  DELETE_PROFILE,
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
  SELECTED_CARD,
  UPDATE_CARD_INFO,
  ACTION_TYPE_CARD,
  DELETE_CARD,
  ADD_CARD,
  UPDATE_CUSTOMER,
  MAKE_PAYMENT,
  FETCH_STRIPE_USER_CREDENTIALS,
  SHOW_LANGUAGE_CREATE_MODAL,
  CREATE_FLAT_LANGUAGE,
  SHOW_LANGUAGE_EDIT_MODAL,
  SELECTED_LANGUAGE,
  UPDATE_FLAT_LANGUAGE,
  DELETE_FLAT_LANGUAGE,
  SET_APP_LANGUAGE_CODE,
  SET_DOCUMENT_LANGUAGE_CODE,
  FETCH_ICAL,
  SYNC_CALENDARS,
  SELECTED_ICALENDAR_ID,
  SHOW_ICALENDAR_CREATE_MODAL,
  SHOW_ICALENDAR_EDIT_MODAL,
  CREATE_ICALENDAR,
  UPDATE_ICALENDAR,
  DELETE_ICALENDAR,
  CREATE_CONTRACT,
  CREATE_DOCUMENT_ELEMENT_LOCALLY,
  UPDATE_DOCUMENT_ELEMENT_LOCALLY,
  DELETE_DOCUMENT_ELEMENT_LOCALLY,
  POPULATE_TEMPLATE_ELEMENTS_LOCALLY,
  SEARCH_BUILDINGS,
  SHOW_BUILDING_EDIT_MODAL,
  SHOW_BUILDING_CREATE_MODAL,
  UPDATE_BUILDING,
  CREATE_BUILDING,
  FETCH_BANK_ACCOUNTS_BY_USER,
  SHOW_BANK_ACCOUNT_EDIT_MODAL,
  SHOW_BANK_ACCOUNT_CREATE_MODAL,
  CREATE_BANK_ACCOUNT,
  UPDATE_BANK_ACCOUNT,
  SELECTED_BANK_ACCOUNT_ID,
  SHOW_FACILITY_EDIT_MODAL,
  SELECTED_FACILITY_ID,
  SHOW_FACILITY_CREATE_MODAL,
  UPDATE_FACILITY,
  CREATE_FACILITY,
  DELETE_FACILITY,
  REQUIRED_FIELDS,
  BOOKING_REQUEST_DATA,
  SHOW_INSPECTION_CREATE_MODAL,
  SHOW_INSPECTION_EDIT_MODAL,
  CREATE_INSPECTION,
  UPDATE_INSPECTION,
  DELETE_INSPECTION,
  SELECTED_INSPECTION_ID,
  SET_CREATE_DOCUMENT_KEY,
  SHOW_CONTRACTOR_CREATE_MODAL,
  SHOW_CONTRACTOR_EDIT_MODAL,
  SHOW_STAFF_CREATE_MODAL,
  SHOW_STAFF_EDIT_MODAL,
  SELECTED_CONTRACTOR_ID,
  SELECTED_STAFF_ID,
  UPDATE_CONTRACTOR,
  CREATE_CONTRACTOR,
  DELETE_CONTRACTOR,
  UPDATE_STAFF,
  CREATE_STAFF,
  DELETE_STAFF,
  ADD_NEW_CONTRACTOR,
  ADD_NEW_STAFF,
  CONTRACTOR_TO_EDIT_ID,
  STAFF_TO_EDIT_ID,
  PROFILE_TO_EDIT_ID,
  SHOW_PROFILE_CREATE_MODAL,
  SELECTED_PROFILE_ID,
  SHOW_BUILDING_LANGUAGE_CREATE_MODAL,
  SHOW_BUILDING_LANGUAGE_EDIT_MODAL,
  SELECTED_BUILDING_LANGUAGE_ID,
  SELECTED_BUILDING_ID,
  BUILDING_LANGUAGE_TO_EDIT_ID,
  UPDATE_BUILDING_LANGUAGE,
  CREATE_BUILDING_LANGUAGE,
  DELETE_BUILDING_LANGUAGE,
  SET_INITIAL_VALUES_OBJECT,
  SET_TEMPLATE_ELEMENTS_OBJECT,
  CREATE_AGREEMENT,
  EDIT_AGREEMENT,
  EDIT_AGREEMENT_FIELDS,
  DELETE_AGREEMENT,
  EDIT_HISTORY,
  FETCH_DOCUMENT_TRANSLATION,
  CREATE_DOCUMENT_INSERT,
  EDIT_DOCUMENT_INSERT,
  DELETE_DOCUMENT_INSERT,
  CREATE_INSERT_FIELD,
  EDIT_INSERT_FIELD,
  DELETE_INSERT_FIELD,
  SHOW_DOCUMENT_INSERT_CREATE_MODAL,
  SHOW_DOCUMENT_INSERT_EDIT_MODAL,
  SHOW_SELECT_EXSITING_DOCUMENT_MODAL,
  SHOW_INSERT_FIELD_CREATE_MODAL,
  SHOW_INSERT_FIELD_EDIT_MODAL,
  INSERT_FIELD_TO_EDIT_ID,
  SELECTED_DOCUMENT_INSERT_ID,
  SELECTED_INSERT_FIELD_ID,
  SELECTED_AGREEMENT_ID,
  FETCH_AGREEMENT,
  EMAIL_DOCUMENTS,
  MARK_DOCUMENTS_SIGNED,
  RECEIVE_CONVERSATION,
  SET_CABLE_CONNECTION,
  SET_TYPING_TIMER,
  WEBSOCKET_CONNECTED,
  CABLE_PAGE_OVERRIDE,
  GET_GOOGLE_MAP_MAP_BOUNDS_KEYS,
  SET_GET_ONLINE_OFFLINE,
  SET_USER_STATUS,
  SET_OTHER_USER_STATUS,
  SAVE_TEMPLATE_DOCUMENT_FIELDS,
  SET_PROGRESS_STATUS,
  GET_APP_BASE_OBJECTS,
  UPLOAD_AND_CREATE_IMAGE,
  FETCH_TEMPLATE_OBJECTS,
  FETCH_USER_AGREEMENTS,
  ADD_EXISTING_AGREEMENTS,
  GRAY_OUT_BACKGROUND,
  SHOW_FIELD_VALUES_CHOICE_MODAL,
  SET_GET_FIELD_VALUE_DOCUMENT_OBJECT,
  SET_SELECTED_FIELD_OBJECT,
  // IMPORT_FIELD_FROM_OTHER_DOCUMENTS_ACTION,
  IMPORT_FIELD_FROM_OTHER_DOCUMENTS_OBJECT_ACTION,
  SET_SELECTED_AGREEMENT_ID_ARRAY,
  SET_EDIT_ACTION_BOX_CALL_FOR_ACTION_OBJECT,
  SET_CACHED_INITIAL_VALUES_OBJECT,
  SET_LAST_MOUNTED_DOCUMENT_ID,
  FETCH_DOCUMENT_FIELDS_FOR_PAGE,
  CACHE_DOCUMENT_FIELDS_FOR_REST_OF_PAGES
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
        // console.log('in action, index, sign in, esponse.data.data.user.email: ', response.data.data.user.email);
        // console.log('in action, index, sign in, esponse.data.data.user.id: ', response.data.data.user.id);
        // request is good
        // Update state to indicate user is authenticated
        // dispatch({ type: AUTH_USER, payload: email });
        // dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, id: response.data.data.user.id } });
        dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, id: response.data.data.user.id, image: response.data.data.user.image }, existing_user: response.data.data.existing_user });
        // dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, user_id: response.data.data.user.id } });
        // save JWT token
        // localStorage.setItem('token', response.data.token);
        // data.token for express server api
        //redirect to the route '/feature'

        // console.log('in action, signin user, .then, response, auth token: ', response.data.data.user.authentication_token);
        localStorage.setItem('token', response.data.data.user.authentication_token);
        localStorage.setItem('email', response.data.data.user.email);
        localStorage.setItem('id', response.data.data.user.id);
        localStorage.setItem('image', response.data.data.user.image);
        // localStorage.setItem('customerId', response.data.data.user.stripe_customer_id);
        // localStorage.setItem('customer_id', response.data.data.user.stripe_customer_id);
        // authentication_token for rails book review api
        // browserHistory.push('/feature');
        console.log('in action, index, sign in, after dispatch, response: ', response);
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
export function authFacebookUser(token, callback) {
  // reduxthunk allow return of function and edirect access to dispatch method
//dispatch accepts action and forwards to all reducers;
// main pipeline of redux; dispatch can wait for async
console.log('in action, index, authFacebookUser, email and password: ', token);
  // now can place lots of logic
  // console.log('in actions index, signinUser:');

  return function (dispatch) {
    // redux thunk let's us call dispatch method; returns action
    // submit email/password to the server
    // same as { email: email, password: password}
    // console.log({ sign_in: { email, password } });
    axios.post(`${ROOT_URL}/api/v1/facebook`, token)
    // axios.post(`${ROOT_URL}/sign_in`, { email, password })
    //signin for express server
      .then(response => {
        console.log('in action, index, authFacebookUser, response: ', response);
        // console.log('in action, index, sign in, esponse.data.data.user.email: ', response.data.data.user.email);
        // console.log('in action, index, sign in, esponse.data.data.user.id: ', response.data.data.user.id);
        // request is good
        // Update state to indicate user is authenticated
        // dispatch({ type: AUTH_USER, payload: email });
        // dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, id: response.data.data.user.id } });
        dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, id: response.data.data.user.id, image: response.data.data.user.image, existingUser: response.data.data.existing_user } });
        // dispatch({ type: AUTH_USER, payload: { email: response.data.data.user.email, user_id: response.data.data.user.id } });
        // save JWT token
        // localStorage.setItem('token', response.data.token);
        // data.token for express server api
        //redirect to the route '/feature'

        // console.log('in action, signin user, .then, response, auth token: ', response.data.data.user.authentication_token);
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

export function updateUser(formData, callback) {
  console.log('in actions index, updateUser, formData: ', formData);
  console.log('in actions index, updateUser: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = reviewAttributes;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/update_user`, formData, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to updateUser, response: ', response);
      // console.log('response to updateUser, response.data.data: ', response.data.data.user);
      localStorage.setItem('image', response.data.data.user.image);
      dispatch({
        type: UPDATE_USER,
        payload: response.data.data.user
      });
      // sends back to createreview.js the review_id and the images
      callback();
    })
    .catch((error) => {
      // take out error if hard coding error messages
      // if request is bad
      // show error to user
      console.log('action index, updateUser, catch, error.response.data.messages:', error.response.data.messages);
      dispatch(authError(error.response.data.messages));
      // dispatch(authError('Bad login info...'));
      this.showLoading()
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
  }; // end of return function
}

export function getCurrentUser() {
  const id = localStorage.getItem('id');
  const email = localStorage.getItem('email');
  const image = localStorage.getItem('image');
  console.log('in actions index, getCurrentUser, id, email, image:', id, email, image);
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
  console.log('in actions index, signoutUser localStorage.getItem(token):', localStorage.getItem('token'));

  return function (dispatch) {
    // redux thunk let's us call dispatch method; returns action
    // NOTE: axios call takes url, then an object for params, THEN an object for
    // request headers; use post not delete so that headers can be sent with auth token
    // otherwise, need to sent in uri
    axios.post(`${ROOT_URL}/api/v1/log_out`, {}, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
      .then(response => {
        console.log('in action, index, signoutUser, response: ', response);
        dispatch({ type: UNAUTH_USER });
        // delete token from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('id');
        localStorage.removeItem('image');
        // localStorage.removeItem('customer_id');
      })
        .catch((error) => {
          // take out error if hard coding error messages
          // if request is bad
          // show error to user
          console.log('action index, signoutUser, catch, error.response.data.messages:', error.response.data.messages);
          dispatch(authError(error.response.data.messages));
          // dispatch(authError('Bad login info...'));
        });
  };
}
// Keep just for reference; Did not logout from backend
// export function signoutUser(callback) {
//   console.log('in actions index, signoutUser:');
//
//   //flip state boolean authenticated to false
//   // delete token from local storage
//   localStorage.removeItem('token');
//   localStorage.removeItem('email');
//   localStorage.removeItem('id');
//   localStorage.removeItem('image');
//   // localStorage.removeItem('customer_id');
//   callback();
//   return { type: UNAUTH_USER };
// }

export function showSigninModal() {
  console.log('in actions index, showSigninModal:');

  //flip state boolean showSigninModal
  return { type: SHOW_SIGNIN_MODAL };
}
export function showSignupModal() {
  console.log('in actions index, showSigninModal:');

  //flip state boolean showSigninModal
  return { type: SHOW_SIGNUP_MODAL };
}

export function showAuthModal() {
  console.log('in actions index, showAuthModal:');

  //flip state boolean showAuthModal
  return { type: SHOW_AUTH_MODAL };
}

export function showResetPasswordModal() {
  console.log('in actions index, showResetPasswordModal:');

  //flip state boolean
  return { type: SHOW_RESET_PASSWORD_MODAL };
}

export function showProfileEditModal() {
  console.log('in actions index, showEditProfileModal:');

  //flip state boolean
  return { type: SHOW_PROFILE_EDIT_MODAL };
}

export function showProfileCreateModal() {
  console.log('in actions index, showCreateProfileModal:');

  //flip state boolean
  return { type: SHOW_PROFILE_CREATE_MODAL };
}

export function showBuildingLanguageCreateModal() {
  console.log('in actions index, showBuildingLanguageCreateModal:');

  //flip state boolean
  return { type: SHOW_BUILDING_LANGUAGE_CREATE_MODAL };
}

export function showBuildingLanguageEditModal() {
  console.log('in actions index, showBuildingLanguageEditModal:');

  //flip state boolean
  return { type: SHOW_BUILDING_LANGUAGE_EDIT_MODAL };
}

export function showDocumentInsertCreateModal() {
  console.log('in actions index, showDocumentInsertCreateModal:');

  //flip state boolean
  return { type: SHOW_DOCUMENT_INSERT_CREATE_MODAL };
}

export function showDocumentInsertEditModal() {
  console.log('in actions index, showDocumentInsertEditModal:');

  //flip state boolean
  return { type: SHOW_DOCUMENT_INSERT_EDIT_MODAL };
}

export function showSelectExistingDocumentModal(callback) {
  console.log('in actions index, showSelectExistingDocumentModal:');

  //flip state boolean
  callback();
  return { type: SHOW_SELECT_EXSITING_DOCUMENT_MODAL };
}

export function showInsertFieldCreateModal() {
  console.log('in actions index, showInsertFieldCreateModal:');

  //flip state boolean
  return { type: SHOW_INSERT_FIELD_CREATE_MODAL };
}

export function showInsertFieldEditModal() {
  console.log('in actions index, showInsertFieldEditModal:');

  //flip state boolean
  return { type: SHOW_INSERT_FIELD_EDIT_MODAL };
}

export function showGetFieldValuesChoiceModal(callback) {
  console.log('in actions index, showGetFieldValuesChoiceModal:');
  callback()
  //flip state boolean
  return { type: SHOW_FIELD_VALUES_CHOICE_MODAL };
}

export function setGetFieldValueDocumentObject(object) {
  console.log('in actions index, showInsertFieldEditModal:');

  return {
    type: SET_GET_FIELD_VALUE_DOCUMENT_OBJECT,
    payload: object
  };
}

export function setSelectedFieldObject(object) {
  console.log('in actions index, setSelectedFieldObject:');

  return {
    type: SET_SELECTED_FIELD_OBJECT,
    payload: object
  };
}

// export function importFieldsFromOtherDocumentsAction(boolean, callback) {
//   console.log('in actions index, importFieldsFromOtherDocumentsAction:');
//   // callback();
//   //flip state boolean only if false
//   // callback is importFieldsFromOtherDocumentsObjectAction
//   callback();
//   return {
    // type: IMPORT_FIELD_FROM_OTHER_DOCUMENTS_ACTION,
//     payload: boolean
//   };
// }

export function importFieldsFromOtherDocumentsObjectAction(object) {
  console.log('in actions index, importFieldsFromOtherDocumentsAction:');

  return {
    type: IMPORT_FIELD_FROM_OTHER_DOCUMENTS_OBJECT_ACTION,
    payload: object
  };
}

export function setSelectedAgreementIdArray(array) {
  console.log('in actions index, setSelectedAgreementIdArray, array:', array);

  return {
    type: SET_SELECTED_AGREEMENT_ID_ARRAY,
    payload: array
  };
}

export function setEditActionBoxCallForActionObject(object) {
  console.log('in actions index, setEditActionBoxCallForActionObject, object:', object);

  return {
    type: SET_EDIT_ACTION_BOX_CALL_FOR_ACTION_OBJECT,
    payload: object
  };
}

export function setCachedInitialValuesObject(object) {
  console.log('in actions index, setCachedInitialValuesObject, object:', object);

  return {
    type: SET_CACHED_INITIAL_VALUES_OBJECT,
    payload: object
  };
}

export function setLastMountedocumentId(object) {
  console.log('in actions index, setLastMountedocumentId, object:', object);

  return {
    type: SET_LAST_MOUNTED_DOCUMENT_ID,
    payload: object
  };
}

export function showLoading(callback) {
  // console.log('in actions index, showLoading:', callback);
  // if (callback) callback();
  if (typeof callback === 'function') callback();
  //flip state boolean
  return { type: SHOW_LOADING };
}

export function grayOutBackground(fromWhere) {
  console.log('in actions index, grayOutBackground:', fromWhere);

  //flip state boolean
  return { type: GRAY_OUT_BACKGROUND };
}

export function showLightbox() {
  console.log('in actions index, showLightbox:');

  //flip state boolean
  return { type: SHOW_LIGHTBOX };
}
export function showEditReview() {
  console.log('in actions index, showEditReview:');

  //flip state boolean
  return { type: SHOW_EDIT_REVIEW_MODAL };
}

export function searchFlatParameters(searchParameters) {
  console.log('in actions searchFlatParameters, searchParameters:', searchParameters);
  //flip state boolean
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
    // console.log('in action index, fetchFlatsByUser, id: ', id);

  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/users/flats`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to fetchFlatsByUser: ', response);
      // console.log('in action index, response to fetchFlatsByUser: ', response.data.data.flats);
      dispatch({
        type: FETCH_FLATS_BY_USER,
        payload: response.data.data.flats
      });

      const flatIdArray = [];
      _.each(response.data.data.flats, (flat) => {
        // console.log('in action index, response to fetchFlatsByUser, each: ', flat);
        flatIdArray.push(flat.id.toString());
      });

      // console.log('in action index, response to fetchFlatsByUser, flatIdArray: ', flatIdArray);
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
      if (conversation.length > 0) {
        console.log('in action index, fetchConversationByFlat, if conversation.length === 0: ', conversation.length == 0);
        dispatch({
          type: NO_CONVERSATION_FOR_FLAT
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

// export function fetchConversationByUserAndFlat(flatIdArray) {
//   //flatIds is an array
//   console.log('in action index, fetchConversationByUserAndFlat, flatIdArray: ', flatIdArray);
//
//   return function (dispatch) {
//     axios.post(`${ROOT_URL}/api/v1/users/conversations/conversations_by_user_and_flat`, { conversation: { flat_id_array: flatIdArray } }, {
//       headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
//     })
//     .then(response => {
//       console.log('in action index, response to fetchConversationByUserAndFlat: ', response);
//       console.log('in action index, response to fetchConversationByUserAndFlat: ', response.data.data.conversations);
//       const { conversations } = response.data.data;
//       if (conversations.length === 0) {
//         console.log('in action index, fetchConversationByFlatAndUser, if conversation.length === 0: ', conversations.length === 0);
//         dispatch({
//           type: NO_CONVERSATION
//         });
//       }
//       dispatch({
//         type: FETCH_CONVERSATION_BY_USER_AND_FLAT,
//         payload: response.data.data.conversations
//       });
//     })
//     .catch(error => {
//       console.log('in action index, catch error to fetchConversationByUserAndFlat: ', error);
//     });
//   };
// }
export function fetchConversationsByUser(callback) {
  // better way to do this thn fetchConversationByUserAndFlat
  // gets @user to get conversation where user_id is @user.id and @flats where user id is user_id
  // console.log('in actions index, fetchConversationsByUser: localStorage.getItem, token; ', localStorage.getItem('token'));
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1//users/conversations/conversations_by_user`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to fetchConversationsByUser: ', response);
      // console.log('in action index, response to fetchConversationsByUser: ', response.data.data.conversations);
      // const { conversations } = response.data.data;
      // if (conversations.length === 0) {
      //   console.log('in action index, fetchConversationByFlatAndUser, if conversation.length === 0: ', conversations.length === 0);
      //   dispatch({
      //     type: NO_CONVERSATION
      //   });
      // }
      dispatch({
        type: FETCH_CONVERSATIONS_BY_USER,
        payload: response.data.data
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to fetchConversationsByUser: ', error);
      dispatch({
        type: NO_CONVERSATION
      });
    });
  };
}

export function setNoConversation() {
  console.log('in actions index, setNoConversation ');
  return {
    type: NO_CONVERSATION
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
    axios.post(`${ROOT_URL}/api/v1/conversations`, { conversation: conversationAttributes, message: messageAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createConversation, response: ', response);
      console.log('response to createConversation, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_CONVERSATION,
        payload: response.data.data
        // payload: response.data.data.conversation
      });
      // const conversationId = response.data.data.conversation.id;
      // const userId = response.data.data.conversation.user_id;
      // const newMessageAttributes = messageAttributes;
      // const convId = 'conversation_id';
      // const uId = 'user_id';
      //
      // newMessageAttributes[convId] = conversationId;
      // newMessageAttributes[uId] = userId;
      callback();
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
// export function fetchMessage() {
//   console.log('in actions index, fetchMessage:');
//
//   return function (dispatch) {
//     axios.get(ROOT_URL, {
//       headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
//     })
//     .then(response => {
//       dispatch({
//         type: FETCH_MESSAGE,
//         payload: response.data.message
//       });
//     });
//   };
// }

// Gets map dimansions (lat, lng, zoom and center);
// Requred to render map when there are no flats in the panned area
export function updateMapDimensions(mapDimensions, callback) {
  console.log('in actions index, updateMapDimensions: ', mapDimensions);
  callback();
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
export function selectedFlatFromParams(id, callback) {
  console.log('in actions index, selectedFlatFromParams id: ', id);
  // url for flats#show/id
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/flats/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      // console.log('in actions index, response to selectedFlatFromParams, response.data.data.flat: ', response.data.data.flat);
      console.log('in actions index, response to selectedFlatFromParams, response: ', response);
      // SELECTED_FLAT_FROM_PARAMS in flat reducer and conversation reducer for user_status
      dispatch({
        type: SELECTED_FLAT_FROM_PARAMS,
        payload: response.data.data
    });
    callback();
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

  // const { flat_id, user_email, date_start, date_end, booking_by_owner } = bookingRequest;
  return function (dispatch) {
    // axios.post(`${ROOT_URL}/api/v1/bookings`, { booking: { flat_id, user_email, date_start, date_end, booking_by_owner } }, {
    axios.post(`${ROOT_URL}/api/v1/bookings`, bookingRequest, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
      .then(response => {
        callback(response.data.data.booking.id);
        console.log('response to requestBooking: ', response.data.data);
        dispatch({
          type: REQUEST_BOOKING,
          payload: response.data.data
        });
      })
      .catch(error => {
        console.log('in action index, catch error to requestBooking: ', error);
        dispatch(authError(error.message));
        // this.showloading();
      });
  };
}

export function editBooking(bookingAttributes, callback) {
  const { id } = bookingAttributes;
  console.log('in actions index, editBooking, bookingAttributes: ', bookingAttributes);
  console.log('in actions index, editBooking: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/bookings/${id}`, { booking: bookingAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to editBooking, response: ', response);
      console.log('response to editBooking, response.data.data: ', response.data.data.booking);
      dispatch({
        type: EDIT_BOOKING,
        payload: response.data.data.booking
      });
      // sends back to createflat.js the flat_id and the images
      callback();
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
      console.log('response to fetchBooking: ', response.data.data);
      dispatch({
        type: FETCH_BOOKING,
        payload: response.data.data
      });
    });
  };
}

export function emptyBookingData() {
  console.log('in actions index, emptyBookingData:');
  return function (dispatch) {
    dispatch({ type: EMPTY_BOOKING_DATA, payload: null });
  };
}

export function emptySelectedFlatFromParams() {
  console.log('in actions index, emptySelectedFlatFromParams:');
  return function (dispatch) {
    dispatch({ type: EMPTY_SELECTED_FLAT_FROM_PARAMS, payload: null });
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
      console.log('response to deleteBooking, response.data.data: ', response.data.data.flats);
      dispatch({
        type: DELETE_BOOKING,
        payload: response.data.data.flats
      });
      // redirects to mypage
      callback();
      // window.alert('Deleted booking');
    });
    //end of then
  };
  //end of return function
}

export function createFlat(flatFormData, callback) {
// NOTE: Flat params are sent in formData (multippart/form data)
// with flat params, amenity params and image files
// Axios appears to convert the image uri to imdage data to be sent
// Rails backend converts the multipart/form data in an actiondispatch object;
  console.log('in actions index, createFlat, flatFormData: ', flatFormData);
  console.log('in actions index, createFlat: localStorage.getItem, token; ', localStorage.getItem('token'));

  return function (dispatch) {
    // axios.post(`${ROOT_URL}/api/v1/flats`, { flat: flatFormData.flat, files: flatFormData.files, amenity: flatFormData.amenity }, {
    axios.post(`${ROOT_URL}/api/v1/flats`, flatFormData, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createFlat, response: ', response);
      console.log('response to createFlat, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_FLAT
      });
      // sends back to createflat.js the flat_id and the images
      callback(response.data.data.flat.id);
    })
    .catch(error => {
      console.log('in action index, catch error to createFlat: ', error);
      dispatch(authError(error.message));
      this.showloading();
    });
  };
}

export function createMessage(messageAttributes, callback) {
  console.log('in actions index, createMessage, messageAttributes: ', messageAttributes);
  console.log('in actions index, createMessage: localStorage.getItem, token; ', localStorage.getItem('token'));

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/conversations/${messageAttributes.conversation_id}/messages`, { message: messageAttributes, booking_id: messageAttributes.booking_id }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      // console.log('response to createMessage, response: ', response);
      console.log('response to createMessage, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_MESSAGE,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback(response.data.data.conversation.flat_id);
    });
  };
}

export function editUserFlat(flatAttributes, callback) {
  const { flat_id } = flatAttributes;
  console.log('in actions index, editUserFlat, flatAttributes: ', flatAttributes);
  // console.log('in actions index, editFlat, flat_id: ', flat_id);
  console.log('in actions index, editUserFlat: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/flats/${flat_id}`, { flat: flatAttributes.flat, amenity: flatAttributes.amenity }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to editFlat, response: ', response);
      // console.log('response to editFlat, response.data.data: ', response.data.data.flat);
      dispatch({
        type: EDIT_FLAT,
        payload: response.data.data.flat
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
      // console.log('response to editProfile, response.data.data: ', response.data.data.user);
      dispatch({
        type: EDIT_PROFILE,
        payload: response.data.data.user
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function createProfile(profileAttributes, callback) {
  // const { id } = profileAttributes;
  console.log('in actions index, createProfile, profileAttributes: ', profileAttributes);
  console.log('in actions index, createProfile: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/profiles`, { profile: profileAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createProfile, response: ', response);
      // console.log('response to createProfile, response.data.data: ', response.data.data.profile);
      dispatch({
        type: CREATE_PROFILE,
        payload: response.data.data.user
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function deleteProfile(id, callback) {
  // const { id } = profileAttributes;
  // console.log('in actions index, deleteProfile, profileAttributes: ', profileAttributes);
  console.log('in actions index, deleteProfile: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/profiles/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to deleteProfile, response: ', response);
      // console.log('response to deleteProfile, response.data.data: ', response.data.data);
      dispatch({
        type: DELETE_PROFILE,
        payload: response.data.data.user
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
      // console.log('response to deleteFlat, response.data.data: ', response.data.data);
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
  // console.log('in actions index, createImage, imagesArray: ', imagesArray);
  // console.log('in actions index, createImage: localStorage.getItem, token: ', localStorage.getItem('token'));
  // console.log('in actions index, createImage: imageCount: ', imageCount);
  // console.log('in actions index, createImage: flatId: ', flatId);
  const image = imagesArray[imageCount];
  console.log('in actions index, createImage: image: ', image);

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/images`, { publicid: image, flat_id: flatId }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createImage, response: ', response);
      // console.log('response to createImage, response.data.data.image: ', response.data.data.image);

      callback(imagesArray, imageCount, response.data.data.image.flat_id);
      dispatch({
        type: CREATE_IMAGE,
        payload: response.data.data.image
      });
    });
  };
}

export function uploadAndCreateImage(formData, callback) {
  console.log('in actions index, uploadAndCreateImage: formData: ', formData);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/images/upload_for_flat`, formData, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to uploadAndCreateImage, response: ', response);
      // console.log('response to createImage, response.data.data.image: ', response.data.data.image);

      callback(response.data.data.flat.id);
      dispatch({
        type: UPLOAD_AND_CREATE_IMAGE,
        payload: response.data.data.flat
      });
    })
    .catch(error => {
      console.log('in action index, catch error to uploadAndCreateImage: ', error);
      dispatch(authError(error.message));
      this.showloading();
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

export function deleteImages(deleteImageArray, flatId, callback) {
  console.log('in actions index, createImage: deleteImageArray: ', deleteImageArray);

  // const { } = flatAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/images/destroy_images/`, { destroy_image_array: deleteImageArray, flat_id: flatId }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to deleteImages, response: ', response);
      // console.log('response to deleteImages, response.data.data: ', response.data.data);

      callback();
      dispatch({
        type: DELETE_IMAGES,
        payload: response.data.data
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

export function fetchProfileForUser(callback) {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/users/profiles/profile_for_user?`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchProfileForUser, response: ', response);
      console.log('response to fetchProfileForUser, response.data.data.profile: ', response.data.data);
      // callback to fetchCustomer
      if (response.data.data.profile.user.stripe_customer_id) {
        callback();
      }
      dispatch({
        type: FETCH_PROFILE_FOR_USER,
        payload: response.data.data
      });
    });
  };
}
export function fetchReviewForBookingByUser(booking_id) {
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

export function createPlace(placeAttributes, callback) {
  const { flatId, placeid, lat, lng, place_name, category, duration, distance, language } = placeAttributes;
  // console.log('in actions index, createPlace, localStorage.getItem, token: ', localStorage.getItem('token'));
  // console.log('in actions index, createPlace, flatId: ', flatId);
  // console.log('in actions index, createPlace, placeid: ', placeid);
  // console.log('in actions index, createPlace, lat: ', lat);
  // console.log('in actions index, createPlace, lng: ', lng);
  // console.log('in actions index, createPlace, category: ', category);
  console.log('in actions index, createPlace, language: ', language);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/flats/${flatId}/places`, { place: { placeid, place_name, lat, lng, category, duration, distance, language } }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createPlace, response: ', response);
      console.log('response to createPlace, response.data.data.image: ', response.data.data.places);
      // the response is a new array of places
      dispatch({
        type: CREATE_PLACE,
        payload: response.data.data
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
        payload: response.data.data
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

export function newCustomer(info, callback) {
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
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to newCustomer: ', error);
      dispatch(authError(error.response.data.messages));
      this.showloading();
    });
  };
}

export function updateCardInfo(info, callback) {
  console.log('in action index, updateCardInfo, info: ', info);
  // const { cardId, customerId, expYear, expMonth } = info;
  // console.log('in action index, updateCardInfo, info.email: ', info.client);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/update_card_info`, info, {
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
      dispatch(authError(error.response.data.messages));
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
      dispatch(authError(error.response.data.messages));
    });
  };
}
export function deleteCard(cardId, callback) {
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
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to deleteCard: ', error);
      dispatch(authError(error.response.data.messages));
    });
  };
}
export function addCard(info, callback) {
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
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to addCard: ', error);
      dispatch(authError(error.response.data.messages));
      this.showloading();
    });
  };
}
export function updateCustomer(info, callback) {
  console.log('in action index, fetchCustomer: ');

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/update_customer`, { cardId: info.cardId }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to updateCustomer: ', response);
      console.log('in action index, response to updateCustomer: ', response.data.data.customer);

      dispatch({
        type: UPDATE_CUSTOMER,
        payload: response.data.data.customer
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to updateCustomer: ', error);
      dispatch(authError(error.response.data.messages));
    });
  };
}
export function makePayment(info, callback) {
  console.log('in action index, makePayment: ', info);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/make_payment`, info, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to makePayment: ', response);
      console.log('in action index, response to makePayment: ', response.data.data.charge);

      dispatch({
        type: MAKE_PAYMENT,
        payload: response.data.data.charge
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to makePayment: ', error);
      dispatch(authError(error));
    });
  };
}

export function fetchStripeUserCredentials(info, callback) {
  console.log('in action index, fetchStripeUserCredentials: ', info);

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/get_user_credentials`, info, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to fetchStripeUserCredentials: ', response);
      console.log('in action index, response to fetchStripeUserCredentials: ', response.data.data.client_id);

      dispatch({
        type: FETCH_STRIPE_USER_CREDENTIALS,
        payload: response.data.data.client_id
      });
      callback(response.data.data.client_id);
    })
    .catch(error => {
      console.log('in action index, catch error to makePayment: ', error);
      dispatch(authError(error));
    });
  };
}

export function showCardInputModal() {
  console.log('in actions index, showCardInputModal:');

  //flip state boolean
  return { type: SHOW_CARD_INPUT_MODAL };
}
export function selectedCard(card, callback) {
  console.log('in actions index, selectedcard:', card);
  callback();
  //flip state boolean
  return { type: SELECTED_CARD, payload: card };
}
export function actionTypeCard(action) {
  console.log('in actions index, actionTypeCard:', action);

  //flip state boolean
  return { type: ACTION_TYPE_CARD, payload: action };
}
export function selectedLanguage(language) {
  console.log('in actions index, selectedLanguage:', language);
  return { type: SELECTED_LANGUAGE, payload: language };
}
// This is for the entire app
export function setAppLanguageCode(languageCode) {
  console.log('in actions index, setLanguageCode:', languageCode);
  localStorage.setItem('appLanguageCode', languageCode)
  return { type: SET_APP_LANGUAGE_CODE, payload: languageCode };
}

export function setDocumentLanguageCode(languageCode) {
  console.log('in actions index, setDocumentLanguageCode:', languageCode);
  localStorage.setItem('documentLanguageCode', languageCode)
  return { type: SET_DOCUMENT_LANGUAGE_CODE, payload: languageCode };
}

export function showLanguageCreateModal() {
  console.log('in actions index, showLanguageCreateModal:');

  //flip state boolean
  return { type: SHOW_LANGUAGE_CREATE_MODAL };
}
export function showLanguageEditModal() {
  console.log('in actions index, showLanguageCreateModal:');

  //flip state boolean
  return { type: SHOW_LANGUAGE_EDIT_MODAL };
}

export function createFlatLanguage(flatLanguageAttributes, callback) {
    console.log('in action index, createFlatLanguage, flatLanguageAttributes: ', flatLanguageAttributes);
  const { flat_id } = flatLanguageAttributes;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/flats/${flat_id}/flat_languages`, { flat_language: flatLanguageAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to createFlatLanguage: ', response);
      console.log('in action index, response to createFlatLanguage: ', response.data.data.flat);

      dispatch({
        type: CREATE_FLAT_LANGUAGE,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to createFlatLanguage: ', error);
      dispatch(authError(error));
      this.showloading();
    });
  };
}

export function updateFlatLanguage(flatLanguageAttributes, callback) {
    console.log('in action index, updateFlatLanguage, flatLanguageAttributes: ', flatLanguageAttributes);
  const { flat_id, id } = flatLanguageAttributes;

  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/flats/${flat_id}/flat_languages/${id}`, { flat_language: flatLanguageAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to updateFlatLanguage: ', response);
      console.log('in action index, response to updateFlatLanguage: ', response.data.data.flat);

      dispatch({
        type: UPDATE_FLAT_LANGUAGE,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to updateFlatLanguage: ', error);
      dispatch(authError(error));
      this.showloading();
    });
  };
}

export function deleteFlatLanguage(languageAttributes, callback) {
    console.log('in action index, deleteFlatLanguage, languageAttributes: ', languageAttributes);
  const { flat_id, id } = languageAttributes;

  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/flats/${flat_id}/flat_languages/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to deleteFlatLanguage: ', response);
      console.log('in action index, response to deleteFlatLanguage: ', response.data.data.flat);

      dispatch({
        type: DELETE_FLAT_LANGUAGE,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to deleteFlatLanguage: ', error);
      dispatch(authError(error));
      this.showloading();
    });
  };
}

export function fetchIcal(url) {
    console.log('in action index, fetchIcal, url: ', url);
  // const { flat_id, id } = languageAttributes;
  //https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141#43881141
  //https://github.com/axios/axios/issues/853
  const proxyurl = 'https://cors-anywhere.herokuapp.com/';

  return function (dispatch) {
    // axios.get(url, { headers: { 'Access-Control-Allow-Origin': '*' } })
    axios.get(proxyurl + url, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })
    // axios.get(url, { crossdomain: 'true' })
    // axios.get(url, { headers: { 'Access-Control-Allow-Origin': 'https://calendar.google.com' } })
    .then(response => {
      // console.log('in action index, response to fetchIcal: ', response);
      // console.log('in action index, response.data to fetchIcal: ', response.data);

      dispatch({
        type: FETCH_ICAL,
        payload: response.data
      });
      // callback();
    })
    .catch(error => {
      console.log('in action index, catch error to fetchIcal: ', error);
      dispatch(authError(error));
      // this.showloading();
    });
  };
}
export function syncCalendars(flatId) {
    // console.log('in action index, syncCalendars, url: ', url);
  // const { flat_id, id } = languageAttributes;
  //https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141#43881141
  //https://github.com/axios/axios/issues/853
  // const proxyurl = 'https://cors-anywhere.herokuapp.com/';

  return function (dispatch) {
    // axios.get(url, { headers: { 'Access-Control-Allow-Origin': '*' } })
    axios.post(`${ROOT_URL}/api/v1/blockout_dates_ical`, flatId, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to syncCalendars: ', response);
      console.log('in action index, response.data to syncCalendars: ', response.data.data.flat);

      dispatch({
        type: SYNC_CALENDARS,
        payload: response.data.data.flat
      });
      // callback();
    })
    .catch(error => {
      console.log('in action index, catch error to syncCalendars: ', error);
      dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function createIcalendar(iCalendarAttributes, callback) {
    console.log('in action index, createIcalendar, iCalendarAttributes: ', iCalendarAttributes);
  const { flat_id } = iCalendarAttributes;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/flats/${flat_id}/calendars`, { calendars: iCalendarAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to createIcalendar: ', response);
      console.log('in action index, response to createIcalendar: ', response.data.data.flat);

      dispatch({
        type: CREATE_ICALENDAR,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to createIcalendar: ', error);
      dispatch(authError(error));
      this.showloading();
    });
  };
}

export function selectedIcalendarId(id) {
  console.log('in actions index, selectedIcalendar id:', id);
  return { type: SELECTED_ICALENDAR_ID, payload: id };
}

export function showIcalendarCreateModal() {
  console.log('in actions index, showIcalendarCreateModal:');

  //flip state boolean
  return { type: SHOW_ICALENDAR_CREATE_MODAL };
}
export function showIcalendarEditModal() {
  console.log('in actions index, showIcalendarEditModal:');

  //flip state boolean
  return { type: SHOW_ICALENDAR_EDIT_MODAL };
}

export function updateIcalendar(iCalendarAttributes, callback) {
  console.log('in action index, updateIcalendar, iCalendarAttributes: ', iCalendarAttributes);
  const { flat_id, id } = iCalendarAttributes;

  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/flats/${flat_id}/calendars/${id}`, { calendars: iCalendarAttributes }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to updateIcalendar: ', response);
      console.log('in action index, response to updateIcalendar: ', response.data.data.flat);

      dispatch({
        type: UPDATE_ICALENDAR,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to updateIcalendar: ', error);
      dispatch(authError(error));
      this.showloading();
    });
  };
}

export function deleteIcalendar(iCalendarAttributes, callback) {
    console.log('in action index, deleteIcalendar, iCalendarAttributes: ', iCalendarAttributes);
  const { flat_id, id } = iCalendarAttributes;

  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/flats/${flat_id}/calendars/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to deleteIcalendar: ', response);
      console.log('in action index, response to deleteIcalendar: ', response.data.data.flat);

      dispatch({
        type: DELETE_ICALENDAR,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to deleteIcalendar: ', error);
      dispatch(authError(error));
      this.showloading();
    });
  };
}

export function createContract(contractAttributes, callback) {
  console.log('in action index, createContract, contractAttributes: ', contractAttributes);
  // const { flat_id } = contractAttributes;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/create_contract`, contractAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to createContract: ', response);
      console.log('in action index, response to createContract: ', response.data.data);

      dispatch({
        type: CREATE_CONTRACT,
        payload: response.data.data
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to createContract: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}
export function updateBuilding(buildingAttributes, callback) {
  console.log('in action index, updateBuilding, buildingAttributes: ', buildingAttributes);
  const { building_id } = buildingAttributes;

  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/buildings/${building_id}`, buildingAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to updateBuilding: ', response);
      console.log('in action index, response to updateBuilding: ', response.data.data.flat);

      dispatch({
        type: UPDATE_BUILDING,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to updateBuilding: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}
export function createBuilding(buildingAttributes, callback) {
  console.log('in action index, createBuilding, buildingAttributes: ', buildingAttributes);
  const { building_id } = buildingAttributes;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/buildings/`, buildingAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to createBuilding: ', response);
      console.log('in action index, response to createBuilding: ', response.data.data.flat);

      dispatch({
        type: CREATE_BUILDING,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to createBuilding: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function createDocumentElementLocally(object) {
  console.log('in actions index, createDocumentElementLocally array:', object);
  return { type: CREATE_DOCUMENT_ELEMENT_LOCALLY, payload: object };
}

export function updateDocumentElementLocally(array) {
  console.log('in actions index, updateDocumentElementLocally array:', array);
  return { type: UPDATE_DOCUMENT_ELEMENT_LOCALLY, payload: array };
}

export function deleteDocumentElementLocally(props) {
  console.log('in actions index, deleteDocumentElementLocally props:', props);
  props.callback();
  return { type: DELETE_DOCUMENT_ELEMENT_LOCALLY, payload: props };
}

export function populateTemplateElementsLocally(array, callback, templateEditHistory, agreement) {
  console.log('in actions index, populateTemplateElementsLocally array, callback, templateEditHistory:', array, callback, templateEditHistory);
  callback();
  // if (runShowLoading) this.showLoading()
  return { type: POPULATE_TEMPLATE_ELEMENTS_LOCALLY, payload: { array, templateEditHistory, agreement } };
}

export function searchBuildings(buildingAttributes) {
  console.log('in action index, searchBuildings, buildingAttributes: ', buildingAttributes);
  // const { flat_id } = buildingAttributes;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/search_buildings`, buildingAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to searchBuildings: ', response);
      console.log('in action index, response to searchBuildings: ', response.data.data.buildings);

      dispatch({
        type: SEARCH_BUILDINGS,
        payload: response.data.data.buildings
      });
      // callback();
    })
    .catch(error => {
      console.log('in action index, catch error to searchBuildings: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function showBuildingEditModal() {
  console.log('in actions index, showBuildingEditModal:');

  //flip state boolean
  return { type: SHOW_BUILDING_EDIT_MODAL };
}
export function showBuildingCreateModal() {
  console.log('in actions index, showBuildingCreateModal:');

  //flip state boolean
  return { type: SHOW_BUILDING_CREATE_MODAL };
}

export function showBankAccountEditModal() {
  console.log('in actions index, showBankAccountEditModal:');

  //flip state boolean
  return { type: SHOW_BANK_ACCOUNT_EDIT_MODAL };
}

export function showBankAccountCreateModal() {
  console.log('in actions index, showBankAccountCreateModal:');

  //flip state boolean
  return { type: SHOW_BANK_ACCOUNT_CREATE_MODAL };
}

export function showFacilityCreateModal() {
  console.log('in actions index, showFacilityCreateModal:');

  //flip state boolean
  return { type: SHOW_FACILITY_CREATE_MODAL };
}

export function showFacilityEditModal() {
  console.log('in actions index, showFacilityEditModal:');

  //flip state boolean
  return { type: SHOW_FACILITY_EDIT_MODAL };
}

export function showInspectionCreateModal() {
  console.log('in actions index, showInspectionCreateModal:');

  //flip state boolean
  return { type: SHOW_INSPECTION_CREATE_MODAL };
}

export function showInspectionEditModal() {
  console.log('in actions index, showInspectionEditModal:');

  //flip state boolean
  return { type: SHOW_INSPECTION_EDIT_MODAL };
}

export function showContractorEditModal() {
  console.log('in actions index, showContractorEditModal:');

  //flip state boolean showContractorEditModal
  return { type: SHOW_CONTRACTOR_EDIT_MODAL };
}

export function showContractorCreateModal() {
  console.log('in actions index, showContractorCreateModal:');

  //flip state boolean showContractorCreateModal
  return { type: SHOW_CONTRACTOR_CREATE_MODAL };
}
export function showStaffEditModal() {
  console.log('in actions index, showStaffEditModal:');

  //flip state boolean showStaffEditModal
  return { type: SHOW_STAFF_EDIT_MODAL };
}

export function showStaffCreateModal() {
  console.log('in actions index, showStaffCreateModal:');

  //flip state boolean showStaffCreateModal
  return { type: SHOW_STAFF_CREATE_MODAL };
}

export function addNewContractor() {
  console.log('in actions index, addNewContractor:');

  //flip state boolean showStaffCreateModal
  return { type: ADD_NEW_CONTRACTOR };
}
export function addNewStaff() {
  console.log('in actions index, addNewStaff:');

  //flip state boolean addNewStaff
  return { type: ADD_NEW_STAFF };
}

export function selectedBankAccountId(id) {
  console.log('in actions index, selectedBankAccountId:');

  //flip state boolean
  return { type: SELECTED_BANK_ACCOUNT_ID, payload: id };
}

export function selectedFacilityId(id) {
  console.log('in actions index, selectedFacilityId:');

  //flip state boolean
  return { type: SELECTED_FACILITY_ID, payload: id };
}
export function selectedInspectionId(id) {
  console.log('in actions index, selectedInspectionId:');

  //flip state boolean
  return { type: SELECTED_INSPECTION_ID, payload: id };
}

export function selectedContractorId(id) {
  console.log('in actions index, selectedContractorId:');

  //flip state boolean
  return { type: SELECTED_CONTRACTOR_ID, payload: parseInt(id, 10) };
}

export function contractorToEditId(id) {
  console.log('in actions index, contractorToEditId:');

  //flip state boolean
  return { type: CONTRACTOR_TO_EDIT_ID, payload: parseInt(id, 10) };
}

export function staffToEditId(id) {
  console.log('in actions index, staffToEditId:');

  //flip state boolean
  return { type: STAFF_TO_EDIT_ID, payload: parseInt(id, 10) };
}

export function profileToEditId(id) {
  console.log('in actions index, profileToEditId:');

  //flip state boolean
  return { type: PROFILE_TO_EDIT_ID, payload: parseInt(id, 10) };
}

export function buildingLanguageToEditId(id) {
  console.log('in actions index, buildingLanguageToEditId:');

  //flip state boolean
  return { type: BUILDING_LANGUAGE_TO_EDIT_ID, payload: parseInt(id, 10) };
}

export function insertFieldToEditId(id) {
  console.log('in actions index, insertFieldToEditId:');

  //flip state boolean
  return { type: INSERT_FIELD_TO_EDIT_ID, payload: parseInt(id, 10) };
}

export function selectedBuildingLanguageId(id) {
  console.log('in actions index, selectedBuildingLanguageId:');

  //flip state boolean
  return { type: SELECTED_BUILDING_LANGUAGE_ID, payload: parseInt(id, 10) };
}

export function selectedBuildingId(id) {
  console.log('in actions index, selectedBuildingId:');

  //flip state boolean
  return { type: SELECTED_BUILDING_ID, payload: parseInt(id, 10) };
}

export function selectedProfileId(id) {
  console.log('in actions index, selectedProfileId:', id);

  //flip state boolean
  return { type: SELECTED_PROFILE_ID, payload: parseInt(id, 10) };
}

export function selectedStaffId(id) {
  console.log('in actions index, selectedStaffId:');

  //flip state boolean
  return { type: SELECTED_STAFF_ID, payload: parseInt(id, 10) };
}

export function setCreateDocumentKey(key, callback) {
  console.log('in actions index, setCreateDocumentKey:', key);
  callback();
  //flip state boolean
  return { type: SET_CREATE_DOCUMENT_KEY, payload: key };
}

export function requiredFields(array) {
  console.log('in actions index, requiredFields, array:', array);

  // payload goes to booking reducer
  return { type: REQUIRED_FIELDS, payload: array };
}

export function bookingRequestData(object, callback) {
  console.log('in actions index, bookingRequestData, object:', object);
  callback()
  // payload goes to booking reducer
  return { type: BOOKING_REQUEST_DATA, payload: object };
}

export function fetchBankAccountsByUser() {
  // console.log('in actions index, fetchUserBankAccounts allSearchAttributes: ', allSearchAttributes);
  return function (dispatch) {
    // axios.get(`${ROOT_URL}/api/v1/flats?`, { params: { north, south, east, west, price_max, price_min, bedrooms_min, bedrooms_max, bedrooms_exact, size_min, size_max, station_min, station_max, ac, wifi, wheelchair_accessible, parking, kitchen } }, {
    axios.get(`${ROOT_URL}/api/v1/bank_accounts`, {
      // axios.get(`${ROOT_URL}/api/v1/flats?`, { params: { north, south, east, west } }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchUserBankAccounts, response: ', response);
      console.log('response to fetchUserBankAccounts, response.data.data: ', response.data.data);
      dispatch({
        type: FETCH_BANK_ACCOUNTS_BY_USER,
        payload: response.data.data.bank_accounts
      });
    });
  };
}

export function createBankAccount(bankAccountAttributes, callback) {
  console.log('in action index, createBankAccount, bankAccountAttributes: ', bankAccountAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/bank_accounts/`, bankAccountAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to createBankAccount: ', response);
      console.log('in action index, response to createBankAccount: ', response.data.data.bank_accounts);

      dispatch({
        type: CREATE_BANK_ACCOUNT,
        payload: response.data.data.bank_accounts
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to createBankAccount: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}
export function updateBankAccount(bankAccountAttributes, id, callback) {
  console.log('in action index, updateBankAccount, bankAccountAttributes: ', bankAccountAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/bank_accounts/${id}`, bankAccountAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to updateBankAccount: ', response);
      console.log('in action index, response to updateBankAccount: ', response.data.data.bank_accounts);

      dispatch({
        type: UPDATE_BANK_ACCOUNT,
        payload: response.data.data.bank_accounts
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to updateBankAccount: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}
export function deleteBankAccount(id, callback) {
  console.log('in action index, deleteBankAccount: ');
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/bank_accounts/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to deleteBankAccount: ', response);
      console.log('in action index, response to deleteBankAccount: ', response.data.data.bank_accounts);

      dispatch({
        type: UPDATE_BANK_ACCOUNT,
        payload: response.data.data.bank_accounts
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to deleteBankAccount: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function updateFacility(facilityAttributes, id, callback) {
  console.log('in action index, updateFacility, facilityAttributes: ', facilityAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/facilities/${id}`, facilityAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to updateFacility: ', response);
      console.log('in action index, response to updateFacility: ', response.data.data.flat);

      dispatch({
        type: UPDATE_FACILITY,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to updateFacility: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function deleteFacility(id, callback) {
  // console.log('in action index, deleteFacility, facilityAttributes: ', facilityAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/facilities/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to deleteFacility: ', response);
      console.log('in action index, response to deleteFacility: ', response.data.data.flat);

      dispatch({
        type: DELETE_FACILITY,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to deleteFacility: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}
export function createFacility(facilityAttributes, callback) {
  console.log('in action index, createFacility, facilityAttributes: ', facilityAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/facilities/`, facilityAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to createFacility: ', response);
      console.log('in action index, response to createFacility: ', response.data.data.flat);

      dispatch({
        type: CREATE_FACILITY,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to createFacility: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function createInspection(inspectionAttributes, callback) {
  console.log('in action index, createInspection, inspectionAttributes: ', inspectionAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/inspections/`, inspectionAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to createInspection: ', response);
      console.log('in action index, response to createInspection: ', response.data.data.flat);

      dispatch({
        type: CREATE_INSPECTION,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to createInspection: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function updateInspection(inspectionAttributes, id, callback) {
  console.log('in action index, updateInspection, inspectionAttributes: ', inspectionAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/inspections/${id}`, inspectionAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to updateInspection: ', response);
      console.log('in action index, response to updateInspection: ', response.data.data.flat);

      dispatch({
        type: UPDATE_INSPECTION,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to updateInspection: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}
export function deleteInspection(id, callback) {
  // console.log('in action index, deleteInspection, facilityAttributes: ', facilityAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/inspections/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to deleteInspection: ', response);
      console.log('in action index, response to deleteInspection: ', response.data.data.flat);

      dispatch({
        type: DELETE_INSPECTION,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to deleteInspection: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function createContractor(contractorAttributes, callback) {
  console.log('in action index, createContractor, contractorAttributes: ', contractorAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/contractors/`, contractorAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to createContractor: ', response);
      console.log('in action index, response to createContractor: ', response.data.data.user);

      dispatch({
        type: CREATE_CONTRACTOR,
        payload: response.data.data.user
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to createContractor: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function updateContractor(contractorAttributes, callback) {
  console.log('in action index, updateContractor, contractorAttributes: ', contractorAttributes);
  const { id } = contractorAttributes;

  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/contractors/${id}`, contractorAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to updateContractor: ', response);
      console.log('in action index, response to updateContractor: ', response.data.data.user);

      dispatch({
        type: UPDATE_CONTRACTOR,
        payload: response.data.data.user
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to updateContractor: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function deleteContractor(id, callback) {
  // console.log('in action index, deleteContractor, facilityAttributes: ', facilityAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/contractors/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to deleteContractor: ', response);
      console.log('in action index, response to deleteContractor: ', response.data.data.user);

      dispatch({
        type: DELETE_CONTRACTOR,
        payload: response.data.data.user
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to deleteContractor: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function createStaff(staffAttributes, callback) {
  console.log('in action index, createStaff, staffAttributes: ', staffAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/staffs/`, staffAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to createStaff: ', response);
      console.log('in action index, response to createStaff: ', response.data.data.user);

      dispatch({
        type: CREATE_STAFF,
        payload: response.data.data.user
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to createStaff: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function updateStaff(staffAttributes, callback) {
  console.log('in action index, updateStaff, staffAttributes: ', staffAttributes);
  const { id } = staffAttributes;

  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/staffs/${id}`, staffAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to updateStaff: ', response);
      console.log('in action index, response to updateStaff: ', response.data.data.user);

      dispatch({
        type: UPDATE_STAFF,
        payload: response.data.data.user
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to updateStaff: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function deleteStaff(id, callback) {
  // console.log('in action index, deleteStaff, facilityAttributes: ', facilityAttributes);
  // const { building_id } = bankAccountAttributes;

  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/staffs/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to deleteStaff: ', response);
      console.log('in action index, response to deleteStaff: ', response.data.data.user);

      dispatch({
        type: DELETE_STAFF,
        payload: response.data.data.user
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to deleteStaff: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function editBuildingLanguage(buildingLanguageAttributes, callback) {
  console.log('in action index, editBuildingLanguage, buildingLanguageAttributes: ', buildingLanguageAttributes);
  const { building_id, id } = buildingLanguageAttributes.building_language;

  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/buildings/${building_id}/building_languages/${id}`, buildingLanguageAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to editBuildingLanguage: ', response);
      console.log('in action index, response to editBuildingLanguage: ', response.data.data.flat);

      dispatch({
        type: UPDATE_BUILDING_LANGUAGE,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to editBuildingLanguage: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function createBuildingLanguage(buildingLanguageAttributes, callback) {
  console.log('in action index, createBuildingLanguage, buildingLanguageAttributes: ', buildingLanguageAttributes);
  const { building_id } = buildingLanguageAttributes.building_language;

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/buildings/${building_id}/building_languages`, buildingLanguageAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to createBuildingLanguage: ', response);
      console.log('in action index, response to createBuildingLanguage: ', response.data.data.flat);

      dispatch({
        type: CREATE_BUILDING_LANGUAGE,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to createBuildingLanguage: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}
export function deleteBuildingLanguage(buildingLanguageAttributes, callback) {
  console.log('in action index, deleteBuildingLanguage, buildingLanguageAttributes: ', buildingLanguageAttributes);
  const { building_id, id } = buildingLanguageAttributes;

  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/buildings/${building_id}/building_languages/${id}`, {
      // !!!!! in axios delete, send params as data in config which includes header
      data: { flat_id: buildingLanguageAttributes.flat_id },
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in action index, response to deleteBuildingLanguage: ', response);
      console.log('in action index, response to deleteBuildingLanguage: ', response.data.data.flat);

      dispatch({
        type: DELETE_BUILDING_LANGUAGE,
        payload: response.data.data.flat
      });
      callback();
    })
    .catch(error => {
      console.log('in action index, catch error to deleteBuildingLanguage: ', error);
      // dispatch(authError(error));
      // this.showloading();
    });
  };
}

export function setInitialValuesObject(initialValuesObject) {
  console.log('in actions setInitialValuesObject, initialValuesObject:', initialValuesObject);
  //flip state boolean
  // callback();
  return {
    type: SET_INITIAL_VALUES_OBJECT,
    payload: initialValuesObject
   };
}

export function setTemplateElementsObject(templateElementsObject) {
  console.log('in actions setTemplateElementsObject, templateElementsObject:', templateElementsObject);
  //flip state boolean
  // callback();
  return {
    type: SET_TEMPLATE_ELEMENTS_OBJECT,
    payload: templateElementsObject
   };
}

export function createAgreement(agreementAttributes, callback) {
  console.log('in actions index, createAgreement, agreementAttributes: ', agreementAttributes);
  console.log('in actions index, createAgreement: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = agreementAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/agreements`, agreementAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createAgreement, response: ', response);
      console.log('response to createAgreement, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_AGREEMENT,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback(response.data.data.agreement.id);
    });
  };
}

export function editAgreement(agreementFormData, callback) {
  console.log('in actions index, editAgreement, agreementFormData: ', agreementFormData);
  // console.log('in actions index, editAgreement: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = agreementFormData;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/agreements/${agreementFormData.get('id')}`, agreementFormData, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to editAgreement, response: ', response);
      // console.log('response to editAgreement, response.data.data: ', response.data.data);
      dispatch({
        type: EDIT_AGREEMENT,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function editAgreementFields(agreementFieldAttributes, callback) {
  console.log('in actions index, editAgreementFields, agreementFieldAttributes: ', agreementFieldAttributes);
  console.log('in actions index, editAgreementFields: localStorage.getItem, token; ', localStorage.getItem('token'));

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/update_agreement_fields`, agreementFieldAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to editAgreementFields, response: ', response);
      console.log('response to editAgreementFields, response.data.data: ', response.data.data);
      // EDIT_AGREEMENT_FIELDS called in booking and document reducer
      dispatch({
        type: EDIT_AGREEMENT_FIELDS,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback(response.data.data.agreement);
    });
  };
}

export function saveTemplateDocumentFields(agreementFieldAttributes, submitAction, callback) {
  console.log('in actions index, saveTemplateDocumentFields, agreementFieldAttributes: ', agreementFieldAttributes);
  // console.log('in actions index, saveTemplateDocumentFields: localStorage.getItem, token; ', localStorage.getItem('token'));

  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/save_template_agreement_fields`, agreementFieldAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to saveTemplateDocumentFields, response: ', response);
      // console.log('response to saveTemplateDocumentFields, response.data.data: ', response.data.data);
      // EDIT_AGREEMENT_FIELDS called in booking and document reducer
      dispatch({
        type: SAVE_TEMPLATE_DOCUMENT_FIELDS,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback(submitAction);
    })
    .catch((error) => {
      // take out error if hard coding error messages
      // if request is bad
      // show error to user
      console.log('action index, saveTemplateDocumentFields, catch, error.response:', error.response);
      dispatch(authError(error.response));
      // dispatch(authError('Bad login info...'));
    });
  };
}

export function deleteAgreement(id, callback) {
  // console.log('in actions index, deleteAgreement: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = agreementAttributes;
  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/agreements/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to deleteAgreement, response: ', response);
      console.log('response to deleteAgreement, response.data.data: ', response.data.data);
      dispatch({
        type: DELETE_AGREEMENT,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function editHistory(editHistoryObject) {
  console.log('in actions editHistory, editHistoryObject:', editHistoryObject);
  //flip state boolean
  // callback();
  // payload is {newEditHistoryItem: {ITEM}, action: 'add or delete_last or delete_first'}
  // payload sent to documents reducer
  return {
    type: EDIT_HISTORY,
    payload: editHistoryObject
   };
}

export function fetchDocumentTranslation(documentName) {
  console.log('in actions index, fetchDocumentTranslation, documentName: ', documentName);
  // console.log('in actions index, fetchDocumentTranslation: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = reviewAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/fetch_translation`, { document_name: documentName }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchDocumentTranslation, response: ', response);
      // console.log('response to fetchDocumentTranslation, response.data.data: ', response.data.data);
      // localStorage.setItem('image', response.data.data);
      dispatch({
        type: FETCH_DOCUMENT_TRANSLATION,
        payload: response.data.data.translation
      });
      // sends back to createreview.js the review_id and the images
      // callback();
    });
  };
}

export function createDocumentInsert(documentInsertAttributes, callback) {
  console.log('in actions index, createDocumentInsert, documentInsertAttributes: ', documentInsertAttributes);
  // console.log('in actions index, createDocumentInsert: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = documentInsertAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/document_inserts`, documentInsertAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createDocumentInsert, response: ', response);
      // console.log('response to createDocumentInsert, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_DOCUMENT_INSERT,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function createInsertField(insertFieldAttributes, callback) {
  console.log('in actions index, createInsertField, insertFieldAttributes: ', insertFieldAttributes);
  // console.log('in actions index, createInsertField: localStorage.getItem, token; ', localStorage.getItem('token'));

  // const { } = insertFieldAttributes;
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/insert_fields`, insertFieldAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to createInsertField, response: ', response);
      // console.log('response to createInsertField, response.data.data: ', response.data.data);
      dispatch({
        type: CREATE_INSERT_FIELD,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function editDocumentInsert(documentInsertFormData, callback) {
  const id = documentInsertFormData.get('id')
  console.log('in actions index, editDocumentInsert, documentInsertFormData, id: ', documentInsertFormData, id);
  // const { } = documentInsertFormData;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/document_inserts/${id}`, documentInsertFormData, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to editDocumentInsert, response: ', response);
      // console.log('response to createDocumentInsert, response.data.data: ', response.data.data);
      dispatch({
        type: EDIT_DOCUMENT_INSERT,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function editInsertField(insertFieldAttributes, callback) {
  console.log('in actions index, editInsertField, insertFieldAttributes: ', insertFieldAttributes);
  console.log('in actions index, editInsertField: localStorage.getItem, token; ', localStorage.getItem('token'));
  const id = insertFieldAttributes.id
  // const { } = insertFieldAttributes;
  return function (dispatch) {
    axios.patch(`${ROOT_URL}/api/v1/insert_fields/${id}`, insertFieldAttributes, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to editInsertField, response: ', response);
      console.log('response to editInsertField, response.data.data: ', response.data.data);
      dispatch({
        type: EDIT_INSERT_FIELD,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function deleteDocumentInsert(id, callback) {
  console.log('in actions index, deleteDocumentInsert: localStorage.getItem, token; ', localStorage.getItem('token'));
  // const { } = documentInsertAttributes;
  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/document_inserts/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to deleteDocumentInsert, response: ', response);
      console.log('response to deleteDocumentInsert, response.data.data: ', response.data.data);
      dispatch({
        type: DELETE_DOCUMENT_INSERT,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function deleteInsertField(id, callback) {
  console.log('in actions index, deleteInsertField: localStorage.getItem, token; ', localStorage.getItem('token'));
  // const { } = documentInsertAttributes;
  return function (dispatch) {
    axios.delete(`${ROOT_URL}/api/v1/insert_fields/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to deleteInsertField, response: ', response);
      console.log('response to deleteInsertField, response.data.data: ', response.data.data);
      dispatch({
        type: DELETE_INSERT_FIELD,
        payload: response.data.data
      });
      // sends back to createflat.js the flat_id and the images
      callback();
    });
  };
}

export function selectedDocumentInsertId(id) {
  console.log('in actions index, selectedDocumentInsertId id:', id);
  return { type: SELECTED_DOCUMENT_INSERT_ID, payload: id };
}

export function selectedInsertFieldId(id) {
  console.log('in actions index, selectedInsertFieldId id:', id);
  return { type: SELECTED_INSERT_FIELD_ID, payload: id };
}

export function selectedAgreementId(id) {
  console.log('in actions index, selectedAgreementId id:', id);
  return { type: SELECTED_AGREEMENT_ID, payload: id };
}

export function fetchAgreement(id, callback) {
  console.log('in actions index, fetchAgreement id: ', id);
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/agreements/${id}`, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in actions index, response to fetchAgreement: ', response.data.data);
      dispatch({
        type: FETCH_AGREEMENT,
        payload: response.data.data
    });
    callback();
  });
  };
}

export function fetchTemplateObjects(callback) {
  // console.log('in actions index, fetchTemplateObjects: ');
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/fetch_template_objects`, {}, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in actions index, response to fetchTemplateObjects: ', response);
      dispatch({
        type: FETCH_TEMPLATE_OBJECTS,
        payload: response.data.data
      });
      callback();
    });
  };
}

export function fetchUserAgreements(callback) {
  console.log('in actions index, fetchUserAgreements: ');
  callback();
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/fetch_user_agreements`, {}, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in actions index, response to fetchUserAgreements: ', response);
      dispatch({
        type: FETCH_USER_AGREEMENTS,
        payload: response.data.data
      });
      callback();
    });
  };
}

export function addExistingAgreements({ agreementIdObject, fromEditFlat, flatId, bookingId, callback }) {
  // console.log('in actions index, addExistingAgreements: ');
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/add_existing_agreements`, { agreement_id_hash: agreementIdObject, edit_flat: fromEditFlat, flat_id: flatId, booking_id: bookingId }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in actions index, response to addExistingAgreements: ', response);
      dispatch({
        type: ADD_EXISTING_AGREEMENTS,
        payload: response.data.data
      });
      callback();
    });
  };
}

export function emailDocuments(data, callback) {
  console.log('in actions index, emailDocuments data: ', data);
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/email_documents`, data, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in actions index, response to emailDocuments: ', response.data.data);
      dispatch({
        type: EMAIL_DOCUMENTS,
        payload: response.data.data
    });
    callback();
  });
  };
}

export function markDocumentsSigned(data, callback) {
  console.log('in actions index, markDocumentsSigned data: ', data);
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/mark_documents_signed`, data, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('in actions index, response to markDocumentsSigned: ', response.data.data);
      dispatch({
        type: MARK_DOCUMENTS_SIGNED,
        payload: response.data.data
    });
    callback();
  });
  };
}

export function receiveConversation(conversation) {
  console.log('in actions index, receiveConversation, conversation:', conversation);
  return {
    type: RECEIVE_CONVERSATION,
    payload: { conversation }
  };
}

export function setCableConnection(connection) {
  console.log('in actions index, setCableConnection, connection:', connection);
  return {
    type: SET_CABLE_CONNECTION,
    payload: { connection }
  };
}

export function setTypingTimer(timerAttributes) {
  console.log('in actions index, setTypingTimer, timerAttributes:', timerAttributes);
  return {
    type: SET_TYPING_TIMER,
    payload: { timerAttributes }
  };
}

export function webSocketConnected(data) {
  // data is an object with connected and timedOut
  console.log('in actions index, webSocketConnected, data:', data);
  return {
    type: WEBSOCKET_CONNECTED,
    payload: { data }
  };
}

export function cablePageOverrideAction(pageBoolean) {
  // data is an object with connected and timedOut
  console.log('in actions index, cablePageOverrideAction, pageBoolean:', pageBoolean);
  return {
    type: CABLE_PAGE_OVERRIDE,
    payload: { pageBoolean }
  };
}

export function getGoogleMapBoundsKeys() {
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/get_google_map_bounds_keys`, {})
    .then(response => {
      console.log('response to getGoogleMapBoundsKeys: ', response.data);
      dispatch({
        type: GET_GOOGLE_MAP_MAP_BOUNDS_KEYS,
        payload: response.data.data
      });
    });
  };
}

export function setGetOnlineOffline(onlineAttributes) {
  const { user_id, online, action } = onlineAttributes;
  console.log('index action setGetOnlineOffline, user_id, online, action: ', user_id, online, action);
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/set_get_online_offline`, { set_get_online_offline: { user_id, online, action } }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to setGetOnlineOffline: ', response);
      dispatch({
        type: SET_GET_ONLINE_OFFLINE,
        payload: response.data.data
      });
    });
  };
}

export function getAppBaseObjects() {
  console.log('index action getAppLanguages: ');
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/get_app_base_objects`, {}, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to getAppBaseObjects: ', response);
      dispatch({
        type: GET_APP_BASE_OBJECTS,
        payload: response.data.data
      });
    });
  };
}

export function fetchDocumentFieldsForPage(pageNumber, agreementId, templateEditHistory, callback, pagesAlreadyInFrontEndArray, agreement) {
  console.log('index action fetchDocumentFieldsForPage, pageNumber, agreementId: ', pageNumber, agreementId);
  this.showLoading();
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/fetch_document_fields_for_page`, { agreement_id: agreementId, page: pageNumber, pages_already_in_front_end_array: pagesAlreadyInFrontEndArray }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to fetchDocumentFieldsForPage: ', response);
      // console.log('response to fetchDocumentFieldsForPage, JSON.parse(response.data.data.document_fields): ', JSON.parse(response.data.data.document_fields));
      // this.showLoading();
      callback();
      dispatch({
        type: POPULATE_TEMPLATE_ELEMENTS_LOCALLY,
        payload: { array: response.data.data.document_fields, templateEditHistory, agreement }
      });
    });
  };
}

export function cacheDocumentFieldsForRestOfPages(agreementId, documentFieldsPagesAlreadyReceivedArray, templateEditHistory, agreement) {
  console.log('index action cacheDocumentFieldsForRestOfPages, agreementId: ', agreementId);
  // this.showLoading();
  return function (dispatch) {
    axios.post(`${ROOT_URL}/api/v1/cache_document_fields_for_rest_of_pages`, { agreement_id: agreementId, document_fields_pages_already_received_array: documentFieldsPagesAlreadyReceivedArray }, {
      headers: { 'AUTH-TOKEN': localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to cacheDocumentFieldsForRestOfPages: ', response);
      // this.showLoading();agreements_with_cached_document_fields_hash
      // callback();
      // dispatch({
      //   type: CACHE_DOCUMENT_FIELDS_FOR_REST_OF_PAGES,
      //   payload: { array: response.data.data.document_fields }
      // });
      // agreements_with_cached_document_fields_hash
      // response.data.data.
      let newArray = []
      const documentFieldsPageMapped = response.data.data.agreements_with_cached_document_fields_hash[agreementId]
      _.each(Object.keys(documentFieldsPageMapped), eachPage => {
        newArray = newArray.concat(documentFieldsPageMapped[eachPage])
      });
      console.log('response to cacheDocumentFieldsForRestOfPages, documentFieldsPageMapped, newArray: ', documentFieldsPageMapped, newArray);
      // return { type: POPULATE_TEMPLATE_ELEMENTS_LOCALLY, payload: { array: newArray, templateEditHistory, agreement } };
      dispatch({
        type: POPULATE_TEMPLATE_ELEMENTS_LOCALLY,
        payload: { array: newArray, templateEditHistory, agreement }
      });
    });
  };
}

export function setUserStatus(statusObject) {
  // data is an object with connected and timedOut
  console.log('in actions index, setUserStatus, statusObject:', statusObject);
  // SET_USER_STATUS in conversation reducer
  return {
    type: SET_USER_STATUS,
    payload: statusObject
  };
}

export function setOtherUserStatus(statusObject) {
  // data is an object with connected and timedOut
  console.log('in actions index, setOtherUserStatus, statusObject:', statusObject);
  return {
    // SET_USER_STATUS in conversation reducer
    type: SET_OTHER_USER_STATUS,
    payload: statusObject
  };
}

export function setProgressStatus(statusObject) {
  // data is an object with connected and timedOut
  console.log('in actions index, setProgressStatus, statusObject:', statusObject);
  return {
    // SET_USER_STATUS in conversation reducer
    type: SET_PROGRESS_STATUS,
    payload: statusObject
  };
}


// Thunk example from docs
// function makeASandwichWithSecretSauce(forPerson) {
//   // We can invert control here by returning a function - the "thunk".
//   // When this function is passed to `dispatch`, the thunk middleware will intercept it,
//   // and call it with `dispatch` and `getState` as arguments.
//   // This gives the thunk function the ability to run some logic, and still interact with the store.
//   return function(dispatch) {
//     return fetchSecretSauce().then(
//       (sauce) => dispatch(makeASandwich(forPerson, sauce)),
//       (error) => dispatch(apologize('The Sandwich Shop', forPerson, error)),
//     );
//   };
// }
//
// export function webSocketConnected(connected) {
//   // connected is a boolean
//   console.log('in actions index, webSocketConnected, connected:', connected);
//   return function (dispatch) {
//     return ({
//       type: WEBSOCKET_CONNECTED,
//       payload: { connected }
//     }).then(() => dispatch(() => { console.log('in actions index, webSocketConnected, connected in .then dispatch:'); }
//       ));
//     };
//   }
