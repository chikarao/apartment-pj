import _ from 'lodash';
import { CREATE_LIKE, DELETE_LIKE, LIKES_BY_USER } from '../actions/types';
//
// const initialState = {
//   : 0
// };

export default function (state = {}, action) {
  console.log('in likes reducer, state.count:', state);

  switch (action.type) {
    //CREATE_LIKE is an object
    case CREATE_LIKE:
      return { ...state, createdLike: action.payload };
    // LIKES_BY_USER is an object of objects
    case LIKES_BY_USER:
      return { ...state, userLikes: _.mapKeys(action.payload, 'id') };

    case DELETE_LIKE:
      return { ...state, deletedLikeFlat: action.payload };

    default:
      return state;
  }
}
