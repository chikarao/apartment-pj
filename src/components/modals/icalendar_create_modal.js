import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../../actions';
// import languages from '../constants/languages';

let showHideClassName;

class IcalendarCreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createIcalendarCompleted: false,
      selectedIcalendar: ''
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  // componentDidMount() {
  // }

  handleFormSubmit(data) {
    // const { code } = data;
    // this.setState({ selectedIcalendar: languages[code].name });
    const dataToBeSent = data;
    dataToBeSent.flat_id = this.props.flat.id;
    console.log('in IcalendarCreateModal, handleFormSubmit, dataToBeSent: ', dataToBeSent);
    this.props.showLoading();
    this.props.createIcalendar(dataToBeSent, () => {
      this.handleFormSubmitCallback();
    });
  }

  emptyInputFields() {
   const resetFields = { ical_url: '', name: '' }

    console.log('in IcalendarCreateModal, emptyInputFields: ');
    this.props.initialize(resetFields, true); //keepDirty = true;
  }


  handleFormSubmitCallback() {
    console.log('in IcalendarCreateModal, handleFormSubmitCallback: ');
    // showHideClassName = 'modal display-none';
    this.setState({ createIcalendarCompleted: true });
    // this.resetAdvancedFilters();
    this.emptyInputFields();
    this.props.showLoading();
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


  // turn off showIcalendarCreateModal app state
  handleClose() {
    if (this.props.showIcalendarCreate) {
      this.props.showIcalendarCreateModal();
      this.setState({ createIcalendarCompleted: false })
    }
  }

  renderCreateIcalendarForm() {
    const { handleSubmit } = this.props;
    // const profileEmpty = _.isEmpty(this.props.auth.userProfile);
    if (this.props.flat) {
      showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
      // console.log('in modal, render showHideClassName:', showHideClassName);
      // console.log('in modal, render this.props.show:', this.props.show);
      // console.log('in modal, render this.props:', this.props);
      return (
        <div className={showHideClassName}>
          <section className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          <h3 className="auth-modal-title">Create iCalendar</h3>
          {this.renderAlert()}
          <div className="edit-profile-scroll-div">
            <form onSubmit={handleSubmit(this.handleFormSubmit)}>
            <fieldset key={'ical_url'} className="form-group">
              <label className="create-flat-form-label">iCal URL:</label>
              <Field name="ical_url" component="input" type="string" className="form-control" placeholder="Ex. https://calendar.google.com/calendar/ical/8t...basic.ics" />
            </fieldset>
            <fieldset key={'name'} className="form-group">
              <label className="create-flat-form-label">iCalendar Name:</label>
              <Field name="name" component="input" type="string" className="form-control"  placeholder="Ex. My main calendar"/>
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

  renderPostCreateMessage() {
    showHideClassName = this.props.show ? 'modal display-block' : 'modal display-none';
    // showHideClassName = 'modal display-block';
    //handleClose is a prop passed from header when SigninModal is called
    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <button className="modal-close-button" onClick={this.handleClose}><i className="fa fa-window-close"></i></button>
          {this.renderAlert()}
          <div className="post-signup-message">An iCalendar has been successfully created for your listing.</div>
        </div>
      </div>
    )
  }

  render() {
    // const { handleSubmit, pristine, submitting, fields: { email, password } } = this.props;
    return (
      <div>
        {this.state.createIcalendarCompleted ? this.renderPostCreateMessage() : this.renderCreateIcalendarForm()}
      </div>
    );
  }
}

IcalendarCreateModal = reduxForm({
  form: 'IcalendarCreateModal'
})(IcalendarCreateModal);

// !!!!!! initialValues required for redux form to prepopulate fields
function mapStateToProps(state) {
  console.log('in iCalendar_create_modal, mapStateToProps, state: ', state);
  return {
    auth: state.auth,
    successMessage: state.auth.success,
    errorMessage: state.auth.error,
    flat: state.selectedFlatFromParams.selectedFlatFromParams,
    // userProfile: state.auth.userProfile
    // initialValues: state.auth.userProfile
    languages: state.languages,
    showIcalendarCreate: state.modals.showIcalendarCreateModal,
  };
}


export default connect(mapStateToProps, actions)(IcalendarCreateModal);
