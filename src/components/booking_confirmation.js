import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Cable from 'actioncable';
// import { reduxForm, Field } from 'redux-form';
// import { reduxForm, Field } from 'redux-form';

import * as actions from '../actions';
import ReviewEditModal from './modals/review_edit_modal';
import ReviewCreateFrom from './forms/review_create';
import SetFinalBookingTermsFrom from './forms/set_booking_deal';

import CreateEditDocument from './forms/create_edit_document';
import CalculateAge from './functions/calculate_age';
import Facility from './constants/facility';
import Documents from './constants/documents';
import AppLanguages from './constants/app_languages';
import Languages from './constants/languages';
import InsertField from './constants/insert_field';
// import UploadForProfile from './images/upload_for_profile';
import DocumentInsertCreateModal from './modals/document_insert_create_modal';
import DocumentInsertEditModal from './modals/document_insert_edit_modal';
import InsertFieldCreateModal from './modals/insert_field_create_modal';
import InsertFieldEditModal from './modals/insert_field_edit_modal';
import DocumentEmailCreateModal from './modals/document_email_create_modal';
import ConversationCreateModal from './modals/conversation_create_modal';
// import InsertFieldEditModal from './modals/insert_field_edit_modal';
import globalConstants from './constants/global_constants.js'
import Typing from './messaging/typing.js'


// import DocumentForm from './constants/document_form';
let insertFieldObject = {};
let typingTimerOut = 0;

class BookingConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDocument: false,
      agreementId: '',
      showSavedDocument: false,
      documentInsertId: '',
      insertFieldId: '',
      insertFieldLanguageCode: '',
      showDocumentEmailCreateModal: false,
      uploadOwnDocument: false, // used in upload modals
      showOwnUploadedDocument: false, // used in create_edit_document
      signedDocumentsModal: false, // used in email documents modal signed documents
      showConversationCreate: false, // for showing modeal to input message and create conversation
      currentChatMessage: '', // test for action action cable take out later
      chatLogs: {}, // test for action action cable take out later
      // chatLogs2: [], // test for action action cable take out later
      webSocketConnected: false,
      typingTimer: 0,
      messageSender: '',
    };

    this.handleDocumentCreateClick = this.handleDocumentCreateClick.bind(this);
    this.handleSavedDocumentShowClick = this.handleSavedDocumentShowClick.bind(this);
    this.handleBookingRequsetApprovalClick = this.handleBookingRequsetApprovalClick.bind(this);
    this.handleEditReviewClick = this.handleEditReviewClick.bind(this);
    this.handleDocumentLanguageSelect = this.handleDocumentLanguageSelect.bind(this);
    this.handleUploadPdfLink = this.handleUploadPdfLink.bind(this);
    this.handleUploadedPdfClick = this.handleUploadedPdfClick.bind(this);
    this.handleInsertFieldAddClick = this.handleInsertFieldAddClick.bind(this);
    this.handleEachInsertFieldClick = this.handleEachInsertFieldClick.bind(this);
    this.handlePrepareEmailClick = this.handlePrepareEmailClick.bind(this);
    this.handleDocumentUploadClick = this.handleDocumentUploadClick.bind(this);
    this.handleOwnDocumentShowClick = this.handleOwnDocumentShowClick.bind(this);
    this.handleDocumentsSignedClick = this.handleDocumentsSignedClick.bind(this);
    this.handleCreateConversationClick = this.handleCreateConversationClick.bind(this);
    this.handleOpenConversationClick = this.handleOpenConversationClick.bind(this);
  }

  componentDidMount() {
    // gets flat id from params set in click of main_cards or infowindow detail click
    const bookingId = parseInt(this.props.match.params.id, 10);
    this.props.fetchBooking(bookingId);
    this.props.fetchReviewForBookingByUser(bookingId);
    this.props.fetchDocumentTranslation('important_points_explanation');
    // test for actioncable
    // console.log('in booking confirmation, getting params, this.props.match.params.id: ', this.props.match.params.id);
    // if (this.props.auth.id) {
      // console.log('in booking confirmation, this.props.auth.id: ', this.props.auth.id);
      this.createSocket();
    // }
    // this.createSocket2();
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('in booking confirmation, this.state, nextState: ', this.state, nextState);
  //   if (this.state.typingTimer !== nextState.typingTimer) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
   // componentDidUpdate() {
   // }

  // componentWillUnmount() {
  //   console.log('in booking confirmation, componentWillUnmount');
  // }

  renderImage(images) {
    const imagesEmpty = _.isEmpty(images);
    if(!imagesEmpty) {
      // console.log('in booking_confirmation renderImages, images: ', images);
      return (
        _.map(images, (image, index) => {
          // console.log('in booking_confirmation renderImages, image: ', image.publicid);
          return (
            <div key={index} className="slide-show">
              <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + image.publicid + '.jpg'} />
            </div>
          );
        })
      );
    } else {
      return (
        <div className="no-results-message">Images are not available for this flat</div>
      );
    }
  }

  getFacilityChoice(facilityType) {
    let facilityChoice = {};
    _.each(Facility.facility_type.choices, eachChoice => {
      if (eachChoice.value === facilityType) {
        facilityChoice = eachChoice;
        return;
      }
    });
    return facilityChoice;
  }

  getFacilityStrings(facilitiesArray) {
    const array = []
    const currency = this.props.currency;
    let facilityString = ''
    _.each(facilitiesArray, eachFacility => {
      const choice = this.getFacilityChoice(eachFacility.facility_type);
      // console.log('in booking_confirmation getFacilityStrings, choice: ', choice);

      // if facility included
      if (this.props.booking.flat[choice.facilityObjectMap]) {
        facilityString = choice[this.props.appLanguageCode] + ', ' + AppLanguages.included[this.props.appLanguageCode]
      } else {
        facilityString = choice[this.props.appLanguageCode] + ', ' + currency + eachFacility.price_per_month + '/' + AppLanguages.monthAbbreviated[this.props.appLanguageCode]　+ ', ' + AppLanguages.depositAbbreviated[this.props.appLanguageCode] + ' ' + (eachFacility.deposit ? eachFacility.deposit : 0) + ' ' + AppLanguages.monthAbbreviated[this.props.appLanguageCode]
      }
      array.push(facilityString)
    })
    return array;
  }

  getFlatLanguage(flat) {
    let returnedObject = null;
    if (flat.flat_languages) {
      _.each(flat.flat_languages, each => {
        if (each.language_code === this.props.appLanguageCode) {
          returnedObject = each;
          return;
        }
      });
    }
    return returnedObject;
  }


  renderEachBasicLine() {
    const flatLanguage = this.getFlatLanguage(this.props.booking.flat);
    const { date_start, date_end, id, facilities } = this.props.booking;
    let { description, area, beds, rooms, layout, city, state, country, price_per_month, deposit, key_money } = this.props.booking.flat;
    // if there is a flat language, reassign language dependent props
    if (flatLanguage) {
      description = flatLanguage.description;
      area = flatLanguage.area;
      city = flatLanguage.city;
      state = flatLanguage.state;
      country = flatLanguage.country;
    }
    const { appLanguageCode } = this.props;
    const facilitiesInStringArray = this.getFacilityStrings(facilities);
    // console.log('in booking_confirmation renderEachBasicLine, facilitiesInStringArray: ', facilitiesInStringArray);
    // const addressString = city + ', ' + state
    const addressString = this.props.appLanguageCode == 'en' ? city + ', ' + state : city
    // const addressString = city + ' ' + state + ' ' + `${country.toLowerCase() == ('日本' || 'japan') ? '' : country}`

    // const lineArray = [
    //   { title: 'Description:', data: description },
    //   { title: 'Area:', data: area },
    //   { title: 'City/State:', data: addressString },
    //   { title: 'Beds:', data: beds },
    //   { title: 'Rooms:', data: rooms },
    //   { title: 'Layout:', data: layout },
    //   { title: 'Date Start:', data: date_start },
    //   { title: 'Date End:', data: date_end },
    //   { title: 'Booking ID:', data: id },
    //   { title: 'Listing ID:', data: this.props.booking.flat.id }
    // ];
    const lineArray = [
      { title: `${AppLanguages.dateStart[appLanguageCode]}:`, data: date_start },
      { title: `${AppLanguages.dateEnd[appLanguageCode]}:`, data: date_end },
      { title: `${AppLanguages.description[appLanguageCode]}:`, data: description },
      { title: `${AppLanguages.area[appLanguageCode]}:`, data: area },
      { title: `${AppLanguages.cityState[appLanguageCode]}:`, data: addressString },
      { title: `${AppLanguages.listedRent[appLanguageCode]}:`, data: parseInt(price_per_month, 10), currency: this.props.currency },
      { title: `${AppLanguages.listedDeposit[appLanguageCode]}:`, data: deposit },
      { title: `${AppLanguages.listedKeyMoney[appLanguageCode]}:`, data: key_money },
      { title: `${AppLanguages.beds[appLanguageCode]}:`, data: beds },
      { title: `${AppLanguages.rooms[appLanguageCode]}:`, data: rooms },
      { title: `${AppLanguages.layout[appLanguageCode]}:`, data: layout },
      { title: `${AppLanguages.bookingId[appLanguageCode]}:`, data: id },
      { title: `${AppLanguages.listingId[appLanguageCode]}:`, data: this.props.booking.flat.id }
    ];


    if (facilitiesInStringArray.length > 0) {
      const object = { title: AppLanguages.facilities[appLanguageCode], data: '' };
      lineArray.splice((lineArray.length - 2), 0, object);
      _.each(facilitiesInStringArray, eachFacilityString => {
        const facilityObject = { title: '', data: eachFacilityString };
        // lineArray.push(facilityObject);
        lineArray.splice((lineArray.length - 2), 0, facilityObject);
      });
    }

    return _.map(lineArray, (eachLine, i) => {
      return (
        <div key={i} className="booking-request-box-each-line">
          <div className="booking-request-box-each-line-title">
            {eachLine.title}
            </div>
            <div className="booking-request-box-each-line-data">
            {eachLine.currency ? eachLine.currency : ''}{eachLine.data}
          </div>
        </div>
      );
    });
  }

  getNumberOfTenants(booking, profile) {
    const { tenants } = booking;
    let otherTenants = 0;
    if (tenants) {
      if (tenants.length > 0) {
        otherTenants += tenants.length;
      }
      if (!profile.corporation) {
        otherTenants += 1;
      }
    }
    return otherTenants;
  }

  renderEachTenantLine(profile) {
    const { birthday, city, state, country } = profile;
    const { appLanguageCode } = this.props;
    // const { description, area, beds } = booking.flat;
    const age = CalculateAge(birthday);
    console.log('in booking_confirmation renderEachTenantLine, age: ', age);
    const addressString = city + ' ' + state + ' ' + `${country.toLowerCase() == ('日本' || 'japan') ? '' : country}`
    const numberOfTenants = this.getNumberOfTenants(this.props.booking, profile)

    const lineArray = [
      { title: AppLanguages.age[appLanguageCode], data: age },
      { title: AppLanguages.tenantFrom[appLanguageCode], data: addressString },
      { title: AppLanguages.numberTenants[appLanguageCode], data: numberOfTenants },
      // { title: 'State', data: state },
      // { title: 'Country', data: country },
    ];
    return _.map(lineArray, (eachLine, i) => {
      return (
        <div key={i} className="booking-request-box-each-line">
          <div className="booking-request-box-each-line-title">
            {eachLine.title}:
          </div>
          <div className="booking-request-box-each-line-data">
            {eachLine.data}
          </div>
        </div>
      );
    })
  }

  renderBookingBasicInformation() {
    const { appLanguageCode } = this.props;
    return (
      <div className="booking-confirmation-each-box">
        <div className="booking-request-box-title">{AppLanguages.basicBookingRequestInformation[appLanguageCode]}</div>
        {this.renderEachBasicLine()}
      </div>
    );
  }

  renderNameBox(profile) {
    const { appLanguageCode } = this.props;
    return (
      <div className="booking-confirmation-name-box">
        <div className="booking-confirmation-name-box-each-line">
            {AppLanguages.firstName[appLanguageCode]}: {profile.first_name}
        </div>
        <div className="booking-confirmation-name-box-each-line">
            {AppLanguages.lastName[appLanguageCode]}: {profile.last_name}
        </div>
      </div>
    );
  }

  renderTenantIntroduction(profile) {
    const { appLanguageCode } = this.props;
    return (
      <div className="booking-confirmation-profile-introduction">
        <div className="booking-request-box-each-line-title">
          {AppLanguages.introduction[appLanguageCode]}:
        </div>
        {profile.introduction}
      </div>
    );
  }

  getProfileToUse(profiles) {
    let returnedProfile = null;
    _.each(profiles, eachProfile => {
      if (eachProfile.language_code == this.props.appLanguageCode) {
        returnedProfile = eachProfile;
      }
    });

    if (profiles.length == 1) {
      returnedProfile = profiles[0]
    }

    if (!returnedProfile) {
      _.each(profiles, eachProfile => {
        if (eachProfile.language_code == 'en') {
          returnedProfile = eachProfile;
        }
      });
    }

    return returnedProfile;
  }
  // test for actioncable take out later
  updateCurrentChatMessage(event) {
    const userId = this.props.auth.id;
    const addresseeId = this.props.auth.id === this.props.booking.user_id ? this.props.boooking.flat.user_id : userId;
    // const userId = this.props.booking.user_id === this.props.auth.id ? this.props.booking.user_id : this.props.booking.flat.user_id
    // typingTimerOut is a global variable
    // this.chats.typing is a command for the backend to send a notification to the addressee
    // that the sender is typing a message. Notifications are sent once per timer cycle.
    // The timer is started when typingTimerOut is 0, when decremented every second
    // When the timer is zero, the timer is ready to be started again.
    if (typingTimerOut === 0) {
      const lapseTime = () => {
        if (subTimer > 0) {
          subTimer--;
          console.log('updateCurrentChatMessage in received, in lapseTime, subTimer ', subTimer);
        } else {
          console.log('updateCurrentChatMessage in received, in lapseTime, subTimer in else ', subTimer);
          // typingTimer--;
          clearInterval(timer);
          typingTimerOut = subTimer;
        }
      };
      let subTimer = 5;
      typingTimerOut = subTimer;
      const timer = setInterval(lapseTime, 1000);
      this.chats.typing(addresseeId);
    }
    this.setState({
      currentChatMessage: event.target.value
    });
  }

  createSocket() {
    this.cable = Cable.createConsumer('ws://localhost:3000/cable');
    // this.cable.connection.websocket.onclose = () => {
    //   // console.log('createSocket this.cable.connection.websocket.onclose callback');
    // };
    console.log('createSocket this.cable.connnection', this.cable.connection);
    console.log('createSocket this.cable.connnection.consumer', this.cable.connection.consumer);
    console.log('createSocket this.cable.connnection.subscriptions', this.cable.connection.subscriptions);
    console.log('createSocket this.cable.connnection.webSocket', this.cable.connection.webSocket);
    console.log('createSocket this', this);
    const userId = localStorage.getItem('id');
    // console.log('createSocket this.props.auth.id', this.props.auth.id);
    // console.log('createSocket Cable', Cable);
    this.chats = this.cable.subscriptions.create({
      channel: 'ChatChannel', room: `messaging_room_${userId}`
      // channel: 'ChatChannel', room: `room${this.props.auth.id}`
    }, {
      connected: (message) => {
          console.log('createSocket in call back to connected message', message);
          console.log('createSocket in call back to connected this.cable.connection.subscription', this.cable.connection.subscription);
          // console.log('createSocket in call back to connected, this.chats', this.chats);
          // console.log('createSocket in call back to connected, this.cable.connection.webSocket', this.cable.connection.webSocket);

          // if (!message && !this.state.webSocketConnected) {
            this.authenticateChat();
          // }
          // this.cable.connection.webSocket.onclose = function (event) {
          //   console.log('createSocket in call back to connected, websocket onclose, connection closed, event', event);
          // }
          // this.webSocket = this.cable.connection.webSocket;
          if (!this.state.webSocketConnected) this.setState({ webSocketConnected: true });
      }, // end of connected

      rejected: () => {
        console.log('***** Connection Rejected *****');
      },

      unsubscribed: () => {
        console.log('***** Connection Unsubscribed *****');
        // this.perform('unsubscribed');
      },

      unsubscribeConnection: function () {
        console.log('***** Unsubscribing from Connection *****');
        this.perform('unsubscribe_connection', {});
      },

      // unsubscribe: () => {
      //     console.log('createSocket in call back to unsubscribe');
      // }, // end of connected
      authenticated: function (token) {
        this.perform('authenticated', { token });
        console.log('***** Authenticating Action Cable Connection *******');
      },

      received: (data) => {
        console.log('createSocket in received before if data', data);
        if (data.conversation) {
          // const chatLogs = [...this.state.chatLogs]; // create copy of state.chatLogs
          const conversation = JSON.parse(data.conversation);
          this.props.receiveConversation(conversation);
          console.log('createSocket this', this);
          // chatLogs.push(conversation);
          // this.setState({ chatLogs }, () => {
          //   console.log('createSocket received Chatlogs after set state, this.state.chatLogs ', this.state.chatLogs);
          //   }
          // );  // end of setState
        } else if (data.notification) {
          console.log('createSocket in received, data ', data);
          if (data.notification === 'typing') {
            if (this.state.typingTimer === 0) {
              console.log('createSocket in received, data.notification.typing ', data.notification);
              const lapseTime = () => {
                if (subTimer > 0) {
                  subTimer--;
                  console.log('createSocket in received, data.notification.typing, in lapseTime, subTimer ', subTimer);
                } else {
                  console.log('createSocket in received, data.notification.typing, in lapseTime, subTimer in else ', subTimer);
                  // typingTimer--;
                  this.setState({ typingTimer: subTimer }, () => {
                    console.log('createSocket in received, data.notification.typing, in lapseTime, this.state.typingTimer in else ', this.state.typingTimer);
                  });
                  clearInterval(timer);
                }
              };
              // clearInterval(timer);
              let subTimer = 5;
              if (this.state.typingTimer < 5) {
                this.setState({ typingTimer: subTimer, messageSender: data.user_id }, () => {
                  console.log('createSocket in received, data.notification.typing, this.state.typingTimer after setting at 5, messageSender ', this.state.typingTimer, this.state.messageSender);
                });
              }
              const timer = setInterval(lapseTime, 1000);
            }
          }
        }
      }, // end of received

      create: function (chatContent) {
        this.perform('create', { content: chatContent });
      }, // end of create:

      typing: function (addresseeId) {
        console.log('createSocket this', this);
        this.perform('typing', { user_id: userId, addressee_id: addresseeId });
      },
    }); // end of subscriptions.create and second object
  }

  authenticateChat() {
    const token = localStorage.getItem('token');
    this.chats.authenticated(token);
    console.log('authenticateChat in call back to chat connection authenticated, this.cable.connection', this.cable.connection);
    console.log('authenticateChat in call back to chat connection authenticated, run');
    // console.log('authenticateChat in call back to chat connection authenticated, this.cable.connection.webSocket.onclose', this.cable.connection.webSocket.onclose);
    this.cable.connection.webSocket.onclose = (m) => {
      console.log('authenticateChat in call back to chat connection authenticated, webSocket onclose listener fired!!!!', m);
      this.setState({ webSocketConnected: false });
      // if webSocket connection is disconneted, createSocket reconnects
      // this.createSocket();
    };
    // this.cable.connection.webSocket.onmessage = (m) => {
    //   console.log('authenticateChat in call back to chat connection authenticated, webSocket onmessage listener fired!!!! m, m.data', m, m.data);
    //   console.log('authenticateChat in call back to chat connection authenticated, webSocket onmessage listener fired!!! this.cable.connection.webSocket', this.cable.connection.webSocket);
    //   console.log('authenticateChat in call back to chat connection authenticated, webSocket onmessage listener fired!!! this.cable.subscriptions.subscriptions[0].identifier', this.cable.subscriptions.subscriptions[0].identifier);
    //     // const message = { command: 'message', identifier: { channel: 'ChatChannel', room: 'messaging_room_3' } };
    //     const message = { command: 'message', identifier: this.cable.subscriptions.subscriptions[0].identifier, data: JSON.stringify({ action: 'message', data: m.data.message }) };
    //     // const message = { command: 'message', event: 'ping', identifier: JSON.stringify({ channel: 'ChatChannel', room: 'messaging_room_3' }), data: JSON.stringify({ action: 'message', data: m.data.message }) };
    //     // const message = { command: 'message', identifier: { channel: 'ChatChannel', room: 'messaging_room_3' }, data: JSON.stringify({ type: 'ping', message: m.data.message }) };
    //     // const message = m.data.message;
    //     this.cable.connection.webSocket.send(JSON.stringify(message));
    //     // if (m.data.type === 'ping') {
    //     //   console.log('authenticateChat in call back to chat connection authenticated, webSocket onmessage listener fired!!!! m, m.data', m, m.data);
    //     //   return;
    //     // }
    //     // this.cable.connection.webSocket.send(message);
    //   // if webSocket connection is disconneted, createSocket reconnects
    //   // this.createSocket();
    // };// end of on message
  }
  // createSocket2() {
  //   this.cable = Cable.createConsumer('ws://localhost:3000/cable');
  //   console.log('createSocket this.cable', this.cable);
  //   // console.log('createSocket Cable', Cable);
  //   this.chats = this.cable.subscriptions.create({
  //     channel: 'ChatChannel', room: 'test_room2'
  //   }, {
  //     connected: () => {
  //         console.log('createSocket in call back to connected');
  //         console.log('createSocket in call back to connected, this.chats', this.chats);
  //     }, // end of connected
  //     rejected: () => {
  //       console.log('createSocket in call back to rejected');
  //     },
  //     // unsubscribe: () => {
  //     //     console.log('createSocket in call back to unsubscribe');
  //     // }, // end of connected
  //     received: (data) => {
  //       const chatLogs2 = [...this.state.chatLogs2]; // create copy of state.chatLogs
  //       chatLogs2.push(data);
  //       this.setState({ chatLogs2 }, () => {
  //         console.log('Chatlogs after set state, this.state.chatLogs2 ', this.state.chatLogs2);
  //         }
  //       );
  //     }, // end of received
  //     create: function (chatContent) {
  //       this.perform('create', {
  //         content: chatContent
  //       });
  //     } // end of create:
  //   }); // end of subscriptions.create and second object
  // }

  handleSendEvent(event) {
    // event.preventDefault();
    // this.chats.create(this.state.currentChatMessage);
    this.props.createMessage({ conversation_id: 44, body: this.state.currentChatMessage, booking_id: 2452, sent_by_user: true }, () => {});
    this.setState({
      currentChatMessage: ''
    });
  }

  handleDisconnectEvent(event) {
    // event.preventDefault();
    // disconnects consumer and stops streaming
    // message api: Finished "/cable/" [WebSocket] for 127.0.0.1 at 2019-12-19 15:51:01 +0900
    // ChatChannel stopped streaming from test_room
    // .disconnect causes webSocket.onclose listener to fire.
    // unsubscribe leading to reject does not fire onclose
    this.cable.disconnect(() => {
    console.log('handleDisconnectEvent in call back to disconnect');
    });
    // this.chats.unsubscribeConnection(() => {
    // console.log('handleDisconnectEvent in call back to disconnect');
    // });
    // this.chats.unsubscribed();
  }

  handleConnectEvent(event) {
    event.preventDefault();
    // disconnects consumer and stops streaming
    // message api: Finished "/cable/" [WebSocket] for 127.0.0.1 at 2019-12-19 15:51:01 +0900
    // ChatChannel stopped streaming from test_room
    this.createSocket(() => {
    console.log('handleConnectEvent in call back to connect');
    });
  }

  renderBookingTenantInformation(booking) {
    // for some reason, cloudinary image does not render correctly if image obtained
    // from this.props.booking; needs to be passed on by parameter
    const profileToUse = this.getProfileToUse(booking.user.profiles);
    const { appLanguageCode } = this.props;

    return (
      <div className="booking-confirmation-each-box">
        <div className="booking-request-box-title">{AppLanguages.proposedTenantInformation[appLanguageCode]}</div>
          <div className="booking-confirmation-profile-top-box">
            <img src={'http://res.cloudinary.com/chikarao/image/upload/w_100,h_100,c_fill,g_face/' + booking.user.image + '.jpg'} className="booking-confirmation-image-box" alt="" />
            {this.renderNameBox(profileToUse)}
          </div>
          <div className="booking-confirmation-profile-scrollbox">
            {this.renderEachTenantLine(profileToUse)}
            {this.props.userIsOwner ? this.renderTenantIntroduction(profileToUse) : ''}
          </div>
              <div style={{ width: 'auto', height: '150px'}}>
                <div style={ { width: 'auto', height: '50%', border: 'gray', padding: '10px', textAlign: 'left', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ width: '200px', height: '30px', border: 'gray', padding: '10px', borderRadius: '3px' }}>
                      <Typing
                        typingTimer={this.state.typingTimer}
                        messageSender={this.state.messageSender}
                      />
                  </div>
                </div>
                <input
                  value={ this.state.currentChatMessage }
                  onChange={(e) => this.updateCurrentChatMessage(e) }
                  type='text'
                  placeholder='Enter your message...'
                  className='chat-input'
                  style={{ width: '80%' }}
                />
                <button
                className='send'
                onClick={(e) => this.handleSendEvent(e)}
                >
                  Send
                  </button>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignContent: 'center', margin: 'auto', padding: '10px'}}>
                  <div style={{ height: '10px', width: '10px', backgroundColor: this.state.webSocketConnected ? '#39ff14' : '#ed2939', borderRadius: '50%', padding: '5px', margin: '5px'}}></div>
                  <button
                  className='disconnect'
                  onClick={(e) => this.handleDisconnectEvent(e)}
                  >
                  Disconnect
                  </button>
                  <button
                  className='connect'
                  onClick={(e) => this.handleConnectEvent(e)}
                  >
                  Connect
                  </button>
                </div>
              </div>
      </div>
    );
  }

  renderEachAgreementToCreate() {
    // <div value={'important_points_explanation_jp'} onClick={this.handleDocumentCreateClick} className="booking-confirmation-document-create-link">{Documents[eachDocumentKey][this.props.appLanguageCode]}</div>
    return _.map(Object.keys(Documents), (eachDocumentKey, i) => {
      console.log('in booking confirmation, renderEachAgreementToCreate, eachDocumentKey, this.props.appLanguageCode:', eachDocumentKey, this.props.appLanguageCode);
      return (
        <div
          key={i}
          value={eachDocumentKey}
          onClick={this.handleDocumentCreateClick}
          className="booking-confirmation-document-create-link"
        >
          {Documents[eachDocumentKey][this.props.appLanguageCode]}
        </div>
      );
    });
  }

  renderEachAgreementSaved() {
    // return <a key={i} target="_blank" rel="noopener noreferrer" href={`http://res.cloudinary.com/chikarao/image/upload/${eachAgreement.document_publicid}.pdf`}>Link</a>
    return _.map(this.props.booking.agreements, (eachAgreement, i) => {
      // return <div key={i} value={eachAgreement.document_code} name={eachAgreement.id} onClick={this.handleSavedDocumentShowClick} className="booking-confirmation-document-create-link">{Documents[eachAgreement.document_code][this.props.appLanguageCode]}</div>
      return <div
        key={i}
        value={eachAgreement.document_code}
        name={eachAgreement.id}
        onClick={eachAgreement.document_code == globalConstants.ownUploadedDocumentKey ? this.handleOwnDocumentShowClick : this.handleSavedDocumentShowClick}
        className="booking-confirmation-document-create-link"
      >
        {eachAgreement.document_name} &nbsp;
        {eachAgreement.document_publicid ? <i className="far fa-file-pdf" style={{ color: 'black' }}></i> : ''}&nbsp;
        {eachAgreement.sent_to_tenant ? <i className="far fa-envelope" aria-hidden="true" style={{ color: 'black' }}></i> : ''}
        {eachAgreement.sent_to_tenant ? <span style={{ fontSize: '10px' }}>✅</span> : ''}&nbsp;
        {eachAgreement.tenant_signed ? <i className="fas fa-stamp" aria-hidden="true" style={{ color: 'gray' }}></i> : ''}
        {eachAgreement.tenant_signed ? <span style={{ fontSize: '10px' }}>✅</span> : ''}
      </div>
    });
  }

  handleDocumentLanguageSelect(event) {
    const clickedElement = event.target;
    // const elementVal = clickedElement.getAttribute('value');
    console.log('in booking confirmation, handleDocumentLanguageSelect, clickedElement, clickedElement.value:', clickedElement, clickedElement.value);
    // this.props.setDocumentLanguageCode(elementVal);
    this.props.setDocumentLanguageCode(clickedElement.value);
  }

  renderDocumentLanguageSelect() {
    return _.map(Object.keys(Languages), (key, i) => {
      if (Languages[key].implemented) {
        return (
          <option
            key={i}
            value={key}
            className="booking-confirmation-document-create-link"
          >
            {Languages[key].flag} {Languages[key].name}
          </option>
        );
      }
    });
  }

  handleDocumentUploadClick() {
    this.setState({ uploadOwnDocument: true }, () => {
      console.log('in booking confirmation, handleDocumentUploadClick, this.state.uploadOwnDocument:', this.state.uploadOwnDocument);
      this.props.showDocumentInsertCreateModal();
    });
  }

  renderBookingDocuments() {
    const { appLanguageCode } = this.props;
    // {this.renderEachAgreementToCreate()}

    if (this.props.booking) {
      return (
        <div className="booking-confirmation-each-box">
          <div className="booking-request-box-title">{AppLanguages.rentalDocuments[appLanguageCode]}</div>

            <div className="booking-request-box-each-line">
              <div className="booking-request-box-each-line-title">
                {AppLanguages.templates[appLanguageCode]}:
              </div>
              <div className="booking-request-box-each-line-data">
              </div>
            </div>
            <br/>
            <div className="booking-confirmation-document-box">
              <div className="btn booking-request-upload-document-link" onClick={this.handleDocumentUploadClick}>{AppLanguages.uploadTemplate[appLanguageCode]}</div>
            </div>
            <div className="booking-confirmation-document-box">
            </div>

            <div className="booking-request-box-each-line">
              <div className="booking-request-box-each-line-title">
                {AppLanguages.createDocuments[appLanguageCode]}:
              </div>
              <div className="booking-request-box-each-line-data">
              </div>
            </div>
            <br/>
            <div className="booking-confirmation-document-box">
              <select
                type="string"
                className="booking-request-box-document-language-select"
                value={this.props.documentLanguageCode}
                onChange={this.handleDocumentLanguageSelect}
              >
               {this.renderDocumentLanguageSelect()}
              </select>
            </div>
            <div className="booking-confirmation-document-box">
              {this.renderEachAgreementToCreate()}
            </div>

            <div className="booking-request-box-each-line">
              <div className="booking-request-box-each-line-title">
                {AppLanguages.savedDocuments[appLanguageCode]}:
              </div>
              <div className="booking-request-box-each-line-data">
              </div>
            </div>
            <br/>
            <div className="booking-confirmation-document-box">
              <div className="btn booking-request-upload-document-link" onClick={this.handleDocumentUploadClick}>{AppLanguages.uploadDocument[appLanguageCode]}</div>
            </div>
            <div className="booking-confirmation-document-box">
              {this.props.booking.agreements ? this.renderEachAgreementSaved() : 'No documents on file'}
            </div>
        </div>
      );
    }
  }

  handleBookingRequsetApprovalClick(event) {
    const { appLanguageCode } = this.props;
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    if (!this.props.booking.approved) {
      if (window.confirm(AppLanguages.approveBooking[appLanguageCode])) {
        this.props.editBooking({ id: elementVal, approved: true }, () => {});
      }
    } else {
      if (window.confirm(AppLanguages.cancelApprovalBooking[appLanguageCode])) {
        this.props.editBooking({ id: elementVal, approved: false }, () => {});
      }
    }
  }

  handlePrepareEmailClick() {
    console.log('in booking confirmation, handlePrepareEmailClick:');
    this.setState({ showDocumentEmailCreateModal: true });
  }

  handleDocumentsSignedClick(event) {
    const clickedElement = event.target;
    // elementVal is booking.id
    const elementVal = clickedElement.getAttribute('value');
    console.log('in booking confirmation, handleDocumentsSignedClick, elementVal:', elementVal);
    this.setState({ showDocumentEmailCreateModal: true, signedDocumentsModal: true });
  }

  renderFinalBookingTermsForm() {
    return (
      <SetFinalBookingTermsFrom />
    );
  }

  renderBookingApprovalLine() {
    const { appLanguageCode } = this.props;
    return (
      <div className="booking-request-box-each-line booking-request-each-line-with-buttons">
        <div className="booking-request-box-each-line-title">
          {AppLanguages.approveBookingRequest[appLanguageCode]}
        </div>
        <div className="booking-request-box-each-line-data">
          {this.props.booking.approved ? <div className="booking-confirmation-unapprove-request-link" value={this.props.booking.id} onClick={this.handleBookingRequsetApprovalClick}>{AppLanguages.approved[appLanguageCode]} ✅</div>
          :
          <div value={this.props.booking.id} className="btn btn-md booking-confirmation-approve-request-btn" onClick={this.handleBookingRequsetApprovalClick}>{AppLanguages.approve[appLanguageCode]}</div>
         }
        </div>
      </div>
    );
  }

  renderSendDocumentEmailLine() {
    const { appLanguageCode } = this.props;
    const buttonToRender = this.props.thereAreSavedDocuments ?
      <div className="btn btn-md booking-confirmation-approve-request-btn" onClick={this.handlePrepareEmailClick}>{AppLanguages.sendDocuments[this.props.appLanguageCode]}</div>
      :
      <div
        style={{ backgroundColor: 'white', border: '1px solid lightgray', color: 'lightgray', padding: '6px 12px', width: 'max-content', borderRadius: '4px', margin: 'auto' }}
      >
        {AppLanguages.sendDocuments[this.props.appLanguageCode]}
      </div>
      // <div className="btn btn-md booking-confirmation-approve-request-btn" style={{ backgroundColor: 'white', borderColor: 'lightgray', color: 'lightgray' }}>Send Documents</div>;

    return (
      <div className="booking-request-box-each-line booking-request-each-line-with-buttons">
        <div className="booking-request-box-each-line-title">
          {AppLanguages.sendDocumentsEmail[appLanguageCode]}
        </div>
        <div className="booking-request-box-each-line-data">
          {buttonToRender}
        </div>
      </div>
    )
  }

  renderDocumentsSignedLine() {
    const { appLanguageCode, booking } = this.props;
    const buttonToRender = this.props.thereAreSavedDocuments ?
    <div value={booking.id} className="btn btn-md booking-confirmation-approve-request-btn" onClick={this.handleDocumentsSignedClick}>{AppLanguages.documentsSignedButton[this.props.appLanguageCode]}</div>
    :
    <div
    style={{ backgroundColor: 'white', border: '1px solid lightgray', color: 'lightgray', padding: '6px 12px', width: 'max-content', borderRadius: '4px', margin: 'auto' }}
    >
    {AppLanguages.documentsSignedButton[this.props.appLanguageCode]}
    </div>
    // <div className="btn btn-md booking-confirmation-approve-request-btn" style={{ backgroundColor: 'white', borderColor: 'lightgray', color: 'lightgray' }}>Documents Signed</div>;

    return (
      <div className="booking-request-box-each-line booking-request-each-line-with-buttons">
        <div className="booking-request-box-each-line-title">
          {AppLanguages.markDocumentsSigned[appLanguageCode]}
        </div>
        <div className="booking-request-box-each-line-data">
          {buttonToRender}
        </div>
      </div>
    );
  }

  renderImportpointExplantionDoneLine() {
    const { appLanguageCode } = this.props;
    return (
      <div className="booking-request-box-each-line booking-request-each-line-with-buttons">
        <div className="booking-request-box-each-line-title">
          {AppLanguages.importantPointsExplanationDone[appLanguageCode]}
        </div>
        <div className="booking-request-box-each-line-data">
          {this.props.booking.approved ? 'Yes ✅'
          :
          <div value={this.props.booking.id} className="btn btn-md booking-confirmation-approve-request-btn" onClick={this.handleBookingRequsetApprovalClick}>Done</div>
         }
        </div>
      </div>
    );
  }

  renderEachAgreementForTenant() {
    return _.map(this.props.booking.agreements, (eachAgreement, i) => {
      if (eachAgreement.sent_to_tenant) {
        return (
          <div
            key={i}
            className="booking-confirmation-document-create-link"
          >
            <a
              // className="btn document-floating-button"
              target="_blank"
              rel="noopener noreferrer"
              // style={{ backgroundColor: 'lightgray' }}
              href={`http://res.cloudinary.com/chikarao/image/upload/${eachAgreement.document_publicid}.pdf`}
            >
              {eachAgreement.document_name}
            </a>
          </div>
        );
      }
    });
  }

  renderDocumentDownloadLinks() {
    const { appLanguageCode } = this.props;
    return (
      <div style={{ marginTop: '35px' }}>
        <div className="booking-request-box-each-line">
          <div className="booking-request-box-each-line-title">
            {AppLanguages.rentalDocuments[appLanguageCode]}:
          </div>
          <div className="booking-request-box-each-line-data">
          </div>
        </div>
        <br/>
        <div className="booking-confirmation-document-box">
          {this.props.booking.agreements ? this.renderEachAgreementForTenant() : 'No documents sent yet'}
        </div>
      </div>
    )
  }

  findConversation() {
    console.log('in booking confirmation, findConversation, this.props.booking.user:', this.props.booking.user);
    const conversations = this.props.booking.user.conversations;
    let conversation = null;
    _.each(conversations, each => {
      if (each.flat_id === this.props.booking.flat.id) {
        conversation = each;
      }
    });
    return conversation;
  }

  handleCreateConversationClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    // this.props.createConversation({ flat_id: this.props.flat.id }, { body: 'Hello', flat_id: this.props.flat.id, sent_by_user: true }, (messageAttributes) => this.createConversationCallback(messageAttributes));
    this.setState({ showConversationCreate: !this.state.showConversationCreate })
  }

  handleOpenConversationClick() {
    const win = window.open(`/messagingmain/${this.props.auth.id}`, '_blank');
    win.focus();
  }

  renderCreateConversationLink() {
    const { appLanguageCode } = this.props;
    return (
      <div className="booking-confirmation-unapprove-request-link" value={this.props.booking.flat.id} onClick={this.handleCreateConversationClick}>{AppLanguages.sendMessage[appLanguageCode]}</div>
    )
  }

  renderOpenMessagingLink() {
    const { appLanguageCode } = this.props;
    return (
      <div className="booking-confirmation-unapprove-request-link" value={this.props.booking.flat.id} onClick={this.handleOpenConversationClick}>{AppLanguages.openMessaging[appLanguageCode]}</div>
    )
  }

  renderContactCounterpartyLine() {
    const { appLanguageCode } = this.props;
    const conversation = this.findConversation();
    return (
      <div className="booking-request-box-each-line booking-request-each-line-with-buttons">
        <div className="booking-request-box-each-line-title">
          {this.props.userIsOwner ? AppLanguages.contactTenant[appLanguageCode] : AppLanguages.contactLandlord[appLanguageCode]}
        </div>
        <div className="booking-request-box-each-line-data">
          {conversation ? this.renderOpenMessagingLink() : this.renderCreateConversationLink()}
        </div>
      </div>
    );
  }

  handleEndRentalClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    if (window.confirm('End this rental?')) {
      console.log('in booking confirmation, handleEndRentalClick, elementVal:', elementVal);
    }
  }

  renderEndRentalLine() {
    const { appLanguageCode } = this.props;

    const buttonToRender = 1 < 2 ?
    <div
      value={this.props.booking.id}
      className="btn btn-md booking-confirmation-approve-request-btn"
      style={{ backgroundColor: 'gray' }}
      onClick={this.handleEndRentalClick}
    >{AppLanguages.endRental[appLanguageCode]}</div>
      :
    <div
      style={{ backgroundColor: 'white', border: '1px solid lightgray', color: 'lightgray', padding: '6px 12px', width: 'max-content', borderRadius: '4px', margin: 'auto' }}
    >{AppLanguages.undo[appLanguageCode]}</div>

    return (
      <div className="booking-request-box-each-line booking-request-each-line-with-buttons">
        <div className="booking-request-box-each-line-title">
          {AppLanguages.endRentalLine[appLanguageCode]}
        </div>
        <div className="booking-request-box-each-line-data">
          {buttonToRender}
        </div>
      </div>
    );
  }

  renderBookingActions() {
    const { appLanguageCode } = this.props;
    // userIsOwner true means user is one renting out listing
    // renderDocumentDownloadLinks renders documents sent to tenant via email
    return (
      <div className="booking-confirmation-each-box">
        <div className="booking-request-box-title">{AppLanguages.rentalActions[appLanguageCode]}</div>
          {this.renderContactCounterpartyLine()}
          {this.props.userIsOwner ? this.renderBookingApprovalLine() : ''}
          {this.props.userIsOwner ? this.renderSendDocumentEmailLine() : ''}
          {this.props.userIsOwner ? this.renderDocumentsSignedLine() : ''}
          {this.props.userIsOwner ? this.renderEndRentalLine() : ''}
          {this.props.userIsOwner ? this.renderFinalBookingTermsForm() : ''}
          {this.props.userIsOwner ? '' : this.renderImportpointExplantionDoneLine()}
          {this.props.userIsOwner ? '' : this.renderDocumentDownloadLinks()}
      </div>
    );
  }

  findDocumentsStatus(agreements, agreementAttribute) {
    // console.log('in booking confirmation, findIfDocumentsSent, agreements:', agreements);
    let returnedBoolean = false;
    _.each(agreements, eachAgreement => {
      // console.log('in booking confirmation, findIfDocumentsSent, eachAgreement:', eachAgreement);
      if (eachAgreement[agreementAttribute]) {
        returnedBoolean = true;
        return;
      }
    });
    return returnedBoolean;
  }

  renderBookingData() {
    const { booking, appLanguageCode } = this.props;
    // if (booking && !this.state.showDocument) {
    if (booking) {
      // if (booking.flat) {
        // find out if any documents sent to tenant
        const documentsSent = this.findDocumentsStatus(booking.agreements, 'sent_to_tenant');
        const documentsSigned = this.findDocumentsStatus(booking.agreements, 'tenant_signed');
        // }
        // const documentsSent = booking.fetchBookingData ? this.findIfDocumentsSent(booking.fetchBookingData.agreements) : '';
        // const data = this.props.booking.id;
        // localStorage.setItem('data', data);
        // const localData = localStorage.getItem('data');
        // console.log('in booking confirmation, renderBookingData, localstorage data: ', localData);
        // <h4>
        // This is your booking confirmation. <br/><br/>You can manage your bookings in My Page.
        // </h4>

        return (
          <div>
            <h3>
              {AppLanguages.bookingRequestWorkspace[appLanguageCode]}
            </h3>

            <div id="carousel-show" className="booking-confirmation-image">
              {this.props.booking.flat ? this.renderImage(booking.flat.images) : ''}
            </div>

            <div className="booking-confirmation-progress-box">
              <div className="booking-confirmation-progress-box-title">
                  {AppLanguages.rentalProgress[appLanguageCode]}
              </div>
              <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '1.5%' }}>{AppLanguages.reservationRequest[appLanguageCode]}</div>
              <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '31%' }}>{AppLanguages.tenantApproved[appLanguageCode]}</div>
              <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '60.5%' }}>{AppLanguages.documentsSent[appLanguageCode]}</div>
              <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '90%' }}>{AppLanguages.documentsSigned[appLanguageCode]}</div>
              <div className="booking-confirmation-progress-box-contents">
                <div className="booking-confirmation-progress-circle" />
                <div className="booking-confirmation-progress-line" style={booking.approved ? { backgroundColor: 'green' } : { backgroundColor: 'lightgray' }} />
                <div className="booking-confirmation-progress-circle" />
                <div className="booking-confirmation-progress-line" style={documentsSent ? { backgroundColor: 'green' } : { backgroundColor: 'lightgray' }} />
                <div className="booking-confirmation-progress-circle" />
                <div className="booking-confirmation-progress-line" style={documentsSigned ? { backgroundColor: 'green' } : { backgroundColor: 'lightgray' }}/>
                <div className="booking-confirmation-progress-circle" />
              </div>
            </div>

            <div className="booking-confirmation container">
              <div className="booking-confirmation-row">
                {this.renderBookingBasicInformation()}
                {this.renderBookingTenantInformation(booking)}
                {this.props.userIsOwner ? this.renderBookingDocuments() : ''}
                {this.renderBookingActions()}
              </div>
            </div>
          </div>
        );
        // {this.props.userIsOwner ? this.renderBookingTenantInformation(booking) : ''}

      // }
    }
}

formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes}  ${ampm}`;
  return date.getMonth() + 1 + '/' + date.getFullYear()
}

renderStars() {
  const { rating } = this.props.review;
  const totalStars = 5;
  const grayStarsNum = 5 - rating;
  console.log('in booking confirmation, renderStars, grayStarsNum:', grayStarsNum);
  //
  // for (let i = 0; i < rating; i++) {
  // }
  return _.times(totalStars, (i) => {
    if (i < rating) {
      // console.log('in booking confirmation, renderStars, in loop, if: ', i);
      return <i key={i} className="fa fa-star gold-star"></i>;
    } else {
      // console.log('in booking confirmation, renderStars, in loop, else:', i);
      return <i key={i} className="fa fa-star gray-star"></i>
    }
  });
  //
  // if (grayStarsNum >= 0) {
  //   for (let i = 0; i < grayStarsNum; i++) {
  //     return (
  //       <i className="fa fa-star gray-star"></i>
  //     );
  //   }
  // }
}

handleEditReviewClick(event) {
  const clickedElement = event.target;
  const elementVal = clickedElement.getAttribute('value');
  // console.log('in booking confirmation, handleEditReviewClick, elementVal:', elementVal);
  // this.props.updateReview(elementVal);
  this.props.showEditReview();
}

renderReviewEditModal() {
  // console.log('in booking confirmation, renderReviewEditModal, this.props.showEditReview:', this.props.showEditReviewModal);
  return (
    <div>
    <ReviewEditModal
      show={this.props.showEditReviewModal}
      review={this.props.review}
    />
    </div>
  );
}

// renderCreateReviewForm() {
//   return (
//       <div className="review-container">
//         <h4>Write a Review</h4>
//       </div>
//   );
// }

renderReview() {
  const { review } = this.props;

  const reviewEmpty = _.isEmpty(review);
  if (!reviewEmpty) {
    console.log('in booking confirmation, renderReview, this.props.review:', review.user.profile.image);
    const date = new Date(review.created_at)
    return (
      <div className="review-container">
      <h4>Your Review</h4>
        <div className="review-details">
              <div className="review-top-box">
                <div className="review-user-box">
                  <div className="review-avatar">
                    <img src={review.user.image ?
                      'http://res.cloudinary.com/chikarao/image/upload/w_50,h_50/' + review.user.image + '.jpg'
                      :
                      'http://res.cloudinary.com/chikarao/image/upload/w_50,h_50/' + 'blank_profile_picture_4' + '.jpg'
                    }
                    alt=""
                      />
                  </div>
                  <div className="review-username">
                    {review.user.profile.username}
                  </div>
                </div>
                <div className="review-title">
                  {review.title}
                </div>
              </div>

              <div className="review-comment-box">
                <p className="review-comment-text">
                  {review.comment}
                </p>
              </div>
              <div className="review-bottom-box">
                <div className="review-bottom-details">
                posted: {this.formatDate(date)}
                </div>
                <div className="review-bottom-details">
                 <div className="review-star-box">
                  {this.renderStars()}
                </div>
                </div>
                <div value={review.id} className="review-bottom-details-edit" onClick={this.handleEditReviewClick}>
                  Edit
                </div>

              </div>
        </div>
      </div>
    );
  } else {
    if(this.props.booking) {
      const today = new Date()
      // console.log('in booking confirmation, renderReview, this.props.booking.date_end:', this.props.booking.date_end);
      const bookingEnd = new Date(this.props.booking.date_end)
      const pastBookingEnd = bookingEnd < today;
      if (pastBookingEnd) {
        return (
          <div>
            <ReviewCreateFrom
              booking={this.props.booking}
            />
          </div>
        );
      }
    }
    // if(this.props.booking) {
    // }
  }
}

handleUploadedPdfClick(event) {
  const clickedElement = event.target;
  const elementVal = clickedElement.getAttribute('value');
  const elementName = clickedElement.getAttribute('name');
  console.log('in booking confirmation, handleUploadedPdfClick, elementVal:', elementVal);
  console.log('in booking confirmation, handleUploadedPdfClick, elementName:', elementName);
  this.props.showDocumentInsertEditModal();
  this.props.selectedDocumentInsertId(elementVal);
  this.props.selectedAgreementId(elementName);
  this.setState({ documentInsertId: elementVal, agreementId: elementName });
}

handleInsertFieldAddClick(event) {
  this.props.showInsertFieldCreateModal();
  const clickedElement = event.target;
  const elementVal = clickedElement.getAttribute('value');
  const elementName = clickedElement.getAttribute('name');
  this.props.selectedDocumentInsertId(elementVal);
  this.props.selectedAgreementId(elementName);
  this.setState({ documentInsertId: elementVal, agreementId: elementName });
}

getInsertFieldChoice(field) {
  let choice = {};
  _.each(InsertField.name.choices, eachChoice => {
    if (field.name == eachChoice.value) {
      choice = eachChoice;
      return;
    }
  });
  return choice;
}

handleEachInsertFieldClick(event) {
  const clickedElement = event.target;
  const elementVal = clickedElement.getAttribute('value');
  const elementName = clickedElement.getAttribute('Name');
  console.log('in booking confirmation, handleEachInsertFieldClick, clickedElement:', clickedElement);
  // this.props.selectedDocumentInsertId(elementVal);
  // this.props.selectedAgreementId(elementName);
  this.props.selectedInsertFieldId(elementVal);
  this.props.selectedAgreementId(this.state.agreementId);
  this.props.selectedDocumentInsertId(elementName);
  this.props.showInsertFieldEditModal();

  this.setState({
    // documentInsertId: elementVal,
    insertFieldId: elementVal,
    // agreementId: elementName
    documentInsertId: elementName
  });
}

renderEachInsertFieldLanguage(fieldKeyArray) {
  // console.log('in booking confirmation, renderEachInsertFieldLanguage, fieldKeyArray:', fieldKeyArray);
  return _.map(fieldKeyArray, (eachField, i) => {
    return (
      <div key={i}>{Languages[eachField.language_code].flag}</div>
    );
  });
}

renderEachInsertField(eachInsert) {
  // insertFieldObject is a global variable
  insertFieldObject = {};
  _.each(eachInsert.insert_fields, eachField => {
    if (!insertFieldObject[eachField.name]) {
      insertFieldObject[eachField.name] = [];
      insertFieldObject[eachField.name].push(eachField);
    } else {
      insertFieldObject[eachField.name].push(eachField);
    }
  });
  // console.log('in booking confirmation, renderEachInsertField, insertFieldObject:', insertFieldObject);

  return _.map(Object.keys(insertFieldObject), eachFieldKey => {
    console.log('in booking confirmation, renderEachInsertField, insertFieldObject[eachFieldKey]:', insertFieldObject[eachFieldKey]);
    const choice = this.getInsertFieldChoice(insertFieldObject[eachFieldKey][0]);
    return (
      <div key={insertFieldObject[eachFieldKey][0].id} className="document-insert-box-documents-each-box-fields-each">
        <div value={insertFieldObject[eachFieldKey][0].id} name={insertFieldObject[eachFieldKey][0].document_insert_id} onClick={this.handleEachInsertFieldClick} className="document-insert-box-documents-each-box-fields-each-field">
            {choice[this.props.appLanguageCode]}
        </div>
        <div className="document-insert-box-documents-each-box-fields-each-language">
          {this.renderEachInsertFieldLanguage(insertFieldObject[eachFieldKey])}
        </div>
      </div>
    );
  });
  // return _.map(eachInsert.insert_fields, eachField => {
  //   const choice = this.getInsertFieldChoice(eachField);
  //   return (
  //     <div key={eachField.id} className="document-insert-box-documents-each-box-fields-each">{choice[this.props.appLanguageCode]}</div>
  //   );
  // });
}

renderEachUploadedPdf() {
  return _.map(this.props.documentInserts, eachInsert => {
    console.log('in booking confirmation, renderEachUploadedPdf, eachInsert:', eachInsert);
    return (
      <div key={eachInsert.id} className="document-insert-box-documents-each-box-container">
        <div className="document-insert-box-documents-each-box">
          <div value={eachInsert.id} name={eachInsert.agreement_id} className="document-insert-box-documents-each" onClick={this.handleUploadedPdfClick}>
          <i className="far fa-file"></i>&nbsp;{eachInsert.insert_name}
          </div>
          &nbsp;&nbsp;&nbsp;
          {eachInsert.main_agreement ? <div value={eachInsert.id} name={eachInsert.agreement_id} className="document-insert-create-field-button" onClick={this.handleInsertFieldAddClick}>{AppLanguages.insertField[this.props.appLanguageCode]}</div> : ''}
        </div>
        <div className="document-insert-box-documents-each-box-fields">
          {this.renderEachInsertField(eachInsert)}
        </div>
      </div>
    );
  });
}

handleUploadPdfLink() {
  this.props.showDocumentInsertCreateModal();
}

renderInsertBox() {
  // let pdfHasDocumentInsert = false;
  const maxNumDocuments = 0
  // if (this.props.documentInserts) {
  const pdfHasDocumentInsert = this.props.documentInserts ? (this.props.documentInserts.length > maxNumDocuments) : false;
  // }
  // {AppLanguages.insertDocuments[this.props.appLanguageCode]}
  return (
    <div className="document-insert-box">
      <div className="document-insert-box-title">
        {AppLanguages.insertOwnAgreement[this.props.appLanguageCode]}
      </div>
      {pdfHasDocumentInsert ?
        ''
        :
        <div className="document-insert-box-upload-link" onClick={this.handleUploadPdfLink}>
          <i className="fas fa-cloud-upload-alt"></i>&nbsp;{AppLanguages.uploadPdf[this.props.appLanguageCode]}
        </div>
      }
      <div className="document-insert-box-documents">
        {this.renderEachUploadedPdf()}
      </div>
    </div>
  );
}

renderDocument() {
  if (this.props.booking) {
    // if (this.props.booking.agreements || this.props.documentInserts) {
      // get agreement chosen by user. Returns array so get first index position below
      const agreementArray = this.props.booking.agreements.filter(agreement => agreement.id == this.state.agreementId)
      // console.log('in booking confirmation, renderDocument, this.state.showSavedDocument, this.state.agreementId, agreementArray[0]:', this.state.showSavedDocument, this.state.agreementId, agreementArray[0]);
      let showDocumentInsertBox = false;
      if (agreementArray.length > 0) {
        if (agreementArray[0].document_code) {
          showDocumentInsertBox = Documents[agreementArray[0].document_code].allowDocumentInserts && this.state.showSavedDocument;
        }
        // console.log('in booking confirmation, renderDocument, showDocumentInsertBox:', showDocumentInsertBox);
        // console.log('in booking confirmation, renderDocument, Documents[agreementArray[0].document_code].allowDocumentInserts:', Documents[agreementArray[0].document_code].allowDocumentInserts);
        // console.log('in booking confirmation, renderDocument, this.state.showSavedDocument:', this.state.showSavedDocument);
      }

      return (
        <div className="booking-confirmation-render-document-box">
          {showDocumentInsertBox ? this.renderInsertBox() : ''}
          <CreateEditDocument
            showDocument={() => this.setState({ showDocument: !this.state.showDocument })}
            closeSavedDocument={() => this.setState({ showDocument: !this.state.showDocument, showSavedDocument: !this.state.showSavedDocument })}
            goToSavedDocument={() => this.setState({ showSavedDocument: !this.state.showSavedDocument, showDocument: !this.state.showDocument }, () => {
              this.setState({ showDocument: !this.state.showDocument }, () => {
                // console.log('in booking confirmation, renderDocument, second this.state.showSavedDocument, this.state.showDocument:', this.state.showSavedDocument, this.state.showDocument);
              });
            })}
            showDocumentInsertEditProp={() => {
              this.setState({ uploadOwnDocument: true }, () => {
                this.props.showDocumentInsertEditModal();
              });
            }}
            setAgreementId={(id) => this.setState({ agreementId: id })}
            showSavedDocument={this.state.showSavedDocument}
            agreementId={this.state.agreementId}
            agreement={agreementArray[0]}
            showDocumentInsertBox={showDocumentInsertBox}
            showOwnUploadedDocument={this.state.showOwnUploadedDocument}
          />
        </div>
      );
    // }
  }
}

setConditionsForCreateDocuments(elementVal) {
  if (!this.state.showDocument) {
    this.props.setCreateDocumentKey(elementVal, () => {
      this.setState({ showDocument: true, showSavedDocument: false, agreementId: '' });
    });
  } else {
    // if showDocument is true (currently showing document),
    // close document first then show new document
    this.setState({ showDocument: false, agreementId: '', showSavedDocument: false }, () => {
      this.props.setCreateDocumentKey(elementVal, () => {
        this.setState({ showDocument: true });
      });
    });
  }
}

handleDocumentCreateClick(event) {
  const clickedElement = event.target;
  // elementval is document key
  const elementVal = clickedElement.getAttribute('value');
  // console.log('in booking confirmation, handleDocumentCreateClick, this.state:', this.state);
  // console.log('in booking confirmation, handleDocumentCreateClick, elementVal:', elementVal);
  // if document is has tranlation feature
  //and the base language of the document is same as user chosen document language,
  // give alert to select another language
  if (Documents[elementVal].translation && Documents[elementVal].baseLanguage === this.props.documentLanguageCode) {
    const language = Languages[Documents[elementVal].baseLanguage].name;
    window.alert(`Please select a language above other than ${language.charAt(0).toUpperCase() + language.slice(1)}, as the translation language.`)
  } else if (!Documents[elementVal].translation && Documents[elementVal].baseLanguage !== this.props.documentLanguageCode) {
    const language = Languages[Documents[elementVal].baseLanguage].name;
    window.alert(`Please select above ${language.charAt(0).toUpperCase() + language.slice(1)} as the document language, since the document is in that language.`)
  } else {
    // if language selection is correct and
    // if showDocument is false, just create document key with the document code
    if (this.state.showOwnUploadedDocument && (elementVal !== globalConstants.ownUploadedDocumentKey)) {
      this.setState({ showOwnUploadedDocument: false }, () => {
        this.setConditionsForCreateDocuments(elementVal);
      });
    } else {
      this.setConditionsForCreateDocuments(elementVal);
    }
  }
}

setConditionsForSavedDocuments(elementVal, elementName) {
  if (!this.state.showDocument) {
      this.props.setCreateDocumentKey(elementVal, () => {
        this.setState({ showDocument: true, agreementId: parseInt(elementName, 10), showSavedDocument: true });
      });
  } else {
    // if showDocument is true (currently showing document),
    // close document first then show new document, turn off and null out other state attributes
    this.setState({ showDocument: false, agreementId: '', showSavedDocument: false }, () => {
      this.props.setCreateDocumentKey(elementVal, () => {
        this.setState({ showDocument: true, agreementId: parseInt(elementName, 10), showSavedDocument: true });
        // this.setState({ showDocument: true });
      });
    });
  }
}

handleSavedDocumentShowClick(event) {
  const clickedElement = event.target;
  // elementVal is documentCode or document key in documents.js
  const elementVal = clickedElement.getAttribute('value');
  // elementName is agreement id
  const elementName = clickedElement.getAttribute('name');

  if (this.state.showOwnUploadedDocument && (elementVal != globalConstants.ownUploadedDocumentKey)) {
    this.setState({ showOwnUploadedDocument: false }, () => {
      this.setConditionsForSavedDocuments(elementVal, elementName);
    });
  } else {
    this.setConditionsForSavedDocuments(elementVal, elementName);
    // if (!this.state.showDocument) {
    //     this.props.setCreateDocumentKey(elementVal, () => {
    //       this.setState({ showDocument: true, agreementId: parseInt(elementName, 10), showSavedDocument: true });
    //     });
    // } else {
    //   // if showDocument is true (currently showing document),
    //   // close document first then show new document, turn off and null out other state attributes
    //   this.setState({ showDocument: false, agreementId: '', showSavedDocument: false }, () => {
    //     this.props.setCreateDocumentKey(elementVal, () => {
    //       this.setState({ showDocument: true, agreementId: parseInt(elementName, 10), showSavedDocument: true });
    //       // this.setState({ showDocument: true });
    //     });
    //   });
    // }
  }
}

handleOwnDocumentShowClick(event) {
  const clickedElement = event.target;
  // elementVal is documentCode or document key in documents.js
  const elementVal = clickedElement.getAttribute('value');
  // elementName is agreement id
  const elementName = clickedElement.getAttribute('name');
  this.setState({ showDocument: false, agreementId: '', showSavedDocument: false }, () => {
    this.props.setCreateDocumentKey(globalConstants.ownUploadedDocumentKey, () => {
      this.setState({ showDocument: true, agreementId: parseInt(elementName, 10), showSavedDocument: true, showOwnUploadedDocument: true });
      this.props.selectedAgreementId(elementName);
      // this.setState({ showDocument: true });
    });
  });
}

// renderDocumentChoices() {
//   return (
//     <div className="booking-confirmation-create-document-box">
//       <h4>Create Document</h4>
//       <div onClick={this.handleDocumentCreateClick} className="booking-confirmation-document-create-link">Teishaku</div>
//     </div>
//   );
// }

// renderBookingRequest() {
//   return (
//     <div className="container booking-request-container">
//       <h3>{AppLanguages.bookingRequest[this.props.appLanguageCode]}</h3>
//       <div className="row booking-request-row">
//         <div className="booking-request-each-box">{this.renderBookingInfo()}</div>
//         <div className="booking-request-each-box">{this.renderBookingPaymentDetails()}</div>
//         <div className="booking-request-each-box">{this.renderFacilities()}</div>
//         <div className="booking-request-each-box-personal">{this.renderUpdatePersonalDetails()}</div>
//       </div>
//     </div>
//   );
// }

renderDocumentInsertCreateForm() {
  // console.log('in booking confirmation, renderDocumentInsertCreateForm: ');
  return (
    <DocumentInsertCreateModal
      show={this.props.showDocumentInsertCreate}
      agreementId={this.state.agreementId}
      uploadOwnDocument={this.state.uploadOwnDocument}
    />
  );
}

renderDocumentInsertEditForm() {
  // console.log('in booking confirmation, renderDocumentInsertEditForm: ');
  return (
    <DocumentInsertEditModal
      show={this.props.showDocumentInsertEdit}
      agreementId={this.state.agreementId}
      documentInsertId={this.state.documentInsertId}
      uploadOwnDocument={this.state.uploadOwnDocument}
    />
  );
}

renderInsertFieldCreateForm() {
  return (
    <InsertFieldCreateModal
      show={this.props.showInsertFieldCreate}
      agreementId={this.state.agreementId}
      documentInsertId={this.state.documentInsertId}
      insertFieldObject={insertFieldObject}
    />
  );
}

renderInsertFieldEditForm() {
  return (
    <InsertFieldEditModal
      show={this.props.showInsertFieldEdit}
      // show
      agreementId={this.state.agreementId}
      // documentInsertId={this.state.documentInsertId}
      insertFieldId={this.state.insertFieldId}
      documentInsertId={this.state.documentInsertId}
    />
  );
}

renderDocumentEmailCreateForm() {
  console.log('in booking confirmation, renderDocumentEmailCreateForm: ');
  return (
    <DocumentEmailCreateModal
      show={this.state.showDocumentEmailCreateModal}
      handleClose={() => this.setState({ showDocumentEmailCreateModal: !this.state.showDocumentEmailCreateModal })}
      signedDocumentsModal={this.state.signedDocumentsModal}
      turnOffSignedDocuments={() => this.setState({ signedDocumentsModal: false })}
      // show
      // agreementId={this.state.agreementId}
      // // documentInsertId={this.state.documentInsertId}
      // insertFieldId={this.state.insertFieldId}
      // documentInsertId={this.state.documentInsertId}
    />
  );
}

renderConversationCreateForm() {
  return (
    <ConversationCreateModal
     show={this.state.showConversationCreate}
     handleClose={() => this.setState({ showConversationCreate: !this.state.showConversationCreate })}
     flatId={this.props.booking.flat.id}
     sentByUser={!this.props.userIsOwner}
     userId={this.props.booking.user_id}
     bookingId={this.props.booking.id}
    />
  );
}

render() {
  return (
    // {this.renderReview()}
    <div>
      {this.renderReviewEditModal()}
      {this.renderBookingData()}
      {this.state.showDocument ? this.renderDocument() : ''}

      {this.props.showDocumentInsertCreate ? this.renderDocumentInsertCreateForm() : ''}
      {this.props.showDocumentInsertEdit ? this.renderDocumentInsertEditForm() : ''}
      {this.props.showInsertFieldCreate ? this.renderInsertFieldCreateForm() : ''}
      {this.props.showInsertFieldEdit ? this.renderInsertFieldEditForm() : ''}
      {this.state.showDocumentEmailCreateModal ? this.renderDocumentEmailCreateForm() : ''}
      {this.state.showConversationCreate ? this.renderConversationCreateForm() : ''}
    </div>
   );
  }
}

function mapStateToProps(state) {
  console.log('in booking confirmation, mapStateToProps, state: ', state);
  if (state.bookingData.fetchBookingData) {
    // distinguish current user between tenant and owner; !userIsOwner is tenant
    const userIsOwner = state.bookingData.user.id !== state.bookingData.fetchBookingData.user.id;
    const currency = '¥';
    const thereAreSavedDocuments = state.bookingData.fetchBookingData.agreements;
    // console.log('in booking confirmation, mapStateToProps, userIsOwner: ', userIsOwner);
    return {
      auth: state.auth,
      booking: state.bookingData.fetchBookingData,
      review: state.reviews.reviewForBookingByUser,
      showEditReviewModal: state.modals.showEditReview,
      appLanguageCode: state.languages.appLanguageCode,
      documentLanguageCode: state.languages.documentLanguageCode,
      showDocumentInsertCreate: state.modals.showDocumentInsertCreateModal,
      showDocumentInsertEdit: state.modals.showDocumentInsertEditModal,
      showInsertFieldCreate: state.modals.showInsertFieldCreateModal,
      showInsertFieldEdit: state.modals.showInsertFieldEditModal,
      documentInserts: state.bookingData.documentInsertsAll,
      userIsOwner,
      currency,
      thereAreSavedDocuments
      // agreements: state.fetchBookingData.agreements
      // flat: state.flat.selectedFlat
    };
  } else {
    return {};
  }
}

export default connect(mapStateToProps, actions)(BookingConfirmation);
