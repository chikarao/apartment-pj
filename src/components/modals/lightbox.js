import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';

let showHideClassName;

class Lightbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0,
      windowWidth: window.innerWidth,
    };
  }

  componentDidMount() {
       window.addEventListener('resize', this.handleResize.bind(this));
   }

   componentWillUnmount() {
       window.removeEventListener('resize', this.handleResize.bind(this));
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
    this.props.showLightbox();
  }

  renderResponsiveImage(id) {
    // console.log('in Lightbox, renderResponsiveImage, id: ', id);
    // console.log('in Lightbox, renderResponsiveImage this.props.images: ', this.props.images);
    const imageToRender = []

    _.each(this.props.images, image => {
      if (image.id == id) {
        // console.log('in Lightbox, renderResponsiveImage each if image: ', image);
        imageToRender.push(image);
      }
    });
    const imagesEmpty = _.isEmpty(imageToRender);
    // console.log('in Lightbox, renderResponsiveImage imageToRender: ', imageToRender);
    // console.log('in Lightbox, renderResponsiveImage outside if imagesEmpty: ', imagesEmpty);

    if (!imagesEmpty) {
      if (this.state.windowWidth <= 750) {
          // console.log('in Lightbox, renderResponsiveImage inside if imagesEmpty: ', imagesEmpty);
        return (
          <div className="lightbox-content">
          <img src={'http://res.cloudinary.com/chikarao/image/upload/w_330,h_210/' + imageToRender[0].publicid + '.jpg'} alt="" />
          </div>
        );
      } else {
        return (
          <div className="lightbox-content">
          <img src={'http://res.cloudinary.com/chikarao/image/upload/w_568,h_354/' + imageToRender[0].publicid + '.jpg'} alt="" />
          </div>
        );
      }
    }
  } // end of renderResponsiveImage

  renderLightbox() {
    if (this.props.images) {
      showHideClassName = this.props.show ? 'lightbox display-block' : 'lightbox display-none';
      // console.log('in Lightbox, renderLightbox showHideClassName:', showHideClassName);
      // console.log('in Lightbox, renderLightbox this.props.show:', this.props.show);
      // console.log('in Lightbox, renderLightbox this.props:', this.props);
      // console.log('in Lightbox, renderLightbox this.props.imageId:', this.props.imageId);
      // console.log('in Lightbox, renderLightbox this.props.images[0]: ', this.props.images[0]);
      const imageIndex = 0;
      // console.log('in Lightbox, renderLightbox this.props.images[this.props.imageIndex]:', this.props.images[this.props.imageIndex].publicid);
      // console.log('in Lightbox, renderLightbox this.props.images[this.state.imageIndex]:', this.props.images[this.state.imageIndex].publicid);
      const index = this.props.imageIndex;
      //handleClose is a prop passed from header when SigninModal is called
      return (
        <div className={showHideClassName} onClick={this.handleLightboxAreaClick.bind(this)}>
          {this.renderResponsiveImage(this.props.imageId)}
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
