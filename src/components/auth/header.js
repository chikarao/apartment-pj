import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import _ from 'lodash';

// import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
// import $ from 'jquery';
// import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import SigninModal from './signin_modal';
import SignupModal from './signup_modal';
import ResetPasswordModal from './reset_password_modal';
import EditProfileModal from '../modals/profile_edit_modal';
import Loading from '../modals/loading';
// import Lightbox from '../modals/lightbox';

import * as actions from '../../actions';

const RESIZE_BREAK_POINT = 800;

class Header extends Component {
// **********THIS PART IS EXPERIMENTAL CODE ***********
  constructor() {
       super();
       this.state = {
            windowWidth: window.innerWidth,
            mobileNavVisible: false,
            show: false, // for auth modal
            showNewMessageBadge: true,
       };
   }

  componentDidMount() {
       window.addEventListener('resize', this.handleResize.bind(this));
       this.props.getCurrentUser();
       // don't need to do anymore since this screws up flats in results and other pages
       // this.props.fetchFlatsByUser(this.props.auth.id, (flatIdArray) => this.fetchFlatsByUserCallback(flatIdArray));
       this.props.fetchConversationsByUser(() => {});
       this.props.fetchFlatsByUser(this.props.auth.id, () => {})
   }

   // fetchFlatsByUserCallback(flatIdArray) {
   //   console.log('in mypage, fetchFlatsByUserCallback, flatIdArray: ', flatIdArray);
   //   // this.props.fetchConversationByUserAndFlat(flatIdArray);
   // }
   // componentDidUpdate() {
   //
   // }
   componentWillUnmount() {
       window.removeEventListener('resize', this.handleResize.bind(this));
   }

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
      }

      if (this.props.auth.showSigninModal) {
        // if signin opened, switch off showSigninModal to hide signin modal
        this.props.showSigninModal();
      }

      if (this.props.auth.showResetPasswordModal) {
        // if reset password opened, switch off showResetPasswordModal to hide reset modal
        // so if sign in clicked, sign in opens since showResetPasswordModal is false
        this.props.showResetPasswordModal();
      }

      if (this.props.auth.showEditProfileModal) {
        // if reset password opened, switch off showResetPasswordModal to hide reset modal
        // so if sign in clicked, sign in opens since showResetPasswordModal is false
        // switch off showEditProfileModal boolean
        this.props.showEditProfileModal();
        // document.location.reload();
        this.props.history.push(`/myPage`);

      }
    };

    renderLoadingScreen() {
      console.log('in header, renderLoadingScreen, ');
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

    // renderLightboxScreen() {
    //   console.log('in header, renderLightboxScreen, ');
    //   return (
    //     <div>
    //       <Lightbox
    //         // this is where to tell if to show loading or not
    //         // show={true}
    //         show={this.props.auth.showLightbox}
    //       />
    //     </div>
    //   );
    // }

    renderModal() {
      if (this.props.auth.showSigninModal) {
        return (
          <div>
            <SigninModal
              show={this.props.auth.authenticated ? false : this.props.auth.showAuthModal}
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
      } else {
        return (
          <div>
            <SignupModal
            show={this.props.auth.authenticated ? false : this.props.auth.showAuthModal}
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
     console.log('in header, handleAuthLinkClick, event.target', event.target);
     const elementVal = event.target.getAttribute('value');
     console.log('in header, handleAuthLinkClick, elementVal', elementVal);
     if (elementVal === 'signin') {
       console.log('in header, handleAuthLinkClick, elementVal === sigin', true);
       this.props.showSigninModal();
       this.showModal();
     } else {
       this.showModal();
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
      console.log('in header, newMessagesOrNot, conversations: ', conversations);
      _.each(conversations, conversation => {
        const ownFlatConversation = flatIdArray.includes(conversation.flat_id);
        _.each(conversation.messages, message => {
          if (ownFlatConversation && message.sent_by_user) {
            if (message.read === false) {
              newMessages = true;
              // this.props.newMessagesOrNot(true);
            }
          }
        });
      });
      console.log('in header, newMessagesOrNot, newMessages: ', newMessages);
      if (newMessages) {
        this.props.setNewMessages(true);
      }
    }
  }

  navigationLinks() {
    console.log('in header, navigationLinks, this.props.location: ', this.props.location);
    // reference: https://stackoverflow.com/questions/42253277/react-router-v4-how-to-get-current-route
    // added withRouter before connect
    const onMyPage = this.props.location.pathname === '/mypage';
    console.log('in header, navigationLinks, onMyPage: ', onMyPage);


    if (this.props.authenticated) {
      console.log('in header, navigationLinks, this.props.newMessages: ', this.props.newMessages);
       // show link to signout and signed in as...
       // const newMessages = this.newMessagesOrNot();

       if (onMyPage) {
         console.log('in header, navigationLinks, if on mypage, newMessages: ', this.props.newMessages);
         console.log('in header, navigationLinks, if on mypage, this.props.conversations: ', this.props.conversations);
         return [
           <ul key={'1'} className={this.state.windowWidth <= RESIZE_BREAK_POINT ? 'mobile-header-list' : 'header-list'}>
             <li className="nav-item">
              <Link className="nav-link" to="/signout">Sign Out</Link>
             </li>
             <li className="nav-item">
              <p className="nav-link">Signed in as {this.props.email}</p>
             </li>
             { this.props.conversations ?
               <li className="nav-item header-mail-li">
               <div className="header-mail-box">
               {this.props.newMessages ? <div className="header-mail-number-box"><div className="header-mail-number">{this.props.newMessages}</div></div> : ''}
               <i className="fa fa-envelope"></i>
               </div>
               </li> :
               ''
             }
           </ul>
         ];
       } else {
         //consider opedning mypage in new tab...
         // const win = window.open(`/show/${this.props.flat.id}`, '_blank');
         // win.focus();
         // if (this.props.conversations) {
           // console.log('in header, navigationLinks, else mypage, newMessages: ', this.props.newMessages);
           // console.log('in header, navigationLinks, else mypage, this.props.conversations: ', this.props.conversations);
           return [
             <ul key={'1'} className={this.state.windowWidth <= RESIZE_BREAK_POINT ? 'mobile-header-list' : 'header-list'}>
               <li className="nav-item">
                <Link className="nav-link" to={'/mypage'} >My Page</Link>
               </li>
               <li className="nav-item">
                <p className="nav-link">Signed in as {this.props.email}</p>
               </li>
               { this.props.conversations ?
                 <li className="nav-item header-mail-li">
                 <div className="header-mail-box">
                 {this.props.newMessages ? <div className="header-mail-number-box"><div className="header-mail-number">{this.props.newMessages}</div></div> : ''}
                 <i className="fa fa-envelope"></i>
                 </div>
                 </li> :
                 ''
               }
             </ul>
           ];
         // } // end of if this.props.conversations
       }
       //end of second if
    } else {
      // show link to sign in or sign out
      return [
        <ul key={'2'} className="header-list">
          <li className="nav-item">
            <div value="signin" className="header-links" onClick={this.handleAuthLinkClick.bind(this)}>Sign In</div>
          </li>
          <li className="nav-item">
            <div value="signup" className="header-links" onClick={this.handleAuthLinkClick.bind(this)}>Sign Up</div>
          </li>
        </ul>

      ];
    }
    // return [
    //   <ul>
    //     <li className="nav-item"key={1}><Link to="about">ABOUT</Link></li>
    //     <li className="nav-item"key={2}><Link to="blog">BLOG</Link></li>
    //     <li className="nav-item"key={3}><Link to="portfolio">PORTFOLIO</Link></li>
    //   </ul>
    // ];
  }

    resizeHeader(larger) {
      const header = document.getElementById('nav_container');
      console.log('in header, resizeHeader, header: ', header);
      if (header) {
        if (larger) {
          header.setAttribute('style', 'height: 200px !important');
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
          {this.navigationLinks()}
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
          <div className="header-hamburger" onClick={this.handleNavClick.bind(this)}>
            <div className="header-hamburger-box">
              <i className="fa fa-bars"></i>
              { (this.props.conversations && this.props.newMessages && this.state.showNewMessageBadge) ? <div className="header-mail-number-box"><div className="header-mail-number">{this.props.newMessages}</div></div> : ''}
            </div>
          </div>
          {this.renderMobileNav()}
        </div>
      ];
    } else {
      const larger = false;
      this.resizeHeader(larger);
      return [
        <div key={'4'} className="nav_menu header">
          {this.navigationLinks()}
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
          <Link to="/" className="navbar-brand"> FLATS flats <br />
          <small>and more flats</small></Link>
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
    authenticated: state.auth.authenticated,
    email: state.auth.email,
    id: state.auth.id,
    showLoading: state.auth.showLoading,
    showLightbox: state.auth.showLightbox,
    conversations: state.conversation.conversationsByUser,
    newMessages: state.conversation.newMessages,
    flats: state.flats.flatsByUser
  };
}

export default withRouter(connect(mapStateToProps, actions)(Header));
