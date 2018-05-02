import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';

import * as actions from '../actions';
import Carousel from './carousel/carousel';

import DatePicker from './date_picker/date_picker';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });


class ShowFlat extends Component {
  componentDidMount() {
    this.props.selectedFlatFromParams(this.props.match.params.id);
  }


  renderFlat(flatId) {
    console.log('in show flat, flatId: ', flatId);
    console.log('in show flat, flat: ', this.props.flat);
    // const flat = _.find(this.props.flats, (f) => {
    //   return f.id === flatId;
    // });
    // console.log('in show flat, flat: ', flat.description);
    const flatEmpty = _.isEmpty(this.props.flat);
    console.log('in show_flat renderFlat, flat empty: ', flatEmpty);


      if (!flatEmpty) {
        const { description, area, price_per_month, images } = this.props.flat;
        console.log('in show_flat renderFlat, renderImages: ', renderImages(images));
        return (
          <div>
            <div className="show-flat-image-box">
              <div id="carousel-show">
                {renderImages(images)}
              </div>
            </div>
            <div className="show-container">
              <div>
                { description }
              </div>

              <div>
                { area }
              </div>

              <div>
                ${ parseFloat(price_per_month).toFixed(0) }
              </div>
              <div>
                ID: {this.props.match.params.id}
              </div>

            </div>

          </div>
        );
      } else {
        return (
          <div>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <div className="spinner">Loading flat...</div>
          </div>
        );
      }
    }

  handleBookingClick() {
    console.log('in show_flat handleBookingClick, this.props.selectedBookingDates: ', this.props.selectedBookingDates);
    if (this.props.selectedBookingDates) {
      console.log('in show_flat handleBookingClick, this.props.selectedBookingDates: ', this.props.selectedBookingDates);
      console.log('in show_flat handleBookingClick, this.props.flat: ', this.props.flat);
      const bookingRequest = { flatId: this.props.flat.id, user: this.props.auth.email, to: this.props.selectedBookingDates.to, from: this.props.selectedBookingDates.from}
      console.log('in show_flat handleBookingClick, bookingRequest: ', bookingRequest);

    }
  }

  renderDatePicker() {
    return (
      <div className="date-picker-container">
      <p>Please select a range of dates:</p>
        <DatePicker />
      </div>
    );
  }

  render() {
    if (this.props.selectedDates) {
    }
    return (
      <div>
        <div>
          {this.renderFlat(this.props.match.params.id)}
        </div>
        {this.renderDatePicker()}
        <button onClick={this.handleBookingClick.bind(this)} className="btn btn-primary">Book Now</button>
      </div>
    );
  }
}

function renderImages(images) {
  console.log('in show_flat renderImages, images: ', images);
  return (
    _.map(images, (image) => {
      console.log('in show_flat renderImages, image: ', image.publicid);
      return (
          <div className="slide-show">
            <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + image.publicid + '.jpg'} />
            <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + image.publicid + '.jpg'} />
          </div>
      );
    })
  );
}

function mapStateToProps(state) {
  console.log('in show_flat render, mapStateToProps, state: ', state);
  return {
    flat: state.flatFromParams.selectedFlat,
    selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    auth: state.auth
  };
}

export default connect(mapStateToProps, actions)(ShowFlat);
