import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

const INITIAL_STATE = { inMessaging: false }

class Messaging extends Component {
  constructor(props) {
   super(props);
   this.state = INITIAL_STATE;
 }

  componentDidMount() {
    // console.log('in show flat, componentDidMount, params', this.props.match.params);
    // // gets flat id from params set in click of main_cards or infowindow detail click
  }

  componentDidUpdate() {
    if (this.state.inMessaging) {
      this.scrollLastMessageIntoView();
    }
  }

  scrollLastMessageIntoView() {
    const items = document.querySelectorAll('.show-flat-each-message-box');
    console.log('in messaging, scrollLastMessageIntoView, items: ', items);

    const last = items[items.length - 1];
    console.log('in messaging, scrollLastMessageIntoView, last: ', last);
    if (last) {
      last.scrollIntoView();
    }
  }

  handleMessageSendClick(event) {
    const { user_id, flat_id, id } = this.props.conversation[0];
    console.log('in messaging, handleMessageSendClick, clicked: ', event);
    const messageText = document.getElementById('show-flat-messsage-textarea').value;
    console.log('in messaging, handleMessageSendClick, messageText: ', messageText);
    console.log('in messaging, handleMessageSendClick, this.props.conversation, flat_id, user_id: ', flat_id, user_id, id);
    this.props.createMessage({ body: messageText, flat_id, user_id, conversation_id: id, sent_by_user: true }, (flatId) => this.createMessageCallback(flatId));
  }

  createMessageCallback(id) {
    console.log('in show_flat, createMessageCallback, id: ', id);
    // this.props.history.push(`/show/${id}`);
    // this.setState(this.state);
    // this.props.fetchConversationByFlatAndUser(id);
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

  renderEachMessage() {
    console.log('in messaging, renderEachMessage,this.props.conversation: ', this.props.conversation[0]);
    if (this.props.conversation) {
      const { conversation } = this.props;
      // conversation is an array
      const messages = conversation[0].messages;
      console.log('in messaging, renderEachMessage, after if, this.props.conversation: ', this.props.conversation[0]);
      console.log('in messaging, renderEachMessage, after if, conversation.messages: ', messages);

      return _.map(messages, (message, i) => {
        console.log('in messaging, renderEachMessage, message: ', message);
        const date = new Date(message.created_at)

        if (message.sent_by_user) {
          console.log('in messaging, renderEachMessage, message.sent_by_user: ', message.sent_by_user);
          console.log('in messaging, renderEachMessage, date message.created_at: ', message.created_at);
          console.log('in messaging, renderEachMessage, date message.created_at: ', message.created_at);
          console.log('in messaging, renderEachMessage, date message.read: ', message.read);
          console.log('in messaging, renderEachMessage, date: ', date);
          return (
            <div key={message.id} className="show-flat-each-message-box">
              <div className="show-flat-each-message-user">
                <div className="show-flat-each-message-date">{this.formatDate(date)}</div>
                <div className="show-flat-each-message-content-user">{message.body}</div>
                <div className="show-flat-each-message-read">{message.read ? 'Seen' : 'Unseen'}</div>
              </div>
            </div>
          );
        } else {
          return (
            <div key={message.id} className="show-flat-each-message-box">
              <div className="show-flat-each-message">
                <div className="show-flat-each-message-date">{this.formatDate(date)}</div>
                <div className="show-flat-each-message-content">{message.body}</div>
                <div className="show-flat-each-message-read">{message.read ? 'Seen' : 'Unseen'}</div>
              </div>
            </div>
          );
        }
      });
    }
  }

  renderMessages() {
    return (
      <div>
        {this.renderEachMessage()}
      </div>
    );
  }


  renderMessaging() {
    // const conversationIsEmpty = _.isEmpty(this.props.conversation);
    console.log('in messaging, renderMessaging. this.props.conversation: ', this.props.conversation);
    if (this.props.conversation) {
      console.log('in messaging, renderMessaging. this.props.conversation, after if: ', this.props.conversation);
      return (
        <div className="show-flat-message-box-container">
        <div className="show-flat-message-box">
        <div className="show-flat-message-show-box">{this.renderMessages()}</div>
        <textarea id="show-flat-messsage-textarea" className="show-flat-message-input-box wideInput" type="text" maxLength="200" placeholder="Enter your message here..." />
        <button className="btn btn-primary btn-sm show-flat-message-btn" onClick={this.handleMessageSendClick.bind(this)}>Send</button>
        </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div>{this.renderMessaging()}</div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in messaging, mapStateToProps, state: ', state);
  return {
    conversation: state.conversation.conversationByFlatAndUser,
    flat: state.flat.selectedFlatFromParams
  };
}

export default withRouter(connect(mapStateToProps, actions)(Messaging));
