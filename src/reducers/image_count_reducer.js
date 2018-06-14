import _ from 'lodash';
import { INCREMENT_IMAGE_INDEX, DECREMENT_IMAGE_INDEX, SET_IMAGE_INDEX } from '../actions/types';

const initialState = {
  count: 0
};

export default function (state = initialState, action) {
  console.log('in image count reducer, state.count:', state);

  switch (action.type) {
    case INCREMENT_IMAGE_INDEX:
      return {
        ...state, count: state.count + action.payload
      };

    case DECREMENT_IMAGE_INDEX:
      return {
        ...state, count: state.count - action.payload
      };

    case SET_IMAGE_INDEX:
      return {
        ...state, count: action.payload
      };

    default:
      return state;
  }
}
