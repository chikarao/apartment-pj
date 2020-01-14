import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

import AppLanguages from '../constants/app_languages';
import MultiLineText from '../functions/multi_line_text';
import Typing from '../messaging/typing.js';

const INITIAL_STATE = {
  inMessaging: false,
  messagingToggle: false,
  messageToShowId: '',
  currentChatMessage: '',
};

let typingTimerOut = 0;

class Messaging extends Component {
  constructor(props) {
   super(props);
   this.state = INITIAL_STATE;
   this.handleMessageSendClick = this.handleMessageSendClick.bind(this);
   this.updateCurrentChatMessage = this.updateCurrentChatMessage.bind(this);
 }

  // componentDidMount() {
    // console.log('in show flat, componentDidMount, params', this.props.match.params);
    // // gets flat id from params set in click of main_cards or infowindow detail click
      // this.scrollLastMessageIntoView();
  // }

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

  updateCurrentChatMessage(event) {
    console.log('messaging, updateCurrentChatMessage, before if this.props.conversationId ', this.props.conversationId);
    // if (this.props.conversationId) {
    //   const userId = this.props.auth.id;
    //   // const addresseeId = this.props.auth.id === this.props.booking.user_id ? this.props.boooking.flat.user_id : userId;
    //   const conversationToShow = this.conversationToShow();
    //   console.log('messaging, updateCurrentChatMessage, this.props.conversationId ', this.props.conversationId);
    //   console.log('messaging, updateCurrentChatMessage, conversationToShow ', conversationToShow);
    //   const userIsOwner = userId == conversationToShow[0].flat.user_id;
    //   console.log('messaging, updateCurrentChatMessage, userId, conversationToShow[0].flat.user_id, userIsOwner ', userId, conversationToShow[0].flat.user_id, userIsOwner);
    //   const addresseeId = userIsOwner ? conversationToShow[0].user_id : userId;
    //   console.log('messaging, updateCurrentChatMessage, addresseeId, userId ', addresseeId, userId);
    // }
    // const userId = this.props.booking.user_id === this.props.auth.id ? this.props.booking.user_id : this.props.booking.flat.user_id
    // typingTimerOut is a global variable
    // this.chats.typing is a command for the backend to send a notification to the addressee
    // that the sender is typing a message. Notifications are sent once per timer cycle.
    // The timer is started when typingTimerOut is 0, when decremented every second
    // When the timer is zero, the timer is ready to be started again.
    if (typingTimerOut === 0) {
      console.log('messaging updateCurrentChatMessage, in if typingTimerOut === 0 ');
      const lapseTime = () => {
        if (subTimer > 0) {
          subTimer--;
          console.log('messaging updateCurrentChatMessage, in lapseTime, subTimer ', subTimer);
        } else {
          console.log('messaging updateCurrentChatMessage, in lapseTime, subTimer in else ', subTimer);
          // typingTimer--;
          clearInterval(timer);
          typingTimerOut = subTimer;
        }
      };
      let subTimer = 5;
      typingTimerOut = subTimer;
      const timer = setInterval(lapseTime, 1000);
      if (this.props.propsChats) this.props.propsChats.typing(this.props.auth.id);
      // this.chats.typing(addresseeId);
    }
    this.setState({ currentChatMessage: event.target.value }, () => {
      console.log('in messaging, updateCurrentChatMessage, this.state.currentChatMessage: ', this.state.currentChatMessage);
    })
  }

