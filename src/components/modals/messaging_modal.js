import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import languages from '../constants/languages';
import Messaging from '../messaging/messaging';

let showHideClassName;

class MessagingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    console.log('MessagingModal, componentDidMount');
    this.scrollLastMessageIntoView();
    this.props.cablePageOverrideAction(true);
    if (this.props.propsWebSocketTimedOut) {
      this.props.webSocketConnected({ timedOut: false });
    }
  }

  componentDidUpdate() {
    this.scrollLastMessageIntoView();
  }

  componentWillUnmount() {
    console.log('MessagingModal, componentWillUnmount, : ');
    this.props.cablePageOverrideAction(false);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Ooops! </strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  // turn off showMessagingModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    console.log('MessagingModal, handleClose, : ');
    this.props.cablePageOverrideAction(false);
    // showMessagingModal prop is passed from show page in form of setState function
    this.props.showMessagingModal();
  }

  scrollLastMessageIntoView() {
    const items = document.querySelectorAll('.each-message-box');
    // console.log('in MessagingModal, scrollLastMessageIntoView, items: ', items);

    const last = items[items.length - 1];
    // console.log('in messaging, scrollLastMessageIntoView, last: ', last);
    if (last) {
      last.scrollIntoView({ behavior: 'smooth' });
    }
  }

  renderMessaging() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main" style={{ height: '530px', padding: '20px', width: '420px' }}>
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <Messaging
            currentUserIsOwner={this.props.currentUserIsOwner}
            conversation={this.props.conversation}
            noConversationForFlat={this.props.noConversationForFlat}
            containerWidth={this.props.containerWidth}
            // noConversation={this.props.noConversation}
            fromShowPage
          />
        </div>
      </div>
    );
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    console.log('MessagingModal, render: ');
    return (
      <div>
        {this.renderMessaging()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in MessagingModal, mapStateToProps, state: ', state);
    return {
      auth: state.auth,
      successMessage: state.auth.success,
      errorMessage: state.auth.error,
      flat: state.selectedFlatFromParams.selectedFlatFromParams,
      appLanguageCode: state.languages.appLanguageCode,
      propsWebSocketConnected: state.conversation.webSocketConnected,
      propsWebSocketTimedOut: state.conversation.webSocketTimedOut,
    };
  }

export default connect(mapStateToProps, actions)(MessagingModal);
