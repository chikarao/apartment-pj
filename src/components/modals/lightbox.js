import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';
import * as actions from '../../actions';

// import Carousel from '../carousel/carousel';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });

let showHideClassName;
const WH_RATIO = 1.61803398875;

class Lightbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0,
      arrowClicked: false,
      displayedFirst: false,
      windowWidth: window.innerWidth
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
    // console.log('in Lightbox, componentDidMount: ', this.state.imageIndex);
  }

   componentDidUpdate() {
      // const indexEmpty = _.isEmpty(this.props.imageIndex);
      // if(!indexEmpty) {
      //   this.setState({ imageIndex: this.props.imageIndex})
      // }
   }
   componentWillUnmount() {
       window.removeEventListener('resize', this.handleResize.bind(this));
   }

   createBackgroundImage(image, width) {
     const t = new cloudinary.Transformation();
     //aspect ratio is the ratio of width to height
     t.angle(0).crop('scale').width(width).aspectRatio(`${WH_RATIO}`);
     return cloudinaryCore.url(image, t);
   }

   handleResize() {
     this.setState({ windowWidth: window.innerWidth });
     // this.setState({ windowWidth: window.innerWidth },
     //   () => { console.log('Lightbox, handleResize: ', this.state.windowWidth) }
     // );
   }
  // componentDidMount() {
  // }
  handleLightboxAreaClick() {
    // this.props.showLightbox();
  }

  handleClose() {
    console.log('in Lightbox, handleClose:');
    // this.setState({ imageIndex: 0, arrowClicked: false });
    this.props.showLightbox();
    this.props.setImageIndex(0);
  }

  getIndexAndCount() {

  }

  handleImageArrowClick(event) {
    console.log('in Lightbox, hahandleImageArrowClick: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const maxImagesIndex = this.props.images.length - 1;
    console.log('in Lightbox, handleImageArrowClick, elementVal: ', elementVal);
    console.log('in Lightbox, handleImageArrowClick, maxImagesIndex: ', maxImagesIndex);

    // if (!this.state.arrowClicked) {
      this.setState({ arrowClicked: true })
        // console.log('in Lightbox, handleImageArrowClick, setstate arrowclicked: ', this.state.arrowClicked);
      this.imageIncrementer(elementVal, maxImagesIndex);
    //   });
    // } else {
    //     this.imageIncrementer(elementVal, maxImagesIndex);
    // }
  }

  imageIncrementer(elementVal, maxImagesIndex) {
    if (elementVal === 'right') {
      console.log('in Lightbox, imageIncrementer, elementVal maxImagesIndex: ', elementVal, maxImagesIndex);
      if (this.props.imageIndex == maxImagesIndex) {
        const atMax = true;
        this.props.incrementImageIndex(atMax, maxImagesIndex)
        // this.setState({ imageIndex: 0 })
      } else {
        const atMax = false;
        this.props.incrementImageIndex(atMax, maxImagesIndex)
        // this.setState({ imageIndex: this.state.imageIndex + 1 })
      }
    } else {
      console.log('in Lightbox, imageIncrementer, elementVal maxImagesIndex: ', elementVal, maxImagesIndex);
      if (this.props.imageIndex == 0) {
        const atZero = true;
        this.props.decrementImageIndex(atZero, maxImagesIndex)
        // this.setState({ imageIndex: maxImagesIndex })
      } else {
        const atZero = false;
        this.props.decrementImageIndex(atZero, maxImagesIndex)
        // this.setState({ imageIndex: this.state.imageIndex - 1 })
      }
    }
  }

  renderImageBubbles() {
    console.log('in Lightbox, renderImageBubbles: ');
    const numImages = this.props.images.length;

    // render bubbles only if fewer than x images
    if (numImages <= 10) {
      return _.map(this.props.images, (image, i) => {
        // console.log('in Lightbox, renderImageBubbles i: ', i);
        // console.log('in Lightbox, renderImageBubbles this.state.imageIndex: ', this.state.imageIndex);
        // check if current this.props.imageIndex (app state) is equal to i
        // if equal render a solid bubble; if not equal render an empty bubble
        if (i == this.props.imageIndex) {
          return (
            <div key={image.id} className="lightbox-image-bubbles-each" style={{ backgroundColor: 'lightgray' }}></div>
          );
        } else {
          return (
            <div key={image.id} className="lightbox-image-bubbles-each"></div>
          );
        }
      })
    }
  }

  renderImage() {
    const imagesEmpty = _.isEmpty(this.props.images);
    // const imageIndexEmpty = _.isEmpty(this.props.imageIndex);
    console.log('in Lightbox, renderImage this.props.images: ', this.props.images);
    console.log('in Lightbox, renderImage this.props.imageIndex: ', this.props.imageIndex);

    if (!imagesEmpty) {

      //get number of total images
      const imageCount = this.props.images.length;
      // for x of x number
      // getting image index from event.target then 'value' seems to get a string to parse for integer
      const imageNumber = parseInt(this.props.imageIndex, 10) + 1;
      // const imageIndexInt = parseInt(this.props.imageIndex,  10);
      // const imageIndexAndCount = { index: this.props.imageIndex, imageCount: this.props.images.length}
      // if (!imagesEmpty) {
      // console.log('in Lightbox, renderResponsiveImage inside if imagesEmpty: ', imagesEmpty);
      // console.log('in Lightbox, renderImage, imageIndex: ', imageIndex);
      // console.log('in Lightbox, renderImage, clickedIndex: ', clickedIndex);
      // console.log('in Lightbox, renderResponsiveImage inside if imagesEmpty, imageCount: ', imageIndexAndCount.imageCount);
      let width;

      if (this.state.windowWidth <= 650) {
        width = 400;
        // <img src={`http://res.cloudinary.com/chikarao/image/upload/w_${this.state.imageWidthWide},h_354/` + this.props.images[index].publicid + '.jpg'} alt="" />
      } else {
        width = 568;
      }
      // # of # save for when needed...
      return (
        <div className="lightbox-content">
        <span style={{ width }} className="lightbox-numbers">{imageNumber} of {imageCount}</span>
        <div
        className="lightbox-image"
        style={{ background: `url(${this.createBackgroundImage(this.props.images[this.props.imageIndex].publicid, width)})`, width, height: width / WH_RATIO }}
        >
        <div className="lightbox-arrow-box">
        <div value="left" className="lightbox-arrow" onClick={this.handleImageArrowClick.bind(this)} ><i value="left" className="fa fa-angle-left"></i></div>
        <div value="right" className="lightbox-arrow" onClick={this.handleImageArrowClick.bind(this)} ><i value="right" className="fa fa-angle-right"></i></div>
        </div>
        <div style={{ width }} className="lightbox-image-bubbles">
        {this.renderImageBubbles()}
        </div>
        </div>
        </div>
      );
      // }
    } // end of if
  } // end of renderResponsiveImage

  renderLightbox() {
    const indexEmpty = _.isEmpty(this.props.imageIndex);
    const imagesEmpty = _.isEmpty(this.props.images);
    console.log('in Lightbox, renderLightbox this.props.imageIndex:', this.props.imageIndex);
    console.log('in Lightbox, renderLightbox imagesEmpty:', imagesEmpty);

    if (!imagesEmpty) {
    // if (this.props.images) {
      showHideClassName = this.props.show ? 'lightbox display-block' : 'lightbox display-none';
      console.log('in Lightbox, renderLightbox showHideClassName:', showHideClassName);
      // console.log('in Lightbox, renderResponsiveImage inside if imagesEmpty, imageCount: ', imageIndexAndCount.imageCount);
      // console.log('in Lightbox, renderLightbox this.props.show:', this.props.show);
      // console.log('in Lightbox, renderLightbox this.props:', this.props);
      // console.log('in Lightbox, renderLightbox this.props.imageId:', this.props.imageId);
      // console.log('in Lightbox, renderLightbox this.props.images[0]: ', this.props.images[0]);
      // const imageIndex = 0;
      // console.log('in Lightbox, renderLightbox this.props.images[this.props.imageIndex]:', this.props.images[this.props.imageIndex].publicid);
      // console.log('in Lightbox, renderLightbox this.props.images[this.state.imageIndex]:', this.props.images[this.state.imageIndex].publicid);
      // const index = this.props.imageIndex;
      //handleClose is a prop passed from header when SigninModal is called
      return (
        <div className={showHideClassName} onClick={this.handleLightboxAreaClick.bind(this)}>
          {this.renderImage()}
        <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
        </div>
      );
    }
  }

  render() {
    console.log('in Lightbox, render this.props.show:', this.props.show);

    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.renderLightbox()}
      </div>
    );
  }
}

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in Lightbox, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    imageIndex: state.imageIndex.count
    // userProfile: state.auth.userProfile
    // initialValues: state.auth.userProfile
  };
}


export default connect(mapStateToProps, actions)(Lightbox);
