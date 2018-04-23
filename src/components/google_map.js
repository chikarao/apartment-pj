import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import ReactDOMServer from 'react-dom/server';

import * as actions from '../actions';

import Carousel from './carousel/carousel';

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

        const marker = new google.maps.Marker({
          key: flat.id,
          label: '',
          position: {
            lat: flat.lat,
            lng: flat.lng
          },
          map,
          // flatName: flat.description,
          // flatArea: flat.area
        });
        //
        const infowindow = new google.maps.InfoWindow({
          // content: infowindowContent(flat),
          // // content: marker.flatArea,
          maxWidth: 300,
          key: flat.id
        });

        // const infoboxContent = infowindowContent(flat);
        // const infoboxContent = '<carousel />';
        //
        // const infoboxOptions = {
        //   content: infoboxContent,
        //   disableAutoPan: false,
        //   maxWidth: 150,
        //   boxClass: 'gmap-info-window',
        //   alignBottom: false,
        //   pixelOffset: new google.maps.Size(-100, -136),
        //   zIndex: null,
        //   boxStyle: {
        //   opacity: 1,
        //   zIndex: 999,
        //   width: '200px',
        //   },
        //   closeBoxMargin: '12px 4px 2px 2px',
        //   closeBoxURL: 'https://i.imgur.com/e07Yvv9.png',
        //   infoBoxClearance: new google.maps.Size(1, 1)
        // };
        //
        // const infowindow = new InfoBox(infoboxOptions);
        // infowindow.open(map, marker);

        marker.addListener('click', () => {
          // map.setZoom(14);
          // map.setCenter(marker.getPosition());
          // console.log('marker clicked: ', marker.flatName);
          infowindow.open(map, marker);
          console.log('in google map, marker clicked');
          infowindowClickHandler(flat);
        });
        marker.addListener('click', (event) => {
          const latitude = event.latLng.lat();
          const longitude = event.latLng.lng();
          console.log('in googlemaps clicked marker latitude: ', latitude);
          console.log('in googlemaps clicked marker longitude: ', longitude);
        });
        // createMarkers(flat)
        // infowindow.addListener('click', (event) => {
        //   console.log('in googleMap, infowindow addlistner: ', event);
        // });

        console.log('in googlemaps info window, flat: ', flat);
        const div = document.createElement('div');
        div.id = 'infowindow-box';
        div.innerHTML = infowindowContent(flat);
        // div.innerHTML = ReactDOMServer.renderToString(infowindowContent(flat));
        // div.onClick = function () { infowindowClickHandler(flat); };
        // infowindow.setPosition();
        infowindow.setContent(div);

        // google.maps.event.addListener(div, 'clicked', function () {
        //   infowindowClickHandler(flat);
        // });
        // google.maps.event.addDomListener(div, 'click', () => {
        //   return function () {
        //    infowindowClickHandler(flat);
        //  };
        // });
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
  }
  //end of componentDidMount

  createBackgroundImage(image) {
    console.log('in googlemaps in createBackgroundImage image: ', image);

    const width = 400;
    const t = new cloudinary.Transformation();
    t.angle(0).crop('scale').width(width).aspectRatio('1:1');
    return cloudinaryCore.url(image, t);
  }

  handleCardClick = (event) => {
    console.log('in googlemap, handleCardClick, event.target.className: ', event.target.className);
    // const wasParentClicked = event.target.className === 'card-cover' ||
    // event.target.className === 'card';
    // console.log('in main_cards, handleCardClick, wasParentClicked: ', wasParentClicked);
    // if (wasParentClicked) {
    //   this.props.selectedFlat(this.props.flat);
    //   console.log('in main_cards, handleCardClick, Card clicked');
    //   const win = window.open(`/show/${this.props.flat.id}`, '_blank');
    //   win.focus();
    // }
  }

  render() {
    //this.refs.map gives reference to this element
    return <div ref="map" />;
  }
}
// end of class

function infowindowContent(flat) {
  console.log('in googlemaps in infowindowContent flat: ', flat.images[0].publicid);
  const content =
  `<div id="carousel-iw">
    <div className="slide-iw" onclick=" console.log('Hello from the left side') ">
      <img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[0].publicid}.jpg"> <br />
    </div>
    <div className="slide-iw" onclick=" console.log('Hello from the right side') ">
      <img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[1].publicid}.jpg"> <br />
    </div>
  </div>
  <a href="/show/${flat.id}" target="_blank">
    <strong>${flat.description}</strong> <br />
    ${flat.area} <br />
    $${parseFloat(flat.price_per_month).toFixed(0)} per month
  </a>`;
  return (
    content
  );
}
// function infowindowContent(flat) {
//   console.log('in googlemaps in infowindowContent flat: ', flat.images[0].publicid);
//   const content = '<a href=/show/' + flat.id + ' onclick={infowindowClickHandler(' + flat + ')} target="_blank">' + <Carousel /> + '<br /><strong>' + flat.description + '</strong><br/>' + flat.area + '<br /> $' + parseFloat(flat.price_per_month).toFixed(0) + '</a>';
//   return (
//     content
//   );
// }
// function infowindowContent(flat) {
//   console.log('in googlemaps in infowindowContent flat: ', flat.images[0].publicid);
//   const content = '<a href=/show/' + flat.id + ' onclick={infowindowClickHandler(' + flat + ')} target="_blank"><img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/' + flat.images[0].publicid + '.jpg"><br /><strong>' + flat.description + '</strong><br/>' + flat.area + '<br /> $' + parseFloat(flat.price_per_month).toFixed(0) + '</a>';
//   return (
//     content
//   );
// }
// function infowindowContent(flat) {
//   console.log('in googlemaps in infowindowContent flat: ', flat.images[0].publicid);
//   const content =
//   `
//     <img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[0].publicid}.jpg"> <br />
//     <strong>${flat.description}</strong> <br />
//     ${flat.area} <br />
//     $${parseFloat(flat.price_per_month).toFixed(0)} per month
//   `;
//   return (
//     content
//   );
// }
// function infowindowContent(flat) {
//   console.log('in googlemaps in infowindowContent flat: ', flat.images[0].publicid);
//   const content = (
//     <div>
//       <a href={`/show/${flat.id}`} target="_blank">
//         <Carousel flat={flat} cardOrInfoWindow /><br />
//           <strong>{flat.description}</strong> <br />
//           {flat.area} <br />
//           ${parseFloat(flat.price_per_month).toFixed(0)} per month
//       </a>
//     </div>
//   );
  //   <img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[0].publicid}.jpg"> <br />
  //   <strong>${flat.description}</strong> <br />
  //   ${flat.area} <br />
  //   $${parseFloat(flat.price_per_month).toFixed(0)} per month
  // ;
//   return (
//     content
//   );
// }

function infowindowClickHandler(flat) {
  console.log('in google map, infowindowClickHandler, image clicked', flat);
}


export default connect(null, actions)(GoogleMap);
