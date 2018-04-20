import { UPDATE_MAP_BOUNDS } from '../actions/types';

export default function (state = {}, action) {
  console.log('in map reducer, action.payload: ', action.payload);
  switch (action.type) {
    case UPDATE_MAP_BOUNDS:
      return { ...state, mapBounds: action.payload };

    default:
      return state;
  }
}
