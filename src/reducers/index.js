import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authReducer from './auth_reducer';
import flatsReducer from './flats_reducer';

const rootReducer = combineReducers({
  form,
  auth: authReducer,
  // originnally form: reducer; use ES6 so just form
  flats: flatsReducer
});

export default rootReducer;
