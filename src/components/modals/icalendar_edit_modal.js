import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
import languages from '../constants/languages';

let showHideClassName;

class IcalendarEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editIcalendarCompleted: false,
      deleteIcalendarCompleted: false,
      selectedIcalendarId: ''
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleDeleteIcalendarClick = this.handleDeleteIcalendarClick.bind(this);
  }
  //
  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    // const { code } = data;
    // this.setState({ selectedLanguage: languages[code].name });
    const dataToBeSent = data;
    dataToBeSent.flat_id = this.props.flat.id;
    console.log('in IcalendarEditModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.updateIcalendar(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  handleFormSubmitCallback() {
    console.log('in IcalendarEditModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ editIcalendarCompleted: true });
    // this.resetAdvancedFilters();
    // this.emptyInputFields();
    this.props.showLoading();
  }

  handleDeleteIcalendarClick(event) {
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    const elementName = clickedElement.getAttribute('name');
    console.log('in show_flat, handleDeleteIcalendarClick, elementVal: ', elementVal);
    this.props.showLoading();
    this.setState({ languageCode: elementName });
    this.props.deleteIcalendar({ id: elementVal, flat_id: this.props.flat.id }, () => this.handleDeleteCallback());
  }

  handleDeleteCallback() {
    this.setState({ deleteIcalendarCompleted: true, editIcalendarCompleted: true, selectedIcalendarId: '' }, () => {
      this.props.showLoading()
    });
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

  // turn off showIcalendarEditModal app state
  // set component state so that it shows the right message or render the edit modal;
  handleClose() {
    if (this.props.showIcalendarEdit) {
      this.props.showIcalendarEditModal();
      this.setState({ editIcalendarCompleted: false, deleteIcalendarCompleted: false });
    }
  }

  renderEditIcalendarForm() {
    const { handleSubmit } = this.props;

    if (this.props.calendar) {
      // console.log('in show_flat, renderEditIcalendarForm, this.props.calendar: ', this.props.calendar);
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';

      return (
        <div className={showHideClassName}>
          <section className="modal-main">

            <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
            <h3 className="auth-modal-title">Edit iCalendar</h3>

            <div className="edit-profile-scroll-div">
              <div className="edit-flat-delete-language-button">
                <button value={this.props.calendar.id} className="btn btn-danger btn-sm edit-language-delete-button" onClick={this.handleDeleteIcalendarClick}>Delete</button>
              </div>
              {this.renderAlert()}
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>
              <fieldset key={'ical_url'} className="form-group">
                <label className="create-flat-form-label">iCalendar URL:</label>
                <Field name="ical_url" component="input" type="string" className="form-control" />
              </fieldset>
              <fieldset key={'name'} className="form-group">
                <label className="create-flat-form-label">Calendar Name:</label>
                <Field name="name" component="input" type="string" className="form-control" />
              </fieldset>
              <div className="confirm-change-and-button">
                <button action="submit" id="submit-all" className="btn btn-primary btn-lg submit-button">Submit</button>
              </div>
              </form>
            </div>
          </section>
        </div>
      );
    }
  }


  renderPostEditDeleteMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          {this.state.deleteIcalendarCompleted ?
            <div className="post-signup-message">The iCalendar has been deleted.</div>
            :
            <div className="post-signup-message">The iCalendar has been successfully updated.</div>
          }
        </div>
      </div>
    )
  }
  // render the form or a message based on whether edit language (including delete) has been completed
  render() {
    return (
      <div>
        {this.state.editIcalendarCompleted ? this.renderPostEditDeleteMessage() : this.renderEditIcalendarForm()}
      </div>
    );
  }
}
// enableReinitialize allow for edit modals to be closed and open with new initialValue props.
IcalendarEditModal = reduxForm({
  form: 'IcalendarEditModal',
  enableReinitialize: true
})(IcalendarEditModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in IcalendarEditModal, mapStateToProps, state: ', state);
  // get clicked calendar
  const calendarArray = [];
  if (state.selectedFlatFromParams.selectedFlatFromParams) {
    const { calendars } = state.selectedFlatFromParams.selectedFlatFromParams;
    const { selectedIcalendarId } = state.modals;
    // console.log('in IcalendarEditModal, mapStateToProps, calendars, selectedIcalendarId: ', calendars, selectedIcalendarId);
    _.each(calendars, calendar => {
      if (calendar.id == selectedIcalendarId) {
        calendarArray.push(calendar);
      }
    })
  }
  // console.log('in IcalendarEditModal, mapStateToProps, calendarArray[0]: ', calendarArray[0]);
  // const calendars = state.selectedFlatFromParams.selectedFlatFromParams.calendars
  // const calendar =
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    flat: state.selectedFlatFromParams.selectedFlatFromParams,
    // userProfile: state.auth.userProfile
    // initialValues: state.auth.userProfile
    // languages: state.languages,
    showIcalendarEdit: state.modals.showIcalendarEditModal,
    // get the first calendar in array to match selectedIcalendarId
    calendar: calendarArray[0],
    // language: state.languages.selectedLanguage,
    // set initialValues to be first calendar in array to match selectedIcalendarId
    initialValues: calendarArray[0]
  };
}


export default connect(mapStateToProps, actions)(IcalendarEditModal);
