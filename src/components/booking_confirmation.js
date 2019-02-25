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
import Languages from './constants/languages';
import InsertField from './constants/insert_field';
// import UploadForProfile from './images/upload_for_profile';
import DocumentInsertCreateModal from './modals/document_insert_create_modal';
import DocumentInsertEditModal from './modals/document_insert_edit_modal';
import InsertFieldCreateModal from './modals/insert_field_create_modal';
import InsertFieldEditModal from './modals/insert_field_edit_modal';
// import InsertFieldEditModal from './modals/insert_field_edit_modal';


// import DocumentForm from './constants/document_form';
let insertFieldObject = {}

class BookingConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDocument: false,
      agreementId: '',
      showSavedDocument: false,
      documentInsertId: '',
      insertFieldId: '',
      insertFieldLanguageCode: ''
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
  }

  componentDidMount() {
    // gets flat id from params set in click of main_cards or infowindow detail click
    const bookingId = parseInt(this.props.match.params.id, 10);
    this.props.fetchBooking(bookingId);
    // console.log('in booking confirmation, getting params, this.props.match.params.id: ', this.props.match.params.id);
    this.props.fetchReviewForBookingByUser(bookingId);
    this.props.fetchDocumentTranslation('important_points_explanation');
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
    const { appLanguageCode } = this.props;
    const facilitiesInStringArray = this.getFacilityStrings(facilities);
    console.log('in booking_confirmation renderEachBasicLine, facilitiesInStringArray: ', facilitiesInStringArray);
    const addressString = city + ', ' + state
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
    //   { title: 'Listing ID:', data: this.props.bookingData.flat.id }
    // ];
    const lineArray = [
      { title: `${AppLanguages.description[appLanguageCode]}:`, data: description },
      { title: `${AppLanguages.area[appLanguageCode]}:`, data: area },
      { title: `${AppLanguages.cityState[appLanguageCode]}:`, data: addressString },
      { title: `${AppLanguages.beds[appLanguageCode]}:`, data: beds },
      { title: `${AppLanguages.rooms[appLanguageCode]}:`, data: rooms },
      { title: `${AppLanguages.layout[appLanguageCode]}:`, data: layout },
      { title: `${AppLanguages.dateStart[appLanguageCode]}:`, data: date_start },
      { title: `${AppLanguages.dateEnd[appLanguageCode]}:`, data: date_end },
      { title: `${AppLanguages.bookingId[appLanguageCode]}:`, data: id },
      { title: `${AppLanguages.listingId[appLanguageCode]}:`, data: this.props.bookingData.flat.id }
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
    const { appLanguageCode } = this.props;
    // const { description, area, beds } = bookingData.flat;
    const age = CalculateAge(birthday);
    console.log('in booking_confirmation renderEachTenantLine, age: ', age);
    const addressString = city + ' ' + state + ' ' + `${country.toLowerCase() == ('日本' || 'japan') ? '' : country}`
    const numberOfTenants = this.getNumberOfTenants(this.props.bookingData, profile)

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

  renderBookingTenantInformation(bookingData) {
    // for some reason, cloudinary image does not render correctly if image obtained
    // from this.props.bookingData; needs to be passed on by parameter
    const profileToUse = this.getProfileToUse(bookingData.user.profiles);
    const { appLanguageCode } = this.props;

    return (
      <div className="booking-confirmation-each-box">
        <div className="booking-request-box-title">{AppLanguages.proposedTenantInformation[appLanguageCode]}</div>
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
    return _.map(this.props.bookingData.agreements, (eachAgreement, i) => {
      // return <div key={i} value={eachAgreement.document_code} name={eachAgreement.id} onClick={this.handleSavedDocumentShowClick} className="booking-confirmation-document-create-link">{Documents[eachAgreement.document_code][this.props.appLanguageCode]}</div>
      return <div
        key={i}
        value={eachAgreement.document_code}
        name={eachAgreement.id}
        onClick={this.handleSavedDocumentShowClick}
        className="booking-confirmation-document-create-link"
      >
        {eachAgreement.document_name} &nbsp;
        {eachAgreement.document_publicid ? <i className="far fa-file-pdf" style={{ color: 'black' }}></i> : ''}
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

  renderBookingDocuments() {
    const { appLanguageCode } = this.props;

    if (this.props.bookingData) {
      return (
        <div className="booking-confirmation-each-box">
          <div className="booking-request-box-title">{AppLanguages.rentalDocuments[appLanguageCode]}</div>
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
              {this.props.bookingData.agreements ? this.renderEachAgreementSaved() : 'No documents on file'}
            </div>
        </div>
      );
    }
  }

  handleBookingRequsetApprovalClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    if (window.confirm('Approve booking request? The action cannot be undone unless you cancel the request.')) {
      this.props.editBooking({ id: elementVal, approved: true }, () => {});
    }
  }

  renderBookingApprovals() {
    const { appLanguageCode } = this.props;

    return (
      <div className="booking-confirmation-each-box">
        <div className="booking-request-box-title">{AppLanguages.approvalsChecklist[appLanguageCode]}</div>
          <div className="booking-request-box-each-line">
            <div className="booking-request-box-each-line-title">
              {AppLanguages.approveBookingRequest[appLanguageCode]}
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
                {AppLanguages.rentalProgress[appLanguageCode]}
            </div>
            <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '1.5%' }}>  {AppLanguages.reservationRequest[appLanguageCode]}</div>
            <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '31%' }}>  {AppLanguages.tenantApproved[appLanguageCode]}</div>
            <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '60.5%' }}>{AppLanguages.documentsDelivered[appLanguageCode]}</div>
            <div className="booking-confirmation-progress-box-label" style={{ top: '26%', left: '90%' }}>{AppLanguages.documentsSigned[appLanguageCode]}</div>
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
    if(this.props.bookingData) {
      const today = new Date()
      // console.log('in booking confirmation, renderReview, this.props.bookingData.date_end:', this.props.bookingData.date_end);
      const bookingEnd = new Date(this.props.bookingData.date_end)
      const pastBookingEnd = bookingEnd < today;
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
  // <div className="document-insert-box-upload-link">
  //   <UploadForProfile
  //     // pass props to indicate uploading for documents not profile
  //     documentUpload
  //   />
  // </div>
  return (
    <div className="document-insert-box">
      <div className="document-insert-box-title">
        {AppLanguages.insertDocuments[this.props.appLanguageCode]}
      </div>
      <div className="document-insert-box-upload-link" onClick={this.handleUploadPdfLink}>
        <i className="fas fa-cloud-upload-alt"></i>&nbsp;{AppLanguages.uploadPdf[this.props.appLanguageCode]}
      </div>
      <div className="document-insert-box-documents">
        {this.renderEachUploadedPdf()}
      </div>
    </div>
  );
}

renderDocument() {
  // get agreement chosen by user. Returns array so get first index position below
  const agreementArray = this.props.bookingData.agreements.filter(agreement => agreement.id == this.state.agreementId)
  // console.log('in booking confirmation, renderDocument, this.state.showSavedDocument, this.state.agreementId, agreementArray[0]:', this.state.showSavedDocument, this.state.agreementId, agreementArray[0]);
  return (
    <div className="booking-confirmation-render-document-box">
      {this.renderInsertBox()}
      <CreateEditDocument
        showDocument={() => this.setState({ showDocument: !this.state.showDocument })}
        closeSavedDocument={() => this.setState({ showDocument: !this.state.showDocument, showSavedDocument: !this.state.showSavedDocument })}
        goToSavedDocument={() => this.setState({ showSavedDocument: !this.state.showSavedDocument, showDocument: !this.state.showDocument }, () => {
            // console.log('in booking confirmation, renderDocument, first this.state.showSavedDocument, this.state.showDocument:', this.state.showSavedDocument, this.state.showDocument);
          this.setState({ showDocument: !this.state.showDocument }, () => {
            // console.log('in booking confirmation, renderDocument, second this.state.showSavedDocument, this.state.showDocument:', this.state.showSavedDocument, this.state.showDocument);
          });
        })}
        setAgreementId={(id) => this.setState({ agreementId: id })}
        showSavedDocument={this.state.showSavedDocument}
        agreementId={this.state.agreementId}
        agreement={agreementArray[0]}
      />
    </div>
  );
}

handleDocumentCreateClick(event) {
  const clickedElement = event.target;
  // elementval is document key
  const elementVal = clickedElement.getAttribute('value');
  // console.log('in booking confirmation, handleDocumentCreateClick, this.state:', this.state);

  // if showDocument is false, just create document key with the document code
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

handleSavedDocumentShowClick(event) {
  const clickedElement = event.target;
  // elementVal is documentCode or document key in documents.js
  const elementVal = clickedElement.getAttribute('value');
  // elementName is agreement id
  const elementName = clickedElement.getAttribute('name');
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
  console.log('in booking confirmation, renderDocumentInsertCreateForm: ');
  return (
    <DocumentInsertCreateModal
      show={this.props.showDocumentInsertCreate}
      agreementId={this.state.agreementId}
    />
  );
}

renderDocumentInsertEditForm() {
  console.log('in booking confirmation, renderDocumentInsertEditForm: ');
  return (
    <DocumentInsertEditModal
      show={this.props.showDocumentInsertEdit}
      agreementId={this.state.agreementId}
      documentInsertId={this.state.documentInsertId}
    />
  );
}

renderInsertFieldCreateForm() {
  console.log('in booking confirmation, renderDocumentInsertCreateForm, insertFieldObject: ', insertFieldObject);
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
    </div>
  );
}
}

function mapStateToProps(state) {
  console.log('in booking confirmation, mapStateToProps, state: ', state);
  if (state.bookingData.fetchBookingData) {
    return {
      bookingData: state.bookingData.fetchBookingData,
      review: state.reviews.reviewForBookingByUser,
      showEditReviewModal: state.modals.showEditReview,
      appLanguageCode: state.languages.appLanguageCode,
      documentLanguageCode: state.languages.documentLanguageCode,
      showDocumentInsertCreate: state.modals.showDocumentInsertCreateModal,
      showDocumentInsertEdit: state.modals.showDocumentInsertEditModal,
      showInsertFieldCreate: state.modals.showInsertFieldCreateModal,
      showInsertFieldEdit: state.modals.showInsertFieldEditModal,
      documentInserts: state.bookingData.documentInserts,
      // agreements: state.fetchBookingData.agreements
      // flat: state.flat.selectedFlat
    };
  } else {
    return {};
  }
}

export default connect(mapStateToProps, actions)(BookingConfirmation);
