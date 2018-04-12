import React, { Component } from 'react';

class GoogleMap extends Component {
    componentDidMount() {
    // runs right after component is rendered to the screeen
    new google.maps.Map(this.refs.map, {
      // creates embedded map in component
      zoom: 12,
      center: {
        lat: 37.7952,
        lng: -122.4029
        // lat: this.props.lat,
        // lng: this.props.lon
        // options object
      }
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
