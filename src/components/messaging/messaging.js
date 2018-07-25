import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

const INITIAL_STATE = { inMessaging: false, messagingToggle: false, messageToShowId: '' };

class Messaging extends Component {
  constructor(props) {
   super(props);
   this.state = INITIAL_STATE;
 }

  componentDidMount() {
    // console.log('in show flat, componentDidMount, params', this.props.match.params);
    // // gets flat id from params set in click of main_cards or infowindow detail click
      // this.scrollLastMessageIntoView();
  }

  componentDidUpdate() {
    // if (this.state.inMessaging) {
    if (!this.props.fromShowPage) {
      this.scrollLastMessageIntoView();
    }
  }

    // const messageBox = document.getElementById('message-show-box');
    // console.log('in messaging, componentDidUpdate, getElementById: ', messageBox);
    // if (messageBox) {
    //   // console.log('in messaging, componentDidUpdate, bounding this.inViewPort: ', this.isInViewport(messageBox));
    //   window.addEventListener('scroll', (event) => {
    //     if (this.isInViewport(messageBox)) {
    //       console.log('in messaging, componentDidUpdate, addEventListener, messageBox in view: ');
    //       if(!this.state.inMessaging) {
    //         this.scrollLastMessageIntoView();
    //       }
    //       this.setState({ inMessaging: true })
    //     } else {
    //       console.log('in messaging, componentDidUpdate, addEventListener, messageBox NOT in view: ');
    //     }
    //   }, false);
    // }
    // this.inViewPort();
  // }


  // isInViewport(messageBox) {
  //   // console.log('in messaging, isInViewport, messageBox: ', messageBox);
  //   if (messageBox) {
  //     const bounding = messageBox.getBoundingClientRect();
  //     // console.log('in messaging, inViewPort, bounding: ', bounding);
  //     if (
  //       bounding.top >= 0 &&
  //       bounding.left >= 0 &&
  //       bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
  //       bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  //     ) {
  //       // console.log('Boounding: In the viewport!');
  //       return true;
  //     } else {
  //       // console.log('Bounding: Not in the viewport... whomp whomp');
  //       return false;
  //     }
  //   }
  //   // window.addEventListener('scroll', function (event) {
  //   //    if (isInViewport(messageBox)) {
  //   //        // image.innerHTML = '<img src="' + image.getAttribute('data-image') + '">';
  //   //        console.log('in messaging, componentDidUpdate, in view port: ', items);
  //   //       }
  //   //     }, false);
  //
  // }

