import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';
// import Cable from 'actioncable';

import actioncableManager from '../messaging/actioncable_manager';
// import DayPicker from 'react-day-picker';
// import DayPickerInput from 'react-day-picker/DayPickerInput';
// import $ from 'jquery';
// import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import SigninModal from './signin_modal';
import SignupModal from './signup_modal';
import ResetPasswordModal from './reset_password_modal';
// import EditProfileModal from '../modals/profile_edit_modal';
import Loading from '../modals/loading';
// import Lightbox from '../modals/lightbox';

import * as actions from '../../actions';
import languages from '../constants/languages';
import AppLanguages from '../constants/app_languages';
import GlobalConstants from '../constants/global_constants';

// const RESIZE_BREAK_POINT = 800;
const RESIZE_BREAK_POINT = GlobalConstants.resizeBreakPoint;
let connectionTimer = 0;
let disconnectTimer = 0;

class Header extends Component {
// **********THIS PART IS EXPERIMENTAL CODE ***********
  constructor() {
     super();
     this.state = {
        windowWidth: window.innerWidth,
        mobileNavVisible: false,
        show: false, // for auth modal
        showNewMessageBadge: true,
        webSocketConnected: false,
     };
     this.handleResize = this.handleResize.bind(this);
     this.handleLanguageSelectChange = this.handleLanguageSelectChange.bind(this);
     this.handleMailBoxClick = this.handleMailBoxClick.bind(this);
     this.handleAuthLinkClick = this.handleAuthLinkClick.bind(this);
     this.handleNavClick = this.handleNavClick.bind(this);
     this.handleOnlineOfflineSelectChange = this.handleOnlineOfflineSelectChange.bind(this);
    }

  componentDidMount() {
      const currentLocation = this.props.location.pathname;
       // console.log('in header, componentDidMount, this.props.auth.authenticated: ', this.props.auth.authenticated);
       window.addEventListener('resize', this.handleResize);
       this.props.getAppBaseObjects();
       if (this.props.auth.authenticated) {
         this.props.getCurrentUser();
         // this.props.getAppLanguages()
         // don't need to do anymore since this screws up flats in results and other pages
         // this.props.fetchFlatsByUser(this.props.auth.id, (flatIdArray) => this.fetchFlatsByUserCallback(flatIdArray));
         this.props.fetchConversationsByUser(() => {});
         // console.log('in header, componentDidMount, this.props.auth, userId: ', this.props.auth, userId);
         const userId = localStorage.getItem('id');

         if (userId) {
           this.props.fetchFlatsByUser(this.props.auth.id, () => {});
           this.props.setGetOnlineOffline({ user_id: userId, action: 'get' });
         }
       }
   }

   // shouldComponentUpdate() {
   // }

   // **************** Need to have these fucntions to pass to actionCableManager
   setComponentState = (stateObject, callback) => {
     this.setState(stateObject, callback);
   }
   // redux action to share typing timer seconds with rest of app in frontend
   setTypingTimer = (timerAttributes) => {
     this.props.setTypingTimer(timerAttributes);
   }
   // call action to set webSocketConnected and timed out in app state
   propsWebSocketConnected = (connected) => {
     // connected is a boolean
     this.props.webSocketConnected(connected);
   }
   // action to keep chats and cable in app state to be called outside of this component
   setCableConnection = (cableAttributes) => {
     this.props.setCableConnection(cableAttributes);
   }
   // update app state when receive conversation from backend in action cable chat_channel
   receiveConversation = (conv) => {
     this.props.receiveConversation(conv);
   }
   // update app state when receive userStatus kept in redis in backend
   // For current user; NOT flat owner user
   setUserStatus = (userStatus) => {
     this.props.setUserStatus(userStatus);
   }

   setOtherUserStatus = (userStatus) => {
     this.props.setOtherUserStatus(userStatus);
   }
   // For progress bar
   setProgressStatus = (status) => {
     this.props.setProgressStatus(status);
   }
   // **************** Need to have these fucntions to pass to actionCableManager

