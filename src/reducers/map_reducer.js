import { UPDATE_MAP_DIMENSIONS } from '../actions/types';

export default function (state = {}, action) {
  console.log('in map reducer, action.payload: ', action.payload);
  switch (action.type) {
    case UPDATE_MAP_DIMENSIONS:
      return { ...state, mapDimensions: action.payload };

    default:
      return state;
  }
}
