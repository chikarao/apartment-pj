import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';

let showHideClassName;

class ReviewEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editReviewCompleted: false,
      clickedStar: 0,
      starClicked: false,
      goldStarNum: 0
    };
  }

  componentDidMount() {
    console.log('in ReviewEditModal, componentDidMount:');
  }

  handleFormSubmit(data) {
    const dataWithRating = { id: data.id, comment: data.comment, title: data.title, rating: this.state.goldStarNum };
    // dataWithRating.rating = this.state.goldStarNum;
    console.log('in ReviewEditModal, handleFormSubmit, dataWithRating: ', dataWithRating);
    console.log('in ReviewEditModal, handleFormSubmit, data: ', data);
    this.props.updateReview(dataWithRating, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in ReviewEditModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editReviewCompleted: true });
  }

  renderPostEditMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">Your review has been updated.</div>
        </div>
      </div>
    );
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          <strong>Ooops! </strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  handleClose() {
    this.props.showEditReview();
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
    const { rating } = this.props.review;
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

  renderEditReviewForm() {
    const { handleSubmit } = this.props;
    const reviewEmpty = _.isEmpty(this.props.review);
    console.log('in ReviewEditModal, renderEditProfileForm, reviewEmpty: ', reviewEmpty);
    if (!reviewEmpty) {
      console.log('in ReviewEditModal, renderEditProfileForm: ');
      console.log('in ReviewEditModal, renderEditProfileForm, this.props.show: ', this.props.show);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // console.log('in modal, render showHideClassName:', showHideClassName);
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
          <section className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
              <h3 className="auth-modal-title">Edit Profile</h3>
              {this.renderAlert()}
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                  <fieldset className="form-group">
                    <label className="create-flat-form-label">Title:</label>
                    <Field name="title" component="input" type="string" className="form-control" />
                  </fieldset>
                  <fieldset className="form-group">
                    <label className="create-flat-form-label">Comment:</label>
                    <Field name="comment" component="textarea" type="text" className="form-control review-comment-input" />
                  </fieldset>
                  <div className="review-edit-star-box">
                  {this.renderStars()}
                  </div>
                  <div className="confirm-change-and-button">
                  <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">Submit</button>
                  </div>
                </form>
              </section>
        </div>
      );
    }
  }

  renderPostEditMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">Your review has been successfully updated.</div>
        </div>
      </div>
    )
  }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    console.log('in ReviewEditModal, render, this.state.editReviewCompleted: ', this.state.editReviewCompleted);
    return (
      <div>
        {this.state.editReviewCompleted ? this.renderPostEditMessage() : this.renderEditReviewForm()}
      </div>
    );
  }
}

ReviewEditModal = reduxForm({
  form: 'ReviewEditModal'
  // fields: [
  //   'address1',
  //   'city',
  //   'zip',
  //   'country',
  //   'area',
  //   'price_per_day',
  //   'price_per_month',
  //   'guests',
  //   'sales_point',
  //   'description',
  //   'rooms',
  //   'beds',
  //   'flat_type',
  //   'bath'
  // ]
})(ReviewEditModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in show_flat, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    // review: state.reviews,
    // userProfile: state.auth.userProfile
    initialValues: state.reviews.reviewForBookingByUser
  };
}


export default connect(mapStateToProps, actions)(ReviewEditModal);
