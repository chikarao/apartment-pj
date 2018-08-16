import _ from 'lodash';
import {
  CREATE_MESSAGE,
  CREATE_CONVERSATION,
  NO_CONVERSATION,
  NO_CONVERSATION_FOR_FLAT,
  FETCH_CONVERSATION_BY_USER_AND_FLAT,
  FETCH_CONVERSATIONS_BY_USER,
  FETCH_CONVERSATION_BY_FLAT,
  MARK_MESSAGES_READ,
  SET_NEW_MESSAGES,
  CONVERSATION_TO_SHOW,
  SHOW_CONVERSATIONS,
  YOUR_FLAT,
  CHECKED_CONVERSATIONS,
  UPDATE_CONVERSATIONS
} from '../actions/types';

export default function (state = {
  noConversation: true,
  noConversationForFlat: true,
  newMessages: 0,
  conversationToShow: [],
  showConversations: true,
  checkedConversationsArray: [],
  conversationByFlat: [],
  conversationByUserAndFlat: [],
  conversationsByUser: [],
  yourFlat: false
}, action) {
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
      console.log('in conversation reducer, CREATE_MESSAGE conversationArray: ', conversationArray);
        console.log('in conversation reducer, CREATE_MESSAGE action.payload: ', action.payload);
      return { ...state, noConversation: false, conversationByFlat: [action.payload], conversationByUserAndFlat: conversationArray, noConversationForFlat: false };

    case CREATE_CONVERSATION:
      // console.log('in conversation reducer, state: ', state);
      // return { ...state, conversationCreated: action.payload, conversationByUserAndFlat: action.payload, noConversation: false };
      return { ...state };

    case NO_CONVERSATION:
      return { ...state, noConversation: true };

    case NO_CONVERSATION_FOR_FLAT:
      return { ...state, noConversationForFlat: false };

    case SET_NEW_MESSAGES:
      return { ...state, newMessages: action.payload };

    case CONVERSATION_TO_SHOW:
      return { ...state, conversationToShow: action.payload };

    case SHOW_CONVERSATIONS:
      return { ...state, showConversations: !state.showConversations };

    case CHECKED_CONVERSATIONS:
      const newArray = state.checkedConversationsArray;
      const removeFromIndexArray = [];
      console.log('in conversation reducer, CHECKED_CONVERSATIONS, state.checkedConversationsArray: ', state.checkedConversationsArray);
      // console.log('in conversation reducer, CHECKED_CONVERSATIONS, state.checkedConversationsArray: ', state.checkedConversationsArray);
      // console.log('in conversation reducer, CHECKED_CONVERSATIONS, action.payload: ', action.payload);
      // iterate through action.payload to get index of conversations in existing state;
      _.each(action.payload, conversationId => {
        // console.log('in conversation reducer, CHECKED_CONVERSATIONS, before if includes newArray, conversationId: ', newArray, conversationId);
        if (newArray.includes(conversationId)) {
          // console.log('in conversation reducer, CHECKED_CONVERSATIONS, if includes before splice newArray: ', newArray);
          const index = newArray.indexOf(conversationId); // get the index of the element
          // add index of ids and push them into array for later
          removeFromIndexArray.push(index);
          // console.log('in conversation reducer, CHECKED_CONVERSATIONS, if includes conversationId: ', conversationId);
          // console.log('in conversation reducer, CHECKED_CONVERSATIONS, if includes after splice newArray: ', newArray);
        } else {
          // console.log('in conversation reducer, CHECKED_CONVERSATIONS, else newArray, conversationId: ', newArray, conversationId);
          // if the id is not in state array, push it into the array
          newArray.push(conversationId);
        }
      });
      console.log('in conversation reducer, CHECKED_CONVERSATIONS, after each newArray, removeFromIndexArray: ', newArray, removeFromIndexArray);
      // iterate in reverse order so the first elements in newArray are not removed, then update state with newArray
      for (let i = removeFromIndexArray.length - 1; i >= 0; i--) {
        newArray.splice(removeFromIndexArray[i], 1);
      }
      console.log('in conversation reducer, CHECKED_CONVERSATIONS, after each newArray: ', newArray);

      return { ...state, checkedConversationsArray: newArray };

    // case CHECKED_CONVERSATIONS:
    //   return { ...state, checkedConversationsArray: action.payload };

    case UPDATE_CONVERSATIONS:
      const conversationUpdateArray = [];
      const conversationUpdateIdArray = [];
      console.log('in conversation reducer, UPDATE_CONVERSATIONS, action.payload, state.conversationByUserAndFlat: ', action.payload, state.conversationByUserAndFlat);
      _.each(state.conversationByUserAndFlat, conversation => {
        conversationUpdateIdArray.push(conversation.id);
        conversationUpdateArray.push(conversation);
      });

      _.each(action.payload, conv => {
        const index = conversationUpdateIdArray.indexOf(conv.id); // get the index of the element
        conversationUpdateIdArray.splice(index, 1); // remove one element at index
        conversationUpdateArray.splice(index, 1); // remove one element at index
        conversationUpdateArray.push(conv);
      });
      console.log('in conversation reducer, UPDATE_CONVERSATIONS, conversationUpdateArray: ', conversationUpdateArray);
      console.log('in conversation reducer, UPDATE_CONVERSATIONS, conversationUpdateIdArray: ', conversationUpdateIdArray);

      return { ...state, conversationByUserAndFlat: conversationUpdateArray };
    // case UPDATE_CONVERSATIONS:
    //   const conversationUpdateArray = [];
    //   const conversationUpdateIdArray = [];
    //   console.log('in conversation reducer, UPDATE_CONVERSATIONS, action.payload, state.conversationByUserAndFlat: ', action.payload, state.conversationByUserAndFlat);
    //   _.each(state.conversationByUserAndFlat, conversation => {
    //     _.each(action.payload, conv => {
    //       if (conversation.id !== conv.id) {
    //         if (!conversationUpdateIdArray.includes(conversation.id)) {
    //           console.log('in conversation reducer, UPDATE_CONVERSATIONS, if != conversation.id, conv.id: ', conversation.id, conv.id);
    //           conversationUpdateIdArray.push(conversation.id);
    //           conversationUpdateArray.push(conversation);
    //         }
    //       } else {
    //         if (!conversationUpdateIdArray.includes(conv.id)) {
    //           console.log('in conversation reducer, UPDATE_CONVERSATIONS, else != conversation.id, conv.id: ', conversation.id, conv.id);
    //           conversationUpdateIdArray.push(conv.id);
    //           conversationUpdateArray.push(conv);
    //         }
    //       }
    //     });
    //   });
    //   console.log('in conversation reducer, UPDATE_CONVERSATIONS, conversationUpdateArray: ', conversationUpdateArray);
    //   console.log('in conversation reducer, UPDATE_CONVERSATIONS, conversationUpdateIdArray: ', conversationUpdateIdArray);
    //
    //   return { ...state, conversationByUserAndFlat: conversationUpdateArray };

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
