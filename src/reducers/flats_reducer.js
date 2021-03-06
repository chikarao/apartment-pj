import _ from 'lodash';
import {
  UNAUTH_USER,
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
  DELETE_PLACE,
  CREATE_FLAT_LANGUAGE,
  UPDATE_FLAT_LANGUAGE,
  DELETE_FLAT_LANGUAGE,
  SYNC_CALENDARS,
  REQUEST_BOOKING,
  CREATE_ICALENDAR,
  UPDATE_ICALENDAR,
  DELETE_ICALENDAR,
  DELETE_BOOKING,
  SEARCH_BUILDINGS,
  UPDATE_BUILDING,
  CREATE_BUILDING,
  SELECTED_FACILITY_ID,
  UPDATE_FACILITY,
  CREATE_FACILITY,
  DELETE_FACILITY,
  CREATE_INSPECTION,
  UPDATE_INSPECTION,
  DELETE_INSPECTION,
  SELECTED_INSPECTION_ID,
  UPDATE_BUILDING_LANGUAGE,
  CREATE_BUILDING_LANGUAGE,
  DELETE_BUILDING_LANGUAGE,
  GET_GOOGLE_MAP_MAP_BOUNDS_KEYS,
  SET_OWNER_USER_STATUS,
  UPLOAD_AND_CREATE_IMAGE,
  EDIT_AGREEMENT,
  EMPTY_SELECTED_FLAT_FROM_PARAMS,
  SAVE_TEMPLATE_DOCUMENT_FIELDS,
  ADD_EXISTING_AGREEMENTS,
  DELETE_IMAGES
} from '../actions/types';

