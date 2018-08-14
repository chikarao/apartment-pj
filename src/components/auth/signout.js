import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class SignOut extends Component {
  componentWillMount() {
    this.props.signoutUser(() => this.signoutFB());
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

  render() {
    return (
      <div className="signout-page-message">You have been signed out. <br/><br/>Please come back soon!</div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in signin modal, state: ', state);

  return {
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, actions)(SignOut);
