import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';

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
    const width = 400;
    const t = new cloudinary.Transformation();
    t.angle(0).crop('scale').width(width).aspectRatio('1:1');
    return cloudinaryCore.url(image, t);
  }

  handleCardClick = (event) => {
    console.log('in main_cards, handleCardClick, event.target.className: ', event.target.className);
    const wasParentClicked = event.target.className === 'card-cover' ||
    event.target.className === 'card';
    console.log('in main_cards, handleCardClick, wasParentClicked: ', wasParentClicked);
    if (wasParentClicked) {
      this.props.selectedFlat(this.props.flat);
      console.log('in main_cards, handleCardClick, Card clicked');
      const win = window.open('/show', '_blank');
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

  renderCards() {
    // console.log('in main_cards, renderCards, this.props.flat.images: ', this.props.flat.images[0]);
    return (
      <div className="card-container col-xs-12 col-sm-3" onClick={(event) => this.handleCardClick(event)}>
        <div
          className="card-image"
          style={{ background: `url(${this.createBackgroundImage(this.props.flat.images[this.state.imageIndex].publicid)})` }}
        >
          <div className="card">
            <div className="card-box">
              <div className="card-arrow-box" onClick={this.handleLeftArrowClick.bind(this)}>
                <i className="fa fa-angle-left"></i>
              </div>
                <div className="card-cover">
                  {this.props.flat.sales_point}
                </div>
                <div className="card-arrow-box" onClick={this.handleRightArrowClick.bind(this)}>
                  <i className="fa fa-angle-right"></i>
                </div>
            </div>
          </div>
          <div className="card-details">
            <div className="card-flat-caption">
              {this.props.flat.description}
            </div>
            <div className="card-flat-price">
              {this.props.currency} {this.props.flat.price_per_month}
            </div>
            <div className="card-flat-amenities">
              <i className="fa fa-wifi"></i>
              <i className="fa fa-bath"></i>
              <i className="fa fa-utensils"></i>
            </div>
          </div>
        </div>
      </div>
    );
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
    const transformation = new cloudinary.Transformation();
    transformation.width(300).crop('scale');
    return (
      <div>
        {this.renderCards()}
      </div>
    );
  }
}

export default connect(null, actions)(MainCards);
