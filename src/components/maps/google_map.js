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
      buildingMarkersArray: [],
      // initialFlats: {},
      // initialRerenderMap: true
    };

    // this.createMarkers = this.createMarkers.bind(this);
  }

  componentDidMount() {
    // runs right after component is rendered to the screeen
    // flatsEmpty is prop passed in map render
    // and is true if there are no search results for the map area or criteria
    this.renderMap({ flats: this.props.flats, buildings: this.props.flatBuildings });
    // this.createMarkers();

    // console.log('in googlemaps componentDidMount, this.props: ', this.props);
    // this.setState({ initialFlats: this.props.flats });
  }
  //*********************************************************
  //end of componentDidMount

  // CDU called After createMarkers setState and change in this.props.flat;
  // Takes flatMarkersArray from state (updated in createMarkers, as markers on map)
  // flat from prevProps and prevState compared to get newFlatsArray (this.props.flat not in prevProops.flat)
  // and oldFlatMarkersArray (prevProps.flat not in this.props.flat)
  // takes newFlatsArray and calls createMarkers() passing flat array and oldFlatMarkersArray, and also setMap null

  componentDidUpdate(prevProps) {
    // takes state flatMarkersArray updated in this.createMarkers
    // and creates array of markers on map with just IDs so that easy to compare this and prev props
    //
    // and creates array of prev flats with just IDs so that easy to compare this and prev props
    const prevPropsFlatIdArray = [];
    _.each(prevProps.flats, flat => {
      prevPropsFlatIdArray.push(flat.id);
    });

    // and creates array of current flats with just IDs so that easy to compare this and prev props
    const currentPropsFlatIdArray = [];
    const currentPropsFlatArray = [];
    _.each(this.props.flats, flat => {
      currentPropsFlatIdArray.push(flat.id);
      // since this.props.flats is an object of objects
      currentPropsFlatArray.push(flat);
    });

    const flatMarkersArrayIds = [];
    _.each(this.state.flatMarkersArray, marker => {
      flatMarkersArrayIds.push(marker.flatId);
    });
    console.log('in googlemaps componentDidUpdate, prevPropsFlatIdArray currentPropsFlatIdArray, this.state.flatMarkersArray: ', prevPropsFlatIdArray, currentPropsFlatIdArray, this.state.flatMarkersArray);

    // iterate over this.props.flats to get array of new flats and flat ids
    // const newFlatsIdArray = [];
    const newFlatsArray = [];

    _.each(this.props.flats, (flat) => {
      // if prev props had flat ids
       if (prevPropsFlatIdArray.length > 0) {
        // if prev props did NOT include current flat id, then those are new
         if (!prevPropsFlatIdArray.includes(flat.id)) {
           // newFlatsIdArray.push(flat.id);
           newFlatsArray.push(flat);
           // console.log('in googlemaps componentDidUpdate, flatMarkersArrayIds newMarkerArray: ', flatMarkersArrayIds, newMarkerArray);
         }
      // if prev props array had nothing in it, then ALL this.props.flat are new
       } else {
         // newFlatsIdArray.push(flat.id);
         newFlatsArray.push(flat);
       }
     });

     // if current markers in state is NOT included in this.props.flats then they are old markers
     // Note: id array
     const oldFlatMarkerIdArray = [];
     _.each(flatMarkersArrayIds, markerId => {
       // console.log('in googlemaps componentWillReceiveProps, oldFlatMarkerIdArray each, markerId: ', markerId);
       if (!currentPropsFlatIdArray.includes(markerId)) {
         oldFlatMarkerIdArray.push(markerId);
       }
     });
     // Note: NOT id array, marker array
     const oldFlatMarkersArray = [];
     // console.log('in googlemaps componentDidUpdate, oldFlatMarkersArray: ', oldFlatMarkersArray);
     // iterate over oldMarkerArray to get the actual markers in state with id
     _.each(oldFlatMarkerIdArray, markerId => {
        const oldMarker = this.state.flatMarkersArray.filter(flatMarker => {
          // returns array of markers (in each case just one) with flat.id of oldMarkers flat_id
         return flatMarker.flatId === markerId;
       });
       oldFlatMarkersArray.push(oldMarker[0]);
     });
     // take oldFlatMarkersArray and setMap null to remove from map
     _.each(oldFlatMarkersArray, marker => {
       marker.setMap(null);
       // clearMarkers(marker);
     });

     //  ****************BUILDINGS ****************
     // need to check flatBuildings for Object.keys
     if (this.props.flatBuildings) {
       const buildingMarkersArrayIds = [];
       _.each(this.state.buildingMarkersArray, marker => {
         buildingMarkersArrayIds.push(marker.buildingId);
       });

       const prevPropsBuildingIdArray = [];
       const prevPropsBuildingObject = {};
       _.each(prevProps.flatBuildings, building => {
         prevPropsBuildingIdArray.push(building[0].building.id);
         prevPropsBuildingObject[building[0].building.id] = building;
       });

       const currentPropsBuildingIdArray = [];
       const currentPropsBuildingArray = [];
       const currentPropsBuildingObject = {};
       _.each(this.props.flatBuildings, building => {
         currentPropsBuildingIdArray.push(building[0].building.id);
         // since this.props.flats is an object of objects
         currentPropsBuildingArray.push(building);
         currentPropsBuildingObject[building[0].building.id] = building;
       });
       // console.log('in googlemaps componentDidUpdate, currentPropsBuildingIdArray, prevPropsBuildingIdArray, this.state.buildingMarkersArray: ', currentPropsBuildingIdArray, prevPropsBuildingIdArray, this.state.buildingMarkersArray);
       let newBuildingsObject = {};
       let oldBuildingsIdArray = []

       _.each(Object.keys(this.props.flatBuildings), (buildingKey) => {
         // if prev props had building ids
         if (prevPropsBuildingIdArray.length > 0) {
           // if prev props did NOT include current building id, then those are new
           if (!prevPropsBuildingIdArray.includes(parseInt(buildingKey, 10))) {
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
           // newBuildingsArray.push(building);
           newBuildingsObject[buildingKey] = this.props.flatBuildings[buildingKey];
         }
       });

       _.each(buildingMarkersArrayIds, markerId => {
         if (!currentPropsBuildingIdArray.includes(markerId)) {
           oldBuildingsIdArray.push(markerId);
         }
       });

       const oldBuildingMarkersArray = []
       _.each(oldBuildingsIdArray, markerId => {
          const oldMarker = this.state.buildingMarkersArray.filter(buildingMarker => {
            // returns array of markers (in each case just one) with flat.id of oldMarkers flat_id
           return buildingMarker.buildingId === markerId;
         });
         oldBuildingMarkersArray.push(oldMarker[0]);
       });

       // take oldFlatMarkersArray and setMap null to remove from map
       _.each(oldBuildingMarkersArray, marker => {
         marker.setMap(null);
       });

       this.createMarkers(newFlatsArray, oldFlatMarkersArray, newBuildingsObject, oldBuildingMarkersArray);
     }
     // END of if this.props.flatBuildings
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
    // console.log('in googlemap, componentDidMount, this.props.flatsEmpty:', this.props.flatsEmpty);
    // console.log('in googlemap, componentDidMount, INITIAL_ZOOM:', INITIAL_ZOOM);
    // console.log('in googlemap, renderMap, this.props.initialPosition:', this.props.initialPosition);

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
        this.createMarkers(flats, [], buildings, []);
      }
    });
    // Fired when map is moved; gets map dimensions
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
      console.log('in googlemap, bounds: ', bounds);
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
      // for (let i = 0; i < this.state.flatMarkersArray.length - 1; i++) {
      //   this.state.flatMarkersArray[i].setMap(null);
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

  createEachIWFlatContent({ flat, infowindow, marker, buildingWithFlats, flatMarker, fromBuilding }) {
    //************ INFOWINDOW create element ***************
    //Parent Div has image div and detaildiv as immediate children
    const iwDivParent = document.createElement('div');
    // iwDivParent.id = 'infowindow-box-parent-div';

    // Image div
    // console.log('in googlemaps, infowindow create elements, flat.images: ', flat.images);
    const iwImageDiv = document.createElement('div');
    iwImageDiv.id = 'infowindow-box-image-box';
    iwImageDiv.setAttribute('class', 'infowindow-box-image-box');
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
    // iwDetailDescription.id = 'infowindow-box-image-box-sib';
    iwDetailDescription.innerHTML = `<div style="color: gray; padding-top: 10px;"><strong>${flat.description}</strong></div>`;
    const iwDetailArea = document.createElement('div');
    // iwDetailDescription.id = 'infowindow-box-image-box-sib';
    iwDetailArea.innerHTML = `<div>${flat.area}</div>`;
    const iwDetailPrice = document.createElement('div');
    // iwDetailDescription.id = 'infowindow-box-image-box-sib';
    iwDetailPrice.innerHTML = `<div>${this.props.currency}${parseFloat(flat.price_per_month).toFixed(0)} per month</div>`;

    iwDetailDiv.appendChild(iwDetailArrowBoxLeftDiv);
    iwDetailDiv.appendChild(iwDetailTextBoxDiv);
    iwDetailDiv.appendChild(iwDetailArrowBoxRightDiv);
    // iwDetailDiv.appendChild(iwDetailArea);
    // iwDetailDiv.appendChild(iwDetailPrice);

    iwDetailTextBoxDiv.appendChild(iwDetailDescription);
    iwDetailTextBoxDiv.appendChild(iwDetailArea);
    iwDetailTextBoxDiv.appendChild(iwDetailPrice);

    iwDivParent.appendChild(iwImageDiv);
    iwDivParent.appendChild(iwDetailDiv);
    // element.classList.add('mystyle');
    // !!!!End of creating elements; return iwDivParent at the very end after addListeners
    this.setIwDomReadyAddListener(infowindow);
    // addDomListener for left arrow in IW image carousel
    // clicks increment image index in redux, passes to action creator, two arguments
    // to test if image index is at zero or max number
    google.maps.event.addDomListener(iwImageLeftArrowDiv, 'click', () => {
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

    google.maps.event.addDomListener(iwImageRightArrowDiv, 'click', () => {
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
    // google.maps.event.addDomListener(iwDetailDiv, 'click', () => {
    google.maps.event.addDomListener(iwDetailTextBoxDiv, 'click', () => {
      // console.log('in googlemap, map iwDetailDiv clicked, marker', iwDetailDiv);
      // console.log('in googlemap, map iwDetailDiv clicked, marker', marker.flatId);
      // infowindowClickHandler(flat);
      // const win = window.open(`/show/${marker.flatId}`, '_blank');
      const win = window.open(`/show/${flat.id}`, '_blank');
      win.focus();
    });

    if (fromBuilding) {
      google.maps.event.addDomListener(iwDetailArrowBoxLeftDiv, 'click', () => {
        console.log('in googlemap, map iwDetailArrowBoxLeftDiv clicked, back');
        // iwImageDiv.classList.add('hide');
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
      // this addDomListener takes display nones some divs in google maps
      // so that gm-style-iw can be styled enable image to be panned across IW
      // gets infowindow element, returns array of HTML so get the first element in array
      // const gmStyleIw = document.getElementsByClassName('gm-style-iw');
      const gmStyleIw = document.getElementsByClassName('gm-style-iw');
      // !!!!!!gmStyleIwAlt to deal with previousSibling of undefined error;
      // somehow, building marker clicks trigger this error
      const gmStyleIwAlt = document.getElementsByClassName('google-map-gm-style-iw');
      const iwBackground = gmStyleIw[0] ? gmStyleIw[0].previousSibling : gmStyleIwAlt[0].previousSibling;
      const nextSibling = gmStyleIw[0] ? gmStyleIw[0].nextSibling : gmStyleIwAlt[0].nextSibling;
      //gets the element with the white background and assign style of display none
      const iwBackgroundWhite = iwBackground.lastChild;
      iwBackgroundWhite.style.display = 'none';
      // get element with shadow behind the IW and assign style of display none;
      //item number is index
      const iwBackgroundShadow = iwBackground.getElementsByTagName('div').item(1);
      iwBackgroundShadow.style.display = 'none';

      // name class so that .gm-style-iw styling does not clash with others
      gmStyleIw[0] ? gmStyleIw[0].setAttribute('class', 'google-map-gm-style-iw') : '';
      // for taking out close button img that is standard with google map
      nextSibling.setAttribute('class', 'google-map-gm-style-iw-next');
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
    let iwEachFlatBox;
    let iwEachFlatBoxText;
    let iwEachFlatBoxImage;
    //
    // const array = [1, 2, 3, 4, 5, 6];
    // const array = [43, 202];
    _.each(buildingWithFlats, eachFlat => {
      iwEachFlatBox = document.createElement('div');
      iwEachFlatBoxText = document.createElement('div');
      iwEachFlatBoxImage = document.createElement('div');
      iwEachFlatBox.setAttribute('class', 'infowindow-box-building-each-flat-box');
      iwEachFlatBoxImage.setAttribute('class', 'infowindow-box-building-each-flat-box-image');
      iwEachFlatBoxImage.setAttribute('style', `background-image: url(http://res.cloudinary.com/chikarao/image/upload/w_210,h_140/${eachFlat.images[0].publicid}.jpg);`);
      iwEachFlatBox.value = eachFlat.id;
      iwEachFlatBoxText.innerHTML = `<div key="${eachFlat.id}" value="${eachFlat.id}" style="color: white; padding-top: 15px; " class="iw-building-flat-text">${eachFlat.description} <br />${this.props.currency}${parseInt(eachFlat.price_per_month, 10)}</div>`;
      // make iwEachFlatBox a child of iwBuildingDiv
      iwEachFlatBox.appendChild(iwEachFlatBoxText);
      iwEachFlatBox.appendChild(iwEachFlatBoxImage);
      iwBuildingDiv.appendChild(iwEachFlatBox);

      google.maps.event.addDomListener(iwEachFlatBoxText, 'click', (event) => {
        console.log('in googlemap, createEachIWBuildingContent, addDomListener click, event.target:', event.target)
        const clickedElement = event.target;
        const elementVal = clickedElement.getAttribute('value');
        const flatForIw = this.getFlatForIW(elementVal);
        console.log('in googlemap, createEachIWBuildingContent, addDomListener click, flatForIw:', flatForIw)
        this.setInfowindowContent({ flat: flatForIw, buildingWithFlats, infowindow, marker, flatMarker: true, fromBuilding: true })
      });// end of addListener
    }); // end of each array

    const iwDetailDiv = document.createElement('div');
    iwDetailDiv.id = 'infowindow-box-detail-box';
    const iwDetailAreaDiv = document.createElement('div');
    iwDetailAreaDiv.innerHTML = `<div style="color: gray; padding-top: 10px; font-size: 13px;" class="iw-building-details-text">${buildingWithFlats[0].area}</div>`;
    iwDetailDiv.appendChild(iwDetailAreaDiv);

    iwDivParent.appendChild(iwBuildingDiv);
    iwDivParent.appendChild(iwDetailDiv);
    // get igm-style-iw ready for iw to open
    this.setIwDomReadyAddListener(infowindow);
    // google.maps.event.addListener(infowindow, 'domready', () => {
    //   // this addDomListener takes display nones some divs in google maps
    //   // so that gm-style-iw can be styled enable image to be panned across IW
    //   // gets infowindow element, returns array of HTML so get the first element in array
    //   // const gmStyleIw = document.getElementsByClassName('gm-style-iw');
    //   const gmStyleIw = document.getElementsByClassName('gm-style-iw');
    //   // !!!!!!gmStyleIwAlt to deal with previousSibling of undefined error;
    //   // somehow, building marker clicks trigger this error
    //   const gmStyleIwAlt = document.getElementsByClassName('google-map-gm-style-iw');
    //   const iwBackground = gmStyleIw[0] ? gmStyleIw[0].previousSibling : gmStyleIwAlt[0].previousSibling;
    //   const nextSibling = gmStyleIw[0] ? gmStyleIw[0].nextSibling : gmStyleIwAlt[0].nextSibling;
    //   //gets the element with the white background and assign style of display none
    //   const iwBackgroundWhite = iwBackground.lastChild;
    //   iwBackgroundWhite.style.display = 'none';
    //   // get element with shadow behind the IW and assign style of display none;
    //   //item number is index
    //   const iwBackgroundShadow = iwBackground.getElementsByTagName('div').item(1);
    //   iwBackgroundShadow.style.display = 'none';
    //
    //   // name class so that .gm-style-iw styling does not clash with others
    //   gmStyleIw[0] ? gmStyleIw[0].setAttribute('class', 'google-map-gm-style-iw') : '';
    //   // for taking out close button img that is standard with google map
    //   nextSibling.setAttribute('class', 'google-map-gm-style-iw-next');
    // }); // end of addlistener

    // google.maps.event.addDomListener(iwEachFlatBox, 'click', () => {
    //   console.log('in googlemap, addDomListener iwEachFlatBox click:', iwEachFlatBox)
    // }); // end of addListener
    // const flatsArray = document.querySelectorAll('.infowindow-box-building-each-flat-box');
    // HTMLCollection.prototype.forEach = Array.prototype.forEach;
    // NodeList.prototype.forEach = Array.prototype.forEach;
    // const htmlCollection = document.getElementsByClassName('infowindow-box-building-each-flat-box');
    // console.log('in googlemap, createEachIWBuildingContent click, typeof htmlCollection, Object.keys(htmlCollection), htmlCollection[5]:', typeof htmlCollection, Object.keys(htmlCollection), htmlCollection[5])
    // let flatsArray = []
    // _.each(Object.keys(htmlCollection), eachKey => {
    //   console.log('in googlemap, createEachIWBuildingContent click, htmlCollection eachKey:', eachKey)
    //   flatsArray.push(htmlCollection[eachKey]);
    // })
    //
    // htmlCollection.forEach((element, i) => {
    //   console.log('in googlemap, createEachIWBuildingContent click, htmlCollection element, i:', element, i)
    //   //do your stuffs
    // });
    //
    // Array.prototype.slice.call(document.getElementsByClassName('infowindow-box-building-each-flat-box')).forEach(function (key) {
    //   console.log('in googlemap, createEachIWBuildingContent click, htmlCollection key', key)
    //     // console.log(key.id);
    // });
    // // for (let i = 0; i < htmlCollection.length; i++) {
    // //   // flatsArray.push(htmlCollection[i]);
    // //   console.log('in googlemap, createEachIWBuildingContent click, for loop htmlCollection[i]:', htmlCollection[i])
    // // }
    // // const flatsArray = [...htmlCollection];
    // // const flatsArray = Array.from(htmlCollection);
    // // const flatsArray = [].slice.call(htmlCollection);
    // console.log('in googlemap, createEachIWBuildingContent click, htmlCollection:', htmlCollection);
    // console.log('in googlemap, createEachIWBuildingContent click, flatsArray:', flatsArray);
    // // console.log('in googlemap, createEachIWBuildingContent click, google.maps.event:', google.maps.event)
    // _.each(flatsArray, eachFlat => {
    //   console.log('in googlemap, createEachIWBuildingContent, each flat click, eachFlat:', eachFlat)
    //   google.maps.event.addDomListener(eachFlat, 'click', () => {
    //       console.log('in googlemap, createEachIWBuildingContent, addDomListener click, eachFlat.value:', eachFlat.value)
    //   });// end of addListener
    // })

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
    let infowidowContent;
    if (flatMarker) {
      infowidowContent = this.createEachIWFlatContent({ flat, infowindow, marker, buildingWithFlats, flatMarker, fromBuilding });
      // And sets the content as that parent div
    } else {
      infowidowContent = this.createEachIWBuildingContent({ flat, infowindow, marker, buildingWithFlats, flatMarker, fromBuilding });
    }
    infowindow.setContent(infowidowContent);
  }

  handleMarkerClickOpenCloseIw({ marker, map, buildingWithFlats, infowindow, flat, flatMarker, fromBuilding }) {
    // !!!!!!!!!!!!!!!!!!!!!!!to open infowindow on marker click
    marker.addListener('click', () => {
      //close all open infowindows first
      for (let i = 0; i < infowindowArray.length; i++) {
        infowindowArray[i].close();
      }
      console.log('in google map, handleMarkerClickOpenCloseIw marker addlistener clicked, buildingWithFlats', buildingWithFlats);

      this.setInfowindowContent({ flat, buildingWithFlats, infowindow, marker, flatMarker, fromBuilding });
      // const flatMarker = true;
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
    console.log('in google map, createEachFlatMarker, flat', flat);

    const markerLabel = this.props.showFlat ? 'Here is the listing' : `$${parseFloat(flat.price_per_month).toFixed(0)}`;
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
    const markerIcon = this.createMarkerIcon()

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

    const infowindow = new google.maps.InfoWindow({
      maxWidth: 300,
      key: flat.id
    });

    //infowindowArray for closing all open infowindows at map click
    infowindowArray.push(infowindow);

    // !!!!!!!!!!!!!!!!!!!!!!!to open infowindow on marker click, create and set iw content
    // const flatMarker = true;
    this.handleMarkerClickOpenCloseIw({ marker, map, infowindow, flat, flatMarker: true, fromBuilding: false });

    // not sure if need this, but gets latLng when click marker;
    // leave just to show event parameter working
    marker.addListener('click', (event) => {
      const latitude = event.latLng.lat();
      const longitude = event.latLng.lng();
      // console.log('in googlemaps clicked marker latitude: ', latitude);
      // console.log('in googlemaps clicked marker longitude: ', longitude);
    });

    //************ INFOWINDOW create element ***************
    // Calls function to create the main parent div inside the infowindow
    // with images, arrows and text
    // const flatMarker = true;
    // const iwDivParent = this.createEachIWFlatContent(flat, infowindow, marker, flatMarker);
    // // And sets the content as that parent div
    // infowindow.setContent(iwDivParent);
    // flatIWDivClasses = ['infowindow-box-image-box', 'infowindow-box-detail-box']

    // console.log('in google map, createEachFlatMarker, marker', marker);

    // !!!! This works with componentDidUpdate
    // adds new marker to state; Cannot do this.state.flatMarkersArray.push as it mutates state
    this.setState(prevState => ({
      flatMarkersArray: [...prevState.flatMarkersArray, marker]
    })); // end of setState
  }

  getPriceRange(building) {
    building.sort((a, b) => {
      return a.price_per_month - b.price_per_month
    })

    const min = building[0].price_per_month;
    const max = building[building.length - 1].price_per_month

    return { min, max };
  }

  createEachBuildingMarker(buildingWithFlats, map) {
    // console.log('in googlemaps createEachBuildingMarker buildingWithFlats: ', buildingWithFlats);
    // let markerLabel = `${buildingWithFlats.length}` + ' Units' + '\n' + `$${parseFloat(buildingWithFlats[0].price_per_month).toFixed(0)}`;
    // let markerLabel = `${buildingWithFlats.length}` + ' Units' + '\n' + `$${parseFloat(buildingWithFlats[0].price_per_month).toFixed(0)}`;

    const priceRange = this.getPriceRange(buildingWithFlats);
    // let markerLabel = `${buildingWithFlats.length}` + ' Units' + '\n' + `$${parseFloat(buildingWithFlats[0].price_per_month).toFixed(0)}`;
    let markerLabel = `$${(parseFloat(priceRange.min) / 1000).toFixed(1)}k` + '~' + `$${(parseFloat(priceRange.max) / 1000).toFixed(1)}k`;
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
    const markerIcon = this.createBuildingMarkerIcon()

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

    const infowindow = new google.maps.InfoWindow({
      maxWidth: 300,
      key: buildingWithFlats[0].building.id
    });
    // }

    //infowindowArray for closing all open infowindows at map click
    infowindowArray.push(infowindow);
    // To open infowindow on marker click
    // const flatMarker = false;
    this.handleMarkerClickOpenCloseIw({ marker, map, infowindow, buildingWithFlats, flatMarker: false, fromBuilding: true });

    // console.log('in googlemaps createEachBuildingMarker marker: ', marker);
    this.setState(prevState => ({
      buildingMarkersArray: [...prevState.buildingMarkersArray, marker]
    })); // end of setState
  }

  createMarkers(flats, oldFlatMarkersArray, buildings, oldBuildingMarkersArray) {
    // console.log('in googlemaps createMarkers flats, oldFlatMarkersArray, buildings, oldBuildingMarkersArray: ', flats, oldFlatMarkersArray, buildings, oldBuildingMarkersArray);
    // required infowindowArray to close infowindow on map click
    // const infowindowArray = [];
    const map = this.state.map;

    // !!!! This works with componentDidUpdate
    // deletes old markers that went off the map from state
    if (oldFlatMarkersArray.length > 0) {
      const flatNewArray = [...this.state.flatMarkersArray]; // make a separate copy of the array
      _.each(oldFlatMarkersArray, oldMarker => {
        const index = flatNewArray.indexOf(oldMarker);
        flatNewArray.splice(index, 1); // remove one element at index
      });
      this.setState({ flatMarkersArray: flatNewArray }, () => {
        // console.log('in googlemaps create  Markers, this.state.flatMarkersArray: ', this.state.flatMarkersArray);
      });
    }

    if (oldBuildingMarkersArray.length > 0) {
      const buildingNewArray = [...this.state.buildingMarkersArray]; // make a separate copy of the array
      _.each(oldBuildingMarkersArray, oldMarker => {
        const index = buildingNewArray.indexOf(oldMarker);
        buildingNewArray.splice(index, 1); // remove one element at index
      });
      this.setState({ buildingMarkersArray: buildingNewArray });
    }

    //flats from props in results and new flats in componentDidUpdate
    _.each(flats, (flat) => {
      this.createEachFlatMarker(flat, map, () => {
      }); // end of createEachFlatMarker
    });// end of each flat

    //buildings from props in results and new buildings in componentDidUpdate
    if (buildings) {
      _.each(buildings, eachBuildingWithFlats => {
        this.createEachBuildingMarker(eachBuildingWithFlats, map);
      }); // end of each buildings
    } // end of if buildings

    //****************************************
    //end of _.each flat create markers etc...
    google.maps.event.addListener(map, 'click', () => {
      // const latitude = event.latLng.lat();
      // const longitude = event.latLng.lng();
      // console.log('in googlemaps clicked latitude: ', latitude);
      // console.log('in googlemaps clicked longitude: ', longitude);

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
    searchFlatParams: state.flats.searchFlatParameters
  };
}


export default connect(mapStateToProps, actions)(GoogleMap);
