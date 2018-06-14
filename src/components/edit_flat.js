import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';

import * as actions from '../actions';
import Upload from './images/upload';

let deleteImageArray = [];

class EditFlat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // confirmChecked: false
      confirmChecked: false
    };
  }
// reference for checkbox
//https://www.w3schools.com/howto/howto_css_custom_checkbox.asp

  componentDidMount() {
    console.log('in edit flat, componentDidMount, this.props.match.params:', this.props.match.params);
    // gets flat id from params set in click of main_cards or infowindow detail click
    this.props.selectedFlatFromParams(this.props.match.params.id);
    this.props.getCurrentUser();
    console.log('in edit flat, componentDidMount, this.state.handleConfirmCheck: ', this.state.confirmChecked);
    // if (this.props.flat) {
    //   console.log('in edit flat, componentDidMount, editFlatLoad called');
    //   this.props.editFlatLoad(this.props.flat);
    // }
  }

  handleFormSubmit(data) {
    console.log('in edit flat, handleFormSubmit, data: ', data);
    if (this.state.confirmChecked) {
      this.props.editFlat(data, (id) => this.editFlatCallback(id));
      this.props.showLoading();
    } else {
      console.log('in edit flat, handleFormSubmit, checkbox not checked: ');
      window.alert('Please check box to confirm your inputs then push submit')
    }
  }

  editFlatCallback(id) {
    console.log('in edit flat, editFlatCallback, id: ', id);
    // this.props.history.push(`/editflat/${id}`);
    //for some reason, history.push does not update the default values in fields
    // reload page; fetches new flat data
    this.props.showLoading();
    document.location.reload()
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

  handleImageDeleteCheck(event) {
    // reference: https://stackoverflow.com/questions/7378228/check-if-an-element-is-present-in-an-array
    console.log('in edit flat, handleImageDeleteCheck, event.target: ', event.target.value);
    // const parent = event.target.parentElement;
    // const parentElement = parent.parentElement;
    // console.log('in edit flat, handleImageDeleteCheck, parentElement: ', parent);
    // console.log('in edit flat, handleImageDeleteCheck, parentElement: ', parentElement);
    const includesImage = deleteImageArray.includes(event.target.value);
    if (!includesImage) {
      deleteImageArray.push(event.target.value);
      // parentElement.style.backgroundColor = 'LightSkyBlue';
    } else {
      deleteImageArray = _.without(deleteImageArray, event.target.value);
    }
    console.log('in edit flat, handleImageDeleteCheck, deleteImageArray: ', deleteImageArray);
  }

  uncheckAllImages() {
    //reference: https://stackoverflow.com/questions/18862149/how-to-uncheck-a-checkbox-in-pure-javascript
    deleteImageArray = [];
    console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);

    const ImageDeleteCheckBoxes = document.getElementsByClassName('editFlatImageDeleteCheck');
    // console.log('in edit flat, uncheckAllImages, ImageDeleteCheckBoxes: ', ImageDeleteCheckBoxes);

    _.each(ImageDeleteCheckBoxes, (checkbox) => {
      checkbox.checked = false;
      console.log('in edit flat, uncheckAllImages, in each, checkbox: ', checkbox);
    });
    console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);
  }

  checkAllImages() {
    console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);

    // const ImageDeleteCheckBoxes = document.getElementsByClassName('checkmarkDeleteImage');
    // const ImageDeleteCheckBoxes = document.getElementById('editFlatImageDeleteCheck');
    const ImageDeleteCheckBoxes = document.getElementsByClassName('editFlatImageDeleteCheck');
    // ImageDeleteCheckBoxes.checked = false;
    console.log('in edit flat, uncheckAllImages, ImageDeleteCheckBoxes: ', ImageDeleteCheckBoxes);

    _.each(ImageDeleteCheckBoxes, (checkbox) => {
      checkbox.checked = true;
      console.log('in edit flat, uncheckAllImages, in each, checkbox: ', checkbox.value);
      deleteImageArray.push(checkbox.value)
    });
    console.log('in edit flat, uncheckAllImages, deleteImageArray: ', deleteImageArray);
  }

  deleteImageCallback(imageCount) {
    console.log('in edit flat, deleteImageCallback, deleteImageArray: ', deleteImageArray);
    const currentImageCount = imageCount + 1;
    if (currentImageCount <= (deleteImageArray.length - 1)) {
      this.props.deleteImage(deleteImageArray[currentImageCount], currentImageCount, (countCB) => this.deleteImageCallback(countCB));
    } else {
      this.props.history.push(`/editflat/${this.props.flat.id}`);
      deleteImageArray = [];
      this.props.showLoading();
    }
  }

  deleteCheckedImages() {
    this.props.showLoading();
    console.log('in edit flat, deleteCheckedImages, deleteImageArray: ', deleteImageArray);
    const imageArrayEmpty = _.isEmpty(deleteImageArray);
    if (imageArrayEmpty) {
      window.alert('No images checked')
      return;
    }
    let imageCount = 0;

    const deleteConfirm = window.confirm(`Are you sure you want to delete all checked images?`)
    if (deleteConfirm) {
      console.log('in edit flat, deleteCheckedImages, deleteConfirm Yes.');
      // _.each(deleteImageArray, (image) => {
        this.props.deleteImage(deleteImageArray[imageCount], imageCount, (countCB) => this.deleteImageCallback(countCB));
        console.log('in edit flat, deleteCheckedImages, image:', deleteImageArray[imageCount]);
      // });
    } else {
      console.log('in edit flat, deleteCheckedImages, deleteConfirm No.');
    }
  }

  renderDeleteImageButtons() {
    console.log('in edit flat, renderDeleteImageButtons: ');
    return (
      <div>
      <button className="btn btn-danger btn-sm btn-delete-all-images" onClick={this.deleteCheckedImages.bind(this)}>Delete checked images</button>
      <button className="btn btn-secondary btn-sm btn-uncheck-all-images" onClick={this.uncheckAllImages.bind(this)}>Uncheck all images</button>
      <button className="btn btn-primary btn-sm btn-check-all-images" onClick={this.checkAllImages.bind(this)}>Check all images</button>
      </div>
    );
  }

  renderImages(images) {
    console.log('in edit flat, renderImages, images: ', images);
    // reference: https://stackoverflow.com/questions/8877807/how-can-i-display-the-checkbox-over-the-images-for-selection
    const imagesEmpty = _.isEmpty(images);
    if(!imagesEmpty) {
      return (
        _.map(images, (image) => {
          console.log('in show_flat renderImages, image: ', image.publicid);
          return (
            <div key={image.id} className="slide-show-edit-flat">
              <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + image.publicid + '.jpg'} />
                <label className="delete-image-radio">
                <input type="checkbox" value={image.id} className="editFlatImageDeleteCheck" onChange={this.handleImageDeleteCheck.bind(this)} />
              <span className="checkmarkDeleteImage"></span>
              </label>
            </div>
          );
        })
      );
    } else {
      return (
        <div className="no-results-message">Images are not available for this flat</div>
      );
    }
  }

  handleConfirmCheck(event) {
  // Get the checkbox
    const checkBox = document.getElementById('editFlatConfirmCheck');

    this.setState({ confirmChecked: !this.state.confirmChecked }, () => console.log('in edit flat, myfunction, handleConfirmCheck, this.state.confirmChecked: ', this.state.confirmChecked));
  }


  renderEditForm() {
    const { handleSubmit } = this.props;
    const flatEmpty = _.isEmpty(this.props.flat);
    console.log('in edit flat, renderEditForm, flatEmpty: ', flatEmpty);
    console.log('in edit flat, renderEditForm, this.props.flat: ', this.props.flat);

    if (!flatEmpty) {
      console.log('in edit flat, renderEditForm, this.props: ', this.props);
      return (
        <div>
        <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Street Address:</label>
            <div className="edit-flat-address">{this.props.flat.address1}</div>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">City:</label>
          <div className="edit-flat-address">{this.props.flat.city}</div>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">State:</label>
            <div className="edit-flat-address">{this.props.flat.state}</div>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Zip:</label>
            <div className="edit-flat-address">{this.props.flat.zip}</div>
          </fieldset>
          <fieldset className="form-group">
            <label className="create-flat-form-label">Country:</label>
            <div className="edit-flat-address">{this.props.flat.country}</div>
          </fieldset>
          <span>* To edit address please delete flat and create a new one</span>
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
          <div className="confirm-change-and-button">
            <label className="confirm-radio"><i className="fa fa-check fa-lg"></i>  Check to confirm changes then submit
              <input type="checkbox" id="editFlatConfirmCheck" value={this.state.confirmChecked} onChange={this.handleConfirmCheck.bind(this)} />
              <span className="checkmark"></span>
            </label>
            <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">Submit</button>
          </div>
        </form>

        <div className="edit-flat-image-box">
          <div id="carousel-show-edit-flat">
            {this.renderImages(this.props.flat.images)}
          </div>
          <div className="delete-image-buttons">
            {this.renderDeleteImageButtons()}
          </div>
        </div>

        <div>
          <Upload
            flatId={this.props.flat.id}
          />
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

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in show_flat, mapStateToProps, state: ', state);
  return {
    flat: state.selectedFlatFromParams.selectedFlatFromParams,
    selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    auth: state.auth,
    initialValues: state.selectedFlatFromParams.selectedFlatFromParams
  };
}

export default connect(mapStateToProps, actions)(EditFlat);
