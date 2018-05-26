import _ from 'lodash';
import {
  FETCH_CONVERSATION_BY_FLAT_AND_USER,
  CREATE_MESSAGE,
  CREATE_CONVERSATION,
  NO_CONVERSATION
} from '../actions/types';

export default function (state = { noConversation: false }, action) {
  console.log('in conversation reducer, action.payload: ', action.payload);

  switch (action.type) {

    case FETCH_CONVERSATION_BY_FLAT_AND_USER:
      // console.log('in booking reducer, state: ', state);
      return { ...state, conversationByFlatAndUser: action.payload };
    case CREATE_MESSAGE:
      // console.log('in booking reducer, state: ', state);
      return { ...state, conversationByFlatAndUser: [action.payload] };
    case CREATE_CONVERSATION:
      // console.log('in booking reducer, state: ', state);
      return { ...state, conversationCreated: action.payload };
    case NO_CONVERSATION:
      // console.log('in booking reducer, state: ', state);
      return { ...state, noConversation: true };

    default:
      return state;
  }
}