   componentDidUpdate(prevProps) {
     // specify which language at which the app state is currently set and change select box
     if (this.props.appLanguageCode) {
       const languageSelect = document.getElementById('header-language-selection-box-select');
       const optionIndex = this.getIndexOption('header-language-option', this.props.appLanguageCode, true);
       if (languageSelect) {
         languageSelect.selectedIndex = optionIndex;
       }
     }

     if (this.props.userStatus && (prevProps.userStatus !== this.props.userStatus)) {
       const onlineSelect = document.getElementById('header-online-selection-box-select');
       const optionOnlineIndex = this.getIndexOption('header-online-option', this.props.userStatus.online, false);
       if (onlineSelect) {
         // console.log('in header, componentDidUpdate, in if this.props.userStatus, onlineSelect, onlineSelect.selectedIndex, optionOnlineIndex: ', onlineSelect, onlineSelect.selectedIndex, optionOnlineIndex);
         onlineSelect.selectedIndex = optionOnlineIndex;
       }
     }
     // for websocket connection to actioncable when user logs on and off

     // const onShowPage = this.props.location.pathname.includes('/show/');
     const onShowPage = this.props.location.pathname.indexOf('/show/') !== -1;
     // connect cable if 1) NOT on showFlat page, OR 2) nonCablePageOverriden (set in eg messaging modal) is true, OR currentUserIsOwner is true
     const cableConnectPage = !onShowPage || this.props.nonCablePageOverriden || this.props.currentUserIsOwner;
     // console.log('in header, componentDidUpdate, prevProps.nonCablePageOverriden, this.props.nonCablePageOverriden, cableConnectPage: ', prevProps.nonCablePageOverriden, this.props.nonCablePageOverriden, cableConnectPage);
     // console.log('in header, componentDidUpdate, prevProps.propsWebSocketTimedOut, this.props.propsWebSocketTimedOut ', prevProps.propsWebSocketTimedOut, this.props.propsWebSocketTimedOut);

     if (prevProps.auth.authenticated !== this.props.auth.authenticated && this.props.auth.authenticated) {
       if (!this.state.webSocketConnected) {
         this.createSocketConnection(onShowPage);
       }
     }
     // for when user logs off and authenticated = false
     if (prevProps.auth.authenticated !== this.props.auth.authenticated && !this.props.auth.authenticated) {
        this.handleDisconnectEvent(onShowPage);
     }
     // for when page opens and webSocketConnected is initialized to false
     // but user is still logged on and authenticated = true
     // Case: not connected, is authenticated, no change in timeout, is not timed out and on cable connect page
     // also Connects when non currentUserIsOwner on showFlat jumps to non showflat page
     if (!this.props.propsWebSocketConnected && this.props.auth.authenticated && (prevProps.propsWebSocketTimedOut === this.props.propsWebSocketTimedOut) && !this.props.propsWebSocketTimedOut && cableConnectPage) {
       // console.log('in header, componentDidUpdate, in not connected and is authenticated this.state.webSocketConnected: ', this.state.webSocketConnected);
       this.createSocketConnection(onShowPage);
     }
     // logic for when websocked connection time out props CHANGES and IS NOT timed out
     // Case: not connected, is authenticated, IS a change in timeout, IS timed out and on cable connect page
     // So case for reconnecting after being timedout
     if (!this.props.propsWebSocketConnected && this.props.auth.authenticated && (prevProps.propsWebSocketTimedOut !== this.props.propsWebSocketTimedOut) && !this.props.propsWebSocketTimedOut && cableConnectPage) {
       // console.log('in header, componentDidUpdate, in not connected and is authenticated this.state.webSocketConnected: ', this.state.webSocketConnected);
       this.createSocketConnection(onShowPage);
     }
     // if CASE for 1) socket not connected, 2) authenticated, 3) NOT timed out with no change in timed out
     // 4) nonCablePageOverriden changes (in showpage) and 5) is on page where cable is connected
     if (!this.props.propsWebSocketConnected && this.props.auth.authenticated && (prevProps.propsWebSocketTimedOut === this.props.propsWebSocketTimedOut) && !this.props.propsWebSocketTimedOut && (prevProps.nonCablePageOverriden !== this.props.nonCablePageOverriden) && cableConnectPage) {
       // console.log('in header, componentDidUpdate, in not connected and is authenticated this.state.webSocketConnected: ', this.state.webSocketConnected);
       this.createSocketConnection(onShowPage);
     }
     // if CASE for user not currentUserIsOwner flat page jumps to other page that is not showFlat non currentUserIsOwner flat page
     // if (!this.props.propsWebSocketConnected && this.props.auth.authenticated && (prevProps.propsWebSocketTimedOut === this.props.propsWebSocketTimedOut) && !this.props.propsWebSocketTimedOut && (prevProps.nonCablePageOverriden === this.props.nonCablePageOverriden) && cableConnectPage) {
     //   console.log('in header, componentDidUpdate, in not connected and is authenticated this.state.webSocketConnected: ', this.state.webSocketConnected);
     //   this.createSocketConnection(onShowPage);
     // }
   }

