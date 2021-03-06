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
const infowindowArray = [];


// This component used for results page and showflat page;
// Takes prop showFlat, flatEmpty in case map pans to location with no flat,
// initialposition coming from show flat
class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: {},
      flatMarkersArray: [],
      buildingMarkersArray: []
    };
  }

  componentDidMount() {
    // renderMap has been moved to componentDidUpdate
    // if (this.props.showFlat) this.renderMap({ flats: this.props.flats, buildings: this.props.flatBuildings });
    // NOTE: To deal with the problem of Google Map changing its API in bounds ie Ta.g
    // the letters TA, g, i and etc are fetched from the backend in flats#get_google_map_bounds_keys
    // The letters are fetched and componentDidUpdate test for null and populated keys and
    // renderMap is called only if there is a state update where key is empty in prev and populated in this.props.
    // called in results.js CDM and showFlat.js componentDidMount also call this.props.getGoogleMapBoundsKeys
    // this.props.getGoogleMapBoundsKeys();
    // NOTE: if googleMapBoundsKeys already exists when CDM is called, call render map;
    // Otherwise, check in componentDidUpdate if googleMapBoundsKeys goes from null to not null
    if (this.props.googleMapBoundsKeys) this.renderMap({ flats: this.props.flats, buildings: this.props.flatBuildings });
  }//end of componentDidMount

  // CDU called After createMarkers setState or change in this.props.flat
  // or this.props.flatBuildings;
  // Takes flatMarkersArray from state (updated in createMarkers, as markers on map)
  // flat from prevProps and prevState compared to get newFlatsArray
  // (this.props.flat not in prevProops.flat); same for flatBuildings (flats sharing building)
  // and oldFlatMarkersArray (prevProps.flat not in this.props.flat); same for flatBuildings
  // takes newFlatsArray and calls createMarkers() passing flat array and oldFlatMarkersArray,
  // and also setMap null; same for flatBuildings

  componentDidUpdate(prevProps) {
    // flatsEmpty is prop passed in map render
    // and is true if there are no search results for the map area or criteria
    // Note; googleMapBoundsKeys are passed from the backend to deal with frequent google api changes
    // When these keys turn from null in prevProps to not null, call renderMap
    // Action to fetch bounds keys is called in results.js componentDidMount
    if (!prevProps.googleMapBoundsKeys && this.props.googleMapBoundsKeys) this.renderMap({ flats: this.props.flats, buildings: this.props.flatBuildings });

    if (this.props.flatBuildings && this.props.flats) {
    // Below code is for updating markers in map as user moves the map bounds or changes search criteria
    // Deletes old markers and creates new markers with changes in search condition
    // Back end api does the logic for prevPropsFlatIdArray and currentPropsFlatArray
    // and creates array of prev flats with just IDs so that easy to compare this and prev props
    const prevPropsFlatIdArray = prevProps.flatsId;
    const currentPropsFlatIdArray = this.props.flatsId;

    const newFlatsArray = [];
    // iterate over this.props.flats to get array of new flats and flat ids
    _.each(this.props.flats, (flat) => {
      // if prev props had flat ids
       if (prevPropsFlatIdArray.length > 0) {
        // if prev props did NOT include current flat id, then those are new
         // if (!prevPropsFlatIdArray.includes(flat.id)) {
         if (prevPropsFlatIdArray.indexOf(flat.id) === -1) {
           // newFlatsIdArray.push(flat.id);
           newFlatsArray.push(flat);
         }
      // if prev props array had nothing in it, then ALL this.props.flat are new
       } else {
         // newFlatsIdArray.push(flat.id);
         newFlatsArray.push(flat);
       }
     });

     // if current markers in state is NOT included in this.props.flats then they are old markers
     // go through each flat marker and if they are not included in
     // current props of flats, push into oldFlatMarkersArray to send to createMarkers
     // set map of null to take off of map
     const oldFlatMarkersArray = [];
     _.each(this.state.flatMarkersArray, marker => {
       // flatMarkersArrayIds.push(marker.flatId);
       // if (!currentPropsFlatIdArray.includes(marker.flatId)) {
       if (currentPropsFlatIdArray.indexOf(marker.flatId) === -1) {
      //     oldFlatMarkerIdArray.push(markerId);
        oldFlatMarkersArray.push(marker);
        marker.setMap(null);
        }
     });

     //  ****************BUILDINGS ****************
        // console.log('in googlemaps componentDidUpdate, currentPropsBuildingIdArray, prevPropsBuildingIdArray, this.state.buildingMarkersArray: ', currentPropsBuildingIdArray, prevPropsBuildingIdArray, this.state.buildingMarkersArray);
       // Object for creating new buildings
       const newBuildingsObject = {};
       // Array for deleting old markers
       const oldBuildingsIdArray = []
       // Gets buildingsJustId from backend api so obviates need to iterate through this.props and prevProps.flatBuildings
       const prevPropsBuildingIdArray = prevProps.buildingsJustId;
       const currentPropsBuildingIdArray = this.props.buildingsJustId;

       _.each(Object.keys(this.props.flatBuildings), (buildingKey) => {
         // if prev props had building ids
         if (prevPropsBuildingIdArray.length > 0) {
           // if prev props did NOT include current building id, then those are new
           // if (!prevPropsBuildingIdArray.includes(parseInt(buildingKey, 10))) {
           if (prevPropsBuildingIdArray.indexOf(parseInt(buildingKey, 10)) === -1) {
             // newBuildingsArray.push(building);
             newBuildingsObject[buildingKey] = this.props.flatBuildings[buildingKey];
           } else {
             // still need to check if flats inside buildings have changed
             // stringify the array for each building flat ids and compare if same flats
             if (prevProps.flatBuildingsId[buildingKey].sort().toString() !== this.props.flatBuildingsId[buildingKey].sort().toString()) {
               oldBuildingsIdArray.push(parseInt(buildingKey, 10));
               newBuildingsObject[buildingKey] = this.props.flatBuildings[buildingKey];
               // console.log('in googlemaps componentDidUpdate, each oldBuildingsIdArray: ', oldBuildingsIdArray);
             }
           }
           // if prev props array had nothing in it, then ALL this.props.flatbuilding are new
         } else {
           // else for if prevPropsBuildingIdArray.length > 0
           newBuildingsObject[buildingKey] = this.props.flatBuildings[buildingKey];
         }
       });

       const oldBuildingMarkersArray = []
       // go through each building marker and if they are not included in
       // current props of buildings, push into oldBuildingMarkersArray to send to createMarkers
       // set map of null to take off of map
       _.each(this.state.buildingMarkersArray, marker => {
         // if (!currentPropsBuildingIdArray.includes(marker.buildingId)) {
         if (currentPropsBuildingIdArray.indexOf(marker.buildingId) === -1) {
            oldBuildingMarkersArray.push(marker);
            marker.setMap(null);
          }
       });
       // Call create markers with all parameters prepared above
       this.createMarkers(newFlatsArray, oldFlatMarkersArray, newBuildingsObject, oldBuildingMarkersArray);

       // Below is workaround to get layer of GM to be z-index higher than the
       // other standard GM layers. Somehow GM api has set other laters to be
       // z-index 100003, so need to set layer with markers and draggable map
       // to be higher; Same with zoom buttons 
       const gmStyleElement = document.getElementsByClassName('gm-style')[0];
       const zoomButtonElement = document.getElementsByClassName('gmnoprint gm-bundled-control gm-bundled-control-on-bottom')[0];
       // const gmStyleElement = document.getElementsByClassName('gm-style').item(0).getElementsByTagName('div')[0];
       // console.log('in googlemap, componentDidUpdate gmStyleElement: ', gmStyleElement);
       if (gmStyleElement && zoomButtonElement) {
         gmStyleElement.getElementsByTagName('div')[0].style.zIndex = '1000004';
         zoomButtonElement.style.zIndex = '1000004';
       }
     }
     // END of if this.props.flatBuildings && flats
     // create markers passing array of new flats and
     // array of old markers where old markers will be taken out of state flatMarkersArray
  }

  renderMap({ flats, buildings }) {
    let initialZoom;
    // check if map is for showflat
    if (this.props.showFlat) {
      initialZoom = 14;
    } else {
      // this is where initial zoom is set after city search and jump to results page
      initialZoom = 12;
    }
    // console.log('in googlemap, renderMap, flats:', flats);
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
    // Show circle instead of marker if user on showFlat page
    this.setState({ map }, () => {
      this.props.setMap(map);
      if (this.props.showFlat) {
        this.createCircle();
      } else {
        this.createMarkers(flats, [], buildings, []);
      }
    });
    // Listner is fired when map is moved; gets map dimensions;
    // and call action fetchflats to get flats within map bounds
    // calls action updateMapDimensions for updating mapDimensions state
    // mapDimensions is used to render map when flats search result is empty
    google.maps.event.addListener(map, 'idle', () => {
      // console.log('in googlemap, map idle listener fired, map', map);
      // console.log('in googlemap, map idle listener fired, map.getBounds()', map.getBounds());
      // for (let i = 0; i < this.state.flatMarkersArray.length - 1; i++) {
      //   this.state.flatMarkersArray[i].setMap(null);
      // }

      const bounds = map.getBounds();
      const mapCenter = map.getCenter();
      const mapZoom = map.getZoom();
      // console.log('in googlemap, bounds.ka, bounds.pa: ', bounds.ka, bounds.pa);
      //leaving just to show how mapbounds works
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
      // for fetchFlats within the coordinate bounds; Gets map bounds and sends coordinartes for east/west/north/south
      // And the backend fetches flats within the bounds. Same as when user moves map as when map first renders
      // Got error of type error property f of undefined;
      // Looks like google maps changed its API so
      // change from b.f f.f to j.l and l.l
      // changed again 12/12/18 to ea.l and j and la.l and j
      // changed again 12/26/18 to fa.l and j ma.l and j
      // changed again 1/16/19 to ga.l and j ma.l and j
      // changed yet again 4/19 to ia.l and j, na.l and j
      // changed yet again 7/24 to ga.l and j, na.l and j what for????
      // changed yet again 12/17/2019 or before to ka.h, ka.g, pa.h, pa.g
      // changed yet again 1/16/2020 to pa.i, pa.g, ka.i, ka.g
      // changed yet again 1/24/2020 to Ya.i, Ya.g, Ta.i, Ta.g
      // !!!!!!!!!!!!! KEEP below console logs even in production
      console.log('in googlemap, bounds: ', bounds);
      // console.log('in googlemap, bounds.Ya.g, bounds.Ta.g: ', bounds.Ya.g, bounds.Ta.g);
      // NOTE: googleMapBoundsKeys is fetched from the backend flats#get_google_map_bounds_keys
      // This is so that when this app has a mobile app version, there is a way to change the code from the backend
      const { east_west_first, east_second, west_second, north_south_first, north_second, south_second } = this.props.googleMapBoundsKeys;
      // const mapBounds = {
      //   east: bounds.Ta.i,
      //   west: bounds.Ta.g,
      //   north: bounds.Ya.i,
      //   south: bounds.Ya.g
      // };
      // map bouunds is defined with keys received from backend api

      const mapBounds = {
        east: bounds[east_west_first][east_second],
        west: bounds[east_west_first][west_second],
        north: bounds[north_south_first][north_second],
        south: bounds[north_south_first][south_second]
      };
      console.log('in googlemap, bounds mapBounds: ', mapBounds);
      // const mapBounds = {
      //   east: bounds.b.f,
      //   west: bounds.b.b,
      //   north: bounds.f.f,
      //   south: bounds.f.b
      // };
      MAP_DIMENSIONS = { mapBounds, mapCenter, mapZoom };
      // updateMapBounds not available as app state obj but not currently used
      // console.log('in googlemap, this.props.mapBounds: ', this.props.mapBounds);

      //!!!!!!!!!!!!!run fetchFlats if map is not being rendered in show flat page!!!!!!!!!!!!!!!!!
      if (!this.props.showFlat && idleListenerOn) {
        // !!!!!!don't need updateMapDimensions now that results calls googleMap by using
        // searchFlatParams latlng and zoom; And if there is no searchFlatParams latlng
        // then if there is no latlng in searchFlatParams, then uses stored latlng and zoom
        this.props.updateMapDimensions(MAP_DIMENSIONS, () => {});
        // const searchAttributes = { price_max: 10000000, price_min: 0, bedrooms_max: 100, bedrooms_min: 0, bedrooms_exact: null };
        this.props.fetchFlats(mapBounds, this.props.searchFlatParams, () => this.fetchFlatsCallback('google maps'));
        this.props.showLoading('google maps');
      }
    }); // end of addlistner idle

    // google.maps.event.addListener(map, 'click', () => {
    //   console.log('in googlemap, map clicked inside renderMap function: ');
    // });

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
    // create circle for showflat map
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

  createEachIWFlatContent({ flat, infowindow, marker, buildingWithFlats, flatMarker, fromBuilding }) {
    //************ INFOWINDOW create element ***************
    // Calls function to create the main parent div inside the infowindow
    // with images, arrows and text; content set as infowindow content
    // Parent Div has image div and detail div as immediate children
    const iwDivParent = document.createElement('div');
    // Image div
    // console.log('in googlemaps, infowindow create elements, flat.images: ', flat.images);
    const iwImageDiv = document.createElement('div');
    iwImageDiv.id = 'infowindow-box-image-box';
    iwImageDiv.setAttribute('class', 'infowindow-box-image-box');
    iwImageDiv.setAttribute('ref', 'infowindow-box-image-box-ref');
    // !!!!if no image is available for the flat
    if (flat.images[this.props.imageIndex.count]) {
      iwImageDiv.setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_300,h_200/${flat.images[this.props.imageIndex.count].publicid}.jpg)`);
    } else {
      iwImageDiv.setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_300,h_200/no_image_placeholder_5.jpg)`);
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
    // font awesom icons do not work so use emoji!!!!!!!!
    iwImageLeftArrow.textContent = '❮';
    iwImageRightArrow.textContent = '❯';

    iwImageLeftArrowDiv.appendChild(iwImageLeftArrow);
    iwImageRightArrowDiv.appendChild(iwImageRightArrow);

    //IW Details; click on this addDomListener assigned will open a new tab to the flat show page
    // iwDetailDiv contains the text box and the arrow boxes (one to navigate back to building iw)
    const iwDetailDiv = document.createElement('div');
    iwDetailDiv.id = 'infowindow-box-detail-box';
    iwDetailDiv.setAttribute('class', 'infowindow-box-detail-box');
    // put two arrow boxes inside detail box flanking detail text box
    const iwDetailArrowBoxLeftDiv = document.createElement('div');
    iwDetailArrowBoxLeftDiv.id = 'infowindow-box-detail-arrow-box-left';
    iwDetailArrowBoxLeftDiv.setAttribute('class', 'infowindow-box-detail-arrow-box');
    // add back button if not flatMarker ie building marker
    fromBuilding ? iwDetailArrowBoxLeftDiv.innerHTML = `<div style="color: blue; padding-top: 19px;" class="iw-back-link">❮ Back</div>` : '';

    const iwDetailArrowBoxRightDiv = document.createElement('div');
    iwDetailArrowBoxRightDiv.id = 'infowindow-box-detail-arrow-box-right';
    iwDetailArrowBoxRightDiv.setAttribute('class', 'infowindow-box-detail-arrow-box');
    // iwDetailTextBoxDiv contains the flat information
    const iwDetailTextBoxDiv = document.createElement('div');
    iwDetailTextBoxDiv.id = 'infowindow-box-detail-text-box';
    const iwDetailDescription = document.createElement('div');

    iwDetailDescription.innerHTML = `<div style="color: gray; padding-top: 10px; height: auto;"><strong>${flat.description}</strong></div>`;
    const iwDetailArea = document.createElement('div');

    iwDetailArea.innerHTML = `<div>${flat.area}</div>`;
    const iwDetailPrice = document.createElement('div');

    iwDetailPrice.innerHTML = `<div>${this.props.currency}${parseFloat(flat.price_per_month).toFixed(0)} per month</div>`;

    iwDetailDiv.appendChild(iwDetailArrowBoxLeftDiv);
    iwDetailDiv.appendChild(iwDetailTextBoxDiv);
    iwDetailDiv.appendChild(iwDetailArrowBoxRightDiv);

    iwDetailTextBoxDiv.appendChild(iwDetailDescription);
    iwDetailTextBoxDiv.appendChild(iwDetailArea);
    iwDetailTextBoxDiv.appendChild(iwDetailPrice);

    iwDivParent.appendChild(iwImageDiv);
    iwDivParent.appendChild(iwDetailDiv);
    // !!!!End of creating elements; return iwDivParent at the very end after addListeners
    this.setIwDomReadyAddListener(infowindow);
    // addDomListener for left arrow in IW image carousel
    // clicks increment image index in redux, passes to action creator, two arguments
    // to test if image index is at zero or max number
    google.maps.event.addDomListener(iwImageLeftArrowDiv, 'click', () => {
      let indexAtZero = false;
      const maxImageIndex = flat.images.length - 1;
      // console.log('in googlemap, iwImageLeftArrow, this.props.imageIndex, before if statement:', this.props.imageIndex.count);
      if (this.props.imageIndex.count <= 0) {
        indexAtZero = true;
        this.props.decrementImageIndex(indexAtZero, maxImageIndex);
      } else {
        this.props.decrementImageIndex(indexAtZero, maxImageIndex);
      }

      document.getElementById('infowindow-box-image-box').setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_200,h_140/${flat.images[this.props.imageIndex.count].publicid}.jpg)`);
    }); // end of addListener

    google.maps.event.addDomListener(iwImageRightArrowDiv, 'click', () => {
      let indexAtMax = false;
      // console.log('in googlemap, map iwImageRightArrow clicked');
      const maxImageIndex = flat.images.length - 1;

      if (this.props.imageIndex.count >= maxImageIndex) {
        indexAtMax = true;
        this.props.incrementImageIndex(indexAtMax, maxImageIndex);
      } else {
        this.props.incrementImageIndex(indexAtMax, maxImageIndex);
      }
      // console.log('in googlemap, iwImageRightArrow, imageIndex after if statement:', this.props.imageIndex.count);
      document.getElementById('infowindow-box-image-box').setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_200,h_140/${flat.images[this.props.imageIndex.count].publicid}.jpg)`);
    }); // end of addDomListener

    // opens up new tab when IW details clicked and passes flat id in params to the new tab
    // google.maps.event.addDomListener(iwDetailDiv, 'click', () => {
    google.maps.event.addDomListener(iwDetailTextBoxDiv, 'click', () => {
      const win = window.open(`/show/${flat.id}`, '_blank');
      win.focus();
    });

    if (fromBuilding) {
      google.maps.event.addDomListener(iwDetailArrowBoxLeftDiv, 'click', () => {
        console.log('in googlemap, map iwDetailArrowBoxLeftDiv clicked, back');
        this.setInfowindowContent({ flat, infowindow, marker, buildingWithFlats, flatMarker: false, fromBuilding })
      });
    }
    // infowindow.setContent(iwDivParent);
    // !!!!!!!!!!!RETURN parent div
    return iwDivParent;
  }

  createMarkerIcon() {
    return {
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
  }

  setIwDomReadyAddListener(infowindow) {
    google.maps.event.addListener(infowindow, 'domready', () => {
      // NOTE: KEEP below just for future reference before Google changed the API
      // this addDomListener makes display nones of some divs in google maps
      // so that gm-style-iw can be styled and enable image to be panned across IW
      // gets infowindow element, returns array of HTML so get the first element in array
      // !!!!!!!! IMPORTANT AS OF 2/19/2019 no need for above code setting display none
      // on background and shadow elements
      // just need to assign CSS properties to gm-iw-style, gm-iw-style-c, gm-iw-style-d in sytle.css
      const gmStyleIwD = document.getElementsByClassName('gm-style-iw-d');
      // !!!!! ONLY styling attribute that cannot seem to go to style.css
      // since do not fit overflow options, visible|hidden|scroll|auto|initial|inherit
      // !!! Needs overflow = null to get rid of white space on div with class gm-style-iw-d
      gmStyleIwD[0].style.overflow = null;
      // !!! Needs maxWidth = null to get rid of white space when first IW opened
      gmStyleIwD[0].style.maxWidth = null;
    }); // end of addlistener
  }

  getFlatForIW(flatId) {
    let returnedFlat;
    console.log('in googlemap, getFlatForIW, this.props.flats:', this.props.flats)
    _.each(Object.keys(this.props.flatBuildings), eachBuildingKey => {
      console.log('in googlemap, getFlatForIW, eachBuildingKey:', eachBuildingKey)
      _.each(this.props.flatBuildings[eachBuildingKey], eachFlat => {
        if (eachFlat.id == flatId) {
          returnedFlat = eachFlat;
          return;
        }
      })
    })
    return returnedFlat;
  }

  createEachIWBuildingContent({ flat, infowindow, marker, buildingWithFlats, flatMarker, fromBuilding }) {
    // the parent div to be used for set content of infowidow
    const iwDivParent = document.createElement('div');
    // create Scroll div for flats
    const iwBuildingDiv = document.createElement('div');
    iwBuildingDiv.id = 'infowindow-box-building-box';
    iwBuildingDiv.setAttribute('class', 'infowindow-box-building-box');
    // create each flat within infowindow
    let iwEachFlatBox;
    let iwEachFlatBoxText;
    let iwEachFlatBoxImage;
    // iterate through each flat within building of infowindow
    _.each(buildingWithFlats, eachFlat => {
      // create box for each flat; position:relative
      iwEachFlatBox = document.createElement('div');
      iwEachFlatBox.setAttribute('class', 'infowindow-box-building-each-flat-box');
      iwEachFlatBox.value = eachFlat.id;
      // create box for text of each flat; posiiton:absolute top:0, left:0
      iwEachFlatBoxText = document.createElement('div');
      iwEachFlatBoxText.innerHTML = `<div key="${eachFlat.id}" value="${eachFlat.id}" style="color: white; padding-top: 15px; " class="iw-building-flat-text">${eachFlat.description} <br />${this.props.currency}${parseInt(eachFlat.price_per_month, 10)}</div>`;
      // create separate box for image of flat; ; posiiton:absolute top:0, left:0
      iwEachFlatBoxImage = document.createElement('div');
      iwEachFlatBoxImage.setAttribute('class', 'infowindow-box-building-each-flat-box-image');
      // in case no image is available for flat
      if (eachFlat.images) {
        iwEachFlatBoxImage.setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_150,h_100/${eachFlat.images[0].publicid}.jpg);`);
      } else {
        iwEachFlatBoxImage.setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_150,h_100/no_image_placeholder_5.jpg)`);
      }
      // make iwEachFlatBoxText and image a child of iwEachFlatBox
      // make iwEachFlatBoxText and image a child of iwBuildingDiv
      iwEachFlatBox.appendChild(iwEachFlatBoxText);
      iwEachFlatBox.appendChild(iwEachFlatBoxImage);
      iwBuildingDiv.appendChild(iwEachFlatBox);
      // add listener for each flat to change view to each flat infowindow
      google.maps.event.addDomListener(iwEachFlatBoxText, 'click', (event) => {
        // console.log('in googlemap, createEachIWBuildingContent, addDomListener click, event.target:', event.target)
        const clickedElement = event.target;
        // get flat id from value prop
        const elementVal = clickedElement.getAttribute('value');
        // get flat object from this.props.flatBuildings
        const flatForIw = this.getFlatForIW(elementVal);
        // call setInfowindowContent to set content of infowindow to flat infowindow
        // from building infowindow
        this.setInfowindowContent({ flat: flatForIw, buildingWithFlats, infowindow, marker, flatMarker: true, fromBuilding: true })
      });// end of addListener
    }); // end of each building array
    // create div for building details at bottom of infowindow
    const iwDetailDiv = document.createElement('div');
    iwDetailDiv.id = 'infowindow-box-detail-box';
    // create div for showing area of building
    const iwDetailAreaDiv = document.createElement('div');
    // set inside of details area
    iwDetailAreaDiv.innerHTML = `<div style="color: gray; padding-top: 10px; font-size: 13px;" class="iw-building-details-text">${buildingWithFlats[0].area}</div>`;
    // make iwDetailAreaDiv a child of iwDetailDiv
    iwDetailDiv.appendChild(iwDetailAreaDiv);

    // append building div and detail div to parent div
    iwDivParent.appendChild(iwBuildingDiv);
    iwDivParent.appendChild(iwDetailDiv);
    // get igm-style-iw ready for iw to open
    this.setIwDomReadyAddListener(infowindow);

    // !!!!return parent div with all content for building infowidow
    return iwDivParent;
  }

  createBuildingMarkerIcon() {
    return {
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
  }

  setInfowindowContent({ flat, infowindow, marker, buildingWithFlats, flatMarker, fromBuilding }) {
    // sets content of infowindow depending on user click
    // click on flat marker and iw content is set as flat iw without back button of building iw
    // if not flatMarker ie a building marker, create iw with building content
    let infowidowContent;
    // If calling for flat show infowindow (can be from building marker to show one of the flats)
    if (flatMarker) {
      // returns iwDivParent; can be called from building marker
      infowidowContent = this.createEachIWFlatContent({ flat, infowindow, marker, buildingWithFlats, flatMarker, fromBuilding });
    } else {
      // returns iwDivParent; only called from building marker
      infowidowContent = this.createEachIWBuildingContent({ flat, infowindow, marker, buildingWithFlats, flatMarker, fromBuilding });
    }
    // And sets the content as that parent div
    // set content for infowindow
    infowindow.setContent(infowidowContent);
  }

  handleMarkerClickOpenCloseIw({ marker, map, buildingWithFlats, infowindow, flat, flatMarker, fromBuilding }) {
    // !!listens for marker click to open infowindow on marker click
    marker.addListener('click', () => {
      //close all open infowindows first before opening clicked marker
      // infowindowArray is populated within create flat and building marker functions
      // using for loop for variety
      for (let i = 0; i < infowindowArray.length; i++) {
        infowindowArray[i].close();
      }
      // console.log('in google map, handleMarkerClickOpenCloseIw marker addlistener clicked, buildingWithFlats', buildingWithFlats);
      // call set content for infowindow
      this.setInfowindowContent({ flat, buildingWithFlats, infowindow, marker, flatMarker, fromBuilding });
      // then open clicked infowindow
      // to avoid triggering idle listener, turn off global variable idleListeron, open infowidow,
      // then turn idleListenerOn to true after some time.
      idleListenerOn = false;
      infowindow.open(map, marker);
      setTimeout(() => {
        idleListenerOn = true;
        }, 2000); // restore functionality after 2 seconds
    });
  }

  createEachFlatMarker(flat, map) {
    // console.log('in google map, createEachFlatMarker, flat', flat);
    const markerLabel = this.props.showFlat ? 'Here is the listing' : `$${parseFloat(flat.price_per_month).toFixed(0)}`;
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
    const markerIcon = this.createMarkerIcon()
    // create marker
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
    // create infowindow content of which to be set in setInfowindowContent function
    const infowindow = new google.maps.InfoWindow({
      maxWidth: 300,
      key: flat.id
    });

    //infowindowArray for closing all open infowindows at map click
    infowindowArray.push(infowindow);

    // to open infowindow on marker click, create and set iw content
    this.handleMarkerClickOpenCloseIw({ marker, map, infowindow, flat, flatMarker: true, fromBuilding: false });

    // not sure if need this, but gets latLng when click marker;
    // leave just to show event parameter working
    // marker.addListener('click', (event) => {
    //   const latitude = event.latLng.lat();
    //   const longitude = event.latLng.lng();
    //   // console.log('in googlemaps clicked marker latitude: ', latitude);
    //   // console.log('in googlemaps clicked marker longitude: ', longitude);
    // });
    // !!!! This works with componentDidUpdate to take off old markers upon props update
    // adds new marker to state; Cannot do this.state.flatMarkersArray.push as it mutates state
    this.setState(prevState => ({
      flatMarkersArray: [...prevState.flatMarkersArray, marker]
    })); // end of setState
  }

  getPriceRange(building) {
    // get range of flat prices for buildings
    building.sort((a, b) => {
      return a.price_per_month - b.price_per_month;
    });

    const min = building[0].price_per_month;
    const max = building[building.length - 1].price_per_month;

    return { min, max };
  }

  createEachBuildingMarker(buildingWithFlats, map) {
    // console.log('in googlemaps createEachBuildingMarker buildingWithFlats: ', buildingWithFlats);
    // create building markers with multiple flats
    const priceRange = this.getPriceRange(buildingWithFlats);
    let markerLabel = `$${(parseFloat(priceRange.min) / 1000).toFixed(1)}k` + '~' + `$${(parseFloat(priceRange.max) / 1000).toFixed(1)}k`;
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
    const markerIcon = this.createBuildingMarkerIcon()
    // create markers for buildings; use first in array of
    // buildingWithFlats to get building id, latlng
    const marker = new google.maps.Marker({
      key: buildingWithFlats[0].building.id,
      position: {
        lat: buildingWithFlats[0].lat,
        lng: buildingWithFlats[0].lng
      },
      map,
      flatId: buildingWithFlats,
      buildingId: buildingWithFlats[0].building.id,
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
    // create infowidow, content to be set in setInfowindowContent funciton
    const infowindow = new google.maps.InfoWindow({
      maxWidth: 300,
      key: buildingWithFlats[0].building.id
    });

    //infowindowArray for closing all open infowindows at map click
    infowindowArray.push(infowindow);
    // To open infowindow on marker click
    this.handleMarkerClickOpenCloseIw({ marker, map, infowindow, buildingWithFlats, flatMarker: false, fromBuilding: true });

    // !!!! This works with componentDidUpdate to take off old markers upon props update
    // adds new marker to state; Cannot do this.state.flatMarkersArray.push as it mutates state
    this.setState(prevState => ({
      buildingMarkersArray: [...prevState.buildingMarkersArray, marker]
    })); // end of setState
  }

  createMarkers(flats, oldFlatMarkersArray, buildings, oldBuildingMarkersArray) {
    // console.log('in googlemaps createMarkers flats, oldFlatMarkersArray, buildings, oldBuildingMarkersArray: ', flats, oldFlatMarkersArray, buildings, oldBuildingMarkersArray);
    // create markers for both flats and buildings
    const map = this.state.map;
    // !!!! This works with componentDidUpdate
    // deletes old markers that went off the map from state
    // called before create each marker to avoid confution with componentDidUpdate
    // being called on state update before markers added to flatMarkersArray
    if (oldFlatMarkersArray.length > 0) {
      const flatNewArray = [...this.state.flatMarkersArray]; // make a separate copy of the array
      _.each(oldFlatMarkersArray, oldMarker => {
        // iterate through array popualted in componentDidUpdate
        const index = flatNewArray.indexOf(oldMarker); // get index of marker to be deleted
        flatNewArray.splice(index, 1); // remove one element at index
      });
      this.setState({ flatMarkersArray: flatNewArray }, () => {
        // assign new array to state array
      });
    }

    if (oldBuildingMarkersArray.length > 0) {
      const buildingNewArray = [...this.state.buildingMarkersArray]; // make a separate copy of the array
      _.each(oldBuildingMarkersArray, oldMarker => {
        // iterate through array popualted in componentDidUpdate
        const index = buildingNewArray.indexOf(oldMarker);// get index of marker to be deleted
        buildingNewArray.splice(index, 1); // remove one element at index
      });
      // assign new array to state array
      this.setState({ buildingMarkersArray: buildingNewArray });
    }
    // After deleting old markers, create markers
    // Iterate through flats from props in results OR new flats in componentDidUpdate
    _.each(flats, (flat) => {
      this.createEachFlatMarker(flat, map); // end of createEachFlatMarker
    });// end of each flat

    // Iterate through buildings from props in results OR new buildings in componentDidUpdate
    if (buildings) {
      _.each(buildings, eachBuildingWithFlats => {
        this.createEachBuildingMarker(eachBuildingWithFlats, map);
      }); // end of each buildings
    } // end of if buildings
    // if user click on map, close any open infowindows
    google.maps.event.addListener(map, 'click', () => {
      //close all open infowindows on map click
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

function mapStateToProps(state) {
  console.log('GoogleMap, mapStateToProps, state: ', state);
  return {
    imageIndex: state.imageIndex,
    mapBounds: state.mapBounds,
    searchFlatParams: state.flats.searchFlatParameters,
    googleMapBoundsKeys: state.flats.googleMapBoundsKeys
  };
}


export default connect(mapStateToProps, actions)(GoogleMap);
