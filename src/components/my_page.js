import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';

import * as actions from '../actions';
import Messaging from './messaging/messaging';
import Conversations from './messaging/conversations';
import UploadForProfile from './images/upload_for_profile';
import CardInputModal from './modals/card_input_modal';
import BankAccountCreateModal from './modals/bank_account_create_modal';
import BankAccountEditModal from './modals/bank_account_edit_modal';
import ContractorEditModal from './modals/contractor_edit_modal';
import ContractorCreateModal from './modals/contractor_create_modal';
import StaffEditModal from './modals/staff_edit_modal';
import StaffCreateModal from './modals/staff_create_modal';
import ProfileEditModal from './modals/profile_edit_modal';
import ProfileCreateModal from './modals/profile_create_modal';
import Contractor from './constants/contractor';
import Languages from './constants/languages';
import GlobalConstants from './constants/global_constants';
import CategoryBox from './modals/category_box';

import CardTypes from './constants/card_types'

import AppLanguages from './constants/app_languages';

// const BLANK_PROFILE_PICTURE = 'blank_profile_picture_4';
const BLANK_PROFILE_PICTURE = GlobalConstants.blankProfilePicture;
const CLIENT_ID = process.env.STRIPE_DEVELOPMENT_CLIENT_ID;
const RESIZE_BREAK_POINT = GlobalConstants.resizeBreakPoint;
// const RESIZE_BREAK_POINT = 800;

const CATEGORY_OBJECT = {
  showMyLikes: { methodName: 'renderLikes', heading: '' },
  showMyFlats: { methodName: 'renderFlats', heading: '' },
  showMyBookings: { methodName: 'renderBookings', heading: '' },
  showBookingsForMyFlats: { methodName: 'renderOwnFlatBookings', heading: '' },
  showMyProfile: { methodName: 'renderProfile', heading: '' },
  showContractors: { methodName: 'renderContractors', heading: '' },
  showPaymentDetails: { methodName: 'renderPayments', heading: '' },
  showBankAccounts: { methodName: 'renderBankAccounts', heading: '' },
};

class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // not being used
      sortByDate: false,
      // showConversation done in app state action this.props.showConversation
      // and props this.props.showConversationCards
      // showConversation: true,
      conversationToShow: {},
      // yourFlat: false,
      conversationId: '',
      selectedContractorId: '',
      selectedContractor: {},
      selectedStaffId: '',
      showStaffBox: false,
      windowWidth: window.innerWidth,
      displayChoiceBox: false,
      choiceBoxTop: null,
      choiceBoxLeft: null,
      // showMyLikes: false,
      // showMyFlats: false,
      showMyBookings: true,
      // showBookingsForMyFlats: false,
      // showMyProfile: false,
      // showPaymentDetails: false,
      // showBankAccounts: false,
      // showContractors: false,
      showStaff: false,
      lastPanel: 'showMyBookings',
      // actionType: 'Add a Card'
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleBookingCardClick = this.handleBookingCardClick.bind(this);
    this.handleFlatCardClick = this.handleFlatCardClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleMessageHamburgerClick = this.handleMessageHamburgerClick.bind(this);
    this.handleMessageRefreshClick = this.handleMessageRefreshClick.bind(this);
    this.handleBookingCardClick = this.handleBookingCardClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleUnlikeClick = this.handleUnlikeClick.bind(this);
    this.handleRemoveProfileImage = this.handleRemoveProfileImage.bind(this);
    this.handleAddEditProfileClick = this.handleAddEditProfileClick.bind(this);
    this.handleCardDefaultCheck = this.handleCardDefaultCheck.bind(this);
    this.handleCardEditDeleteClick = this.handleCardEditDeleteClick.bind(this);
    this.handleMakePaymentClick = this.handleMakePaymentClick.bind(this);
    this.handleAddNewCardClick = this.handleAddNewCardClick.bind(this);
    this.handleBankAccountEditDeleteClick = this.handleBankAccountEditDeleteClick.bind(this);
    this.handleAddNewBankAccountClick = this.handleAddNewBankAccountClick.bind(this);
    this.handleContratorEditDeleteClick = this.handleContratorEditDeleteClick.bind(this);
    this.handleAddContractorClick = this.handleAddContractorClick.bind(this);
    this.handleStaffEditDeleteClick = this.handleStaffEditDeleteClick.bind(this);
    this.handleAddStaffClick = this.handleAddStaffClick.bind(this);
    // this.handleChoiceEllipsisClick = this.handleChoiceEllipsisClick.bind(this);
    // this.handleChoiceEachClick = this.handleChoiceEachClick.bind(this);
  }
  componentDidMount() {
    this.props.fetchFlatsByUser(this.props.auth.id, () => {});
    // this.props.fetchConversationsByUser(() => {});
    this.props.fetchBookingsByUser(this.props.auth.id);
    // send fetchConversationByUserAndFlat an array of flats ids
    this.props.fetchLikesByUser();
    // call fetch customer only if profile.user. stripe_customer_id is not null; logic in action
    this.props.fetchProfileForUser(() => this.props.fetchCustomer());
    // this.props.fetchCustomer();
    this.props.actionTypeCard('Add a Card');
    this.props.fetchBankAccountsByUser();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    // remove event listeners when closing page or unmounting
    window.removeEventListener('click', this.choiceEllipsisCloseClick);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({ windowWidth: window.innerWidth });
  }

 isBookingForOwnFlat(booking) {
   // console.log('in mypage, isBookingForOwnFlat, booking: ', booking);
   return booking.flat.user_id === parseInt(this.props.auth.id, 10);
 }

  renderEachBookingByUser() {
    // console.log('in mypage, renderEachBookingByUser, this.props.bookingsByUser: ', this.props.bookingsByUser);
    if (this.props.bookingsByUser) {
      const bookingsByUserEmpty = _.isEmpty(this.props.bookingsByUser);
      const { bookingsByUser } = this.props;
      // sort by date_start
      const sortedBookingsByUser = this.sortBookings(bookingsByUser);

      if (!bookingsByUserEmpty) {
        // console.log('in mypage, renderEachBookingByUser, after if empty check, bookingsByUser: ', bookingsByUser);
        return _.map(sortedBookingsByUser, (booking, index) => {
          // console.log('in mypage, renderEachBookingByUser, in map, booking: ', booking);
          // check if booking is for own flat
          const bookingIsForOwnFlat = this.isBookingForOwnFlat(booking);
          // if NOT own flat, render bookings
          if (!bookingIsForOwnFlat) {
            return (
              <li key={index} className="my-page-each-card">
                <div value={booking.id} className="my-page-each-card-click-box" onClick={this.handleBookingCardClick}>
                  {booking.flat.images[0] ? <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + booking.flat.images[0].publicid + '.jpg'} /> : <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/no_image_placeholder_5.jpg"} />}
                  <div className="my-page-details">
                    <ul>
                      <li>{booking.flat.description}</li>
                      <li>{AppLanguages.checkIn[this.props.appLanguageCode]}: {booking.date_start}</li>
                      <li>{AppLanguages.checkOut[this.props.appLanguageCode]}: {booking.date_end}</li>
                      <li>booking id: {booking.id}</li>
                      <li>flat id: {booking.flat.id}</li>
                    </ul>
                  </div>
                </div>
              </li>
            );
          }
        });
        //end of map
      } else {
        return (
          <div className="my-page-no-category-items">
          {AppLanguages.noMyBooking[this.props.appLanguageCode]}
          </div>
        );
      }
    }

    //end of else
  }


  handleFlatCardClick(event) {
    // console.log('in mypage, handleFlatCardClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in mypage, handleFlatCardClick, clicked, elementVal: ', elementVal);
    this.props.history.push(`/show/${elementVal}`);
  }

  handleBookingCardClick(event) {
    // console.log('in mypage, handleFlatCardClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // console.log('in mypage, handleFlatCardClick, clicked, elementVal: ', elementVal);
    this.props.history.push(`/bookingconfirmation/${elementVal}`);
  }
 // iterate through each flat_language (if created by user)
 // and if one matches lnaguage code selected by user, push into array and return
 // first element in array
  getFlatLanguage(flat, appLanguageCode) {
    // console.log('in main cards, getFlatLanguage, flat, appLanguageCode: ', flat, appLanguageCode);
    const array = [];
    _.each(flat.flat_languages, language => {
      if (language.code == appLanguageCode) {
        array.push(language);
      }
    })
    if (flat.language_code == appLanguageCode) {
      array.push(flat);
    }
    return array[0] ? array[0] : null;
  }

  renderEachFlat() {
    // const { flats } = this.props;
    // <button value={flat.id} type="flat" className="btn btn-sm btn-delete my-page-edit-delete-btn" onClick={this.handleDeleteClick.bind(this)}>Delete</button>
    const flatsEmpty = _.isEmpty(this.props.flats);
    if (!flatsEmpty) {
      const { flats } = this.props;
      // console.log('in mypage, renderEachFlat, flats: ', flats);
      return _.map(flats, (flat, index) => {
        // get flat's language that is selected by user
        const flatLanguage = this.getFlatLanguage(flat, this.props.appLanguageCode )
        // console.log('in mypage, renderEachFlat, flat.id: ', flat.id);
        // console.log('in mypage, renderEachFlat, flat.description: ', flat.description);
        return (
          <li key={index} className="my-page-each-card">
            <div value={flat.id} className="my-page-each-card-click-box" onClick={this.handleFlatCardClick}>
              {flat.images[0] ? <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + flat.images[0].publicid + '.jpg'} /> : <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/no_image_placeholder_5.jpg"} />}
              <div className="my-page-details">
                <ul>
                  <li>{ flatLanguage ? flatLanguage.description : flat.description }</li>
                  <li style={{ color: 'darkblue' }}>{ flatLanguage ? flatLanguage.area : flat.area.toUpperCase() }</li>
                  <li>${parseFloat(flat.price_per_month).toFixed(0)}</li>
                  <li>id: {flat.id}</li>
                </ul>

              </div>
            </div>
            <div className="my-page-card-button-box">
              <button value={flat.id} className="btn btn-sm btn-edit my-page-edit-delete-btn" onClick={this.handleEditClick}>{AppLanguages.edit[this.props.appLanguageCode]}</button>
            </div>
          </li>
        );
      });
    } else {
      return (
        <div className="my-page-no-category-items">{AppLanguages.noMyListings[this.props.appLanguageCode]}</div>
      );
    }
    // else {
    //   return (
    //     <div>
    //       <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
    //       <div className="spinner">Loading...</div>
    //     </div>
    //   );
    // }
  }

  renderBookings() {
    // console.log('in mypage, renderBookings, this.props.bookingsByUser: ', this.props.bookingsByUser);
    return (
      <div>
      <div className="my-page-category-title">
        <div className="my-page-category-left"></div>
        <div>{AppLanguages.myBookings[this.props.appLanguageCode]}</div>
        <div className="my-page-category-right"></div>
      </div>
      <ul>
       {this.renderEachBookingByUser()}
      </ul>
      </div>
    );
  }

  renderFlats() {
    return (
      <div>
        <div className="my-page-category-title">
          <div className="my-page-category-left"></div>
          <div>{AppLanguages.myFlats[this.props.appLanguageCode]}</div>
          <div className="my-page-category-right"></div>
        </div>
        <ul>
         {this.renderEachFlat()}
        </ul>
      </div>
    );
  }

  renderOwnFlatBookings() {
    return (
      <div>
        <div className="my-page-category-title">
          <div className="my-page-category-left"></div>
          <div>{AppLanguages.bookingsMyFlats[this.props.appLanguageCode]}</div>
          <div className="my-page-category-right"></div>
        </div>
        <ul>
          {this.renderEachOwnFlatBookings()}
        </ul>
      </div>
    );
  }

  // getConversationToShow(coversationId) {
  //   console.log('in mypage, getConversationToShow, before each: ', coversationId);
  //   const { conversations } = this.props;
  //   console.log('in mypage, getConversationToShow, before each conversation: ', conversations);
  //   const conversationArray = []
  //   _.each(conversations, (conv) => {
  //     console.log('in mypage, getConversationToShow, each: ', conv);
  //     if (conv.id == coversationId) {
  //       conversationArray.push(conv);
  //     }
  //   });
  //   return conversationArray;
  // }

  // handleConversationCardClick(event) {
  //   console.log('in mypage, handleConversationCardClick, event: ', event.target);
  //   const clickedElement = event.target;
  //   const elementVal = clickedElement.getAttribute('value');
  //   console.log('in mypage, handleConversationCardClick, elementVal: ', elementVal);
  //
  //   // call action creator to mark messages for conversation with that id as read
  //   this.props.markMessagesRead(elementVal);
  //   // this.props.newMessages(false);
  //   // this.props.fetchConversationsByUser();
  //   const conversationToShow = this.getConversationToShow(elementVal);
  //   console.log('in mypage, handleConversationCardClick, conversationToShow: ', conversationToShow);
  //   const yourFlat = conversationToShow[0].flat.user_id == this.props.auth.id;
  //   this.setState({ showConversation: false, conversationId: elementVal, yourFlat }, () => {
  //   console.log('in mypage, handleConversationCardClick, this.state: ', this.state);
  //   // this.setState({ showConversation: false, conversationToShow, yourFlat }, () => {
  //   //   console.log('in mypage, handleConversationCardClick, this.state: ', this.state);
  //   // this.renderMessages();
  //   });
  // }

  // renderConversationUserImage(notOwnFlatConversation, conversation) {
  //   console.log('in mypage, renderConversationUserImage, notOwnFlatConversation: ', notOwnFlatConversation);
  //   console.log('in mypage, renderConversationUserImage, conversation', conversation.user_id);
  //   console.log('in mypage, renderConversationUserImage, auth.id', this.props.auth.id);
  //   // const ownImage = localStorage.getItem('image');
  //   if (notOwnFlatConversation) {
  //     // w_100,h_100,c_crop,g_face,r_max
  //     return (conversation.flat.user.image) ? <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.flat.user.image + '.jpg'} /> : <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/blank_profile_picture_1.jpg"} />;
  //   } else {
  //     return (conversation.user.image) ? <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.user.image + '.jpg'} /> : <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/blank_profile_picture_1.jpg"} />;
  //   }
  //   // return (conversation.user.image) ? <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.user.image + '.jpg'} /> : <img className="my-page-messaging-image-user" src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/blank_profile_picture_1.jpg"} />;
  // }

formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes}  ${ampm}`;
  return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + '  ' + strTime;
}

  // renderEachConversation() {
  //   const { conversations, flats } = this.props;
  //   if (this.state.showConversation) {
  //     // get flat id in array to check if meesage was sent by owner
  //     // const flatIdArray = [];
  //     // _.each(flats, (flat) => {
  //     //   flatIdArray.push(flat.id);
  //     // });
  //     // iterate through each conversation
  //     return _.map(conversations, (conversation, index) => {
  //       const lastMessageIndex = conversation.messages.length - 1;
  //       console.log('in mypage, renderEachConversation, conversation: ', conversation);
  //       // check for unread messages and increment counter if message.read = false
  //       // if there are unread messages, the healine chnages in style of li
  //       const notOwnFlatConversation = this.props.auth.id == conversation.user_id;
  //       // console.log('in mypage, renderEachConversation, this.props.auth.id: ', this.props.auth.id);
  //       // console.log('in mypage, renderEachConversation, conversation.user_id: ', conversation.user_id);
  //       // console.log('in mypage, renderEachConversation, notOwnFlatConversation: ', notOwnFlatConversation);
  //       let unreadMessages = 0;
  //       _.each(conversation.messages, (message) => {
  //         if (notOwnFlatConversation) {
  //           // console.log('in mypage, renderEachConversation,  message.conversation_id, message.read, message.id: ', message.conversation_id, message.read, message.id);
  //           // console.log('in mypage, renderEachConversation, message.conversation_id: ', message.conversation_id);
  //           if (message.read === false && !message.sent_by_user) {
  //             // console.log('in mypage, renderEachConversation, notOwnFlatConversation: ', notOwnFlatConversation);
  //             // console.log('in mypage, renderEachConversation, message.sent_by_user: ', message.sent_by_user);
  //             unreadMessages++;
  //           }
  //         } else {
  //           if (message.read === false && message.sent_by_user) {
  //             // console.log('in mypage, renderEachConversation, notOwnFlatConversation: ', notOwnFlatConversation);
  //             // console.log('in mypage, renderEachConversation, message.sent_by_user: ', message.sent_by_user);
  //             unreadMessages++;
  //           }
  //         }
  //         // console.log('in mypage, renderEachConversation, unreadMessages: ', unreadMessages);
  //       });
  //       const date = new Date(conversation.messages[lastMessageIndex].created_at);
  //       //show only first 26 characters of text
  //       const stringToShow = conversation.messages[lastMessageIndex].body.substr(0, 25);
  //       return (
  //         <li key={index} className="my-page-each-card">
  //           <div value={conversation.id} className="my-page-each-card-click-box" onClick={this.handleConversationCardClick.bind(this)}>
  //             <div className="my-page-messaging-image-box">
  //               {conversation.flat.images[0] ? <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.flat.images[0].publicid + '.jpg'} /> : <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/no_image_placeholder_5.jpg"} />}
  //               {this.renderConversationUserImage(notOwnFlatConversation, conversation)}
  //             </div>
  //             <div className="my-page-details">
  //               <ul>
  //                 <li style={unreadMessages > 0 ? { color: 'blue' } : { color: 'gray' }} className="mypage-conversation-headline">{stringToShow}...</li>
  //                 <li>{this.formatDate(date)}</li>
  //                 <li>user id: {conversation.user.id}</li>
  //                 <li>conversation id: {conversation.id}</li>
  //               </ul>
  //             </div>
  //           </div>
  //         </li>
  //       );
  //     });
  //   }
  // }

  renderMessages() {
    // console.log('in mypage, renderMessages: this.props.conversationId', this.props.conversationId);
    return (
      <div className="my-page-message-box">
      <Messaging
        currentUserIsOwner={false}
        // conversation={this.state.conversationToShow}
        noConversation={this.props.noConversation}
        // yourFlat={this.props.yourFlat}
        conversationId={this.props.conversationId}
        mobileView
        // conversationId={this.state.conversationId}
      />
      </div>
    );
  }

  renderConversations() {
    // {this.renderEachConversation()}
    return (
      <ul>
        <Conversations
          conversations={this.props.conversations}
        />
      </ul>
    );
  }

  handleMessageHamburgerClick() {
    // this.props.fetchFlatsByUser(this.props.auth.id, (flatIdArray) => this.fetchFlatsByUserCallback(flatIdArray));
    // this.props.fetchFlatsByUser(this.props.auth.id, (flatIdArray) => this.fetchFlatsByUserCallback(flatIdArray));
    // this.setState({ showConversation: true });
    this.props.showConversations();
  }

  handleMessageRefreshClick() {
    // console.log('in mypage, handleMessageRefreshClick: ');
    this.props.showLoading();
    this.props.fetchConversationsByUser(() => { this.loadingCallback(); });
  }

  loadingCallback() {
    this.props.showLoading();
  }

  renderMessaging() {
    // console.log('in mypage, renderMessaging, this.state.showConversation: ', this.state.showConversation);
    // console.log('in mypage, renderMessaging, this.props.showConversations: ', this.props.showConversationCards);
    return (
      <div>
        <div className="my-page-category-title">
          <span className="my-page-category-left"><span id="messaging-hamburger" className={this.props.showConversationCards ? 'hide' : ''} onClick={this.handleMessageHamburgerClick} ><i className="fa fa-bars"></i></span></span>
          <span>My Messages</span>
          <span className="my-page-category-right"><span className="btn" id="messaging-refresh" onClick={this.handleMessageRefreshClick}><i className="fa fa-refresh" aria-hidden="true"></i></span></span>
        </div>
        {this.props.showConversationCards ? this.renderConversations() : this.renderMessages()}
      </div>
    );
  }

  sortBookings(bookings) {
    //reference: https://stackoverflow.com/questions/10123953/sort-javascript-object-array-by-date
    // console.log('in mypage, sortBookings, bookings: ', bookings);
    const bookingsArray = [];
    // push each object into array then sort
    _.each(bookings, (booking) => {
      bookingsArray.push(booking);
      // console.log('in mypage, sortBookings, in each, bookingsArray: ', bookingsArray);
    });

    const sortedBookingsArray = bookingsArray.sort((a, b) => {
      // console.log('in mypage, sortBookings, in each, in sortedBookingsArray, new Date(a.date_start): ', new Date(a.date_start));
      // console.log('in mypage, sortBookings, in each, in sortedBookingsArray, new Date(b.date_start): ', new Date(b.date_start));
      return new Date(a.date_start) - new Date(b.date_start);
    });
    // put sorted array into object format that the app has been using
    // console.log('in mypage, sortBookings, in each, sortedBookingsArray: ', sortedBookingsArray);
    const bookingsList = {};
    _.each(sortedBookingsArray, (booking, index) => {
      bookingsList[index] = { id: booking.id, user_id: booking.user_id, date_start: booking.date_start, date_end: booking.date_end, booking_by_owner: booking.booking_by_owner, booking_by_ical: booking.booking_by_ical, flat: booking.flat }
    });
    // console.log('in mypage, sortBookings, in each, bookingsList: ', bookingsList);

    return bookingsList;
  }

  handleDeleteClick(event) {
    // console.log('in mypage, handleDeleteClick, event.target: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const elementType = clickedElement.getAttribute('type');
    // console.log('in mypage, handleDeleteClick, elementVal: ', elementVal);
    // console.log('in mypage, handleDeleteClick, elementType: ', elementType);
    this.props.showLoading();
    if (elementType === 'ownBooking' && window.confirm('Are you sure you want to delete this booking?')) {
      // console.log('in mypage, handleDeleteClick, if statement, delete own booking: ', elementType);
      this.props.deleteBooking(elementVal, () => this.deleteCallback());
    }
    if (elementType === 'flat' && window.confirm('Are you sure you want to delete this flat?')) {
      // console.log('in mypage, handleDeleteClick, if statement, delete flat: ', elementType);
      this.props.deleteFlat(elementVal, () => this.deleteCallback());
    }
  }

  deleteCallback() {
    this.props.showLoading();
    this.props.history.push('/mypage');
  }

  handleEditClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    this.props.history.push(`/editflat/${elementVal}`);
  }

  renderEachOwnFlatBookings() {
    // takes flats with bookings and creates object with bookings then flat
    const preSortBookings = this.createBookingObject();
    // sorts preSortBookings by date_start
    const bookings = this.sortBookings(preSortBookings);
    const bookingsEmpty = _.isEmpty(bookings);

    // const bookings = this.createBookingObject((b) => this.sortBookings(b));
    // const sortedBookings = this.sortBookings(bookings);
    // console.log('in mypage, renderEachOwnFlatBookings, preSortBookings: ', preSortBookings);
    if (!bookingsEmpty) {
      return _.map(bookings, (booking, index) => {
        // console.log('in mypage, renderOwnBookings, in each, booking: ', booking);
        const flat = booking.flat;
        // const bookingForOwnFlat = this.isBookingForOwnFlat(booking);
        // console.log('in mypage, renderEachOwnFlatBookings, in each, bookings: ', bookings);
        // <div className="my-page-card-button-box">
        // <button value={booking.id} type="ownBooking" className="btn btn-delete btn-sm my-page-edit-delete-btn" onClick={this.handleDeleteClick.bind(this)}>Delete</button>
        // </div>
          return (
            <li key={index} className="my-page-each-card">
              <div value={booking.id} className="my-page-each-card-click-box" onClick={this.handleBookingCardClick}>
                {flat.images[0] ? <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + flat.images[0].publicid + '.jpg'} /> : <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/no_image_placeholder_5.jpg"} />}
                <div className="my-page-details">
                  <ul>
                    <li>{flat.description}</li>
                    <li>{AppLanguages.checkIn[this.props.appLanguageCode]}: {booking.date_start}</li>
                    <li>{AppLanguages.checkOut[this.props.appLanguageCode]}: {booking.date_end}</li>
                    <li>booking id: {booking.id}</li>
                    <li>flat id: {flat.id}</li>
                    {booking.booking_by_ical ? <li style={{ color: 'green' }}>Dates blocked by ical</li> : ''}
                    {booking.booking_by_owner && !booking.booking_by_ical ? <li style={{ color: 'green' }}>Dates blocked manually</li> : ''}
                  </ul>

                </div>
                <div className="my-page-card-button-box">
                  {booking.booking_by_owner && !booking.booking_by_ical ? <button value={booking.id} type="ownBooking" className="btn btn-sm btn-delete my-page-edit-delete-btn" onClick={this.handleDeleteClick}>{AppLanguages.delete[this.props.appLanguageCode]}</button> : ''}
                </div>
              </div>
            </li>
          );
          // end of return
        // });
        // end of second each
      });
      //end of first each
    } else {
      return (
        <div className="my-page-no-category-items">{AppLanguages.noMyBooked[this.props.appLanguageCode]}</div>
      );
    }
      // }
  }

  createBookingObject() {
    //reference: https://stackoverflow.com/questions/14234646/adding-elements-to-object
      const { flats } = this.props;
      const flatsEmpty = _.isEmpty(flats);
      // let bookingsObj = {};
      // console.log('in mypage, renderOwnBookings, this.props.flats.bookings: ', this.props.flats);
      const bookingsList = {}
      if (!flatsEmpty) {
         _.map(flats, (flat) => {
          // console.log('in mypage, renderOwnBookings, in each, flat: ', flat);
          const bookings = flat.bookings;
           _.map(bookings, (booking, index) => {
            // console.log('in mypage, renderOwnBookings, in second each, booking: ', booking);
            // console.log('in mypage, renderOwnBookings, in second each, flat: ', flat);
            bookingsList[booking.id] = { id: booking.id, user_id: booking.user_id, date_start: booking.date_start, date_end: booking.date_end, booking_by_owner: booking.booking_by_owner, booking_by_ical: booking.booking_by_ical, flat }
            // console.log('in mypage, renderOwnBookings, bookingsList: ', bookingsList);
          });
          // end of second each
        });
        //end of first each
        // callback(bookingsList);
        return bookingsList;
      }
  }

  // **************************LIKES **************************************************

  handleUnlikeClick(event) {
    // console.log('in main cards, handleUnlikeClick, like clicked, event.target: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // console.log('in main cards, handleLikeClick, elementVal: ', elementVal);
    this.props.deleteLike(elementVal, () => this.handleLikeClickCallback());
  }

  handleLikeClickCallback() {
    this.props.fetchLikesByUser();
  }

  renderEachLike() {
    // console.log('in mypage, renderEachLike, likes: ', this.props.likes);
    const { likes } = this.props;
    const likesEmpty = _.isEmpty(likes);

    if (!likesEmpty) {
      return _.map(likes, (like, index) => {
        // console.log('in mypage, renderEachLike, in each, like: ', like);
        const flat = like.flat;
        // console.log('in mypage, renderEachLike, in each, flat: ', flat);

        return (
          <li key={index} className="my-page-each-card">
            <div value={flat.id} className="my-page-each-card-click-box" onClick={this.handleFlatCardClick}>
              {flat.images[0] ? <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + flat.images[0].publicid + '.jpg'} /> : <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/no_image_placeholder_5.jpg"} />}
              <div className="my-page-details">
              <ul>
                <li>{flat.description}</li>
                <li style={{ color: 'darkblue' }}>{flat.area.toUpperCase()}</li>
                <li>${parseFloat(flat.price_per_month).toFixed(0)}</li>
                <li>flat id: {flat.id}</li>
              </ul>

              </div>
            </div>
              <div className="my-page-card-button-box">
                <button value={flat.id} type="flat" className="btn btn-sm btn-delete my-page-edit-delete-btn" onClick={this.handleUnlikeClick}>{AppLanguages.remove[this.props.appLanguageCode]}</button>
              </div>
          </li>
        );
        // end of return
        // });
        // end of second each
      });
      //end of first each
      // }
    }

    return (
      <div className="my-page-no-category-items">{AppLanguages.noMyLiked[this.props.appLanguageCode]}</div>
    );
  }

  renderLikes() {
    return (
      <div>
        <div className="my-page-category-title">
          <div className="my-page-category-left"></div>
          <div>{AppLanguages.myLikes[this.props.appLanguageCode]}</div>
          <div className="my-page-category-right"></div>
        </div>
        <ul>
        {this.renderEachLike()}
        </ul>
      </div>
    );
  }
  // **************************LIKES **************************************************
  // **************************PROFILE************************************
  // renderEachProfileAttribute() {
  //     const profileAttributes = { username, user_id, title, first_name, last_name, birthday, identification, address1, address2, city, state, zip, country, region };
  //     console.log('in mypage, renderEachProfileAttribute, username: ', username);
  //     console.log('in mypage, renderEachProfileAttribute, this.props.auth.userProfile: ', this.props.auth.userProfile);
  //     return _.map(profileAttributes, attr => {
  //       return (
  //         <li>{attr}</li>
  //       );
  //     });
  //   }
  // }

  handleAddEditProfileClick(event) {
    const clickedElement = event.target;
    // value is profile id
    const elementVal = clickedElement.getAttribute('value')
    // name is edit or add language
    const elementName = clickedElement.getAttribute('name')
    console.log('in header, handleAddEditProfileClick, elementName, elementVal: ', elementName, elementVal);
    if (elementName == 'addLanguage') {
      this.props.showProfileCreateModal();
    }

    if (elementName == 'edit') {
      // if (!this.props.showProfileEdit) {
        this.props.showProfileEditModal();
        this.props.selectedProfileId(elementVal)
      // }
    }
  }

  handleImageUploadClick() {
    // console.log('in header, handleImageUploadClick: ');
  }

  handleRemoveProfileImage() {
    // this.props.editProfile({ id: this.props.auth.userProfile.id, image: 'blank_profile_picture_1' }, () => this.handleRemoveProfileImageCallback());
    if (window.confirm('Are you sure you want to remove your profile picture?')) {
      const formData = new FormData()
      formData.append('user[image]', BLANK_PROFILE_PICTURE)
      this.props.updateUser(formData, () => this.handleRemoveProfileImageCallback());
    }
  }

  handleRemoveProfileImageCallback() {
    // console.log('in header, handleRemoveProfileImageCallback: ');
  }

  handleAddProfileLanguageClick(event) {
    this.props.showProfileCreateModal();
  }

  renderProfileImage() {
    // console.log('in header, renderProfileImage, this.props.auth.userProfile.image: ', this.props.auth.userProfile.image);
    const imagePath = this.props.auth.image === GlobalConstants.blankProfilePicture ? `${GlobalConstants.constantAssetsFolder}${this.props.auth.image}` : this.props.auth.image;
    return (
      <div className="my-page-profile-image-box">
        <div className="my-page-profile-image-box-image">
          <img src={"http://res.cloudinary.com/chikarao/image/upload/w_100,h_100,c_fill,g_face/" + imagePath + '.jpg'} alt={"No profile picture"} />
        </div>
          <div className="my-page-change-profile-picture-link">
            <UploadForProfile
              // profileId={this.props.auth.userProfile.id}
            />
          </div>
          {this.props.auth.image == BLANK_PROFILE_PICTURE ? '' :
          <div className="my-page-remove-profile-picture-link" onClick={this.handleRemoveProfileImage}>
            {AppLanguages.removeProfilePicture[this.props.appLanguageCode]}
          </div> }
      </div>
    );
  }

  getProfile(profiles) {
    let objectReturned = {};
    if (profiles.length > 1) {
      _.each(profiles, eachProfile => {
        if (eachProfile.language_code == this.props.appLanguageCode) {
          objectReturned = eachProfile;
          return
        }
      })
    } else {
      objectReturned = profiles[0];
    }
    return objectReturned;
  }

  getProfileLanguages(profiles) {
    const array = [];
    _.each(profiles, eachProfile => {
      // if (!array.includes(eachProfile.language_code)) {
      if (array.indexOf(eachProfile.language_code) === -1) {
        array.push(eachProfile.language_code)
      }
    });
    return array;
  }

  renderProfile() {
    if (this.props.auth.user) {
      const profileToRender = this.getProfile(this.props.auth.user.profiles);
      const {
        id,
        username,
        user_id,
        title,
        first_name,
        last_name,
        birthday,
        identification,
        address1,
        address2,
        city,
        state,
        zip,
        country,
        region,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_contact_address,
        emergency_contact_relationship,
        introduction
      } = profileToRender;
      const { appLanguageCode } = this.props;
      // console.log('in mypage, renderProfile, id: ', id);
      const profileLanguagesArray = this.getProfileLanguages(this.props.auth.user.profiles);
      // <li value="username"className="my-page-profile-attribute"><div>{AppLanguages.userName[appLanguageCode]}:</div> <div>{username}</div></li>

      return (
        <div>
          <div className="my-page-category-title">
            <div className="my-page-category-left">
            </div>
            <div>{AppLanguages.myProfile[appLanguageCode]}</div>
            <div className="my-page-category-right">
              <div id="my-page-profile-edit-link"><i className="fa fa-edit" value={id} name="edit" onClick={this.handleAddEditProfileClick}></i>
              </div>
            </div>
          </div>
            {this.renderProfileImage()}
          <ul className="my-page-profile-ul">
            <li className="my-page-profile-attribute"><div>{AppLanguages.availableLanguages[appLanguageCode]}:</div> <div className="my-page-available-language-box">{this.renderEachLanguage(profileLanguagesArray)}</div></li>
            <li className="my-page-profile-attribute">
              <div></div>
              <div className="my-page-add-language-link" style={{ width: '100px', fontSize: '13px' }} name="addLanguage" onClick={this.handleAddEditProfileClick}>
              <i className="fa fa-plus-circle" style={{ fontSize: '13px' }}></i>
              &nbsp;
              {AppLanguages.language[this.props.appLanguageCode]}
              </div>
            </li>
            <li value="title"className="my-page-profile-attribute"><div>{AppLanguages.title[appLanguageCode]}:</div> <div>{title}</div></li>
            <li value="first_name"className="my-page-profile-attribute"><div>{AppLanguages.firstName[appLanguageCode]}:</div> <div>{first_name}</div></li>
            <li value="last_name"className="my-page-profile-attribute"><div>{AppLanguages.lastName[appLanguageCode]}:</div> <div>{last_name}</div></li>
            <li value="birthday"className="my-page-profile-attribute"><div>{AppLanguages.birthday[appLanguageCode]}:</div> <div>{birthday}</div></li>
            <li value="address1"className="my-page-profile-attribute"><div>{AppLanguages.streetAddress[appLanguageCode]}:</div> <div>{address1}</div></li>
            <li value="city"className="my-page-profile-attribute"><div>{AppLanguages.city[appLanguageCode]}:</div> <div>{city}</div></li>
            <li value="state"className="my-page-profile-attribute"><div>{AppLanguages.state[appLanguageCode]}:</div> <div>{state}</div></li>
            <li value="zip"className="my-page-profile-attribute"><div>{AppLanguages.zip[appLanguageCode]}:</div> <div>{zip}</div></li>
            <li value="country"className="my-page-profile-attribute"><div>{AppLanguages.country[appLanguageCode]}:</div> <div>{country}</div></li>
            <li value="emergency_contact_name"className="my-page-profile-attribute"><div>{AppLanguages.emergencyName[appLanguageCode]}:</div> <div>{emergency_contact_name}</div></li>
            <li value="emergency_contact_phone"className="my-page-profile-attribute"><div>{AppLanguages.emergencyPhone[appLanguageCode]}:</div> <div>{emergency_contact_phone}</div></li>
            <li value="emergency_contact_address"className="my-page-profile-attribute"><div>{AppLanguages.emergencyAddress[appLanguageCode]}:</div> <div>{emergency_contact_address}</div></li>
            <li value="emergency_contact_relationship"className="my-page-profile-attribute"><div>{AppLanguages.emergencyRelationship[appLanguageCode]}:</div> <div>{emergency_contact_relationship}</div></li>
            <li value=""className="my-page-profile-attribute"><div>{AppLanguages.selfIntro[appLanguageCode]}:</div> <div></div></li>
            <div value="introduction"className="my-page-profile-introduction">{introduction}</div>
            <li value="user_id"className="my-page-profile-attribute"><div>{AppLanguages.userId[appLanguageCode]}:</div> <div>{user_id}</div></li>
          </ul>
        </div>
      );
    } //end of if
  }

  renderNewCardInput() {
    return (
      <div>New Card Input</div>
    );
  }

  handleCardEditDeleteClick(event) {
    const clickedElement = event.target;
    const cardId = clickedElement.getAttribute('name')
    const elementVal = clickedElement.getAttribute('value')
    // console.log('in mypage, handleCardEditDeleteClick, elementVal: ', elementVal);
      if (elementVal == 'delete') {
        if (window.confirm('Are you sure you want to delete this card?')) {
          this.props.showLoading();
          this.props.deleteCard(cardId, () => this.handleCardEditDeleteClickCallback());
        }
      } else {
        const selectedCardArray = [];
        _.each(this.props.auth.customer.sources.data, card => {
          if (card.id == cardId) {
            selectedCardArray.push(card);
            // console.log('in mypage, handleCardEditDeleteClick, selectedCardArray: ', selectedCardArray);
          }
        });
        // get whether intended action is edit payment or new card
        this.props.actionTypeCard(elementVal);
        this.props.selectedCard(selectedCardArray[0], () => this.selectedCardCallBack());
      }
  }

  selectedCardCallBack() {
    this.props.showCardInputModal();
  }

  handleCardEditDeleteClickCallback() {
    this.props.showLoading();
  }

  handleCardDefaultCheck(event) {
    const checkedElement = event.target;
    const cardId = checkedElement.getAttribute('value');
    // const checkedVal = checkedElement.getAttribute('checked');
    const checkedVal = checkedElement.checked;
    const elementName = checkedElement.getAttribute('name')
    // checkedElement.setAttribute('checked', 'checked=false')
    const defaultCardInputs = document.getElementsByClassName('my-page-card-default-checkbox')
    // console.log('in mypage, handleCardDefaultCheck, defaultCardInputs: ', defaultCardInputs);
    // console.log('in mypage, handleCardDefaultCheck, checkedVal: ', checkedVal);
    // console.log('in mypage, handleCardDefaultCheck, checkedElement: ', checkedElement);
    // console.log('in mypage, handleCardDefaultCheck, cardId: ', cardId);
    const defaultCardId = this.props.customer.default_source;
    if (cardId !== defaultCardId) {
      _.each(defaultCardInputs, eachInput => {
        const a = eachInput;
        a.checked = false;
      })
      this.props.showLoading();
      this.props.updateCustomer({ cardId }, () => this.handleCardDefaultCheckCallback());
    }
  }

  handleCardDefaultCheckCallback() {
    this.props.showLoading();
  }

  renderCardAddress(card) {
    // console.log('in mypage, renderCardAddress, card, : ', card);
    return (
      <div className="my-page-card-address-box">
        <div>{card.name}&nbsp;&nbsp;</div>
        <div>  {card.address_line1}</div>
        <div>&nbsp;{card.address_line2}</div>
        <div>&nbsp;...&nbsp;</div>
        <div>  {card.address_zip}</div>
      </div>
    );
  }

  renderExistingCardDetails() {
    const customerEmpty = _.isEmpty(this.props.customer)
    if (!customerEmpty) {
      const { sources } = this.props.customer;
      const defaultCardId = this.props.customer.default_source;
      if (sources.data[0]) {
        return _.map(sources.data, (card, i) => {
          const isThisCardDefault = (defaultCardId == card.id);
          // console.log('in mypage, renderExistingCardDetails, isThisCardDefault, : ', isThisCardDefault);
          return (
            <div key={card.id}>
              <li className="my-page-each-card each-card-payments">
                <div className="my-page-card-details-box">
                    <div className="my-page-each-card-click-box payments-click-box">
                      <div className="my-page-details">
                        <ul>
                          <li style={{ fontSize: '30px' }}><i className={`fa fa-cc-${card.brand.toLowerCase()}`}></i></li>
                          <li>{AppLanguages.lastFour[this.props.appLanguageCode]}: {card.last4}</li>
                          <li>{AppLanguages.expiration[this.props.appLanguageCode]}: {card.exp_month}/{card.exp_year}</li>
                        </ul>
                      </div>
                      <div className="my-page-card-default-input-box">{AppLanguages.useThisCard[this.props.appLanguageCode]} &nbsp;
                        <input name={i} value={card.id} type="checkbox" checked={isThisCardDefault} className="my-page-card-default-checkbox" onChange={this.handleCardDefaultCheck} />
                      </div>
                    </div>
                    {this.renderCardAddress(card)}
                  </div>
                  <div className="my-page-card-button-box">
                    <button name={card.id} value="Edit Card Info" className="btn btn-sm btn-edit my-page-edit-delete-btn" onClick={this.handleCardEditDeleteClick}>{AppLanguages.edit[this.props.appLanguageCode]}</button>
                    <button name={card.id} value="delete" className="btn btn-sm btn-delete my-page-edit-delete-btn" onClick={this.handleCardEditDeleteClick}>{AppLanguages.delete[this.props.appLanguageCode]}</button>
                  </div>
                </li>
              </div>
          );
        });
      } else {
        // else for if source.data
        return (
          <div className="my-page-no-category-items">{AppLanguages.noCards[this.props.appLanguageCode]}</div>
        );
      }
    } else {
      return (
        <div className="my-page-no-category-items">{AppLanguages.noCards[this.props.appLanguageCode]}</div>
      );
    }
  }

  handleAddNewCardClick() {
    // console.log('in mypage, handleAddNewCardClick: ');
    this.props.showCardInputModal();
    this.props.actionTypeCard('Add a Card');
    // if (this.props.auth.stripe_customer_id) {
      // console.log('in mypage, handleAddNewCardClick, this.props.auth.stripe_customer_id: ', this.props.auth.stripe_customer_id);
      // this.props.addCard(this.props.auth.stripe_customer_id);
    // }
  }

  handleMakePaymentClick() {
    console.log('in mypage, handleMakePaymentClick: ');
    this.props.showCardInputModal();
    this.props.actionTypeCard('Make a Payment');
  }

  renderPayments() {
    // {this.renderNewCardInput()}
    return (
      <div>
        <div className="my-page-category-title">
          <div className="my-page-category-left"></div>
          <div>{AppLanguages.paymentDetails[this.props.appLanguageCode]}</div>
          <div className="my-page-category-right"><div className="my_page-make-payment-link" onClick={this.handleMakePaymentClick}><i className="fa fa-credit-card"></i></div></div>
        </div>
        <ul>
          {this.renderExistingCardDetails()}
          <div className="my-page-enter-new-card-link" onClick={this.handleAddNewCardClick}><i className="fa fa-plus-circle" style={{ fontSize: '20px' }}></i> {AppLanguages.addNewCard[this.props.appLanguageCode]}</div>
          <a className="my-page-enter-new-card-link" href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&scope=read_write`} target="_blank" rel="noopener noreferrer"><i className="fa fa-link" style={{ fontSize: '20px' }}></i> {AppLanguages.connectBank[this.props.appLanguageCode]}</a>
        </ul>
      </div>
    );
  }

  handleBankAccountEditDeleteClick(event) {
    const clickedElement = event.target;
    const editOrDelete = clickedElement.getAttribute('value');
    const bankAccountId = clickedElement.getAttribute('name');
    // console.log('in mypage, handleBankAccountEditDeleteClick, editOrDelete, bankAccountId: ', editOrDelete, bankAccountId);
    if (editOrDelete == 'edit') {
      this.props.showBankAccountEditModal()
      this.props.selectedBankAccountId(bankAccountId);
    }
    if (editOrDelete == 'delete' && window.confirm('Are you sure you want to delete this bank account?')) {
      this.props.deleteBankAccount(bankAccountId);
    }
  }

  renderExistingBankAccountDetails() {
    const { appLanguageCode } = this.props;
    return _.map(this.props.bankAccounts, (eachAccount, i) => {
      // console.log('in mypage, renderExistingBankAccountDetails, eachAccount.account_type: ', eachAccount.account_type);
      return (
        <li key={i} className="my-page-each-card">
          <div className="my-page-each-card-click-box my-page-card-no-picture-box">
            <div className="my-page-details">
              <ul>
                <li>{AppLanguages.accountName[appLanguageCode]}:  {eachAccount.account_name}</li>
                <li>{AppLanguages.bankName[appLanguageCode]}: {eachAccount.bank_name}</li>
                <li>{AppLanguages.accountNumber[appLanguageCode]}: {eachAccount.account_number}***</li>
                <li>{AppLanguages.accountType[appLanguageCode]}: {AppLanguages[eachAccount.account_type][appLanguageCode]}</li>
              </ul>
            </div>
            <div className="my-page-card-button-box">
              <button name={eachAccount.id} value="edit" className="btn btn-sm btn-edit my-page-edit-delete-btn" onClick={this.handleBankAccountEditDeleteClick}>{AppLanguages.edit[appLanguageCode]}</button>
              <button name={eachAccount.id} value="delete" className="btn btn-sm btn-delete my-page-edit-delete-btn" onClick={this.handleBankAccountEditDeleteClick}>{AppLanguages.delete[appLanguageCode]}</button>
            </div>
          </div>
        </li>
      );
    });
  }

  handleAddNewBankAccountClick() {
    console.log('in mypage, renderExistingBankAccountDetails, this.props.bankAccounts: ', this.props.bankAccounts);
    this.props.showBankAccountCreateModal();
  }

  renderBankAccounts() {
    return (
      <div>
        <div className="my-page-category-title">
          <div className="my-page-category-left"></div>
          <div>{AppLanguages.bankAccountDetails[this.props.appLanguageCode]}</div>
          <div className="my-page-category-right"></div>
        </div>
        <ul>
          {this.renderExistingBankAccountDetails()}
        <div className="my-page-enter-new-card-link" onClick={this.handleAddNewBankAccountClick}><i className="fa fa-plus-circle" style={{ fontSize: '20px' }}></i> {AppLanguages.addNewBankAccount[this.props.appLanguageCode]}</div>
        </ul>
      </div>
    );
  }

  handleAddContractorClick(event) {
    this.props.showContractorCreateModal();
    // addNewContractor app state to distinguish in contractor_create_modal
    // between create to add contractor language vs create to add brand new contractor
    // modal.addNewContractor used in mapStateToProps to decide whether to
    // call getContractor function
    this.props.addNewContractor();
  }

  handleContratorEditDeleteClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');
    if (elementVal == 'viewStaff') {
      // console.log('in mypage, handleContratorEditDeleteClick, viewStaff: ');
      this.setState({ selectedContractorId: elementName, showStaffBox: true });
      this.props.selectedContractorId(elementName);
    }

    if (elementVal == 'edit') {
      // console.log('in mypage, handleContratorEditDeleteClick, edit: ');
      this.props.showContractorEditModal();
      this.props.selectedContractorId(elementName);
      this.setState({ selectedContractorId: elementName });
    }

    if (elementVal == 'addLanguage') {
      // console.log('in mypage, handleContratorEditDeleteClick, edit: ');
      this.props.showContractorCreateModal();
      this.props.selectedContractorId(elementName);
      this.setState({ selectedContractorId: elementName });
    }

    // if (elementVal == 'delete') {
    //   console.log('in mypage, handleContratorEditDeleteClick, delete: ');
    // }
  }

  // handleContractorClick() {
  //
  // }

  getContractorTypeObject(contractor) {
    let object = {};
    _.each(Contractor.contractor_type.choices, eachChoice => {
      if (eachChoice.value == contractor.contractor_type) {
        object = eachChoice;
        return;
      }
    });
    return object;
  }

  getLanguages(records, baseRecord) {
    console.log('in mypage, getContractorLanguages, records, baseRecord: ', records, baseRecord);
    const arrayReturned = [];
    _.each(records, eachRecord => {
      if (eachRecord.base_record_id == baseRecord.id) {
        arrayReturned.push(eachRecord.language_code);
      }
      if (arrayReturned.indexOf(baseRecord.language_code) === -1) {
      // if (!arrayReturned.includes(baseRecord.language_code)) {
        arrayReturned.push(baseRecord.language_code);
      }
    });
    return arrayReturned;
  }

  renderEachLanguage(languageCodeArray) {
    console.log('in mypage, renderEachLanguage, languageCodeArray: ', languageCodeArray);
    return _.map(languageCodeArray, (eachCode, i) => {
      if (eachCode) {
        return <div key={i}>{Languages[eachCode].flag}</div>;
      } else {
        return '';
      }
    });
  }

  renderExistingContractorDetails() {
      // <div className="my-page-each-card-click-box my-page-card-no-picture-box">
    // <div className="my-page-placeholder-btn"></div>
    const { appLanguageCode } = this.props;

    if (this.props.auth.user) {
      return _.map(this.props.auth.user.contractors, (eachContractor, i) => {
        const contractorTypeObject = this.getContractorTypeObject(eachContractor);
        // render contractor only if it does not have a base_record_id, that is, it is the base record
        if (!eachContractor.base_record_id) {
          const contractorLanguagesArray = this.getLanguages(this.props.auth.user.contractors, eachContractor);
          // console.log('in mypage, renderExistingContractorDetails, contractorLanguagesArray: ', contractorLanguagesArray);
          return (
            <li key={i} className="my-page-each-card">
                <div className="my-page-each-card-click-box my-page-card-no-picture-box">
                <div className="my-page-details">
                  <ul>
                    <li>{eachContractor.company_name}</li>
                    <li>{contractorTypeObject[appLanguageCode]}</li>
                  </ul>
                </div>
                <div className="my-page-card-button-box my-page-card-button-box-language">
                  <div name={eachContractor.id} value="addLanguage" className="my-page-add-language-link" onClick={this.handleContratorEditDeleteClick}>
                    <i className="fa fa-plus-circle" style={{ fontSize: '13px' }}></i>
                    &nbsp;
                    {AppLanguages.language[this.props.appLanguageCode]}
                  </div>
                  <div className="my-page-card-button-box-language-box">
                    {this.renderEachLanguage(contractorLanguagesArray)}
                  </div>
                </div>
                <div className="my-page-card-button-box">
                  <button name={eachContractor.id} value="edit" className="btn btn-sm btn-edit my-page-edit-delete-btn" onClick={this.handleContratorEditDeleteClick}>{AppLanguages.edit[appLanguageCode]}</button>
                  <button name={eachContractor.id} value="viewStaff" className="btn btn-sm btn-view my-page-edit-delete-btn" onClick={this.handleContratorEditDeleteClick}>{AppLanguages.viewStaff[appLanguageCode]}</button>
                </div>
              </div>
            </li>
          );
        }
      })
    }
  }

  renderContractors() {
    // {this.renderExistingContractorDetails()}
    // <div className="my-page-enter-new-card-link" onClick={this.handleAddNewBankAccountClick.bind(this)}><i className="fa fa-plus-circle" style={{ fontSize: '20px' }}></i> {AppLanguages.addNewBankAccount[this.props.appLanguageCode]}</div>
    return (
      <div>
        <div className="my-page-category-title">
          <div className="my-page-category-left"></div>
          <div>{AppLanguages.contractors[this.props.appLanguageCode]}</div>
          <div className="my-page-category-right"></div>
        </div>
        <ul>
          {this.renderExistingContractorDetails()}
        <div className="my-page-enter-new-card-link" onClick={this.handleAddContractorClick}><i className="fa fa-plus-circle" style={{ fontSize: '20px' }}></i> {AppLanguages.addNewContractor[this.props.appLanguageCode]}</div>
        </ul>
      </div>
    );
  }

  handleStaffEditDeleteClick(event) {
    const clickedElement = event.target;
    // edit or not
    const elementVal = clickedElement.getAttribute('value');
    // staff id
    const elementName = clickedElement.getAttribute('name');

    if (elementVal == 'edit') {
      this.props.showStaffEditModal();
      // set staff id for use in mapStateToProps in staffEditModal
      this.props.selectedStaffId(elementName);
      this.setState({ selectedStaffId: elementVal });
    }

    if (elementVal == 'addLanguage') {
      this.props.showStaffCreateModal();
      // set staff id for use in mapStateToProps in staffEditModal
      this.props.selectedStaffId(elementName);
      this.setState({ selectedStaffId: elementVal });
    }
  }

  getContractor() {
    let object = {};
    _.each(this.props.auth.user.contractors, eachContractor => {
      // console.log('in mypage, getContractor, eachContractor, this.state.selectedContractorId: ', eachContractor, this.state.selectedContractorId);
      if (eachContractor.id == parseInt(this.state.selectedContractorId, 10)) {
        object = eachContractor;
        return;
      }
    });
    return object;
  }

  getAppLanguageStaff(staffs, baseStaff) {
    let staffReturned = {};
    _.each(staffs, eachStaff => {
      if ((eachStaff.language_code == this.props.appLanguageCode) && (baseStaff.id == eachStaff.base_record_id)) {
        staffReturned = eachStaff;
        return;
      }
    })
    return staffReturned;
  }

  renderExistingStaffDetails(selectedContractor) {
    // const selectedContractor = this.getContractor();
    // <button name={eachStaff.id} value="delete" className="btn btn-sm btn-delete my-page-edit-delete-btn" onClick={this.handleStaffEditDeleteClick.bind(this)}>{AppLanguages.delete[this.props.appLanguageCode]}</button>
    return _.map(selectedContractor.staffs, (eachStaff, i) => {
      // render if staff has no base record id, meaning it is the base staff record
      if (!eachStaff.base_record_id) {
        const staffLanguagesArray = this.getLanguages(selectedContractor.staffs, eachStaff);
        const appLanguageStaff = this.getAppLanguageStaff(selectedContractor.staffs, eachStaff);
        if (!_.isEmpty(appLanguageStaff)) { eachStaff = appLanguageStaff; }
        console.log('in mypage, renderExistingStaffDetails, staffLanguagesArray: ', staffLanguagesArray);
        return (
          <li key={i} className="my-page-each-card">
            <div className="my-page-each-card-click-box my-page-card-no-picture-box">
              <div className="my-page-details">
                <ul>
                  <li>{eachStaff.last_name},&nbsp;{eachStaff.first_name}</li>
                  <li>{eachStaff.title}</li>
                  <li>ph {eachStaff.phone}</li>
                  <li>id: {eachStaff.id}</li>
                </ul>
              </div>
              <div className="my-page-card-button-box my-page-card-button-box-language">
                <div name={eachStaff.id} value="addLanguage" className="my-page-add-language-link" onClick={this.handleStaffEditDeleteClick}>
                  <i className="fa fa-plus-circle" style={{ fontSize: '12px' }}></i>
                  &nbsp;
                  {AppLanguages.language[this.props.appLanguageCode]}
                </div>
                <div className="my-page-card-button-box-language-box">
                {this.renderEachLanguage(staffLanguagesArray)}
                </div>
              </div>
              <div className="my-page-card-button-box">
                <button name={eachStaff.id} value="edit" className="btn btn-sm btn-edit my-page-edit-delete-btn" onClick={this.handleStaffEditDeleteClick}>{AppLanguages.edit[this.props.appLanguageCode]}</button>
              </div>
            </div>
          </li>
        );
      }
    });
  }

  handleAddStaffClick() {
    this.props.showStaffCreateModal();
    this.props.addNewStaff();
  }

  renderStaffs() {
    if (this.props.auth.user) {
      const selectedContractor = this.getContractor();
      return (
        <div>
          <div className="my-page-category-title">
            <div className="my-page-category-left"></div>
            <div>{AppLanguages.staff[this.props.appLanguageCode]} <br/> {selectedContractor.company_name}</div>
            <div className="my-page-category-right"></div>
          </div>
          <ul>
            {this.renderExistingStaffDetails(selectedContractor)}
          <div className="my-page-enter-new-card-link" onClick={this.handleAddStaffClick}><i className="fa fa-plus-circle" style={{ fontSize: '20px' }}></i> {AppLanguages.addNewStaff[this.props.appLanguageCode]}</div>
          </ul>
        </div>
      );
    }
  }

  renderCardInputModal() {
    if (this.props.showCardInput) {
      return (
        <CardInputModal
        show={this.props.showCardInput}
        // actionType={this.state.actionType}
        // actionType={'addCustomer'}
        />
      );
    }
  }

  renderCreateBankAccountForm() {
    if (this.props.showBankAccountCreate) {
      return (
        <BankAccountCreateModal
        show={this.props.showBankAccountCreate}
        />
      );
    }
  }

  renderEditBankAccountForm() {
    if (this.props.showBankAccountEdit) {
      return (
        <BankAccountEditModal
        show={this.props.showBankAccountEdit}
        />
      );
    }
  }

  renderContractorEditForm() {
    return (
      <ContractorEditModal
        show={this.props.showContractorEdit}
      />
    );
  }

  renderContractorCreateForm() {
    return (
      <ContractorCreateModal
        show={this.props.showContractorCreate}
      />
    );
  }

  renderStaffEditForm() {
    return (
      <StaffEditModal
        show={this.props.showStaffEdit}
      />
    );
  }

  renderStaffCreateForm() {
    return (
      <StaffCreateModal
        show={this.props.showStaffCreate}
      />
    );
  }

  renderProfileEditForm() {
    return (
      <ProfileEditModal
        show={this.props.showProfileEdit}
      />
    );
  }

  renderProfileCreateForm() {
    return (
      <ProfileCreateModal
        show={this.props.showProfileCreate}
      />
    );
  }

  // handleChoiceEachClick(event) {
  //   const clickedElement = event.target;
  //   const elementVal = clickedElement.getAttribute('value');
  //   // console.log('in mypage, handleChoiceEachClick, elementVal: ', elementVal);
  //   // const object = { showMyLikes: true };
  //   // object.showMyLikes = true;
  //   // this.setState({ showMyLikes: true });
  //   // this.setState({ [elementVal]: true });
  //   if (this.state.lastPanel !== elementVal) {
  //     this.setState({ [elementVal]: true, lastPanel: elementVal, [this.state.lastPanel]: false }, () => {
  //       // console.log('in mypage, handleChoiceEachClick, this.state: ', this.state);
  //     });
  //   }
  // }
  //
  // renderEachChoice(choiceObject) {
  //   return _.map(Object.keys(choiceObject), (each, i) => {
  //     return (
  //       <div key={i} className="my-page-choice-box-each" style={this.state.lastPanel === each ? { fontWeight: 'bold' } : {}} value={each} onClick={this.handleChoiceEachClick}>
  //         {choiceObject[each]}
  //       </div>
  //     );
  //   });
  // }

  // renderChoiceBox() {
  //   const choiceObject =
  //   {
  //     showMyLikes: 'My Likes',
  //     showMyFlats: 'My Flats',
  //     showMyBookings: 'My Bookings',
  //     showBookingsForMyFlats: 'Bookings for My Flats',
  //     showMyProfile: 'My Profile',
  //     showContractors: 'Contractors',
  //     showPaymentDetails: 'Payment Details',
  //     showBankAccounts: 'My Bank Accounts',
  //   };
  //
  //   return (
  //     <div
  //       className={this.state.displayChoiceBox ? 'my-page-choice-box display-block' : 'my-page-choice-box display-none'}
  //       style={{ top: this.state.choiceBoxTop + 20, left: this.state.choiceBoxLeft }}
  //     >
  //       {this.renderEachChoice(choiceObject)}
  //     </div>
  //   );
  // }
  // open and close choice box with click of ellipsis
  // handleChoiceEllipsisClick() {
  //   // get the choice box
  //   const choiceIcon = document.getElementById('my-page-choice-ellipsis');
  //   // get the coordinates of the choice box
  //   const rectChoice = choiceIcon.getBoundingClientRect();
  //   // set the top, left and show or hide choice box state variables
  //   this.setState({ displayChoiceBox: !this.state.displayChoiceBox, choiceBoxTop: rectChoice.top, choiceBoxLeft: rectChoice.left - 245 }, () => {
  //     // if click is to open the box, add addEventListener after some time to avoid
  //     // event listener to detect the opening click which causes it not to open
  //     if (this.state.displayChoiceBox) {
  //       setTimeout(() => {
  //         window.addEventListener('click', this.choiceEllipsisCloseClick);
  //       }, 100);
  //     } else {
  //       // if ellipsis click is to close, remvoe addEventListener
  //       window.removeEventListener('click', this.choiceEllipsisCloseClick);
  //     }
  //   });
  //   // const body = document.getElementById('messaging-main-main-container');
  // }
  //
  // choiceEllipsisCloseClick = (e) => {
  //   // fucntion passed to addEventListener
  //   const clickedElement = e.target;
  //   // get class name of clicked element
  //   const elementClassName = clickedElement.getAttribute('class');
  //   // split the class name string if not null since elements can have more than one class name
  //   const classArray = elementClassName ? elementClassName.split(' ') : null;
  //   // define array of classnames that you do not want to close
  //   const donotClosearray = ['my-page-choice-box', 'my-page-choice-box-each'];
  //   // check if clicked element is included in the donotClosearray
  //   let clickedInsideChoiceBox = false;
  //   _.each(donotClosearray, each => {
  //     // if (classArray && classArray.includes(each)) {
  //     if (classArray && classArray.indexOf(each) !== -1) {
  //       clickedInsideChoiceBox = true;
  //     }
  //   });
  //   // if clicked element class not null and not clicked inside choice box
  //   // set state to close box
  //   if ((classArray && !clickedInsideChoiceBox) || !classArray) {
  //     this.setState({ displayChoiceBox: false }, () => {
  //     });
  //     // remove eventListener when box closed
  //     window.removeEventListener('click', this.choiceEllipsisCloseClick);
  //   }
  // }

  renderAllPanels() {
    return _.map(Object.keys(CATEGORY_OBJECT), eachKey => {
      return <div key={eachKey} className="my-page-category-container col-xs-12 col-sm-3">{this[CATEGORY_OBJECT[eachKey].methodName]()}</div>;
    })
  }

  render() {
    // <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderMessaging()}</div>
    const showMobileView = this.state.windowWidth < RESIZE_BREAK_POINT;
    return (
      <div>
        {this.renderCardInputModal()}
        {this.renderCreateBankAccountForm()}
        {this.renderEditBankAccountForm()}
        {this.props.showContractorEdit ? this.renderContractorEditForm() : ''}
        {this.props.showContractorCreate ? this.renderContractorCreateForm() : ''}
        {this.props.showStaffEdit ? this.renderStaffEditForm() : ''}
        {this.props.showStaffCreate ? this.renderStaffCreateForm() : ''}
        {this.props.showProfileEdit ? this.renderProfileEditForm() : ''}
        {this.props.showProfileCreate ? this.renderProfileCreateForm() : ''}
        <div className="page-title">
          <div className="page-title-box"></div>
            <div className="page-title-box">
              {AppLanguages.myPage[this.props.appLanguageCode]}
            </div>
            <div className="page-title-box page-title-box-right">
              {showMobileView
                ?
                <CategoryBox
                  showMobileView
                  choiceObject={CATEGORY_OBJECT}
                  setLastPanelState={(stateObject, callBack) => this.setState(stateObject, callBack)}
                  setCurrentPanelState={(stateObject, callBack) => this.setState(stateObject, callBack)}
                  lastPanel={this.state.lastPanel}
                />
                :
                ''}
            </div>
        </div>
        <div className="container my-page-container">
          <div className="row my-page-row">
            {!showMobileView ?
              this.renderAllPanels()
              :
              <div className="my-page-category-container col-xs-12 col-sm-3">{this[CATEGORY_OBJECT[this.state.lastPanel].methodName]()}</div>
            }

            {this.state.selectedContractorId && (!showMobileView || (this.state.showStaffBox && this.state.showContractors))? <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderStaffs()}</div> : ''}
        </div>
        </div>
        <Link to="/createflat" ><button className="btn btn-lg btn-create-flat">{AppLanguages.listNewFlat[this.props.appLanguageCode]}</button></Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in mypage, mapStateToProps, state: ', state);
  return {
    // flat: state.selectedFlatFromParams.selectedFlat,
    flats: state.flats.flatsByUser,
    selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    bookingsByUser: state.fetchBookingsByUserData.fetchBookingsByUserData,
    auth: state.auth,
    // userProfiles: state.auth.userProfiles,
    user: state.auth.user,
    conversations: state.conversation.conversationsByUser,
    noConversation: state.conversation.noConversation,
    conversationId: state.conversation.conversationToShow,
    showConversationCards: state.conversation.showConversations,
    // likes: state.likes.userLikes
    likes: state.flats.userLikes,
    showCardInput: state.modals.showCardInputModal,
    showBankAccountCreate: state.modals.showBankAccountCreateModal,
    showBankAccountEdit: state.modals.showBankAccountEditModal,
    customer: state.auth.customer,
    charge: state.auth.charge,
    appLanguageCode: state.languages.appLanguageCode,
    bankAccounts: state.auth.bankAccounts,
    showStaffEdit: state.modals.showStaffEditModal,
    showStaffCreate: state.modals.showStaffCreateModal,
    showContractorEdit: state.modals.showContractorEditModal,
    showContractorCreate: state.modals.showContractorCreateModal,
    showProfileCreate: state.modals.showProfileCreateModal,
    showProfileEdit: state.modals.showProfileEditModal,
  };
}

export default connect(mapStateToProps, actions)(MyPage);
