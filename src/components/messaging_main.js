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
      windowWidth: window.innerWidth,
      showTrashBin: false,
      showArchiveBin: false,
      showAllConversations: true,
      filteredConversationsArray: []
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

  // componentDidUpdate() {
  //   if (this.props.conversations) {
  //     this.filterConversations();
  //   }
  // }

  handleResize() {
    // console.log('in messagingMain, createBackghandleResizeroundImage: ', this.state.windowWidth);
    this.setState({ windowWidth: window.innerWidth }, () => {
      console.log('in messagingMain, handleResize, this.state.windowWidth: ', this.state.windowWidth);
    });
  }

renderMainControls() {
  return (
    <div className="messaging-main-controls-left">
      <span value="archivebin" className="btn messaging-main-large-archive" onClick={this.handleMessageEditClick.bind(this)}>Archives</span>
      <span value="trashbin" className="btn messaging-main-large-archive" onClick={this.handleMessageEditClick.bind(this)}>Trash Bin</span>
      <span className="btn messaging-main-large-refresh" id="messaging-refresh" onClick={this.handleMessageRefreshClick.bind(this)}><i className="fa fa-refresh" aria-hidden="true"></i></span>
    </div>
  );
}

handleMessageEditClick(event) {
  const clickedElement = event.target;
  const elementVal = clickedElement.getAttribute('value');
  console.log('in messagingMain, handleMessageEditClick, clickedElement: ', clickedElement);
  console.log('in messagingMain, handleMessageEditClick, elementVal: ', elementVal);
  console.log('in messagingMain, handleMessageEditClick, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);

  if (elementVal == 'archive') {
    const conversationAttributes = { archived: true };
    this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes);
  }

  if (elementVal == 'trash') {
    const conversationAttributes = { trashed: true };
    this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes);
  }

  if (elementVal == 'trashbin') {
    this.setState({ showTrashBin: true, showArchiveBin: false, showAllConversations: false, filteredConversationsArray: [] }, () => {
      console.log('in messagingMain, handleMessageEditClick, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
      this.filterConversations();
    })
  }

  if (elementVal == 'archivebin') {
    this.setState({ showArchiveBin: true, showTrashBin: false, showAllConversations: false, filteredConversationsArray: [] }, () => {
    console.log('in messagingMain, handleMessageEditClick, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
    this.filterConversations();
    })
  }
}

renderEditControls() {
  return (
    <div className="messaging-main-controls-left">
      <span value="archive" className="btn messaging-main-large-archive" onClick={this.handleMessageEditClick.bind(this)}>Move to Archives</span>
      <span className="btn messaging-main-large-archive"></span>
      <span value="trash" className="btn messaging-main-large-trash" onClick={this.handleMessageEditClick.bind(this)}><i value="trash" className="fa fa-trash-o"></i></span>
    </div>
  );
}

updateFilteredConversationsArray() {

}

initialFilteredConversations() {
  const filteredConversationsArray = [];
  if (this.state.showAllConversations) {
    // filteredConversationsArray = this.props.conversations
    _.each(this.props.conversations, conv => {
      if (!conv.trashed && !conv.archived) {
        filteredConversationsArray.push(conv);
      }
    });
  }
  return filteredConversationsArray;
}

filterConversations() {
  if (this.props.conversations) {
    const filteredConversationsArray = [];
    console.log('in messagingMain, filterConversations, this.props.conversations : ', this.props.conversations);

    if (this.state.showTrashBin) {
      _.each(this.props.conversations, conv => {
        console.log('in messagingMain, filterConversations, if showTrashBin conv : ', conv);
        if (conv.trashed) {
          filteredConversationsArray.push(conv);
        }
      });
      this.setState({ filteredConversationsArray });
    }

    if (this.state.showArchiveBin) {
      _.each(this.props.conversations, conv => {
        console.log('in messagingMain, filterConversations, if showArchiveBin conv : ', conv);
        if (conv.archived) {
          filteredConversationsArray.push(conv);
        }
      });
      this.setState({ filteredConversationsArray });
    }
  }

  // console.log('in messagingMain, filterConversations, filteredConversationsArray  : ', filteredConversationsArray);
  // return filteredConversationsArray;
}


  renderConversations() {
    // {this.renderEachConversation()}
    return (
      <div className="messaging-main-conversation-box col-md-4">
        {this.props.checkedConversationsArray.length > 0 ? this.renderEditControls() : this.renderMainControls()}
        <ul>
          <Conversations
            conversations={this.state.showAllConversations ? this.initialFilteredConversations() : this.state.filteredConversationsArray}
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

  // renderMessagingControls() {
  //   return (
  //   );
  // }

  handleMessageRefreshClick() {
    console.log('in mypage, handleMessageRefreshClick: ');
    this.props.showLoading();
    this.props.fetchConversationsByUser(() => { this.loadingCallback(); });
  }

  loadingCallback() {
    this.props.showLoading();
  }

  render() {
    console.log('in messagingMain, render: ');
    // console.log('in Welcome, render, this.state: ', this.state)
    // <div className="messaging-main-controls-container">{this.renderMessagingControls()}</div>
    // console.log('in Welcome, render, this.state.show: ', this.state.show)
    return (
      <div className="messaging-main-main-container">
        <div className="messaging-main-container container">
          {this.renderConversations()}
          {this.renderMessages()}
        </div>
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
    conversationId: state.conversation.conversationToShow,
    checkedConversationsArray: state.conversation.checkedConversationsArray
  };
}

export default connect(mapStateToProps, actions)(MessagingMain);
