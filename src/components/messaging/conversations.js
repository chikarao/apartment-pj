import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

import AppLanguages from '../constants/app_languages';


// const INITIAL_STATE = { inMessaging: false, messagingToggle: false, messageToShowId: '' };
// const INITIAL_STATE = { showConversation: true, conversationId: '', checkedConversationsArray: [] };
const INITIAL_STATE = { showConversation: true, checkedConversationsArray: [] };
// const INITIAL_STATE = { showConversation: true, conversationId: '', yourFlat: false };

class Conversations extends Component {
  constructor(props) {
   super(props);
   this.state = INITIAL_STATE;
 }

 getConversationToShow(conversationId) {
   // console.log('in conversations, getConversationToShow, before each: ', coversationId);
   const { conversations } = this.props;
   console.log('in conversations, getConversationToShow, this.props.conversations: ', this.props.conversations);
   console.log('in conversations, getConversationToShow, conversationId: ', conversationId);
   // console.log('in conversations, getConversationToShow, before each conversation: ', conversations);
   const conversationArray = []
   _.each(conversations, (conv) => {
     // console.log('in conversations, getConversationToShow, each: ', conv);
     if (conv.id == conversationId) {
       conversationArray.push(conv);
     }
   });

   console.log('in conversations, getConversationToShow, conversationArray: ', conversationArray);
   return conversationArray;
 }

 handleConversationCardClick(event) {
   console.log('in conversations, handleConversationCardClick, event: ', event.target);
   const clickedElement = event.target;
   const elementVal = clickedElement.getAttribute('value');
   console.log('in conversations, handleConversationCardClick, elementVal', elementVal);

   const wasCheckBoxClicked = event.target.className === 'my-page-conversation-input' ||
   event.target.className === 'conversations-input-checkbox';
   // console.log('in conversations, handleConversationCardClick, wasCheckBoxClicked', wasCheckBoxClicked);

   // if (!wasCheckBoxClicked) {
     // console.log('in conversations, handleConversationCardClick, elementVal: ', elementVal);

     // call action creator to mark messages for conversation with that id as read
     // this.props.newMessages(false);
     // this.props.fetchConversationsByUser();
     // let conversationToShow;
     let conversationToShow = this.getConversationToShow(elementVal);
     // console.log('in conversations, handleConversationCardClick, conversationToShow.length', conversationToShow.length);
     if (conversationToShow.length > 0) {
       let yourFlat = conversationToShow[0].flat.user_id == this.props.auth.id;
       // console.log('in conversations, handleConversationCardClick, conversationToShow, yourFlat: ', conversationToShow, yourFlat);
       this.props.yourFlat(yourFlat);

      // !!!!!! For seme reason, unless markMessagesRead is called even when checkbox checked,
      // there is no rerender!!!!!
       this.props.markMessagesRead(elementVal);

       // action creator to switch on and off show conversation in mypage
       if (!this.props.onMessagingMain && !wasCheckBoxClicked) {
         this.props.showConversations();
       }
       // console.log('in conversations, handleConversationCardClick, before if conversation card was clicked, elementVal: ', elementVal);
       // if card was clicked
       if (!wasCheckBoxClicked) {
         // console.log('in conversations, handleConversationCardClick, if conversation card was clicked, elementVal: ', elementVal);
         // console.log('in conversations, handleConversationCardClick, if conversation card was clicked, elementVal: ', elementVal);
         this.props.conversationToShow(parseInt(elementVal));
         if (this.props.onMessageMainMobile) {
           this.props.showConversations();
         }
         // else if checkbox clicked...
       } else {
         // check if conversationId is already assgined in app state
         // if not get conversationToShow from the elementVal (clicked value)
          if (!this.props.conversationId) {
            conversationToShow = this.getConversationToShow(elementVal);
          } else {
            // otherwise, get converation to show from existing conversationId (what was clicked before this click)
            conversationToShow = this.getConversationToShow(this.props.conversationId);
          }
          // find out if the conversationId is for your own flat
          yourFlat = conversationToShow[0].flat.user_id == this.props.auth.id;
          // console.log('in conversations, handleConversationCardClick, conversationToShow, yourFlat: ', conversationToShow, yourFlat);
          // call actions to specify its for your own flat and which conversation to show or keep showing
          this.props.yourFlat(yourFlat);
          // action creator to set conversation id for props in messaging.js
          this.props.conversationToShow(this.props.conversationId);
       }
     }
   // }
 }

