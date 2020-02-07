import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';
import _ from 'lodash';

import { reduxForm, Field } from 'redux-form';
// import DocumentForm from './constants/document_form';

import DocumentChoices from './forms/document_choices';

import CreateEditDocument from './forms/create_edit_document'


// import { Elements, StripeProvider } from 'react-stripe-elements';

// import Upload from './images/upload_test';
// import SigninModal from './auth/signin_modal';
// import SignupModal from './auth/signup_modal';
import * as actions from '../actions';
import citiesList from './constants/cities_list';
import CitySearch from './search/city_search';
import AppLanguages from './constants/app_languages';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: window.innerWidth,
    };
    this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    // this.facebookLogin()
    // clear out all this.props.flats state attributes
    this.props.clearFlats();
    // this.props.getGoogleMapBoundsKeys();
  }

  componentDidUpdate() {
    const banner = document.getElementById('banner');
    // console.log('in landing, componentDidUpdate', banner);
    banner.focus();
  }

  componentWillUnmount() {
    // Clean up of addEventListener so that don't get setState in an unmounted component error
    window.removeEventListener('resize', this.handleResize);
  }

  printMousePos(event) {
    // layerX is deprecated, so don't use
    console.log('in landing, printMousePos', event);
    console.log('in landing, printMousePos, event.layerX / 792', event.layerX / 792);
    console.log('in landing, printMousePos, event.layerY / 1122', event.layerY / 1122);
    // document.body.textContent =
    //   'clientX: ' + event.clientX +
    //   ' - clientY: ' + event.clientY;
  }
  // arrow function to keep context of this.state

  // facebookLogin() {
  //   console.log('in Landing, facebookLogin, in subscribe, this  ', this);
  //   // if (FB) {
  //     window.fbAsyncInit = function () {
  //       FB.init({
  //         appId            : '2249093511770692',
  //         autoLogAppEvents : true,
  //         xfbml            : true,
  //         version          : 'v3.1'
  //       });
  //
  //       FB.Event.subscribe('auth.statusChange', (response) => {
  //         console.log('in Landing, facebookLogin, in subscribe, response  ', response);
  //         if (response.authResponse) {
  //           this.updateLoggedInState(response)
  //         } else {
  //           this.udpateLoggedInState()
  //         }
  //       });
  //     }.bind(this);
  //     // .bind(this);
  //     // for some reason need this again...
  //     (function(d, s, id) {
  //       var js, fjs = d.getElementsByTagName(s)[0];
  //       console.log('in Landing, facebookLogin, in lower function');
  //       if (d.getElementById(id)) {return;}
  //       js = d.createElement(s); js.id = id;
  //       js.src = "https://connect.facebook.net/en_US/sdk.js";
  //       fjs.parentNode.insertBefore(js, fjs);
  //     }(document, 'script', 'facebook-jssdk'));
  //   // }
  // }

  // updateLoggedInState(response) {
  //   console.log('in Landing, updateLoggedInState', response);
  //   // console.log('in SigninModal, updateLoggedInState', response);
  // }


  // facebookLogin() {
  //   window.fbAsyncInit = function () {
  //     FB.init({
  //       appId            : '2249093511770692  ',
  //       autoLogAppEvents : true,
  //       xfbml            : true,
  //       version          : 'v3.1'
  //     });
  //
  //     FB.Event.subscribe('auth.statusChange', (response) => {
  //       if (response.authResponse) {
  //         this.updateLoggedInState(response)
  //       } else {
  //         this.udpateLoggedInState()
  //       }
  //     });
  // }.bind(this);
  // // for some reason need this again...
  //   (function(d, s, id) {
  //      var js, fjs = d.getElementsByTagName(s)[0];
  //      if (d.getElementById(id)) {return;}
  //      js = d.createElement(s); js.id = id;
  //      js.src = "https://connect.facebook.net/en_US/sdk.js";
  //      fjs.parentNode.insertBefore(js, fjs);
  //    }(document, 'script', 'facebook-jssdk'));
  // }
  //
  // updateLoggedInState(response) {
  //   console.log('in landing, updateLoggedInState', response);
  //
  // }

  //
  // facebook() {
  //   console.log('in landing, facebook FB: ', FB);
  //
  // }

  handleResize() {
    // console.log('in landing, createBackghandleResizeroundImage: ', this.state.windowWidth);
    this.setState({ windowWidth: window.innerWidth }, () => {
      // console.log('in landing, handleResize, this.state.windowWidth: ', this.state.windowWidth);
    });
  }

  createBackgroundImage(image) {
    // console.log('in landing, createBackgroundImage, image: ', image);
    // console.log('in landing, createBackgroundImage, this.state.windowWidth: ', this.state.windowWidth);
    const width = 1000;
    const t = new cloudinary.Transformation();
    t.angle(0).crop('scale').width(width).aspectRatio('1.5');
    return cloudinaryCore.url(image, t);
  }

  renderBanner() {
    // <h1>Flats, flats & more flats</h1>
    // console.log('in landing, renderBanner, this.state.windowWidth: ', this.state.windowWidth);
    // <div className="banner-search-datalist-div">
    // </div>
    // <datalist className="banner-datalist" id="areas">
    // {this.state.searchInputHasValue ? this.renderDataListOptions() : ''}
    // </ datalist>
    return (
      <div id="banner" style={{ background: `url(${this.createBackgroundImage('apartmentpj-constant-assets/banner_image_1')}` }}>
        <div className="banner-content">
          <div className="banner-search-box">
            <CitySearch
              landingPage
            />
          </div>
          <p> {AppLanguages.bannerMessage[this.props.appLanguageCode]}</p>
        </div>
      </div>
    );
  }

  renderFooter() {
    return (
      <footer className="landing-footer">
        <div className="footer-left-box">© 2018 CO & Company and its affiliates</div>
      </footer>
    );
  }

  formatIcalDate(date) {
    const startYear = date.substr(0, 4);
    const startMonth = parseInt(date.substr(4, 2), 10) - 1;
    const startDay = date.substr(6, 2);
    // bookings.date_start = dateStart[1];
    const startDate = new Date(startYear, startMonth, startDay);
    return startDate;
  }

  readIcal() {
    // read in ics file fetched from calendar.google.com
    // returns array of objects with date_start and date_end
    if (this.props.fetchedIcal) {
      const { fetchedIcal } = this.props;
      // split file into lines
      const lines = fetchedIcal.split('\n');
      // booking object define
      const bookingsArray = [];
      let bookings;
      //
      // let bookingCount = 0;
      _.each(lines, (line) => {
        // console.log('in landing, readIcal, line: ', line);
        // if (line.includes('DTSTART')) {
        if (line.indexOf('DTSTART') !== -1) {
          bookings = {};
          // if there is DTSTART in a line
          const dateStart = line.split(':');

          // const startYear = dateStart[1].substr(0, 4);
          // const startMonth = parseInt(dateStart[1].substr(4, 2), 10);
          // const startDay = dateStart[1].substr(6, 2);
          // // bookings.date_start = dateStart[1];
          // const startDate = new Date(startYear, startMonth, startDay);
          bookings.date_start = this.formatIcalDate(dateStart[1]);
          // console.log('in landing, readIcal, dateStart: ', dateStart);
          // console.log('in landing, readIcal, startYear: ', startYear);
          // console.log('in landing, readIcal, startMonth: ', startMonth);
          // console.log('in landing, readIcal, startDay: ', startDay);
          // consolstartog('in landing, readIcal, dateStart bookings: ', bookings);
        }
        if (line.indexOf('DTEND') !== -1) {
        // if (line.includes('DTEND')) {
          const dateEnd = line.split(':');
          // bookings[bookingCount].date_end = dateEnd[1];
          bookings.date_end = this.formatIcalDate(dateEnd[1]);
          // bookings.date_end = dateEnd[1];
          // console.log('in landing, readIcal, dateEnd: ', dateEnd);
          // console.log('in landing, readIcal, dateEnd bookings: ', bookings);
          bookingsArray.push(bookings);
          // bookingCount++;
        }
      });
      console.log('in landing, readIcal, bookingsArray: ', bookingsArray);
      return bookingsArray;
    }
  }

  createBackgroundImageForDocs(image) {
    // console.log('in main_cards, createBackgroundImage, image: ', image);
    const width = 792;
    // const height = 1122;
    const t = new cloudinary.Transformation();
    // t.angle(0).crop('scale').width(width).aspectRatio('1.41442715');
    // t.crop('scale').width(width).aspectRatio('0.7070');
    t.crop('scale').width(width).aspectRatio('0.70582352941176');
    return cloudinaryCore.url(image, t);
  }

