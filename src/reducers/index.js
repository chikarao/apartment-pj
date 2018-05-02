import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authReducer from './auth_reducer';
import flatsReducer from './flats_reducer';
import mapReducer from './map_reducer';
import imageCountReducer from './image_count_reducer';
import startUpIndexReducer from './start_up_index_reducer';
import bookingReducer from './booking_reducer';

const rootReducer = combineReducers({
  form,
  auth: authReducer,
  // originnally form: reducer; use ES6 so just form
  flats: flatsReducer,
  flat: flatsReducer,
  flatFromParams: flatsReducer,
  mapDimensions: mapReducer,
  imageIndex: imageCountReducer,
  startUpCount: startUpIndexReducer,
  selectedBookingDates: bookingReducer
  // can access mapbounds.east .west., etc
});

export default rootReducer;