   createSocketConnection(onShowPage) {
     // console.log('in header, createSocketConnection, onShowPage : ', onShowPage);
     let disconnectTime = 0;
     // !!!! Set disconnect time with below logic based on current page and if currentUserIsOwner
     if (onShowPage) {
       if (this.props.currentUserIsOwner) {
         disconnectTime = 15;
       } else {
         // disconnect time in showFlat messaging
         disconnectTime = 10;
       } // end of if currentUserIsOwner
     } else {
       disconnectTime = 60;
     } // end of if onShowPage

     if (connectionTimer === 0) {
       const lapseTime = () => {
         if (subTimer > 0) {
           subTimer--;
           // console.log('createSocketConnection in lapseTime, subTimer ');
         } else {
           // console.log('createSocketConnection in lapseTime, subTimer in else ', subTimer);
           // typingTimer--;
           clearInterval(timer);
           connectionTimer = subTimer;
         }
       };
       let subTimer = 5;
       connectionTimer = subTimer;
       const timer = setInterval(lapseTime, 1000);

       // **************** Need to have in actioncable
       const userId = this.props.auth.id;
       // !!!! Calling actionCableManager.js
       // Need to pass above defined actions to be used in actionCableManager
       actioncableManager({
         setComponentState: this.setComponentState,
         setTypingTimer: this.setTypingTimer,
         propsWebSocketConnected: this.propsWebSocketConnected,
         webSocketConnected: this.state.webSocketConnected,
         setCableConnection: this.setCableConnection,
         receiveConversation: this.receiveConversation,
         setProgressStatus: this.setProgressStatus,
         userId,
         makeConnection: true,
         disconnectTime,
         onShowPage,
         currentUserIsOwner: this.props.currentUserIsOwner,
         flat: this.props.flat,
         setUserStatus: this.setUserStatus,
         setOtherUserStatus: this.setOtherUserStatus,
       });
     }
   }

   getIndexOption(option, tagValue, language) {
     const optionTags = document.getElementsByClassName(option)
     const optionIndexArray = [];
     // console.log('in header, getIndexOption, optionTags : ', optionTags);
     // console.log('in header, getIndexOption, tagValue : ', tagValue);
     _.each(optionTags, (tag, i) => {
       // console.log('in header, getIndexOption,  this.props.appLanguageCode: ', this.props.appLanguageCode);
       if (language && tag.value === tagValue) {
         // console.log('in header, getIndexOption, tag.value, tagValue, tag.value == tagValue : ', tag.value, tagValue, tag.value == tagValue);
         optionIndexArray.push(i);
       }
       // !language means it's for online status
       if (!language && parseInt(tag.value, 10) === tagValue) {
         // console.log('in header, getIndexOption, parseInt(tag.value, 10), tagValue, tag.value == tagValue : ', tag.value, tagValue, tag.value == tagValue);
         optionIndexArray.push(i);
       }
     });
     // console.log('in header, getIndexOption, optionIndexArray : ', optionIndexArray);
     return optionIndexArray[0];
   }

