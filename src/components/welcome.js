import React, { Component } from 'react';
import { connect } from 'react-redux';

import Upload from './images/upload_test';
import SigninModal from './auth/signin_modal';
import SignupModal from './auth/signup_modal';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  showModal = () => {
     this.setState({ show: true }, () => console.log('in Welcome, showModal, this.state: ', this.state));
   };

   hideModal = () => {
     this.setState({ show: false }, () => console.log('in Welcome, hideModal, this.state: ', this.state));
   };

   renderModal() {
     if (this.props.auth.showSigninModal) {
       return (
         <div>
           <SigninModal
           show={this.props.auth.authenticated ? false : this.state.show}
           handleClose={this.hideModal}
           />
         </div>
       )
     } else {
       return (
         <div>
           <SignupModal
           show={this.props.auth.authenticated ? false : this.state.show}
           handleClose={this.hideModal}
           />
         </div>
       );
     }
   }

  render() {
    console.log('in Welcome, render, this.state: ', this.state)
    console.log('in Welcome, render, this.state.show: ', this.state.show)
    return (
      <div>
        {this.renderModal()}
        <button type="button" onClick={this.showModal}>
         open
       </button>
        <Upload />
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in mypage, mapStateToProps, state: ', state);
  return {
    // flat: state.selectedFlatFromParams.selectedFlat,
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Welcome);
