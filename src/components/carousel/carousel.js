import React, { Component } from 'react';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

// import Images from './images'

// ************PROVDE CAROUSEL with FLAT object******************

class Carousel extends Component {
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

  render() {
    return (
      <div>
        <div
        className={(this.props.cardOrInfoWindow ? 'card-image-infowindow' : 'card-image')}
        style={{ background: `url(${this.createBackgroundImage(this.props.flat.images[this.state.imageIndex].publicid)})` }}
        >
          <div className="card">
            <div className={(this.props.cardOrInfoWindow ? 'card-box-infowindow' : 'card-box')}>
              <div className="card-arrow-box" onClick={this.handleLeftArrowClick.bind(this)}>
                <i className="fa fa-angle-left"></i>
              </div>
              <div className="card-cover">
                Hello!
              </div>
              <div className="card-arrow-box" onClick={this.handleRightArrowClick.bind(this)}>
                <i className="fa fa-angle-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Carousel;