   componentWillUnmount() {
     window.removeEventListener('resize', this.handleResize);
   }

   // !!! KEEP handleDisconnectEvent; Called in componentDidUpdate
   handleDisconnectEvent() {
     // event.preventDefault();
     // disconnects consumer and stops streaming
     // message api: Finished "/cable/" [WebSocket] for 127.0.0.1 at 2019-12-19 15:51:01 +0900
     // ChatChannel stopped streaming from test_room
     // .disconnect causes webSocket.onclose listener to fire.
     console.log('in header, handleDisconnectEvent, this.props.propsCable: ', this.props.propsCable);
     // unsubscribe leading to reject does not fire onclose
     if (this.props.propsCable) this.props.propsCable.disconnect();
     this.setState({ webSocketConnected: false }, () => {
       // console.log('handleDisconnectEvent call back to this.state.webSocketConnected', this.state.webSocketConnected);
     });
   }
   // ************************** Websocket Actioncable *************************

   // ***************LOADING****************
   showLoading = () => {
      // this.setState({ show: true }, () => console.log('in Welcome, showModal, this.state: ', this.state));
      // calls action craetor to set this.props.auth.showAuthModal to true
      this.props.showLoadingScreen();
    };
    // do not need this since there is no button, hide triggered by callback when process finished
    hideLoading = () => {
      // calls action craetor to set this.props.auth.showAuthModal to false
      // switch off showAuthModal only if it is true
      if (this.props.auth.showLoading) {
        this.props.showLoadingScreen(); //switch off showAuthModal to hide all auth modals
      }
    };

   // *************MODAL section*************
   showModal = () => {
      // this.setState({ show: true }, () => console.log('in Welcome, showModal, this.state: ', this.state));
      // calls action craetor to set this.props.auth.showAuthModal to true
      this.props.showAuthModal();
    };

    hideModal = () => {
      // calls action craetor to set this.props.auth.showAuthModal to false
      // switch off showAuthModal only if it is true
      if (this.props.auth.showAuthModal) {
        this.props.showAuthModal(); //switch off showAuthModal to hide all auth modals
        this.props.authError('');
      }

      if (this.props.auth.showSigninModal) {
        // if signin opened, switch off showSigninModal to hide signin modal
        this.props.showSigninModal();
        this.props.authError('');
      }

      if (this.props.auth.showSignupModal) {
        // if signin opened, switch off showSigninModal to hide signin modal
        this.props.showSignupModal();
        this.props.authError('');
      }

      if (this.props.auth.showResetPasswordModal) {
        // if reset password opened, switch off showResetPasswordModal to hide reset modal
        // so if sign in clicked, sign in opens since showResetPasswordModal is false
        this.props.showResetPasswordModal();
        this.props.authError('');
      }
    };

    renderLoadingScreen() {
      // console.log('in header, renderLoadingScreen, ');
      return (
        <div>
          <Loading
          // this is where to tell if to show loading or not
            // show={true}
            show={this.props.auth.showLoading}
          />
        </div>
      );
    }

    renderModal() {
      if (this.props.auth.showSigninModal) {
        return (
          <div>
            <SigninModal
              // close the modal when authenticated
              show={this.props.auth.authenticated ? false : this.props.auth.showAuthModal}
              // pass hideModal funtion in this header component to props handleClose in SigninModal
              handleClose={this.hideModal}
            />
          </div>
        )
      } else if (this.props.auth.showResetPasswordModal) {
        return (
          <div>
            <ResetPasswordModal
              show={this.props.auth.authenticated ? false : this.props.auth.showAuthModal}
              handleClose={this.hideModal}
            />
          </div>
        );
      } else if (this.props.auth.showEditProfileModal){
        return (
          <div>
          <EditProfileModal
            show={this.props.auth.showEditProfileModal}
            handleClose={this.hideModal}
          />
          </div>
        )
      } else if (this.props.auth.showSignupModal) {
        return (
          <div>
            <SignupModal
              // show={this.props.auth.showSignupModal}
              show={this.props.auth.showSignupModal}
              handleClose={this.hideModal}
            />
          </div>
        );
      }
    }
    // *************MODAL section*************

