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
      windowWidth: window.innerWidth
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
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
    this.setState({ imageIndex: 0 });
    this.setState({ arrowClicked: false });
    this.props.showLightbox();
  }

  getIndexAndCount() {

  }

  handleImageArrowClick(event) {
    console.log('in Lightbox, hahandleImageArrowClick: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const maxImagesIndex = this.props.images.length - 1;
    console.log('in Lightbox, hahandleImageArrowClick, elementVal: ', elementVal);
    console.log('in Lightbox, hahandleImageArrowClick, maxImagesIndex: ', maxImagesIndex);

    if (!this.state.arrowClicked) {
      this.setState({ arrowClicked: true });
    }

    if (elementVal === 'right') {
      if (this.state.imageIndex === maxImagesIndex) {
        this.setState({ imageIndex: 0 })
      } else {
        this.setState({ imageIndex: this.state.imageIndex + 1 })
      }
    } else {
      if (this.state.imageIndex === 0) {
        this.setState({ imageIndex: maxImagesIndex })
      } else {
        this.setState({ imageIndex: this.state.imageIndex - 1 })
      }
    }
  }

  renderImageBubbles() {
    console.log('in Lightbox, renderImageBubbles: ');

    return _.map(this.props.images, (image, i) => {
      console.log('in Lightbox, renderImageBubbles i: ', i);
      console.log('in Lightbox, renderImageBubbles this.state.imageIndex: ', this.state.imageIndex);
      if (!this.state.arrowClicked) {
        if (i == this.props.imageIndex) {
          return (
            <div className="lightbox-image-bubbles-each" style={{ backgroundColor: 'lightgray' }}></div>
          );
        } else {
          return (
            <div className="lightbox-image-bubbles-each"></div>
          );
        }
      } else {
        if (i == this.state.imageIndex) {
          return (
            <div className="lightbox-image-bubbles-each" style={{ backgroundColor: 'lightgray' }}></div>
          );
        } else {
          return (
            <div className="lightbox-image-bubbles-each"></div>
          );
        }
      }
    })
  }

  renderImage(clickedIndex) {
    // console.log('in Lightbox, renderResponsiveImage, id: ', id);
    console.log('in Lightbox, renderResponsiveImage this.props.images: ', this.props.images);
    // const imageToRender = [];
    //get index of image that was clicked in show flat
    // const imagesEmpty = _.isEmpty(imageToRender);
    // console.log('in Lightbox, renderResponsiveImage imageToRender: ', imageToRender);
    // console.log('in Lightbox, renderResponsiveImage outside if imagesEmpty: ', imagesEmpty);
    const imageIndexAndCount = this.props.images.length;
    const imageIndex = !this.state.arrowClicked ? clickedIndex : this.state.imageIndex;
    // const imageIndexAndCount = { index: this.props.imageIndex, imageCount: this.props.images.length}
    // if (!imagesEmpty) {
      // console.log('in Lightbox, renderResponsiveImage inside if imagesEmpty: ', imagesEmpty);
      console.log('in Lightbox, renderResponsiveImage inside if imagesEmpty, index: ', clickedIndex);
      // console.log('in Lightbox, renderResponsiveImage inside if imagesEmpty, imageCount: ', imageIndexAndCount.imageCount);
      let width;

      if (this.state.windowWidth <= 650) {
        width = 400;
        // <img src={`http://res.cloudinary.com/chikarao/image/upload/w_${this.state.imageWidthWide},h_354/` + this.props.images[index].publicid + '.jpg'} alt="" />
      } else {
        width = 568;
      }
      // # of # save for when needed...
      // <span style={{ width }} className="lightbox-numbers">{this.state.imageIndex + 1} of {imageIndexAndCount}</span>
      return (
        <div className="lightbox-content">
        <div
          className="lightbox-image"
          style={{ background: `url(${this.createBackgroundImage(this.props.images[imageIndex].publicid, width)})`, width, height: width / WH_RATIO }}
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
  } // end of renderResponsiveImage

  renderLightbox() {
    const indexEmpty = _.isEmpty(this.props.imageIndex);
    if (this.props.images && !indexEmpty) {
    // if (this.props.images) {
      showHideClassName = this.props.show ? 'lightbox display-block' : 'lightbox display-none';
      console.log('in Lightbox, renderLightbox this.props.imageIndex:', this.props.imageIndex);
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
          {this.renderImage(this.props.imageIndex)}
        <button className="modal-close-button" onClick={this.handleClose.bind(this)}><i className="fa fa-window-close"></i></button>
        </div>
      );
    }
  }

  render() {
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
    // userProfile: state.auth.userProfile
    // initialValues: state.auth.userProfile
  };
}


export default connect(mapStateToProps, actions)(Lightbox);
