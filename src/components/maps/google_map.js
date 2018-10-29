import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import * as actions from '../../actions';
// GmStyle for changing map style
import GmStyle from './gm-style';
// import citiesList from '../constants/cities_list';

// const INITIAL_ZOOM = 12;

let MAP_DIMENSIONS = {};
let idleListenerOn = true;

// This component used for results page and showflat page;
// Takes prop showFlat, flatEmpty in case map pans to location with no flat,
// initialposition coming from show flat
class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: {},
      initialFlats: {},
      markersArray: [],
      initialRerenderMap: true
    };

    // this.createMarkers = this.createMarkers.bind(this);
  }

  componentDidMount() {
    // runs right after component is rendered to the screeen
    // flatsEmpty is prop passed in map render
    // and is true if there are no search results for the map area or criteria
    this.renderMap(this.props.flats);
    // this.createMarkers();

    // console.log('in googlemaps componentDidMount, this.props: ', this.props);
    this.setState({ initialFlats: this.props.flats });
  }
  //*********************************************************
  //end of componentDidMount

  // CDU called After createMarkers setState and change in this.props.flat;
  // Takes markersArray from state (updated in createMarkers, as markers on map)
  // flat from prevProps and prevState compared to get newFlatsArray (this.props.flat not in prevProops.flat)
  // and oldMarkersArray (prevProps.flat not in this.props.flat)
  // takes newFlatsArray and calls createMarkers() passing flat array and oldMarkersArray, and also setMap null

  componentDidUpdate(prevProps) {
    // console.log('in googlemaps componentDidUpdate, prevProps.flats, this.props.flats, prevState, this.state: ', prevProps.flats, this.props.flats, prevState, this.state);
    // console.log('in googlemaps componentDidUpdate, this.state.markersArray: ', this.state.markersArray);
    // takes state markersArray updated in this.createMarkers
    // and creates array of markers on map with just IDs so that easy to compare this and prev props
    const markersArrayIds = [];
    _.each(this.state.markersArray, marker => {
        markersArrayIds.push(marker.flatId);
    });
    //
    // and creates array of prev flats with just IDs so that easy to compare this and prev props
    const prevPropsIdArray = [];
    _.each(prevProps.flats, flat => {
      prevPropsIdArray.push(flat.id);
    });

    // and creates array of current flats with just IDs so that easy to compare this and prev props
    const currentPropsIdArray = [];
    const currentPropsFlatArray = [];
    _.each(this.props.flats, flat => {
      currentPropsIdArray.push(flat.id);
      // since this.props.flats is an object of objects
      currentPropsFlatArray.push(flat);
    });

    // iterate over this.props.flats to get array of new flats and flat ids
    const newFlatsIdArray = [];
    const newFlatsArray = [];

    _.each(this.props.flats, (flat) => {
      // if prev props had flat ids
       if (prevPropsIdArray.length > 0) {
           // console.log('in googlemaps componentWillReceiveProps, markersArrayIds.length > 0: ', markersArrayIds.length > 0);
           // console.log('in googlemaps componentWillReceiveProps, this.state.markersArray: ', this.state.markersArray);
        // if prev props did NOT include current flat id, then those are new
         if (!prevPropsIdArray.includes(flat.id)) {
           newFlatsIdArray.push(flat.id);
           newFlatsArray.push(flat);
           // console.log('in googlemaps componentDidUpdate, markersArrayIds newMarkerArray: ', markersArrayIds, newMarkerArray);
         }
      // if prev props array had nothing in it, then ALL this.props.flat are new
       } else {
         newFlatsIdArray.push(flat.id);
         newFlatsArray.push(flat);
       }
     });

     // if current markers in state is NOT included in this.props.flats then they are old markers
     // Note: id array
     const oldMarkerIdArray = [];
     _.each(markersArrayIds, markerId => {
       // console.log('in googlemaps componentWillReceiveProps, oldMarkerIdArray each, markerId: ', markerId);
       if (!currentPropsIdArray.includes(markerId)) {
         oldMarkerIdArray.push(markerId);
       }
     });
     // Note: NOT id array, marker array
     const oldMarkersArray = [];
     // console.log('in googlemaps componentDidUpdate, oldMarkerIdArray: ', oldMarkerIdArray);
     // console.log('in googlemaps componentDidUpdate, oldMarkersArray: ', oldMarkersArray);
     // iterate over oldMarkerArray to get the actual markers in state with id
     _.each(oldMarkerIdArray, markerId => {
        const marker = this.state.markersArray.filter(obj => {
          // returns array of markers (in each case just one) with flat.id of oldMarkers flat_id
         return obj.flatId === markerId;
       });
       oldMarkersArray.push(marker[0]);
     });
     // take oldMarkersArray and setMap null to remove from map
     _.each(oldMarkersArray, marker => {
       marker.setMap(null);
       // clearMarkers(marker);
     });
     // create markers passing array of new flats and
     // array of old markers where old markers will be taken out of state markersArray
     this.createMarkers(newFlatsArray, oldMarkersArray);
  }

  renderMap(flats) {
    let initialZoom;
    // check if map is for showflat
    if (this.props.showFlat) {
      initialZoom = 14;
    } else {
      // this is where initial zoom is set after city search and jump to results page
      initialZoom = 12;
    }
    // console.log('in googlemap, componentDidMount, this.props.flatsEmpty:', this.props.flatsEmpty);
    // console.log('in googlemap, componentDidMount, INITIAL_ZOOM:', INITIAL_ZOOM);
    console.log('in googlemap, renderMap, this.props.initialPosition:', this.props.initialPosition);

    const map = new google.maps.Map(this.refs.map, {
      // creates embedded map in component
      // zoom: initialZoom,
      // initialPosition has storedZoom from the city_list.js stored in results.js if the page is refreshed
      // do storedZoom only if not on showFlat page
      zoom: this.props.initialPosition.zoom && !this.props.showFlat ? this.props.initialPosition.zoom : initialZoom,
      // zoom: ('zoom' in this.props.initialPosition) && !this.props.showFlat ? this.props.initialPosition.zoom : initialZoom,
      // zoom: this.props.initialPosition.zoom && !this.props.showFlat ? this.props.initialPosition.zoom : initialZoom,
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
      // styles: GmStyle
      //hide POIs;
      // styles: [
      //   {
      //     featureType: 'poi',
      //     stylers: [
      //       { visibility: 'off' }
      //     ]
      //   }
      // ]
    }); // end of const map = new google.maps.Map(....)

    // store map in state and call createmarkers in callback when map is stored
    this.setState({ map }, () => {
      this.props.setMap(map);
      if (this.props.showFlat){
        this.createCircle()
      } else {
        this.createMarkers(flats, []);
      }
    });
    // Fired when map is moved; gets map dimensions
    // and call action fetchflats to get flats within map bounds
    // calls action updateMapDimensions for updating mapDimensions state
    // mapDimensions is used to render map when flats search result is empty
    google.maps.event.addListener(map, 'idle', () => {
      // console.log('in googlemap, map idle listener fired, map', map);
      // console.log('in googlemap, map idle listener fired, map.getBounds()', map.getBounds());
      // for (let i = 0; i < this.state.markersArray.length - 1; i++) {
      //   this.state.markersArray[i].setMap(null);
      // }

      const bounds = map.getBounds();
      const mapCenter = map.getCenter();
      const mapZoom = map.getZoom();
      //leaving just to show how mapbounds works
      console.log('in googlemap, bounds: ', bounds);
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
      // got error of type error property f of undefined;
      // Looks like google maps changed its API so
      // change from b.f f.f to j.l and l.l
      const mapBounds = {
        east: bounds.j.l,
        west: bounds.j.j,
        north: bounds.l.l,
        south: bounds.l.j
      };
      // const mapBounds = {
      //   east: bounds.b.f,
      //   west: bounds.b.b,
      //   north: bounds.f.f,
      //   south: bounds.f.b
      // };

      MAP_DIMENSIONS = { mapBounds, mapCenter, mapZoom };

      // console.log('in googlemap, mapBounds: ', mapBounds);
      // console.log('in googlemap, mapCenter.lat: ', mapCenter.lat());
      // console.log('in googlemap, mapCenter.lng: ', mapCenter.lng());
      // console.log('in googlemap, mapZoom: ', mapZoom);
      // console.log('in googlemap, MAP_DIMENSIONS, mapBounds: ', MAP_DIMENSIONS.mapBounds);
      // console.log('in googlemap, MAP_DIMENSIONS, mapCenter.lat: ', MAP_DIMENSIONS.mapCenter.lat());
      // console.log('in googlemap, MAP_DIMENSIONS, mapCenter.lng: ', MAP_DIMENSIONS.mapCenter.lng());
      // console.log('in googlemap, MAP_DIMENSIONS, mapZoom: ', MAP_DIMENSIONS.mapZoom);

      // updateMapBounds not available as app state obj but not currently used

      // console.log('in googlemap, this.props.mapBounds: ', this.props.mapBounds);

      //!!!!!!!!!!!!!run fetchFlats if map is not being rendered in show flat page!!!!!!!!!!!!!!!!!
      if (!this.props.showFlat && idleListenerOn) {
        // console.log('in googlemap, MAP_DIMENSIONS:', MAP_DIMENSIONS);
        // console.log('in googlemap, fetchFlats call, this:', this);
        // !!!!!!don't need updateMapDimensions now that results calls googleMap by using
        // searchFlatParams latlng and zoom; And if there is no searchFlatParams latlng
        // then if there is no latlng in searchFlatParams, then uses stored latlng and zoom
        this.props.updateMapDimensions(MAP_DIMENSIONS, () => {});
        // const searchAttributes = { price_max: 10000000, price_min: 0, bedrooms_max: 100, bedrooms_min: 0, bedrooms_exact: null };
        this.props.fetchFlats(mapBounds, this.props.searchFlatParams, () => this.fetchFlatsCallback('google maps'));
        this.props.showLoading('google maps');
      }
      // for (let i = 0; i < this.state.markersArray.length - 1; i++) {
      //   this.state.markersArray[i].setMap(null);
      // }
      // this.createMarkers();
    }); // end of addlistner idle

    // gets lat lng of point on map where click
    // google.maps.event.addListener(map, 'click', (event) => {
    //   alert('Latitude: '+ event.latLng.lat() + ' ' + ', longitude: ' + event.latLng.lng());
    // });
        // END of map initialization and map addlisterners
  } // end of renderMap


  fetchFlatsCallback(fromWhere) {
    // console.log('in googlemap, fetchFlatsCallback:', fromWhere);
    this.props.showLoading(fromWhere);
  }

  createCircle() {
    const circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.state.map,
      center: {
        lat: this.props.initialPosition.lat,
        lng: this.props.initialPosition.lng
      },
      radius: 300
    });

    return circle;
  }

  createMarkers(flats, oldMarkersArray) {
    // required infowindowArray to close infowindow on map click
    const infowindowArray = [];
    // const markersArray = [];
    const map = this.state.map;

    //flats is object from props in map render
    _.each(flats, (flat) => {
      // console.log('in googlemaps, each, flat: ', flat);
      const markerLabel = this.props.showFlat ? 'Here I am' : `$${parseFloat(flat.price_per_month).toFixed(0)}`;
      // Marker sizes are expressed as a Size of X,Y where the origin of the image
      // (0,0) is located in the top left of the image.
      const markerIcon = {
        url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
        // url: iconObject.icon,
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
      }); // end of marker new

      // if (!this.props.showFlat) {
      const infowindow = new google.maps.InfoWindow({
        maxWidth: 300,
        key: flat.id
      });
      // }

      //infowindowArray for closing all open infowindows at map click
      infowindowArray.push(infowindow);

      // !!!!!!!!!!!!!!!!!!!!!!!to open infowindow on marker click
      marker.addListener('click', () => {
        //close all open infowindows first
        for (let i = 0; i < infowindowArray.length; i++) {
          infowindowArray[i].close();
        }
        // console.log('in google map, marker addlistener clicked');
        // console.log('in google map, marker addlistener clicked, marker.flatId', marker.flatId);
        // then open clicked infowindow
        // to avoid triggering idle listener, turn off global variable idleListeron, open infowidow,
        // then turn idleListenerOn to true after some time.
        idleListenerOn = false;
        infowindow.open(map, marker);
        setTimeout(() => {
          idleListenerOn = true;
          }, 2000); // restore functionality after 2 seconds
      });

      // not sure if need this, but gets latLng when click marker;
      // leave just to show event parameter working
      marker.addListener('click', (event) => {
        const latitude = event.latLng.lat();
        const longitude = event.latLng.lng();
        // console.log('in googlemaps clicked marker latitude: ', latitude);
        // console.log('in googlemaps clicked marker longitude: ', longitude);
        // console.log('in googlemaps clicked marker longitude: ', event);
      });

      //************ INFOWINDOW create element ***************
      //Parent Div has image div and detaildiv as immediate children
      const iwDivParent = document.createElement('div');

      // Image div
      // console.log('in googlemaps, infowindow create elements, flat.images: ', flat.images);
      const iwImageDiv = document.createElement('div');
      iwImageDiv.id = 'infowindow-box-image-box';
      iwImageDiv.setAttribute('ref', 'infowindow-box-image-box-ref');

      // !!!!if no image is available for the flat
      if (flat.images[this.props.imageIndex.count]) {
        iwImageDiv.setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_210,h_140/${flat.images[this.props.imageIndex.count].publicid}.jpg)`);
      } else {
        iwImageDiv.setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_210,h_140/no_image_placeholder_5.jpg)`);
      }
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
      iwImageLeftArrow.textContent = '❮';
      iwImageRightArrow.textContent = '❯';

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
      //************ INFOWINDOW create element ***************

      google.maps.event.addListener(infowindow, 'domready', () => {
        // this addDomListener takes display nones some divs in google maps
        // so that gm-style-iw can be styled enable image to be panned across IW
        // gets infowindow element, returns array of HTML so get the first element in array
        const gmStyleIw = document.getElementsByClassName('gm-style-iw');
        const iwBackground = gmStyleIw[0].previousSibling;
        const nextSibling = gmStyleIw[0].nextSibling;
        //gets the element with the white background and assign style of display none
        const iwBackgroundWhite = iwBackground.lastChild;
        iwBackgroundWhite.style.display = 'none';
        // get element with shadow behind the IW and assign style of display none;
        //item number is index
        const iwBackgroundShadow = iwBackground.getElementsByTagName('div').item(1);
        iwBackgroundShadow.style.display = 'none';

        // name class so that .gm-style-iw styling does not clash with others
        gmStyleIw[0].setAttribute('class', 'google-map-gm-style-iw');
        // for taking out close button img that is standard with google map
        nextSibling.setAttribute('class', 'google-map-gm-style-iw-next');

      }); // end of addlistener

      // addDomListener for left arrow in IW image carousel
      // clicks increment image index in redux, passes to action creator, two arguments
      // to test if image index is at zero or max number
      google.maps.event.addDomListener(iwImageLeftArrowDiv, 'click', (marker) => {
        let indexAtZero = false;
        // console.log('in googlemap, map iwImageLeftArrow clicked');
        const maxImageIndex = flat.images.length - 1;
        // console.log('in googlemap, iwImageLeftArrow, maxImageIndex:', maxImageIndex);
        // console.log('in googlemap, iwImageLeftArrow, this.props.imageIndex, before if statement:', this.props.imageIndex.count);
        if (this.props.imageIndex.count <= 0) {
          // console.log('in googlemap, iwImageLeftArrow, if statement, we are at 0');
          indexAtZero = true;
          // console.log('in googlemap, iwImageLeftArrow, if statement, indexAtZero', indexAtZero);
          this.props.decrementImageIndex(indexAtZero, maxImageIndex);
        } else {
          this.props.decrementImageIndex(indexAtZero, maxImageIndex);
          // console.log('in googlemap, iwImageLeftArrow, if statement, indexAtZero', indexAtZero);
        }
        // console.log('in googlemap, iwImageLeftArrow, imageIndex, after if statement:', this.props.imageIndex.count)
        // console.log('in googlemap, map iwImageLeftArrow clicked, t
        //his.props.imageIndex', this.props.imageIndex);
        // infowindowClickHandler(flat);
        document.getElementById('infowindow-box-image-box').setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_200,h_140/${flat.images[this.props.imageIndex.count].publicid}.jpg)`);
      }); // end of addListener

      google.maps.event.addDomListener(iwImageRightArrowDiv, 'click', (marker) => {
        let indexAtMax = false;
        // console.log('in googlemap, map iwImageRightArrow clicked');
        // const maxNumOfImages = infowindowClickHandler(flat);
        const maxImageIndex = flat.images.length - 1;

        // console.log('in googlemap, iwImageRightArrow, maxImageIndex:', maxImageIndex);
        // console.log('in googlemap, iwImageRightArrow, this.props.imageIndex.count before if statement:', this.props.imageIndex.count);

        if (this.props.imageIndex.count >= maxImageIndex) {
          // console.log('in googlemap, iwImageRightArrow, if statement, we are at maxNumOfImages');
          indexAtMax = true;
          this.props.incrementImageIndex(indexAtMax, maxImageIndex);
          // console.log('in googlemap, iwImageRightArrow, if statement, we are at indexAtMax:', indexAtMax);
        } else {
          this.props.incrementImageIndex(indexAtMax, maxImageIndex);
          // console.log('in googlemap, iwImageRightArrow, if statement, we are at indexAtMax:', indexAtMax);
        }
        // console.log('in googlemap, iwImageRightArrow, imageIndex after if statement:', this.props.imageIndex.count);
        document.getElementById('infowindow-box-image-box').setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_200,h_140/${flat.images[this.props.imageIndex.count].publicid}.jpg)`);
      }); // end of addDomListener

      // opens up new tab when IW details clicked and passes flat id in params to the new tab
      google.maps.event.addDomListener(iwDetailDiv, 'click', function () {
        // console.log('in googlemap, map iwDetailDiv clicked, marker', iwDetailDiv);
        // console.log('in googlemap, map iwDetailDiv clicked, marker', marker.flatId);
        // infowindowClickHandler(flat);
        const win = window.open(`/show/${marker.flatId}`, '_blank');
        win.focus();
      });
      // !!!! This works with componentDidUpdate
      // adds new marker to state; Cannot do this.state.markersArray.push as it mutates state
      this.setState(prevState => ({
        markersArray: [...prevState.markersArray, marker]
      })); // end of setState
    });// end of each
    // !!!! This works with componentDidUpdate
    // deletes old markers that went off the map from state
    if (oldMarkersArray.length > 0) {
      const newArray = [...this.state.markersArray]; // make a separate copy of the array
      _.each(oldMarkersArray, oldMarker => {
        const index = newArray.indexOf(oldMarker);
        newArray.splice(index, 1); // remove one element at index
      });
      this.setState({ markersArray: newArray });
    }
    // makes marker array element in state
    // this.setState({ markersArray });
    //****************************************
    //end of _.each flat create markers etc...
    google.maps.event.addListener(map, 'click', function (event) {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      // console.log('in googlemaps clicked latitude: ', latitude);
      // console.log('in googlemaps clicked longitude: ', longitude);

      //close open infowindows
      for (let i = 0; i < infowindowArray.length; i++) {
        infowindowArray[i].close();
      }
    }); //end addListener
  } // end of createMarker

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
  console.log('GoogleMap, mapStateToProps, state: ', state);
  return {
    imageIndex: state.imageIndex,
    mapBounds: state.mapBounds,
    searchFlatParams: state.flats.searchFlatParameters
    // flats: state.flats
  };
}


export default connect(mapStateToProps, actions)(GoogleMap);
