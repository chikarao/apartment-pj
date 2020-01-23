// ************* COPIED FROM HOC SG *****************
// import React, { Component } from 'react';
// import { connect } from 'react-redux';

import Cable from 'actioncable';



export default function (props) {
  // This function makes the websocket connection, handles typing, timeout

  console.log('in ActioncableManager, props', props);
  let cable = props.cable;
  let chats = props.chats;
  let typingTimer = 0;
  // typingTime is time required between reset if user types multiple times
  const typingTime = 5;
  let subTimerDisconnect;
  let timerDisconnect;
  // disconnectTime is time required for connection to disconnect
  // const disconnectTime = 15;

  function actioncable_manager(id) {
    cable = Cable.createConsumer('ws://localhost:3000/cable');
    // this.cable.connection.websocket.onclose = () => {
    //   // console.log('actioncable_manager this.cable.connection.websocket.onclose callback');
    // };
    // console.log('actioncable_manager id', id);
    const userId = localStorage.getItem('id') ? localStorage.getItem('id') : id;
    // chats creates a number of methods to call on chats, which is passed in
    // app state as propsChats. It can be called to disconnect anywhere in app
    chats = cable.subscriptions.create({
      channel: 'ChatChannel', room: `messaging_room_${userId}`
      // channel: 'ChatChannel', room: `room${this.props.auth.id}`
    }, {
      connected: (message) => {
          console.log('actioncable_manager in call back to connected message', message);
          // Call authenticate chat which sends user token to back end to auth the user
          authenticateChat();
          // if socket is not connected set app and header component state to true and timedout to false
          if (!props.webSocketConnected) {
            props.setComponentState({ webSocketConnected: true });
            props.propsWebSocketConnected({ connected: true, timedOut: false });
          }
      }, // end of connected

      rejected: () => {
        console.log('***** Connection Rejected *****');
      },

      unsubscribed: () => {
        console.log('***** Connection Unsubscribed *****');
        // this.perform('unsubscribed');
      },

      unsubscribeConnection: function () {
        console.log('***** Unsubscribing from Connection *****');
        this.perform('unsubscribe_connection', {});
      },

      authenticated: function (token) {
        if (props.onShowPage && !props.currentUserIsOwner) {
          this.perform('authenticated', { token, other_user_id: props.flat.user_id, expiration: props.disconnectTime });
        } else {
          this.perform('authenticated', { token });
        }
        console.log('***** Authenticating Action Cable Connection *******');
      },

      received: (data) => {
        console.log('actioncable_manager in received before if data', data);
        if (data.conversation) {
          // receiveds data from back end and if data.conversation,
          // calls redux action receiveConversation to update with new conversation and message
          // sending user can get the conversation through ajax but the receiver
          // cannot get message automatically unless connected to websocket and listening for messages
          const conversation = JSON.parse(data.conversation);
          console.log('actioncable_manager in data.conversation, conversation', conversation);
          props.receiveConversation(conversation);
        } else if (data.notification) {
          // backend sends data.notification used for authenticating and
          // for typing. If sender types, the user on the receiving end
          // will receive a notification which then is used to update app state,
          // and shown on users messaging window to indicate the other is typing
          console.log('actioncable_manager in received, data ', data);
          if (data.notification === 'typing') {
            // if user types, disconnect for websockeet timer is reset
            resetDisconnectTimer({ time: props.disconnectTime, initial: false });
            // to show other user is typing, get notification from backend that other is typing
            // If the current timer is 0, then start the timer by reseting at typingTime declare at top
            // Resetting only at 0 avoids too many timers going at once;
            // Messaging.js handle message change also limits firing of notifications to every x seconds
            // Note: the timer is not reset while in countdown -- only when at 0.
            if (typingTimer === 0) {
              console.log('actioncable_manager in received, data.notification.typing ', data.notification);
              // function lapse time to count down timer then clear setInterval when at 0
              // NOTE: clearInterval MUST be called or will take up memory
              const lapseTime = () => {
                if (subTimer > 0) {
                  subTimer--;
                  console.log('actioncable_manager in received, data.notification.typing, in lapseTime, subTimer ', subTimer);
                } else {
                  console.log('actioncable_manager in received, data.notification.typing, in lapseTime, subTimer in else ', subTimer);
                  // when subtimer is 0, assign typing timer at 0
                  typingTimer = subTimer;
                  props.setTypingTimer({ typingTimer: subTimer });
                  console.log('actioncable_manager in received, data.notification.typing, in lapseTime, typingTimer in else ', typingTimer);
                  clearInterval(timer);
                }
              };
              // assign global constant typing time to subtimer to reset subtimer
              let subTimer = typingTime;
              // resets global typingTimer to make non-zero which would keep from resetting
              typingTimer = subTimer;
              // call action to set timer in app state; aset at typing time
              // the typing component will test if timer is 0 or not
              props.setTypingTimer({ typingTimer: subTimer, messageSender: data.user_id });
              console.log('actioncable_manager in received, data.notification.typing, typingTimer after setting at 5, messageSender ', typingTimer);

              const timer = setInterval(lapseTime, 1000);
            } // end of if typingTimer === 0
          } else if (data.notification === 'authenticated') { // if typing
            console.log('actioncable_manager in received, data.notification data.user_status, data.other_user_status else ', data.notification, data.user_status, data.other_user_status);
            // set disconnect time when user athenticates
            resetDisconnectTimer({ time: props.disconnectTime, initial: true });
            // set currentUser's userStatus in app state conversation reducer
            props.setUserStatus(data.user_status);
            // set the owner's userStatus to be used in showFlat page in app state conversation reducer
            if (data.other_user_status) props.setOtherUserStatus(data.other_user_status);
          } else if (data.notification === 'others_user_status_change') {
            console.log('actioncable_manager in received, else others_user_status_change data ', data);
          }
        }
      }, // end of received
      // this is not used but keep for reference
      create: function (chatContent) {
        this.perform('create', { content: chatContent });
      }, // end of create:
      // typing called on chats to send notification of user typing
      typing: function (addresseeId) {
        console.log('actioncable_manager this', this);
        this.perform('typing', { user_id: userId, addressee_id: addresseeId });
        // userId is the one typing; addresseeId is the intended recipient
      },
    }); // end of subscriptions.create and second object
  }

  function resetDisconnectTimer(data) {
    // receives data which is time and initial,
    // meaning if disconnect time is first set or false if it is reset
    console.log('resetDisconnectTimer lapseTime, subTimer data ', data);
    const lapseTime = () => {
      if (subTimerDisconnect > 0) {
        subTimerDisconnect--;
        console.log('resetDisconnectTimer lapseTime, subTimerDisconnect ');
      } else {
        console.log('resetDisconnectTimer lapseTime, subTimerDisconnect in else TIME IS UP!!!!!!! ', subTimerDisconnect);
        // typingTimer--;
        clearInterval(timerDisconnect);
        // disconnectTimer = subTimerDisconnect;
        handleDisconnectEvent('timedOut');
      }
    };
    subTimerDisconnect = data.time;
    // disconnectTimer = subTimerDisconnect;
    if (data.initial) {
      timerDisconnect = setInterval(lapseTime, 1000);
    } else {
      subTimerDisconnect = data.time;
    }
  }

  function authenticateChat() {
    const token = localStorage.getItem('token');
    chats.authenticated(token);
    props.setCableConnection({ cable, chats })
    console.log('authenticateChat in call back to chat connection authenticated, cable.connection', cable.connection);
    // console.log('authenticateChat in call back to chat connection authenticated, this.cable.connection.webSocket.onclose', this.cable.connection.webSocket.onclose);
    cable.connection.webSocket.onclose = (m) => {
      // onclose listener for when websocket is closed or disconnected;
      // if rails server is shutdown, this fires, and when server restarted, automatically connects; by npm actioncable???
      console.log('authenticateChat in call back to chat connection authenticated, webSocket onclose listener fired!!!!', m);
      // set webSocketConnected to false to change online indicator
      // set cable and chats in app state to null
      props.setComponentState({ webSocketConnected: false }, () => {
        props.propsWebSocketConnected({ connected: false, timedOut: m.code === 1000 ? true : false });
        console.log('authenticateChat in call back to chat connection authenticated, props.webSocketConnected', props.webSocketConnected);
        props.setCableConnection({ cable: null, chats: null });
      });
    };
    // KEEP for heartbeat ping; Need to figure out how to pong to backend ping
    // this.cable.connection.webSocket.onmessage = (m) => {
    // //onMessage listener for getting pings; This is onhold until can find out way to pong back.
    //   console.log('authenticateChat in call back to chat connection authenticated, webSocket onmessage listener fired!!! this.cable.subscriptions.subscriptions[0].identifier', this.cable.subscriptions.subscriptions[0].identifier);
    //     // const message = { command: 'message', identifier: { channel: 'ChatChannel', room: 'messaging_room_3' } };
    //     const message = { command: 'message', identifier: this.cable.subscriptions.subscriptions[0].identifier, data: JSON.stringify({ action: 'message', data: m.data.message }) };
    //     // const message = { command: 'message', event: 'ping', identifier: JSON.stringify({ channel: 'ChatChannel', room: 'messaging_room_3' }), data: JSON.stringify({ action: 'message', data: m.data.message }) };
    //     // const message = { command: 'message', identifier: { channel: 'ChatChannel', room: 'messaging_room_3' }, data: JSON.stringify({ type: 'ping', message: m.data.message }) };
    //     // const message = m.data.message;
    //     this.cable.connection.webSocket.send(JSON.stringify(message));
    //     // if (m.data.type === 'ping') {
    //     //   console.log('authenticateChat in call back to chat connection authenticated, webSocket onmessage listener fired!!!! m, m.data', m, m.data);
    //     //   return;
    //     // }
    //     // this.cable.connection.webSocket.send(message);
    //   // if webSocket connection is disconneted, actioncable_manager reconnects
    //   // this.actioncable_manager();
    // };// end of on message
  }

  function handleDisconnectEvent(trigger) {
    // disconnects consumer and stops streaming
    // message api: Finished "/cable/" [WebSocket] for 127.0.0.1 at 2019-12-19 15:51:01 +0900
    // ChatChannel stopped streaming from test_room
    // .disconnect causes webSocket.onclose listener to fire.
    // unsubscribe leading to reject does not fire onclose
    props.setComponentState({ webSocketConnected: false }, () => {
      console.log('actioncableManager, handleDisconnectEvent call back to webSocketConnected', props.webSocketConnected);
      props.propsWebSocketConnected({ connected: false, timedOut: trigger === 'timedOut' ? true : false });
      cable.disconnect();
      // chats.unsubscribe()
      props.setCableConnection({ cable: null, chats: null });
    });
  }

// calling main function
actioncable_manager(props.userId);
// no need to return but keep
if (props.makeConnection) return { cable, chats };
} // end of function
