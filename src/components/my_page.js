import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class MyPage extends Component {
  render() {
    return (
      <div>
        <h1>My Page</h1>
        <div>My Flats with create flat, show, delete, edit, reviews</div>
        <div>My Stays with show, delete</div>
        <div>My Bookings with show, delete</div>
        <div>My Messages with create, delete</div>
        <Link to="/createflat" className="create-flat"><button className="btn btn-primary btn-lg">Create Flat!</button></Link>
      </div>
    );
  }
}

export default MyPage;
