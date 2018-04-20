import { FETCH_FLATS, SELECTED_FLAT } from '../actions/types';

export default function (state = {}, action) {
  console.log('in flats reducer, action.payload: ', action.payload);

  switch (action.type) {
    case FETCH_FLATS:
      return _.mapKeys(action.payload, 'id');

    case SELECTED_FLAT:
      return { ...state, selectedFlat: action.payload };

    default:
      return state;
  }
}
