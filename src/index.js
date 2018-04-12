import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import App from './components/app';
import reducers from './reducers';
import { AUTH_USER } from './actions/types';


const token = localStorage.getItem('token');
const email = localStorage.getItem('email');

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

if (token) {
  // we need to update application state
  // dispatch is s method of store!!!
  store.dispatch({ type: AUTH_USER, payload: email });
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));
