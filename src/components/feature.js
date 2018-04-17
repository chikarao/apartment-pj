import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import sha1 from 'sha1';

import * as actions from '../actions';
import GoogleMap from './google_map';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const publicId = ['RPP9419_mp7xjn', 'redbrick_bklymp', 'dewhirst_electric_co_lofts-01_oxgife'];
const maxImagesIndex = publicId.length - 1;

class Feature extends Component {
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

  componentWillMount() {
    this.props.fetchMessage();
  }

  createBackgroundImage(publicId) {
    const width = 400;
    const t = new cloudinary.Transformation();
    t.angle(0).crop('scale').width(width).aspectRatio('1:1');
    return cloudinaryCore.url(publicId, t);
  }

  handleDrop = files => {
  // Push all the axios request promise into a single array
  const uploaders = files.map((file, index) => {
      console.log(file);
    // Initial FormData
    const formData = new FormData();
    const apiSecret = API_SECRET;
    const timeStamp = (Date.now() / 1000) | 0;
    const publicID = `flat_image-${timeStamp}-${index}`;
    const eager = 'w_400,h_300,c_pad|w_260,h_200,c_crop';
    const signaturePreSha1 =
    `eager=${eager}&public_id=${publicID}&timestamp=${timeStamp}${apiSecret}`;
    const signatureSha1 = sha1(signaturePreSha1);

    formData.append('timestamp', timeStamp);
    formData.append('public_id', publicID);
    formData.append('api_key', API_KEY);
    formData.append('eager', eager);
    formData.append('file', file);
    formData.append('signature', signatureSha1);
    // formData.append('tags', `chikarao, medium, gist`);
    // formData.append('upload_preset', 'chikarao'); // Replace the preset name with your own

    // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)

    // console.log('api_key: ', formData.get('api_key'));
    console.log('timestamp: ', formData.get('timestamp'));
    console.log('public id: ', formData.get('public_id'));
    // console.log('formData api_key: ', formData.get('api_key'));
    console.log('formData eager: ', formData.get('eager'));
    console.log('formData file: ', formData.get('file'));
    console.log('signature: ', formData.get('signature'));

    return axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then(response => {
      // const data = response.data;
      const filePublicId = response.data.public_id;
      // You should store this URL for future references in your app
      console.log(response.data.public_id);
    });
  });
  console.log('uploaders: ', uploaders);
  // Once all the files are uploaded
  axios.all(uploaders).then(() => {
    // ... perform after upload is successful operation
  });
}

handleCardClick(event) {
  console.log('event.target.className: ', event.target.className);
  const wasParentClicked = event.target.className === 'card-cover' || event.target.className === 'card';
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

  render() {
    const transformation = new cloudinary.Transformation();
    transformation.width(300).crop('scale');
    // return <div>{this.props.message}</div>;

    return (
      <div>
        <div className="container" id="map">
          <GoogleMap />
        </div>
        <div className="container main-card-container">
          <div className="row card-row">
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
            <div className="card-container col-xs-12 col-sm-3">
              <div
                className="card-image"
                style={{ background: `url(${this.createBackgroundImage(publicId[1])})` }}
              >
                <div className="card">
                  <div className="card-cover">
                    Lots of museums close by!
                  </div>
                </div>
                <div className="card-details">
                  <div className="card-flat-caption">
                    Cool factory building in the Village
                  </div>
                  <div className="card-flat-price">
                    $3,000 per month
                  </div>
                </div>
              </div>

            </div>
            <div className="card-container col-xs-12 col-sm-3">
            <div
              className="card-image"
              style={{ background: `url(${this.createBackgroundImage(publicId[2])})` }}
            >
              <div className="card">
                <div className="card-cover">
                  Nice cafes in the area!
                </div>
              </div>
              <div className="card-details">
                <div className="card-flat-caption">
                  Awesome former tofu store in Daikanyama
                </div>
                <div className="card-flat-price">
                  $2,000 per month
                </div>
              </div>
            </div>

            </div>

          </div>
        </div>

        <div className="dropzone-area">
          <Dropzone
            onDrop={this.handleDrop}
            multiple
            accept="image/*"
            // className="dropzone"
          // style={styles.dropzone}
          >
            <p>Drop your files or <br/>click here <br/>to upload</p>
            <i className="fa fa-image"></i>
          </Dropzone>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message };
}

export default connect(mapStateToProps, actions)(Feature);
