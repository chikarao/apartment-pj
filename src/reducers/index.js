import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authReducer from './auth_reducer';
import flatsReducer from './flats_reducer';
import mapReducer from './map_reducer';

const rootReducer = combineReducers({
  form,
  auth: authReducer,
  // originnally form: reducer; use ES6 so just form
  flats: flatsReducer,
  mapBounds: mapReducer
  // can access mapbounds.east .west., etc
});

export default rootReducer;
