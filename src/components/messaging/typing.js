import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

import AppLanguages from '../constants/app_languages';
import MultiLineText from '../functions/multi_line_text';

class Typing extends Component {
  constructor(props) {
   super(props);
   this.state = {};
 }

  // componentDidMount() {
    // console.log('in Typing, componentDidMount, params', this.props.match.params);
  // }
  //
  // componentDidUpdate() {
  //   // if (this.state.inMessaging) {
  //
  // }

  shouldComponentUpdate(nextProps) {
    console.log('in Typing, shouldComponentUpdate, this.props, nextProps', this.props, nextProps);
    if (this.props.typingTimer !== nextProps.typingTimer) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <div>{this.props.typingTimer > 0 ? 'Typing...' : ''}</div>
    );
  }
}
// messaging is designed to be used on my page and show flat
// takes booleans fromShowPage, currentUserIsOwner passed from show flat page and
// Note that uses conversation (singular) passed as props from show flat and covnversations (plural) from app state
// uses app state so that the component rerenders when a message is sent
function mapStateToProps(state) {
  console.log('in Typing, mapStateToProps, state: ', state);
  return {
    // auth: state.auth,
    // conversations: state.conversation.conversationByUserAndFlat,
    // noConversation: state.conversation.noConversation,
    // noConversationForFlat: state.conversation.noConversationForFlat,
    // flat: state.flat.selectedFlatFromParams,
    // thisIsYourFlat: state.conversation.yourFlat,
    appLanguageCode: state.languages.appLanguageCode
    // yourFlat: state.conversation.yourFlat
  };
}

export default withRouter(connect(mapStateToProps, actions)(Typing));
