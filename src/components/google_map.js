import React, { Component } from 'react';
import _ from 'lodash';

const INITIAL_POSITION = { lat: 37.7952,
  lng: -122.4029 };

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
        lat: INITIAL_POSITION.lat,
        lng: INITIAL_POSITION.lng
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
        flatName: flat.description
      });

        const infowindow = new google.maps.InfoWindow({
          content: marker.flatName,
          maxWidth: 300
        });

        marker.addListener('click', () => {
          map.setZoom(14);
          map.setCenter(marker.getPosition());
          console.log('marker clicked: ', marker.flatName);
          infowindow.open(map, marker);
        });
      // createMarkers(flat)
    });
  }

  // shouldComponentUpdate() {
  //   return false;
  // }


  render() {
    //this.refs.map gives reference to this element
    return <div ref="map" />;
  }
}

export default GoogleMap;
