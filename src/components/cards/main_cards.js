import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';
import * as actions from '../../actions';

// import Carousel from '../carousel/carousel';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

// const a = ['RPP9419_mp7xjn', 'redbrick_bklymp', 'dewhirst_electric_co_lofts-01_oxgife'];
// const a = this.props.images;

class MainCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0
    };
    // console.log('we are in the constructor of main_cards');
    // console.log('imageIndex in constructor: ', this.state.imageIndex);
    // this.onClick = this.onClick.bind(this);
    // this.handleLeftArrowClick = this.handleLeftArrowClick.bind(this);
    // console.log('in main_cards, images: ', this.props.flat.images);
  }

  createBackgroundImage(image) {
    console.log('in main_cards, createBackgroundImage, image: ', image);
    const width = 400;
    const t = new cloudinary.Transformation();
    t.angle(0).crop('scale').width(width).aspectRatio('1.5');
    return cloudinaryCore.url(image, t);
  }

  handleCardClick = (event) => {
    console.log('in main_cards, handleCardClick, event.target.className: ', event.target.className);
    const wasParentClicked = event.target.className === 'card-cover' ||
    event.target.className === 'card';
    console.log('in main_cards, handleCardClick, wasParentClicked: ', wasParentClicked);
    if (wasParentClicked) {
      // this.props.selectedFlat(this.props.flat);
      console.log('in main_cards, handleCardClick, Card clicked');
      // for each click of card, a view is persisited in the database
      this.props.createView(this.props.flat.id);
      const win = window.open(`/show/${this.props.flat.id}`, '_blank');
      win.focus();
    }
  }

  handleLeftArrowClick() {
    const a = this.props.flat.images;
    const maxImagesIndex = a.length - 1;
    console.log('in handleLeftArrowClick, maxImagesIndex: ', maxImagesIndex);
    console.log('in handleLeftArrowClick, this.state.imageIndex: ', this.state);
    if (this.state.imageIndex === 0) {
      this.setState({
        imageIndex: maxImagesIndex
      });
    } else {
      const nextIndex = this.state.imageIndex - 1;
      this.setState({
        imageIndex: nextIndex
      });
    }

      console.log('in main_cards, left arrow clicked');
      console.log('in main_cards, number of images: ', maxImagesIndex);
  }

  handleRightArrowClick() {
    const a = this.props.flat.images;
    const maxImagesIndex = a.length - 1;
    console.log('in main_cards, handleRightArrowClick, maxImagesIndex: ', maxImagesIndex);
    console.log('in main_cards, handleRightArrowClick, this.state.imageIndex: ', this.state.imageIndex);
    if (this.state.imageIndex === maxImagesIndex) {
      this.setState({
        imageIndex: 0
      });
    } else {
      const nextIndex = this.state.imageIndex + 1;
      this.setState({
        imageIndex: nextIndex
      });
    }
      console.log('in main cards, Right arrow clicked');
  }

  handleLikeClick(event) {
    // if logged in, user can like a flat
    // header has a check on showAuthModal to show modal or not; default show sign UP modal
    if (this.props.authenticated) {
      console.log('in main cards, handleLikeClick, like clicked, event.target: ', event.target);
      const clickedElement = event.target;
      const elementVal = clickedElement.getAttribute('value');
      console.log('in main cards, handleLikeClick, elementVal: ', elementVal);
      const likesArray = this.getLikesArray();
      if (!likesArray.includes(this.props.flat.id)) {
        this.props.createLike(elementVal, () => this.handleLikeClickCallback());
      } else {
        this.props.deleteLike(elementVal, () => this.handleLikeClickCallback());
      }
    } else {
      // header has a check on showAuthModal to show modal or not; default show sign UP modal
      this.props.showAuthModal();
    }
  }

  handleLikeClickCallback() {
    this.props.fetchLikesByUser();
  }

  getLikesArray() {
    const likesArray = [];
    _.each(this.props.likes, (like) => {
      likesArray.push(like.flat_id);
    })
    return likesArray;
  }

  renderLikes() {
    const { flat } = this.props;
    const likesArray = this.getLikesArray();
    if (!likesArray.includes(flat.id)) {
      console.log('in main cards, renderLikes, likesArray, flat.id: ', likesArray, flat.id);
      return (
        <div key={likesArray[0]} value={flat.id} id="card-like-box" onClick={this.handleLikeClick.bind(this)}>
          <i key={flat.user_id} className="fa fa-heart" style={{ opacity: '.75' }}></i>
        </div>
      )
    } else {
      return (
        <div key={likesArray[0]} value={flat.id} id="card-like-box" onClick={this.handleLikeClick.bind(this)}>
          <i key={flat.user_id} className="fa fa-heart" style={{ color: 'pink' }}></i>
        </div>
      )
    }
  }

  getRating(reviews) {
    let totalRating = 0;
    let count = 0;
    const totalPossibleRating = 5;
    _.each(reviews, review =>{
      totalRating += review.rating
      count++;
    });
    const averageRating = totalRating / count;
      return _.times(totalPossibleRating, (i) => {
        if (i < averageRating) {
          if ((i + 1) < averageRating) {
            console.log('in ReviewEditModal, renderStars, in loop, if: ', i);
            // return <i key={i} className="fa fa-star gold-star-main-cards"></i>;
            return <i key={i} className="fa fa-star gold-star-main-cards"></i>;
          } else {
            return <i key={i} className="fa fa-star-half-full gold-star-main-cards"></i>;
          }
        } else {
          console.log('in ReviewEditModal, renderStars, in loop, else:', i);
          return <i key={i} className="fa fa-star gray-star-main-cards"></i>
        }
      });
  }

  renderCards() {
    // <i className="fa fa-wifi"></i>
    // <i className="fa fa-bath"></i>
    // <i className="fa fa-utensils"></i>
    const { flat, currency, authenticated, reviews } = this.props;
    // const reviewsEmpty = _.isEmpty(reviews);

    // if (!reviewsEmpty) {
      console.log('in main cards, renderCards, reviews: ', Object.keys(reviews).length);
      console.log('in main cards, renderCards, reviews: ', reviews);
      const flatAverageRating = this.getRating(reviews);
    // console.log('in main_cards, renderCards, flat.images: ', flat.images[0]);
      return (
        <div key={flat.id.toString()} className="card-container col-xs-12 col-sm-3" onClick={(event) => this.handleCardClick(event)}>
          <div
            className="card-image"
            style={{ background: flat.images[this.state.imageIndex] ? `url(${this.createBackgroundImage(flat.images[this.state.imageIndex].publicid)})` : `url(${this.createBackgroundImage('no_image_placeholder_5')}` }}
          >
            <div className="card">
                {this.renderLikes()}
              <div className="card-box">
                <div className="card-arrow-box" onClick={this.handleLeftArrowClick.bind(this)}>
                  <i className="fa fa-angle-left"></i>
                </div>
                <div className="card-cover">
                  {flat.sales_point}
                </div>
                <div className="card-arrow-box" onClick={this.handleRightArrowClick.bind(this)}>
                  <i className="fa fa-angle-right"></i>
                </div>
              </div>
            </div>
            <div key={flat.id.toString()} className="card-details">
              <div className="card-flat-caption">
                {flat.description}
              </div>
              <div className="card-flat-area">
                {flat.area.toUpperCase()}
              </div>
              <div className="card-flat-price">
                {currency} {parseFloat(flat.price_per_month).toFixed(0)} /month
              </div>
              <div className="card-flat-amenities">
                {flat.beds} {flat.beds > 1 ? 'beds' : 'bed'}
              </div>
              <div className="card-flat-likes-and-views">
                {flat.likes.length > 0 ? <span><i className="fa fa-heart"></i> {flat.likes.length}&nbsp;&nbsp;</span> : ''}
                {flat.views.length > 0 ? <span><i className="fa fa-eye"></i> {flat.views.length}</span> : ''}
                {Object.keys(reviews).length > 0 ? <span>&nbsp;&nbsp;{flatAverageRating}&nbsp; {Object.keys(reviews).length}</span> : ''}
              </div>
            </div>
          </div>
        </div>
      );
    // } // end of if reviewsEmpty
  }

  // renderTimesCards() {
  //   // (5).times((i) => this.renderCards());
  //   const times = 5;
  //   for (let i = 0; i < times; i++) {
  //     this.renderCards();
  //   }
  // }

  render() {
    // console.log('in main_cards, this.props.flats.images: ', this.props.flats.images);
    // const transformation = new cloudinary.Transformation();
    // transformation.width(300).crop('scale');
    return (
      <div>
        {this.renderCards()}
      </div>
    );
  }
}

export default connect(null, actions)(MainCards);
