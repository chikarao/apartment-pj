import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
// import cloudinary from 'cloudinary-core';

import * as actions from '../actions';

import Messaging from './messaging/messaging';
import Conversations from './messaging/conversations';

//
// const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
// const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

class MessagingMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth
    };
  }

  componentDidMount() {
    console.log('in messagingMain, componentDidMount');
      window.addEventListener('resize', this.handleResize.bind(this));
      // this.props.match.params.id
      this.props.fetchFlatsByUser(this.props.match.params.id, () => {})
      this.props.fetchConversationsByUser(() => {});
      this.props.fetchProfileForUser();
  }

  handleResize() {
    // console.log('in messagingMain, createBackghandleResizeroundImage: ', this.state.windowWidth);
    this.setState({ windowWidth: window.innerWidth }, () => {
      console.log('in messagingMain, handleResize, this.state.windowWidth: ', this.state.windowWidth);
    });
  }

  renderConversations() {
    // {this.renderEachConversation()}
    return (
      <div className="messaging-main-conversation-box col-md-4">
        <ul>
          <Conversations
            conversations={this.props.conversations}
            onMessagingMain
          />
          </ul>
      </div>
    );
  }

  // renderMessages() {
  //   return <div className="messaging-main-messages-box col-md-8">Messages</div>;
  // }

  renderMessages() {
    console.log('in mypage, renderMessages: this.props.conversationId', this.props.conversationId);
    return (
      <div className="messaging-main-messages-box col-md-8">
      <Messaging
        currentUserIsOwner={false}
        // conversation={this.state.conversationToShow}
        noConversation={this.props.noConversation}
        // yourFlat={this.state.yourFlat}
        conversationId={this.props.conversationId}
        onMessagingMain
        largeTextBox
        // conversationId={this.state.conversationId}
      />
      </div>
    );
  }

  render() {
    console.log('in messagingMain, render: ');
    // console.log('in Welcome, render, this.state: ', this.state)
    // console.log('in Welcome, render, this.state.show: ', this.state.show)
    return (
      <div className="messaging-main-container container">
        {this.renderConversations()}
        {this.renderMessages()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in messagingM, mapStateToProps, state: ', state);
  return {
    // flat: state.selectedFlatFromParams.selectedFlat,
    auth: state.auth,
    flats: state.flats.flatsByUser,
    // selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    // bookingsByUser: state.fetchBookingsByUserData.fetchBookingsByUserData,
    // auth: state.auth,
    conversations: state.conversation.conversationByUserAndFlat,
    noConversation: state.conversation.noConversation,
    conversationId: state.conversation.conversationToShow
  };
}

export default connect(mapStateToProps, actions)(MessagingMain);
