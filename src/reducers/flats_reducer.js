import _ from 'lodash';
import {
  FETCH_FLATS,
  FETCH_FLATS_BY_USER,
  SELECTED_FLAT,
  SELECTED_FLAT_FROM_PARAMS,
  CREATE_FLAT,
  EDIT_FLAT_LOAD,
  EDIT_FLAT,
  CREATE_VIEW,
  CREATE_LIKE,
  LIKES_BY_USER,
  DELETE_LIKE,
  SEARCH_FLAT_PARAMENTERS,
  CLEAR_FLATS,
  UPDATE_SEARCH_FLAT_CRITERIA,
  CREATE_PLACE,
  DELETE_PLACE
} from '../actions/types';

export default function (state = { searchFlatParameters: {} }, action) {
  console.log('in flats reducer, action.payload: ', action.payload);

  const flatsArray = [];

  switch (action.type) {
    case FETCH_FLATS:
      return { ...state, flatsResults: _.mapKeys(action.payload.flats, 'id'), reviewsForFlatResults: _.mapKeys(action.payload.reviews, 'id') };

    case CLEAR_FLATS:
      return { ...state, flatsResults: {} };

    case FETCH_FLATS_BY_USER:
      return { ...state, flatsByUser: _.mapKeys(action.payload, 'id') };

    case SELECTED_FLAT:
      return { ...state, selectedFlat: action.payload };

    case SELECTED_FLAT_FROM_PARAMS:
      return { ...state, selectedFlatFromParams: action.payload };

    case CREATE_FLAT:
      // return _.mapKeys(action.payload, 'id');
      return { ...state };

    case EDIT_FLAT_LOAD:
      return { ...state, editFlatData: action.payload };

    case EDIT_FLAT:
      return { ...state, editFlatData: action.payload };

    case SEARCH_FLAT_PARAMENTERS:
      const searchFlatParameters = state.searchFlatParameters;
      _.each(Object.keys(action.payload), (key) => {
        searchFlatParameters[key] = action.payload[key];
        console.log('in flats reducer, SEARCH_FLAT_PARAMENTERS, key: ', key);
      });
      return { ...state, searchFlatParameters };

    // Views and likes moved to flats reducer so that
    // they can be automatically updated when flats update
    // Reviews kept separate since reviews are not updatad on results page

    // updates flatsResults upon createView response of flat from API
    case CREATE_VIEW:
      _.each(state.flatsResults, flat => {
        if (flat.id !== action.payload.id) {
          flatsArray.push(flat);
        } else {
          flatsArray.push(action.payload);
        }
      });
      return { ...state, flatsResults: _.mapKeys(flatsArray, 'id')  };

      // updates flatsResults upon createLike response of flat from API
    case CREATE_LIKE:
    _.each(state.flatsResults, flat => {
        if (flat.id !== action.payload.flat.id) {
          flatsArray.push(flat);
        } else {
          flatsArray.push(action.payload.flat);
        }
      });
      return { ...state, createdLike: action.payload.like, flatsResults: _.mapKeys(flatsArray, 'id') };
    // LIKES_BY_USER is an object of objects

    case LIKES_BY_USER:
      return { ...state, userLikes: _.mapKeys(action.payload, 'id') };

      // updates flatsResults upon deleteLike response of flat from API
    case DELETE_LIKE:
      _.each(state.flatsResults, flat => {
        if (flat.id !== action.payload.flat.id) {
          flatsArray.push(flat);
        } else {
          flatsArray.push(action.payload.flat);
        }
      });
      return { ...state, deletedLikeFlat: action.payload, flatsResults: _.mapKeys(flatsArray, 'id') };

    // NEED to have place create and delete in flat reducer so that in edit and show flat,
    // the places are in sync with selectedFlatFromParams
    case CREATE_PLACE:
      return { ...state, selectedFlatFromParams: action.payload.flat };

    case DELETE_PLACE:
      return { ...state, selectedFlatFromParams: action.payload.flat };


    default:
      return state;
  }
}
