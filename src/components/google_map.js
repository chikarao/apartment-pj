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
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     imageIndex: 0
  //   };
  // }
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

      // console.log('in google map, infowidow, infowindowContent: ', infowindowContent(flat));

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

      // const contentString =
      // `<div id="carousel-iw">
      //   <div className="slide-iw" onclick="console.log('Hello from the left side')">
      //     <img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[0].publicid}.jpg"> <br />
      //   </div>
      //   <div className="slide-iw" onclick=" console.log('Hello from the right side') ">
      //     <img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[1].publicid}.jpg"> <br />
      //   </div>
      // </div>
      // <a href="/show/${flat.id}" target="_blank">
      //   <strong>${flat.description}</strong> <br />
      //   ${flat.area} <br />
      //   $${parseFloat(flat.price_per_month).toFixed(0)} per month
      // </a>`;

      const infowindow = new google.maps.InfoWindow({
        // content: infowindowContent(flat),
        // // content: marker.flatArea,
        maxWidth: 300,
        key: flat.id
        // content: contentString
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
        // const div = document.createElement('div');
        // div.id = 'infowindow-box';
        // div.ref = 'infowindow-box-ref';
        // div.innerHTML = '<div>Hello</div>';
        // div.onClick = function () { console.log('div clicked'); };
        // // infowindow.setPosition();
        // infowindow.setContent(div);
//
        infowindow.open(map, marker);
        console.log('in google map, marker clicked');
        // infowindowClickHandler(flat);
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

      //******************************************
      //************ createElement ***************
      // console.log('in googlemaps info window, flat: ', flat);
      //Parent Div has image div and detaildiv as immediate children
      const iwDivParent = document.createElement('div');

      // Image div
      const iwImageDiv = document.createElement('iwImageDiv');
      iwImageDiv.id = 'infowindow-box-image-box';
      // div.ref = 'infowindow-box-ref';
      iwImageDiv.setAttribute('ref', 'infowindow-box-image-box-ref');
      const iwImageLeftArrow = document.createElement('iwImageLeftArrow');
      const iwImageRightArrow = document.createElement('iwImageRightArrow');
      iwImageLeftArrow.className = 'infowidow-box-image-box-sib';
      iwImageRightArrow.className = 'infowidow-box-image-box-sib';
      iwImageDiv.setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_200,h_140/${flat.images[0].publicid}.jpg)`);
      iwImageLeftArrow.setAttribute('ref', 'infowindowBoxSibRef');
      iwImageRightArrow.setAttribute('ref', 'infowindowBoxSibRef');
      // iwImageDiv.innerHTML = `<div style="background-image: url(http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[0].publicid}.jpg)"></div>`;
      // iwImageLeftArrow.innerHTML = '<i className="fa fa-angle-left"></i>';
      // iwImageRightArrow.innerHTML = '<i className="fa fa-angle-right"></i>';
      iwImageLeftArrow.innerHTML = '<div>Left</div>';
      iwImageRightArrow.innerHTML = '<div>Right</div>';
      // const insertDiv = this.refs.infowindowSubBoxRef;
      iwImageDiv.appendChild(iwImageLeftArrow);
      iwImageDiv.appendChild(iwImageRightArrow);

      //IW Details
      const iwDetailDiv = document.createElement('iwDetailDiv');
      iwDetailDiv.id = 'infowindow-box-Detail-box';
      const iwDetailDescription = document.createElement('iwDetailDescription');
      // iwDetailDescription.id = 'infowidow-box-image-box-sib';
      iwDetailDescription.innerHTML = `<div style="color: gray; padding-top: 10px;"><strong>${flat.description}</strong></div>`;
      const iwDetailArea = document.createElement('iwDetailDescription');
      // iwDetailDescription.id = 'infowidow-box-image-box-sib';
      iwDetailArea.innerHTML = `<div>${flat.area}</div>`;
      const iwDetailPrice = document.createElement('iwDetailPrice');
      // iwDetailDescription.id = 'infowidow-box-image-box-sib';
      iwDetailPrice.innerHTML = `<div>$${flat.price_per_month}</div>`;

      iwDetailDiv.appendChild(iwDetailDescription);
      iwDetailDiv.appendChild(iwDetailArea);
      iwDetailDiv.appendChild(iwDetailPrice);

      iwDivParent.appendChild(iwImageDiv);
      iwDivParent.appendChild(iwDetailDiv);

      // div.innerHTML = `<div id="carousel-iw">
      //   <div className="slide-iw" onclick="console.log('Hello from the left side')">
      //     <img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[0].publicid}.jpg"> <br />
      //   </div>
      //   <div className="slide-iw" onclick=" console.log('Hello from the right side') ">
      //     <img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[1].publicid}.jpg"> <br />
      //   </div>
      // </div>
      // <a href="/show/${flat.id}" target="_blank">
      //   <strong>${flat.description}</strong> <br />
      //   ${flat.area} <br />
      //   $${parseFloat(flat.price_per_month).toFixed(0)} per month
      // </a>`;
      // div.innerHTML = infowindowContent(flat);
      // // div.onClick = function () { infowindowClickHandler(flat); };
      // // infowindow.setPosition();
      console.log('in google map, iwDivParent: ', iwDivParent);
      infowindow.setContent(iwDivParent);
      //******************************************
      //************ createElement ***************

      // google.maps.event.addListener(div, 'clicked', function () {
      //   infowindowClickHandler(flat);
      // });
      // google.maps.event.addDomListener(div, 'click', () => {
      //   return function () {
      //    infowindowClickHandler(flat);
      //  };
      // });
      google.maps.event.addDomListener(iwImageLeftArrow, 'click', (marker) => {
        console.log('in googlemap, map iwImageLeftArrow clicked');
        // console.log('in googlemap, map iwImageLeftArrow clicked, infowindowClickHandler', infowindowClickHandler(flat));
        const maxNumOfImages = infowindowClickHandler(flat);
        const maxImageIndex = maxNumOfImages.length - 1;
        console.log('in googlemap, iwImageLeftArrow, maxImageIndex:', maxImageIndex);
        console.log('in googlemap, iwImageLeftArrow, this.props.imageIndex, before if statement:', this.props.imageIndex.count);
        if (this.props.imageIndex.count <= 0) {
          console.log('in googlemap, iwImageLeftArrow, if statement, we are at 0');
        } else {
          this.props.decrementImageIndex();
        }
        console.log('in googlemap, iwImageLeftArrow, imageIndex, after if statement:', this.props.imageIndex.count)
        // console.log('in googlemap, map iwImageLeftArrow clicked, this.props.imageIndex', this.props.imageIndex);
        // infowindowClickHandler(flat);
      });

      google.maps.event.addDomListener(iwImageRightArrow, 'click', (marker) => {
        console.log('in googlemap, map iwImageRightArrow clicked');
        const maxNumOfImages = infowindowClickHandler(flat);
        const maxImageIndex = maxNumOfImages.length - 1;

        console.log('in googlemap, iwImageRightArrow, maxImageIndex:', maxImageIndex);
        console.log('in googlemap, iwImageRightArrow, this.props.imageIndex.count before if statement:', this.props.imageIndex.count);

        if (this.props.imageIndex.count >= maxImageIndex) {
          console.log('in googlemap, iwImageRightArrow, if statement, we are at maxNumOfImages');
        } else {
          this.props.incrementImageIndex();
        }

        console.log('in googlemap, iwImageRightArrow, imageIndex after if statement:', this.props.imageIndex.count);

      });
      google.maps.event.addDomListener(iwDetailDiv, 'click', function (marker) {
        console.log('in googlemap, map iwDetailDiv clicked');
        infowindowClickHandler(flat);
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
  }
  //end of componentDidMount


  render() {
    //this.refs.map gives reference to this element
    return <div ref="map" />;
  }
}
// end of class

// function infowindowContent(flat) {
//   console.log('in googlemaps in infowindowContent flat: ', flat.images);
//
//   const infowindowContent =
//   `<div id="carousel-iw">
//     <div className="slide-iw" onclick="console.log('Hello from the left side');">
//       <img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[0].publicid}.jpg"> <br />
//     </div>
//     <div className="slide-iw" onclick=" console.log('Hello from the right side') ">
//       <img src="http://res.cloudinary.com/chikarao/image/upload/v1524032785/${flat.images[1].publicid}.jpg"> <br />
//     </div>
//   </div>
//   <a href="/show/${flat.id}" target="_blank">
//     <strong>${flat.description}</strong> <br />
//     ${flat.area} <br />
//     $${parseFloat(flat.price_per_month).toFixed(0)} per month
//   </a>`;

//   const store = [];
// const oldf = console.log;
//   console.log = function (){
//    store.push(arguments);
//    oldf.apply(console, arguments);
// }
//   return (
//     infowindowContent
//   );
// }
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
  console.log('in google map, infowindowClickHandler, arrow clicked', flat);
  const maxNumOfImages = flat.images;

  console.log('in google map, infowindowClickHandler, numbOfImages', maxNumOfImages);
  // console.log('in google map, infowindowClickHandler, imageIndex', );
  return (
    maxNumOfImages
  );
}

function mapStateToProps(state) {
  return {
    imageIndex: state.imageIndex
  };
}


export default connect(mapStateToProps, actions)(GoogleMap);
