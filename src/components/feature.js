import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as actions from '../actions';
import GoogleMap from './google_map';
import Upload from './images/upload';
import MainCards from './cards/main_cards';

// const publicId = ['RPP9419_mp7xjn', 'redbrick_bklymp', 'dewhirst_electric_co_lofts-01_oxgife', 'flat_image-1523948892-1', 'flat_image-1523948892-0'];


class Feature extends Component {

  componentDidMount() {
    // let index = 1;
    // console.log('in feature componentDidMount, index: ', index);

    // Set up initial mapBounds to make Mapbounds not undefined in action fetchFlats
    // When able to obtain user location or search location, enter initial position here
    // SF Transamerica touwer
    const initialPosition = {
      lat: 37.7952,
      lng: -122.4029
    };

    // initial position offsets; based on zoom twelve of
    //SF area showing tip of marin counth, tip of the sf peninsula, and tip of oakland
    // const latOffsetNorth = 0.06629999999999825;
    // const latOffsetSouth = -0.036700000000003286;
    // const lngOffsetWest = -0.13469999999999516;
    // const lngOffsetEast = 0.11589000000000738;
    // wider offsets; reaches Oakland
    const latOffsetNorth = 0.06629999999999825;
    const latOffsetSouth = -0.036700000000003286;
    const lngOffsetWest = -0.14;
    const lngOffsetEast = 0.2;
    // const latOffsetNorth = 37.8615 - initialPosition.lat; //about .07
    // const latOffsetSouth = 37.7585 - initialPosition.lat; // about -.04
    // const lngOffsetWest = -122.28701 - initialPosition.lng; //about .12
    // const lngOffsetEast = -122.5376 - initialPosition.lng; // about -.13

    console.log('in feature componentDidMount, Offsets, north, south, east, west: ', latOffsetNorth, latOffsetSouth, lngOffsetEast, lngOffsetWest);

    const mapBounds = {
      east: (initialPosition.lng + lngOffsetEast),
      west: (initialPosition.lng + lngOffsetWest),
      north: (initialPosition.lat + latOffsetNorth),
      south: (initialPosition.lat + latOffsetSouth)
    };

    this.props.startUpIndex();
    //initial call of fetchFlats to get initial set of flats
    this.props.fetchFlats(mapBounds);
    // if (this.props.flats) {
    //   this.setState({ isFetching: false });
    // }
    // index = index + 1;
    // console.log('in feature componentDidMount, index after running: ', index);
  }

  // componentWillReceiveProps() {
  // }
  calculateLatLngAve(flats) {
    let totalLat = 0;
    let totalLng = 0;
    let totalNumFlats = 0;
    _.map(flats, (flat) => {
      if (flat.lat && flat.lng) {
        totalLat += flat.lat;
        totalLng += flat.lng;
        totalNumFlats++;
      }
    });
    const aveLat = totalLat / totalNumFlats;
    const aveLng = totalLng / totalNumFlats;
    return (
      {
        lat: aveLat,
        lng: aveLng
      }
    );
  }