   handleResize() {
     this.setState({ windowWidth: window.innerWidth });
   }

   handleAuthLinkClick(event) {
     // console.log('in header, handleAuthLinkClick, event.target', event.target);
     const elementVal = event.target.getAttribute('value');
     // console.log('in header, handleAuthLinkClick, elementVal', elementVal);
     if (elementVal === 'signin') {
       // console.log('in header, handleAuthLinkClick, elementVal === sigin', true);
       this.showModal(); // turn on
       this.props.showSigninModal(); // turn on
     } else {
       this.showModal(); // turn on
       this.props.showSignupModal(); // turn on
     }
   }

  newMessages() {
    if (this.props.conversations) {
      const { conversations, flats } = this.props;
      const flatIdArray = [];
      _.each(flats, (flat) => {
        flatIdArray.push(flat.id);
      });

      let newMessages = false;
      _.each(conversations, conversation => {
        // const ownFlatConversation = flatIdArray.includes(conversation.flat_id);
        const ownFlatConversation = flatIdArray.indexOf(conversation.flat_id) !== -1;
        _.each(conversation.messages, message => {
          if (ownFlatConversation && message.sent_by_user) {
            if (message.read === false) {
              newMessages = true;
              // this.props.newMessagesOrNot(true);
            }
          }
        });
      });
      // console.log('in header, newMessagesOrNot, newMessages: ', newMessages);
      if (newMessages) {
        this.props.setNewMessages(true);
      }
    }
  }

  handleMailBoxClick() {
    this.props.history.push(`/messagingmain/${this.props.auth.id}`);
    // const win = window.open(`/messagingmain/${this.props.auth.id}`, '_blank');
    // win.focus();
    // console.log('in header, handleMailBoxClick: ');
  }

  handleLanguageSelectChange(event) {
    const changedElement = event.target;
    // console.log('in header, handleLanguageSelectChange, changedElement.value: ', changedElement.value);
    this.props.setAppLanguageCode(changedElement.value);
  }

  handleOnlineOfflineSelectChange(event) {
    const changedElement = event.target;
    // console.log('in header, handleLanguageSelectChange, changedElement.value: ', changedElement.value);
    // this.props.setGetOnlineOffline({ online: parseInt(changedElement.value, 10), user_id: this.props.auth.id });
    this.props.setGetOnlineOffline({ online: changedElement.value, user_id: this.props.auth.id, action: 'set' });
  }

  renderAppLanguageSelect() {
    // <option className="header-language-option"></option>
    console.log('in header, renderAppLanguageSelect: ');
    return (
      <div>
        <select
          id="header-language-selection-box-select"
          className="nav-item header-language-selection-box-select"
          onChange={this.handleLanguageSelectChange}
          // value={this.props.appLanguageCode}
        >
          <option className="header-language-option" value="jp">{languages['jp'].flag} {languages['jp'].name}</option>
          <option className="header-language-option" value="en">{languages['en'].flag} {languages['en'].name}</option>
        </select>
      </div>
    );
  }

  renderOnlineOfflineSelect() {
    // <option className="header-language-option"></option>
    // <div style={{ height: '10px', width: '10px', backgroundColor: '#39ff14', borderRadius: '50%', padding: '5px', margin: '5px'}}></div>
    console.log('in header, renderOnlineOfflineSelect, this.props.userStatus: ', this.props.userStatus);
    // NOTE: option tags cannot have any other tags as children.
    return (
      <div>
        <select
          id="header-online-selection-box-select"
          className="nav-item header-language-selection-box-select"
          onChange={this.handleOnlineOfflineSelectChange}
          // value={this.props.userStatus.online}
        >
          <option className="header-online-option" value="1">
            ✳️  Online
          </option>
          <option className="header-online-option" value="0">
            ✴️  Away
          </option>
        </select>
      </div>
    );
  }

