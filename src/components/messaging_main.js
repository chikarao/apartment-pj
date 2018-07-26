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

  // componentDidUpdate(prevProps, prevState) {
  //   // console.log('in messagingMain, componentDidUpdate, prevProps, prevState: ', prevProps, prevState);
  //   console.log('in messagingMain, componentDidUpdate, prevProps.conversations, this.props.conversations: ', prevProps.conversations, this.props.conversations);
  //   // if (this.state.showTrashBin) {
  //   //   _.each(this.props.conversations, conv => {
  //   //     if (conv.trashed) {
  //   //       this.filterConversations();
  //   //     }
  //   //   })
  //   // }
  //   //
  //   // if (this.state.showArchiveBin) {
  //   //   _.each(this.props.conversations, conv => {
  //   //     if (conv.archived) {
  //   //       this.filterConversations();
  //   //     }
  //   //   })
  //   // }
  //   // if (this.props.conversations) {
  //   //   this.filterConversations();
  //   // }
  //     // this.filterConversations();
  // }

  handleResize() {
    // console.log('in messagingMain, createBackghandleResizeroundImage: ', this.state.windowWidth);
    this.setState({ windowWidth: window.innerWidth }, () => {
      console.log('in messagingMain, handleResize, this.state.windowWidth: ', this.state.windowWidth);
    });
  }

  handleMessageBackClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in messagingMain, handleMessageBackClick, clickedElement: ', clickedElement);
    console.log('in messagingMain, handleMessageBackClick, elementVal: ', elementVal);
    // this.props.checkedConversations(this.props.checkedConversationsArray);
    this.setState({ showAllConversations: true, showArchiveBin: false, showTrashBin: false });
  }

  renderEachMainControl() {
    if (this.state.showAllConversations) {
      return (
        <div className="messaging-main-controls-left">
          <span value="archivebin" className="btn messaging-main-large-archive" onClick={this.handleMessageEditClick.bind(this)}>Archives</span>
          <span value="trashbin" className="btn messaging-main-large-archive" onClick={this.handleMessageEditClick.bind(this)}>Trash Bin</span>
          <span className="btn messaging-main-large-refresh" id="messaging-refresh" onClick={this.handleMessageRefreshClick.bind(this)}><i className="fa fa-refresh" aria-hidden="true"></i></span>
        </div>
      );
    }
    if (this.state.showArchiveBin) {
      // <span className="btn messaging-main-large-refresh" id="messaging-refresh" onClick={this.handleMessageRefreshClick.bind(this)}><i className="fa fa-refresh" aria-hidden="true"></i></span>
      return (
        <div className="messaging-main-controls-left">
          <span value="archivebin" className="btn messaging-main-large-archive" onClick={this.handleMessageBackClick.bind(this)}><i className="fa fa-angle-left"></i></span>
          <span value="archivebin" className="btn messaging-main-large-archive">Archived Messages</span>
          <span value="unarchive" className="btn messaging-main-large-archive"  onClick={this.handleMessageEditClick.bind(this)}>Unarchive</span>
          <span value="trash" className="btn messaging-main-large-trash" onClick={this.handleMessageEditClick.bind(this)}><i value="trash" className="fa fa-trash-o"></i></span>
        </div>
      );
    }
    if (this.state.showTrashBin) {
      // <span className="btn messaging-main-large-refresh" id="messaging-refresh" onClick={this.handleMessageRefreshClick.bind(this)}><i className="fa fa-refresh" aria-hidden="true"></i></span>
      return (
        <div className="messaging-main-controls-left">
          <span value="archivebin" className="btn messaging-main-large-archive" onClick={this.handleMessageBackClick.bind(this)}><i className="fa fa-angle-left"></i></span>
          <span value="trashbin" className="btn messaging-main-large-archive">Trash Bin</span>
          <span value="untrash" className="btn messaging-main-large-archive" onClick={this.handleMessageEditClick.bind(this)}>Untrash</span>
        </div>
      );
    }
  }

  renderMainControls() {
    return (
      <div>
      {this.renderEachMainControl()}
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
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
          this.props.checkedConversations(this.props.checkedConversationsArray);
        });
      // this.setState({ checkedConversationsArray: [] });
      this.setState({ showAllConversations: true });
    }

    if (elementVal == 'trash') {
      const conversationAttributes = { trashed: true, archived: false };
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
          console.log('in messagingMain, handleMessageEditClick, if elementVal == trash, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
          this.props.checkedConversations(this.props.checkedConversationsArray);
        // this.props.checkedConversations([]);
          this.setState({ showAllConversations: true }, () => {});
        });
      // this.setState({ checkedConversationsArray: [] });
      console.log('in messagingMain, handleMessageEditClick, this.state: ', this.state);

    }
    if (elementVal == 'untrash') {
      const conversationAttributes = { trashed: false };
      console.log('in messagingMain, handleMessageEditClick, if elementVal == untrash, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
          this.props.checkedConversations(this.props.checkedConversationsArray);
        // this.props.checkedConversations([]);
          // this.setState({ showAllConversations: true }, () => {});
          // this.filterConversations();
        });
      // this.setState({ checkedConversationsArray: [] });
      // console.log('in messagingMain, handleMessageEditClick, this.state: ', this.state);
    }
    if (elementVal == 'unarchive') {
      const conversationAttributes = { archived: false };
      console.log('in messagingMain, handleMessageEditClick, if elementVal == unarchive, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
          this.props.checkedConversations(this.props.checkedConversationsArray);
        // this.props.checkedConversations([]);
          // this.setState({ showAllConversations: true }, () => {});
          // this.filterConversations();
        });
      // this.setState({ checkedConversationsArray: [] });
      // console.log('in messagingMain, handleMessageEditClick, this.state: ', this.state);
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
        this.setState({ filteredConversationsArray }, () => {
          console.log('in messagingMain, filterConversations, if showTrashBin conv, setState callback this.state.filteredConversationsArray: ', this.state.filteredConversationsArray);
        });
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
      // return filteredConversationsArray;
    } // end of first if
    // console.log('in messagingMain, filterConversations, filteredConversationsArray  : ', filteredConversationsArray);
    // return filteredConversationsArray;
  }


  renderConversations() {
    // console.log('in messagingMain, renderConversations, document.getElementsByTagName  : ', document.getElementsByTagName('input'));
    console.log('in messagingMain, renderConversations, document.getElementsByClassName  : ', document.getElementsByClassName('conversations-input-checkbox'));
    // uncheck any checkboxes on conversations; Somehow, when conversation input checked and trashed,
    // the first conversation input that is subsequently rendered is rendered checked. This code does not work in the covnersations.js
    // the propblem seems to be that conversations are rendered before input attributes are updated
    const checkboxes = document.getElementsByClassName('conversations-input-checkbox')
    if (this.props.checkedConversationsArray.length < 1) {
      _.each(checkboxes, cb => {
        cb.checked = false
      });
      // if (checkboxes.length > 1) {
      //   checkboxes[0].checked = false;
      // }
    }
    return (
      <div className="messaging-main-conversation-box col-md-4">
        {this.props.checkedConversationsArray.length > 0 && !this.state.showTrashBin && !this.state.showArchiveBin ? this.renderEditControls() : this.renderMainControls()}
        <ul>
          <Conversations
            conversations={this.state.showAllConversations ? this.initialFilteredConversations() : this.state.filteredConversationsArray}
            // conversations={this.state.showAllConversations ? this.initialFilteredConversations() : this.filterConversations() }
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
    console.log('in messagingMain, render this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
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