 renderConversationUserImage(notOwnFlatConversation, conversation) {
   // console.log('in conversations, renderConversationUserImage, notOwnFlatConversation: ', notOwnFlatConversation);
   // console.log('in conversations, renderConversationUserImage, conversation', conversation.user_id);
   // console.log('in conversations, renderConversationUserImage, auth.id', this.props.auth.id);
   // const ownImage = localStorage.getItem('image');
   if (notOwnFlatConversation) {
     // w_100,h_100,c_crop,g_face,r_max
     return (conversation.flat.user.image) ? <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.flat.user.image + '.jpg'} /> : <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/blank_profile_picture_1.jpg"} />;
   } else {
     return (conversation.user.image) ? <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.user.image + '.jpg'} /> : <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/blank_profile_picture_1.jpg"} />;
   }
   // return (conversation.user.image) ? <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.user.image + '.jpg'} /> : <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/blank_profile_picture.jpg"} />;
 }

 formatDate(date) {
   let hours = date.getHours();
   let minutes = date.getMinutes();
   const ampm = hours >= 12 ? 'pm' : 'am';
   hours = hours % 12;
   hours = hours ? hours : 12; // the hour '0' should be '12'
   minutes = minutes < 10 ? `0${minutes}` : minutes;
   const strTime = `${hours}:${minutes}  ${ampm}`;
   return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
}