  scrollLastMessageIntoView() {
    const items = document.querySelectorAll('.each-message-box');
    console.log('in messaging, scrollLastMessageIntoView, items: ', items);

    const last = items[items.length - 1];
    console.log('in messaging, scrollLastMessageIntoView, last: ', last);
    if (last) {
      last.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleMessageSendClick(event) {
    //this.props.conversation is an array!!!
    console.log('in messaging, handleMessageSendClick, this.props.conversation', this.props.conversation);
    console.log('in messaging, handleMessageSendClick, clicked: ', event);
    const messageText = document.getElementById('messsage-textarea');
    console.log('in messaging, handleMessageSendClick, messageText: ', messageText);

    if (this.props.noConversation) {
      console.log('in messaging, handleMessageSendClick, if this.props.noConversation: ', this.props.noConversation);
      console.log('in messaging, handleMessageSendClick, if this.props.noConversation: ', this.props.conversation);
      this.props.createConversation({ flat_id: this.props.flat.id }, { body: messageText.value, flat_id: this.props.flat.id, sent_by_user: true }, (messageAttributes) => this.createConversationCallback(messageAttributes));
    } else {
      const conversationToShowArray = this.conversationToShow();
      const { user_id, flat_id, id } = conversationToShowArray[0];
      console.log('in messaging, handleMessageSendClick, in if else, this.props.conversation, flat_id, user_id, conversation_id: ', flat_id, user_id, id);
      this.props.createMessage({ body: messageText.value, flat_id, user_id, conversation_id: id, sent_by_user: !this.props.thisIsYourFlat }, (flatId) => this.createMessageCallback(flatId));
    }
    // this.createMessage()
    messageText.value = '';
  }

  createConversationCallback(messageAttributes) {
    console.log('in show_flat, createConversationCallback, messageAttributes: ', messageAttributes);
    this.props.createMessage(messageAttributes, (flatId) => this.createMessageCallback(flatId));
  }

  createMessageCallback(id) {
    console.log('in show_flat, createMessageCallback, id: ', id);
    // this.props.history.push(`/show/${id}`);
    // this.setState(this.state);
    // this.props.fetchConversationByFlatAndUser(id);
    this.setState({ messagingToggle: !this.state.messagingToggle });
    this.scrollLastMessageIntoView();
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

  renderEachMessage(conversationToShowArray) {
    // console.log('in messaging, renderEachMessage,this.props.conversation: ', this.props.conversation[0]);
    // console.log('in messaging, renderEachMessage,conversationToShowArray: ', conversationToShowArray);
    // if (this.props.conversation) {
      // const { conversation } = this.props;
      // conversation is an array
      if (conversationToShowArray.length > 0) {
        const messages = conversationToShowArray[0].messages;
        // console.log('in messaging, renderEachMessage, this.props.conversation: ', this.props.conversation[0]);
        // console.log('in messaging, renderEachMessage, conversation.messages: ', messages);

        console.log('in messaging, renderEachMessage, this.props.thisIsYourFlat: ', this.props.thisIsYourFlat);
        return _.map(messages, (message, index) => {
          // console.log('in messaging, renderEachMessage, message: ', message);
          const date = new Date(message.created_at)
          // if (index === messages.length - 1) {
          //   this.scrollLastMessageIntoView();
          // }
          //yourFlat passed as props
          if (this.props.thisIsYourFlat) {
            // console.log('in messaging, renderEachMessage, message.sent_by_user: ', message.sent_by_user);
            // console.log('in messaging, renderEachMessage, date message.created_at: ', message.created_at);
            // console.log('in messaging, renderEachMessage, date message.created_at: ', message.created_at);
            // console.log('in messaging, renderEachMessage, date message.read: ', message.read);
            // console.log('in messaging, renderEachMessage, date: ', date);
            if (message.sent_by_user) {
              return this.renderLeftMessages(message, date);
            } else {
              return this.renderRightMessages(message, date);
            }
            // return (
            // );
          } else {
            if (message.sent_by_user) {
              return this.renderRightMessages(message, date);
            } else {
              return this.renderLeftMessages(message, date);
            }
          }
        });
      }
    // }
  }

  renderRightMessages(message, date) {
    return (
      <div key={message.id} className="each-message-box">
      <div className="each-message-user">
      <div className="each-message-date">{this.formatDate(date)}</div>
      <div className="each-message-content-user">{message.body}</div>
      <div className="each-message-read">{message.read ? 'Seen' : 'Unseen'}</div>
      </div>
      </div>
    );
  }
  renderLeftMessages(message, date) {
    return (
      <div key={message.id} className="each-message-box">
      <div className="each-message">
      <div className="each-message-date">{this.formatDate(date)}</div>
      <div className="each-message-content">{message.body}</div>
      </div>
      </div>
    );
  }

  conversationToShow() {
    const { conversations } = this.props;
    const conversationToShowArray = [];
    console.log('in messaging, conversationToShow. conversationId: ', this.props.conversationId);
    // const conversationIdFromStorage = localStorage.getItem('conversationId');
    // console.log('in messaging, conversationToShow. conversationIdFromStorage: ', conversationIdFromStorage);

    if (!this.props.fromShowPage) {
      _.each(conversations, (conversation) => {
        //for some reason === does not work
        if (conversation.id == this.props.conversationId) {
          conversationToShowArray.push(conversation);
        }
      });
      console.log('in messaging, conversationToShow. if each then returned, conversationToShowArray : ', conversationToShowArray);
      return conversationToShowArray;
    } else {
      console.log('in messaging, conversationToShow. if else returned this.props.conversation: ', this.props.conversation);
      if (this.props.conversation.length < 1) {
        return this.props.conversations;
      } else {
        return this.props.conversation;
      }
    }
  }


  renderMessaging() {
    // const conversationIsEmpty = _.isEmpty(this.props.conversation);
    console.log('in messaging, renderMessaging. this.props.currentUserIsOwner: ', this.props.currentUserIsOwner);
    console.log('in messaging, renderMessaging. this.props.conversationId: ', this.props.conversationId);
    if (this.props.conversations || this.props.conversation) {
      console.log('in messaging, renderMessaging. this.props.conversations: ', this.props.conversations);
      console.log('in messaging, renderMessaging. this.props.conversation (comes from show flat page): ', this.props.conversation);
      if (!this.props.currentUserIsOwner) {
        // const conversationIsEmpty = this.props.conversation.length < 1;
        // if (!conversationIsEmpty) {
        // console.log('in messaging, renderMessaging. this.props.conversation.length < 1: ', this.props.conversatio  n.length < 1);
        const conversationToShowArray = this.conversationToShow();
        console.log('in messaging, renderMessaging. this.props.conversation, after if: ', this.props.conversation);
        console.log('in messaging, renderMessaging. conversationToShowArray, after each: ', conversationToShowArray);
        return (
          <div>
            <div id={'message-show-box'} style={this.props.onMessagingMain ? { height: '500px' } : { height: '300px' }}>
              {this.props.noConversation ? <div className="no-conversation-message">
              <br/><br/>You have not started a conversation...
              <br/>Start one by sending a message! <br/> Make sure to introduce yourself</div> : this.renderEachMessage(conversationToShowArray)}
              </div>
            <textarea id="messsage-textarea" className={this.props.largeTextBox ? 'message-input-box-main wideInput' : 'message-input-box wideInput'} type="text" maxLength="200" placeholder="Enter your message here..." />
            <button className="btn btn-primary btn-sm message-btn" onClick={this.handleMessageSendClick.bind(this)}>Send</button>
          </div>
        );
        // }
      }
    }
  }

  render() {
    return (
      <div>{this.renderMessaging()}</div>
    );
  }
}
// messaging is designed to be used on my page and show flat
// takes booleans fromShowPage, currentUserIsOwner passed from show flat page and
// Note that uses conversation (singular) passed as props from show flat and covnversations (plural) from app state
// uses app state so that the component rerenders when a message is sent
function mapStateToProps(state) {
  console.log('in messaging, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    conversations: state.conversation.conversationByUserAndFlat,
    noConversation: state.conversation.noConversation,
    flat: state.flat.selectedFlatFromParams,
    thisIsYourFlat: state.conversation.yourFlat
  };
}

export default withRouter(connect(mapStateToProps, actions)(Messaging));
