import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authReducer from './auth_reducer';
import flatsReducer from './flats_reducer';
import mapReducer from './map_reducer';
import imageCountReducer from './image_count_reducer';
import startUpIndexReducer from './start_up_index_reducer';
import bookingReducer from './booking_reducer';
import conversationReducer from './conversation_reducer';
// import likesReducer from './likes_reducer';
import reviewsReducer from './reviews_reducer';
import modalsReducer from './modals_reducer';
import placesReducer from './places_reducer';
import languagesReducer from './languages_reducer';

const rootReducer = combineReducers({
  form,
  auth: authReducer,
  // originnally form: reducer; use ES6 so just form
  flats: flatsReducer,
  flat: flatsReducer,
  selectedFlatFromParams: flatsReducer,
  mapDimensions: mapReducer,
  imageIndex: imageCountReducer,
  startUpCount: startUpIndexReducer,
  selectedBookingDates: bookingReducer,
  bookingData: bookingReducer,
  fetchBookingsByUserData: bookingReducer,
  conversation: conversationReducer,
  // likes: likesReducer,
  reviews: reviewsReducer,
  modals: modalsReducer,
  places: placesReducer,
  languages: languagesReducer
  // can access mapbounds.east .west., etc
});

export default rootReducer;