handleConversationCheck(event) {
  const checkedElement = event.target;
  const elementVal = checkedElement.getAttribute('value');
  console.log('in conversations, handleConversationCheck, checkedElement', checkedElement);
  console.log('in conversations, handleConversationCheck, elementVal', elementVal);

  this.props.checkedConversations([parseInt(elementVal, 10)]);
  console.log('in results handleConversationCheck, checkedConversationsArray: ', this.state.checkedConversationsArray);
  // this.props.conversationToShow(parseInt(elementVal));
}

 renderEachConversation() {
   const { conversations, flats } = this.props;
   const conversationsEmpty = conversations.length < 1;
   console.log('in conversations, renderEachConversation, conversationsEmpty: ', conversationsEmpty);

   // send props flats from message main
   if (this.state.showConversation) {
     // get flat id in array to check if meesage was sent by owner
     // const flatIdArray = [];
     // _.each(flats, (flat) => {
     //   flatIdArray.push(flat.id);
     // });
     // iterate through each conversation
     if (!conversationsEmpty) {
       return _.map(conversations, (conversation, index) => {
         const lastMessageIndex = conversation.messages.length - 1;
         // console.log('in conversations, renderEachConversation, conversation: ', conversation);
         // check for unread messages and increment counter if message.read = false
         // if there are unread messages, the healine chnages in style of li
         const notOwnFlatConversation = (this.props.auth.id == conversation.user_id);
         // console.log('in conversations, renderEachConversation, this.props.auth.id: ', this.props.auth.id);
         // console.log('in conversations, renderEachConversation, conversation.user_id: ', conversation.user_id);
         // console.log('in conversations, renderEachConversation, notOwnFlatConversation: ', notOwnFlatConversation);
         // console.log('in conversations, renderEachConversation, conversation.user_id: ', conversation.user_id);
         // console.log('in conversations, renderEachConversation, this.props.auth.id: ', this.props.auth.id);
         let unreadMessages = 0;
         _.each(conversation.messages, (message) => {
           if (notOwnFlatConversation) {
             // console.log('in conversations, renderEachConversation,  message.conversation_id, message.read, message.id: ', message.conversation_id, message.read, message.id);
             // console.log('in conversations, renderEachConversation, message.conversation_id: ', message.conversation_id);
             if ((message.read === false) && (!message.sent_by_user)) {
               // console.log('in conversations, renderEachConversation, notOwnFlatConversation: ', notOwnFlatConversation);
               unreadMessages++;
               // console.log('in conversations, renderEachConversation, notOwnFlatConversation, !message.sent_by_user, conversation.id, unreadMessages: ', notOwnFlatConversation, !message.sent_by_user, conversation.id, unreadMessages);
             }
           } else {
             if ((message.read === false) && (message.sent_by_user)) {
               // console.log('in conversations, renderEachConversation, notOwnFlatConversation: ', notOwnFlatConversation);
               // console.log('in conversations, renderEachConversation, message.sent_by_user: ', message.sent_by_user);
               unreadMessages++;
               // console.log('in conversations, renderEachConversation, notOwnFlatConversation message.sent_by_user, conversation.id, unreadMessages: ', notOwnFlatConversation, message.sent_by_user, conversation.id, unreadMessages);
             }
           }
           // console.log('in conversations, renderEachConversation, unreadMessages: ', unreadMessages);
         });
         const date = new Date(conversation.messages[lastMessageIndex].created_at);
         //show only first 26 characters of text
         const stringToShow = conversation.messages[lastMessageIndex].body.substr(0, 25);

         // const checkboxes = document.getElementsByClassName('conversations-input-checkbox')

         return (
           <li key={index} className="my-page-each-card">
             <div value={conversation.id} className="my-page-each-card-click-box" onClick={this.handleConversationCardClick.bind(this)}>
               <div className="my-page-messaging-image-box">
                 {conversation.flat.images[0] ? <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.flat.images[0].publicid + '.jpg'} /> : <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/no_image_placeholder_5.jpg"} />}
                 {this.renderConversationUserImage(notOwnFlatConversation, conversation)}
               </div>
               <div className="my-page-details">
                 <ul>
                   <li style={unreadMessages > 0 ? { color: 'blue' } : { color: 'gray' }} className="conversations-conversation-headline">{stringToShow}...</li>
                   <li>{this.formatDate(date)}</li>
                   <li>user id: {conversation.user.id}</li>
                   <li>conversation id: {conversation.id}</li>
                 </ul>
               </div>
               <div className="my-page-conversation-input">
                 <input value={conversation.id} className="conversations-input-checkbox" type="checkbox" onChange={this.handleConversationCheck.bind(this)} />
               </div>
             </div>
           </li>
         );
       }); // end of map
     } else {
       return <div className="conversations-no-conversations">{AppLanguages.noConversationsYet[this.props.appLanguageCode]}</div>
     }// end of if !conversationsEmpty
   } // end of if showConversation
 }

 // conversationRollIn() {
 //     const moveElemment = document.getElementById('conversation-main-ul');
 //     console.log('in conversations, conversationRollIn, moveElemment: ', moveElemment);
 //     let pos = -100;
 //     const id = setInterval(frame, 5);
 //     function frame() {
 //         if (pos == 0) {
 //             clearInterval(id);
 //         } else {
 //           console.log('in conversations, conversationRollIn, pos: ', pos);
 //             pos++;
 //             // moveElemment.style.top = pos + 'px';
 //             // moveElemment.style.left = pos + 'px';
 //             moveElemment.style.left = `${pos} px`;
 //         }
 //     }
 // }

 renderConversations() {
   return (
     <ul id="conversation-main-ul">
       {this.renderEachConversation()}
     </ul>
   );
 }

  render() {
    return (
      <div className="conversation-main-div">{this.renderConversations()}</div>
    );
  }
}
// messaging is designed to be used on my page and show flat
// takes booleans fromShowPage, currentUserIsOwner passed from show flat page and
// Note that uses conversation (singular) passed as props from show flat and covnversations (plural) from app state
// uses app state so that the component rerenders when a message is sent
function mapStateToProps(state) {
  console.log('in Conversations, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    // conversations: state.conversation.conversationByUserAndFlat,
    noConversation: state.conversation.noConversation,
    flat: state.flat.selectedFlatFromParams,
    // conversationId: state.conversation.conversationToShow
    appLanguageCode: state.languages.appLanguageCode,

  };
}

export default withRouter(connect(mapStateToProps, actions)(Conversations));
