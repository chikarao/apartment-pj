import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';
import typingWaitingGif from '../../assets/typing_waiting.gif'

import AppLanguages from '../constants/app_languages';
// import MultiLineText from '../functions/multi_line_text';

let typingSubTimerOut = 0;

class Typing extends Component {
  constructor(props) {
   super(props);
   this.state = {
     typingSubTimerCount: 0,
     dots: '',
   };
 }

  componentDidMount() {
    // console.log('in Typing, componentDidMount, called');
    // typingSubTimer replaced with GIF.
    // this.typingSubTimer();
  }
  //
  // componentDidUpdate() {
  //   // if (this.state.inMessaging) {
  //
  // }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log('in Typing, shouldComponentUpdate, called, nextState.dots, this.state.dots, nextState.dots !== this.state.dots', nextState.dots, this.state.dots, nextState.dots !== this.state.dots);
    if (nextState.dots != this.state.dots) {
      console.log('in Typing, shouldComponentUpdate, called, nextState.dots, this.state.dots, nextState.dots !== this.state.dots', nextState.dots, this.state.dots, nextState.dots !== this.state.dots);
      return true;
    }
    return false;
  }

  changeDots(count, max) {
    // console.log('in typing, typingSubTimer in lapseTime, count, max ', count, max);
    let changedCount = count;
    let dotString = '';
    if (count > 0) {
      changedCount--;
    } else {
      changedCount = max;
    }

    _.times(changedCount, () => {
      dotString += '.';
    });
    // console.log('in typing, typingSubTimer in lapseTime, dotString ', dotString);

    return { dotString, count: changedCount };
  }

  typingSubTimer() {
    if (typingSubTimerOut === 0) {
      let dotCount = 0;
      let dotStringObj;
      // let dotString = '';
      const lapseTime = () => {
        if (subTimer > 0) {
          subTimer--;
          dotStringObj = this.changeDots(dotCount, maxDotCount);
          // console.log('in typing, typingSubTimer in lapseTime, dotStringObj ', dotStringObj);
          dotCount = dotStringObj.count;
          this.setState({ dots: dotStringObj.dotString }, () => {
            // console.log('in typing, typingSubTimer in lapseTime, this.state.dotString ', this.state.dotString);
          });
        } else {
          // typingTimer--;
          clearInterval(timer);
          typingSubTimerOut = subTimer;
          dotStringObj = this.changeDots(dotCount, maxDotCount);
          dotCount = dotStringObj.count;
          this.setState({ dots: dotStringObj.dotString }, () => {
            // console.log('in typing, typingSubTimer in lapseTime, this.state.dotString in else ', this.state.dotString);
          });
        }
      };
      let subTimer = 11;
      typingSubTimerOut = subTimer;
      const maxDotCount = 3;
      const timer = setInterval(lapseTime, 400);
    }
  }


  // shouldComponentUpdate(nextProps) {
  //   console.log('in Typing, shouldComponentUpdate, this.props, nextProps', this.props, nextProps);
  //   if (this.props.typingTimer !== nextProps.typingTimer) {
  //     return true;
  //   }
  //
  //   return false;
  // }

  render() {
    // <img key={index} value={index} src={'url(http://res.cloudinary.com/chikarao/image/upload/w_792,h_1122,q_60/apartmentpj-constant-assetstyping_waiting.jpg)} alt=""/>
    // `url(http://res.cloudinary.com/chikarao/image/upload/w_792,h_1122,q_60,pg_${page}/${constantAssetsFolder}${image}.jpg)`
    console.log('in Typing, render');
    // <div>{this.props.typingTimer > 0 ? `User ${this.props.messageSender}` + 'is typing' + `${this.state.dots}` : ''}</div>
    // <img style={{ borderRadius: '5px' }} src={'https://res.cloudinary.com/chikarao/image/upload/w_50,h_40/v1578883625/apartmentpj-constant-assets/cat_typing.gif'} alt="" />
    return (
      <div>
      {this.props.typingTimer > 0 ?
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', padding: '3px' }}>
          <div style={{ padding: '4px' }}>{`User ${this.props.messageSender}` + ' is typing'}</div>
          <div style={{ backgroundColor: 'white' }}>
            <img style={{ height: '50px', width: '90px', borderRadius: '5px', backgroundColor: 'white !important' }} src={typingWaitingGif} alt="" />
          </div>
        </div>

        :
        ''}
      </div>
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
