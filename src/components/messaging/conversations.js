import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

// const INITIAL_STATE = { inMessaging: false, messagingToggle: false, messageToShowId: '' };
const INITIAL_STATE = { showConversation: true, conversationId: '', checkedConversationsArray: [] };
// const INITIAL_STATE = { showConversation: true, conversationId: '', yourFlat: false };

class Conversations extends Component {
  constructor(props) {
   super(props);
   this.state = INITIAL_STATE;
 }

 getConversationToShow(coversationId) {
   // console.log('in conversations, getConversationToShow, before each: ', coversationId);
   const { conversations } = this.props;
   // console.log('in conversations, getConversationToShow, before each conversation: ', conversations);
   const conversationArray = []
   _.each(conversations, (conv) => {
     // console.log('in conversations, getConversationToShow, each: ', conv);
     if (conv.id == coversationId) {
       conversationArray.push(conv);
     }
   });
   return conversationArray;
 }

 handleConversationCardClick(event) {
   // console.log('in conversations, handleConversationCardClick, event: ', event.target);
   const clickedElement = event.target;
   const elementVal = clickedElement.getAttribute('value');
   // console.log('in conversations, handleConversationCardClick, elementVal: ', elementVal);

   // call action creator to mark messages for conversation with that id as read
   this.props.markMessagesRead(elementVal);
   // this.props.newMessages(false);
   // this.props.fetchConversationsByUser();
   const conversationToShow = this.getConversationToShow(elementVal);
   if (conversationToShow.length > 0) {
     const yourFlat = conversationToShow[0].flat.user_id == this.props.auth.id;
     // console.log('in conversations, handleConversationCardClick, conversationToShow, yourFlat: ', conversationToShow, yourFlat);
     this.props.yourFlat(yourFlat);
     // this.setState({ showConversation: false, conversationId: elementVal, yourFlat }, () => {
     // this.setState({ conversationId: elementVal, yourFlat }, () => {
     this.setState({ conversationId: elementVal }, () => {
       // console.log('in conversations, handleConversationCardClick, this.state: ', this.state);
       // this.setState({ showConversation: false, conversationToShow, yourFlat }, () => {
       //   console.log('in conversations, handleConversationCardClick, this.state: ', this.state);
       // this.renderMessages();
     });
     // action creator to switch on and off show conversation in mypage
     if (!this.props.onMessagingMain) {
       this.props.showConversations();
     }
     // action creator to set conversation id for props in messaging.js
     this.props.conversationToShow(parseInt(elementVal));
   }
 }

 renderConversationUserImage(notOwnFlatConversation, conversation) {
   // console.log('in conversations, renderConversationUserImage, notOwnFlatConversation: ', notOwnFlatConversation);
   // console.log('in conversations, renderConversationUserImage, conversation', conversation.user_id);
   // console.log('in conversations, renderConversationUserImage, auth.id', this.props.auth.id);
   // const ownImage = localStorage.getItem('image');
   if (notOwnFlatConversation) {
     // w_100,h_100,c_crop,g_face,r_max
     return (conversation.flat.user.image) ? <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.flat.user.image + '.jpg'} /> : <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/blank_profile_picture.jpg"} />;
   } else {
     return (conversation.user.image) ? <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.user.image + '.jpg'} /> : <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/blank_profile_picture.jpg"} />;
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
  const elementVal = parseInt(checkedElement.getAttribute('value'));
  console.log('in conversations, handleConversationCheck, checkedElement', checkedElement);
  console.log('in conversations, handleConversationCheck, elementVal', elementVal);

  if (this.state.checkedConversationsArray.includes(elementVal)) {
    const newArray = [...this.state.checkedConversationsArray]; // make a separate copy of the array
    const index = newArray.indexOf(elementVal); // get the index of the element
    newArray.splice(index, 1); // remove one element at index

    this.setState({ checkedConversationsArray: newArray }, () => {
      console.log('in results handleConversationCheck, checkedConversationsArray if includes: ', this.state.checkedConversationsArray);
      this.props.checkedConversations(this.state.checkedConversationsArray);
    });
  } else {
    this.setState(prevState => ({
      checkedConversationsArray: [...prevState.checkedConversationsArray, elementVal]
    }), () => {
      console.log('in results handleConversationCheck, checkedConversationsArray if else: ', this.state.checkedConversationsArray);
      this.props.checkedConversations(this.state.checkedConversationsArray);
    }); // end of setState
  }
}

 renderEachConversation() {
   const { conversations, flats } = this.props;

   // send props flats from message main
   if (this.state.showConversation) {
     // get flat id in array to check if meesage was sent by owner
     // const flatIdArray = [];
     // _.each(flats, (flat) => {
     //   flatIdArray.push(flat.id);
     // });
     // iterate through each conversation
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
               <input value={conversation.id} type="checkbox" onChange={this.handleConversationCheck.bind(this)} />
             </div>
           </div>
         </li>
       );
     });
   }
 }

 renderConversations() {
   return (
     <ul>
       {this.renderEachConversation()}
     </ul>
   );
 }

  render() {
    return (
      <div>{this.renderConversations()}</div>
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
    flat: state.flat.selectedFlatFromParams
  };
}

export default withRouter(connect(mapStateToProps, actions)(Conversations));