  renderMap() {
    const flatsEmpty = _.isEmpty(this.props.flats);
    const mapDimensionsEmpty = _.isEmpty(this.props.mapDimensions);
    console.log('in feature renderMap, flats empty: ', flatsEmpty);
    console.log('in feature renderMap, mapDimensions empty: ', mapDimensionsEmpty);


    if (!flatsEmpty) {
      if (!mapDimensionsEmpty) {
        console.log('in feature, renderMap this.props.mapDimensions, mapBounds: ', this.props.mapDimensions.mapDimensions.mapBounds);
        console.log('in feature, this.props.mapDimensions, mapCenter.lat: ', this.props.mapDimensions.mapDimensions.mapCenter.lat());
        console.log('in feature, this.props.mapDimensions, mapCenter.lng: ', this.props.mapDimensions.mapDimensions.mapCenter.lng());
        console.log('in feature, this.props.mapDimensions, mapZoom: ', this.props.mapDimensions.mapDimensions.mapZoom);
      }
      // const { id } = this.props.flats[0];
      // console.log('in feature renderFlats, id: ', id);
      console.log('here is the average lat lng, feature from calculateLatLngAve: ', this.calculateLatLngAve(this.props.flats));
      const latLngAve = this.calculateLatLngAve(this.props.flats);
      console.log('here is latLngAve: ', latLngAve);

      return (
        <div>
          <GoogleMap
          flatsEmpty={flatsEmpty}
          flats={this.props.flats}
          initialPosition={latLngAve}
          currency='$'
          />
        </div>
      );
      // <div>{console.log('in div: ', flats)}</div>
    } else if (!mapDimensionsEmpty) {
      // return <div>Map Goes Here</div>;
      const emptyMapLatLngCenter = {
        lat: this.props.mapDimensions.mapDimensions.mapCenter.lat(),
        lng: this.props.mapDimensions.mapDimensions.mapCenter.lng()
      };
      return (
        <div>
          <GoogleMap
           flatsEmpty={flatsEmpty}
           flats={flatsEmpty ? this.props.flats : emptyMapLatLngCenter}
           // initialPosition={emptyMapLatLngCenter}
           initialZoom={this.props.mapDimensions.mapDimensions.mapZoom}
          />
        </div>
      );
    } else {
      return (
        <div>
          <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
          <div className="spinner">Loading...</div>
        </div>
      );
    }
  }

  renderFlats() {
    let index = 1;
    console.log('in feature renderFlats, flats data length: ', this.props.flats);
    const flatsEmpty = _.isEmpty(this.props.flats);
    const mapDimensionsEmpty = _.isEmpty(this.props.mapDimensions);
    console.log('in feature renderFlats, flats empty: ', flatsEmpty);
    console.log('in feature renderFlats, this.props.startUpCount.startUpCount: ', this.props.startUpCount.startUpCount);
    // const randomNum = _.random(0, 1);
    // console.log('in feature renderFlats, randomNum: ', randomNum);

      // if (!flatsEmpty && randomNum === 1) {
      if (!flatsEmpty) {
        // console.log('in feature renderFlats, this.props.flats.rooms: ', this.props.flats.rooms);
        // const { id } = this.props.flats[0];
        // console.log('in feature renderFlats, id: ', id);
        const flats = this.props.flats;

        return _.map(flats, (flat) => {
            return (
              // <span>{flat.id}</span>
              // <span> {flat.lng}</span>
              // <span> {flat.images}</span>
              <div>
                <MainCards
                  key={flat.id}
                  flat={flat}
                  currency='$'
                  // id={flat.id}
                  // area={flat.area}
                  // bath={flat.bath}
                  // beds={flat.beds}
                  // rooms={flat.rooms}
                  // flat_type={flat.flat_type}
                  // description={flat.description}
                  // guests={flat.guests}
                  // lat={flat.lat}
                  // lng={flat.lng}
                  // price_per_day={flat.price_per_day}
                  // price_per_month={flat.price_per_month}
                  // currency='$'
                  // sales_point={flat.sales_point}
                  // images={flat.images}
                />
              </div>
            );
          });
          // <div>{console.log('in div: ', flats)}</div>
          // this.props.startUpIndex();
      } else if (this.props.startUpCount.startUpCount !== 0) {
        return <div className="no-results-message">No results match that criteria. <br/>Please search again!</div>;
      } else {
        return (
          <div>
            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <div className="spinner">Loading flats...</div>
          </div>
        );
      }
  }


  render() {
    return (
      <div>
        <div className="container" id="map">
          {this.renderMap()}
        </div>

        <div className="container main-card-container">
          <div className="row card-row">
            {this.renderFlats()}
          </div>
        </div>

        <Upload />

      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('in feature mapStateToProps: ', state);
  return {
    message: state.auth.message,
    flats: state.flats,
    startUpCount: state.startUpCount,
    mapDimensions: state.mapDimensions
   };
}

export default connect(mapStateToProps, actions)(Feature);
