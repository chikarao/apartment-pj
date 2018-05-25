import _ from 'lodash';
import {
  FETCH_CONVERSATION_BY_FLAT_AND_USER,
  CREATE_MESSAGE
} from '../actions/types';

export default function (state = {}, action) {
  console.log('in conversation reducer, action.payload: ', action.payload);

  switch (action.type) {

    case FETCH_CONVERSATION_BY_FLAT_AND_USER:
      // console.log('in booking reducer, state: ', state);
      return { ...state, conversationByFlatAndUser: action.payload };
    case CREATE_MESSAGE:
      // console.log('in booking reducer, state: ', state);
      return { ...state, conversationByFlatAndUser: [action.payload] };

    default:
      return state;
  }
}
