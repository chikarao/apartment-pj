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
  //   console.log('in show flat, componentDidMount, params', this.props.match.params);
  //   // gets flat id from params set in click of main_cards or infowindow detail click
  //     this.scrollLastMessageIntoView();
  // }

  componentDidUpdate(prevProps) {
    // if not from show page scroll to the last message
    if (!this.props.fromShowPage) {
      this.scrollLastMessageIntoView();
    }

    if (prevProps.typingTimer !== this.props.typingTimer && this.props.typingTimer > 0) {
      this.scrollLastMessageIntoView();
    }

    // if (this.props.propsWebSocketTimedOut) {
    //   this.props.webSocketConnected({ timedOut: false });
    // }
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
      // NOTE: this.props.propsChats is defined in src/messaging/action_cable_manager.js
      // this.chats.typing(addresseeId);
    }
    this.setState({ currentChatMessage: event.target.value }, () => {
      console.log('in messaging, updateCurrentChatMessage, this.state.currentChatMessage: ', this.state.currentChatMessage);
    })
  }

  scrollLastMessageIntoView() {
    // Gets the last message and scrolls into view.
    // also gets the typing indicator and scrolls into voew
    const items = document.querySelectorAll('.each-message-box');
    const itemsTyping = document.querySelectorAll('.typing-message-content');
    console.log('in messaging, scrollLastMessageIntoView, items: ', items);

    const last = items[items.length - 1];
    const lastTyping = itemsTyping[itemsTyping.length - 1];
    // if (lastTyping) lastTyping.setAttribute('style', 'border: none; position: absolute; bottom: 0; left: 0;');
    console.log('in messaging, scrollLastMessageIntoView, lastTyping: ', lastTyping);
    if (last) {
      last.scrollIntoView({ behavior: 'smooth' });
    }

    if (lastTyping) {
      last.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleMessageSendClick() {
    const messageText = { value: this.state.currentChatMessage };

    let sentByUser;

    if (this.props.fromShowPage) {
      sentByUser = !this.props.currentUserIsOwner;
    } else {
      sentByUser = !this.props.thisIsYourFlat;
    }
    // check if currentChatMessage is not null or empty string
    if (this.state.currentChatMessage) {
      if (this.props.noConversationForFlat && this.props.fromShowPage) {
        // console.log('in messaging, handleMessageSendClick, if this.props.noConversationForFlat: ', this.props.conversation);
        // this.props.createConversation({ flat_id: this.props.flat.id }, { body: messageText.value, sent_by_user: true }, (messageAttributes) => this.createConversationCallback(messageAttributes));
        this.props.createConversation({ flat_id: this.props.flat.id }, { body: messageText.value, sent_by_user: true }, () => this.createMessageCallback());
      } else {
        const conversationToShow = this.conversationToShow();
        const { user_id, flat_id, id } = conversationToShow;
        // console.log('in messaging, handleMessageSendClick, in if else, this.props.conversation, flat_id, user_id, conversation_id: ', flat_id, user_id, id);
        this.props.createMessage({ body: messageText.value, flat_id, user_id, conversation_id: id, sent_by_user: sentByUser }, (flatId) => this.createMessageCallback(flatId));
      }
    }
    //   console.log('in messaging, handleMessageSendClick, callback in setState this.state.CurrentChatMessage: ', this.state.currentChatMessage);
  }

  createMessageCallback() {
    // this.props.history.push(`/show/${id}`);
    // this.setState(this.state);
    // this.props.fetchConversationByFlatAndUser(id);
    this.setState({ messagingToggle: !this.state.messagingToggle, currentChatMessage: '' }, () => {
      console.log('in messaging, createMessageCallback, this.state.currentChatMessage: ', this.state.currentChatMessage);
    });
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

  renderUserTyping() {
    // To turn on and off while current user is typing,
    // make !== this in renderMessages =>>>> this.props.messageSender === this.props.auth.id
    console.log('in messaging, renderUserTyping called: ');
    return (
      <div className="typing-message-content" style={{ border: '1px solid transparent' }}>
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
    // original code without the connecting...
    // {this.props.propsWebSocketConnected ?
    //   <div style={{ padding: '8px' }}>Connected</div>
    //   :
    //   <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    //     <div style={{ padding: '8px' }}>
    //       Connection timed out
    //     </div>
    //   <button
    //     className='connect'
    //     style={{ backgroundColor: 'white', border: '1px solid blue', borderRadius: '5px' }}
    //     onClick={(e) => this.handleConnectEvent(e)}
    //   >
    //   reconnect
    //   </button>
    //   </div>}
    // if propsWebSocketConnected, show connected.
    // if NOT propsWebSocketConnected AND IS timed out , show timed out and a button
    // if NOT connected BUT is NOT timed out, show in process of connecting...
    return (
      <div className="message-show-box-cable-status-bar" style={{ height: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ height: '10px', width: '10px', backgroundColor: this.props.propsWebSocketConnected ? '#39ff14' : '#ed2939', borderRadius: '50%', padding: '5px', margin: '5px'}}></div>
          { this.props.propsWebSocketConnected ?   <div style={{ padding: '8px' }}>Connected</div> : '' }
          { !this.props.propsWebSocketConnected && this.props.propsWebSocketTimedOut
            ?
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
            </div>
             :
             '' }
             { !this.props.propsWebSocketConnected && !this.props.propsWebSocketTimedOut ? <div style={{ padding: '8px' }}>Connecting...</div> : '' }
        </div>
      </div>
    );
  }

  getUserProfile(profiles) {
    let profileReturned;
    // iterate through each profile
    _.each(profiles, profile => {
      // if there is an english one, assign to profileReturned for now
      if (profile.language_code == 'en') profileReturned = profile;
      // if there exists one for the chosen language, assign
      if (profile.language_code == this.props.appLanguageCode) profileReturned = profile;
    });
    // if there is still no profile, get the first one in array
    if (!profileReturned) profileReturned = profiles[0];
    // return profile if there is one, if not return a dummy object
    return profileReturned ? profileReturned : { first_name: 'Owner' };
  }

  getUserLastActive(userStatus) {
    const timeNow = Date.now();
    // console.log('in messaging, getUserLastActive. timeNow, userStatus.last_activity: ', timeNow, userStatus.last_activity);
    const diffInTime = -(userStatus.last_activity - timeNow);
    // console.log('in messaging, getUserLastActive. diffInTime / 1000 / 60 / 60: ', diffInTime / 1000 / 60 / 60);
    const oneMinute = 60000;
    const oneHour = 3600000;
    const oneDay = 86400000;
    if (diffInTime > oneDay * 7) return 'Online more than one week ago';
    if (diffInTime > oneDay * 2) return 'Online more than two days ago';
    if (diffInTime > oneDay) return 'Online more than one day ago';
    if (diffInTime > oneHour * 6) return 'Online more than 6 hours ago';
    if (diffInTime > oneHour * 2) return `Online ${Math.round(diffInTime / oneHour)} hours ago`;
    if (diffInTime > oneHour) return 'Online about an hour ago';
    if (diffInTime > oneMinute * 15 * 2) return 'Active about a half hour ago';
    if (diffInTime > oneMinute * 5) return `Active ${Math.round(diffInTime / oneMinute)} minutes ago`;
    if (diffInTime > oneMinute || diffInTime < oneMinute) return 'Active now';
  }

  renderUserStatusBar() {
    console.log('in messaging, renderUserStatusBar. this.props.userStatus: ', this.props.userStatus);
    const userProfile = this.props.flat.user.profiles ? this.getUserProfile(this.props.flat.user.profiles) : { first_name: 'Owner' };
    const lastActive = this.props.ownerUserStatus ? this.getUserLastActive(this.props.ownerUserStatus) : '';
    const onLine = this.props.ownerUserStatus ? this.props.ownerUserStatus.online : false
    console.log('in messaging, renderUserStatusBar. userProfile: ', userProfile);
    // onError="this.onerror=null;this.src='http://res.cloudinary.com/chikarao/image/upload//w_40,h_40/apartmentpj-constant-assets/blank_profile_picture_4.jpg';"
    // {lastActive}
    return (
      <div className="message-show-box-user-status-bar" style={{ height: '40px', backgroundColor: 'white', border: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <div style={{ height: '40px', width: '40px', borderRadius: '50%', border: '1px solid #ccc' }}>
            <img
              style={{ height: 'auto', width: 'auto', borderRadius: '50%' }}
              src={"http://res.cloudinary.com/chikarao/image/upload//w_40,h_40/" + this.props.flat.user.image + '.jpg'}
            />
          </div>
          <div style={{ width: '250px', display: 'flex', flexDirection: 'column', padding: '3px 0 0 10px' }}>
            <div style={{ textAlign: 'left' }}>
              {userProfile.first_name}
            </div>
            <div style={{ textAlign: 'left', color: 'gray', fontSize: '11.5px' }}>
              {onLine ? 'Online' : 'Offline now... Please leave a message'}
            </div>
          </div>
        </div>
      </div>
    );
  }


  renderMessaging() {
    // const conversationIsEmpty = _.isEmpty(this.props.conversation);
    if (this.props.conversations) {
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
            {this.props.fromShowPage ? this.renderUserStatusBar() : ''}
            {this.renderCableStatusBar()}
            <div className="message-show-box" id={this.props.fromShowPage ? 'message-show-box-show-page' : 'message-show-box'} style={this.props.mobileView ? { height: '300px' } : { height: '500px' }}>
              {this.props.noConversationForFlat && this.props.fromShowPage ?
                <div className="no-conversation-message"><br/><br/><MultiLineText text={AppLanguages.noConversation[this.props.appLanguageCode]} /></div>
                : this.renderEachMessage(conversationToShow)}
                {conversationToShow && (this.props.messageSender === this.props.auth.id)
                  ? this.renderUserTyping()
                  : ''}
            </div>
            <textarea value={this.state.currentChatMessage} id="message-textarea" onChange={this.updateCurrentChatMessage} className={this.props.largeTextBox ? 'message-input-box-main wideInput' : 'message-input-box wideInput'} type="text" maxLength="200" placeholder={AppLanguages.enterMessage[this.props.appLanguageCode]} />
            {conversationToShow || this.props.noConversationForFlat ? <button className="btn btn-primary btn-sm message-btn" onClick={this.handleMessageSendClick}>{AppLanguages.send[this.props.appLanguageCode]}</button> : ''}
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
            <textarea value={this.state.currentChatMessage} id="message-textarea" onChange={this.updateCurrentChatMessage} className={this.props.largeTextBox ? 'message-input-box-main wideInput' : 'message-input-box wideInput'} type="text" maxLength="200" placeholder={AppLanguages.enterMessage[this.props.appLanguageCode]} />
            {conversationToShow || this.props.noConversationForFlat ? <button className="btn btn-primary btn-sm message-btn" onClick={this.handleMessageSendClick}>{AppLanguages.send[this.props.appLanguageCode]}</button> : ''}
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
    userStatus: state.auth.userStatus,
    ownerUserStatus: state.flat.ownerUserStatus,
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