  ownFlat(flatId) {
    _.each(this.props.flats, eachFlat => {
      // console.log('in header, ownFlat, flatId, eachFlat.id', flatId, eachFlat.id);
      if (eachFlat.id === flatId) {
        return true;
      }
    });
    return false;
  }

  renderNavigationLinks() {
    // reference: https://stackoverflow.com/questions/42253277/react-router-v4-how-to-get-current-route
    // added withRouter before connect
    // ********** LINKS AND DIVS TO RENDER: ***************
    // userStatus select: every page escept logged out page;
    // language select: every page;
    // mail link: Every page except on logged out page and show flat that is not the current user's flat
    // this is so that users will not click on mail and start a websocket connectdion
    // log out link: only on my page;
    // my page link: on every page except logged out page and my page:
    // *****************************************************
    // console.log('in header, renderNavigationLinks, this.props.newMessages: ', this.props.newMessages);
    // console.log('in header, renderNavigationLinks, onMyPage, onMessagingMainPage, onShowPage: ', onMyPage, onMessagingMainPage, onShowPage);
    if (this.props.authenticated) {
      const onMyPage = this.props.location.pathname === '/mypage';
      const onMessagingMainPage = this.props.location.pathname === `/messagingmain/${this.props.auth.id}`;
      // on show page pathname returned is like in string type: /show/2
      // const onShowPage = this.props.location.pathname.includes('/show/');
      const onShowPage = this.props.location.pathname.indexOf('/show/') !== -1;
      //   const currentFlatId = this.props.location.pathname.match(/\d+/)
      // regex to match one or more numbers in the pathname to get if user is owner of the flat; returns object
       // show link to signout and signed in as...
       // Link to signout mounts the signout component, and its componentDidMount calls the signout action in redux
         // const win = window.open(`/show/${this.props.flat.id}`, '_blank');
         // win.focus();
       return (
         <ul key={'1'} className={this.state.windowWidth <= RESIZE_BREAK_POINT ? 'mobile-header-list' : 'header-list'}>
          { onMyPage
            ?
            <li className="nav-item">
              <Link className="nav-link header-auth-link" to="/signout">{AppLanguages.signOut[this.props.appLanguageCode]}</Link>
            </li>
            :
            ''
          }
          { !onMyPage
            ?
            <li style={{ paddingTop: '15px' }} className="nav-item">
              <Link
              className="nav-link header-auth-link"
              to={'/mypage'}
              // {AppLanguages.myPage[this.props.appLanguageCode]}
              >
              <i style={{ fontSize: '25px' }}className="fas fa-user-circle"></i>
              </Link>
            </li>
            :
            ''
          }
           <li className="nav-item">
            <p className="nav-link">{AppLanguages.signedIn[this.props.appLanguageCode]} {this.props.email}</p>
           </li>
           { this.props.conversations && ((!onShowPage && !onMessagingMainPage) || (onShowPage && this.props.currentUserIsOwner))
             ?
             <li className="nav-item header-mail-li" onClick={this.handleMailBoxClick}>
               <div className="header-mail-box">
                {this.props.newMessages ? <div className="header-mail-number-box"><div className="header-mail-number">{this.props.newMessages}</div></div> : ''}
               <i className="fa fa-envelope"></i>
               </div>
             </li> :
             ''
           }
           <li className="nav-item header-language-selection-box-li">
             {this.renderAppLanguageSelect()}
           </li>
           <li className="nav-item header-language-selection-box-li">
            {this.renderOnlineOfflineSelect()}
           </li>
         </ul>
       );
    } else { // else of if authenticated
      // show link to sign in or sign out
      return [
        <ul key={'2'} className="header-list">
          <li className="nav-item">
            <div value="signin" className="header-links" onClick={this.handleAuthLinkClick}>{AppLanguages.signIn[this.props.appLanguageCode]}</div>
          </li>
          <li className="nav-item">
            <div value="signup" className="header-links" onClick={this.handleAuthLinkClick}>{AppLanguages.signUp[this.props.appLanguageCode]}</div>
          </li>
          <li className="nav-item header-language-selection-box-li">
            {this.renderAppLanguageSelect()}
          </li>
        </ul>
      ];
    }
  }