  scrollLastMessageIntoView() {
    const items = document.querySelectorAll('.each-message-box');
    console.log('in messaging, scrollLastMessageIntoView, items: ', items);

    const last = items[items.length - 1];
    // console.log('in messaging, scrollLastMessageIntoView, last: ', last);
    if (last) {
      last.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleMessageSendClick(event) {
    //this.props.conversation is an array!!!
    // console.log('in messaging, handleMessageSendClick, this.props.conversation', this.props.conversation);
    // console.log('in messaging, handleMessageSendClick, clicked: ', event);
    // const messageText = document.getElementById('message-textarea');
    const messageText = { value: this.state.currentChatMessage};
    // console.log('in messaging, handleMessageSendClick, messageText: ', messageText);

    let sentByUser;

    if (this.props.fromShowPage) {
      sentByUser = !this.props.currentUserIsOwner;
    } else {
      sentByUser = !this.props.thisIsYourFlat;
    }
    // console.log('in messaging, handleMessageSendClick, sentByUser: ', sentByUser);
    // console.log('in messaging, handleMessageSendClick, this.props.currentUserIsOwner: ', this.props.currentUserIsOwner);
    // console.log('in messaging, handleMessageSendClick, this.props.thisIsYourFlat: ', this.props.thisIsYourFlat);

    if (this.props.noConversationForFlat && this.props.fromShowPage) {
      // console.log('in messaging, handleMessageSendClick, if this.props.noConversationForFlat: ', this.props.noConversationForFlat);
      // console.log('in messaging, handleMessageSendClick, if this.props.noConversationForFlat: ', this.props.conversation);
      this.props.createConversation({ flat_id: this.props.flat.id }, { body: messageText.value, flat_id: this.props.flat.id, sent_by_user: true }, (messageAttributes) => this.createConversationCallback(messageAttributes));
    } else {
      const conversationToShow = this.conversationToShow();
      const { user_id, flat_id, id } = conversationToShow[0];
      // console.log('in messaging, handleMessageSendClick, in if else, this.props.conversation, flat_id, user_id, conversation_id: ', flat_id, user_id, id);
      this.props.createMessage({ body: messageText.value, flat_id, user_id, conversation_id: id, sent_by_user: sentByUser }, (flatId) => this.createMessageCallback(flatId));
    }
    // this.createMessage()
    // messageText.value = '';
    this.setState({ currentChatMessage: '' });
  }

  createConversationCallback(messageAttributes) {
    // console.log('in show_flat, createConversationCallback, messageAttributes: ', messageAttributes);

    this.props.createMessage(messageAttributes, (flatId) => this.createMessageCallback(flatId));
  }

  createMessageCallback(id) {
    // console.log('in show_flat, createMessageCallback, id: ', id);
    // this.props.history.push(`/show/${id}`);
    // this.setState(this.state);
    // this.props.fetchConversationByFlatAndUser(id);
    this.setState({ messagingToggle: !this.state.messagingToggle });
    this.scrollLastMessageIntoView();
  }


  formatDate(date) {
    // get date and time now
    const today = new Date();
    // get time as of midnight today (last night)
    const todayMidnight = today.setHours(0, 0, 0, 0);
    // test whether message is before midnight; if so return just the time not the entire date
    const beforeTodayMidnight = date < todayMidnight;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes}  ${ampm}`;
    return beforeTodayMidnight ? date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime
    : strTime;
}

  renderEachMessage(conversationToShow) {
    // conversationToShow is an object
    if (conversationToShow) {
      const messages = conversationToShow.messages;
      // console.log('in messaging, renderEachMessage, this.props.thisIsYourFlat: ', this.props.thisIsYourFlat);
      return _.map(messages, (message) => {
        // console.log('in messaging, renderEachMessage, message: ', message);
        const date = new Date(message.created_at);
        //yourFlat passed as props
        // if you are the owner of the flat for the conversation,
        // message sent_by_user is on the left side,
        // Otherwise, your message is on right side
        if (this.props.currentUserIsOwner || this.props.thisIsYourFlat) {
          // console.log('in messaging, renderEachMessage, message.sent_by_user: ', message.sent_by_user);
          if (message.sent_by_user) {
            //sent by user means conversation.id == auth.id; so not flatOwner
            return this.renderLeftMessage(message, date);
          }
          return this.renderRightMessage(message, date);
        } // end of if currentUserIsOwner or thisIsYourFlat
        // if you are not the owner of the flat for the conversation,
        // your message is on the right side and other messages on the left side
        if (message.sent_by_user) {
          return this.renderRightMessage(message, date);
        }
        return this.renderLeftMessage(message, date);
      });
    }
  }

  renderRightMessage(message, date) {
    return (
      <div key={message.id} className="each-message-box">
        <div className="each-message-user">
          <div className="each-message-date-user">{this.formatDate(date)}</div>
          <div className="each-message-content-user">{message.body}</div>
          <div className="each-message-read">{message.read ? 'Seen' : 'Unseen'}</div>
        </div>
      </div>
    );
  }

  renderLeftMessage(message, date) {
    // <div className="each-message-read">{message.read ? 'Seen' : 'Unseen'}</div>
    return (
      <div key={message.id} className="each-message-box">
        <div className="each-message">
          <div className="each-message-date">{this.formatDate(date)}</div>
          <div className="each-message-content">{message.body}</div>
        </div>
      </div>
    );
  }

  // renderUserTyping() {
  //   // To turn on and off while current user is typing,
  //   // make !== this in renderMessages =>>>> this.props.messageSender === this.props.auth.id
  //   console.log('in messaging, renderUserTyping called: ');
  //   return (
  //     <div className="each-message-box" style={{ minHeight: '35px' }}>
  //       <div className="each-message">
  //         <div className="each-message-content" style={{ border: '1px solid transparent' }}>
  //           <Typing
  //             typingTimer={this.props.typingTimer}
  //             messageSender={this.props.messageSender}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  renderUserTyping() {
    // To turn on and off while current user is typing,
    // make !== this in renderMessages =>>>> this.props.messageSender === this.props.auth.id
    console.log('in messaging, renderUserTyping called: ');
    return (
      <div className="each-message-content" style={{ border: '1px solid transparent' }}>
        <Typing
          typingTimer={this.props.typingTimer}
          messageSender={this.props.messageSender}
        />
      </div>
    );
  }

  conversationToShow() {
    const { conversations } = this.props;
    let conversationToShow;
    // const conversationIdFromStorage = localStorage.getItem('conversationId');
    // console.log('in messaging, conversationToShow.: ',);

    if (!this.props.fromShowPage) {
      _.each(conversations, (conversation) => {
        //for some reason === does not work
        if (conversation.id == this.props.conversationId) {
          conversationToShow = conversation;
        }
      });
      // console.log('in messaging, conversationToShow. if each then returned, conversationToShow : ', conversationToShow);
      return conversationToShow;
    } else {
      // console.log('in messaging, conversationToShow. if else returned this.props.conversation: ', this.props.conversation);
      // if (this.props.conversation.length < 1) {
        // return this.props.conversations;
      // } else {
        return this.props.conversation;
      // }
    }
  }

  handleConnectEvent(event) {
    console.log('in messaging, handleConnectEvent. if each then returned, clicked, event : ', event);
    this.props.webSocketConnected({ timedOut: false });
  }

  renderCableStatusBar() {
    return (
      <div className="message-show-box-cable-status-bar" style={{ height: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ height: '10px', width: '10px', backgroundColor: this.props.propsWebSocketConnected ? '#39ff14' : '#ed2939', borderRadius: '50%', padding: '5px', margin: '5px'}}></div>
          {this.props.propsWebSocketConnected ?
            <div style={{ padding: '8px' }}>Connected</div>
            :
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div style={{ padding: '8px' }}>
                Connection timed out
              </div>
            <button
              className='connect'
              style={{ backgroundColor: 'white', border: '1px solid blue', borderRadius: '5px' }}
              onClick={(e) => this.handleConnectEvent(e)}
            >
            reconnect
            </button>
            </div>}
        </div>
      </div>
    );
  }


  renderMessaging() {
    // const conversationIsEmpty = _.isEmpty(this.props.conversation);
    if (this.props.conversations) {
      // console.log('in messaging, renderMessaging. this.props.conversation (comes from show flat page): ', this.props.conversation);
      if (!this.props.currentUserIsOwner) {
        // const conversationIsEmpty = this.props.conversation.length < 1;
        // if (!conversationIsEmpty) {
        // console.log('in messaging, renderMessaging. this.props.containerWidth: ', this.props.containerWidth);
        const conversationToShow = this.conversationToShow();
        // check if from show page and there is no conversation for flat
        // if both true, show 'Start one...' message; otherwise, the massage is on message page so render each message
        // renderUserTyping is rendered if passes test of if there is conversationToShow and user typing is not current user
        return (
          <div className="message-show-box-container" style={{ width: this.props.containerWidth }}>
            {this.renderCableStatusBar()}
            <div className="message-show-box" id={this.props.fromShowPage ? 'message-show-box-show-page' : 'message-show-box'} style={this.props.mobileView ? { height: '300px' } : { height: '500px' }}>
              {this.props.noConversationForFlat && this.props.fromShowPage ?
                <div className="no-conversation-message"><br/><br/><MultiLineText text={AppLanguages.noConversation[this.props.appLanguageCode]} /></div>
                : this.renderEachMessage(conversationToShow)}
                {conversationToShow && (this.props.messageSender === this.props.auth.id)
                  ? this.renderUserTyping()
                  : ''}
            </div>
            <textarea id="message-textarea" onChange={this.updateCurrentChatMessage} className={this.props.largeTextBox ? 'message-input-box-main wideInput' : 'message-input-box wideInput'} type="text" maxLength="200" placeholder={AppLanguages.enterMessage[this.props.appLanguageCode]} />
            {conversationToShow ? <button className="btn btn-primary btn-sm message-btn" onClick={this.handleMessageSendClick}>{AppLanguages.send[this.props.appLanguageCode]}</button> : ''}
          </div>
        );
      } else if (!this.props.fromShowPage) {
        const conversationToShow = this.conversationToShow();
        return (
          <div style={{ overflow: 'auto ' }}>
          {this.renderCableStatusBar()}
            <div id={'message-show-box'} style={this.props.mobileView ? { height: '300px' } : { height: '500px' }}>
              {this.renderEachMessage(conversationToShow)}
              {conversationToShow && (this.props.messageSender === this.props.auth.id)
                ? this.renderUserTyping()
                : ''}
            </div>
            <textarea id="message-textarea" onChange={this.updateCurrentChatMessage} className={this.props.largeTextBox ? 'message-input-box-main wideInput' : 'message-input-box wideInput'} type="text" maxLength="200" placeholder={AppLanguages.enterMessage[this.props.appLanguageCode]} />
            {conversationToShow ? <button className="btn btn-primary btn-sm message-btn" onClick={this.handleMessageSendClick}>{AppLanguages.send[this.props.appLanguageCode]}</button> : ''}
          </div>
        );
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
    noConversationForFlat: state.conversation.noConversationForFlat,
    flat: state.flat.selectedFlatFromParams,
    thisIsYourFlat: state.conversation.yourFlat,
    appLanguageCode: state.languages.appLanguageCode,
    // ******* For action cable websockets
    propsCable: state.conversation.propsCable,
    propsChats: state.conversation.propsChats,
    typingTimer: state.conversation.typingTimer,
    messageSender: state.conversation.messageSender,
    propsWebSocketConnected: state.conversation.webSocketConnected,
    propsWebSocketTimedOut: state.conversation.webSocketTimedOut,
    // ******* For action cable websockets
    // yourFlat: state.conversation.yourFlat
  };
}

export default withRouter(connect(mapStateToProps, actions)(Messaging));
