import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';

import * as actions from '../actions';


class MyPage extends Component {
  componentDidMount() {
    this.props.getCurrentUser();
    console.log('in mypage, componentDidMount: ');
    // if (this.props.flat) {
    //   console.log('in edit flat, componentDidMount, editFlatLoad called');
    //   this.props.editFlatLoad(this.props.flat);
    // }
  }
  render() {
    return (
      <div>
        <h1>My Page</h1>
        <div>My Flats with create flat, show, delete, edit, reviews</div>
        <div>My Stays with show, delete</div>
        <div>My Bookings with show, delete</div>
        <div>My Messages with create, delete</div>
        <Link to="/createflat" className="btn-create-flat"><button className="btn btn-primary btn-lg btn-create-flat">List a New Flat!</button></Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in mypage, mapStateToProps, state: ', state);
  return {
    flat: state.selectedFlatFromParams.selectedFlat,
    selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    auth: state.auth,
    initialValues: state.selectedFlatFromParams.selectedFlat
  };
}

export default connect(mapStateToProps, actions)(MyPage);
