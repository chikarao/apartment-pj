import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import AppLanguages from '../constants/app_languages';


class SignOut extends Component {
  componentWillMount() {
    // if (this.props.authenticated) {
      // disconnect cable only if propsCable is not null; ie cable is connected and not timedout  
      if (this.props.propsCable) this.props.propsCable.disconnect();
      this.props.signoutUser(() => this.signoutFB());
    // }
  }
  // below code signs user out of app as well as FB itself
  signoutFB() {
    if (FB) {
      FB.getLoginStatus(function (response) {
        console.log('in signout, signoutFB, getLoginStatus response FB: ', response, FB);
        if (response.status == 'connected') {
          FB.logout(() => {
            FB.getLoginStatus(function (res) {
              console.log('in signout, signoutFB, getLoginStatus after logout response: ', res);
            });
          }
            // FB.Auth.setAuthResponse(null, 'unknown');
            // console.log('in signout, signoutFB, after logout: ', response);
          );
        }
      });
      // FB.logout(function(response) {
      //   FB.Auth.setAuthResponse(null, 'unknown');
      //   });
    }
  }

  signoutMessage() {
    // const message = this.props.authenticated ?
    // <div className="signout-page-message">&nbsp;&nbsp;&nbsp;You're signed in. <br/><br/>Welcome Back!</div>
    // :
    // <div className="signout-page-message">&nbsp;&nbsp;&nbsp;You have been signed out. <br/><br/>Please come back soon!</div>;
    // return message;
    return <div className="signout-page-message">{AppLanguages.signOutMessage[this.props.appLanguageCode]}</div>;
  }

  renderMessage() {
    return this.signoutMessage();
  }

  render() {
    return (
      <div>{this.renderMessage()}</div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in signin modal, state: ', state);

  return {
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated,
    appLanguageCode: state.languages.appLanguageCode,
    propsCable: state.conversation.propsCable,
  };
}

export default connect(mapStateToProps, actions)(SignOut);
