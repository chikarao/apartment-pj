import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { Image, Transformation, CloudinaryContext } from 'cloudinary-react';
import cloudinary from 'cloudinary-core';

import * as actions from '../actions';


const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: CLOUD_NAME });


// const INITIAL_POSITION = { lat: 37.7952,
//   lng: -122.4029 };

const INITIAL_ZOOM = 12;

// const FLATS = [
//   { lat: 37.7952, lng: -122.4029, flatName: 'Transamerica Building' },
//   { lat: 37.787994, lng: -122.407437, flatName: 'Union Square' },
//   { lat: 37.76904, lng: -122.483519, flatName: 'Golden Gate Park' }
// ];

class GoogleMap extends Component {
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

    _.each(this.props.flats, flat => {
      // console.log('flat: ', flat.flatName);

      console.log('in google map, infowidow, infowindowContent: ', infowindowContent(flat));

      const infowindow = new google.maps.InfoWindow({
        content: infowindowContent(flat),
        // content: marker.flatArea,
        maxWidth: 300
      });

      const marker = new google.maps.Marker({
        label: '',
        position: {
          lat: flat.lat,
          lng: flat.lng
        },
        map,
        flatName: flat.description,
        flatArea: flat.area
      });


      marker.addListener('click', () => {
        // map.setZoom(14);
        // map.setCenter(marker.getPosition());
        // console.log('marker clicked: ', marker.flatName);
        infowindow.open(map, marker);
        console.log('in google map, marker clicked');
      });
      marker.addListener('click', (event) => {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        console.log('in googlemaps clicked marker latitude: ', latitude);
        console.log('in googlemaps clicked marker longitude: ', longitude);
      });
      // createMarkers(flat)
      infowindow.addListener('click', (event) => {
        console.log('in googleMap, infowindow addlistner: ', event);
      });
    });
    //end of _.each

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
  //end of componentDidMount

  createBackgroundImage(image) {
    console.log('in googlemaps in createBackgroundImage image: ', image);

    const width = 400;
    const t = new cloudinary.Transformation();
    t.angle(0).crop('scale').width(width).aspectRatio('1:1');
    return cloudinaryCore.url(image, t);
  }

  render() {
    //this.refs.map gives reference to this element
    return <div ref="map" />;
  }
}

function infowindowContent(flat) {
  console.log('in googlemaps in infowindowContent flat: ', flat.images[0].publicid);
  const content =
  `<a href="/show" target="_blank">

    <img src={${flat.images[0].publicid}}> <br />
    <strong>${flat.description}</strong> <br />
    ${flat.area} <br />
    $${parseFloat(flat.price_per_month).toFixed(0)} per month

  </a>
  `;
  // return (
  //     'Hello'
  // );
  return (
    content
  );
  // return (
  //   <div>
  //     <ul>
  //       <li>{flat.description}</li>
  //       <li>{flat.area}</li>
  //     </ul>
  //   </div>
  // );
}
// end of class


export default connect(null, actions)(GoogleMap);
