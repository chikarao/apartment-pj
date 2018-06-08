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
      // when message craeted, changing conversation with new message in conversationByUserAndFlat
      // with old conversation with old message;
      // Fixes bug in mypage where after message created and
      // toggle back to conversations, only the old conversation remains and it did not have
      // flat in the conversation object so threw and error
      const conversationArray = [];
      _.each(state.conversationByUserAndFlat, conversation => {
        if (conversation.id !== action.payload.id) {
          conversationArray.push(conversation);
        } else {
          conversationArray.push(action.payload);
        }
      })
      // console.log('in conversation reducer, CREATE_MESSAGE conversationArray: ', conversationArray);
      return { ...state, noConversation: false, conversationByFlat: [action.payload], conversationByUserAndFlat: conversationArray };

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
