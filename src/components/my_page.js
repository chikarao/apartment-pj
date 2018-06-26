import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';

import * as actions from '../actions';
import Messaging from './messaging/messaging';
import UploadForProfile from './images/upload_for_profile';


class MyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // not being used
      sortByDate: false,
      showConversation: true,
      conversationToShow: {},
      yourFlat: false,
      conversationId: ''
    };
  }
  componentDidMount() {
    // this.props.getCurrentUserForMyPage((id) => this.fetchData(id));
    // if (this.props.flat) {
    //   console.log('in edit flat, componentDidMount, editFlatLoad called');
    //   this.props.editFlatLoad(this.props.flat);
    // }
    // this.props.fetchUserFlats(this.props.auth.id);
    this.props.fetchFlatsByUser(this.props.auth.id, (flatIdArray) => this.fetchFlatsByUserCallback(flatIdArray));
    this.props.fetchBookingsByUser(this.props.auth.id);
    // send fetchConversationByUserAndFlat an array of flats ids
    this.props.fetchLikesByUser();
    this.props.fetchProfileForUser();
  }

  fetchFlatsByUserCallback(flatIdArray) {
    console.log('in mypage, fetchFlatsByUserCallback, flatIdArray: ', flatIdArray);
    this.props.fetchConversationByUserAndFlat(flatIdArray);
  }

 fetchData(id) {
    //callback from getCurrentUserForMyPageid
    console.log('in mypage, fetchData, this.props.auth.id: ', this.props.auth.id);
    console.log('in mypage, fetchData, callback from getCurrentUserForMyPageid: ', id);
  }

  renderEachBookingByUser() {
    console.log('in mypage, renderEachBookingByUser, this.props.bookingsByUser: ', this.props.bookingsByUser);
    // const { bookingsByUser } = this.props;
    const bookingsByUserEmpty = _.isEmpty(this.props.bookingsByUser);
    const { bookingsByUser } = this.props;
    // sort by date_start
    const sortedBookingsByUser = this.sortBookings(bookingsByUser);

    if (!bookingsByUserEmpty) {
      console.log('in mypage, renderEachBookingByUser, after if empty check, bookingsByUser: ', bookingsByUser);
      return _.map(sortedBookingsByUser, (booking, index) => {
        console.log('in mypage, renderEachBookingByUser, in map, booking: ', booking);
        return (
          <li key={index} className="my-page-each-card">
            <div value={booking.id} className="my-page-each-card-click-box" onClick={this.handleBookingCardClick.bind(this)}>
              <img src={"http://res.cloudinary.com/chikarao/image/upload/w_100,h_66,c_crop/" + booking.flat.images[0].publicid + '.jpg'} />
              <div className="my-page-details">
                <ul>
                  <li>{booking.flat.description}</li>
                  <li>check in: {booking.date_start}</li>
                  <li>check out: {booking.date_end}</li>
                  <li>booking id: {booking.id}</li>
                  <li>flat id: {booking.flat.id}</li>
                </ul>
              </div>
            </div>
            <div className="my-page-card-button-box">
            <button className="btn btn-delete btn-sm">Delete</button>
            </div>
          </li>
        );
      });
      //end of map
    }
    // else {
    //   return (
    //     <div>
    //       <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
    //       <div className="spinner">Loading...</div>
    //     </div>
    //   );
    // }
    //end of else
  }


  handleFlatCardClick(event) {
    console.log('in mypage, handleFlatCardClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in mypage, handleFlatCardClick, clicked, elementVal: ', elementVal);
    this.props.history.push(`/show/${elementVal}`);
  }

  handleBookingCardClick(event) {
    console.log('in mypage, handleFlatCardClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in mypage, handleFlatCardClick, clicked, elementVal: ', elementVal);
    this.props.history.push(`/bookingconfirmation/${elementVal}`);
  }

  renderEachFlat() {
    // const { flats } = this.props;
    const flatsEmpty = _.isEmpty(this.props.flats);
    if (!flatsEmpty) {
      const { flats } = this.props;
      console.log('in mypage, renderEachFlat, flats: ', flats);
      return _.map(flats, (flat, index) => {
        console.log('in mypage, renderEachFlat, flat.id: ', flat.id);
        console.log('in mypage, renderEachFlat, flat.description: ', flat.description);
        return (
          <li key={index} className="my-page-each-card">
            <div value={flat.id} className="my-page-each-card-click-box" onClick={this.handleFlatCardClick.bind(this)}>
              <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + flat.images[0].publicid + '.jpg'} />
              <div className="my-page-details">
                <ul>
                  <li>{flat.description}</li>
                  <li>{flat.area}</li>
                  <li>${parseFloat(flat.price_per_month).toFixed(0)}</li>
                  <li>id: {flat.id}</li>
                </ul>

              </div>
            </div>
            <div className="my-page-card-button-box">
              <button value={flat.id} type="flat" className="btn btn-sm btn-delete" onClick={this.handleDeleteClick.bind(this)}>Delete</button>
              <button className="btn btn-sm btn-edit">Edit</button>
            </div>
          </li>
        );
      });
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
    console.log('in mypage, renderBookings, this.props.bookingsByUser: ', this.props.bookingsByUser);
    return (
      <div>
      <div className="my-page-category-title">My Bookings</div>
      <ul>
      {this.renderEachBookingByUser()}
      </ul>
      </div>
    );
  }

  renderFlats() {
    return (
      <div>
        <div className="my-page-category-title">My Flats</div>
        <ul>
        {this.renderEachFlat()}
        </ul>
      </div>
    );
  }

  renderOwnBookings() {
    return (
      <div>
        <div className="my-page-category-title">Bookings for My Flats</div>
        <ul>
        {this.renderEachOwnBookings()}
        </ul>
      </div>
    );
  }

  getConversationToShow(coversationId) {
    console.log('in mypage, getConversationToShow, before each: ', coversationId);
    const { conversations } = this.props;
    console.log('in mypage, getConversationToShow, before each conversation: ', conversations);
    const conversationArray = []
    _.each(conversations, (conv) => {
      console.log('in mypage, getConversationToShow, each: ', conv);
      if (conv.id == coversationId) {
        conversationArray.push(conv);
      }
    });
    return conversationArray;
  }

  handleConversationCardClick(event) {
    console.log('in mypage, handleConversationCardClick, event: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in mypage, handleConversationCardClick, elementVal: ', elementVal);
    let conversationToShow = this.getConversationToShow(elementVal);
    console.log('in mypage, handleConversationCardClick, conversationToShow: ', conversationToShow);
    const yourFlat = conversationToShow[0].flat.user_id == this.props.auth.id;
    this.setState({ showConversation: false, conversationId: elementVal, yourFlat }, () => {
      console.log('in mypage, handleConversationCardClick, this.state: ', this.state);
    // this.setState({ showConversation: false, conversationToShow, yourFlat }, () => {
    //   console.log('in mypage, handleConversationCardClick, this.state: ', this.state);
    this.renderMessages();
    }
    );
  }

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

  renderEachConversation() {
    const { conversations } = this.props;
    if (this.state.showConversation) {
      return _.map(conversations, (conversation, index) => {
        const lastMessageIndex = conversation.messages.length - 1;
        console.log('in mypage, renderEachConversation, conversation: ', conversation);
        const date = new Date(conversation.messages[lastMessageIndex].created_at);
        //show only first 26 characters of text
        const stringToShow = conversation.messages[lastMessageIndex].body.substr(0, 25);
        return (
          <li key={index} className="my-page-each-card">
            <div value={conversation.id} className="my-page-each-card-click-box" onClick={this.handleConversationCardClick.bind(this)}>
              <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + conversation.flat.images[0].publicid + '.jpg'} />
              <div className="my-page-details">
                <ul>
                  <li>{stringToShow}...</li>
                  <li>{this.formatDate(date)}</li>
                  <li>user id: {conversation.user.id}</li>
                  <li>conversation id: {conversation.id}</li>
                </ul>
              </div>
            </div>
          </li>
        );
      });
    }
  }

  renderMessages() {
    return (
      <div className="my-page-message-box">
      <Messaging
        currentUserIsOwner={false}
        // conversation={this.state.conversationToShow}
        noConversation={this.props.noConversation}
        yourFlat={this.state.yourFlat}
        conversationId={this.state.conversationId}
      />
      </div>
    );
  }

  renderConversations() {
    return (
      <ul>
      {this.renderEachConversation()}
      </ul>
    );
  }

  handleMessageHamburgerClick() {
    // this.props.fetchFlatsByUser(this.props.auth.id, (flatIdArray) => this.fetchFlatsByUserCallback(flatIdArray));
    // this.props.fetchFlatsByUser(this.props.auth.id, (flatIdArray) => this.fetchFlatsByUserCallback(flatIdArray));
    this.setState({ showConversation: true });
  }

  // <div className="message-box-container">
  //   <div className="message-box">

  renderMessaging() {
    console.log('in mypage, renderMessaging, this.state.showConversation: ', this.state.showConversation);
    return (
      <div>
        <div className="my-page-category-title">
          <span id="messaging-hamburger" className={this.state.showConversation ? 'hide' : ''} onClick={this.handleMessageHamburgerClick.bind(this)} ><i className="fa fa-bars"></i></span>
          <span>My Messages</span>
        </div>
        {this.state.showConversation ? this.renderConversations() : this.renderMessages()}
      </div>
    );
  }

  sortBookings(bookings) {
    //reference: https://stackoverflow.com/questions/10123953/sort-javascript-object-array-by-date
    console.log('in mypage, sortBookings, bookings: ', bookings);
    let bookingsArray = [];
    // push each object into array then sort
    _.each(bookings, (booking) => {
      bookingsArray.push(booking);
      console.log('in mypage, sortBookings, in each, bookingsArray: ', bookingsArray);
    });

    const sortedBookingsArray = bookingsArray.sort((a, b) => {
      // console.log('in mypage, sortBookings, in each, in sortedBookingsArray, new Date(a.date_start): ', new Date(a.date_start));
      // console.log('in mypage, sortBookings, in each, in sortedBookingsArray, new Date(b.date_start): ', new Date(b.date_start));
      return new Date(a.date_start) - new Date(b.date_start);
    });
    // put sorted array into object format that the app has been using
    console.log('in mypage, sortBookings, in each, sortedBookingsArray: ', sortedBookingsArray);
    const bookingsList = {};
    _.each(sortedBookingsArray, (booking, index) => {
      bookingsList[index] = { id: booking.id, user_id: booking.user_id, date_start: booking.date_start, date_end: booking.date_end, flat: booking.flat }
    });
    console.log('in mypage, sortBookings, in each, bookingsList: ', bookingsList);

    return bookingsList;
  }

  handleDeleteClick(event) {
    console.log('in mypage, handleDeleteClick, event.target: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const elementType = clickedElement.getAttribute('type');
    console.log('in mypage, handleDeleteClick, elementVal: ', elementVal);
    console.log('in mypage, handleDeleteClick, elementType: ', elementType);
    if (elementType === 'ownBooking' && window.confirm('Are you sure you want to delete this booking?')) {
      console.log('in mypage, handleDeleteClick, if statement, delete own booking: ', elementType);
      this.props.deleteBooking(elementVal, () => this.props.history.push('/mypage'));
    }
    if (elementType === 'flat' && window.confirm('Are you sure you want to delete this flat?')) {
      console.log('in mypage, handleDeleteClick, if statement, delete flat: ', elementType);
      this.props.deleteFlat(elementVal, () => this.props.history.push('/mypage'));
    }
  }

  renderEachOwnBookings() {
    // takes flats with bookings and creates object with bookings then flat
    const preSortBookings = this.createBookingObject();
    // sorts preSortBookings by date_start
    const bookings = this.sortBookings(preSortBookings);

    // const bookings = this.createBookingObject((b) => this.sortBookings(b));
    // const sortedBookings = this.sortBookings(bookings);
    console.log('in mypage, renderEachOwnBookings, bookings, h: ', bookings);

        return _.map(bookings, (booking, index) => {
          console.log('in mypage, renderOwnBookings, in each, booking: ', booking);
          const flat = booking.flat;
          console.log('in mypage, renderOwnBookings, in each, flat: ', flat);

            return (
              <li key={index} className="my-page-each-card">
                <div value={booking.id} className="my-page-each-card-click-box" onClick={this.handleBookingCardClick.bind(this)}>
                  <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + flat.images[0].publicid + '.jpg'} />
                  <div className="my-page-details">
                    <ul>
                      <li>{flat.description}</li>
                      <li>check in: {booking.date_start}</li>
                      <li>check out: {booking.date_end}</li>
                      <li>booking id: {booking.id}</li>
                      <li>flat id: {flat.id}</li>
                    </ul>

                  </div>
                </div>
                <div className="my-page-card-button-box">
                  <button value={booking.id} type="ownBooking" className="btn btn-delete btn-sm" onClick={this.handleDeleteClick.bind(this)}>Delete</button>
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

  createBookingObject() {
    //reference: https://stackoverflow.com/questions/14234646/adding-elements-to-object
      const { flats } = this.props;
      const flatsEmpty = _.isEmpty(flats);
      // let bookingsObj = {};
      console.log('in mypage, renderOwnBookings, this.props.flats.bookings: ', this.props.flats);
      const bookingsList = {}
      if (!flatsEmpty) {
         _.map(flats, (flat) => {
          console.log('in mypage, renderOwnBookings, in each, flat: ', flat);
          const bookings = flat.bookings;
           _.map(bookings, (booking, index) => {
            console.log('in mypage, renderOwnBookings, in second each, booking: ', booking);
            console.log('in mypage, renderOwnBookings, in second each, flat: ', flat);

            bookingsList[booking.id] = { id: booking.id, user_id: booking.user_id, date_start: booking.date_start, date_end: booking.date_end, flat }
            console.log('in mypage, renderOwnBookings, bookingsList: ', bookingsList);

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
    console.log('in main cards, handleUnlikeClick, like clicked, event.target: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in main cards, handleLikeClick, elementVal: ', elementVal);
    this.props.deleteLike(elementVal, () => this.handleLikeClickCallback());
  }

  handleLikeClickCallback() {
    this.props.fetchLikesByUser();
  }

  renderEachLike() {
    console.log('in mypage, renderEachLike, likes: ', this.props.likes);
    const { likes } = this.props;

        return _.map(likes, (like, index) => {
          console.log('in mypage, renderEachLike, in each, like: ', like);
          const flat = like.flat;
          console.log('in mypage, renderEachLike, in each, flat: ', flat);

            return (
              <li key={index} className="my-page-each-card">
                <div value={flat.id} className="my-page-each-card-click-box" onClick={this.handleFlatCardClick.bind(this)}>
                  <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + flat.images[0].publicid + '.jpg'} />
                  <div className="my-page-details">
                    <ul>
                      <li>{flat.description}</li>
                      <li>{flat.area}</li>
                      <li>${parseFloat(flat.price_per_month).toFixed(0)}</li>
                      <li>flat id: {flat.id}</li>
                    </ul>

                  </div>
                </div>
                <div className="my-page-card-button-box">
                  <button value={flat.id} type="flat" className="btn btn-sm btn-delete" onClick={this.handleUnlikeClick.bind(this)}>Remove</button>
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

  renderLikes() {
    return (
      <div>
        <div className="my-page-category-title">My Likes</div>
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

  handleEditProfileClick() {
    console.log('in header, handleEditProfileClick: ');
    this.props.showEditProfileModal();
  }

  handleImageUploadClick() {
    console.log('in header, handleImageUploadClick: ');

  }

  handleRemoveProfileImage() {
    this.props.editProfile({ id: this.props.auth.userProfile.id, image: 'blank_profile_picture' }, () => this.handleRemoveProfileImageCallback());
  }

  handleRemoveProfileImageCallback() {
    console.log('in header, handleRemoveProfileImageCallback: ');
  }

  renderProfileImage() {
    console.log('in header, renderProfileImage, this.props.auth.userProfile.image: ', this.props.auth.userProfile.image);
    return (
      <div className="my-page-profile-image-box">
        <div className="my-page-profile-image-box-image">
          <img src={"http://res.cloudinary.com/chikarao/image/upload/w_100,h_100,c_fill,g_face/" + this.props.auth.userProfile.image + '.jpg'} alt="Profile Image" />
        </div>
          <div className="my-page-change-profile-picture-link">
            <UploadForProfile
              profileId={this.props.auth.userProfile.id}
            />
          </div>
          {this.props.auth.userProfile.image === 'blank_profile_picture' ? '' :
          <div className="my-page-remove-profile-picture-link" onClick={this.handleRemoveProfileImage.bind(this)}>
            Remove Profile Picture
          </div> }
      </div>
    );
  }

  renderProfile() {
    if (this.props.auth.userProfile) {
      const { username, user_id, title, first_name, last_name, birthday, identification, address1, address2, city, state, zip, country, region, introduction } = this.props.auth.userProfile;
      console.log('in mypage, renderProfile, user_id: ', user_id);
      return (
        <div>
          <div className="my-page-category-title-profile">
            <span>My Profile</span>
            <span id="my-page-profile-edit-link" onClick={this.handleEditProfileClick.bind(this)}><i className="fa fa-edit"></i></span>
          </div>
            {this.renderProfileImage()}
          <ul className="my-page-profile-ul">
            <li value="username"className="my-page-profile-attribute"><span>User Name:</span> <span>{username}</span></li>
            <li value="user_id"className="my-page-profile-attribute"><span>User ID:</span> <span>{user_id}</span></li>
            <li value="title"className="my-page-profile-attribute"><span>Title:</span> <span>{title}</span></li>
            <li value="first_name"className="my-page-profile-attribute"><span>First Name:</span> <span>{first_name}</span></li>
            <li value="last_name"className="my-page-profile-attribute"><span>Last Name:</span> <span>{last_name}</span></li>
            <li value="birthday"className="my-page-profile-attribute"><span>Birthday:</span> <span>{birthday}</span></li>
            <li value="address1"className="my-page-profile-attribute"><span>Street Address:</span> <span>{address1}</span></li>
            <li value="city"className="my-page-profile-attribute"><span>City:</span> <span>{city}</span></li>
            <li value="state"className="my-page-profile-attribute"><span>State:</span> <span>{state}</span></li>
            <li value="zip"className="my-page-profile-attribute"><span>Zip:</span> <span>{zip}</span></li>
            <li value="country"className="my-page-profile-attribute"><span>Country:</span> <span>{country}</span></li>
            <li value=""className="my-page-profile-attribute"><span>Self Intro:</span> <span></span></li>
            <div value="introduction"className="my-page-profile-introduction">{introduction}</div>
          </ul>
        </div>
      );
    } //end of if
  }

  render() {
    return (
      <div>
        <h2>My Page</h2>
        <div className="container my-page-container">
          <div className="row">
          <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderMessaging()}</div>
          <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderLikes()}</div>
          <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderBookings()}</div>
          <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderFlats()}</div>
          <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderOwnBookings()}</div>
          <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderProfile()}</div>
        </div>
        </div>
        <Link to="/createflat" ><button className="btn btn-lg btn-create-flat">List a New Flat!</button></Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in mypage, mapStateToProps, state: ', state);
  return {
    // flat: state.selectedFlatFromParams.selectedFlat,
    flats: state.flats,
    selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    bookingsByUser: state.fetchBookingsByUserData.fetchBookingsByUserData,
    auth: state.auth,
    conversations: state.conversation.conversationByUserAndFlat,
    noConversation: state.conversation.noConversation,
    likes: state.likes.userLikes
  };
}

export default connect(mapStateToProps, actions)(MyPage);
