import _ from 'lodash';
import {
  CREATE_MESSAGE,
  CREATE_CONVERSATION,
  NO_CONVERSATION,
  FETCH_CONVERSATION_BY_USER_AND_FLAT,
  FETCH_CONVERSATIONS_BY_USER,
  FETCH_CONVERSATION_BY_FLAT,
  MARK_MESSAGES_READ,
  SET_NEW_MESSAGES
} from '../actions/types';

export default function (state = { noConversation: false, newMessages: false }, action) {
  console.log('in conversation reducer, action.payload: ', action.payload);
  // console.log('in conversation reducer, MARK_MESSAGES_READ newMessagesOrNotd: ', newMessages);
  const conversationArray = [];

  switch (action.type) {
    case FETCH_CONVERSATION_BY_FLAT:
      // console.log('in conversation reducer, state: ', state);
      return { ...state, conversationByFlat: action.payload };

    case FETCH_CONVERSATION_BY_USER_AND_FLAT:
      // console.log('in conversation reducer, state: ', state);
      return { ...state, conversationByUserAndFlat: action.payload, noConversation: false };

    case FETCH_CONVERSATIONS_BY_USER:
      console.log('in conversation reducer, FETCH_CONVERSATIONS_BY_USER, localStorage.getItem: ', localStorage.getItem('id'));
      const currentUserId = localStorage.getItem('id');
      let newMessagesBool = false;
      _.each(action.payload, conversation => {
        const userNotOwner = conversation.user_id === currentUserId
        // if (conversation.id !== action.payload.id) {
        //   conversationArray.push(conversation);
        // } else {
        //   conversationArray.push(action.payload);
        // }
        _.each(conversation.messages, message => {
          if (userNotOwner) {
            if (message.read === false && message.sent_by_user) {
              newMessagesBool = true;
            }
          } else {
            if (message.read === false && !message.sent_by_user) {
              newMessagesBool = true;
            }
          }
        });
      });
      // console.log('in conversation reducer, FETCH_CONVERSATIONS_BY_USER, newMessages: ', newMessagesBool);
      return { ...state, conversationsByUser: action.payload, noConversation: false, newMessages: newMessagesBool };

    case CREATE_MESSAGE:
      // when message craeted, changing conversation with new message in conversationByUserAndFlat
      // with old conversation with old message;
      // Fixes bug in mypage where after message created and
      // toggle back to conversations, only the old conversation remains and it did not have
      // flat in the conversation object so threw and error
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
      // console.log('in conversation reducer, state: ', state);
      // return { ...state, conversationCreated: action.payload, conversationByUserAndFlat: action.payload, noConversation: false };
      return { ...state };

    case NO_CONVERSATION:
      return { ...state, noConversation: true };

    case SET_NEW_MESSAGES:
      return { ...state, newMessages: action.payload };

    case MARK_MESSAGES_READ:
      let newMessages = false;
      // go through old conversationByUserAndFlat and replace with new conversation with messages marked read
      _.each(state.conversationByUserAndFlat, conversation => {
        if (conversation.id !== action.payload.id) {
          conversationArray.push(conversation);
        } else {
          conversationArray.push(action.payload);
        }
      });
      // take new conversations array and if any messages are unread, mark newMessages as true
      _.each(conversationArray, conversation => {
        const currentUserId2 = localStorage.getItem('id');
        const userNotOwner = conversation.user_id == currentUserId2;
        _.each(conversation.messages, message => {
          if (userNotOwner) {
            if (message.read === false && message.sent_by_user) {
              newMessages = true;
            }
          } else {
            if (message.read === false && !message.sent_by_user) {
              newMessages = true;
            }
          }
        });
      });

      return { ...state, noConversation: false, conversationByFlat: [action.payload], conversationByUserAndFlat: conversationArray, conversationsByUser: conversationArray, newMessages };

    default:
      return state;
  }
}
