import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
// import $ from 'jquery';
// import { Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import SigninModal from './signin_modal';
import SignupModal from './signup_modal';
import ResetPasswordModal from './reset_password_modal';
import EditProfileModal from '../modals/profile_edit_modal';

import * as actions from '../../actions';

class Header extends Component {
// **********THIS PART IS EXPERIMENTAL CODE ***********
  constructor() {
       super();
       this.state = {
            windowWidth: window.innerWidth,
            mobileNavVisible: false,
            show: false // for auth modal
       };
   }

  componentDidMount() {
       window.addEventListener('resize', this.handleResize.bind(this));
       this.props.getCurrentUser();
   }

   componentWillUnmount() {
       window.removeEventListener('resize', this.handleResize.bind(this));
   }
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
        this.props.showEditProfileModal();
        document.location.reload();
      }
    };

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

  navigationLinks() {
    console.log('in header, navigationLinks, this.props.location: ', this.props.location);
    // reference: https://stackoverflow.com/questions/42253277/react-router-v4-how-to-get-current-route
    // added withRouter before connect
    const onMyPage = this.props.location.pathname === '/mypage';
    console.log('in header, navigationLinks, onMyPage: ', onMyPage);

    if (this.props.authenticated) {
       // show link to signout and signed in as...
       if (onMyPage) {
         return [
           <ul key={'1'} className="header-list">
             <li className="nav-item">
              <Link className="nav-link" to="/signout">Sign Out</Link>
             </li>
             <li className="nav-item">
              <p className="nav-link">Signed in as {this.props.email}</p>
             </li>
           </ul>
         ];
       } else {
         return [
           <ul key={'1'} className="header-list">
             <li className="nav-item">
              <Link className="nav-link" to={'/mypage'} >My Page</Link>
             </li>
             <li className="nav-item">
              <p className="nav-link">Signed in as {this.props.email}</p>
             </li>
           </ul>
         ];
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

  handleNavClick() {
    if (!this.state.mobileNavVisible) {
      this.setState({ mobileNavVisible: true });
    } else {
      this.setState({ mobileNavVisible: false });
    }
  }
  renderMobileNav() {
    if (this.state.mobileNavVisible) {
      return this.navigationLinks();
    }
  }

  renderNavigation() {
    if (this.state.windowWidth <= 800) {
      return [
        <div key={'3'} className="mobile_nav">
          <p className="header-hamburger" onClick={this.handleNavClick.bind(this)}><i className="fa fa-bars"></i></p>
          {this.renderMobileNav()}
        </div>
      ];
    } else {
      return [
        <div key={'4'} className="nav_menu">
          {this.navigationLinks()}
        </div>
      ];
    }
  }

  render() {
    return (
      <div className="nav_container">
        {this.renderModal()}
        <div>
          <Link to="/" className="navbar-brand"> FLATS flats <br />
          <small>and more flats</small></Link>
        </div>
        {this.renderNavigation()}
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
    id: state.auth.id
  };
}

export default withRouter(connect(mapStateToProps, actions)(Header));