const INITIAL_STATE = {
  searchFlatParameters: {},
  buildings: [],
  flatsResultsId: [],
  flatBuildingsResults: [],
  buildingsJustId: [],
  flatsResults: {},
  justFlats: {},
  flatBuildingsResultsId: {},
  flatBuildingsResultsJustId: [],
  currentUserIsOwner: false,
  googleMapBoundsKeys: null,
  selectedFlatFromParams: null,
};
export default function (state = INITIAL_STATE, action) {
  // console.log('in flats reducer, action.payload: ', action.payload);

  const flatsArray = [];

  switch (action.type) {
    case FETCH_FLATS:
      // return { ...state, flatsResults: _.mapKeys(action.payload.flats, 'id'), reviewsForFlatResults: _.mapKeys(action.payload.reviews, 'id'), flatBuildingsResults: action.payload.flat_buildings };
      return {
        ...state,
        flatsResults: action.payload.flat_buildings ? _.mapKeys(action.payload.flat_buildings.flats_no_building, 'id') : {},
        flatsResultsId: action.payload.flat_buildings ? action.payload.flat_buildings.flats_no_building_id : [],
        reviewsForFlatResults: _.mapKeys(action.payload.reviews, 'id'),
        flatBuildingsResults: action.payload.flat_buildings ? action.payload.flat_buildings.buildings_with_flats : [],
        flatBuildingsResultsId: action.payload.flat_buildings ? action.payload.flat_buildings.buildings_with_flats_id : [],
        flatBuildingsResultsJustId: action.payload.flat_buildings ? action.payload.flat_buildings.buildings_with_flats_just_id : [],
        buildingsJustId: action.payload.flat_buildings ? action.payload.flat_buildings.buildings_just_id : [],
        justFlats: _.mapKeys(action.payload.flats, 'id'),
      };
      // return { ...state, flatsResults: _.mapKeys(action.payload.flats, 'id'), reviewsForFlatResults: _.mapKeys(action.payload.reviews, 'id') };
    case UNAUTH_USER:
      return { ...state,
        searchFlatParameters: {},
        buildings: [],
        flatsResultsId: [],
        flatBuildingsResults: [],
        buildingsJustId: [],
        flatsResults: {},
        justFlats: {},
        flatBuildingsResultsId: {},
        flatBuildingsResultsJustId: []
       };

    case CLEAR_FLATS:
      return { ...state,
        buildings: [],
        flatsResultsId: [],
        flatBuildingsResults: [],
        buildingsJustId: [],
        flatsResults: {},
        justFlats: {},
        flatBuildingsResultsId: {},
        flatBuildingsResultsJustId: []
    };

    case FETCH_FLATS_BY_USER:
      return { ...state, flatsByUser: _.mapKeys(action.payload, 'id') };

    case SELECTED_FLAT:
      return { ...state, selectedFlat: action.payload };

    case SELECTED_FLAT_FROM_PARAMS: {
      // if user logged in compare flat user_id to auth.id then pass as currentUserIsOwner to props
      const userId = localStorage.getItem('id');
      let currentUserIsOwner = false;
      if (userId) {
        // NOTE: the == comparison does not work with ===
        currentUserIsOwner = action.payload.flat.user_id == userId;
      }

      const flat = action.payload.flat;
      if (flat && action.payload.agreements.length > 0) flat.agreements = _.mapKeys(action.payload.agreements, 'id')
      // console.log('in flats reducer, action.payload: ', action.payload);
      return { ...state, selectedFlatFromParams: flat, currentUserIsOwner };
    }

    case ADD_EXISTING_AGREEMENTS: {
      return { ...state, selectedFlatFromParams: action.payload.flat };
    }

    case SAVE_TEMPLATE_DOCUMENT_FIELDS:
      // console.log('in booking reducer, SAVE_TEMPLATE_DOCUMENT_FIELDS, action.payload: ', action.payload);
      const flat = action.payload.flat;
      if (flat) flat.agreements = _.mapKeys(action.payload.agreements, 'id');
      return { ...state, selectedFlatFromParams: flat };

    case EMPTY_SELECTED_FLAT_FROM_PARAMS:
      // console.log('in booking reducer, state: ', state);
      return { ...state, selectedFlatFromParams: null };

    case EDIT_AGREEMENT:
      // return _.mapKeys(action.payload, 'id');
      return { ...state, selectedFlatFromParams: action.payload.flat };

    case CREATE_FLAT:
      // return _.mapKeys(action.payload, 'id');
      return { ...state };

    case EDIT_FLAT_LOAD:
      return { ...state, editFlatData: action.payload };

    case EDIT_FLAT:
      return { ...state, selectedFlatFromParams: action.payload };

    // case EDIT_FLAT:
    //   return { ...state, editFlatData: action.payload };
    case SEARCH_FLAT_PARAMENTERS:
    // everytime object with k-v passed, add k-v or updates it
      const searchFlatParameters = { ...state.searchFlatParameters };
      _.each(Object.keys(action.payload), (key) => {
        searchFlatParameters[key] = action.payload[key];
        // console.log('in flats reducer, SEARCH_FLAT_PARAMENTERS, key: ', key);
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

    case CREATE_FLAT_LANGUAGE:
      return { ...state, selectedFlatFromParams: action.payload };

    case UPDATE_FLAT_LANGUAGE:
      return { ...state, selectedFlatFromParams: action.payload };

    case DELETE_FLAT_LANGUAGE:
      return { ...state, selectedFlatFromParams: action.payload };

    case SYNC_CALENDARS:
      return { ...state, selectedFlatFromParams: action.payload };

    case REQUEST_BOOKING:
      return { ...state, selectedFlatFromParams: action.payload.flat };

    case CREATE_ICALENDAR:
      return { ...state, selectedFlatFromParams: action.payload };

    case UPDATE_ICALENDAR:
      return { ...state, selectedFlatFromParams: action.payload };

    case DELETE_ICALENDAR:
      return { ...state, selectedFlatFromParams: action.payload };

    case UPDATE_BUILDING:

      return { ...state, selectedFlatFromParams: action.payload };

    case CREATE_BUILDING:
      return { ...state, selectedFlatFromParams: action.payload };

    case DELETE_BOOKING:
      return { ...state, flatsByUser: _.mapKeys(action.payload, 'id') };

    case SEARCH_BUILDINGS:
      return { ...state, buildings: action.payload };

    case SELECTED_FACILITY_ID:
      return { ...state, selectedFacilityId: action.payload };

    case UPDATE_FACILITY:
      return { ...state, selectedFlatFromParams: action.payload };

    case CREATE_FACILITY:
      return { ...state, selectedFlatFromParams: action.payload };

    case DELETE_FACILITY:
      return { ...state, selectedFlatFromParams: action.payload };

    case CREATE_INSPECTION:
      return { ...state, selectedFlatFromParams: action.payload };

    case UPDATE_INSPECTION:
      return { ...state, selectedFlatFromParams: action.payload };

    case DELETE_INSPECTION:
      return { ...state, selectedFlatFromParams: action.payload };

    case SELECTED_INSPECTION_ID:
      return { ...state, selectedInspectionId: action.payload };

    //put building language here so that flat is updated when building updated
    case CREATE_BUILDING_LANGUAGE:
      return { ...state, selectedFlatFromParams: action.payload };

    case UPDATE_BUILDING_LANGUAGE:
      return { ...state, selectedFlatFromParams: action.payload };

    case DELETE_BUILDING_LANGUAGE:
      return { ...state, selectedFlatFromParams: action.payload };

    case GET_GOOGLE_MAP_MAP_BOUNDS_KEYS:
      return { ...state, googleMapBoundsKeys: action.payload };

    case UPLOAD_AND_CREATE_IMAGE:
      return { ...state, selectedFlatFromParams: action.payload };

    case DELETE_IMAGES:
    console.log('in flats reducer, DELETE_IMAGES action.payload: ', action.payload);

      return { ...state, selectedFlatFromParams: action.payload.flat };

    default:
      return state;
  }
}
