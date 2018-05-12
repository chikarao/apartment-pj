import _ from 'lodash';
import { FETCH_FLATS, SELECTED_FLAT, SELECTED_FLAT_FROM_PARAMS, CREATE_FLAT, EDIT_FLAT_LOAD, EDIT_FLAT } from '../actions/types';

export default function (state = {}, action) {
  console.log('in flats reducer, action.payload: ', action.payload);

  switch (action.type) {
    case FETCH_FLATS:
      return _.mapKeys(action.payload, 'id');

    case SELECTED_FLAT:
      return { ...state, selectedFlat: action.payload };

    case SELECTED_FLAT_FROM_PARAMS:
      return { ...state, selectedFlatFromParams: action.payload };

    case CREATE_FLAT:
      return { ...state, createdFlat: action.payload };

    case EDIT_FLAT_LOAD:
      return { ...state, editFlatData: action.payload };

    case EDIT_FLAT:
      return { ...state, editFlatData: action.payload };

    default:
      return state;
  }
}
