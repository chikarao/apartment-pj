import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../actions';


// const INITIAL_POSITION = { lat: 37.7952,
//   lng: -122.4029 };

const INITIAL_ZOOM = 12;

// const FLATS = [
//   { lat: 37.7952, lng: -122.4029, flatName: 'Transamerica Building' },
//   { lat: 37.787994, lng: -122.407437, flatName: 'Union Square' },
//   { lat: 37.76904, lng: -122.483519, flatName: 'Golden Gate Park' }
// ];

class GoogleMap extends Component {
  constructor(props) {
      super(props);
      // this.updateBounds = this.updateBounds.bind(this);
      // this.props.updateMapBounds = this.props.updateMapBounds.bind(this);
  }

    componentDidMount() {
    // runs right after component is rendered to the screeen
    const map = new google.maps.Map(this.refs.map, {
      // creates embedded map in component
      zoom: INITIAL_ZOOM,
      center: {
        lat: this.props.initialPosition.lat,
        lng: this.props.initialPosition.lng
      },
      disableDefaultUI: true,
      zoomControl: true,
      scaleControl: true,
       mapTypeControl: true,
       mapTypeControlOptions: {
           style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
           mapTypeIds: ['roadmap', 'terrain']
         }
    });
    // console.log('in googlemap, this.props.flats: ', this.props.flats);

    _.each(this.props.flats, flat => {
      // console.log('flat: ', flat.flatName);
      const marker = new google.maps.Marker({
        position: {
          lat: flat.lat,
          lng: flat.lng
        },
        map,
        flatName: flat.description,
        flatArea: flat.area
      });

        const infowindow = new google.maps.InfoWindow({
          content: marker.flatName,
          // content: marker.flatArea,
          maxWidth: 300
        });

        marker.addListener('click', () => {
          map.setZoom(14);
          map.setCenter(marker.getPosition());
          // console.log('marker clicked: ', marker.flatName);
          infowindow.open(map, marker);
        });
        marker.addListener('click', (event) => {
          const latitude = event.latLng.lat();
          const longitude = event.latLng.lng();
          console.log('in googlemaps clicked marker latitude: ', latitude);
          console.log('in googlemaps clicked marker longitude: ', longitude);
        });
      // createMarkers(flat)
    });
    google.maps.event.addListener(map, 'idle', () => {
      console.log('in googlemap, map idle listener fired');
      const bounds = map.getBounds();
      // console.log('in googlemap, bounds: ', bounds);
      // const ew = bounds.b; // LatLng of the north-east corner
      // const ns = bounds.f; // LatLng of the south-west corder
      // const east = ew.f;
      // const west = ew.b;
      // const north = ns.f;
      // const south = ns.b;
      // console.log('in googlemap, EW bounds: ', ew);
      // console.log('in googlemap, NS bounds: ', ns);
      // console.log('in googlemap, E bound lng: ', east);
      // console.log('in googlemap, W bound lng: ', west);
      // console.log('in googlemap, N bound lat: ', north);
      // console.log('in googlemap, S bound lat: ', south);
      // const mapBounds = {
      //   east,
      //   west,
      //   north,
      //   south
      // };
      const mapBounds = {
        east: bounds.b.f,
        west: bounds.b.b,
        north: bounds.f.f,
        south: bounds.f.b
      };

      console.log('in googlemap, mapBounds: ', mapBounds);
      // this.updateBounds(mapBounds);
      this.props.updateMapBounds(mapBounds);
      this.props.fetchFlats();
    });

    google.maps.event.addListener(map, 'click', function (event) {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();
    console.log('in googlemaps clicked latitude: ', latitude);
    console.log('in googlemaps clicked longitude: ', longitude);
}); //end addListener
   //  google.maps.event.addListener(map, 'bounds_changed', function () {
   //    window.setTimeout(function() {
   //
   //      console.log('in googlemap, map bounds changed listener fired');
   // }, 2000);
   //  });
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  // updateBounds(mapBounds) {
  //   this.props.updateMapBounds(mapBounds);
  // }

  render() {
    //this.refs.map gives reference to this element
    return <div ref="map" />;
  }
}

export default connect(null, actions)(GoogleMap);
