import _ from 'lodash';
import { CREATE_PLACE, DELETE_PLACE, FETCH_PLACES } from '../actions/types';
//
// const initialState = {
//   : 0
// };

export default function (state = {}, action) {
  console.log('in places reducer, state.count:', state);

  switch (action.type) {
    case CREATE_PLACE:
    console.log('in places reducer, action.payload:', action.payload);
      return { ...state, places: action.payload };

    case DELETE_PLACE:
    console.log('in places reducer, action.payload:', action.payload);
      return { ...state, places: action.payload };

    case FETCH_PLACES:
    console.log('in places reducer, action.payload:', action.payload);
      return { ...state, places: action.payload };

    default:
      return state;
  }
}
