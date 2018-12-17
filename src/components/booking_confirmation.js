import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';

import * as actions from '../actions';
import ReviewEditModal from './modals/review_edit_modal';
import ReviewCreateFrom from './forms/review_create';

import CreateEditDocument from './forms/create_edit_document';
import CalculateAge from './functions/calculate_age';
import Facility from './constants/facility';
import Documents from './constants/documents';
import AppLanguages from './constants/app_languages';
// import DocumentForm from './constants/document_form';

class BookingConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDocument: false
    };
    this.handleDocumentCreateLink = this.handleDocumentCreateLink.bind(this);
    this.handleBookingRequsetApprovalClick = this.handleBookingRequsetApprovalClick.bind(this);
  }

  componentDidMount() {
    // gets flat id from params set in click of main_cards or infowindow detail click
    const bookingId = parseInt(this.props.match.params.id, 10);
    this.props.fetchBooking(bookingId);
    console.log('in booking confirmation, getting params, this.props.match.params.id: ', this.props.match.params.id);
    this.props.fetchReviewForBookingByUser(bookingId);
  }

  // componentWillUnmount() {
  //   console.log('in booking confirmation, componentWillUnmount');
  // }

  renderImage(images) {
    const imagesEmpty = _.isEmpty(images);
    if(!imagesEmpty) {
      console.log('in booking_confirmation renderImages, images: ', images);
      return (
        _.map(images, (image, index) => {
          console.log('in booking_confirmation renderImages, image: ', image.publicid);
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
      if (eachChoice.value == facilityType) {
        facilityChoice = eachChoice;
        return;
      }
    });
    return facilityChoice;
  }

  getFacilityStrings(facilitiesArray) {
    const array = []
    let facilityString = ''
    _.each(facilitiesArray, eachFacility => {
      const choice = this.getFacilityChoice(eachFacility.facility_type);
      console.log('in booking_confirmation getFacilityStrings, choice: ', choice);

      // if facility included
      if (this.props.bookingData.flat[choice.facilityObjectMap]) {
        facilityString = choice[this.props.appLanguageCode] + ', ' + 'Included'
      } else {
        facilityString = choice[this.props.appLanguageCode] + ', ' + '$' + eachFacility.price_per_month + '/mo'+ ', ' + 'Dep ' + (eachFacility.deposit ? eachFacility.deposit : 0) + ' mo'
      }
      array.push(facilityString)
    })
    return array;
  }


  renderEachBasicLine() {
    const { date_start, date_end, id, facilities } = this.props.bookingData;
    const { description, area, beds, rooms, layout, city, state, country } = this.props.bookingData.flat;
    const facilitiesInStringArray = this.getFacilityStrings(facilities);
    console.log('in booking_confirmation renderEachBasicLine, facilitiesInStringArray: ', facilitiesInStringArray);
    const addressString = city + ', ' + state
    // const addressString = city + ' ' + state + ' ' + `${country.toLowerCase() == ('日本' || 'japan') ? '' : country}`

    const lineArray = [
      { title: 'Description:', data: description },
      { title: 'Area:', data: area },
      { title: 'City/State:', data: addressString },
      { title: 'Beds:', data: beds },
      { title: 'Rooms:', data: rooms },
      { title: 'Layout:', data: layout },
      { title: 'Date Start:', data: date_start },
      { title: 'Date End:', data: date_end },
      { title: 'Booking ID:', data: id },
      { title: 'Listing ID:', data: this.props.bookingData.flat.id }
    ];


    if (facilitiesInStringArray.length > 0) {
      const object = { title: 'Facilities:', data: '' };
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
            {eachLine.data}
          </div>
        </div>
      );
    });
  }

  getNumberOfTenants(bookingData, profile) {
    const { tenants } = bookingData;
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
    // const { description, area, beds } = bookingData.flat;
    const age = CalculateAge(birthday);
    console.log('in booking_confirmation renderEachTenantLine, age: ', age);
    const addressString = city + ' ' + state + ' ' + `${country.toLowerCase() == ('日本' || 'japan') ? '' : country}`
    const numberOfTenants = this.getNumberOfTenants(this.props.bookingData, profile)

    const lineArray = [
      { title: 'Age', data: age },
      { title: 'From', data: addressString },
      { title: 'Number of Tenants', data: numberOfTenants },
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
    return (
      <div className="booking-confirmation-each-box">
        <div className="booking-request-box-title">Basic Booking Request Information</div>
        {this.renderEachBasicLine()}
      </div>
    );
  }

  renderNameBox(profile) {
    return (
      <div className="booking-confirmation-name-box">
        <div className="booking-confirmation-name-box-each-line">
          First Name: {profile.first_name}
        </div>
        <div className="booking-confirmation-name-box-each-line">
          Last Name: {profile.last_name}
        </div>
      </div>
    );
  }

  renderTenantIntroduction(profile) {
    return (
      <div className="booking-confirmation-profile-introduction">
        <div className="booking-request-box-each-line-title">
          Introduction:
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

  renderBookingTenantInformation(bookingData) {
    // for some reason, cloudinary image does not render correctly if image obtained
    // from this.props.bookingData; needs to be passed on by parameter
    const profileToUse = this.getProfileToUse(bookingData.user.profiles);
    return (
      <div className="booking-confirmation-each-box">
        <div className="booking-request-box-title">Proposed Tenant Information</div>
          <div className="booking-confirmation-profile-top-box">
            <img src={'http://res.cloudinary.com/chikarao/image/upload/w_100,h_100,c_fill,g_face/' + bookingData.user.image + '.jpg'} className="booking-confirmation-image-box" alt="" />
            {this.renderNameBox(profileToUse)}
          </div>
          <div className="booking-confirmation-profile-scrollbox">
            {this.renderEachTenantLine(profileToUse)}
            {this.renderTenantIntroduction(profileToUse)}
          </div>
      </div>
    );
  }

  renderEachContractToCreate() {
    // <div value={'important_points_explanation_jp'} onClick={this.handleDocumentCreateLink} className="booking-confirmation-document-create-link">{Documents[eachDocumentKey][this.props.appLanguageCode]}</div>
    return _.map(Object.keys(Documents), (eachDocumentKey, i) => {
      return (
        <div key={i} value={eachDocumentKey} onClick={this.handleDocumentCreateLink} className="booking-confirmation-document-create-link">{Documents[eachDocumentKey][this.props.appLanguageCode]}</div>
      );
    })
  }

  renderBookingDocuments() {
    return (
      <div className="booking-confirmation-each-box">
        <div className="booking-request-box-title">Rental Documents</div>
          <div className="booking-request-box-each-line">
            <div className="booking-request-box-each-line-title">
              Create Documents:
            </div>
            <div className="booking-request-box-each-line-data">
            </div>
          </div>
          <br/>
          <div className="booking-confirmation-document-box">
            {this.renderEachContractToCreate()}
          </div>

          <div className="booking-request-box-each-line">
            <div className="booking-request-box-each-line-title">
              Documents on File:
            </div>
            <div className="booking-request-box-each-line-data">
            </div>
          </div>
          <br/>
          <div className="booking-confirmation-document-box">
            No documents on file
          </div>
      </div>
    );
  }

  handleBookingRequsetApprovalClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    if (window.confirm('Approve booking request? The action cannot be undone unless you cancel the request.')) {
      this.props.editBooking({ id: elementVal, approved: true }, () => {});
    }
  }

  renderBookingApprovals() {
    return (
      <div className="booking-confirmation-each-box">
        <div className="booking-request-box-title">Approvals and Checklist</div>
          <div className="booking-request-box-each-line">
            <div className="booking-request-box-each-line-title">
              Approve Booking Request
            </div>
            <div className="booking-request-box-each-line-data">
              {this.props.bookingData.approved ? 'Approved ✅'
              :
              <div value={this.props.bookingData.id} className="btn btn-md booking-confirmation-approve-request-btn" onClick={this.handleBookingRequsetApprovalClick}>Approve</div>
             }
            </div>
          </div>
      </div>
    );
  }

  renderBookingData() {
    const { bookingData, appLanguageCode } = this.props;
    // if (bookingData && !this.state.showDocument) {
    if (bookingData) {
      // const data = this.props.bookingData.id;
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
            {this.renderImage(bookingData.flat.images)}
          </div>
          <div className="booking-confirmation-progress-box">
            <div className="booking-confirmation-progress-box-title">
              Rental Progress
            </div>
            <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '1.5%' }}>Reservation Request</div>
            <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '31%' }}>Tenant Approved</div>
            <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '60.5%' }}>Contract Delivered</div>
            <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '90%', padding: '10px' }}>Signed!</div>
            <div className="booking-confirmation-progress-box-contents">
              <div className="booking-confirmation-progress-circle" />
              <div className="booking-confirmation-progress-line" style={bookingData.approved ? { backgroundColor: 'green' } : { backgroundColor: 'lightgray' }} />
              <div className="booking-confirmation-progress-circle" />
              <div className="booking-confirmation-progress-line" />
              <div className="booking-confirmation-progress-circle" />
              <div className="booking-confirmation-progress-line" />
              <div className="booking-confirmation-progress-circle" />
            </div>
          </div>
          <div className="booking-confirmation container">
            <div className="booking-confirmation-row">
              {this.renderBookingBasicInformation()}
              {this.renderBookingTenantInformation(bookingData)}
              {this.renderBookingDocuments()}
              {this.renderBookingApprovals()}
            </div>
          </div>
        </div>
      );
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
  console.log('in booking confirmation, handleEditReviewClick, elementVal:', elementVal);
  // this.props.updateReview(elementVal);
  this.props.showEditReview();
}

