import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router-dom';

import * as actions from '../../actions';


class ReviewCreateFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // editReviewCompleted: false,
      clickedStar: 0,
      starClicked: false,
      goldStarNum: 0
    };
  }
  // componentDidMount() {
  // }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Ooops! </strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  handleFormSubmit(data) {
    const { id, user_id, flat_id } = this.props.booking;
    console.log('in ReviewCreateFrom, handleFormSubmit, data: ', data);
    const dataWithRating = { booking_id: id, user_id, flat_id, review_for_flat: true, comment: data.comment, title: data.title, rating: this.state.goldStarNum };
    // dataWithRating.rating = this.state.goldStarNum;
    console.log('in ReviewEditModal, handleFormSubmit, dataWithRating: ', dataWithRating);
    console.log('in ReviewEditModal, handleFormSubmit, data: ', data);
    console.log('in ReviewEditModal, handleFormSubmit, booking: ', this.props.booking);
    this.props.createReview(dataWithRating, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in ReviewEditModal, handleFormSubmitCallback: ', this.props);
    // showHideClassName = 'modal display-none';
    // this.setState({ editReviewCompleted: true });
    this.props.history.push(`/bookingconfirmation/${this.props.booking.id}`);
  }

  handleStarClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in ReviewEditModal, handleStarClick, elementVal:', elementVal);
    const elementValNum = parseInt(elementVal, 10);
    this.setState({ clickedStar: elementValNum, starClicked: true }, () => {
      console.log('in ReviewEditModal, handleStarClick, this.state.clickedStar:', this.state.clickedStar);
      this.setState({ goldStarNum: this.state.clickedStar + 1 }, () => {
        console.log('in ReviewEditModal, handleStarClick, this.state.goldStarNum:', this.state.goldStarNum);
      })
    });
  }

  renderStars() {
    // const { rating } = this.props.review;
    const rating = 0;
    const totalStars = 5;
    const grayStarsNum = 5 - rating;
    console.log('in ReviewEditModal, renderStars, rating:', rating);
    //
    // for (let i = 0; i < rating; i++) {
    // }
    if (!this.state.starClicked) {
      return _.times(totalStars, (i) => {
        if (i < rating) {
          console.log('in ReviewEditModal, renderStars, in loop, if: ', i);
          return <i key={i} value={i} className="fa fa-star gold-star-edit" onClick={this.handleStarClick.bind(this)}></i>;
        } else {
          console.log('in ReviewEditModal, renderStars, in loop, else:', i);
          return <i key={i} value={i} className="fa fa-star gray-star-edit" onClick={this.handleStarClick.bind(this)}></i>
        }
      });
    } else {
      return _.times(totalStars, (i) => {
        if (i < this.state.goldStarNum) {
          console.log('in ReviewEditModal, renderStars, in loop, if: ', i);
          return <i key={i} value={i} className="fa fa-star gold-star-edit" onClick={this.handleStarClick.bind(this)}></i>;
        } else {
          console.log('in ReviewEditModal, renderStars, in loop, else:', i);
          return <i key={i} value={i} className="fa fa-star gray-star-edit" onClick={this.handleStarClick.bind(this)}></i>
        }
      });

    }
  }

  renderCreateReviewForm() {
    const { handleSubmit } = this.props;
    return (
        <div className="review-container">
          <h4>Write a Review</h4>
          <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
            <fieldset className="form-group">
              <label className="auth-form-label">Title:</label>
              <Field name="title" component="input" type="string" className="form-control" />
            </fieldset>
            <fieldset className="form-group">
              <label className="auth-form-label">Comment:</label>
              <Field name="comment" component="textarea" type="text" className="form-control review-comment-input" />
            </fieldset>
            <div className="review-edit-star-box">
            {this.renderStars()}
            </div>
              {this.renderAlert()}
            <button action="submit" className="btn btn-primary review-create-btn">Submit Review</button>
          </form>
        </div>
    );
  }


  render() {
    return (
      <div>
        {this.renderCreateReviewForm()}
      </div>
    );
  }
}

ReviewCreateFrom = reduxForm({
    // (your redux-form config)
    form: 'ReviewCreateFrom',
    fields: ['email', 'password']
})(ReviewCreateFrom);

function mapStateToProps(state) {
  console.log('in ReviewCreateFrom, mapStateToProps, state: ', state);
  return {
    errorMessage: state.auth.error,
    authenticated: state.auth.authenticated };
}

// function mapStateToProps(state) {
//   console.log('in ReviewCreateFrom, mapStateToProps, state: ', state);
//   return {
//     bookingData: state.bookingData.fetchBookingData,
//     review: state.reviews.reviewForBookingByUser,
//     // showEditReviewModal: state.modals.showEditReview
//     // flat: state.flat.selectedFlat
//   };
// }

export default withRouter(connect(mapStateToProps, actions)(ReviewCreateFrom));
