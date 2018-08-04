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
import { AUTH_USER } from './actions/types';

const API_KEY = 'pk_test_1EdOYEpMsLV8B9UJvV6mnPrS';

const token = localStorage.getItem('token');
const email = localStorage.getItem('email');

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

console.log('api key', API_KEY);  
if (token) {
  // we need to update application state
  // dispatch is s method of store!!!
  store.dispatch({ type: AUTH_USER, payload: email });
}

ReactDOM.render(
  <Provider store={store}>
    <StripeProvider apiKey={API_KEY}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </StripeProvider>
  </Provider>
  , document.querySelector('.container'));
