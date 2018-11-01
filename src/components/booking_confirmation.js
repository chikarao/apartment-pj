import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';

import * as actions from '../actions';
import ReviewEditModal from './modals/review_edit_modal';
import ReviewCreateFrom from './forms/review_create';

import CreateEditDocument from './forms/create_edit_document'

class BookingConfirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDocument: false
    };
    this.handleDocumentCreateLink = this.handleDocumentCreateLink.bind(this);
  }
  componentDidMount() {
    // gets flat id from params set in click of main_cards or infowindow detail click
    const bookingId = parseInt(this.props.match.params.id, 10);
    this.props.fetchBooking(bookingId);
    console.log('in booking confirmation, getting params, this.props.match.params.id: ', this.props.match.params.id);
    this.props.fetchReviewForBookingByUser(bookingId);
  }

    componentWillUnmount() {
      console.log('in booking confirmation, componentWillUnmount');
    }

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

    renderEachBasicLine(bookingData) {
      const { date_start, date_end, id } = bookingData;
      const { description, area, beds } = bookingData.flat;
      const lineArray = [
        { title: 'Description', data: description },
        { title: 'Area', data: area },
        { title: 'Beds', data: beds },
        { title: 'Date Start', data: date_start },
        { title: 'Date End', data: date_end },
        { title: 'Booking ID', data: id }
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
      });
    }

    renderEachTenantLine() {
      return (
        <div>each line</div>
      );
    }

    renderBookingBasicInformation(bookingData) {
      return (
        <div className="booking-confirmation-each-box">
          <div className="booking-request-box-title">Basic Booking Information</div>
          {this.renderEachBasicLine(bookingData)}
        </div>
      );
    }

    renderNameBox(bookingData) {
      return (
        <div className="booking-confirmation-name-box">
          <div className="booking-confirmation-name-box-each-line">
            First Name: {bookingData.user.profile.first_name}
          </div>
          <div className="booking-confirmation-name-box-each-line">
            Last Name: {bookingData.user.profile.last_name}
          </div>
          <div className="booking-confirmation-name-box-each-line">
          </div>
        </div>
      );
    }

    renderBookingTenantInformation(bookingData) {
      return (
        <div className="booking-confirmation-each-box">
          <div className="booking-request-box-title">Tenant Information</div>
            <div className="booking-confirmation-profile-top-box">
              <img src={'http://res.cloudinary.com/chikarao/image/upload/w_100,h_100,c_fill,g_face/' + bookingData.user.image + '.jpg'} className="booking-confirmation-image-box" alt="" />
              {this.renderNameBox(bookingData)}
            </div>
            {this.renderEachTenantLine()}
        </div>
      );
    }

    renderBookingData() {
      const { bookingData } = this.props;

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
              Thank you for your booking request!
            </h3>
            <div id="carousel-show" className="booking-confirmation-image">
              {this.renderImage(bookingData.flat.images)}
            </div>
            <div className="booking-confirmation container">
            <div className="booking-confirmation-row">
              {this.renderBookingBasicInformation(bookingData)}
              {this.renderBookingTenantInformation(bookingData)}
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
        // console.log('in booking confirmation, renderReview, today:', today);
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
    return (
      <CreateEditDocument />
    );
  }

  handleDocumentCreateLink() {
    this.setState({ showDocument: true });
  }

  renderDocumentChoices() {
    return (
      <div className="booking-confirmation-create-document-box">
        <h4>Create Document</h4>
        <div onClick={this.handleDocumentCreateLink} className="booking-confirmation-document-create-link">Teishaku</div>
      </div>
    );
  }

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
        {this.renderDocumentChoices()}
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
    showEditReviewModal: state.modals.showEditReview
    // flat: state.flat.selectedFlat
  };
}

export default connect(mapStateToProps, actions)(BookingConfirmation);
