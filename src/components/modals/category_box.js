import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';

import AppLanguages from '../constants/app_languages';
// import MultiLineText from '../functions/multi_line_text';

class CategoryBox extends Component {
  constructor(props) {
   super(props);
   this.state = {
     displayChoiceBox: false,
     choiceBoxTop: null,
     choiceBoxLeft: null,
     // lastPanel: 'showMyBookings',
   };
   this.handleChoiceEllipsisClick = this.handleChoiceEllipsisClick.bind(this);
   this.handleChoiceEachClick = this.handleChoiceEachClick.bind(this);
 }

  componentDidMount() {
    // console.log('in Ellipsis, componentDidMount, called');
    // typingSubTimer replaced with GIF.
    // this.typingSubTimer();
  }

  handleChoiceEllipsisClick() {
      console.log('in CategoryBox, handleChoiceEllipsisClick, called, ');
    // get the choice box
    const choiceIcon = document.getElementById('choice-ellipsis');
    // get the coordinates of the choice box
    const rectChoice = choiceIcon.getBoundingClientRect();
    // set the top, left and show or hide choice box state variables
    this.setState({ displayChoiceBox: !this.state.displayChoiceBox, choiceBoxTop: rectChoice.top, choiceBoxLeft: rectChoice.left - 245 }, () => {
      // if click is to open the box, add addEventListener after some time to avoid
      // event listener to detect the opening click which causes it not to open
      if (this.state.displayChoiceBox) {
        setTimeout(() => {
          window.addEventListener('click', this.choiceEllipsisCloseClick);
        }, 100);
      } else {
        // if ellipsis click is to close, remvoe addEventListener
        window.removeEventListener('click', this.choiceEllipsisCloseClick);
      }
    });
    // const body = document.getElementById('messaging-main-main-container');
  }

  renderChoiceBox() {
    // const choiceObject =
    // {
      //   showMyLikes: 'My Likes',
      //   showMyFlats: 'My Flats',
      //   showMyBookings: 'My Bookings',
      //   showBookingsForMyFlats: 'Bookings for My Flats',
      //   showMyProfile: 'My Profile',
      //   showContractors: 'Contractors',
      //   showPaymentDetails: 'Payment Details',
      //   showBankAccounts: 'My Bank Accounts',
      // };

      // style={this.props.wsidePagePosition ? { top: this.state.choiceBoxTop + 20, left: this.state.choiceBoxLeft } : { top: this.props.widePagePosition.top, left: `${parseFloat(this.props.widePagePosition.width) / parseFloat(this.props.windowWidth)}px`}}
    return (
      <div
        className={this.state.displayChoiceBox ? 'my-page-choice-box display-block' : 'my-page-choice-box display-none'}
        style={{ top: this.state.choiceBoxTop + 20, left: this.state.choiceBoxLeft }}
      >
        {this.renderEachChoice(this.props.choiceObject)}
      </div>
    );
  }

  renderEachChoice(choiceObject) {
    return _.map(Object.keys(choiceObject), (each, i) => {
      // console.log('in CategoryBox, renderEachChoice, choiceObject, AppLanguages, each, choiceObject[each]: ', choiceObject, AppLanguages, each, choiceObject[each]);
      return (
        <div key={i} className="my-page-choice-box-each" style={this.props.lastPanel === each ? { fontWeight: 'bold' } : {}} value={each} onClick={this.handleChoiceEachClick}>
        {AppLanguages[each][this.props.appLanguageCode]}
        </div>
      );
    });
  }


  handleChoiceEachClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');

    if (this.state.lastPanel !== elementVal) {
      // Call setState sent in CategoryBox call props
      this.props.setLastPanelState({ [this.props.lastPanel]: false }, () => {
        this.props.setCurrentPanelState({ [elementVal]: true, lastPanel: elementVal });
        if (this.props.choiceObject[elementVal].fetch) this.props[this.props.choiceObject[elementVal].fetch]();
        console.log('in CategoryBox, handleChoiceEachClick, elementVal, this.props.choiceObject[elementVal].fetch: ', elementVal, this.props.choiceObject[elementVal].fetch);
      });
    }
  }

  choiceEllipsisCloseClick = (e) => {
    // fucntion passed to addEventListener
    const clickedElement = e.target;
    // get class name of clicked element
    const elementClassName = clickedElement.getAttribute('class');
    // split the class name string if not null since elements can have more than one class name
    const classArray = elementClassName ? elementClassName.split(' ') : null;
    // define array of classnames that you do not want to close
    const donotClosearray = ['my-page-choice-box', 'my-page-choice-box-each'];
    // check if clicked element is included in the donotClosearray
    let clickedInsideChoiceBox = false;
    _.each(donotClosearray, each => {
      // if (classArray && classArray.includes(each)) {
      if (classArray && classArray.indexOf(each) !== -1) {
        clickedInsideChoiceBox = true;
      }
    });
    // if clicked element class not null and not clicked inside choice box
    // set state to close box
    if ((classArray && !clickedInsideChoiceBox) || !classArray) {
      this.setState({ displayChoiceBox: false }, () => {
      });
      // remove eventListener when box closed
      window.removeEventListener('click', this.choiceEllipsisCloseClick);
    }
  }

  render() {
    // {this.props.showMobileView ? <i id="choice-ellipsis" className="fa fa-ellipsis-v" onClick={this.handleChoiceEllipsisClick}></i> : ''}
    return (
      <div>
        {<i id="choice-ellipsis" className="fa fa-ellipsis-v" onClick={this.handleChoiceEllipsisClick}></i>}
        {this.renderChoiceBox()}
      </div>
    );
  }
}
function mapStateToProps(state) {
  console.log('in CategoryBox, mapStateToProps, state: ', state);
  return {
    appLanguageCode: state.languages.appLanguageCode
    // yourFlat: state.conversation.yourFlat
  };
}

export default withRouter(connect(mapStateToProps, actions)(CategoryBox));
