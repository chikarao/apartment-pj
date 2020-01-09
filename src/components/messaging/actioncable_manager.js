// ************* COPIED FROM HOC SG *****************
import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import PropTypes from 'prop-types';
import Cable from 'actioncable';


// argument is compoent we want to wrap
export default function (props) {
  // let cable;
  // let chat;

  console.log('in ActioncableManager, props', props);
  let cable = props.cable;
  let chats = props.chat;
  let typingTimer = 0;

  function actioncable_manager(id) {
    cable = Cable.createConsumer('ws://localhost:3000/cable');
    // this.cable.connection.websocket.onclose = () => {
    //   // console.log('actioncable_manager this.cable.connection.websocket.onclose callback');
    // };
    console.log('actioncable_manager cable.connnection', cable.connection);
    console.log('actioncable_manager cable.connnection.consumer', cable.connection.consumer);
    console.log('actioncable_manager cable.connnection.subscriptions', cable.connection.subscriptions);
    console.log('actioncable_manager cable.connnection.webSocket', cable.connection.webSocket);
    console.log('actioncable_manager this', this);
    console.log('actioncable_manager id', id);
    const userId = localStorage.getItem('id') ? localStorage.getItem('id') : id;
    console.log('actioncable_manager localStorage userId', userId);
    // console.log('actioncable_manager Cable', Cable);
    chats = cable.subscriptions.create({
      channel: 'ChatChannel', room: `messaging_room_${userId}`
      // channel: 'ChatChannel', room: `room${this.props.auth.id}`
    }, {
      connected: (message) => {
          console.log('actioncable_manager in call back to connected message', message);
          console.log('actioncable_manager in call back to connected cable.connection.subscription', cable.connection.subscription);
          // console.log('actioncable_manager in call back to connected, this.chats', this.chats);
          // console.log('actioncable_manager in call back to connected, this.cable.connection.webSocket', this.cable.connection.webSocket);

          // if (!message && !this.state.webSocketConnected) {
          authenticateChat();
          // }
          // this.cable.connection.webSocket.onclose = function (event) {
          //   console.log('actioncable_manager in call back to connected, websocket onclose, connection closed, event', event);
          // }
          // this.webSocket = this.cable.connection.webSocket;
          if (!props.webSocketConnected) {
            props.setComponentState({ webSocketConnected: true });
            props.propsWebSocketConnected(true);
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

      // unsubscribe: () => {
      //     console.log('actioncable_manager in call back to unsubscribe');
      // }, // end of connected
      authenticated: function (token) {
        this.perform('authenticated', { token });
        console.log('***** Authenticating Action Cable Connection *******');
      },

      received: (data) => {
        console.log('actioncable_manager in received before if data', data);
        if (data.conversation) {
          // const chatLogs = [...this.state.chatLogs]; // create copy of state.chatLogs
          const conversation = JSON.parse(data.conversation);
          props.receiveConversation(conversation);
          // console.log('actioncable_manager this', this);
          // chatLogs.push(conversation);
          // this.setState({ chatLogs }, () => {
          //   console.log('actioncable_manager received Chatlogs after set state, this.state.chatLogs ', this.state.chatLogs);
          //   }
          // );  // end of setState
        } else if (data.notification) {
          console.log('actioncable_manager in received, data ', data);
          if (data.notification === 'typing') {
            if (typingTimer === 0) {
              console.log('actioncable_manager in received, data.notification.typing ', data.notification);
              const lapseTime = () => {
                if (subTimer > 0) {
                  subTimer--;
                  console.log('actioncable_manager in received, data.notification.typing, in lapseTime, subTimer ', subTimer);
                } else {
                  console.log('actioncable_manager in received, data.notification.typing, in lapseTime, subTimer in else ', subTimer);
                  // typingTimer--;
                  typingTimer = subTimer;
                  // this.setState({ typingTimer: subTimer }, () => {
                  props.setTypingTimer({ typingTimer: subTimer });
                    console.log('actioncable_manager in received, data.notification.typing, in lapseTime, typingTimer in else ', typingTimer);
                  // });
                  clearInterval(timer);
                }
              };
              // clearInterval(timer);
              let subTimer = 5;
              if (typingTimer < 5) {
                typingTimer = subTimer;
                // this.setState({ typingTimer: subTimer, messageSender: data.user_id }, () => {
                props.setTypingTimer({ typingTimer: subTimer, messageSender: data.user_id });
                console.log('actioncable_manager in received, data.notification.typing, typingTimer after setting at 5, messageSender ', typingTimer);
                // });
              }
              const timer = setInterval(lapseTime, 1000);
            }
          } else if (data.notification === 'authenticated') { // if typing
            console.log('actioncable_manager in received, data.notification else ', data.notification);
            resetDisconnectTimer(10);
          }
        }
      }, // end of received

      create: function (chatContent) {
        this.perform('create', { content: chatContent });
      }, // end of create:

      typing: function (addresseeId) {
        console.log('actioncable_manager this', this);
        this.perform('typing', { user_id: userId, addressee_id: addresseeId });
      },
    }); // end of subscriptions.create and second object
  }

  function resetDisconnectTimer(time) {
    const lapseTime = () => {
      if (subTimer > 0) {
        subTimer--;
        console.log('disconnectTimer lapseTime, subTimer ');
      } else {
        console.log('disconnectTimer lapseTime, subTimer in else TIME IS UP!!!!!!! ', subTimer);
        // typingTimer--;
        clearInterval(timer);
        // disconnectTimer = subTimer;
        handleDisconnectEvent();
      }
    };
    let subTimer = time;
    // disconnectTimer = subTimer;
    const timer = setInterval(lapseTime, 2000);
  }

  function authenticateChat() {
    const token = localStorage.getItem('token');
    chats.authenticated(token);
    console.log('authenticateChat in call back to chat connection authenticated, cable.connection', cable.connection);
    // console.log('authenticateChat in call back to chat connection authenticated, run');
    // console.log('authenticateChat in call back to chat connection authenticated, this', this);
    // console.log('authenticateChat in call back to chat connection authenticated, this.cable.connection.webSocket.onclose', this.cable.connection.webSocket.onclose);
    cable.connection.webSocket.onclose = (m) => {
      // onclose listener for when websocket is closed or disconnected;
      // if rails server is shutdown, this fires, and when server restarted, automatically connects; by npm actioncable???
      console.log('authenticateChat in call back to chat connection authenticated, webSocket onclose listener fired!!!!', m);
      // set webSocketConnected to false to change online indicator
      props.setComponentState({ webSocketConnected: false }, () => {
        props.propsWebSocketConnected(false);
        console.log('authenticateChat in call back to chat connection authenticated, props.webSocketConnected', props.webSocketConnected);
      });
      // if webSocket connection is disconneted, actioncable_manager reconnects
      // this.actioncable_manager();
    };
    // this.cable.connection.webSocket.onmessage = (m) => {
    // //onMessage listener for getting pings; This is onhold until can find out way to pong back.
    //   console.log('authenticateChat in call back to chat connection authenticated, webSocket onmessage listener fired!!!! m, m.data', m, m.data);
    //   console.log('authenticateChat in call back to chat connection authenticated, webSocket onmessage listener fired!!! this.cable.connection.webSocket', this.cable.connection.webSocket);
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

  function handleDisconnectEvent() {
    // event.preventDefault();
    // disconnects consumer and stops streaming
    // message api: Finished "/cable/" [WebSocket] for 127.0.0.1 at 2019-12-19 15:51:01 +0900
    // ChatChannel stopped streaming from test_room
    // .disconnect causes webSocket.onclose listener to fire.
    // unsubscribe leading to reject does not fire onclose
    props.setComponentState({ webSocketConnected: false }, () => {
      console.log('actioncableManager, handleDisconnectEvent call back to webSocketConnected', props.webSocketConnected);
      props.propsWebSocketConnected(false);
      cable.disconnect();
    });
    // this.chats.unsubscribeConnection(() => {
    // console.log('handleDisconnectEvent in call back to disconnect');
    // });
    // this.chats.unsubscribed();
  }

actioncable_manager(props.userId);

// const aVar = 'test a'
// console.log('actioncableManager this outside function call', this);
// function test(m) {
//   // this.value = m;
//   console.log('actioncableManager this in test function call m', m);
// }
//
// function test1() {
//   // this.test = 'test';
//   console.log('actioncableManager this in test function call', this);
//   console.log('actioncableManager this in test function aVar', aVar);
// }
//
// // const testArrow = () => {
// //   console.log('actioncableManager this in testArrowfunction call', this);
// // };
//
// // const testObject = new test('test');
// test('test');
// test1();
// testArrow();
if (props.makeConnection) return { cable, chats };
}