  resizeHeader(larger) {
    const header = document.getElementById('nav_container');
    // console.log('in header, resizeHeader, header: ', header);
    if (header) {
      if (larger) {
        header.setAttribute('style', 'height: 250px !important');
      } else {
        header.setAttribute('style', 'height: 80px !important');
      }
    }
  }

  handleNavClick() {
    if (!this.state.mobileNavVisible) {
      const larger = true;
      this.resizeHeader(larger);
      this.setState({ mobileNavVisible: true, showNewMessageBadge: false });
    } else {
      const larger = false;
      this.resizeHeader(larger);
      this.setState({ mobileNavVisible: false, showNewMessageBadge: true });
    }
  }

  renderMobileNav() {
    if (this.state.mobileNavVisible) {
      return (
        <div className="mobile-header">
          {this.renderNavigationLinks()}
        </div>
      );
    }
  }

  renderNavigation() {
    if (this.state.windowWidth <= RESIZE_BREAK_POINT) {
      //resize the header larger if mobileNavVisible is true; can happen if true and
      // window resized to large but return to smaller window
      if (this.state.mobileNavVisible) {
        const larger = true;
        this.resizeHeader(larger);
      }
      return [
        <div key={'3'} className="mobile_nav">
          <div className="header-hamburger" onClick={this.handleNavClick}>
            <div className="header-hamburger-box">
              <i className="fa fa-bars"></i>
              { (this.props.conversations && this.props.newMessages && this.state.showNewMessageBadge) ? <div className="header-mail-number-box"><div className="header-mail-number">{this.props.newMessages}</div></div> : ''}
            </div>
          </div>
          {this.renderMobileNav()}
        </div>
      ];
    } else { // else to if windowWidth <= RESIZE_BREAK_POINT
      const larger = false;
      this.resizeHeader(larger);
      return [
        <div key={'4'} className="nav_menu header">
          {this.renderNavigationLinks()}
        </div>
      ];
    }
  }

  render() {
    return (
      <div>
      {this.renderModal()}
      {this.renderLoadingScreen()}
      <div id="nav_container">
        <div>
          <Link to="/" className="navbar-brand"> <big style={{ color: 'blue' }}>RENT</big><big style={{ color: 'gray' }}>places</big> <br />
          <small>direct</small></Link>
        </div>
        {this.renderNavigation()}
      </div>
      </div>
    );
  }
//end of render
}
// end of class
function mapStateToProps(state) {
  console.log('in header, mapStateToProps, state: ', state)

  return {
    auth: state.auth,
    userStatus: state.conversation.userStatus,
    authenticated: state.auth.authenticated,
    currentUserIsOwner: state.flat.currentUserIsOwner,
    email: state.auth.email,
    id: state.auth.id,
    showLoading: state.auth.showLoading,
    showLightbox: state.auth.showLightbox,
    conversations: state.conversation.conversationsByUser,
    newMessages: state.conversation.newMessages,
    flats: state.flats.flatsByUser,
    flat: state.flats.selectedFlatFromParams,
    appLanguageCode: state.languages.appLanguageCode,
    propsCable: state.conversation.propsCable,
    propsChats: state.conversation.propsChats,
    propsWebSocketConnected: state.conversation.webSocketConnected,
    propsWebSocketTimedOut: state.conversation.webSocketTimedOut,
    nonCablePageOverriden: state.conversation.nonCablePageOverriden,
  };
}

export default withRouter(connect(mapStateToProps, actions)(Header));
