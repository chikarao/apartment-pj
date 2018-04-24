import _ from 'lodash';
import { INCREMENT_IMAGE_INDEX, DECREMENT_IMAGE_INDEX } from '../actions/types';

const initialState = {
  count: 0
};

export default function (state = initialState, action) {
  console.log('in image count reducer, state.count:', state.count);

  switch (action.type) {
    case INCREMENT_IMAGE_INDEX:
      return {
        count: state.count + 1
      };

    case DECREMENT_IMAGE_INDEX:
      return {
        count: state.count - 1
      };

    default:
      return state;
  }
}
