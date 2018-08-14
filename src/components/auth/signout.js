import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class SignOut extends Component {
  componentWillMount() {
    this.props.signoutUser(() => this.signoutFB());
  }

  signoutFB() {
    if (FB) {
      FB.getAuthResponse(function(response) {
        console.log('in signout, signoutFB, getAuthResponse response: ', response)

      });
      // FB.logout(function(response) {
      //   // user is now logged out
      //   console.log('in signout, signoutFB, logout response: ', response)
      // });
    }
  }

  render() {
    return (
      <div className="signout-page-message">You have been signed out. <br/><br/>Please come back soon!</div>
    );
  }
}

export default connect(null, actions)(SignOut);
