import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import ReactDOMServer from 'react-dom/server';

import * as actions from '../actions';

import Carousel from './carousel/carousel';

// const INITIAL_POSITION = { lat: 37.7952,
//   lng: -122.4029 };

// used initially when getting map on page
// const FLATS = [
//   { lat: 37.7952, lng: -122.4029, flatName: 'Transamerica Building' },
//   { lat: 37.787994, lng: -122.407437, flatName: 'Union Square' },
//   { lat: 37.76904, lng: -122.483519, flatName: 'Golden Gate Park' }
// ];
const INITIAL_ZOOM = 12;

let MAP_DIMENSIONS = {};

class GoogleMap extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     imageIndex: 0
  //   };
  // }
  // no constructor needed now
  componentDidMount() {
  // runs right after component is rendered to the screeen
  // flatsEmpty is prop passed in map render
  // and is true if there are no search results for the map area or criteria
    const initialZoom = this.props.flatsEmpty ? 11 : INITIAL_ZOOM;
    console.log('in googlemap, componentDidMount, this.props.flatsEmpty:', this.props.flatsEmpty);
    console.log('in googlemap, componentDidMount, INITIAL_ZOOM:', INITIAL_ZOOM);

    const map = new google.maps.Map(this.refs.map, {
      // creates embedded map in component
      zoom: initialZoom,
      // center initialPosition is prop passed in map render in flats
      // or by mapdimensions object from redux
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
      },
      // clickableIcons false so that user does not open IW; right now cannot close
      // since close button hidden
      clickableIcons: false
      //hide POIs;
      // styles: [
      //   {
      //     featureType: 'poi',
      //     stylers: [
      //       { visibility: 'off' }
      //     ]
      //   }
      // ]

    });

    // required infowindowArray to close infowindow on map click
    const infowindowArray = [];

      //flats is object from props in map render
    _.each(this.props.flats, flat => {
      const markerLabel = `$${parseFloat(flat.price_per_month).toFixed(0)}`;
      // Marker sizes are expressed as a Size of X,Y where the origin of the image
      // (0,0) is located in the top left of the image.
      var markerIcon = {
        url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
        // scaledsize originally 80, 80 taken from medium https://medium.com/@barvysta/google-marker-api-lets-play-level-1-dynamic-label-on-marker-f9b94f2e3585
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        //anchor starts at 0,0 at left corner of marker
        anchor: new google.maps.Point(20, 40),
        //label origin starts at 0, 0 somewhere above the marker
        labelOrigin: new google.maps.Point(20, 60)
        };

      const marker = new google.maps.Marker({
        key: flat.id,
        position: {
          lat: flat.lat,
          lng: flat.lng
        },
        map,
        flatId: flat.id,
        icon: markerIcon,
        label: {
          text: markerLabel,
          fontWeight: 'bold'
          // color: 'gray'
        }
        //this is for the MarkerWithLabel library; seems has been deprecated
        // labelAnchor: new google.maps.Point(20, 60),
        // labelClass: 'gm-marker-label', // your desired CSS class
        // labelInBackground: true
      });

      const infowindow = new google.maps.InfoWindow({
        maxWidth: 300,
        key: flat.id
      });

      //infowindowArray for closing all open infowindows at map click
      infowindowArray.push(infowindow);


      // to open infowindows
      marker.addListener('click', () => {
        //close all open infowindows first
        for (let i = 0; i < infowindowArray.length; i++) {
          infowindowArray[i].close();
        }
        console.log('in google map, marker addlistener clicked');
        console.log('in google map, marker addlistener clicked, marker.flatId', marker.flatId);
        // then open clicked infowindow
        infowindow.open(map, marker);
      });

      // not sure if need this, but gets latLng when click marker;
      // leave just to show event parameter working
      marker.addListener('click', (event) => {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        console.log('in googlemaps clicked marker latitude: ', latitude);
        console.log('in googlemaps clicked marker longitude: ', longitude);
        // console.log('in googlemaps clicked marker longitude: ', event);
      });

      //************ INFOWINDOW createElement ***************
      //Parent Div has image div and detaildiv as immediate children
      const iwDivParent = document.createElement('div');

      // Image div
      const iwImageDiv = document.createElement('div');
      iwImageDiv.id = 'infowindow-box-image-box';
      iwImageDiv.setAttribute('ref', 'infowindow-box-image-box-ref');
      iwImageDiv.setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_200,h_140/${flat.images[this.props.imageIndex.count].publicid}.jpg)`);

      // divs to contain the arrows, clicks on this will move carousel, addDomListener is assigned
      // increments image index in redux
      const iwImageLeftArrowDiv = document.createElement('div');
      const iwImageRightArrowDiv = document.createElement('div');

      // carousel arrows within image
      iwImageLeftArrowDiv.setAttribute = ('class', 'infowindow-box-image-box-sib');
      iwImageRightArrowDiv.setAttribute = ('class', 'infowindow-box-image-box-sib');

      // for some reason, class does not survive an appendChild so use id even if there are multiple
      // no propblem having two, the system will use the first one in array of ids
      iwImageLeftArrowDiv.id = 'infowindow-box-image-box-sib';
      iwImageRightArrowDiv.id = 'infowindow-box-image-box-sib';

      // console.log('in google maps, create IW elements, iwImageLeftArrowDiv: ', iwImageLeftArrowDiv);
      iwImageDiv.appendChild(iwImageLeftArrowDiv);
      iwImageDiv.appendChild(iwImageRightArrowDiv);

      const iwImageLeftArrow = document.createElement('div');
      const iwImageRightArrow = document.createElement('div');

      iwImageLeftArrow.setAttribute('class', 'iw-arrow');
      iwImageRightArrow.setAttribute('class', 'iw-arrow');
      iwImageLeftArrow.textContent = '<';
      iwImageRightArrow.textContent = '>';

      // font awesom icons do not work!!!!!!!!
      iwImageLeftArrowDiv.appendChild(iwImageLeftArrow);
      iwImageRightArrowDiv.appendChild(iwImageRightArrow);

      //IW Details; click on this addDomListener assigned will open a new tab to the flat show page
      const iwDetailDiv = document.createElement('div');
      iwDetailDiv.id = 'infowindow-box-Detail-box';
      const iwDetailDescription = document.createElement('div');
      // iwDetailDescription.id = 'infowindow-box-image-box-sib';
      iwDetailDescription.innerHTML = `<div style="color: gray; padding-top: 10px;"><strong>${flat.description}</strong></div>`;
      const iwDetailArea = document.createElement('div');
      // iwDetailDescription.id = 'infowindow-box-image-box-sib';
      iwDetailArea.innerHTML = `<div>${flat.area}</div>`;
      const iwDetailPrice = document.createElement('div');
      // iwDetailDescription.id = 'infowindow-box-image-box-sib';
      iwDetailPrice.innerHTML = `<div>${this.props.currency}${parseFloat(flat.price_per_month).toFixed(0)} per month</div>`;

      iwDetailDiv.appendChild(iwDetailDescription);
      iwDetailDiv.appendChild(iwDetailArea);
      iwDetailDiv.appendChild(iwDetailPrice);

      iwDivParent.appendChild(iwImageDiv);
      iwDivParent.appendChild(iwDetailDiv);

      infowindow.setContent(iwDivParent);
      //************ INFOWINDOW createElement ***************

      google.maps.event.addListener(infowindow, 'domready', () => {
        // this addDomListener takes display nones some divs in google maps
        // so that gm-style-iw can be styled enable image to be panned across IW
        // gets infowindow element, returns array of HTML so get the first element in array
        const gmStyleIw = document.getElementsByClassName('gm-style-iw');
        const iwBackground = gmStyleIw[0].previousSibling;
        //gets the element with the white background and assign style of display none
        const iwBackgroundWhite = iwBackground.lastChild;
        iwBackgroundWhite.style.display = 'none';
        // get element with shadow behind the IW and assign style of display none;
        //item number is index
        const iwBackgroundShadow = iwBackground.getElementsByTagName('div').item(1);
        iwBackgroundShadow.style.display = 'none';
      });

      // addDomListener for left arrow in IW image carousel
      // clicks increment image index in redux, passes to action creator, two arguments
      // to test if image index is at zero or max number
      google.maps.event.addDomListener(iwImageLeftArrowDiv, 'click', (marker) => {
        let indexAtZero = false;
        console.log('in googlemap, map iwImageLeftArrow clicked');
        const maxImageIndex = flat.images.length - 1;
        console.log('in googlemap, iwImageLeftArrow, maxImageIndex:', maxImageIndex);
        console.log('in googlemap, iwImageLeftArrow, this.props.imageIndex, before if statement:', this.props.imageIndex.count);
        if (this.props.imageIndex.count <= 0) {
          console.log('in googlemap, iwImageLeftArrow, if statement, we are at 0');
          indexAtZero = true;
          console.log('in googlemap, iwImageLeftArrow, if statement, indexAtZero', indexAtZero);
          this.props.decrementImageIndex(indexAtZero, maxImageIndex);
        } else {
          this.props.decrementImageIndex(indexAtZero, maxImageIndex);
          console.log('in googlemap, iwImageLeftArrow, if statement, indexAtZero', indexAtZero);
        }
        console.log('in googlemap, iwImageLeftArrow, imageIndex, after if statement:', this.props.imageIndex.count)
        // console.log('in googlemap, map iwImageLeftArrow clicked, t
        //his.props.imageIndex', this.props.imageIndex);
        // infowindowClickHandler(flat);
        document.getElementById('infowindow-box-image-box').setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_200,h_140/${flat.images[this.props.imageIndex.count].publicid}.jpg)`);
      });

      google.maps.event.addDomListener(iwImageRightArrowDiv, 'click', (marker) => {
        let indexAtMax = false;
        console.log('in googlemap, map iwImageRightArrow clicked');
        // const maxNumOfImages = infowindowClickHandler(flat);
        const maxImageIndex = flat.images.length - 1;

        console.log('in googlemap, iwImageRightArrow, maxImageIndex:', maxImageIndex);
        console.log('in googlemap, iwImageRightArrow, this.props.imageIndex.count before if statement:', this.props.imageIndex.count);

        if (this.props.imageIndex.count >= maxImageIndex) {
          console.log('in googlemap, iwImageRightArrow, if statement, we are at maxNumOfImages');
          indexAtMax = true;
          this.props.incrementImageIndex(indexAtMax, maxImageIndex);
          console.log('in googlemap, iwImageRightArrow, if statement, we are at indexAtMax:', indexAtMax);
        } else {
          this.props.incrementImageIndex(indexAtMax, maxImageIndex);
          console.log('in googlemap, iwImageRightArrow, if statement, we are at indexAtMax:', indexAtMax);
        }
          console.log('in googlemap, iwImageRightArrow, imageIndex after if statement:', this.props.imageIndex.count);
          document.getElementById('infowindow-box-image-box').setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_200,h_140/${flat.images[this.props.imageIndex.count].publicid}.jpg)`);
      });

      // opens up new tab when IW details clicked and passes flat id in params to the new tab
      google.maps.event.addDomListener(iwDetailDiv, 'click', function () {
        console.log('in googlemap, map iwDetailDiv clicked, marker', iwDetailDiv);
        console.log('in googlemap, map iwDetailDiv clicked, marker', marker.flatId);
        // infowindowClickHandler(flat);
        const win = window.open(`/show/${marker.flatId}`, '_blank');
        win.focus();
      });
    });
    //****************************************
    //end of _.each flat create markers etc...

    // Fired when map is moved; gets map dimensions
    // and call action fetchflats to get flats within map bounds
    // calls action updateMapDimensions for updating mapDimensions state
    // mapDimensions is used to render map when flats search result is empty
    google.maps.event.addListener(map, 'idle', () => {
      console.log('in googlemap, map idle listener fired');
      const bounds = map.getBounds();
      const mapCenter = map.getCenter();
      const mapZoom = map.getZoom();
      //leaving just to show how mapbounds works
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
      // for fetchFlats within the coordinate bounds
      const mapBounds = {
        east: bounds.b.f,
        west: bounds.b.b,
        north: bounds.f.f,
        south: bounds.f.b
      };

      MAP_DIMENSIONS = { mapBounds, mapCenter, mapZoom };

      // console.log('in googlemap, mapBounds: ', mapBounds);
      // console.log('in googlemap, mapCenter.lat: ', mapCenter.lat());
      // console.log('in googlemap, mapCenter.lng: ', mapCenter.lng());
      // console.log('in googlemap, mapZoom: ', mapZoom);
      // console.log('in googlemap, MAP_DIMENSIONS:', MAP_DIMENSIONS);
      // console.log('in googlemap, MAP_DIMENSIONS, mapBounds: ', MAP_DIMENSIONS.mapBounds);
      // console.log('in googlemap, MAP_DIMENSIONS, mapCenter.lat: ', MAP_DIMENSIONS.mapCenter.lat());
      // console.log('in googlemap, MAP_DIMENSIONS, mapCenter.lng: ', MAP_DIMENSIONS.mapCenter.lng());
      // console.log('in googlemap, MAP_DIMENSIONS, mapZoom: ', MAP_DIMENSIONS.mapZoom);

      // updateMapBounds not available as app state obj but not currently used
      this.props.updateMapDimensions(MAP_DIMENSIONS);
      // console.log('in googlemap, this.props.mapBounds: ', this.props.mapBounds);

      this.props.fetchFlats(mapBounds);
    });


    google.maps.event.addListener(map, 'click', function (event) {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      console.log('in googlemaps clicked latitude: ', latitude);
      console.log('in googlemaps clicked longitude: ', longitude);

      //close open infowindows
      for (let i = 0; i < infowindowArray.length; i++) {
        infowindowArray[i].close();
      }
    }); //end addListener
  }
  //*********************************************************
  //end of componentDidMount

  //*********************************************************
  render() {
    //this.refs.map gives reference to this element
    return <div ref="map" />;
  }
}
//***********************************************************
// end of class
//***********************************************************

// function infowindowClickHandler(flat) {
//   console.log('in google map, infowindowClickHandler, arrow clicked', flat);
//   const maxNumOfImages = flat.images;
//
//   console.log('in google map, infowindowClickHandler, numbOfImages', maxNumOfImages);
//   // console.log('in google map, infowindowClickHandler, imageIndex', );
//   return (
//     maxNumOfImages
//   );
// }

function mapStateToProps(state) {
  return {
    imageIndex: state.imageIndex,
    mapBounds: state.mapBounds
  };
}


export default connect(mapStateToProps, actions)(GoogleMap);
