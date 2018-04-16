import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';

import * as actions from '../actions';
import GoogleMap from './google_map';

const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: 'chikarao' });


class Feature extends Component {
  componentWillMount() {
    this.props.fetchMessage();
  }

  createBackgroundImage(publicId) {
    const width = 400;
    const t = new cloudinary.Transformation();
    t.angle(0).crop('scale').width(width).aspectRatio('1:1');
    return cloudinaryCore.url(publicId, t);
  }


  render() {
    const publicId = ['RPP9419_mp7xjn', 'redbrick_bklymp', 'dewhirst_electric_co_lofts-01_oxgife'];
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
            <div
              className="card-container col-xs-12 col-sm-3"
              style={{ background: `url(${this.createBackgroundImage(publicId[0])})` }}
            >
              <div className="card">
                <div className="card-detail">
                  Hello
                </div>
              </div>
            </div>
            <div
              className="card-container col-xs-12 col-sm-3"
              style={{ background: `url(${this.createBackgroundImage(publicId[1])})` }}
            >
              <div className="card">
                <div className="card-detail">
                  Hello
                </div>
              </div>
            </div>
            <div
              className="card-container col-xs-12 col-sm-3"
              style={{ background: `url(${this.createBackgroundImage(publicId[2])})` }}
            >
              <div className="card">
                <div className="card-detail">
                  Hello
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message };
}

export default connect(mapStateToProps, actions)(Feature);
