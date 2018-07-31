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
const RESIZE_BREAK_POINT = 800;

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
      this.conversationSlideIn();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('in messagingMain, componentDidUpdate, prevProps, prevState: ', prevProps, prevState);
    console.log('in messagingMain, componentDidUpdate : ',);
    // if (this.state.showTrashBin) {
    //   _.each(this.props.conversations, conv => {
    //     if (conv.trashed) {
    //       this.filterConversations();
    //     }
    //   })
    // }
    //
    // if (this.state.showArchiveBin) {
    //   _.each(this.props.conversations, conv => {
    //     if (conv.archived) {
    //       this.filterConversations();
    //     }
    //   })
    // }
    // if (this.props.conversations) {
    //   this.filterConversations();
    // }
      // this.filterConversations();
  }

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
          <span value="archivebin" className="messaging-main-large-archive">Archived Messages</span>
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
          <span value="trashbin" className="messaging-main-large-archive">Trash Bin</span>
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
  // after conversation checkbox checked, handles what to do with the conversations;
  handleMessageEditClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in messagingMain, handleMessageEditClick, clickedElement: ', clickedElement);
    console.log('in messagingMain, handleMessageEditClick, elementVal: ', elementVal);
    console.log('in messagingMain, handleMessageEditClick, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);

    // eleementVal is the conversation id
    // calls action to update conversation in api to mark them archived = true
    if (elementVal == 'archive') {
      const conversationAttributes = { archived: true };
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
          this.props.checkedConversations(this.props.checkedConversationsArray);
        });
      // this.setState({ checkedConversationsArray: [] });
      this.setState({ showAllConversations: true });
    }

    // calls action to update conversation in api to mark them trashed = true
    if (elementVal == 'trash') {
      const conversationAttributes = { trashed: true };
        this.props.updateConversations(this.props.checkedConversationsArray, conversationAttributes, () => {
          console.log('in messagingMain, handleMessageEditClick, if elementVal == trash, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
          this.props.checkedConversations(this.props.checkedConversationsArray);
        // this.props.checkedConversations([]);
          this.setState({ showAllConversations: true }, () => {});
        });
      // this.setState({ checkedConversationsArray: [] });
      console.log('in messagingMain, handleMessageEditClick, this.state: ', this.state);
    }

    // calls action to update conversation in api to mark them trashed = false
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

    // calls action to update conversation in api to mark them archive = false
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

    // if user clicks on trash bin link, set state to show trash bin view
    if (elementVal == 'trashbin') {
      this.setState({ showTrashBin: true, showArchiveBin: false, showAllConversations: false, filteredConversationsArray: [] }, () => {
        console.log('in messagingMain, handleMessageEditClick, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
        this.filterConversations();
      })
    }

    // if user clicks on archive bin link, set state to show archive bin view
    if (elementVal == 'archivebin') {
      this.setState({ showArchiveBin: true, showTrashBin: false, showAllConversations: false, filteredConversationsArray: [] }, () => {
        console.log('in messagingMain, handleMessageEditClick, this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
        this.filterConversations();
      })
    }
  }

  // Called when conversation checkboxes checked; shos archive and trash box links
  renderEditControls() {
    return (
      <div className="messaging-main-controls-left">
        <span value="archive" className="btn messaging-main-large-archive" onClick={this.handleMessageEditClick.bind(this)}>Move to Archives</span>
        <span className="btn messaging-main-large-archive"></span>
        <span value="trash" className="btn messaging-main-large-trash" onClick={this.handleMessageEditClick.bind(this)}><i value="trash" className="fa fa-trash-o"></i></span>
      </div>
    );
  }

  // filters for conversations that are not trashed or archived; called in renderConversations
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
  // filters conversation based on attributes of conversations, trashed or archived
  // and passes to conversation.js
  // called in renderConversations
  filterConversations() {
    if (this.props.conversations) {
      const filteredConversationsArray = [];
      console.log('in messagingMain, filterConversations, this.props.conversations : ', this.props.conversations);

      if (this.state.showTrashBin) {
        _.each(this.props.conversations, conv => {
          console.log('in messagingMain, filterConversations, if showTrashBin conv : ', conv);
          // trashed can either be archived or not, so when untrashed, goes back to archives
          if (conv.trashed && (conv.archived || !conv.archived)) {
            filteredConversationsArray.push(conv);
          }
        });
        // this.setState({ filteredConversationsArray }, () => {
        //   console.log('in messagingMain, filterConversations, if showTrashBin conv, setState callback this.state.filteredConversationsArray: ', this.state.filteredConversationsArray);
        // });
      }

      if (this.state.showArchiveBin) {
        _.each(this.props.conversations, conv => {
          console.log('in messagingMain, filterConversations, if showArchiveBin conv : ', conv);
          // archived cannot be trashed
          if (conv.archived && !conv.trashed) {
            filteredConversationsArray.push(conv);
          }
        });
        // this.setState({ filteredConversationsArray });
      }
      return filteredConversationsArray;
    } // end of first if
    // console.log('in messagingMain, filterConversations, filteredConversationsArray  : ', filteredConversationsArray);
    // return filteredConversationsArray;
  }

  // Calls conversation.js and passes conversations to show based on which box (trash, archive)
  // the user has selected
  renderConversations() {
    // console.log('in messagingMain, renderConversations, document.getElementsByTagName  : ', document.getElementsByTagName('input'));
    // console.log('in messagingMain, renderConversations, document.getElementsByClassName  : ', document.getElementsByClassName('conversations-input-checkbox'));
    const moveElemment = document.getElementById('conversation-main-ul');
    console.log('in messagingMain, renderConversations, moveElemment: ', moveElemment);
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
      // <div className="messaging-main-conversation-box col-md-4">
      <div className={this.state.windowWidth > RESIZE_BREAK_POINT ? 'messaging-main-conversation-box col-md-4' : 'messaging-main-mobile-conversation-box'}>
        {this.props.checkedConversationsArray.length > 0 && !this.state.showTrashBin && !this.state.showArchiveBin ? this.renderEditControls() : this.renderEachMainControl()}
          <Conversations
            // conversations={this.state.showAllConversations ? this.initialFilteredConversations() : this.state.filteredConversationsArray}
            conversations={this.state.showAllConversations ? this.initialFilteredConversations() : this.filterConversations() }
            onMessagingMain
            onMessageMainMobile={this.state.windowWidth < RESIZE_BREAK_POINT}
          />
      </div>
    );
  }

  // Class wrapping messaging switches based on window size
  // passes props onMessagingMain and mobileView based on window size
  // noConversation is for messages on showFlat; if noConversation for flat with user,
  // show message to send message if needed
  // conversatinoId passed to specify messages to show for which conversation
  renderMessages() {
    // <div className="messaging-main-messages-box col-md-8">
    // console.log('in messagingMain, renderMessages: this.props.conversationId', this.props.conversationId);
    return (
      <div className={this.state.windowWidth < RESIZE_BREAK_POINT ? 'my-page-message-box' : 'messaging-main-messages-box col-md-8' }>
      <Messaging
        currentUserIsOwner={false}
        // conversation={this.state.conversationToShow}
        noConversation={this.props.noConversation}
        // yourFlat={this.state.yourFlat}
        conversationId={this.props.conversationId}
        onMessagingMain
        mobileView={this.state.windowWidth < RESIZE_BREAK_POINT}
        largeTextBox={this.state.windowWidth > RESIZE_BREAK_POINT}
        // conversationId={this.state.conversationId}
      />
      </div>
    );
  }

  handleMessageRefreshClick() {
    // console.log('in messagingMain, handleMessageRefreshClick: ');
    this.props.showLoading();
    this.props.fetchConversationsByUser(() => { this.loadingCallback(); });
  }

  // called to turn off loading modal after conversations are refreshed
  loadingCallback() {
    this.props.showLoading();
  }

  // conversationSlideIn() {
  //     const moveElemment = document.getElementById('conversation-main-ul');
  //     // console.log('in messagingMain, conversationRollIn, moveElemment: ', moveElemment);
  //     let pos = -100;
  //     if (moveElemment) {
  //       // moveElemment.style.left = '-100% !important';
  //       // moveElemment.setAttribute('style', 'left: -100%;');
  //
  //       // console.log('in messagingMain, conversationRollIn, getAttribute style: ', moveElemment.getAttribute('style'));
  //       // console.log('in messagingMain, conversationRollIn, inside if moveElemment, pos: ', moveElemment, pos);
  //       // const id = setInterval(frame, 10);
  //       let id = '';
  //       frame();
  //       function frame() {
  //         // console.log('in messagingMain, conversationRollIn, inside function frame, pos: ', moveElemment, pos);
  //         if (pos == 0) {
  //           // clearInterval(id);
  //           window.cancelAnimationFrame(id);
  //         } else {
  //           console.log('in messagingMain, conversationRollIn, inside if pos: ', pos);
  //           pos = pos + 1;
  //           id = window.requestAnimationFrame(frame);
  //           // moveElemment.style.top = pos + 'px';
  //           // moveElemment.style.left = pos + 'px';
  //           // moveElemment.style.left = `${pos} % !important`;
  //           moveElemment.setAttribute('style', `left: ${pos}%`);
  //         }
  //       }
  //     }
  // }

  conversationSlideIn() {
      const moveElemment = document.getElementById('conversation-main-ul');
      // console.log('in messagingMain, conversationRollIn, moveElemment: ', moveElemment);
      let pos = -100;
      if (moveElemment) {
        // moveElemment.style.left = '-100% !important';
        // moveElemment.setAttribute('style', 'left: -100%;');

        // console.log('in messagingMain, conversationRollIn, getAttribute style: ', moveElemment.getAttribute('style'));
        // console.log('in messagingMain, conversationRollIn, inside if moveElemment, pos: ', moveElemment, pos);
        const id = setInterval(frame, 10);
        function frame() {
          // console.log('in messagingMain, conversationRollIn, inside function frame, pos: ', moveElemment, pos);
          if (pos == 0) {
            clearInterval(id);
          } else {
            console.log('in messagingMain, conversationRollIn, inside if pos: ', pos);
            pos = pos + 5;
            // moveElemment.style.top = pos + 'px';
            // moveElemment.style.left = pos + 'px';
            // moveElemment.style.left = `${pos} % !important`;
            moveElemment.setAttribute('style', `left: ${pos}%`);
          }
        }
      }
  }

  // When messages are being rendered, click hamburger toggle back to conversations view
  handleMessageHamburgerClick() {
    this.props.showConversations();
    // this.conversationRollIn();
    this.props.checkedConversations(this.props.checkedConversationsArray);
    const moveElemment = document.getElementById('conversation-main-ul');
    console.log('in messagingMain, handleMessageHamburgerClick, moveElemment: ', moveElemment);
  }
// mobile version of messaging; showConversation is a boolean set in
// Conversation handleConversationCardClick; when conversation is clicked, shows messages
  renderMobileMessaging() {
    return (
      <div>
        <div className="my-page-category-title">
          <span className="my-page-category-left"><span id="messaging-hamburger" className={this.props.showConversationCards ? 'hide' : ''} onClick={this.handleMessageHamburgerClick.bind(this)} ><i className="fa fa-bars"></i></span></span>
          <span>Mail Box</span>
          <span className="my-page-category-right"></span>
        </div>
        {this.props.showConversationCards ? this.renderConversations() : this.renderMessages()}
      </div>
    );
  }

  // renders mobile version and regular web version based on window size, RESIZE_BREAK_POINT
  // my-page classes to simplify; my page messaging will be gone but keeping it for now;
  // conversation and messaging come from component/messaging/conversation.js and messaging.js
  render() {
    console.log('in messagingMain, render this.props.checkedConversationsArray: ', this.props.checkedConversationsArray);
    // console.log('in Welcome, render, this.state: ', this.state)
    // <div className="messaging-main-controls-container">{this.renderMessagingControls()}</div>
    // console.log('in Welcome, render, this.state.show: ', this.state.show)

    // if (this.state.windowWidth < RESIZE_BREAK_POINT) {
    //     return (
    //       <div>
    //         {this.renderMobileMessaging()}
    //       </div>
    //     );
    // }

    return (
      <div className="messaging-main-main-container">
       {this.state.windowWidth > RESIZE_BREAK_POINT ?
         <div className="messaging-main-container container">
         {this.renderConversations()}
         {this.renderMessages()}
         </div>
         :
         <div className="my-page-category-container">
         {this.renderMobileMessaging()}
         </div>
       }
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
    checkedConversationsArray: state.conversation.checkedConversationsArray,
    showConversationCards: state.conversation.showConversations,
  };
}

export default connect(mapStateToProps, actions)(MessagingMain);
