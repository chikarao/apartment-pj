import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import _ from 'lodash';

import * as actions from '../actions';


class MyPage extends Component {
  componentDidMount() {
    this.props.getCurrentUserForMyPage((id) => this.fetchData(id));
    // if (this.props.flat) {
    //   console.log('in edit flat, componentDidMount, editFlatLoad called');
    //   this.props.editFlatLoad(this.props.flat);
    // }
    // this.props.fetchUserFlats(this.props.auth.id);
  }

  fetchData(id) {
    //callback from getCurrentUserForMyPageid
    console.log('in mypage, fetchData, this.props.auth.id: ', this.props.auth.id);
    console.log('in mypage, fetchData, callback from getCurrentUserForMyPageid: ', id);
    this.props.fetchFlatsByUser(id);
  }

  renderBookings() {
    return (
      <div>
        <div className="my-page-category-title">Bookings</div>
        <ul>
          <li className="my-page-each-card"></li>
          <li className="my-page-each-card"></li>
          <li className="my-page-each-card"></li>
          <li className="my-page-each-card"></li>
          <li className="my-page-each-card"></li>
          <li className="my-page-each-card"></li>
        </ul>

      </div>
    );
  }

  // renderFlatDetails(flat) {
  //   return (
  //     <div>{flat.id}</div>
  //   );
  // }

  handleFlatCardClick(event) {
    console.log('in mypage, handleFlatCardClick, clicked, event: ', event.target);
    const clickedElement = event.target;
    const elementVal = clickedElement.getAttribute('value');
    console.log('in mypage, handleFlatCardClick, clicked, elementVal: ', elementVal);
    this.props.history.push(`/show/${elementVal}`);
  }

  renderEachFlat() {
    // const { flats } = this.props;

    if (this.props.flats) {
      const { flats } = this.props;
      console.log('in mypage, renderEachFlat, flats: ', flats);
      return _.map(flats, (flat, index) => {
        console.log('in mypage, renderEachFlat, flat.id: ', flat.id);
        console.log('in mypage, renderEachFlat, flat.desription: ', flat.description);
        return (
          <li key={index} className="my-page-each-card">
            <div value={flat.id} className="my-page-each-card-click-box" onClick={this.handleFlatCardClick.bind(this)}>
              <img src={"http://res.cloudinary.com/chikarao/image/upload/v1524032785/" + flat.images[0].publicid + '.jpg'} />
              <div className="my-page-flat-details">
                <ul>
                  <li>{flat.description}</li>
                  <li>{flat.area}</li>
                  <li>${parseFloat(flat.price_per_month).toFixed(0)}</li>
                  <li>id: {flat.id}</li>
                </ul>

              </div>
            </div>
            <div className="my-page-flats-button-box">
              <button className="btn btn-danger btn-sm">Delete</button>
              <button className="btn btn-sm btn-edit">Edit</button>
            </div>
          </li>
        );
      });
    }
  }

  renderFlats() {
    return (
      <div>
        <div className="my-page-category-title">Flats</div>
        <ul>
        {this.renderEachFlat()}
        </ul>
      </div>
    );
  }

  renderOwnBookings() {
    return (
      <div>
      <div className="my-page-category-title">Own Bookings</div>
      <ul>
        <li className="my-page-each-card"></li>
        <li className="my-page-each-card"></li>
        <li className="my-page-each-card"></li>
        <li className="my-page-each-card"></li>
        <li className="my-page-each-card"></li>
        <li className="my-page-each-card"></li>
      </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h2>My Page</h2>
        <div className="container my-page-container">
          <div className="row">
            <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderBookings()}</div>
            <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderFlats()}</div>
            <div className="my-page-category-container col-xs-12 col-sm-3">{this.renderOwnBookings()}</div>
        </div>
        </div>
        <Link to="/createflat" className="btn-create-flat"><button className="btn btn-primary btn-lg btn-create-flat">List a New Flat!</button></Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in mypage, mapStateToProps, state: ', state);
  return {
    flat: state.selectedFlatFromParams.selectedFlat,
    flats: state.flats,
    selectedBookingDates: state.selectedBookingDates.selectedBookingDates,
    auth: state.auth,
    initialValues: state.selectedFlatFromParams.selectedFlat
  };
}

export default connect(mapStateToProps, actions)(MyPage);
