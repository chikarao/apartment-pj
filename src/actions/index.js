import axios from 'axios';
// import { browserHistory } from 'react-router-dom';
import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, FETCH_FLATS, UPDATE_MAP_BOUNDS, SELECTED_FLAT, SELECTED_FLAT_FROM_PARAMS, INCREMENT_IMAGE_INDEX, DECREMENT_IMAGE_INDEX, FETCH_MESSAGE } from './types';

// const ROOT_URL = 'http://localhost:3090';
const ROOT_URL = 'http://localhost:3000';

export function signinUser({ email, password }, callback) {
  // reduxthunk allow return of function and edirect access to dispatch method
//dispatch accepts action and forwards to all reducers;
// main pipeline of redux; dispatch can wait for async
  // now can place lots of logic
  return function (dispatch) {
    // redux thunk let's us call dispatch method; returns action
    // submit email/password to the server
    // same as { email: email, password: password}
    // console.log({ sign_in: { email, password } });
    axios.post(`${ROOT_URL}/api/v1/sign_in`, { sign_in: { email, password } })
    // axios.post(`${ROOT_URL}/sign_in`, { email, password })
    //signin for express server
      .then(response => {
        console.log(response);
        // request is good
        // Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER, payload: email });
        // save JWT token
        // localStorage.setItem('token', response.data.token);
        // data.token for express server api
        //redirect to the route '/feature'
        localStorage.setItem('token', response.data.data.user.authentication_token);
        localStorage.setItem('email', email);
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
  return function (dispatch) {
    console.log({ user: { email, password } });
    axios.post(`${ROOT_URL}/api/v1/sign_up`, { user: { email, password } })
    // signup for express server; sign_up for rails book review api
    .then(response => {
      console.log('here is the response: ', response);
      dispatch({ type: AUTH_USER, payload: email });
      console.log('here is the response: ', response.data.data.user.authentication_token);
      localStorage.setItem('token', response.data.data.user.authentication_token);
      // localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);

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

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  //flip authenticated to false
  // delete token from local storage
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  return { type: UNAUTH_USER };
}

export function fetchFlats() {
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/flats`, {
      headers: { authorization: localStorage.getItem('token') }
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

export function fetchMessage() {
  return function (dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
    .then(response => {
      dispatch({
        type: FETCH_MESSAGE,
        payload: response.data.message
    });
  });
};
}

export function updateMapBounds(mapBounds) {
  console.log('in actions index, updateMapBounds: ', mapBounds);
  return {
    type: UPDATE_MAP_BOUNDS,
    payload: mapBounds
  };
}
export function selectedFlat(flat) {
  console.log('in actions index, selectedFlat: ', flat);
  return {
    type: SELECTED_FLAT,
    payload: flat
  };
}

export function selectedFlatFromParams(id) {
  console.log('in actions index, selectedFlatFromParams id: ', id);
  return function (dispatch) {
    axios.get(`${ROOT_URL}/api/v1/flats/${id}`, {
      headers: { authorization: localStorage.getItem('token') }
    })
    .then(response => {
      console.log('response to selectedFlatFromParams: ', response.data.data.flat);
      dispatch({
        type: SELECTED_FLAT_FROM_PARAMS,
        payload: response.data.data.flat
    });
  });
  };
}

export function incrementImageIndex() {
  console.log('in actions incrementImageIndex');
  return {
    type: INCREMENT_IMAGE_INDEX
  };
}
export function decrementImageIndex() {
  console.log('in actions decrementImageIndex');
  return {
    type: DECREMENT_IMAGE_INDEX
  };
}