renderReviewEditModal() {
  console.log('in booking confirmation, renderReviewEditModal, this.props.showEditReview:', this.props.showEditReviewModal);
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
                <div value={review.id} className="review-bottom-details-edit" onClick={this.handleEditReviewClick.bind(this)}>
                  Edit
                </div>

              </div>
        </div>
      </div>
    );
  } else {
    if(this.props.bookingData) {
      const today = new Date()
      // console.log('in booking confirmation, renderReview, this.props.bookingData.date_end:', this.props.bookingData.date_end);
      const bookingEnd = new Date(this.props.bookingData.date_end)
      const pastBookingEnd = bookingEnd < today;
      // console.log('in booking confirmation, renderReview, pastBookingEnd:', pastBookingEnd);
      if (pastBookingEnd) {
        return (
          <div>
            <ReviewCreateFrom
              booking={this.props.bookingData}
            />
          </div>
        );
      }
    }
    // if(this.props.bookingData) {
    // }
  }
}

renderDocument() {
  console.log('in booking confirmation, renderDocument:');
  return (
    <CreateEditDocument
      showDocument={() => this.setState({ showDocument: !this.state.showDocument })}
    />
  );
}

handleDocumentCreateLink(event) {
  const clickedElement = event.target;
  // elementval is document key
  const elementVal = clickedElement.getAttribute('value');
  // if showDocument is false, just create document key with the document code
  if (!this.state.showDocument) {
    this.props.setCreateDocumentKey(elementVal, () => {
      this.setState({ showDocument: true });
    });
  } else {
    // if showDocument is true (currently showing document),
    // close document first then show new document
    this.setState({ showDocument: false }, () => {
      this.props.setCreateDocumentKey(elementVal, () => {
        this.setState({ showDocument: true });
      });
    });
  }
}

// renderDocumentChoices() {
//   return (
//     <div className="booking-confirmation-create-document-box">
//       <h4>Create Document</h4>
//       <div onClick={this.handleDocumentCreateLink} className="booking-confirmation-document-create-link">Teishaku</div>
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

render() {
  return (
    <div>
      {this.renderReviewEditModal()}
      {this.renderBookingData()}
      {this.renderReview()}
      {this.state.showDocument ? this.renderDocument() : ''}
    </div>
  );
}
}

function mapStateToProps(state) {
  console.log('in booking confirmation, mapStateToProps, state: ', state);
  return {
    bookingData: state.bookingData.fetchBookingData,
    review: state.reviews.reviewForBookingByUser,
    showEditReviewModal: state.modals.showEditReview,
    appLanguageCode: state.languages.appLanguageCode
    // flat: state.flat.selectedFlat
  };
}

export default connect(mapStateToProps, actions)(BookingConfirmation);
