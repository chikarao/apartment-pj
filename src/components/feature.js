import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import GoogleMap from './google_map';
import Upload from './images/upload';
import MainCards from './cards/main_cards';

class Feature extends Component {

  componentWillMount() {
    this.props.fetchMessage();
  }

  render() {
    // return <div>{this.props.message}</div>;
    return (
      <div>

        <div className="container" id="map">
          <GoogleMap />
        </div>

        <div className="container main-card-container">
          <div className="row card-row">
            <MainCards />
          </div>
        </div>

        <Upload />

      </div>
    );
  }
}

function mapStateToProps(state) {
  return { message: state.auth.message };
}

export default connect(mapStateToProps, actions)(Feature);
