import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

class SignOut extends Component {
  componentWillMount() {
    this.props.signoutUser();
  }
  render() {
    return (
      <div className="signout-page-message">You have been signed out. <br/><br/>Please come back soon!</div>
    );
  }
}

export default connect(null, actions)(SignOut);
