import React, { Component } from 'react';
import _ from 'lodash';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

const publicId = ['RPP9419_mp7xjn', 'redbrick_bklymp', 'dewhirst_electric_co_lofts-01_oxgife'];
const maxImagesIndex = publicId.length - 1;

class MainCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0
    };
    console.log('we are in the constructor');
    console.log('imageIndex in constructor: ', this.state.imageIndex);
    // this.onClick = this.onClick.bind(this);
    // this.handleLeftArrowClick = this.handleLeftArrowClick.bind(this);
  }

  createBackgroundImage(publicId) {
    const width = 400;
    const t = new cloudinary.Transformation();
    t.angle(0).crop('scale').width(width).aspectRatio('1:1');
    return cloudinaryCore.url(publicId, t);
  }

  handleCardClick(event) {
    console.log('event.target.className: ', event.target.className);
    const wasParentClicked = event.target.className === 'card-cover' ||
    event.target.className === 'card';
    console.log('wasParentClicked: ', wasParentClicked);
    if (wasParentClicked) {
      console.log('Card clicked');
    }
  }

  handleLeftArrowClick() {
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

      console.log('left arrow clicked');
      console.log('number of images: ', maxImagesIndex);
  }

  handleRightArrowClick() {
    console.log('in handleRightArrowClick, maxImagesIndex: ', maxImagesIndex);
    console.log('in handleRightArrowClick, this.state.imageIndex: ', this.state.imageIndex);
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
      console.log('Right arrow clicked');
  }

  renderCards() {
    return (
      <div className="card-container col-xs-12 col-sm-3" onClick={(event) => this.handleCardClick(event)}>
        <div
          className="card-image"
          style={{ background: `url(${this.createBackgroundImage(publicId[this.state.imageIndex])})` }}
        >
          <div className="card">
            <div className="card-box">
              <div className="card-arrow-box" onClick={this.handleLeftArrowClick.bind(this)}>
                <i className="fa fa-angle-left"></i>
              </div>
                <div className="card-cover">
                  Nice park nearby!
                </div>
                <div className="card-arrow-box" onClick={this.handleRightArrowClick.bind(this)}>
                  <i className="fa fa-angle-right"></i>
                </div>
            </div>

          </div>
          <div className="card-details">
            <div className="card-flat-caption">
              Spacious loft in Soho
            </div>
            <div className="card-flat-price">
              $2,000 per month
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
    const transformation = new cloudinary.Transformation();
    transformation.width(300).crop('scale');
    return (
      <div>
        {this.renderCards()}
        {this.renderCards()}
        {this.renderCards()}
        {this.renderCards()}
        {this.renderCards()}
        {this.renderCards()}
      </div>
    );
  }
}

export default MainCards;
