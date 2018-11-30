//required for async await https://babeljs.io/docs/usage/polyfill/
// https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined
import 'babel-core/register';
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import { StripeProvider } from 'react-stripe-elements';

import App from './components/app';
import reducers from './reducers';
import { AUTH_USER, SET_APP_LANGUAGE_CODE, PLACE_SEARCH_LANGUAGE } from './actions/types';

const PUBLISHABLE_KEY = 'pk_test_1EdOYEpMsLV8B9UJvV6mnPrS';

const token = localStorage.getItem('token');
const email = localStorage.getItem('email');
const appLanguage = localStorage.getItem('appLanguage');
const placeSearchLanguageCode = localStorage.getItem('placeSearchLanguageCode');

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);
// console.log('in index.js, placeSearchLanguageCode: ', placeSearchLanguageCode);

// if token is in localstorate, call auth_user action
if (token) {
  // we need to update application state
  // dispatch is s method of store!!!
  store.dispatch({ type: AUTH_USER, payload: email });
}
// console.log('index.js, appLanguage', appLanguage);
// if appLanguage is in localStorage, set applanugae
if (appLanguage) {
  // we need to update application state
  // dispatch is s method of store!!!
  store.dispatch({ type: SET_APP_LANGUAGE_CODE, payload: appLanguage });
}
// for setting in app.js the language code to be passed in the google maps script
if (placeSearchLanguageCode) {
  store.dispatch({ type: PLACE_SEARCH_LANGUAGE, payload: placeSearchLanguageCode });
}

ReactDOM.render(
  <Provider store={store}>
    <StripeProvider apiKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
       <App />
      </BrowserRouter>
    </StripeProvider>
  </Provider>
  , document.querySelector('.container'));