//   renderDocument() {
// //      <div id="banner" style={{ background: `url(${this.createBackgroundImage('banner_image_1')}` }}>
// // <div className="test-image-pdf-jpg" style={{ background: `url(${this.createBackgroundImageForDocs('phmzxr1sle99vzwgy0qn')})` }}>
//     return (
//       <div className="test-image-pdf-jpg">
//         <div className="test-image-pdf-jpg-background" style={{ background: `url(${this.createBackgroundImageForDocs('phmzxr1sle99vzwgy0qn' + '.jpg')})` }}>
//           <input type="str" placeholder="test input" style={{ top: '204px', left: '-120px', borderColor: 'red' }} />
//         </div>
//       </div>
//     );
//   }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Ooops! </strong> {this.props.errorMessage}
        </div>
      );
    }
  }


  // renderYesOrNoFields() {
  //   const yesOrNoNames = ['bath', 'shower', 'sink', 'laundry_area', 'water_heater', 'cooking_stove', 'ac', 'permanent_lighting', 'auto_lock', 'ca_tv', 'internet_connection', 'mail_box', 'parcel_box', 'lock']
  //   const yesOrNoAttributes = { startingTop: }
  // }

  render() {
    // const { handleSubmit, appLanguageCode } = this.props;
    // console.log('in landing, render, this.props: ', this.props);

    // console.log('in Welcome, render, this.state: ', this.state)
    // console.log('in Welcome, render, this.state.show: ', this.state.show)
    // {this.renderPaymentForm()}
    // <div className="fb-login-button" data-max-rows="1" data-size="large" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="false">FB LOGIN</div>
    // <div className="oath-button-box">
    // </div>
    // <img src={"http://res.cloudinary.com/chikarao/image/upload/w_211,h_300/" + 'udlyfjvzwdiz9qkcouv8' + '.jpg'} />
    // <img src={"http://res.cloudinary.com/chikarao/image/upload/w_792,h_1122,q_50  /" + 'phmzxr1sle99vzwgy0qn' + '.jpg'} />
    return (
      <div>
        {this.renderBanner()}
        <div className="landing-main">
        </div>
          {this.renderFooter()}
      </div>
    );
  }
}


// const DocumentChoices = ({
//     input,
//     label,
//     meta: {touched, error},
//     // children
//   }) => (
//       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
//         <div {...input} type="button" value onClick={console.log('in custom component Y')} className="document-yes-no-circle">Y</div>
//         <div {...input} type="button" value={false} onClick={console.log('in custom component N')} className="document-yes-no-circle">N</div>
//       </div>
//     );



function mapStateToProps(state) {
    console.log('in landing, mapStateToProps, state: ', state);
    return {
      // flat: state.selectedFlatFromParams.selectedFlat,
      errorMessage: state.auth.error,
      auth: state.auth,
      appLanguageCode: state.languages.appLanguageCode,
      // initialValues: testObject,
      documents: state.documents
    };
  }

export default connect(mapStateToProps, actions)(Landing);
