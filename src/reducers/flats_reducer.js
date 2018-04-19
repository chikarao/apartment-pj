import { FETCH_FLATS } from '../actions/types';

export default function (state = {}, action) {
  switch (action.type) {
    case FETCH_FLATS:
      return _.mapKeys(action.payload, 'id');

    default:
      return state;
  }
}
