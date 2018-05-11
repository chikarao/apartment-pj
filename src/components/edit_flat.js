import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import * as actions from '../actions';
import Upload from './images/upload';


class EditFlat extends Component {
  componentDidMount() {
    console.log('in edit flat, componentDidMount, params', this.props.match.params);
    // gets flat id from params set in click of main_cards or infowindow detail click
    this.props.selectedFlatFromParams(this.props.match.params.id);
    this.props.getCurrentUser();
    // if (this.props.flat) {
    //   console.log('in edit flat, componentDidMount, editFlatLoad called');
    //   this.props.editFlatLoad(this.props.flat);
    // }
  }

  handleFormSubmit(data) {
    console.log('in edit flat, handleFormSubmit, data', data);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
        <strong>Ooops! </strong> {this.props.errorMessage}
        </div>
      );
    }
  }

  renderImages(images) {
    console.log('in edit flat, renderImages, images: ', images);
    return (
      _.map(images, (image) => {
        console.log('in show_flat renderImages, image: ', image.publicid);
        return (
            <div className="slide-show">
              <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + image.publicid + '.jpg'} />
            </div>
        );
      })
    );
  }


  renderEditForm() {
    const { handleSubmit } = this.props;

    if (this.props.flat) {
      console.log('in edit flat, renderEditForm, this.props: ', this.props);
      return (
        <div>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Street Address:</label>
            <Field name="address1" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">City:</label>
            <Field name="city" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">State:</label>
            <Field name="state" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Zip:</label>
            <Field name="zip" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Country:</label>
            <Field name="country" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Description:</label>
            <Field name="description" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Area:</label>
            <Field name="area" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Price Per Month:</label>
            <Field name="price_per_month" component="input" type="float" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Guests:</label>
            <Field name="guests" component="input" type="integer" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Sales Point:</label>
            <Field name="sales_point" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Rooms:</label>
            <Field name="rooms" component="input" type="float" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Beds:</label>
            <Field name="beds" component="input" type="integer" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Flat Type:</label>
            <Field name="flat_type" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Bath:</label>
            <Field name="bath" component="input" type="float" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Intro:</label>
            <Field name="intro" component="input" type="text" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Cancellation:</label>
            <Field name="cancellation" component="input" type="string" className="form-control" />
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Smoking:</label>
            <Field name="smoking" component="input" type="boolean" className="form-control" />
          </fieldset>
          {this.renderAlert()}
          <button action="submit" id="submit-all" className="btn btn-primary btn-lg">Submit Changes to Form</button>
        </form>

        <div className="edit-flat-image-box">
          <div id="carousel-show">
            {this.renderImages(this.props.flat.images)}
          </div>
        </div>

        <div>
          <Upload />
        </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div>{this.renderEditForm()}</div>
    );
  }
}

EditFlat = reduxForm({
  form: 'EditFlat'
  // fields: [
  //   'address1',
  //   'city',
  //   'zip',
  //   'country',
  //   'area',
  //   'price_per_day',
  //   'price_per_month',
  //   'guests',
  //   'sales_point',
  //   'description',
  //   'rooms',
  //   'beds',
  //   'flat_type',
  //   'bath'
  // ]
})(EditFlat);

// EditFlat = connect(
//   // console.log('in show_flat, EditFlat connect, state: ', state);
//   state => ({
//     initialValues: this.state.selectedFlatFromParams.selectedFlat // pull initial values from account reducer
//   }),
//   { actions } // bind account loading action creator
// )(EditFlat);

function mapStateToProps(state) {
  console.log('in show_flat, mapStateToProps, state: ', state);
  return {
    flat: state.selectedFlatFromParams.selectedFlat,
    selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    auth: state.auth,
    initialValues: state.selectedFlatFromParams.selectedFlat
  };
}

export default connect(mapStateToProps, actions)(EditFlat);
