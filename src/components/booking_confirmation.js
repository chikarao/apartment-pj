import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';
import ReviewEditModal from './modals/review_edit_modal';


class BookingConfirmation extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     showReviewEditModal: false
  //   };
  // }
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
        console.log('in show_flat renderImages, images: ', images);
        return (
          _.map(images, (image, index) => {
            console.log('in show_flat renderImages, image: ', image.publicid);
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

    renderBookingData() {
      const { bookingData } = this.props;

      if (bookingData) {
        // const data = this.props.bookingData.id;
        // localStorage.setItem('data', data);
        // const localData = localStorage.getItem('data');
        // console.log('in booking confirmation, renderBookingData, localstorage data: ', localData);

        return (
          <div>
            <h3>
              Thank you for your booking!
            </h3>
            <h4>
              This is your booking confirmation. <br/><br/>You can manage your bookings in My Page.
            </h4>
            <div id="carousel-show" className="booking-confirmation-image">
              {this.renderImage(bookingData.flat.images)}
            </div>
            <div className="booking-confirmation">
              <div>
                <strong>Description:</strong> {bookingData.flat.description}
              </div>
              <div>
                <strong>Area:</strong> {bookingData.flat.area}
              </div>
              <div>
                <strong>Beds:</strong> {bookingData.flat.beds}
              </div>
              <div>
                <strong>Booking start:</strong> {bookingData.date_start}
              </div>
              <div>
                <strong>Booking end:</strong> {bookingData.date_end}
              </div>
              <div>
                <strong>Booking ID:</strong> {bookingData.id}
              </div>
            </div>
          </div>
        );
      }
      // } else {
      //   const data = localStorage.getItem('data')
      //   return (
      //     <div>
      //     <h2>
      //     Thank you for booking with us!
      //     </h2>
      //     <h3>
      //     You can manage your bookings in My Page.
      //     </h3>
      //     <div className="booking-confirmation">
      //     <div>
      //     Description: {data.flat.description}
      //     </div>
      //     <div>
      //     Area: {data.flat.area}
      //     </div>
      //     <div>
      //     Beds: {data.flat.beds}
      //     </div>
      //     <div>
      //     Booking start: {data.bookingData.date_start}
      //     </div>
      //     <div>
      //     Booking end: {data.bookingData.date_end}
      //     </div>
      //     </div>
      //     </div>
      //
      //   );
      // }
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
                      <img src={'http://res.cloudinary.com/chikarao/image/upload/w_50,h_50/' + review.user.profile.image + '.jpg'} />
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
    }
  }

  render() {
    return (
      <div>
        {this.renderReviewEditModal()}
        {this.renderBookingData()}
        {this.renderReview()}
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
