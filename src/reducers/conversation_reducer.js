import _ from 'lodash';
import {
  CREATE_MESSAGE,
  CREATE_CONVERSATION,
  NO_CONVERSATION,
  FETCH_CONVERSATION_BY_USER_AND_FLAT,
  FETCH_CONVERSATIONS_BY_USER,
  FETCH_CONVERSATION_BY_FLAT,
  MARK_MESSAGES_READ,
  SET_NEW_MESSAGES,
  CONVERSATION_TO_SHOW,
  SHOW_CONVERSATIONS,
  YOUR_FLAT
} from '../actions/types';

export default function (state = { noConversation: false, newMessages: 0, conversationToShow: '', showConversations: true }, action) {
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
      let newMessagesNum = 0;
      _.each(action.payload, conversation => {
        // somehow needs to be == not ====
        const userNotOwner = conversation.user_id == currentUserId
        console.log('in conversation reducer, FETCH_CONVERSATIONS_BY_USER, each conversation.id: ', conversation.user_id);
        console.log('in conversation reducer, FETCH_CONVERSATIONS_BY_USER, each userNotOwner: ', userNotOwner);
        console.log('in conversation reducer, FETCH_CONVERSATIONS_BY_USER, each currentUserId: ', currentUserId);
        console.log('in conversation reducer, FETCH_CONVERSATIONS_BY_USER, each conversation.user_id: ', conversation.user_id);
        // if (conversation.id !== action.payload.id) {
        //   conversationArray.push(conversation);
        // } else {
        //   conversationArray.push(action.payload);
        // }
        _.each(conversation.messages, message => {
          if (userNotOwner) {
            if ((message.read === false) && !message.sent_by_user) {
              newMessagesNum++;
              console.log('in conversation reducer, FETCH_CONVERSATIONS_BY_USER, sent_by_user, message.id: ', message.id);
            }
          } else {
            if ((message.read === false) && message.sent_by_user) {
              newMessagesNum++;
              console.log('in conversation reducer, FETCH_CONVERSATIONS_BY_USER, !sent_by_user, message.id: ', message.id);
            }
          }
        });
      });
      // console.log('in conversation reducer, FETCH_CONVERSATIONS_BY_USER, newMessages: ', newMessagesBool);
      return { ...state, conversationByUserAndFlat: action.payload, conversationsByUser: action.payload, noConversation: false, newMessages: newMessagesNum };

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

    case CONVERSATION_TO_SHOW:
      return { ...state, conversationToShow: action.payload };

    case SHOW_CONVERSATIONS:
      return { ...state, showConversations: !state.showConversations };

    case YOUR_FLAT:
      return { ...state, yourFlat: action.payload };

    case MARK_MESSAGES_READ:
    console.log('in conversation reducer, MARK_MESSAGES_READ: ');
      let newMessages = 0;
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
            if (message.read === false && !message.sent_by_user) {
              newMessages++;
            }
          } else {
            if (message.read === false && message.sent_by_user) {
              newMessages++;
            }
          }
        });
      });

      return { ...state, noConversation: false, conversationByFlat: [action.payload], conversationByUserAndFlat: conversationArray, conversationsByUser: conversationArray, newMessages };

    default:
      return state;
  }
}
