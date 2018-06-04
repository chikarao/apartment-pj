import _ from 'lodash';
import {
  FETCH_CONVERSATION_BY_FLAT_AND_USER,
  CREATE_MESSAGE,
  CREATE_CONVERSATION,
  NO_CONVERSATION,
  FETCH_CONVERSATION_BY_USER_AND_FLAT,
  FETCH_CONVERSATION_BY_FLAT
} from '../actions/types';

export default function (state = { noConversation: false }, action) {
  console.log('in conversation reducer, action.payload: ', action.payload);

  switch (action.type) {

    case FETCH_CONVERSATION_BY_FLAT:
      // console.log('in booking reducer, state: ', state);
      return { ...state, conversationByFlat: action.payload };
    case FETCH_CONVERSATION_BY_USER_AND_FLAT:
      // console.log('in booking reducer, state: ', state);
      return { ...state, conversationByUserAndFlat: action.payload, noConversation: false };
    case CREATE_MESSAGE:
      // console.log('in booking reducer, state: ', state);
      return { ...state, noConversation: false, conversationByFlat: [action.payload], conversationByUserAndFlat: [action.payload] };
    case CREATE_CONVERSATION:
      // console.log('in booking reducer, state: ', state);
      // return { ...state, conversationCreated: action.payload, conversationByUserAndFlat: action.payload, noConversation: false };
      return { ...state };
    case NO_CONVERSATION:
      console.log('in conversation reducer, NO_CONVERSATION action.payload: ', action.payload);
      return { ...state, noConversation: true };

    default:
      return state;
  }
}